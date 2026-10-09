/**
 * @sdd
 * - [Objetivo]: Contrato compartido para la gestión de Sitios de Aviturismo (Modo Proveedor).
 * - [I/O]: DTOs e interfaces para perfil del sitio, productos/servicios y sincronización de checklist de aves.
 * - [Edge Cases]: Precios no negativos, tipado cerrado de tipo de servicio, redes y teléfonos opcionales.
 */
import { ISiteService } from './catalogs.interface';

/**
 * Coordenadas geográficas del sitio.
 */
export interface ISiteCoordinates {
  /** Latitud en grados decimales */
  lat: number;
  /** Longitud en grados decimales */
  lng: number;
}

/**
 * Modelo completo del perfil del Sitio desde la perspectiva del Proveedor.
 */
export interface ISiteProviderProfile {
  /** Identificador único del sitio (UUID/string) */
  id: string;
  /** ID del usuario propietario del sitio */
  owner_id?: string;
  /** Nombre del sitio o reserva natural */
  name: string;
  /** Departamento geográfico */
  department?: string;
  /** Municipio geográfico */
  municipality?: string;
  /** Descripción del sitio o reserva */
  description?: string;
  /** URL de la foto de portada del negocio */
  cover_url?: string;
  /** URL del logotipo oficial del negocio */
  logo_url?: string;
  /** Teléfono de contacto */
  contact_phone?: string;
  /** Número de WhatsApp de contacto */
  contact_whatsapp?: string;
  /** Enlace a página web oficial */
  website?: string;
  /** Usuario o enlace de Instagram */
  instagram?: string;
  /** Usuario o enlace de Facebook */
  facebook?: string;
  /** Calificación promedio obtenida (calculada por el sistema) */
  rating: number;
  /** Total de reseñas recibidas */
  total_reviews?: number;
  /** Indica si el sitio cuenta con checklist de aves propia */
  has_bird_checklist: boolean;
  /** Listado de servicios y productos asociados */
  services: ISiteService[];
  /** Cantidad de especies registradas en el checklist */
  birds_count: number;
  /** Coordenadas geográficas si están configuradas */
  location?: ISiteCoordinates | null;
}

/**
 * DTO para crear o actualizar los datos del Sitio de Aviturismo.
 */
export interface IUpdateSiteProfileDto {
  /** Nombre del sitio o reserva natural */
  name: string;
  /** Departamento */
  department?: string;
  /** Municipio */
  municipality?: string;
  /** Descripción del sitio o reserva */
  description?: string;
  /** URL de la portada del negocio */
  cover_url?: string;
  /** URL del logo */
  logo_url?: string;
  /** Teléfono de contacto */
  contact_phone?: string;
  /** Número de WhatsApp */
  contact_whatsapp?: string;
  /** Sitio web oficial */
  website?: string;
  /** Red social Instagram */
  instagram?: string;
  /** Red social Facebook */
  facebook?: string;
  /** Indicador de si manejan checklist de aves */
  has_bird_checklist?: boolean;
  /** Latitud GPS en grados decimales */
  latitude?: number;
  /** Longitud GPS en grados decimales */
  longitude?: number;
}

/**
 * DTO para crear un producto o servicio del sitio.
 */
export interface ICreateSiteServiceDto {
  /** Tipo de oferta */
  type: 'service' | 'product' | 'other';
  /** Nombre descriptivo del producto o servicio */
  name: string;
  /** Descripción de lo que incluye */
  description?: string;
  /** Precio en COP */
  price: number;
  /** Foto representativa opcional */
  photo_url?: string;
}

/**
 * DTO para sincronizar el checklist de aves del sitio.
 */
export interface ISyncSiteBirdsDto {
  /** Listado de IDs de aves asociadas a este sitio */
  birdIds: number[];
}
