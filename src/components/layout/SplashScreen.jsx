// src/components/layout/SplashScreen.jsx
// Studio Intro Video Screen with Fullscreen Video, Autoplay Compliance & Tactile Skip.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FastForward, Play, Volume2 } from "lucide-react";
import { useAudio } from "../../context/AudioContext.jsx";

export default function SplashScreen({ onFinish, onComplete }) {
  const triggerFinish = onFinish || onComplete;
  const videoRef = useRef(null);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { playSfx } = useAudio();

  const handleFinish = useCallback(() => {
    if (isFadingOut) return;
    setIsFadingOut(true);

    try {
      sessionStorage.setItem("sakatika_intro_shown", "true");
      sessionStorage.setItem("saka_tika_splash_seen", "true");
    } catch {
      // Storage unavailable in some private windows
    }

    setTimeout(() => {
      triggerFinish?.();
    }, 600);
  }, [isFadingOut, triggerFinish]);

  // Attempt initial programmatic playback with autoplay fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback, prompt user interaction
        setNeedsInteraction(true);
      });
    }
  }, []);

  const handleStartWithSound = () => {
    playSfx("click");
    setNeedsInteraction(false);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // If still blocked, advance to main app
        handleFinish();
      });
    }
  };

  const handleSkip = () => {
    playSfx("click");
    if (videoRef.current) {
      videoRef.current.pause();
    }
    handleFinish();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 w-screen h-screen z-50 overflow-hidden bg-[#0F172A] flex items-center justify-center select-none"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src="/video/intro.mp4"
        playsInline
        preload="auto"
        onEnded={handleFinish}
        onError={handleFinish}
        className="w-full h-full object-contain bg-[#0F172A]"
      />

      {/* Top-Right 3D Tactile Skip Button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
        <motion.button
          type="button"
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94, y: 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={handleSkip}
          aria-label="Lewati Video Pembuka"
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#F9D968] hover:bg-[#fae07e] text-[#1B4965] font-display font-bold text-sm sm:text-base border-b-4 border-[#E3C654] shadow-lg cursor-pointer transition-colors active:border-b-0"
        >
          <span>Lewati</span>
          <FastForward size={18} className="fill-current" />
        </motion.button>
      </div>

      {/* Autoplay Fallback Overlay */}
      <AnimatePresence>
        {needsInteraction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleStartWithSound}
            className="absolute inset-0 z-20 bg-[#0F172A]/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.85, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white/95 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-4 border border-white"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-full bg-[#F9D968] border-b-4 border-[#E3C654] flex items-center justify-center shadow-xl"
              >
                <Play size={34} className="text-[#1B4965] fill-[#1B4965] ml-1" />
              </motion.div>

              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1B4965]">
                  Petualangan Saka Tika
                </h2>
                <p className="font-sans font-semibold text-xs sm:text-sm text-[#1B4965]/80 mt-1.5">
                  Ketuk untuk Masuk ke Petualangan Saka Tika
                </p>
                <p className="font-sans font-normal text-[11px] sm:text-xs text-[#1B4965]/60 mt-1">
                  Sentuh layar untuk membuka suara dan mulai menjelajah bersama!
                </p>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97, y: 1 }}
                onClick={handleStartWithSound}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#1B4965] hover:bg-[#153a50] text-white font-display font-bold text-base border-b-4 border-[#0e2736] shadow-lg flex items-center justify-center gap-2 cursor-pointer active:border-b-0 transition-all"
              >
                <Volume2 size={18} />
                <span>Sentuh Layar untuk Memulai</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
