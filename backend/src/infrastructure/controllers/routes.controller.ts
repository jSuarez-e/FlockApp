/**
 * @sdd
 * - [Objetivo]: Exponer endpoint REST para obtener rutas desde Postgres.
 * - [I/O]: Retorna array de rutas ordenadas por start_time.
 * - [Edge Cases]: Utiliza el middleware global de excepciones para errores.
 */
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ActiveUserInterface } from '../../application/interfaces/active-user.interface';
import { RoutesService } from '../../application/services/routes.service';
import { IRoute } from '../../../../shared/models/routes.interface';

@ApiTags('Routes')
@ApiBearerAuth()
@Controller('v1/routes')
@UseGuards(JwtAuthGuard)
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  @ApiOperation({
    summary:
      'Obtener todas las rutas enviadas y en progreso del usuario actual (Postgres)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de rutas obtenidas con éxito.',
  })
  async getRoutes(@CurrentUser() user: ActiveUserInterface): Promise<IRoute[]> {
    return this.routesService.findAll(user.id);
  }
}
