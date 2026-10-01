// Ujian main-habis: mainkan kelima-lima level dengan jawapan betul (mod pratonton) dan sahkan
// XP akhir 260 serta skrin Keputusan. Guna: node tools/uji-main.mjs [folder-keluaran]
import { chromium } from 'playwright';
import { join } from 'path';
import { mkdirSync } from 'fs';

const keluar = process.argv[2] || join(process.cwd(), 'uji-keluaran');
mkdirSync(keluar, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const ralat = [];
page.on('pageerror', (e) => ralat.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') ralat.push(m.text()); });

const xp = () => page.evaluate(() => document.querySelector('.skrin.aktif .bar-xp span')?.textContent || '');
const tamat = async (teksButang) => {
  await page.waitForSelector('#panel-tamat:not([hidden])', { timeout: 20000 });
  const tajuk = await page.textContent('#pt-tajuk');
  const mata = await page.textContent('#pt-xp');
  await page.click(`#pt-butang button:has-text("${teksButang}")`);
  return `${tajuk} ${mata}`;
};

await page.goto('http://127.0.0.1:8765/index.html?pratonton');
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.click('button[data-ke="level1"]');

// Level 1 — jawapan betul ikut data
const betulL1 = ['MCB', 'Suis Satu Hala', 'Soket Outlet', 'Pemegang Lampu', 'Kotak Agihan'];
for (let i = 0; i < 5; i++) {
  await page.waitForFunction((n) => document.querySelector('#s-level1 .soalan-no')?.textContent.includes(`0${n}/05`), i + 1, { timeout: 15000 });
  await page.locator('#s-level1 .butang-jawapan:not([disabled])', { hasText: new RegExp(`^[A-D]${betulL1[i]}$`) }).click();
}
console.log('L1:', await tamat('TERUSKAN'));

// Level 2 — ketik wayar, kemudian ketik terminal yang sepadan
await page.waitForSelector('#s-level2.aktif');
for (const id of ['L', 'N', 'PE']) {
  await page.click(`#s-level2 .kad-wayar[data-id="${id}"]`);
  await page.click(`#s-level2 .slot[data-id="${id}"]`);
}
console.log('L2:', await tamat('TERUSKAN'));

// Level 3 — satu cubaan salah dahulu, kemudian betul
await page.waitForSelector('#s-level3.aktif');
await page.click('#s-level3 .kad-item:has-text("Soket Outlet")');
await page.click('#s-level3 .butang-semak');
console.log('L3 salah:', await page.textContent('#s-level3 .maklum'));
await page.click('#s-level3 .kad-item:has-text("Soket Outlet")');
for (const n of ['Pemegang Lampu', 'Suis Satu Hala', 'Kabel']) await page.click(`#s-level3 .kad-item:text-is("${n}")`);
await page.click('#s-level3 .butang-semak');
console.log('L3:', await tamat('TERUSKAN'));

// Level 4 — satu cubaan salah, kemudian urutan betul
await page.waitForSelector('#s-level4.aktif');
await page.click('#s-level4 .kad-langkah[data-urutan="3"]');
await page.click('#s-level4 .slot[data-indeks="0"]');
console.log('L4 salah:', await page.textContent('#s-level4 .maklum'));
for (const u of ['0', '1', '2', '3']) {
  await page.click(`#s-level4 .kolam-kad .kad-langkah[data-urutan="${u}"]`);
  await page.click(`#s-level4 .slot[data-indeks="${u}"]`);
}
console.log('L4:', await tamat('TERUSKAN'));

// Level 5 — satu sambungan salah (terminal mesti kekal boleh diketik), kemudian betul
await page.waitForSelector('#s-level5.aktif');
await page.waitForTimeout(2500);
await page.click('#s-level5 .kad-wayar[data-id="L"]');
await page.click('#s-level5 .slot[data-id="N"]');
console.log('L5 salah:', await page.textContent('#s-level5 .maklum'));
for (const id of ['L', 'N', 'PE']) {
  await page.click(`#s-level5 .kad-wayar[data-id="${id}"]`);
  await page.click(`#s-level5 .slot[data-id="${id}"]`);
}
await page.waitForTimeout(1200);
await page.screenshot({ path: join(keluar, 'main-level5-menyala.png') });
console.log('L5:', await tamat('LIHAT KEPUTUSAN'));

await page.waitForSelector('#s-keputusan.aktif');
await page.waitForTimeout(1800);
console.log('Keputusan:', await page.textContent('#kp-xp'), '|', await page.textContent('#kp-lencana'), '|', await page.textContent('#kp-jumlah'));
await page.screenshot({ path: join(keluar, 'main-keputusan.png') });

// Kemajuan kekal selepas muat semula?
await page.goto('http://127.0.0.1:8765/index.html?pratonton&skrin=pilih');
await page.waitForTimeout(600);
console.log('Selepas muat semula:', await xp());
await page.screenshot({ path: join(keluar, 'main-pilih.png') });
console.log('Ralat:', ralat.length ? ralat : 'tiada');
await browser.close();
