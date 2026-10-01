// Kandungan permainan E-WIRE AR — SALINAN daripada versi Android
// (Assets/Scripts/Data/DataPermainan.cs dalam projek Unity). Kalau soalan, label atau markah
// diubah di sana, ubah di sini juga supaya kedua-dua versi kekal sama.

export const XP = { L1_SETIAP_SOALAN: 10, L2: 30, L3: 30, L4: 50, L5: 100 };
export const AMBANG_LEGENDA = 250;
export const JUMLAH_LEVEL = 5;
export const MASA_SETIAP_SOALAN = 20; // saat — tamat masa = jawapan salah

// Sama seperti PengurusPermainan.SEMUA_LEVEL_DIBUKA dalam versi Android.
export const SEMUA_LEVEL_DIBUKA = true;

export const TAJUK_LEVEL = ['', 'KENALI IA', 'PADANKAN IA', 'PILIH IA', 'SUSUN IA', 'WAYARKAN IA'];
export const HURAIAN_LEVEL = [
  '',
  'Imbas penanda AR, kenal pasti komponen elektrik',
  'Seret wayar ke terminal L / N / PE yang betul',
  'Pilih bahan untuk satu misi pemasangan',
  'Susun langkah pemasangan mengikut urutan',
  'Lengkapkan litar lampu satu hala dalam AR',
];

export const SOALAN_L1 = [
  { model: 'MCB', teks: 'Apakah aksesori ini?',
    pilihan: ['Soket Outlet', 'Suis', 'MCB', 'Pemegang Lampu'], betul: 2,
    penjelasan: 'MCB ialah peranti perlindungan dalam pemasangan elektrik.' },
  { model: 'Suis', teks: 'Apakah aksesori ini?',
    pilihan: ['MCB', 'Suis Satu Hala', 'Kotak Agihan', 'Soket Outlet'], betul: 1,
    penjelasan: 'Suis satu hala mengawal satu litar lampu daripada satu lokasi.' },
  { model: 'Soket', teks: 'Apakah aksesori ini?',
    pilihan: ['Pemegang Lampu', 'MCB', 'Soket Outlet', 'Kotak Agihan'], betul: 2,
    penjelasan: 'Soket outlet membekalkan kuasa kepada peralatan mudah alih.' },
  { model: 'PemegangLampu', teks: 'Apakah aksesori ini?',
    pilihan: ['Pemegang Lampu', 'Suis', 'Kotak Agihan', 'MCB'], betul: 0,
    penjelasan: 'Pemegang lampu menyambungkan mentol kepada pendawaian tetap.' },
  { model: 'KotakAgihan', teks: 'Apakah aksesori ini?',
    pilihan: ['Soket Outlet', 'Kotak Agihan', 'Suis', 'Pemegang Lampu'], betul: 1,
    penjelasan: 'Kotak Agihan mengagihkan bekalan kuasa kepada litar-litar cabang.' },
];

export const WAYAR_L2 = [
  { id: 'L', label: 'PERANG (L — Hidup)', warna: '#8B4A24' },
  { id: 'N', label: 'BIRU (N — Neutral)', warna: '#2255CC' },
  { id: 'PE', label: 'HIJAU/KUNING (PE)', warna: '#3FAE44' },
];
export const TERMINAL_L2 = [
  { id: 'L', label: 'L — Hidup' },
  { id: 'N', label: 'N — Neutral' },
  { id: 'PE', label: 'PE — Konduktor Perlindungan' },
];

export const MISI_L3 = 'Anda ingin memasang satu mata lampu yang dikawal menggunakan suis satu hala.';
export const ITEM_L3 = [
  { nama: 'Pemegang Lampu', perlu: true },
  { nama: 'Suis Satu Hala', perlu: true },
  { nama: 'Kabel', perlu: true },
  { nama: 'Soket Outlet', perlu: false },
  { nama: 'MCB 3 Fasa', perlu: false },
  { nama: 'Kotak Agihan', perlu: false },
  { nama: 'Suis Dua Hala', perlu: false },
  { nama: 'Fius Utama', perlu: false },
];

// urutan = kedudukan sebenar (0..3) dalam urutan pemasangan yang betul
export const LANGKAH_L4 = [
  { kod: 'A', teks: 'Membuat sambungan konduktor', urutan: 3 },
  { kod: 'B', teks: 'Menentukan kedudukan pemasangan', urutan: 0 },
  { kod: 'C', teks: 'Memasang laluan pendawaian', urutan: 1 },
  { kod: 'D', teks: 'Memasang aksesori', urutan: 2 },
];

export const WAYAR_L5 = [
  { id: 'L', label: 'PERANG (L)', warna: '#8B4A24' },
  { id: 'N', label: 'BIRU (N)', warna: '#2255CC' },
  { id: 'PE', label: 'HIJAU/KUNING (PE)', warna: '#3FAE44' },
];
export const TERMINAL_L5 = [
  { id: 'L', label: 'MCB → Suis (L)' },
  { id: 'N', label: 'Bekalan → Pemegang Lampu (N)' },
  { id: 'PE', label: 'Punca Bumi (PE)' },
];

export const CARA_MAIN = [
  'Level 1 - Kenali Ia: Imbas penanda AR, kenal pasti komponen elektrik.',
  'Level 2 - Padankan Ia: Seret wayar ke terminal L/N/PE yang betul.',
  'Level 3 - Pilih Ia: Pilih bahan yang diperlukan untuk satu misi pemasangan.',
  'Level 4 - Susun Ia: Susun langkah pemasangan mengikut urutan betul.',
  'Level 5 - Wayarkan Ia: Lengkapkan litar lampu satu hala penuh dalam AR!',
];

export const LABEL_SOLAR = [
  { objek: 'Label_Panel', teks: 'Panel Solar' },
  { objek: 'Label_Pengawal', teks: 'Pengawal Cas' },
  { objek: 'Label_Bateri', teks: 'Pek Bateri' },
  { objek: 'Label_Penyongsang', teks: 'Penyongsang' },
  { objek: 'Label_Grid', teks: 'Grid Awam' },
  { objek: 'Label_Rumah', teks: 'Beban (Rumah)' },
];
export const LABEL_LITAR = [
  { objek: 'SelKering', teks: 'Sel Kering' },
  { objek: 'SuisTapak', teks: 'Suis' },
  { objek: 'Mentol', teks: 'Mentol' },
  { objek: 'WayarPenyambung', teks: 'Wayar Penyambung', antara: ['Aliran_09', 'Aliran_10'] },
];

export function xpMaksimumLevel(n) {
  return [0, XP.L1_SETIAP_SOALAN * SOALAN_L1.length, XP.L2, XP.L3, XP.L4, XP.L5][n] || 0;
}

export function kocok(senarai) {
  const a = senarai.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
