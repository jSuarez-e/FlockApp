import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../../application/services/users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ActiveUserInterface } from 'src/application/interfaces/active-user.interface';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';

/**
 * @class UsersController
 * @description API de gestión de identidad.
 * @author Gemini (Orquestador SDD)
 */
@Controller('v1/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser() user: ActiveUserInterface) {
    return this.usersService.findOne(user.id);
  }

  @Patch('me')
  updateMe(
    @CurrentUser() user: ActiveUserInterface,
    @Body() updateData: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(user.id, updateData);
  }

  /**
   * @method changePassword
   * @description Endpoint de alta seguridad para cambio de credenciales.
   */
  @Patch('change-password')
  changePassword(
    @CurrentUser() user: ActiveUserInterface,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: ActiveUserInterface) {
    return this.usersService.findOne(id, user.id);
  }
}
