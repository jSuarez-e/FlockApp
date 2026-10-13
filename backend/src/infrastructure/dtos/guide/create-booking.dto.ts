/**
 * @sdd
 * [Objetivo]: DTO para validacion de solicitud de contacto y reserva hacia un Guia.
 * [I/O]: Implementa ICreateBookingDto.
 * [Edge Cases]: Fecha en formato YYYY-MM-DD. Telefono no vacio.
 */
import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICreateBookingDto } from '../../../../../shared/models/guide-booking.interface';

export class CreateBookingDto implements ICreateBookingDto {
  @ApiProperty({
    description: 'Fecha de la actividad (YYYY-MM-DD)',
    example: '2026-10-15',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'bookingDate debe tener el formato YYYY-MM-DD',
  })
  bookingDate: string;

  @ApiProperty({
    description: 'Fecha final si es un rango de días (YYYY-MM-DD)',
    example: '2026-10-18',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'endDate debe tener el formato YYYY-MM-DD',
  })
  endDate?: string;

  @ApiProperty({
    description: 'Tipo de actividad',
    example: 'Aviturismo Especializado',
  })
  @IsString()
  @IsNotEmpty()
  activityType: string;

  @ApiProperty({
    description: 'Mensaje descriptivo con expectativas o requerimientos',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ description: 'Telefono de contacto del solicitante' })
  @IsString()
  @IsNotEmpty()
  contactPhone: string;

  @ApiProperty({
    description: 'Correo de contacto alternativo',
    required: false,
  })
  @IsOptional()
  @IsString()
  contactEmail?: string;
}
