/**
 * @sdd
 * @description [AUTO-GENERATED] Reflejo estricto de la tabla 'bird_departments' desde SQLite (Frontend) a TypeORM (Backend).
 * @io Garantiza Asimetría Cero en el flujo Offline-First.
 */
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('bird_departments')
export class BirdDepartmentEntity {
  @ApiProperty({ description: 'Columna autogenerada: id' })
  @PrimaryColumn({ type: 'int' })
  id: number;

  @ApiProperty({ description: 'Columna autogenerada: bird_id' })
  @Column({ type: 'int' })
  bird_id: number;

  @ApiProperty({ description: 'Columna autogenerada: department_id' })
  @Column({ type: 'int' })
  department_id: number;

  @ApiProperty({ description: 'Columna autogenerada: last_modified' })
  @Column({ type: 'int', nullable: true })
  last_modified: number;

  @ApiProperty({ description: 'Columna autogenerada: sql_deleted' })
  @Column({ type: 'boolean', nullable: true })
  sql_deleted: boolean;
}
