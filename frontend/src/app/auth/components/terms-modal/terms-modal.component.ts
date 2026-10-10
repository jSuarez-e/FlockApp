import { Component, inject } from '@angular/core';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

/**
 * Componente de Modal para Términos y Condiciones.
 * * Presenta el marco legal y las políticas de privacidad de FlockApp.
 * Es invocado principalmente durante el proceso de registro para obtener
 * el consentimiento informado del usuario.
 */
@Component({
  selector: 'app-terms-modal',
  templateUrl: './terms-modal.component.html',
  styleUrls: ['./terms-modal.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonIcon],
})
export class TermsModalComponent {
  /**
   * Registra los iconos para el componente modal.
   */
  constructor() {
    addIcons({ closeOutline });
  }
  /**
   * Controlador de modales de Ionic.
   * Se utiliza para gestionar el ciclo de vida y el cierre del componente.
   */
  private readonly modalCtrl = inject(ModalController);

  /**
   * Cierra el modal actual.
   * * Este método destruye la instancia del componente en el DOM y
   * devuelve el control a la vista que lo invocó.
   * @returns Promise<boolean> Confirmación del éxito del cierre.
   */
  async dismiss(): Promise<boolean> {
    return await this.modalCtrl.dismiss();
  }
}
