import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject } from '@angular/core';
import { DbHelperService } from '../services/db-helper.service';
import { pipe, tap, scan } from 'rxjs';
import { IRouteSighting } from '../../../../../shared/models/routes.interface';

import { IBirdSearch } from '../models/birds.interfaces';
import { GeoLocation, GeographyService } from '../services/geography.service';
import { AuthService } from '../services/auth.service';
import { logger } from '../utils/logger';

/**
 * Elemento documentado.
 */
export interface ActiveRouteState {
  /**
   * Elemento documentado.
   */
  isTracking: boolean;
  /**
   * Elemento documentado.
   */
  currentRouteId: string | null;
  /**
   * Elemento documentado.
   */
  currentPath: [number, number][]; // [Lng, Lat]
  /**
   * Elemento documentado.
   */
  totalDistance: number; // in km
  /**
   * Elemento documentado.
   */
  /**
   * Elemento documentado.
   */
  sightingsLog: (IRouteSighting & { /**
   *
   */
  birdInfo?: Partial<IBirdSearch> })[];
  /**
   * Elemento documentado.
   */
  startTime: string | null;
  /**
   * Elemento documentado.
   */
  endTime: string | null;
  /**
   * Elemento documentado.
   */
  departments: GeoLocation[];
  /**
   * Elemento documentado.
   */
  municipalities: GeoLocation[];
}

/**
 * Elemento documentado.
 */
export interface RouteEntity {
  /**
   * Elemento documentado.
   */
  id: string;
  /**
   * Elemento documentado.
   */
  start_time: string;
  /**
   * Elemento documentado.
   */
  end_time?: string;
  /**
   * Elemento documentado.
   */
  total_km?: number;
  /**
   * Elemento documentado.
   */
  path_geojson?: string;
  /**
   * Elemento documentado.
   */
  route_type?: string;
  /**
   * Elemento documentado.
   */
  name?: string;
  /**
   * Elemento documentado.
   */
  comments?: string;
  /**
   * Elemento documentado.
   */
  status?: string;
  /**
   * Elemento documentado.
   */
  sync_status?: string;
  /**
   * Elemento documentado.
   */
  department_id?: number;
  /**
   * Elemento documentado.
   */
  municipality_id?: number;
  /**
   * Elemento documentado.
   */
  duration_mins?: number;
}

const initialState: ActiveRouteState = {
  isTracking: false,
  currentRouteId: null,
  currentPath: [],
  totalDistance: 0,
  sightingsLog: [],
  startTime: null,
  endTime: null,
  departments: [],
  municipalities: [],
};

/**
 * @param coord1
 * @param coord2
 * @description Haversine formula to calculate the distance between two coordinates in km
 */
function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (coord2[1] - coord1[1]) * (Math.PI / 180);
  const dLon = (coord2[0] - coord1[0]) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1[1] * (Math.PI / 180)) *
      Math.cos(coord2[1] * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * @sdd
 * @description State management for the GPS tracking routes module using NgRx SignalStore.
 * @io Dispatches state to Dual-View UI and triggers SQLite persistence.
 */
export const ActiveRouteStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      db = inject(DbHelperService),
      geoService = inject(GeographyService),
      authService = inject(AuthService),
    ) => ({
      /**
       * Elemento documentado.
       * @param routeId
       */
      async startTracking(routeId: string) {
        const startIso = new Date().toISOString();
        patchState(store, {
          isTracking: true,
          currentRouteId: routeId,
          currentPath: [],
          totalDistance: 0,
          sightingsLog: [],
          startTime: startIso,
        });

        // Persist empty route skeleton immediately (FK anchor for sightings)
        logger.debug('[ActiveRouteStore] Iniciando ruta:', routeId);
        const currentUserId = authService.currentUser()?.id || null;
        await db.run(
          `INSERT INTO routes (id, user_id, start_time, total_km, duration_mins, sync_status, status) VALUES (?, ?, ?, 0.0, 0, ?, ?)`,
          [routeId, currentUserId, startIso, 'pending_sync', 'DRAFT'],
        );
        // CRITICAL on Web: flush in-memory WAL to IndexedDB
        await db.saveToStore();
        logger.debug('[ActiveRouteStore] Ruta esqueleto guardada y persistida en disco.');
      },

    /**
     * Elemento documentado.
     * @param routeId
     * @param isTracking
     */
    async loadRoute(routeId: string, isTracking: boolean) {
      logger.debug('[ActiveRouteStore] Cargando ruta existente:', routeId);
      const routes = await db.query('SELECT * FROM routes WHERE id = ?', [routeId]);
      if (!routes || routes.length === 0) return;
      const route = routes[0] as unknown as RouteEntity;

      let currentPath: [number, number][] = [];
      try {
        const pathGeoJson = route.path_geojson
          ? JSON.parse(route.path_geojson)
          : { coordinates: [] };
        currentPath = pathGeoJson.coordinates || [];
      } catch {
        // Ignorar error al parsear GeoJSON no formateado
      }

      const sightings =
        (await db.query(
          `
        SELECT rs.*, b.common_name, b.scientific_name, b.english_name, b.base_image 
        FROM route_sightings rs 
        LEFT JOIN birds b ON rs.bird_id = b.id 
        WHERE rs.route_id = ? ORDER BY rs.timestamp DESC
      `,
          [routeId],
        )) || [];

      const mappedSightings = (sightings as Record<string, string>[]).map(
        (s: Record<string, string>) => ({
          ...s,
          birdInfo: {
            common_name: s['common_name'],
            scientific_name: s['scientific_name'],
            english_name: s['english_name'],
            base_image: s['base_image'],
          },
        }),
      ) as unknown as (IRouteSighting & {
        /**
         * Información taxonómica y visual del ave asociada al avistamiento.
         */
        birdInfo?: Partial<IBirdSearch>;
      })[];

      let effectiveStartTime = route.start_time;
      let effectiveEndTime = route.end_time || null;

      if (isTracking && route.duration_mins) {
        // Ajustar el startTime para omitir el tiempo pausado
        const shiftedStartMs = Date.now() - route.duration_mins * 60000;
        effectiveStartTime = new Date(shiftedStartMs).toISOString();
        effectiveEndTime = null;
      } else if (isTracking) {
        effectiveEndTime = null;
      }

      patchState(store, {
        isTracking: isTracking,
        currentRouteId: routeId,
        currentPath: currentPath,
        totalDistance: route.total_km || 0,
        sightingsLog: mappedSightings,
        startTime: effectiveStartTime || null,
        endTime: effectiveEndTime,
      });

      return route;
    },

    /**
     * Elemento documentado.
     */
    /**
     * Elemento documentado.
     */
    /**
     * Elemento documentado.
     */
    /**
     * Elemento documentado.
     */
    /**
     * Elemento documentado.
     */
    /**
     * Elemento documentado.
     */
    /**
     * Elemento documentado.
     * @param payload
     * @param payload.routeName
     * @param payload.routeType
     * @param payload.notes
     * @param payload.status
     * @param payload.departmentId
     * @param payload.municipalityId
     */
    async stopTracking(payload: {
      /**
       *
       */
      routeName: string;
      /**
       *
       */
      routeType: string;
      /**
       *
       */
      notes: string;
      /**
       *
       */
      status: 'DRAFT' | 'COMPLETED';
      /**
       *
       */
      departmentId?: number | null;
      /**
       *
       */
      municipalityId?: number | null;
    }) {
      const routeId = store.currentRouteId();
      if (!routeId) {
        logger.error('[ActiveRouteStore] stopTracking: No hay routeId activo. Abortando.');
        return;
      }

      const endTime = new Date().toISOString();
      const startIso = store.startTime();
      let durationMins = 0;
      if (startIso) {
        durationMins = Math.floor(
          (new Date(endTime).getTime() - new Date(startIso).getTime()) / 60000,
        );
      }
      const pathGeoJson = JSON.stringify({
        type: 'LineString',
        coordinates: store.currentPath() || [],
      });
      const safeDistance = Number(store.totalDistance()) || 0;

      logger.debug('[ActiveRouteStore] Guardando ruta:', routeId, 'status:', payload.status);

      await db.run(
        `UPDATE routes SET end_time = ?, route_type = ?, total_km = ?, duration_mins = ?, path_geojson = ?, name = ?, comments = ?, status = ?, department_id = ?, municipality_id = ? WHERE id = ?`,
        [
          endTime,
          payload.routeType || 'Desplazamiento',
          safeDistance,
          durationMins,
          pathGeoJson,
          payload.routeName || 'Ruta sin nombre',
          payload.notes || '',
          payload.status,
          payload.departmentId || null,
          payload.municipalityId || null,
          routeId,
        ],
      );

      // CRITICAL on Web: flush in-memory WAL to IndexedDB
      await db.saveToStore();
      logger.debug('[ActiveRouteStore] Ruta finalizada y persistida en disco correctamente.');

      patchState(store, {
        isTracking: false,
        currentRouteId: null,
        currentPath: [],
        totalDistance: 0,
        sightingsLog: [],
        startTime: null,
      });
    },

    /**
     * Cancela y limpia la sesión activa de tracking en memoria al descartar una ruta.
     */
    cancelTracking() {
      patchState(store, {
        isTracking: false,
        currentRouteId: null,
        currentPath: [],
        totalDistance: 0,
        sightingsLog: [],
        startTime: null,
      });
    },

    /**
     * @description RxJS Effect for tracking positions.
     * Uses `scan` to accumulate distance using Haversine formula without mutating global variables.
     */
    addPosition: rxMethod<[number, number]>(
      pipe(
        /**
         * Elemento documentado.
         */
        /**
         * Elemento documentado.
         */
        /**
         * Elemento documentado.
         */
        scan<[number, number], { /**
         *
         */
        coord: [number, number]; /**
         *
         */
        distance: number; /**
         *
         */
        isFirst: boolean }>(
          (acc, newCoord) => {
            if (acc.isFirst) {
              return { coord: newCoord, distance: 0, isFirst: false };
            }
            const dist = calculateDistance(acc.coord, newCoord);
            return { coord: newCoord, distance: dist, isFirst: false };
          },
          { coord: [0, 0], distance: 0, isFirst: true },
        ),
        tap(({ coord, distance }) => {
          patchState(store, (state) => ({
            currentPath: [...state.currentPath, coord],
            totalDistance: state.totalDistance + distance,
          }));
        }),
      ),
    ),

    /**
     * @param birdId
     * @param quantity
     * @param details
     * @param birdInfo
     * @description Adds a sighting log attached to the current GPS route.
     * Persists instantly to SQLite.
     */
    async addSighting(
      birdId: string,
      quantity: number = 1,
      details: string = '',
      birdInfo?: Partial<IBirdSearch>,
    ) {
      const routeId = store.currentRouteId();
      if (!routeId) return;

      const path = store.currentPath();
      // Si no hay fix GPS aún, usamos (0,0) para no perder el registro del avistamiento
      const lastCoord: [number, number] = path.length > 0 ? path[path.length - 1] : [0, 0];
      /**
       * Elemento documentado.
       */
      const newSighting: IRouteSighting & { /**
       *
       */
      birdInfo?: Partial<IBirdSearch> } = {
        id: crypto.randomUUID(),
        route_id: routeId,
        bird_id: birdId,
        lng: lastCoord[0],
        lat: lastCoord[1],
        timestamp: new Date().toISOString(),
        quantity,
        details,
        sync_status: 'pending_sync',
        birdInfo,
      };

      // 1. Update State
      patchState(store, (state) => {
        // Group similar sightings (as requested in SDD acceptance criteria)
        const existingIndex = state.sightingsLog.findIndex((s) => s.bird_id === birdId);
        if (existingIndex > -1) {
          const updatedLog = [...state.sightingsLog];
          updatedLog[existingIndex] = {
            ...updatedLog[existingIndex],
            quantity: updatedLog[existingIndex].quantity + quantity,
          };
          // Note: we might overwrite details or append them, let's keep it simple for now
          return { sightingsLog: updatedLog };
        }
        return { sightingsLog: [...state.sightingsLog, newSighting] };
      });

      // 2. Persist to SQLite
      const lat = Number(newSighting.lat) || 0.0;
      const lng = Number(newSighting.lng) || 0.0;
      const qty = Number(newSighting.quantity) || 1;

      await db.run(
        `INSERT INTO route_sightings (id, route_id, bird_id, lat, lng, timestamp, quantity, details, sync_status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET quantity = quantity + ?`,
        [
          newSighting.id,
          newSighting.route_id,
          newSighting.bird_id,
          lat,
          lng,
          newSighting.timestamp,
          qty,
          newSighting.details || '',
          newSighting.sync_status || 'pending_sync',
          qty,
        ],
      );
    },

    /**
     * Elemento documentado.
     */
    async loadDepartments(): Promise<void> {
      try {
        const depts = await geoService.getDepartments();
        patchState(store, { departments: depts });
      } catch (err) {
        logger.error('Error loading departments in ActiveRouteStore', err);
      }
    },

    /**
     * Elemento documentado.
     * @param departmentId
     */
    async loadMunicipalities(departmentId: number): Promise<void> {
      try {
        const munis = await geoService.getMunicipalities(departmentId);
        patchState(store, { municipalities: munis });
      } catch (err) {
        logger.error('Error loading municipalities in ActiveRouteStore', err);
      }
    },
  })),
);
