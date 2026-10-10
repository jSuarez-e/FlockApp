import { Injectable, inject } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AppPermissionsService } from './app-permissions.service';

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
  async getPhoto(source: CameraSource = CameraSource.Prompt): Promise<{ webPath?: string; format: string }> {
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
}
