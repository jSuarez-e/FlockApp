import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { NetworkService } from '../services/network.service';

/**
 * @param req
 * @param next
 * @sdd
 * @description Centinela Híbrido: Bloquea inmediatamente peticiones a endpoints Online-Only
 * si el dispositivo se encuentra Offline, previniendo timeouts largos.
 */
export const networkInterceptor: HttpInterceptorFn = (req, next) => {
  const network = inject(NetworkService);

  // Definir prefijos o patrones de rutas que requieren conexión estricta a Postgres
  const onlineOnlyEndpoints = ['/v1/feed', '/v1/users', '/v1/guides'];

  const isOnlineOnlyRequest = onlineOnlyEndpoints.some((endpoint) => req.url.includes(endpoint));

  if (isOnlineOnlyRequest && !network.isOnline()) {
    // Abortar la petición y generar un error simulado para el errorInterceptor
    const offlineError = new HttpErrorResponse({
      error: { message: 'No tienes conexión a internet. Esta acción requiere estar en línea.' },
      status: 503,
      statusText: 'Service Unavailable (Offline)',
      url: req.url,
    });
    return throwError(() => offlineError);
  }

  return next(req);
};
