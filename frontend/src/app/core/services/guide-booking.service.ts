/**
 * @sdd
 * [Objetivo]: Servicio Frontend para gestionar reservas, agenda/disponibilidad y calificaciones de Guías.
 * [I/O]: Consume endpoints /api/v1/guides/... y retorna DTOs tipados.
 * [Edge Cases]: Manejo de promesas con firstValueFrom para integración con SignalStores y Signals Forms.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  IGuideBooking,
  ICreateBookingDto,
  IUpdateBookingStatusDto,
  IRateBookingDto,
  IGuideAvailability,
  ISetAvailabilityDto,
  BookingStatus,
} from '../../../../../shared/models/guide-booking.interface';

/**
 * Respuesta con el desglose de disponibilidad del guía para el calendario.
 */
export interface IGuideAvailabilityResponse {
  /** Fechas bloqueadas manualmente por el guía */
  blockedDates: string[];
  /** Fechas ocupadas por reservas confirmadas */
  confirmedDates: string[];
  /** Registros detallados de disponibilidad */
  records: IGuideAvailability[];
}

/**
 * Resultado de la actualización de disponibilidad en bloque.
 */
export interface ISetAvailabilityResult {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Cantidad de registros afectados */
  affected: number;
}

/**
 * Servicio Angular para la gestión de reservas, agendas y calificaciones de guías.
 */
@Injectable({
  providedIn: 'root',
})
export class GuideBookingService {
  /** Cliente HTTP de Angular */
  private readonly http = inject(HttpClient);
  /** URL base del endpoint de guías */
  private readonly baseUrl = `${environment.apiUrl}/guides`;

  /**
   * Crea una solicitud de contacto y reserva para un guía específico.
   * @param guideId ID del guía destinatario.
   * @param payload Datos de la solicitud de reserva.
   * @returns Reserva creada.
   */
  async createBooking(
    guideId: string,
    payload: ICreateBookingDto,
  ): Promise<IGuideBooking> {
    return firstValueFrom(
      this.http.post<IGuideBooking>(
        `${this.baseUrl}/${guideId}/bookings`,
        payload,
      ),
    );
  }

  /**
   * Consulta las fechas bloqueadas y reservas confirmadas de un guía.
   * @param guideId ID del guía.
   * @returns Listado de fechas no disponibles.
   */
  async getGuideAvailability(
    guideId: string,
  ): Promise<IGuideAvailabilityResponse> {
    return firstValueFrom(
      this.http.get<IGuideAvailabilityResponse>(
        `${this.baseUrl}/${guideId}/availability`,
      ),
    );
  }

  /**
   * Bloquea o desbloquea fechas del calendario del guía autenticado.
   * @param payload Lista de fechas y acción ('BLOCK' | 'UNBLOCK').
   * @returns Resultado de la operación.
   */
  async setMyAvailability(
    payload: ISetAvailabilityDto,
  ): Promise<ISetAvailabilityResult> {
    return firstValueFrom(
      this.http.post<ISetAvailabilityResult>(
        `${this.baseUrl}/me/availability`,
        payload,
      ),
    );
  }

  /**
   * Obtiene la lista de solicitudes de reserva recibidas por el guía (Modo Proveedor).
   * @returns Listado de reservas recibidas.
   */
  async getIncomingBookings(): Promise<IGuideBooking[]> {
    return firstValueFrom(
      this.http.get<IGuideBooking[]>(`${this.baseUrl}/me/bookings`),
    );
  }

  /**
   * Actualiza el estado de una reserva (Aceptar, Rechazar, Completar).
   * @param bookingId ID de la reserva.
   * @param status Nuevo estado de la reserva.
   * @returns Reserva actualizada.
   */
  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
  ): Promise<IGuideBooking> {
    const payload: IUpdateBookingStatusDto = { status };
    return firstValueFrom(
      this.http.patch<IGuideBooking>(
        `${this.baseUrl}/me/bookings/${bookingId}/status`,
        payload,
      ),
    );
  }

  /**
   * Obtiene el historial de reservas realizadas por el pajarero autenticado.
   * @returns Historial de reservas.
   */
  async getMyBookingsHistory(): Promise<IGuideBooking[]> {
    return firstValueFrom(
      this.http.get<IGuideBooking[]>(`${this.baseUrl}/my-bookings`),
    );
  }

  /**
   * Marca el servicio como finalizado y registra la calificación con reseña.
   * @param bookingId ID de la reserva.
   * @param payload Calificación (1 a 5) y reseña opcional.
   * @returns Reserva completada y calificada.
   */
  async rateBooking(
    bookingId: string,
    payload: IRateBookingDto,
  ): Promise<IGuideBooking> {
    return firstValueFrom(
      this.http.post<IGuideBooking>(
        `${this.baseUrl}/my-bookings/${bookingId}/rate`,
        payload,
      ),
    );
  }
}
