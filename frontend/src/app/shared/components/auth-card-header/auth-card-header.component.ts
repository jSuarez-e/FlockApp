// src/app/shared/components/auth-card-header/auth-card-header.component.ts
import { Component, input } from '@angular/core';

/**
 * @sdd
 * - [Objetivo]: Visual. Encabezado de tarjetas de autenticación.
 * - [I/O - Reusabilidad]: Signal Inputs `title` y `subtitle`.
 * - [Edge Cases - UI]: Muestra el subtítulo dinámicamente si existe.
 */
@Component({
  selector: 'app-auth-card-header',
  standalone: true,
  template: `
    <div class="auth-card-header u-text-center">
      <h2 class="auth-card-header__title">{{ title() }}</h2>
      @if (subtitle()) {
        <p class="auth-card-header__subtitle">{{ subtitle() }}</p>
      }
    </div>
  `,
})
export class AuthCardHeaderComponent {
  /** Título principal del encabezado */
  title = input.required<string>();
  /** Subtítulo opcional (se muestra si existe) */
  subtitle = input<string>();
}
