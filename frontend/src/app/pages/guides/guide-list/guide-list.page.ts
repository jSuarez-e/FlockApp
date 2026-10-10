import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSpinner,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
  IonList,
  IonBadge,
  IonModal,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonSearchbar,
} from '@ionic/angular';
import { GuideStore } from '../../../core/stores/guide.store';
import { GuideBookingService } from '../../../core/services/guide-booking.service';
import { UiService } from '../../../core/services/ui.service';
import { IGuide } from '../../../../../../shared/models/catalogs.interface';
import { IGuideBooking, IRateBookingDto } from '../../../../../../shared/models/guide-booking.interface';
import { environment } from '../../../../environments/environment';
import { addIcons } from 'ionicons';
import {
  informationCircleOutline,
  locationOutline,
  star,
  starOutline,
  languageOutline,
  idCardOutline,
  logoWhatsapp,
  calendarOutline,
  calendarNumberOutline,
  ribbonOutline,
  checkmarkDoneOutline,
  timeOutline,
  searchOutline,
  sparklesOutline,
  closeOutline,
  personOutline,
  chevronForwardOutline,
  filterOutline,
} from 'ionicons/icons';

/**
 * Interfaz auxiliar para invocar complete sobre el refresher.
 */
interface RefresherTarget {
  /** Finaliza la animación del refresher */
  complete?: () => void;
}

/**
 * @sdd
 * [Objetivo]: Catálogo del Directorio de Guías con acceso a perfil, agenda interactiva y reservas.
 * [I/O]: Consume GuideStore y GuideBookingService.
 * [Edge Cases]: Carga offline-first reactiva y navegación protegida.
 */
@Component({
  selector: 'app-guide-list',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSpinner,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonIcon,
    IonList,
    IonBadge,
    IonModal,
    IonButton,
    IonButtons,
    IonMenuButton,
    IonSearchbar,
  ],
  templateUrl: './guide-list.page.html',
  styleUrls: ['./guide-list.page.scss'],
})
export class GuideListPage implements OnInit {
  /** Guías cargadas en el store reactivo */
  public readonly guideStore = inject(GuideStore);
  /** Router inyectado */
  private readonly router = inject(Router);
  /** Servicio de reservas inyectado */
  private readonly bookingService = inject(GuideBookingService);
  /** Servicio de UI inyectado */
  private readonly ui = inject(UiService);

  /** Guía seleccionado para modal rápido */
  public selectedGuide = signal<IGuide | null>(null);

  /** Modal de Historial de Reservas del Pajarero */
  public isBookingsModalOpen = signal<boolean>(false);
  /** Lista de reservas realizadas por el usuario */
  public myBookings = signal<IGuideBooking[]>([]);
  /** Indicador de carga de reservas */
  public isLoadingBookings = signal<boolean>(false);

  /** Modal de Calificación */
  public ratingBooking = signal<IGuideBooking | null>(null);
  /** Puntaje seleccionado */
  public ratingScore = signal<number>(5);
  /** Reseña textual */
  public ratingReview = signal<string>('');

  /** Término de búsqueda de guías */
  public searchTerm = signal<string>('');

  /** Filtro rápido seleccionado */
  public selectedFilter = signal<string>('all');

  /** Opciones de filtros rápidos */
  public readonly filters = [
    { id: 'all', label: 'Todos' },
    { id: 'verified', label: 'Verificados' },
    { id: 'top', label: '⭐ Destacados' },
    { id: 'fotografia', label: 'Fotografía' },
    { id: 'endemica', label: 'Endémicas' },
  ];

  /** Guías filtradas según término de búsqueda y categoría */
  public filteredGuides = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const filter = this.selectedFilter();
    const guides = this.guideStore.allGuides();

    return guides.filter((g) => {
      const matchSearch =
        !term ||
        g.fullName.toLowerCase().includes(term) ||
        (g.location && g.location.toLowerCase().includes(term)) ||
        (g.specialty && g.specialty.toLowerCase().includes(term)) ||
        (g.languages && g.languages.toLowerCase().includes(term));

      let matchFilter = true;
      if (filter === 'verified') {
        matchFilter = !!g.isPublished;
      } else if (filter === 'top') {
        matchFilter = (g.rating || 0) >= 4.8;
      } else if (filter === 'fotografia') {
        matchFilter = Boolean(
          g.specialty?.toLowerCase().includes('foto') ||
          g.details?.toLowerCase().includes('foto'),
        );
      } else if (filter === 'endemica') {
        matchFilter = Boolean(
          g.specialty?.toLowerCase().includes('endém') ||
          g.specialty?.toLowerCase().includes('endem') ||
          g.details?.toLowerCase().includes('endém') ||
          g.details?.toLowerCase().includes('endem'),
        );
      }

      return matchSearch && matchFilter;
    });
  });

  /**
   * Registra los iconos usados en la vista
   */
  constructor() {
    addIcons({
      informationCircleOutline,
      locationOutline,
      star,
      starOutline,
      languageOutline,
      idCardOutline,
      logoWhatsapp,
      calendarOutline,
      calendarNumberOutline,
      ribbonOutline,
      checkmarkDoneOutline,
      timeOutline,
      searchOutline,
      sparklesOutline,
      closeOutline,
      personOutline,
      chevronForwardOutline,
      filterOutline,
    });
  }

  /**
   * Carga el catálogo de guías y reservas previas al inicializar la vista.
   */
  async ngOnInit() {
    this.guideStore.loadGuides();
    try {
      const history = await this.bookingService.getMyBookingsHistory();
      if (history) {
        this.myBookings.set(history);
      }
    } catch {
      // Ignorar fallo en carga en segundo plano de reservas
    }
  }


  /**
   * Restablece filtros y término de búsqueda.
   */
  resetFilters(): void {
    this.searchTerm.set('');
    this.selectedFilter.set('all');
  }

  /**
   * Resuelve la URL del avatar del guía o genera un fallback elegante con iniciales.
   * @param photoUrl URL provista para la foto del guía.
   * @param fullName Nombre completo del guía.
   * @returns URL segura y visualmente pulida para la imagen.
   */
  getGuideAvatarUrl(photoUrl?: string, fullName?: string): string {
    if (photoUrl && photoUrl.trim() && !photoUrl.includes('general-error.png')) {
      if (photoUrl.startsWith('http')) {
        return photoUrl;
      }
      const baseUrl = environment.apiUrl.replace(/\/api\/?$/, '');
      const cleanPath = photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`;
      return `${baseUrl}${cleanPath}`;
    }
    const safeName = encodeURIComponent(fullName?.trim() || 'Guía');
    return `https://ui-avatars.com/api/?name=${safeName}&background=1b5e20&color=fff&bold=true`;
  }

  /**
   * Manejador de error para carga de avatar del guía aplicando fallback automático.
   * @param event Evento DOM de error.
   * @param fullName Nombre completo del guía.
   */
  onAvatarError(event: Event, fullName?: string): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      const safeName = encodeURIComponent(fullName?.trim() || 'Guía');
      target.src = `https://ui-avatars.com/api/?name=${safeName}&background=1b5e20&color=fff&bold=true`;
    }
  }

  /**
   * Refresca la lista mediante scroll vertical (pull to refresh)
   * @param event Evento del componente IonRefresher
   */
  async doRefresh(event: CustomEvent) {
    await this.guideStore.loadGuides();
    const target = event?.target as unknown as RefresherTarget;
    if (target && typeof target.complete === 'function') {
      target.complete();
    }
  }

  /**
   * Función de tracking para la lista, identifica items por su ID.
   * @param _index Índice del elemento.
   * @param item Guía de la lista.
   * @returns ID del elemento.
   */
  trackById(_index: number, item: IGuide): string {
    return item?.id || String(_index);
  }

  /**
   * Navega a la vista detallada del guía con calendario y formulario de reserva.
   * @param guideId ID del guía seleccionado.
   */
  goToGuideDetail(guideId: string) {
    this.router.navigate(['/home/guides', guideId]);
  }

  /**
   * Abre modal para visualizar opciones de contacto rápido
   * @param guide El guía seleccionado
   */
  openContactModal(guide: IGuide) {
    this.selectedGuide.set(guide);
  }

  /**
   * Abre el modal del historial de reservas del pajarero.
   */
  async openMyBookings() {
    this.isBookingsModalOpen.set(true);
    this.isLoadingBookings.set(true);
    try {
      const history = await this.bookingService.getMyBookingsHistory();
      this.myBookings.set(history);
    } catch {
      this.ui.showToast('No fue posible cargar tus reservas');
    } finally {
      this.isLoadingBookings.set(false);
    }
  }

  /**
   * Abre modal de calificación de servicio.
   * @param booking Reserva a calificar.
   */
  openRating(booking: IGuideBooking) {
    this.ratingBooking.set(booking);
    this.ratingScore.set(booking.rating || 5);
    this.ratingReview.set(booking.review || '');
  }

  /**
   * Guarda calificación del servicio.
   */
  async submitRating() {
    const booking = this.ratingBooking();
    if (!booking) return;

    const payload: IRateBookingDto = {
      rating: this.ratingScore(),
      review: this.ratingReview(),
    };

    await this.ui.showLoading('Guardando calificación...');
    try {
      await this.bookingService.rateBooking(booking.id, payload);
      await this.ui.dismissLoading();
      this.ui.showToast('¡Calificación guardada exitosamente!');
      this.ratingBooking.set(null);
      await this.openMyBookings();
    } catch {
      await this.ui.dismissLoading();
      this.ui.showToast('Error al calificar el servicio');
    }
  }

  /**
   * Abre WhatsApp con el guía.
   * @param phone Teléfono del guía.
   */
  openWhatsApp(phone?: string) {
    if (!phone) return;
    const clean = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${clean}`, '_blank');
  }
}
