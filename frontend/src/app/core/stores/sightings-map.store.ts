/**
 * @sdd
 * - [Objetivo]: Store para manejar la búsqueda de avistamientos en el mapa.
 * - [I/O]: Expone los avistamientos (sightings) y métodos para buscar usando SightingsService.
 * - [Edge Cases]: Carga asíncrona de datos desde backend o mock en caso de error.
 */
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { SightingsService } from '../services/sightings.service';
import { ISightingMapMarker } from '../../pages/birds/sightings-map/sightings-map.page';
import { UiService } from '../services/ui.service';
import { logger } from '../utils/logger';

/**
 *
 */
interface SightingsMapState {
  /**
   *
   */
  sightings: ISightingMapMarker[];
  /**
   *
   */
  isLoading: boolean;
}

const initialState: SightingsMapState = {
  sightings: [],
  isLoading: false,
};

export const SightingsMapStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (store, sightingsService = inject(SightingsService), uiService = inject(UiService)) => ({
      searchSightings: rxMethod<{ /**
       *
       */
      birdId: string; /**
       *
       */
      department: string | number; /**
       *
       */
      birdName: string }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(({ birdId, department, birdName }) => {
            return sightingsService.search(birdId, undefined, undefined, department).pipe(
              tap(async (res) => {
                if (!res || res.length === 0) {
                  await uiService.showAlert(
                    'Sin Resultados',
                    'No encontramos avistamientos recientes con esos criterios.',
                  );
                  patchState(store, { sightings: [], isLoading: false });
                } else {
                  patchState(store, { sightings: res, isLoading: false });
                }
              }),
              catchError(async (err) => {
                logger.warn('[SightingsMapStore] Error fetching sightings, fallback to mock:', err);
                await uiService.showAlert(
                  'Sin Resultados',
                  'Backend no conectado o sin datos, usando datos simulados de prueba.',
                );
                patchState(store, {
                  sightings: [
                    {
                      id: '1',
                      birdName: birdName || 'Tangara',
                      date: '2026-09-20',
                      time: '14:30',
                      location: { type: 'Point', coordinates: [-75.5, 5.0] },
                      user: {
                        id: '1',
                        name: 'Juan Pajarero',
                        photoUrl: '',
                      },
                    },
                  ],
                  isLoading: false,
                });
                return of(null);
              }),
            );
          }),
        ),
      ),
    }),
  ),
);
