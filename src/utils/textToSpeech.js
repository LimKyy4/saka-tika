/**
 * Utilitas Text-to-Speech menggunakan Web Speech Synthesis (Bahasa Indonesia)
 * dengan fallback SFX Howler.js agar ada efek bunyi "pop/chime" ceria.
 */

import { getAudioApi } from '../context/AudioContext'

/* Dapatkan suara bahasa Indonesia yang tersedia, fallback ke suara default */
const getIndonesianVoice = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  return voices.find((voice) => voice.lang.startsWith('id')) || voices[0] || null
}

/* Siapkan SpeechSynthesisUtterance dengan bahasa Indonesia */
const makeUtterance = (text, lang = 'id-ID', rate = 0.95, pitch = 1.1) => {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = rate
  utterance.pitch = pitch
  const voice = getIndonesianVoice()
  if (voice) utterance.voice = voice
  return utterance
}

/* Tunggu daftar suara siap (beberapa browser memuat suara secara async) */
export const waitForVoices = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return Promise.resolve()
  return new Promise((resolve) => {
    if (window.speechSynthesis.getVoices().length > 0) {
      resolve()
    } else {
      window.speechSynthesis.onvoiceschanged = () => resolve()
      setTimeout(() => resolve(), 1000)
    }
  })
}

/* Membuat suara bunyi pendek sebelum pengucapan (jika Howler tersedia) */
const playSpeechChime = () => {
  try {
    getAudioApi()?.playSfx('click')
  } catch (err) {
    /* Howler belum siap, abaikan */
  }
}

/* Ucapkan bunyi ejaan huruf (contoh: "B") */
export const speakLetter = (letter) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  playSpeechChime()
  const utterance = makeUtterance(letter, 'id-ID', 1, 1.3)
  window.speechSynthesis.speak(utterance)
}

/* Ucapkan kalimat contoh (contoh: "B untuk Bola") */
export const speakSentence = (sentence) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  playSpeechChime()
  const utterance = makeUtterance(sentence, 'id-ID', 0.95, 1.1)
  window.speechSynthesis.speak(utterance)
}

/* Berhentikan semua pengucapan yang sedang berlangsung */
export const stopSpeech = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
}

/* ---------------- Audio huruf (OGG + fallback TTS) ---------------- */

/* Normalisasi input: bisa objek huruf dari alphabetData, atau string "A" */
const toLetterId = (letter) => {
  if (!letter) return ''
  const raw =
    typeof letter === 'string'
      ? letter
      : letter.id || letter.capital || letter.letter || ''
  return String(raw).trim().toUpperCase().slice(0, 1)
}

/* Tentukan URL audio: pakai audioUrl dari data, atau pola /audio/letters/<X>.ogg */
export const getLetterAudioUrl = (letter, letterId) => {
  if (
    letter &&
    typeof letter === 'object' &&
    typeof letter.audioUrl === 'string' &&
    letter.audioUrl.length > 0
  ) {
    return letter.audioUrl
  }
  return `/audio/letters/${letterId}.ogg`
}

/**
 * Putar suara huruf.
 * 1) Coba file OGG (/audio/letters/A.ogg ... Z.ogg) lewat Howler.
 * 2) Jika 404 / gagal dimuat, otomatis jatuh ke TTS Bahasa Indonesia.
 * Fungsi ini tidak pernah melempar error ke React.
 */
export const playLetterAudio = (letter) => {
  const letterId = toLetterId(letter)
  if (!letterId) return

  const audioUrl = getLetterAudioUrl(letter, letterId)

  try {
    stopSpeech()
    const api = getAudioApi()

    if (!api || typeof api.playLetter !== 'function') {
      speakLetter(letterId)
      return
    }

    api.playLetter(letterId, audioUrl, () => speakLetter(letterId))
  } catch (err) {
    console.warn('[Audio] Gagal memutar audio huruf, memakai TTS:', err)
    speakLetter(letterId)
  }
}

/* Hentikan audio huruf yang sedang diputar */
export const stopLetterAudio = () => {
  try {
    getAudioApi()?.stopLetter?.()
  } catch (err) {
    /* audio belum siap, abaikan */
  }
}
