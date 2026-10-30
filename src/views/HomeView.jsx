// src/views/HomeView.jsx
// SAKA TIKA: Definitive Edition Home View with Living Landscape, 3D Arcade CTAs & Interactive Mascots.
// Strictly adheres to Global 3-Tier Height Budgeting:
// Tier 1: Floating Game HUD (TopControlBar)
// Tier 2: Middle Stage (flex-1 min-h-0 flex items-center justify-around px-8 max-h-[60vh])
// Tier 3: Bottom Tier (Rolling lawn and flowers resting cleanly along screen base)
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MonitorDown } from "lucide-react";
import { useGame } from "../context/GameContext.jsx";
import { useAudio } from "../context/AudioContext.jsx";
import { usePWAInstall } from "../hooks/usePWAInstall.js";
import GameLandscapeBackground from "../components/background/GameLandscapeBackground.jsx";
import LetterBlocks from "../components/illustrations/LetterBlocks.jsx";

// Candy letter definitions for SAKA TIKA title
const CANDY_TITLE = [
  { char: "S", color: "#F48B94", border: "#E26D77", tilt: "-rotate-3" },
  { char: "A", color: "#F9D968", border: "#DDB83B", tilt: "rotate-2" },
  { char: "K", color: "#95D5B2", border: "#6CB88E", tilt: "-rotate-2" },
  { char: "A", color: "#F4978E", border: "#DC7369", tilt: "rotate-3" },
  { char: " ", color: "transparent", border: "transparent", tilt: "" },
  { char: "T", color: "#8FB8ED", border: "#6696D8", tilt: "-rotate-3" },
  { char: "I", color: "#F48B94", border: "#E26D77", tilt: "rotate-1" },
  { char: "K", color: "#F4978E", border: "#DC7369", tilt: "-rotate-2" },
  { char: "A", color: "#F9D968", border: "#DDB83B", tilt: "rotate-3" },
];

export default function HomeView() {
  const { navigateTo } = useGame();
  const { playSfx, playMenuVoice } = useAudio();
  const { triggerInstall, isInstalled } = usePWAInstall();

  // Mascots reaction state
  const [mascotsJumping, setMascotsJumping] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  // Click sparkles particle state
  const [sparkles, setSparkles] = useState([]);

  const handleStart = () => {
    playMenuVoice();
    playSfx("fanfare");
    navigateTo("/menu");
  };

  const handleMascotInteraction = () => {
    playSfx("hover");
    setMascotsJumping(true);
    setShowSpeechBubble(true);
    setTimeout(() => {
      setMascotsJumping(false);
    }, 900);
  };

  // Auto-dismiss mascot speech bubble after 3.2s
  useEffect(() => {
    if (showSpeechBubble) {
      const timer = setTimeout(() => {
        setShowSpeechBubble(false);
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [showSpeechBubble]);

  // Click anywhere sparkles
  const handleSceneClick = useCallback((e) => {
    // Only spawn sparkles if clicking open landscape areas
    const targetTag = e.target.tagName.toLowerCase();
    if (targetTag === "button" || targetTag === "input" || targetTag === "a") return;

    const sparkleId = Date.now() + Math.random();
    const count = 5;
    const colors = ["#F48B94", "#F9D968", "#95D5B2", "#8FB8ED", "#C078FF"];
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: `${sparkleId}-${i}`,
      x: e.clientX,
      y: e.clientY,
      targetX: e.clientX + (Math.random() - 0.5) * 60,
      targetY: e.clientY - (20 + Math.random() * 45),
      color: colors[i % colors.length],
      scale: 0.6 + Math.random() * 0.7,
    }));

    setSparkles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setSparkles((prev) => prev.filter((p) => !p.id.startsWith(`${sparkleId}`)));
    }, 700);
  }, []);

  return (
    <main
      onClick={handleSceneClick}
      className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none"
    >
      {/* ── 1. Master Modular Living Landscape (Layer 0) ─────── */}
      <GameLandscapeBackground />

      {/* ── 2. Click Sparkles Particle Layer ──────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ x: sparkle.x, y: sparkle.y, scale: 0.2, opacity: 1 }}
            animate={{ x: sparkle.targetX, y: sparkle.targetY, scale: sparkle.scale, opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="absolute -top-3 -left-3 pointer-events-none"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={sparkle.color}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* ── 3. Middle Stage: Hero Welcome Stage & Mascot Podium (flex-1 min-h-0 flex items-center justify-around px-8 max-h-[60vh]) ── */}
      <div className="relative z-10 flex-1 min-h-0 flex items-center justify-around px-4 sm:px-8 max-h-[60vh] my-auto w-full max-w-6xl mx-auto">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          
          {/* ── Left Hero Column: Candy 3D Title "SAKA TIKA", Subtitle & Play CTA (max-w-md) ── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-md z-20">
            
            {/* Candy-Style Embossed Title Letters */}
            <div className="flex items-center flex-wrap justify-center lg:justify-start gap-1 sm:gap-1.5 mb-2">
              {CANDY_TITLE.map((item, idx) => {
                if (item.char === " ") {
                  return <div key={idx} className="w-2.5 sm:w-3.5" />;
                }
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.15, y: -3 }}
                    transition={{ type: "spring", stiffness: 450, damping: 15 }}
                    style={{
                      backgroundColor: item.color,
                      borderColor: item.border,
                    }}
                    className={`w-8 h-10 sm:w-11 sm:h-13 rounded-2xl border-b-[4px] sm:border-b-[5px] flex items-center justify-center shadow-[0_5px_0_rgba(0,0,0,0.12)] cursor-default ${item.tilt}`}
                  >
                    <span className="font-display font-black text-white text-xl sm:text-2xl leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
                      {item.char}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Deep Navy Subtitle Headline with White Glow */}
            <h1
              className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-[#1B4965] mb-2 leading-tight tracking-tight"
              style={{
                filter: "drop-shadow(0 2px 12px rgba(255,255,255,0.95))",
              }}
            >
              Mengenal Huruf
            </h1>

            {/* Friendly Subtitle Pill Badge */}
            <div className="bg-[#FEF3C7]/95 border-2 border-[#FDE68A] px-3.5 py-1 rounded-full shadow-xs mb-4 max-w-md">
              <p className="font-sans font-bold text-xs sm:text-sm text-[#92400E]">
                Belajar huruf jadi seru, mudah, dan menyenangkan!
              </p>
            </div>

            {/* Real Client Sprite CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {/* Primary 3D Play Button using real client asset play.png */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.94, y: 2 }}
                transition={{ type: "spring", stiffness: 450, damping: 16 }}
                onClick={handleStart}
                aria-label="Mulai Bermain"
                className="relative inline-flex items-center justify-center p-0 bg-transparent border-0 outline-none select-none cursor-pointer focus:outline-none transition-transform"
              >
                <img
                  src="/assets/buttons/play.png"
                  alt="Mulai Bermain"
                  draggable="false"
                  className="h-14 sm:h-18 md:h-20 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.2)] pointer-events-none select-none"
                  style={{ imageRendering: "-webkit-optimize-contrast" }}
                />
              </motion.button>

              {/* Secondary Desktop Install Button */}
              {!isInstalled && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95, y: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={triggerInstall}
                  aria-label="Pasang Aplikasi di Desktop"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-b from-[#2DD4BF] to-[#0D9488] border-b-[4px] border-[#0F766E] shadow-md active:border-b-0 cursor-pointer flex items-center justify-center gap-2 text-white font-display font-bold text-xs sm:text-sm select-none"
                >
                  <MonitorDown size={16} />
                  <span>Pasang di Desktop</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* ── Right Mascot Zone: Seamless Interactive Greeting & Musical Blocks ── */}
          <div className="flex flex-col items-center justify-end z-20 flex-shrink-0 relative max-h-[50vh] w-64 sm:w-80 md:w-96">
            
            {/* Pop-up Comic Speech Bubble over Background Mascots */}
            <AnimatePresence>
              {showSpeechBubble && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 450, damping: 20 }}
                  className="absolute -top-14 z-30 bg-white/95 border-2 border-[#1B4965]/20 rounded-2xl px-3.5 py-1.5 shadow-lg max-w-xs text-center"
                >
                  <p className="font-sans font-bold text-xs sm:text-sm text-[#1B4965] leading-snug">
                    Halo kawan! Ayo kita belajar huruf bersama!
                  </p>
                  {/* Speech bubble tail pointer */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-r-2 border-b-2 border-[#1B4965]/20 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Interactive Hotspot over Background Mascots */}
            <div
              onClick={handleMascotInteraction}
              className="w-full h-48 sm:h-56 cursor-pointer flex flex-col items-center justify-end"
              title="Ketuk Saka dan Tika untuk menyapa!"
            >
              {/* Musical ABC Toy Blocks on the table */}
              <div className="relative z-20 mb-3">
                <LetterBlocks />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── 4. Bottom Tier: Rolling lawn and flowers resting cleanly along screen base ── */}
      <div className="h-4 w-full flex-shrink-0" />
    </main>
  );
}
