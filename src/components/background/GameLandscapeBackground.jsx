// src/components/background/GameLandscapeBackground.jsx
// Master orchestrator for the living landscape environment.
// Integrates the pure-scenery background asset (/assets/bg-utama-baru.jpg)
// with subtle parallax clouds, sun aura, distant birds & sunlit pollen motes for living 60 FPS motion.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import DriftingClouds from "./DriftingClouds.jsx";
import FlyingBirds from "./FlyingBirds.jsx";

export default function GameLandscapeBackground({ bgImage = "/assets/bg-utama-baru.jpg" }) {
  const [imgSrc, setImgSrc] = useState(bgImage);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (imgSrc.endsWith(".jpg")) {
      setImgSrc("/assets/bg-utama-baru.jfif");
    } else {
      setImgError(true);
    }
  };

  // 7 subtle, ultra-soft sunlit pollen motes floating gently over the landscape
  const pollenMotes = useMemo(
    () => [
      { size: 6, left: 18, bottom: 22, driftY: 28, driftX: 14, duration: 6.5, delay: 0 },
      { size: 4, left: 28, bottom: 35, driftY: 22, driftX: -10, duration: 7.2, delay: 1.2 },
      { size: 5, left: 45, bottom: 28, driftY: 30, driftX: 18, duration: 8.0, delay: 0.5 },
      { size: 7, left: 62, bottom: 20, driftY: 26, driftX: -16, duration: 6.8, delay: 2.1 },
      { size: 4, left: 74, bottom: 32, driftY: 24, driftX: 12, duration: 7.5, delay: 1.8 },
      { size: 5, left: 85, bottom: 25, driftY: 28, driftX: -12, duration: 6.2, delay: 0.8 },
      { size: 6, left: 52, bottom: 16, driftY: 20, driftX: 10, duration: 7.0, delay: 2.8 },
    ],
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* ── 1. Pure Scenery Living Landscape Background ── */}
      {!imgError ? (
        <img
          src={imgSrc}
          alt="Latar Belakang Utama Saka Tika"
          onError={handleImageError}
          className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
          style={{ imageRendering: "-webkit-optimize-contrast" }}
        />
      ) : (
        /* Fallback gradient if image not loaded */
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(180deg, #99D5F9 0%, #BAE3FA 24%, #DDF0FB 48%, #FFF4E3 74%, #FDF7EB 100%)",
          }}
        />
      )}

      {/* ── 2. Warm Sun Aura (Soft rotating golden halo behind top-right sun) ── */}
      <motion.div
        className="absolute -top-12 -right-12 sm:-top-8 sm:-right-8 w-44 h-44 sm:w-60 sm:h-60 rounded-full pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(254, 240, 138, 0.45) 0%, rgba(251, 191, 36, 0.16) 48%, transparent 72%)",
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
        transition={{
          scale: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 60, repeat: Infinity, ease: "linear" },
        }}
      />

      {/* ── 3. Subtle Parallax Drifting Clouds for Living Motion ── */}
      <DriftingClouds className="z-10 opacity-70" />

      {/* ── 4. Animated Flying Songbirds ────────────────────────── */}
      <FlyingBirds className="z-10 opacity-80" />

      {/* ── 5. Floating Sunlit Pollen Motes ─────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {pollenMotes.map((mote, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-amber-200/50 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
            style={{
              width: `${mote.size}px`,
              height: `${mote.size}px`,
              left: `${mote.left}%`,
              bottom: `${mote.bottom}%`,
            }}
            animate={{
              y: [0, -mote.driftY, 0],
              x: [0, mote.driftX, 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: mote.duration,
              repeat: Infinity,
              delay: mote.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
