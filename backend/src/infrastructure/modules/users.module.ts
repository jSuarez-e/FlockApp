import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './../../application/services/users.service';
import { UsersController } from './../../infrastructure/controllers/users.controller';
import { UploadsController } from './../../infrastructure/controllers/uploads.controller';
import { UserEntity } from './../../infrastructure/entities/user.entity';
import { MedalsModule } from './medals.module';

/**
 * @module UsersModule
 * @description Módulo central de gestión de usuarios y recursos multimedia.
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), MedalsModule],
  controllers: [UsersController, UploadsController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
