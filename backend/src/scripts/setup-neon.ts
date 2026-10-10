/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
/**
 * @sdd
 * [Objetivo]: Inicialización y seeding completo de PostgreSQL en Neon Serverless.
 * [I/O]: Lee DATABASE_URL de .env; habilita PostGIS; sincroniza TypeORM DDL; ejecuta seeders de aves, taxonomía, medallas, guías y sitios.
 * [Edge Cases]: Soporta TLS con rejectUnauthorized: false; maneja inserciones idempotentes con ON CONFLICT DO NOTHING.
 */
import { Client } from 'pg';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import {
  MedalEntity,
  MedalConditionType,
} from '../infrastructure/entities/medal.entity';
import { GuideEntity } from '../infrastructure/entities/guide.entity';
import { SiteEntity } from '../infrastructure/entities/site.entity';

dotenv.config();

const initialMedals = [
  {
    name: 'Pionero',
    description: 'Medalla por crear la cuenta',
    condition_type: MedalConditionType.ACCOUNT_CREATED,
    condition_value: 1,
    iconUrl: 'assets/imgs/medals/account_created.png',
  },
  {
    name: 'Lealtad Cien',
    description: 'Medalla por usar la cuenta 100 días',
    condition_type: MedalConditionType.DAYS_ACTIVE,
    condition_value: 100,
    iconUrl: 'assets/imgs/medals/days_100.png',
  },
  {
    name: 'Primera Pluma',
    description: 'Medalla por registrar la primera ave',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 1,
    iconUrl: 'assets/imgs/medals/bird_1.png',
  },
  {
    name: 'Observador Novato',
    description: 'Medalla por registrar 10 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 10,
    iconUrl: 'assets/imgs/medals/bird_10.png',
  },
  {
    name: 'Aficionado',
    description: 'Medalla por registrar 20 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 20,
    iconUrl: 'assets/imgs/medals/bird_20.png',
  },
  {
    name: 'Pajarero Frecuente',
    description: 'Medalla por registrar 30 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 30,
    iconUrl: 'assets/imgs/medals/bird_30.png',
  },
  {
    name: 'Experto en Plumajes',
    description: 'Medalla por registrar 40 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 40,
    iconUrl: 'assets/imgs/medals/bird_40.png',
  },
  {
    name: 'Maestro de Cantos',
    description: 'Medalla por registrar 50 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 50,
    iconUrl: 'assets/imgs/medals/bird_50.png',
  },
  {
    name: 'Guardián del Dosel',
    description: 'Medalla por registrar 60 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 60,
    iconUrl: 'assets/imgs/medals/bird_60.png',
  },
  {
    name: 'Ojo de Águila',
    description: 'Medalla por registrar 70 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 70,
    iconUrl: 'assets/imgs/medals/bird_70.png',
  },
  {
    name: 'Centinela Silvestre',
    description: 'Medalla por registrar 80 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 80,
    iconUrl: 'assets/imgs/medals/bird_80.png',
  },
  {
    name: 'Leyenda del Aviturismo',
    description: 'Medalla por registrar 100 aves',
    condition_type: MedalConditionType.BIRD_COUNT,
    condition_value: 100,
    iconUrl: 'assets/imgs/medals/bird_100.png',
  },
];

const guidesData = [
  {
    fullName: 'Carlos Avendaño',
    location: 'Minca, Magdalena',
    specialty: 'Aves Endémicas y Fotografía',
    rating: 4.9,
    photoUrl:
      'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png',
    details:
      'Guía experto con más de 10 años recorriendo la Sierra Nevada de Santa Marta. Especializado en el Periquito de Santa Marta.',
  },
  {
    fullName: 'Marta Rincón',
    location: 'Cali, Valle del Cauca',
    specialty: 'Rutas de Montaña',
    rating: 4.7,
    photoUrl:
      'https://cdn.pixabay.com/photo/2021/01/17/09/11/woman-5924366_1280.jpg',
    details:
      'Especialista en observación de tangaras y colibríes en el Km 18 y San Antonio.',
  },
  {
    fullName: 'Jorge Echeverri',
    location: 'Medellín, Antioquia',
    specialty: 'Ciclismo y Aviturismo',
    rating: 4.5,
    photoUrl:
      'https://cdn.pixabay.com/photo/2016/11/18/19/07/happy-1836445_1280.jpg',
    details:
      'Combina recorridos en bicicleta de montaña con la observación de aves locales.',
  },
  {
    fullName: 'Ana María Gómez',
    location: 'Manizales, Caldas',
    specialty: 'Ecosistemas de Páramo',
    rating: 4.8,
    photoUrl:
      'https://cdn.pixabay.com/photo/2017/08/30/17/49/vlogger-2697945_1280.jpg',
    details:
      'Bióloga de campo experta en el Parque Nacional Natural Los Nevados.',
  },
  {
    fullName: 'Felipe Henao',
    location: 'Leticia, Amazonas',
    specialty: 'Aves Amazónicas y Dosel',
    rating: 5.0,
    photoUrl:
      'https://cdn.pixabay.com/photo/2018/04/27/08/55/water-3354062_1280.jpg',
    details:
      'Guía nativo con amplio conocimiento de llamadas y cantos de aves de selva baja.',
  },
];

const sitesData = [
  {
    name: 'Reserva Natural El Dorado',
    department: 'Magdalena',
    rating: 4.9,
    description:
      'Reserva icónica en la Sierra Nevada de Santa Marta, hogar de múltiples aves endémicas de Colombia.',
    location: {
      type: 'Point',
      coordinates: [-74.0538, 11.1018],
    },
  },
  {
    name: 'Km 18 y San Antonio',
    department: 'Valle del Cauca',
    rating: 4.8,
    description:
      'Lugar famoso cerca de Cali por sus comederos de colibríes y bandadas mixtas de tangaras.',
    location: {
      type: 'Point',
      coordinates: [-76.6277, 3.5186],
    },
  },
  {
    name: 'Jardín Botánico de Medellín',
    department: 'Antioquia',
    rating: 4.5,
    description:
      'Un oasis urbano excelente para iniciarse en el aviturismo, con especies comunes y migratorias.',
    location: {
      type: 'Point',
      coordinates: [-75.5647, 6.2707],
    },
  },
  {
    name: 'Parque Nacional Natural Chingaza',
    department: 'Cundinamarca',
    rating: 4.7,
    description:
      'Páramos de alta montaña ideales para avistar aves adaptadas a climas fríos y lagunas glaciares.',
    location: {
      type: 'Point',
      coordinates: [-73.75, 4.6833],
    },
  },
  {
    name: 'Reserva Natural Rogitama',
    department: 'Boyacá',
    rating: 4.9,
    description:
      'Santuario dedicado a la conservación de colibríes y aves amenazadas de los Andes colombianos.',
    location: {
      type: 'Point',
      coordinates: [-73.5, 5.6],
    },
  },
];

interface ITableSchemaItem {
  column: string;
}

interface IRawTable {
  name: string;
  schema: ITableSchemaItem[];
  values: unknown[][];
}

interface IRawJsonData {
  tables: IRawTable[];
}

async function runSetup() {
  console.log('====================================================');
  console.log('🚀 INICIALIZADOR NEON POSTGRESQL - IBIRDS COLOMBIA');
  console.log('====================================================');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('❌ DATABASE_URL no está definida en .env');
  }

  // 1. Conexión directa PG para activar PostGIS
  console.log('\n[Paso 1/5] 🌐 Verificando y habilitando extensión PostGIS...');
  const pgClient = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();

  try {
    await pgClient.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    const extRes = await pgClient.query(
      "SELECT extname FROM pg_extension WHERE extname = 'postgis'",
    );
    if (extRes.rows.length > 0) {
      console.log('  ✅ Extensión PostGIS habilitada con éxito.');
    } else {
      console.warn('  ⚠️ Advertencia: PostGIS no se encontró en pg_extension.');
    }
  } finally {
    await pgClient.end();
  }

  // 2. Levantar Nest Application Context y sincronizar esquema TypeORM
  console.log(
    '\n[Paso 2/5] 🏗️  Sincronizando esquemas de TypeORM (creación de tablas)...',
  );
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['warn', 'error'],
  });
  const dataSource = app.get(DataSource);

  await dataSource.synchronize(false);
  console.log('  ✅ Tablas y relaciones creadas exitosamente en Neon.');

  // 3. Importar Catálogo Maestro de Aves y Taxonomía
  console.log(
    '\n[Paso 3/5] 🐦 Importando catálogo maestro de aves y taxonomía...',
  );
  const jsonPath = path.resolve(
    __dirname,
    '../../../frontend/src/assets/db/db-aves.json',
  );
  if (fs.existsSync(jsonPath)) {
    const rawData = JSON.parse(
      fs.readFileSync(jsonPath, 'utf-8'),
    ) as IRawJsonData;
    const seedPg = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    });
    await seedPg.connect();

    try {
      // Ordenar tablas para garantizar que 'birds' se inserte antes de 'bird_departments'
      const tableOrderPriority = (name: string): number => {
        if (name === 'birds') return 10;
        if (name === 'bird_departments') return 20;
        return 0;
      };

      const sortedTables = [...rawData.tables].sort((a, b) => {
        return tableOrderPriority(a.name) - tableOrderPriority(b.name);
      });

      for (const table of sortedTables) {
        if (!table.values || table.values.length === 0) continue;

        let tableName = table.name;
        if (tableName === 'beak_morphology') tableName = 'beak_morphologies';
        if (tableName === 'wing_morphology') tableName = 'wing_morphologies';
        if (tableName === 'leg_morphology') tableName = 'leg_morphologies';
        if (tableName === 'tail_morphology') tableName = 'tail_morphologies';
        if (tableName === 'users' || tableName === 'sightings') continue;

        const columns: string[] = [];
        const validIndices: number[] = [];

        table.schema.forEach((s, idx) => {
          let col = s.column;
          if (!col) return;
          if (col === 'description_english') col = 'english_description';
          if (col === 'image') col = 'image_url';
          if (col === 'departments') col = 'name';
          if (col === 'municipalities') col = 'name';
          if (tableName === 'municipalities' && col === 'department_id')
            col = 'departmentId';
          if (col === 'total_aves') col = 'total_birds';
          if (col === 'tipos_aves') col = 'bird_types';

          columns.push(col);
          validIndices.push(idx);
        });

        // Mapear todas las filas de la tabla
        const preparedRows: unknown[][] = table.values.map((row) => {
          return validIndices.map((idx) => {
            let v = row[idx];
            const colName = columns[validIndices.indexOf(idx)];
            if (colName === 'sql_deleted') return v === 1;
            if (colName === 'last_modified') {
              return new Date(Number(v) * 1000).toISOString();
            }
            if (typeof v === 'string' && v.trim() === '') v = null;
            if (v === null || v === undefined) {
              if (colName === 'viewing_difficulty') return 4;
              if (colName === 'min_altitude' || colName === 'max_altitude')
                return 0;
              if (colName === 'size') return 0;
              if (
                colName === 'common_name' ||
                colName === 'english_name' ||
                colName === 'scientific_name'
              ) {
                return '-';
              }
              return null;
            }
            return v;
          });
        });

        // Inserción en lotes (batch) de 50 registros por consulta para máxima velocidad
        const BATCH_SIZE = 50;
        let inserted = 0;
        const quotedCols = columns.map((c) => `"${c}"`).join(', ');

        for (let i = 0; i < preparedRows.length; i += BATCH_SIZE) {
          const chunk = preparedRows.slice(i, i + BATCH_SIZE);
          const flatValues: unknown[] = [];
          const rowPlaceholders: string[] = [];
          let paramCounter = 1;

          for (const row of chunk) {
            const p: string[] = [];
            for (const val of row) {
              flatValues.push(val);
              p.push(`$${paramCounter++}`);
            }
            rowPlaceholders.push(`(${p.join(', ')})`);
          }

          const query = `INSERT INTO "${tableName}" (${quotedCols}) VALUES ${rowPlaceholders.join(', ')} ON CONFLICT (id) DO NOTHING`;

          try {
            await seedPg.query(query, flatValues);
            inserted += chunk.length;
          } catch (e: unknown) {
            const err = e as Error;
            console.error(
              `  ❌ Error en ${tableName} (lote ${i}): ${err.message}`,
            );
            break;
          }
        }
        console.log(`  -> Insertadas ${inserted} filas en '${tableName}'`);
      }
    } finally {
      await seedPg.end();
    }
  } else {
    console.warn(`  ⚠️ No se encontró el archivo ${jsonPath}`);
  }

  // 4. Seed de Medallas
  console.log('\n[Paso 4/5] 🎖️  Cargando Medallas...');
  const medalRepo = app.get<Repository<MedalEntity>>(
    getRepositoryToken(MedalEntity),
  );
  let medalsCreated = 0;
  for (const m of initialMedals) {
    const existing = await medalRepo.findOne({ where: { name: m.name } });
    if (!existing) {
      await medalRepo.save(medalRepo.create(m));
      medalsCreated++;
    }
  }
  console.log(`  ✅ Medallas cargadas: ${medalsCreated} nuevas.`);

  // 5. Seed de Guías y Sitios
  console.log('\n[Paso 5/5] 📍 Cargando Guías y Sitios de Aviturismo...');
  const guideRepo = app.get<Repository<GuideEntity>>(
    getRepositoryToken(GuideEntity),
  );
  let guidesCreated = 0;
  for (const g of guidesData) {
    const existing = await guideRepo.findOne({
      where: { full_name: g.fullName },
    });
    if (!existing) {
      await guideRepo.save(
        guideRepo.create({
          id: crypto.randomUUID(),
          full_name: g.fullName,
          location: g.location,
          specialty: g.specialty,
          rating: g.rating,
          photo_url: g.photoUrl,
          details: g.details,
        }),
      );
      guidesCreated++;
    }
  }
  console.log(`  ✅ Guías cargados: ${guidesCreated} nuevos.`);

  const siteRepo = app.get<Repository<SiteEntity>>(
    getRepositoryToken(SiteEntity),
  );
  let sitesCreated = 0;
  for (const s of sitesData) {
    const existing = await siteRepo.findOne({ where: { name: s.name } });
    if (!existing) {
      const entity = siteRepo.create({
        id: crypto.randomUUID(),
        name: s.name,
        department: s.department,
        rating: s.rating,
        description: s.description,
        location: {
          type: 'Point',
          coordinates: s.location.coordinates,
        },
      });
      await siteRepo.save(entity);
      sitesCreated++;
    }
  }
  console.log(`  ✅ Sitios cargados: ${sitesCreated} nuevos.`);

  // Verificación final de conteo de tablas
  console.log('\n====================================================');
  console.log('📊 REPORTE FINAL DE TABLAS EN NEON:');
  console.log('====================================================');
  const verifyClient = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await verifyClient.connect();
  try {
    const tablesRes = await verifyClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    for (const row of tablesRes.rows) {
      const countRes = await verifyClient.query(
        `SELECT COUNT(*) as total FROM "${row.table_name}"`,
      );
      console.log(
        `  • ${row.table_name.padEnd(25)} : ${countRes.rows[0].total} registros`,
      );
    }
  } finally {
    await verifyClient.end();
  }

  await app.close();
  console.log('\n🎉 ¡PROCESO DE INICIALIZACIÓN COMPLETADO CON ÉXITO!');
}

runSetup().catch((err) => {
  console.error('\n❌ ERROR CRÍTICO EN SETUP DE NEON:', err);
  process.exit(1);
});
