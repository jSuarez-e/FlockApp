/**
 * @sdd
 * - [Objetivo]: Controlador REST para la funcionalidad de Feed Global y Bitácora de Aves.
 * - [I/O]: Recibe HTTP requests, extrae metadatos JSON de Multipart y expone documentación Swagger.
 * - [Edge Cases]: Uso de FileInterceptor para soportar cargas de imágenes.
 */
import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ActiveUserInterface } from '../../application/interfaces/active-user.interface';
import { UsersService } from '../../application/services/users.service';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FeedService } from '../../application/services/feed.service';
import { CreateFeedPostDto } from '../dtos/feed/create-feed-post.dto';

@ApiTags('Feed')
@Controller('v1/feed')
export class FeedController {
  constructor(
    private readonly feedService: FeedService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener el feed global paginado por cursor (ISO Timestamp)',
  })
  async getFeed(
    @Query('cursor') cursor?: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.feedService.getGlobalFeed(cursor, limit);
  }

  @Post('publish')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const targetPath = './uploads/feed';
          if (!existsSync(targetPath)) {
            mkdirSync(targetPath, { recursive: true });
          }
          cb(null, targetPath);
        },
        filename: (req, file, cb) => {
          const fileName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new BadRequestException('Solo JPG, JPEG y PNG'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Publicar un registro en el feed global con imagen adjunta',
  })
  async publish(
    // Express.Multer.File se resuelve por defecto en proyectos NestJS
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('metadata') metadataString: string,
    @CurrentUser() activeUser: ActiveUserInterface,
  ) {
    const metadata = JSON.parse(
      metadataString || '{}',
    ) as unknown as CreateFeedPostDto;

    let fileUrl: string | null = null;
    if (file) {
      const normalizedPath = file.path.replace(/\\/g, '/').replace('./', '/');
      fileUrl = normalizedPath.startsWith('/')
        ? normalizedPath
        : `/${normalizedPath}`;
    }

    // Resolución de identidad real
    const user = await this.usersService.findOne(activeUser.id);
    const authorName = `${user.firstName} ${user.lastName}`;

    return this.feedService.publishPost(
      metadata,
      fileUrl,
      user.id,
      authorName,
      user.avatarUrl,
    );
  }
  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Dar o quitar me gusta a una publicación del feed',
  })
  async toggleFavorite(
    @Param('id') postId: string,
    @CurrentUser() activeUser: ActiveUserInterface,
  ) {
    return this.feedService.toggleFavorite(postId, activeUser.id);
  }

  @Post(':id/reply')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Responder a una publicación del feed',
  })
  async addReply(
    @Param('id') postId: string,
    @Body('content') content: string,
    @CurrentUser() activeUser: ActiveUserInterface,
  ) {
    const user = await this.usersService.findOne(activeUser.id);
    const authorName = `${user.firstName} ${user.lastName}`;
    return this.feedService.addReply(
      postId,
      user.id,
      authorName,
      content,
      user.avatarUrl,
    );
  }

  @Get(':id/replies')
  @ApiOperation({
    summary: 'Obtener las respuestas de una publicación del feed',
  })
  async getReplies(@Param('id') postId: string) {
    return await this.feedService.getReplies(postId);
  }
}

@ApiTags('Users')
@Controller('v1/users')
export class UsersFeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('me/records')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Obtiene la lista agregada de especies vistas por el usuario (Lifer)',
  })
  async getMyRecords(@CurrentUser() activeUser: ActiveUserInterface) {
    return this.feedService.getMyRecords(activeUser.id);
  }
}

@ApiTags('Birds')
@Controller('v1/birds')
export class BirdsFeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get(':id/my-sightings')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Obtener puntos geográficos donde el usuario actual ha reportado esta especie',
  })
  async getMySightings(
    @Param('id') birdId: string,
    @CurrentUser() activeUser: ActiveUserInterface,
  ) {
    return this.feedService.getMySightingsByBird(birdId, activeUser.id);
  }
}
