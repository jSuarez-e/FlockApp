/**
 * @sdd
 * - [Objetivo]: Representa un post en el feed global en la base de datos (PostgreSQL).
 * - [I/O]: Expone propiedades para el cliente y metadatos de TypeORM.
 * - [Edge Cases]: Uso de lat/lng para simplificar la renderización de puntos en el mapa.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('feed_posts')
export class FeedPostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  authorId: string;

  @Column({ type: 'varchar', length: 255 })
  authorName: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  authorAvatarUrl: string | null;

  @Column({ type: 'varchar', length: 50, default: 'PAJARERO' })
  authorType: 'PAJARERO' | 'SITIO' | 'GUIA';

  @Column({ type: 'varchar', length: 255, nullable: true })
  targetProfileId: string | null;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  imageUrl: string;

  @Column({ type: 'float', nullable: true })
  lat: number | null;

  @Column({ type: 'float', nullable: true })
  lng: number | null;

  @Column({ type: 'uuid', nullable: true })
  birdId: string | null;

  @Column({ type: 'uuid', nullable: true })
  routeId: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'int', default: 0 })
  repliesCount: number;

  @Column({ type: 'int', default: 0 })
  savesCount: number;

  @Column({ type: 'boolean', default: false })
  needsIdentification: boolean;
}
