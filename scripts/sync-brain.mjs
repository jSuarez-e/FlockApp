import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import Database from 'better-sqlite3';

const DB_PATH = './docs/brain.sqlite';
// Puedes ajustar TARGET_DIRS según tu estructura de carpetas (monorepo o polyrepo)
const TARGET_DIRS = ['./frontend/src', './backend/src', './shared', './mobile-plugins']; 

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS knowledge_nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT,
    type TEXT,
    name TEXT UNIQUE,
    description TEXT,
    file_path TEXT,
    file_hash TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Query para insertar o actualizar el conocimiento
const insertNode = db.prepare(`
  INSERT INTO knowledge_nodes (domain, type, name, description, file_path, file_hash) 
  VALUES (?, ?, ?, ?, ?, ?)
  ON CONFLICT(name) DO UPDATE SET 
  type = excluded.type,
  description = excluded.description,
  file_path = excluded.file_path,
  file_hash = excluded.file_hash,
  updated_at = CURRENT_TIMESTAMP
`);

const getHash = db.prepare(`SELECT file_hash FROM knowledge_nodes WHERE name = ?`);

function getFileHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

// ==========================================
// PARSER ESTRUCTURAL LOCAL (0% LLM, 100% VELOCIDAD)
// ==========================================
function analyzeFileLocally(content, fileName, domain) {
  // 1. Deducir el Tipo (Type)
  let type = 'Archivo';
  if (fileName.includes('.service.')) type = 'Service';
  else if (fileName.includes('.component.')) type = 'Component';
  else if (fileName.includes('.controller.')) type = 'Controller';
  else if (fileName.includes('.module.')) type = 'Module';
  else if (fileName.includes('.entity.') || fileName.includes('.model.')) type = 'Entity';
  else if (fileName.includes('.dto.')) type = 'DTO';
  else if (fileName.includes('.scss') || fileName.includes('.css')) type = 'Stylesheet';
  else if (fileName.includes('.guard.')) type = 'Guard';
  else if (fileName.includes('.html')) type = 'Template';

  // 2. Extraer el Nombre de la Clase/Interfaz/Archivo (Name)
  let name = fileName;
  const classMatch = content.match(/export\s+(?:class|interface|enum|const|type)\s+(\w+)/);
  if (classMatch) name = classMatch[1];

  // 3. MAGIA AQUÍ: Buscar el bloque @sdd escrito por el Agente (Prioridad 1)
  let description = "";
  // Soporta comentarios JSDoc (*/), CSS (*/) y HTML (-->)
  const sddMatch = content.match(/@sdd([\s\S]*?)(?:\*\/|-->)/);
  
  if (sddMatch) {
    // Limpiamos los asteriscos de inicio de línea que dejan los JSDoc y espacios extras
    description = sddMatch[1]
      .split('\n')
      .map(line => line.replace(/^\s*\*\s?/, '').trim()) // Quita el " * " al inicio de cada línea
      .filter(line => line.length > 0)
      .join('\n');
  } else {
    // 4. Fallback Estructural para archivos viejos sin firma @sdd (Prioridad 2)
    const imports = [...content.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(m => m[1].split('/').pop());
    const uniqueImports = [...new Set(imports)].slice(0, 6).join(', ');
    description = `[Objetivo]: ${type} estructural.\n[I/O]: Dependencias: ${uniqueImports || 'Ninguna'}.\n[Edge Cases]: Indexado localmente sin firma @sdd.`;
  }

  return { type, name, description };
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      await processDirectory(fullPath);
    } 
    else if (
      // Extensiones agnósticas (Front, Back, Estilos, Templates)
      fullPath.match(/\.(ts|tsx|css|scss|html|java|kt|cs|py)$/) && 
      !fullPath.endsWith('.spec.ts') && 
      !fullPath.endsWith('.d.ts')
    ) {
      await processFile(fullPath);
    }
  }
}

async function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.trim().length === 0) return;

  const normalizedPath = filePath.replace(/\\/g, '/');
  
  // Asignación de dominio agnóstica basada en el path
  let domain = 'Shared';
  if (normalizedPath.includes('frontend') || normalizedPath.includes('client') || normalizedPath.includes('ui')) domain = 'Frontend';
  else if (normalizedPath.includes('backend') || normalizedPath.includes('server') || normalizedPath.includes('api')) domain = 'Backend';

  const fileName = path.basename(filePath);
  const currentHash = getFileHash(content);
  
  // Analizamos rápidamente el archivo de forma local
  const aiData = analyzeFileLocally(content, fileName, domain);
  const existingRecord = getHash.get(aiData.name);
  
  // Caché por Hash: Si el archivo no fue modificado, lo saltamos
  if (existingRecord && existingRecord.file_hash === currentHash) {
    console.log(`⏩ Omitido (Sin cambios): ${aiData.name}`);
    return;
  }

  if (aiData.name && aiData.description) {
    try {
      insertNode.run(
        domain, 
        aiData.type, 
        aiData.name, 
        aiData.description, 
        normalizedPath,
        currentHash
      );
      console.log(`⚡ Indexado Local [${aiData.type}]: ${aiData.name}`);
    } catch (e) {
      console.error(`❌ Error guardando en BD ${aiData.name}:`, e.message);
    }
  }
}

// Ejecución Principal
(async () => {
  console.log('🔄 Iniciando Sincronización Estructural de Alta Velocidad...');
  
  try {
    db.exec('BEGIN TRANSACTION');
    
    for (const dir of TARGET_DIRS) {
      if (fs.existsSync(dir)) {
        await processDirectory(dir);
      } else {
        console.warn(`⚠️ Directorio no encontrado, omitiendo: ${dir}`);
      }
    }

    db.exec('COMMIT');
    console.log('✅ Sincronización instantánea completada. El RAG está actualizado.');
  } catch (error) {
    db.exec('ROLLBACK');
    console.error('❌ Error crítico durante la sincronización:', error);
  } finally {
    db.close();
  }
})();