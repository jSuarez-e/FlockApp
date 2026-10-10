/**
 * @sdd
 * @description [AUTO-GENERATED] Reflejo estricto de la tabla 'site_birds' desde SQLite (Frontend) a TypeORM (Backend).
 * @io Garantiza Asimetría Cero en el flujo Offline-First.
 */
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('site_birds')
export class SiteBirdEntity {
  @ApiProperty({ description: 'Columna autogenerada: site_id' })
  @PrimaryColumn({ type: 'text' })
  site_id: string;

  @ApiProperty({ description: 'Columna autogenerada: bird_id' })
  @PrimaryColumn({ type: 'int' })
  bird_id: number;

  @ApiProperty({ description: 'Columna autogenerada: last_modified' })
  @Column({ type: 'timestamp', nullable: true })
  last_modified: Date;

  @ApiProperty({ description: 'Columna autogenerada: sql_deleted' })
  @Column({ type: 'boolean', nullable: true })
  sql_deleted: boolean;
}
