import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const assetsDir = fileURLToPath(
  new URL('../apps/storefront/dist/assets/', import.meta.url),
);
const files = await readdir(assetsDir);
const marker = 'NGG_E2E_FAKE_AUTH_TOKEN';

for (const file of files.filter((name) => name.endsWith('.js'))) {
  const contents = await readFile(resolve(assetsDir, file), 'utf8');
  if (contents.includes(marker)) {
    throw new Error(`Production bundle contains fake-auth code: ${file}`);
  }
}

console.log('Production bundle excludes the E2E fake-auth marker.');
