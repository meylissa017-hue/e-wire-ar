// Modul "melihat sahaja": Terokai Sistem Solar & Membina Litar Elektrik.
// Sepadan dengan PamerSolar.cs / AnimasiSolar.cs / PamerLitar.cs dalam versi Android.
import { THREE, Penempatan, tengahkan, muatModel, cari, pusat, bahanSendiri, dariBlender, gerakIsyarat } from './ar.js';
import { LABEL_SOLAR, LABEL_LITAR } from './data.js';

const rad = (d) => (d * Math.PI) / 180;
const tmp = new THREE.Vector3();

/** Asas kedua-dua pemapar: penempatan, putaran (seret/auto), zum cubit, pin bernombor. */
class Pamer {
  constructor(ui) { this.ui = ui; this.pin = []; this.sudut = 0; }

  async sedia(namaModel, { lebarSkrin, naik, condong, kelajuanPutar, label, lebarModel }) {
    this.model = await muatModel(namaModel);
    this.condong = rad(condong);
    this.kelajuanPutar = kelajuanPutar;

    // Titik label dikira dalam ruang tempatan model SEBELUM ia ditengahkan/diskala.
    this.titik = label.map((l) => {
      const o = cari(this.model, l.objek);
      if (!o) return null;
      return o.isMesh || o.children.length ? pusat(o, this.model) : o.position.clone();
    });

    this.sebelumTengah();
    const kotak = new THREE.Box3().setFromObject(this.model);
    const saiz = kotak.getSize(new THREE.Vector3());
    this.tempat = new Penempatan({ lebarModel: lebarModel || Math.max(saiz.x, saiz.z), lebarSkrin, naik });
    tengahkan(this.model, this.tempat.pusing);
    this.isyarat = gerakIsyarat();

    this.ui.legenda.innerHTML = '';
    this.ui.pin.innerHTML = '';
    label.forEach((l, i) => {
      const p = document.createElement('div');
      p.className = 'pin'; p.textContent = i + 1; p.hidden = true;
      this.ui.pin.appendChild(p);
      this.pin.push(p);
      const b = document.createElement('div');
      b.className = 'legenda-baris';
      b.innerHTML = `<span class="pin kecil">${i + 1}</span><span>${l.teks}</span>`;
      this.ui.legenda.appendChild(b);
    });
  }

  sebelumTengah() {}

  kemaskini(dt) {
    const t = this.tempat;
    t.zum = this.isyarat.zum;
    t.kemaskini(dt);
    if (this.isyarat.sejakSentuh() > 3) this.isyarat.sudut += this.kelajuanPutar * dt;
    // Condong tetap ke arah kamera, kemudian pusing pada paksi atas model sendiri — supaya
    // permukaan atas sentiasa kelihatan (lihat pembaikan yang sama dalam PamerSolar.cs).
    t.pusing.rotation.set(this.condong, rad(this.isyarat.sudut), 0);

    this.ui.bekas.classList.toggle('dikesan', t.nampak);
    if (!t.nampak) { this.pin.forEach((p) => { p.hidden = true; }); return; }
    t.akar.updateMatrixWorld(true);
    this.animasi(dt);
    this.pin.forEach((p, i) => {
      const titik = this.titik[i];
      const s = titik && t.keSkrin(this.model.localToWorld(tmp.copy(titik)), tmp);
      p.hidden = !s;
      if (s) p.style.transform = `translate(${s.x}px, ${s.y}px)`;
    });
  }

  animasi() {}

  tamat() {
    if (this.isyarat) this.isyarat.lepas();
    if (this.tempat) this.tempat.buang();
    this.ui.pin.innerHTML = '';
    this.ui.bekas.classList.remove('dikesan');
  }
}

// =====================================================================================
// SISTEM SOLAR — kitaran siang/malam, aliran tenaga, paras bateri (lihat AnimasiSolar.cs).
// Semua koordinat ditulis dalam koordinat BLENDER seperti dalam SistemSolar.blend.
// =====================================================================================
export class PamerSolar extends Pamer {
  async mula() {
    this.tempoh = 24; this.pecahanSiang = 0.6;
    this.masa = 0; this.paras = 0.25; this.segmen = [];
    await this.sedia('SistemSolar', {
      lebarSkrin: 0.8, naik: 0, condong: 26, kelajuanPutar: 9, label: LABEL_SOLAR, lebarModel: 15,
    });
    this.ui.petunjuk.textContent = 'Seret untuk memutar  •  cubit dua jari untuk zum';
  }

  sebelumTengah() {
    const m = this.model;
    this.matahari = cari(m, 'Matahari');
    this.bahanTingkap = bahanSendiri(cari(m, 'Rumah'), 'Sol_BiruAksen');
    this.bahanSel = bahanSendiri(cari(m, 'SusunanPanel'), 'Sol_Sel');
    this.bahanLed = bahanSendiri(cari(m, 'PengawalCas'), 'Sol_Hijau');
    if (this.bahanTingkap) this.warnaTingkap = this.bahanTingkap.color.clone();
    if (this.bahanSel) this.warnaSel = this.bahanSel.color.clone();

    const emas = new THREE.MeshBasicMaterial({ color: 0xffd21a });
    const biru = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
    const hijau = new THREE.MeshBasicMaterial({ color: 0x1aff73 });
    const geo = new THREE.SphereGeometry(0.14, 12, 8);
    const T = 0.45; // tinggi aliran di atas tanah
    const buat = (a, b, n, bahan, saiz = 1) => {
      const s = { a: dariBlender(...a), b: dariBlender(...b), titik: [], fasa: 0, aktif: false, songsang: false, laju: 0.45 };
      for (let i = 0; i < n; i++) {
        const t = new THREE.Mesh(geo, bahan);
        t.scale.setScalar(saiz); t.visible = false;
        m.add(t); s.titik.push(t);
      }
      this.segmen.push(s);
      return s;
    };
    // Arus terus (emas) sebelum penyongsang, arus ulang-alik (biru) selepasnya, grid (hijau).
    this.sinar = buat([0, 0, 0], [-4.5, 3.0, 1.0], 3, emas, 0.8);
    this.panelPengawal = buat([-6.6, 2.2, T], [-6.6, 0.75, T], 2, emas);
    this.pengawalBateri = buat([-6.6, 0.35, T], [-6.0, -1.55, T], 2, emas);
    this.bateriPenyongsang = buat([-4.7, -2.6, T], [-1.4, -2.45, T], 3, emas);
    this.penyongsangRumah = buat([0.6, -2.4, T], [2.7, -2.4, T], 2, biru);
    this.penyongsangGrid = buat([-0.2, -1.7, T], [0.8, 3.6, T], 4, hijau);

    // Paras bateri: lima cakera bertindan di atas pek bateri.
    this.bahanMalap = new THREE.MeshBasicMaterial({ color: 0x1f2433 });
    this.bahanBar = new THREE.MeshBasicMaterial({ color: 0x1aff73 });
    const geoCakera = new THREE.CylinderGeometry(0.38, 0.38, 0.14, 20);
    this.bar = [];
    for (let i = 0; i < 5; i++) {
      const c = new THREE.Mesh(geoCakera, this.bahanMalap);
      c.position.copy(dariBlender(-6.0, -2.6, 1.0 + i * 0.2));
      m.add(c); this.bar.push(c);
    }
  }

  animasi(dt) {
    this.masa += dt;
    const t = (this.masa / this.tempoh) % 1;
    const siang = t < this.pecahanSiang;
    const sudut = siang ? (t / this.pecahanSiang) * Math.PI : 0;
    const terik = siang ? Math.sin(sudut) : 0;

    // Matahari: lengkung dari sisi panel ke sisi rumah.
    const posMatahari = dariBlender(-8.5 * Math.cos(sudut), 4.4, 0.4 + 6.4 * Math.sin(sudut));
    if (this.matahari) {
      this.matahari.position.copy(posMatahari);
      const s = THREE.MathUtils.smoothstep(terik * 4, 0, 1);
      this.matahari.scale.setScalar(Math.max(0.0001, s));
    }

    const menjana = terik > 0.12;
    const tempohSiang = this.tempoh * this.pecahanSiang, tempohMalam = this.tempoh - tempohSiang;
    const penuh = this.paras >= 0.999, kosong = this.paras <= 0.001;
    if (menjana) this.paras += (terik * dt) / (tempohSiang * 0.38);
    else this.paras -= dt / (tempohMalam * 0.7);
    this.paras = Math.min(1, Math.max(0, this.paras));
    const gridBekal = !menjana && kosong;   // malam, bateri habis
    const eksport = menjana && penuh;       // siang, bateri penuh

    const tetap = (s, aktif, songsang, laju) => {
      s.songsang = songsang; s.laju = laju;
      if (s.aktif !== aktif) { s.aktif = aktif; s.titik.forEach((x) => { x.visible = aktif; }); }
    };
    this.sinar.a.copy(posMatahari);
    tetap(this.sinar, menjana, false, 0.35 + terik * 0.5);
    tetap(this.panelPengawal, menjana, false, 0.3 + terik * 0.6);
    tetap(this.pengawalBateri, menjana, false, 0.3 + terik * 0.6);
    tetap(this.bateriPenyongsang, menjana || !kosong, false, 0.5);
    tetap(this.penyongsangRumah, true, false, 0.5);
    tetap(this.penyongsangGrid, eksport || gridBekal, gridBekal, 0.3);

    for (const s of this.segmen) {
      if (!s.aktif) continue;
      s.fasa = (s.fasa + dt * s.laju) % 1;
      s.titik.forEach((x, i) => {
        let u = (s.fasa + i / s.titik.length) % 1;
        if (s.songsang) u = 1 - u;
        x.position.lerpVectors(s.a, s.b, u);
      });
    }

    const nyala = Math.ceil(this.paras * this.bar.length - 0.001);
    this.bahanBar.color.setRGB(1 - 0.9 * this.paras, 0.2 + 0.8 * this.paras, 0.2 + 0.25 * this.paras);
    this.bar.forEach((c, i) => { c.material = i < nyala ? this.bahanBar : this.bahanMalap; });

    if (this.bahanTingkap) {
      if (siang) { this.bahanTingkap.color.copy(this.warnaTingkap); this.bahanTingkap.emissive.setRGB(0, 0, 0); }
      else { this.bahanTingkap.color.setRGB(1, 0.85, 0.35); this.bahanTingkap.emissive.setRGB(0.9, 0.7, 0.2); }
    }
    if (this.bahanSel) {
      const kilau = 0.25 + 0.2 * Math.sin(this.masa * 3);
      this.bahanSel.color.copy(this.warnaSel).multiplyScalar(0.35 + 0.65 * terik).lerp(new THREE.Color(1, 1, 1), kilau * terik * 0.5);
    }
    if (this.bahanLed) {
      const kelip = menjana && !penuh && (this.masa * 2) % 1 < 0.5;
      this.bahanLed.color.setRGB(kelip ? 0.2 : 0.05, kelip ? 1 : 0.25, kelip ? 0.3 : 0.08);
      this.bahanLed.emissive.setRGB(0, kelip ? 0.8 : 0, 0);
    }

    const status =
      eksport ? 'SIANG  •  Bateri penuh — lebihan tenaga dihantar ke grid' :
      menjana ? 'SIANG  •  Panel menjana kuasa dan mengecas bateri' :
      gridBekal ? 'MALAM  •  Bateri habis — grid awam membekal rumah' :
      siang ? 'SENJA  •  Bateri mula membekal rumah' :
              'MALAM  •  Bateri membekal rumah';
    if (status !== this._status) { this.ui.status.textContent = status; this._status = status; }
  }
}

// =====================================================================================
// LITAR ASAS — satu litar yang bertukar sendiri antara lengkap dan tidak lengkap.
// Denyut arus hanya bergerak semasa litar LENGKAP — itulah inti pelajarannya.
// =====================================================================================
export class PamerLitar extends Pamer {
  async mula() {
    this.masaLengkap = 5.5; this.masaTerbuka = 4.0;
    this.sudutTutup = 0; this.sudutBuka = 34;
    this.lengkap = true; this.sejakTukar = 0; this.sudutTuas = 0; this.fasa = 0;
    await this.sedia('LitarAsas', { lebarSkrin: 0.78, naik: 0, condong: 24, kelajuanPutar: 8, label: LABEL_LITAR, lebarModel: 0.32 });
    this.ui.petunjuk.textContent = 'Seret untuk memutar  •  cubit dua jari untuk zum';
  }

  sebelumTengah() {
    const m = this.model;
    this.tuas = cari(m, 'SuisTuas');
    this.cahaya = cari(m, 'MentolCahaya');
    // Kaca mentol dan sinar cahaya mesti lut sinar supaya filamen kelihatan.
    m.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      if (o.material.name === 'Litar_Kaca') { o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = 0.3; o.material.depthWrite = false; }
      if (o.material.name === 'Litar_Cahaya') { o.material = new THREE.MeshBasicMaterial({ color: 0xffe680, transparent: true, opacity: 0.55, depthWrite: false }); }
    });

    this.laluan = [];
    for (let i = 0; ; i++) {
      const t = cari(m, 'Aliran_' + String(i).padStart(2, '0'));
      if (!t) break;
      this.laluan.push(t.position.clone());
    }
    this.terkumpul = [0]; this.panjang = 0;
    for (let i = 1; i < this.laluan.length; i++) {
      this.panjang += this.laluan[i - 1].distanceTo(this.laluan[i]);
      this.terkumpul.push(this.panjang);
    }
    if (this.laluan.length > 1) this.panjang += this.laluan[this.laluan.length - 1].distanceTo(this.laluan[0]);

    this.denyut = [];
    const geo = new THREE.SphereGeometry(0.006, 12, 8);
    const bahan = new THREE.MeshBasicMaterial({ color: 0xffe14d });
    for (let i = 0; i < 5; i++) { const d = new THREE.Mesh(geo, bahan); d.visible = false; m.add(d); this.denyut.push(d); }
  }

  titikLaluan(t, keluar) {
    const L = this.laluan;
    if (L.length < 2) return keluar.set(0, 0, 0);
    const d = (((t % 1) + 1) % 1) * this.panjang;
    for (let i = 1; i < this.terkumpul.length; i++) {
      if (d <= this.terkumpul[i]) {
        const seg = this.terkumpul[i] - this.terkumpul[i - 1];
        return keluar.lerpVectors(L[i - 1], L[i], seg <= 0 ? 0 : (d - this.terkumpul[i - 1]) / seg);
      }
    }
    const akhir = this.terkumpul[this.terkumpul.length - 1];
    const sisa = this.panjang - akhir;
    return keluar.lerpVectors(L[L.length - 1], L[0], sisa <= 0 ? 0 : (d - akhir) / sisa);
  }

  animasi(dt) {
    this.sejakTukar += dt;
    if (this.sejakTukar >= (this.lengkap ? this.masaLengkap : this.masaTerbuka)) { this.lengkap = !this.lengkap; this.sejakTukar = 0; }

    const sasar = this.lengkap ? this.sudutTutup : this.sudutBuka;
    const langkah = 150 * dt;
    this.sudutTuas += Math.max(-langkah, Math.min(langkah, sasar - this.sudutTuas));
    // Tuas terletak sepanjang paksi X dan berengsel pada asalannya; memutar pada Z mengangkat hujungnya.
    if (this.tuas) this.tuas.rotation.z = rad(this.sudutTuas);

    const menyala = this.lengkap && Math.abs(this.sudutTuas - this.sudutTutup) < 0.01;
    if (this.cahaya) this.cahaya.visible = menyala;
    const status = menyala
      ? 'LITAR LENGKAP  —  suis ditutup, mentol menyala'
      : 'LITAR TIDAK LENGKAP  —  suis dibuka, mentol tidak menyala';
    if (status !== this._status) { this.ui.status.textContent = status; this._status = status; this.ui.status.classList.toggle('amaran', !menyala); }

    if (menyala) this.fasa += 0.28 * dt;
    this.denyut.forEach((d, i) => {
      d.visible = menyala;
      if (menyala) this.titikLaluan(this.fasa + i / this.denyut.length, d.position);
    });
  }
}
