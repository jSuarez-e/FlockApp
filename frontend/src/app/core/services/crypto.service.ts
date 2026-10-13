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
 * [Edge Cases]: Caché en memoria para evitar peticiones redundantes. Falla cerrada si el cifrado falla.
 */

/**
 * @class CryptoService
 * @description Bóveda criptográfica asimétrica RSA en el cliente para transmisión segura de credenciales.
 */
@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  /** @description Cliente HTTP para solicitudes a la API. */
  private readonly http = inject(HttpClient);
  /** @description URL base para endpoints de autenticación. */
  private readonly API_URL = environment.authUrl;
  /** @description Caché en memoria para la llave pública PEM. */
  private publicKey: string | null = null;

  /**
   * Obtiene la llave pública RSA del backend.
   * Utiliza caché en memoria para evitar peticiones redundantes.
   * @returns Llave pública en formato PEM.
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
   * Encripta un texto plano usando RSA. En caso de fallo, aborta para prevenir fuga en texto claro.
   * @param plainText - Texto a encriptar (ej. contraseña).
   * @returns Texto encriptado en Base64.
   * @throws {Error} Si la encriptación falla o la llave pública es inválida.
   */
  async encryptRSA(plainText: string): Promise<string> {
    try {
      const pubKey = await this.getPublicKey();
      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(pubKey);
      const encrypted = encryptor.encrypt(plainText);
      if (!encrypted) {
        throw new Error('El motor criptográfico no pudo cifrar el texto.');
      }
      return encrypted;
    } catch (error) {
      logger.error('Fallo en la bóveda criptográfica RSA. Abortando transmisión insegura.', error);
      throw new Error('No fue posible asegurar las credenciales para la transmisión.');
    }
  }
}
