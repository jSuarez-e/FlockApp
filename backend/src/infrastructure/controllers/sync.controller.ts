/**
 * @sdd
 * @description Sync Controller exposing the catalogs pulling API.
 * @io GET /api/v1/sync/catalogs
 */
import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ActiveUserInterface } from '../../application/interfaces/active-user.interface';
import { SyncService } from '../../application/services/sync.service';
import { ISyncRoutesBulkPayload } from '../../../../shared/models/routes.interface';

@Controller('v1/sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('catalogs')
  async syncCatalogs(@Query('lastSync') lastSync?: string) {
    return this.syncService.getCatalogsSince(lastSync);
  }

  /**
   * @description Processes a bulk sync payload of routes and sightings using PostGIS.
   */
  @Post('routes/bulk')
  @UseGuards(JwtAuthGuard)
  async syncRoutesBulk(
    @CurrentUser() user: ActiveUserInterface,
    @Body() payload: ISyncRoutesBulkPayload,
  ) {
    try {
      return await this.syncService.processRoutesBulkSync(payload, user.id);
    } catch {
      throw new InternalServerErrorException(
        'Failed to process bulk sync transaction.',
      );
    }
  }

  /**
   * @description Endpoint genérico de PUSH para sincronizar avistamientos y datos offline (Write-Behind).
   */
  @Post('push')
  @UseGuards(JwtAuthGuard)
  async pushSyncData(
    @CurrentUser() user: ActiveUserInterface,
    @Body() payload: Record<string, unknown>,
  ) {
    try {
      // Si el frontend envía un objeto compatible con ISyncRoutesBulkPayload (rutas o avistamientos)
      if (payload && 'routes' in payload) {
        return await this.syncService.processRoutesBulkSync(
          payload as unknown as ISyncRoutesBulkPayload,
          user.id,
        );
      }
      return {
        success: true,
        message: 'Sync PUSH acknowledged',
        received: Array.isArray(payload?.['data']) ? payload['data'].length : 0,
      };
    } catch {
      throw new InternalServerErrorException(
        'Failed to process offline push sync.',
      );
    }
  }
}
