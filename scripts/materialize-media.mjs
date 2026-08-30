import {readdir, readFile, writeFile, mkdir} from 'node:fs/promises';
import {join} from 'node:path';

const assets = ['media.bin', 'voice10.m4a', 'voice11.m4a'];
await mkdir('public', {recursive: true});
for (const name of assets) {
  const dir = join('encoded-assets', name);
  const parts = (await readdir(dir)).filter((x) => x.endsWith('.txt')).sort();
  let encoded = '';
  for (const part of parts) encoded += await readFile(join(dir, part), 'utf8');
  await writeFile(join('public', name), Buffer.from(encoded, 'base64'));
}
console.log(`Materialized ${assets.length} media assets into public/`);
