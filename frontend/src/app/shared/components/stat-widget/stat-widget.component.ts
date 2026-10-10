// src/app/shared/components/stat-widget/stat-widget.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular';

/**
 * @sdd
 * - [Objetivo]: Visual. Widget para mostrar estadísticas rápidas (especies, avistamientos, etc.).
 * - [I/O - Reusabilidad]: Entradas mediante Signals. Clases BEM: `.stat-widget`.
 * - [Edge Cases - UI]: Responsivo a su contenedor con flex, maneja anchos mínimos.
 */
@Component({
  selector: 'app-stat-widget',
  standalone: true,
  imports: [CommonModule, IonIcon],
  template: `
    <div class="stat-widget">
      <div
        class="stat-widget__icon-circle"
        [ngClass]="colorClass() ? 'stat-widget__icon-circle--' + colorClass() : ''"
      >
        <ion-icon [name]="icon()"></ion-icon>
      </div>
      <div class="stat-widget__info">
        <span class="stat-widget__value">{{ value() }}</span>
        <span class="stat-widget__label">{{ label() }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        min-width: 0;
      }
      .stat-widget {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 6px;
        background: #ffffff;
        padding: 10px 4px;
        border-radius: 14px;
        border: 1px solid var(--flock-border-subtle, #e2e8f0);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
      }
      .stat-widget__icon-circle {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        color: #fff;
        flex-shrink: 0;
        background: var(--flock-primary, #047857);
      }
      .stat-widget__icon-circle--species {
        background: #059669;
      }
      .stat-widget__icon-circle--sightings {
        background: #0284c7;
      }
      .stat-widget__icon-circle--medals {
        background: #f59e0b;
      }

      .stat-widget__info {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        min-width: 0;
      }
      .stat-widget__value {
        font-weight: 800;
        font-size: 1.15rem;
        color: var(--flock-foreground, #0f172a);
        line-height: 1.1;
      }
      .stat-widget__label {
        font-size: 0.72rem;
        color: var(--flock-muted-foreground, #64748b);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.02em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        margin-top: 2px;
      }
    `,
  ],
})
export class StatWidgetComponent {
  /** Icono de Ionic a mostrar */
  icon = input.required<string>();
  /** Valor numérico o texto a destacar */
  value = input.required<number | string>();
  /** Etiqueta descriptiva del widget */
  label = input.required<string>();
  /** Clase CSS adicional para el color */
  colorClass = input<string>('');
}
