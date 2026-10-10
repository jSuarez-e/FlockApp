/**
 * @sdd
 * @description [AUTO-GENERATED] Reflejo estricto de la tabla 'routes' desde SQLite (Frontend) a TypeORM (Backend).
 * @io Garantiza Asimetría Cero en el flujo Offline-First.
 */
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RouteSightingEntity } from './route-sighting.entity';

@Entity('routes')
export class RouteEntity {
  @ApiProperty({ description: 'Columna autogenerada: id' })
  @PrimaryColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Columna autogenerada: start_time' })
  @Column({ type: 'timestamp' })
  start_time: Date;

  @ApiProperty({ description: 'Columna autogenerada: end_time' })
  @Column({ type: 'timestamp', nullable: true })
  end_time: Date;

  @ApiProperty({ description: 'Columna autogenerada: route_type' })
  @Column({ type: 'text', nullable: true })
  route_type: string;

  @ApiProperty({ description: 'Columna autogenerada: total_km' })
  @Column({ type: 'float', nullable: true })
  total_km: number;

  @ApiProperty({ description: 'Columna autogenerada: duration_mins' })
  @Column({ type: 'int', nullable: true })
  duration_mins: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'LineString',
    srid: 4326,
    nullable: true,
  })
  path: unknown;

  @ApiProperty({ description: 'Nombre de la ruta' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @ApiProperty({ description: 'Comentarios adicionales' })
  @Column({ type: 'text', nullable: true })
  comments: string;

  @ApiProperty({ description: 'ID de departamento' })
  @Column({ type: 'int', nullable: true })
  department_id: number;

  @ApiProperty({ description: 'ID de municipio' })
  @Column({ type: 'int', nullable: true })
  municipality_id: number;

  @ApiProperty({ description: 'Columna autogenerada: sync_status' })
  @Column({ type: 'varchar', nullable: true })
  sync_status: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  last_modified: Date;

  @OneToMany(() => RouteSightingEntity, (sighting) => sighting.route)
  sightings: RouteSightingEntity[];
}
