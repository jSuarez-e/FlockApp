/**
 * @sdd
 * - [Objetivo]: Representa una respuesta (comentario) a un post del feed global.
 * - [I/O]: Expone propiedades para el cliente y metadatos de TypeORM.
 * - [Edge Cases]: Se relaciona con FeedPostEntity (Muchos a Uno).
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FeedPostEntity } from './feed-post.entity';

@Entity('feed_replies')
export class FeedReplyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  postId: string;

  @Column({ type: 'uuid' })
  authorId: string;

  @Column({ type: 'varchar', length: 255 })
  authorName: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  authorAvatarUrl: string | null;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => FeedPostEntity, (post) => post.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: FeedPostEntity;
}
