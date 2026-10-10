/**
 * @sdd
 * - [Objetivo]: Store reactivo de Sitios de Aviturismo (NgRx SignalStore) con carga directa de Postgres y soporte offline.
 * - [I/O]: Inyecta SiteService para consultar la API backend y DbHelperService como cache/fallback local.
 * - [Edge Cases]: Asimetría cero con Guías, tolerancia a ausencia de red y tipado estricto.
 */
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { DbHelperService } from '../services/db-helper.service';
import { SiteService } from '../services/site.service';
import { ISite } from '../../../../../shared/models/catalogs.interface';
import { firstValueFrom } from 'rxjs';
import { logger } from '../utils/logger';

/**
 * Estado reactivo del almacén de sitios de aviturismo.
 */
export interface SiteState {
  /** Mapa de sitios indexados por su identificador único O(1) */
  sitesMap: Record<string, ISite>;
  /** Indicador de operación de carga en progreso */
  isLoading: boolean;
}

const initialState: SiteState = {
  sitesMap: {},
  isLoading: false,
};

/**
 * Persiste los sitios remotos en la base de datos local SQLite para soporte offline.
 * @param db Instancia de DbHelperService.
 * @param sites Lista de sitios recuperados desde Postgres.
 */
async function persistSitesToSqlite(db: DbHelperService, sites: ISite[]): Promise<void> {
  for (const s of sites) {
    try {
      const lat = s.location ? s.location.lat : null;
      const lng = s.location ? s.location.lng : null;
      await db.query(
        `INSERT INTO sites (id, name, department, municipality, rating, description, cover_url, logo_url, contact_phone, contact_whatsapp, website, instagram, facebook, has_bird_checklist, geo_lat, geo_lng, last_modified, sql_deleted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, strftime('%s', 'now'), 0)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           department = excluded.department,
           municipality = excluded.municipality,
           rating = excluded.rating,
           description = excluded.description,
           cover_url = excluded.cover_url,
           logo_url = excluded.logo_url,
           contact_phone = excluded.contact_phone,
           contact_whatsapp = excluded.contact_whatsapp,
           website = excluded.website,
           instagram = excluded.instagram,
           facebook = excluded.facebook,
           has_bird_checklist = excluded.has_bird_checklist,
           geo_lat = excluded.geo_lat,
           geo_lng = excluded.geo_lng,
           sql_deleted = 0`,
        [
          s.id,
          s.name,
          s.department || '',
          s.municipality || '',
          s.rating || 5,
          s.description || '',
          s.cover_url || s.photoUrl || '',
          s.logo_url || '',
          s.contact_phone || '',
          s.contact_whatsapp || '',
          s.website || '',
          s.instagram || '',
          s.facebook || '',
          s.has_bird_checklist ? 1 : 0,
          lat,
          lng,
        ],
      );
    } catch {
      // Tolerancia si SQLite no está disponible en web
    }
  }
}

/**
 * Carga los sitios de aviturismo desde SQLite como fallback en caso de error de red.
 * @param db Instancia de DbHelperService.
 * @returns Diccionario de sitios mapeados.
 */
async function loadSitesFromSqlite(db: DbHelperService): Promise<Record<string, ISite>> {
  const result = await db.query('SELECT * FROM sites WHERE sql_deleted = 0');
  const map: Record<string, ISite> = {};
  for (const item of result) {
    const siteRow = item as Record<string, unknown>;
    const rawLat = Number(siteRow['geo_lat']);
    const rawLng = Number(siteRow['geo_lng']);
    const hasValidLoc =
      !isNaN(rawLat) &&
      !isNaN(rawLng) &&
      (Math.abs(rawLat) > 0.0001 || Math.abs(rawLng) > 0.0001);

    map[String(siteRow['id'])] = {
      ...siteRow,
      photoUrl:
        (siteRow['cover_url'] as string) ||
        (siteRow['logo_url'] as string) ||
        (siteRow['photoUrl'] as string) ||
        '',
      has_bird_checklist: Boolean(siteRow['has_bird_checklist']),
      location: hasValidLoc ? { lat: rawLat, lng: rawLng } : null,
      services: siteRow['services'] ? JSON.parse(siteRow['services'] as string) : [],
      prices: siteRow['prices'] ? JSON.parse(siteRow['prices'] as string) : {},
      routeGeoJson: siteRow['route_geo_json']
        ? JSON.parse(siteRow['route_geo_json'] as string)
        : null,
    } as unknown as ISite;
  }
  return map;
}

export const SiteStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    allSites: computed(() =>
      Object.values(store.sitesMap()).sort((a, b) => a.name.localeCompare(b.name)),
    ),
  })),
  withMethods((store, siteService = inject(SiteService), db = inject(DbHelperService)) => ({
    /**
     * Carga todos los sitios de aviturismo consultando directamente el backend Postgres,
     * persistiendo el resultado en SQLite local como cache y respaldando offline si falla la red.
     * @returns Promesa resuelta tras actualizar el estado reactivo.
     */
    async loadSites(): Promise<void> {
      patchState(store, { isLoading: true });
      try {
        const sites = await firstValueFrom(siteService.getSites());
        const map: Record<string, ISite> = {};
        if (sites && Array.isArray(sites)) {
          for (const s of sites) {
            map[s.id] = s;
          }
          await persistSitesToSqlite(db, sites);
        }
        patchState(store, { sitesMap: map, isLoading: false });
      } catch (onlineErr) {
        logger.warn('Fallo consulta online de sitios, recurriendo a cache SQLite:', onlineErr);
        try {
          const localMap = await loadSitesFromSqlite(db);
          patchState(store, { sitesMap: localMap, isLoading: false });
        } catch (sqliteErr) {
          logger.error('Error cargando sitios locales:', sqliteErr);
          patchState(store, { isLoading: false });
        }
      }
    },
    /**
     * Obtiene un sitio por su identificador único desde el diccionario reactivo en memoria O(1).
     * @param id Identificador único del sitio.
     * @returns El objeto del sitio o undefined si no existe.
     */
    getSiteById(id: string): ISite | undefined {
      return store.sitesMap()[id];
    },
  })),
);
