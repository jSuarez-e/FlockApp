/**
 * @sdd
 * [Objetivo]: Encabezado de sección reutilizable con degradado continuo de FlockApp, soporte de búsqueda y acciones.
 * [I/O - Reusabilidad]: Inputs `title`, `subtitle`, `showBackButton`, `defaultBackHref`, `showSearch`, `searchTerm`, `searchPlaceholder`. Output `searchChange`. Slots [header-actions] y [header-filters].
 * [Edge Cases - UI]: Responsive en anchos estrechos, truncado elegante de títulos largos, accesibilidad en botones y búsqueda reactiva.
 */
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonMenuButton,
  IonSearchbar,
} from '@ionic/angular';

/**
 * Componente reutilizable para encabezados principales y secundarios en FlockApp.
 */
@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonMenuButton,
    IonSearchbar,
  ],
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeaderComponent {
  /** Título principal de la pantalla o sección */
  title = input.required<string>();

  /** Subtítulo descriptivo */
  subtitle = input<string>('');

  /** Habilita botón de regreso */
  showBackButton = input<boolean>(false);

  /** Habilita botón de menú lateral (activo por defecto en pantallas principales) */
  showMenuButton = input<boolean>(true);

  /** Ruta de retorno por defecto si no hay historial */
  defaultBackHref = input<string>('/home/dashboard');

  /** Activa barra de búsqueda integrada */
  showSearch = input<boolean>(false);

  /** Valor actual de la búsqueda */
  searchTerm = input<string>('');

  /** Placeholder del buscador */
  searchPlaceholder = input<string>('Buscar...');

  /** Tiempo de espera de debounce en ms */
  searchDebounce = input<number>(200);

  /** Evento emitido al escribir en el buscador */
  searchChange = output<string>();

  /**
   * Emite el término de búsqueda normalizado hacia componentes padre.
   *
   * @param event - Evento personalizado emitido por ion-searchbar.
   * @returns {void}
   */
  public onSearchInput(event: CustomEvent): void {
    const val = (event.detail as { value?: string | null })?.value ?? '';
    this.searchChange.emit(val);
  }
}
