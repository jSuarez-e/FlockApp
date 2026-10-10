import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { AuthService } from '../services/auth.service';
import { FeedStore } from './feed.store';
import { User, AuthResponse } from '../models/auth.models';

/**
 * Elemento documentado.
 */
export type AuthState = {
  /**
   * Elemento documentado.
   */
  user: User | null;
  /**
   * Elemento documentado.
   */
  accessToken: string | null;
  /**
   * Elemento documentado.
   */
  isLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
};

/**
 * @class AuthStore
 * @description Almacén centralizado y reactivo para la sesión usando NgRx SignalStore.
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((
    store,
    authService = inject(AuthService),
    feedStore = inject(FeedStore),
  ) => ({
    /**
     * Elemento documentado.
     * @param identifier
     * @param pass
     * @param remember
     */
    async login(
      identifier: string,
      pass: string,
      remember: boolean = false,
    ): Promise<AuthResponse> {
      patchState(store, { isLoading: true });
      try {
        const response = await authService.login(identifier, pass, remember);
        patchState(store, {
          user: response.user,
          accessToken: response.access_token,
          isLoading: false,
        });
        return response;
      } catch (err) {
        patchState(store, { isLoading: false });
        throw err;
      }
    },

    /**
     * Elemento documentado.
     * @param userData
     */
    async register(userData: Partial<User>): Promise<User> {
      patchState(store, { isLoading: true });
      try {
        const user = await authService.register(userData);
        patchState(store, { isLoading: false });
        return user;
      } catch (err) {
        patchState(store, { isLoading: false });
        throw err;
      }
    },

    /**
     * Elemento documentado.
     */
    async logout(): Promise<void> {
      patchState(store, { isLoading: true });
      await authService.logout();
      feedStore.resetFeed();
      patchState(store, { user: null, accessToken: null, isLoading: false });
    },

    /**
     * Elemento documentado.
     */
    syncFromService() {
      patchState(store, {
        user: authService.currentUser(),
        accessToken: authService.getToken(),
      });
    },
  })),
);
