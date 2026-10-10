/**
 * @sdd
 * @description Global State Management for Bird Search using NgRx SignalStore.
 * @io Injects NetworkService and DbHelperService. Exposes activeFilters, filteredBirdsList, flatList, totalFound, and methods to update filters.
 * @edge_cases Handles SQLite initialization delay and complex multi-parameter filtering efficiently.
 */
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { IBirdSearch } from '../models/birds.interfaces';
import { DbHelperService } from '../services/db-helper.service';
import { logger } from '../utils/logger';

/**
 * Elemento documentado.
 */
export interface FilterLabel {
  /**
   * Elemento documentado.
   */
  key: keyof IBirdSearch | 'altitude';
  /**
   * Elemento documentado.
   */
  label: string;
}

/**
 * Elemento documentado.
 */
export type ListItem =
  /**
   * Elemento documentado.
   */
  /**
   * Elemento documentado.
   */
  | { /**
   *
   */
  type: 'HEADER'; /**
   *
   */
  label: string }
  /**
   * Elemento documentado.
   */
  /**
   * Elemento documentado.
   */
  | { /**
   *
   */
  type: 'BIRD'; /**
   *
   */
  data: IBirdSearch };

/**
 * Elemento documentado.
 */
interface BirdSearchState {
  /**
   * Elemento documentado.
   */
  birds: IBirdSearch[];
  /**
   * Elemento documentado.
   */
  isLoading: boolean;
  /**
   * Elemento documentado.
   */
  activeFilters: Partial<IBirdSearch>;
}

const initialState: BirdSearchState = {
  birds: [],
  isLoading: false,
  activeFilters: {
    min_altitude: 0,
    max_altitude: 5000,
  },
};

export const BirdSearchStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    activeFilterLabels: computed<FilterLabel[]>(() => {
      const f = store.activeFilters();
      const labels: FilterLabel[] = [];

      if (f.scientific_name) labels.push({ key: 'scientific_name', label: f.scientific_name });

      if ((f.min_altitude ?? 0) > 0 || (f.max_altitude ?? 5000) < 5000) {
        labels.push({
          key: 'altitude',
          label: `${f.min_altitude}-${f.max_altitude}m`,
        });
      }

      if (f.conservation_status_id)
        labels.push({ key: 'conservation_status_id', label: 'Estatus Cons.' });

      if (f.viewing_difficulty)
        labels.push({
          key: 'viewing_difficulty',
          label: `Dificultad ${f.viewing_difficulty}`,
        });

      if (f.family_id) labels.push({ key: 'family_id', label: 'Filtro: Familia' });

      if (f.habitat_id) labels.push({ key: 'habitat_id', label: 'Filtro: Hábitat' });

      if (f.residency_type_id) {
        labels.push({ key: 'residency_type_id', label: 'Filtro: Residencia' });
      }

      if (f.department_id) labels.push({ key: 'department_id', label: 'Filtro: Dpto.' });

      if (f.size_id) {
        const sizeLabels: Record<number, string> = {
          1: 'Muy Pequeño',
          2: 'Pequeño',
          3: 'Mediano',
          4: 'Grande',
          5: 'Muy Grande',
        };
        labels.push({
          key: 'size_id' as keyof IBirdSearch,
          label: `Tamaño: ${sizeLabels[f.size_id] || 'Filtro'}`,
        });
      }

      return labels;
    }),

    filteredBirdsList: computed<IBirdSearch[]>(() => {
      const data = store.birds();
      const f = store.activeFilters();

      return data.filter((bird: IBirdSearch) => {
        const search = (f.scientific_name || f.common_name)?.toLowerCase() || '';
        const matchesSearch =
          !search ||
          bird.scientific_name.toLowerCase().includes(search) ||
          bird.common_name?.toLowerCase().includes(search);

        const matchesAlt =
          bird.min_altitude >= (f.min_altitude ?? 0) &&
          bird.max_altitude <= (f.max_altitude ?? 5000);
        const matchesStatus =
          f.conservation_status_id === undefined ||
          bird.conservation_status_id === f.conservation_status_id;
        const matchesDifficulty =
          f.viewing_difficulty === undefined || bird.viewing_difficulty === f.viewing_difficulty;
        const matchesHabitat = f.habitat_id === undefined || bird.habitat_id === f.habitat_id;
        const matchesResidency =
          f.residency_type_id === undefined || bird.residency_type_id === f.residency_type_id;
        const matchesFamily = f.family_id === undefined || bird.family_id === f.family_id;
        const matchesOrder = f.order_id === undefined || bird.order_id === f.order_id;

        const matchesDept =
          f.department_id === undefined ||
          (() => {
            if (!bird.department_ids) return false;
            return bird.department_ids
              .split(',')
              .map((id: string) => parseInt(id, 10))
              .includes(f.department_id);
          })();

        const matchesSize =
          f.size_id === undefined ||
          (() => {
            const sizes = [
              { id: 1, min: 1, max: 10 },
              { id: 2, min: 11, max: 25 },
              { id: 3, min: 26, max: 50 },
              { id: 4, min: 51, max: 75 },
              { id: 5, min: 76, max: 999 },
            ];
            const current = sizes.find((s) => s.id === f.size_id);
            if (!current) return true;
            const bSize = bird.size ?? 0;
            return bSize >= current.min && bSize <= current.max;
          })();

        return (
          matchesSearch &&
          matchesAlt &&
          matchesStatus &&
          matchesDifficulty &&
          matchesHabitat &&
          matchesResidency &&
          matchesDept &&
          matchesFamily &&
          matchesOrder &&
          matchesSize
        );
      });
    }),
  })),
  withComputed((store) => ({
    totalFound: computed<number>(() => store.filteredBirdsList().length),
    flatList: computed<ListItem[]>(() => {
      const list = store.filteredBirdsList();
      const groups: Record<string, IBirdSearch[]> = {};

      list.forEach((bird: IBirdSearch) => {
        const groupName = bird.family_description || 'OTRAS FAMILIAS';
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(bird);
      });

      const flat: ListItem[] = [];
      Object.keys(groups)
        .sort()
        .forEach((group: string) => {
          flat.push({ type: 'HEADER', label: group.toUpperCase() });
          groups[group].forEach((bird: IBirdSearch) => flat.push({ type: 'BIRD', data: bird }));
        });
      return flat;
    }),
  })),
  withMethods((store, db = inject(DbHelperService)) => ({
    /**
     * Elemento documentado.
     * @param partialFilters
     */
    updateFilters(partialFilters: Partial<IBirdSearch>) {
      patchState(store, (state) => ({
        activeFilters: { ...state.activeFilters, ...partialFilters },
      }));
    },

    /**
     * Elemento documentado.
     */
    clearFilters() {
      patchState(store, {
        activeFilters: { min_altitude: 0, max_altitude: 5000 },
      });
    },

    /**
     * Elemento documentado.
     * @param key
     */
    removeFilter(key: string) {
      patchState(store, (state) => {
        const update = { ...state.activeFilters };
        if (key === 'altitude') {
          update.min_altitude = 0;
          update.max_altitude = 5000;
        } else {
          delete (update as Record<string, unknown>)[key];
        }
        return { activeFilters: update };
      });
    },

    /**
     * Elemento documentado.
     */
    async loadFromLocal(): Promise<void> {
      const query = `
        SELECT b.*,
               f.description as family_description,
               f.order_id,
               o.description as order_name,
               h.description as habitat_description,
               ft.description as feeding_description,
               cs.convention as conservation_convention,
               cs.description as conservation_status_description,
               rt.description as residency_description,
               bm.description as beak_morphology_description,
               wm.description as wing_morphology_description,
               tm.description as tail_morphology_description,
               lm.description as leg_morphology_description,
               (SELECT GROUP_CONCAT(department_id) FROM bird_departments WHERE bird_id = b.id AND sql_deleted = 0) as department_ids
        FROM birds b
        LEFT JOIN families f ON b.family_id = f.id
        LEFT JOIN orders o ON f.order_id = o.id
        LEFT JOIN habitats h ON b.habitat_id = h.id
        LEFT JOIN feeding_types ft ON b.feeding_type_id = ft.id
        LEFT JOIN conservation_statuses cs ON b.conservation_status_id = cs.id
        LEFT JOIN residency_types rt ON b.residency_type_id = rt.id
        LEFT JOIN beak_morphology bm ON b.beak_morphology_id = bm.id
        LEFT JOIN wing_morphology wm ON b.wing_morphology_id = wm.id
        LEFT JOIN tail_morphology tm ON b.tail_morphology_id = tm.id
        LEFT JOIN leg_morphology lm ON b.leg_morphology_id = lm.id
        WHERE b.sql_deleted = 0
        ORDER BY f.description ASC, b.scientific_name ASC
      `;
      try {
        const local = await db.query(query);
        if (local) {
          patchState(store, { birds: local as unknown as IBirdSearch[] });
        }
      } catch (error) {
        logger.error('❌ [BirdSearchStore] Error SQL en carga de catálogo:', error);
      }
    },

    /**
     * Elemento documentado.
     */
    async loadCatalog(): Promise<void> {
      if (!db.getSeedingStatus()) {
        setTimeout(() => this.loadCatalog(), 500);
        return;
      }
      patchState(store, { isLoading: true });
      await this.loadFromLocal();
      patchState(store, { isLoading: false });
    },
  })),
);
