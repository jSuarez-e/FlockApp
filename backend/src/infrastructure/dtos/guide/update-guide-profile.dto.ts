/**
 * @sdd
 * - [Objetivo]: DTO para validación estricta de la actualización del perfil de Guía.
 * - [I/O]: Implementa IUpdateGuideProfileDto.
 */
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUpdateGuideProfileDto } from '../../../../../shared/models/guide-profile.interface';

export class UpdateGuideProfileDto implements IUpdateGuideProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  municipality: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  details: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  coverUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  hasWhatsapp?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  languages?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rnt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  isPublished?: boolean;
}
