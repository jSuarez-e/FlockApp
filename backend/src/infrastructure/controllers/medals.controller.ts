import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ActiveUserInterface } from '../../application/interfaces/active-user.interface';
import { MedalsService } from '../../application/services/medals.service';

/**
 * @sdd
 * @description API para obtener el listado de medallas ganadas y bloqueadas del usuario.
 */
@Controller('v1/users/me/medals')
@UseGuards(JwtAuthGuard)
export class MedalsController {
  constructor(private readonly medalsService: MedalsService) {}

  @Get()
  async getMyMedals(@CurrentUser() user: ActiveUserInterface) {
    return this.medalsService.getUserMedalsWithStatus(user.id);
  }
}
