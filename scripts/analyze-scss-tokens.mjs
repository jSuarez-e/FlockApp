import fs from 'fs';
import path from 'path';

const SRC = path.resolve('frontend/src');

function findScssFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'theme') { // exclude theme definitions
        results = results.concat(findScssFiles(full));
      }
    } else if (file.endsWith('.scss')) {
      results.push(full);
    }
  }
  return results;
}

const files = findScssFiles(SRC);
const colorCounts = {};
const fileColorCounts = {};

const hexRegex = /#([0-9a-fA-F]{3,8})\b/g;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(SRC, file);
  const matches = content.match(hexRegex);
  if (matches) {
    fileColorCounts[rel] = matches.length;
    for (const m of matches) {
      const lower = m.toLowerCase();
      colorCounts[lower] = (colorCounts[lower] || 0) + 1;
    }
  }
}

const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
const sortedFiles = Object.entries(fileColorCounts).sort((a, b) => b[1] - a[1]);

console.log('--- TOP 25 HARDCODED COLORS IN SCSS ---');
sortedColors.slice(0, 25).forEach(([c, count]) => {
  console.log(`${c}: ${count}`);
});

console.log('\n--- TOP 15 FILES WITH HARDCODED COLORS ---');
sortedFiles.slice(0, 15).forEach(([f, count]) => {
  console.log(`${f}: ${count}`);
});
console.log(`\nTotal SCSS files with hardcoded colors: ${sortedFiles.length}`);
console.log(`Total occurrences: ${Object.values(colorCounts).reduce((a, b) => a + b, 0)}`);
