const { Client } = require('pg');

async function fix() {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: 'postgres',
    database: 'aviturismo_db'
  });
  
  await client.connect();
  console.log('Connected to DB');
  
  await client.query('CREATE EXTENSION IF NOT EXISTS postgis;');
  console.log('PostGIS extension created successfully');
  
  await client.end();
}

fix().catch(console.error);
