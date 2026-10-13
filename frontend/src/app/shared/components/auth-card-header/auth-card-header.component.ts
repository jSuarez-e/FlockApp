import { Component, input, ChangeDetectionStrategy } from '@angular/core';

/**
 * @sdd
 * - [Objetivo]: Visual. Encabezado de tarjetas de autenticación.
 * - [I/O - Reusabilidad]: Signal Inputs `title` y `subtitle`.
 * - [Edge Cases - UI]: Muestra el subtítulo dinámicamente si existe.
 */
@Component({
  selector: 'app-auth-card-header',
  standalone: true,
  templateUrl: './auth-card-header.component.html',
  styleUrl: './auth-card-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthCardHeaderComponent {
  /** Título principal del encabezado */
  title = input.required<string>();
  /** Subtítulo opcional (se muestra si existe) */
  subtitle = input<string>();
}
