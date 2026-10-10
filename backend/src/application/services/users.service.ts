import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt'; // R2: Manejo de hashes estándar
import { UserEntity } from '../../infrastructure/entities/user.entity';
import { RouteEntity } from '../../infrastructure/entities/route.entity';
import { UpdateUserDto } from '../../infrastructure/dtos/update-user.dto';
import { ChangePasswordDto } from '../../infrastructure/dtos/change-password.dto';
import { MedalsService } from './medals.service';

/**
 * @class UsersService
 * @description Gestión de perfiles y seguridad de identidad FlockApp.
 * @author Gemini (Orquestador SDD)
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
    private readonly medalsService: MedalsService,
  ) {}

  /** @method findOne - Obtiene perfil por ID */
  async findOne(id: string): Promise<UserEntity> {
    if (!id) throw new BadRequestException('ID no proporcionado');

    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'username',
        'role',
        'businessName',
        'rnt',
        'avatarUrl',
        'coverUrl',
        'department',
        'municipality',
        'instagram',
        'bio',
      ],
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.stats = await this.getUserStats(id);
    user.medals = await this.medalsService.getUserMedalsWithStatus(id);
    return user;
  }

  /** @method getUserStats - Obtiene conteo de aves y especies vistas */
  private async getUserStats(userId: string) {
    interface RouteStatsResult {
      speciesCount: string | null;
      sightingsCount: string | null;
    }
    const routeRepo = this.dataSource.getRepository(RouteEntity);
    const result = (await routeRepo
      .createQueryBuilder('r')
      .leftJoin('r.sightings', 's')
      .where('r.user_id = :userId AND r.end_time IS NOT NULL', { userId })
      .select('COUNT(DISTINCT s.bird_id)', 'speciesCount')
      .addSelect('COALESCE(SUM(s.quantity), 0)', 'sightingsCount')
      .getRawOne()) as unknown as RouteStatsResult | undefined;

    const species = parseInt(result?.speciesCount ?? '0', 10);
    const sightings = parseInt(result?.sightingsCount ?? '0', 10);

    // Obtener días en app (diferencia entre hoy y created_at del usuario)
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['createdAt'],
    });
    const msInDay = 1000 * 60 * 60 * 24;
    const daysInApp = user
      ? Math.floor((Date.now() - user.createdAt.getTime()) / msInDay)
      : 0;

    const statsObj = {
      speciesCount: species,
      sightingsCount: sightings,
      daysInApp: daysInApp,
    };

    // Evaluar y otorgar medallas en BD (background o síncrono)
    await this.medalsService.evaluateUserMedals(userId, statsObj);

    // Las medallas ya ganadas podemos contarlas
    const earnedMedals =
      await this.medalsService.getUserMedalsWithStatus(userId);
    const earnedCount = earnedMedals.filter((m) => m.earned).length;

    return {
      speciesCount: species,
      sightingsCount: sightings,
      medalsCount: earnedCount,
      daysInApp: daysInApp,
      natureTimeMinutes: 0,
    };
  }

  /** @method updateProfile - Actualización parcial de metadatos */
  async updateProfile(
    id: string,
    updateData: UpdateUserDto,
  ): Promise<UserEntity> {
    if (!id) throw new BadRequestException('ID inválido');

    const cleanData: Partial<UpdateUserDto> = {
      ...(updateData.firstName && { firstName: updateData.firstName }),
      ...(updateData.lastName && { lastName: updateData.lastName }),
      ...(updateData.username && { username: updateData.username }),
      ...(updateData.department && { department: updateData.department }),
      ...(updateData.municipality && { municipality: updateData.municipality }),
      ...(updateData.instagram && { instagram: updateData.instagram }),
      ...(updateData.bio && { bio: updateData.bio }),
      ...(updateData.avatarUrl !== undefined && {
        avatarUrl: updateData.avatarUrl,
      }),
      ...(updateData.coverUrl !== undefined && {
        coverUrl: updateData.coverUrl,
      }),
    };

    if (Object.keys(cleanData).length > 0) {
      await this.userRepository.update(id, cleanData);
    }
    return this.findOne(id);
  }

  /**
   * @method changePassword
   * @description Realiza el cambio de credenciales con validación de hash previo.
   * R2: Implementa comparación segura antes de permitir el cambio.
   * @param {string} id - UUID del usuario logueado.
   * @param {ChangePasswordDto} dto - Datos de contraseñas.
   */
  async changePassword(
    id: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    // 1. Buscamos al usuario incluyendo el campo password (que suele estar oculto)
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'password'],
    });

    if (!user) throw new NotFoundException('Usuario no identificado');

    // 2. Validar contraseña antigua
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // 3. Hashear nueva contraseña y guardar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.newPassword, salt);

    await this.userRepository.update(id, { password: hashedPassword });

    return { message: 'Contraseña actualizada con éxito' };
  }
}
