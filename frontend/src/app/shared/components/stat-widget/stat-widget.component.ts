import { Component, input, ChangeDetectionStrategy } from '@angular/core';
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
  templateUrl: './stat-widget.component.html',
  styleUrl: './stat-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
