/**
 * @sdd
 * [Objetivo]: Sincronización segura y automática de esquemas PostgreSQL en arranque sin pérdida de datos.
 * [I/O]: Inyecta DataSource de TypeORM; ejecuta ALTER TABLE ... ADD COLUMN IF NOT EXISTS para columnas faltantes.
 * [Edge Cases]: Nunca ejecuta DROP; maneja tipos espaciales PostGIS, jsonb y timestamps de forma segura e idempotente.
 */
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

interface IColumnSchemaRow {
  column_name: string;
}

/**
 * Servicio encargado de parchar de forma segura e incremental el esquema de PostgreSQL al iniciar el backend.
 * Evita la necesidad de ejecutar comandos SQL manuales y elimina los riesgos destructivos de `synchronize: true`.
 */
@Injectable()
export class DatabaseBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseBootstrapService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /**
   * Hook de inicialización del ciclo de vida de NestJS.
   * Se ejecuta una vez que todos los módulos y la conexión a la base de datos están listos.
   */
  async onApplicationBootstrap(): Promise<void> {
    await this.autoPatchMissingColumns();
  }

  /**
   * Inspecciona todas las entidades registradas en TypeORM y agrega columnas faltantes en PostgreSQL.
   */
  private async autoPatchMissingColumns(): Promise<void> {
    try {
      for (const meta of this.dataSource.entityMetadatas) {
        const tableName = meta.tableName;

        // Consultar columnas existentes en PostgreSQL para esta tabla
        const rows = await this.dataSource.query<IColumnSchemaRow[]>(
          'SELECT column_name FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2',
          ['public', tableName],
        );

        // Si la tabla aún no existe físicamente, no se altera
        if (!rows || rows.length === 0) {
          continue;
        }

        const existingCols = new Set<string>(
          rows.map((r: IColumnSchemaRow) => r.column_name.toLowerCase()),
        );

        for (const col of meta.columns) {
          const colName = col.databaseName.toLowerCase();
          if (!existingCols.has(colName)) {
            const sqlType = this.resolveSqlType(col);
            const alterSql = `ALTER TABLE "${tableName}" ADD COLUMN IF NOT EXISTS "${col.databaseName}" ${sqlType};`;
            await this.dataSource.query(alterSql);
            this.logger.log(
              `[Auto-Patch] Columna añadida a '${tableName}': "${col.databaseName}" ${sqlType}`,
            );
          }
        }
      }
    } catch (error) {
      const err = error as Error;
      this.logger.warn(
        `[Auto-Patch] Advertencia durante la verificación de esquema: ${err.message}`,
      );
    }
  }

  /**
   * Infiere la definición de tipo de dato SQL compatible con PostgreSQL a partir de los metadatos de TypeORM.
   * @param col Metadatos de la columna en TypeORM.
   * @returns Definición de tipo SQL lista para sentencia DDL.
   */
  private resolveSqlType(col: ColumnMetadata): string {
    const typeStr = String(col.type).toLowerCase();

    if (typeStr === 'geometry') {
      return 'geometry';
    }
    if (typeStr === 'jsonb') {
      return "jsonb DEFAULT '{}'::jsonb";
    }
    if (typeStr === 'boolean') {
      const defVal =
        col.default === true || col.default === 'true' ? 'true' : 'false';
      return `boolean DEFAULT ${defVal}`;
    }
    if (typeStr === 'float' || typeStr === 'double precision') {
      return 'double precision';
    }
    if (typeStr === 'int' || typeStr === 'integer') {
      return 'integer';
    }
    if (typeStr.includes('timestamp')) {
      return 'timestamp without time zone DEFAULT NOW()';
    }
    if (typeStr === 'uuid') {
      return 'uuid';
    }
    if (typeStr === 'text') {
      return 'text';
    }
    if (col.length) {
      return `character varying(${col.length})`;
    }
    return 'character varying(255)';
  }
}
