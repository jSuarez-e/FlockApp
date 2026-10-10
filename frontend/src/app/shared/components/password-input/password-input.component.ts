/**
 * @sdd
 * - [Objetivo]: Componente presentacional (Dumb Component) para campos de contraseña con medidor de fuerza opcional.
 * - [I/O - Reusabilidad]: Exporta clase BEM .password-input. Usa model() para two-way binding.
 * - [Edge Cases - UI]: Manejo de visibilidad (texto/password), validación de estilos en touched/invalid.
 */
import { Component, signal, input, model } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonIcon, IonButton } from '@ionic/angular';
import { PasswordMeterComponent } from '../password-meter/password-meter.component';

/**
 *
 */
@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [FormsModule, PasswordMeterComponent, IonIcon, IonButton],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.scss',
})
export class PasswordInputComponent {
  /**
   *
   */
  label = input<string>('Contraseña');
  /**
   *
   */
  placeholder = input<string>('••••••••');
  /**
   *
   */
  showMeter = input<boolean>(false);
  /**
   *
   */
  isInvalid = input<boolean>(false);

  /**
   *
   */
  value = model<string>('');

  /**
   *
   */
  showPassword = signal(false);
  /**
   *
   */
  isTouched = signal(false);

  /**
   * Alterna la visibilidad del texto de contraseña.
   */
  toggleVisibility() {
    this.showPassword.update((v) => !v);
  }
}
