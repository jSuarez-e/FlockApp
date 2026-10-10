/**
 * @sdd
 * - [Objetivo]: Servicio de Angular para manejar las peticiones HTTP de Sincronización.
 * - [I/O]: Expone métodos asíncronos que devuelven Observables de catálogos y envían actualizaciones.
 * - [Edge Cases]: Se inyecta en el SyncQueueStore cumpliendo el Single Responsibility Principle.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISyncCatalogsResponse } from '../../../../../shared/models/catalogs.interface';
import { environment } from '../../../environments/environment';

/**
 *
 */
@Injectable({ providedIn: 'root' })
/**
 * Elemento documentado.
 */
export class SyncService {
  /**
   * Elemento documentado.
   */
  private http = inject(HttpClient);

  /**
   * Elemento documentado.
   * @param payload
   */
  pushChanges(payload: unknown): Observable<unknown> {
    return this.http.post(`${environment.apiUrl}/sync/push`, payload);
  }

  /**
   * Elemento documentado.
   * @param lastSync
   */
  pullCatalogs(lastSync: number): Observable<ISyncCatalogsResponse> {
    return this.http.get<ISyncCatalogsResponse>(
      `${environment.apiUrl}/sync/catalogs?lastSync=${lastSync}`,
    );
  }
}
