import fs from 'fs';
import Database from 'better-sqlite3';

// 1. Capturar los argumentos
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ ERROR: Debes proporcionar un término de búsqueda.');
  process.exit(1);
}

const rawSearch = args.join(' ');
const DB_PATH = './docs/brain.sqlite';

if (!fs.existsSync(DB_PATH)) {
  // En lugar de lanzar un error que asuste al agente, le damos un JSON amigable
  console.log(JSON.stringify({ 
    status: "empty_project", 
    message: "El Cerebro Central no existe o el proyecto es nuevo. No hay componentes previos. Eres libre de diseñar la arquitectura y crear los componentes desde cero bajo las directivas de Antigravity." 
  }, null, 2));
  process.exit(0);
}

// 2. Extraer palabras clave (Ignorar palabras cortas como 'el', 'la', 'de', 'para')
let keywords = rawSearch.split(/\s+/).filter(word => word.length > 3);
if (keywords.length === 0) {
  keywords = [rawSearch]; // Fallback si la búsqueda era muy corta
}

const db = new Database(DB_PATH, { readonly: true });

try {
  // 3. Construir consulta dinámica (Busca si ALGUNA de las palabras clave existe)
  const conditions = keywords.map(() => `(name LIKE ? OR description LIKE ? OR file_path LIKE ?)`).join(' OR ');
  
  // Aplanar el arreglo de parámetros (3 por cada palabra clave)
  const queryParams = keywords.flatMap(k => [`%${k}%`, `%${k}%`, `%${k}%`]);

  const stmt = db.prepare(`
    SELECT domain, type, name, description, file_path 
    FROM knowledge_nodes 
    WHERE ${conditions}
    ORDER BY type ASC
    LIMIT 20
  `);

  const results = stmt.all(...queryParams);

  // 4. Entregar output a la IA
  console.log(`\n--- 🧠 INICIO DE CONTEXTO RECUPERADO PARA: "${rawSearch}" ---\n`);
  
  if (results.length === 0) {
    console.log(JSON.stringify({ 
      status: "not_found", 
      message: "No existen componentes o estilos con esas palabras clave. Eres libre de crearlos." 
    }, null, 2));
  } else {
    // Eliminar duplicados si la consulta OR trajo el mismo archivo por varias palabras
    const uniqueResults = [...new Map(results.map(item => [item.name, item])).values()];
    
    console.log(JSON.stringify({
      status: "success",
      keywords_used: keywords,
      count: uniqueResults.length,
      items: uniqueResults
    }, null, 2));
  }
  
  console.log(`\n--- FIN DE CONTEXTO RECUPERADO ---\n`);

} catch (error) {
  console.error('❌ Error al consultar el cerebro:', error.message);
} finally {
  db.close();
}