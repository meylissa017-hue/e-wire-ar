// Ujian penjejakan AR di komputer: Chrome diberi "kamera palsu" yang memainkan gambar poster,
// jadi MindAR patut mengesan penanda dan kandungan 3D patut muncul.
// Guna: node tools/uji-kamera.mjs <fail.mjpeg> <folder-keluaran> [skrin,skrin…]
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const [, , video, keluar, senarai] = process.argv;
mkdirSync(keluar, { recursive: true });
const skrin = (senarai || 'level1,level5,solar,litar').split(',');

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--enable-unsafe-swiftshader', '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream', `--use-file-for-fake-video-capture=${video}`],
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, permissions: ['camera'] });
for (const s of skrin) {
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') console.log(`[${s}] konsol:`, m.text()); });
  page.on('pageerror', (e) => console.log(`[${s}] ralat:`, e.message));
  await page.goto(`${process.env.ASAS || 'http://127.0.0.1:8765'}/index.html?skrin=${s}`);
  let dikesan = false;
  for (let i = 0; i < 40 && !dikesan; i++) {
    await page.waitForTimeout(500);
    dikesan = await page.evaluate(() => !!document.querySelector('.skrin.aktif.dikesan'));
  }
  await page.waitForTimeout(2500);
  const mod = await page.evaluate(() => document.body.className);
  console.log(`${s}: dikesan=${dikesan} badan="${mod}"`);
  await page.screenshot({ path: join(keluar, `kamera-${s}.png`) });
  await page.close();
}
await browser.close();
