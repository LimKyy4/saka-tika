// src/utils/speechEngine.js
// Indonesian speech synthesis engine with WebAudio chime fallback.
// ZERO EMOJIS anywhere in this file.

import { playHoverSound } from "./soundSynthesizer.js";

/**
 * Returns an appropriate Indonesian voice, preferring id-ID.
 * Falls back to the first available voice if none found.
 */
function getIndonesianVoice() {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "id-ID") ||
    voices.find((v) => v.lang.startsWith("id")) ||
    voices[0] ||
    null
  );
}

function speak(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "id-ID";
    utter.pitch = 1.1;
    utter.rate = 0.9;
    utter.volume = 1;
    utter.onerror = () => {};
    const voice = getIndonesianVoice();
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  } catch {
    // Ignore speech errors gracefully
  }
}

/**
 * Speak the letter name.
 * Accepts either letter object ({ letter: "B", phonetic: "be" }) or simple string ("B").
 */
let pendingSpeakTimer = null;

function scheduleSpeak(fn, delayMs) {
  if (pendingSpeakTimer) {
    clearTimeout(pendingSpeakTimer);
  }
  pendingSpeakTimer = setTimeout(() => {
    pendingSpeakTimer = null;
    fn();
  }, delayMs);
}

export function speakLetter(param) {
  playHoverSound();
  scheduleSpeak(() => {
    if (typeof param === "string") {
      speak(`Huruf ${param}`);
    } else if (param && param.letter) {
      speak(`Huruf ${param.letter}, dibaca ${param.phonetic || param.letter}`);
    }
  }, 80);
}

/**
 * Speak the letter + example word or simple word string.
 * Accepts either object ({ letter: "B", word: "Bola" }) or simple string ("Bola").
 */
export function speakWord(param) {
  playHoverSound();
  scheduleSpeak(() => {
    if (typeof param === "string") {
      speak(param);
    } else if (param && param.word) {
      speak(`${param.letter || param.phonetic || ""}, untuk ${param.word}`);
    }
  }, 80);
}

/**
 * Speak any custom Indonesian instruction text.
 */
export function speakInstruction(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  scheduleSpeak(() => speak(text), 50);
}

// Pre-warm voices list (browsers require user interaction first)
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  if (typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener(
      "voiceschanged",
      () => {
        window.speechSynthesis?.getVoices();
      },
      { once: true }
    );
  }
}
