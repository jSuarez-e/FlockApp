/**
 * @sdd
 * [Objetivo]: DTO tipado para la solicitud inicial de recuperación de cuenta (Fase 1 OTP).
 * [I/O]: Payload { email: string }.
 * [Edge Cases]: Validación estricta de sintaxis de correo electrónico para prevenir inyecciones.
 */
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Correo electrónico registrado del usuario solicitante',
    example: 'usuario@flockapp.co',
  })
  @IsNotEmpty({ message: 'El correo electrónico es requerido.' })
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido.' })
  email: string;
}
