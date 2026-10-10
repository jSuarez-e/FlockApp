/**
 * @sdd
 * - [Objetivo]: Módulo para gestión de Rutas (GPS Tracking).
 * - [I/O]: Exporta RoutesService e importa TypeORM de RouteEntity.
 * - [Edge Cases]: Ninguno.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesController } from '../controllers/routes.controller';
import { RoutesService } from '../../application/services/routes.service';
import { RouteEntity } from '../entities/route.entity';
import { RouteSightingEntity } from '../entities/route-sighting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RouteEntity, RouteSightingEntity])],
  controllers: [RoutesController],
  providers: [RoutesService],
  exports: [RoutesService],
})
export class RoutesModule {}
