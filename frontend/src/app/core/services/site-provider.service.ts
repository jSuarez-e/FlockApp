/**
 * @sdd
 * - [Objetivo]: Servicio Frontend para gestionar el perfil del Sitio de Aviturismo (Modo Proveedor).
 * - [I/O]: Consume endpoints /api/v1/sites/provider/... y gestiona servicios y checklist de aves en SQLite.
 * - [Edge Cases]: Búsqueda de aves tolerante a fallos, integración offline-first con SQLite para site_birds.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ISiteProviderProfile,
  IUpdateSiteProfileDto,
  ICreateSiteServiceDto,
  ISyncSiteBirdsDto,
} from '../../../../../shared/models/site-profile.interface';
import { ISiteService } from '../../../../../shared/models/catalogs.interface';
import { DbHelperService } from './db-helper.service';
import { IBirdSearch } from '../models/birds.interfaces';

import { SiteStore } from '../stores/site.store';
import { logger } from '../utils/logger';

/**
 * Respuesta booleana para operaciones de eliminación.
 */
export interface IDeleteOperationResponse {
  /** Indica si la operación fue exitosa */
  success: boolean;
}

/**
 * Respuesta de conteo para sincronizaciones en lote.
 */
export interface ICountOperationResponse {
  /** Cantidad de registros afectados */
  count: number;
}

/**
 * Respuesta de servicio con posible nombre alternativo de foto en backend.
 */
export interface IServicePhotoRaw {
  /** URL de la foto en formato snake_case */
  photo_url?: string;
}

/**
 * Servicio Angular para administración del sitio propio, sus ofertas y checklist de aves.
 */
@Injectable({
  providedIn: 'root',
})
export class SiteProviderService {
  /** Cliente HTTP de Angular */
  private readonly http = inject(HttpClient);
  /** Helper de base de datos local SQLite */
  private readonly db = inject(DbHelperService);
  /** Store reactivo de sitios */
  private readonly siteStore = inject(SiteStore);
  /** URL base de sitios */
  private readonly baseUrl = `${environment.apiUrl}/sites`;

  /**
   * Obtiene o inicializa los datos del sitio del proveedor autenticado.
   * @returns Perfil completo del sitio con productos, servicios y conteos.
   */
  async getMySite(): Promise<ISiteProviderProfile> {
    return firstValueFrom(
      this.http.get<ISiteProviderProfile>(`${this.baseUrl}/provider/my-site`),
    );
  }

  /**
   * Actualiza la información básica y de contacto del sitio de aviturismo.
   * @param payload Datos del sitio a actualizar.
   * @returns Perfil actualizado del sitio.
   */
  async updateMySite(
    payload: IUpdateSiteProfileDto,
  ): Promise<ISiteProviderProfile> {
    const updated = await firstValueFrom(
      this.http.put<ISiteProviderProfile>(
        `${this.baseUrl}/provider/my-site`,
        payload,
      ),
    );

    // Actualizar inmediatamente la base de datos local SQLite para reflejar los cambios al instante en el mapa
    try {
      const lat = updated.location ? updated.location.lat : (payload.latitude || 0);
      const lng = updated.location ? updated.location.lng : (payload.longitude || 0);
      await this.db.query(
        `INSERT INTO sites (id, name, department, municipality, rating, description, cover_url, logo_url, contact_phone, contact_whatsapp, website, instagram, facebook, has_bird_checklist, geo_lat, geo_lng, route_json, last_modified, sql_deleted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, strftime('%s', 'now'), 0)
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
           last_modified = strftime('%s', 'now'),
           sql_deleted = 0`,
        [
          updated.id,
          updated.name,
          updated.department || '',
          updated.municipality || '',
          updated.rating || 5.0,
          updated.description || '',
          updated.cover_url || '',
          updated.logo_url || '',
          updated.contact_phone || '',
          updated.contact_whatsapp || '',
          updated.website || '',
          updated.instagram || '',
          updated.facebook || '',
          updated.has_bird_checklist ? 1 : 0,
          lat,
          lng,
          null,
        ],
      );
      await this.db.saveToStore();
      await this.siteStore.loadSites();
    } catch (e) {
      logger.warn('[SiteProviderService] No se pudo persistir en SQLite local:', e);
    }

    return updated;
  }

  /**
   * Registra un nuevo producto o servicio para el sitio.
   * @param payload Información del producto o servicio.
   * @returns Servicio creado.
   */
  async addService(payload: ICreateSiteServiceDto): Promise<ISiteService> {
    const created = await firstValueFrom(
      this.http.post<ISiteService>(
        `${this.baseUrl}/provider/my-site/services`,
        payload,
      ),
    );
    const rawPhoto = created.photoUrl || (created as unknown as IServicePhotoRaw).photo_url || '';
    const normalized: ISiteService = {
      ...created,
      photoUrl: rawPhoto,
    };
    try {
      await this.db.query(
        `INSERT INTO site_services (id, site_id, type, name, description, photo_url, price, last_modified, sql_deleted)
         VALUES (?, ?, ?, ?, ?, ?, ?, strftime('%s', 'now'), 0)
         ON CONFLICT(id) DO UPDATE SET
           type = excluded.type,
           name = excluded.name,
           description = excluded.description,
           photo_url = excluded.photo_url,
           price = excluded.price,
           last_modified = strftime('%s', 'now'),
           sql_deleted = 0`,
        [
          normalized.id,
          normalized.site_id,
          normalized.type,
          normalized.name,
          normalized.description || '',
          normalized.photoUrl || '',
          normalized.price || 0,
        ],
      );
      await this.db.saveToStore();
    } catch (e) {
      logger.warn('[SiteProviderService] No se pudo guardar servicio en SQLite:', e);
    }
    return normalized;
  }

  /**
   * Elimina un producto o servicio del sitio.
   * @param serviceId ID del servicio a eliminar.
   * @returns Booleano de éxito.
   */
  async deleteService(serviceId: string): Promise<boolean> {
    const res = await firstValueFrom(
      this.http.delete<IDeleteOperationResponse>(
        `${this.baseUrl}/provider/my-site/services/${serviceId}`,
      ),
    );
    if (res.success) {
      try {
        await this.db.query(
          `UPDATE site_services SET sql_deleted = 1, last_modified = strftime('%s', 'now') WHERE id = ?`,
          [serviceId],
        );
        await this.db.saveToStore();
      } catch (e) {
        logger.warn('[SiteProviderService] No se pudo marcar borrado de servicio en SQLite:', e);
      }
    }
    return res.success;
  }

  /**
   * Obtiene los IDs de las aves asociadas al checklist del sitio desde el backend.
   * @returns Arreglo de IDs numéricos de aves.
   */
  async getMySiteBirds(): Promise<number[]> {
    return firstValueFrom(
      this.http.get<number[]>(`${this.baseUrl}/provider/my-site/birds`),
    );
  }

  /**
   * Sincroniza y guarda el checklist de aves del sitio tanto en el servidor como en SQLite local.
   * @param siteId ID del sitio.
   * @param birdIds Arreglo de IDs numéricos de aves seleccionadas.
   * @returns Cantidad de aves sincronizadas.
   */
  async syncMySiteBirds(
    siteId: string,
    birdIds: number[],
  ): Promise<ICountOperationResponse> {
    const payload: ISyncSiteBirdsDto = { birdIds };
    const res = await firstValueFrom(
      this.http.put<ICountOperationResponse>(
        `${this.baseUrl}/provider/my-site/birds`,
        payload,
      ),
    );

    // Actualizar también la base de datos local SQLite para consultas inmediatas
    try {
      await this.db.query('DELETE FROM site_birds WHERE site_id = ?', [siteId]);
      for (const bId of birdIds) {
        await this.db.query(
          'INSERT OR REPLACE INTO site_birds (site_id, bird_id, sql_deleted) VALUES (?, ?, 0)',
          [siteId, bId],
        );
      }
      await this.db.saveToStore();
    } catch {
      // Si la BD local no está inicializada (ej. en web puro), continúa sin interrumpir
    }

    return res;
  }

  /**
   * Busca especies de aves en la base de datos local SQLite para autocompletado en el checklist.
   * @param term Término de búsqueda (nombre común o científico).
   * @returns Lista de coincidencias de aves.
   */
  async searchLocalBirds(term: string): Promise<IBirdSearch[]> {
    const queryTerm = `%${term.trim()}%`;
    try {
      const results = await this.db.query<IBirdSearch>(
        `SELECT id, common_name, scientific_name, english_name, base_image
         FROM birds
         WHERE (common_name LIKE ? OR scientific_name LIKE ?) AND sql_deleted = 0
         LIMIT 25`,
        [queryTerm, queryTerm],
      );
      return results;
    } catch {
      return [];
    }
  }

  /**
   * Carga los detalles de las aves a partir de una lista de IDs para mostrarlas en el checklist.
   * @param birdIds Lista de IDs de aves.
   * @returns Lista de aves detalladas.
   */
  async getBirdsByIds(birdIds: number[]): Promise<IBirdSearch[]> {
    if (birdIds.length === 0) return [];
    try {
      const placeholders = birdIds.map(() => '?').join(',');
      const results = await this.db.query<IBirdSearch>(
        `SELECT id, common_name, scientific_name, english_name, base_image
         FROM birds
         WHERE id IN (${placeholders})
         ORDER BY common_name ASC`,
        birdIds,
      );
      return results;
    } catch {
      return [];
    }
  }
}
