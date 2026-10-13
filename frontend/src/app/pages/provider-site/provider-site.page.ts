/**
 * @sdd
 * [Objetivo]: Pantalla de gestión de Sitios de Aviturismo para usuarios en Modo Proveedor.
 * [I/O]: Permite subir portada, logo, crear productos/servicios con precios, datos de contacto, redes sociales, calificación obtenida, activar checklist de aves y seleccionar/guardar especies.
 * [Edge Cases]: Carga offline tolerante a fallos, validación de campos obligatorios, sincronización con SQLite local y backend.
 */
import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
  signal,
  computed,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { Capacitor } from '@capacitor/core';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonButton,
  IonSpinner,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonToggle,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSearchbar,
  IonList,
  IonItem,
  ActionSheetController,
  ActionSheetButton,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  checkmarkOutline,
  businessOutline,
  mapOutline,
  star,
  starOutline,
  imageOutline,
  cashOutline,
  listOutline,
  callOutline,
  logoWhatsapp,
  logoInstagram,
  logoFacebook,
  globeOutline,
  addOutline,
  trashOutline,
  searchOutline,
  closeCircleOutline,
  checkmarkCircleOutline,
  pricetagOutline,
  eyeOutline,
  navigateOutline,
  locationOutline,
  leafOutline,
  closeOutline,
} from 'ionicons/icons';

import { SiteProviderService } from '../../core/services/site-provider.service';
import { UiService } from '../../core/services/ui.service';
import { NativeBridgeService } from '../../core/services/native-bridge.service';
import { UserService } from '../../core/services/user.service';
import { GeographyService, GeoLocation } from '../../core/services/geography.service';
import {
  ISiteProviderProfile,
  IUpdateSiteProfileDto,
  ICreateSiteServiceDto,
} from '../../../../../shared/models/site-profile.interface';
import { ISiteService } from '../../../../../shared/models/catalogs.interface';
import { IBirdSearch } from '../../core/models/birds.interfaces';
import { environment } from '../../../environments/environment';
import { logger } from '../../core/utils/logger';

/**
 * Detalle del evento de cambio de pestaña.
 */
export interface TabChangeDetail {
  /** Valor de la pestaña seleccionada */
  value: 'info' | 'services' | 'checklist';
}

/**
 * Detalle del evento de búsqueda de aves.
 */
export interface SearchInputDetail {
  /** Texto de búsqueda ingresado */
  value: string;
}

/**
 * Componente principal para la administración de Sitios de Aviturismo en Modo Proveedor.
 */
@Component({
  selector: 'app-provider-site',
  templateUrl: './provider-site.page.html',
  styleUrls: ['./provider-site.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonButton,
    IonSpinner,
    LoadingComponent,
    IonSelect,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonToggle,
    IonBadge,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSearchbar,
    IonList,
    IonItem,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderSitePage implements OnInit, OnDestroy {
  /** Servicio de gestión de sitios del proveedor */
  private readonly siteService = inject(SiteProviderService);
  /** Servicio de interfaz de usuario y feedback */
  private readonly ui = inject(UiService);
  /** Servicio de acceso a hardware nativo (Cámara/Galería) */
  private readonly nativeBridge = inject(NativeBridgeService);
  /** Servicio de usuario para subida de binarios */
  private readonly userService = inject(UserService);
  /** Servicio de geografía para departamentos y municipios */
  private readonly geoService = inject(GeographyService);
  /** Controlador de menú de acciones tipo Action Sheet */
  private readonly actionSheetCtrl = inject(ActionSheetController);

  /** Referencia al input file para portada */
  @ViewChild('coverFileInput') coverFileInput?: ElementRef<HTMLInputElement>;
  /** Referencia al input file para logotipo */
  @ViewChild('logoFileInput') logoFileInput?: ElementRef<HTMLInputElement>;
  /** Referencia al input file para foto de producto o servicio */
  @ViewChild('serviceFileInput') serviceFileInput?: ElementRef<HTMLInputElement>;
  /** Referencia al contenedor HTML del mapa interactivo */
  @ViewChild('siteMapContainer') siteMapContainer?: ElementRef<HTMLDivElement>;

  /** Datos completos del sitio */
  public site = signal<ISiteProviderProfile | null>(null);
  /** Pestaña activa ('info' | 'services' | 'checklist') */
  public activeTab = signal<'info' | 'services' | 'checklist'>('info');
  /** Estado de carga inicial */
  public isLoading = signal<boolean>(true);
  /** Estado de guardado en proceso */
  public isSaving = signal<boolean>(false);

  /** Estado de error al renderizar foto de portada */
  public coverLoadError = signal<boolean>(false);
  /** Estado de error al renderizar logotipo */
  public logoLoadError = signal<boolean>(false);

  // --- Campos del Formulario de Datos ---
  /** Nombre del sitio */
  public name = signal<string>('');
  /** Departamento */
  public department = signal<string>('');
  /** Municipio */
  public municipality = signal<string>('');
  /** Descripción general */
  public description = signal<string>('');
  /** Foto de portada */
  public coverUrl = signal<string>('');
  /** Logotipo del sitio */
  public logoUrl = signal<string>('');
  /** Teléfono de contacto */
  public contactPhone = signal<string>('');
  /** WhatsApp de contacto */
  public contactWhatsapp = signal<string>('');
  /** Página web oficial */
  public website = signal<string>('');
  /** Red social Instagram */
  public instagram = signal<string>('');
  /** Red social Facebook */
  public facebook = signal<string>('');
  /** Indicador de si el sitio cuenta con checklist de aves */
  public hasBirdChecklist = signal<boolean>(false);

  // --- Coordenadas Geoespaciales y Mapa ---
  /** Latitud GPS del sitio */
  public latitude = signal<number | null>(null);
  /** Longitud GPS del sitio */
  public longitude = signal<number | null>(null);
  /** Indicador de captura GPS en proceso */
  public isLocating = signal<boolean>(false);

  /** Instancia del mapa Leaflet */
  private map: L.Map | null = null;
  /** Marcador del mapa */
  private marker: L.Marker | null = null;

  // --- Catálogos Territoriales ---
  /** Lista de departamentos */
  public departments = signal<GeoLocation[]>([]);
  /** Lista de municipios del departamento seleccionado */
  public municipalities = signal<GeoLocation[]>([]);

  // --- Gestión de Servicios y Productos ---
  /** Listado de productos y servicios */
  public servicesList = signal<ISiteService[]>([]);
  /** Visibilidad del formulario de nuevo servicio */
  public isAddingService = signal<boolean>(false);
  /** Tipo de oferta ('service' | 'product') */
  public newServiceType = signal<'service' | 'product'>('service');
  /** Nombre del nuevo producto/servicio */
  public newServiceName = signal<string>('');
  /** Precio en COP */
  public newServicePrice = signal<number | null>(null);
  /** Descripción del nuevo producto/servicio */
  public newServiceDescription = signal<string>('');
  /** URL de la foto del nuevo producto/servicio */
  public newServicePhotoUrl = signal<string>('');
  /** Indicador de subida de foto de producto/servicio en progreso */
  public isUploadingServicePhoto = signal<boolean>(false);

  // --- Gestión del Checklist de Aves ---
  /** Término de búsqueda de aves */
  public birdSearchTerm = signal<string>('');
  /** Coincidencias encontradas */
  public birdSearchResults = signal<IBirdSearch[]>([]);
  /** Especies seleccionadas en el checklist */
  public selectedBirds = signal<IBirdSearch[]>([]);
  /** Estado de guardado del checklist */
  public isSavingChecklist = signal<boolean>(false);

  /** Arreglo de 5 estrellas para renderizado visual */
  public starArray = [1, 2, 3, 4, 5];

  /** Total de aves seleccionadas computado */
  public selectedBirdsCount = computed(() => this.selectedBirds().length);

  /**
   * Registra los iconos requeridos en la vista.
   */
  constructor() {
    addIcons({
      cameraOutline,
      checkmarkOutline,
      businessOutline,
      mapOutline,
      star,
      starOutline,
      imageOutline,
      cashOutline,
      listOutline,
      callOutline,
      logoWhatsapp,
      logoInstagram,
      logoFacebook,
      globeOutline,
      addOutline,
      trashOutline,
      searchOutline,
      closeCircleOutline,
      checkmarkCircleOutline,
      pricetagOutline,
      eyeOutline,
      navigateOutline,
      locationOutline,
      leafOutline,
      closeOutline,
    });
  }

  /**
   * Carga inicial del sitio, geografía y checklist al montar la vista.
   */
  async ngOnInit(): Promise<void> {
    await this.loadInitialData();
  }

  /**
   * Obtiene los datos del sitio y departamentos.
   */
  async loadInitialData(): Promise<void> {
    this.isLoading.set(true);
    try {
      const [siteData, depts] = await Promise.all([
        this.siteService.getMySite(),
        this.geoService.getDepartments(),
      ]);

      this.site.set(siteData);
      this.departments.set(depts);

      // Poblar formulario
      this.name.set(siteData.name || '');
      this.department.set(siteData.department || '');
      this.municipality.set(siteData.municipality || '');
      this.description.set(siteData.description || '');
      this.coverUrl.set(siteData.cover_url || '');
      this.logoUrl.set(siteData.logo_url || '');
      this.contactPhone.set(siteData.contact_phone || '');
      this.contactWhatsapp.set(siteData.contact_whatsapp || '');
      this.website.set(siteData.website || '');
      this.instagram.set(siteData.instagram || '');
      this.facebook.set(siteData.facebook || '');
      this.hasBirdChecklist.set(siteData.has_bird_checklist);
      this.servicesList.set(siteData.services || []);

      // Coordenadas geoespaciales del sitio
      if (
        siteData.location &&
        typeof siteData.location.lat === 'number' &&
        typeof siteData.location.lng === 'number' &&
        (Math.abs(siteData.location.lat) > 0.0001 ||
          Math.abs(siteData.location.lng) > 0.0001)
      ) {
        this.latitude.set(siteData.location.lat);
        this.longitude.set(siteData.location.lng);
      } else {
        // Coordenadas centrales por defecto para Colombia
        this.latitude.set(4.5709);
        this.longitude.set(-74.2973);
      }

      // Cargar municipios si hay departamento
      if (siteData.department) {
        const foundDept = depts.find((d) => d.name === siteData.department);
        if (foundDept) {
          const munis = await this.geoService.getMunicipalities(foundDept.id);
          this.municipalities.set(munis);
        }
      }

      // Cargar aves del checklist si existen
      const birdIds = await this.siteService.getMySiteBirds();
      if (birdIds.length > 0) {
        const detailedBirds = await this.siteService.getBirdsByIds(birdIds);
        this.selectedBirds.set(detailedBirds);
      }

      setTimeout(() => {
        if (this.activeTab() === 'info') {
          this.initMap();
        }
      }, 300);
    } catch (e) {
      logger.error('Error cargando sitio del proveedor:', e);
      await this.ui.showToast('No pudimos cargar la información del sitio.', 'danger');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Cambia la pestaña activa del segmento.
   * @param event Evento con el nuevo valor.
   */
  onTabChange(event: CustomEvent): void {
    const detail = event.detail as TabChangeDetail;
    if (detail && detail.value) {
      this.activeTab.set(detail.value);
      if (detail.value === 'info') {
        setTimeout(() => {
          if (this.map) {
            this.map.invalidateSize();
          } else {
            this.initMap();
          }
        }, 200);
      }
    }
  }

  /**
   * Actualiza el listado de municipios cuando cambia el departamento.
   * @param deptName Nombre del departamento seleccionado.
   */
  async onDepartmentChange(deptName: string): Promise<void> {
    this.department.set(deptName);
    this.municipality.set('');
    const foundDept = this.departments().find((d) => d.name === deptName);
    if (foundDept) {
      const munis = await this.geoService.getMunicipalities(foundDept.id);
      this.municipalities.set(munis);
    } else {
      this.municipalities.set([]);
    }
  }

  /**
   * Abre menú de opciones para subir o eliminar foto de portada o logotipo,
   * replicando el comportamiento estándar de Mi Perfil y Perfil de Guía.
   * @param type Tipo de foto a gestionar ('COVER' | 'LOGO').
   */
  async changePhoto(type: 'COVER' | 'LOGO'): Promise<void> {
    const hasCurrentPhoto =
      type === 'COVER'
        ? Boolean(this.coverUrl() && !this.coverLoadError())
        : Boolean(this.logoUrl() && !this.logoLoadError());
    const label = type === 'COVER' ? 'foto de portada' : 'logotipo';

    const buttons: ActionSheetButton[] = [
      {
        text: `Subir nueva ${label}`,
        icon: 'camera-outline',
        /**
         * Dispara la carga o captura de una nueva fotografía.
         */
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
        /**
         * Elimina la fotografía actual y restablece el respaldo.
         */
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
   * Elimina la fotografía seleccionada y restablece el banner o icono de respaldo.
   * @param type Tipo de foto ('COVER' | 'LOGO').
   */
  removePhoto(type: 'COVER' | 'LOGO'): void {
    if (type === 'COVER') {
      this.coverUrl.set('');
      this.coverLoadError.set(false);
      this.ui.showToast('Foto de portada eliminada.', 'success');
    } else {
      this.logoUrl.set('');
      this.logoLoadError.set(false);
      this.ui.showToast('Logotipo eliminado.', 'success');
    }
  }

  /**
   * Ejecuta la captura nativa o activa el selector de archivos web.
   * @param type Tipo de foto a capturar o subir ('COVER' | 'LOGO').
   */
  private async executePhotoUpload(type: 'COVER' | 'LOGO'): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        const image = await this.nativeBridge.getPhoto();
        if (image.webPath) {
          const response = await fetch(image.webPath);
          const blob = await response.blob();
          await this.uploadBlob(blob, type, image.format || 'jpg');
          return;
        }
      } catch (err) {
        logger.warn('Captura nativa no completada o cancelada:', err);
      }
    }

    // En navegador Web / PWA o respaldo si nativo cancela: invocar selector de archivos
    if (type === 'COVER' && this.coverFileInput) {
      this.coverFileInput.nativeElement.click();
    } else if (type === 'LOGO' && this.logoFileInput) {
      this.logoFileInput.nativeElement.click();
    }
  }

  /**
   * Manejador de evento cuando se selecciona un archivo desde el input file HTML.
   * @param event Evento change del input.
   * @param type Tipo de foto ('COVER' | 'LOGO').
   */
  async onFileInputChange(event: Event, type: 'COVER' | 'LOGO'): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const extension = file.type.split('/')[1] || 'jpg';
    await this.uploadBlob(file, type, extension);
    input.value = '';
  }

  /**
   * Sube el blob de imagen al backend y actualiza la URL en el formulario.
   * @param blob Binario de la imagen.
   * @param type Tipo de imagen.
   * @param extension Extensión de archivo.
   */
  private async uploadBlob(
    blob: Blob,
    type: 'COVER' | 'LOGO',
    extension: string,
  ): Promise<void> {
    const loadingMsg =
      type === 'COVER'
        ? 'Subiendo foto de portada...'
        : 'Subiendo logotipo...';
    await this.ui.showLoading(loadingMsg);
    try {
      const uploadType = type === 'COVER' ? 'provider-cover' : 'provider-avatar';
      const result = await this.userService.uploadImage(
        blob,
        uploadType,
        extension,
      );

      if (result && result.url) {
        if (type === 'COVER') {
          this.coverUrl.set(result.url);
          this.coverLoadError.set(false);
        } else {
          this.logoUrl.set(result.url);
          this.logoLoadError.set(false);
        }
        await this.ui.showToast(
          type === 'COVER' ? '¡Foto de portada actualizada!' : '¡Logotipo actualizado!',
          'success',
        );
      }
    } catch (e) {
      logger.error('Error subiendo imagen de sitio:', e);
      await this.ui.showToast('No se pudo subir la imagen. Intenta de nuevo.', 'danger');
    } finally {
      await this.ui.dismissLoading();
    }
  }

  /**
   * Inicializa el mapa interactivo de Leaflet en el contenedor correspondiente.
   */
  private initMap(): void {
    if (!this.siteMapContainer?.nativeElement) return;
    if (this.map) {
      this.map.invalidateSize();
      return;
    }

    const lat = this.latitude() ?? 4.5709;
    const lng = this.longitude() ?? -74.2973;
    const zoom = lat !== 4.5709 || lng !== -74.2973 ? 14 : 6;

    this.map = L.map(this.siteMapContainer.nativeElement).setView(
      [lat, lng],
      zoom,
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      crossOrigin: true,
    }).addTo(this.map);

    const customMarkerUrl = 'assets/markers/marker_mapa_avistamiento.png';
    const markerIcon = L.icon({
      iconRetinaUrl: customMarkerUrl,
      iconUrl: customMarkerUrl,
      shadowUrl: '',
      iconSize: [36, 40],
      iconAnchor: [18, 40],
      popupAnchor: [0, -40],
    });

    this.marker = L.marker([lat, lng], {
      draggable: true,
      icon: markerIcon,
    }).addTo(this.map);

    this.marker.on('dragend', () => {
      if (this.marker) {
        const pos = this.marker.getLatLng();
        this.latitude.set(Number(pos.lat.toFixed(6)));
        this.longitude.set(Number(pos.lng.toFixed(6)));
      }
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat: clickedLat, lng: clickedLng } = e.latlng;
      const newLat = Number(clickedLat.toFixed(6));
      const newLng = Number(clickedLng.toFixed(6));
      this.latitude.set(newLat);
      this.longitude.set(newLng);
      if (this.marker) {
        this.marker.setLatLng([newLat, newLng]);
      }
    });

    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 250);
  }

  /**
   * Sincroniza la posición visual del marcador y la vista del mapa con los inputs manuales.
   */
  private syncMapToCoordinates(): void {
    const lat = this.latitude();
    const lng = this.longitude();
    if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      }
      if (this.map) {
        this.map.panTo([lat, lng]);
      }
    }
  }

  /**
   * Actualiza la latitud desde el input manual.
   * @param val Valor numérico o de texto.
   */
  onLatitudeChange(val: string | number | null): void {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    this.latitude.set(num);
    this.syncMapToCoordinates();
  }

  /**
   * Actualiza la longitud desde el input manual.
   * @param val Valor numérico o de texto.
   */
  onLongitudeChange(val: string | number | null): void {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    this.longitude.set(num);
    this.syncMapToCoordinates();
  }

  /**
   * Detecta la ubicación GPS actual del dispositivo y la asigna al mapa y formulario.
   */
  async useCurrentLocation(): Promise<void> {
    if (!navigator.geolocation) {
      await this.ui.showToast(
        'La geolocalización no está disponible en este dispositivo.',
        'warning',
      );
      return;
    }

    this.isLocating.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        this.latitude.set(lat);
        this.longitude.set(lng);
        this.syncMapToCoordinates();
        if (this.map) {
          this.map.setView([lat, lng], 15);
        }
        this.isLocating.set(false);
        this.ui.showToast('¡Ubicación GPS fijada exitosamente!', 'success');
      },
      (err) => {
        logger.warn('Error capturando GPS del dispositivo:', err);
        this.isLocating.set(false);
        this.ui.showToast(
          'No se pudo obtener la ubicación GPS actual.',
          'warning',
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }

  /**
   * Hook de destrucción para liberar recursos de Leaflet.
   */
  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  /**
   * Guarda los cambios de información general y contacto del sitio.
   */
  async onSaveInfo(): Promise<void> {
    if (!this.name().trim()) {
      await this.ui.showToast('El nombre del sitio es obligatorio.', 'warning');
      return;
    }

    this.isSaving.set(true);
    try {
      const payload: IUpdateSiteProfileDto = {
        name: this.name().trim(),
        department: this.department().trim(),
        municipality: this.municipality().trim(),
        description: this.description().trim(),
        cover_url: this.coverUrl(),
        logo_url: this.logoUrl(),
        contact_phone: this.contactPhone().trim(),
        contact_whatsapp: this.contactWhatsapp().trim(),
        website: this.website().trim(),
        instagram: this.instagram().trim(),
        facebook: this.facebook().trim(),
        has_bird_checklist: this.hasBirdChecklist(),
        latitude: this.latitude() ?? undefined,
        longitude: this.longitude() ?? undefined,
      };

      const updated = await this.siteService.updateMySite(payload);
      this.site.set(updated);
      if (updated.location) {
        this.latitude.set(updated.location.lat);
        this.longitude.set(updated.location.lng);
        this.syncMapToCoordinates();
      }
      await this.ui.showToast('¡Información del sitio guardada exitosamente!', 'success');
    } catch (e) {
      logger.error('Error al guardar datos del sitio:', e);
      await this.ui.showToast('Error al guardar los datos del sitio.', 'danger');
    } finally {
      this.isSaving.set(false);
    }
  }

  /**
   * Actualiza el tipo de oferta seleccionado en el segmento.
   * @param val Valor recibido del segmento.
   */
  onServiceTypeChange(val: unknown): void {
    if (val === 'product' || val === 'service') {
      this.newServiceType.set(val);
    }
  }

  /**
   * Alterna la visualización del formulario para agregar un nuevo ítem del catálogo.
   */
  toggleAddService(): void {
    const nextState = !this.isAddingService();
    this.isAddingService.set(nextState);
    if (!nextState) {
      this.newServicePhotoUrl.set('');
    }
  }

  /**
   * Abre selector de cámara o selector de archivos para la foto del producto o servicio.
   */
  async changeServicePhoto(): Promise<void> {
    const MAX_SIZE_BYTES = 1024 * 1024; // 1 MB

    if (Capacitor.isNativePlatform()) {
      try {
        const image = await this.nativeBridge.getPhoto();
        const validFormats = ['jpg', 'jpeg', 'png'];
        const format = (image.format || '').toLowerCase();
        if (format && !validFormats.includes(format)) {
          await this.ui.showToast('Solo se permiten imágenes en formato JPG o PNG.', 'warning');
          return;
        }

        if (image.webPath) {
          const response = await fetch(image.webPath);
          const blob = await response.blob();

          if (blob.size > MAX_SIZE_BYTES) {
            await this.ui.showToast('La imagen no debe superar 1 MB de tamaño.', 'warning');
            return;
          }

          await this.uploadServiceBlob(blob, format || 'jpg');
          return;
        }
      } catch (err) {
        logger.warn('Captura nativa de foto de producto cancelada o con error:', err);
      }
    }

    if (this.serviceFileInput) {
      this.serviceFileInput.nativeElement.click();
    }
  }

  /**
   * Manejador de evento cuando se selecciona un archivo de imagen para el producto/servicio.
   * Valida formato (JPG o PNG) y tamaño máximo de 1MB.
   * @param event Evento change emitido por el input HTML.
   */
  async onServiceFileInputChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const MAX_SIZE_BYTES = 1024 * 1024; // 1 MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const isMimeValid = allowedTypes.includes(file.type.toLowerCase());
    const isExtValid = ['jpg', 'jpeg', 'png'].includes(extension);

    if (!isMimeValid && !isExtValid) {
      await this.ui.showToast('Solo se permiten imágenes en formato JPG o PNG.', 'warning');
      input.value = '';
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      await this.ui.showToast('La imagen no debe superar 1 MB de tamaño.', 'warning');
      input.value = '';
      return;
    }

    await this.uploadServiceBlob(file, extension || 'jpg');
    input.value = '';
  }

  /**
   * Sube el blob de la imagen del producto/servicio al servidor.
   * @param blob Binario de la foto.
   * @param extension Extensión del archivo.
   */
  private async uploadServiceBlob(blob: Blob, extension: string): Promise<void> {
    this.isUploadingServicePhoto.set(true);
    await this.ui.showLoading('Subiendo foto del producto...');
    try {
      const result = await this.userService.uploadImage(
        blob,
        'provider-product',
        extension,
      );
      if (result && result.url) {
        this.newServicePhotoUrl.set(result.url);
        await this.ui.showToast('¡Foto cargada exitosamente!', 'success');
      }
    } catch (e) {
      logger.error('Error subiendo foto de producto:', e);
      await this.ui.showToast('No se pudo subir la foto del producto. Intenta nuevamente.', 'danger');
    } finally {
      this.isUploadingServicePhoto.set(false);
      await this.ui.dismissLoading();
    }
  }

  /**
   * Elimina la foto seleccionada en el formulario de creación de producto/servicio.
   */
  removeServicePhoto(): void {
    this.newServicePhotoUrl.set('');
  }

  /**
   * Agrega un nuevo producto o servicio al catálogo del sitio.
   */
  async onAddService(): Promise<void> {
    const sName = this.newServiceName().trim();
    const sPrice = this.newServicePrice();

    if (!sName) {
      await this.ui.showToast('Ingresa el nombre del producto o servicio.', 'warning');
      return;
    }
    if (sPrice === null || sPrice < 0) {
      await this.ui.showToast('Ingresa un precio válido (mayor o igual a 0).', 'warning');
      return;
    }

    await this.ui.showLoading('Guardando servicio...');
    try {
      const payload: ICreateSiteServiceDto = {
        type: this.newServiceType(),
        name: sName,
        price: sPrice,
        description: this.newServiceDescription().trim() || undefined,
        photo_url: this.newServicePhotoUrl().trim() || undefined,
      };

      const created = await this.siteService.addService(payload);
      this.servicesList.update((prev) => [created, ...prev]);

      // Resetear formulario
      this.newServiceName.set('');
      this.newServicePrice.set(null);
      this.newServiceDescription.set('');
      this.newServicePhotoUrl.set('');
      this.isAddingService.set(false);

      await this.ui.dismissLoading();
      await this.ui.showToast('Producto o servicio agregado con éxito.', 'success');
    } catch (e) {
      logger.error('Error creando servicio:', e);
      await this.ui.dismissLoading();
      await this.ui.showToast('Error al crear el servicio.', 'danger');
    }
  }

  /**
   * Elimina un producto o servicio de la lista.
   * @param serviceId ID del servicio a eliminar.
   */
  async onDeleteService(serviceId: string): Promise<void> {
    try {
      await this.ui.showLoading('Eliminando...');
      await this.siteService.deleteService(serviceId);
      this.servicesList.update((prev) => prev.filter((s) => s.id !== serviceId));
      await this.ui.dismissLoading();
      await this.ui.showToast('Servicio eliminado.', 'success');
    } catch (e) {
      logger.error('Error eliminando servicio:', e);
      await this.ui.dismissLoading();
      await this.ui.showToast('No se pudo eliminar el servicio.', 'danger');
    }
  }

  /**
   * Busca especies de aves en la base de datos local SQLite según el texto ingresado.
   * @param event Evento del buscador.
   */
  async onSearchBirds(event: CustomEvent): Promise<void> {
    const detail = event.detail as SearchInputDetail;
    const query = detail.value || '';
    this.birdSearchTerm.set(query);

    if (query.trim().length < 2) {
      this.birdSearchResults.set([]);
      return;
    }

    const results = await this.siteService.searchLocalBirds(query);
    // Filtrar aquellas que ya están seleccionadas
    const currentIds = new Set(this.selectedBirds().map((b) => b.id));
    const filtered = results.filter((b) => !currentIds.has(b.id));
    this.birdSearchResults.set(filtered);
  }

  /**
   * Añade un ave al checklist del sitio.
   * @param bird Ave a seleccionar.
   */
  addBirdToChecklist(bird: IBirdSearch): void {
    this.selectedBirds.update((prev) => [...prev, bird]);
    this.birdSearchResults.update((prev) => prev.filter((b) => b.id !== bird.id));
  }

  /**
   * Remueve un ave del checklist del sitio.
   * @param birdId ID del ave a remover.
   */
  removeBirdFromChecklist(birdId: number): void {
    this.selectedBirds.update((prev) => prev.filter((b) => b.id !== birdId));
  }

  /**
   * Guarda y sincroniza el checklist completo de aves del sitio con el backend.
   */
  async onSaveChecklist(): Promise<void> {
    const currentSite = this.site();
    if (!currentSite) return;

    this.isSavingChecklist.set(true);
    try {
      const birdIds = this.selectedBirds().map((b) => b.id);
      await this.siteService.syncMySiteBirds(currentSite.id, birdIds);

      // Si se agregaron aves, asegurar que el check esté en true
      if (birdIds.length > 0) {
        this.hasBirdChecklist.set(true);
      }

      await this.ui.showToast(
        `Checklist guardado con ${birdIds.length} especies de aves.`,
        'success',
      );
    } catch (e) {
      logger.error('Error guardando checklist de aves:', e);
      await this.ui.showToast('Error al guardar el checklist de aves.', 'danger');
    } finally {
      this.isSavingChecklist.set(false);
    }
  }

  /**
   * Resuelve URL absoluta para fotos almacenadas en el backend o URLs remotas.
   * @param path Ruta o URL de la imagen.
   * @returns URL completa o string vacío.
   */
  getImageUrl(path?: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${environment.urlBack}${cleanPath}`;
  }

  /**
   * Formatea un valor numérico como moneda colombiana (COP).
   * @param price Precio a formatear.
   * @returns Cadena con formato moneda.
   */
  formatCurrency(price?: number): string {
    if (price === undefined || price === null) return '$0 COP';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(price);
  }
}
