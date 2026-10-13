import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonChip,
  IonIcon,
  IonLabel,
  IonButton,
  IonMenuButton,
  IonSearchbar,
  IonContent,
} from '@ionic/angular';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { BirdSearchStore, ListItem } from './../../../core/stores/bird-search.store';
import { NetworkService } from './../../../core/services/network.service';
import { GeneralFilterComponent } from './components/general-filter/general-filter.component';
import { CategoricalFilterComponent } from './components/categorical-filter/categorical-filter.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BirdCardComponent } from './components/bird-card/bird-card.component';
import { IBirdSearch } from './../../../core/models/birds.interfaces';
import { BirdEncyclopediaViewComponent } from '../components/bird-encyclopedia-view/bird-encyclopedia-view.component';

/**
 * @class BirdSearchPage
 * @description Controlador de la página principal de búsqueda de aves.
 * Gestiona filtros modales, búsquedas indexadas y un viewport virtual con sticky headers optimizados.
 */
@Component({
  selector: 'app-bird-search',
  templateUrl: './bird-search.page.html',
  styleUrls: ['./bird-search.page.scss'],
  standalone: true,
  imports: [
    ScrollingModule,
    BirdCardComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonChip,
    IonIcon,
    IonLabel,
    IonButton,
    IonMenuButton,
    IonSearchbar,
    IonContent,
    LoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirdSearchPage {
  /**
   *
   */
  public readonly searchStore = inject(BirdSearchStore);
  /**
   *
   */
  public readonly network = inject(NetworkService);
  /**
   *
   */
  private readonly modalCtrl = inject(ModalController);
  /**
   *
   */
  private readonly cdr = inject(ChangeDetectorRef);

  /** @property {string} currentHeader - Almacena la etiqueta de la familia taxonómica actualmente visible en el top del scroll. */
  public currentHeader: string = '';

  /**
   * @method ionViewDidEnter
   * @description Hook de ciclo de vida de Ionic encargado de inicializar el catálogo de aves de forma perezosa si la lista está vacía.
   */
  ionViewDidEnter(): void {
    if (this.searchStore.totalFound() === 0) {
      this.searchStore.loadCatalog();
    }
  }

  /**
   * @method onSearch
   * @description Modifica reactivamente los filtros de búsqueda por coincidencia textual en nombres comunes o científicos.
   * @param {any} event - Evento emitido por el componente ion-searchbar.
   */
  onSearch(event: CustomEvent): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchStore.updateFilters({ scientific_name: query });
    this.currentHeader = '';
  }

  /**
   * @method removeFilter
   * @description Remueve selectivamente un criterio de filtrado activo desde los chips de control de la cabecera.
   * @param {string} key - Propiedad clave del filtro a remover en la interfaz de usuario.
   */
  removeFilter(key: string): void {
    this.searchStore.removeFilter(key);
    this.currentHeader = '';
  }

  /**
   * @method onScrollIndexChange
   * @description Rastrea de forma reactiva el índice de scroll virtual superior para calcular y fijar la familia taxonómica flotante (Sticky Header).
   * @param {number} index - Índice del primer elemento visible dentro del Viewport actual.
   */
  onScrollIndexChange(index: number): void {
    const list: ListItem[] = this.searchStore.flatList();
    if (!list || list.length === 0) {
      this.currentHeader = '';
      this.cdr.markForCheck();
      return;
    }

    for (let i = index; i >= 0; i--) {
      const item = list[i];
      if (item && item.type === 'HEADER') {
        if (this.currentHeader !== item.label) {
          this.currentHeader = item.label;
          this.cdr.markForCheck();
        }
        return;
      }
    }

    const firstHeader = list.find((item) => item.type === 'HEADER');
    this.currentHeader = firstHeader ? (firstHeader as { label: string }).label : '';
    this.cdr.markForCheck();
  }

  /**
   * @method openGeneralFilter
   * @description Despliega el modal de filtros generales avanzados con soporte nativo de breakpoints de tipo Bottom Sheet.
   */
  async openGeneralFilter(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: GeneralFilterComponent,
      handle: true,
    });
    return await modal.present();
  }

  /**
   * @method openModal
   * @description Abre el modal categórico pasando el parámetro initialTab mapeado de forma consistente con las tablas y segmentos.
   * @param {string} tab - Identificador visual de la pestaña seleccionada por el usuario en el listado horizontal.
   */
  async openModal(tab: string): Promise<void> {
    const tabMap: Record<string, string> = {
      family: 'orders',
      habitat: 'habitats',
      residency: 'residency',
      size: 'sizes',
      departments: 'departments',
    };
    const modal = await this.modalCtrl.create({
      component: CategoricalFilterComponent,
      componentProps: { initialTab: tabMap[tab] || 'orders' },
    });
    return await modal.present();
  }

  /**
   * @method openBirdDetail
   * @description Redirecciona la experiencia del usuario hacia la ficha técnica extendida del espécimen seleccionado.
   * @param {IBirdSearch} bird - Estructura de datos del ave seleccionada.
   */
  async openBirdDetail(bird: IBirdSearch): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: BirdEncyclopediaViewComponent,
      componentProps: { bird },
    });
    await modal.present();
  }

  /**
   * @param index
   * @param item
   * @method trackByItem
   * @description Optimizador algorítmico del rendimiento de renderizado en el DOM de Angular para colecciones polimórficas complejas.
   */
  trackByItem(index: number, item: ListItem): string | number {
    return item.type === 'HEADER' ? item.label : item.data.id;
  }
}
