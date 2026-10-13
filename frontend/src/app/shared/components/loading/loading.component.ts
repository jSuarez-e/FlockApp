import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { IonSpinner } from '@ionic/angular';

/**
 * Tipo admitido para nombres de spinners de Ionic.
 */
export type SpinnerName =
  | 'bubbles'
  | 'circles'
  | 'circular'
  | 'crescent'
  | 'dots'
  | 'lines'
  | 'lines-small'
  | 'lines-sharp'
  | 'lines-sharp-small';

/**
 * @sdd
 * [Objetivo]: Componente compartido para mostrar estados de carga en pantallas.
 * [I/O - Reusabilidad]: Inputs message, fullHeight, spinnerName.
 * [Edge Cases - UI]: Ajuste automático a pantalla completa o contenedor relativo.
 */
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [IonSpinner],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  /** Mensaje a mostrar debajo del spinner */
  message = input<string>('Cargando...');

  /** Si es true, el componente toma al menos 50vh para centrarse en pantalla */
  fullHeight = input<boolean>(true);

  /** Tipo de spinner de Ionic a utilizar */
  spinnerName = input<SpinnerName>('crescent');
}
