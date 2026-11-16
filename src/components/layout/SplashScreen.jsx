// src/components/layout/SplashScreen.jsx
// Studio Intro Video Screen with Fullscreen Autoplay Video and Seamless Transition.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Howler } from "howler";
import { unlockAudio } from "../../utils/soundSynthesizer.js";

export default function SplashScreen({ onFinish, onComplete }) {
  const triggerFinish = onFinish || onComplete;
  const videoRef = useRef(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleFinish = useCallback(() => {
    if (isFadingOut) return;
    setIsFadingOut(true);

    try {
      sessionStorage.setItem("sakatika_intro_shown", "true");
      sessionStorage.setItem("saka_tika_splash_seen", "true");
    } catch {
      // Storage unavailable in private browsing mode
    }

    setTimeout(() => {
      triggerFinish?.();
    }, 600);
  }, [isFadingOut, triggerFinish]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Video autoplay was prevented; will play on user tap
      });
    }
  }, []);

  const handleContainerInteraction = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {
          handleFinish();
        });
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
  }, [handleFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onClick={handleContainerInteraction}
      className="fixed inset-0 w-screen h-screen z-50 overflow-hidden bg-[#0F172A] flex items-center justify-center select-none"
    >
      <video
        ref={videoRef}
        src="/video/intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleFinish}
        onError={handleFinish}
        className="w-full h-full object-contain bg-[#0F172A] pointer-events-none"
      />
    </motion.div>
  );
}
