import { KNOW_IT, XP } from '../data/cu2.js';
import { getState, addXp, saveScore, markLevelComplete } from '../score.js';
import { showScreen } from '../router.js';
import { openAR } from '../ar/scene.js';

let answered = false;

function flashXp(amount) {
  const el = document.getElementById('xpFlash');
  if (!el) return;
  el.textContent = '+' + amount + ' XP ⭐';
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1800);
}

function showQuizDock(on) {
  const dock = document.getElementById('arQuizDock');
  if (!dock) return;
  if (on) {
    dock.removeAttribute('hidden');
    dock.classList.add('show');
    document.body.classList.add('ar-quiz-live');
  } else {
    dock.setAttribute('hidden', '');
    dock.classList.remove('show');
    document.body.classList.remove('ar-quiz-live');
  }
}

function enterARMode() {
  document.body.classList.add('ar-fullscreen-level');
  showQuizDock(true);
  const closeBtn = document.getElementById('btnArClose');
  if (closeBtn) closeBtn.textContent = 'Keluar';
  const state = getState();
  const data = KNOW_IT[state.knowIndex] || KNOW_IT[0];
  openAR('component', data.id);
  window.dispatchEvent(new Event('resize'));
}

function exitARMode() {
  document.body.classList.remove('ar-fullscreen-level');
  showQuizDock(false);
  const closeBtn = document.getElementById('btnArClose');
  if (closeBtn) closeBtn.textContent = 'Tutup';
  window.dispatchEvent(new Event('resize'));
}

function setMarkerUI(found) {
  const badge = document.getElementById('arMarkerBadge');
  if (badge) {
    badge.className = 'ar-q-badge' + (found ? ' found' : '');
    badge.textContent = found ? '✓ Model 3D aktif' : '📷 Imbas MINDEAR';
  }
  const dockHint = document.getElementById('arDockHint');
  if (dockHint) {
    dockHint.textContent = found
      ? 'Jawab soalan — model 3D pada marker'
      : 'Halakan kamera ke gambar MINDEAR';
  }
}

function bindAnswer(btn, index, data) {
  const pick = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    answer(index, data, btn);
  };
  btn.addEventListener('click', pick);
  btn.addEventListener('touchend', pick, { passive: false });
}

export function initKnowIt() {
  document.addEventListener('ewire:screen', (e) => {
    if (e.detail?.id === 'screen-level-1') {
      enterARMode();
      render();
    } else if (document.body.classList.contains('ar-fullscreen-level')) {
      exitARMode();
    }
  });

  document.addEventListener('ewire:marker-found', () => setMarkerUI(true));
  document.addEventListener('ewire:marker-lost', () => setMarkerUI(false));

  document.getElementById('btnExitKnow')?.addEventListener('click', () => {
    exitARMode();
    showScreen('screen-levels');
  });

  document.getElementById('btnArClose')?.addEventListener('click', () => {
    if (!document.body.classList.contains('ar-fullscreen-level')) return;
    exitARMode();
    showScreen('screen-levels');
  });
}

function render() {
  const state = getState();
  const data = KNOW_IT[state.knowIndex];
  if (!data) return;

  answered = false;
  const prog = 'SOALAN ' + (state.knowIndex + 1) + ' / 5';

  const progEl = document.getElementById('knowProg');
  const qEl = document.getElementById('knowQuestion');
  const hintEl = document.getElementById('knowHint');
  const floatNum = document.getElementById('arFloatNum');
  const floatText = document.getElementById('arFloatText');

  if (progEl) progEl.textContent = 'Soalan ' + (state.knowIndex + 1) + ' / 5';
  if (qEl) qEl.textContent = data.question;
  if (hintEl) hintEl.textContent = 'Petunjuk: ' + data.hint;
  if (floatNum) floatNum.textContent = prog;
  if (floatText) floatText.textContent = data.question;

  setMarkerUI(false);
  showQuizDock(true);
  openAR('component', data.id);

  const grid = document.getElementById('arAnswersGrid');
  if (!grid) return;
  grid.innerHTML = '';

  data.options.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ar-ans-btn';
    btn.innerHTML =
      '<span class="ar-ans-letter">' + String.fromCharCode(65 + i) + '</span>' +
      '<span class="ar-ans-label">' + text + '</span>';
    bindAnswer(btn, i, data);
    grid.appendChild(btn);
  });

  const fb = document.getElementById('arFeedbackFloat');
  if (fb) {
    fb.className = 'ar-feedback-inline hidden';
    fb.innerHTML = '';
  }
}

function answer(choice, data, btn) {
  if (answered) return;
  answered = true;
  const correct = choice === data.answer;
  const fb = document.getElementById('arFeedbackFloat');
  const buttons = document.querySelectorAll('#arAnswersGrid .ar-ans-btn');
  buttons.forEach((b) => { b.disabled = true; });

  const model = document.getElementById('ar-model-' + data.id);

  if (correct) {
    btn.classList.add('selected-correct');
    const state = getState();
    state.knowCorrect++;
    addXp(XP.knowPerQuestion);
    flashXp(XP.knowPerQuestion);
    if (fb) {
      fb.className = 'ar-feedback-inline correct';
      fb.innerHTML = '<strong>✅ BETUL!</strong> ' + data.fact + ' +' + XP.knowPerQuestion + ' XP';
    }
    if (model) {
      model.setAttribute('animation__scale', 'property: scale; to: 1.25 1.25 1.25; dur: 300; easing: easeOutBack');
      setTimeout(() => model.setAttribute('animation__scale', 'property: scale; to: 1 1 1; dur: 300'), 500);
    }
  } else {
    btn.classList.add('selected-wrong');
    buttons[data.answer]?.classList.add('selected-correct');
    if (fb) {
      fb.className = 'ar-feedback-inline wrong';
      fb.innerHTML = '<strong>❌ SALAH</strong> Jawapan: <b>' + data.options[data.answer] + '</b> — ' + data.fact;
    }
    if (model) {
      model.setAttribute('animation__shake', 'property: position; to: 0.05 0.02 0.06; dur: 100; easing: linear');
      setTimeout(() => model.setAttribute('animation__shake', 'property: position; to: -0.05 0.02 0.06; dur: 100'), 100);
      setTimeout(() => model.setAttribute('animation__shake', 'property: position; to: 0 0.02 0.06; dur: 100'), 200);
    }
  }

  saveScore();
  setTimeout(() => {
    const state = getState();
    state.knowIndex++;
    saveScore();
    if (state.knowIndex >= KNOW_IT.length) {
      markLevelComplete('know');
      exitARMode();
      const doneEl = document.getElementById('knowDoneScore');
      if (doneEl) {
        doneEl.textContent = state.knowCorrect + ' / 5 betul · +' + (state.knowCorrect * XP.knowPerQuestion) + ' XP';
      }
      showScreen('screen-know-done');
    } else {
      render();
    }
  }, correct ? 2200 : 2800);
}

export function resetKnowIt() {
  const state = getState();
  state.knowIndex = 0;
  state.knowCorrect = 0;
  saveScore();
  exitARMode();
}
