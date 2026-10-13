/**
 * @sdd
 * [Objetivo]: Servicio centralizado para auditoría, consulta reactiva y solicitud con revelación previa (Google Play Rationale) de permisos de Android (Cámara, GPS, Multimedia).
 * [I/O]: Expone Signals de estado (cameraStatus, locationStatus, photosStatus) y métodos asíncronos requestCameraWithRationale(), requestLocationWithRationale(), requestPhotosWithRationale(), checkAllPermissions(), showDeviceSettingsGuide().
 * [Edge Cases]: Plataforma Web (degradación elegante), permisos denegados permanentemente (guía paso a paso para Ajustes del SO), errores de plugin nativo.
 */
import { Injectable, inject, signal } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Camera, PermissionStatus as CameraPermissionStatus } from '@capacitor/camera';
import { Geolocation, PermissionStatus as GeoPermissionStatus } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import {
  PermissionRationaleModalComponent,
  PermissionRationaleType,
} from '../../shared/components/permission-rationale-modal/permission-rationale-modal.component';

/** Tipo que representa el estado consolidado de un permiso */
export type AppPermissionState = 'prompt' | 'granted' | 'denied';

/**
 * Servicio de permisos para la aplicación móvil FlockApp.
 */
@Injectable({
  providedIn: 'root',
})
export class AppPermissionsService {
  /** Controlador modal de Ionic opcional para evitar fallos de inyección */
  private readonly modalCtrl = inject(ModalController, { optional: true });

  /** Controlador de alertas de Ionic opcional para evitar fallos de inyección */
  private readonly alertCtrl = inject(AlertController, { optional: true });

  /** Estado reactivo del permiso de cámara */
  public readonly cameraStatus = signal<AppPermissionState>('prompt');

  /** Estado reactivo del permiso de ubicación GPS */
  public readonly locationStatus = signal<AppPermissionState>('prompt');

  /** Estado reactivo del permiso de fotos y galería */
  public readonly photosStatus = signal<AppPermissionState>('prompt');

  /**
   * Constructor del servicio. Inicializa la verificación pasiva de permisos.
   */
  constructor() {
    void this.checkAllPermissions();
  }

  /**
   * Consulta el estado de todos los permisos sensibles y actualiza los signals reactivos.
   */
  async checkAllPermissions(): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        const camResult: CameraPermissionStatus = await Camera.checkPermissions();
        this.cameraStatus.set(this.normalizeStatus(camResult.camera));
        this.photosStatus.set(this.normalizeStatus(camResult.photos));

        const geoResult: GeoPermissionStatus = await Geolocation.checkPermissions();
        this.locationStatus.set(this.normalizeStatus(geoResult.location));
      } else {
        // En entorno Web, verificar APIs del navegador si están disponibles
        if ('permissions' in navigator) {
          try {
            const geoPerm = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
            this.locationStatus.set(this.normalizeStatus(geoPerm.state));
          } catch {
            this.locationStatus.set('prompt');
          }
        }
      }
    } catch {
      // Degradación silenciosa en entornos de test o navegadores restrictivos
    }
  }

  /**
   * Solicita el permiso de cámara presentando primero la modal de revelación requerida por Google Play.
   * @returns Promise<boolean> true si el permiso fue concedido, false de lo contrario.
   */
  async requestCameraWithRationale(): Promise<boolean> {
    await this.checkAllPermissions();
    if (this.cameraStatus() === 'granted') {
      return true;
    }

    if (this.cameraStatus() === 'denied') {
      await this.showDeviceSettingsGuide('camera');
      return false;
    }

    const accepted = await this.presentRationaleModal('camera');
    if (!accepted) {
      return false;
    }

    try {
      const result = await Camera.requestPermissions({ permissions: ['camera'] });
      const status = this.normalizeStatus(result.camera);
      this.cameraStatus.set(status);
      return status === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Solicita el permiso de ubicación GPS presentando primero la modal de revelación requerida por Google Play.
   * @returns Promise<boolean> true si el permiso fue concedido, false de lo contrario.
   */
  async requestLocationWithRationale(): Promise<boolean> {
    await this.checkAllPermissions();
    if (this.locationStatus() === 'granted') {
      return true;
    }

    if (this.locationStatus() === 'denied') {
      await this.showDeviceSettingsGuide('location');
      return false;
    }

    const accepted = await this.presentRationaleModal('location');
    if (!accepted) {
      return false;
    }

    try {
      const result = await Geolocation.requestPermissions({ permissions: ['location', 'coarseLocation'] });
      const status = this.normalizeStatus(result.location);
      this.locationStatus.set(status);
      return status === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Solicita el permiso de acceso a fotos presentando primero la modal de revelación.
   * @returns Promise<boolean> true si el permiso fue concedido, false de lo contrario.
   */
  async requestPhotosWithRationale(): Promise<boolean> {
    await this.checkAllPermissions();
    if (this.photosStatus() === 'granted') {
      return true;
    }

    if (this.photosStatus() === 'denied') {
      await this.showDeviceSettingsGuide('photos');
      return false;
    }

    const accepted = await this.presentRationaleModal('photos');
    if (!accepted) {
      return false;
    }

    try {
      const result = await Camera.requestPermissions({ permissions: ['photos'] });
      const status = this.normalizeStatus(result.photos);
      this.photosStatus.set(status);
      return status === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Muestra la modal de revelación obligatoria de Google Play antes del diálogo del sistema.
   * @param type Tipo de permiso solicitado
   * @returns Promise<boolean> true si el usuario confirmó continuar
   */
  private async presentRationaleModal(type: PermissionRationaleType): Promise<boolean> {
    if (!this.modalCtrl) {
      return true;
    }
    const modal = await this.modalCtrl.create({
      component: PermissionRationaleModalComponent,
      componentProps: { permissionType: type },
      backdropDismiss: false,
      cssClass: 'permission-rationale-dialog',
    });

    await modal.present();
    interface DismissPayload {
      /** Indicador de confirmación */
      confirmed?: boolean;
    }
    const { data } = await modal.onDidDismiss<DismissPayload>();
    return Boolean(data?.confirmed);
  }

  /**
   * Muestra guía amigable de ajustes del sistema cuando un permiso fue denegado permanentemente.
   * @param type Tipo de permiso denegado
   */
  async showDeviceSettingsGuide(type: PermissionRationaleType): Promise<void> {
    if (!this.alertCtrl) {
      return;
    }
    const nameMap: Record<PermissionRationaleType, string> = {
      camera: 'Cámara',
      location: 'Ubicación (GPS)',
      photos: 'Fotos y Multimedia',
    };

    const permName = nameMap[type] || 'este permiso';

    const alert = await this.alertCtrl.create({
      header: `Permiso de ${permName} Desactivado`,
      subHeader: 'Requiere activación manual en Android',
      message: `El permiso de ${permName} fue denegado previamente. Para activarlo:\n\n1. Abre los Ajustes de tu teléfono Android.\n2. Ve a Aplicaciones > FlockApp.\n3. Selecciona 'Permisos' y activa ${permName}.`,
      buttons: [
        {
          text: 'Entendido',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }

  /**
   * Normaliza los diferentes estados de permisos de Capacitor a una terna unificada.
   * @param rawStatus Estado devuelto por el plugin
   * @returns {AppPermissionState} Estado normalizado
   */
  private normalizeStatus(rawStatus?: string): AppPermissionState {
    if (!rawStatus) return 'prompt';
    if (rawStatus === 'granted') return 'granted';
    if (rawStatus === 'denied') return 'denied';
    return 'prompt';
  }
}
