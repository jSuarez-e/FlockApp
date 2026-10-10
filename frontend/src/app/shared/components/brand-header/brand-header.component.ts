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
  template: `
    <div class="brand-wrapper ion-text-center">
      <ion-icon name="leaf-outline" color="primary" class="brand-logo"></ion-icon>
      <h1 class="brand-text">FlockApp</h1>
    </div>
  `,
  styles: [
    `
      .brand-wrapper {
        margin-bottom: 35px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .brand-logo {
          font-size: 62px;
          --ion-color-primary: #108346;
        }

        .brand-text {
          margin: 8px 0 0 0;
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--avitour-primary);
          letter-spacing: -1.5px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandHeaderComponent {
  /**
   * @constructor
   * @description Inicializa el componente y registra los iconos institucionales.
   */
  constructor() {
    addIcons({ leafOutline });
  }
}
