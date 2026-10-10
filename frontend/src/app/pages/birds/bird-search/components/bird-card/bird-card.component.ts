import {
  Component,
  input,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonRippleEffect, IonIcon } from '@ionic/angular';
import { IBirdSearch } from './../../../../../core/models/birds.interfaces';
import { addIcons } from 'ionicons';
import { eye, caretUpCircle } from 'ionicons/icons';

/**
 * @sdd
 * - [Objetivo]: Tarjeta de alto impacto visual para el listado de aves.
 * - [I/O - Reusabilidad]: Input `bird` via Signal. Emite eventos nativos via Host.
 * - [Edge Cases - UI]: Inyección de imagen placeholder en caso de error, manejo de datos faltantes.
 */
@Component({
  selector: 'app-bird-card',
  standalone: true,
  imports: [CommonModule, IonRippleEffect, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bird-card.component.html',
  styleUrls: ['./bird-card.component.scss'],
})
export class BirdCardComponent {
  /** Inicializa iconos de Ionic requeridos. */
  constructor() {
    addIcons({ eye, caretUpCircle });
  }

  /** Datos del ave a renderizar */
  bird = input.required<IBirdSearch>();

  /** Estado de error de carga de imagen */
  imageError = signal(false);

  /** Determina si el ave cuenta con una URL de imagen válida (evita peticiones 404 innecesarias) */
  hasValidImage = computed(() => {
    const img = this.bird()?.base_image;
    return (
      !!img &&
      img.trim() !== '' &&
      img !== '-' &&
      img !== 'null' &&
      (img.startsWith('http://') ||
        img.startsWith('https://') ||
        img.startsWith('assets/') ||
        img.startsWith('/assets/'))
    );
  });

  /**
   * Manejador de fallos para conmutar al placeholder liviano local.
   */
  public handleImageError(): void {
    this.imageError.set(true);
  }

  /**
   * Manejador de error para el placeholder por si el navegador falla la lectura de caché (ERR_CACHE_READ_FAILURE)
   * @param {Event} event - Evento nativo de error de imagen
   */
  public handlePlaceholderError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="108" height="108" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 18"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></svg>';
    }
  }
}

