/**
 * @sdd
 * [Objetivo]: Servicio de aplicación para reservas, disponibilidad y reseñas de Guías.
 * [I/O]: Inyección de GuideBookingEntity, GuideAvailabilityEntity, GuideEntity, UserEntity.
 * [Edge Cases]: Validación de estados finitos, prevención de solapamiento de fechas, recálculo de rating promedio.
 */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { GuideBookingEntity } from '../../infrastructure/entities/guide-booking.entity';
import { GuideAvailabilityEntity } from '../../infrastructure/entities/guide-availability.entity';
import { GuideEntity } from '../../infrastructure/entities/guide.entity';
import { UserEntity } from '../../infrastructure/entities/user.entity';
import { CreateBookingDto } from '../../infrastructure/dtos/guide/create-booking.dto';
import { UpdateBookingStatusDto } from '../../infrastructure/dtos/guide/update-booking-status.dto';
import { RateBookingDto } from '../../infrastructure/dtos/guide/rate-booking.dto';
import { SetAvailabilityDto } from '../../infrastructure/dtos/guide/set-availability.dto';
import {
  IGuideBooking,
  IGuideAvailability,
} from '../../../../shared/models/guide-booking.interface';

@Injectable()
export class GuideBookingsService {
  constructor(
    @InjectRepository(GuideBookingEntity)
    private readonly bookingRepo: Repository<GuideBookingEntity>,
    @InjectRepository(GuideAvailabilityEntity)
    private readonly availabilityRepo: Repository<GuideAvailabilityEntity>,
    @InjectRepository(GuideEntity)
    private readonly guideRepo: Repository<GuideEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  /**
   * Crea una nueva solicitud de reserva / contacto para un guía.
   * @param birderId ID del usuario pajarero solicitante.
   * @param guideId ID del guía al que se solicita.
   * @param dto Datos de la reserva.
   */
  async createBooking(
    birderId: string,
    guideId: string,
    dto: CreateBookingDto,
  ): Promise<IGuideBooking> {
    if (birderId === guideId) {
      throw new BadRequestException(
        'No puedes contratarte a ti mismo como guía.',
      );
    }

    const guide = await this.guideRepo.findOne({
      where: { id: guideId, sql_deleted: false },
    });
    if (!guide) {
      throw new NotFoundException(`Guía con ID ${guideId} no encontrado.`);
    }

    // Verificar si el día está bloqueado por el guía
    const isBlocked = await this.availabilityRepo.findOne({
      where: { guide_id: guideId, date: dto.bookingDate },
    });
    if (isBlocked) {
      throw new BadRequestException(
        `La fecha ${dto.bookingDate} no está disponible en la agenda del guía.`,
      );
    }

    // Verificar si ya existe una reserva confirmada en esa fecha
    const existingConfirmed = await this.bookingRepo.findOne({
      where: {
        guide_id: guideId,
        booking_date: dto.bookingDate,
        status: 'CONFIRMED',
      },
    });
    if (existingConfirmed) {
      throw new BadRequestException(
        `El guía ya tiene una reserva confirmada para la fecha ${dto.bookingDate}.`,
      );
    }

    const booking = this.bookingRepo.create({
      birder_id: birderId,
      guide_id: guideId,
      booking_date: dto.bookingDate,
      activity_type: dto.activityType,
      message: dto.message,
      contact_phone: dto.contactPhone,
      contact_email: dto.contactEmail || '',
      status: 'PENDING',
    });

    const saved = await this.bookingRepo.save(booking);

    return this.mapBookingToDto(saved, guide);
  }

  /**
   * Obtiene la disponibilidad de fechas para un guía (fechas bloqueadas y reservas confirmadas).
   * @param guideId ID del guía.
   */
  async getGuideAvailability(guideId: string): Promise<{
    blockedDates: string[];
    confirmedDates: string[];
    records: IGuideAvailability[];
  }> {
    const blockedRecords = await this.availabilityRepo.find({
      where: { guide_id: guideId },
    });

    const confirmedBookings = await this.bookingRepo.find({
      where: { guide_id: guideId, status: 'CONFIRMED' },
      select: ['booking_date'],
    });

    const blockedDates = blockedRecords.map((r) => r.date);
    const confirmedDates = confirmedBookings.map((b) => b.booking_date);

    const records: IGuideAvailability[] = blockedRecords.map((r) => ({
      id: r.id,
      guideId: r.guide_id,
      date: r.date,
      reason: r.reason,
    }));

    return {
      blockedDates,
      confirmedDates,
      records,
    };
  }

  /**
   * Bloquea o desbloquea fechas del calendario para el guía autenticado.
   * @param guideId ID del guía autenticado.
   * @param dto Objeto con fechas y acción ('BLOCK' | 'UNBLOCK').
   */
  async setAvailability(
    guideId: string,
    dto: SetAvailabilityDto,
  ): Promise<{ success: boolean; affected: number }> {
    if (!dto.dates || dto.dates.length === 0) {
      return { success: true, affected: 0 };
    }

    if (dto.action === 'BLOCK') {
      const recordsToInsert = dto.dates.map((dateStr) =>
        this.availabilityRepo.create({
          guide_id: guideId,
          date: dateStr,
          reason: dto.reason || 'Día ocupado / descanso',
        }),
      );
      // Usar upsert para evitar errores de duplicidad
      await this.availabilityRepo.upsert(recordsToInsert, ['guide_id', 'date']);
      return { success: true, affected: dto.dates.length };
    } else {
      const result = await this.availabilityRepo.delete({
        guide_id: guideId,
        date: In(dto.dates),
      });
      return { success: true, affected: result.affected || 0 };
    }
  }

  /**
   * Obtiene las solicitudes de reserva recibidas por el guía (Modo Proveedor).
   * @param guideId ID del guía autenticado.
   */
  async getIncomingBookings(guideId: string): Promise<IGuideBooking[]> {
    const bookings = await this.bookingRepo.find({
      where: { guide_id: guideId },
      order: { booking_date: 'DESC', created_at: 'DESC' },
    });

    if (bookings.length === 0) {
      return [];
    }

    const birderIds = Array.from(new Set(bookings.map((b) => b.birder_id)));
    const birders = await this.userRepo.find({
      where: { id: In(birderIds) },
    });
    const birderMap = new Map(birders.map((u) => [u.id, u]));

    return bookings.map((b) => {
      const birder = birderMap.get(b.birder_id);
      const birderName = birder
        ? `${birder.firstName || ''} ${birder.lastName || ''}`.trim() ||
          birder.username
        : 'Pajarero Anónimo';

      return {
        id: b.id,
        guideId: b.guide_id,
        birderId: b.birder_id,
        bookingDate: b.booking_date,
        activityType: b.activity_type,
        message: b.message,
        contactPhone: b.contact_phone,
        contactEmail: b.contact_email,
        status: b.status,
        rating: b.rating,
        review: b.review,
        birderName,
        birderPhotoUrl: birder?.avatarUrl || '',
        createdAt: b.created_at.toISOString(),
        updatedAt: b.updated_at.toISOString(),
      };
    });
  }

  /**
   * Obtiene el historial de reservas solicitadas por el pajarero autenticado (Vista Pajarero).
   * @param birderId ID del pajarero autenticado.
   */
  async getMyBookingsHistory(birderId: string): Promise<IGuideBooking[]> {
    const bookings = await this.bookingRepo.find({
      where: { birder_id: birderId },
      order: { booking_date: 'DESC', created_at: 'DESC' },
    });

    if (bookings.length === 0) {
      return [];
    }

    const guideIds = Array.from(new Set(bookings.map((b) => b.guide_id)));
    const guides = await this.guideRepo.find({
      where: { id: In(guideIds) },
    });
    const guideMap = new Map(guides.map((g) => [g.id, g]));

    return bookings.map((b) => {
      const guide = guideMap.get(b.guide_id);
      return {
        id: b.id,
        guideId: b.guide_id,
        birderId: b.birder_id,
        bookingDate: b.booking_date,
        activityType: b.activity_type,
        message: b.message,
        contactPhone: b.contact_phone,
        contactEmail: b.contact_email,
        status: b.status,
        rating: b.rating,
        review: b.review,
        guideName: guide?.full_name || 'Guía Local',
        guidePhotoUrl: guide?.photo_url || '',
        createdAt: b.created_at.toISOString(),
        updatedAt: b.updated_at.toISOString(),
      };
    });
  }

  /**
   * Actualiza el estado de una reserva (Aceptar, Rechazar, Finalizar).
   * @param guideId ID del guía propietario.
   * @param bookingId ID de la reserva.
   * @param dto Nuevo estado.
   */
  async updateBookingStatus(
    guideId: string,
    bookingId: string,
    dto: UpdateBookingStatusDto,
  ): Promise<IGuideBooking> {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException(`Reserva con ID ${bookingId} no encontrada.`);
    }

    if (booking.guide_id !== guideId) {
      throw new ForbiddenException(
        'No tienes permisos para modificar el estado de esta reserva.',
      );
    }

    booking.status = dto.status;
    const updated = await this.bookingRepo.save(booking);

    return this.mapBookingToDto(updated);
  }

  /**
   * Permite al pajarero marcar servicio finalizado y calificar al guía (1 a 5 estrellas).
   * @param birderId ID del pajarero solicitante.
   * @param bookingId ID de la reserva.
   * @param dto Calificación y reseña.
   */
  async rateBooking(
    birderId: string,
    bookingId: string,
    dto: RateBookingDto,
  ): Promise<IGuideBooking> {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException(`Reserva con ID ${bookingId} no encontrada.`);
    }

    if (booking.birder_id !== birderId) {
      throw new ForbiddenException(
        'Solo el pajarero que realizó la reserva puede calificar el servicio.',
      );
    }

    // Se valida que la reserva esté finalizada o se finaliza en el acto
    if (booking.status !== 'COMPLETED' && booking.status !== 'CONFIRMED') {
      throw new BadRequestException(
        'Solo se pueden calificar reservas confirmadas o completadas.',
      );
    }

    booking.status = 'COMPLETED';
    booking.rating = dto.rating;
    booking.review = dto.review || '';
    const savedBooking = await this.bookingRepo.save(booking);

    // Recalcular promedio de calificación del guía
    await this.recalculateGuideRating(booking.guide_id);

    return this.mapBookingToDto(savedBooking);
  }

  /**
   * Recalcula el promedio de calificación y lo persiste en la tabla guides.
   * @param guideId ID del guía.
   */
  private async recalculateGuideRating(guideId: string): Promise<void> {
    const ratedBookings = await this.bookingRepo.find({
      where: { guide_id: guideId },
      select: ['rating'],
    });

    const validRatings = ratedBookings
      .map((b) => b.rating)
      .filter((r): r is number => typeof r === 'number' && r > 0);

    if (validRatings.length > 0) {
      const sum = validRatings.reduce((acc, curr) => acc + curr, 0);
      const avg = Number((sum / validRatings.length).toFixed(1));
      await this.guideRepo.update(guideId, { rating: avg });
    }
  }

  private mapBookingToDto(
    booking: GuideBookingEntity,
    guide?: GuideEntity,
  ): IGuideBooking {
    return {
      id: booking.id,
      guideId: booking.guide_id,
      birderId: booking.birder_id,
      bookingDate: booking.booking_date,
      activityType: booking.activity_type,
      message: booking.message,
      contactPhone: booking.contact_phone,
      contactEmail: booking.contact_email,
      status: booking.status,
      rating: booking.rating,
      review: booking.review,
      guideName: guide?.full_name,
      guidePhotoUrl: guide?.photo_url,
      createdAt: booking.created_at.toISOString(),
      updatedAt: booking.updated_at.toISOString(),
    };
  }
}
