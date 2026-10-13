import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  computed,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonButton,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonBadge,
  IonChip,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  checkmarkOutline,
  businessOutline,
  calendarOutline,
  documentTextOutline,
} from 'ionicons/icons';

// Child Tab Presenters
import { BusinessFormTabComponent } from './components/business-form-tab/business-form-tab.component';
import { BusinessCalendarTabComponent } from './components/business-calendar-tab/business-calendar-tab.component';
import { BusinessBookingsTabComponent } from './components/business-bookings-tab/business-bookings-tab.component';

// Services & Store
import { UiService } from '../../core/services/ui.service';
import { NativeBridgeService } from '../../core/services/native-bridge.service';
import { UserService } from '../../core/services/user.service';
import { BusinessProfileStore } from './business-profile.store';
import { logger } from '../../core/utils/logger';
import { environment } from '../../../environments/environment';

export { CalendarDay } from './components/business-calendar-tab/business-calendar-tab.component';

/**
 * @sdd
 * [Objetivo]: Página de Perfil de Negocio (Modo Proveedor) para Guías orquestando pestañas modulares.
 * [I/O]: Orquesta pestañas Datos, Agenda y Solicitudes mediante BusinessProfileStore.
 * [Edge Cases]: Validación de estados limpios, cambio de fotos con fallback nativo/web.
 */
@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.page.html',
  styleUrls: ['./business-profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonButton,
    IonSpinner,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonBadge,
    IonChip,
    BusinessFormTabComponent,
    BusinessCalendarTabComponent,
    BusinessBookingsTabComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BusinessProfileStore],
})
export class BusinessProfilePage implements OnInit {
  /** Store de estado reactivo para el perfil del proveedor */
  public readonly store = inject(BusinessProfileStore);
  /** Servicio de UI inyectado */
  private readonly ui = inject(UiService);
  /** Bridge nativo inyectado */
  private readonly nativeBridge = inject(NativeBridgeService);
  /** Servicio de usuario inyectado */
  private readonly userService = inject(UserService);

  /** Referencia al input file oculto para foto de portada */
  @ViewChild('coverFileInput') coverFileInput?: ElementRef<HTMLInputElement>;
  /** Referencia al input file oculto para foto de perfil */
  @ViewChild('avatarFileInput') avatarFileInput?: ElementRef<HTMLInputElement>;

  /** URL base del backend */
  private readonly BASE_URL = environment.urlBack;

  /** Determina si el formulario de negocio está sin cambios o vacío */
  public readonly isPristine = computed(() => {
    return (
      !this.store.username() &&
      !this.store.department() &&
      !this.store.municipality() &&
      !this.store.bio()
    );
  });

  /**
   * Constructor: Registra los iconos usados en la barra y cabecera de la página.
   */
  constructor() {
    addIcons({
      cameraOutline,
      checkmarkOutline,
      businessOutline,
      calendarOutline,
      documentTextOutline,
    });
  }

  /**
   * Inicializa la vista cargando catálogos y perfil de negocio.
   */
  async ngOnInit(): Promise<void> {
    await this.store.loadCatalogs();
    await this.store.loadProfile();
  }

  /**
   * Resuelve URL absoluta de una imagen o foto.
   * @param path Ruta relativa o absoluta.
   * @returns URL formateada.
   */
  public getImageUrl(path: string | undefined): string {
    if (!path) return '';
    return path.startsWith('http')
      ? path
      : `${this.BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  /**
   * Genera avatar por defecto con iniciales del nombre de negocio.
   * @returns URL de ui-avatars.
   */
  public getAvatarFallback(): string {
    const name = encodeURIComponent(this.store.username() || 'Negocio');
    return `https://ui-avatars.com/api/?name=${name}&background=88DCCC&color=fff`;
  }

  /**
   * Manejador de error al cargar imagen del avatar.
   * @param event Evento del DOM.
   */
  public onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = this.getAvatarFallback();
    }
  }

  /**
   * Manejador de cambio de pestaña (Perfil, Calendario, Solicitudes).
   * @param event Evento de IonSegment.
   */
  public onTabChange(event: CustomEvent): void {
    const val = event.detail.value;
    if (val === 'profile' || val === 'calendar' || val === 'bookings') {
      this.store.setActiveTab(val);
    }
  }

  /**
   * Abre selector de cámara o selector de archivos según la plataforma.
   * @param type Tipo de fotografía a actualizar ('AVATAR' o 'COVER').
   */
  public async changePhoto(type: 'AVATAR' | 'COVER' = 'AVATAR'): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        const image = await this.nativeBridge.getPhoto();
        if (image.webPath) {
          const response = await fetch(image.webPath);
          const blob = await response.blob();
          await this.uploadBlob(blob, type, image.format || 'jpg');
          return;
        }
      } catch (err) {
        logger.warn('Captura nativa no completada o cancelada:', err);
      }
    }

    if (type === 'COVER' && this.coverFileInput) {
      this.coverFileInput.nativeElement.click();
    } else if (type === 'AVATAR' && this.avatarFileInput) {
      this.avatarFileInput.nativeElement.click();
    }
  }

  /**
   * Manejador de evento cuando se selecciona un archivo desde el input file HTML.
   * @param event Evento change del input.
   * @param type Tipo de foto ('AVATAR' o 'COVER').
   */
  public async onFileInputChange(
    event: Event,
    type: 'AVATAR' | 'COVER',
  ): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const extension = file.type.split('/')[1] || 'jpg';
    await this.uploadBlob(file, type, extension);
    input.value = '';
  }

  /**
   * Sube el blob de imagen al backend y actualiza la URL en el store reactivo.
   * @param blob Binario de la imagen.
   * @param type Tipo de imagen ('AVATAR' o 'COVER').
   * @param extension Extensión de archivo.
   */
  private async uploadBlob(
    blob: Blob,
    type: 'AVATAR' | 'COVER',
    extension: string,
  ): Promise<void> {
    const loadingMsg =
      type === 'AVATAR'
        ? 'Subiendo imagen de perfil...'
        : 'Subiendo imagen de portada...';
    await this.ui.showLoading(loadingMsg);
    try {
      const uploadType =
        type === 'AVATAR' ? 'provider-avatar' : 'provider-cover';
      const result = await this.userService.uploadImage(
        blob,
        uploadType,
        extension,
      );

      if (result && result.url) {
        if (type === 'AVATAR') {
          this.store.updateField('photoUrl', result.url);
        } else {
          this.store.updateField('coverUrl', result.url);
        }
        await this.ui.showToast('Imagen cargada con éxito');
      }
      await this.ui.dismissLoading();
    } catch (e) {
      logger.error('Error al subir imagen:', e);
      await this.ui.dismissLoading();
      await this.ui.showToast('Error al subir la imagen. Inténtalo de nuevo.');
    }
  }

  /**
   * Dispara el guardado de los cambios del perfil de proveedor en el servidor.
   */
  public async onSaveProfile(): Promise<void> {
    await this.store.saveProfile();
  }
}
