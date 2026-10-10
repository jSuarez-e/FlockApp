import fs from 'fs';
import path from 'path';

function kebabToCamel(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') && !fullPath.endsWith('.spec.ts')) {
      processFile(fullPath);
    }
  }
}

function processFile(tsPath) {
  let tsContent = fs.readFileSync(tsPath, 'utf8');
  if (!tsContent.includes('IonicModule')) return;

  console.log(`Fixing ${tsPath}...`);
  
  // Find associated HTML file or inline template
  let htmlContent = '';
  const htmlPath = tsPath.replace('.ts', '.html');
  if (fs.existsSync(htmlPath)) {
    htmlContent = fs.readFileSync(htmlPath, 'utf8');
  } else {
    const templateMatch = tsContent.match(/template:\s*`([^`]+)`/);
    if (templateMatch) htmlContent = templateMatch[1];
    else {
        const templateMatch2 = tsContent.match(/template:\s*'([^']+)'/);
        if (templateMatch2) htmlContent = templateMatch2[1];
    }
  }

  // Extract all <ion-...> tags
  const ionTags = new Set();
  const regex = /<ion-([a-z-]+)(?:\s|>)/g;
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    ionTags.add('Ion' + kebabToCamel(match[1]));
  }

  // Also catch generic routing components that might not be in template
  if (tsContent.includes('ModalController')) ionTags.add('IonModal');
  if (tsContent.includes('RouterOutlet')) ionTags.add('IonRouterOutlet');

  const importsArray = Array.from(ionTags);
  if (importsArray.length === 0) {
      // If no ion components found, just remove IonicModule
      tsContent = tsContent.replace(/import\s*{\s*IonicModule[^}]*}\s*from\s*'@ionic\/angular';/g, '');
      tsContent = tsContent.replace(/IonicModule\.forRoot\(\),?/g, '');
      tsContent = tsContent.replace(/IonicModule,?/g, '');
  } else {
      const importsString = importsArray.join(', ');
      
      // Replace import statement
      tsContent = tsContent.replace(
        /import\s*{([^}]*?)IonicModule([^}]*?)}\s*from\s*'@ionic\/angular';/,
        (fullMatch, p1, p2) => {
            const otherImports = [p1, p2].join('').split(',').map(s => s.trim()).filter(s => s);
            const allImports = [...new Set([...otherImports, ...importsArray])];
            return `import { ${allImports.join(', ')} } from '@ionic/angular';`;
        }
      );

      // Replace in @Component imports array
      tsContent = tsContent.replace(/imports:\s*\[([^\]]+)\]/, (match, inner) => {
          let parts = inner.split(',').map(s => s.trim()).filter(s => s && s !== 'IonicModule' && s !== 'IonicModule.forRoot()');
          return `imports: [${[...parts, ...importsArray].join(', ')}]`;
      });
  }

  fs.writeFileSync(tsPath, tsContent, 'utf8');
}

processDirectory('./src/app');
console.log('✅ Done replacing IonicModule!');
