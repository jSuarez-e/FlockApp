/**
 * @sdd
 * @description [AUTO-GENERATED] Reflejo estricto de la tabla 'sites' desde SQLite (Frontend) a TypeORM (Backend).
 * @io Garantiza Asimetría Cero en el flujo Offline-First.
 */
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SiteServiceEntity } from './site-service.entity';
import { SiteRatingEntity } from './site-rating.entity';

@Entity('sites')
export class SiteEntity {
  @ApiProperty({ description: 'Columna autogenerada: id' })
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @ApiProperty({ description: 'Columna autogenerada: name' })
  @Column({ type: 'text' })
  name: string;

  @ApiProperty({ description: 'Columna autogenerada: department' })
  @Column({ type: 'text', nullable: true })
  department: string;

  @ApiProperty({ description: 'Columna autogenerada: rating' })
  @Column({ type: 'float', nullable: true })
  rating: number;

  @ApiProperty({ description: 'Columna autogenerada: description' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'ID del propietario del sitio (Modo Proveedor)' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  owner_id: string;

  @ApiProperty({ description: 'Municipio geográfico' })
  @Column({ type: 'text', nullable: true })
  municipality: string;

  @ApiProperty({ description: 'Foto de portada del sitio' })
  @Column({ type: 'text', nullable: true })
  cover_url: string;

  @ApiProperty({ description: 'Logo o foto de perfil del sitio' })
  @Column({ type: 'text', nullable: true })
  logo_url: string;

  @ApiProperty({ description: 'Teléfono de contacto' })
  @Column({ type: 'text', nullable: true })
  contact_phone: string;

  @ApiProperty({ description: 'Número de WhatsApp' })
  @Column({ type: 'text', nullable: true })
  contact_whatsapp: string;

  @ApiProperty({ description: 'Página web oficial' })
  @Column({ type: 'text', nullable: true })
  website: string;

  @ApiProperty({ description: 'Cuenta de Instagram' })
  @Column({ type: 'text', nullable: true })
  instagram: string;

  @ApiProperty({ description: 'Página de Facebook' })
  @Column({ type: 'text', nullable: true })
  facebook: string;

  @ApiProperty({ description: 'Indica si el sitio maneja checklist de aves' })
  @Column({ type: 'boolean', default: false })
  has_bird_checklist: boolean;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: { type: string; coordinates: [number, number] } | null;

  @ApiProperty({ description: 'Columna mapeada: routeGeoJson' })
  @Column({ type: 'jsonb', nullable: true })
  routeGeoJson: Record<string, unknown> | null;

  @ApiProperty({ description: 'Columna autogenerada: last_modified' })
  @Column({ type: 'timestamp', nullable: true })
  last_modified: Date;

  @ApiProperty({ description: 'Columna autogenerada: sql_deleted' })
  @Column({ type: 'boolean', nullable: true })
  sql_deleted: boolean;

  @OneToMany(() => SiteServiceEntity, (service) => service.site)
  services: SiteServiceEntity[];

  @OneToMany(() => SiteRatingEntity, (rating) => rating.site)
  ratings: SiteRatingEntity[];
}
