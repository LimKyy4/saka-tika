// src/components/background/GameLandscapeBackground.jsx
// Studio-grade master orchestrator for the living desktop landscape environment.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React from "react";
import RainbowArc from "./RainbowArc.jsx";
import AnimatedSun from "./AnimatedSun.jsx";
import MountainRange from "./MountainRange.jsx";
import DriftingClouds from "./DriftingClouds.jsx";
import FlyingBirds from "./FlyingBirds.jsx";
import ForegroundScenery from "./ForegroundScenery.jsx";

export default function GameLandscapeBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
      {/* ── 1. Sky Gradient Base ──────────────────────────────── */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            "linear-gradient(180deg, #99D5F9 0%, #BAE3FA 24%, #DDF0FB 48%, #FFF4E3 74%, #FDF7EB 100%)",
        }}
      />

      {/* ── 2. Rainbow Arc across the Sky ─────────────────────── */}
      <RainbowArc className="top-[-4%] sm:top-[-2%]" />

      {/* ── 3. Mountain Ranges along Horizon ──────────────────── */}
      <MountainRange className="absolute bottom-[16%] sm:bottom-[18%] left-0 right-0 z-0" />

      {/* ── 4. Smiling Animated Sun in Upper Right ────────────── */}
      <div className="absolute top-2 sm:top-4 right-4 sm:right-10 md:right-16 z-10 pointer-events-auto">
        <AnimatedSun />
      </div>

      {/* ── 5. Parallax Drifting Clouds ───────────────────────── */}
      <DriftingClouds className="z-10" />

      {/* ── 6. Animated Flying Songbirds ──────────────────────── */}
      <FlyingBirds className="z-10" />

      {/* ── 7. Foreground Rolling Hills, Trees, Fences & Flowers */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <ForegroundScenery />
      </div>
    </div>
  );
}
