import {
  Component,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  effect,
  input,
  output,
} from '@angular/core';

import * as L from 'leaflet';
import { ISightingMapMarker } from '../../../sightings-map/sightings-map.page';

/**
 * @sdd
 * @description Componente atómico para renderizar avistamientos en un mapa geoespacial.
 * @io Input: Array de avistamientos con lat/lng. Output: Renderización de marcadores Leaflet.
 */
@Component({
  selector: 'app-search-map',
  templateUrl: './search-map.component.html',
  styleUrls: ['./search-map.component.scss'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchMapComponent implements AfterViewInit, OnDestroy {
  /**
   * Referencia al elemento HTML contenedor del mapa
   */
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  /** Datos geoespaciales de avistamientos */
  sightings = input<ISightingMapMarker[]>([]);

  /** Evento emitido al hacer clic en un marcador */
  markerClick = output<ISightingMapMarker>();

  /**
   * Constructor: Crea un efecto que se dispara cuando cambian los avistamientos
   */
  constructor() {
    effect(() => {
      this.sightings(); // Registrar dependencia reactiva
      if (this.map) {
        this.updateMarkers();
      }
    });
  }
  /**
   * Instancia principal del mapa Leaflet
   */
  private map!: L.Map;
  /**
   * Grupo de marcadores del mapa
   */
  private markerClusterGroup: L.FeatureGroup = new L.FeatureGroup();

  /**
   * Hook AfterViewInit: Inicializa el mapa
   */
  ngAfterViewInit() {
    this.initMap();
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 250);
  }

  /**
   * Hook OnDestroy: Destruye el mapa para evitar fugas de memoria
   */
  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  /**
   * Inicializa la configuración de Leaflet
   */
  private initMap() {
    // Default config for Leaflet icons (to prevent broken missing images in production)
    const customMarkerUrl = 'assets/markers/marker_mapa_avistamiento.png';

    L.Marker.prototype.options.icon = L.icon({
      iconRetinaUrl: customMarkerUrl,
      iconUrl: customMarkerUrl,
      shadowUrl: '', // Eliminamos la sombra para este pin personalizado (o dejamos assets/marker-shadow.png)
      iconSize: [36, 40], // Tamaño ajustado para el pin custom, ajustable si es necesario
      iconAnchor: [20, 40], // Punto de anclaje ajustado a la base inferior del marcador
      popupAnchor: [0, -40], // Punto donde el popup emerge relativo al ancla
    });

    this.map = L.map(this.mapContainer.nativeElement).setView([4.5709, -74.2973], 6); // Colombia Center

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      crossOrigin: true,
    }).addTo(this.map);

    this.markerClusterGroup.addTo(this.map);
    this.updateMarkers();
  }

  /**
   * Actualiza los marcadores en el mapa en base a los avistamientos actuales
   */
  private updateMarkers() {
    if (!this.map) return;
    this.markerClusterGroup.clearLayers();

    const data = this.sightings() || [];
    data.forEach((sighting) => {
      // Expecting sighting to have location: { coordinates: [lng, lat] } from PostGIS GeoJSON
      if (sighting.location && sighting.location.coordinates) {
        const [lng, lat] = sighting.location.coordinates;
        const marker = L.marker([lat, lng]);

        marker.on('click', () => {
          this.markerClick.emit(sighting);
        });

        this.markerClusterGroup.addLayer(marker);
      }
    });

    const dataLength = this.sightings()?.length || 0;
    if (dataLength > 0 && this.markerClusterGroup.getLayers().length > 0) {
      this.map.fitBounds(this.markerClusterGroup.getBounds(), { padding: [50, 50] });
    }
  }
}
