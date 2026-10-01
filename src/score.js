import { XP } from './data/cu2.js';

const STORAGE_KEY = 'ewire_cu2_v1';

const defaultState = () => ({
  xp: 0,
  completed: { know: false, match: false, wire: false },
  knowIndex: 0,
  knowCorrect: 0,
  matchDone: {},
  wireStep: 0,
  wireComplete: false
});

let state = defaultState();

export function loadScore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...defaultState(), ...JSON.parse(raw) };
  } catch (_) { /* ignore */ }
  return state;
}

export function saveScore() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) { /* ignore */ }
}

export function getState() {
  return state;
}

export function resetScore() {
  state = defaultState();
  saveScore();
}

export function addXp(amount) {
  state.xp += amount;
  saveScore();
  return state.xp;
}

export function getXp() {
  return state.xp;
}

export function getMaxXp() {
  return XP.maxV1;
}

export function markLevelComplete(key) {
  state.completed[key] = true;
  saveScore();
}

export function isLevelComplete(key) {
  return !!state.completed[key];
}

export function onXpChange(callback) {
  document.addEventListener('ewire:xp', (e) => callback(e.detail.xp));
}

export function emitXp() {
  document.dispatchEvent(new CustomEvent('ewire:xp', { detail: { xp: state.xp } }));
}
