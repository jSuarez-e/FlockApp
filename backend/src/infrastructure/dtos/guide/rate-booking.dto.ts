/**
 * @sdd
 * [Objetivo]: DTO para calificar un servicio completado de un Guia.
 * [I/O]: Implementa IRateBookingDto.
 * [Edge Cases]: Calificacion estrictamente entre 1 y 5.
 */
import { IsInt, Min, Max, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IRateBookingDto } from '../../../../../shared/models/guide-booking.interface';

export class RateBookingDto implements IRateBookingDto {
  @ApiProperty({
    description: 'Calificacion del 1 al 5',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsInt()
  @Min(1, { message: 'La calificacion minima es 1 estrella' })
  @Max(5, { message: 'La calificacion maxima es 5 estrellas' })
  rating: number;

  @ApiProperty({
    description: 'Reseña o comentario cualitativo',
    required: false,
  })
  @IsOptional()
  @IsString()
  review?: string;
}
