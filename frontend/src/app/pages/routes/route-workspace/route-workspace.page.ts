/**
 * @file route-workspace.page.ts
 * @sdd Smart Component contenedor. Configura el layout dividido y orquesta la conexión con ActiveRouteStore.
 */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IBirdSearch } from '../../../core/models/birds.interfaces';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonBackButton,
  IonContent,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonList,
  IonIcon,
  IonCheckbox,
  IonAvatar,
  IonChip,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular';
import { MapTrackerComponent } from './components/map-tracker/map-tracker.component';
import { SightingLoggerComponent } from './components/sighting-logger/sighting-logger.component';
import { ActiveRouteStore } from '../../../core/stores/active-route.store';
import { SyncQueueStore } from '../../../core/stores/sync-queue.store';
import { FeedStore } from '../../../core/stores/feed.store';
import { DbHelperService } from '../../../core/services/db-helper.service';
import { UiService } from '../../../core/services/ui.service';
import {
  GeographyService,
  ResolvedLocation,
} from '../../../core/services/geography.service';
import { GeoSelectorComponent } from '../../../shared/components/geo-selector/geo-selector.component';
import { addIcons } from 'ionicons';
import {
  addCircle,
  navigate,
  saveOutline,
  closeCircle,
  timeOutline,
  footstepsOutline,
  locationOutline,
  leafOutline,
  documentTextOutline,
  sendOutline,
  arrowBackOutline,
  trashOutline,
  flagOutline,
  trailSignOutline,
  mapOutline,
  chevronDownOutline,
  searchOutline,
} from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import { Network } from '@capacitor/network';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewChild } from '@angular/core';
import { NetworkService } from '../../../core/services/network.service';
import { AppPermissionsService } from '../../../core/services/app-permissions.service';
import { environment } from '../../../../environments/environment';
import { logger } from '../../../core/utils/logger';

/**
 * Payload de cambio de ubicación territorial de la ruta.
 */
export interface RouteLocationChangePayload {
  /** Identificador numérico del departamento. */
  departmentId: number | null;
  /** Nombre del departamento. */
  departmentName: string;
  /** Identificador numérico del municipio. */
  municipalityId: number | null;
  /** Nombre del municipio. */
  municipalityName: string;
}

/**
 *
 */
@Component({
  selector: 'app-route-workspace',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonBackButton,
    IonContent,
    MapTrackerComponent,
    SightingLoggerComponent,
    IonModal,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonList,
    IonIcon,
    FormsModule,
    IonCheckbox,
    IonAvatar,
    IonChip,
    GeoSelectorComponent,
  ],
  templateUrl: './route-workspace.page.html',
  styleUrls: ['./route-workspace.page.scss'],
})
export class RouteWorkspacePage implements ViewWillEnter, ViewWillLeave {
  /**
   *
   */
  @ViewChild('routeModal') routeModal!: IonModal;

  /**
   *
   */
  store = inject(ActiveRouteStore);
  /**
   *
   */
  router = inject(Router);
  /**
   *
   */
  route = inject(ActivatedRoute);
  /**
   *
   */
  db = inject(DbHelperService);
  /**
   *
   */
  ui = inject(UiService);
  /**
   * Servicio de geografía para resolución territorial y catálogos.
   */
  geoService = inject(GeographyService);
  /**
   * Cliente HTTP para consultas REST a PostgreSQL en línea.
   */
  http = inject(HttpClient);
  /**
   * Monitoreo del estado de conectividad para conmutación offline/online.
   */
  network = inject(NetworkService);
  /**
   * Servicio de permisos con revelación previa de GPS.
   */
  permissionsService = inject(AppPermissionsService);
  /**
   *
   */
  feedStore = inject(FeedStore);
  /**
   * Cola de sincronización para operaciones duales SQLite / PostgreSQL.
   */
  syncQueue = inject(SyncQueueStore);
  /**
   *
   */
  departments = this.store.departments;
  /**
   *
   */
  municipalities = this.store.municipalities;

  /**
   *
   */
  isReadonly = false;
  /**
   *
   */
  isModalOpen = false;
  /**
   * Bandera para evitar que eventos programáticos ionChange reseteen el municipio durante la resolución automática.
   */
  private isResolvingLocation = false;
  /**
   *
   */
  routeName = '';
  /**
   *
   */
  routeType = 'Desplazamiento';
  /**
   *
   */
  notes = '';
  /**
   *
   */
  watchId: string | null = null;
  /**
   *
   */
  selectedDepartmentId: number | null = null;
  /**
   *
   */
  selectedMunicipalityId: number | null = null;


  /**
   * Sincroniza la ubicación territorial seleccionada desde GeoSelectorComponent.
   * @param loc Ubicación resuelta con departamento y municipio.
   */
  onRouteLocationChange(loc: RouteLocationChangePayload): void {
    this.selectedDepartmentId = loc.departmentId;
    this.selectedMunicipalityId = loc.municipalityId;
  }


  // New UI states
  /**
   *
   */
  shareToSocial = false;
  /**
   *
   */
  searchResults = signal<IBirdSearch[]>([]);
  /**
   *
   */
  userSearchResults: Record<string, string>[] = [];
  /**
   *
   */
  selectedUsers: Record<string, string>[] = [];
  /**
   *
   */
  mockUsersDatabase: Record<string, string>[] = [
    { id: '1', name: 'Juan Pérez', email: 'juan@example.com', avatar: '' },
    { id: '2', name: 'María Gómez', email: 'maria@example.com', avatar: '' },
    { id: '3', name: 'Carlos Díaz', email: 'carlos@example.com', avatar: '' },
    { id: '4', name: 'Ana Torres', email: 'ana@example.com', avatar: '' },
  ];

  /**
   * Registra los iconos Ionicons necesarios para las acciones de la vista.
   */
  constructor() {
    addIcons({
      addCircle,
      navigate,
      saveOutline,
      closeCircle,
      timeOutline,
      footstepsOutline,
      locationOutline,
      leafOutline,
      documentTextOutline,
      sendOutline,
      'arrow-back-outline': arrowBackOutline,
      'trash-outline': trashOutline,
      'flag-outline': flagOutline,
      'trail-sign-outline': trailSignOutline,
      'map-outline': mapOutline,
      'chevron-down-outline': chevronDownOutline,
      'search-outline': searchOutline,
    });
  }

  /**
   * Carga la ruta activa o inicia una nueva sesión de tracking al entrar a la vista.
   */
  async ionViewWillEnter(): Promise<void> {
    const params = this.route.snapshot.queryParams;
    const routeId = params['id'];
    const readonlyParam = params['readonly'];
    this.isReadonly = readonlyParam === 'true' || readonlyParam === true;

    await this.loadOrInitializeRoute(routeId);

    if (!this.isReadonly) {
      try {
        await this.store.loadDepartments();
      } catch (err) {
        logger.error('Error cargando departamentos', err);
      }
      await this.initGpsTracking();
    }
  }

  /**
   * Carga una ruta existente o prepara los estados para una nueva ruta en curso.
   * @param routeId Identificador único opcional de la ruta
   */
  private async loadOrInitializeRoute(routeId?: string): Promise<void> {
    if (routeId) {
      const route = await this.store.loadRoute(routeId, !this.isReadonly);
      if (route) {
        this.routeName = route.name || '';
        this.routeType = route.route_type || 'Desplazamiento';
        this.notes = route.comments || '';
        this.selectedDepartmentId = route.department_id || null;
        this.selectedMunicipalityId = route.municipality_id || null;

        if (this.selectedDepartmentId) {
          await this.store.loadMunicipalities(this.selectedDepartmentId);
        }
      }
    } else {
      const newRouteId = crypto.randomUUID();
      this.routeName = '';
      this.routeType = 'Desplazamiento';
      this.notes = '';
      this.selectedDepartmentId = null;
      this.selectedMunicipalityId = null;
      this.shareToSocial = false;
      this.selectedUsers = [];

      await this.store.startTracking(newRouteId);
    }
  }

  /**
   * Inicializa el observador de GPS tras validar el consentimiento del usuario conforme a Google Play.
   */
  private async initGpsTracking(): Promise<void> {
    try {
      const hasLocation = await this.permissionsService.requestLocationWithRationale();
      if (!hasLocation) {
        return;
      }

      if (this.watchId) {
        await Geolocation.clearWatch({ id: this.watchId });
      }

      this.watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (position, err) => {
          if (err) {
            logger.error('Error GPS:', err);
            return;
          }
          if (position && this.store.isTracking()) {
            this.store.addPosition([position.coords.longitude, position.coords.latitude]);
          }
        },
      );
    } catch (e) {
      logger.error('GPS no disponible:', e);
    }
  }

  /**
   * Vuelve a la pantalla de listado de rutas.
   */
  goBack() {
    this.router.navigate(['/home/routes-landing']);
  }

  /**
   * Calcula los minutos transcurridos desde el inicio de la ruta.
   * @returns Número de minutos transcurridos.
   */
  getDurationMinutes(): number {
    const start = this.store.startTime();
    const end = this.store.endTime();
    if (!start) return 0;

    if (end) {
      const diffMs = new Date(end).getTime() - new Date(start).getTime();
      return Math.floor(diffMs / 60000);
    }

    const diffMs = Date.now() - new Date(start).getTime();
    return Math.floor(diffMs / 60000);
  }

  /**
   * Retorna los avistamientos registrados ordenados por timestamp descendente.
   * @returns Array de avistamientos ordenado por fecha de registro.
   */
  getSortedSightings() {
    const sightings = [...this.store.sightingsLog()];
    return sightings.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  /**
   * Ejecuta búsqueda mock de usuarios
   * @param event Evento DOM InputEvent
   */
  searchUsers(event: Event) {
    const customEvent = event as CustomEvent;
    const query = customEvent.detail?.value?.toLowerCase() || '';
    if (query.length < 2) {
      this.userSearchResults = [];
      return;
    }
    this.userSearchResults = this.mockUsersDatabase
      .filter(
        (u) => u['name'].toLowerCase().includes(query) || u['email'].toLowerCase().includes(query),
      )
      .filter((u) => !this.selectedUsers.find((su) => su['id'] === u['id']));
  }

  /**
   * Añade usuario a lista para compartir
   * @param user Usuario a compartir
   */
  addUserToShare(user: Record<string, string>) {
    if (!this.selectedUsers.find((u) => u['id'] === user['id'])) {
      this.selectedUsers.push(user);
    }
    this.userSearchResults = [];
  }

  /**
   * Quita usuario de la lista a compartir
   * @param user Usuario
   */
  removeUserFromShare(user: Record<string, string>) {
    this.selectedUsers = this.selectedUsers.filter((u) => u['id'] !== user['id']);
  }

  /**
   * Cierra el modal de resumen de ruta.
   */
  closeModal() {
    this.isModalOpen = false;
    if (this.routeModal) {
      this.routeModal.dismiss();
    }
  }

  /**
   * Obtiene la última coordenada de la ruta o la posición actual del dispositivo.
   * @returns Tupla [longitud, latitud] o null si no está disponible.
   */
  private async getLatestRouteCoordinates(): Promise<[number, number] | null> {
    const path = this.store.currentPath();
    if (path.length > 0) {
      return path[path.length - 1];
    }
    try {
      const pos = await Geolocation.getCurrentPosition({ timeout: 4000 });
      return pos?.coords ? [pos.coords.longitude, pos.coords.latitude] : null;
    } catch {
      return null;
    }
  }

  /**
   * Aplica la ubicación resuelta en los selectores de departamento y municipio del store.
   * @param resolved Ubicación territorial resuelta con IDs locales.
   */
  private async applyResolvedLocation(
    resolved: ResolvedLocation,
  ): Promise<void> {
    if (!resolved.departmentId) {
      return;
    }

    this.isResolvingLocation = true;
    try {
      this.selectedDepartmentId = resolved.departmentId;
      await this.store.loadMunicipalities(resolved.departmentId);

      if (resolved.municipalityId) {
        this.selectedMunicipalityId = resolved.municipalityId;
      }
    } finally {
      setTimeout(() => {
        this.isResolvingLocation = false;
      }, 200);
    }
  }

  /**
   * Abre el modal de finalización y autocompleta departamento y municipio si hay coordenadas disponibles y conexión activa.
   */
  async openFinishModal(): Promise<void> {
    this.isModalOpen = true;

    if (this.selectedDepartmentId && this.selectedMunicipalityId) {
      return;
    }

    const coords = await this.getLatestRouteCoordinates();
    if (!coords) {
      return;
    }

    const [lng, lat] = coords;
    const resolved = await this.geoService.reverseGeocode(lat, lng);
    await this.applyResolvedLocation(resolved);
  }

  /**
   * Maneja el cambio de departamento y carga los municipios correspondientes.
   * @param event Evento del selector de departamento con el valor seleccionado.
   */
  async onDepartmentChange(event: CustomEvent) {
    if (this.isResolvingLocation) {
      return;
    }
    const newDeptId = event.detail.value;
    if (newDeptId !== this.selectedDepartmentId) {
      this.selectedDepartmentId = newDeptId;
      this.selectedMunicipalityId = null;
      if (this.selectedDepartmentId) {
        await this.store.loadMunicipalities(this.selectedDepartmentId);
      }
    }
  }

  /**
   * Finaliza la ruta
   * @param status Estado de finalización
   */
  async stopRoute(status: 'DRAFT' | 'COMPLETED') {
    try {
      // CAPTURE STATS BEFORE stopTracking CLEARS THE STORE
      const finalSightingsCount = this.store.sightingsLog().length;
      const finalDistance = this.store.totalDistance();
      const finalDuration = this.getDurationMinutes();
      const routeIdToShare = this.store.currentRouteId();
      const path = this.store.currentPath();
      const lastCoord = path.length > 0 ? path[path.length - 1] : undefined;

      await this.store.stopTracking({
        routeName: this.routeName || 'Ruta sin nombre',
        routeType: this.routeType,
        notes: this.notes,
        status: status,
        departmentId: this.selectedDepartmentId,
        municipalityId: this.selectedMunicipalityId,
      });

      // Publicar en el Feed si el usuario marcó la opción
      if (this.shareToSocial && status === 'COMPLETED') {
        const postContent = `¡He finalizado la ruta "${this.routeName || 'Sin nombre'}"!\n\nAvistamientos: ${finalSightingsCount}\nDistancia: ${finalDistance.toFixed(2)} km\nDuración: ${finalDuration} min\n\n${this.notes}`;

        this.feedStore.publishPost({
          content: postContent,
          location: lastCoord ? { lat: lastCoord[1], lng: lastCoord[0] } : undefined,
          needsIdentification: false,
          routeId: routeIdToShare || undefined,
        });
        
        await this.ui.showToast('¡Ruta publicada en la comunidad!', 'success');
      }

      this.closeModal();

      // Cleanup GPS watch
      if (this.watchId) {
        await Geolocation.clearWatch({ id: this.watchId });
      }

      // Si hay conexión a internet, sincronizar inmediatamente hacia PostgreSQL
      if (status === 'COMPLETED' && this.network.isOnline()) {
        try {
          await this.syncQueue.executeSyncCycle(true);
        } catch (syncErr) {
          logger.warn('Aviso sincronizando ruta recién finalizada:', syncErr);
        }
      }

      // Regresar a la ventana previa (Rutas Landing) o dashboard
      this.router.navigate(['/home/routes-landing']);
    } catch (e: unknown) {
      logger.error('Error finalizando ruta:', e);
      const errorMsg = e instanceof Error ? e.message : JSON.stringify(e);
      alert('Error guardando ruta: ' + errorMsg);
    }
  }

  /**
   * Elimina la ruta en borrador de la base de datos
   */
  async deleteRoute() {
    const isConfirmed = await this.ui.showConfirm(
      'Descartar Ruta',
      '¿Estás seguro de eliminar esta ruta temporal? Se perderán todos los avistamientos.',
    );

    if (isConfirmed) {
      const routeId = this.store.currentRouteId();
      if (routeId) {
        await this.ui.showLoading('Descartando ruta...');
        try {
          // Soft delete y purga local segura con soporte para columna sql_deleted
          await this.db.run(`UPDATE routes SET status = 'DELETED', sql_deleted = 1 WHERE id = ?`, [routeId]);
          try {
            await this.db.run(`UPDATE route_sightings SET sql_deleted = 1 WHERE route_id = ?`, [routeId]);
            await this.db.run(`DELETE FROM route_sightings WHERE route_id = ?`, [routeId]);
          } catch (sightingErr) {
            logger.warn('Aviso limpiando route_sightings en SQLite:', sightingErr);
          }
          await this.db.saveToStore();
          this.store.cancelTracking();
          await this.ui.dismissLoading();
          await this.ui.showToast('Ruta descartada', 'success');
        } catch (e: unknown) {
          logger.error('Error al eliminar la ruta:', e);
          const msg = e instanceof Error ? e.message : JSON.stringify(e);
          await this.ui.dismissLoading();
          await this.ui.showToast('Error: ' + msg.substring(0, 60), 'danger');
          return;
        }
      }

      if (this.watchId) {
        await Geolocation.clearWatch({ id: this.watchId });
      }

      this.router.navigate(['/home/routes-landing'], { replaceUrl: true });
    }
  }

  /**
   * Busca aves consultando la base de datos de PostgreSQL si está online,
   * o consultando la base de datos SQLite local de la tabla birds campo base_image si está offline.
   * @param query Término de búsqueda (nombre común o científico).
   */
  async onSearchBirds(query: string) {
    const trimmed = (query || '').trim();
    if (!trimmed || trimmed.length < 2) {
      this.searchResults.set([]);
      return;
    }

    let isOnline = false;
    try {
      const netStatus = await Network.getStatus();
      isOnline = Boolean(netStatus.connected && this.network.isOnline());
    } catch {
      isOnline = this.network.isOnline();
    }

    if (isOnline) {
      try {
        const url = `${environment.apiUrl}/birds/search?q=${encodeURIComponent(trimmed)}`;
        const onlineBirds = await firstValueFrom(this.http.get<IBirdSearch[]>(url));
        if (onlineBirds && Array.isArray(onlineBirds)) {
          this.searchResults.set(onlineBirds);
          return;
        }
      } catch (err) {
        logger.warn(
          '[RouteWorkspacePage] Falló consulta online en Postgres, recurriendo a SQLite local:',
          err,
        );
      }
    }

    // Modo Offline o fallback si la consulta HTTP falló:
    try {
      const res = await this.db.query(
        `SELECT id, common_name, scientific_name, english_name, base_image, viewing_difficulty, min_altitude, max_altitude 
         FROM birds 
         WHERE common_name LIKE ? OR scientific_name LIKE ? OR english_name LIKE ? 
         LIMIT 15`,
        [`%${trimmed}%`, `%${trimmed}%`, `%${trimmed}%`],
      );
      this.searchResults.set((res || []) as unknown as IBirdSearch[]);
    } catch (dbErr) {
      logger.error('[RouteWorkspacePage] Error en consulta SQLite de aves:', dbErr);
      this.searchResults.set([]);
    }
  }

  /**
   * Añade el avistamiento a SQLite y Store
   * @param event Payload del evento
   * @param event.birdId ID del ave avistada
   * @param event.quantity Cantidad de aves
   * @param event.details Detalles del avistamiento
   * @param event.birdInfo Información adicional opcional del ave
   */
  onSightingAdded(event: {
    /**
     *
     */
    birdId: string;
    /**
     *
     */
    quantity: number;
    /**
     *
     */
    details: string;
    /**
     *
     */
    birdInfo?: Partial<IBirdSearch>;
  }) {
    this.store.addSighting(event.birdId, event.quantity, event.details, event.birdInfo);
    this.searchResults.set([]);
  }

  /**
   * Detiene el GPS al salir de la vista.
   */
  async ionViewWillLeave() {
    if (this.watchId) {
      await Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }
}
