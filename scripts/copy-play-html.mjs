import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = join(root, 'standalone', 'index.html');
const dest = join(root, 'play.html');

if (!existsSync(source)) {
  console.error('standalone/index.html not found — run vite build --config vite.standalone.config.ts first');
  process.exit(1);
}

copyFileSync(source, dest);
console.log(`Copied ${source} → ${dest}`);
