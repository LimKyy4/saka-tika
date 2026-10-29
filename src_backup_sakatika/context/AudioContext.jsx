// src/context/AudioContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { Howl } from "howler";
import * as synth from "../utils/soundSynthesizer.js";

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [isBgmEnabled, setIsBgmEnabled] = useState(() => {
    const stored = localStorage.getItem("saka_tika_bgm");
    return stored ? JSON.parse(stored) : true;
  });
  const [isSfxEnabled, setIsSfxEnabled] = useState(() => {
    const stored = localStorage.getItem("saka_tika_sfx");
    return stored ? JSON.parse(stored) : true;
  });
  const [bgmController, setBgmController] = useState(null);

  // Initialize BGM controller (fallback synth)
  useEffect(() => {
    const controller = new synth.BgmSynthesizerController();
    setBgmController(controller);
    if (isBgmEnabled) {
      controller.start();
    }
    return () => controller.stop();
  }, []);

  // Persist toggles
  useEffect(() => {
    localStorage.setItem("saka_tika_bgm", JSON.stringify(isBgmEnabled));
    if (bgmController) {
      if (isBgmEnabled) bgmController.start(); else bgmController.stop();
    }
  }, [isBgmEnabled, bgmController]);
  useEffect(() => {
    localStorage.setItem("saka_tika_sfx", JSON.stringify(isSfxEnabled));
  }, [isSfxEnabled]);

  const playSfx = useCallback(
    (type) => {
      if (!isSfxEnabled) return;
      // Attempt to play mp3 via Howler, fallback to synth
      const src = `/audio/${type}.mp3`;
      const howl = new Howl({ src, volume: 0.5, autoplay: true, onloaderror: () => {}, onplayerror: () => {} });
      // If Howl fails to load, the error callbacks fire but we still want synth fallback.
      // The Howler API does not provide a promise; we rely on error callback to trigger synth.
      howl.once("loaderror", () => {
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
          default:
            synth.playClickSound();
        }
      });
    },
    [isSfxEnabled]
  );

  const toggleBgm = () => setIsBgmEnabled((v) => !v);
  const toggleSfx = () => setIsSfxEnabled((v) => !v);

  const value = {
    isBgmEnabled,
    isSfxEnabled,
    toggleBgm,
    toggleSfx,
    playSfx,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export const useAudio = () => React.useContext(AudioContext);
