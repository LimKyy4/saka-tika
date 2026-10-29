// src/views/MainMenuView.jsx
// SAKA TIKA: Spotlight Square Carousel (Cover Flow) Refactor & Living Desktop Stage
// Strictly adheres to Global 3-Tier Height Budgeting:
// Tier 1: Header Tier (h-[12%] flex items-center px-6)
// Tier 2: Middle Carousel Stage Tier (flex-1 min-h-0 flex flex-col items-center justify-center max-h-[54vh] relative my-auto)
// Tier 3: Bottom Mascot & Terrain Tier (h-[24%] relative flex justify-between items-end px-8 pb-2 pointer-events-none)
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Play } from "lucide-react";
import { useGame } from "../context/GameContext.jsx";
import { useAudio } from "../context/AudioContext.jsx";
import GameLandscapeBackground from "../components/background/GameLandscapeBackground.jsx";
import SakaMascot from "../components/illustrations/SakaMascot.jsx";
import TikaMascot from "../components/illustrations/TikaMascot.jsx";

// ── 5 Core Educational Game Modules ─────────────────────────────────
const MODULES = [
  {
    id: "mengenal",
    title: "Mengenal Huruf",
    subtext: "Kenali 26 huruf dan dengarkan bunyinya!",
    badge: "26 Huruf Siap Belajar",
    route: "/mengenal-huruf",
    bgGradient: "from-[#4DA7F0] to-[#2B88DC]",
    borderBottom: "border-[#1B6BB8]",
    glowColor: "rgba(43, 136, 220, 0.45)",
    textColor: "text-white",
    badgeBg: "bg-[#1B6BB8]/40 border-white/30 text-white",
    ctaBg: "bg-white text-[#1B6BB8] border-b-4 border-[#BAE6FD]",
    dialogue: "Ayo kenalan sama huruf A sampai Z!",
    icon: <AlphabetBlocksIcon />,
  },
  {
    id: "menulis",
    title: "Menulis Huruf",
    subtext: "Latihan menebalkan garis huruf dari A sampai Z!",
    badge: "Latihan Goresan A-Z",
    route: "/menulis-huruf",
    bgGradient: "from-[#FCD34D] to-[#F59E0B]",
    borderBottom: "border-[#B45309]",
    glowColor: "rgba(245, 158, 11, 0.45)",
    textColor: "text-[#78350F]",
    badgeBg: "bg-[#B45309]/20 border-[#B45309]/40 text-[#78350F]",
    ctaBg: "bg-[#78350F] text-white border-b-4 border-[#451A03]",
    dialogue: "Yuk, kita belajar menulis huruf yang rapi!",
    icon: <PencilTraceIcon />,
  },
  {
    id: "temukan",
    title: "Temukan Huruf",
    subtext: "Cari dan tangkap gelembung huruf yang tersembunyi!",
    badge: "Tantangan Gelembung",
    route: "/temukan-huruf",
    bgGradient: "from-[#F87171] to-[#EF4444]",
    borderBottom: "border-[#B91C1C]",
    glowColor: "rgba(239, 68, 68, 0.45)",
    textColor: "text-white",
    badgeBg: "bg-[#B91C1C]/40 border-white/30 text-white",
    ctaBg: "bg-white text-[#EF4444] border-b-4 border-[#FECDD3]",
    dialogue: "Bisakah kamu temukan huruf yang tersembunyi?",
    icon: <SearchBubblesIcon />,
  },
  {
    id: "mengetik",
    title: "Mengetik Huruf",
    subtext: "Latihan mengetik kata sesuai gambar yang muncul!",
    badge: "Master Refleks Keyboard",
    route: "/mengetik-huruf",
    bgGradient: "from-[#F472B6] to-[#DB2777]",
    borderBottom: "border-[#9D174D]",
    glowColor: "rgba(219, 39, 119, 0.45)",
    textColor: "text-white",
    badgeBg: "bg-[#9D174D]/40 border-white/30 text-white",
    ctaBg: "bg-white text-[#DB2777] border-b-4 border-[#FCE7F3]",
    dialogue: "Ayo latih jarimu mengetik di keyboard!",
    icon: <TactileKeyboardIcon />,
  },
  {
    id: "melengkapi",
    title: "Melengkapi Kata",
    subtext: "Tebak dan pasang huruf yang hilang dengan tepat!",
    badge: "Susun Kata Buah & Benda",
    route: "/melengkapi-kata",
    bgGradient: "from-[#34D399] to-[#059669]",
    borderBottom: "border-[#065F46]",
    glowColor: "rgba(5, 150, 105, 0.45)",
    textColor: "text-white",
    badgeBg: "bg-[#065F46]/40 border-white/30 text-white",
    ctaBg: "bg-white text-[#059669] border-b-4 border-[#A7F3D0]",
    dialogue: "Bantu lengkapi huruf yang hilang ya!",
    icon: <WordPuzzleIcon />,
  },
];

export default function MainMenuView() {
  const { navigateTo } = useGame();
  const { playSfx, playMenuVoice } = useAudio();
  const [activeIndex, setActiveIndex] = useState(0);

  // Studio voice prompt played once on menu entrance
  useEffect(() => {
    playMenuVoice();
  }, [playMenuVoice]);

  const activeModule = MODULES[activeIndex];
  const prevIndex = (activeIndex - 1 + MODULES.length) % MODULES.length;
  const nextIndex = (activeIndex + 1) % MODULES.length;
  const prevModuleData = MODULES[prevIndex];
  const nextModuleData = MODULES[nextIndex];

  // Carousel navigation handlers
  const prevModule = useCallback(() => {
    playSfx("hover");
    setActiveIndex((prev) => (prev - 1 + MODULES.length) % MODULES.length);
  }, [playSfx]);

  const nextModule = useCallback(() => {
    playSfx("hover");
    setActiveIndex((prev) => (prev + 1) % MODULES.length);
  }, [playSfx]);

  const handlePlay = useCallback(
    (route) => {
      playSfx("click");
      navigateTo(route);
    },
    [playSfx, navigateTo]
  );

  // Keyboard navigation (Arrow keys + Enter/Space)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevModule();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextModule();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handlePlay(MODULES[activeIndex].route);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, prevModule, nextModule, handlePlay]);

  return (
    <main className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none">
      {/* ── 1. Persistent Living Vector Landscape (Layer 0) ── */}
      <GameLandscapeBackground />

      {/* ── 2. Subtle Glassmorphism Contrast Tint ────────────── */}
      <div className="fixed inset-0 bg-sky-950/10 backdrop-blur-[0.5px] pointer-events-none z-0" />

      {/* ── 3. Interactive Widescreen Adventure Stage Content ── */}
      <div className="relative z-10 flex flex-col h-full w-full justify-between overflow-hidden">
        
        {/* ── Tier 1: Header Tier (h-[12%] flex items-center px-6) ── */}
        <div className="h-[12%] max-h-12 flex items-center justify-between px-6 w-full max-w-6xl mx-auto flex-shrink-0">
          <motion.button
            type="button"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.94, y: 2 }}
            transition={{ type: "spring", stiffness: 450, damping: 16 }}
            onClick={() => {
              playSfx("click");
              navigateTo("/");
            }}
            aria-label="Kembali ke Beranda"
            className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#F1F5F9] border-b-4 border-[#CBD5E1] text-[#1B4965] font-display font-bold text-xs sm:text-sm shadow-md active:border-b-0 cursor-pointer"
          >
            <ArrowLeft size={16} className="text-[#1B4965]" />
            <span>Beranda</span>
          </motion.button>
          
          {/* Symmetrical balance spacer while TopControlBar handles stars and sound above */}
          <div className="w-16 sm:w-24" />
        </div>

        {/* ── Tier 2: Middle Carousel Stage Tier (flex-1 min-h-0 flex flex-col items-center justify-center max-h-[54vh] relative my-auto) ── */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center max-h-[54vh] relative my-auto w-full px-4">
          
          {/* Carousel Track Container with Flanking Arrows */}
          <div className="relative max-w-4xl w-full flex items-center justify-center gap-3 sm:gap-6">
            
            {/* ── Left Navigation Arrow Sprite (kiri.png) ──────── */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.15, rotate: -4 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: "spring", stiffness: 450, damping: 16 }}
              onClick={prevModule}
              aria-label="Tantangan Sebelumnya"
              className="p-0 bg-transparent border-0 outline-none cursor-pointer flex-shrink-0 z-30"
            >
              <img
                src="/assets/buttons/kiri.png"
                alt="Sebelumnya"
                draggable="false"
                className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain drop-shadow-xl select-none"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </motion.button>

            {/* ── Carousel Cards Track with Swipe Support ─────── */}
            <div className="relative flex items-center justify-center gap-3 sm:gap-5 flex-1 max-w-3xl">
              
              {/* Left Flanking Inactive Dimmed Card */}
              <motion.div
                type="button"
                whileHover={{ scale: 0.84, opacity: 0.6 }}
                whileTap={{ scale: 0.78 }}
                onClick={prevModule}
                aria-label={`Pilih ${prevModuleData.title}`}
                className={`hidden md:flex flex-col justify-between p-3.5 rounded-3xl bg-gradient-to-b ${prevModuleData.bgGradient} border-b-6 ${prevModuleData.borderBottom} shadow-lg scale-80 opacity-40 select-none pointer-events-auto cursor-pointer w-48 h-48 lg:w-56 lg:h-56 max-h-[42vh] flex-shrink-0 ${prevModuleData.textColor}`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-1 rounded-2xl bg-white/20 backdrop-blur-xs">
                    {prevModuleData.icon}
                  </div>
                  <div className={`px-2 py-0.5 rounded-full border text-[10px] font-sans font-bold ${prevModuleData.badgeBg}`}>
                    {prevModuleData.badge}
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-black text-sm lg:text-base leading-tight">
                    {prevModuleData.title}
                  </h3>
                  <p className="font-sans text-[11px] opacity-80 line-clamp-1 mt-0.5">
                    {prevModuleData.subtext}
                  </p>
                </div>
              </motion.div>

              {/* ── Active Center Spotlight Square Card ───────── */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -40 || info.velocity.x < -300) {
                    nextModule();
                  } else if (info.offset.x > 40 || info.velocity.x > 300) {
                    prevModule();
                  }
                }}
                className="touch-none cursor-grab active:cursor-grabbing flex-shrink-0"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeModule.id}
                    initial={{ scale: 0.92, opacity: 0, y: 12 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: -12 }}
                    transition={{ type: "spring", stiffness: 450, damping: 24 }}
                    onClick={() => handlePlay(activeModule.route)}
                    style={{
                      boxShadow: `0 20px 40px -10px ${activeModule.glowColor}`,
                    }}
                    className={`relative overflow-hidden group w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 max-h-[46vh] rounded-3xl p-4 bg-gradient-to-b ${activeModule.bgGradient} border-b-[8px] ${activeModule.borderBottom} shadow-xl cursor-pointer flex flex-col justify-between items-center text-center ${activeModule.textColor} select-none transition-transform`}
                  >
                    {/* Top Gloss Light Reflex Line */}
                    <div className="absolute top-1.5 inset-x-4 h-[2px] bg-white/40 rounded-full pointer-events-none" />

                    {/* Subtle Diagonal Shimmer Highlight */}
                    <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none group-hover:animate-shimmer" />

                    {/* Card Top: Custom Icon & Star Badge */}
                    <div className="w-full flex items-start justify-between gap-2 z-10">
                      <div className="p-1.5 sm:p-2 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        {activeModule.icon}
                      </div>

                      <div className={`flex items-center gap-1 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border text-[10px] sm:text-xs font-sans font-bold shadow-xs ${activeModule.badgeBg}`}>
                        <Star size={12} className="fill-current text-[#FCD34D]" />
                        <span>{activeModule.badge}</span>
                      </div>
                    </div>

                    {/* Card Center: Title & Subtext */}
                    <div className="my-auto z-10 px-1">
                      <h2 className="font-display font-black text-xl sm:text-2xl leading-tight drop-shadow-xs">
                        {activeModule.title}
                      </h2>
                      <p className="font-sans font-medium text-xs sm:text-sm opacity-95 mt-1 leading-snug line-clamp-2">
                        {activeModule.subtext}
                      </p>
                    </div>

                    {/* Card Bottom: Tactile 3D "MAINKAN" CTA Button */}
                    <div className="w-full z-10">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlay(activeModule.route);
                        }}
                        className={`w-full py-2 sm:py-2.5 px-4 rounded-2xl ${activeModule.ctaBg} font-display font-black text-xs sm:text-sm md:text-base shadow-md flex items-center justify-center gap-2 cursor-pointer active:border-b-0`}
                      >
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Play size={16} className="fill-current" />
                        </motion.div>
                        <span>MAINKAN</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Right Flanking Inactive Dimmed Card */}
              <motion.div
                type="button"
                whileHover={{ scale: 0.84, opacity: 0.6 }}
                whileTap={{ scale: 0.78 }}
                onClick={nextModule}
                aria-label={`Pilih ${nextModuleData.title}`}
                className={`hidden md:flex flex-col justify-between p-3.5 rounded-3xl bg-gradient-to-b ${nextModuleData.bgGradient} border-b-6 ${nextModuleData.borderBottom} shadow-lg scale-80 opacity-40 select-none pointer-events-auto cursor-pointer w-48 h-48 lg:w-56 lg:h-56 max-h-[42vh] flex-shrink-0 ${nextModuleData.textColor}`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-1 rounded-2xl bg-white/20 backdrop-blur-xs">
                    {nextModuleData.icon}
                  </div>
                  <div className={`px-2 py-0.5 rounded-full border text-[10px] font-sans font-bold ${nextModuleData.badgeBg}`}>
                    {nextModuleData.badge}
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-black text-sm lg:text-base leading-tight">
                    {nextModuleData.title}
                  </h3>
                  <p className="font-sans text-[11px] opacity-80 line-clamp-1 mt-0.5">
                    {nextModuleData.subtext}
                  </p>
                </div>
              </motion.div>

            </div>

            {/* ── Right Navigation Arrow Sprite (kanan.png) ─────── */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.15, rotate: 4 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: "spring", stiffness: 450, damping: 16 }}
              onClick={nextModule}
              aria-label="Tantangan Selanjutnya"
              className="p-0 bg-transparent border-0 outline-none cursor-pointer flex-shrink-0 z-30"
            >
              <img
                src="/assets/buttons/kanan.png"
                alt="Selanjutnya"
                draggable="false"
                className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain drop-shadow-xl select-none"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </motion.button>

          </div>

          {/* ── 5 Candy Indicator Dots ───────────────────────── */}
          <div className="flex items-center justify-center gap-2 mt-2 z-30">
            {MODULES.map((mod, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => {
                    playSfx("click");
                    setActiveIndex(idx);
                  }}
                  aria-label={`Pilih tantangan ${mod.title}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isActive
                      ? "w-7 sm:w-8 h-2.5 bg-[#F59E0B] border-2 border-white shadow-sm"
                      : "w-2.5 h-2.5 bg-white/70 hover:bg-white border border-[#1B4965]/20 shadow-2xs"
                  }`}
                />
              );
            })}
          </div>

        </div>

        {/* ── Tier 3: Bottom Mascot & Terrain Tier (h-[24%] relative flex justify-between items-end px-8 pb-2 pointer-events-none) ── */}
        <div className="h-[24%] relative flex justify-between items-end px-8 pb-2 pointer-events-none w-full max-w-6xl mx-auto flex-shrink-0">
          
          {/* ── Left Flank: Saka Mascot on Grassy Mound ────────── */}
          <div className="relative pointer-events-auto flex flex-col items-center">
            {/* Saka Speech Bubble (Positioned neatly above Saka's head without obscuring carousel card) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule.id}
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -6 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="absolute -top-14 sm:-top-16 left-2 sm:left-4 z-30 bg-white/95 border-2 border-[#1B4965]/20 rounded-2xl px-3 py-1.5 shadow-lg max-w-[180px] sm:max-w-[210px] text-center pointer-events-none"
              >
                <p className="font-sans font-bold text-xs text-[#1B4965] leading-snug">
                  {activeModule.dialogue}
                </p>
                <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white border-r-2 border-b-2 border-[#1B4965]/20 rotate-45" />
              </motion.div>
            </AnimatePresence>

            {/* Saka Mascot with Height Locked to h-28 md:h-32 lg:h-36 */}
            <motion.div
              key={`saka-${activeIndex}`}
              initial={{ y: -12, scale: 1.05 }}
              animate={{ y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 450, damping: 15 }}
            >
              <SakaMascot isWaving={true} className="h-28 md:h-32 lg:h-36 w-auto object-contain" />
            </motion.div>
          </div>

          {/* ── Right Flank: Tika Mascot on Grassy Mound ───────── */}
          <div className="relative pointer-events-auto flex flex-col items-center">
            {/* Tika Mascot with Height Locked to h-28 md:h-32 lg:h-36 */}
            <motion.div
              key={`tika-${activeIndex}`}
              initial={{ y: -12, scale: 1.05 }}
              animate={{ y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 450, damping: 15, delay: 0.05 }}
            >
              <TikaMascot isCheering={true} className="h-28 md:h-32 lg:h-36 w-auto object-contain" />
            </motion.div>
          </div>

        </div>

      </div>
    </main>
  );
}

// ── Custom Vector Icons for 5 Modules (ZERO EMOJIS) ──────────────────
function AlphabetBlocksIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-8 h-8 sm:w-9 sm:h-9 overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="28" height="28" rx="8" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
      <rect x="6" y="38" width="28" height="4" rx="2" fill="#0369A1" />
      <text x="20" y="35" textAnchor="middle" fill="#FFFFFF" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="20">A</text>
      
      <rect x="28" y="22" width="28" height="28" rx="8" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
      <rect x="28" y="46" width="28" height="4" rx="2" fill="#B45309" />
      <text x="42" y="43" textAnchor="middle" fill="#78350F" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="18">a</text>
    </svg>
  );
}

function PencilTraceIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-8 h-8 sm:w-9 sm:h-9 overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14,48 L32,14 L50,48" stroke="#92400E" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="4 4" fill="none" opacity="0.6" />
      <path d="M22,36 L42,36" stroke="#92400E" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="4 4" fill="none" opacity="0.6" />
      <g transform="translate(26, 6) rotate(35)">
        <polygon points="10,0 16,0 16,36 10,36" fill="#F43F5E" />
        <polygon points="10,36 16,36 13,44" fill="#FDE047" />
        <polygon points="12,41 14,41 13,44" fill="#1E293B" />
        <rect x="10" y="0" width="6" height="5" fill="#CBD5E1" />
        <rect x="10" y="-4" width="6" height="4" rx="2" fill="#F472B6" />
      </g>
    </svg>
  );
}

function SearchBubblesIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-8 h-8 sm:w-9 sm:h-9 overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="22" r="13" fill="#FECDD3" opacity="0.5" />
      <text x="18" y="27" textAnchor="middle" fill="#E11D48" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="15">C</text>
      
      <circle cx="48" cy="42" r="11" fill="#FED7AA" opacity="0.5" />
      <text x="48" y="47" textAnchor="middle" fill="#EA580C" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="13">D</text>
      
      <circle cx="30" cy="30" r="17" fill="none" stroke="#FFFFFF" strokeWidth="3.5" />
      <circle cx="30" cy="30" r="14" fill="#FFFFFF" fillOpacity="0.2" />
      <line x1="42" y1="42" x2="56" y2="56" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M22,22 A10 10 0 0 1 32,18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function TactileKeyboardIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-8 h-8 sm:w-9 sm:h-9 overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="16" width="56" height="36" rx="8" fill="#FCE7F3" stroke="#BE185D" strokeWidth="2.5" />
      <rect x="4" y="48" width="56" height="4" rx="2" fill="#9D174D" />
      
      <rect x="10" y="22" width="10" height="10" rx="3" fill="#60A5FA" />
      <text x="15" y="30" textAnchor="middle" fill="#FFFFFF" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="9">A</text>
      <rect x="23" y="22" width="10" height="10" rx="3" fill="#F87171" />
      <text x="28" y="30" textAnchor="middle" fill="#FFFFFF" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="9">S</text>
      <rect x="36" y="22" width="10" height="10" rx="3" fill="#FBBF24" />
      <text x="41" y="30" textAnchor="middle" fill="#78350F" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="9">D</text>
      <rect x="49" y="22" width="10" height="10" rx="3" fill="#34D399" />
      <text x="54" y="30" textAnchor="middle" fill="#065F46" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="9">F</text>
      
      <rect x="18" y="36" width="28" height="8" rx="3" fill="#CBD5E1" />
    </svg>
  );
}

function WordPuzzleIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-8 h-8 sm:w-9 sm:h-9 overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="22" width="14" height="20" rx="4" fill="#6EE7B7" stroke="#047857" strokeWidth="1.5" />
      <text x="13" y="36" textAnchor="middle" fill="#065F46" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="13">B</text>
      
      <rect x="24" y="22" width="14" height="20" rx="4" fill="#A7F3D0" stroke="#059669" strokeWidth="2" strokeDasharray="3 2" />
      <text x="31" y="36" textAnchor="middle" fill="#047857" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="14">?</text>
      
      <rect x="42" y="22" width="14" height="20" rx="4" fill="#6EE7B7" stroke="#047857" strokeWidth="1.5" />
      <text x="49" y="36" textAnchor="middle" fill="#065F46" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="13">L</text>
      
      <g transform="translate(31, 10)">
        <circle cx="0" cy="0" r="7.5" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" />
        <text x="0" y="3.5" textAnchor="middle" fill="#78350F" fontFamily="Fredoka, sans-serif" fontWeight="bold" fontSize="10">O</text>
      </g>
    </svg>
  );
}
