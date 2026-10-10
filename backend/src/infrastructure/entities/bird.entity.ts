/**
 * @sdd
 * @description [AUTO-GENERATED] Reflejo estricto de la tabla 'birds' desde SQLite (Frontend) a TypeORM (Backend).
 * @io Garantiza Asimetría Cero en el flujo Offline-First.
 */
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('birds')
export class BirdEntity {
  @ApiProperty({ description: 'Columna autogenerada: id' })
  @PrimaryColumn({ type: 'int' })
  id: number;

  @ApiProperty({ description: 'Columna autogenerada: scientific_name' })
  @Column({ type: 'text' })
  scientific_name: string;

  @ApiProperty({ description: 'Columna autogenerada: english_name' })
  @Column({ type: 'text' })
  english_name: string;

  @ApiProperty({ description: 'Columna autogenerada: common_name' })
  @Column({ type: 'text' })
  common_name: string;

  @ApiProperty({ description: 'Columna autogenerada: min_altitude' })
  @Column({ type: 'int' })
  min_altitude: number;

  @ApiProperty({ description: 'Columna autogenerada: max_altitude' })
  @Column({ type: 'int' })
  max_altitude: number;

  @ApiProperty({ description: 'Columna autogenerada: viewing_difficulty' })
  @Column({ type: 'int' })
  viewing_difficulty: number;

  @ApiProperty({ description: 'Columna autogenerada: size' })
  @Column({ type: 'int', nullable: true })
  size: number;

  @ApiProperty({ description: 'Columna autogenerada: environment' })
  @Column({ type: 'text', nullable: true })
  environment: string;

  @ApiProperty({ description: 'Columna autogenerada: behavior' })
  @Column({ type: 'text', nullable: true })
  behavior: string;

  @ApiProperty({ description: 'Columna autogenerada: colors' })
  @Column({ type: 'text', nullable: true })
  colors: string;

  @ApiProperty({ description: 'Columna autogenerada: authority' })
  @Column({ type: 'text', nullable: true })
  authority: string;

  @ApiProperty({ description: 'Columna autogenerada: gbif_link' })
  @Column({ type: 'text', nullable: true })
  gbif_link: string;

  @ApiProperty({ description: 'Columna autogenerada: wikiaves_link' })
  @Column({ type: 'text', nullable: true })
  wikiaves_link: string;

  @ApiProperty({ description: 'Columna autogenerada: ebird_link' })
  @Column({ type: 'text', nullable: true })
  ebird_link: string;

  @ApiProperty({ description: 'Columna autogenerada: other_sources' })
  @Column({ type: 'text', nullable: true })
  other_sources: string;

  @ApiProperty({ description: 'Columna autogenerada: base_image' })
  @Column({ type: 'text', nullable: true })
  base_image: string;

  @ApiProperty({ description: 'Columna autogenerada: image_copyright' })
  @Column({ type: 'text', nullable: true })
  image_copyright: string;

  @ApiProperty({ description: 'Columna autogenerada: habitat_id' })
  @Column({ type: 'int' })
  habitat_id: number;

  @ApiProperty({ description: 'Columna autogenerada: conservation_status_id' })
  @Column({ type: 'int' })
  conservation_status_id: number;

  @ApiProperty({ description: 'Columna autogenerada: family_id' })
  @Column({ type: 'int' })
  family_id: number;

  @ApiProperty({ description: 'Columna autogenerada: residency_type_id' })
  @Column({ type: 'int' })
  residency_type_id: number;

  @ApiProperty({ description: 'Columna autogenerada: feeding_type_id' })
  @Column({ type: 'int' })
  feeding_type_id: number;

  @ApiProperty({ description: 'Columna autogenerada: beak_morphology_id' })
  @Column({ type: 'int' })
  beak_morphology_id: number;

  @ApiProperty({ description: 'Columna autogenerada: wing_morphology_id' })
  @Column({ type: 'int' })
  wing_morphology_id: number;

  @ApiProperty({ description: 'Columna autogenerada: tail_morphology_id' })
  @Column({ type: 'int' })
  tail_morphology_id: number;

  @ApiProperty({ description: 'Columna autogenerada: leg_morphology_id' })
  @Column({ type: 'int' })
  leg_morphology_id: number;

  @ApiProperty({ description: 'Columna autogenerada: additional_info_id' })
  @Column({ type: 'int' })
  additional_info_id: number;

  @ApiProperty({ description: 'Columna autogenerada: last_modified' })
  @Column({ type: 'timestamp', nullable: true })
  last_modified: Date;

  @ApiProperty({ description: 'Columna autogenerada: sql_deleted' })
  @Column({ type: 'boolean', nullable: true })
  sql_deleted: boolean;
}
