/**
 * @sdd
 * - [Objetivo]: DTO para creación y validación de productos y servicios asociados a un Sitio de Aviturismo.
 * - [I/O]: Implementa ICreateSiteServiceDto.
 * - [Edge Cases]: El precio no puede ser negativo, tipo restringido a enum.
 */
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICreateSiteServiceDto } from '../../../../../shared/models/site-profile.interface';

/**
 * DTO para registrar un producto o servicio del sitio.
 */
export class CreateSiteServiceDto implements ICreateSiteServiceDto {
  @ApiProperty({
    description: 'Tipo: service | product | other',
    enum: ['service', 'product', 'other'],
  })
  @IsIn(['service', 'product', 'other'])
  type: 'service' | 'product' | 'other';

  @ApiProperty({ description: 'Nombre descriptivo del producto o servicio' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descripción detallada', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Precio en COP', minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Foto opcional', required: false })
  @IsOptional()
  @IsString()
  photo_url?: string;
}
