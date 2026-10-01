# E-WIRE AR — versi web

Versi pelayar bagi permainan E-WIRE AR, dibuat supaya **iPhone** boleh bermain tanpa memasang
apa-apa. Versi Android (projek Unity `E-WIRE-AR-Fresh`) kekal sebagai produk utama; kandungan
dan aliran skrin di sini sengaja disamakan dengannya.

## Kandungan

- Menu Utama, Pilih Level, Level 1–5, Keputusan
- Modul "Terokai Sistem Solar" dan "Membina Litar Elektrik"
- Penanda AR: poster E-WIRE AR (dan corak hitam-putih lama) — sama seperti versi Android

## Teknologi

- [MindAR](https://github.com/hiukim/mind-ar-js) 1.2.5 (penjejakan imej) + three.js 0.160, kedua-duanya
  disimpan dalam `vendor/` — tiada CDN diperlukan.
- **Jangan tukar kepada WebXR**: Safari iOS tidak menyokongnya.
- Tiada langkah bina: fail statik sahaja. Kamera memerlukan **HTTPS** (atau `localhost`).

## Struktur

| Laluan | Kandungan |
| --- | --- |
| `index.html`, `css/app.css` | Semua skrin dan gaya (tema di blok `:root`) |
| `js/data.js` | Soalan, label, markah — salinan `DataPermainan.cs` |
| `js/simpan.js` | Kemajuan pemain (localStorage) |
| `js/ar.js` | Kamera, penjejakan, penempatan kandungan pada skrin |
| `js/level.js` | Level 1–5 |
| `js/pamer.js` | Solar dan Litar (termasuk animasi) |
| `models/*.glb` | Model dieksport daripada `BlenderSources/*.blend` projek Unity |
| `penanda/` | `poster.png`, `corak.png` dan hasil kompil `penanda.mind` |

## Jalankan & uji di komputer

```
python -m http.server 8765 --bind 127.0.0.1      # di folder ini
```

- `http://127.0.0.1:8765/?pratonton` — paparan 3D tanpa kamera (semua skrin boleh diuji)
- `?skrin=solar` (atau `level1` … `level5`, `litar`, `pilih`, `keputusan`) — terus ke satu skrin

Skrip ujian (perlukan `npm install` dalam `tools/`, dan pelayan di atas sedang berjalan):

| Arahan | Fungsi |
| --- | --- |
| `node tools/uji.mjs <folder>` | Tangkapan skrin semua skrin + ralat konsol |
| `node tools/uji-main.mjs <folder>` | Main habis kelima-lima level, sahkan 260 XP |
| `node tools/uji-kamera.mjs <video.mjpeg> <folder>` | Penjejakan AR dengan kamera palsu |
| `node tools/kompil.mjs` | Kompil semula `penanda/penanda.mind` selepas menukar gambar penanda |
| `node tools/telefon.mjs` | Periksa tab Chrome pada telefon Android melalui USB |

## Bila versi Android berubah

- Soalan/label/markah: kemas kini `js/data.js`.
- Model 3D: eksport semula `.blend` ke `models/*.glb` (glTF, +Y ke atas, objek mesh + empty).
- Poster/penanda: ganti `penanda/poster.png`, kemudian `node tools/kompil.mjs`.
