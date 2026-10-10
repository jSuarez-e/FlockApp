/**
 * @sdd
 * @description Controller for Sites interactions (online flow).
 * @io Injects SitesService to handle ratings.
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SitesService } from '../../application/services/sites.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UpdateSiteProfileDto } from '../dtos/site/update-site-profile.dto';
import { CreateSiteServiceDto } from '../dtos/site/create-site-service.dto';
import { SyncSiteBirdsDto } from '../dtos/site/sync-site-birds.dto';

@ApiTags('Sites')
@Controller('v1/sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener la lista completa de Sitios de Aviturismo públicos.',
  })
  async getSites() {
    return await this.sitesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('provider/my-site')
  @ApiOperation({
    summary: 'Obtener o inicializar el perfil del sitio propio del proveedor.',
  })
  async getMySite(@CurrentUser() user: { id: string }) {
    return await this.sitesService.getMySite(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('provider/my-site')
  @ApiOperation({
    summary: 'Actualizar la información general y de contacto del sitio.',
  })
  async updateMySite(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateSiteProfileDto,
  ) {
    return await this.sitesService.updateMySite(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('provider/my-site/services')
  @ApiOperation({ summary: 'Agregar un producto o servicio al sitio.' })
  async addService(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateSiteServiceDto,
  ) {
    return await this.sitesService.addService(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('provider/my-site/services/:serviceId')
  @ApiOperation({ summary: 'Eliminar un producto o servicio del sitio.' })
  async deleteService(
    @CurrentUser() user: { id: string },
    @Param('serviceId') serviceId: string,
  ) {
    return await this.sitesService.deleteService(user.id, serviceId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('provider/my-site/birds')
  @ApiOperation({
    summary: 'Obtener los IDs de aves asociadas al checklist del sitio.',
  })
  async getMySiteBirds(@CurrentUser() user: { id: string }) {
    return await this.sitesService.getMySiteBirds(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('provider/my-site/birds')
  @ApiOperation({
    summary: 'Sincronizar y guardar el checklist de aves del sitio.',
  })
  async syncMySiteBirds(
    @CurrentUser() user: { id: string },
    @Body() dto: SyncSiteBirdsDto,
  ) {
    return await this.sitesService.syncMySiteBirds(user.id, dto.birdIds);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/rating')
  @ApiOperation({ summary: 'Calificar un sitio de aviturismo' })
  @ApiResponse({ status: 201, description: 'Rating created successfully' })
  async addRating(
    @Param('id') siteId: string,
    @Body() body: { score: number; comment?: string },
    @CurrentUser() user: { id: string },
  ) {
    return await this.sitesService.addRating(
      siteId,
      user.id,
      body.score,
      body.comment,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalle completo de un sitio para la vista pajarera.',
  })
  async getSiteDetail(@Param('id') id: string) {
    return await this.sitesService.getSiteDetail(id);
  }

  @Get(':id/birds')
  @ApiOperation({
    summary: 'Obtener los IDs de aves asociadas al checklist del sitio.',
  })
  async getSiteBirds(@Param('id') siteId: string): Promise<number[]> {
    return await this.sitesService.getSiteBirds(siteId);
  }
}
