/**
 * @description Roles de usuario permitidos en FlockApp.
 */
export enum UserRole {
  PAJARERO = 'PAJARERO',
  PROVEEDOR = 'PROVEEDOR',
  BOTH = 'BOTH',
}

/**
 * @description Modos de vista disponibles para la navegación.
 */
export type ViewMode = 'PAJARERO' | 'PROVEEDOR' | null;

/**
 * @interface User
 * @description Estructura maestra del usuario.
 * Incluye campos de identidad, territoriales, sociales y de negocio.
 */
export interface User {
  /** Identificador único (UUID) */
  id: number | string;
  /** Correo electrónico institucional o personal */
  email: string;
  /** Nombre(s) del usuario */
  firstName: string;
  /** Apellido(s) del usuario */
  lastName: string;
  /** Nombre de usuario único en la comunidad */
  username: string;
  /** Rol asignado que define los permisos */
  role: UserRole;

  // --- CAMPOS MULTIMEDIA ---
  /** URL de la imagen de perfil */
  avatarUrl?: string;
  /** URL de la imagen de portada */
  coverUrl?: string;

  // --- CAMPOS TERRITORIALES Y SOCIALES ---
  /** Departamento de ubicación */
  department?: string;
  /** Municipio de ubicación */
  municipality?: string;
  /** Nombre de usuario en Instagram */
  instagram?: string;
  /** Breve descripción biográfica */
  bio?: string;

  // --- CAMPOS DE NEGOCIO (PROVEEDORES) ---
  /** Nombre del negocio */
  businessName?: string;
  /** Registro Nacional de Turismo */
  rnt?: string;

  /** Password (solo para flujos de registro) */
  password?: string;
  /** Fecha de creación del registro */
  createdAt?: Date;
  /** Estadísticas de actividad del usuario (optional, injected by UserService) */
  stats?: UserStats;
  /** Listado de medallas y logros ganados/bloqueados */
  medals?: UserMedalDto[];
}

/**
 * @interface AuthResponse
 * @description Respuesta del servidor tras un proceso de autenticación exitoso.
 */
export interface AuthResponse {
  /** Token JWT para el encabezado Authorization */
  access_token: string;
  /** Datos del usuario autenticado */
  user: User;
}

/**
 * @interface UserStats
 * @description Datos estadísticos para el mini-dashboard de perfil.
 */
export interface UserStats {
  /**
   *
   */
  speciesCount: number;
  /**
   *
   */
  sightingsCount: number;
  /**
   *
   */
  medalsCount: number;
  /**
   *
   */
  daysInApp: number;
  /**
   *
   */
  natureTimeMinutes: number;
}

/**
 * @interface AuthError
 * @description Manejo de errores tipados de NestJS.
 */
export interface AuthError {
  /**
   *
   */
  error?: {
    /**
     *
     */
    message?: string | string[];
    /**
     *
     */
    error?: string;
    /**
     *
     */
    statusCode?: number;
  };
  /**
   *
   */
  status?: number;
  /**
   *
   */
  message?: string;
}
/**
 * @interface UserMedalDto
 * @description Medalla o logro ganado por el usuario dentro de la app.
 * Campos alineados con el template user-medals.component.html y el contrato del backend.
 */
export interface UserMedalDto {
  /** Identificador único de la medalla */
  id: number;
  /** Nombre visible de la medalla */
  name: string;
  /** Descripción del logro (puede contener el valor numérico para calcular el tier) */
  description?: string;
  /** Icono o emoji representativo (corto) */
  icon?: string;
  /** URL de imagen personalizada de la medalla */
  iconUrl?: string;
  /** Si la medalla ya fue desbloqueada por el usuario */
  earned: boolean;
  /** Fecha en que fue ganada (formato ISO string desde backend) */
  awarded_at?: string;
}
