import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonButton,
  IonChip,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DbHelperService } from '../../../core/services/db-helper.service';
import { AuthService } from '../../../core/services/auth.service';
import { NetworkService } from '../../../core/services/network.service';
import { SyncQueueStore } from '../../../core/stores/sync-queue.store';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { addIcons } from 'ionicons';
import {
  add,
  timeOutline,
  calendarOutline,
  checkmarkDoneOutline,
  mapOutline,
  globeOutline,
  cloudOfflineOutline,
  pawOutline,
  eyeOutline,
  navigateOutline,
  chevronForwardOutline,
  createOutline,
  playOutline,
  locationOutline,
  sparklesOutline,
} from 'ionicons/icons';
import { logger } from '../../../core/utils/logger';

/**
 * @file routes-landing.page.ts
 * @sdd Vista previa de rutas. Permite iniciar una ruta nueva, ver borradores y rutas enviadas.
 * [I/O]: Si hay conexión a internet, obtiene las rutas de Postgres, sino desde SQLite.
 */
export interface RouteModel {
  /**
   * Identificador único de la ruta
   */
  id: string;
  /**
   * Nombre asignado a la ruta
   */
  name?: string;
  /**
   * Fecha y hora de inicio
   */
  start_time: string;
  /**
   * Fecha y hora de finalización
   */
  end_time?: string;
  /**
   * Tipo de ruta (desplazamiento / estacionaria)
   */
  route_type: string;
  /**
   * Estado de la ruta (DRAFT o COMPLETED)
   */
  status: string;
  /**
   * Kilómetros totales recorridos
   */
  total_km?: number;
  /**
   * Duración en minutos
   */
  duration_mins?: number;
  /**
   * Conteo de especies distintas registradas
   */
  species_count?: number;
  /**
   * Conteo total de aves avistadas
   */
  birds_count?: number;
}

/**
 * Componente principal para el listado y administración de rutas.
 */
@Component({
  selector: 'app-routes-landing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonFab,
    IonFabButton,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonButton,
    IonChip,
  ],
  templateUrl: './routes-landing.page.html',
  styleUrls: ['./routes-landing.page.scss'],
})
export class RoutesLandingPage {
  /**
   * Router inyectado para navegación
   */
  router = inject(Router);
  /**
   * Base de datos local SQLite
   */
  db = inject(DbHelperService);
  /**
   * Servicio de autenticación para usuario en sesión
   */
  authService = inject(AuthService);
  /**
   * Servicio de estado de red
   */
  network = inject(NetworkService);
  /**
   * Cliente HTTP para endpoints REST
   */
  http = inject(HttpClient);
  /**
   * Store de sincronización en background
   */
  syncQueue = inject(SyncQueueStore);
  /**
   * Detector de cambios para refresco reactivo
   */
  cdr = inject(ChangeDetectorRef);

  /**
   * Pestaña activa ('drafts' | 'sent')
   */
  currentTab = 'drafts';
  /**
   * Listado de rutas en borrador
   */
  draftRoutes: RouteModel[] = [];
  /**
   * Listado de rutas enviadas
   */
  sentRoutes: RouteModel[] = [];

  /**
   * Registra los iconos Ionicons necesarios para la vista.
   */
  constructor() {
    addIcons({
      add,
      timeOutline,
      calendarOutline,
      checkmarkDoneOutline,
      mapOutline,
      globeOutline,
      cloudOfflineOutline,
      pawOutline,
      eyeOutline,
      navigateOutline,
      chevronForwardOutline,
      createOutline,
      playOutline,
      locationOutline,
      sparklesOutline,
    });
  }

  /** Refresca las rutas cada vez que la vista se hace activa */
  async ionViewWillEnter() {
    await this.loadRoutes();
  }

  /**
   * Libera el foco del elemento activo para evitar violaciones de accesibilidad WAI-ARIA
   * cuando Ionic aplica aria-hidden="true" en la transición de salida de la página.
   */
  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  /** Carga todas las rutas desde Postgres si hay red, sino desde SQLite */
  async loadRoutes() {
    try {
      let allRoutes: RouteModel[] = [];

      if (this.network.isOnline()) {
        try {
          logger.debug('[RoutesLanding] Online mode: syncing first, then fetching from Postgres');
          await this.syncQueue.executeSyncCycle(true);
        } catch (syncErr) {
          logger.error('Error in sync cycle', syncErr);
        }

        const currentUserId = this.authService.currentUser()?.id;

        try {
          const remoteRoutes = await firstValueFrom(
            this.http.get<RouteModel[]>(`${environment.apiUrl}/routes`),
          );
          // 1. Fetch only local DRAFTS con conteo de especies y aves desde SQLite para el usuario activo
          const localDrafts = currentUserId
            ? (((await this.db.query(
                `SELECT r.*,
                        COALESCE(COUNT(DISTINCT rs.bird_id), 0) AS species_count,
                        COALESCE(SUM(rs.quantity), 0) AS birds_count
                 FROM routes r
                 LEFT JOIN route_sightings rs ON rs.route_id = r.id
                 WHERE (r.status = 'DRAFT' OR r.status IS NULL) AND r.user_id = ?
                 GROUP BY r.id
                 ORDER BY r.start_time DESC`,
                [currentUserId],
              )) || []) as unknown as RouteModel[])
            : [];

          allRoutes = [...(remoteRoutes || []), ...localDrafts];
          allRoutes.sort(
            (a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
          );
        } catch (apiErr) {
          logger.error('Error fetching routes from API, falling back to SQLite', apiErr);
          allRoutes = currentUserId
            ? (((await this.db.query(
                `SELECT r.*,
                        COALESCE(COUNT(DISTINCT rs.bird_id), 0) AS species_count,
                        COALESCE(SUM(rs.quantity), 0) AS birds_count
                 FROM routes r
                 LEFT JOIN route_sightings rs ON rs.route_id = r.id
                 WHERE (r.status != 'DELETED' OR r.status IS NULL) AND r.user_id = ?
                 GROUP BY r.id
                 ORDER BY r.start_time DESC`,
                [currentUserId],
              )) || []) as unknown as RouteModel[])
            : [];
        }
      } else {
        logger.debug('[RoutesLanding] Offline mode: fetching from SQLite');
        const currentUserId = this.authService.currentUser()?.id;
        allRoutes = currentUserId
          ? (((await this.db.query(
              `SELECT r.*,
                      COALESCE(COUNT(DISTINCT rs.bird_id), 0) AS species_count,
                      COALESCE(SUM(rs.quantity), 0) AS birds_count
               FROM routes r
               LEFT JOIN route_sightings rs ON rs.route_id = r.id
               WHERE (r.status != 'DELETED' OR r.status IS NULL) AND r.user_id = ?
               GROUP BY r.id
               ORDER BY r.start_time DESC`,
              [currentUserId],
            )) || []) as unknown as RouteModel[])
          : [];
      }

      this.draftRoutes = allRoutes.filter((r) => r.status === 'DRAFT' || !r.status);
      this.sentRoutes = allRoutes.filter((r) => r.status === 'COMPLETED');
      this.cdr.detectChanges();
    } catch (e: unknown) {
      logger.error('Error cargando rutas:', e);
    }
  }

  /**
   * Navega a la vista para crear una nueva ruta.
   */
  startNewRoute() {
    this.router.navigate(['/home/route-workspace']);
  }

  /**
   * Navega a la vista de espacio de trabajo para continuar una ruta existente.
   * @param routeId ID de la ruta en borrador.
   */
  resumeRoute(routeId: string) {
    this.router.navigate(['/home/route-workspace'], { queryParams: { id: routeId } });
  }

  /**
   * Navega a la vista de espacio de trabajo en modo solo lectura.
   * @param routeId ID de la ruta enviada.
   */
  viewRoute(routeId: string) {
    this.router.navigate(['/home/route-workspace'], {
      queryParams: { id: routeId, readonly: true },
    });
  }

  /**
   * Calcula la duración en horas y minutos dado un inicio y un fin.
   * @param start Fecha de inicio ISO.
   * @param end Fecha de fin ISO.
   * @returns String formateado de la duración.
   */
  getDuration(start: string, end: string): string {
    if (!start || !end) return '';
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    if (diffMs < 0 || isNaN(diffMs)) return '';
    const diffMins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  }
}
