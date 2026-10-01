/** CU2 — Pendawaian Elektrik Tahap 2 — kandungan permainan */
export const XP = {
  knowPerQuestion: 10,
  match: 30,
  select: 30,
  sequence: 50,
  wire: 100,
  maxV1: 180,
  maxFull: 250
};

export const LEVELS = [
  { id: 1, key: 'know', title: 'KNOW IT', desc: 'Kenal alat, bahan & aksesori', xp: 50, active: true },
  { id: 2, key: 'match', title: 'MATCH IT', desc: 'Padankan konduktor L / N / PE', xp: 30, active: true },
  { id: 3, key: 'select', title: 'SELECT IT', desc: 'Pilih bahan pemasangan', xp: 30, active: false },
  { id: 4, key: 'sequence', title: 'SEQUENCE IT', desc: 'Susun langkah pemasangan', xp: 50, active: false },
  { id: 5, key: 'wire', title: 'WIRE IT', desc: 'Litar lampu satu hala', xp: 100, active: true }
];

export const KNOW_IT = [
  {
    id: 'mcb',
    question: 'Apakah aksesori ini?',
    component: 'MCB',
    hint: 'Miniature Circuit Breaker',
    options: ['Socket Outlet', 'Switch', 'MCB', 'Lamp Holder'],
    answer: 2,
    fact: 'MCB — peranti perlindungan yang digunakan dalam pemasangan elektrik.',
    color: '#455A64'
  },
  {
    id: 'switch',
    question: 'Apakah aksesori ini?',
    component: 'Suis Satu Hala',
    hint: 'One-Way Switch',
    options: ['MCB', 'One-Way Switch', 'Distribution Box', 'Socket Outlet'],
    answer: 1,
    fact: 'Suis satu hala mengawal satu litar lampu dari satu lokasi.',
    color: '#795548'
  },
  {
    id: 'socket',
    question: 'Apakah aksesori ini?',
    component: 'Socket Outlet',
    hint: '13A Socket',
    options: ['Lamp Holder', 'MCB', 'Socket Outlet', 'Earth Rod'],
    answer: 2,
    fact: 'Soket outlet membekalkan kuasa kepada peralatan portabel.',
    color: '#EEEEEE'
  },
  {
    id: 'lamp',
    question: 'Apakah aksesori ini?',
    component: 'Pemegang Lampu',
    hint: 'Lamp Holder',
    options: ['Pemegang Lampu', 'Suis', 'Kotak Agihan', 'MCB'],
    answer: 0,
    fact: 'Pemegang lampu menyambung mentol kepada pendawaian tetap.',
    color: '#FFC107'
  },
  {
    id: 'db',
    question: 'Apakah aksesori ini?',
    component: 'Kotak Agihan',
    hint: 'Distribution Box',
    options: ['Socket Outlet', 'Kotak Agihan', 'Switch', 'Lamp Holder'],
    answer: 1,
    fact: 'Kotak Agihan mengagihkan bekalan kepada litar-litar cabang.',
    color: '#37474F'
  }
];

export const MATCH_IT = [
  { wire: 'brown', label: 'BROWN', color: '#8B4513', target: 'L', targetLabel: 'Live (L)' },
  { wire: 'blue', label: 'BLUE', color: '#1565C0', target: 'N', targetLabel: 'Neutral (N)' },
  { wire: 'gnye', label: 'GREEN / YELLOW', color: '#2E7D32', target: 'PE', targetLabel: 'Protective Earth (PE)' }
];

export const SELECT_IT_PREVIEW = {
  mission: 'Anda ingin memasang satu mata lampu yang dikawal menggunakan suis satu hala.',
  hint: 'Pilih item yang diperlukan untuk pemasangan.',
  items: ['Lamp Holder', 'One-Way Switch', 'Cable', 'MCB', 'Socket Outlet', 'Earth Rod']
};

export const SEQUENCE_IT_PREVIEW = {
  steps: [
    'Menentukan kedudukan pemasangan',
    'Memasang laluan pendawaian',
    'Membuat sambungan konduktor',
    'Memasang aksesori'
  ],
  hint: 'Susun langkah mengikut urutan pemasangan CU2 yang betul.'
};

export const WIRE_IT = {
  title: 'Litar Lampu Satu Hala',
  mission: 'COMPLETE THE CIRCUIT — Lengkapkan sambungan L, N dan PE.',
  steps: [
    { phase: 'L', from: 'MCB', to: 'Suis', label: 'L: MCB → Suis' },
    { phase: 'L', from: 'Suis', to: 'Lampu', label: 'L: Suis → Lampu' },
    { phase: 'N', from: 'MCB', to: 'Lampu', label: 'N: MCB → Lampu (neutral)' },
    { phase: 'PE', from: 'PE', to: 'Lampu', label: 'PE: Earth → Lampu' }
  ],
  nodes: ['MCB', 'Suis', 'Lampu', 'PE']
};
