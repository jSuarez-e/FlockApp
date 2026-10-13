/**
 * @sdd
 * [Objetivo]: Pestaña de listado y gestión de solicitudes de reserva para guías.
 * [I/O]: Inyecta BusinessProfileStore; permite confirmar, rechazar o finalizar reservas, y contactar vía WhatsApp.
 * [Edge Cases]: Manejo de lista vacía, spinner de carga, enlace seguro a WhatsApp y formato de calificación.
 */
import {
  Component,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonIcon,
  IonButton,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  documentTextOutline,
  calendarOutline,
  callOutline,
  logoWhatsapp,
  checkmarkCircleOutline,
  closeCircleOutline,
  checkmarkDoneOutline,
} from 'ionicons/icons';
import { BusinessProfileStore, BookingStatus } from '../../business-profile.store';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

/**
 * Componente presentador para la pestaña de solicitudes de reserva del guía.
 */
@Component({
  selector: 'app-business-bookings-tab',
  templateUrl: './business-bookings-tab.component.html',
  styleUrls: ['./business-bookings-tab.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    IonIcon,
    IonButton,
    IonBadge,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessBookingsTabComponent {
  /** Inyección del store de perfil de negocio */
  public readonly store = inject(BusinessProfileStore);

  /**
   * Registra los iconos usados en la vista de solicitudes.
   */
  constructor() {
    addIcons({
      documentTextOutline,
      calendarOutline,
      callOutline,
      logoWhatsapp,
      checkmarkCircleOutline,
      closeCircleOutline,
      checkmarkDoneOutline,
    });
  }

  /**
   * Actualiza el estado de una solicitud recibida (Aceptar, Rechazar, Completar).
   * @param bookingId ID de la reserva.
   * @param status Nuevo estado de la reserva.
   */
  public async onUpdateStatus(
    bookingId: string,
    status: BookingStatus,
  ): Promise<void> {
    await this.store.updateBookingStatus(bookingId, status);
  }

  /**
   * Abre chat de WhatsApp con el pajarero solicitante.
   * @param phone Número de teléfono.
   */
  public openWhatsAppChat(phone: string): void {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  }
}
