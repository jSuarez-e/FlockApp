/**
 * @sdd
 * - [Objetivo]: Entidad relacional para los Favoritos (Corazones) en el Feed Global.
 * - [I/O]: Almacena qué usuario le dio me gusta a qué post.
 * - [Edge Cases]: Llave primaria compuesta para evitar duplicados.
 */
import { Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('feed_favorites')
export class FeedFavoriteEntity {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @PrimaryColumn({ type: 'uuid' })
  postId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
