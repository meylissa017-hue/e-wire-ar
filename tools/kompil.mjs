// Kompil penanda/poster.png + penanda/corak.png -> penanda/penanda.mind
// Guna: (pelayan setempat pada port 8765 di akar projek)  node tools/kompil.mjs
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const akar = join(dirname(fileURLToPath(import.meta.url)), '..');
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', (m) => console.log('[halaman]', m.text()));
await page.goto('http://127.0.0.1:8765/tools/kompil-penanda.html');
await page.waitForFunction(() => /^(SIAP|RALAT)/.test(document.getElementById('log').textContent), null, { timeout: 600000 });
const teks = await page.textContent('#log');
console.log(teks);
if (teks.startsWith('SIAP')) {
  const data = await page.evaluate(() => window.__mind);
  writeFileSync(join(akar, 'penanda', 'penanda.mind'), Buffer.from(data));
  console.log('Disimpan penanda/penanda.mind', data.length);
}
await browser.close();
