const { Client } = require('pg');

async function check() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'aviturismo_db',
    password: 'postgres',
    port: 5433,
  });

  await client.connect();
  const res = await client.query("SELECT email, password FROM users");
  console.log('ALL DB USERS:');
  res.rows.forEach(r => console.log(r));
  await client.end();
}

check().catch(console.error);
