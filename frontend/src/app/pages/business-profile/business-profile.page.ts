import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  computed,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonButton,
  IonSpinner,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonToggle,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonChip,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  checkmarkOutline,
  businessOutline,
  mapOutline,
  starOutline,
  imageOutline,
  cashOutline,
  personCircleOutline,
  listOutline,
  calendarOutline,
  callOutline,
  logoWhatsapp,
  logoInstagram,
  globeOutline,
  mailOutline,
  documentTextOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  chevronBackOutline,
  chevronForwardOutline,
  timeOutline,
  chatbubbleEllipsesOutline,
  eyeOutline,
} from 'ionicons/icons';

// Components
import { AuthInputComponent } from '../../shared/components/auth-input/auth-input.component';

// Services & Store
import { UiService } from '../../core/services/ui.service';
import { NativeBridgeService } from '../../core/services/native-bridge.service';
import { UserService } from '../../core/services/user.service';
import { BusinessProfileStore } from './business-profile.store';
import { logger } from '../../core/utils/logger';
import { environment } from '../../../environments/environment';
import { BookingStatus } from '../../../../../shared/models/guide-booking.interface';

/**
 * Estructura de presentación para cada celda de día en el calendario de proveedor.
 */
export interface CalendarDay {
  /** Número del día en el mes */
  dayNumber: number;
  /** Cadena de fecha en formato YYYY-MM-DD */
  dateString: string;
  /** Indica si la fecha está bloqueada */
  isBlocked: boolean;
  /** Indica si la fecha ya pasó */
  isPast: boolean;
  /** Indica si es el día de hoy */
  isToday: boolean;
}

/**
 * Detalle del evento de cambio de selección de departamento.
 */
interface SelectChangeDetail {
  /** Valor seleccionado */
  value: string;
}

/**
 * @sdd
 * [Objetivo]: Página de Perfil de Negocio (Modo Proveedor) para Guías.
 * [I/O]: Gestión de perfil, calendario de disponibilidad y solicitudes de reserva.
 * [Edge Cases]: Validación de fechas pasadas, bloqueo reactivo y carga segura de imágenes.
 */
@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.page.html',
  styleUrls: ['./business-profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonButton,
    IonSpinner,
    IonSelect,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonToggle,
    IonBadge,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonChip,
    AuthInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BusinessProfileStore],
})
export class BusinessProfilePage implements OnInit {
  /**
   * Store de estado reactivo para el perfil del proveedor.
   */
  public readonly store = inject(BusinessProfileStore);
  /**
   * Servicio de UI inyectado.
   */
  private readonly ui = inject(UiService);
  /**
   * Bridge nativo inyectado.
   */
  private readonly nativeBridge = inject(NativeBridgeService);
  /**
   * Servicio de usuario inyectado.
   */
  private readonly userService = inject(UserService);

  /** Referencia al input file oculto para foto de portada */
  @ViewChild('coverFileInput') coverFileInput?: ElementRef<HTMLInputElement>;
  /** Referencia al input file oculto para foto de perfil */
  @ViewChild('avatarFileInput') avatarFileInput?: ElementRef<HTMLInputElement>;

  /**
   * URL base del backend.
   */
  private readonly BASE_URL = environment.urlBack;

  /** Fecha actual para navegación de calendario */
  public readonly currentCalendarMonth = signal<Date>(new Date());

  /**
   * Determina si el formulario de negocio está sin cambios o vacío.
   */
  public isPristine = computed(() => {
    return (
      !this.store.username() &&
      !this.store.department() &&
      !this.store.municipality() &&
      !this.store.bio()
    );
  });

  /** Días generados para el mes visible */
  public calendarDays = computed<CalendarDay[]>(() => {
    const current = this.currentCalendarMonth();
    const year = current.getFullYear();
    const month = current.getMonth();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const blocked = this.store.blockedDates();
    const days: CalendarDay[] = [];

    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = dateStr < todayStr;
      const isToday = dateStr === todayStr;
      const isBlocked = blocked.includes(dateStr);

      days.push({
        dayNumber: day,
        dateString: dateStr,
        isBlocked,
        isPast,
        isToday,
      });
    }

    return days;
  });

  /** Nombre del mes visible con año */
  public currentMonthLabel = computed(() => {
    const date = this.currentCalendarMonth();
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  });

  /**
   * Constructor: Registra los iconos usados en la vista.
   */
  constructor() {
    addIcons({
      cameraOutline,
      checkmarkOutline,
      businessOutline,
      mapOutline,
      starOutline,
      imageOutline,
      cashOutline,
      personCircleOutline,
      listOutline,
      calendarOutline,
      callOutline,
      logoWhatsapp,
      logoInstagram,
      globeOutline,
      mailOutline,
      documentTextOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      chevronBackOutline,
      chevronForwardOutline,
      timeOutline,
      chatbubbleEllipsesOutline,
      eyeOutline,
    });
  }

  /**
   * Inicializa la vista cargando catálogos y perfil de negocio.
   */
  async ngOnInit() {
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
  public onAvatarError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = this.getAvatarFallback();
    }
  }

  /**
   * Manejador de cambio de departamento para cargar municipios dinámicos.
   * @param event Evento CustomEvent de IonSelect.
   */
  onDepartmentChange(event: CustomEvent<SelectChangeDetail>) {
    this.store.updateField('department', event.detail.value);
    this.store.updateField('municipality', '');
    this.store.loadMunicipalities(event.detail.value);
  }

  /**
   * Manejador de cambio de pestaña (Perfil, Calendario, Solicitudes).
   * @param event Evento de IonSegment.
   */
  onTabChange(event: CustomEvent) {
    const val = event.detail.value;
    if (val === 'profile' || val === 'calendar' || val === 'bookings') {
      this.store.setActiveTab(val);
    }
  }

  /**
   * Navega al mes anterior en el calendario interactivo.
   */
  prevMonth() {
    const cur = this.currentCalendarMonth();
    this.currentCalendarMonth.set(new Date(cur.getFullYear(), cur.getMonth() - 1, 1));
  }

  /**
   * Navega al mes siguiente en el calendario interactivo.
   */
  nextMonth() {
    const cur = this.currentCalendarMonth();
    this.currentCalendarMonth.set(new Date(cur.getFullYear(), cur.getMonth() + 1, 1));
  }

  /**
   * Alterna el bloqueo o desbloqueo de un día en la agenda del guía.
   * @param day Día del calendario seleccionado.
   */
  async toggleCalendarDay(day: CalendarDay) {
    if (day.isPast) {
      this.ui.showToast('No puedes bloquear o desbloquear fechas pasadas');
      return;
    }
    await this.store.toggleBlockDate(day.dateString);
  }

  /**
   * Actualiza el estado de una solicitud recibida (Aceptar, Rechazar, Completar).
   * @param bookingId ID de la reserva.
   * @param status Nuevo estado de la reserva.
   */
  async onUpdateStatus(bookingId: string, status: BookingStatus) {
    await this.store.updateBookingStatus(bookingId, status);
  }

  /**
   * Abre chat de WhatsApp con el pajarero solicitante.
   * @param phone Número de teléfono.
   */
  openWhatsAppChat(phone: string) {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  }

  /**
   * Abre selector de cámara o selector de archivos según la plataforma.
   * @param type Tipo de fotografía a actualizar ('AVATAR' o 'COVER').
   */
  async changePhoto(type: 'AVATAR' | 'COVER' = 'AVATAR'): Promise<void> {
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

    // En navegador Web / PWA o respaldo si nativo cancela: invocar selector de archivos
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
  async onFileInputChange(event: Event, type: 'AVATAR' | 'COVER'): Promise<void> {
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
      const uploadType = type === 'AVATAR' ? 'provider-avatar' : 'provider-cover';
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
  async onSaveProfile(): Promise<void> {
    await this.store.saveProfile();
  }
}
