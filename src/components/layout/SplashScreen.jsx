// src/components/layout/SplashScreen.jsx
// Studio Startup Screen: 1.5s Static Loading Bar followed by Fullscreen Intro Video with Audio.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Howler } from "howler";
import { unlockAudio } from "../../utils/soundSynthesizer.js";

const LOADING_DURATION_MS = 1500;

export default function SplashScreen({ onFinish = () => {}, onComplete = () => {} }) {
  const triggerFinish = onFinish || onComplete;
  const videoRef = useRef(null);
  const finishTimeoutRef = useRef(null);
  const [phase, setPhase] = useState("loading"); // "loading" -> "video"
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    return () => {
      if (finishTimeoutRef.current) {
        clearTimeout(finishTimeoutRef.current);
        finishTimeoutRef.current = null;
      }
    };
  }, []);

  const handleFinish = useCallback(() => {
    if (isFadingOut) return;
    setIsFadingOut(true);

    try {
      sessionStorage.setItem("sakatika_intro_shown", "true");
      sessionStorage.setItem("saka_tika_splash_seen", "true");
    } catch {
      // Storage unavailable in private browsing mode
    }

    finishTimeoutRef.current = setTimeout(() => {
      finishTimeoutRef.current = null;
      triggerFinish?.();
    }, 500);
  }, [isFadingOut, triggerFinish]);

  // Phase 1: 1.5s static loading bar before switching seamlessly to intro video
  useEffect(() => {
    const unlockOnEarlyGesture = () => {
      try {
        if (typeof Howler !== "undefined" && Howler.ctx && Howler.ctx.state === "suspended") {
          Howler.ctx.resume().catch(() => {});
        }
      } catch {
        // Ignore AudioContext resume errors
      }
      unlockAudio();
    };

    window.addEventListener("pointerdown", unlockOnEarlyGesture, { once: true, passive: true });
    window.addEventListener("keydown", unlockOnEarlyGesture, { once: true, passive: true });

    const timer = setTimeout(() => {
      setPhase("video");
    }, LOADING_DURATION_MS);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", unlockOnEarlyGesture);
      window.removeEventListener("keydown", unlockOnEarlyGesture);
    };
  }, []);

  // Phase 2: Play /video/intro.mp4 with built-in audio enabled, falling back silently if browser blocks unmuted autoplay
  useEffect(() => {
    if (phase !== "video") return;

    const videoEl = videoRef.current;
    if (!videoEl) return;

    let cancelled = false;
    let cleanupListeners = null;

    const attachSilentUnmuteListeners = () => {
      const handleFirstGesture = () => {
        if (videoRef.current) {
          videoRef.current.muted = false;
          videoRef.current.volume = 1.0;
          if (videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          }
        }

        try {
          if (typeof Howler !== "undefined" && Howler.ctx && Howler.ctx.state === "suspended") {
            Howler.ctx.resume().catch(() => {});
          }
        } catch {
          // AudioContext resume safeguard
        }
        unlockAudio();

        window.removeEventListener("pointerdown", handleFirstGesture);
        window.removeEventListener("keydown", handleFirstGesture);
      };

      window.addEventListener("pointerdown", handleFirstGesture, { once: true, passive: true });
      window.addEventListener("keydown", handleFirstGesture, { once: true, passive: true });

      cleanupListeners = () => {
        window.removeEventListener("pointerdown", handleFirstGesture);
        window.removeEventListener("keydown", handleFirstGesture);
      };
    };

    const startPlayback = async () => {
      videoEl.volume = 1.0;
      videoEl.defaultMuted = false;
      videoEl.muted = false;

      try {
        await videoEl.play();
      } catch {
        if (cancelled) return;
        // Browser blocked unmuted autoplay on fresh tab; fall back to muted play and unmute silently on first interaction
        try {
          videoEl.muted = true;
          await videoEl.play();
          attachSilentUnmuteListeners();
        } catch {
          handleFinish();
        }
      }
    };

    startPlayback();

    return () => {
      cancelled = true;
      cleanupListeners?.();
      if (videoRef.current) {
        try {
          videoRef.current.pause();
        } catch {
          // Ignore pause errors on unmounted media element
        }
      }
    };
  }, [phase, handleFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 w-screen h-screen z-50 overflow-hidden bg-[#0F172A] flex items-center justify-center select-none"
    >
      {/* Hidden preload during 1.5s bar so video starts immediately at 1500ms */}
      <video
        ref={videoRef}
        src="/video/intro.mp4"
        playsInline
        preload="auto"
        onEnded={handleFinish}
        onError={handleFinish}
        className={`w-full h-full object-cover bg-[#0F172A] pointer-events-none transition-opacity duration-300 ${
          phase === "video" ? "opacity-100" : "opacity-0 absolute inset-0"
        }`}
      />

      {phase === "loading" && (
        <div className="relative z-10 flex flex-col items-center justify-center gap-5 px-6 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <span className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-wider text-white drop-shadow-[0_4px_14px_rgba(56,189,248,0.45)]">
              SAKA TIKA
            </span>
            <span className="font-sans font-bold text-sm sm:text-base tracking-wide text-sky-200">
              Memuat...
            </span>
          </div>

          <div
            role="progressbar"
            aria-label="Memuat aplikasi Saka Tika"
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-72 md:w-96 h-4 rounded-full bg-white/25 p-1 overflow-hidden border border-white/30 shadow-inner"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: LOADING_DURATION_MS / 1000, ease: "linear" }}
              className="h-full rounded-full bg-gradient-to-r from-[#F9D968] via-[#FDE047] to-[#38BDF8] shadow-[0_0_10px_rgba(249,217,104,0.65)]"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
