/**
 * @sdd
 * - [Objetivo]: Lógica de negocio core para el Feed Global.
 * - [I/O]: Maneja la inserción de FeedPosts y las consultas paginadas por cursor.
 * - [Edge Cases]: La paginación requiere un cursor válido o null para el arranque.
 */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedPostEntity } from '../../infrastructure/entities/feed-post.entity';
import { FeedFavoriteEntity } from '../../infrastructure/entities/feed-favorite.entity';
import { FeedReplyEntity } from '../../infrastructure/entities/feed-reply.entity';
import { CreateFeedPostDto } from '../../infrastructure/dtos/feed/create-feed-post.dto';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedPostEntity)
    private readonly feedRepository: Repository<FeedPostEntity>,
    @InjectRepository(FeedFavoriteEntity)
    private readonly feedFavoriteRepository: Repository<FeedFavoriteEntity>,
    @InjectRepository(FeedReplyEntity)
    private readonly feedReplyRepository: Repository<FeedReplyEntity>,
  ) {}

  /**
   * Obtiene posts del feed ordenados descendentemente con paginación por cursor.
   * @param cursor Fecha ISO string, undefined si es la primera página.
   * @param limit Límite de resultados (default 20).
   * @returns Lista de posts y un string del siguiente cursor (fecha del último post).
   */
  async getGlobalFeed(
    cursor?: string,
    limit: number = 20,
  ): Promise<{ posts: FeedPostEntity[]; nextCursor: string | null }> {
    const query = this.feedRepository
      .createQueryBuilder('post')
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('post.id', 'DESC')
      .take(limit);

    if (cursor) {
      const cursorDate = new Date(cursor);
      if (isNaN(cursorDate.getTime())) {
        throw new BadRequestException(
          'Cursor inválido. Debe ser una fecha ISO.',
        );
      }
      query.where('post.createdAt < :cursor', { cursor: cursorDate });
    }

    const posts = await query.getMany();
    let nextCursor: string | null = null;

    // Si la DB devolvió exactamente la cantidad solicitada, podría haber más data.
    if (posts.length === limit) {
      nextCursor = posts[posts.length - 1].createdAt.toISOString();
    }

    return { posts, nextCursor };
  }

  /**
   * Guarda un nuevo registro en el feed.
   * @param dto Objeto validado con la información del post.
   * @param fileUrl URL de la imagen en S3/CDN.
   * @param userId UUID del autor.
   * @param userName Nombre del autor.
   * @returns Entidad persistida.
   */
  async publishPost(
    dto: CreateFeedPostDto,
    fileUrl: string | null,
    userId: string,
    userName: string,
    authorAvatarUrl?: string,
  ) {
    const newPost = this.feedRepository.create({
      authorId: userId,
      authorName: userName,
      authorAvatarUrl: authorAvatarUrl || null,
      authorType: dto.authorType || 'PAJARERO',
      targetProfileId: dto.targetProfileId || null,
      title: dto.title,
      description: dto.description,
      imageUrl: fileUrl,
      lat: dto.lat || null,
      lng: dto.lng || null,
      birdId: dto.birdId || null,
      needsIdentification: dto.needsIdentification || false,
      routeId: dto.routeId || null,
    });
    return await this.feedRepository.save(newPost);
  }

  /**
   * Obtiene todos los registros (sightings) de un ave específica reportada por un usuario.
   * @param birdId ID del ave a consultar.
   * @param userId ID del usuario actual.
   * @returns Lista de coordenadas formateadas o entidades base.
   */
  async getMySightingsByBird(birdId: string, userId: string) {
    return this.feedRepository.find({
      where: { birdId, authorId: userId },
      select: ['id', 'lat', 'lng', 'createdAt'],
    });
  }

  /**
   * Obtiene lista agregada de especies vistas.
   * @param userId ID del usuario actual.
   * @returns Array de registros de especies agrupados.
   */
  async getMyRecords(userId: string) {
    return this.feedRepository
      .createQueryBuilder('post')
      .select('post.birdId', 'birdId')
      .addSelect('COUNT(post.id)', 'sightingsCount')
      .where('post.authorId = :userId', { userId })
      .andWhere('post.birdId IS NOT NULL')
      .groupBy('post.birdId')
      .getRawMany();
  }

  /**
   * Agrega o quita un like (favorite) a un post del feed
   */
  async toggleFavorite(
    postId: string,
    userId: string,
  ): Promise<{ isFavorited: boolean }> {
    const post = await this.feedRepository.findOne({ where: { id: postId } });
    if (!post) throw new BadRequestException('Post not found');

    const favorite = await this.feedFavoriteRepository.findOne({
      where: { postId, userId },
    });
    if (favorite) {
      await this.feedFavoriteRepository.remove(favorite);
      // Decrementar cache (optimista) en el post, si tuviéramos un contador en el feed (opcional)
      await this.feedRepository.decrement({ id: postId }, 'savesCount', 1);
      return { isFavorited: false };
    } else {
      const newFav = this.feedFavoriteRepository.create({ postId, userId });
      await this.feedFavoriteRepository.save(newFav);
      await this.feedRepository.increment({ id: postId }, 'savesCount', 1);
      return { isFavorited: true };
    }
  }

  /**
   * Añade una respuesta a un post del feed
   */
  async addReply(
    postId: string,
    userId: string,
    userName: string,
    content: string,
    userAvatar?: string,
  ) {
    const post = await this.feedRepository.findOne({ where: { id: postId } });
    if (!post) throw new BadRequestException('Post not found');

    const reply = this.feedReplyRepository.create({
      post,
      authorId: userId,
      authorName: userName,
      authorAvatarUrl: userAvatar || null,
      content,
    });

    const savedReply = await this.feedReplyRepository.save(reply);
    await this.feedRepository.increment({ id: postId }, 'repliesCount', 1);

    return {
      id: savedReply.id,
      content: savedReply.content,
      authorName: savedReply.authorName,
      authorAvatarUrl: savedReply.authorAvatarUrl,
      createdAt: savedReply.createdAt,
    };
  }

  /**
   * Obtiene las respuestas de un post
   */
  async getReplies(postId: string) {
    return this.feedReplyRepository.find({
      where: { post: { id: postId } },
      order: { createdAt: 'ASC' },
    });
  }
}
