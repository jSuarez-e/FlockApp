import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';

/**
 * Componente de Modal para Términos y Condiciones.
 * Se presenta como un componente Standalone e independiente.
 */
@Component({
  selector: 'app-terms-modal',
  templateUrl: './terms-modal.component.html',
  styleUrls: ['./terms-modal.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class TermsModalComponent {
  /** Inyección del controlador de modales de Ionic */
  private modalCtrl = inject(ModalController);

  /**
   * Cierra el modal actual.
   * Se define como async siguiendo las recomendaciones de Ionic 8+.
   */
  async dismiss(): Promise<void> {
    await this.modalCtrl.dismiss();
  }
}
