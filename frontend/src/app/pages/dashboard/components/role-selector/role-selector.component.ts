import { Component, output, ChangeDetectionStrategy } from '@angular/core';
import { IonCard, IonIcon, IonCardTitle } from '@ionic/angular';
import { ViewMode } from '../../../../core/models/auth.models';
import { addIcons } from 'ionicons';
import {
  binoculars,
  business,
  sparklesOutline,
  compassOutline,
  cameraOutline,
  peopleOutline,
  calendarOutline,
  trendingUpOutline,
  arrowForwardOutline,
  chevronForwardOutline,
} from 'ionicons/icons';

/**
 * @sdd
 * - [Objetivo]: Componente "Dumb" que muestra las opciones de navegación para usuarios BOTH.
 * - [I/O - Reusabilidad]: Output `roleSelected` emitido al hacer clic en una tarjeta.
 * - [Edge Cases - UI]: Visualización de tarjetas de roles con iconos y descripciones.
 */
@Component({
  selector: 'app-role-selector',
  standalone: true,
  imports: [IonCard, IonIcon, IonCardTitle],
  templateUrl: './role-selector.component.html',
  styleUrls: ['./role-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleSelectorComponent {
  /** Evento emitido al seleccionar un modo de vista */
  roleSelected = output<ViewMode>();

  /**
   * Registra los iconos utilizados en las tarjetas del selector de rol.
   */
  constructor() {
    addIcons({
      binoculars,
      business,
      sparklesOutline,
      compassOutline,
      cameraOutline,
      peopleOutline,
      calendarOutline,
      trendingUpOutline,
      arrowForwardOutline,
      chevronForwardOutline,
    });
  }

  /**
   * Emite el evento de selección al padre.
   * @param view Vista elegida.
   */
  onSelect(view: ViewMode): void {
    this.roleSelected.emit(view);
  }
}

