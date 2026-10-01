/** E-WIRE AR — split layout: model 3D atas, soalan+jawapan bawah (ikut ewire-ar) */
const COMPONENT_MAP = {
  mcb: 'ar-model-mcb',
  switch: 'ar-model-switch',
  socket: 'ar-model-socket',
  lamp: 'ar-model-lamp',
  db: 'ar-model-db'
};

let sceneEl = null;
let arStarted = false;
let cameraReady = false;
let markerFound = false;
let eventsBound = false;
let currentMode = 'component';
let currentPayload = 'mcb';

function $(id) { return document.getElementById(id); }

function setVisible(el, on) {
  if (!el) return;
  el.setAttribute('visible', on ? 'true' : 'false');
  if (el.object3D) el.object3D.visible = !!on;
}

function hideModelsOnly() {
  Object.values(COMPONENT_MAP).forEach((id) => setVisible($(id), false));
  setVisible($('ar-model-wiring'), false);
}

function showComponent(id) {
  hideModelsOnly();
  if (!markerFound) return;
  const key = id || 'mcb';
  const el = $(COMPONENT_MAP[key] || COMPONENT_MAP.mcb);
  if (el) {
    setVisible(el, true);
    el.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 5000; easing: linear');
  }
}

function setStatus(msg) {
  const el = $('arStatus');
  if (el) el.textContent = msg;
}

function setMarkerFound(on) {
  markerFound = on;
  document.body.classList.toggle('ar-marker-found', on);
  updateScanPrompt();
}

function updateScanPrompt() {
  const scan = $('arScanPrompt');
  if (!scan) return;
  const inQuiz = document.body.classList.contains('ar-fullscreen-level');
  const show = document.body.classList.contains('ar-live') && !markerFound && !inQuiz;
  scan.classList.toggle('show', show);
}

function showFoundBurst() {
  const burst = $('arFoundBurst');
  if (!burst) return;
  burst.classList.add('show');
  setTimeout(() => burst.classList.remove('show'), 1200);
}

function showWiring() {
  hideModelsOnly();
  if (!markerFound) return;
  setVisible($('ar-model-wiring'), true);
}

function showMatchVisual() {
  hideModelsOnly();
  if (!markerFound) return;
  setVisible($('ar-model-mcb'), true);
}

function applyMode(mode, payload) {
  currentMode = mode || 'component';
  if (payload) currentPayload = payload;
  if (mode === 'component') showComponent(payload || 'mcb');
  else if (mode === 'wiring') showWiring();
  else if (mode === 'match') showMatchVisual();
}

function onTargetFound() {
  setMarkerFound(true);
  setStatus('✓ Model 3D aktif — jawab dalam kad soalan');
  showFoundBurst();
  applyMode(currentMode, currentPayload);
  document.dispatchEvent(new CustomEvent('ewire:marker-found'));
}

function onTargetLost() {
  setMarkerFound(false);
  hideModelsOnly();
  setStatus('Imbas gambar MINDEAR — soalan di bawah');
  document.dispatchEvent(new CustomEvent('ewire:marker-lost'));
}

function fixVideoAndRenderer() {
  document.querySelectorAll('#arOverlay video').forEach((v) => {
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', 'true');
    v.setAttribute('muted', '');
    v.playsInline = true;
    v.muted = true;
    v.style.objectFit = 'cover';
    v.style.width = '100%';
    v.style.height = '100%';
    v.style.position = 'absolute';
    v.style.pointerEvents = 'none';
  });
  const canvas = document.querySelector('#arOverlay .a-canvas');
  if (canvas) {
    canvas.style.position = 'absolute';
    canvas.style.pointerEvents = 'none';
    canvas.style.touchAction = 'none';
  }
  if (!sceneEl?.renderer) return;
  sceneEl.renderer.setClearColor(0x000000, 0);
  sceneEl.renderer.domElement.style.background = 'transparent';
}

function enableStartButton() {
  const hint = $('bootHint');
  const btnStart = $('btnStart');
  if (btnStart) {
    btnStart.disabled = false;
    btnStart.removeAttribute('disabled');
  }
  if (hint) hint.textContent = '✓ Kamera aktif — tekan START GAME';
  document.body.classList.add('ar-camera-ready');
  document.dispatchEvent(new CustomEvent('ewire:camera-ready'));
}

function bindMarkerEvents() {
  if (!sceneEl || eventsBound) return;
  eventsBound = true;

  sceneEl.addEventListener('arReady', () => {
    cameraReady = true;
    fixVideoAndRenderer();
    setStatus('🔍 Imbas gambar MINDEAR di atas');
    resizeScene();
    setTimeout(resizeScene, 400);
    enableStartButton();
    $('arReticle')?.classList.add('scanning');
  });

  sceneEl.addEventListener('arError', (e) => {
    setStatus('Ralat kamera — muat semula');
    console.error('[AR]', e?.detail);
  });

  sceneEl.addEventListener('targetFound', onTargetFound);
  sceneEl.addEventListener('targetLost', onTargetLost);
}

function waitLayout() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

function resizeScene() {
  if (sceneEl?.resize) sceneEl.resize();
  window.dispatchEvent(new Event('resize'));
  setTimeout(fixVideoAndRenderer, 100);
}

function setupTransparentScene() {
  if (!sceneEl) return;
  sceneEl.setAttribute('background', 'transparent: true');
  sceneEl.setAttribute('renderer', 'colorManagement: true; alpha: true; antialias: false; premultipliedAlpha: false');
}

function startMindAR() {
  return new Promise((resolve, reject) => {
    function go() {
      setupTransparentScene();
      const sys = sceneEl.systems?.['mindar-image-system'];
      const comp = sceneEl.components?.['mindar-image'];
      const p = sys?.start ? sys.start() : comp?.start ? comp.start() : null;
      if (p?.then) {
        p.then(() => {
          arStarted = true;
          fixVideoAndRenderer();
          resizeScene();
          resolve();
        }).catch(reject);
      } else {
        arStarted = true;
        fixVideoAndRenderer();
        resizeScene();
        resolve();
      }
    }
    if (sceneEl.hasLoaded) go();
    else sceneEl.addEventListener('loaded', go, { once: true });
  });
}

export function isSecure() {
  return location.protocol === 'https:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1';
}

export function httpsUrl() {
  return 'https://' + location.hostname + ':8443/e-wire-ar/play.html' + location.search;
}

export function bootCamera() {
  if (cameraReady && arStarted) return Promise.resolve();
  if (!isSecure()) return Promise.reject(new Error('need_https'));

  sceneEl = $('arScene');
  if (!sceneEl) return Promise.reject(new Error('no_scene'));

  setStatus('Meminta kamera…');
  document.body.classList.add('ar-live');
  updateScanPrompt();

  return waitLayout().then(() => {
    bindMarkerEvents();
    resizeScene();
    if (!arStarted) return startMindAR();
    fixVideoAndRenderer();
    resizeScene();
  }).then(() => {
    setTimeout(fixVideoAndRenderer, 500);
    setTimeout(resizeScene, 800);
  });
}

export function isCameraReady() {
  return cameraReady;
}

export async function openAR(mode, payload) {
  if (!cameraReady) {
    try {
      await bootCamera();
    } catch (e) {
      if (e.message === 'need_https') $('httpsBootBox')?.classList.add('show');
      return;
    }
  }

  currentMode = mode || 'component';
  if (payload) currentPayload = payload;
  if (markerFound) applyMode(currentMode, currentPayload);
}

export function closeAR() {
  setStatus('Kamera aktif');
}

export function initAR() {
  const hint = $('bootHint');
  try {
    sceneEl = $('arScene');
    bindMarkerEvents();

    if (!isSecure()) {
      $('httpsBootBox')?.classList.add('show');
      const btnHttps = $('btnBootHttps');
      if (btnHttps) btnHttps.href = httpsUrl();
    }

    $('btnArClose')?.addEventListener('click', closeAR);

    document.addEventListener('ewire:ar-component', (e) => {
      if (e.detail?.id && cameraReady) showComponent(e.detail.id);
    });

    window.addEventListener('orientationchange', () => setTimeout(resizeScene, 400));
  } catch (err) {
    console.error('initAR error:', err);
    if (hint) hint.textContent = '❌ ' + (err?.message || err);
  }
}
