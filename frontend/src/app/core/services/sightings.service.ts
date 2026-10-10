import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DbHelperService } from './db-helper.service';
import { environment } from '../../../environments/environment';
import { logger } from '../utils/logger';

/**
 * Interfaz que define la estructura espacial de un avistamiento.
 */
export interface ISpatialSighting {
  /** Identificador único del avistamiento. */
  id: string;
  /** ID del ave referenciada. */
  birdId?: number | string;
  /** Nombre científico o común del ave. */
  birdName: string;
  /** Nombre científico del ave. */
  scientificName?: string;
  /** Nombre en inglés del ave. */
  englishName?: string;
  /** Nombre común del ave. */
  commonName?: string;
  /** Fecha del avistamiento. */
  date: string;
  /** Hora del avistamiento. */
  time: string;
  /** Datos geoespaciales. */
  location: {
    /** Tipo de geometría GeoJSON. */
    type: 'Point';
    /** Coordenadas [longitud, latitud]. */
    coordinates: [number, number];
  };
  /** Datos del usuario que registró el avistamiento. */
  user: {
    /** ID del usuario */
    id?: string;
    /** Nombre del usuario. */
    name: string;
    /** URL de la foto de perfil. */
    photoUrl: string;
  };
}

/**
 * @sdd
 * - [Objetivo]: Proveer servicios de consulta de avistamientos interactuando con Postgres (Global) y base local (Offline First).
 * - [I/O]: HTTP GET a /sightings/search con fallback a SQLite.
 */

/**
 * Interfaz temporal para mapeo de datos en bruto
 */
interface RawSightingData {
  /**
   * Elemento documentado.
   */
  /**
   * Elemento documentado.
   */
  /**
   * Elemento documentado.
   */
  location?: { /**
   *
   */
  type: string; /**
   *
   */
  coordinates: [number, number] };
  /**
   * Elemento documentado.
   */
  createdAt?: string | Date;
  /**
   * Elemento documentado.
   */
  ts?: number;
  /**
   * Elemento documentado.
   */
  id?: string | number;
  /**
   * Elemento documentado.
   */
  birdName?: string;

  /**
   * Elemento documentado.
   */
  lat?: number | string;
  /**
   * Elemento documentado.
   */
  lng?: number | string;
  /**
   * Elemento documentado.
   */
  authorName?: string;
  /**
   * Elemento documentado.
   */
  userName?: string;
  /** URL del avatar del autor */
  authorAvatarUrl?: string;
  /** Metadatos taxonómicos del ave */
  bird?: { 
    /** Nombre común */
    commonName?: string;
    /** Nombre científico */
    scientificName?: string;
    /** Nombre en inglés */
    englishName?: string;
  };
}

/**
 *
 */
@Injectable({
  providedIn: 'root'
})
/**
 * Elemento documentado.
 */
export class SightingsService {
  /** Acceso a la base de datos local inyectado. */
  private db = inject(DbHelperService);
  /** Cliente HTTP */
  private http = inject(HttpClient);


  /**
   * Ejecuta una búsqueda de avistamientos global (Postgres) combinando local (SQLite).
   * @param {string} [birdId] - Filtro opcional por ID de ave.
   * @param {string} [startDate] - Fecha de inicio.
   * @param {string} [endDate] - Fecha de fin.
   * @param departmentId
   * @returns {Observable<ISpatialSighting[]>} Flujo reactivo con resultados.
   */
  search(birdId?: string, startDate?: string, endDate?: string, departmentId?: string | number): Observable<ISpatialSighting[]> {
    const params: Record<string, string | number> = {};
    if (birdId) params['birdId'] = birdId;
    if (startDate) params['startDate'] = startDate;
    if (endDate) params['endDate'] = endDate;
    if (departmentId) params['departmentId'] = departmentId;

    return from(this.searchOffline(birdId, startDate, endDate, departmentId)).pipe(
      switchMap((localSightings) => {
        return this.http.get<RawSightingData[]>(`${environment.apiUrl}/sightings/search`, { params }).pipe(
          map(data => {
            const remoteSightings = data.map((r: RawSightingData): ISpatialSighting => {
              if (r.location && r.location.type === 'Point') return r as unknown as ISpatialSighting;
              
              const dateObj = new Date(r.createdAt || (r.ts ? r.ts * 1000 : Date.now()));
              return {
                id: String(r.id),
                birdName: r.bird?.scientificName ? `${r.bird.scientificName} (${r.bird.englishName || ''})` : (r.birdName || r.bird?.commonName || 'Ave desconocida'),
                date: dateObj.toISOString().split('T')[0], // YYYY-MM-DD para parsing seguro
                time: dateObj.toLocaleTimeString(),
                location: {
                  type: 'Point',
                  coordinates: [Number(r.lng) || 0, Number(r.lat) || 0]
                },
                user: {
                  name: r.authorName || r.userName || 'Usuario',
                  photoUrl: r.authorAvatarUrl || ''
                }
              };
            });
            
            // Fusión Offline First
            const mergedMap = new Map<string, ISpatialSighting>();
            remoteSightings.forEach(s => mergedMap.set(s.id, s));
            localSightings.forEach(s => {
              if (!mergedMap.has(s.id)) mergedMap.set(s.id, s);
            });
            return Array.from(mergedMap.values());
          }),
          catchError(err => {
            logger.warn('[SightingsService] Error consultando Postgres, usando SQLite local:', err);
            return of(localSightings);
          })
        );
      })
    );
  }

  /**
   * Elemento documentado.
   * @param birdId
   * @param startDate
   * @param endDate
   * @param departmentId
   */
  private async searchOffline(birdId?: string, startDate?: string, endDate?: string, departmentId?: string | number): Promise<ISpatialSighting[]> {
    try {
      // Query A: tabla clásica de avistamientos
      const queryA = `
        SELECT s.id as id, b.id as birdId, b.scientific_name as scientificName, b.english_name as englishName, b.common_name as commonName,
               b.scientific_name || ' (' || b.english_name || ')' as birdName, s.latitude as lat, s.longitude as lng, s.last_modified as ts,
               u.id as userId, u.name as userName, u.avatar_url as userAvatar
        FROM sightings s
        LEFT JOIN birds b ON CAST(s.bird_id AS INTEGER) = b.id
        LEFT JOIN users u ON s.user_id = u.id
        WHERE s.sql_deleted = 0
        ${birdId ? 'AND CAST(s.bird_id AS INTEGER) = CAST(? AS INTEGER)' : ''}
        ORDER BY s.last_modified DESC LIMIT 100
      `;
      const paramsA: unknown[] = birdId ? [birdId] : [];

      // Query B: avistamientos registrados durante rutas offline (route_sightings)
      const queryB = `
        SELECT rs.id as id, b.id as birdId, b.scientific_name as scientificName, b.english_name as englishName, b.common_name as commonName,
               b.scientific_name || ' (' || b.english_name || ')' as birdName, rs.lat as lat, rs.lng as lng,
               CAST(strftime('%s', replace(substr(rs.timestamp, 1, 19), 'T', ' ')) AS INTEGER) as ts,
               u.id as userId, u.name as userName, u.avatar_url as userAvatar
        FROM route_sightings rs
        LEFT JOIN birds b ON CAST(rs.bird_id AS INTEGER) = b.id
        LEFT JOIN routes r ON rs.route_id = r.id
        LEFT JOIN users u ON r.user_id = u.id
        WHERE 1=1
        ${birdId ? 'AND CAST(rs.bird_id AS INTEGER) = CAST(? AS INTEGER)' : ''}
        ${departmentId && departmentId !== 'all' ? 'AND r.department_id = CAST(? AS INTEGER)' : ''}
        ORDER BY ts DESC LIMIT 100
      `;
      const paramsB: unknown[] = [];
      if (birdId) paramsB.push(birdId);
      if (departmentId && departmentId !== 'all') paramsB.push(departmentId);

      const resBPromise = this.db.query(queryB, paramsB).catch(() => []);
      let resA: unknown[] = [];
      if (!departmentId || departmentId === 'all') {
        resA = await this.db.query(queryA, paramsA).catch(() => []);
      }
      const resB = await resBPromise;

      interface RawRow {
        /** Identificador único */
        id: string | number;
        /** ID del ave */
        birdId?: number | null;
        /** Nombre compuesto */
        birdName: string | null;
        /** Nombre científico */
        scientificName?: string | null;
        /** Nombre en inglés */
        englishName?: string | null;
        /** Nombre común */
        commonName?: string | null;
        /** Latitud */
        lat: number | null;
        /** Longitud */
        lng: number | null;
        /** Timestamp unix */
        ts: number | null;
        /** ID del usuario */
        userId?: string | null;
        /** Nombre del usuario */
        userName: string | null;
        /** Foto del usuario */
        userAvatar?: string | null;
      }
      const combined: RawRow[] = [...(resA as RawRow[]), ...(resB as RawRow[])];
      combined.sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0));

      return combined.map((r) => {
        const dateObj = new Date((r.ts ?? 0) * 1000);
        return {
          id: String(r.id),
          birdId: r.birdId ? Number(r.birdId) : undefined,
          birdName: r.birdName ?? 'Ave desconocida',
          scientificName: r.scientificName ?? undefined,
          englishName: r.englishName ?? undefined,
          commonName: r.commonName ?? undefined,
          date: dateObj.toISOString().split('T')[0],
          time: dateObj.toLocaleTimeString(),
          location: {
            type: 'Point' as const,
            coordinates: [Number(r.lng) || 0, Number(r.lat) || 0] as [number, number]
          },
          user: {
            id: r.userId ? String(r.userId) : undefined,
            name: r.userName ?? 'Usuario Local',
            photoUrl: r.userAvatar || ''
          }
        };
      });
    } catch(e) {
      logger.error('[SightingsService] Error general consultando SQLite:', e);
      return [];
    }
  }
}
