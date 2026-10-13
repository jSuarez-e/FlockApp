import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express'; // R5: Importación explícita de Request

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ActiveUserInterface } from 'src/application/interfaces/active-user.interface';
import { UsersService } from '../../application/services/users.service';

/**
 * @class UploadsController
 * @description Controlador especializado en la gestión y segmentación de recursos multimedia.
 * Resuelve errores de tipado TS2538 mediante casting explícito de parámetros de ruta.
 * @author Gemini (Orquestador SDD)
 */
@Controller('v1/uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @method uploadFile
   * @description Procesa la carga de imágenes y las clasifica en directorios según su propósito.
   * @param {string} type - Clasificador: 'avatar', 'cover', 'provider-cover', 'birds'.
   * @param {Express.Multer.File} file - Binario procesado por Multer.
   * @param {ActiveUserInterface} user - Identidad del usuario autenticado extraída del JWT.
   * @returns {Promise<{ url: string, message: string }>} Objeto con la ruta relativa persistida.
   */
  @Post(':type')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb) => {
          // FIX TS2538: Casting explícito a string para asegurar el índice del objeto (R5)
          const type = req.params['type'] as string;

          /** * Mapeo de segmentación de carpetas (R2).
           * Organiza el almacenamiento para evitar colisiones y facilitar backups.
           */
          const folderMap: Record<string, string> = {
            avatar: './uploads/avatars',
            cover: './uploads/covers-user',
            'provider-avatar': './uploads/avatars-provider',
            'provider-cover': './uploads/covers-provider',
            birds: './uploads/birds',
          };

          const targetPath = folderMap[type] || './uploads/others';

          // Creación recursiva de directorios si no existen (R2)
          if (!existsSync(targetPath)) {
            mkdirSync(targetPath, { recursive: true });
          }
          cb(null, targetPath);
        },
        filename: (req, file, cb) => {
          // R2: Uso de UUID para garantizar unicidad y evitar sobreescritura
          const fileName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        const allowedExts = /\.(jpg|jpeg|png|webp)$/i;

        if (
          !allowedMimes.includes(file.mimetype) ||
          !file.originalname.match(allowedExts)
        ) {
          return cb(
            new BadRequestException(
              'Solo se permiten imágenes válidas en formato JPG, JPEG, PNG o WEBP',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // Límite de seguridad: 5MB
    }),
  )
  async uploadFile(
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: ActiveUserInterface,
  ) {
    /**
     * R10: Validación de existencia del archivo procesado.
     * Si Multer falla o el filtro bloquea el archivo, 'file' será undefined.
     */
    if (!file) {
      throw new BadRequestException(
        'Archivo no proporcionado o formato inválido',
      );
    }

    /**
     * Normalización de la ruta para almacenamiento en DB (R1).
     * Reemplaza separadores de sistema operativo por estándar web.
     */
    const normalizedPath = file.path.replace(/\\/g, '/').replace('./', '/');
    const fileUrl = normalizedPath.startsWith('/')
      ? normalizedPath
      : `/${normalizedPath}`;

    /**
     * Persistencia condicional en el perfil de usuario.
     * Mapea el parámetro de ruta al campo correspondiente en la base de datos.
     */
    const updatePayload: Partial<{ avatarUrl: string; coverUrl: string }> =
      type === 'avatar'
        ? { avatarUrl: fileUrl }
        : type === 'cover'
          ? { coverUrl: fileUrl }
          : {};

    if (Object.keys(updatePayload).length > 0) {
      await this.usersService.updateProfile(user.id, updatePayload);
    }

    return {
      message: 'Recurso multimedia sincronizado',
      url: fileUrl,
    };
  }
}
