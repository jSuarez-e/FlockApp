import fs from 'fs';
import path from 'path';

const SRC = path.resolve('frontend/src');

const COLOR_MAP = [
  // Medals
  { regex: /background:\s*linear-gradient\(135deg,\s*#ffb75e,\s*#ed8f03\);?/gi, token: 'background: var(--flock-medal-gold);' },
  { regex: /background:\s*linear-gradient\(135deg,\s*#e0eafc,\s*#cfdef3\);?/gi, token: 'background: var(--flock-medal-silver);' },
  { regex: /background:\s*linear-gradient\(135deg,\s*#f6d365,\s*#fda085\);?/gi, token: 'background: var(--flock-medal-bronze);' },
  { regex: /background:\s*linear-gradient\(135deg,\s*#a18cd1,\s*#fbc2eb\);?/gi, token: 'background: var(--flock-medal-platinum);' },
  { regex: /#2c3e50\b/gi, token: 'var(--flock-foreground)' },

  // Remaining specific colors
  { regex: /#84cc16\b/gi, token: 'var(--flock-primary-tint)' },
  { regex: /#f97316\b/gi, token: 'var(--flock-accent-gold)' },
  { regex: /#ffc409\b/gi, token: 'var(--flock-accent-gold)' },
  { regex: /#444\b/gi, token: 'var(--flock-foreground)' },
  { regex: /#f0f4f8\b/gi, token: 'var(--flock-background)' },
  { regex: /#f1f9f7\b/gi, token: 'var(--flock-verified-bg)' },
  { regex: /#eef2ff\b/gi, token: 'var(--flock-surface-subtle)' },
  { regex: /#3730a3\b/gi, token: 'var(--ion-color-secondary)' },
  { regex: /#f87171\b/gi, token: 'var(--ion-color-danger)' },
  { regex: /#dcfce7\b/gi, token: 'var(--flock-verified-bg)' },
  { regex: /#a16207\b/gi, token: 'var(--flock-accent-gold-text)' },
  { regex: /var\(--ion-text-color,\s*#333333\)/gi, token: 'var(--ion-text-color)' },
  { regex: /var\(--ion-color-secondary-shade,\s*#36abe0\)/gi, token: 'var(--ion-color-secondary)' },
  { regex: /var\(--ion-color-tertiary,\s*#7044ff\)/gi, token: 'var(--ion-color-tertiary)' },
  { regex: /linear-gradient\(135deg,\s*#f6ad55\s*0%,\s*#ed8936\s*100%\)/gi, token: 'var(--flock-gradient-btn)' },
  { regex: /#fecaca\b/gi, token: 'var(--flock-accent-gold-border)' },
  { regex: /#2f6f4e\s*50%,\s*#1e3c72\s*100%/gi, token: 'var(--flock-primary-dark) 50%, var(--ion-color-secondary) 100%' },
  { regex: /var\(--ion-color-success,\s*#2dd36f\)/gi, token: 'var(--ion-color-success)' },
  { regex: /var\(--ion-color-warning-shade,\s*#e0a800\)/gi, token: 'var(--flock-accent-gold)' },
  { regex: /#eff6ff\b/gi, token: 'var(--flock-surface-subtle)' },
  { regex: /#1d4ed8\b/gi, token: 'var(--ion-color-secondary)' },
  { regex: /#2a9d8f\b/gi, token: 'var(--flock-primary-light)' },
  { regex: /#fef3c7\b/gi, token: 'var(--flock-accent-gold-bg)' },
  { regex: /#0369a1\b/gi, token: 'var(--ion-color-secondary)' },
  { regex: /#075985\b/gi, token: 'var(--ion-color-secondary)' },
  { regex: /#0ea5e9\b/gi, token: 'var(--ion-color-secondary)' },
  { regex: /#5c2e7e\b/gi, token: 'var(--ion-color-tertiary)' },
  { regex: /#166534\b/gi, token: 'var(--flock-primary)' },
  { regex: /var\(--ion-color-success-shade,\s*#28ba62\)/gi, token: 'var(--ion-color-success)' },
  { regex: /#6ee7b7\b/gi, token: 'var(--flock-primary-tint)' },
  { regex: /var\(--avitour-primary-shade,\s*#0e733e\)/gi, token: 'var(--flock-primary)' },
  { regex: /#3b3939\b/gi, token: 'var(--flock-foreground)' },
  { regex: /#f7f6f6\b/gi, token: 'var(--flock-surface-subtle)' },
  { regex: /#757575\b/gi, token: 'var(--flock-muted-foreground)' }
];

function findScssFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'theme') {
        results = results.concat(findScssFiles(full));
      }
    } else if (file.endsWith('.scss')) {
      results.push(full);
    }
  }
  return results;
}

const files = findScssFiles(SRC);
let totalReplacements = 0;
let filesModified = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  let fileReplacements = 0;

  for (const { regex, token } of COLOR_MAP) {
    const matches = content.match(regex);
    if (matches) {
      fileReplacements += matches.length;
      content = content.replace(regex, token);
    }
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    filesModified++;
    totalReplacements += fileReplacements;
    console.log(`Updated ${path.relative(SRC, file)}: ${fileReplacements} tokens replaced.`);
  }
}

console.log(`\nMigration completed: ${totalReplacements} tokens replaced across ${filesModified} SCSS files.`);
