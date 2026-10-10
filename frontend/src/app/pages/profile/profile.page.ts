import { StatWidgetComponent } from './../../shared/components/stat-widget/stat-widget.component';
import { ChangePasswordComponent } from './components/change-password.component';
import { UserMedalsComponent } from './components/user-medals/user-medals.component';
import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
  OnInit,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { 
  ModalController,
  ActionSheetController,
  ActionSheetButton,
  IonHeader, IonToolbar, IonButtons,
  IonContent, IonIcon,
  IonButton, IonMenuButton, IonSelect, IonSelectOption,
  IonChip, IonLabel
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// Core Services & Models
import { UserService } from '../../core/services/user.service';
import { UiService } from '../../core/services/ui.service';
import { AuthService } from '../../core/services/auth.service';
import { DbHelperService } from '../../core/services/db-helper.service';
import {
  GeographyService, GeoLocation
} from '../../core/services/geography.service';
import { User, UserStats } from '../../core/models/auth.models';

// Icons
import { addIcons } from 'ionicons';
import {
  atOutline,
  cameraOutline,
  checkmarkOutline,
  imageOutline,
  locationOutline,
  logoInstagram,
  bookOutline,
  trophyOutline,
  binocularsOutline,
  businessOutline,
  eyeOutline,
  pawOutline,
  mailOutline,
  lockClosedOutline,
  chevronForwardOutline,
  calendarOutline,
  timeOutline,
  trashOutline,
  closeOutline,
} from 'ionicons/icons';
import { AuthInputComponent } from '../../shared/components/auth-input/auth-input.component';
import { GeoSelectorComponent } from '../../shared/components/geo-selector/geo-selector.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { logger } from '../../core/utils/logger';

/**
 * @class ProfilePage
 * @description Gestión de perfil de usuario en FlockApp.
 * Implementa geografía dependiente, validación de Instagram y modo visitante con Bio/Social.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonButtons,
    IonContent, IonIcon,
    IonButton, IonMenuButton, IonSelect, IonSelectOption,
    IonChip, IonLabel,
    CommonModule,
    FormsModule,
    AuthInputComponent,
    StatWidgetComponent,
    GeoSelectorComponent,
    LoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage implements OnInit {
  private readonly userService = inject(UserService);
  private readonly geoService = inject(GeographyService);
  private readonly route = inject(ActivatedRoute);
  public readonly authService = inject(AuthService);
  private readonly ui = inject(UiService);
  private readonly modalCtrl = inject(ModalController);
  private readonly actionSheetCtrl = inject(ActionSheetController);
  private readonly db = inject(DbHelperService);

  /** @description Datos del usuario en vista */
  public viewedUser = signal<User | null>(null);
  public isLoading = signal<boolean>(true);
  
  public firstName = signal<string>('');
  public lastName = signal<string>('');
  public username = signal<string>('');
  public department = signal<string>('');
  public municipality = signal<string>('');
  public instagram = signal<string>('');
  public bio = signal<string>('');

  public isPristine = signal<boolean>(true);

  /** @description Listado de departamentos */
  public departments = signal<GeoLocation[]>([]);
  /** @description Listado de municipios del departamento seleccionado */
  public municipalities = signal<GeoLocation[]>([]);

  /** @description URL base del backend para activos estáticos */
  private readonly BASE_URL = 'http://localhost:3000';

  /** @description Computado para determinar propiedad del perfil */
  public isOwnProfile = computed(() => {
    const viewed = this.viewedUser();
    const current = this.authService.currentUser();
    return viewed && current ? viewed.id === current.id : false;
  });

  /** @description Estadísticas de actividad */
  public stats = signal<UserStats>({
    speciesCount: 0,
    sightingsCount: 0,
    medalsCount: 0,
    daysInApp: 0,
    natureTimeMinutes: 0,
  });

  constructor() {
    addIcons({
      atOutline,
      cameraOutline,
      checkmarkOutline,
      imageOutline,
      locationOutline,
      logoInstagram,
      bookOutline,
      trophyOutline,
      binocularsOutline,
      businessOutline,
      eyeOutline,
      pawOutline,
      mailOutline,
      lockClosedOutline,
      chevronForwardOutline,
      calendarOutline,
      timeOutline,
      trashOutline,
      closeOutline,
    });
  }

  /**
   * Inicialización del ciclo de vida y carga concurrente de geografía y perfil.
   */
  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadDepartments(), this.checkRouteAndLoad()]);
  }

  /**
   * Marca el estado del formulario como modificado.
   */
  public onFieldChange(): void {
    this.isPristine.set(false);
  }

  /**
   * Resuelve la URL absoluta para recursos multimedia.
   * @param path - Ruta relativa.
   * @returns URL resuelta o cadena vacía.
   */
  public getImageUrl(path: string | undefined): string {
    if (!path) return '';
    return path.startsWith('http') ? path : `${this.BASE_URL}${path}`;
  }

  /**
   * Carga la lista inicial de departamentos.
   * @returns Listado de departamentos recuperados.
   */
  private async loadDepartments(): Promise<GeoLocation[]> {
    try {
      const data = await this.geoService.getDepartments();
      this.departments.set(data);
      return data;
    } catch {
      logger.error('Falla en carga de geografía');
      return [];
    }
  }

  /**
   * Maneja la selección territorial sincronizada desde el componente compartido GeoSelectorComponent.
   * @param loc Resolución territorial seleccionada con nombres y IDs.
   * @param loc.departmentId Identificador del departamento.
   * @param loc.departmentName Nombre del departamento seleccionado.
   * @param loc.municipalityId Identificador del municipio.
   * @param loc.municipalityName Nombre del municipio seleccionado.
   */
  onLocationChange(loc: {
    departmentId: number | null;
    departmentName: string;
    municipalityId: number | null;
    municipalityName: string;
  }): void {
    this.department.set(loc.departmentName);
    this.municipality.set(loc.municipalityName);
    this.onFieldChange();
  }

  /**
   * @method onDepartmentChange
   * @description Maneja la selección de departamento para cargar municipios.
   * @param {CustomEvent<{ value: string }>} event - Evento de cambio de IonSelect.
   */
  async onDepartmentChange(event: CustomEvent<{ value: string }>): Promise<void> {
    const name = event.detail.value;
    const dept = this.departments().find((d) => d.name === name);
    if (dept) {
      const data = await this.geoService.getMunicipalities(dept.id);
      this.municipalities.set(data);
      this.municipality.set('');
      this.onFieldChange();
    }
  }
  /**
   * Carga datos de perfil y métricas en modo desconectado desde SQLite (solo rutas completadas).
   */
  private async loadOfflineProfileFallback(): Promise<void> {
    try {
      const session = await this.db.getSession();
      let uObj: User | null = null;
      if (session && session.user_data) {
        uObj =
          typeof session.user_data === 'string'
            ? (JSON.parse(session.user_data) as User)
            : (session.user_data as User);
        this.viewedUser.set(uObj);
        this.firstName.set(uObj.firstName || '');
        this.lastName.set(uObj.lastName || '');
        this.username.set(uObj.username || '');
      }
      const targetUserId = uObj?.id || this.authService.currentUser()?.id;
      if (!targetUserId) return;

      const localStatsResult = ((await this.db.query(
        `
        SELECT COUNT(DISTINCT rs.bird_id) AS local_species,
               COALESCE(SUM(rs.quantity), 0) AS local_birds
        FROM route_sightings rs
        INNER JOIN routes r ON rs.route_id = r.id
        WHERE r.user_id = ? AND r.status = 'COMPLETED'
      `,
        [targetUserId],
      )) || []) as Record<string, number | string>[];
      if (localStatsResult.length > 0) {
        const current = this.stats();
        this.stats.set({
          ...current,
          speciesCount:
            Number(localStatsResult[0]['local_species']) || current.speciesCount,
          sightingsCount:
            Number(localStatsResult[0]['local_birds']) || current.sightingsCount,
        });
      }
    } catch (offlineErr: unknown) {
      logger.error('Error en fallback offline de perfil:', offlineErr);
    }
  }

  /**
   * Determina el usuario a visualizar y carga su perfil con métricas consolidadas desde Postgres.
   */
  private async checkRouteAndLoad(): Promise<void> {
    const userId = this.route.snapshot.paramMap.get('id');
    try {
      const data = userId
        ? await this.userService.getProfileById(userId)
        : await this.userService.getProfile();
      if (data) {
        this.viewedUser.set(data);
        this.firstName.set(data.firstName || '');
        this.lastName.set(data.lastName || '');
        this.username.set(data.username || '');
        this.department.set(data.department || '');
        this.municipality.set(data.municipality || '');
        this.instagram.set(data.instagram || '');
        this.bio.set(data.bio || '');

        if (data.stats) {
          this.stats.set(data.stats);
        }

        if (data.department) {
          let depts = this.departments();
          if (depts.length === 0) {
            depts = await this.geoService.getDepartments();
            this.departments.set(depts);
          }
          const dept = depts.find((d) => d.name === data.department);
          if (dept) {
            const munis = await this.geoService.getMunicipalities(dept.id);
            this.municipalities.set(munis);
          }
        }
      }
      this.isLoading.set(false);
    } catch {
      await this.loadOfflineProfileFallback();
      this.isLoading.set(false);
    }
  }

  /**
   * Persiste los cambios de texto en el backend.
   */
  async onUpdateProfile(): Promise<void> {
    if (!this.isOwnProfile()) return;
    await this.ui.showLoading('Sincronizando...');
    try {
      const payload = {
        firstName: this.firstName(),
        lastName: this.lastName(),
        department: this.department(),
        municipality: this.municipality(),
        instagram: this.instagram(),
        bio: this.bio()
      };
      const updated = await this.userService.updateProfile(payload);
      this.authService.currentUser.set(updated);
      this.viewedUser.set(updated);
      await this.ui.dismissLoading();
      this.ui.showToast('Perfil actualizado', 'success');
      this.isPristine.set(true);
    } catch {
      await this.ui.dismissLoading();
    }
  }

  /**
   * @method goToSecurity
   * @description Navegación o apertura de controles para cambio de contraseña.
   */
  async goToSecurity() {
    if (!this.isOwnProfile()) return;

    const modal = await this.modalCtrl.create({
      component: ChangePasswordComponent,
      breakpoints: [0, 0.6, 1], // R2: Diseño responsive (Bottom Sheet)
      initialBreakpoint: 1,
    });
    return await modal.present();
  }

  /**
   * Abre el modal interactivo con el catálogo y estado de medallas.
   */
  async openMedalsModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: UserMedalsComponent,
      componentProps: {
        medalsList: this.viewedUser()?.medals,
        title: this.isOwnProfile() ? 'Tus Medallas' : 'Medallas del Usuario',
      },
      breakpoints: [0, 0.7, 1],
      initialBreakpoint: 1,
    });
    await modal.present();
  }

  /**
   * Retorna la etiqueta legible del rol de usuario en la UI.
   * @param role Rol del usuario.
   * @returns Etiqueta amigable para la interfaz.
   */
  public getRoleLabel(role?: string | null): string {
    if (!role) return '';
    switch (role.toUpperCase()) {
      case 'BOTH':
        return 'Pajarero / Proveedor';
      case 'PAJARERO':
        return 'Pajarero';
      case 'PROVEEDOR':
        return 'Proveedor';
      default:
        return role;
    }
  }

  /**
   * Abre un menú de opciones para subir o eliminar la foto seleccionada.
   * @param type Tipo de recurso ('AVATAR' o 'COVER').
   */
  async changePhoto(type: 'AVATAR' | 'COVER'): Promise<void> {
    if (!this.isOwnProfile()) return;

    const hasCurrentPhoto =
      type === 'AVATAR'
        ? !!this.viewedUser()?.avatarUrl
        : !!this.viewedUser()?.coverUrl;
    const label = type === 'AVATAR' ? 'foto de perfil' : 'foto de portada';

    const buttons: ActionSheetButton[] = [
      {
        text: `Subir nueva ${label}`,
        icon: 'camera-outline',
        handler: () => {
          this.executePhotoUpload(type);
        },
      },
    ];

    if (hasCurrentPhoto) {
      buttons.push({
        text: `Eliminar ${label}`,
        role: 'destructive',
        icon: 'trash-outline',
        handler: () => {
          this.removePhoto(type);
        },
      });
    }

    buttons.push({
      text: 'Cancelar',
      role: 'cancel',
      icon: 'close-outline',
    });

    const sheet = await this.actionSheetCtrl.create({
      header: `Opciones de ${label}`,
      buttons,
    });
    await sheet.present();
  }

  /**
   * Elimina la foto del perfil del usuario persistiendo la remoción en backend.
   * @param type Tipo de recurso a limpiar ('AVATAR' o 'COVER').
   */
  private async removePhoto(type: 'AVATAR' | 'COVER'): Promise<void> {
    await this.ui.showLoading('Eliminando foto...');
    try {
      const field = type === 'AVATAR' ? 'avatarUrl' : 'coverUrl';
      const updated = await this.userService.updateProfile({ [field]: '' });
      this.viewedUser.set(updated);
      this.authService.currentUser.set(updated);
      await this.ui.dismissLoading();
      this.ui.showToast('Foto eliminada correctamente', 'success');
    } catch {
      await this.ui.dismissLoading();
      this.ui.showToast('No se pudo eliminar la foto', 'danger');
    }
  }

  /**
   * Ejecuta la captura desde la cámara o galería y la carga al servidor.
   * @param type Tipo de recurso ('AVATAR' o 'COVER').
   */
  private async executePhotoUpload(type: 'AVATAR' | 'COVER'): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Photos,
        resultType: CameraResultType.Uri,
        allowEditing: true,
      });
      if (image.webPath) {
        await this.ui.showLoading('Subiendo...');
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const uploadType = type === 'AVATAR' ? 'avatar' : 'cover';
        const { url } = await this.userService.uploadImage(
          blob,
          uploadType,
          image.format
        );

        const current = this.viewedUser();
        if (current) {
          const updated = {
            ...current,
            [type === 'AVATAR' ? 'avatarUrl' : 'coverUrl']: url,
          };
          this.viewedUser.set(updated);
          this.authService.currentUser.set(updated);
        }
        await this.ui.dismissLoading();
        this.ui.showToast('Foto actualizada correctamente', 'success');
      }
    } catch {
      logger.warn('Carga de imagen cancelada');
    }
  }
}
