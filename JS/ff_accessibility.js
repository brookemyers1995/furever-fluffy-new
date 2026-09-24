(() => {
  const root = document.documentElement;
  const widget = document.querySelector('.accessibility-widget');
  if (!widget) return;
  const trigger = widget.querySelector('.accessibility-trigger');
  const panel = widget.querySelector('.accessibility-panel');
  const closeButton = widget.querySelector('.accessibility-close');
  const motionButton = widget.querySelector('[data-a11y="motion"]');
  const contrastButton = widget.querySelector('[data-a11y="contrast"]');
  const output = widget.querySelector('#text-size-value');
  const storageKey = 'furever-fluffy-accessibility';
  const defaultState = { size: 100, contrast: false, motion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false };
  let state = { ...defaultState };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === 'object') {
      state.size = [100, 125, 150, 175, 200].includes(saved.size) ? saved.size : 100;
      state.contrast = saved.contrast === true;
      state.motion = saved.motion === true;
    }
  } catch (_) { /* Private browsing or blocked storage: controls still work. */ }
  function apply() {
    root.style.fontSize = `${state.size}%`;
    root.dataset.a11yContrast = state.contrast ? 'high' : 'normal';
    root.dataset.a11yMotion = state.motion ? 'paused' : 'running';
    output.value = `${state.size}%`;
    contrastButton.setAttribute('aria-pressed', String(state.contrast));
    motionButton.setAttribute('aria-pressed', String(state.motion));
    contrastButton.querySelector('.option-state').textContent = state.contrast ? 'On' : 'Off';
    motionButton.querySelector('.option-state').textContent = state.motion ? 'On' : 'Off';
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (_) {}
  }
  function togglePanel(open) {
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? 'Close accessibility options' : 'Open accessibility options');
    if (open) closeButton.focus(); else trigger.focus();
  }
  trigger.addEventListener('click', () => togglePanel(panel.hidden));
  closeButton.addEventListener('click', () => togglePanel(false));
  widget.addEventListener('click', event => {
    const action = event.target.closest('[data-a11y]')?.dataset.a11y;
    if (!action) return;
    if (action === 'text-up') state.size = Math.min(200, state.size + 25);
    if (action === 'text-down') state.size = Math.max(100, state.size - 25);
    if (action === 'contrast') state.contrast = !state.contrast;
    if (action === 'motion') state.motion = !state.motion;
    if (action === 'reset') state = { ...defaultState };
    apply();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) togglePanel(false);
  });
  document.addEventListener('pointerdown', event => {
    if (!panel.hidden && !widget.contains(event.target)) {
      panel.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-label', 'Open accessibility options');
    }
  });
  apply();
})();
