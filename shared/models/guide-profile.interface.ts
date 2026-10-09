/**
 * @sdd
 * - [Objetivo]: Contrato compartido para el Registro y Actualización del Perfil de Guía.
 * - [I/O]: Payload enviado desde el Frontend (Modo Proveedor) al Backend.
 * - [Edge Cases]: La calificación (rating) no se envía aquí, es calculada por el backend en base a reservas.
 */
export interface IUpdateGuideProfileDto {
  /** Nombre completo o comercial del guía */
  fullName: string;
  /** Departamento de ubicación */
  department: string;
  /** Municipio de ubicación */
  municipality: string;
  /** Especialidad del servicio */
  specialty: string;
  /** Detalles descriptivos o biografía */
  details: string;
  /** URL de la foto de perfil */
  photoUrl?: string;
  /** URL de la foto de portada */
  coverUrl?: string;
  /** Teléfono de contacto */
  phone?: string;
  /** Indica si el teléfono tiene WhatsApp disponible */
  hasWhatsapp?: boolean;
  /** Usuario o enlace de Instagram */
  instagram?: string;
  /** Enlace a página web oficial */
  website?: string;
  /** Correo electrónico de contacto */
  email?: string;
  /** Idiomas que domina el guía (ej: Español, Inglés) */
  languages?: string;
  /** Número de Registro Nacional de Turismo (RNT) */
  rnt?: string;
  /** Estado de publicación y visibilidad en el directorio */
  isPublished?: boolean;
}
