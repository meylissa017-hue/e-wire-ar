// Kemajuan pemain — sepadan dengan PengurusPermainan.cs dalam versi Android:
// markah setiap level ialah percubaan TERBAIK, dan jumlah XP ialah hasil tambahnya (terbitan,
// bukan pembilang berasingan), supaya bar XP tidak boleh bercanggah dengan kad level.
import { JUMLAH_LEVEL, SEMUA_LEVEL_DIBUKA } from './data.js';

const KUNCI = 'ewire-ar-kemajuan-v1';
const pendengar = new Set();

let keadaan = kosong();
let levelPercubaan = 0;
let xpPercubaan = 0;

function kosong() {
  return { tertinggi: 1, selesai: [false, false, false, false, false, false], xp: [0, 0, 0, 0, 0, 0] };
}

export function muatkan() {
  // localStorage boleh gagal (mod peribadi Safari, data disekat) — permainan mesti tetap jalan.
  try {
    const mentah = localStorage.getItem(KUNCI);
    if (mentah) keadaan = Object.assign(kosong(), JSON.parse(mentah));
  } catch (e) { keadaan = kosong(); }
}

function simpan() {
  try { localStorage.setItem(KUNCI, JSON.stringify(keadaan)); } catch (e) { /* abaikan */ }
}

export function xpSemasa() {
  let jumlah = 0;
  for (let i = 1; i <= JUMLAH_LEVEL; i++) jumlah += keadaan.xp[i] || 0;
  return jumlah;
}
export const xpLevel = (n) => keadaan.xp[n] || 0;
export const levelSelesai = (n) => !!keadaan.selesai[n];
export const levelDibuka = (n) => SEMUA_LEVEL_DIBUKA || n <= keadaan.tertinggi;
export const levelSeterusnya = () => keadaan.tertinggi;

/** Dipanggil setiap kali satu level bermula, supaya markah percubaan dikira dari sifar. */
export function mulakanPercubaan(n) { levelPercubaan = n; xpPercubaan = 0; }

export function tambahXP(jumlah, n) {
  if (jumlah <= 0) return;
  if (levelPercubaan !== n) mulakanPercubaan(n);
  xpPercubaan += jumlah;
  keadaan.xp[n] = Math.max(keadaan.xp[n] || 0, xpPercubaan);
  simpan();
  maklum();
}

export function tandaSelesai(n) {
  keadaan.selesai[n] = true;
  if (n === keadaan.tertinggi && keadaan.tertinggi < JUMLAH_LEVEL) keadaan.tertinggi++;
  simpan();
}

export function tetapkanSemula() {
  keadaan = kosong();
  levelPercubaan = 0; xpPercubaan = 0;
  simpan();
  maklum();
}

export function bintang() {
  const xp = xpSemasa();
  return xp >= 201 ? 3 : xp >= 101 ? 2 : 1;
}
export function lencana() {
  const b = bintang();
  return b >= 3 ? 'LEGENDA PENDAWAIAN' : b === 2 ? 'PAKAR PENDAWAIAN' : 'PENJELAJAH PENDAWAIAN';
}

export function apabilaXPBerubah(fn) { pendengar.add(fn); }
function maklum() { pendengar.forEach((fn) => fn(xpSemasa())); }
