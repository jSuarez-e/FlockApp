import { Component, OnInit, ChangeDetectionStrategy, signal, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  ModalController,
  IonBadge,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, trophy, lockClosed } from 'ionicons/icons';
import { ProfileStore } from '../../../../core/stores/profile.store';
import { UserMedalDto } from '../../../../core/models/auth.models';
import { logger } from '../../../../core/utils/logger';

/**
 * @sdd
 * - [Objetivo]: Modal interactivo que muestra las medallas ganadas y bloqueadas del usuario con estética Premium.
 * - [I/O - Reusabilidad]: Exporta UserMedalDto, se inyecta por el ModalController. Utiliza environment.apiUrl.
 * - [Edge Cases - UI]: Modificador dinámico de clases (tier-bronze, silver, gold, diamond) y diseño adaptable.
 */
@Component({
  selector: 'app-user-medals',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonBadge,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-medals.component.html',
  styleUrls: ['./user-medals.component.scss'],
})
export class UserMedalsComponent implements OnInit {
  /**
   *
   */
  private readonly modalCtrl = inject(ModalController);
  /**
   *
   */
  private readonly profileStore = inject(ProfileStore);

  /** @description Lista opcional de medallas inyectada vía componentProps */
  @Input() medalsList?: UserMedalDto[];
  /** @description Título personalizable del modal */
  @Input() title: string = 'Tus Medallas';

  /** @description Lista reactiva de medallas cargadas */
  public medals = signal<UserMedalDto[]>([]);
  /** @description Contador de medallas desbloqueadas por el usuario */
  public earnedCount = signal<number>(0);

  /**
   * Registra los iconos requeridos para el modal de medallas.
   */
  constructor() {
    addIcons({
      closeOutline,
      trophy,
      lockClosed,
    });
  }

  /**
   * Lifecycle hook que inicializa la carga de medallas.
   */
  ngOnInit() {
    this.loadMedals();
  }

  /**
   * Ejecuta el fetch HTTP para obtener las medallas desde el backend de forma segura a través del store o prop inyectada.
   */
  private async loadMedals() {
    try {
      if (this.medalsList && this.medalsList.length > 0) {
        this.medals.set(this.medalsList);
        this.earnedCount.set(this.medalsList.filter((m) => m.earned).length);
        return;
      }
      const res = await this.profileStore.loadMedals();
      this.medals.set(res);
      this.earnedCount.set(res.filter((m) => m.earned).length);
    } catch (err) {
      logger.error('Error loading medals', err);
    }
  }

  /**
   * Cierra el modal actual de medallas.
   */
  close() {
    this.modalCtrl.dismiss();
  }

  /**
   * Maneja errores de carga en las imágenes personalizadas ocultando la etiqueta y activando el icono fallback.
   * @param {Event} event Evento nativo de error de imagen
   */
  handleImageError(event: Event) {
    // Si la imagen no se encuentra, ocultamos la img para mostrar el icono (handled by CSS o estructuralmente)
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
    imgElement.parentElement?.classList.add('fallback-icon-active');
  }

  /**
   * Calcula el nivel visual (Tier) de la medalla basándose en el valor requerido extraído de la descripción.
   * @param {UserMedalDto} medal Instancia de la medalla a evaluar
   * @returns {string} Clase CSS correspondiente al Tier (bronze, silver, gold, diamond) o locked-wrapper.
   */
  getMedalClass(medal: UserMedalDto): string {
    if (!medal.earned) return 'locked-wrapper';
    const val = parseInt(medal.description?.replace(/[^0-9]/g, '') ?? '0'); // fix: description is optional
    if (val >= 500) return 'tier-diamond';
    if (val >= 100) return 'tier-gold';
    if (val >= 20) return 'tier-silver';
    return 'tier-bronze';
  }
}
