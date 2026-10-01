import { initRouter, showScreen } from './router.js';
import { loadScore, getXp, resetScore, emitXp, onXpChange, getMaxXp } from './score.js';
import { LEVELS, XP } from './data/cu2.js';
import { initKnowIt, resetKnowIt } from './levels/know.js';
import { initMatchIt, renderMatchIt, resetMatchIt } from './levels/match.js';
import { initSelectIt } from './levels/select.js';
import { initSequenceIt } from './levels/sequence.js';
import { initWireIt, renderWireIt, resetWireIt } from './levels/wire.js';
import { initAR } from './ar/scene.js';

function updateXpDisplay(xp) {
  document.querySelectorAll('[data-xp]').forEach((el) => {
    el.textContent = xp + ' XP';
  });
}

function buildLevelMenu() {
  const grid = document.getElementById('levelGrid');
  if (!grid) return;
  grid.innerHTML = '';

  LEVELS.forEach((lv) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'level-card' + (lv.active ? '' : ' locked');
    btn.dataset.level = lv.key;
    btn.innerHTML =
      '<span class="level-num">' + (lv.active ? lv.id : '🔒') + '</span>' +
      '<div class="level-info"><h3>' + lv.title + '</h3><p>' + (lv.active ? lv.desc : 'COMING SOON') + '</p></div>' +
      (lv.active ? '<span class="level-xp">+' + lv.xp + ' XP</span>' : '');

    btn.addEventListener('click', () => {
      if (!lv.active) {
        if (lv.key === 'select') showScreen('screen-locked-3');
        else if (lv.key === 'sequence') showScreen('screen-locked-4');
        return;
      }
      const screens = {
        know: 'screen-level-1',
        match: 'screen-level-2',
        wire: 'screen-level-5'
      };
      const target = screens[lv.key];
      if (target) {
        showScreen(target);
        if (lv.key === 'match') renderMatchIt();
        if (lv.key === 'wire') renderWireIt();
      }
    });
    grid.appendChild(btn);
  });
}

function initFinalScreen() {
  document.addEventListener('ewire:screen', (e) => {
    if (e.detail?.id === 'screen-final') {
      const xp = getXp();
      const el = document.getElementById('finalXp');
      const note = document.getElementById('finalNote');
      if (el) el.textContent = xp + ' XP';
      if (note) note.textContent = 'Level 3 & 4 — Coming Soon · Maksimum v1: ' + XP.maxV1 + ' XP';
    }
  });
}

function bindActions() {
  document.addEventListener('ewire:camera-ready', () => {
    const btn = document.getElementById('btnStart');
    const hint = document.getElementById('bootHint');
    if (btn) {
      btn.disabled = false;
      btn.removeAttribute('disabled');
    }
    if (hint) hint.textContent = '✓ Kamera aktif — tekan START GAME';
  });
  document.getElementById('btnPlayAgain')?.addEventListener('click', () => {
    resetScore();
    resetKnowIt();
    resetMatchIt();
    resetWireIt();
    emitXp();
    showScreen('screen-levels');
  });
  document.getElementById('btnReset')?.addEventListener('click', () => {
    if (confirm('Reset semua markah XP?')) {
      resetScore();
      resetKnowIt();
      resetMatchIt();
      resetWireIt();
      emitXp();
      buildLevelMenu();
    }
  });

  document.querySelector('[data-goto="screen-level-2"]')?.addEventListener('click', () => renderMatchIt());
  document.querySelector('[data-goto="screen-level-5"]')?.addEventListener('click', () => renderWireIt());
}

function init() {
  const hint = document.getElementById('bootHint');
  const debug = window.logDebug || console.log.bind(console, '[E-WIRE]');
  
  try {
    debug('init-start');
    if (hint) hint.textContent = '⏳ Memuatkan modul...';
    
    loadScore();
    debug('score-loaded');
    
    initRouter(document.getElementById('app'));
    debug('router-ok');
    
    buildLevelMenu();
    debug('menu-ok');
    
    initKnowIt();
    initMatchIt();
    initSelectIt();
    initSequenceIt();
    initWireIt();
    debug('levels-ok');
    
    initAR();
    debug('ar-ok');
    
    initFinalScreen();
    bindActions();
    debug('actions-ok');

    onXpChange(updateXpDisplay);
    updateXpDisplay(getXp());
    emitXp();

    showScreen('screen-splash');
    
    if (hint) hint.textContent = '✓ Sedia v27 — tekan HIDUPKAN KAMERA';
    debug('init-done');
    console.log('E-WIRE AR: Init selesai');
  } catch (err) {
    console.error('Init error:', err);
    debug('init-err:' + (err?.message || err));
    if (hint) hint.textContent = '❌ Init: ' + (err?.message || err);
  }
}

/* Jalankan segera jika DOM sudah sedia, atau tunggu */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
