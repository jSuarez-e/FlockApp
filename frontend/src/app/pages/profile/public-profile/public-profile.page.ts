/**
 * @sdd
 * - [Objetivo]: Vista de perfil público de usuario/pajarero en Modo Información (presentación idéntica a Sitios de Aviturismo).
 * - [I/O]: Consulta UserService.getProfileById() a partir del parámetro de ruta ":id". Expone datos reactivos mediante Signals.
 * - [Edge Cases]: Gestión de perfiles sin foto de portada (fallback visual elegante), avatares nulos, sin bio y estados de error/carga.
 */
import {
  Component,
  OnInit,
  Input,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
  IonChip,
  IonLabel,
  IonSpinner,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  star,
  logoInstagram,
  mailOutline,
  pawOutline,
  eyeOutline,
  trophyOutline,
  calendarOutline,
  shieldCheckmarkOutline,
  personOutline,
  ribbonOutline,
  binocularsOutline,
  businessOutline,
  closeOutline,
} from 'ionicons/icons';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/auth.models';
import { UserMedalsComponent } from '../components/user-medals/user-medals.component';
import { logger } from '../../../core/utils/logger';

/**
 * Componente de presentación de perfil público de usuarios en modo información.
 */
@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonIcon,
    IonButton,
    IonChip,
    IonLabel,
    IonSpinner,
  ],
  templateUrl: './public-profile.page.html',
  styleUrls: ['./public-profile.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicProfilePage implements OnInit {
  /** Inyección del servicio de usuarios */
  private readonly userService = inject(UserService);
  /** Inyección de parámetros de ruta activa */
  private readonly route = inject(ActivatedRoute);
  /** Router para redirecciones */
  private readonly router = inject(Router);
  /** Controlador de modales de Ionic */
  private readonly modalCtrl = inject(ModalController);

  /** ID del usuario cuando se invoca como modal */
  @Input() userId?: string;

  /** Estado reactivo del usuario consultado */
  public readonly user = signal<User | null>(null);
  /** Estado de carga asíncrona */
  public readonly isLoading = signal<boolean>(true);
  /** Mensaje de error en caso de fallo */
  public readonly errorMessage = signal<string | null>(null);

  /** URL base para resolución de multimedia */
  private readonly baseUrl = 'http://localhost:3000';

  /**
   * Registra los íconos del ecosistema visual de perfiles.
   */
  constructor() {
    addIcons({
      locationOutline,
      star,
      logoInstagram,
      mailOutline,
      pawOutline,
      eyeOutline,
      trophyOutline,
      calendarOutline,
      shieldCheckmarkOutline,
      personOutline,
      ribbonOutline,
      binocularsOutline,
      businessOutline,
      closeOutline,
    });
  }

  /**
   * Inicialización del ciclo de vida del componente.
   */
  ngOnInit(): void {
    const targetId = this.userId || this.route.snapshot.paramMap.get('id');
    if (targetId) {
      this.loadUserProfile(targetId);
    } else {
      this.errorMessage.set('Identificador de usuario no especificado');
      this.isLoading.set(false);
    }
  }

  /**
   * Cierra el modal de perfil o retrocede en la navegación.
   */
  public closeModal(): void {
    this.modalCtrl.dismiss().catch(() => {
      this.router.navigate(['/home/dashboard']);
    });
  }

  /**
   * Carga el perfil público mediante el identificador provisto.
   * @param id Identificador UUID del usuario.
   */
  public async loadUserProfile(id: string): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const data = await this.userService.getProfileById(id);
      this.user.set(data);
    } catch (err) {
      logger.error('Error al cargar perfil público de usuario', err);
      this.errorMessage.set('No se pudo encontrar la información del usuario.');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Resuelve URLs absolutas para avatares y portadas.
   * @param path Ruta relativa o URL completa.
   * @returns URL normalizada para consumo de imagen.
   */
  public getImageUrl(path?: string | null): string {
    if (!path) return '';
    return path.startsWith('http') ? path : `${this.baseUrl}${path}`;
  }

  /**
   * Manejador de error para carga de imágenes en fallback.
   * @param event Evento emitido por elemento img.
   */
  public onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'https://ui-avatars.com/api/?name=Pajarero&background=4C6793&color=fff';
    }
  }

  /**
   * Construye el enlace directo al perfil de Instagram.
   * @param handle Usuario o enlace completo de Instagram.
   * @returns URL absoluta de Instagram.
   */
  public getInstagramUrl(handle?: string): string {
    if (!handle) return '#';
    if (handle.startsWith('http')) return handle;
    const cleanHandle = handle.replace('@', '').trim();
    return `https://instagram.com/${cleanHandle}`;
  }

  /**
   * Retorna enlace para envío de correo electrónico.
   * @param email Correo electrónico.
   * @returns URI con esquema mailto.
   */
  public getEmailUrl(email?: string): string {
    return email ? `mailto:${email}` : '#';
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
   * Abre el modal interactivo con el catálogo y estado de medallas del usuario.
   */
  public async openMedalsModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: UserMedalsComponent,
      componentProps: {
        medalsList: this.user()?.medals,
        title: 'Medallas del Usuario',
      },
      breakpoints: [0, 0.7, 1],
      initialBreakpoint: 1,
    });
    await modal.present();
  }
}
