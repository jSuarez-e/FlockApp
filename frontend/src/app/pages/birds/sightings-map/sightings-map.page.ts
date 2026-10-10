import {
  Component,
  signal,
  inject,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { logger } from '../../../core/utils/logger';
/**
 *
 */
export interface ISightingMapMarker {
  /** Identificador único del avistamiento */
  id: string;
  /** ID del ave */
  birdId?: number | string;
  /** Nombre compuesto o principal del ave */
  birdName: string;
  /** Nombre científico del ave */
  scientificName?: string;
  /** Nombre en inglés del ave */
  englishName?: string;
  /** Nombre común del ave */
  commonName?: string;
  /** Fecha del avistamiento */
  date: string;
  /** Hora del avistamiento */
  time: string;
  /** Ubicación espacial */
  location?: {
    /** Tipo GeoJSON */
    type?: string;
    /** Coordenadas [longitud, latitud] */
    coordinates: number[];
  };
  /** Usuario autor del registro */
  user?: {
    /** ID del usuario */
    id?: string;
    /** Nombre del usuario */
    name: string;
    /** Foto del usuario */
    photoUrl?: string;
  };
}

/**
 * Ubicación territorial resuelta mediante geocodificación inversa
 */
export interface ISightingResolvedLocation {
  /** Nombre del municipio detectado */
  municipalityName?: string;
  /** Nombre del departamento detectado */
  departmentName?: string;
}

import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonModal,
  IonIcon,
  IonSearchbar,
  IonList,
  IonBadge,
  IonSpinner,
  ModalController,
} from '@ionic/angular';
import { SearchMapComponent } from '../bird-search/components/search-map/search-map.component';
import { SightingsMapStore } from '../../../core/stores/sightings-map.store';
import { ActiveRouteStore } from '../../../core/stores/active-route.store';
import { BirdSearchStore } from '../../../core/stores/bird-search.store';
import { UiService } from '../../../core/services/ui.service';
import { GeographyService, ResolvedLocation } from '../../../core/services/geography.service';
import { environment } from '../../../../environments/environment';
import { PublicProfilePage } from '../../profile/public-profile/public-profile.page';
import { IBirdSearch } from '../../../core/models/birds.interfaces';
import { addIcons } from 'ionicons';
import {
  chevronDownOutline,
  calendarOutline,
  map,
  locationOutline,
  personOutline,
  closeCircleOutline,
  searchOutline,
  checkmarkCircleOutline,
  compassOutline,
  sparklesOutline,
  timeOutline,
  chevronForwardOutline,
  bookOutline,
} from 'ionicons/icons';

/**
 * Componente principal de Mapa de Avistamientos
 */
@Component({
  selector: 'app-sightings-map',
  templateUrl: './sightings-map.page.html',
  styleUrls: ['./sightings-map.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SearchMapComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonModal,
    IonIcon,
    IonSearchbar,
    IonList,
    IonBadge,
    IonSpinner,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SightingsMapPage implements OnInit {
  /**
   * Controlador de modales de Ionic
   */
  private readonly modalCtrl = inject(ModalController);
  /**
   * Store de mapa de avistamientos
   */
  public sightingsMapStore = inject(SightingsMapStore);
  /**
   * Store de rutas activas para catálogos
   */
  private readonly routeStore = inject(ActiveRouteStore);
  /**
   * Store del buscador de aves
   */
  public readonly birdStore = inject(BirdSearchStore);
  /**
   * UI Service
   */
  private readonly uiService = inject(UiService);
  /**
   * Servicio de geografía y geocodificación inversa
   */
  private readonly geographyService = inject(GeographyService);

  /**
   * ID de ave a buscar
   */
  public searchBirdId = signal<string>('');
  /**
   * Nombre de ave a buscar
   */
  public searchBirdName = signal<string>('');
  // Permite string ('all') o number (dept.id) para evitar mismatch en ion-select
  /**
   * Departamento a buscar
   */
  public searchDepartment = signal<string | number>('all');
  /**
   * Lista de departamentos
   */
  public departments = this.routeStore.departments;
  /**
   * Avistamiento seleccionado
   */
  public selectedSighting = signal<ISightingMapMarker | null>(null);
  /**
   * Ubicación geográfica resuelta (municipio y departamento)
   */
  public resolvedLocation = signal<ISightingResolvedLocation | null>(null);
  /**
   * Estado de resolución de geolocalización inversa
   */
  public isResolvingLocation = signal<boolean>(false);

  // Birds Modal state
  /**
   * Modal de búsqueda de aves
   */
  public isBirdModalOpen = signal<boolean>(false);
  /**
   * Término de búsqueda
   */
  public birdSearchTerm = signal<string>('');
  /**
   * Aves filtradas
   */
  public filteredBirds = computed(() => {
    const term = this.birdSearchTerm().toLowerCase();
    const allBirds = this.birdStore.birds() || [];
    if (!term) return allBirds.slice(0, 50); // Mostrar max 50 por defecto
    return allBirds
      .filter(
        (b) =>
          (b.common_name && b.common_name.toLowerCase().includes(term)) ||
          (b.scientific_name && b.scientific_name.toLowerCase().includes(term)) ||
          (b.english_name && b.english_name.toLowerCase().includes(term)),
      )
      .slice(0, 50);
  });

  // sightingsSignal ya no es necesario, usamos el store
  /**
   * Señal de avistamientos encontrados
   */
  public sightingsSignal = this.sightingsMapStore.sightings;

  /**
   * Registra los iconos usados en el HTML
   */
  constructor() {
    addIcons({
      chevronDownOutline,
      calendarOutline,
      map,
      locationOutline,
      personOutline,
      closeCircleOutline,
      searchOutline,
      checkmarkCircleOutline,
      compassOutline,
      sparklesOutline,
      timeOutline,
      chevronForwardOutline,
      bookOutline,
    });
  }

  /**
   * Inicializa el catálogo de aves y departamentos al cargar la vista.
   */
  async ngOnInit() {
    // Asegurar que el catálogo de aves esté cargado
    if (this.birdStore.birds().length === 0) {
      this.birdStore.loadCatalog();
    }
    // Cargar departamentos desde el Store
    try {
      await this.routeStore.loadDepartments();
    } catch (err) {
      logger.error('Error cargando departamentos', err);
    }
  }

  /**
   * Selecciona una ave desde el modal
   * @param bird El ave seleccionada
   */
  selectBird(bird: IBirdSearch) {
    this.searchBirdId.set(String(bird.id));
    this.searchBirdName.set(`${bird.scientific_name} (${bird.english_name || bird.common_name})`);
    this.isBirdModalOpen.set(false);
  }

  /**
   * Limpia el filtro de ave seleccionado
   * @param event Evento del click opcional
   */
  clearBirdFilter(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.searchBirdId.set('');
    this.searchBirdName.set('');
  }

  /**
   * Ejecuta la búsqueda de avistamientos en el mapa con los filtros activos.
   */
  triggerMapSearch() {
    this.sightingsMapStore.searchSightings({
      birdId: this.searchBirdId(),
      department: this.searchDepartment(),
      birdName: this.searchBirdName(),
    });
  }

  /**
   * Abre el modal de avistamiento enriqueciendo datos taxonómicos y resolviendo municipio/departamento
   * @param sighting El avistamiento seleccionado
   */
  async openSightingModal(sighting: ISightingMapMarker) {
    let enriched: ISightingMapMarker = { ...sighting };

    // Cruzar con el catálogo de aves si faltan nombres científicos o en inglés
    const catalog = this.birdStore.birds() || [];
    const matchedBird = catalog.find((b) => {
      if (sighting.birdId && String(b.id) === String(sighting.birdId)) {
        return true;
      }
      if (sighting.birdName) {
        const query = sighting.birdName.toLowerCase();
        return (
          b.scientific_name?.toLowerCase() === query ||
          b.common_name?.toLowerCase() === query ||
          b.english_name?.toLowerCase() === query
        );
      }
      return false;
    });

    if (matchedBird) {
      enriched = {
        ...enriched,
        birdId: enriched.birdId ?? matchedBird.id,
        scientificName: enriched.scientificName || matchedBird.scientific_name,
        englishName: enriched.englishName || matchedBird.english_name,
        commonName: enriched.commonName || matchedBird.common_name,
      };
    }

    this.selectedSighting.set(enriched);
    this.resolvedLocation.set(null);

    // Resolución de geolocalización inversa
    const coords = sighting.location?.coordinates;
    if (coords && coords.length >= 2) {
      const [lng, lat] = coords;
      if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
        this.isResolvingLocation.set(true);
        try {
          const resolved: ResolvedLocation = await this.geographyService.reverseGeocode(lat, lng);
          if (resolved.municipalityName || resolved.departmentName) {
            this.resolvedLocation.set({
              municipalityName: resolved.municipalityName,
              departmentName: resolved.departmentName,
            });
          }
        } catch (e) {
          logger.warn('[SightingsMapPage] No fue posible resolver la geocodificación inversa:', e);
        } finally {
          this.isResolvingLocation.set(false);
        }
      }
    }
  }

  /**
   * Cierra el modal de detalle del avistamiento seleccionado.
   */
  closeSightingModal() {
    this.selectedSighting.set(null);
    this.resolvedLocation.set(null);
    this.isResolvingLocation.set(false);
  }

  /**
   * Resuelve la URL de la foto de perfil o genera un avatar elegante con iniciales
   * @param photoUrl URL previa del usuario
   * @param userName Nombre del usuario
   * @returns URL válida y segura para renderizar
   */
  getUserAvatarUrl(photoUrl?: string, userName?: string): string {
    if (photoUrl && photoUrl.trim() && !photoUrl.includes('general-error.png')) {
      if (photoUrl.startsWith('http')) {
        return photoUrl;
      }
      const baseUrl = environment.apiUrl.replace(/\/api\/?$/, '');
      const cleanPath = photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`;
      return `${baseUrl}${cleanPath}`;
    }
    const safeName = encodeURIComponent(userName?.trim() || 'Pajarero');
    return `https://ui-avatars.com/api/?name=${safeName}&background=1b5e20&color=fff&bold=true`;
  }

  /**
   * Maneja el error de carga de avatar aplicando fallback automático
   * @param event Evento de error
   * @param userName Nombre del usuario para iniciales
   */
  onAvatarError(event: Event, userName?: string) {
    const target = event.target as HTMLImageElement;
    if (target) {
      const safeName = encodeURIComponent(userName?.trim() || 'Pajarero');
      target.src = `https://ui-avatars.com/api/?name=${safeName}&background=1b5e20&color=fff&bold=true`;
    }
  }

  /**
   * Abre el perfil público del usuario en un modal interactivo
   * @param userId Identificador del usuario
   */
  async openUserProfile(userId?: string): Promise<void> {
    if (!userId) return;
    const modal = await this.modalCtrl.create({
      component: PublicProfilePage,
      componentProps: {
        userId,
      },
      initialBreakpoint: 0.9,
      breakpoints: [0, 0.9, 1],
      handle: true,
    });
    await modal.present();
  }

  /**
   * Abre en Google Maps
   * @param sighting El avistamiento
   */
  openGoogleMaps(sighting: ISightingMapMarker) {
    const loc = sighting['location'] as { /**
     *
     */
    coordinates?: [number, number] } | undefined;
    if (loc?.coordinates) {
      const [lng, lat] = loc.coordinates;
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    }
  }

  /**
   * Formatea la fecha y hora a un formato legible: "28 de Septiembre de 2026 - 04:29"
   * @param dateString Fecha inicial
   * @param timeString Hora inicial
   * @returns La cadena de texto de la fecha formateada
   */
  formatDate(dateString: string, timeString: string): string {
    if (!dateString) return '';
    try {
      // Intentamos parsear la fecha, asumiendo "YYYY-MM-DD"
      const dateParts = dateString.split('-');
      if (dateParts.length !== 3) return `${dateString} - ${timeString}`;
      
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Meses en JS son 0-11
      const day = parseInt(dateParts[2], 10);
      
      const date = new Date(year, month, day);
      const dayFormatted = date.getDate();
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      const monthName = monthNames[date.getMonth()];
      const yearFormatted = date.getFullYear();

      return `${dayFormatted} de ${monthName} de ${yearFormatted} - ${timeString || '00:00'}`;
    } catch {
      return `${dateString} - ${timeString}`;
    }
  }
}
