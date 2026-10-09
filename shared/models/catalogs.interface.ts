/**
 * @sdd
 * @description Shared domain contracts for Guides and Sites (Offline-first Catalogs).
 * @io Used by both NestJS API (DTOs/Responses) and Angular SignalStores.
 * @edge_cases Coordinates mapped to lat/lng instead of PostGIS Point object for Frontend compatibility.
 */

export interface IGuide {
  /** Propiedad id: campo del modelo de dominio. */
  id: string;
  /** Propiedad fullName: campo del modelo de dominio. */
  fullName: string;
  /** Propiedad location: campo del modelo de dominio. */
  location: string;
  /** Propiedad specialty: campo del modelo de dominio. */
  specialty: string;
  /** Propiedad rating: campo del modelo de dominio. */
  rating: number;
  /** Propiedad photoUrl: campo del modelo de dominio. */
  photoUrl: string;
  /** Propiedad coverUrl: campo del modelo de dominio. */
  coverUrl?: string;
  /** Propiedad details: campo del modelo de dominio. */
  details: string;
  /** Propiedad languages: campo del modelo de dominio. */
  languages?: string;
  /** Propiedad bio: campo del modelo de dominio. */
  bio?: string;
  /** Propiedad phone: campo del modelo de dominio. */
  phone?: string;
  /** Propiedad hasWhatsapp: indica si el teléfono cuenta con WhatsApp. */
  hasWhatsapp?: boolean;
  /** Propiedad instagram: enlace o usuario de Instagram. */
  instagram?: string;
  /** Propiedad website: página web oficial del guía. */
  website?: string;
  /** Propiedad email: correo electrónico de contacto. */
  email?: string;
  /** Propiedad rnt: Registro Nacional de Turismo. */
  rnt?: string;
  /** Propiedad isPublished: visibilidad en el directorio. */
  isPublished?: boolean;
  /** Propiedad last_modified: campo del modelo de dominio. */
  last_modified?: number;
  /** Propiedad sql_deleted: campo del modelo de dominio. */
  sql_deleted?: boolean;
}

export interface ISite {
  /** Propiedad id: campo del modelo de dominio. */
  id: string;
  /** Propiedad name: campo del modelo de dominio. */
  name: string;
  /** Propiedad department: campo del modelo de dominio. */
  department: string;
  /** Propiedad rating: campo del modelo de dominio. */
  rating: number;
  /** Propiedad description: campo del modelo de dominio. */
  description: string;
  /** Propiedad photoUrl: campo del modelo de dominio. */
  photoUrl?: string;
  /** Propiedad location: campo del modelo de dominio. */
  location: { lat: number; lng: number }; // Transformed from PostGIS
  /** Propiedad routeGeoJson: campo del modelo de dominio. */
  routeGeoJson: unknown;
  /** Propiedad expectedBirds: campo del modelo de dominio. */
  expectedBirds?: string[];
  /** Municipio geográfico */
  municipality?: string;
  /** Foto de portada del negocio */
  cover_url?: string;
  /** Logotipo del sitio */
  logo_url?: string;
  /** Teléfono de contacto */
  contact_phone?: string;
  /** Número de WhatsApp de contacto */
  contact_whatsapp?: string;
  /** Página web oficial */
  website?: string;
  /** Red social Instagram */
  instagram?: string;
  /** Red social Facebook */
  facebook?: string;
  /** Indicador de si el sitio cuenta con checklist de aves */
  has_bird_checklist?: boolean;
  /** Propiedad last_modified: campo del modelo de dominio. */
  last_modified?: number;
  /** Propiedad sql_deleted: campo del modelo de dominio. */
  sql_deleted?: boolean;
}

export interface ISiteService {
  /** Propiedad id: campo del modelo de dominio. */
  id: string;
  /** Propiedad site_id: campo del modelo de dominio. */
  site_id: string;
  /** Propiedad type: campo del modelo de dominio. */
  type: 'service' | 'product' | 'other';
  /** Propiedad name: campo del modelo de dominio. */
  name: string;
  /** Propiedad description: campo del modelo de dominio. */
  description: string;
  /** Propiedad photoUrl: campo del modelo de dominio. */
  photoUrl?: string;
  /** Propiedad price: campo del modelo de dominio. */
  price?: number;
  /** Propiedad last_modified: campo del modelo de dominio. */
  last_modified?: number;
  /** Propiedad sql_deleted: campo del modelo de dominio. */
  sql_deleted?: boolean;
}

export interface ISiteRating {
  /** Propiedad id: campo del modelo de dominio. */
  id: string;
  /** Propiedad site_id: campo del modelo de dominio. */
  site_id: string;
  /** Propiedad user_id: campo del modelo de dominio. */
  user_id: string;
  /** Propiedad score: campo del modelo de dominio. */
  score: number;
  /** Propiedad comment: campo del modelo de dominio. */
  comment?: string;
  /** Propiedad created_at: campo del modelo de dominio. */
  created_at?: number;
}

export interface IBirdCatalog {
  /** Propiedad id: campo del modelo de dominio. */
  id: number;
  /** Propiedad scientific_name: campo del modelo de dominio. */
  scientific_name: string;
  /** Propiedad english_name: campo del modelo de dominio. */
  english_name: string;
  /** Propiedad common_name: campo del modelo de dominio. */
  common_name: string;
  /** Propiedad min_altitude: campo del modelo de dominio. */
  min_altitude: number;
  /** Propiedad max_altitude: campo del modelo de dominio. */
  max_altitude: number;
  /** Propiedad viewing_difficulty: campo del modelo de dominio. */
  viewing_difficulty: number;
  /** Propiedad size: campo del modelo de dominio. */
  size?: number;
  /** Propiedad environment: campo del modelo de dominio. */
  environment?: string;
  /** Propiedad behavior: campo del modelo de dominio. */
  behavior?: string;
  /** Propiedad colors: campo del modelo de dominio. */
  colors?: string;
  /** Propiedad authority: campo del modelo de dominio. */
  authority?: string;
  /** Propiedad gbif_link: campo del modelo de dominio. */
  gbif_link?: string;
  /** Propiedad wikiaves_link: campo del modelo de dominio. */
  wikiaves_link?: string;
  /** Propiedad ebird_link: campo del modelo de dominio. */
  ebird_link?: string;
  /** Propiedad other_sources: campo del modelo de dominio. */
  other_sources?: string;
  /** Propiedad base_image: campo del modelo de dominio. */
  base_image: string;
  /** Propiedad image_copyright: campo del modelo de dominio. */
  image_copyright?: string;
  /** Propiedad habitat_id: campo del modelo de dominio. */
  habitat_id: number;
  /** Propiedad conservation_status_id: campo del modelo de dominio. */
  conservation_status_id: number;
  /** Propiedad family_id: campo del modelo de dominio. */
  family_id: number;
  /** Propiedad residency_type_id: campo del modelo de dominio. */
  residency_type_id: number;
  /** Propiedad feeding_type_id: campo del modelo de dominio. */
  feeding_type_id: number;
  /** Propiedad beak_morphology_id: campo del modelo de dominio. */
  beak_morphology_id: number;
  /** Propiedad wing_morphology_id: campo del modelo de dominio. */
  wing_morphology_id: number;
  /** Propiedad tail_morphology_id: campo del modelo de dominio. */
  tail_morphology_id: number;
  /** Propiedad leg_morphology_id: campo del modelo de dominio. */
  leg_morphology_id: number;
  /** Propiedad additional_info_id: campo del modelo de dominio. */
  additional_info_id: number;
  /** Propiedad last_modified: campo del modelo de dominio. */
  last_modified: string;
  /** Propiedad sql_deleted: campo del modelo de dominio. */
  sql_deleted: boolean;
}

export interface ISyncCatalogsResponse {
  /** Propiedad guides: campo del modelo de dominio. */
  guides: IGuide[];
  /** Propiedad sites: campo del modelo de dominio. */
  sites: ISite[];
  /** Propiedad site_services: campo del modelo de dominio. */
  site_services: ISiteService[];
  /** Propiedad site_birds: campo del modelo de dominio. */
  site_birds: { site_id: string; bird_id: string }[];
  /** Propiedad timestamp: campo del modelo de dominio. */
  timestamp: number;
  /** Propiedad departments: campo del modelo de dominio. */
  departments?: { id: number; name: string; sql_deleted?: boolean }[];
  /** Propiedad municipalities: campo del modelo de dominio. */
  municipalities?: { id: number; department_id: number; name: string; sql_deleted?: boolean }[];
  /** Propiedad birds: campo del modelo de dominio. */
  birds?: IBirdCatalog[];
}
