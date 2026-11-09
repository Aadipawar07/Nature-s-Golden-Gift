import { readFile, readdir, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const assetsDirectory = new URL(
  '../apps/storefront/dist/assets/',
  import.meta.url,
);
const sizeLimitBytes = 110_000;
const entries = await readdir(assetsDirectory);
const assets = [];

for (const entry of entries) {
  if (!entry.endsWith('.js')) {
    continue;
  }

  const assetUrl = new URL(entry, assetsDirectory);
  const file = await stat(assetUrl);
  if (file.isFile()) {
    assets.push({ name: entry, url: assetUrl });
  }
}

if (assets.length === 0) {
  throw new Error('No JavaScript assets found in apps/storefront/dist/assets.');
}

let compressedBytes = 0;
for (const asset of assets) {
  const contents = await readFile(asset.url);
  compressedBytes += gzipSync(contents).length;
}

const compressedKilobytes = compressedBytes / 1000;
console.log(
  `Storefront JavaScript gzip size: ${compressedKilobytes.toFixed(2)} kB`,
);

if (compressedBytes > sizeLimitBytes) {
  throw new Error(
    `Storefront JavaScript gzip size exceeds the 110 kB budget by ${((compressedBytes - sizeLimitBytes) / 1000).toFixed(2)} kB.`,
  );
}
