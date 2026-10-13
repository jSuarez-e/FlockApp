/**
 * @sdd
 * [Objetivo]: DTO tipado para la fase final de restablecimiento de contraseña con token (Fase 3).
 * [I/O]: Payload { email: string, password: string, recoveryToken: string }.
 * [Edge Cases]: Validación estricta de complejidad de contraseña y token de recuperación.
 */
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Correo electrónico registrado del usuario',
    example: 'usuario@flockapp.co',
  })
  @IsNotEmpty({ message: 'El correo electrónico es requerido.' })
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido.' })
  email: string;

  @ApiProperty({
    description: 'Nueva contraseña segura',
    example: 'NuevaClaveSegura2026!',
  })
  @IsNotEmpty({ message: 'La nueva contraseña es requerida.' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password: string;

  @ApiProperty({
    description: 'Token efímero de autorización firmado por JWT en la Fase 2',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty({ message: 'El token de recuperación es requerido.' })
  @IsString({ message: 'El token de recuperación debe ser un string válido.' })
  recoveryToken: string;
}
