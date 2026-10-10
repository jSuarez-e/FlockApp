import { User } from './auth.models';

/**
 * @description Estados de sincronización para el modo Offline-First.
 */
export type SyncStatus = 'PENDING' | 'SYNCED' | 'ERROR';

/**
 * @interface Sighting
 * @description Estructura base de un avistamiento de ave en FlockApp.
 */
export interface Sighting {
  /**
   *
   */
  id?: string | number;
  /**
   *
   */
  userId: string | number;
  /**
   *
   */
  speciesId: number;
  /**
   *
   */
  latitude: number;
  /**
   *
   */
  longitude: number;
  /**
   *
   */
  description: string;
  /**
   *
   */
  photoUrl: string; // URL de la nube o Base64 temporal
  /**
   *
   */
  createdAt: string;

  // Metadatos de UI
  /**
   *
   */
  user?: Partial<User>;
  /**
   *
   */
  likesCount?: number;
  /**
   *
   */
  isFavorite?: boolean;

  // Propiedades exclusivas de SQLite (Offline)
  /**
   *
   */
  syncStatus?: SyncStatus;
  /**
   *
   */
  localPath?: string;
}
