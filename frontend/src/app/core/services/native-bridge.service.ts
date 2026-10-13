import { Injectable, inject } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import { AppPermissionsService } from './app-permissions.service';
import { logger } from '../utils/logger';

/**
 * Resultado de captura o selección de imagen nativa.
 */
export interface PhotoResult {
  /** Ruta local o web de la fotografía */
  webPath?: string;
  /** Formato de la imagen capturada */
  format: string;
}

/**
 * @sdd
 * @description NativeBridgeService: Abstraction layer for all Capacitor Native plugins.
 * @input Capacitor plugins (Camera, etc.)
 * @output Native functionality exposed to Angular components.
 * @edgecases Graceful degradation if plugins are not available on the current platform (e.g. Web without permissions).
 */
@Injectable({
  providedIn: 'root'
})
export class NativeBridgeService {
  /**
   * Servicio de gestión y solicitud de permisos nativos.
   */
  private readonly permissionsService = inject(AppPermissionsService);

  /**
   * Abre la cámara nativa o selector de galería tras validar el consentimiento del usuario.
   * @param source Origen de la imagen (Cámara o Galería)
   * @returns Datos de la imagen o formato vacío si el usuario canceló
   */
  async getPhoto(source: CameraSource = CameraSource.Prompt): Promise<PhotoResult> {
    const hasPermission = await this.permissionsService.requestCameraWithRationale();
    if (!hasPermission) {
      return { webPath: undefined, format: '' };
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        source,
        resultType: CameraResultType.Uri,
        allowEditing: true,
      });
      return {
        webPath: image.webPath,
        format: image.format,
      };
    } catch {
      return { webPath: undefined, format: '' };
    }
  }

  /**
   * Configura la barra de estado del sistema operativo para que no se superponga
   * con los encabezados de la aplicación y mantenga el contraste institucional.
   * @returns Promesa resuelta tras aplicar la configuración nativa
   */
  async configureStatusBar(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setBackgroundColor({ color: '#064e3b' });
      await StatusBar.setStyle({ style: Style.Dark });
    } catch (err: unknown) {
      logger.warn('No fue posible configurar StatusBar nativo', err);
    }
  }

  /**
   * Oculta la pantalla de carga nativa (SplashScreen).
   * @returns Promesa resuelta tras ocultar el SplashScreen.
   */
  async hideSplashScreen(): Promise<void> {
    try {
      await SplashScreen.hide();
    } catch (err: unknown) {
      logger.warn('No fue posible ocultar SplashScreen nativo', err);
    }
  }
}
