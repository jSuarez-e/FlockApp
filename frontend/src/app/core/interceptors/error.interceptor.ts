import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { UiService } from '../services/ui.service';

/**
 * @param req
 * @param next
 * @function errorInterceptor
 * @description Centinela de red FlockApp. Captura fallos 400/404 y libera la UI.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const ui = inject(UiService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 1. Prioridad Máxima: Liberar la interfaz (R2)
      ui.dismissLoading();

      let errorMessage = 'Error de conexión con FlockApp';

      // 2. Extracción profunda del mensaje del Backend
      if (error.error) {
        if (typeof error.error.message === 'string') {
          errorMessage = error.error.message;
        } else if (Array.isArray(error.error.message)) {
          errorMessage = error.error.message[0];
        } else if (error.error.error) {
          // Casos donde NestJS envía el error plano
          errorMessage = error.error.error;
        }
      }

      // 3. Notificación visual mediante el UiService del usuario (R1)
      ui.showToast(`${errorMessage}`, 'danger');

      return throwError(() => error);
    }),
  );
};
