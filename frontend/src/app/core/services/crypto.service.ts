import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { JSEncrypt } from 'jsencrypt';
import { logger } from '../utils/logger';
import { environment } from '../../../environments/environment';

/**
 * @sdd
 * [Objetivo]: Bóveda asimétrica RSA en el lado del cliente. Obtiene la llave pública
 * del backend y encripta datos sensibles antes de transmitirlos.
 * [I/O]: Depende de HttpClient. Expone: encryptRSA(plainText), getPublicKey().
 * [Edge Cases]: Caché en memoria para evitar peticiones redundantes al endpoint /public-key.
 * Si la encriptación falla, retorna el texto plano como fallback silencioso.
 */
@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.authUrl;
  private publicKey: string | null = null;

  /**
   * @method getPublicKey
   * @description Obtiene la llave pública RSA del backend.
   * Utiliza caché en memoria para evitar peticiones redundantes.
   * @returns {Promise<string>} Llave pública en formato PEM.
   */
  async getPublicKey(): Promise<string> {
    if (this.publicKey) return this.publicKey;

    try {
      const response = await firstValueFrom(
        this.http.get<{ publicKey: string }>(`${this.API_URL}/public-key`)
      );
      this.publicKey = response.publicKey;
      return this.publicKey;
    } catch (error) {
      logger.error('Error al obtener la llave pública RSA', error);
      throw error;
    }
  }

  /**
   * @method encryptRSA
   * @description Encripta un texto plano usando RSA (PKCS1 v1.5).
   * @param {string} plainText - Texto a encriptar (ej. contraseña).
   * @returns {Promise<string>} Texto encriptado en Base64 o texto original si falla.
   */
  async encryptRSA(plainText: string): Promise<string> {
    try {
      const pubKey = await this.getPublicKey();
      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(pubKey);
      const encrypted = encryptor.encrypt(plainText);
      return encrypted || plainText;
    } catch (_error) {
      logger.warn('Fallo en la encriptación RSA. Enviando en crudo como fallback.');
      return plainText;
    }
  }
}
