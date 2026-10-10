/**
 * @sdd
 * @description [AUTO-GENERATED] Reflejo estricto de la tabla 'departments' desde SQLite (Frontend) a TypeORM (Backend).
 * @io Garantiza Asimetría Cero en el flujo Offline-First.
 */
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('departments')
export class DepartmentEntity {
  @ApiProperty({ description: 'Columna autogenerada: id' })
  @PrimaryColumn({ type: 'int' })
  id: number;

  @ApiProperty({ description: 'Columna autogenerada: name' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ description: 'Columna autogenerada: last_modified' })
  @Column({ type: 'timestamp', nullable: true })
  last_modified: Date;

  @ApiProperty({ description: 'Columna autogenerada: sql_deleted' })
  @Column({ type: 'boolean', nullable: true })
  sql_deleted: boolean;
}
