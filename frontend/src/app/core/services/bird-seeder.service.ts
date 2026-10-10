import { inject, Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DbHelperService } from './db-helper.service';
import { CapacitorSQLite, JsonSQLite } from '@capacitor-community/sqlite'; // fix: _JsonSQLite → JsonSQLite
import { firstValueFrom } from 'rxjs';
import { BIRD_DATABASE_SCHEMA } from '../db/init-queries';
import { logger } from '../utils/logger';

/**
 * @sdd
 * [Objetivo]: Importar el catálogo inicial de aves desde un JSON maestro a SQLite.
 * Optimizado con NgZone para evitar el crash de memoria RAM en Angular.
 * [I/O]: Depende de HttpClient, DbHelperService, NgZone, CapacitorSQLite.
 * Expone: seedDatabase(): Promise<void>
 * [Edge Cases]: Si ya hay datos en la DB, omite la importación. Si falla, notifica
 * seedingComplete para no bloquear la app.
 */
@Injectable({ providedIn: 'root' })
export class BirdSeederService {
  private readonly DB_NAME = 'aviturismo_local_v2';
  private readonly http = inject(HttpClient);
  private readonly db = inject(DbHelperService);
  private readonly zone = inject(NgZone);

  /**
   * @method seedDatabase
   * @description Verifica si existen datos y, de no ser así, descarga e inyecta el JSON original.
   * @returns {Promise<void>}
   */
  async seedDatabase(): Promise<void> {
    try {
      // 1. Verificación: Si ya hay aves, no hacemos nada y marcamos como listo.
      const data = await this.db.query('SELECT id FROM birds LIMIT 1');
      if (data.length > 0) {
        logger.debug(
          '🆗 [Seeder] La base de datos ya contiene información. Omitiendo importación.'
        );
        this.db.setSeedingComplete();
        return;
      }

      logger.debug('📥 [Seeder] Iniciando descarga del JSON maestro...');

      const jsonContent = await firstValueFrom(
        this.http.get('assets/db/db-aves.json')
      );

      logger.debug(
        '⚙️ [Seeder] Procesando importación de SQLite fuera de Angular (Optimizando RAM)...'
      );

      // Ejecución segura fuera del ciclo de detección de Angular para evitar el Crash de memoria.
      await this.zone.runOutsideAngular(async () => {
        // Forzamos que el JSON inyecte los datos en la base de datos correcta (v2)
        // ya que el JSON original viene hardcodeado con 'aviturismo_local'.
        (jsonContent as { database?: string }).database = this.DB_NAME;

        // --- IMPORTANTE: CERRAR CONEXIÓN ANTES DEL IMPORT ---
        // Esto evita que CapacitorSQLite sobrescriba el archivo virtual WASM
        // y luego la conexión activa lo vuelva a sobrescribir vacío.
        await this.db.closeActiveConnection();

        // Envolvemos el objeto en JSON.stringify, que es exactamente lo que el plugin exige
        await CapacitorSQLite.importFromJson({
          jsonstring: JSON.stringify(jsonContent),
        });

        // --- REABRIR CONEXIÓN PARA CONTINUAR ---
        await this.db.openActiveConnection();

        // Protección de Sesión: Como el modo "full" del JSON borra todo, recreamos la tabla técnica.
        await this.db.execute(`
          CREATE TABLE IF NOT EXISTS session (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT NOT NULL,
            user_data TEXT NOT NULL
          );
        `);

        // Ejecutar todo el esquema para asegurar que existan las tablas que no vienen en el JSON
        for (const query of BIRD_DATABASE_SCHEMA) {
          try {
            await this.db.execute(query);
          } catch(e: unknown) {
            // Silenciar advertencias de migraciones ya aplicadas para mantener limpia la consola
            if (!String(e).includes('duplicate column name')) {
              logger.warn('[Seeder] Migration/Query skipped:', e);
            }
          }
        }

        // Persistencia obligatoria tras una carga masiva.
        await this.db.saveToStore();
      });

      // Recargamos la conexión en memoria para que IndexedDB hidrate el RAM
      await this.db.reloadConnection();

      logger.debug(
        '✅ [Seeder] Catálogo poblado con éxito desde el archivo maestro.'
      );

      // Notificamos al sistema que ya se pueden consultar aves.
      this.db.setSeedingComplete();
    } catch (error) {
      logger.error('❌ [Seeder] Error crítico durante el poblado:', error);
      // Evitamos un bloqueo permanente de la app en caso de fallo catastrófico
      this.db.setSeedingComplete();
    }
  }
}

// Supresión de exportación muerta del tipo no utilizado directamente
export type { JsonSQLite };
