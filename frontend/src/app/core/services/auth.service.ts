import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User, AuthResponse } from '../models/auth.models';
import { DbHelperService } from './db-helper.service';
import { CryptoService } from './crypto.service';
import { environment } from '../../../environments/environment';

/**
 * @sdd
 * [Objetivo]: Servicio core de identidad. Gestiona la comunicación con los endpoints
 * de NestJS para autenticación, registro y recuperación de cuenta.
 * [I/O]: Depende de HttpClient, DbHelperService, CryptoService.
 * Expone: login(), register(), forgotPassword(), verifyOtp(), resetPassword(), logout()
 * [Edge Cases]: Token almacenado en RAM volátil. Sesión persistida en SQLite/localStorage
 * solo si remember=true. RSA fallback si encriptación falla.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** @description Cliente HTTP para peticiones REST. */
  private readonly http = inject(HttpClient);

  /** @description Servicio de persistencia local SQLite. */
  private readonly db = inject(DbHelperService);

  /** @description Bóveda RSA para encriptación en tránsito. */
  private readonly cryptoService = inject(CryptoService);

  /** @description URL base del endpoint de autenticación desde el entorno activo. */
  private readonly API_URL = environment.authUrl;

  /** Signal reactivo que expone el estado global del usuario logueado. */
  currentUser = signal<User | null>(null);

  /** Almacén en memoria RAM para el JSON Web Token de la sesión. */
  private accessToken: string | null = null;

  /**
   * @method getToken
   * Recupera el token JWT de la memoria volátil.
   * @returns {string | null} El token de acceso o null si no hay sesión.
   */
  getToken(): string | null {
    return this.accessToken;
  }

  /**
   * @method setToken
   * Inyecta manualmente un token en la memoria RAM (usado por interceptores).
   * @param {string} token - El token JWT a almacenar.
   * @returns {void}
   */
  setToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * @method register
   * @description Envía los datos de un nuevo prospecto al backend para su creación.
   * @param {Partial<User>} userData - Objeto con los datos del formulario de registro.
   * @returns {Promise<User>} Observable convertido a promesa con los datos del usuario creado.
   */
  async register(userData: Partial<User>): Promise<User> {
    const payload = { ...userData };
    if (payload.password) {
      payload.password = await this.cryptoService.encryptRSA(payload.password);
    }
    return firstValueFrom(
      this.http.post<User>(`${this.API_URL}/register`, payload)
    );
  }

  /**
   * @method login
   * @description Autentica las credenciales y establece la sesión en RAM y/o SQLite.
   * @param {string} id - ID del usuario (correo / username).
   * @param {string} pass - Contraseña en texto plano.
   * @param {boolean} [remember=false] - Define si se guarda la sesión en base de datos local.
   * @returns {Promise<AuthResponse>} Respuesta con el JWT y el perfil del usuario.
   * @throws {Error} Si el servidor no retorna un access_token válido.
   */
  async login(
    id: string,
    pass: string,
    remember: boolean = false
  ): Promise<AuthResponse> {
    const encryptedPass = await this.cryptoService.encryptRSA(pass);
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.API_URL}/login`, {
        identifier: id,
        password: encryptedPass,
      })
    );

    if (response?.access_token) {
      this.accessToken = response.access_token;
      this.currentUser.set(response.user);
      if (remember)
        await this.db.saveSession(response.access_token, response.user);
      return response;
    }
    throw new Error('Fallo en la autenticación: Token no recibido.');
  }

  /**
   * @method forgotPassword
   * @description Fase 1: Solicita al servidor el envío del código OTP de 6 dígitos.
   * @param {string} email - Correo del usuario que desea recuperar acceso.
   * @returns {Promise<{ success: boolean }>} Confirmación del inicio del proceso.
   */
  async forgotPassword(email: string): Promise<{ success: boolean }> {
    return firstValueFrom(
      this.http.post<{ success: boolean }>(`${this.API_URL}/forgot-password`, {
        email,
      })
    );
  }

  /**
   * @method verifyOtp
   * @description Fase 2: Valida el OTP y obtiene el token firmado para el cambio de clave.
   * @param {string} email - Correo del usuario.
   * @param {string} otp - Código numérico de 6 dígitos.
   * @returns {Promise<{ recoveryToken: string }>} Token JWT efímero de autorización.
   */
  async verifyOtp(
    email: string,
    otp: string
  ): Promise<{ recoveryToken: string }> {
    return firstValueFrom(
      this.http.post<{ recoveryToken: string }>(`${this.API_URL}/verify-otp`, {
        email,
        otp,
      })
    );
  }

  /**
   * @method resetPassword
   * @description Fase 3: Ejecuta la actualización definitiva de la contraseña.
   * @param {string} email - Correo asociado.
   * @param {string} pass - Nueva contraseña segura.
   * @param {string} token - Token de recuperación obtenido en la fase 2.
   * @returns {Promise<{ message: string }>} Mensaje de éxito del servidor.
   */
  async resetPassword(
    email: string,
    pass: string,
    token: string
  ): Promise<{ message: string }> {
    const encryptedPass = await this.cryptoService.encryptRSA(pass);
    return firstValueFrom(
      this.http.post<{ message: string }>(`${this.API_URL}/reset-password`, {
        email,
        password: encryptedPass,
        recoveryToken: token,
      })
    );
  }

  /**
   * @method logout
   * @description Cierra la sesión activa borrando huellas en RAM y persistencia local.
   * @returns {Promise<void>}
   */
  async logout(): Promise<void> {
    this.accessToken = null;
    this.currentUser.set(null);
    await this.db.clearSession();
  }
}
