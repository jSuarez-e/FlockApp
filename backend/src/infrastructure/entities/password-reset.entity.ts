import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * @class PasswordResetEntity
 * @description Entidad para gestionar el ciclo de vida de la recuperación de cuentas en FlockApp.
 * Esta clase actúa como un almacén de seguridad efímero que valida el código OTP (Fase 2)
 * y emite/valida un token de recuperación firmado (Fase 3).
 */
@Entity('password_resets')
export class PasswordResetEntity {
  /**
   * @property id
   * @description Identificador único incremental de la solicitud.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * @property email
   * @description Correo electrónico asociado a la solicitud.
   * @Index(): Optimiza la búsqueda de registros activos por usuario.
   */
  @Column()
  @Index()
  email: string;

  /**
   * @property otp
   * @description Código numérico de 6 dígitos enviado al usuario por correo.
   * Es la llave de validación para la Fase 2 del Frontend.
   * @example "123456"
   */
  @Column()
  otp: string;

  /**
   * @property recoveryToken
   * @description Cadena criptográfica generada tras validar el OTP con éxito.
   * Sirve como credencial temporal para autorizar el cambio final de contraseña.
   * @Index(): Garantiza validación rápida durante el reseteo final.
   */
  @Column({ nullable: true })
  @Index()
  recoveryToken: string;

  /**
   * @property expiresAt
   * @description Fecha y hora en la que la solicitud completa (OTP y Token) queda invalidada.
   * Por estándar de seguridad, se recomienda una vigencia de 15 a 30 minutos para OTP.
   */
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  /**
   * @property isUsed
   * @description Marca de consumo del proceso.
   * Previene ataques de reutilización tras un cambio de clave exitoso.
   * @default false
   */
  @Column({ default: false })
  isUsed: boolean;

  /**
   * @property createdAt
   * @description Registro automático del momento en que se generó la solicitud.
   */
  @CreateDateColumn()
  createdAt: Date;
}
