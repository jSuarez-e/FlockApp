/**
 * @sdd
 * [Objetivo]: Contratos compartidos para Reservas, Contacto y Disponibilidad de Guías.
 * [I/O]: Modelos, DTOs y enumeraciones consumidos por Angular SignalStores y NestJS Controllers.
 * [Edge Cases]: Fechas en formato ISO YYYY-MM-DD, estados restringidos a maquina de estados finita.
 */

/**
 * Estados del ciclo de vida de una solicitud de reserva.
 */
export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELLED';

/**
 * Entidad de reserva y contacto para servicios de guianza.
 */
export interface IGuideBooking {
  /** Identificador único de la reserva */
  id: string;
  /** Identificador del guía */
  guideId: string;
  /** Identificador del pajarero */
  birderId: string;
  /** Fecha de la reserva (YYYY-MM-DD) */
  bookingDate: string;
  /** Tipo de actividad solicitada */
  activityType: string;
  /** Mensaje o detalles adicionales */
  message: string;
  /** Teléfono de contacto del solicitante */
  contactPhone: string;
  /** Correo de contacto del solicitante */
  contactEmail?: string;
  /** Estado de la solicitud */
  status: BookingStatus;
  /** Calificación otorgada (1-5) */
  rating?: number;
  /** Reseña o comentario */
  review?: string;
  /** Nombre del guía (proyectado) */
  guideName?: string;
  /** Foto del guía (proyectada) */
  guidePhotoUrl?: string;
  /** Nombre del pajarero solicitante (proyectado) */
  birderName?: string;
  /** Foto del pajarero solicitante (proyectada) */
  birderPhotoUrl?: string;
  /** Fecha de creación */
  createdAt: string;
  /** Fecha de última actualización */
  updatedAt: string;
}

/**
 * DTO para la creación de una solicitud de reserva / contacto hacia un guía.
 */
export interface ICreateBookingDto {
  /** Fecha de la reserva en formato YYYY-MM-DD */
  bookingDate: string;
  /** Tipo de actividad (ej: Aviturismo General, Fotografía, Senderismo) */
  activityType: string;
  /** Mensaje explicativo o requerimientos */
  message: string;
  /** Teléfono de contacto del pajarero */
  contactPhone: string;
  /** Correo de contacto del pajarero */
  contactEmail?: string;
}

/**
 * DTO para la actualización de estado de una reserva.
 */
export interface IUpdateBookingStatusDto {
  /** Nuevo estado de la reserva */
  status: BookingStatus;
}

/**
 * DTO para calificar y dejar reseña a un servicio de guianza completado.
 */
export interface IRateBookingDto {
  /** Calificación numérica de 1 a 5 */
  rating: number;
  /** Reseña o comentario cualitativo */
  review?: string;
}

/**
 * Modelo de disponibilidad o fecha bloqueada para el calendario del guía.
 */
export interface IGuideAvailability {
  /** Identificador único */
  id: string;
  /** Identificador del guía */
  guideId: string;
  /** Fecha bloqueada u ocupada (YYYY-MM-DD) */
  date: string;
  /** Motivo opcional del bloqueo */
  reason?: string;
}

/**
 * DTO para bloquear o desbloquear un lote de fechas en el calendario del guía.
 */
export interface ISetAvailabilityDto {
  /** Lista de fechas a bloquear o desbloquear (YYYY-MM-DD) */
  dates: string[];
  /** Acción a ejecutar */
  action: 'BLOCK' | 'UNBLOCK';
  /** Motivo del bloqueo */
  reason?: string;
}
