/**
 * @file birds.interfaces.ts
 * @description Contract definitions for bird-related entities (19 tables).
 * Uses snake_case for properties mapping directly to DB columns.
 */

/**
 *
 */
export interface IFamily {
  /**
   *
   */
  id: number;
  /**
   *
   */
  description: string;
  /**
   *
   */
  order_id: number;
  /**
   *
   */
  total_birds?: number;
  /**
   *
   */
  bird_types?: string;
  /**
   *
   */
  last_modified?: number;
}

/**
 *
 */
export interface IConservationStatus {
  /**
   *
   */
  id: number;
  /**
   *
   */
  description: string;
  /**
   *
   */
  english_description: string;
  /**
   *
   */
  convention: string;
  /**
   *
   */
  image_url: string;
}

/**
 *
 */
export interface IHabitat {
  /**
   *
   */
  id: number;
  /**
   *
   */
  description: string;
  /**
   *
   */
  english_description: string;
}

/**
 * @description Model for search results and list rendering.
 * Optimized for performance with relational descriptors.
 */
export interface IBirdSearch {
  /**
   *
   */
  id: number;
  /**
   *
   */
  scientific_name: string;
  /**
   *
   */
  english_name: string;
  /**
   *
   */
  common_name: string;
  /**
   *
   */
  min_altitude: number;
  /**
   *
   */
  max_altitude: number;
  /**
   *
   */
  viewing_difficulty: number;
  /**
   *
   */
  base_image: string;
  /**
   *
   */
  family_id: number;
  /**
   *
   */
  conservation_status_id: number;
  /**
   *
   */
  habitat_id: number;
  /**
   *
   */
  family_description?: string;
  /**
   *
   */
  conservation_convention?: string;
  /**
   *
   */
  residency_type_id?: number;
  /**
   *
   */
  order_id?: number;
  /**
   *
   */
  department_id?: number; // ID virtual de control asignado por la selección del filtro modal
  /**
   *
   */
  size?: number; // Dimensión métrica física del ave
  /**
   *
   */
  size_id?: number; // ID virtual para los rangos fijos de tamaño
  /**
   *
   */
  department_ids?: string; // Colección de IDs geográficos agregados por GROUP_CONCAT en SQLite (R5)
  /** Descripción textual del tipo de residencia (ej: 'Residente', 'Migratoria') */
  residency_description?: string;
  /** Nombre del orden taxonómico */
  order_name?: string;
  /** Descripción del hábitat preferido */
  habitat_description?: string;
  /** Tipo de alimentación */
  feeding_description?: string;
  /** Descripción textual del estado de conservación UICN */
  conservation_status_description?: string;
  /** Descripción del entorno natural */
  environment?: string;
  /** Descripción del comportamiento observado */
  behavior?: string;
  /** Descripción de los patrones cromáticos */
  colors?: string;
  /** Autoridad taxonómica que describió la especie */
  authority?: string;
  /** Créditos de autoría de la fotografía */
  image_copyright?: string;
  /** Enlace a la ficha en GBIF */
  gbif_link?: string;
  /** Enlace a la ficha en WikiAves */
  wikiaves_link?: string;
  /** Enlace a la ficha en eBird */
  ebird_link?: string;
  /** Otras fuentes bibliográficas */
  other_sources?: string;
  /** Descripción morfológica del pico */
  beak_morphology_description?: string;
  /** Descripción morfológica de las alas */
  wing_morphology_description?: string;
  /** Descripción morfológica de la cola */
  tail_morphology_description?: string;
  /** Descripción morfológica de las patas */
  leg_morphology_description?: string;
}

/**
 * @description Detailed bird model for extended information (Step 13).
 */
export interface IBirdDetail {
  /**
   *
   */
  id: number;
  /**
   *
   */
  scientific_name: string;
  /**
   *
   */
  english_name: string;
  /**
   *
   */
  common_name: string;
  /**
   *
   */
  min_altitude: number;
  /**
   *
   */
  max_altitude: number;
  /**
   *
   */
  viewing_difficulty: number;
  /**
   *
   */
  size?: number;
  /**
   *
   */
  environment?: string;
  /**
   *
   */
  behavior?: string;
  /**
   *
   */
  colors?: string;
  /**
   *
   */
  authority?: string;
  /**
   *
   */
  gbif_link?: string;
  /**
   *
   */
  wikiaves_link?: string;
  /**
   *
   */
  ebird_link?: string;
  /**
   *
   */
  other_sources?: string;
  /**
   *
   */
  base_image: string;
  /**
   *
   */
  image_copyright?: string;
  /**
   *
   */
  habitat_id: number;
  /**
   *
   */
  conservation_status_id: number;
  /**
   *
   */
  family_id: number;
  /**
   *
   */
  residency_type_id: number;
  /**
   *
   */
  feeding_type_id: number;
  /**
   *
   */
  beak_morphology_id: number;
  /**
   *
   */
  wing_morphology_id: number;
  /**
   *
   */
  tail_morphology_id: number;
  /**
   *
   */
  leg_morphology_id: number;
  /**
   *
   */
  additional_info_id: number;
  // UI descriptors
  /**
   *
   */
  habitat_description?: string;
  /**
   *
   */
  family_description?: string;
  /**
   *
   */
  feeding_description?: string;
}

/**
 *
 */
export interface IDepartment {
  /**
   *
   */
  id: number;
  /**
   *
   */
  name: string;
}

/**
 *
 */
export interface ITamanio {
  /**
   *
   */
  id: number;
  /**
   *
   */
  descripcion: string;
  /**
   *
   */
  tamanioMin: number;
  /**
   *
   */
  tamanioMax: number;
}
