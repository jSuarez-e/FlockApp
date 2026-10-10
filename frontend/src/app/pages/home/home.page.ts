import { Component, inject, OnInit, computed, ChangeDetectionStrategy } from '@angular/core';

import { IonContent, IonButton, IonIcon } from '@ionic/angular';
import { AuthStore } from '../../core/stores/auth.store';
import { DashboardStore } from '../../core/stores/dashboard.store';
import { UserRole, ViewMode } from '../../core/models/auth.models';
import { addIcons } from 'ionicons';
import { pawOutline, businessOutline } from 'ionicons/icons';

/**
 * Página Principal (Dashboard).
 * * @description Actúa como selector de rol para usuarios 'BOTH' y
 * muestra el resumen de actividad según el modo activo.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  /**
   *
   */
  private readonly authStore = inject(AuthStore);
  /**
   *
   */
  public readonly navState = inject(DashboardStore);

  // En el constructor:
  /**
   * Inicializa la página principal con la configuración del layout.
   */
  constructor() {
    addIcons({
      'paw-outline': pawOutline,
      'business-outline': businessOutline,
    });
  }

  /** Exposición del usuario actual de forma reactiva */
  user = this.authStore.user;

  /** Alias para el modo de vista actual */
  currentView = computed(() => this.navState.activeViewMode());

  /**
   * Inicialización: Si el usuario tiene un rol único,
   * asignamos el modo automáticamente.
   */
  ngOnInit(): void {
    const role = this.user()?.role;
    if (role === UserRole.PAJARERO) this.navState.setMode('PAJARERO');
    if (role === UserRole.PROVEEDOR) this.navState.setMode('PROVEEDOR');
  }

  /**
   * Cambia el modo de visualización de la interfaz.
   * @param mode 'PAJARERO' | 'PROVEEDOR'
   */
  selectRole(mode: ViewMode): void {
    this.navState.setMode(mode);
  }
}
