/**
 * @file map-tracker.component.ts
 * @sdd Dumb component que renderiza el trazo Polyline y los pines de observación en mapa Leaflet.
 */
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  input,
  effect,
} from '@angular/core';

import { IRouteSighting } from '../../../../../../../../shared/models/routes.interface';
import * as L from 'leaflet';

/**
 * Extensión de registro de avistamiento con metadatos de ave resueltos.
 */
interface ISightingRecordWithInfo {
  /** Información taxonómica opcional de la especie */
  birdInfo?: Record<string, string>;
  /** Identificador de la especie */
  bird_id: string;
}

/**
 * Componente presentador que renderiza el mapa Leaflet interactivo con el recorrido y marcadores de aves.
 */
@Component({
  selector: 'app-map-tracker',
  standalone: true,
  imports: [],
  templateUrl: './map-tracker.component.html',
  styleUrls: ['./map-tracker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapTrackerComponent implements AfterViewInit, OnDestroy {
  /** Trazo de coordenadas GPS [longitud, latitud] acumuladas en la ruta */
  public readonly path = input<[number, number][]>([]);

  /** Lista de avistamientos registrados durante la ruta activa */
  public readonly sightings = input<IRouteSighting[]>([]);

  /** Contenedor DOM nativo para instanciar Leaflet */
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  /** Instancia principal del mapa Leaflet */
  private map!: L.Map;

  /** Capa vectorial de polilínea para trazar la ruta */
  private polyline!: L.Polyline;

  /** Grupo de capas para los marcadores de avistamiento */
  private markerLayer = L.layerGroup();

  /** Marcador que indica la posición actual del usuario */
  private userMarker!: L.Marker;

  /** Bandera para evitar re-centrar el mapa constantemente tras el primer zoom */
  private firstPanDone = false;

  /** Referencia al temporizador de redimensionamiento */
  private resizeTimer?: ReturnType<typeof setTimeout>;

  /** Bandera que indica si el componente fue destruido */
  private isDestroyed = false;

  /**
   * Inicializa los efectos reactivos para redibujar polilínea y marcadores cuando cambian los inputs.
   */
  constructor() {
    effect(() => {
      const currentPath = this.path();
      const currentSightings = this.sightings();

      if (!this.isDestroyed && this.map) {
        if (currentPath && currentPath.length > 0) {
          // Leaflet usa [lat, lng], el path es [lng, lat]
          const latLngs = currentPath.map((p) => [p[1], p[0]] as [number, number]);
          const currentPos = latLngs[latLngs.length - 1];

          this.polyline.setLatLngs(latLngs);

          if (!this.firstPanDone) {
            this.map.setView(currentPos, 17);
            this.firstPanDone = true;
          } else {
            this.map.panTo(currentPos);
          }

          // Actualiza o crea el marcador de posición del usuario
          if (!this.userMarker) {
            const userIcon = L.divIcon({
              className: 'user-pulse-icon',
              html: '<div class="pulse-dot"></div>',
              iconSize: [18, 18],
              iconAnchor: [9, 9],
            });
            this.userMarker = L.marker(currentPos, {
              icon: userIcon,
              zIndexOffset: 1000,
            }).addTo(this.map);
          } else {
            this.userMarker.setLatLng(currentPos);
          }
        }

        if (currentSightings) {
          this.markerLayer.clearLayers();

          const birdIcon = L.divIcon({
            className: 'bird-sighting-icon',
            html: '<div class="bird-sighting-icon__dot"></div>',
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          });

          currentSightings.forEach((s) => {
            const dateObj = new Date(s.timestamp);
            const dateStr = dateObj.toLocaleDateString();
            const timeStr = dateObj.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const sRecord = s as unknown as ISightingRecordWithInfo;
            const scientificName =
              sRecord.birdInfo?.['scientific_name'] || `Ave ID: ${sRecord.bird_id}`;
            const englishName = sRecord.birdInfo?.['english_name'] || '';

            const popupHtml = `
              <div class="bird-popup">
                <strong class="bird-popup__title">${scientificName}</strong><br>
                ${englishName ? `<span class="bird-popup__subtitle">${englishName}</span><br>` : ''}
                <span class="bird-popup__meta">📅 ${dateStr} - 🕒 ${timeStr}</span><br>
                <span class="bird-popup__detail"><strong>Cantidad:</strong> ${s.quantity}</span>
                ${
                  s.details
                    ? `<br><span class="bird-popup__detail"><strong>Detalle:</strong> ${s.details}</span>`
                    : ''
                }
              </div>
            `;
            const m = L.marker([s.lat, s.lng], { icon: birdIcon }).bindPopup(popupHtml);
            this.markerLayer.addLayer(m);
          });
        }
      }
    });
  }

  /**
   * Inicializa la instancia del mapa una vez cargada la vista en el DOM.
   */
  public ngAfterViewInit(): void {
    this.initMap();
  }

  /**
   * Instancia el mapa Leaflet, la capa base de OpenStreetMap y las capas vectoriales.
   */
  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView(
      [4.5709, -74.2973],
      5,
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap FlockApp',
      crossOrigin: true,
    }).addTo(this.map);

    this.polyline = L.polyline([], { color: 'blue', weight: 4 }).addTo(this.map);
    this.markerLayer.addTo(this.map);

    // Ajuste de dimensiones tras delay de renderizado Ionic
    this.resizeTimer = setTimeout(() => {
      if (!this.isDestroyed && this.map) {
        try {
          this.map.invalidateSize();
        } catch {
          // Mapa desmontado previamente de manera segura
        }
      }
    }, 400);
  }

  /**
   * Limpia los recursos y destruye la instancia del mapa Leaflet al salir.
   */
  public ngOnDestroy(): void {
    this.isDestroyed = true;
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = undefined;
    }
    if (this.map) {
      try {
        this.map.remove();
      } catch {
        // Safe teardown
      }
    }
  }
}
