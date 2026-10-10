import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AuthStore } from './auth.store';
import { GeographyService } from '../services/geography.service';
import { User, UserMedalDto } from '../models/auth.models';

import { GeoLocation } from '../services/geography.service';
import { logger } from '../utils/logger';

/**
 *
 */
export type ProfileState = {
  /**
   *
   */
  viewedUser: User | null;
  /**
   *
   */
  medals: UserMedalDto[];
  /**
   *
   */
  isLoading: boolean;
  /**
   *
   */
  departments: GeoLocation[];
  /**
   *
   */
  municipalities: GeoLocation[];
};

const initialState: ProfileState = {
  viewedUser: null,
  medals: [],
  isLoading: false,
  departments: [],
  municipalities: [],
};

/**
 * @class ProfileStore
 * @description Almacén centralizado y reactivo para la gestión de perfil y seguridad.
 * Encapsula los llamados HTTP del UserService para cumplir con el Principio de Responsabilidad Única.
 */
export const ProfileStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      userService = inject(UserService),
      authService = inject(AuthService),
      authStore = inject(AuthStore),
      geoService = inject(GeographyService),
    ) => ({
      /**
       * Carga el perfil del usuario autenticado o de un usuario externo por ID.
       * @param id Identificador opcional del usuario.
       * @returns Promesa con los datos del usuario o null.
       */
      async loadProfile(id?: string | null): Promise<User | null> {
        patchState(store, { isLoading: true });
        try {
          const user = id ? await userService.getProfileById(id) : await userService.getProfile();

          patchState(store, { viewedUser: user, isLoading: false });

          // Si es el perfil propio, actualizamos el state global de Auth
          if (!id || (authService.currentUser() && id === authService.currentUser()?.id)) {
            authService.currentUser.set(user);
            authStore.syncFromService();
          }

          return user;
        } catch (err) {
          patchState(store, { isLoading: false });
          throw err;
        }
      },

      /**
       * Actualiza los datos de perfil del usuario actual.
       * @param updateData Datos a actualizar.
       * @returns Promesa con el usuario actualizado.
       */
      async updateProfile(updateData: Partial<User>): Promise<User> {
        patchState(store, { isLoading: true });
        try {
          const updatedUser = await userService.updateProfile(updateData);
          patchState(store, { viewedUser: updatedUser, isLoading: false });
          authService.currentUser.set(updatedUser);
          authStore.syncFromService();
          return updatedUser;
        } catch (err) {
          patchState(store, { isLoading: false });
          throw err;
        }
      },

      /**
       *
       * @param data
       * @param data.oldPassword
       * @param data.newPassword
       */
      async updatePassword(data: {
        /**
         *
         */
        oldPassword?: string;
        /**
         *
         */
        newPassword?: string;
      }): Promise<{ /**
       *
       */
      message: string }> {
        patchState(store, { isLoading: true });
        try {
          const result = await userService.updatePassword(data);
          patchState(store, { isLoading: false });
          return result;
        } catch (err) {
          patchState(store, { isLoading: false });
          throw err;
        }
      },

      /**
       *
       * @param file
       * @param type
       * @param extension
       */
      async uploadImage(file: Blob, type: 'AVATAR' | 'COVER', extension: string): Promise<string> {
        patchState(store, { isLoading: true });
        try {
          const uploadType = type === 'AVATAR' ? 'avatar' : 'cover';
          const { url } = await userService.uploadImage(file, uploadType, extension);

          const currentUser = store.viewedUser();
          if (currentUser) {
            const updated = {
              ...currentUser,
              [type === 'AVATAR' ? 'avatarUrl' : 'coverUrl']: url,
            };
            patchState(store, { viewedUser: updated });
            authService.currentUser.set(updated);
            authStore.syncFromService();
          }

          patchState(store, { isLoading: false });
          return url;
        } catch (err) {
          patchState(store, { isLoading: false });
          throw err;
        }
      },

      /**
       *
       */
      async loadMedals(): Promise<UserMedalDto[]> {
        patchState(store, { isLoading: true });
        try {
          const medals = await userService.getMyMedals();
          patchState(store, { medals, isLoading: false });
          return medals;
        } catch (err) {
          patchState(store, { isLoading: false });
          throw err;
        }
      },

      /**
       *
       */
      async loadDepartments(): Promise<void> {
        try {
          const depts = await geoService.getDepartments();
          patchState(store, { departments: depts });
        } catch (err) {
          logger.error('Error loading departments', err);
        }
      },

      /**
       *
       * @param departmentId
       */
      async loadMunicipalities(departmentId: number): Promise<void> {
        try {
          const munis = await geoService.getMunicipalities(departmentId);
          patchState(store, { municipalities: munis });
        } catch (err) {
          logger.error('Error loading municipalities', err);
        }
      },
    }),
  ),
);
