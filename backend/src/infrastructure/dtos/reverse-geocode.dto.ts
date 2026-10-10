/**
 * @sdd
 * [Objetivo]: DTO para validación estricta de parámetros query en geocodificación inversa.
 * [I/O]: Recibe lat y lng como strings en query y los transforma a número validando rangos geoespaciales.
 * [Edge Cases]: Rechaza coordenadas fuera del rango [-90, 90] para latitud y [-180, 180] para longitud.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber } from 'class-validator';

export class ReverseGeocodeQueryDto {
  @ApiProperty({
    description: 'Latitud geográfica decimal en formato WGS84',
    example: 4.711,
  })
  @IsNotEmpty({ message: 'La latitud es requerida' })
  @Type(() => Number)
  @IsNumber({}, { message: 'La latitud debe ser un valor numérico' })
  @IsLatitude({ message: 'La latitud debe estar entre -90 y 90' })
  lat: number;

  @ApiProperty({
    description: 'Longitud geográfica decimal en formato WGS84',
    example: -74.0721,
  })
  @IsNotEmpty({ message: 'La longitud es requerida' })
  @Type(() => Number)
  @IsNumber({}, { message: 'La longitud debe ser un valor numérico' })
  @IsLongitude({ message: 'La longitud debe estar entre -180 y 180' })
  lng: number;
}
