/**
 * @sdd
 * [Objetivo]: Entidad TypeORM para gestionar la disponibilidad y fechas bloqueadas de los Guias.
 * [I/O]: Mapea la tabla 'guide_availability' en PostgreSQL.
 * [Edge Cases]: Restriccion unica sobre (guide_id, date) para evitar duplicados.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('guide_availability')
@Unique(['guide_id', 'date'])
export class GuideAvailabilityEntity {
  @ApiProperty({ description: 'ID unico del registro de disponibilidad' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID del guia (UUID o string)' })
  @Column({ type: 'varchar', length: 255 })
  guide_id: string;

  @ApiProperty({ description: 'Fecha bloqueada en formato YYYY-MM-DD' })
  @Column({ type: 'date' })
  date: string;

  @ApiProperty({
    description: 'Motivo del bloqueo o descanso',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  reason: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
