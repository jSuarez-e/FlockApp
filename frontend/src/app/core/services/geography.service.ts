import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs'; // fix: _firstValueFrom → firstValueFrom
import { environment } from '../../../environments/environment';
import { DbHelperService } from './db-helper.service';
import { logger } from '../utils/logger';
import { Network } from '@capacitor/network';
import { IReverseGeocodeResponse } from '../../../../../shared/models/locations.interface';

/**
 * @interface ResolvedLocation
 * @description Resultado de la resolución territorial con IDs locales.
 */
export interface ResolvedLocation {
  /** ID del departamento en la base de datos local */
  departmentId: number | null;
  /** ID del municipio en la base de datos local */
  municipalityId: number | null;
  /** Nombre del departamento detectado */
  departmentName?: string;
  /** Nombre del municipio detectado */
  municipalityName?: string;
}

/**
 * @interface GeoLocation
 * @description Estructura de datos para ubicaciones geográficas.
 */
export interface GeoLocation {
  /**
   * Elemento documentado.
   */
  id: number;
  /**
   * Elemento documentado.
   */
  name: string;
}

/**
 * @interface GlobalMuniMatch
 * @description Pareja de identificadores territoriales para coincidencias globales.
 */
interface GlobalMuniMatch {
  /** ID del municipio */
  municipalityId: number;
  /** ID del departamento */
  departmentId: number;
}

/**
 * @class GeographyService
 * @description Servicio encargado de la obtención de datos territoriales desde la API.
 */
@Injectable({
  providedIn: 'root',
})
export class GeographyService {
  /** @description Cliente HTTP inyectado */
  private readonly http = inject(HttpClient);

  /** @description Acceso a la BD local */
  private readonly db = inject(DbHelperService);

  /** URL base para endpoints de localización */
  private readonly API_URL = `${environment.apiUrl}/locations`;

  /**
   * Recupera la lista de departamentos estrictamente desde la base de datos local.
   *
   * @returns Lista de departamentos locales.
   */
  async getDepartments(): Promise<GeoLocation[]> {
    try {
      // Usamos el alias 'name' mapeando la columna 'departments' que viene del JSON base
      const local = await this.db.query(
        'SELECT id, departments as name FROM departments WHERE sql_deleted = 0 ORDER BY name ASC',
      );
      if (local && local.length > 0) return local as unknown as GeoLocation[];
      logger.warn(
        '[GeographyService] No hay departamentos locales. Sincroniza primero el catálogo.',
      );
    } catch (e) {
      logger.error('Error querying local departments:', e);
    }
    return [];
  }

  /**
   * Recupera municipios asociados a un departamento de forma estrictamente local.
   *
   * @param departmentId ID del departamento padre.
   * @returns Lista de municipios del departamento.
   */
  async getMunicipalities(departmentId: number): Promise<GeoLocation[]> {
    try {
      // Usamos el alias 'name' mapeando la columna 'municipalities' que viene del JSON base
      const local = await this.db.query(
        'SELECT id, municipalities as name FROM municipalities WHERE department_id = ? AND sql_deleted = 0 ORDER BY name ASC',
        [departmentId],
      );
      if (local && local.length > 0) return local as unknown as GeoLocation[];
      logger.warn(
        '[GeographyService] No hay municipios locales para este dpto. Sincroniza primero el catálogo.',
      );
    } catch (e) {
      logger.error('Error querying local municipalities:', e);
    }
    return [];
  }

  /**
   * Resuelve departamento y municipio a partir de coordenadas GPS mediante geocodificación inversa.
   * Si el dispositivo está sin conexión o la API no responde, degrada pacíficamente y retorna nulos.
   *
   * @param lat Latitud decimal.
   * @param lng Longitud decimal.
   * @returns IDs de departamento y municipio resueltos para el catálogo local.
   */
  async reverseGeocode(lat: number, lng: number): Promise<ResolvedLocation> {
    try {
      // 1. Verificación de conectividad (Modo Offline-First)
      const status = await Network.getStatus();
      if (!status.connected) {
        logger.info(
          '[GeographyService] Dispositivo offline: omitiendo geocodificación inversa.',
        );
        return { departmentId: null, municipalityId: null };
      }

      // 2. Consulta al backend online
      const res = await firstValueFrom(
        this.http.get<IReverseGeocodeResponse>(
          `${this.API_URL}/reverse-geocode`,
          {
            params: { lat: lat.toString(), lng: lng.toString() },
          },
        ),
      );

      if (!res || (!res.departmentName && !res.municipalityName)) {
        return { departmentId: null, municipalityId: null };
      }

      const matched = await this.resolveMatchedLocation(res);

      return {
        departmentId: matched.departmentId,
        municipalityId: matched.municipalityId,
        departmentName: res.departmentName ?? undefined,
        municipalityName: res.municipalityName ?? undefined,
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : JSON.stringify(e);
      logger.warn(
        `[GeographyService] Error en geocodificación inversa: ${msg}`,
      );
      return { departmentId: null, municipalityId: null };
    }
  }

  /**
   * Resuelve los identificadores locales para un resultado de reverse geocode.
   * @param res Respuesta de geocodificación inversa de la API.
   * @returns Identificadores resueltos de departamento y municipio.
   */
  private async resolveMatchedLocation(
    res: IReverseGeocodeResponse,
  ): Promise<ResolvedLocation> {
    let matchedDepartmentId: number | null = null;
    let matchedMunicipalityId: number | null = null;

    const departments = await this.getDepartments();

    if (res.departmentName) {
      matchedDepartmentId = this.matchGeoItem(res.departmentName, departments);
    }

    if (matchedDepartmentId && res.municipalityName) {
      const municipalities = await this.getMunicipalities(
        matchedDepartmentId,
      );
      matchedMunicipalityId = this.matchGeoItem(
        res.municipalityName,
        municipalities,
      );
    }

    if (!matchedMunicipalityId && res.municipalityName) {
      const globalMatch = await this.matchGlobalMunicipality(
        res.municipalityName,
      );
      if (globalMatch) {
        matchedMunicipalityId = globalMatch.municipalityId;
        if (!matchedDepartmentId) {
          matchedDepartmentId = globalMatch.departmentId;
        }
      }
    }

    return {
      departmentId: matchedDepartmentId,
      municipalityId: matchedMunicipalityId,
    };
  }

  /**
   * Busca la mejor coincidencia en una lista de entidades geográficas priorizando coincidencia exacta.
   * @param target Nombre buscado.
   * @param items Lista de elementos candidatos.
   * @returns ID del elemento encontrado o null.
   */
  private matchGeoItem(target: string, items: GeoLocation[]): number | null {
    const cleanTarget = this.cleanString(target);
    const exact = items.find((item) => this.cleanString(item.name) === cleanTarget);
    if (exact) {
      return exact.id;
    }

    const candidates = items.filter((item) => {
      const cleanName = this.cleanString(item.name);
      return cleanTarget.includes(cleanName) || cleanName.includes(cleanTarget);
    });

    if (candidates.length === 0) {
      return null;
    }

    candidates.sort(
      (a, b) => this.cleanString(b.name).length - this.cleanString(a.name).length,
    );
    return candidates[0].id;
  }

  /**
   * Fallback global para resolver municipio cuando no se encontró en el departamento inicial.
   * @param municipalityName Nombre del municipio.
   * @returns Objeto con ID de municipio y departamento o null.
   */
  private async matchGlobalMunicipality(
    municipalityName: string,
  ): Promise<GlobalMuniMatch | null> {
    try {
      const allMunis = await this.db.query<{
        /** ID del municipio */
        id: number;
        /** Nombre del municipio */
        name: string;
        /** ID del departamento */
        department_id: number;
      }>(
        'SELECT id, municipalities as name, department_id FROM municipalities WHERE sql_deleted = 0',
      );
      if (!allMunis || allMunis.length === 0) {
        return null;
      }

      const cleanTarget = this.cleanString(municipalityName);
      const exact = allMunis.find((m) => this.cleanString(m.name) === cleanTarget);
      if (exact) {
        return { municipalityId: exact.id, departmentId: exact.department_id };
      }

      const candidates = allMunis.filter((m) => {
        const cleanName = this.cleanString(m.name);
        return cleanTarget.includes(cleanName) || cleanName.includes(cleanTarget);
      });
      if (candidates.length > 0) {
        candidates.sort(
          (a, b) => this.cleanString(b.name).length - this.cleanString(a.name).length,
        );
        return {
          municipalityId: candidates[0].id,
          departmentId: candidates[0].department_id,
        };
      }
    } catch (err) {
      logger.warn('[GeographyService] Fallback global de municipio falló:', err);
    }
    return null;
  }

  /**
   * Normaliza una cadena de texto eliminando diacríticos, mayúsculas y caracteres no alfanuméricos.
   *
   * @param val Cadena original.
   * @returns Cadena normalizada simplificada.
   */
  private cleanString(val: string): string {
    return val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }
}
