// src/components/background/GameLandscapeBackground.jsx
// Studio-grade master orchestrator for the living desktop landscape environment.
// Integrates the client's authentic widescreen background asset (/assets/bg-utama.jfif)
// with subtle parallax clouds and birds for living 60 FPS motion.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useState } from "react";
import DriftingClouds from "./DriftingClouds.jsx";
import FlyingBirds from "./FlyingBirds.jsx";

export default function GameLandscapeBackground() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* ── 1. Client Authentic Living Landscape Background (bg-utama.jfif) ── */}
      {!imgError ? (
        <img
          src="/assets/bg-utama.jfif"
          alt="Latar Belakang Utama Saka Tika"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
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

      {/* ── 2. Subtle Parallax Drifting Clouds for Living Motion ── */}
      <DriftingClouds className="z-10 opacity-70" />

      {/* ── 3. Animated Flying Songbirds ────────────────────────── */}
      <FlyingBirds className="z-10 opacity-80" />
    </div>
  );
}
