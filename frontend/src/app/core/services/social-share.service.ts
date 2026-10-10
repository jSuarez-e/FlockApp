import { Injectable } from '@angular/core';
import { Share, ShareOptions, CanShareResult } from '@capacitor/share';
import { logger } from '../utils/logger';

/**
 * Servicio para gestionar el intercambio de contenido a través de la API nativa de Capacitor.
 * @author Gemini (Orquestador SDD)
 */
@Injectable({
  providedIn: 'root',
})
export class SocialShareService {
  /**
   * Constructor por defecto.
   */
  constructor() {}

  /**
   * Verifica si el dispositivo actual permite compartir contenido.
   * @returns {Promise<CanShareResult>} Promesa con el resultado de disponibilidad.
   */
  async canShare(): Promise<CanShareResult> {
    try {
      return await Share.canShare();
    } catch (error) {
      logger.error('Error verificando disponibilidad de Share:', error);
      return { value: false };
    }
  }

  /**
   * Abre el diálogo nativo para compartir contenido.
   * @param {ShareOptions} options Configuración del contenido a compartir (título, texto, url, etc.)
   * @returns {Promise<void>} Promesa que se resuelve cuando el diálogo se cierra.
   */
  async shareContent(options: ShareOptions): Promise<void> {
    const check = await this.canShare();

    if (check.value) {
      try {
        await Share.share(options);
      } catch (error) {
        logger.warn('El usuario canceló el intercambio o hubo un error:', error);
      }
    } else {
      logger.error(
        'La funcionalidad de compartir no está disponible en este dispositivo/plataforma.',
      );
      // Aquí podrías disparar una notificación Toast de Ionic informando al usuario.
    }
  }
}
