import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserMedalDto } from '../models/auth.models';
import { DbHelperService } from './db-helper.service';

/**
 * @class UserService
 * @description Servicio de gestión de usuarios (Online-Only Pattern implementado).
 * @author Gemini (Frontend Agent)
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * Elemento documentado.
   */
  private readonly http = inject(HttpClient);
  /**
   * Elemento documentado.
   */
  private readonly db = inject(DbHelperService);
  /**
   * Elemento documentado.
   */
  private readonly API_URL = `${environment.apiUrl}/users`;
  /**
   * Elemento documentado.
   */
  private readonly UPLOAD_URL = `${environment.apiUrl}/uploads`;

  /**
   * @method getProfile
   * @description Obtiene el perfil del usuario directamente desde Postgres (Online-Only).
   * @returns {Promise<User>}
   */
  async getProfile(): Promise<User> {
    const remoteUser = await firstValueFrom(this.http.get<User>(`${this.API_URL}/me`));

    // Actualizamos la caché local (Token)
    const session = await this.db.getSession();
    if (session) {
      await this.db.saveSession(session.token, remoteUser);
    }

    return remoteUser;
  }

  /**
   * @method getProfileById
   * @description Consulta perfil público de terceros.
   * @param {string | number} id - UUID del usuario.
   * @returns {Promise<User>}
   */
  async getProfileById(id: string | number): Promise<User> {
    return firstValueFrom(this.http.get<User>(`${this.API_URL}/${id}`));
  }

  /**
   * Actualización directa en la API (Online-Only). Si falla (Offline), el interceptor lo bloqueará.
   * @param {Partial<User>} updateData - Payload de cambios.
   * @returns {Promise<User>}
   */
  async updateProfile(updateData: Partial<User>): Promise<User> {
    // 1. Ejecutar petición a Postgres directamente
    const remoteResponse = await firstValueFrom(
      this.http.patch<User>(`${this.API_URL}/me`, updateData),
    );

    // 2. Si es exitoso, actualizar la caché local
    const session = await this.db.getSession();
    if (session && remoteResponse) {
      await this.db.saveSession(session.token, remoteResponse);
    }

    return remoteResponse;
  }

  /**
   * @method uploadImage
   * @description Transfiere binarios de imagen al servidor segmentado.
   * @param {Blob} file - Archivo de imagen.
   * @param {string} type - Tipo de carga (avatar, cover, provider-cover).
   * @param {string} extension - Extensión del archivo original.
   * @returns {Promise<{ url: string }>}
   */
  async uploadImage(
    file: Blob,
    type: string,
    extension: string = 'jpg',
    /**
     * Elemento documentado.
     */
  ): Promise<{ /**
   *
   */
  url: string }> {
    const formData = new FormData();
    // R10: Inyección de nombre de archivo para validación de Multer
    formData.append('file', file, `upload_${Date.now()}.${extension}`);

    return firstValueFrom(
      /**
       * Elemento documentado.
       */
      this.http.post<{ /**
       *
       */
      url: string }>(`${this.UPLOAD_URL}/${type}`, formData),
    );
  }

  /**
   * @method updatePassword
   * @description Envía las nuevas credenciales al endpoint de seguridad.
   * @param {Object} data - Objeto con oldPassword y newPassword.
   */
  /**
   * Elemento documentado.
   */
  /**
   * Elemento documentado.
   */
  /**
   * Elemento documentado.
   * @param data
   * @param data.oldPassword
   * @param data.newPassword
   */
  async updatePassword(data: {
    /**
     *
     */
    oldPassword?: string;
    /**
     *
     */
    newPassword?: string;
  }): Promise<{ /**
   *
   */
  message: string }> {
    return firstValueFrom(
      /**
       * Elemento documentado.
       */
      this.http.patch<{ /**
       *
       */
      message: string }>(`${this.API_URL}/change-password`, data),
    );
  }

  /**
   * @method getMyMedals
   * @description Obtiene el listado de medallas del usuario logueado.
   * @returns {Promise<UserMedalDto[]>}
   */
  async getMyMedals(): Promise<UserMedalDto[]> {
    return firstValueFrom(this.http.get<UserMedalDto[]>(`${this.API_URL}/me/medals`));
  }
}
