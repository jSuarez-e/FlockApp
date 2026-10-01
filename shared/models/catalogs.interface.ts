/**
 * @sdd
 * @description Shared domain contracts for Guides and Sites (Offline-first Catalogs).
 * @io Used by both NestJS API (DTOs/Responses) and Angular SignalStores.
 * @edge_cases Coordinates mapped to lat/lng instead of PostGIS Point object for Frontend compatibility.
 */

export interface IGuide {
  id: string;
  fullName: string;
  location: string;
  specialty: string;
  rating: number;
  photoUrl: string;
  details: string;
  languages?: string;
  bio?: string;
  phone?: string;
  last_modified?: number;
  sql_deleted?: boolean;
}

export interface ISite {
  id: string;
  name: string;
  department: string;
  rating: number;
  description: string;
  photoUrl?: string;
  location: { lat: number; lng: number }; // Transformed from PostGIS
  routeGeoJson: unknown;
  services: string[];
  prices: Record<string, string>;
  expectedBirds?: string[];
  last_modified?: number;
  sql_deleted?: boolean;
}

export interface IBirdCatalog {
  id: number;
  scientific_name: string;
  english_name: string;
  common_name: string;
  min_altitude: number;
  max_altitude: number;
  viewing_difficulty: number;
  size?: number;
  environment?: string;
  behavior?: string;
  colors?: string;
  authority?: string;
  gbif_link?: string;
  wikiaves_link?: string;
  ebird_link?: string;
  other_sources?: string;
  base_image: string;
  image_copyright?: string;
  habitat_id: number;
  conservation_status_id: number;
  family_id: number;
  residency_type_id: number;
  feeding_type_id: number;
  beak_morphology_id: number;
  wing_morphology_id: number;
  tail_morphology_id: number;
  leg_morphology_id: number;
  additional_info_id: number;
  last_modified: string;
  sql_deleted: boolean;
}

export interface ISyncCatalogsResponse {
  guides: IGuide[];
  sites: ISite[];
  site_birds: { site_id: string; bird_id: string }[];
  timestamp: number;
  departments?: { id: number; name: string; sql_deleted?: boolean }[];
  municipalities?: { id: number; department_id: number; name: string; sql_deleted?: boolean }[];
  birds?: IBirdCatalog[];
}
