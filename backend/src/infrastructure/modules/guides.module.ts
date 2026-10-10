/**
 * @sdd
 * - [Objetivo]: Módulo orquestador para inyectar Controller, Service y Entity de Guías.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuideEntity } from '../entities/guide.entity';
import { UserEntity } from '../entities/user.entity';
import { GuideBookingEntity } from '../entities/guide-booking.entity';
import { GuideAvailabilityEntity } from '../entities/guide-availability.entity';
import { GuidesController } from '../controllers/guides.controller';
import { GuideBookingsController } from '../controllers/guide-bookings.controller';
import { GuidesService } from '../../application/services/guides.service';
import { GuideBookingsService } from '../../application/services/guide-bookings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GuideEntity,
      UserEntity,
      GuideBookingEntity,
      GuideAvailabilityEntity,
    ]),
  ],
  controllers: [GuideBookingsController, GuidesController],
  providers: [GuidesService, GuideBookingsService],
  exports: [GuidesService, GuideBookingsService],
})
export class GuidesModule {}
