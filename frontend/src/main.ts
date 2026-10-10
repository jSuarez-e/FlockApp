import { BirdSeederService } from './app/core/services/bird-seeder.service';
import { APP_INITIALIZER } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
import { networkInterceptor } from './app/core/interceptors/network.interceptor';
import { DbHelperService } from './app/core/services/db-helper.service';

import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import { logger } from './app/core/utils/logger';

// R2: Solo inicializamos el Custom Element en memoria
const oPlatform = Capacitor.getPlatform();
if (oPlatform === 'web') {
  jeepSqlite(window);
}

/**
 * Fábrica de inicialización de la app.
 * Ejecuta la apertura de la BD local SQLite y lanza el sembrador de datos iniciales.
 * @param db - Servicio de utilidades de base de datos local.
 * @param seeder - Servicio que siembra los datos semilla (pájaros/localidades).
 * @returns Función asíncrona de inicialización.
 */
export function initializeAppFactory(
  db: DbHelperService,
  seeder: BirdSeederService
) {
  return async () => {
    await db.initDatabase(); // 1. Inicia la conexión
    await seeder.seedDatabase(); // 2. Si está vacía, carga el JSON
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [DbHelperService, BirdSeederService],
      multi: true,
    },
    provideIonicAngular({ mode: 'md' }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([networkInterceptor, authInterceptor, errorInterceptor])),
  ],
}).catch((err) => logger.error('🔥 Error en Bootstrap:', err));
