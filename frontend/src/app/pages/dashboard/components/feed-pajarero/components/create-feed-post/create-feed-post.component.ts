import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonTextarea,
  IonIcon,
  IonToggle,
  IonFooter,
  IonButtons,
} from '@ionic/angular';
import {
  imageOutline,
  cameraOutline,
  locationOutline,
  helpBuoyOutline,
  person,
  closeOutline,
  globeOutline,
  paperPlaneOutline,
} from 'ionicons/icons';
import { AuthService } from '../../../../../../core/services/auth.service';
import { User } from '../../../../../../core/models/auth.models';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { logger } from '../../../../../../core/utils/logger';
import { environment } from '../../../../../../../environments/environment';

/**
 * @sdd
 * - [Objetivo]: Modal de creación de posts tipo Red Social (Feed).
 * - [I/O]: Captura texto, imágenes (cámara/galería), ubicación y toggles sociales (Ayuda ID). Retorna payload.
 * - [Edge Cases]: Offline Queue (si no hay red, el store debe encolarlo).
 */
@Component({
  selector: 'app-create-feed-post',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonTextarea,
    IonIcon,
    IonToggle,
    IonFooter,
    IonButtons,
  ],
  templateUrl: './create-feed-post.component.html',
  styleUrl: './create-feed-post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFeedPostComponent {
  /**
   * Controlador de modales de Ionic.
   */
  private modalCtrl = inject(ModalController);

  /**
   * Servicio de autenticación e identidad del usuario.
   */
  private authService = inject(AuthService);

  /**
   * Estado reactivo del usuario activo en la sesión.
   */
  public user = this.authService.currentUser;

  /**
   * Texto contenido en el borrador de la publicación.
   */
  content = signal<string>('');

  /**
   * Imagen en formato base64 seleccionada para adjuntar.
   */
  selectedImage = signal<string | null>(null);

  /**
   * Coordenadas GPS adjuntadas al post.
   */
  selectedLocation = signal<{
    /**
     * Latitud.
     */
    lat: number;
    /**
     * Longitud.
     */
    lng: number;
  } | null>(null);

  /**
   * Indicador de si el usuario solicita ayuda a la comunidad.
   */
  needsIdentification = signal<boolean>(false);

  /**
   * Diccionario de iconos utilizados en el componente.
   */
  readonly icons = {
    imageOutline,
    cameraOutline,
    locationOutline,
    helpBuoyOutline,
    person,
    closeOutline,
    globeOutline,
    paperPlaneOutline,
  };

  /**
   * Resuelve la URL absoluta para el avatar del usuario.
   * @param path Ruta o URL del avatar.
   * @returns URL resuelta.
   */
  resolveAvatarUrl(path: string | undefined | null): string {
    if (!path) return '';
    return path.startsWith('http') ? path : `${environment.urlBack}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  /**
   * Fallback visual ante error de carga del avatar del usuario.
   * @param event Evento nativo de error.
   * @param user Datos del usuario para iniciales.
   */
  handleAvatarError(event: Event, user: User) {
    const img = event.target as HTMLImageElement;
    const name = user.firstName || user.username || 'Pajarero';
    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=108346&color=fff&bold=true`;
  }

  /**
   * Cierra el modal del formulario de publicación.
   */
  close() {
    this.modalCtrl.dismiss();
  }

  /**
   * Actualiza el contenido de texto del post.
   * @param event Evento del ionInput.
   */
  updateContent(event: CustomEvent) {
    this.content.set(event.detail?.value || '');
  }

  /**
   * Alterna el toggle de solicitud de identificación comunitaria.
   * @param event Evento del ionChange.
   */
  toggleIdentification(event: CustomEvent) {
    this.needsIdentification.set(event.detail.checked);
  }

  /**
   * Abre la cámara o galería nativa usando Capacitor Camera.
   * @param sourceType Origen multimedia ('CAMERA' o 'GALLERY').
   */
  async pickImage(sourceType: 'CAMERA' | 'GALLERY') {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: sourceType === 'CAMERA' ? CameraSource.Camera : CameraSource.Photos,
      });
      if (image.dataUrl) {
        this.selectedImage.set(image.dataUrl);
      }
    } catch (e) {
      logger.warn('Cámara cancelada', e);
    }
  }

  /**
   * Obtiene la posición GPS actual del dispositivo y la asigna al avistamiento.
   */
  async getLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.selectedLocation.set({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    } catch (e) {
      logger.warn('Ubicación denegada', e);
      alert('No se pudo obtener la ubicación. Verifica los permisos.');
    }
  }

  /**
   * Publica el avistamiento y cierra el modal con los datos del formulario.
   */
  publish() {
    this.modalCtrl.dismiss(
      {
        content: this.content(),
        image: this.selectedImage(),
        location: this.selectedLocation(),
        needsIdentification: this.needsIdentification(),
      },
      'publish',
    );
  }
}
