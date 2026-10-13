import { Component, ChangeDetectionStrategy } from '@angular/core';

import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { leafOutline } from 'ionicons/icons';

/**
 * @class BrandHeaderComponent
 * @description Componente de identidad corporativa de FlockApp.
 * Renderiza exclusivamente el isotipo y el nombre de la marca de forma centralizada.
 * Se utiliza externamente a las tarjetas de contenido para mantener la jerarquía visual.
 */
@Component({
  selector: 'app-brand-header',
  standalone: true,
  imports: [IonIcon],
  templateUrl: './brand-header.component.html',
  styleUrl: './brand-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandHeaderComponent {
  /**
   * Inicializa el componente y registra los iconos institucionales.
   */
  constructor() {
    addIcons({ leafOutline });
  }
}
