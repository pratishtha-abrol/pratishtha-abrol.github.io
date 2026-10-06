// Fails if dist/ contains a bracketed all-caps placeholder like [YOUR PRICE].
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PLACEHOLDER = /\[[A-Z][A-Z0-9 \-—·/,.'’]*[A-Z]\]/;
const hits = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(html|xml|txt|json|svg|css|js)$/.test(name)) {
      const m = readFileSync(path, 'utf8').match(PLACEHOLDER);
      if (m) hits.push(`${path}: ${m[0]}`);
    }
  }
}

try {
  walk('dist');
} catch {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

if (hits.length) {
  console.error('Placeholder text found in dist/:\n' + hits.join('\n'));
  process.exit(1);
}
console.log('check:placeholders passed.');
