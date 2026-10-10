/**
 * @sdd
 * @description Listado de Sitios de Aviturismo (Offline First).
 * @io Inyecta SiteStore para la colección reactiva.
 */
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonSpinner,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { informationCircleOutline, locationOutline } from 'ionicons/icons';
import { SiteStore } from '../../../core/stores/site.store';
import { SyncQueueStore } from '../../../core/stores/sync-queue.store';
import { Router } from '@angular/router';
import { SearchMapComponent } from '../../birds/bird-search/components/search-map/search-map.component';
import { ISightingMapMarker } from '../../birds/sightings-map/sightings-map.page';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

/**
 * Interfaz para el elemento target de IonRefresher.
 */
interface RefresherTarget {
  /** Finaliza la animación del refresher */
  complete?: () => void;
}

/**
 * Evento emitido al interactuar con un marcador en el mapa.
 */
interface SiteMarkerClickEvent extends ISightingMapMarker {
  /** Objeto de sitio asociado */
  site?: {
    /** Identificador único del sitio */
    id?: string;
  };
}

/**
 * Página principal de listado y mapa de sitios de aviturismo para pajareros.
 */
@Component({
  selector: 'app-site-list',
  standalone: true,
  imports: [
    CommonModule,
    IonSpinner,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonIcon,
    IonSelect,
    IonSelectOption,
    SearchMapComponent,
    SectionHeaderComponent,
  ],
  templateUrl: './site-list.page.html',
  styleUrls: ['./site-list.page.scss'],
})
export class SiteListPage implements OnInit {
  /** Inyección reactiva del almacén de sitios */
  public readonly siteStore = inject(SiteStore);
  /** Inyección del almacén de sincronización offline-first */
  public readonly syncStore = inject(SyncQueueStore);
  /** Enrutador de Angular */
  private readonly router = inject(Router);

  /** Criterio de búsqueda por nombre de sitio */
  public searchSiteName = signal('');
  /** Filtro de búsqueda por departamento */
  public searchDepartment = signal('all');

  /** Lista calculada de departamentos disponibles para filtrar */
  public readonly departments = computed(() => {
    const sites = this.siteStore.allSites();
    const depts = new Set(sites.map((s) => s.department).filter((d) => !!d));
    return Array.from(depts).sort();
  });

  /** Marcadores de mapa filtrados según criterios de búsqueda y con coordenadas válidas */
  public readonly filteredSitesMapMarkers = computed(() => {
    const sites = this.siteStore.allSites();
    const qName = this.searchSiteName().toLowerCase();
    const qDept = this.searchDepartment();

    return sites
      .filter((s) => {
        const matchName = !qName || s.name.toLowerCase().includes(qName);
        const matchDept = qDept === 'all' || s.department === qDept;
        const hasCoords =
          s.location &&
          typeof s.location.lat === 'number' &&
          typeof s.location.lng === 'number' &&
          (Math.abs(s.location.lat) > 0.0001 ||
            Math.abs(s.location.lng) > 0.0001);
        return matchName && matchDept && hasCoords;
      })
      .map((s) => {
        return {
          id: s.id,
          location: { coordinates: [s.location!.lng, s.location!.lat] },
          site: s,
        } as unknown as ISightingMapMarker;
      });
  });

  /**
   * Registra los iconos requeridos para el estado vacío y selectores de sitio.
   */
  constructor() {
    addIcons({
      'information-circle-outline': informationCircleOutline,
      'location-outline': locationOutline,
    });
  }

  /**
   * Restablece los filtros de búsqueda por nombre y departamento.
   */
  resetFilters(): void {
    this.searchSiteName.set('');
    this.searchDepartment.set('all');
  }

  /**
   * Inicialización del componente al cargarse por primera vez.
   */
  ngOnInit(): void {
    this.siteStore.loadSites();
  }

  /**
   * Ciclo de vida Ionic: se ejecuta cada vez que la vista entra en foco,
   * garantizando que sitios creados o modificados en Modo Proveedor se reflejen de inmediato.
   */
  ionViewWillEnter(): void {
    this.siteStore.loadSites();
  }

  /**
   * Ejecuta el ciclo de sincronización al arrastrar hacia abajo para refrescar directamente desde Postgres.
   * @param event Evento emitido por IonRefresher.
   */
  doRefresh(event: CustomEvent): void {
    const target = event?.target as unknown as RefresherTarget;
    this.siteStore
      .loadSites()
      .finally(() => {
        if (target && typeof target.complete === 'function') {
          target.complete();
        }
      });
  }

  /**
   * Navega a la vista de detalle de un sitio al seleccionarlo en el mapa.
   * @param event Marcador de avistamiento o sitio seleccionado.
   */
  openSiteDetail(event: SiteMarkerClickEvent): void {
    if (event && event.site && event.site.id) {
      this.router.navigate(['/home/sites', event.site.id]);
    }
  }
}
