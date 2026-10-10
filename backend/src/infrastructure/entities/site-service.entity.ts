/**
 * @sdd
 * @description TypeORM entity for site services.
 */
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SiteEntity } from './site.entity';

@Entity('site_services')
export class SiteServiceEntity {
  @ApiProperty({ description: 'ID único del servicio' })
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @ApiProperty({ description: 'ID del sitio' })
  @Column({ type: 'varchar', length: 255 })
  site_id: string;

  @ApiProperty({ description: 'Tipo: service | product | other' })
  @Column({ type: 'varchar', length: 50 })
  type: 'service' | 'product' | 'other';

  @ApiProperty({ description: 'Nombre del servicio/producto' })
  @Column({ type: 'text' })
  name: string;

  @ApiProperty({ description: 'Descripción detallada' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'URL de la foto' })
  @Column({ type: 'text', nullable: true })
  photo_url: string;

  @ApiProperty({ description: 'Precio de referencia' })
  @Column({ type: 'float', nullable: true })
  price: number;

  @ApiProperty({ description: 'Columna autogenerada: last_modified' })
  @Column({ type: 'timestamp', nullable: true })
  last_modified: Date;

  @ApiProperty({ description: 'Columna autogenerada: sql_deleted' })
  @Column({ type: 'boolean', nullable: true })
  sql_deleted: boolean;

  @ManyToOne(() => SiteEntity, (site) => site.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: SiteEntity;
}
