/**
 * @sdd
 * - [Objetivo]: Componente presentacional (Dumb Component) para campos de contraseña con medidor de fuerza opcional.
 * - [I/O - Reusabilidad]: Exporta clase BEM .password-input. Usa model() para two-way binding.
 * - [Edge Cases - UI]: Manejo de visibilidad (texto/password), validación de estilos en touched/invalid.
 */
import { Component, signal, input, model } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular';
import { PasswordMeterComponent } from '../password-meter/password-meter.component';

/**
 * Componente desacoplado de campo de contraseña con diseño institucional y toggle de visualización.
 */
@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [FormsModule, PasswordMeterComponent, IonIcon],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.scss',
})
export class PasswordInputComponent {
  /** Etiqueta superior del campo */
  label = input<string>('Contraseña');
  /** Texto guía placeholder */
  placeholder = input<string>('••••••••');
  /** Indica si se visualiza el medidor de seguridad */
  showMeter = input<boolean>(false);
  /** Estado de error de validación */
  isInvalid = input<boolean>(false);

  /** Valor reactivo sincronizado con el modelo */
  value = model<string>('');

  /** Estado reactivo de visibilidad de caracteres */
  showPassword = signal(false);
  /** Marca si el campo ha sido desenfocado */
  isTouched = signal(false);

  /**
   * Alterna la visibilidad del texto de contraseña.
   */
  toggleVisibility() {
    this.showPassword.update((v) => !v);
  }
}
