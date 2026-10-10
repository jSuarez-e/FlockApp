import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonIcon,
  IonSpinner,
} from '@ionic/angular';
import { AuthStore } from '../../core/stores/auth.store';
import { DashboardStore } from '../../core/stores/dashboard.store';
import { DbHelperService } from '../../core/services/db-helper.service';
import { RoleSelectorComponent } from './components/role-selector/role-selector.component';
import { FeedPajareroComponent } from './components/feed-pajarero/feed-pajarero.component';
import { ViewMode } from '../../core/models/auth.models';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { downloadOutline, binocularsOutline, businessOutline, logOutOutline } from 'ionicons/icons';
import { logger } from '../../core/utils/logger';

/**
 * @class DashboardPage
 * @description Orquestador polimórfico del Dashboard.
 * Se comunica con DashboardStore para alternar entre el feed social y el perfil comercial.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    RoleSelectorComponent,
    FeedPajareroComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonIcon,
    IonSpinner,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage implements OnInit {
  /** @description Acceso al estado de navegación global */
  public readonly navState = inject(DashboardStore);

  /** Acceso a la sesión del usuario */
  private readonly authStore = inject(AuthStore);

  /** Servicio de navegación de rutas */
  private readonly router = inject(Router);

  /** Acceso a la BD para depuración en DEV */
  private readonly dbHelper = inject(DbHelperService);

  /** Signal computado del usuario autenticado */
  public user = this.authStore.user;

  /**
   * Registra los iconos del dashboard.
   */
  constructor() {
    addIcons({ downloadOutline, binocularsOutline, businessOutline, logOutOutline });
  }

  /**
   * @method ngOnInit
   * @description Al entrar, si no hay un modo de vista activo, lo inicializa según el rol.
   */
  ngOnInit(): void {
    const currentUser = this.user();

    // Solo inicializamos si la vista está en null (estado inicial o reset)
    if (currentUser && this.navState.activeViewMode() === null) {
      this.navState.initializeFromRole(currentUser.role);
    }
  }

  /**
   * @method handleRoleSelection
   * @description Actualiza el estado global al elegir una vista en el selector.
   * @param {ViewMode} mode - Vista a cargar
   */
  handleRoleSelection(mode: ViewMode): void {
    this.navState.setMode(mode);
  }

  /**
   * @method downloadDatabase
   * @description Acción oculta/DEV para descargar el estado offline actual como JSON.
   */
  async downloadDatabase() {
    try {
      const sqlDump = await this.dbHelper.exportDatabaseToSQL(); // fix: exportDatabaseToSQLite → exportDatabaseToSQL
      const blob = new Blob([sqlDump], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flockapp_backup_${new Date().getTime()}.sqlite`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      logger.error('Error exportando BD binaria', e);
      alert('Error exportando la Base de Datos SQLite (Asegúrate de estar en Web)');
    }
  }

  /**
   * Cierra la sesión activa y redirige a la pantalla de login.
   */
  async logout(): Promise<void> {
    await this.authStore.logout();
    this.navState.setMode(null);
    await this.router.navigate(['/auth/login'], { replaceUrl: true });
  }
}
