import { IsString, MinLength, Matches } from 'class-validator';

/**
 * @class ChangePasswordDto
 * @description Contrato para la actualización segura de credenciales.
 */
export class ChangePasswordDto {
  /** @description Contraseña actual para validar identidad */
  @IsString()
  oldPassword!: string;

  /** * @description Nueva contraseña con validación de complejidad (R2)
   * Mínimo 8 caracteres, una mayúscula y un número.
   */
  @IsString()
  @MinLength(8, {
    message: 'La nueva contraseña debe tener al menos 8 caracteres',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña es demasiado débil (Debe incluir mayúscula y número)',
  })
  newPassword!: string;
}
