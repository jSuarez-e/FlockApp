/**
 * @sdd
 * - [Objetivo]: Servicio de Angular para manejar las peticiones HTTP de Guías.
 * - [I/O]: Expone métodos asíncronos que devuelven Observables de IGuide.
 * - [Edge Cases]: Se inyecta en el GuideStore cumpliendo el Single Responsibility Principle.
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { IGuide } from '../../../../../shared/models/catalogs.interface';
import { IUpdateGuideProfileDto } from '../../../../../shared/models/guide-profile.interface';
import { environment } from '../../../environments/environment';

/**
 * Interfaz temporal para mapeo estricto del backend.
 */
interface IRawGuideResponse {
  /**
   * Elemento documentado.
   */
  id: string;
  /**
   * Elemento documentado.
   */
  full_name?: string;
  /**
   * Elemento documentado.
   */
  fullName?: string;
  /**
   * Elemento documentado.
   */
  location: string;
  /**
   * Elemento documentado.
   */
  specialty: string;
  /**
   * Elemento documentado.
   */
  rating: number;
  /**
   * Elemento documentado.
   */
  photo_url?: string;
  /**
   * Elemento documentado.
   */
  photoUrl?: string;
  /**
   * Elemento documentado.
   */
  details: string;
  /**
   * Elemento documentado.
   */
  languages?: string;
  /**
   * Elemento documentado.
   */
  bio?: string;
  /**
   * Elemento documentado.
   */
  phone?: string;
  /**
   * Disponibilidad de WhatsApp.
   */
  has_whatsapp?: boolean;
  /**
   * Disponibilidad de WhatsApp (camelCase).
   */
  hasWhatsapp?: boolean;
  /**
   * Cuenta de Instagram.
   */
  instagram?: string;
  /**
   * Página web oficial.
   */
  website?: string;
  /**
   * Correo electrónico.
   */
  email?: string;
  /**
   * Registro Nacional de Turismo.
   */
  rnt?: string;
  /**
   * Publicado en el directorio.
   */
  is_published?: boolean;
  /**
   * Publicado en el directorio (camelCase).
   */
  isPublished?: boolean;
  /**
   * Foto de portada.
   */
  cover_url?: string;
  /**
   * Foto de portada (camelCase).
   */
  coverUrl?: string;
  /**
   * Timestamp de última modificación.
   */
  last_modified?: number;
  /**
   * Indicador de borrado lógico.
   */
  sql_deleted?: boolean;
}

/**
 * Servicio de Angular para manejar las peticiones HTTP de Guías.
 */
@Injectable({ providedIn: 'root' })
export class GuideService {
  /**
   * Cliente HTTP inyectado.
   */
  private readonly http = inject(HttpClient);

  /**
   * Obtiene la lista completa de guías desde el backend.
   * @returns Flujo observable con el listado de guías.
   */
  getGuides(): Observable<IGuide[]> {
    return this.http.get<IRawGuideResponse[]>(`${environment.apiUrl}/guides`).pipe(
      map((rawGuides: IRawGuideResponse[]) =>
        rawGuides.map((rawGuide: IRawGuideResponse) => ({
          id: rawGuide.id,
          fullName: rawGuide.fullName || rawGuide.full_name || '',
          location: rawGuide.location,
          specialty: rawGuide.specialty,
          rating: rawGuide.rating,
          photoUrl: rawGuide.photoUrl || rawGuide.photo_url || '',
          coverUrl: rawGuide.coverUrl || rawGuide.cover_url || '',
          details: rawGuide.details,
          languages: rawGuide.languages || 'Español',
          bio: rawGuide.bio,
          phone: rawGuide.phone || '',
          hasWhatsapp: rawGuide.hasWhatsapp ?? rawGuide.has_whatsapp ?? true,
          instagram: rawGuide.instagram || '',
          website: rawGuide.website || '',
          email: rawGuide.email || '',
          rnt: rawGuide.rnt || '',
          isPublished: rawGuide.isPublished ?? rawGuide.is_published ?? true,
          last_modified: rawGuide.last_modified,
          sql_deleted: rawGuide.sql_deleted,
        })),
      ),
    );
  }

  /**
   * Obtiene el perfil de guía asociado al usuario autenticado.
   * @returns Perfil de guía o null si no existe.
   */
  async getMyGuideProfile(): Promise<IGuide | null> {
    try {
      const result = await firstValueFrom(
        this.http.get<IGuide>(`${environment.apiUrl}/guides/me`),
      );
      return result || null;
    } catch {
      return null;
    }
  }

  /**
   * Actualiza el perfil de guía del usuario autenticado.
   * @param payload Datos del perfil a actualizar.
   * @returns Perfil de guía actualizado.
   */
  async upsertMyGuideProfile(
    payload: IUpdateGuideProfileDto,
  ): Promise<IGuide | null> {
    const result = await firstValueFrom(
      this.http.put<IGuide>(`${environment.apiUrl}/guides/me`, payload),
    );
    return result || null;
  }
}
