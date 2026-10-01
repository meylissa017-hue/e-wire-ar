const screens = new Map();

export function registerScreen(id, el) {
  screens.set(id, el);
}

export function showScreen(id) {
  screens.forEach((el, key) => {
    el.classList.toggle('active', key === id);
    el.setAttribute('aria-hidden', key === id ? 'false' : 'true');
  });
  window.scrollTo(0, 0);
  document.dispatchEvent(new CustomEvent('ewire:screen', { detail: { id } }));
}

export function getActiveScreen() {
  for (const [id, el] of screens) {
    if (el.classList.contains('active')) return id;
  }
  return null;
}

export function initRouter(root) {
  root.querySelectorAll('[data-screen]').forEach((el) => {
    registerScreen(el.dataset.screen, el);
  });

  root.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => showScreen(btn.dataset.goto));
  });

  root.querySelectorAll('[data-back]').forEach((btn) => {
    btn.addEventListener('click', () => showScreen(btn.dataset.back));
  });
}
