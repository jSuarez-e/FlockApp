/**
 * @sdd
 * @description TypeORM entity for site ratings.
 */
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SiteEntity } from './site.entity';

@Entity('site_ratings')
export class SiteRatingEntity {
  @ApiProperty({ description: 'ID único del rating' })
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @ApiProperty({ description: 'ID del sitio' })
  @Column({ type: 'varchar', length: 255 })
  site_id: string;

  @ApiProperty({ description: 'ID del usuario' })
  @Column({ type: 'varchar', length: 255 })
  user_id: string;

  @ApiProperty({ description: 'Puntuación 1 a 5' })
  @Column({ type: 'float' })
  score: number;

  @ApiProperty({ description: 'Comentario opcional' })
  @Column({ type: 'text', nullable: true })
  comment: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Columna autogenerada: last_modified' })
  @Column({ type: 'timestamp', nullable: true })
  last_modified: Date;

  @ApiProperty({ description: 'Columna autogenerada: sql_deleted' })
  @Column({ type: 'boolean', nullable: true })
  sql_deleted: boolean;

  @ManyToOne(() => SiteEntity, (site) => site.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: SiteEntity;
}
