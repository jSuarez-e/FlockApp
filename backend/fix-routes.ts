/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Client, QueryResult } from 'pg';

/**
 * @description Script to fix routes counts.
 */
async function fix(): Promise<void> {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: 'postgres',
    database: 'aviturismo_db',
  });

  await client.connect();

  try {
    const res = (await client.query(
      'SELECT COUNT(*) FROM routes;',
    )) as QueryResult<{ count: string }>;
    console.log('Total routes in Postgres:', res.rows[0].count);
  } catch (err) {
    console.error('Error updating routes', err);
  } finally {
    await client.end();
  }
}

void fix();
