/**
 * @sdd
 * - [Objetivo]: Servicio Frontend para consultar sitios de aviturismo directamente desde el backend Postgres.
 * - [I/O]: Inyecta HttpClient y expone getSites(): Observable<ISite[]>.
 * - [Edge Cases]: Manejo de tipado estricto y asimetría cero con el catálogo backend.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISite } from '../../../../../shared/models/catalogs.interface';
import { environment } from '../../../environments/environment';

/**
 * Servicio Angular para consultar sitios de aviturismo desde la API backend.
 */
@Injectable({
  providedIn: 'root',
})
export class SiteService {
  /** Cliente HTTP de Angular */
  private readonly http = inject(HttpClient);

  /**
   * Obtiene la lista completa de sitios de aviturismo públicos desde Postgres.
   * @returns Flujo observable con la colección de sitios.
   */
  getSites(): Observable<ISite[]> {
    return this.http.get<ISite[]>(`${environment.apiUrl}/sites`);
  }
}
