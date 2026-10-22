import { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
/* howler 2.x hanya mengekspor named export (exports.Howl), tanpa default export */
import { Howl } from 'howler'

export const AudioContext = createContext(null)

/* Akses API audio di luar komponen React (misal utilitas TTS).
   Sengaja di modul scope agar bisa diimpor sebelum provider ter-mount. */
let audioApi = null
export const getAudioApi = () => audioApi

const SOUNDS = {
  bgm: { src: '/audio/bgm.mp3', loop: true, volume: 0.35 },
  click: { src: '/audio/sfx-click.mp3', loop: false, volume: 0.55 },
  transition: { src: '/audio/sfx-transition.mp3', loop: false, volume: 0.55 },
  celebration: { src: '/audio/sfx-celebration.mp3', loop: false, volume: 0.65 },
  oops: { src: '/audio/sfx-oops.mp3', loop: false, volume: 0.4 },
}

/* Cadangan nada sintetis (Web Audio API) saat file MP3 tidak tersedia */
const SYNTH_TONES = {
  click: [{ frequency: 950, type: 'square', duration: 0.08, gainValue: 0.15 }],
  transition: [{ frequency: 700, type: 'sine', duration: 0.15, gainValue: 0.12 }],
  celebration: [
    { frequency: 660, type: 'triangle', duration: 0.12, gainValue: 0.14 },
    { frequency: 880, type: 'triangle', duration: 0.12, gainValue: 0.14, delay: 120 },
    { frequency: 1100, type: 'triangle', duration: 0.3, gainValue: 0.16, delay: 240 },
  ],
  oops: [
    { frequency: 420, type: 'sine', duration: 0.14, gainValue: 0.12 },
    { frequency: 300, type: 'sine', duration: 0.2, gainValue: 0.1, delay: 130 },
  ],
}

export const AudioProvider = ({ children }) => {
  /* ---------- 1. State & ref ---------- */
  const [isMuted, setIsMuted] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const instances = useRef({}) // instance Howl per key
  const letterSoundsRef = useRef({}) // instance Howl per huruf (A-Z)
  const audioCtxRef = useRef(null) // AudioContext Web Audio
  const mutedRef = useRef(false) // mirror isMuted (dibaca dari callback non-React)
  const bgmLoadedRef = useRef(false) // file BGM sudah siap diputar
  const bgmActiveRef = useRef(false) // BGM sedang/baru diminta diputar

  /* ---------- 2. Helper Web Audio ---------- */
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      audioCtxRef.current = Ctx ? new Ctx() : null
    }
    return audioCtxRef.current
  }, [])

  /* Fallback sintetis -- dipakai ketika file MP3 tidak tersedia */
  const playTone = useCallback(
    ({ frequency = 520, type = 'triangle', duration = 0.12, gainValue = 0.12 }) => {
      const ctx = getAudioCtx()
      if (!ctx) return
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(frequency, now)
      gain.gain.setValueAtTime(gainValue, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + duration)
    },
    [getAudioCtx]
  )

  /* ---------- 3. Kontrol BGM ----------
     Howl.play() mengembalikan ID numerik (bukan Promise), jadi TIDAK boleh
     dipanggil dengan .catch() -- itu memicu TypeError. */
  const startBgm = useCallback(() => {
    const bgm = instances.current.bgm
    if (!bgm || mutedRef.current || bgmActiveRef.current) return
    /* Tunggu file siap: Howler tidak bisa membatalkan play() yang sudah di-queue */
    if (!bgmLoadedRef.current) return
    try {
      bgm.play()
      bgmActiveRef.current = true
    } catch (err) {
      console.warn('[Audio] Gagal memulai BGM:', err)
    }
  }, [])

  const stopBgm = useCallback(() => {
    const bgm = instances.current.bgm
    if (!bgm || !bgmActiveRef.current) return
    try {
      bgm.pause()
    } catch (err) {
      console.warn('[Audio] Gagal menjeda BGM:', err)
    }
    bgmActiveRef.current = false
  }, [])

  /* ---------- 4. Howler ---------- */
  const initSounds = useCallback(() => {
    if (instances.current.bgm) return
    try {
      Object.entries(SOUNDS).forEach(([key, cfg]) => {
        instances.current[key] = new Howl({
          src: [cfg.src],
          loop: cfg.loop || false,
          volume: cfg.volume,
          html5: true,
          onload: () => {
            if (key !== 'bgm') return
            bgmLoadedRef.current = true
            startBgm()
          },
          onloaderror: (id, errorCode) => {
            console.warn(`[Audio] File "${cfg.src}" tidak tersedia (${errorCode}) -- memakai nada sintetis.`)
          },
          onplayerror: () => {
            /* Autoplay diblokir browser: biar bisa dicoba lagi di interaksi berikutnya */
            if (key === 'bgm') bgmActiveRef.current = false
          },
        })
      })
      setIsReady(true)
    } catch (err) {
      console.warn('[Audio] Howler gagal diinisialisasi, memakai nada sintetis:', err)
      setIsReady(true)
    }
  }, [startBgm])

  /* ---------- 5. API publik ---------- */
  /* Updater state dibuat murni (tanpa side effect) agar aman di StrictMode */
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  /* Mainkan efek suara (SFX) dengan fallback sintetis */
  const playSfx = useCallback(
    (type) => {
      if (isMuted) return
      const sfx = instances.current[type]
      if (sfx && sfx.state() === 'loaded') {
        try {
          sfx.play()
          return
        } catch (err) {
          console.warn(`[Audio] SFX play failed: ${type}`, err)
        }
      }
      /* Synth fallback per SFX type */
      const tones = SYNTH_TONES[type]
      if (!tones) return
      tones.forEach(({ delay = 0, ...tone }) => {
        if (delay > 0) setTimeout(() => playTone(tone), delay)
        else playTone(tone)
      })
    },
    [isMuted, playTone]
  )

  /* ---------- 5b. Audio huruf (OGG) ----------
     Memutar /audio/letters/<X>.ogg lewat Howler. Bila file tidak ada,
     onFallback dipanggil (TTS) dan TIDAK ada error yang dilempar ke React. */
  const stopLetter = useCallback((letterId) => {
    const target = letterId ? String(letterId).toUpperCase() : null
    Object.entries(letterSoundsRef.current).forEach(([key, sound]) => {
      if (target && key !== target) return
      try {
        sound.stop()
      } catch (err) {
        /* belum siap diputar, abaikan */
      }
    })
  }, [])

  const playLetter = useCallback(
    (letterId, src, onFallback) => {
      const id = String(letterId || '').toUpperCase()
      if (!id || !src) {
        try {
          onFallback?.()
        } catch (err) {
          /* abaikan */
        }
        return false
      }

      /* Saat audio dimatikan, jangan bunyikan apa pun */
      if (mutedRef.current) return true

      stopLetter(id)

      let sound = letterSoundsRef.current[id]
      let fallbackDone = false

      const runFallback = () => {
        if (fallbackDone) return
        fallbackDone = true
        if (sound) sound.__failed = true
        console.warn(`[Audio] File "${src}" tidak dapat diputar (${id}) -- memakai TTS.`)
        try {
          onFallback?.()
        } catch (err) {
          console.warn('[Audio] Fallback TTS gagal:', err)
        }
      }

      if (!sound) {
        sound = new Howl({
          src: [src],
          format: ['ogg'],
          preload: true,
          volume: 1,
          onloaderror: () => runFallback(),
          onplayerror: () => runFallback(),
        })
        letterSoundsRef.current[id] = sound
      }

      /* File sudah pernah gagal dimuat: langsung pakai TTS, jangan ulangi 404 */
      if (sound.__failed) {
        runFallback()
        return false
      }

      try {
        sound.play()
        return true
      } catch (err) {
        runFallback()
        return false
      }
    },
    [stopLetter]
  )

  /* ---------- 6. Effects ---------- */
  /* Sinkronisasi BGM dengan state mute */
  useEffect(() => {
    mutedRef.current = isMuted
    if (isMuted) stopBgm()
    else startBgm()
  }, [isMuted, isReady, startBgm, stopBgm])

  /* Ekspor API audio agar dapat diakses di luar komponen React (contoh: textToSpeech.js) */
  useEffect(() => {
    audioApi = { isMuted, toggleMute, playSfx, isReady, playLetter, stopLetter }
  }, [isMuted, toggleMute, playSfx, isReady, playLetter, stopLetter])

  /* Cleanup saat provider di-unmount */
  useEffect(
    () => () => {
      audioApi = null
      /* Bersihkan instance audio huruf */
      Object.values(letterSoundsRef.current).forEach((sound) => {
        try {
          sound.unload()
        } catch (err) {
          /* abaikan */
        }
      })
      letterSoundsRef.current = {}
      if (audioCtxRef.current) {
        if (typeof audioCtxRef.current.close === 'function') {
          audioCtxRef.current.close().catch(() => {})
        }
        audioCtxRef.current = null
      }
    },
    []
  )

  /* Start BGM pada interaksi pengguna pertama kali (kebijakan autoplay browser) */
  useEffect(() => {
    const onFirstInteraction = () => {
      initSounds()
      startBgm()
    }
    window.addEventListener('pointerdown', onFirstInteraction, { once: true })
    window.addEventListener('keydown', onFirstInteraction, { once: true })
    return () => {
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
    }
  }, [initSounds, startBgm])

  /* ---------- 7. Context value (semua dependency sudah dideklarasikan di atas) ---------- */
  const value = useMemo(
    () => ({ isMuted, toggleMute, playSfx, isReady, playLetter, stopLetter }),
    [isMuted, toggleMute, playSfx, isReady, playLetter, stopLetter]
  )

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

/** Hook untuk kemudahan akses audio controller */
export const useAudio = () => {
  const ctx = useContext(AudioContext)
  if (!ctx) {
    throw new Error('useAudio harus digunakan di dalam AudioProvider')
  }
  return ctx
}

export default AudioContext
