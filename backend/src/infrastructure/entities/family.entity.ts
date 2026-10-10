/**
 * @sdd
 * @description [AUTO-GENERATED] Reflejo estricto de la tabla 'families' desde SQLite (Frontend) a TypeORM (Backend).
 * @io Garantiza Asimetría Cero en el flujo Offline-First.
 */
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('families')
export class FamilyEntity {
  @ApiProperty({ description: 'Columna autogenerada: id' })
  @PrimaryColumn({ type: 'int' })
  id: number;

  @ApiProperty({ description: 'Columna autogenerada: description' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Columna autogenerada: order_id' })
  @Column({ type: 'int' })
  order_id: number;

  @ApiProperty({ description: 'Columna autogenerada: total_birds' })
  @Column({ type: 'int', nullable: true })
  total_birds: number;

  @ApiProperty({ description: 'Columna autogenerada: bird_types' })
  @Column({ type: 'text', nullable: true })
  bird_types: string;

  @ApiProperty({ description: 'Columna autogenerada: last_modified' })
  @Column({ type: 'int', nullable: true })
  last_modified: number;

  @ApiProperty({ description: 'Columna autogenerada: sql_deleted' })
  @Column({ type: 'boolean', nullable: true })
  sql_deleted: boolean;
}
