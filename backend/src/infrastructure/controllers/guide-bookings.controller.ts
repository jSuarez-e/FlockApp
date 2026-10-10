/**
 * @sdd
 * [Objetivo]: Endpoints REST para gestión de reservas, disponibilidad de calendario y calificaciones de Guías.
 * [I/O]: Expone rutas bajo /api/v1/guides. Protegido con JwtAuthGuard.
 * [Edge Cases]: Validación de ownership en operaciones del guía y del pajarero.
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { GuideBookingsService } from '../../application/services/guide-bookings.service';
import { CreateBookingDto } from '../dtos/guide/create-booking.dto';
import { UpdateBookingStatusDto } from '../dtos/guide/update-booking-status.dto';
import { RateBookingDto } from '../dtos/guide/rate-booking.dto';
import { SetAvailabilityDto } from '../dtos/guide/set-availability.dto';

@ApiTags('Guide Bookings & Availability')
@Controller('v1/guides')
@UseGuards(JwtAuthGuard)
export class GuideBookingsController {
  constructor(private readonly bookingsService: GuideBookingsService) {}

  @Get('my-bookings')
  @ApiOperation({
    summary: 'Historial de reservas realizadas por el pajarero autenticado.',
  })
  async getMyBookingsHistory(@CurrentUser() user: { id: string }) {
    return this.bookingsService.getMyBookingsHistory(user.id);
  }

  @Post('my-bookings/:bookingId/rate')
  @ApiOperation({
    summary: 'Marcar servicio como finalizado y calificar al guía.',
  })
  async rateBooking(
    @CurrentUser() user: { id: string },
    @Param('bookingId') bookingId: string,
    @Body() dto: RateBookingDto,
  ) {
    return this.bookingsService.rateBooking(user.id, bookingId, dto);
  }

  @Get('me/bookings')
  @ApiOperation({
    summary: 'Solicitudes de reserva recibidas por el guía (Modo Proveedor).',
  })
  async getIncomingBookings(@CurrentUser() user: { id: string }) {
    return this.bookingsService.getIncomingBookings(user.id);
  }

  @Patch('me/bookings/:bookingId/status')
  @ApiOperation({
    summary: 'Actualizar el estado de una solicitud de reserva recibida.',
  })
  async updateBookingStatus(
    @CurrentUser() user: { id: string },
    @Param('bookingId') bookingId: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateBookingStatus(user.id, bookingId, dto);
  }

  @Post('me/availability')
  @ApiOperation({
    summary: 'Bloquear o desbloquear fechas en el calendario del guía.',
  })
  async setMyAvailability(
    @CurrentUser() user: { id: string },
    @Body() dto: SetAvailabilityDto,
  ) {
    return this.bookingsService.setAvailability(user.id, dto);
  }

  @Get(':guideId/availability')
  @ApiOperation({
    summary: 'Consultar la disponibilidad y fechas ocupadas de un guía.',
  })
  async getGuideAvailability(@Param('guideId') guideId: string) {
    return this.bookingsService.getGuideAvailability(guideId);
  }

  @Post(':guideId/bookings')
  @ApiOperation({
    summary: 'Crear una solicitud de contacto y reserva para un guía.',
  })
  async createBooking(
    @CurrentUser() user: { id: string },
    @Param('guideId') guideId: string,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.createBooking(user.id, guideId, dto);
  }
}
