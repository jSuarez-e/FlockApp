/**
 * Estructura del usuario extraído del Token JWT.
 * @description Define el contrato de identidad para el decorador @CurrentUser y servicios.
 */
export interface ActiveUserInterface {
  /** Identificador único del usuario (UUID) */
  id: string;
  /** Correo electrónico institucional */
  email: string;
  /** Rol de acceso (PAJARERO, PROVEEDOR, BOTH) */
  role: string;
}
