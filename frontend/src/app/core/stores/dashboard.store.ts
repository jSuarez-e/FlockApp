/**
 * @sdd
 * - [Objetivo]: Store para la gestión reactiva de la vista del Dashboard y Layout (Selector, Pajarero, Proveedor).
 * - [I/O]: Expone Signals y métodos para cambiar la vista actual.
 */
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { ViewMode, UserRole } from '../models/auth.models';

/**
 * Elemento documentado.
 */
export interface DashboardState {
  /**
   * Elemento documentado.
   */
  activeViewMode: ViewMode;
}

const initialState: DashboardState = {
  activeViewMode: null,
};

export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    currentView: computed(() => store.activeViewMode()),
  })),
  withMethods((store) => ({
    /**
     * Elemento documentado.
     * @param role
     */
    initializeFromRole(role: UserRole): void {
      if (role === UserRole.PAJARERO) {
        patchState(store, { activeViewMode: 'PAJARERO' });
      } else if (role === UserRole.PROVEEDOR) {
        patchState(store, { activeViewMode: 'PROVEEDOR' });
      } else if (role === UserRole.BOTH) {
        patchState(store, { activeViewMode: null });
      }
    },
    /**
     * Elemento documentado.
     * @param mode
     */
    setMode(mode: ViewMode): void {
      patchState(store, { activeViewMode: mode });
    },
    /**
     * Elemento documentado.
     */
    resetDashboard(): void {
      patchState(store, { activeViewMode: null });
    },
  })),
);
