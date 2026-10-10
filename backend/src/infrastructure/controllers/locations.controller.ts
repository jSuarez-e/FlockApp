import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationsService } from '../../application/services/locations.service';
import { ReverseGeocodeQueryDto } from '../dtos/reverse-geocode.dto';
import { IReverseGeocodeResponse } from '../../../../shared/models/locations.interface';

/**
 * @class LocationsController
 * @description API para la gestión territorial de FlockApp.
 */
@ApiTags('Locations')
@Controller('v1/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  /**
   * Obtiene la división política (departamento y municipio) a partir de coordenadas GPS.
   *
   * @param query DTO validado con latitud y longitud.
   * @returns Datos de departamento y municipio resueltos.
   */
  @Get('reverse-geocode')
  @ApiOperation({
    summary:
      'Geocodificación inversa para resolución de departamento y municipio',
  })
  @ApiResponse({
    status: 200,
    description: 'Resolución de jerarquía territorial exitosa',
  })
  async reverseGeocode(
    @Query() query: ReverseGeocodeQueryDto,
  ): Promise<IReverseGeocodeResponse> {
    return this.locationsService.reverseGeocode(query.lat, query.lng);
  }

  @Get('departments')
  async getDepartments() {
    return this.locationsService.getDepartments();
  }

  @Get('municipalities/:departmentId')
  async getMunicipalities(
    @Param('departmentId', ParseIntPipe) departmentId: number,
  ) {
    return this.locationsService.getMunicipalities(departmentId);
  }

  @Delete('clear')
  async clear() {
    await this.locationsService.clearDatabase();
    return { message: 'Limpieza de geografía completada' };
  }

  @Post('seed')
  async seed(@Body() body: Record<string, unknown> & { name: string }) {
    await this.locationsService.seedFromJSON(
      body as unknown as Parameters<LocationsService['seedFromJSON']>[0],
    );
    return { message: `Sincronización de ${body.name} exitosa` };
  }
}
