import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const script = source.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/);
const css = source.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/);
if (!script || !css) throw new Error('Execute npm run build antes de gerar o arquivo independente.');
const js = (await readFile(resolve(root, 'dist', script[1].replace(/^\//, '')), 'utf8')).replace(/<\/script/gi, '<\\/script');
const style = await readFile(resolve(root, 'dist', css[1].replace(/^\//, '')), 'utf8');
const html = source.replace(script[0], () => '<script type="module">' + js + '</script>').replace(css[0], () => '<style>' + style + '</style>');
await mkdir(resolve(root, 'artifacts'), { recursive: true });
await writeFile(resolve(root, 'artifacts/blue-lock-lab.html'), html);
console.log('Arquivo independente atualizado: artifacts/blue-lock-lab.html');
