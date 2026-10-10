/**
 * @sdd
 * @description [AUTO-GENERATED] Reflejo estricto de la tabla 'sightings' desde SQLite (Frontend) a TypeORM (Backend).
 * @io Garantiza Asimetría Cero en el flujo Offline-First.
 */
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sightings')
export class SightingEntity {
  @ApiProperty({ description: 'Columna autogenerada: id' })
  @PrimaryColumn({ type: 'int' })
  id: number;

  @ApiProperty({ description: 'Columna autogenerada: bird_image' })
  @Column({ type: 'text' })
  bird_image: string;

  @ApiProperty({ description: 'Columna autogenerada: user_id' })
  @Column({ type: 'int' })
  user_id: number;

  @ApiProperty({ description: 'Columna autogenerada: bird_id' })
  @Column({ type: 'int' })
  bird_id: number;

  @ApiProperty({ description: 'Columna autogenerada: latitude' })
  @Column({ type: 'float', nullable: true })
  latitude: number;

  @ApiProperty({ description: 'Columna autogenerada: longitude' })
  @Column({ type: 'float', nullable: true })
  longitude: number;

  @ApiProperty({ description: 'Columna autogenerada: last_modified' })
  @Column({ type: 'int', nullable: true })
  last_modified: number;

  @ApiProperty({ description: 'Columna autogenerada: sql_deleted' })
  @Column({ type: 'boolean', nullable: true })
  sql_deleted: boolean;
}
