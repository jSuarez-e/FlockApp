/**
 * @sdd
 * - [Objetivo]: DTO para sincronizar y actualizar el checklist de aves asociadas a un Sitio.
 * - [I/O]: Implementa ISyncSiteBirdsDto con arreglo de birdIds numéricos.
 * - [Edge Cases]: Valida que birdIds sea un arreglo de números enteros.
 */
import { IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ISyncSiteBirdsDto } from '../../../../../shared/models/site-profile.interface';

/**
 * DTO para la sincronización en lote del checklist de aves.
 */
export class SyncSiteBirdsDto implements ISyncSiteBirdsDto {
  @ApiProperty({
    description: 'Listado de IDs numéricos de aves que pertenecen al sitio',
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  birdIds: number[];
}
