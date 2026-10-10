/**
 * @sdd
 * @description [AUTO-GENERATED] Reflejo estricto de la tabla 'municipalities' desde SQLite (Frontend) a TypeORM (Backend).
 * @io Garantiza Asimetría Cero en el flujo Offline-First.
 */
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('municipalities')
export class MunicipalityEntity {
  @ApiProperty({ description: 'Columna autogenerada: id' })
  @PrimaryColumn({ type: 'int' })
  id: number;

  @ApiProperty({ description: 'Columna autogenerada: name' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ description: 'Columna autogenerada: department_id' })
  @Column({ name: 'departmentId', type: 'int', nullable: true })
  department_id: number;

  @ApiProperty({ description: 'Columna autogenerada: status' })
  @Column({ type: 'int', nullable: true })
  status: number;

  @ApiProperty({ description: 'Columna autogenerada: last_modified' })
  @Column({ type: 'timestamp', nullable: true })
  last_modified: Date;

  @ApiProperty({ description: 'Columna autogenerada: sql_deleted' })
  @Column({ type: 'boolean', nullable: true })
  sql_deleted: boolean;
}
