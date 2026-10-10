/**
 * @sdd
 * - [Objetivo]: DTO para validar la creación de posts en el feed de manera estricta.
 * - [I/O]: Usado por el FeedController para instanciar class-validator.
 * - [Edge Cases]: Coordenadas y birdId son campos opcionales dependiendo del contexto.
 */
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFeedPostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  birdId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  needsIdentification?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  routeId?: string;

  @ApiPropertyOptional({
    enum: ['PAJARERO', 'SITIO', 'GUIA'],
    default: 'PAJARERO',
  })
  @IsOptional()
  @IsString()
  authorType?: 'PAJARERO' | 'SITIO' | 'GUIA';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  targetProfileId?: string;
}
