/**
 * @description Define los tipos de vista disponibles en el Dashboard.
 * SELECTOR: Pantalla de elección para usuarios con rol 'BOTH'.
 */
export type DashboardView = 'PAJARERO' | 'PROVEEDOR' | 'SELECTOR';

/**
 * @description Interfaz para los elementos del Feed Social de Avistamientos.
 * Alineado con la entidad 'Avistamiento' del Context Map.
 */
export interface ISightingFeedItem {
  /**
   *
   */
  id: string;
  /**
   *
   */
  userId: string;
  /**
   *
   */
  userName: string;
  /**
   *
   */
  userAvatar?: string;
  /**
   *
   */
  speciesName: string;
  /**
   *
   */
  scientificName: string;
  /**
   *
   */
  photoUrl: string;
  /**
   *
   */
  description: string;
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
  likesCount: number;
  /**
   *
   */
  isFavorite: boolean;
  /**
   *
   */
  isOwnPost: boolean;
  /**
   *
   */
  createdAt: string | Date;
}

/**
 * @description Contrato para la información resumida del Proveedor.
 */
export interface IProviderDashboardData {
  /**
   *
   */
  businessName: string;
  /**
   *
   */
  rnt?: string;
  /**
   *
   */
  profilePhoto: string;
  /**
   *
   */
  coverPhoto: string;
  /**
   *
   */
  description: string;
  /**
   *
   */
  rating: number;
  /**
   *
   */
  totalServices: number;
}
