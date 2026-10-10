/**
 * @sdd
 * [Objetivo]: DTO para transicionar el estado de una solicitud de reserva de Guia.
 * [I/O]: Implementa IUpdateBookingStatusDto.
 * [Edge Cases]: Estados validos: PENDING, CONFIRMED, REJECTED, COMPLETED, CANCELLED.
 */
import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  BookingStatus,
  IUpdateBookingStatusDto,
} from '../../../../../shared/models/guide-booking.interface';

export class UpdateBookingStatusDto implements IUpdateBookingStatusDto {
  @ApiProperty({
    description: 'Nuevo estado de la reserva',
    enum: ['PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
    example: 'CONFIRMED',
  })
  @IsIn(['PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED', 'CANCELLED'])
  status: BookingStatus;
}
