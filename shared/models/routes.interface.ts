/**
 * @sdd
 * @description Shared domain contracts for GPS Tracking and Routes (Module 3).
 * @io Used by both NestJS API (DTOs/Responses) and Angular SignalStores/SQLite.
 * @edge_cases DTO arrays used for bulk synchronization when the device recovers network.
 */

/**
 * @interface IRouteSighting
 * @description Representa un registro de avistamiento vinculado a una ruta.
 */
export interface IRouteSighting {
  /** Propiedad del modelo: id. */
  id: string;
  /** Propiedad del modelo: route_id. */
  route_id: string;
  /** Propiedad del modelo: bird_id. */
  bird_id: string;
  /** Propiedad del modelo: lat. */
  lat: number;
  /** Propiedad del modelo: lng. */
  lng: number;
  /** Propiedad del modelo: timestamp. */
  timestamp: string;
  /** Propiedad del modelo: quantity. */
  quantity: number;
  /** Propiedad del modelo: details. */
  details?: string;
  /** Propiedad del modelo: sync_status. */
  sync_status?: 'pending_sync' | 'synced';
}

/**
 * @interface IRoute
 * @description Representa una ruta de aviturismo con metadatos y conteo de especies/aves.
 */
export interface IRoute {
  /** Propiedad del modelo: id. */
  id: string;
  /** Propiedad del modelo: start_time. */
  start_time: string;
  /** Propiedad del modelo: end_time. */
  end_time?: string;
  /** Propiedad del modelo: route_type. */
  route_type: 'estacionaria' | 'desplazamiento' | string;
  /** Propiedad del modelo: name. */
  name?: string;
  /** Propiedad del modelo: comments. */
  comments?: string;
  /** Propiedad del modelo: total_km. */
  total_km: number;
  /** Propiedad del modelo: duration_mins. */
  duration_mins: number;
  /** Propiedad del modelo: path_geojson. */
  path_geojson?: string; // LineString geojson representations
  /** Propiedad del modelo: sync_status. */
  sync_status?: 'pending_sync' | 'synced';
  /** Propiedad del modelo: sightings. */
  sightings?: IRouteSighting[]; // Nested sightings for Bulk Payload
  /** Cantidad de especies distintas registradas en la ruta */
  species_count?: number;
  /** Cantidad total de aves observadas en la ruta */
  birds_count?: number;
  /** Estado de la ruta */
  status?: 'DRAFT' | 'COMPLETED' | string;
  /** Propiedad del modelo: department_id. */
  department_id?: number;
  /** Propiedad del modelo: municipality_id. */
  municipality_id?: number;
}

/**
 * @interface IUserSyncPayload
 * @description Payload de sincronización para datos de usuario offline.
 */
export interface IUserSyncPayload {
  /** Propiedad del modelo: id. */
  id: string;
  [key: string]: unknown;
}

/**
 * @interface ISyncRoutesBulkPayload
 * @description Contenedor de sincronización masiva para rutas y perfiles offline.
 */
export interface ISyncRoutesBulkPayload {
  /** Propiedad del modelo: routes. */
  routes: IRoute[];
  /** Propiedad del modelo: users. */
  users?: IUserSyncPayload[];
}
