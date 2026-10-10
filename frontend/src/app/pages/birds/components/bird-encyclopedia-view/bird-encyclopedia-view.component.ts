import {
  Component,
  Input,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonContent,
  IonSpinner,
  ModalController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  eye,
  eyeOutline,
  fitnessOutline,
  layersOutline,
  compassOutline,
  leafOutline,
  mapOutline,
  openOutline,
  globeOutline,
  informationCircleOutline,
  calendarOutline,
} from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import { IBirdSearch } from '../../../../core/models/birds.interfaces';
import { SearchMapComponent } from '../../bird-search/components/search-map/search-map.component';
import { ISightingMapMarker } from '../../sightings-map/sightings-map.page';
import { SightingsService } from '../../../../core/services/sightings.service';
import { DbHelperService } from '../../../../core/services/db-helper.service';
import { logger } from '../../../../core/utils/logger';

/**
 * @sdd
 * - [Objetivo]: Presenta la información biológica detallada de un ave y un mapa de avistamientos personales.
 * - [I/O]: Recibe la taxonomía del ave (BirdTaxonomy). Usa IonSegments para alternar vistas.
 * - [Edge Cases]: El mapa implementa Marker Clustering para prevenir ralentizaciones cuando hay muchos puntos.
 */
@Component({
  selector: 'app-bird-encyclopedia-view',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonContent,
    IonSpinner,
    SearchMapComponent,
  ],
  templateUrl: './bird-encyclopedia-view.component.html',
  styleUrls: ['./bird-encyclopedia-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirdEncyclopediaViewComponent {
  /** Controlador modal de Ionic */
  private modalCtrl = inject(ModalController);
  /** Servicio de consulta geoespacial de avistamientos */
  private sightingsService = inject(SightingsService);
  /** Helper de base de datos SQLite */
  private db = inject(DbHelperService);

  /** Inicialización de iconos requeridos por el componente */
  constructor() {
    addIcons({
      arrowBackOutline,
      eye,
      eyeOutline,
      fitnessOutline,
      layersOutline,
      compassOutline,
      leafOutline,
      mapOutline,
      openOutline,
      globeOutline,
      informationCircleOutline,
      calendarOutline,
    });
  }

  /** Setter de entrada compatible con ModalController de Ionic */
  @Input({ required: true })
  set bird(value: IBirdSearch) {
    this.birdData.set(value);
    if (value) {
      this.loadSightings(value);
    }
  }

  /**
   * Getter para acceso a los datos actuales del ave.
   * @returns Datos actuales del ave o null.
   */
  get bird(): IBirdSearch | null {
    return this.birdData();
  }

  /** Signal con los datos del ave */
  readonly birdData = signal<IBirdSearch | null>(null);

  /** Pestaña activa actual */
  readonly activeTab = signal<'basic' | 'records' | 'morphology' | 'links'>('basic');

  /** Modalidad activa de visualización de registros: 'mine' o 'national' (por defecto national 100) */
  readonly recordsMode = signal<'mine' | 'national'>('national');

  /** Avistamientos a nivel nacional (hasta 100) */
  readonly nationalSightings = signal<ISightingMapMarker[]>([]);

  /** Avistamientos personales locales */
  readonly mySightings = signal<ISightingMapMarker[]>([]);

  /** Estado de carga del mapa */
  readonly isLoadingSightings = signal<boolean>(false);

  /** Control de fallo en carga de imagen */
  readonly imageError = signal<boolean>(false);

  /** Validador reactivo de URL de imagen */
  readonly hasValidImage = computed(() => {
    const img = this.birdData()?.base_image;
    return (
      !!img &&
      img.trim() !== '' &&
      img !== '-' &&
      img !== 'null' &&
      (img.startsWith('http://') ||
        img.startsWith('https://') ||
        img.startsWith('assets/'))
    );
  });

  /** Avistamientos que se muestran en el mapa según el modo seleccionado */
  readonly displayedSightings = computed<ISightingMapMarker[]>(() => {
    return this.recordsMode() === 'mine'
      ? this.mySightings()
      : this.nationalSightings();
  });

  /**
   * Cierra el modal actual.
   */
  dismissModal(): void {
    this.modalCtrl.dismiss();
  }

  /**
   * Gestiona el cambio de pestaña principal.
   * @param event Evento emitido por ion-segment.
   */
  onTabChange(event: CustomEvent): void {
    const val = event.detail?.value;
    if (
      val === 'basic' ||
      val === 'records' ||
      val === 'morphology' ||
      val === 'links'
    ) {
      this.activeTab.set(val);
    }
  }

  /**
   * Conmuta entre Mis Registros y Registros a Nivel Nacional.
   * @param event Evento emitido por el segmento de registros.
   */
  onRecordsModeChange(event: CustomEvent): void {
    const val = event.detail?.value;
    if (val === 'mine' || val === 'national') {
      this.recordsMode.set(val);
    }
  }

  /**
   * Manejador de error al cargar la fotografía principal.
   */
  handleImageError(): void {
    this.imageError.set(true);
  }

  /**
   * Manejador de selección de marcador en el mapa.
   * @param marker Marcador de avistamiento seleccionado.
   */
  onMarkerSelected(marker: ISightingMapMarker): void {
    logger.debug('Marcador de avistamiento seleccionado:', marker.id);
  }

  /**
   * Carga los registros nacionales y locales correspondientes a la especie.
   * @param bird Ave a consultar.
   */
  private async loadSightings(bird: IBirdSearch): Promise<void> {
    this.isLoadingSightings.set(true);
    const birdIdStr = String(bird.id);

    // 1. Cargar registros a nivel nacional (Postgres / SightingsService)
    try {
      const spatialSightings = await firstValueFrom(
        this.sightingsService.search(birdIdStr),
      );
      const markers: ISightingMapMarker[] = (spatialSightings || [])
        .slice(0, 100)
        .map((s) => ({
          id: s.id,
          birdName: s.birdName,
          date: s.date,
          time: s.time,
          location: {
            type: 'Point',
            coordinates: s.location.coordinates,
          },
          user: {
            name: s.user.name,
            photoUrl: s.user.photoUrl,
          },
        }));
      this.nationalSightings.set(markers);
    } catch {
      this.nationalSightings.set([]);
    } finally {
      this.isLoadingSightings.set(false);
    }

    // 2. Cargar mis registros personales desde route_sightings / sightings locales
    await this.loadMySightingsFromLocal(bird.id);
  }

  /**
   * Consulta los avistamientos personales del usuario en SQLite local.
   * @param birdId ID del ave.
   */
  private async loadMySightingsFromLocal(birdId: number): Promise<void> {
    try {
      const sql = `
        SELECT rs.id, rs.lat, rs.lng, rs.timestamp, b.scientific_name, b.english_name
        FROM route_sightings rs
        JOIN birds b ON rs.bird_id = b.id
        WHERE rs.bird_id = ?
        ORDER BY rs.id DESC
      `;
      const rows = (await this.db.query(sql, [birdId])) as Array<{
        /**
         * Identificador numérico del avistamiento.
         */
        id: number;
        /**
         * Latitud registrada.
         */
        lat: number;
        /**
         * Longitud registrada.
         */
        lng: number;
        /**
         * Marca de tiempo.
         */
        timestamp: string;
        /**
         * Nombre científico del ave.
         */
        scientific_name: string;
        /**
         * Nombre en inglés del ave.
         */
        english_name: string;
      }>;

      if (rows && rows.length > 0) {
        const markers: ISightingMapMarker[] = rows.map((r) => ({
          id: String(r.id),
          birdName: `${r.scientific_name} (${r.english_name})`,
          date: r.timestamp ? r.timestamp.split('T')[0] : 'Hoy',
          time:
            r.timestamp && r.timestamp.includes('T')
              ? r.timestamp.split('T')[1].substring(0, 5)
              : '',
          location: {
            type: 'Point',
            coordinates: [r.lng, r.lat],
          },
          user: {
            name: 'Mis Registros',
            photoUrl: 'assets/imgs/commons/no-image.png',
          },
        }));
        this.mySightings.set(markers);
      } else {
        this.mySightings.set([]);
      }
    } catch {
      this.mySightings.set([]);
    }
  }
}

