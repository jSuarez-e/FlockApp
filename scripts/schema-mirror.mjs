import fs from 'fs';
import path from 'path';

// Archivo Fuente (Frontend - SQLite)
const INIT_QUERIES_PATH = path.resolve('frontend/src/app/core/db/init-queries.ts');
// Directorio Destino (Backend - Postgres)
const ENTITIES_OUT_DIR = path.resolve('backend/src/infrastructure/entities');

console.log('🔄 Iniciando el Motor de Cero Asimetría (Schema Mirror)...');

if (!fs.existsSync(INIT_QUERIES_PATH)) {
  console.error('❌ Archivo init-queries.ts no encontrado.');
  process.exit(1);
}

const sqlContent = fs.readFileSync(INIT_QUERIES_PATH, 'utf-8');

// Patrón para interceptar todas las creaciones de tabla
const tableRegex = /CREATE TABLE IF NOT EXISTS\s+([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\);/g;
let match;

function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

function toPascalCase(str) {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function singularize(word) {
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('tuses')) return word.slice(0, -2);
  if (word.endsWith('ses') && !word.endsWith('uses')) return word.slice(0, -2);
  if (word.endsWith('s')) return word.slice(0, -1);
  return word;
}

let generatedCount = 0;

while ((match = tableRegex.exec(sqlContent)) !== null) {
  const tableName = match[1];
  const columnsBlock = match[2];
  
  const entityName = toPascalCase(singularize(tableName)) + 'Entity';
  
  // Limpiamos las restricciones y nos quedamos con las columnas
  const lines = columnsBlock
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('FOREIGN KEY') && !l.startsWith('PRIMARY KEY') && !l.startsWith('UNIQUE') && !l.startsWith('--'));
    
  let entityClass = `/**\n * @sdd\n * @description [AUTO-GENERATED] Reflejo estricto de la tabla '${tableName}' desde SQLite (Frontend) a TypeORM (Backend).\n * @io Garantiza Asimetría Cero en el flujo Offline-First.\n */\n`;
  entityClass += `import { Entity, PrimaryColumn, Column } from 'typeorm';\n`;
  entityClass += `import { ApiProperty } from '@nestjs/swagger';\n\n`;
  entityClass += `@Entity('${tableName}')\n`;
  entityClass += `export class ${entityName} {\n`;
  
  for (const line of lines) {
    // Ejemplo de línea: id INTEGER PRIMARY KEY NOT NULL,
    let cleanLine = line.replace(/,/g, '').replace(/\s+/g, ' ');
    const parts = cleanLine.split(' ');
    
    if (parts.length < 2) continue;
    
    const colName = parts[0];
    const colTypeRaw = parts[1].toUpperCase();
    
    let tsType = 'string';
    let ormType = 'text';
    
    if (colTypeRaw.includes('INT')) { tsType = 'number'; ormType = 'int'; }
    else if (colTypeRaw.includes('REAL') || colTypeRaw.includes('FLOAT') || colTypeRaw.includes('DOUBLE')) { tsType = 'number'; ormType = 'float'; }
    else if (colTypeRaw.includes('BOOL')) { tsType = 'boolean'; ormType = 'boolean'; }
    else if (colTypeRaw.includes('CHAR') || colTypeRaw.includes('TEXT')) { tsType = 'string'; ormType = colTypeRaw.includes('VARCHAR') ? 'varchar' : 'text'; }
    
    const isPrimary = cleanLine.includes('PRIMARY KEY');
    const isNullable = !cleanLine.includes('NOT NULL');
    
    entityClass += `  @ApiProperty({ description: 'Columna autogenerada: ${colName}' })\n`;
    
    if (isPrimary) {
      if (tsType === 'number') {
        entityClass += `  @PrimaryColumn({ type: '${ormType}' })\n`;
      } else {
        entityClass += `  @PrimaryColumn({ type: 'varchar', length: 255 })\n`;
      }
    } else {
      entityClass += `  @Column({ type: '${ormType}'${isNullable ? ', nullable: true' : ''} })\n`;
    }
    
    entityClass += `  ${colName}: ${tsType};\n\n`;
  }
  
  entityClass += `}\n`;
  
  // Archivo de salida
  const fileName = singularize(tableName).replace(/_/g, '-') + '.entity.ts';
  const outPath = path.join(ENTITIES_OUT_DIR, fileName);
  
  // Excepciones: No sobreescribir las relaciones avanzadas que ya se configuraron manualmente (ej: UserRole).
  // Solo sobreescribe entidades planas de SQLite o las crea.
  if (fs.existsSync(outPath) && (fileName === 'user.entity.ts' || fileName === 'route-sighting.entity.ts')) {
     console.log(`⏩ [${entityName}] Ignorada (Contiene lógica compleja personalizada).`);
     continue;
  }
  
  fs.writeFileSync(outPath, entityClass);
  console.log(`✅ [${entityName}] Reconstruida exitosamente.`);
  generatedCount++;
}

console.log(`\n🚀 Operación completada: ${generatedCount} entidades sincronizadas. Cero Asimetría lograda.`);
