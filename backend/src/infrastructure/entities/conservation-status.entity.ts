/**
 * @sdd
 * @description [AUTO-GENERATED] Reflejo estricto de la tabla 'conservation_statuses' desde SQLite (Frontend) a TypeORM (Backend).
 * @io Garantiza Asimetría Cero en el flujo Offline-First.
 */
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('conservation_statuses')
export class ConservationStatusEntity {
  @ApiProperty({ description: 'Columna autogenerada: id' })
  @PrimaryColumn({ type: 'int' })
  id: number;

  @ApiProperty({ description: 'Columna autogenerada: description' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Columna autogenerada: english_description' })
  @Column({ type: 'text' })
  english_description: string;

  @ApiProperty({ description: 'Columna autogenerada: convention' })
  @Column({ type: 'text' })
  convention: string;

  @ApiProperty({ description: 'Columna autogenerada: image_url' })
  @Column({ type: 'text' })
  image_url: string;

  @ApiProperty({ description: 'Columna autogenerada: last_modified' })
  @Column({ type: 'int', nullable: true })
  last_modified: number;

  @ApiProperty({ description: 'Columna autogenerada: sql_deleted' })
  @Column({ type: 'boolean', nullable: true })
  sql_deleted: boolean;
}
