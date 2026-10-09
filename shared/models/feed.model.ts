/**
 * @sdd
 * - [Objetivo]: Contrato compartido para publicaciones del Feed Global.
 * - [I/O]: Usado por el cliente Angular y la API NestJS para la transferencia de datos y tipado.
 * - [Edge Cases]: La propiedad location puede ser nula si el usuario denegó los permisos de GPS.
 */
/**
 * Tipo que representa el rol o modo desde el cual se originó la publicación.
 */
export type FeedAuthorType = 'PAJARERO' | 'SITIO' | 'GUIA';

export interface FeedPost {
  /** Propiedad del modelo: id. */
  id: string;
  /** Propiedad del modelo: authorId. */
  authorId: string;
  /** Propiedad del modelo: authorName. */
  authorName: string;
  /** Propiedad del modelo: authorAvatarUrl. */
  authorAvatarUrl?: string;
  /** Modo o rol desde el cual se originó la publicación ('PAJARERO' | 'SITIO' | 'GUIA'). */
  authorType?: FeedAuthorType;
  /** Identificador de destino (ID de Sitio o de Guía) si difiere de authorId. */
  targetProfileId?: string;
  /** Propiedad del modelo: title. */
  title: string;
  /** Propiedad del modelo: description. */
  description: string;
  /** Propiedad del modelo: imageUrl. */
  imageUrl: string;
  /** Propiedad del modelo: location. */
  location: { lat: number; lng: number } | null;
  /** Propiedad del modelo: createdAt. */
  createdAt: string; // ISO 8601 string para cursor pagination
  /** Propiedad del modelo: repliesCount. */
  repliesCount: number;
  /** Propiedad del modelo: savesCount. */
  savesCount: number;
  /** Propiedad del modelo: needsIdentification. */
  needsIdentification?: boolean;
  /** Propiedad del modelo: routeId. */
  routeId?: string;
}

export interface FeedReply {
  /** Propiedad del modelo: id. */
  id: string;
  /** Propiedad del modelo: postId. */
  postId: string;
  /** Propiedad del modelo: authorId. */
  authorId: string;
  /** Propiedad del modelo: authorName. */
  authorName: string;
  /** Propiedad del modelo: authorAvatarUrl. */
  authorAvatarUrl?: string;
  /** Propiedad del modelo: content. */
  content: string;
  /** Propiedad del modelo: createdAt. */
  createdAt: string;
}

export interface FeedFavorite {
  /** Propiedad del modelo: userId. */
  userId: string;
  /** Propiedad del modelo: postId. */
  postId: string;
}
