/**
 * @sdd
 * - [Objetivo]: DTO para validación estricta de la actualización del perfil de Sitio de Aviturismo (Modo Proveedor).
 * - [I/O]: Implementa IUpdateSiteProfileDto.
 * - [Edge Cases]: Sanitización de cadenas, campos opcionales no nulos.
 */
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUpdateSiteProfileDto } from '../../../../../shared/models/site-profile.interface';

/**
 * DTO para actualizar los datos comerciales y de contacto del Sitio de Aviturismo.
 */
export class UpdateSiteProfileDto implements IUpdateSiteProfileDto {
  @ApiProperty({ description: 'Nombre del sitio o reserva natural' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Departamento', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ description: 'Municipio', required: false })
  @IsOptional()
  @IsString()
  municipality?: string;

  @ApiProperty({ description: 'Descripción detallada', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'URL de portada del negocio', required: false })
  @IsOptional()
  @IsString()
  cover_url?: string;

  @ApiProperty({ description: 'URL del logo del negocio', required: false })
  @IsOptional()
  @IsString()
  logo_url?: string;

  @ApiProperty({ description: 'Teléfono de contacto', required: false })
  @IsOptional()
  @IsString()
  contact_phone?: string;

  @ApiProperty({ description: 'Número de WhatsApp', required: false })
  @IsOptional()
  @IsString()
  contact_whatsapp?: string;

  @ApiProperty({ description: 'Página web oficial', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ description: 'Cuenta de Instagram', required: false })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({ description: 'Página de Facebook', required: false })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiProperty({
    description: 'Indica si el sitio maneja checklist de aves',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  has_bird_checklist?: boolean;

  @ApiProperty({
    description: 'Latitud GPS en grados decimales',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    description: 'Longitud GPS en grados decimales',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
