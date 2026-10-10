/**
 * @sdd
 * - [Objetivo]: Endpoint de solo lectura para el Directorio de Guías.
 * - [I/O]: Retorna DTOs de JSON plano y es interceptado si no hay red (Offline-First plan).
 * - [Edge Cases]: Protegido con Guards estándar de autenticación.
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { GuidesService } from '../../application/services/guides.service';
import { UpdateGuideProfileDto } from '../dtos/guide/update-guide-profile.dto';

@ApiTags('Guides')
@Controller('v1/guides')
@UseGuards(JwtAuthGuard)
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener la lista completa de Guías Locales.' })
  async getGuides() {
    return this.guidesService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener el perfil de Guía del usuario actual.' })
  async getMyGuideProfile(@CurrentUser() user: { id: string }) {
    return this.guidesService.getMyProfile(user.id);
  }

  @Put('me')
  @ApiOperation({
    summary: 'Actualizar el perfil de Guía del usuario actual.',
  })
  async updateMyGuideProfilePut(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateGuideProfileDto,
  ) {
    return this.guidesService.updateProfile(user.id, dto);
  }

  @Post('profile')
  @ApiOperation({
    summary: 'Crear o actualizar el perfil de Guía del usuario actual.',
  })
  async updateMyGuideProfile(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateGuideProfileDto,
  ) {
    return this.guidesService.updateProfile(user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle específico de un Guía Local.' })
  async getGuideDetail(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.guidesService.findOne(id);
  }
}
