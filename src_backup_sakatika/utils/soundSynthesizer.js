// src/utils/soundSynthesizer.js
// Procedural Web Audio API based sound synthesizer for child-friendly UI feedback.
// No external dependencies.

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioContext = null;
function getContext() {
  if (!audioContext) {
    audioContext = new AudioCtx();
  }
  return audioContext;
}

function playTone({ frequency, duration = 0.2, type = "sine", volume = 0.2 }) {
  const ctx = getContext();
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
}

export function playClickSound() {
  // Bright short pop
  playTone({ frequency: 800, duration: 0.08, type: "square", volume: 0.25 });
}

export function playHoverSound() {
  // Soft marimba-like tick
  playTone({ frequency: 440, duration: 0.07, type: "triangle", volume: 0.15 });
}

export function playSuccessSound() {
  // Ascending major triad C5-E5-G5-C6
  const notes = [523.25, 659.25, 783.99, 1046.5]; // frequencies Hz
  const ctx = getContext();
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
}

export function playErrorSound() {
  // Low double buzz
  const frequencies = [164.81, 155.56]; // E3, D#3
  const ctx = getContext();
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
}

export function playFanfareSound() {
  // Celebratory arpeggio (C5-E5-G5-C6) with a little echo
  const notes = [523.25, 659.25, 783.99, 1046.5];
  const ctx = getContext();
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
}

export class BgmSynthesizerController {
  constructor() {
    this.isPlaying = false;
    this.intervalId = null;
  }
  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    // Simple music-box melody loop (C5-D5-E5-C5)
    const notes = [523.25, 587.33, 659.25, 523.25];
    const ctx = getContext();
    let index = 0;
    this.intervalId = setInterval(() => {
      const freq = notes[index % notes.length];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
      index++;
    }, 1200);
  }
  stop() {
    if (!this.isPlaying) return;
    clearInterval(this.intervalId);
    this.isPlaying = false;
  }
}
