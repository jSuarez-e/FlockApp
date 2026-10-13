/**
 * @sdd
 * @description [AUTO-GENERATED] Reflejo estricto de la tabla 'guides' desde SQLite (Frontend) a TypeORM (Backend).
 * @io Garantiza Asimetría Cero en el flujo Offline-First.
 */
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('guides')
export class GuideEntity {
  @ApiProperty({ description: 'Columna autogenerada: id' })
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @ApiProperty({ description: 'Columna autogenerada: full_name' })
  @Column({ type: 'text' })
  full_name: string;

  @ApiProperty({ description: 'Columna autogenerada: location' })
  @Column({ type: 'text', nullable: true })
  location: string;

  @ApiProperty({ description: 'Columna autogenerada: specialty' })
  @Column({ type: 'text', nullable: true })
  specialty: string;

  @ApiProperty({ description: 'Columna autogenerada: rating' })
  @Column({ type: 'float', nullable: true })
  rating: number;

  @ApiProperty({ description: 'Columna autogenerada: photo_url' })
  @Column({ type: 'text', nullable: true })
  photo_url: string;

  @ApiProperty({ description: 'Columna autogenerada: details' })
  @Column({ type: 'text', nullable: true })
  details: string;

  @ApiProperty({ description: 'Columna autogenerada: last_modified' })
  @Column({ type: 'timestamp', nullable: true })
  last_modified: Date;

  @ApiProperty({ description: 'Columna autogenerada: sql_deleted' })
  @Column({ type: 'boolean', nullable: true })
  sql_deleted: boolean;

  @ApiProperty({ description: 'Teléfono de contacto' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @ApiProperty({ description: 'Disponibilidad de WhatsApp' })
  @Column({ type: 'boolean', default: true })
  has_whatsapp: boolean;

  @ApiProperty({ description: 'Usuario o enlace de Instagram' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  instagram: string;

  @ApiProperty({ description: 'Página web del guía' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @ApiProperty({ description: 'Correo electrónico de contacto' })
  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string;

  @ApiProperty({ description: 'Idiomas dominados' })
  @Column({ type: 'varchar', length: 255, default: 'Español' })
  languages: string;

  @ApiProperty({ description: 'Registro Nacional de Turismo' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  rnt: string;

  @ApiProperty({ description: 'Publicado y visible en el directorio' })
  @Column({ type: 'boolean', default: true })
  is_published: boolean;

  @ApiProperty({ description: 'Verificado por el sistema' })
  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @ApiProperty({ description: 'Foto de portada del guía' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  cover_url: string;
}
