/**
 * @sdd
 * [Objetivo]: Entidad TypeORM para gestionar las solicitudes de contacto, reservas y calificaciones de Guías.
 * [I/O]: Mapea la tabla 'guide_bookings' en PostgreSQL.
 * [Edge Cases]: Estados restringidos: PENDING, CONFIRMED, REJECTED, COMPLETED, CANCELLED. Calificacion solo 1-5.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../../../../shared/models/guide-booking.interface';

@Entity('guide_bookings')
export class GuideBookingEntity {
  @ApiProperty({ description: 'ID unico de la reserva' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID del guia' })
  @Column({ type: 'varchar', length: 255 })
  guide_id: string;

  @ApiProperty({ description: 'ID del usuario pajarero solicitante' })
  @Column({ type: 'uuid' })
  birder_id: string;

  @ApiProperty({ description: 'Fecha agendada (YYYY-MM-DD)' })
  @Column({ type: 'date' })
  booking_date: string;

  @ApiProperty({ description: 'Tipo de actividad' })
  @Column({ type: 'varchar', length: 100, default: 'Aviturismo General' })
  activity_type: string;

  @ApiProperty({ description: 'Mensaje o requerimientos del pajarero' })
  @Column({ type: 'text', nullable: true })
  message: string;

  @ApiProperty({ description: 'Telefono de contacto' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  contact_phone: string;

  @ApiProperty({ description: 'Correo de contacto' })
  @Column({ type: 'varchar', length: 150, nullable: true })
  contact_email: string;

  @ApiProperty({ description: 'Estado de la solicitud' })
  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: BookingStatus;

  @ApiProperty({
    description: 'Calificacion del servicio (1 a 5)',
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  rating: number;

  @ApiProperty({
    description: 'Reseña o comentario del servicio',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  review: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
