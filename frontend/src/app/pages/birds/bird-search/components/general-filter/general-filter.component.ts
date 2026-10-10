import { Component, inject, OnInit, ChangeDetectorRef, NgZone, signal } from '@angular/core';

import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonLabel,
  IonIcon,
  IonRange,
} from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { BirdSearchStore } from './../../../../../core/stores/bird-search.store';
import { DbHelperService } from './../../../../../core/services/db-helper.service';
import { FormsModule } from '@angular/forms';
import { ITamanio } from './../../../../../core/models/birds.interfaces';
import { logger } from '../../../../../core/utils/logger';

/**
 * @class GeneralFilterComponent
 * @description Gestiona las configuraciones de filtros avanzados unificados (Alturas, Estatus, Dificultad y Tamaños).
 */
@Component({
  selector: 'app-general-filter',
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonLabel,
    IonIcon,
    IonRange,
  ],
  templateUrl: './general-filter.component.html',
  styleUrls: ['./general-filter.component.scss'],
})
export class GeneralFilterComponent implements OnInit {
  /**
   *
   */
  private readonly modalCtrl = inject(ModalController);
  /**
   *
   */
  private readonly searchStore = inject(BirdSearchStore);
  /**
   *
   */
  private readonly db = inject(DbHelperService);
  /**
   *
   */
  private readonly cdr = inject(ChangeDetectorRef);
  /**
   *
   */
  private readonly ngZone = inject(NgZone);

  /**
   *
   */
  selectedStatus = signal<number | null>(null);
  /**
   *
   */
  selectedDifficulty = signal<number | null>(null);
  /**
   *
   */
  selectedSize = signal<number | null>(null);
  /**
   *
   */
  heightRange = signal({ lower: 0, upper: 5000 });

  /**
   *
   */
  conservationStatuses = signal<
    {
      /**
       *
       */
      id: number
      /**
       *
       */;
      convention: string
      /**
       *
       */;
      description: string
      /**
       *
       */;
      image: string;
    }[]
  >([]);

  /**
   *
   */
  difficultyOptions = [
    { id: 1, name: 'Muy Fácil', icon: 'eye' },
    { id: 2, name: 'Fácil', icon: 'eye' },
    { id: 3, name: 'Moderado', icon: 'eye-off' },
    { id: 4, name: 'Muy Difícil', icon: 'eye-off' },
  ];

  /** @property aTamanios Estructura de datos estática inyectada de forma directa sin llamadas a base de datos. */
  public readonly aTamanios: ITamanio[] = [
    {
      id: 1,
      descripcion: 'Muy Pequeño (Hasta 10cm)',
      tamanioMin: 1,
      tamanioMax: 10,
    },
    {
      id: 2,
      descripcion: 'Pequeño (De 11cm a 25cm)',
      tamanioMin: 11,
      tamanioMax: 25,
    },
    {
      id: 3,
      descripcion: 'Mediano (De 26cm a 50cm)',
      tamanioMin: 26,
      tamanioMax: 50,
    },
    {
      id: 4,
      descripcion: 'Grande (De 51cm a 75cm)',
      tamanioMin: 51,
      tamanioMax: 75,
    },
    {
      id: 5,
      descripcion: 'Muy Grande (Más de 75cm)',
      tamanioMin: 76,
      tamanioMax: 999,
    },
  ];

  /**
   * @method ngOnInit
   * @description Sincroniza las referencias locales del Bottom Sheet con los Signals vigentes de la página principal.
   */
  async ngOnInit(): Promise<void> {
    this.selectedStatus.set(this.searchStore.activeFilters().conservation_status_id || null);

    this.selectedDifficulty.set(this.searchStore.activeFilters().viewing_difficulty || null);

    this.selectedSize.set(this.searchStore.activeFilters().size_id || null);

    this.heightRange.set({
      lower: this.searchStore.activeFilters().min_altitude || 0,
      upper: this.searchStore.activeFilters().max_altitude || 5000,
    });

    try {
      const statuses = await this.db.query(
        'SELECT * FROM conservation_statuses WHERE sql_deleted = 0',
      );
      this.conservationStatuses.set(
        statuses as {
          /**
           *
           */
          id: number
          /**
           *
           */;
          convention: string
          /**
           *
           */;
          description: string
          /**
           *
           */;
          image: string;
        }[],
      );
      this.cdr.detectChanges();
    } catch (e) {
      logger.warn('Error cargando estados:', e);
    }
  }

  /**
   * @method getGPSHeight
   * @description Captura las coordenadas de latitud/altitud mediante Capacitor Geolocation forzando la detección en zona.
   */
  async getGPSHeight(): Promise<void> {
    try {
      const position = await Geolocation.getCurrentPosition();
      let altitude = Math.round(position.coords.altitude || 0);

      if (altitude < 0) altitude = 0;
      if (altitude > 5000) altitude = 5000;

      this.ngZone.run(() => {
        this.heightRange.set({
          lower: altitude,
          upper: this.heightRange().upper,
        });
      });
    } catch (e) {
      logger.warn('GPS no disponible:', e);
    }
  }

  /**
   * @method onRangeChange
   * @description Sincroniza los cambios del control ion-range sobre el objeto estructural.
   * @param {any} ev Evento nativo emitido por el slider.
   */
  onRangeChange(ev: CustomEvent): void {
    this.heightRange.set(ev.detail?.value);
  }

  /**
   * @method getSizeTitle
   * @description Extrae de forma segura el adjetivo descriptivo del tamaño eliminando las cotas métricas entre paréntesis.
   * @param {string} desc Cadena descriptiva total de la entidad.
   */
  getSizeTitle(desc: string): string {
    const idx = desc.indexOf(' (');
    return idx !== -1 ? desc.substring(0, idx) : desc;
  }

  /**
   * @method getSizeSubtitle
   * @description Extrae las cotas métricas secundarias encerradas entre paréntesis para utilizarlas como subtítulo de la tarjeta.
   * @param {string} desc Cadena descriptiva total de la entidad.
   */
  getSizeSubtitle(desc: string): string {
    const idx = desc.indexOf(' (');
    return idx !== -1 ? desc.substring(idx + 1) : '';
  }

  /**
   * @method applyFilters
   * @description Empuja inmutablemente las configuraciones finales a los Signals reactivos de la app y destruye el modal.
   */
  applyFilters(): void {
    this.searchStore.updateFilters({
      min_altitude: this.heightRange().lower,
      max_altitude: this.heightRange().upper,
      conservation_status_id: this.selectedStatus() ?? undefined,
      viewing_difficulty: this.selectedDifficulty() ?? undefined,
      size_id: this.selectedSize() ?? undefined,
    });
    this.modalCtrl.dismiss();
  }

  /**
   * @method dismiss
   * @description Destruye el modal actual sin aplicar ninguna mutación de filtros.
   */
  dismiss(): void {
    this.modalCtrl.dismiss();
  }
}
