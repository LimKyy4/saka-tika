// src/views/HomeView.jsx
// SAKA TIKA: Welcome Home View with Centered Title, 3D Play & Exit CTAs, and Flanking Mascots.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Play, Heart } from "lucide-react";
import { useGame } from "../context/GameContext.jsx";
import { useAudio } from "../context/AudioContext.jsx";
import GameLandscapeBackground from "../components/background/GameLandscapeBackground.jsx";
import SakaMascot from "../components/illustrations/SakaMascot.jsx";
import TikaMascot from "../components/illustrations/TikaMascot.jsx";

// Candy letter definitions for 3D SAKA TIKA title
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

  const [sakaWaving, setSakaWaving] = useState(false);
  const [tikaCheering, setTikaCheering] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  const handleStart = () => {
    playMenuVoice();
    playSfx("fanfare");
    navigateTo("/menu");
  };

  const handleExit = () => {
    playSfx("click");
    try {
      window.close();
    } catch {
      // Browser blocks script-initiated window close for user tabs
    }
    setShowExitModal(true);
  };

  const handleSakaClick = () => {
    playSfx("hover");
    setSakaWaving(true);
    setTimeout(() => setSakaWaving(false), 2400);
  };

  const handleTikaClick = () => {
    playSfx("hover");
    setTikaCheering(true);
    setTimeout(() => setTikaCheering(false), 2400);
  };

  const handleSceneClick = useCallback((e) => {
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
      {/* ── 1. Scenery Background Layer (Layer 0) ─────── */}
      <GameLandscapeBackground bgImage="/assets/bg-utama-baru.jpg" />

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

      {/* ── 3. Character Staging: Saka (Left Grassy Hill) ─────── */}
      <div
        onClick={handleSakaClick}
        className="absolute left-3 sm:left-6 md:left-12 bottom-3 sm:bottom-6 z-20 cursor-pointer transition-transform hover:scale-105 active:scale-95"
        title="Sentuh Saka untuk menyapa!"
      >
        <SakaMascot
          className="w-24 h-32 sm:w-32 sm:h-44 md:w-40 md:h-54 lg:w-48 lg:h-64"
          isWaving={sakaWaving}
        />
      </div>

      {/* ── 4. Character Staging: Tika (Right Grassy Hill) ────── */}
      <div
        onClick={handleTikaClick}
        className="absolute right-3 sm:right-6 md:right-12 bottom-3 sm:bottom-6 z-20 cursor-pointer transition-transform hover:scale-105 active:scale-95"
        title="Sentuh Tika untuk menyapa!"
      >
        <TikaMascot
          className="w-24 h-32 sm:w-32 sm:h-44 md:w-40 md:h-54 lg:w-48 lg:h-64"
          isCheering={tikaCheering}
        />
      </div>

      {/* ── 5. Center Stage: Horizontal & Vertical Centered Hero ── */}
      <div className="relative z-20 flex-1 min-h-0 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto my-auto w-full">
        {/* Candy-Style Embossed SAKA TIKA Letters */}
        <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
          {CANDY_TITLE.map((item, idx) => {
            if (item.char === " ") {
              return <div key={idx} className="w-2 sm:w-4" />;
            }
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.15, y: -4 }}
                transition={{ type: "spring", stiffness: 450, damping: 15 }}
                style={{
                  backgroundColor: item.color,
                  borderColor: item.border,
                }}
                className={`w-8 h-11 sm:w-11 sm:h-14 md:w-13 md:h-17 rounded-2xl border-b-[4px] sm:border-b-[5px] flex items-center justify-center shadow-[0_5px_0_rgba(0,0,0,0.12)] cursor-default ${item.tilt}`}
              >
                <span className="font-display font-black text-white text-xl sm:text-2xl md:text-3xl leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
                  {item.char}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Deep Navy Subtitle Headline */}
        <h1
          className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-[#1B4965] mb-2 sm:mb-3 leading-tight tracking-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]"
        >
          Mengenal Huruf
        </h1>

        {/* Friendly Subtitle Pill */}
        <div className="bg-[#FEF3C7]/95 border-2 border-[#FDE68A] px-4 py-1 sm:py-1.5 rounded-full shadow-xs mb-5 sm:mb-7 max-w-md">
          <p className="font-sans font-bold text-xs sm:text-sm text-[#92400E]">
            Belajar huruf jadi seru, mudah, dan menyenangkan!
          </p>
        </div>

        {/* Center Action Buttons: Primary Play & 3D Tactile Exit */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
          {/* Primary 3D Play Button Sprite */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.94, y: 2 }}
            transition={{ type: "spring", stiffness: 450, damping: 16 }}
            onClick={handleStart}
            aria-label="Mulai Bermain"
            className="relative inline-flex items-center justify-center p-0 bg-transparent border-0 outline-none select-none cursor-pointer focus:outline-none"
          >
            <img
              src="/assets/buttons/play.png"
              alt="Mulai Bermain"
              draggable="false"
              className="h-16 sm:h-20 md:h-22 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.2)] pointer-events-none select-none"
              style={{ imageRendering: "-webkit-optimize-contrast" }}
            />
          </motion.button>

          {/* Child-friendly 3D Tactile Exit Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.94, y: 2 }}
            transition={{ type: "spring", stiffness: 450, damping: 16 }}
            onClick={handleExit}
            aria-label="Keluar Permainan"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl bg-[#F26B6B] hover:bg-[#e85b5b] text-white font-display font-bold text-sm sm:text-base border-b-[5px] border-[#D64D4D] shadow-lg cursor-pointer transition-colors active:border-b-0 active:translate-y-1"
          >
            <LogOut size={20} className="stroke-[2.5]" />
            <span>Keluar</span>
          </motion.button>
        </div>
      </div>

      {/* ── 6. Fullscreen Exit Goodbye Overlay Screen ─────────── */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="bg-[#FFFDF9] border-4 border-[#F9D968] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#FEF3C7] border-2 border-[#FDE68A] flex items-center justify-center shadow-inner">
                <Heart size={32} className="text-[#F26B6B] fill-[#F26B6B]" />
              </div>

              <h2 className="font-display font-black text-2xl text-[#1B4965]">
                Terima Kasih Sudah Bermain!
              </h2>
              <p className="font-sans font-medium text-xs sm:text-sm text-[#1B4965]/80">
                Sampai jumpa lagi di Petualangan Saka Tika! Terus semangat belajar mengenal huruf ya!
              </p>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97, y: 1 }}
                onClick={() => {
                  playSfx("click");
                  setShowExitModal(false);
                }}
                className="w-full py-3 px-5 rounded-2xl bg-[#1B4965] hover:bg-[#153a50] text-white font-display font-bold text-sm sm:text-base border-b-4 border-[#0e2736] shadow-lg flex items-center justify-center gap-2 cursor-pointer active:border-b-0 transition-all"
              >
                <Play size={18} className="fill-current" />
                <span>Kembali Bermain</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
