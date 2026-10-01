// scripts/run-brain.mjs
import fs from 'fs';
import Database from 'better-sqlite3';

const DB_PATH = './docs/brain.sqlite';
const QUERY_FILE = './scripts/init-brain.sql';

if (!fs.existsSync(QUERY_FILE)) {
    console.error('❌ Crea un archivo llamado "init-brain.sql" en la carpeta scripts/ y pega ahí tu SQL.');
    process.exit(1);
}

const db = new Database(DB_PATH);
const sql = fs.readFileSync(QUERY_FILE, 'utf8');

try {
    // Usamos exec() para permitir múltiples sentencias (múltiples INSERTs)
    db.exec(sql);
    console.log('✅ Conocimiento inyectado/consultado en el cerebro con éxito.');
} catch (error) {
    console.error('❌ Error ejecutando la consulta:', error.message);
} finally {
    db.close();
}