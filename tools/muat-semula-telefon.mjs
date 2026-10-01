import { chromium } from 'playwright';
const b = await chromium.connectOverCDP('http://127.0.0.1:9222');
const p = b.contexts().flatMap((c) => c.pages()).find((x) => x.url().includes('localhost:8765'));
if (!p) { console.log('tiada tab localhost pada telefon'); process.exit(0); }
const s = await p.context().newCDPSession(p);
await s.send('Network.enable');
await s.send('Network.setCacheDisabled', { cacheDisabled: true });
await p.reload();
await p.waitForTimeout(3000);
console.log('dimuat semula:', p.url());
await b.close();
