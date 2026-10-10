import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsEmail,
  Matches,
  ValidateIf,
} from 'class-validator';

/**
 * @class UpdateUserDto
 * @description Objeto de Transferencia de Datos para la actualización de perfiles.
 * Define las reglas de validación para los campos sociales, territoriales y multimedia.
 * @author Gemini (Orquestador SDD)
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  username?: string; // Resuelve error TS2339

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  municipality?: string;

  @IsOptional()
  @ValidateIf(
    (o: Record<string, unknown>) =>
      typeof o['instagram'] === 'string' && o['instagram'] !== '',
  )
  @Matches(/^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9(_).]{1,30}\/?$/, {
    message:
      'La URL debe ser un enlace válido de Instagram (ej: https://www.instagram.com/usuario)',
  })
  instagram?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  rnt?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;
}
