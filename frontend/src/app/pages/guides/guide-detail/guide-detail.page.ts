/**
 * @sdd
 * [Objetivo]: Vista de Detalle y Reserva del Guía para el Pajarero (Vista Pajarero).
 * [I/O]: Consume /api/v1/guides/:id, /api/v1/guides/:id/availability, y crea reservas.
 * [Edge Cases]: Validación de selección de fecha disponible, prevención de solapamientos, calificación solo en servicios finalizados.
 */
import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonButton,
  IonSpinner,
  IonBadge,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonChip,
  IonLabel,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  star,
  starOutline,
  locationOutline,
  languageOutline,
  idCardOutline,
  callOutline,
  logoWhatsapp,
  logoInstagram,
  globeOutline,
  mailOutline,
  calendarOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  chevronBackOutline,
  chevronForwardOutline,
  checkmarkDoneOutline,
  sendOutline,
  informationCircleOutline,
  ribbonOutline,
} from 'ionicons/icons';

// Services
import { GuideService } from '../../../core/services/guide.service';
import {
  GuideBookingService,
  IGuideAvailabilityResponse,
} from '../../../core/services/guide-booking.service';
import { UiService } from '../../../core/services/ui.service';
import { UserService } from '../../../core/services/user.service';
import { IGuide } from '../../../../../../shared/models/catalogs.interface';
import {
  IGuideBooking,
  ICreateBookingDto,
  IRateBookingDto,
} from '../../../../../../shared/models/guide-booking.interface';
import { environment } from '../../../../environments/environment';

/**
 * Estructura de datos para un día individual en la cuadrícula del calendario.
 */
export interface DetailCalendarDay {
  /** Número del día */
  dayNumber: number;
  /** Fecha en formato YYYY-MM-DD */
  dateString: string;
  /** Indica si está ocupado o bloqueado */
  isBlocked: boolean;
  /** Indica si es fecha pasada */
  isPast: boolean;
  /** Indica si es la fecha seleccionada */
  isSelected: boolean;
}

/**
 * @sdd
 * [Objetivo]: Vista Pajarero para perfil detallado de Guía, agenda interactiva y reserva directa.
 * [I/O]: Inyecta GuideService, GuideBookingService, UiService y UserService.
 * [Edge Cases]: Validación de fechas ocupadas/pasadas, calificación condicionada a estado COMPLETED.
 */
@Component({
  selector: 'app-guide-detail',
  templateUrl: './guide-detail.page.html',
  styleUrls: ['./guide-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonButton,
    IonSpinner,
    IonBadge,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonChip,
    IonLabel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideDetailPage implements OnInit {
  /** Ruta activa para parámetros */
  private readonly route = inject(ActivatedRoute);
  /** Servicio de navegación */
  private readonly router = inject(Router);
  /** Servicio de consulta de guías */
  private readonly guideService = inject(GuideService);
  /** Servicio de gestión de reservas de guías */
  private readonly bookingService = inject(GuideBookingService);
  /** Servicio de perfil de usuario */
  private readonly userService = inject(UserService);
  /** Servicio de interfaz de usuario */
  private readonly ui = inject(UiService);

  /** URL base para resolución de imágenes */
  private readonly BASE_URL = environment.urlBack;

  /** Estado del guía seleccionado */
  public readonly guide = signal<IGuide | null>(null);
  /** Indicador de carga */
  public readonly isLoading = signal<boolean>(true);
  /** Disponibilidad del calendario */
  public readonly availability = signal<IGuideAvailabilityResponse | null>(null);

  /** Mes visible en el calendario */
  public readonly currentCalendarMonth = signal<Date>(new Date());
  /** Fecha seleccionada por el usuario (YYYY-MM-DD) */
  public readonly selectedDate = signal<string>('');

  /** Formulario de reserva: tipo de actividad */
  public readonly activityType = signal<string>('Aviturismo General');
  /** Formulario de reserva: teléfono de contacto */
  public readonly contactPhone = signal<string>('');
  /** Formulario de reserva: correo de contacto */
  public readonly contactEmail = signal<string>('');
  /** Formulario de reserva: mensaje descriptivo */
  public readonly message = signal<string>('');
  /** Formulario de reserva: estado de envío */
  public readonly isSubmitting = signal<boolean>(false);

  /** Reservas del usuario con este guía */
  public readonly myBookings = signal<IGuideBooking[]>([]);

  /** Modal de calificación: reserva activa */
  public readonly ratingModalBooking = signal<IGuideBooking | null>(null);
  /** Modal de calificación: puntaje seleccionado (1-5) */
  public readonly selectedRating = signal<number>(5);
  /** Modal de calificación: texto de reseña */
  public readonly ratingReview = signal<string>('');

  /** Días generados para el mes visible */
  public calendarDays = computed<DetailCalendarDay[]>(() => {
    const current = this.currentCalendarMonth();
    const year = current.getFullYear();
    const month = current.getMonth();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const avail = this.availability();
    const blockedDates = new Set([
      ...(avail?.blockedDates || []),
      ...(avail?.confirmedDates || []),
    ]);

    const selected = this.selectedDate();
    const days: DetailCalendarDay[] = [];

    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = dateStr < todayStr;
      const isBlocked = blockedDates.has(dateStr);
      const isSelected = dateStr === selected;

      days.push({
        dayNumber: day,
        dateString: dateStr,
        isBlocked,
        isPast,
        isSelected,
      });
    }

    return days;
  });

  /** Nombre legible del mes actual */
  public currentMonthLabel = computed(() => {
    const date = this.currentCalendarMonth();
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  });

  /**
   * Inicializa el componente registrando los íconos requeridos.
   */
  constructor() {
    addIcons({
      star,
      starOutline,
      locationOutline,
      languageOutline,
      idCardOutline,
      callOutline,
      logoWhatsapp,
      logoInstagram,
      globeOutline,
      mailOutline,
      calendarOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      chevronBackOutline,
      chevronForwardOutline,
      checkmarkDoneOutline,
      sendOutline,
      informationCircleOutline,
      ribbonOutline,
    });
  }

  /**
   * Ciclo de vida inicial del componente: carga perfil, agenda y reservas.
   */
  async ngOnInit() {
    const guideId = this.route.snapshot.paramMap.get('id');
    if (!guideId) {
      this.ui.showToast('Guía no especificado');
      this.router.navigate(['/home/guides']);
      return;
    }

    await this.loadGuideDetail(guideId);
    await this.loadAvailability(guideId);
    await this.loadMyBookings(guideId);
    await this.prefillBirderData();
  }

  /**
   * Carga la información del guía desde el servicio.
   * @param id ID del guía.
   */
  async loadGuideDetail(id: string) {
    this.isLoading.set(true);
    try {
      const guides = await this.guideService.getGuides().toPromise();
      const match = guides?.find((g) => g.id === id);
      if (match) {
        this.guide.set(match);
      }
    } catch {
      this.ui.showToast('Error al cargar la información del guía');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Carga las fechas ocupadas del calendario del guía.
   * @param guideId ID del guía.
   */
  async loadAvailability(guideId: string) {
    try {
      const res = await this.bookingService.getGuideAvailability(guideId);
      this.availability.set(res);
    } catch {
      // Si no hay disponibilidad, continúa con calendario vacío
    }
  }

  /**
   * Carga las reservas que este pajarero ha realizado con el guía actual.
   * @param guideId ID del guía.
   */
  async loadMyBookings(guideId: string) {
    try {
      const allMyBookings = await this.bookingService.getMyBookingsHistory();
      const filtered = allMyBookings.filter((b) => b.guideId === guideId);
      this.myBookings.set(filtered);
    } catch {
      // Ignorar si no hay sesión
    }
  }

  /**
   * Precarga el teléfono y correo del usuario autenticado en el formulario.
   */
  async prefillBirderData() {
    try {
      const user = await this.userService.getProfile();
      if (user) {
        if (user.email) this.contactEmail.set(user.email);
      }
    } catch {
      // Continuar con formulario en blanco
    }
  }

  /**
   * Resuelve URL absoluta de una imagen o foto.
   * @param path Ruta de la imagen.
   * @returns URL completa.
   */
  public getImageUrl(path: string | undefined): string {
    if (!path) return '';
    return path.startsWith('http')
      ? path
      : `${this.BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  /**
   * Genera avatar de respaldo.
   * @returns URL de ui-avatars.
   */
  public getAvatarFallback(): string {
    const name = encodeURIComponent(this.guide()?.fullName || 'Guía');
    return `https://ui-avatars.com/api/?name=${name}&background=1b5e20&color=fff&bold=true`;
  }

  /**
   * Manejador de error al cargar avatar.
   * @param event Evento DOM.
   */
  public onAvatarError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = this.getAvatarFallback();
    }
  }

  /**
   * Navega al mes anterior en el calendario.
   */
  prevMonth() {
    const cur = this.currentCalendarMonth();
    this.currentCalendarMonth.set(new Date(cur.getFullYear(), cur.getMonth() - 1, 1));
  }

  /**
   * Navega al mes siguiente en el calendario.
   */
  nextMonth() {
    const cur = this.currentCalendarMonth();
    this.currentCalendarMonth.set(new Date(cur.getFullYear(), cur.getMonth() + 1, 1));
  }

  /**
   * Selecciona una fecha libre para reservar.
   * @param day Día del calendario.
   */
  selectDate(day: DetailCalendarDay) {
    if (day.isPast) {
      this.ui.showToast('No es posible seleccionar una fecha pasada.');
      return;
    }
    if (day.isBlocked) {
      this.ui.showToast('Esta fecha está ocupada en la agenda del guía.');
      return;
    }
    this.selectedDate.set(day.dateString);
    this.ui.showToast(`Fecha ${day.dateString} seleccionada para tu actividad.`);
  }

  /**
   * Abre chat de WhatsApp con el número del guía.
   * @param phone Teléfono del guía.
   */
  openWhatsApp(phone?: string) {
    if (!phone) {
      this.ui.showToast('El guía no tiene número registrado.');
      return;
    }
    const clean = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${clean}`, '_blank');
  }

  /**
   * Envía la solicitud de reserva al guía a través de la plataforma.
   */
  async onSubmitBooking() {
    const guideId = this.guide()?.id;
    const date = this.selectedDate();
    const activity = this.activityType();
    const phone = this.contactPhone();
    const email = this.contactEmail();
    const msg = this.message();

    if (!guideId) return;

    if (!date) {
      this.ui.showToast('Por favor selecciona una fecha disponible en el calendario.');
      return;
    }

    if (!phone) {
      this.ui.showToast('Por favor ingresa tu número de contacto para que el guía pueda comunicarse.');
      return;
    }

    const payload: ICreateBookingDto = {
      bookingDate: date,
      activityType: activity,
      message: msg,
      contactPhone: phone,
      contactEmail: email,
    };

    this.isSubmitting.set(true);
    await this.ui.showLoading('Enviando solicitud de reserva...');

    try {
      await this.bookingService.createBooking(guideId, payload);
      await this.ui.dismissLoading();
      this.ui.showToast('¡Solicitud de reserva enviada exitosamente al guía!');
      this.selectedDate.set('');
      this.message.set('');
      await this.loadAvailability(guideId);
      await this.loadMyBookings(guideId);
    } catch {
      await this.ui.dismissLoading();
      this.ui.showToast('No fue posible enviar la reserva. Intenta de nuevo.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Manejador tipado para entrada de teléfono.
   * @param event Evento de entrada.
   */
  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.contactPhone.set(input.value);
    }
  }

  /**
   * Manejador tipado para entrada de mensaje.
   * @param event Evento de entrada.
   */
  onMessageInput(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    if (input) {
      this.message.set(input.value);
    }
  }

  /**
   * Manejador tipado para entrada de reseña.
   * @param event Evento de entrada.
   */
  onReviewInput(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    if (input) {
      this.ratingReview.set(input.value);
    }
  }

  /**
   * Abre modal para calificar un servicio completado.
   * @param booking Reserva a calificar.
   */
  openRatingModal(booking: IGuideBooking) {
    this.ratingModalBooking.set(booking);
    this.selectedRating.set(booking.rating || 5);
    this.ratingReview.set(booking.review || '');
  }

  /**
   * Guarda la calificación y reseña del servicio.
   */
  async submitRating() {
    const booking = this.ratingModalBooking();
    if (!booking) return;

    const payload: IRateBookingDto = {
      rating: this.selectedRating(),
      review: this.ratingReview(),
    };

    await this.ui.showLoading('Registrando calificación...');
    try {
      await this.bookingService.rateBooking(booking.id, payload);
      await this.ui.dismissLoading();
      this.ui.showToast('¡Gracias por calificar el servicio del guía!');
      this.ratingModalBooking.set(null);
      const guideId = this.guide()?.id;
      if (guideId) {
        await this.loadGuideDetail(guideId);
        await this.loadMyBookings(guideId);
      }
    } catch {
      await this.ui.dismissLoading();
      this.ui.showToast('Error al registrar la calificación.');
    }
  }
}
