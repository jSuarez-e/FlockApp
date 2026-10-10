import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedalsService } from '../../application/services/medals.service';
import { MedalsController } from '../controllers/medals.controller';
import { MedalEntity } from '../entities/medal.entity';
import { UserMedalEntity } from '../entities/user-medal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedalEntity, UserMedalEntity])],
  controllers: [MedalsController],
  providers: [MedalsService],
  exports: [MedalsService],
})
export class MedalsModule {}
