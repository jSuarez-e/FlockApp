/**
 * @sdd
 * @description Guide Store using NgRx SignalStore (Offline First).
 * @io Injects DbHelperService to load guides from SQLite into a fast dictionary format O(1).
 */
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { IGuide } from '../../../../../shared/models/catalogs.interface';
import { GuideService } from '../services/guide.service';
import { firstValueFrom } from 'rxjs';
import { logger } from '../utils/logger';

/**
 *
 */
export interface GuideState {
  /**
   *
   */
  guidesMap: Record<string, IGuide>;
  /**
   *
   */
  isLoading: boolean;
}

const initialState: GuideState = {
  guidesMap: {},
  isLoading: false,
};

export const GuideStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    allGuides: computed(() =>
      Object.values(store.guidesMap()).sort((a, b) => a.fullName.localeCompare(b.fullName)),
    ),
  })),
  withMethods((store, guideService = inject(GuideService)) => ({
    /**
     * Carga el catálogo completo de guías desde el backend.
     */
    async loadGuides() {
      patchState(store, { isLoading: true });
      try {
        const result = await firstValueFrom(guideService.getGuides());
        const map: Record<string, IGuide> = {};
        if (result) {
          for (const item of result) {
            map[item.id] = item;
          }
        }
        patchState(store, { guidesMap: map, isLoading: false });
      } catch (e) {
        logger.error('Error cargando guías online:', e);
        patchState(store, { isLoading: false });
      }
    },
    /**
     * Obtiene un guía específico por su identificador.
     * @param id ID del guía a buscar.
     * @returns Guía encontrado o undefined si no existe.
     */
    getGuideById(id: string): IGuide | undefined {
      return store.guidesMap()[id];
    },
  })),
);
