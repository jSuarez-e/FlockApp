/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-floating-promises */
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

async function seed() {
  const jsonPath = path.resolve(
    __dirname,
    '../frontend/src/assets/db/db-aves.json',
  );
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  const dbTarget = process.env.DB_TARGET || 'auto';
  const databaseUrl = process.env.DATABASE_URL;
  const useNeon =
    dbTarget === 'neon' || (dbTarget !== 'local' && Boolean(databaseUrl));

  const client = new Client(
    useNeon && databaseUrl
      ? {
          connectionString: databaseUrl,
          ssl: { rejectUnauthorized: false },
        }
      : {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5433', 10),
          user: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_DATABASE || 'aviturismo_db',
        },
  );

  await client.connect();

  try {
    for (const table of data.tables) {
      if (!table.values || table.values.length === 0) continue;

      let tableName = table.name;
      if (tableName === 'beak_morphology') tableName = 'beak_morphologies';
      if (tableName === 'wing_morphology') tableName = 'wing_morphologies';
      if (tableName === 'leg_morphology') tableName = 'leg_morphologies';
      if (tableName === 'tail_morphology') tableName = 'tail_morphologies';

      if (tableName === 'users' || tableName === 'sightings') continue; // Don't seed users and sightings

      const columns: string[] = [];
      const validIndices: number[] = [];

      table.schema.forEach((s: any, idx: number) => {
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

      console.log(`Inserting ${table.values.length} rows into ${tableName}...`);
      let inserted = 0;
      for (const row of table.values) {
        // Build values mapped
        const values = validIndices.map((idx) => {
          let v = row[idx];
          const colName = columns[validIndices.indexOf(idx)];
          if (colName === 'sql_deleted') return v === 1;
          if (colName === 'last_modified') {
            return new Date(v * 1000).toISOString();
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
            )
              return '-';
            return null;
          }
          if (typeof v === 'string') return v;
          return v;
        });

        const placeholders = values
          .map((_: any, i: number) => `$${i + 1}`)
          .join(', ');
        const quotedCols = columns.map((c) => `"${c}"`).join(', ');
        const query = `INSERT INTO "${tableName}" (${quotedCols}) VALUES (${placeholders}) ON CONFLICT (id) DO NOTHING`;

        try {
          await client.query(query, values);
          inserted++;
        } catch (e: any) {
          console.error(`Error in ${tableName} with query: ${query}`);
          console.error(e.message);
          break; // Stop on first error in table to see what it is
        }
      }
      console.log(`Successfully inserted ${inserted} rows into ${tableName}.`);
    }
  } catch (err) {
    console.error('Error seeding', err);
  } finally {
    await client.end();
  }
}

seed();
