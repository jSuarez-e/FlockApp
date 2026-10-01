// scripts/setup-brain.mjs
import fs from 'fs';
import Database from 'better-sqlite3';

const DB_PATH = './docs/brain.sqlite';
const SQL_SCHEMA = './scripts/init-brain.sql';

if (!fs.existsSync(SQL_SCHEMA)) {
    console.error('❌ Archivo init-brain.sql no encontrado. Verifica la ruta.');
    process.exit(1);
}

try {
    const db = new Database(DB_PATH);
    const schema = fs.readFileSync(SQL_SCHEMA, 'utf8');
    
    db.exec(schema);
    console.log('🧠 Cerebro Central (Knowledge Graph) inicializado exitosamente en docs/brain.sqlite');
    db.close();
} catch (error) {
    console.error('❌ Error al inicializar el cerebro:', error);
}