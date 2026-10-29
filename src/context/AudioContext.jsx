// src/context/AudioContext.jsx
// Studio Audio Engine for SAKA TIKA: Mengenal Huruf
// Features studio BGM rotation using Howler, automated synth fallback, and voice guidance.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import { Howl, Howler } from "howler";
import * as synth from "../utils/soundSynthesizer.js";

const AudioContext = createContext(null);

// Playlist of normalized studio BGM tracks
const BGM_PLAYLIST = [
  "/audio/bgm/ukulele.mp3",
  "/audio/bgm/littleidea.mp3",
  "/audio/bgm/smile.mp3",
  "/audio/bgm/happiness-129206.mp3",
  "/audio/bgm/folk-uplifting.mp3",
  "/audio/bgm/upbeat-happy.mp3",
  "/audio/bgm/happy-music-112291.mp3",
  "/audio/bgm/light-step-8021.mp3",
];

export function AudioProvider({ children }) {
  const [isBgmEnabled, setIsBgmEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem("saka_tika_bgm");
      return stored ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

  const [isSfxEnabled, setIsSfxEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem("saka_tika_sfx");
      return stored ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

  // Track user gesture to prevent browser autoplay policy warnings
  const [hasInteracted, setHasInteracted] = useState(false);

  const currentTrackIdxRef = useRef(0);
  const bgmHowlRef = useRef(null);
  const synthControllerRef = useRef(null);
  const menuVoiceHowlRef = useRef(null);
  const isUsingSynthFallbackRef = useRef(false);

  // Stop active BGM (Howl or synth)
  const stopBgmInternal = useCallback(() => {
    if (bgmHowlRef.current) {
      bgmHowlRef.current.stop();
      bgmHowlRef.current.unload();
      bgmHowlRef.current = null;
    }
    if (synthControllerRef.current) {
      synthControllerRef.current.stop();
      synthControllerRef.current = null;
    }
  }, []);

  // Play next or indexed BGM track with fallback
  const playTrackInternal = useCallback((trackIndex) => {
    stopBgmInternal();

    const trackPath = BGM_PLAYLIST[trackIndex % BGM_PLAYLIST.length];

    try {
      const howl = new Howl({
        src: [trackPath],
        html5: false,
        preload: true,
        volume: 0.28,
        autoplay: true,
        onend: () => {
          // Auto rotate to next track in playlist
          currentTrackIdxRef.current = (currentTrackIdxRef.current + 1) % BGM_PLAYLIST.length;
          playTrackInternal(currentTrackIdxRef.current);
        },
        onloaderror: () => {
          // Fall back gracefully to soundSynthesizer
          isUsingSynthFallbackRef.current = true;
          if (!synthControllerRef.current) {
            synthControllerRef.current = new synth.BgmSynthesizerController();
            synthControllerRef.current.start();
          }
        },
        onplayerror: () => {
          howl.once("unlock", () => {
            howl.play();
          });
        },
      });

      bgmHowlRef.current = howl;
      isUsingSynthFallbackRef.current = false;
    } catch {
      // Fallback to synth controller
      isUsingSynthFallbackRef.current = true;
      if (!synthControllerRef.current) {
        synthControllerRef.current = new synth.BgmSynthesizerController();
        synthControllerRef.current.start();
      }
    }
  }, [stopBgmInternal]);

  // Browser Autoplay interaction listener to unlock audio strictly after user gesture
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      setHasInteracted(true);

      // Safely resume Howler Web Audio context if available
      try {
        if (typeof Howler !== "undefined" && Howler.ctx && Howler.ctx.state === "suspended") {
          Howler.ctx.resume().catch(() => {});
        }
      } catch {
        // ignore
      }

      // Safely unlock synth context
      synth.unlockAudio();

      window.removeEventListener("pointerdown", handleFirstUserInteraction);
      window.removeEventListener("keydown", handleFirstUserInteraction);
      window.removeEventListener("touchstart", handleFirstUserInteraction);
    };

    window.addEventListener("pointerdown", handleFirstUserInteraction, { passive: true });
    window.addEventListener("keydown", handleFirstUserInteraction, { passive: true });
    window.addEventListener("touchstart", handleFirstUserInteraction, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstUserInteraction);
      window.removeEventListener("keydown", handleFirstUserInteraction);
      window.removeEventListener("touchstart", handleFirstUserInteraction);
    };
  }, []);

  // Manage BGM play/pause based on toggle state and user interaction
  useEffect(() => {
    // Only attempt BGM start once the user has performed at least one gesture
    if (!hasInteracted) return;

    if (isBgmEnabled) {
      playTrackInternal(currentTrackIdxRef.current);
    } else {
      stopBgmInternal();
    }

    return () => {
      stopBgmInternal();
    };
  }, [hasInteracted, isBgmEnabled, playTrackInternal, stopBgmInternal]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem("saka_tika_bgm", JSON.stringify(isBgmEnabled));
    } catch {
      // Ignore localStorage errors
    }
  }, [isBgmEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem("saka_tika_sfx", JSON.stringify(isSfxEnabled));
    } catch {
      // Ignore localStorage errors
    }
  }, [isSfxEnabled]);

  // Play studio voice prompt for Main Menu
  const playMenuVoice = useCallback(() => {
    if (!isSfxEnabled) return;

    try {
      if (menuVoiceHowlRef.current) {
        menuVoiceHowlRef.current.stop();
        menuVoiceHowlRef.current.unload();
        menuVoiceHowlRef.current = null;
      }

      const voiceHowl = new Howl({
        src: ["/audio/voice/menu_voice.wav"],
        volume: 0.85,
        autoplay: true,
        html5: false,
        onloaderror: () => {},
        onplayerror: () => {
          voiceHowl.once("unlock", () => {
            voiceHowl.play();
          });
        },
      });

      menuVoiceHowlRef.current = voiceHowl;
    } catch {
      // Gracefully silent on audio errors
    }
  }, [isSfxEnabled]);

  // Play SFX with immediate synthesizer responsiveness and fallback
  const playSfx = useCallback(
    (type) => {
      if (!isSfxEnabled) return;

      // Unlock on explicit sound invocation
      synth.unlockAudio();

      switch (type) {
        case "click":
          synth.playClickSound();
          break;
        case "hover":
          synth.playHoverSound();
          break;
        case "success":
          synth.playSuccessSound();
          break;
        case "error":
          synth.playErrorSound();
          break;
        case "fanfare":
          synth.playFanfareSound();
          break;
        case "note-do":
          synth.playXylophoneNote(0);
          break;
        case "note-re":
          synth.playXylophoneNote(1);
          break;
        case "note-mi":
          synth.playXylophoneNote(2);
          break;
        case "chirp":
          synth.playBirdChirp();
          break;
        case "sun-chime":
          synth.playSunChime();
          break;
        default:
          synth.playClickSound();
      }
    },
    [isSfxEnabled]
  );

  const toggleBgm = useCallback(() => {
    synth.unlockAudio();
    setHasInteracted(true);
    setIsBgmEnabled((prev) => !prev);
  }, []);

  const toggleSfx = useCallback(() => {
    synth.unlockAudio();
    setHasInteracted(true);
    setIsSfxEnabled((prev) => !prev);
  }, []);

  const value = {
    isBgmEnabled,
    isSfxEnabled,
    toggleBgm,
    toggleSfx,
    playSfx,
    playMenuVoice,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const context = React.useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
