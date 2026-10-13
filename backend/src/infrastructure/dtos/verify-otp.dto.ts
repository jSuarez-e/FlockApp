/**
 * @sdd
 * [Objetivo]: DTO tipado para la verificación del código OTP de 6 dígitos (Fase 2).
 * [I/O]: Payload { email: string, otp: string }.
 * [Edge Cases]: Validación estricta de longitud y caracteres numéricos para prevenir brute force o payloads arbitrarios.
 */
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Correo electrónico registrado del usuario solicitante',
    example: 'usuario@flockapp.co',
  })
  @IsNotEmpty({ message: 'El correo electrónico es requerido.' })
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido.' })
  email: string;

  @ApiProperty({
    description: 'Código de recuperación de 6 dígitos numéricos',
    example: '123456',
  })
  @IsNotEmpty({ message: 'El código OTP es requerido.' })
  @IsString({ message: 'El código OTP debe ser una cadena de texto.' })
  @Length(6, 6, { message: 'El código OTP debe tener exactamente 6 dígitos.' })
  @Matches(/^\d{6}$/, {
    message: 'El código OTP debe contener únicamente números.',
  })
  otp: string;
}
