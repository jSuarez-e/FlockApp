/**
 * @sdd
 * - [Objetivo]: Módulo para agrupar las dependencias del Feed Global y Registro de Especies.
 * - [I/O]: Inyecta TypeOrmModule para FeedPostEntity. Exporta FeedService.
 * - [Edge Cases]: Prevención de dependencias circulares manteniéndolo autocontenido.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedPostEntity } from '../entities/feed-post.entity';
import { FeedReplyEntity } from '../entities/feed-reply.entity';
import { FeedFavoriteEntity } from '../entities/feed-favorite.entity';
import {
  FeedController,
  UsersFeedController,
  BirdsFeedController,
} from '../controllers/feed.controller';
import { FeedService } from '../../application/services/feed.service';
import { UsersModule } from './users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeedPostEntity,
      FeedReplyEntity,
      FeedFavoriteEntity,
    ]),
    UsersModule,
  ],
  controllers: [FeedController, UsersFeedController, BirdsFeedController],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
