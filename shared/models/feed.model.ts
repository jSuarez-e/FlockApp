/**
 * @sdd
 * - [Objetivo]: Contrato compartido para publicaciones del Feed Global.
 * - [I/O]: Usado por el cliente Angular y la API NestJS para la transferencia de datos y tipado.
 * - [Edge Cases]: La propiedad location puede ser nula si el usuario denegó los permisos de GPS.
 */
export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  title: string;
  description: string;
  imageUrl: string;
  location: { lat: number; lng: number } | null;
  createdAt: string; // ISO 8601 string para cursor pagination
  repliesCount: number;
  savesCount: number;
  needsIdentification?: boolean;
}

export interface FeedReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  createdAt: string;
}

export interface FeedFavorite {
  userId: string;
  postId: string;
}
