/**
 * @sdd
 * @description Detail page of a specific Site (Offline First).
 * @io Load site by ID using SiteStore dictionary.
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonIcon,
  IonChip,
  IonButton,
  IonSpinner,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonThumbnail,
  IonTextarea,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  listOutline,
  star,
  starOutline,
  logoWhatsapp,
  callOutline,
  globeOutline,
  logoInstagram,
  logoFacebook,
  navigateOutline,
  mapOutline,
  checkmarkCircle,
  closeCircle,
} from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';
import { SiteStore } from '../../../core/stores/site.store';
import { ISite, ISiteService } from '../../../../../../shared/models/catalogs.interface';
import { DbHelperService } from '../../../core/services/db-helper.service';
import { IBirdSearch } from '../../../core/models/birds.interfaces';
import { logger } from '../../../core/utils/logger';

import { SiteProviderService } from '../../../core/services/site-provider.service';

/**
 * Respuesta del endpoint de detalle de sitio con servicios opcionales.
 */
export interface ISiteDetailResponse extends ISite {
  /** Servicios registrados para el sitio */
  services?: ISiteService[];
  /** IDs de aves registradas en el checklist del sitio */
  bird_ids?: number[];
}

/**
 *
 */
@Component({
  selector: 'app-site-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonIcon,
    IonChip,
    IonButton,
    IonSpinner,
    IonModal,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonThumbnail,
    IonTextarea,
    FormsModule,
  ],
  templateUrl: './site-detail.page.html',
  styleUrls: ['./site-detail.page.scss'],
})
export class SiteDetailPage implements OnInit {
  /**
   *
   */
  private readonly route = inject(ActivatedRoute);
  /**
   *
   */
  private readonly siteStore = inject(SiteStore);
  /**
   *
   */
  private readonly db = inject(DbHelperService);

  /**
   *
   */
  public site: ISite | undefined;

  /**
   *
   */
  public checklist = signal<IBirdSearch[]>([]);
  /**
   *
   */
  public isChecklistOpen = signal(false);

  /**
   * Lista de servicios ofrecidos en el sitio
   */
  public services = signal<ISiteService[]>([]);

  /**
   * Estado de visibilidad del modal de calificación
   */
  public isRatingModalOpen = signal(false);
  /**
   * Puntuación local del modal
   */
  public userRating = signal<number>(0);
  /**
   * Comentario local del modal
   */
  public userComment = signal<string>('');

  /**
   * HTTP Client para peticiones directas de rating y sincronización
   */
  private readonly http = inject(HttpClient);

  /**
   * Controlador de alertas
   */
  private readonly toastCtrl = inject(ToastController);
  /**
   * Servicio de proveedor para recuperación de catálogo de aves
   */
  private readonly siteProvider = inject(SiteProviderService);

  /**
   * Inicializa el componente registrando los iconos a usar
   */
  constructor() {
    addIcons({
      locationOutline,
      listOutline,
      star,
      starOutline,
      logoWhatsapp,
      callOutline,
      globeOutline,
      logoInstagram,
      logoFacebook,
      navigateOutline,
      mapOutline,
      checkmarkCircle,
      closeCircle,
    });
  }

  /**
   * Carga el detalle del sitio cuando la vista se hace activa.
   */
  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.loadSiteData(id);
    }
  }

  /**
   * Resuelve URL absoluta para fotos almacenadas en el backend o URLs remotas.
   * @param path Ruta o URL de la imagen.
   * @returns URL completa o string vacío.
   */
  public getImageUrl(path: string | undefined | null): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('assets/')) {
      return path;
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${environment.urlBack}${cleanPath}`;
  }

  /**
   * Manejador de error al cargar imágenes con fallback visual.
   * @param event Evento emitido al fallar la carga de la imagen.
   */
  public onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/imgs/commons/general-error.png';
    }
  }

  /**
   * Construye el enlace de WhatsApp limpiando caracteres no numéricos.
   * @param phone Teléfono o celular.
   * @returns URL hacia la API de WhatsApp.
   */
  public getWhatsAppUrl(phone: string): string {
    const cleanNumber = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}`;
  }

  /**
   * Normaliza el enlace de perfil de Instagram.
   * @param handleOrUrl Usuario de Instagram o URL completa.
   * @returns URL de Instagram válida.
   */
  public getInstagramUrl(handleOrUrl: string): string {
    if (handleOrUrl.startsWith('http://') || handleOrUrl.startsWith('https://')) {
      return handleOrUrl;
    }
    const cleanHandle = handleOrUrl.replace(/^@/, '').trim();
    return `https://instagram.com/${cleanHandle}`;
  }

  /**
   * Normaliza el enlace de página de Facebook.
   * @param handleOrUrl Identificador o URL completa.
   * @returns URL de Facebook válida.
   */
  public getFacebookUrl(handleOrUrl: string): string {
    if (handleOrUrl.startsWith('http://') || handleOrUrl.startsWith('https://')) {
      return handleOrUrl;
    }
    return `https://facebook.com/${handleOrUrl.trim()}`;
  }

  /**
   * Normaliza el enlace a sitio web asegurando protocolo HTTPS.
   * @param url Dirección web del sitio.
   * @returns URL válida.
   */
  public getWebUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url.trim()}`;
  }

  /**
   * Carga la información del sitio desde SQLite local e intenta refrescar desde el backend.
   * @param id Identificador del sitio.
   */
  private async loadSiteData(id: string): Promise<void> {
    // 1. Carga inmediata desde SQLite (Offline First)
    let localSite = this.siteStore.getSiteById(id);
    if (!localSite) {
      await this.siteStore.loadSites();
      localSite = this.siteStore.getSiteById(id);
    }
    if (localSite) {
      this.site = localSite;
    }
    await this.loadServices(id);

    // 2. Consulta remota en background si hay conectividad
    try {
      const remoteSite = await firstValueFrom(
        this.http.get<ISiteDetailResponse>(`${environment.apiUrl}/sites/${id}`),
      );

      if (remoteSite) {
        this.site = {
          ...this.site,
          ...remoteSite,
          photoUrl:
            remoteSite.cover_url ||
            remoteSite.logo_url ||
            remoteSite.photoUrl ||
            this.site?.photoUrl ||
            '',
        };

        if (Array.isArray(remoteSite.services)) {
          this.services.set(remoteSite.services);
          await this.persistRemoteServices(remoteSite.services);
        }

        // Actualizar aves del sitio en SQLite si vienen en la respuesta remota
        if (Array.isArray(remoteSite.bird_ids) && remoteSite.bird_ids.length > 0) {
          await this.persistRemoteSiteBirds(remoteSite.id, remoteSite.bird_ids);
        }

        // Actualizar datos del sitio en SQLite local
        const lat = remoteSite.location?.lat ?? null;
        const lng = remoteSite.location?.lng ?? null;
        await this.db
          .query(
            `INSERT INTO sites (id, name, department, municipality, rating, description, cover_url, logo_url, contact_phone, contact_whatsapp, website, instagram, facebook, has_bird_checklist, geo_lat, geo_lng, last_modified, sql_deleted)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, strftime('%s', 'now'), 0)
             ON CONFLICT(id) DO UPDATE SET
               name = excluded.name,
               department = excluded.department,
               municipality = excluded.municipality,
               rating = excluded.rating,
               description = excluded.description,
               cover_url = excluded.cover_url,
               logo_url = excluded.logo_url,
               contact_phone = excluded.contact_phone,
               contact_whatsapp = excluded.contact_whatsapp,
               website = excluded.website,
               instagram = excluded.instagram,
               facebook = excluded.facebook,
               has_bird_checklist = excluded.has_bird_checklist,
               geo_lat = excluded.geo_lat,
               geo_lng = excluded.geo_lng,
               last_modified = strftime('%s', 'now'),
               sql_deleted = 0`,
            [
              remoteSite.id,
              remoteSite.name,
              remoteSite.department || '',
              remoteSite.municipality || '',
              remoteSite.rating || 5.0,
              remoteSite.description || '',
              remoteSite.cover_url || '',
              remoteSite.logo_url || '',
              remoteSite.contact_phone || '',
              remoteSite.contact_whatsapp || '',
              remoteSite.website || '',
              remoteSite.instagram || '',
              remoteSite.facebook || '',
              remoteSite.has_bird_checklist ? 1 : 0,
              lat,
              lng,
            ],
          )
          .catch(() => null);
        await this.db.saveToStore().catch(() => null);
      }
    } catch {
      // Si está offline, la vista continúa operativa con los datos locales
    }
  }

  /**
   * Carga los servicios del sitio desde SQLite mapeando nombres de columnas a la interfaz.
   * @param siteId ID del sitio.
   */
  async loadServices(siteId: string): Promise<void> {
    try {
      const dbServices = await this.db.query<Record<string, unknown>>(
        'SELECT * FROM site_services WHERE site_id = ? AND sql_deleted = 0 ORDER BY type ASC',
        [siteId],
      );
      const mappedServices: ISiteService[] = dbServices.map((s) => ({
        id: String(s['id']),
        site_id: String(s['site_id']),
        type: (s['type'] as 'service' | 'product' | 'other') || 'service',
        name: String(s['name'] || ''),
        description: String(s['description'] || ''),
        photoUrl: (s['photoUrl'] as string) || (s['photo_url'] as string) || '',
        price: s['price'] !== null && s['price'] !== undefined ? Number(s['price']) : undefined,
        last_modified: Number(s['last_modified'] || 0),
        sql_deleted: Boolean(s['sql_deleted']),
      }));
      this.services.set(mappedServices);
    } catch (e) {
      logger.error('Error cargando servicios', e);
    }
  }

  /**
   * Setea la calificación seleccionada por el usuario.
   * @param score Puntuación 1-5.
   */
  setRating(score: number): void {
    this.userRating.set(score);
  }

  /**
   * Envía la calificación al backend (Online-first para calificaciones).
   */
  async submitRating(): Promise<void> {
    if (!this.site || this.userRating() === 0) return;

    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/sites/${this.site.id}/rating`, {
          score: this.userRating(),
          comment: this.userComment(),
        }),
      );

      const toast = await this.toastCtrl.create({
        message: '¡Gracias por calificar!',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
      this.isRatingModalOpen.set(false);
    } catch (e) {
      logger.error('Error guardando calificación', e);
      const toast = await this.toastCtrl.create({
        message: 'No pudimos guardar tu calificación. ¿Estás online?',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    }
  }

  /**
   * Carga el listado de aves asociadas a este sitio desde SQLite con fallback remoto.
   */
  async loadChecklist(): Promise<void> {
    if (!this.site) return;
    try {
      let birds = await this.db.query<IBirdSearch>(
        `SELECT b.id, b.scientific_name, b.common_name, b.english_name, b.base_image
         FROM site_birds sb
         INNER JOIN birds b ON sb.bird_id = b.id
         WHERE sb.site_id = ? AND sb.sql_deleted = 0
         ORDER BY b.scientific_name ASC`,
        [this.site.id],
      );

      // Si no hay aves en la base local o está vacía, consultar backend como fallback
      if (birds.length === 0) {
        try {
          const birdIds = await firstValueFrom(
            this.http.get<number[]>(`${environment.apiUrl}/sites/${this.site.id}/birds`),
          );
          if (Array.isArray(birdIds) && birdIds.length > 0) {
            birds = await this.siteProvider.getBirdsByIds(birdIds);
            await this.persistRemoteSiteBirds(this.site.id, birdIds);
          }
        } catch (remoteErr) {
          logger.warn('No se pudo consultar el checklist remoto del sitio:', remoteErr);
        }
      }

      this.checklist.set(birds);
      this.isChecklistOpen.set(true);
    } catch (e) {
      logger.error('Error cargando checklist de aves', e);
    }
  }

  /**
   * Persiste en SQLite local los servicios recibidos desde el backend.
   * @param services Lista de servicios remotos a sincronizar.
   */
  private async persistRemoteServices(services: ISiteService[]): Promise<void> {
    for (const s of services) {
      await this.db
        .query(
          `INSERT INTO site_services (id, site_id, type, name, description, photo_url, price, last_modified, sql_deleted)
           VALUES (?, ?, ?, ?, ?, ?, ?, strftime('%s', 'now'), 0)
           ON CONFLICT(id) DO UPDATE SET
             type = excluded.type,
             name = excluded.name,
             description = excluded.description,
             photo_url = excluded.photo_url,
             price = excluded.price,
             last_modified = strftime('%s', 'now'),
             sql_deleted = 0`,
          [
            s.id,
            s.site_id,
            s.type,
            s.name,
            s.description || '',
            s.photoUrl || '',
            s.price || 0,
          ],
        )
        .catch(() => null);
    }
    await this.db.saveToStore().catch(() => null);
  }

  /**
   * Persiste en SQLite local las aves del checklist recibidas desde el backend.
   * @param siteId ID del sitio.
   * @param birdIds Lista de IDs de aves asociadas.
   */
  private async persistRemoteSiteBirds(
    siteId: string,
    birdIds: number[],
  ): Promise<void> {
    for (const bId of birdIds) {
      await this.db
        .query(
          'INSERT OR REPLACE INTO site_birds (site_id, bird_id, sql_deleted) VALUES (?, ?, 0)',
          [siteId, bId],
        )
        .catch(() => null);
    }
    await this.db.saveToStore().catch(() => null);
  }
}

