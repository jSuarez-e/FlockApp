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
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (score() > 0) {
      <div class="strength-meter-wrapper">
        <div class="strength-bars">
          <div class="bar" [ngClass]="score() >= 1 ? cssClass() : ''"></div>
          <div class="bar" [ngClass]="score() >= 2 ? cssClass() : ''"></div>
          <div class="bar" [ngClass]="score() >= 3 ? cssClass() : ''"></div>
          <div class="bar" [ngClass]="score() >= 4 ? cssClass() : ''"></div>
        </div>
        <div class="strength-text" [ngClass]="cssClass()">
          Nivel de seguridad: <strong>{{ text() }}</strong>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .strength-meter-wrapper {
        margin-top: 8px;
        padding: 0 6px;
      }
      .strength-bars {
        display: flex;
        gap: 6px;
        height: 6px;
      }
      .bar {
        flex: 1;
        background: var(--avitour-border);
        border-radius: 4px;
        transition: background 0.3s ease-in-out;
      }

      .bar.weak {
        background: var(--ion-color-danger);
      }
      .bar.medium {
        background: var(--ion-color-warning);
      }
      .bar.good {
        background: var(--ion-color-success);
      }
      .bar.excellent {
        background: var(--avitour-primary);
      }

      .strength-text {
        font-size: 0.75rem;
        text-align: right;
        margin-top: 6px;
        transition: color 0.3s ease-in-out;
      }
      .strength-text.weak {
        color: var(--ion-color-danger);
      }
      .strength-text.medium {
        color: var(--ion-color-warning);
      }
      .strength-text.good {
        color: var(--ion-color-success);
      }
      .strength-text.excellent {
        color: var(--avitour-primary);
      }
    `,
  ],
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
