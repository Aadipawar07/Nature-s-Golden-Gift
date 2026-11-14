import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const manifestUrl = new URL(
  '../apps/storefront/dist/.vite/manifest.json',
  import.meta.url,
);
const sizeLimitBytes = 110_000;
const entryLimitBytes = 75_000;
const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
const entry = Object.values(manifest).find(
  (asset) => asset.isEntry && asset.file.endsWith('.js'),
);
if (!entry) {
  throw new Error('Could not find the storefront entry JavaScript asset.');
}

const entryBytes = gzipSync(
  await readFile(
    new URL(`../apps/storefront/dist/${entry.file}`, import.meta.url),
  ),
).length;
const entryKilobytes = entryBytes / 1000;
console.log(`Storefront entry gzip size: ${entryKilobytes.toFixed(2)} kB`);
if (entryBytes > entryLimitBytes) {
  throw new Error(
    `Storefront entry gzip size exceeds the 75 kB budget by ${((entryBytes - entryLimitBytes) / 1000).toFixed(2)} kB.`,
  );
}

const eagerFiles = new Set();
function addStaticImports(asset) {
  if (!asset?.file.endsWith('.js') || eagerFiles.has(asset.file)) return;
  eagerFiles.add(asset.file);
  for (const dependency of asset.imports || []) {
    addStaticImports(manifest[dependency]);
  }
}

addStaticImports(entry);
let compressedBytes = 0;
for (const file of eagerFiles) {
  const contents = await readFile(
    new URL(`../apps/storefront/dist/${file}`, import.meta.url),
  );
  compressedBytes += gzipSync(contents).length;
}

const compressedKilobytes = compressedBytes / 1000;
console.log(
  `Storefront eager JavaScript gzip size: ${compressedKilobytes.toFixed(2)} kB`,
);

if (compressedBytes > sizeLimitBytes) {
  throw new Error(
    `Storefront eager JavaScript gzip size exceeds the 110 kB budget by ${((compressedBytes - sizeLimitBytes) / 1000).toFixed(2)} kB.`,
  );
}
