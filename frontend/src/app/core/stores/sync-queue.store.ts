/**
 * @sdd
 * @description Motor de Sincronización Base (Sync Queue Service) usando NgRx SignalStore.
 * @io Injects DbHelperService (SQLite) and SyncService. Pushes local changes to the backend and pulls remote changes.
 * @edge_cases Maneja pérdida de red, resolución de conflictos basada en 'last_modified' y soft-deletes ('sql_deleted').
 */
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { DbHelperService } from '../services/db-helper.service';
import { NetworkService } from '../services/network.service';
import { SyncService } from '../services/sync.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/auth.models';
import { logger } from '../utils/logger';

/**
 *
 */
export interface SyncState {
  /**
   *
   */
  isSyncing: boolean;
  /**
   *
   */
  lastSyncTimestamp: number;
  /**
   *
   */
  pendingChangesCount: number;
}

const initialState: SyncState = {
  isSyncing: false,
  lastSyncTimestamp: Number(localStorage.getItem('lastSyncTimestamp') || 0),
  pendingChangesCount: 0,
};

export const SyncQueueStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      db = inject(DbHelperService),
      syncService = inject(SyncService),
      network = inject(NetworkService),
      authService = inject(AuthService),
    ) => ({
      /**
       * Calcula la cantidad de avistamientos locales pendientes de sincronizar
       */
      async calculatePendingChanges() {
        try {
          const result = await db.query(
            `SELECT COUNT(*) as count FROM sightings WHERE last_modified > ?`,
            [store.lastSyncTimestamp()],
          );
          const count = Number(result[0]?.['count']) || 0;
          patchState(store, { pendingChangesCount: count });
        } catch (error) {
          logger.error('Error calculando cambios pendientes', error);
        }
      },

      /**
       * Inicia el proceso de sincronización con el backend (Push local -> Pull remoto)
       * @param force Ignora el intervalo de 5 minutos si es true
       */
      async executeSyncCycle(force: boolean = false) {
        if (store.isSyncing() || !network.isOnline()) {
          logger.warn('Sync omitido: Offline o ya en progreso.');
          return;
        }

        const now = Math.floor(Date.now() / 1000);
        const SYNC_INTERVAL = 5 * 60; // 5 minutos en segundos
        if (!force && now - store.lastSyncTimestamp() < SYNC_INTERVAL) {
          logger.debug(`Sync omitido: Han pasado menos de 5 minutos desde el último sync.`);
          return;
        }

        patchState(store, { isSyncing: true });

        try {
          // 1. PUSH: Enviar cambios locales al backend para el usuario actual
          const currentUserId = authService.currentUser()?.id;
          const pendingRoutes = currentUserId
            ? (((await db.query(
                `SELECT * FROM routes WHERE sync_status = 'pending_sync' AND status = 'COMPLETED' AND user_id = ?`,
                [currentUserId],
              )) || []) as Record<string, unknown>[])
            : [];

          const routesWithPendingSightings = currentUserId
            ? (((await db.query(
                `SELECT DISTINCT r.* FROM routes r
                 INNER JOIN route_sightings rs ON rs.route_id = r.id
                 WHERE rs.sync_status = 'pending_sync' AND r.status = 'COMPLETED' AND r.user_id = ?`,
                [currentUserId],
              )) || []) as Record<string, unknown>[])
            : [];

          const routeMap = new Map<string, Record<string, unknown>>();
          for (const r of [...pendingRoutes, ...routesWithPendingSightings]) {
            if (r['id']) {
              routeMap.set(String(r['id']), r);
            }
          }
          const routesToSync = Array.from(routeMap.values());

          // Cargar sesión para perfíles PENDING
          const session = await db.getSession();
          const pendingUsers: User[] = [];
          if (session && session.user_data) {
            const rawUser = session.user_data as unknown;
            const uObj =
              typeof rawUser === 'string'
                ? (JSON.parse(rawUser) as User)
                : (rawUser as User);
            const userRecord = uObj as unknown as Record<string, unknown>;
            if (userRecord['sync_status'] === 'PENDING') {
              pendingUsers.push(uObj);
            }
          }

          if (routesToSync.length > 0 || pendingUsers.length > 0) {
            const nestedRoutes: Record<string, unknown>[] = [];
            const syncedSightingIds: string[] = [];

            for (const route of routesToSync) {
              const routeId = String(route['id']);
              const sightings =
                ((await db.query(
                  `SELECT * FROM route_sightings WHERE route_id = ?`,
                  [routeId],
                )) || []) as Record<string, unknown>[];

              for (const s of sightings) {
                if (s['id']) {
                  syncedSightingIds.push(String(s['id']));
                }
              }

              nestedRoutes.push({
                ...route,
                sightings,
              });
            }

            const bulkPayload = { routes: nestedRoutes, users: pendingUsers };
            await syncService.pushChanges(bulkPayload).toPromise();

            // Una vez confirmada la subida a Postgres, limpiar de SQLite local (la BD local solo contiene datos offline)
            for (const route of routesToSync) {
              const rId = route['id'];
              try {
                await db.run(`DELETE FROM route_sightings WHERE route_id = ?`, [rId]);
                await db.run(`DELETE FROM routes WHERE id = ?`, [rId]);
              } catch (cleanErr) {
                logger.warn('[SyncQueue] Advertencia limpiando ruta en SQLite, marcando synced:', cleanErr);
                await db.run(`UPDATE routes SET sync_status = 'synced' WHERE id = ?`, [rId]);
              }
            }

            for (const sid of syncedSightingIds) {
              try {
                await db.run(`DELETE FROM route_sightings WHERE id = ?`, [sid]);
              } catch {
                await db.run(`UPDATE route_sightings SET sync_status = 'synced' WHERE id = ?`, [sid]);
              }
            }
            await db.saveToStore();

            if (pendingUsers.length > 0 && session) {
              const uObj = pendingUsers[0];
              (uObj as unknown as Record<string, unknown>)['sync_status'] = 'SYNCED';
              await db.saveSession(session.token, uObj);
            }
          }

          // 2. PULL: Recibir catálogos del backend
          const remoteCatalogs = await syncService
            .pullCatalogs(store.lastSyncTimestamp())
            .toPromise();

          if (remoteCatalogs) {
            // Upsert lógico para Guías
            if (remoteCatalogs.guides && remoteCatalogs.guides.length > 0) {
              for (const guide of remoteCatalogs.guides) {
                await db.query(
                  `INSERT INTO guides (id, full_name, location, specialty, rating, photo_url, details, languages, bio, phone, last_modified, sql_deleted) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                      ON CONFLICT(id) DO UPDATE SET
                      full_name=excluded.full_name, location=excluded.location, specialty=excluded.specialty,
                      rating=excluded.rating, photo_url=excluded.photo_url, details=excluded.details,
                      languages=excluded.languages, bio=excluded.bio, phone=excluded.phone,
                      last_modified=excluded.last_modified, sql_deleted=excluded.sql_deleted`,
                  [
                    guide.id,
                    guide.fullName,
                    guide.location,
                    guide.specialty,
                    guide.rating,
                    guide.photoUrl,
                    guide.details,
                    guide.languages,
                    guide.bio,
                    guide.phone,
                    guide.last_modified,
                    guide.sql_deleted ? 1 : 0,
                  ],
                );
              }
            }

            // Upsert lógico para Sitios
            if (remoteCatalogs.sites && remoteCatalogs.sites.length > 0) {
              for (const site of remoteCatalogs.sites) {
                await db.query(
                  `INSERT INTO sites (id, name, department, municipality, rating, description, cover_url, logo_url, contact_phone, contact_whatsapp, website, instagram, facebook, has_bird_checklist, geo_lat, geo_lng, route_json, last_modified, sql_deleted) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                      ON CONFLICT(id) DO UPDATE SET
                      name=excluded.name, department=excluded.department, municipality=excluded.municipality,
                      rating=excluded.rating, description=excluded.description,
                      cover_url=excluded.cover_url, logo_url=excluded.logo_url,
                      contact_phone=excluded.contact_phone, contact_whatsapp=excluded.contact_whatsapp,
                      website=excluded.website, instagram=excluded.instagram, facebook=excluded.facebook,
                      has_bird_checklist=excluded.has_bird_checklist,
                      geo_lat=excluded.geo_lat, geo_lng=excluded.geo_lng,
                      route_json=excluded.route_json,
                      last_modified=excluded.last_modified, sql_deleted=excluded.sql_deleted`,
                  [
                    site.id,
                    site.name,
                    site.department,
                    site.municipality || '',
                    site.rating,
                    site.description,
                    site.cover_url || '',
                    site.logo_url || '',
                    site.contact_phone || '',
                    site.contact_whatsapp || '',
                    site.website || '',
                    site.instagram || '',
                    site.facebook || '',
                    site.has_bird_checklist ? 1 : 0,
                    site.location?.lat ?? 0,
                    site.location?.lng ?? 0,
                    JSON.stringify(site.routeGeoJson),
                    site.last_modified,
                    site.sql_deleted ? 1 : 0,
                  ],
                );
              }
            }

            // Upsert lógico para Servicios de Sitios
            if (remoteCatalogs.site_services && remoteCatalogs.site_services.length > 0) {
              for (const service of remoteCatalogs.site_services) {
                await db.query(
                  `INSERT INTO site_services (id, site_id, type, name, description, photo_url, price, last_modified, sql_deleted) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                      ON CONFLICT(id) DO UPDATE SET
                      site_id=excluded.site_id, type=excluded.type, name=excluded.name,
                      description=excluded.description, photo_url=excluded.photo_url, price=excluded.price,
                      last_modified=excluded.last_modified, sql_deleted=excluded.sql_deleted`,
                  [
                    service.id,
                    service.site_id,
                    service.type,
                    service.name,
                    service.description,
                    service.photoUrl,
                    service.price,
                    service.last_modified,
                    service.sql_deleted ? 1 : 0,
                  ],
                );
              }
            }

            // Upsert para Site Birds (Opcional, relación)
            if (remoteCatalogs.site_birds && remoteCatalogs.site_birds.length > 0) {
              for (const sb of remoteCatalogs.site_birds) {
                await db.query(
                  `INSERT OR IGNORE INTO site_birds (site_id, bird_id) VALUES (?, ?)`,
                  [sb.site_id, sb.bird_id],
                );
              }
            }

            // Upsert Geografía
            if (remoteCatalogs.departments && remoteCatalogs.departments.length > 0) {
              for (const dep of remoteCatalogs.departments) {
                await db.query(
                  `INSERT OR REPLACE INTO departments (id, name, sql_deleted) VALUES (?, ?, ?)`,
                  [dep.id, dep.name, dep.sql_deleted ? 1 : 0],
                );
              }
            }

            if (remoteCatalogs.municipalities && remoteCatalogs.municipalities.length > 0) {
              for (const mun of remoteCatalogs.municipalities) {
                await db.query(
                  `INSERT OR REPLACE INTO municipalities (id, department_id, name, sql_deleted) VALUES (?, ?, ?, ?)`,
                  [mun.id, mun.department_id, mun.name, mun.sql_deleted ? 1 : 0],
                );
              }
            }

            // Upsert Aves (El catálogo maestro vital)
            if (remoteCatalogs.birds && remoteCatalogs.birds.length > 0) {
              for (const bird of remoteCatalogs.birds) {
                await db.query(
                  `INSERT OR REPLACE INTO birds (id, scientific_name, english_name, common_name, min_altitude, max_altitude, viewing_difficulty, size, environment, behavior, colors, authority, gbif_link, wikiaves_link, ebird_link, other_sources, base_image, image_copyright, habitat_id, conservation_status_id, family_id, residency_type_id, feeding_type_id, beak_morphology_id, wing_morphology_id, tail_morphology_id, leg_morphology_id, additional_info_id, sql_deleted, last_modified) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    bird.id,
                    bird.scientific_name,
                    bird.english_name,
                    bird.common_name,
                    bird.min_altitude,
                    bird.max_altitude,
                    bird.viewing_difficulty,
                    bird.size,
                    bird.environment,
                    bird.behavior,
                    bird.colors,
                    bird.authority,
                    bird.gbif_link,
                    bird.wikiaves_link,
                    bird.ebird_link,
                    bird.other_sources,
                    bird.base_image,
                    bird.image_copyright,
                    bird.habitat_id,
                    bird.conservation_status_id,
                    bird.family_id,
                    bird.residency_type_id,
                    bird.feeding_type_id,
                    bird.beak_morphology_id,
                    bird.wing_morphology_id,
                    bird.tail_morphology_id,
                    bird.leg_morphology_id,
                    bird.additional_info_id,
                    bird.sql_deleted ? 1 : 0,
                    Math.floor(new Date(bird.last_modified).getTime() / 1000),
                  ],
                );
              }
            }
          }

          const newTimestamp = Math.floor(Date.now() / 1000);
          localStorage.setItem('lastSyncTimestamp', newTimestamp.toString());
          patchState(store, {
            isSyncing: false,
            lastSyncTimestamp: newTimestamp,
            pendingChangesCount: 0,
          });
        } catch (error) {
          logger.error('Error crítico durante el ciclo de sincronización', error);
          patchState(store, { isSyncing: false });
        }
      },
    }),
  ),
);
