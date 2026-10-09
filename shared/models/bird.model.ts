/**
 * @sdd
 * - [Objetivo]: Definición exhaustiva de la taxonomía de un ave.
 * - [I/O]: Usado en la Ficha Taxonómica del Frontend y la base de datos del Backend.
 * - [Edge Cases]: Campos como externalLinks pueden estar vacíos; vulnerabilidad sujeta a cambios de la UICN.
 */
export interface BirdTaxonomy {
  /** Propiedad id: campo del modelo de dominio. */
  id: string;
  /** Propiedad scientificName: campo del modelo de dominio. */
  scientificName: string;
  /** Propiedad englishName: campo del modelo de dominio. */
  englishName: string;
  /** Propiedad spanishName: campo del modelo de dominio. */
  spanishName: string;
  /** Propiedad order: campo del modelo de dominio. */
  order: string;
  /** Propiedad family: campo del modelo de dominio. */
  family: string;
  /** Propiedad vulnerabilityStatus: campo del modelo de dominio. */
  vulnerabilityStatus: string; // Ej: LC, NT, VU, EN, CR
  /** Propiedad difficultyToSpot: campo del modelo de dominio. */
  difficultyToSpot: number; // Rango: 1 a 5
  /** Propiedad altitudeRange: campo del modelo de dominio. */
  altitudeRange: { min: number; max: number };
  /** Propiedad diet: campo del modelo de dominio. */
  diet: string;
  /** Propiedad sizeCm: campo del modelo de dominio. */
  sizeCm: number;
  /** Propiedad habitat: campo del modelo de dominio. */
  habitat: string;
  /** Propiedad residenceStatus: campo del modelo de dominio. */
  residenceStatus: string; // Migratoria, Residente, Endémica
  /** Propiedad behavior: campo del modelo de dominio. */
  behavior: string;
  /** Propiedad morphologyDescription: campo del modelo de dominio. */
  morphologyDescription: string;
  /** Propiedad externalLinks: campo del modelo de dominio. */
  externalLinks: string[];
}
