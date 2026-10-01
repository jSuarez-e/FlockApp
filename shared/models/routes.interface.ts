/**
 * @sdd
 * @description Shared domain contracts for GPS Tracking and Routes (Module 3).
 * @io Used by both NestJS API (DTOs/Responses) and Angular SignalStores/SQLite.
 * @edge_cases DTO arrays used for bulk synchronization when the device recovers network.
 */

export interface IRouteSighting {
  id: string;
  route_id: string;
  bird_id: string;
  lat: number;
  lng: number;
  timestamp: string;
  quantity: number;
  details?: string;
  sync_status?: 'pending_sync' | 'synced';
}

export interface IRoute {
  id: string;
  start_time: string;
  end_time?: string;
  route_type: 'estacionaria' | 'desplazamiento';
  total_km: number;
  duration_mins: number;
  path_geojson: string; // LineString geojson representations
  sync_status?: 'pending_sync' | 'synced';
  sightings?: IRouteSighting[]; // Nested sightings for Bulk Payload
  department_id?: number;
  municipality_id?: number;
}

export interface IUserSyncPayload {
  id: string;
  [key: string]: unknown;
}

export interface ISyncRoutesBulkPayload {
  routes: IRoute[];
  users?: IUserSyncPayload[];
}
