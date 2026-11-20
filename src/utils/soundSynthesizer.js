// src/utils/soundSynthesizer.js
// Procedural Web Audio API based sound synthesizer for child-friendly UI feedback.
// No external dependencies. Safe lazy initialization awaiting user gestures.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

let audioContext = null;

/**
 * Lazy accessor for the shared AudioContext instance.
 * Never creates or resumes context eagerly on module load or without user interaction.
 */
export function getContext() {
  if (typeof window === "undefined") return null;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  if (!audioContext) {
    try {
      audioContext = new AudioCtx();
    } catch {
      return null;
    }
  }

  // Attempt non-blocking resume if suspended
  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume().catch(() => {
      // Ignored if user gesture has not occurred yet
    });
  }

  return audioContext;
}

/**
 * Explicit user-interaction audio pipeline unlocker.
 */
export function unlockAudio() {
  try {
    const ctx = getContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
  } catch {
    // Ignore unlock errors
  }
}

function playTone({ frequency, duration = 0.2, type = "sine", volume = 0.2 }) {
  try {
    const ctx = getContext();
    if (!ctx || ctx.state === "suspended") return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Graceful error silence
  }
}

export function playClickSound() {
  playTone({ frequency: 800, duration: 0.08, type: "square", volume: 0.25 });
}

export function playHoverSound() {
  playTone({ frequency: 440, duration: 0.07, type: "triangle", volume: 0.15 });
}

export function playChalkSound() {
  playTone({ frequency: 280 + Math.random() * 80, duration: 0.04, type: "triangle", volume: 0.05 });
}

export function playSuccessSound() {
  try {
    const ctx = getContext();
    if (!ctx || ctx.state === "suspended") return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const start = ctx.currentTime + i * 0.15;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.3, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  } catch {
    // Graceful error silence
  }
}

export function playErrorSound() {
  try {
    const ctx = getContext();
    if (!ctx || ctx.state === "suspended") return;

    const frequencies = [164.81, 155.56];
    frequencies.forEach((freq, i) => {
      const start = ctx.currentTime + i * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  } catch {
    // Graceful error silence
  }
}

export function playFanfareSound() {
  try {
    const ctx = getContext();
    if (!ctx || ctx.state === "suspended") return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const start = ctx.currentTime + i * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.35, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.6);
    });
  } catch {
    // Graceful error silence
  }
}

// Xylophone notes for ABC Blocks and Musical Title Blocks (C5 through C6)
export function playXylophoneNote(noteIndex = 0) {
  try {
    const ctx = getContext();
    if (!ctx || ctx.state === "suspended") return;

    // C5 (Do), D5 (Re), E5 (Mi), F5 (Fa), G5 (Sol), A5 (La), B5 (Si), C6 (Do high)
    const frequencies = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    const freq = frequencies[Math.abs(noteIndex) % frequencies.length];

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;

    // Harmonious overtone for wooden bar chime
    osc2.type = "triangle";
    osc2.frequency.value = freq * 2;

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc2.start();
    osc.stop(ctx.currentTime + 0.55);
    osc2.stop(ctx.currentTime + 0.55);
  } catch {
    // Graceful error silence
  }
}

// Cute high songbird chirp
export function playBirdChirp() {
  try {
    const ctx = getContext();
    if (!ctx || ctx.state === "suspended") return;

    const start = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(2400, start);
    osc.frequency.exponentialRampToValueAtTime(3200, start + 0.08);
    osc.frequency.exponentialRampToValueAtTime(2600, start + 0.14);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);

    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.16);
  } catch {
    // Graceful error silence
  }
}

// High shimmering sun chime
export function playSunChime() {
  try {
    const ctx = getContext();
    if (!ctx || ctx.state === "suspended") return;

    const notes = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7
    notes.forEach((freq, i) => {
      const start = ctx.currentTime + i * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.35);
    });
  } catch {
    // Graceful error silence
  }
}

// Crisp bubbly pop with ascending musical scale (Do, Re, Mi)
export function playBubblePopSound(stage = 0) {
  try {
    const ctx = getContext();
    if (!ctx || ctx.state === "suspended") return;

    const start = ctx.currentTime;
    const oscPop = ctx.createOscillator();
    const gainPop = ctx.createGain();
    const baseFreqs = [520, 650, 820];
    const baseFreq = baseFreqs[stage % baseFreqs.length];

    oscPop.type = "sine";
    oscPop.frequency.setValueAtTime(baseFreq * 2.2, start);
    oscPop.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, start + 0.06);

    gainPop.gain.setValueAtTime(0, start);
    gainPop.gain.linearRampToValueAtTime(0.3, start + 0.005);
    gainPop.gain.exponentialRampToValueAtTime(0.001, start + 0.09);

    oscPop.connect(gainPop).connect(ctx.destination);
    oscPop.start(start);
    oscPop.stop(start + 0.09);

    playXylophoneNote(stage);
  } catch {
    // Graceful error silence
  }
}

// Gentle comical rubber jelly wobble sound for non-target bubbles
export function playRubberBoingSound() {
  try {
    const ctx = getContext();
    if (!ctx || ctx.state === "suspended") return;

    const start = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(220, start);
    osc.frequency.exponentialRampToValueAtTime(340, start + 0.08);
    osc.frequency.exponentialRampToValueAtTime(180, start + 0.22);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.24);

    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.24);
  } catch {
    // Graceful error silence
  }
}

// Swift playful whoosh as the flying coin shoots up to the slot
export function playCoinWhooshSound() {
  try {
    const ctx = getContext();
    if (!ctx || ctx.state === "suspended") return;

    const start = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(350, start);
    osc.frequency.exponentialRampToValueAtTime(1100, start + 0.22);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.28);
  } catch {
    // Graceful error silence
  }
}

// Crisp sparkling chime ("DING!") when the flying coin lands into the target slot
export function playSlotSnapSound(stage = 0) {
  try {
    const ctx = getContext();
    if (!ctx || ctx.state === "suspended") return;

    const start = ctx.currentTime;
    const chordPitches = [
      [1046.5, 1318.51], // C6, E6
      [1174.66, 1396.91], // D6, F6
      [1318.51, 1567.98, 2093.0], // E6, G6, C7
    ];
    const notes = chordPitches[stage % chordPitches.length];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0, start + idx * 0.03);
      gain.gain.linearRampToValueAtTime(0.24, start + idx * 0.03 + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, start + idx * 0.03 + 0.38);

      osc.connect(gain).connect(ctx.destination);
      osc.start(start + idx * 0.03);
      osc.stop(start + idx * 0.03 + 0.38);
    });
  } catch {
    // Graceful error silence
  }
}

// Cute high-spirited giggle for Saka & Tika tap interaction
export function playMascotGiggleSound() {
  try {
    const ctx = getContext();
    if (!ctx || ctx.state === "suspended") return;

    const start = ctx.currentTime;
    const hops = [680, 840, 720, 960];
    hops.forEach((freq, i) => {
      const noteStart = start + i * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteStart);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.15, noteStart + 0.04);

      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.15, noteStart + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.08);

      osc.connect(gain).connect(ctx.destination);
      osc.start(noteStart);
      osc.stop(noteStart + 0.08);
    });
  } catch {
    // Graceful error silence
  }
}

// Soft subtle water drop sound when tapping ambient arena or background mini bubbles
export function playAmbientRippleSound() {
  try {
    const ctx = getContext();
    if (!ctx || ctx.state === "suspended") return;

    const start = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const base = 800 + Math.random() * 400;
    osc.frequency.setValueAtTime(base, start);
    osc.frequency.exponentialRampToValueAtTime(base * 1.6, start + 0.04);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.12, start + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.06);

    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.06);
  } catch {
    // Graceful error silence
  }
}

export class BgmSynthesizerController {
  constructor() {
    this.isPlaying = false;
    this.intervalId = null;
  }
  start() {
    if (this.isPlaying) return;
    try {
      const ctx = getContext();
      if (!ctx || ctx.state === "suspended") return;

      this.isPlaying = true;
      const notes = [523.25, 587.33, 659.25, 523.25];
      let index = 0;
      this.intervalId = setInterval(() => {
        try {
          if (!this.isPlaying) return;
          const currentCtx = getContext();
          if (!currentCtx || currentCtx.state === "suspended") return;

          const freq = notes[index % notes.length];
          const osc = currentCtx.createOscillator();
          const gain = currentCtx.createGain();
          osc.type = "triangle";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, currentCtx.currentTime);
          gain.gain.linearRampToValueAtTime(0.1, currentCtx.currentTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, currentCtx.currentTime + 0.5);
          osc.connect(gain).connect(currentCtx.destination);
          osc.start();
          osc.stop(currentCtx.currentTime + 0.5);
          index++;
        } catch {
          // ignore loop errors
        }
      }, 1200);
    } catch {
      // ignore
    }
  }
  stop() {
    if (!this.isPlaying) return;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isPlaying = false;
  }
}
