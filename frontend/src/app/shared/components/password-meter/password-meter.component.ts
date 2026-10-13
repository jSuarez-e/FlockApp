import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';

/**
 * @class PasswordMeterComponent
 * @description Componente visual reutilizable que evalúa y muestra la fuerza de una contraseña en tiempo real.
 * Utiliza Signals de Angular (input y computed) para un rendimiento óptimo OnPush.
 */
@Component({
  selector: 'app-password-meter',
  standalone: true,
  imports: [NgClass],
  templateUrl: './password-meter.component.html',
  styleUrl: './password-meter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordMeterComponent {
  /** * @description Contraseña a evaluar, recibida dinámicamente desde el componente padre.
   */
  password = input<string>('');

  /** * @description Calcula matemáticamente el puntaje de la contraseña reaccionando a los cambios del input().
   * @returns {number} Puntaje del 0 al 4.
   */
  score = computed<number>(() => {
    const pwd = this.password();
    if (!pwd) return 0;

    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;

    return s;
  });

  /** * @description Retorna el texto descriptivo basado automáticamente en el puntaje calculado.
   * @returns {string} Texto de fuerza (Débil, Regular, Fuerte, Excelente).
   */
  text = computed<string>(() => {
    const s = this.score();
    if (s === 1) return 'Débil';
    if (s === 2) return 'Regular';
    if (s === 3) return 'Fuerte';
    if (s === 4) return 'Excelente';
    return '';
  });

  /** * @description Retorna la clase CSS correspondiente para pintar las barras y el texto.
   * @returns {string} Clase CSS (weak, medium, good, excellent).
   */
  cssClass = computed<string>(() => {
    const s = this.score();
    if (s === 1) return 'weak';
    if (s === 2) return 'medium';
    if (s === 3) return 'good';
    if (s === 4) return 'excellent';
    return '';
  });
}
