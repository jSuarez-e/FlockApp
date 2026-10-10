import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

import { SplashScreen } from '@capacitor/splash-screen';
import { DbHelperService } from './core/services/db-helper.service';
import { AuthService } from './core/services/auth.service';
import { AuthStore } from './core/stores/auth.store';
import { User } from './core/models/auth.models';
import { SyncQueueStore } from './core/stores/sync-queue.store';
import { addIcons } from 'ionicons';
import {
  optionsOutline,
  globeOutline,
  cloudOfflineOutline,
  alertCircleOutline,
  layersOutline,
  eye,
  searchOutline,
  listOutline,
  leafOutline,
  mapOutline,
  homeOutline,
  resizeOutline,
  chevronForwardOutline,
  closeOutline,
  locateOutline,
  locationOutline,
  checkmarkOutline,
  gitBranchOutline,
  caretForwardCircleOutline,
} from 'ionicons/icons';
import { logger } from './core/utils/logger';

/**
 * Componente raíz de la aplicación.
 */
@Component({
  selector: 'app-root',
  template: '<ion-app><ion-router-outlet></ion-router-outlet></ion-app>',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  /** Servicio para el manejo de base de datos */
  private readonly db = inject(DbHelperService);
  /** Servicio para el manejo de autenticación */
  private readonly authService = inject(AuthService);
  /** Almacén reactivo de autenticación */
  private readonly authStore = inject(AuthStore);
  /** Servicio de enrutamiento */
  private readonly router = inject(Router);
  /** Motor Híbrido de Sincronización Push/Pull */
  private readonly syncStore = inject(SyncQueueStore);

  /**
   * Constructor del componente, registra iconos.
   */
  constructor() {
    addIcons({
      'options-outline': optionsOutline,
      'globe-outline': globeOutline,
      'cloud-offline-outline': cloudOfflineOutline,
      'alert-circle-outline': alertCircleOutline,
      'layers-outline': layersOutline,
      eye: eye,
      'search-outline': searchOutline,
      'list-outline': listOutline,
      'leaf-outline': leafOutline,
      'map-outline': mapOutline,
      'home-outline': homeOutline,
      'resize-outline': resizeOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'close-outline': closeOutline,
      'locate-outline': locateOutline,
      'location-outline': locationOutline,
      'checkmark-outline': checkmarkOutline,
      'git-branch-outline': gitBranchOutline,
      'caret-forward-circle-outline': caretForwardCircleOutline,
    });
  }

  /**
   * Inicializa el componente.
   * Verifica la sesión activa local en SQLite al arrancar la app.
   */
  async ngOnInit(): Promise<void> {
    // La DB ya se inicializó en el bootstrap de main.ts
    await this.checkSessionAndNavigate();
  }

  /**
   * Revisa en la base de datos local si existe una sesión válida
   * y redirige al usuario a la pantalla correspondiente.
   */
  private async checkSessionAndNavigate(): Promise<void> {
    try {
      const session = await this.db.getSession();

      if (session && session.token) {
        const parsedUser: User =
          typeof session.user_data === 'string' ? JSON.parse(session.user_data) : session.user_data;

        this.authService.currentUser.set(parsedUser);

        // Sincronizar el AuthStore también para que los componentes que lo inyectan no se queden en loading
        this.authStore.syncFromService();

        // Fase 3/4: Disparar ciclo de sincronización en background sin bloquear UI
        this.syncStore
          .executeSyncCycle()
          .catch((e) => logger.warn('Offline / Sync error on boot', e));

        await this.router.navigate(['/home'], { replaceUrl: true });
      } else {
        await this.router.navigate(['/auth/login'], { replaceUrl: true });
      }
    } catch {
      await this.router.navigate(['/auth/login'], { replaceUrl: true });
    } finally {
      await SplashScreen.hide();
    }
  }
}
