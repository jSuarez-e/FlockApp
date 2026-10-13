import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

const frontendRoot = path.resolve('frontend/src');
const allFiles = walk(frontendRoot);

console.log(`Auditing ${allFiles.length} files in frontend/src...`);

const tsFiles = allFiles.filter(f => f.endsWith('.ts') && !f.endsWith('.spec.ts'));
const htmlFiles = allFiles.filter(f => f.endsWith('.html'));
const scssFiles = allFiles.filter(f => f.endsWith('.scss'));

// 1. Separation check
const components = tsFiles.filter(f => f.endsWith('.component.ts') || f.endsWith('.page.ts'));
const separationIssues = [];

for (const comp of components) {
  const isPage = comp.endsWith('.page.ts');
  const base = comp.replace(/\.(component|page)\.ts$/, '');
  const kind = isPage ? '.page' : '.component';
  const htmlPath = base + kind + '.html';
  const scssPath = base + kind + '.scss';
  const content = fs.readFileSync(comp, 'utf8');

  const missingHtml = !fs.existsSync(htmlPath);
  const missingScss = !fs.existsSync(scssPath);
  const inlineTemplate = content.includes('template:') && !content.includes('templateUrl:');
  const inlineStyles = content.includes('styles:') && !content.includes('styleUrls:') && !content.includes('styleUrl:');

  if (missingHtml || missingScss || inlineTemplate || inlineStyles) {
    separationIssues.push({
      file: path.relative(process.cwd(), comp).replace(/\\/g, '/'),
      missingHtml,
      missingScss,
      inlineTemplate,
      inlineStyles
    });
  }
}

// 2. Inline style in HTML
const inlineStyleIssues = [];
for (const html of htmlFiles) {
  const content = fs.readFileSync(html, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/style\s*=\s*["'][^"']+["']/.test(line)) {
      inlineStyleIssues.push({
        file: path.relative(process.cwd(), html).replace(/\\/g, '/'),
        line: idx + 1,
        content: line.trim()
      });
    }
  });
}

// 3. Subscribes in TS (Reactive hygiene)
const subscribeIssues = [];
for (const ts of tsFiles) {
  const content = fs.readFileSync(ts, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Check for .subscribe( that is not commented out
    if (/\.subscribe\s*\(/.test(line) && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
      subscribeIssues.push({
        file: path.relative(process.cwd(), ts).replace(/\\/g, '/'),
        line: idx + 1,
        content: line.trim()
      });
    }
  });
}

// 4. Legacy Control Flow (*ngIf, *ngFor, *ngSwitch)
const legacyControlFlowIssues = [];
for (const html of htmlFiles) {
  const content = fs.readFileSync(html, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/\*(ngIf|ngFor|ngSwitchCase|ngSwitchDefault|ngSwitch)\b/.test(line)) {
      legacyControlFlowIssues.push({
        file: path.relative(process.cwd(), html).replace(/\\/g, '/'),
        line: idx + 1,
        content: line.trim()
      });
    }
  });
}

// 5. Hardcoded color literals in SCSS instead of CSS variables
const hardcodedColorIssues = [];
for (const scss of scssFiles) {
  const content = fs.readFileSync(scss, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/#[0-9a-fA-F]{3,8}\b/.test(line) && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
      // Ignore if it is in theme/variables.scss defining variables
      const relPath = path.relative(process.cwd(), scss).replace(/\\/g, '/');
      if (!relPath.includes('variables.scss')) {
        hardcodedColorIssues.push({
          file: relPath,
          line: idx + 1,
          content: line.trim()
        });
      }
    }
  });
}

// 6. Large files violating Clean Code / SRP (> 250 lines)
const largeFileIssues = [];
for (const f of [...tsFiles, ...htmlFiles, ...scssFiles]) {
  const content = fs.readFileSync(f, 'utf8');
  const lineCount = content.split('\n').length;
  if (lineCount > 250) {
    largeFileIssues.push({
      file: path.relative(process.cwd(), f).replace(/\\/g, '/'),
      lineCount
    });
  }
}

// 7. Non-BEM selectors in SCSS (e.g. tag selectors or nested IDs)
const scssNonBemIssues = [];
for (const scss of scssFiles) {
  const content = fs.readFileSync(scss, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') && !trimmed.startsWith('#{') && trimmed.includes('{')) {
      scssNonBemIssues.push({
        file: path.relative(process.cwd(), scss).replace(/\\/g, '/'),
        line: idx + 1,
        type: 'ID Selector in SCSS',
        content: trimmed
      });
    }
  });
}

const report = {
  stats: {
    totalFiles: allFiles.length,
    tsFiles: tsFiles.length,
    htmlFiles: htmlFiles.length,
    scssFiles: scssFiles.length,
    componentsCount: components.length
  },
  separationIssues,
  inlineStyleIssues,
  subscribeIssues,
  legacyControlFlowIssues,
  hardcodedColorIssues,
  largeFileIssues,
  scssNonBemIssues
};

fs.writeFileSync('docs/audits/frontend-deep-scan.json', JSON.stringify(report, null, 2));
console.log('--- AUDIT SCAN RESULTS ---');
console.log(`Separation violations: ${separationIssues.length}`);
console.log(`Inline style="" in HTML: ${inlineStyleIssues.length}`);
console.log(`.subscribe() in TS: ${subscribeIssues.length}`);
console.log(`Legacy *ngIf/*ngFor in HTML: ${legacyControlFlowIssues.length}`);
console.log(`Hardcoded color literals in SCSS: ${hardcodedColorIssues.length}`);
console.log(`Large files (>250 lines): ${largeFileIssues.length}`);
console.log(`Non-BEM ID selectors in SCSS: ${scssNonBemIssues.length}`);
