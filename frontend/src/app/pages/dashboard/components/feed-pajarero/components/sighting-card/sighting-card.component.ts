import { Component, input, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  IonItem,
  IonAvatar,
  IonLabel,
  IonIcon,
  IonButton,
  IonCard,
  IonCardContent,
  ActionSheetController,
  ModalController,
} from '@ionic/angular';
import { Share } from '@capacitor/share';
import { FeedPost } from '../../../../../../../../../shared/models/feed.model';
import { FeedStore } from '../../../../../../core/stores/feed.store';
import { AuthService } from '../../../../../../core/services/auth.service';
import { environment } from '../../../../../../../environments/environment';

/**
 * @sdd
 * - [Objetivo]: Tarjeta visual para un post del feed.
 * - [I/O]: Recibe un FeedPost.
 * - [Edge Cases]: Renderizado perezoso de imagen si existe la url.
 */
import {
  helpBuoyOutline,
  locationOutline,
  heartOutline,
  heart,
  chatbubbleOutline,
  shareOutline,
  logoWhatsapp,
  logoInstagram,
  mapOutline,
} from 'ionicons/icons';
import { PostRepliesComponent } from '../post-replies/post-replies.component';
import { PublicProfilePage } from '../../../../../profile/public-profile/public-profile.page';

/**
 *
 */
@Component({
  selector: 'app-sighting-card',
  standalone: true,
  imports: [
    CommonModule,
    IonItem,
    IonAvatar,
    IonLabel,
    IonIcon,
    IonButton,
    IonCard,
    IonCardContent,
    DatePipe,
  ],
  templateUrl: './sighting-card.component.html',
  styleUrls: ['./sighting-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SightingCardComponent {
  /**
   *
   */
  post = input.required<FeedPost>();

  /**
   *
   */
  readonly icons = {
    helpBuoyOutline,
    locationOutline,
    heartOutline,
    heart,
    chatbubbleOutline,
    shareOutline,
    logoWhatsapp,
    logoInstagram,
    mapOutline,
  };

  /**
   *
   */
  private sanitizer = inject(DomSanitizer);
  /**
   *
   */
  private actionSheetCtrl = inject(ActionSheetController);
  /**
   *
   */
  private modalCtrl = inject(ModalController);
  /**
   *
   */
  private router = inject(Router);

  /**
   *
   */
  private feedStore = inject(FeedStore);

  /**
   * Servicio de autenticación para sincronizar identidad del autor con sesión activa.
   */
  private authService = inject(AuthService);

  /**
   * Resuelve reactivamente la URL óptima del avatar del autor.
   * Si la publicación pertenece al usuario activo, prioriza su avatar cargado recientemente.
   */
  readonly authorAvatarUrl = computed<string>(() => {
    const post = this.post();
    const currentUser = this.authService.currentUser();
    // Prioridad 1: Si es el usuario logueado y tiene avatar en sesión, usarlo
    if (currentUser && String(post.authorId) === String(currentUser.id) && currentUser.avatarUrl) {
      return this.resolveUrl(currentUser.avatarUrl) || this.defaultAvatarUrl();
    }
    // Prioridad 2: Si el post contiene avatar persistido
    if (post.authorAvatarUrl) {
      return this.resolveUrl(post.authorAvatarUrl) || this.defaultAvatarUrl();
    }
    // Fallback: Avatar generativo institucional
    return this.defaultAvatarUrl();
  });

  /**
   * Genera la URL del avatar por defecto con la paleta de marca FlockApp.
   */
  readonly defaultAvatarUrl = computed<string>(() => {
    const name = this.post().authorName || 'Pajarero';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=108346&color=fff&bold=true`;
  });

  // Estado local temporal para los Favoritos (hasta que el backend exponga este field por post)
  /**
   *
   */
  isSavedByMe = signal<boolean>(false);

  // Usamos la cantidad real que viene del store (el store hace update optimista)
  /**
   * Retorna el número de guardados del post actual desde el store.
   * @returns Número de saves del post.
  */
  get savesCount() {
    return this.post().savesCount;
  }

  /**
   * Resuelve la URL absoluta para recursos multimedia del post.
   * @param url Ruta relativa o remota del recurso.
   * @returns URL formateada o null si no se especificó.
   */
  resolveUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${environment.urlBack}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  /**
   * Oculta el contenedor en caso de fallo al cargar la imagen principal del post.
   * @param event Evento nativo de error.
   */
  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }

  /**
   * Gestiona el fallback en caso de error de carga del avatar del autor.
   * @param event Evento nativo de error.
   */
  handleAvatarError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultAvatarUrl();
  }

  /**
   * Genera el enlace de navegación para Google Maps.
   * @param location Coordenadas geográficas.
   * @returns URL de Google Maps para búsqueda del punto.
   */
  getGoogleMapsLink(location: NonNullable<FeedPost['location']>): string {
    return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
  }

  /**
   * Genera el iframe sanitizado de OpenStreetMap para previsualización cartográfica.
   * @param location Coordenadas del avistamiento.
   * @returns Recurso seguro para incrustar en el iframe.
   */
  getMapIframeUrl(location: NonNullable<FeedPost['location']>): SafeResourceUrl {
    const margin = 0.005; // Zoom aprox a nivel de ciudad/barrio
    const bbox = `${location.lng - margin},${location.lat - margin},${location.lng + margin},${location.lat + margin}`;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${location.lat},${location.lng}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * Alterna el estado de favorito del post y notifica al store.
   */
  toggleFavorite() {
    this.isSavedByMe.update((v) => !v);
    this.feedStore.toggleFavorite(this.post().id);
  }

  /**
   * Abre el perfil del autor según el modo de publicación:
   * - 'PAJARERO': Presenta el perfil público en la modal ya implementada (PublicProfilePage)
   * - 'SITIO': Navega al Perfil de Sitio de Aviturismo (/home/sites/:siteId)
   * - 'GUIA': Navega al Perfil de Guía Profesional (/home/guides/:guideId)
   * @param event Evento del DOM opcional para detener propagación.
   * @returns Promesa resuelta tras procesar la acción.
   */
  async viewAuthorProfile(event?: Event): Promise<void> {
    if (event) {
      event.stopPropagation();
    }
    const currentPost = this.post();
    const authorType = currentPost.authorType || 'PAJARERO';
    const profileId = currentPost.targetProfileId || currentPost.authorId;

    if (!profileId) return;

    switch (authorType) {
      case 'SITIO':
        this.router.navigate(['/home/sites', profileId]);
        break;
      case 'GUIA':
        this.router.navigate(['/home/guides', profileId]);
        break;
      case 'PAJARERO':
      default:
        await this.openAuthorProfileModal(profileId);
        break;
    }
  }

  /**
   * Abre la modal del perfil público del pajarero.
   * @param userId Identificador del usuario.
   * @returns Promesa que culmina con la presentación de la modal.
   */
  private async openAuthorProfileModal(userId: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: PublicProfilePage,
      componentProps: {
        userId,
      },
      initialBreakpoint: 0.9,
      breakpoints: [0, 0.9, 1],
      handle: true,
    });
    await modal.present();
  }

  /**
   * Navega a la vista de resumen de ruta
   * @param routeId
   */
  viewRoute(routeId: string) {
    this.router.navigate(['/home/route-workspace'], { queryParams: { id: routeId, readonly: true } });
  }

  /**
   * Abre el modal de respuestas del avistamiento.
   */
  async openReplies() {
    const modal = await this.modalCtrl.create({
      component: PostRepliesComponent,
      componentProps: {
        post: this.post(),
      },
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8, 1],
      handle: true,
    });
    await modal.present();
  }

  /**
   * Muestra el action sheet de opciones para compartir el post.
   */
  async sharePost() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Compartir publicación',
      buttons: [
        {
          text: 'Compartir genérico (Redes, Chat...)',
          icon: this.icons.shareOutline,
          /**
           *
           */
          handler: async () => {
            await Share.share({
              title: `Avistamiento de ${this.post().authorName}`,
              text: `${this.post().title}: ${this.post().description.substring(0, 50)}...`,
              url: `https://flockapp.co/post/${this.post().id}`,
              dialogTitle: 'Compartir este avistamiento',
            });
          },
        },
        {
          text: 'WhatsApp (Directo)',
          icon: this.icons.logoWhatsapp,
          /**
           *
           */
          handler: () => {
            const text = encodeURIComponent(
              `¡Mira este avistamiento en FlockApp!\n${this.post().title}\nhttps://flockapp.co/post/${this.post().id}`,
            );
            window.open(`https://wa.me/?text=${text}`, '_blank');
          },
        },
        {
          text: 'Instagram (Requiere App)',
          icon: this.icons.logoInstagram,
          /**
           *
           */
          handler: async () => {
            // Instagram no tiene URL scheme genérico directo para compartir texto como WP
            // Fallback al share nativo
            await Share.share({
              text: `Mira este avistamiento en FlockApp: https://flockapp.co/post/${this.post().id}`,
            });
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }
}
