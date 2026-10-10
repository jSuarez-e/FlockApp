/**
 * @sdd
 * - [Objetivo]: Componente presentacional (Dumb Component) para inputs de autenticación y formularios genéricos.
 * - [I/O - Reusabilidad]: Entradas basadas en Signals. Controla two-way binding vía model().
 * - [Edge Cases - UI]: Maneja estados 'touched', 'invalid' y 'readonly' dinámicamente. Cumple BEM estricto (.auth-input).
 */
import { Component, model, input, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular';

/**
 *
 */
@Component({
  selector: 'app-auth-input',
  standalone: true,
  imports: [FormsModule, IonIcon],
  templateUrl: './auth-input.component.html',
  styleUrl: './auth-input.component.scss',
})
export class AuthInputComponent {
  /**
   *
   */
  label = input<string | undefined>();
  /**
   *
   */
  icon = input<string | undefined>();
  /**
   *
   */
  placeholder = input<string>('');
  /**
   *
   */
  type = input<string>('text');
  /**
   *
   */
  readonly = input<boolean>(false);

  /**
   *
   */
  isInvalid = input<boolean>(false);

  // Two-way binding puro de Signals Angular > 17.2
  /**
   *
   */
  value = model<string>('');
  /**
   *
   */
  isTouched = signal(false);
}
