/**
 * @file map-tracker.component.ts
 * @sdd Dumb component que renderiza el trazo Polyline y los pines de observación.
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
 *
 */
@Component({
  selector: 'app-map-tracker',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="map-placeholder">
      <div class="hud">
        <div class="metric">📍 {{ path().length || 0 }} Puntos</div>
        <div class="metric">🦅 {{ sightings().length || 0 }} Avistamientos</div>
      </div>
      <div class="map-canvas" #mapContainer></div>
    </div>
  `,
  styleUrls: ['./map-tracker.component.scss'],
})
export class MapTrackerComponent implements AfterViewInit, OnDestroy {
  /**
   *
   */
  path = input<[number, number][]>([]);
  /**
   *
   */
  sightings = input<IRouteSighting[]>([]);

  /**
   *
   */
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  /**
   *
   */
  private map!: L.Map;
  /**
   *
   */
  private polyline!: L.Polyline;
  /**
   *
   */
  private markerLayer = L.layerGroup();

  /**
   *
   */
  private userMarker!: L.Marker;
  /**
   *
   */
  private firstPanDone = false;

  /**
   * Actualiza el mapa cuando los inputs del componente cambian.
   */
  ngAfterViewInit() {
    this.initMap();
  }

  /**
   *
   */
  constructor() {
    effect(() => {
      const currentPath = this.path();
      const currentSightings = this.sightings();

      if (this.map) {
        if (currentPath && currentPath.length > 0) {
          // leaflet uses [lat, lng], path is [lng, lat]
          const latLngs = currentPath.map((p) => [p[1], p[0]] as [number, number]);
          const currentPos = latLngs[latLngs.length - 1];

          this.polyline.setLatLngs(latLngs);

          if (!this.firstPanDone) {
            this.map.setView(currentPos, 17);
            this.firstPanDone = true;
          } else {
            this.map.panTo(currentPos);
          }

          // Update User Marker
          if (!this.userMarker) {
            const userIcon = L.divIcon({
              className: 'user-pulse-icon',
              html: '<div class="pulse-dot"></div>',
              iconSize: [18, 18],
              iconAnchor: [9, 9],
            });
            this.userMarker = L.marker(currentPos, { icon: userIcon, zIndexOffset: 1000 }).addTo(
              this.map,
            );
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
            const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const sRecord = s as unknown as {
              /**
               *
               */
              birdInfo?: Record<string, string>
              /**
               *
               */;
              bird_id: string;
            };
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
   *
   */
  private initMap() {
    this.map = L.map(this.mapContainer.nativeElement).setView([4.5709, -74.2973], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap FlockApp',
      crossOrigin: true,
    }).addTo(this.map);

    this.polyline = L.polyline([], { color: 'blue', weight: 4 }).addTo(this.map);
    this.markerLayer.addTo(this.map);

    // Ionic layout delay fix: ensure leaflet recalculates dimensions
    setTimeout(() => {
      this.map.invalidateSize();
    }, 400);
  }

  /**
   *
   */
  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
