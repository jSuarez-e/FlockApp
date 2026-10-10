import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { User } from '../models/auth.models';
import { BIRD_DATABASE_SCHEMA } from '../db/init-queries';
import { logger } from '../utils/logger';

/**
 * @interface SessionRecord
 * @description Estructura de persistencia para la sesión de usuario (R5).
 */
export interface SessionRecord {
  token: string;
  user_data: string | User;
}

/**
 * @class DbHelperService
 * @description Gestor central de infraestructura SQLite. Implementa persistencia dual y estado de preparación (R2).
 */
@Injectable({
  providedIn: 'root',
})
export class DbHelperService {
  /** Nombre de la DB sincronizado estrictamente con el JSON de aves */
  private readonly DB_NAME = 'aviturismo_local_v2';

  private readonly sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;

  /** @description Bandera que indica si la conexión base está lista */
  private isDbReady: boolean = false;

  /** Bandera que indica si el Seeder ha terminado su trabajo */
  private isSeedingComplete: boolean = false;

  constructor() {}

  /**
   * @method saveToStore
   * @description Sincroniza la base de datos de la memoria RAM al almacenamiento IndexedDB (Web).
   * @returns {Promise<void>}
   */
  async saveToStore(): Promise<void> {
    try {
      await this.sqlite.saveToStore(this.DB_NAME);
      logger.debug('💾 [DbHelper] Cambios guardados físicamente en el disco (IndexedDB).');
    } catch (err) {
      logger.error('❌ [DbHelper] Error persistiendo en store:', err);
    }
  }

  /**
   * @method initDatabase
   * @description Orquestador de conexión inicial. Solo crea la conexión y la tabla de sesión.
   * @returns {Promise<void>}
   */

  async initDatabase(): Promise<void> {
    if (this.isDbReady) return;
    const platform = Capacitor.getPlatform();

    try {
      if (platform === 'web') {
        logger.debug('🌐 [DbHelper] Sincronizando con motor Web...');
        await this.waitForJeepSqlite();
        logger.debug('📦 [DbHelper] Inicializando Web Store de WASM...');
        await this.sqlite.initWebStore();
      }

      logger.debug('🔌 [DbHelper] Conectando a SQLite...');
      this.db = await this.sqlite.createConnection(
        this.DB_NAME,
        false,
        'no-encryption',
        1,
        false
      );

      if (this.db) {
        await this.db.open();

        // Tabla técnica requerida para la sesión
        await this.db.execute(`
          CREATE TABLE IF NOT EXISTS session (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT NOT NULL,
            user_data TEXT NOT NULL
          );
        `);

        // Parche de actualización para la tabla routes: añadir columna status si no existe
        try {
          await this.db.run(`ALTER TABLE routes ADD COLUMN status TEXT DEFAULT 'DRAFT'`, []);
        } catch (_e) {
          // Ignorar si la columna ya existe
        }
        try {
          await this.db.run(`ALTER TABLE routes ADD COLUMN department_id INTEGER`, []);
        } catch (_e) {}
        try {
          await this.db.run(`ALTER TABLE routes ADD COLUMN municipality_id INTEGER`, []);
        } catch (_e) {}
        try {
          await this.db.run(`ALTER TABLE routes ADD COLUMN name TEXT`, []);
        } catch (_e) {}
        try {
          await this.db.run(`ALTER TABLE routes ADD COLUMN comments TEXT`, []);
        } catch (_e) {}
        try {
          await this.db.run(`ALTER TABLE routes ADD COLUMN user_id TEXT`, []);
        } catch {}
        try {
          await this.db.run(`ALTER TABLE routes ADD COLUMN sql_deleted BOOLEAN DEFAULT 0`, []);
        } catch {}
        try {
          await this.db.run(`ALTER TABLE routes ADD COLUMN last_modified INTEGER DEFAULT (strftime('%s', 'now'))`, []);
        } catch {}
        try {
          await this.db.run(`ALTER TABLE route_sightings ADD COLUMN sql_deleted BOOLEAN DEFAULT 0`, []);
        } catch {}
        try {
          await this.db.run(`ALTER TABLE route_sightings ADD COLUMN last_modified INTEGER DEFAULT (strftime('%s', 'now'))`, []);
        } catch {}
        try {
          await this.db.execute(`
            DELETE FROM route_sightings WHERE route_id IN (SELECT id FROM routes WHERE sync_status = 'synced');
            DELETE FROM routes WHERE sync_status = 'synced';
          `);
        } catch {}

        // Parche de actualización para la tabla sites: añadir campos de negocio / contacto
        try {
          await this.db.run(`ALTER TABLE sites ADD COLUMN municipality TEXT`, []);
        } catch {}
        try {
          await this.db.run(`ALTER TABLE sites ADD COLUMN cover_url TEXT`, []);
        } catch {}
        try {
          await this.db.run(`ALTER TABLE sites ADD COLUMN logo_url TEXT`, []);
        } catch {}
        try {
          await this.db.run(`ALTER TABLE sites ADD COLUMN contact_phone TEXT`, []);
        } catch {}
        try {
          await this.db.run(`ALTER TABLE sites ADD COLUMN contact_whatsapp TEXT`, []);
        } catch {}
        try {
          await this.db.run(`ALTER TABLE sites ADD COLUMN website TEXT`, []);
        } catch {}
        try {
          await this.db.run(`ALTER TABLE sites ADD COLUMN instagram TEXT`, []);
        } catch {}
        try {
          await this.db.run(`ALTER TABLE sites ADD COLUMN facebook TEXT`, []);
        } catch {}
        try {
          await this.db.run(`ALTER TABLE sites ADD COLUMN has_bird_checklist BOOLEAN DEFAULT 0`, []);
        } catch {}

        // Ejecutar todo el esquema para asegurar que existan las tablas nuevas (offline-first)
        for (const query of BIRD_DATABASE_SCHEMA) {
          try {
            await this.db.execute(query);
          } catch(e: unknown) {
            if (!String(e).includes('duplicate column name')) {
              logger.warn('[DbHelper] Migration/Query skipped:', e);
            }
          }
        }

        this.isDbReady = true;
        logger.debug('✅ [DbHelper] Motor SQLite en línea y conectado a: ' + this.DB_NAME);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ [DbHelper] ERROR de inicialización:', msg);
      this.isDbReady = false;
      throw error;
    }
  }

  /**
   * @method closeActiveConnection
   * Cierra la conexión activa a la base de datos local.
   */
  async closeActiveConnection(): Promise<void> {
    try {
      if (this.db) {
        await this.sqlite.closeConnection(this.DB_NAME, false);
        logger.debug('✅ [DbHelper] Conexión cerrada preventivamente.');
      }
    } catch (e) {
      logger.warn('⚠️ [DbHelper] Advertencia al cerrar conexión:', e);
    }
  }

  /**
   * @method openActiveConnection
   * Abre/recrea la conexión a la base de datos local.
   */
  async openActiveConnection(): Promise<void> {
    try {
      this.db = await this.sqlite.createConnection(this.DB_NAME, false, 'no-encryption', 1, false);
      await this.db.open();
      logger.debug('✅ [DbHelper] Conexión abierta/recargada exitosamente.');
    } catch (e) {
      logger.error('❌ [DbHelper] Error abriendo conexión:', e);
    }
  }

  /**
   * @method reloadConnection
   * Cierra y reabre la conexión a la base de datos local.
   */
  async reloadConnection(): Promise<void> {
    logger.debug('🔄 [DbHelper] Recargando conexión a SQLite...');
    await this.closeActiveConnection();
    await this.openActiveConnection();
  }

  /**
   * @method setSeedingComplete
   * Método para que el Seeder notifique que la base de datos ya tiene todos los datos.
   */
  public setSeedingComplete(): void {
    this.isSeedingComplete = true;
    logger.debug('✅ ✅ ✅ [DbHelper] SISTEMA TOTALMENTE POBLADO Y LISTO PARA CONSULTAS');
  }

  /**
   * @method getSeedingStatus
   * Permite a otros servicios saber si pueden consultar datos de negocio de forma segura.
   * @returns {boolean}
   */
  public getSeedingStatus(): boolean {
    return this.isSeedingComplete;
  }

  /**
   * @method waitForJeepSqlite
   * Asegura que el Web Component del motor WASM esté hidratado en el DOM.
   * @private
   */
  private async waitForJeepSqlite(): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        type JeepSqliteEl = Element & { componentOnReady?: () => Promise<void> };
        const jeepEl = document.querySelector('jeep-sqlite') as JeepSqliteEl | null;
        if (jeepEl && typeof jeepEl.componentOnReady === 'function') {
          clearInterval(interval);
          await customElements.whenDefined('jeep-sqlite');
          await jeepEl.componentOnReady();
          logger.debug('🎯 [DbHelper] Motor Jeep-SQLite hidratado.');
          resolve();
        }
      }, 50);
    });
  }

  /**
   * @method query
   * Ejecuta consultas de selección (SELECT) de forma segura.
   * @param {string} sql
   * @param {unknown[]} params
   * @returns {Promise<unknown[]>}
   */
  async query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
    if (!this.isDbReady || !this.db) return [];
    try {
      const res = await this.db.query(sql, params);
      return (res.values as T[]) || [];
    } catch (_e) {
      // Si la tabla no existe aún, devolvemos un arreglo vacío de forma silenciosa.
      return [];
    }
  }

  /**
   * @method execute
   * Ejecuta sentencias directas (INSERT, UPDATE, DELETE).
   * @param sql - Sentencia SQL a ejecutar
   */
  async execute(sql: string): Promise<void> {
    if (this.isDbReady && this.db) {
      await this.db.execute(sql);
    }
  }

  /**
   * @method run
   * Ejecuta sentencias con parámetros. Lanza error si la BD no está lista.
   */
  async run(sql: string, params: unknown[]): Promise<void> {
    if (!this.isDbReady || !this.db) {
      const errMsg = `[DbHelper] run() llamado antes de que la BD esté lista. SQL: ${sql.substring(0, 60)}`;
      logger.error(errMsg);
      throw new Error(errMsg);
    }
    try {
      await this.db.run(sql, params);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      logger.error(`[DbHelper] Error ejecutando SQL: ${msg}\nSQL: ${sql}`);
      throw e;
    }
  }

  /**
   * @method exportDatabaseToJson
   * Extrae toda la BD local en formato JSON
   * @returns {Promise<string>}
   */
  async exportDatabaseToJson(): Promise<string> {
    if (!this.db) throw new Error('Database no conectada');
    const result = await this.db.exportToJson('full');
    return JSON.stringify(result.export);
  }

  /**
   * @method exportDatabaseToSQL
   * Extrae toda la BD local y la convierte en un dump de sentencias SQL
   * @returns {Promise<string>}
   */

  async exportDatabaseToSQL(): Promise<string> {
    if (!this.db) throw new Error('Database no conectada');
    const result = await this.db.exportToJson('full');
    const data = result.export;
    if (!data) throw new Error('No se pudo exportar la estructura');

    let sqlDump = `-- Dump de base de datos generado: ${new Date().toISOString()}\n`;
    sqlDump += `-- DB: ${data.database} v${data.version}\n\n`;

    if (data.tables) {
      for (const table of data.tables) {
        if (table.schema && table.schema.length > 0) {
          const cols = table.schema.map(c => `${c.column} ${c.value}`).join(', ');
          sqlDump += `CREATE TABLE IF NOT EXISTS ${table.name} (${cols});\n`;
        }
        if (table.values && table.values.length > 0) {
          for (const row of table.values) {
            const vals = row.map(v => {
              if (v === null) return 'NULL';
              if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
              return v;
            }).join(', ');
            sqlDump += `INSERT INTO ${table.name} VALUES (${vals});\n`;
          }
        }
        sqlDump += '\n';
      }
    }
    return sqlDump;
  }

  /**
   * @method exportDatabaseToSQLite
   * @description Extrae la base de datos binaria (.sqlite) directamente desde IndexedDB (en Web)
   * @returns {Promise<Blob>}
   */
  async exportDatabaseToSQLite(): Promise<Blob> {
    const platform = Capacitor.getPlatform();
    if (platform !== 'web') {
      throw new Error('Solo soportado en web por ahora. En móvil se exporta de otra forma.');
    }

    await this.saveToStore(); // Aseguramos que la DB en memoria baje al IndexedDB

    return new Promise((resolve, reject) => {
      const nombreBDReal = 'jeepSqliteStore';
      const tablaReal = 'databases';

      const request = window.indexedDB.open(nombreBDReal);

      request.onerror = () => reject(`Error abriendo IndexedDB ${nombreBDReal}`);

      request.onsuccess = (event: Event) => {
        const idb = (event.target as IDBOpenDBRequest).result;
        try {
          if (!idb.objectStoreNames.contains(tablaReal)) {
            reject(new Error(`La base de datos ${nombreBDReal} no tiene la tabla ${tablaReal}.`));
            return;
          }

          const transaction = idb.transaction(tablaReal, 'readonly');
          const store = transaction.objectStore(tablaReal);
          const cursorRequest = store.openCursor();


          cursorRequest.onsuccess = (e: Event) => {
            const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;

            if (cursor) {
              const registroCompleto = cursor.value;
              let bytes: Uint8Array | null = null;

              if (registroCompleto instanceof Uint8Array) {
                bytes = registroCompleto;
              } else if (registroCompleto && typeof registroCompleto === 'object') {
                for (const propiedad in registroCompleto) {
                  if (registroCompleto[propiedad] instanceof Uint8Array) {
                    bytes = registroCompleto[propiedad];
                    break;
                  }
                }
              }

              if (bytes) {
                logger.debug(`[DbHelper] Procesando DB binaria: ${bytes.byteLength} bytes...`);
                const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/vnd.sqlite3' });
                idb.close();
                resolve(blob);
              } else {
                cursor.continue(); // Seguir buscando en el siguiente registro por si acaso
              }
            } else {
              idb.close();
              reject(new Error('No se encontraron bytes válidos en la base de datos jeepSqliteStore.'));
            }
          };

          cursorRequest.onerror = () => reject('Error leyendo cursor de IndexedDB');
        } catch (error) {
          reject(error);
        }
      };
    });
  }

  // --- MÉTODOS DE SESIÓN (R1) ---

  /**
   * @method getSession
   * Obtiene la sesión activa desde localStorage o SQLite como fallback.
   * @returns {Promise<SessionRecord | null>}
   */
  async getSession(): Promise<SessionRecord | null> {
    const localData = localStorage.getItem('session');
    if (localData) return JSON.parse(localData);

    if (!this.isDbReady || !this.db) return null;

    const res = await this.query(`SELECT token, user_data FROM session LIMIT 1`);
    return res.length > 0 ? (res[0] as unknown as SessionRecord) : null;
  }

  /**
   * @method saveSession
   * Persiste la sesión en localStorage y SQLite.
   * @param {string} token - JWT Token
   * @param {User} userData - Datos del usuario autenticado
   */
  async saveSession(token: string, userData: User): Promise<void> {
    const dataStr = typeof userData === 'string' ? userData : JSON.stringify(userData);
    localStorage.setItem('session', JSON.stringify({ token, user_data: dataStr }));

    if (this.isDbReady && this.db) {
      await this.db.execute(`DELETE FROM session`);
      await this.db.run(
        `INSERT INTO session (token, user_data) VALUES (?, ?)`,
        [token, dataStr]
      );
      await this.saveToStore();
    }
  }

  /**
   * @method clearSession
   * Elimina la sesión activa de todos los stores de persistencia.
   */
  async clearSession(): Promise<void> {
    localStorage.removeItem('session');
    if (this.isDbReady && this.db) {
      await this.db.execute(`DELETE FROM session`);
      try {
        await this.db.execute(`
          DELETE FROM route_sightings WHERE route_id IN (SELECT id FROM routes WHERE sync_status = 'synced');
          DELETE FROM routes WHERE sync_status = 'synced';
        `);
      } catch (_e) {}
      await this.saveToStore();
    }
  }
}
