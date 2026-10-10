/**
 * @sdd
 * @description Sightings Controller
 * @io GET /api/v1/sightings/search
 */
import { Controller, Get, Query } from '@nestjs/common';
import { SightingsService } from '../../application/services/sightings.service';

@Controller('v1/sightings')
export class SightingsController {
  constructor(private readonly sightingsService: SightingsService) {}

  @Get('search')
  async search(
    @Query('birdId') birdId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('departmentId') departmentId: string,
  ) {
    try {
      return await this.sightingsService.searchSightings(
        birdId,
        startDate,
        endDate,
        departmentId,
      );
    } catch (error) {
      if (error instanceof Error) {
        return { _debugError: error.message, stack: error.stack };
      }
      return { _debugError: String(error) };
    }
  }
}
