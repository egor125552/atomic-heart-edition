import { readFile, writeFile, unlink } from 'node:fs/promises';

const parts = await Promise.all([
  readFile(new URL('./test-parts/manual-1.mjs.txt', import.meta.url), 'utf8'),
  readFile(new URL('./test-parts/manual-2.mjs.txt', import.meta.url), 'utf8')
]);
const generated = new URL('./.manual-playthrough.generated.mjs', import.meta.url);
await writeFile(generated, parts.join('\n'), 'utf8');
try {
  await import(`${generated.href}?run=${Date.now()}`);
} finally {
  await unlink(generated).catch(() => {});
}
