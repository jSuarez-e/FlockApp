import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { IonSpinner } from '@ionic/angular';

/**
 * @sdd
 * @description Componente compartido para mostrar estados de carga en pantallas.
 * @io Recibe un mensaje opcional y determina el centrado vertical.
 */
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [IonSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loading-container" [class.full-height]="fullHeight">
      <ion-spinner [name]="spinnerName" color="primary"></ion-spinner>
      @if (message) {
      <p class="loading-message">{{ message }}</p>
      }
    </div>
  `,
  styles: [
    `
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;
      }
      .loading-container.full-height {
        min-height: 50vh;
        height: 100%;
      }
      .loading-message {
        margin-top: 1rem;
        font-size: 1rem;
        color: var(--ion-color-medium);
        font-weight: 500;
      }
    `,
  ],
})
export class LoadingComponent {
  /** @description Mensaje a mostrar debajo del spinner. */
  @Input() message: string = 'Cargando...';

  /** @description Si es true, el componente toma al menos 50vh para centrarse en pantalla. */
  @Input() fullHeight: boolean = true;

  /** @description Tipo de spinner de Ionic a utilizar (dots, lines, circular, etc). */
  @Input() spinnerName:
    | 'bubbles'
    | 'circles'
    | 'circular'
    | 'crescent'
    | 'dots'
    | 'lines'
    | 'lines-small'
    | 'lines-sharp'
    | 'lines-sharp-small' = 'crescent';
}
