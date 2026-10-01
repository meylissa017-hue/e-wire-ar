import { WIRE_IT, XP } from '../data/cu2.js';
import { getState, addXp, saveScore, markLevelComplete } from '../score.js';
import { showScreen } from '../router.js';
import { openAR } from '../ar/scene.js';

function flashXp(amount) {
  const el = document.getElementById('xpFlash');
  if (!el) return;
  el.textContent = '+' + amount + ' XP ⭐⭐⭐';
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1800);
}

export function initWireIt() {
  const btnAr = document.getElementById('btnWireAr');
  if (btnAr) {
    btnAr.addEventListener('click', () => openAR('wiring'));
  }
  render();
}

export function renderWireIt() {
  render();
}

function render() {
  const state = getState();
  const diagram = document.getElementById('wireDiagram');
  const glow = document.getElementById('lampGlow');
  const mission = document.getElementById('wireMission');
  const hint = document.getElementById('wireStepHint');
  const fb = document.getElementById('wireFeedback');

  if (state.wireComplete) {
    mission.textContent = '💡 LIGHT ON!';
    hint.textContent = 'WIRING COMPLETE';
    diagram.classList.add('lit');
    if (glow) glow.style.display = 'block';
    return;
  }

  const step = WIRE_IT.steps[state.wireStep];
  if (!step) return;

  mission.textContent = '💡 MISSION 01 — ' + WIRE_IT.mission;
  hint.textContent = 'Langkah ' + (state.wireStep + 1) + '/4: ' + step.label;
  diagram.classList.remove('lit');
  if (glow) glow.style.display = 'none';

  diagram.innerHTML = WIRE_IT.nodes.map((n) => {
    const active = step.from === n || step.to === n;
    return '<button type="button" class="wire-node' + (active ? ' active' : '') + '" data-node="' + n + '">' + n + '</button>';
  }).join('<span class="wire-arrow">→</span>');

  diagram.querySelectorAll('.wire-node').forEach((btn) => {
    btn.addEventListener('click', () => onTap(btn.dataset.node, step));
  });

  if (fb) {
    fb.className = 'feedback hidden';
    fb.innerHTML = '';
  }
}

function onTap(node, step) {
  const state = getState();
  const fb = document.getElementById('wireFeedback');

  if (node === step.to) {
    state.wireStep++;
    if (state.wireStep >= WIRE_IT.steps.length) {
      state.wireComplete = true;
      addXp(XP.wire);
      flashXp(XP.wire);
      markLevelComplete('wire');
      saveScore();
      fb.className = 'feedback correct';
      fb.innerHTML = '<strong>🎉 CONGRATULATIONS</strong><br>WIRING COMPLETE · +100 XP';
      render();
      setTimeout(() => showScreen('screen-final'), 2500);
    } else {
      fb.className = 'feedback correct';
      fb.textContent = '✓ Sambungan betul!';
      saveScore();
      render();
    }
  } else if (node === step.from) {
    fb.className = 'feedback hint';
    fb.textContent = 'Mulakan dari ' + step.from + ' — sekarang pilih ' + step.to;
  } else {
    fb.className = 'feedback wrong';
    fb.textContent = '❌ Laluan salah. Ikut petunjuk langkah.';
  }
}

export function resetWireIt() {
  const state = getState();
  state.wireStep = 0;
  state.wireComplete = false;
  saveScore();
}
