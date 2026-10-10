import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTO (Data Transfer Object) para el inicio de sesión.
 * * Define y valida la estructura de datos necesaria para autenticar a un usuario.
 * Utiliza decoradores de 'class-validator' para asegurar que los datos de entrada
 * cumplan con los requisitos mínimos de seguridad y formato.
 */
export class LoginDto {
  /**
   * Dirección de correo electrónico del usuario.
   * Debe tener un formato de email válido (ej: usuario@dominio.com).
   * @example "usuario@flockapp.co"
   */
  @IsNotEmpty({ message: 'El usuario o correo es requerido.' })
  @IsString({
    message: 'El identificador debe ser una cadena de texto válida.',
  })
  identifier: string;

  /**
   * Contraseña asociada a la cuenta.
   * Se requiere que no esté vacía. La validación de complejidad se delega
   * al proceso de registro, aquí solo verificamos presencia para el intento de match.
   * @example "Contrasena123!"
   */
  @IsString()
  @MinLength(1, { message: 'La contraseña es obligatoria' })
  password: string;
}
