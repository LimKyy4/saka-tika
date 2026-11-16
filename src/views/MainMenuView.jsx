// src/views/MainMenuView.jsx
// SAKA TIKA: 5-Column Single-Row Horizontal Arcade Deck
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useGame } from "../context/GameContext.jsx";
import { useAudio } from "../context/AudioContext.jsx";
import GameLandscapeBackground from "../components/background/GameLandscapeBackground.jsx";

// 5 Living Micro-World Diorama Components (ZERO EMOJIS, ZERO MASCOTS)
import AlphabetStorybookDiorama from "../components/illustrations/dioramas/AlphabetStorybookDiorama.jsx";
import EaselTracingDiorama from "../components/illustrations/dioramas/EaselTracingDiorama.jsx";
import BubblePrismDiorama from "../components/illustrations/dioramas/BubblePrismDiorama.jsx";
import PopKeysDiorama from "../components/illustrations/dioramas/PopKeysDiorama.jsx";
import WordPuzzleTrayDiorama from "../components/illustrations/dioramas/WordPuzzleTrayDiorama.jsx";

// ── 5 Core Educational Modules in Single Row Sequence ───────────
const MODULES = [
  {
    id: "mengenal",
    index: 0,
    title: "Mengenal Huruf",
    route: "/mengenal-huruf",
    bgGradient: "from-[#3B9AE8] via-[#2684D9] to-[#1D74C4]",
    borderBottom: "border-[#155799]",
    windowBg: "from-[#155799]/40 to-[#0F3E6D]/70",
    windowBorder: "border-[#7DD3FC]/50",
    glowColor: "rgba(29, 116, 196, 0.45)",
    DioramaComponent: AlphabetStorybookDiorama,
  },
  {
    id: "menulis",
    index: 1,
    title: "Menulis Huruf",
    route: "/menulis-huruf",
    bgGradient: "from-[#F59E0B] via-[#E58E05] to-[#D97706]",
    borderBottom: "border-[#92400E]",
    windowBg: "from-[#B45309]/30 to-[#78350F]/50",
    windowBorder: "border-[#FEF08A]/60",
    glowColor: "rgba(217, 119, 6, 0.45)",
    DioramaComponent: EaselTracingDiorama,
  },
  {
    id: "temukan",
    index: 2,
    title: "Temukan Huruf",
    route: "/temukan-huruf",
    bgGradient: "from-[#F25C5C] via-[#E84848] to-[#DC2626]",
    borderBottom: "border-[#991B1B]",
    windowBg: "from-[#B91C1C]/40 to-[#7F1D1D]/70",
    windowBorder: "border-[#FECDD3]/50",
    glowColor: "rgba(220, 38, 38, 0.45)",
    DioramaComponent: BubblePrismDiorama,
  },
  {
    id: "mengetik",
    index: 3,
    title: "Mengetik Huruf",
    route: "/mengetik-huruf",
    bgGradient: "from-[#EC4899] via-[#E13286] to-[#DB2777]",
    borderBottom: "border-[#9D174D]",
    windowBg: "from-[#BE185D]/40 to-[#831843]/70",
    windowBorder: "border-[#FBCFE8]/50",
    glowColor: "rgba(219, 39, 119, 0.45)",
    DioramaComponent: PopKeysDiorama,
  },
  {
    id: "melengkapi",
    index: 4,
    title: "Melengkapi Kata",
    route: "/melengkapi-kata",
    bgGradient: "from-[#10B981] via-[#0BA370] to-[#059669]",
    borderBottom: "border-[#065F46]",
    windowBg: "from-[#047857]/40 to-[#064E3B]/70",
    windowBorder: "border-[#A7F3D0]/50",
    glowColor: "rgba(5, 150, 105, 0.45)",
    DioramaComponent: WordPuzzleTrayDiorama,
  },
];

function ModuleCard({ module, onPlay }) {
  const { playSfx } = useAudio();
  const Diorama = module.DioramaComponent;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (typeof playSfx === "function") playSfx("click");
      onPlay(module.route, module.index);
    }
  };

  const handleClick = () => {
    if (typeof playSfx === "function") playSfx("click");
    onPlay(module.route, module.index);
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      whileHover={{ scale: 1.03, y: -8 }}
      whileTap={{ scale: 0.96, y: 3 }}
      transition={{ type: "spring", stiffness: 450, damping: 18 }}
      onMouseEnter={() => {
        if (typeof playSfx === "function") playSfx("hover");
      }}
      onClick={handleClick}
      style={{
        boxShadow: `0 16px 32px -8px ${module.glowColor}, 0 4px 8px -2px rgba(0,0,0,0.15)`,
      }}
      className={`relative group overflow-hidden w-full h-[280px] sm:h-[300px] lg:h-[330px] max-h-[46vh] rounded-3xl p-3 sm:p-3.5 bg-gradient-to-b ${module.bgGradient} border-b-[8px] ${module.borderBottom} shadow-xl flex flex-col justify-between items-center select-none cursor-pointer active:border-b-2 active:translate-y-1.5 transition-shadow outline-none focus-visible:ring-4 focus-visible:ring-white`}
    >
      {/* Top Gloss Light Reflex */}
      <div className="absolute top-1.5 inset-x-4 h-[2px] bg-white/50 rounded-full pointer-events-none" />

      {/* Subtle Diagonal Shimmer Highlight on Hover */}
      <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700 ease-out" />

      {/* ── 1. Upper Zone: Jendela Ilustrasi (~65% Card Height) ── */}
      <div
        className={`relative w-full h-[65%] rounded-2xl overflow-hidden bg-gradient-to-b ${module.windowBg} border-2 ${module.windowBorder} shadow-[inset_0_3px_8px_rgba(0,0,0,0.25)] flex items-center justify-center p-2`}
      >
        <div className="absolute top-1.5 inset-x-3 h-[2px] bg-white/40 rounded-full pointer-events-none z-10" />
        <Diorama isActive={true} />
      </div>

      {/* ── 2. Lower Zone: Centered Module Title (~35% Card Height) ── */}
      <div className="w-full h-[35%] flex items-center justify-center px-1">
        <h2 className="font-display font-bold text-sm sm:text-base lg:text-lg xl:text-xl text-white text-center leading-tight tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]">
          {module.title}
        </h2>
      </div>
    </motion.div>
  );
}

export default function MainMenuView() {
  const { navigateTo, setActiveCarouselIndex } = useGame();
  const { playSfx } = useAudio();

  const handlePlay = useCallback(
    (route, index) => {
      if (typeof setActiveCarouselIndex === "function") {
        setActiveCarouselIndex(index);
      }
      if (typeof playSfx === "function") {
        playSfx("fanfare");
      }
      if (typeof navigateTo === "function") {
        navigateTo(route);
      }
    },
    [setActiveCarouselIndex, playSfx, navigateTo]
  );

  return (
    <main className="relative w-screen h-screen max-h-screen overflow-hidden flex flex-col justify-between bg-transparent select-none">
      {/* ── 1. Scenery Living Vector Landscape (Layer 0) ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <GameLandscapeBackground />
      </div>

      {/* ── 2. Top Header Navigation (Enlarged Beranda Button) ── */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between px-6 sm:px-8 pt-2 sm:pt-3 flex-shrink-0">
        <motion.button
          type="button"
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94, y: 2 }}
          transition={{ type: "spring", stiffness: 450, damping: 16 }}
          onClick={() => {
            if (typeof playSfx === "function") playSfx("click");
            navigateTo("/");
          }}
          aria-label="Kembali ke Beranda"
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#F1F5F9] border-b-4 border-[#CBD5E1] text-[#1B4965] font-display font-bold text-base md:text-lg shadow-md active:border-b-0 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-[#1B4965] stroke-[2.5]" />
          <span>Beranda</span>
        </motion.button>

        <div className="w-16 sm:w-24" />
      </header>

      {/* ── 3. Middle Stage: 5-Column Single-Row Horizontal Arcade Deck ── */}
      <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center px-4 sm:px-6">
        <div className="grid grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5 w-full max-w-6xl mx-auto">
          {MODULES.map((module) => (
            <ModuleCard key={module.id} module={module} onPlay={handlePlay} />
          ))}
        </div>
      </div>

      {/* ── 4. Lower Grassy Lawn & Subtle Landscape Accents ── */}
      <div className="relative z-10 w-full flex justify-between items-end px-6 sm:px-12 pb-2 sm:pb-3 pointer-events-none flex-shrink-0">
        {/* Left Accent: Swaying Pastel Wildflowers & Grass */}
        <div className="flex items-end gap-1.5 opacity-85">
          <motion.svg
            width="42"
            height="32"
            viewBox="0 0 42 32"
            fill="none"
            animate={{ rotate: [-2, 3, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "21px", originY: "32px" }}
          >
            <path d="M12 32 C10 20 6 12 2 8 C8 14 14 22 16 32 Z" fill="#65A30D" />
            <path d="M18 32 C20 18 24 10 30 6 C26 14 22 22 20 32 Z" fill="#84CC16" />
            <path d="M21 32 C21 22 21 16 21 12" stroke="#4D7C0F" strokeWidth="2" strokeLinecap="round" />
            <circle cx="21" cy="11" r="5" fill="#FDE047" />
            <circle cx="17" cy="11" r="3" fill="#FEF08A" />
            <circle cx="25" cy="11" r="3" fill="#FEF08A" />
            <circle cx="21" cy="7" r="3" fill="#FEF08A" />
            <circle cx="21" cy="15" r="3" fill="#FEF08A" />
            <circle cx="21" cy="11" r="2.5" fill="#F59E0B" />
          </motion.svg>

          <motion.svg
            width="34"
            height="26"
            viewBox="0 0 34 26"
            fill="none"
            animate={{ rotate: [2, -3, 2] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            style={{ originX: "17px", originY: "26px" }}
          >
            <path d="M17 26 C17 18 19 12 21 8" stroke="#4D7C0F" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="21" cy="8" r="4.5" fill="#38BDF8" />
            <circle cx="17.5" cy="8" r="2.5" fill="#BAE6FD" />
            <circle cx="24.5" cy="8" r="2.5" fill="#BAE6FD" />
            <circle cx="21" cy="4.5" r="2.5" fill="#BAE6FD" />
            <circle cx="21" cy="11.5" r="2.5" fill="#BAE6FD" />
            <circle cx="21" cy="8" r="2" fill="#0284C7" />
          </motion.svg>
        </div>

        {/* Right Accent: Fluttering Butterfly & Pastel Wildflower */}
        <div className="flex items-end gap-2 opacity-85">
          <motion.div
            animate={{
              y: [0, -6, 2, -4, 0],
              x: [0, 4, -2, 3, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="mb-3"
          >
            <motion.svg
              width="24"
              height="20"
              viewBox="0 0 24 20"
              fill="none"
              animate={{ scaleX: [1, 0.6, 1] }}
              transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M12 10 C10 4 4 2 2 6 C0 10 6 12 11 11 Z" fill="#F472B6" opacity="0.9" />
              <path d="M12 10 C14 4 20 2 22 6 C24 10 18 12 13 11 Z" fill="#F472B6" opacity="0.9" />
              <path d="M12 11 C9 12 6 15 6 18 C8 19 11 16 12 12 Z" fill="#F4978E" opacity="0.8" />
              <path d="M12 11 C15 12 18 15 18 18 C16 19 13 16 12 12 Z" fill="#F4978E" opacity="0.8" />
              <ellipse cx="12" cy="11" rx="1" ry="4" fill="#831843" />
            </motion.svg>
          </motion.div>

          <motion.svg
            width="38"
            height="30"
            viewBox="0 0 38 30"
            fill="none"
            animate={{ rotate: [-2, 2.5, -2] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "19px", originY: "30px" }}
          >
            <path d="M12 30 C14 20 18 14 22 8" stroke="#4D7C0F" strokeWidth="2" strokeLinecap="round" />
            <circle cx="22" cy="8" r="4.5" fill="#FB7185" />
            <circle cx="18" cy="8" r="2.8" fill="#FECDD3" />
            <circle cx="26" cy="8" r="2.8" fill="#FECDD3" />
            <circle cx="22" cy="4" r="2.8" fill="#FECDD3" />
            <circle cx="22" cy="12" r="2.8" fill="#FECDD3" />
            <circle cx="22" cy="8" r="2" fill="#BE123C" />
            <path d="M26 30 C28 22 32 16 36 12 C32 18 28 24 27 30 Z" fill="#84CC16" />
          </motion.svg>
        </div>
      </div>
    </main>
  );
}
