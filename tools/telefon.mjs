// Periksa halaman yang sedang terbuka dalam Chrome pada telefon Android (melalui USB).
// Sediakan dahulu:  adb reverse tcp:8765 tcp:8765
//                   adb forward tcp:9222 localabstract:chrome_devtools_remote
// Guna: node tools/telefon.mjs "<ungkapan JS>"   (lalai: status video kamera + penjejakan)
import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const pages = browser.contexts().flatMap((c) => c.pages());
const page = pages.find((p) => p.url().includes('localhost:8765'));
if (!page) { console.log('Tiada tab localhost:8765. Tab:', pages.map((p) => p.url())); process.exit(1); }
page.on('console', (m) => console.log('[konsol]', m.type(), m.text()));

const lalai = `(() => {
  const v = document.querySelector('#ar video');
  const c = document.querySelector('#ar canvas');
  let cerah = null;
  if (v && v.videoWidth) {
    const k = document.createElement('canvas'); k.width = 32; k.height = 32;
    const g = k.getContext('2d'); g.drawImage(v, 0, 0, 32, 32);
    const d = g.getImageData(0, 0, 32, 32).data; let j = 0;
    for (let i = 0; i < d.length; i += 4) j += d[i] + d[i + 1] + d[i + 2];
    cerah = Math.round(j / (d.length / 4) / 3);
  }
  return {
    url: location.href,
    video: v ? { w: v.videoWidth, h: v.videoHeight, sedia: v.readyState, jeda: v.paused, gaya: v.style.cssText } : null,
    kanvas: c ? { w: c.width, h: c.height } : null,
    kecerahanPurata: cerah,
    kelasBadan: document.body.className,
    dikesan: !!document.querySelector('.skrin.aktif.dikesan'),
    status: (document.getElementById('pamer-status') || {}).textContent,
  };
})()`;
console.log(JSON.stringify(await page.evaluate(process.argv[2] || lalai), null, 1));
await browser.close();
