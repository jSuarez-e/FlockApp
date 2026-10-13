/**
 * @sdd
 * [Objetivo]: Modal de presentación y detalle para avistamientos geolocalizados de aves.
 * [I/O]: Inputs: sighting (ISightingMapMarker | null), resolvedLocation, isResolvingLocation. Outputs: dismissModal, userProfileClick.
 * [Edge Cases]: Fallback de avatar si el usuario no tiene foto, cálculo seguro de fechas sin formato ISO.
 */
import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  IonModal,
  IonContent,
  IonBadge,
  IonIcon,
  IonSpinner,
  IonButton,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  locationOutline,
  calendarOutline,
  chevronForwardOutline,
  map,
} from 'ionicons/icons';
import { ISightingMapMarker, ISightingResolvedLocation } from '../../sightings-map.page';
import { environment } from '../../../../../../environments/environment';

/**
 * Componente modal para visualizar la información detallada de un avistamiento.
 */
@Component({
  selector: 'app-sighting-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    IonModal,
    IonContent,
    IonBadge,
    IonIcon,
    IonSpinner,
    IonButton,
  ],
  templateUrl: './sighting-detail-modal.component.html',
  styleUrl: './sighting-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SightingDetailModalComponent {
  /** Avistamiento seleccionado a mostrar en el modal */
  sighting = input<ISightingMapMarker | null>(null);

  /** Ubicación territorial resuelta mediante geocodificación */
  resolvedLocation = input<ISightingResolvedLocation | null>(null);

  /** Indica si la geocodificación inversa se encuentra en proceso */
  isResolvingLocation = input<boolean>(false);

  /** Emite al cerrar el modal */
  dismissModal = output<void>();

  /** Emite al solicitar ver el perfil público del observador */
  userProfileClick = output<string>();

  /**
   * Registra los iconos de Ionicons para la vista modal.
   */
  constructor() {
    addIcons({
      checkmarkCircleOutline,
      locationOutline,
      calendarOutline,
      chevronForwardOutline,
      map,
    });
  }

  /**
   * Resuelve la URL de la foto de perfil o genera un avatar elegante con iniciales.
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
    return `https://ui-avatars.com/api/?name=${safeName}&background=047857&color=fff&bold=true`;
  }

  /**
   * Maneja el error de carga de avatar aplicando fallback automático.
   * @param event Evento de error
   * @param userName Nombre del usuario para iniciales
   */
  onAvatarError(event: Event, userName?: string): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      const safeName = encodeURIComponent(userName?.trim() || 'Pajarero');
      target.src = `https://ui-avatars.com/api/?name=${safeName}&background=047857&color=fff&bold=true`;
    }
  }

  /**
   * Abre las coordenadas del avistamiento en Google Maps.
   * @param s El marcador de avistamiento
   */
  openGoogleMaps(s: ISightingMapMarker): void {
    const coords = s.location?.coordinates;
    if (coords && coords.length >= 2) {
      const [lng, lat] = coords;
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    }
  }

  /**
   * Formatea la fecha y hora a un formato legible.
   * @param dateString Fecha inicial
   * @param timeString Hora inicial
   * @returns Cadena formateada de fecha y hora
   */
  formatDate(dateString: string, timeString: string): string {
    if (!dateString) return '';
    try {
      const dateParts = dateString.split('-');
      if (dateParts.length !== 3) return `${dateString} - ${timeString}`;

      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const day = parseInt(dateParts[2], 10);

      const date = new Date(year, month, day);
      const dayFormatted = date.getDate();
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
      ];
      const monthName = monthNames[date.getMonth()];
      const yearFormatted = date.getFullYear();

      return `${dayFormatted} de ${monthName} de ${yearFormatted} - ${timeString || '00:00'}`;
    } catch {
      return `${dateString} - ${timeString}`;
    }
  }
}
