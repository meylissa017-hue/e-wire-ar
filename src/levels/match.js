import { MATCH_IT, XP } from '../data/cu2.js';
import { getState, addXp, saveScore, markLevelComplete } from '../score.js';
import { showScreen } from '../router.js';

let touchDrag = null;

function flashXp(amount) {
  const el = document.getElementById('xpFlash');
  if (!el) return;
  el.textContent = '+' + amount + ' XP ⭐⭐⭐';
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1800);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function initMatchIt() {
  document.addEventListener('touchmove', onTouchMove, { passive: true });
  document.addEventListener('touchend', onTouchEnd);
  render();
}

export function renderMatchIt() {
  render();
}

function render() {
  const state = getState();
  const pool = document.getElementById('wirePool');
  const zones = document.getElementById('matchZones');
  pool.innerHTML = '';
  zones.innerHTML = '';

  shuffle(MATCH_IT).forEach((item) => {
    if (state.matchDone[item.target]) return;
    const chip = document.createElement('div');
    chip.className = 'wire-chip';
    chip.dataset.wire = item.wire;
    chip.dataset.target = item.target;
    chip.innerHTML = '<span class="wire-dot" style="background:' + item.color + '"></span>' + item.label;
    chip.addEventListener('touchstart', onTouchStart, { passive: false });
    chip.addEventListener('dragstart', onDragStart);
    chip.draggable = true;
    pool.appendChild(chip);
  });

  ['L', 'N', 'PE'].forEach((t) => {
    const zone = document.createElement('div');
    zone.className = 'match-zone' + (state.matchDone[t] ? ' done' : '');
    zone.dataset.target = t;
    const labels = { L: 'Live (L)', N: 'Neutral (N)', PE: 'Protective Earth (PE)' };
    const matched = MATCH_IT.find((m) => m.target === t);
    const slotText = state.matchDone[t]
      ? '✓ ' + (matched ? matched.label : '')
      : 'Seret warna ke sini';
    zone.innerHTML = '<div class="zone-label">' + labels[t] + '</div><div class="zone-slot">' + slotText + '</div>';
    if (!state.matchDone[t]) {
      zone.addEventListener('dragover', (e) => e.preventDefault());
      zone.addEventListener('drop', onDrop);
    }
    zones.appendChild(zone);
  });

  const allDone = ['L', 'N', 'PE'].every((t) => state.matchDone[t]);
  const fb = document.getElementById('matchFeedback');
  if (allDone) {
    fb.className = 'feedback correct';
    fb.innerHTML = '<strong>✅ PERFECT MATCH!</strong><br>+30 XP ⭐⭐⭐';
  } else {
    fb.className = 'feedback hidden';
  }
}

function onDragStart(e) {
  e.dataTransfer.setData('text/target', e.currentTarget.dataset.target);
}

function onDrop(e) {
  e.preventDefault();
  const expected = e.dataTransfer.getData('text/target');
  const zone = e.currentTarget.dataset.target;
  tryMatch(expected, zone);
}

function onTouchStart(e) {
  const chip = e.currentTarget;
  touchDrag = { target: chip.dataset.target, el: chip };
  chip.classList.add('dragging');
  e.preventDefault();
}

function onTouchMove(e) {
  if (!touchDrag) return;
  const t = e.touches[0];
  const el = document.elementFromPoint(t.clientX, t.clientY);
  document.querySelectorAll('.match-zone').forEach((z) => z.classList.remove('hover'));
  const zone = el?.closest('.match-zone');
  if (zone) zone.classList.add('hover');
}

function onTouchEnd(e) {
  if (!touchDrag) return;
  const t = e.changedTouches[0];
  const el = document.elementFromPoint(t.clientX, t.clientY);
  const zone = el?.closest('.match-zone');
  if (zone) tryMatch(touchDrag.target, zone.dataset.target);
  touchDrag.el.classList.remove('dragging');
  touchDrag = null;
  document.querySelectorAll('.match-zone').forEach((z) => z.classList.remove('hover'));
}

function tryMatch(expected, zone) {
  const state = getState();
  if (state.matchDone[zone]) return;
  const fb = document.getElementById('matchFeedback');

  if (expected === zone) {
    state.matchDone[zone] = true;
    saveScore();
    const allDone = ['L', 'N', 'PE'].every((t) => state.matchDone[t]);
    if (allDone) {
      addXp(XP.match);
      flashXp(XP.match);
      markLevelComplete('match');
      fb.className = 'feedback correct';
      fb.innerHTML = '<strong>✅ PERFECT MATCH!</strong><br>+30 XP ⭐⭐⭐';
      setTimeout(() => showScreen('screen-match-done'), 2000);
    } else {
      fb.className = 'feedback correct';
      fb.textContent = '✓ Betul! Teruskan.';
    }
    render();
  } else {
    fb.className = 'feedback wrong';
    fb.textContent = '❌ TRY AGAIN — semak warna konduktor.';
  }
}

export function resetMatchIt() {
  const state = getState();
  state.matchDone = {};
  saveScore();
}
