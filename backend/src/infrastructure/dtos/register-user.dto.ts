import {
  IsEmail,
  IsString,
  IsEnum,
  MinLength,
  ValidateIf,
  Matches,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

/**
 * DTO (Data Transfer Object) para el registro de nuevos usuarios.
 * * Gestiona la validación de los datos de entrada para la creación de cuentas,
 * incluyendo lógica condicional para usuarios con perfiles de proveedor.
 */
export class RegisterUserDto {
  /**
   * Dirección de correo electrónico única para el usuario.
   * @example "contacto@flockapp.co"
   */
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  /**
   * Contraseña de acceso.
   * Se requiere una longitud mínima de 8 caracteres para cumplir con estándares básicos de seguridad.
   * @example "P@ssw0rd2026"
   */
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña es demasiado débil (Debe incluir mayúscula y número)',
  })
  password: string;

  /**
   * Nombre(s) del usuario.
   */
  @IsString({ message: 'El nombre es obligatorio' })
  firstName: string;

  /**
   * Apellido(s) del usuario.
   */
  @IsString({ message: 'El apellido es obligatorio' })
  lastName: string;

  /**
   * Nombre de usuario único (handle) para la plataforma.
   * @example "pajarero_colombia"
   */
  @IsString({ message: 'El nombre de usuario es obligatorio' })
  username: string;

  /**
   * Rol asignado al usuario.
   * Determina las funcionalidades accesibles y los requerimientos de validación adicionales.
   */
  @IsEnum(UserRole, { message: 'El rol seleccionado no es válido' })
  role: UserRole;

  /**
   * Nombre comercial del negocio.
   * Requerido únicamente si el rol es PROVEEDOR o BOTH.
   * @ValidateIf Evalúa si el rol implica actividades comerciales.
   */
  @ValidateIf(
    (o: RegisterUserDto) =>
      o.role === UserRole.PROVEEDOR || o.role === UserRole.BOTH,
  )
  @IsString({
    message: 'El nombre del negocio es obligatorio para proveedores',
  })
  businessName: string;

  /**
   * Registro Nacional de Turismo (RNT).
   * Obligatorio para dar cumplimiento legal a los servicios de guianza y hospedaje.
   * Requerido únicamente si el rol es PROVEEDOR o BOTH.
   */
  @ValidateIf(
    (o: RegisterUserDto) =>
      o.role === UserRole.PROVEEDOR || o.role === UserRole.BOTH,
  )
  @IsString({ message: 'El RNT es obligatorio para proveedores' })
  rnt: string;
}
