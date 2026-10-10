import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { DbHelperService } from '../services/db-helper.service';
import { AuthService } from '../services/auth.service';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * @function authInterceptor
 * @description Interceptor funcional que actúa como middleware para las peticiones HTTP salientes.
 * Su responsabilidad es adjuntar el token JWT (Bearer) a las cabeceras de autorización.
 * * Flujo de ejecución:
 * 1. Verifica la memoria RAM (AuthService) por velocidad.
 * 2. Si la RAM está vacía, consulta SQLite de forma asíncrona (DbHelperService).
 * 3. Si encuentra un token en SQLite, lo restaura a la RAM y clona la petición.
 * 4. Si no hay token en ninguna capa, deja pasar la petición original (ej. Login/Register).
 * * @param {HttpRequest<unknown>} req - La petición HTTP original inmutable.
 * @param req
 * @param {HttpHandlerFn} next - El despachador para continuar el ciclo de vida HTTP.
 * @returns {Observable<HttpEvent<unknown>>} Un observable con la petición modificada o intacta.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const db = inject(DbHelperService);

  // PASO 1: Consulta ultrarrápida en memoria RAM
  const ramToken = authService.getToken();

  if (ramToken) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${ramToken}` },
    });
    return next(authReq);
  }

  // PASO 2: Si la memoria está vacía (ej. recargó la app/página), buscamos en SQLite
  return from(db.getSession()).pipe(
    switchMap((session) => {
      if (session && session.token) {
        // Restauramos el token en RAM para optimizar peticiones futuras
        authService.setToken(session.token);

        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${session.token}` },
        });
        return next(authReq);
      }

      // PASO 3: Petición pública (sin sesión detectada)
      return next(req);
    }),
  );
};
