let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

export function playTone(
  frequency: number,
  duration = 0.25,
  options: { type?: OscillatorType; volume?: number; when?: number } = {}
) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = options.type ?? 'sine';
  oscillator.frequency.value = frequency;

  const startTime = options.when ?? ctx.currentTime;
  const volume = options.volume ?? 0.1;

  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function playRingPattern() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(880, 0.18, { type: 'triangle', volume: 0.16, when: now });
  playTone(660, 0.18, { type: 'triangle', volume: 0.16, when: now + 0.22 });
}

export function playActionClick() {
  playTone(520, 0.12, { type: 'square', volume: 0.1 });
}

export function playSuccessChord() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  playTone(660, 0.2, { type: 'sine', volume: 0.12, when: now });
  playTone(880, 0.25, { type: 'sine', volume: 0.1, when: now + 0.05 });
  playTone(990, 0.3, { type: 'sine', volume: 0.08, when: now + 0.1 });
}
