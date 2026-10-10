/**
 * @sdd
 * [Objetivo]: DTO para bloquear o desbloquear fechas en el calendario del Guia.
 * [I/O]: Implementa ISetAvailabilityDto.
 * [Edge Cases]: Accion estrictamente BLOCK o UNBLOCK. Array de fechas no vacio.
 */
import {
  IsArray,
  IsIn,
  IsString,
  IsOptional,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ISetAvailabilityDto } from '../../../../../shared/models/guide-booking.interface';

export class SetAvailabilityDto implements ISetAvailabilityDto {
  @ApiProperty({
    description: 'Fechas a modificar (YYYY-MM-DD)',
    type: [String],
    example: ['2026-10-20'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  dates: string[];

  @ApiProperty({
    description: 'Accion a realizar',
    enum: ['BLOCK', 'UNBLOCK'],
    example: 'BLOCK',
  })
  @IsIn(['BLOCK', 'UNBLOCK'])
  action: 'BLOCK' | 'UNBLOCK';

  @ApiProperty({ description: 'Motivo del bloqueo de agenda', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
