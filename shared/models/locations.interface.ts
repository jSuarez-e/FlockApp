/**
 * @sdd
 * [Objetivo]: Contratos compartidos para geocodificación inversa y localización territorial.
 * [I/O]: IReverseGeocodeResponse utilizado por backend LocationsController y frontend GeographyService.
 * [Edge Cases]: Soporta null cuando la coordenada no pertenece al territorio colombiano o no se resuelve municipio.
 */

/**
 * @interface IReverseGeocodeResponse
 * @description Representa la respuesta normalizada de jerarquía territorial tras geocodificación inversa.
 */
export interface IReverseGeocodeResponse {
  /** Nombre del departamento detectado */
  departmentName: string | null;
  /** Nombre del municipio detectado */
  municipalityName: string | null;
}

