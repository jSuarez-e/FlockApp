/**
 * @sdd
 * - [Objetivo]: Controlador REST para búsqueda y consulta de aves en PostgreSQL.
 * - [I/O]: Expone GET /api/v1/birds/search y GET /api/v1/birds/:id. Inyecta BirdsService.
 * - [Edge Cases]: Validación de tipos con ParseIntPipe, manejo de parámetros vacíos, Swagger OpenAPI tipado.
 */
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BirdsService } from '../../application/services/birds.service';
import { BirdEntity } from '../entities/bird.entity';

@ApiTags('Birds')
@Controller('v1/birds')
export class BirdsController {
  constructor(private readonly birdsService: BirdsService) {}

  @Get('search')
  @ApiOperation({
    summary: 'Buscar aves en PostgreSQL por coincidencia de texto',
  })
  @ApiQuery({ name: 'q', required: true, description: 'Término de búsqueda' })
  @ApiResponse({
    status: 200,
    description: 'Lista de aves encontradas',
    type: [BirdEntity],
  })
  async search(@Query('q') query: string): Promise<BirdEntity[]> {
    return this.birdsService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un ave por su ID' })
  @ApiResponse({ status: 200, description: 'Ave encontrada', type: BirdEntity })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BirdEntity | null> {
    return this.birdsService.findById(id);
  }
}
