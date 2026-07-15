let ctx = null;
let master = null;
let enabled = true;

function ensure() {
  if (!enabled) return null;
  if (!ctx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    ctx = new AudioContextClass();
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, duration = 0.18, type = 'sine', gain = 0.3, pan = 0, delay = 0) {
  const ac = ensure();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  const p = ac.createStereoPanner ? ac.createStereoPanner() : null;
  const start = ac.currentTime + delay;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(Math.max(0.001, gain), start + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(g);
  if (p) {
    p.pan.value = Math.max(-1, Math.min(1, pan));
    g.connect(p);
    p.connect(master);
  } else {
    g.connect(master);
  }
  osc.start(start);
  osc.stop(start + duration + 0.03);
}

export function setAudioEnabled(value) {
  enabled = Boolean(value);
  if (!enabled && ctx) ctx.suspend().catch(() => {});
  if (enabled) ensure();
}

export function unlockAudio() { ensure(); }

export function playUi(kind = 'ok') {
  if (kind === 'danger') {
    tone(130, .16, 'sawtooth', .38, -0.15);
    tone(98, .22, 'sawtooth', .35, .15, .12);
  } else if (kind === 'success') {
    tone(330, .12, 'sine', .28, -0.2);
    tone(494, .16, 'sine', .3, .2, .1);
    tone(659, .25, 'sine', .25, 0, .22);
  } else if (kind === 'step') {
    tone(90, .08, 'triangle', .2, 0);
  } else {
    tone(280, .08, 'sine', .16, 0);
  }
}

export function playRepairTone(index) {
  const freqs = [180, 420, 820];
  tone(freqs[index] || 420, .55, 'sine', .35, 0);
}

export function playSignal(signal) {
  const pan = signal.direction === 'left' ? -0.8 : signal.direction === 'right' ? 0.8 : 0;
  const base = signal.real ? 370 : 345;
  const gaps = signal.rhythm === 'stable' ? [0, .38, .76] : [0, .25, .82];
  gaps.forEach((d, i) => tone(base + i * (signal.real ? 2 : 17), .15, signal.real ? 'sine' : 'triangle', .3, pan, d));
}

export function playSonar(distance, direction = 'center') {
  const pan = direction === 'left' ? -0.75 : direction === 'right' ? 0.75 : 0;
  const delay = Math.min(.75, Math.max(.08, distance / 20));
  tone(700, .08, 'sine', .25, pan);
  tone(520, .11, 'sine', .22, pan, delay);
}

export function playThreat(distance = 2) {
  const gain = distance <= 1 ? .5 : distance === 2 ? .32 : .2;
  const interval = distance <= 1 ? .22 : distance === 2 ? .42 : .68;
  for (let i = 0; i < 3; i++) tone(72, .14, 'sawtooth', gain, i % 2 ? .35 : -.35, i * interval);
}

export function playPressure() {
  tone(110, .4, 'triangle', .22, -0.4);
  tone(105, .4, 'triangle', .22, .4, .14);
}

export function speak(text, enabledTts) {
  if (!enabledTts || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ru-RU';
  u.rate = 1.02;
  u.pitch = .92;
  window.speechSynthesis.speak(u);
}
