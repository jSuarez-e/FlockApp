/**
 * @sdd
 * [Objetivo]: Componente modal de revelación prominente y consentimiento previo para permisos de Android (Cámara, GPS, Fotos) en estricto cumplimiento de políticas de Google Play Store.
 * [I/O - Reusabilidad]: Input permissionType ('camera' | 'location' | 'photos'). ModalController dismiss con { confirmed: boolean }.
 * [Edge Cases - UI]: Manejo responsivo para pantallas móviles compactas, soporte tema oscuro y contraste a11y.
 */
import { Component, ChangeDetectionStrategy, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  locationOutline,
  imagesOutline,
  shieldCheckmarkOutline,
  checkmarkCircleOutline,
  closeOutline,
} from 'ionicons/icons';

export type PermissionRationaleType = 'camera' | 'location' | 'photos';

@Component({
  selector: 'app-permission-rationale-modal',
  templateUrl: './permission-rationale-modal.component.html',
  styleUrls: ['./permission-rationale-modal.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonIcon,
  ],
})
export class PermissionRationaleModalComponent {
  private readonly modalCtrl = inject(ModalController);

  @Input() permissionType: PermissionRationaleType = 'camera';

  constructor() {
    addIcons({
      cameraOutline,
      locationOutline,
      imagesOutline,
      shieldCheckmarkOutline,
      checkmarkCircleOutline,
      closeOutline,
    });
  }

  /**
   * Obtiene la configuración visual y descriptiva según el permiso solicitado.
   */
  get config(): {
    title: string;
    icon: string;
    feature: string;
    description: string;
    points: string[];
  } {
    switch (this.permissionType) {
      case 'location':
        return {
          title: 'Acceso a Ubicación (GPS)',
          icon: 'location-outline',
          feature: 'Trazado de Rutas y Avistamientos',
          description:
            'FlockApp necesita recopilar datos de ubicación para trazar tus rutas de observación en tiempo real y registrar con precisión las coordenadas geográficas de cada ave avistada sobre el mapa.',
          points: [
            'Solo se recopila mientras la aplicación está en uso activo o rastreando una ruta.',
            'Tus coordenadas nunca se comparten con terceros ni con redes publicitarias.',
            'Puedes activar, pausar o desactivar el rastreo en cualquier momento desde la app.',
          ],
        };
      case 'photos':
        return {
          title: 'Acceso a Galería de Fotos',
          icon: 'images-outline',
          feature: 'Carga de Evidencias y Registros',
          description:
            'FlockApp necesita acceder a tu galería multimedia para que puedas adjuntar fotografías existentes de aves capturadas con cámaras externas o en expediciones anteriores.',
          points: [
            'Solo accedemos a las fotos que tú selecciones explícitamente.',
            'No se escanea ni recopila tu biblioteca privada de imágenes.',
            'Puedes revocar este acceso en cualquier momento en los Ajustes del dispositivo.',
          ],
        };
      case 'camera':
      default:
        return {
          title: 'Acceso a la Cámara',
          icon: 'camera-outline',
          feature: 'Captura Fotográfica en Campo',
          description:
            'FlockApp necesita acceso a tu cámara para permitirte tomar fotos instantáneas de las aves que observas durante tus recorridos y actualizar tu imagen de perfil o credenciales de guía.',
          points: [
            'La cámara solo se activa cuando tú presionas el botón de captura.',
            'Las imágenes se asocian a tus fichas de avistamiento y registros de biodiversidad.',
            'Puedes denegar o modificar este permiso cuando lo desees en Configuración.',
          ],
        };
    }
  }

  /**
   * Confirma la solicitud y cierra el modal con veredicto positivo.
   */
  async confirm(): Promise<void> {
    await this.modalCtrl.dismiss({ confirmed: true });
  }

  /**
   * Cancela la solicitud sin otorgar consentimiento previo.
   */
  async cancel(): Promise<void> {
    await this.modalCtrl.dismiss({ confirmed: false });
  }
}
