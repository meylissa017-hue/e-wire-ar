import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets');

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto('http://127.0.0.1:8777/e-wire-ar/tools/compile-marker.html');

const [download] = await Promise.all([
  page.waitForEvent('download', { timeout: 120000 }),
  page.click('#btnCompile')
]);

const path = join(assetsDir, 'marker.mind');
await download.saveAs(path);
console.log('Saved', path);
await browser.close();
