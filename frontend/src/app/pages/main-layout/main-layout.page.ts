import {
  Component,
  inject,
  computed,
  effect,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  MenuController,
  IonMenu,
  IonContent,
  IonIcon,
  IonList,
  IonMenuToggle,
  IonItem,
  IonLabel,
  IonListHeader,
  IonFooter,
  IonTabs,
  IonTabBar,
  IonTabButton,
} from '@ionic/angular';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthStore } from '../../core/stores/auth.store';
import { ProfileStore } from '../../core/stores/profile.store';
import { DashboardStore } from '../../core/stores/dashboard.store';
import { UserRole } from '../../core/models/auth.models';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

import { addIcons } from 'ionicons';
import {
  personOutline,
  journalOutline,
  mapOutline,
  peopleOutline,
  peopleCircleOutline,
  scanOutline,
  trophyOutline,
  businessOutline,
  checkboxOutline,
  swapHorizontalOutline,
  logOutOutline,
  homeOutline,
  cameraOutline,
  pawOutline,
  gridOutline,
  listOutline,
  searchOutline,
  binocularsOutline,
  navigateOutline,
  barChartOutline,
  leafOutline,
  settingsOutline,
} from 'ionicons/icons';
import { logger } from '../../core/utils/logger';

/**
 * @class MainLayoutPage
 * @description Componente de Orquestación Visual (Shell).
 * Gestiona el menú lateral, la navegación por pestañas (Tabs) y la sincronización de perfil.
 * @author Gemini (Orquestador SDD)
 */
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.page.html',
  styleUrls: ['./main-layout.page.scss'],
  standalone: true,
  imports: [
    RouterModule,
    IonMenu,
    IonContent,
    IonIcon,
    IonList,
    IonMenuToggle,
    IonItem,
    IonLabel,
    IonListHeader,
    IonFooter,
    IonTabs,
    IonTabBar,
    IonTabButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutPage implements OnInit {
  /**
   *
   */
  private readonly router = inject(Router);
  /**
   *
   */
  private readonly menuCtrl = inject(MenuController);

  /** Signal reactiva que rastrea la finalización de navegación. */
  private readonly navEnd = toSignal(
    (this.router?.events ?? of()).pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)),
  );
  /**
   *
   */
  private readonly authStore = inject(AuthStore);
  /**
   *
   */
  private readonly profileStore = inject(ProfileStore);
  /**
   *
   */
  private readonly authService = inject(AuthService);
  /**
   *
   */
  public readonly navState = inject(DashboardStore);

  /**
   *
   */
  private readonly BASE_URL: string = environment.urlBack;
  /**
   *
   */
  public readonly Roles = UserRole;

  /** Signal computada del usuario actual con reactividad garantizada (R5: Tipado Seguro) */
  public readonly user = computed(() => this.authStore.user() || this.authService.currentUser());

  /** Signal computada del modo de vista activo */
  public readonly currentMode = computed(() => this.navState.activeViewMode());

  /** Signal computada que verifica si hay un modo activo seleccionado */
  public readonly hasActiveMode = computed(() => this.currentMode() !== null);

  /**
   * Registra la librería de iconos necesaria para FlockApp.
   */
  constructor() {
    addIcons({
      personOutline,
      journalOutline,
      mapOutline,
      peopleOutline,
      peopleCircleOutline,
      scanOutline,
      trophyOutline,
      businessOutline,
      checkboxOutline,
      swapHorizontalOutline,
      logOutOutline,
      homeOutline,
      cameraOutline,
      pawOutline,
      gridOutline,
      listOutline,
      searchOutline,
      binocularsOutline,
      navigateOutline,
      barChartOutline,
      leafOutline,
      settingsOutline,
    });

    effect(() => {
      if (this.navEnd()) {
        this.menuCtrl.close();
      }
    });
  }

  /**
   * Inicializa suscripciones de navegación y sincronización proactiva (R2).
   */
  async ngOnInit(): Promise<void> {
    await this.syncUserProfile();
  }

  /**
   * Refresca los datos del usuario desde el servidor para evitar "datos stale" (R1).
   * @private
   */
  private async syncUserProfile(): Promise<void> {
    try {
      const profile = await this.profileStore.loadProfile();
      if (profile) {
        this.authStore.syncFromService();
      }
    } catch {
      logger.warn('[MainLayout] Error en sincronización proactiva de perfil.');
    }
  }


  /**
   * Resuelve la URL de la imagen del avatar con fallback dinámico.
   * @param path - Ruta relativa o absoluta del recurso.
   * @returns URL resuelta para el renderizado.
   */
  public getImageUrl(path: string | undefined | null): string {
    if (!path) {
      return this.getDefaultAvatarUrl();
    }
    return path.startsWith('http') ? path : `${this.BASE_URL}${path}`;
  }

  /**
   * Gestiona fallos de carga de imágenes sin usar 'any' (R5).
   * @param event - Evento nativo de error.
   */
  public handleImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = this.getDefaultAvatarUrl();
  }

  /**
   * Genera un avatar dinámico con iniciales y estilo institucional FlockApp.
   * @returns URL de imagen generativa de UI Avatars.
   * @private
   */
  private getDefaultAvatarUrl(): string {
    const user = this.user();
    const name = user?.firstName || user?.username || 'Pajarero';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=108346&color=fff&bold=true`;
  }

  /**
   * Cierra la sesión y limpia el estado global de navegación.
   */
  async logout(): Promise<void> {
    await this.menuCtrl.close();
    this.navState.setMode(null);
    await this.authStore.logout();
    this.router.navigate(['/auth/login'], { replaceUrl: true });
  }

  /**
   * Cambia el modo de visualización o redirige a la selección de modo.
   * Al alternar entre vistas, siempre limpia la ventana activa actual
   * y redirige a la vista de selección de modo (/home/dashboard con null).
   */
  async setMode(): Promise<void> {
    this.navState.setMode(null);
    await this.menuCtrl.close();
    await this.router.navigate(['/home/dashboard']);
  }

  /**
   * Redirige siempre a la vista de selección de modo (app-role-selector),
   * asegurando que no quede activa la última ventana o sección visitada.
   */
  async changeViewMode(): Promise<void> {
    await this.setMode();
  }
}
