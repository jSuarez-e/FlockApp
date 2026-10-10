/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Client, QueryResult } from 'pg';

/**
 * @description Función para revisar contadores básicos en base de datos.
 */
async function check(): Promise<void> {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: 'postgres',
    database: 'aviturismo_db',
  });

  await client.connect();

  try {
    const res1 = (await client.query(
      'SELECT COUNT(*) FROM birds;',
    )) as QueryResult<{ count: string }>;
    console.log('Total birds:', res1.rows[0].count);
    const res2 = (await client.query(
      'SELECT COUNT(*) FROM departments;',
    )) as QueryResult<{ count: string }>;
    console.log('Total departments:', res2.rows[0].count);
  } catch (err) {
    console.error('Error', err);
  } finally {
    await client.end();
  }
}

void check();
