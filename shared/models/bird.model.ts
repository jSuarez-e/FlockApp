/**
 * @sdd
 * - [Objetivo]: Definición exhaustiva de la taxonomía de un ave.
 * - [I/O]: Usado en la Ficha Taxonómica del Frontend y la base de datos del Backend.
 * - [Edge Cases]: Campos como externalLinks pueden estar vacíos; vulnerabilidad sujeta a cambios de la UICN.
 */
export interface BirdTaxonomy {
  id: string;
  scientificName: string;
  englishName: string;
  spanishName: string;
  order: string;
  family: string;
  vulnerabilityStatus: string; // Ej: LC, NT, VU, EN, CR
  difficultyToSpot: number; // Rango: 1 a 5
  altitudeRange: { min: number; max: number };
  diet: string;
  sizeCm: number;
  habitat: string;
  residenceStatus: string; // Migratoria, Residente, Endémica
  behavior: string;
  morphologyDescription: string;
  externalLinks: string[];
}
