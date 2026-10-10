import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DbHelperService } from '../services/db-helper.service';
import { User } from '../models/auth.models';
import { logger } from '../utils/logger';

/**
 * Guard de Autenticación Funcional.
 * * Protege las rutas de la aplicación verificando la existencia de una sesión activa.
 * 1. Comprueba el estado en memoria (Signals).
 * 2. Si no hay memoria, intenta restaurar desde la persistencia local (SQLite).
 * 3. Bloquea el acceso y redirige al login si no se encuentra una sesión válida.
 * @param _route Información de la ruta activa.
 * @param _state Estado del router.
 * @returns boolean | Promise<boolean> true si permite el acceso, false si lo deniega.
 */
export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const db = inject(DbHelperService);
  const router = inject(Router);

  // 1. Revisar si ya está autenticado en el Signal (Memoria activa)
  // Esto optimiza la navegación entre rutas internas sin consultar la DB.
  if (authService.currentUser()) {
    return true;
  }

  // 2. Si no hay memoria, revisar si hay una sesión guardada en SQLite (Persistencia)
  try {
    const session = await db.getSession();

    if (session && session.token) {
      // Restauramos el usuario en el Signal del servicio (Regla 4: Tipado Estricto)
      const userData: User =
        typeof session.user_data === 'string' ? JSON.parse(session.user_data) : session.user_data;

      authService.currentUser.set(userData);
      return true;
    }
  } catch (error: unknown) {
    logger.error('Error verificando sesión en la base de datos local:', error);
  }

  // 3. Si no hay sesión válida, redirigir al login
  // Reemplazamos la URL para no dejar rastro en el historial de navegación.
  router.navigate(['/auth/login'], { replaceUrl: true });
  return false;
};
