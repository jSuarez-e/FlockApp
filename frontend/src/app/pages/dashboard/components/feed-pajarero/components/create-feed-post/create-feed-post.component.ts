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
  template: `
    <ion-header class="ion-no-border flock-modal-header">
      <ion-toolbar>
        <ion-title>Crear Publicación</ion-title>
        <ion-buttons slot="end">
          <button type="button" (click)="close()" class="flock-header-pill-btn" aria-label="Cerrar modal">
            <ion-icon [icon]="icons.closeOutline"></ion-icon>
            <span>Cerrar</span>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="flock-composer-content">
      <div class="composer-container">
        <!-- Encabezado de Identidad del Autor -->
        @if (user(); as u) {
          <div class="author-banner">
            <div class="author-avatar-wrap">
              @if (u.avatarUrl) {
                <img
                  [src]="resolveAvatarUrl(u.avatarUrl)"
                  (error)="handleAvatarError($event, u)"
                  class="author-avatar-img"
                  alt="Avatar"
                />
              } @else {
                <div class="author-avatar-fallback">
                  <ion-icon [icon]="icons.person"></ion-icon>
                </div>
              }
            </div>
            <div class="author-meta">
              <span class="author-name">{{ u.firstName }} {{ u.lastName }}</span>
              <span class="author-visibility-pill">
                <ion-icon [icon]="icons.globeOutline"></ion-icon>
                <span>Público en Feed</span>
              </span>
            </div>
          </div>
        }

        <!-- Tarjeta Principal del Compositor -->
        <div class="composer-editor-card">
          <ion-textarea
            placeholder="¿Qué pajareaste hoy, o en qué necesitas ayuda de la comunidad?"
            [autoGrow]="true"
            rows="3"
            class="composer-textarea"
            (ionInput)="updateContent($event)"
          ></ion-textarea>

          <!-- Previsualización de Imagen Adjunta -->
          @if (selectedImage()) {
            <div class="media-preview-container">
              <img [src]="selectedImage()" class="media-preview-img" alt="Foto adjunta" />
              <button class="remove-preview-btn" (click)="selectedImage.set(null)" aria-label="Quitar foto">
                <ion-icon [icon]="icons.closeOutline"></ion-icon>
              </button>
            </div>
          }

          <!-- Chip de Ubicación Adjunta -->
          @if (selectedLocation(); as loc) {
            <div class="location-chip-preview">
              <div class="location-chip-info">
                <ion-icon [icon]="icons.locationOutline"></ion-icon>
                <span>Lat: {{ loc.lat | number : '1.4-4' }}, Lng: {{ loc.lng | number : '1.4-4' }}</span>
              </div>
              <button class="location-chip-remove" (click)="selectedLocation.set(null)" aria-label="Quitar ubicación">
                <ion-icon [icon]="icons.closeOutline"></ion-icon>
              </button>
            </div>
          }

          <!-- Barra de Herramientas Multimedia -->
          <div class="composer-actions-bar">
            <div class="actions-group">
              <button type="button" class="tool-btn" (click)="pickImage('GALLERY')" title="Adjuntar foto de galería">
                <ion-icon [icon]="icons.imageOutline"></ion-icon>
                <span>Galería</span>
              </button>
              <button type="button" class="tool-btn" (click)="pickImage('CAMERA')" title="Tomar foto con cámara">
                <ion-icon [icon]="icons.cameraOutline"></ion-icon>
                <span>Cámara</span>
              </button>
              <button
                type="button"
                class="tool-btn"
                [class.tool-btn--active]="selectedLocation()"
                (click)="getLocation()"
                title="Adjuntar ubicación GPS"
              >
                <ion-icon [icon]="icons.locationOutline"></ion-icon>
                <span>{{ selectedLocation() ? 'Ubicación lista' : 'Ubicación' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Opción Social: Pedir Identificación -->
        <div class="composer-subcard">
          <div class="subcard-info">
            <div class="subcard-icon-wrap">
              <ion-icon [icon]="icons.helpBuoyOutline"></ion-icon>
            </div>
            <div class="subcard-texts">
              <h4 class="subcard-title">Pedir Identificación</h4>
              <p class="subcard-desc">La comunidad te ayudará a identificar el ave</p>
            </div>
          </div>
          <ion-toggle
            [checked]="needsIdentification()"
            (ionChange)="toggleIdentification($event)"
            class="flock-toggle"
          ></ion-toggle>
        </div>
      </div>
    </ion-content>

    <!-- Barra Inferior de Publicación -->
    <ion-footer class="ion-no-border flock-composer-footer">
      <ion-toolbar>
        <button
          type="button"
          class="flock-publish-btn"
          (click)="publish()"
          [disabled]="content().trim().length === 0 && !selectedImage()"
        >
          <ion-icon [icon]="icons.paperPlaneOutline"></ion-icon>
          <span>Compartir en el Feed</span>
        </button>
      </ion-toolbar>
    </ion-footer>
  `,
  styles: [
    `
      .flock-composer-content {
        --background: #f8fafc;
      }

      :host-context(body.dark) .flock-composer-content {
        --background: #0f172a;
      }

      .composer-container {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 600px;
        margin: 0 auto;
      }

      .author-banner {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 2px 4px;
      }

      .author-avatar-wrap {
        width: 44px;
        height: 44px;
        flex-shrink: 0;
      }

      .author-avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--ion-color-primary, #047857);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .author-avatar-fallback {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #064e3b;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
      }

      .author-meta {
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
      }

      .author-name {
        font-weight: 700;
        font-size: 15px;
        color: #1e293b;
        letter-spacing: -0.01em;
      }

      :host-context(body.dark) .author-name {
        color: #f1f5f9;
      }

      .author-visibility-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        font-weight: 600;
        color: #047857;
        background: rgba(4, 120, 87, 0.1);
        padding: 2px 8px;
        border-radius: 999px;
        width: fit-content;

        ion-icon {
          font-size: 12px;
        }
      }

      :host-context(body.dark) .author-visibility-pill {
        color: #34d399;
        background: rgba(52, 211, 153, 0.15);
      }

      .composer-editor-card {
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
        padding: 14px 14px 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      :host-context(body.dark) .composer-editor-card {
        background: #1e293b;
        border-color: #334155;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
      }

      .composer-textarea {
        --background: transparent;
        font-size: 15px;
        line-height: 1.5;
        color: #1e293b;
        --padding-top: 2px;
        --padding-bottom: 2px;
        --padding-start: 0;
        --padding-end: 0;
        margin: 0;
        min-height: 85px;
      }

      :host-context(body.dark) .composer-textarea {
        color: #f8fafc;
      }

      .media-preview-container {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        max-height: 220px;
        background: #0f172a;
      }

      .media-preview-img {
        width: 100%;
        height: 100%;
        max-height: 220px;
        object-fit: cover;
        display: block;
      }

      .remove-preview-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.65);
        color: #ffffff;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.15s ease;

        &:active {
          transform: scale(0.9);
        }

        ion-icon {
          font-size: 18px;
        }
      }

      .location-chip-preview {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(4, 120, 87, 0.08);
        border: 1px solid rgba(4, 120, 87, 0.2);
        border-radius: 10px;
        padding: 6px 10px;
      }

      .location-chip-info {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 600;
        color: #047857;

        ion-icon {
          font-size: 16px;
        }
      }

      :host-context(body.dark) .location-chip-info {
        color: #34d399;
      }

      .location-chip-remove {
        background: transparent;
        border: none;
        color: #ef4444;
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 2px;

        ion-icon {
          font-size: 16px;
        }
      }

      .composer-actions-bar {
        display: flex;
        align-items: center;
        padding-top: 10px;
        border-top: 1px solid #f1f5f9;
      }

      :host-context(body.dark) .composer-actions-bar {
        border-top-color: #334155;
      }

      .actions-group {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .tool-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 6px 12px;
        font-size: 12px;
        font-weight: 600;
        color: #334155;
        cursor: pointer;
        transition: all 0.15s ease;

        &:active {
          transform: scale(0.95);
        }

        ion-icon {
          font-size: 16px;
          color: #047857;
        }

        &--active {
          background: #ecfdf5;
          border-color: #047857;
          color: #047857;
        }
      }

      :host-context(body.dark) .tool-btn {
        background: #0f172a;
        border-color: #334155;
        color: #cbd5e1;

        ion-icon {
          color: #34d399;
        }
      }

      .composer-subcard {
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
        padding: 12px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      :host-context(body.dark) .composer-subcard {
        background: #1e293b;
        border-color: #334155;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
      }

      .subcard-info {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }

      .subcard-icon-wrap {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: rgba(245, 158, 11, 0.12);
        color: #d97706;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        ion-icon {
          font-size: 20px;
        }
      }

      .subcard-texts {
        min-width: 0;
      }

      .subcard-title {
        margin: 0;
        font-size: 13px;
        font-weight: 700;
        color: #1e293b;
      }

      :host-context(body.dark) .subcard-title {
        color: #f1f5f9;
      }

      .subcard-desc {
        margin: 2px 0 0;
        font-size: 11px;
        color: #64748b;
      }

      :host-context(body.dark) .subcard-desc {
        color: #94a3b8;
      }

      .flock-toggle {
        --track-background-checked: #047857;
        margin: 0;
        flex-shrink: 0;
      }

      .flock-composer-footer {
        background: #ffffff;
        border-top: 1px solid #e2e8f0;
        padding: 8px 16px calc(var(--ion-safe-area-bottom, 0px) + 8px);

        ion-toolbar {
          --background: transparent;
          padding: 0;
        }
      }

      :host-context(body.dark) .flock-composer-footer {
        background: #1e293b;
        border-top-color: #334155;
      }

      .flock-publish-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: var(--flock-gradient-header);
        color: #ffffff;
        border: none;
        border-radius: 24px;
        padding: 12px 20px;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 0.01em;
        box-shadow: 0 4px 14px rgba(4, 120, 87, 0.35);
        cursor: pointer;
        transition: transform 0.15s ease, opacity 0.15s ease;

        &:active:not(:disabled) {
          transform: scale(0.98);
        }

        &:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        ion-icon {
          font-size: 18px;
        }
      }
    `,
  ],
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
