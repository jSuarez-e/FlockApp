import { Component, inject, OnInit, Input, signal } from '@angular/core';

import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonChip,
  IonLabel,
  IonContent,
  IonIcon,
  IonFooter,
} from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DbHelperService } from '../../../../../core/services/db-helper.service';
import { BirdSearchStore } from '../../../../../core/stores/bird-search.store';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { IBirdSearch } from '../../../../../core/models/birds.interfaces';
import { logger } from '../../../../../core/utils/logger';

/**
 *
 */
export interface ICategoricalChild {
  /**
   *
   */
  id: number;
  /**
   *
   */
  description: string;
  /**
   *
   */
  order_id: number;
  /**
   *
   */
  total_aves?: number;
  /**
   *
   */
  tipos_aves?: string;
}

/**
 *
 */
export interface ICategoricalItem {
  /**
   *
   */
  id: number;
  /**
   *
   */
  description?: string;
  /**
   *
   */
  departments?: string;
  /**
   *
   */
  children?: ICategoricalChild[];
}

/**
 *
 */
export type BirdNumericFilterKey = 'habitat_id' | 'residency_type_id' | 'department_id';

/**
 * @sdd
 * - [Objetivo]: Modal de filtros estructurados por categorías con ordenamiento estricto A-Z.
 * - [I/O - Reusabilidad]: Input `initialTab`.
 * - [Edge Cases - UI]: Maneja múltiples vistas de categorías.
 */
@Component({
  selector: 'app-categorical-filter',
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonChip,
    IonLabel,
    IonContent,
    IonIcon,
    IonFooter,
  ],
  templateUrl: './categorical-filter.component.html',
  styleUrls: ['./categorical-filter.component.scss'],
})
export class CategoricalFilterComponent implements OnInit {
  /**
   *
   */
  private readonly modalCtrl = inject(ModalController);
  /**
   *
   */
  private readonly db = inject(DbHelperService);
  /**
   *
   */
  private readonly searchStore = inject(BirdSearchStore);

  /** Pestaña inicial a cargar en el filtro (compatible con ModalController de Ionic) */
  @Input()
  set initialTab(val: string | undefined) {
    if (val) {
      this.activeTab.set(val);
      this.loadData();
    }
  }

  /**
   *
   */
  public activeTab = signal<string>('orders');
  /**
   *
   */
  public list = signal<ICategoricalItem[]>([]);
  /**
   *
   */
  public selection = signal<Partial<IBirdSearch>>({});

  /**
   * Registra iconos requeridos en el modal de filtros.
   */
  constructor() {
    addIcons({ closeOutline });
  }

  /**
   * Inicializa la selección activa de filtros taxonómicos.
   */
  async ngOnInit(): Promise<void> {
    this.selection.set({ ...this.searchStore.activeFilters() });
    if (this.list().length === 0) {
      await this.loadData();
    }
  }

  /**
   * @method loadData
   * @description Realiza consultas dinámicas inyectando cláusulas ORDER BY automáticas para ordenar las opciones de la A a la Z.
   */
  async loadData(): Promise<void> {
    try {
      if (this.activeTab() === 'orders') {
        const orders = (await this.db.query(
          'SELECT * FROM orders WHERE sql_deleted = 0 ORDER BY description ASC',
        )) as ICategoricalItem[];
        const families = (await this.db.query(
          'SELECT * FROM families WHERE sql_deleted = 0 ORDER BY description ASC',
        )) as ICategoricalChild[];

        this.list.set(
          orders.map((o: ICategoricalItem) => ({
            ...o,
            children: families.filter((f: ICategoricalChild) => f.order_id === o.id),
          })),
        );
      } else {
        const tableMap: Record<string, string> = {
          habitats: 'habitats',
          residency: 'residency_types',
          departments: 'departments',
        };
        const table = tableMap[this.activeTab()];
        if (table) {
          // Determina dinámicamente si el campo descriptor alfabético es 'departments' o 'description'
          const orderField = table === 'departments' ? 'departments' : 'description';
          this.list.set(
            (await this.db.query(
              `SELECT * FROM ${table} WHERE sql_deleted = 0 ORDER BY ${orderField} ASC`,
            )) as ICategoricalItem[],
          );
        }
      }
    } catch (e) {
      logger.error('❌ [CategoricalFilter] Error en carga ordenada de filtros:', e);
    }
  }

  /**
   *
   * @param order
   */
  public selectOrder(order: ICategoricalItem): void {
    this.selection.update((s) => {
      const newOrderId = s.order_id === order.id ? undefined : order.id;
      return {
        ...s,
        order_id: newOrderId,
        family_id: newOrderId === undefined ? undefined : s.family_id,
      };
    });
  }

  /**
   *
   * @param familyId
   */
  public selectFamily(familyId: number): void {
    this.selection.update((s) => ({
      ...s,
      family_id: s.family_id === familyId ? undefined : familyId,
    }));
  }

  /**
   *
   * @param item
   */
  public selectGeneric(item: ICategoricalItem): void {
    const keyMap: Record<string, BirdNumericFilterKey> = {
      habitats: 'habitat_id',
      residency: 'residency_type_id',
      departments: 'department_id',
    };
    const key = keyMap[this.activeTab()];
    if (key) {
      this.selection.update((s) => ({
        ...s,
        [key]: s[key] === item.id ? undefined : item.id,
      }));
    }
  }

  /**
   *
   * @param item
   */
  public isSelected(item: ICategoricalItem): boolean {
    const currentSelection = this.selection();
    if (this.activeTab() === 'orders') {
      return currentSelection.family_id === item.id;
    }
    const keyMap: Record<string, BirdNumericFilterKey> = {
      habitats: 'habitat_id',
      residency: 'residency_type_id',
      departments: 'department_id',
    };
    const key = keyMap[this.activeTab()];
    return key ? currentSelection[key] === item.id : false;
  }

  /**
   *
   */
  public apply(): void {
    // Para replicar el .set() anterior, actualizamos todos los filtros
    this.searchStore.updateFilters({ ...this.selection() });
    this.modalCtrl.dismiss();
  }

  /**
   *
   */
  public dismiss(): void {
    this.modalCtrl.dismiss();
  }
}
