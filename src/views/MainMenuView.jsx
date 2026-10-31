// src/views/MainMenuView.jsx
// SAKA TIKA: Spotlight Module Cover Overhaul & Supreme Tactile "MAINKAN" Button Refinement
// Two-Tier "Jendela Ilustrasi" (Diorama Window) Architecture:
// - Upper Zone: Bespoke scalable 3D toy-style micro-world diorama
// - Lower Zone: Information stage with progress badge, Fredoka title, subtext & 3D arcade MAINKAN button
// Strictly adheres to Zero-Collision App Shell:
// - Outer wrapper: relative w-screen h-screen max-h-screen overflow-hidden flex flex-col justify-between bg-transparent select-none
// - Background: fixed inset-0 pointer-events-none z-0
// - Middle Carousel Stage: relative z-10 flex-1 w-full flex flex-col items-center justify-center my-auto px-4
// - Bottom Mascots: relative z-10 w-full flex justify-between items-end px-8 pb-3 pointer-events-none (Mascots proudly anchored on bottom terrain)
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.
// Mascots are strictly excluded from inside the cards.

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import { useGame } from "../context/GameContext.jsx";
import { useAudio } from "../context/AudioContext.jsx";
import GameLandscapeBackground from "../components/background/GameLandscapeBackground.jsx";
import SakaMascot from "../components/illustrations/SakaMascot.jsx";
import TikaMascot from "../components/illustrations/TikaMascot.jsx";

// ── 5 Living Micro-World Diorama Components (ZERO EMOJIS, ZERO MASCOTS) ──
import AlphabetStorybookDiorama from "../components/illustrations/dioramas/AlphabetStorybookDiorama.jsx";
import EaselTracingDiorama from "../components/illustrations/dioramas/EaselTracingDiorama.jsx";
import BubblePrismDiorama from "../components/illustrations/dioramas/BubblePrismDiorama.jsx";
import PopKeysDiorama from "../components/illustrations/dioramas/PopKeysDiorama.jsx";
import WordPuzzleTrayDiorama from "../components/illustrations/dioramas/WordPuzzleTrayDiorama.jsx";
import TactilePlayButton from "../components/ui/TactilePlayButton.jsx";

// ── 5 Core Educational Game Modules with Rich Two-Tier Styling ────────
const MODULES = [
  {
    id: "mengenal",
    title: "Mengenal Huruf",
    subtext: "Kenali 26 huruf dan dengarkan bunyinya!",
    badge: "26 Huruf Siap Belajar",
    route: "/mengenal-huruf",
    bgGradient: "from-[#38BDF8] via-[#0284C7] to-[#0369A1]",
    borderBottom: "border-[#075985]",
    windowBg: "from-[#0369A1]/40 to-[#0C4A6E]/70",
    windowBorder: "border-[#7DD3FC]/50",
    glowColor: "rgba(2, 132, 199, 0.45)",
    textColor: "text-white",
    badgeBg: "bg-white/20 border-white/40 text-white",
    btnGrad: "from-[#FDE047] via-[#FBBF24] to-[#F59E0B]",
    btnText: "text-[#78350F]",
    btnBorder: "border-[#B45309]",
    btnShadow: "rgba(245, 158, 11, 0.45)",
    dialogue: "Ayo kenalan sama huruf A sampai Z!",
    DioramaComponent: AlphabetStorybookDiorama,
  },
  {
    id: "menulis",
    title: "Menulis Huruf",
    subtext: "Latihan menebalkan garis huruf dari A sampai Z!",
    badge: "Latihan Goresan A-Z",
    route: "/menulis-huruf",
    bgGradient: "from-[#FDE047] via-[#F59E0B] to-[#D97706]",
    borderBottom: "border-[#92400E]",
    windowBg: "from-[#B45309]/30 to-[#78350F]/50",
    windowBorder: "border-[#FEF08A]/60",
    glowColor: "rgba(245, 158, 11, 0.45)",
    textColor: "text-[#78350F]",
    badgeBg: "bg-[#78350F]/15 border-[#78350F]/30 text-[#78350F]",
    btnGrad: "from-[#38BDF8] via-[#0284C7] to-[#0369A1]",
    btnText: "text-white",
    btnBorder: "border-[#075985]",
    btnShadow: "rgba(2, 132, 199, 0.45)",
    dialogue: "Yuk, kita belajar menulis huruf yang rapi!",
    DioramaComponent: EaselTracingDiorama,
  },
  {
    id: "temukan",
    title: "Temukan Huruf",
    subtext: "Cari dan tangkap gelembung huruf yang tersembunyi!",
    badge: "Tantangan Gelembung",
    route: "/temukan-huruf",
    bgGradient: "from-[#F87171] via-[#EF4444] to-[#DC2626]",
    borderBottom: "border-[#991B1B]",
    windowBg: "from-[#B91C1C]/40 to-[#7F1D1D]/70",
    windowBorder: "border-[#FECDD3]/50",
    glowColor: "rgba(239, 68, 68, 0.45)",
    textColor: "text-white",
    badgeBg: "bg-white/20 border-white/40 text-white",
    btnGrad: "from-[#FEF08A] via-[#FDE047] to-[#FACC15]",
    btnText: "text-[#854D0E]",
    btnBorder: "border-[#A16207]",
    btnShadow: "rgba(234, 179, 8, 0.45)",
    dialogue: "Bisakah kamu temukan huruf yang tersembunyi?",
    DioramaComponent: BubblePrismDiorama,
  },
  {
    id: "mengetik",
    title: "Mengetik Huruf",
    subtext: "Latihan mengetik kata sesuai gambar yang muncul!",
    badge: "Refleks Keyboard",
    route: "/mengetik-huruf",
    bgGradient: "from-[#F472B6] via-[#EC4899] to-[#DB2777]",
    borderBottom: "border-[#9D174D]",
    windowBg: "from-[#BE185D]/40 to-[#831843]/70",
    windowBorder: "border-[#FBCFE8]/50",
    glowColor: "rgba(219, 39, 119, 0.45)",
    textColor: "text-white",
    badgeBg: "bg-white/20 border-white/40 text-white",
    btnGrad: "from-[#5EEAD4] via-[#14B8A6] to-[#0D9488]",
    btnText: "text-white",
    btnBorder: "border-[#115E59]",
    btnShadow: "rgba(20, 184, 166, 0.45)",
    dialogue: "Ayo latih jarimu mengetik di keyboard!",
    DioramaComponent: PopKeysDiorama,
  },
  {
    id: "melengkapi",
    title: "Melengkapi Kata",
    subtext: "Tebak dan pasang huruf yang hilang dengan tepat!",
    badge: "Susun Kata Buah",
    route: "/melengkapi-kata",
    bgGradient: "from-[#34D399] via-[#10B981] to-[#059669]",
    borderBottom: "border-[#065F46]",
    windowBg: "from-[#047857]/40 to-[#064E3B]/70",
    windowBorder: "border-[#A7F3D0]/50",
    glowColor: "rgba(16, 185, 129, 0.45)",
    textColor: "text-white",
    badgeBg: "bg-white/20 border-white/40 text-white",
    btnGrad: "from-[#FDBA74] via-[#FB923C] to-[#EA580C]",
    btnText: "text-white",
    btnBorder: "border-[#C2410C]",
    btnShadow: "rgba(234, 88, 12, 0.45)",
    dialogue: "Bantu lengkapi huruf yang hilang ya!",
    DioramaComponent: WordPuzzleTrayDiorama,
  },
];

export default function MainMenuView() {
  const { navigateTo, activeCarouselIndex, setActiveCarouselIndex } = useGame();
  const { playSfx } = useAudio();

  // Centralized carousel index from GameContext as single source of truth
  const activeIndex = typeof activeCarouselIndex === "number" ? activeCarouselIndex : 0;

  const activeModule = MODULES[activeIndex] || MODULES[0];
  const prevIndex = (activeIndex - 1 + MODULES.length) % MODULES.length;
  const nextIndex = (activeIndex + 1) % MODULES.length;
  const prevModuleData = MODULES[prevIndex] || MODULES[0];
  const nextModuleData = MODULES[nextIndex] || MODULES[0];

  const ActiveDiorama = activeModule.DioramaComponent;
  const PrevDiorama = prevModuleData.DioramaComponent;
  const NextDiorama = nextModuleData.DioramaComponent;

  // Carousel navigation handlers - synchronize directly with GameContext
  const prevModule = useCallback(() => {
    if (typeof playSfx === "function") playSfx("hover");
    setActiveCarouselIndex((activeIndex - 1 + MODULES.length) % MODULES.length);
  }, [playSfx, activeIndex, setActiveCarouselIndex]);

  const nextModule = useCallback(() => {
    if (typeof playSfx === "function") playSfx("hover");
    setActiveCarouselIndex((activeIndex + 1) % MODULES.length);
  }, [playSfx, activeIndex, setActiveCarouselIndex]);

  const handlePlay = useCallback(
    (route) => {
      setActiveCarouselIndex(activeIndex);
      if (typeof playSfx === "function") playSfx("fanfare");
      if (typeof navigateTo === "function") navigateTo(route);
    },
    [activeIndex, setActiveCarouselIndex, playSfx, navigateTo]
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
        handlePlay(MODULES[activeIndex]?.route || "/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, prevModule, nextModule, handlePlay]);

  return (
    <main className="relative w-screen h-screen max-h-screen overflow-hidden flex flex-col justify-between bg-transparent select-none">
      {/* ── 1. Persistent Living Vector Landscape (Layer 0) ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <GameLandscapeBackground />
      </div>

      {/* ── 2. Top Header Tier (Kembali ke Beranda Button) ── */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between px-6 pt-2 flex-shrink-0">
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
          className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#F1F5F9] border-b-4 border-[#CBD5E1] text-[#1B4965] font-display font-bold text-xs sm:text-sm shadow-md active:border-b-0 cursor-pointer"
        >
          <ArrowLeft size={16} className="text-[#1B4965]" />
          <span>Beranda</span>
        </motion.button>

        <div className="w-16 sm:w-24" />
      </header>

      {/* ── 3. Middle Carousel Stage Tier (Two-Tier Jendela Ilustrasi) ── */}
      <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center my-auto px-4">
        
        {/* Carousel Track Container with Flanking Arrows */}
        <div className="relative max-w-5xl w-full flex items-center justify-center gap-3 sm:gap-6">
          
          {/* Left Navigation Arrow Sprite (kiri.png) */}
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

          {/* Carousel Cards Track with Swipe Support */}
          <div className="relative flex items-center justify-center gap-3 sm:gap-5 flex-1 max-w-4xl">
            
            {/* Left Flanking Inactive Dimmed Card */}
            <motion.div
              type="button"
              whileHover={{ scale: 0.84, opacity: 0.65 }}
              whileTap={{ scale: 0.78 }}
              onClick={prevModule}
              aria-label={`Pilih ${prevModuleData.title}`}
              className={`hidden md:flex flex-col justify-between p-3 sm:p-3.5 rounded-3xl bg-gradient-to-b ${prevModuleData.bgGradient} border-b-[6px] ${prevModuleData.borderBottom} shadow-xl scale-75 lg:scale-80 opacity-40 select-none pointer-events-auto cursor-pointer w-56 h-[330px] lg:w-60 lg:h-[355px] flex-shrink-0 ${prevModuleData.textColor} transition-all`}
            >
              {/* Upper Diorama Preview Window (Idle / Paused Animation) */}
              <div className={`relative w-full h-[54%] rounded-2xl overflow-hidden bg-gradient-to-b ${prevModuleData.windowBg} border border-white/30 shadow-inner flex items-center justify-center p-1`}>
                <PrevDiorama isActive={false} />
              </div>

              {/* Lower Info Stage */}
              <div className="flex-1 flex flex-col justify-between pt-2">
                <div>
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-sans font-bold ${prevModuleData.badgeBg}`}>
                    <Star size={10} className="fill-current text-[#FCD34D]" />
                    <span>{prevModuleData.badge}</span>
                  </div>
                  <h3 className="font-display font-black text-sm lg:text-base leading-tight mt-1">
                    {prevModuleData.title}
                  </h3>
                  <p className="font-sans text-[11px] opacity-80 line-clamp-1 mt-0.5">
                    {prevModuleData.subtext}
                  </p>
                </div>
                <div className="w-full py-1.5 px-3 rounded-xl bg-white/20 text-center font-display font-bold text-xs opacity-90">
                  Lihat Modul
                </div>
              </div>
            </motion.div>

            {/* Active Center Spotlight Card (Two-Tier Jendela Ilustrasi) */}
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
                  initial={{ scale: 0.94, opacity: 1, y: 6 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.94, opacity: 0.85, y: -6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  style={{
                    boxShadow: `0 24px 48px -12px ${activeModule.glowColor}`,
                  }}
                  className={`relative overflow-hidden group w-[300px] sm:w-[330px] md:w-[350px] lg:w-[365px] h-[390px] sm:h-[415px] md:h-[430px] rounded-[28px] sm:rounded-[32px] p-3.5 sm:p-4 bg-gradient-to-b ${activeModule.bgGradient} border-b-[8px] sm:border-b-[10px] ${activeModule.borderBottom} shadow-2xl flex flex-col justify-between items-center text-center ${activeModule.textColor} select-none transition-shadow`}
                >
                  {/* Top Gloss Light Reflex Line */}
                  <div className="absolute top-1.5 inset-x-6 h-[2px] bg-white/50 rounded-full pointer-events-none" />

                  {/* Subtle Diagonal Shimmer Highlight */}
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none group-hover:animate-shimmer" />

                  {/* ── 1. Upper Zone: Jendela Ilustrasi (Diorama Window) ── */}
                  <div className={`relative w-full h-[53%] sm:h-[55%] rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b ${activeModule.windowBg} border-2 ${activeModule.windowBorder} shadow-[inset_0_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center p-1`}>
                    {/* Top Window Gloss Arc */}
                    <div className="absolute top-1 inset-x-4 h-[2px] bg-white/40 rounded-full pointer-events-none z-10" />

                    {/* Floating Category Star Badge inside Window Top-Right */}
                    <div className="absolute top-2.5 right-2.5 z-20">
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] sm:text-xs font-sans font-bold shadow-sm backdrop-blur-xs ${activeModule.badgeBg}`}>
                        <Star size={12} className="fill-current text-[#FCD34D]" />
                        <span>{activeModule.badge}</span>
                      </div>
                    </div>

                    {/* Living Bespoke 3D Toy Diorama */}
                    <ActiveDiorama isActive={true} />
                  </div>

                  {/* ── 2. Lower Zone: Information & Action Stage ── */}
                  <div className="relative w-full flex-1 flex flex-col justify-between pt-2 sm:pt-2.5 pb-0.5 px-1 z-10">
                    {/* Title & Concise Subtext */}
                    <div>
                      <h2 className="font-display font-black text-2xl sm:text-3xl leading-tight drop-shadow-sm tracking-tight">
                        {activeModule.title}
                      </h2>
                      <p className="font-sans font-semibold text-xs sm:text-[13px] opacity-95 mt-1 leading-snug line-clamp-2 px-1">
                        {activeModule.subtext}
                      </p>
                    </div>

                    {/* Supreme Tactile "MAINKAN" Action Button */}
                    <div className="w-full mt-2">
                      <TactilePlayButton
                        onClick={() => handlePlay(activeModule.route)}
                        bgGradient={activeModule.btnGrad}
                        textColor={activeModule.btnText}
                        borderColor={activeModule.btnBorder}
                        glowColor={activeModule.btnShadow}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Right Flanking Inactive Dimmed Card */}
            <motion.div
              type="button"
              whileHover={{ scale: 0.84, opacity: 0.65 }}
              whileTap={{ scale: 0.78 }}
              onClick={nextModule}
              aria-label={`Pilih ${nextModuleData.title}`}
              className={`hidden md:flex flex-col justify-between p-3 sm:p-3.5 rounded-3xl bg-gradient-to-b ${nextModuleData.bgGradient} border-b-[6px] ${nextModuleData.borderBottom} shadow-xl scale-75 lg:scale-80 opacity-40 select-none pointer-events-auto cursor-pointer w-56 h-[330px] lg:w-60 lg:h-[355px] flex-shrink-0 ${nextModuleData.textColor} transition-all`}
            >
              {/* Upper Diorama Preview Window (Idle / Paused Animation) */}
              <div className={`relative w-full h-[54%] rounded-2xl overflow-hidden bg-gradient-to-b ${nextModuleData.windowBg} border border-white/30 shadow-inner flex items-center justify-center p-1`}>
                <NextDiorama isActive={false} />
              </div>

              {/* Lower Info Stage */}
              <div className="flex-1 flex flex-col justify-between pt-2">
                <div>
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-sans font-bold ${nextModuleData.badgeBg}`}>
                    <Star size={10} className="fill-current text-[#FCD34D]" />
                    <span>{nextModuleData.badge}</span>
                  </div>
                  <h3 className="font-display font-black text-sm lg:text-base leading-tight mt-1">
                    {nextModuleData.title}
                  </h3>
                  <p className="font-sans text-[11px] opacity-80 line-clamp-1 mt-0.5">
                    {nextModuleData.subtext}
                  </p>
                </div>
                <div className="w-full py-1.5 px-3 rounded-xl bg-white/20 text-center font-display font-bold text-xs opacity-90">
                  Lihat Modul
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Navigation Arrow Sprite (kanan.png) */}
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
        <div className="flex items-center justify-center gap-2 mt-2.5 sm:mt-3 z-30">
          {MODULES.map((mod, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  if (typeof playSfx === "function") playSfx("click");
                  setActiveCarouselIndex(idx);
                }}
                aria-label={`Pilih tantangan ${mod.title}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? "w-8 h-2.5 bg-[#F59E0B] border-2 border-white shadow-sm"
                    : "w-2.5 h-2.5 bg-white/70 hover:bg-white border border-[#1B4965]/20 shadow-2xs"
                }`}
              />
            );
          })}
        </div>

      </div>

      {/* ── 4. Bottom Mascot & Terrain Tier (Real Anchored Space) ── */}
      <div className="relative z-10 w-full flex justify-between items-end px-8 pb-3 pointer-events-none flex-shrink-0">
        
        {/* Left Flank: Saka Mascot on Grassy Mound */}
        <div className="relative pointer-events-auto flex flex-col items-center">
          {/* Saka Speech Bubble */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule.id}
              initial={{ scale: 0.9, opacity: 1, y: 4 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute -top-14 sm:-top-16 left-2 sm:left-4 z-30 bg-white/95 border-2 border-[#1B4965]/20 rounded-2xl px-3 py-1.5 shadow-lg max-w-[180px] sm:max-w-[210px] text-center pointer-events-none"
            >
              <p className="font-sans font-bold text-xs text-[#1B4965] leading-snug">
                {activeModule.dialogue}
              </p>
              <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white border-r-2 border-b-2 border-[#1B4965]/20 rotate-45" />
            </motion.div>
          </AnimatePresence>

          <motion.div
            key={`saka-${activeIndex}`}
            initial={{ y: 0, scale: 1 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <SakaMascot isWaving={true} className="w-20 h-26 sm:w-24 sm:h-30 md:w-28 md:h-34" />
          </motion.div>
        </div>

        {/* Right Flank: Tika Mascot on Grassy Mound */}
        <div className="relative pointer-events-auto flex flex-col items-center">
          <motion.div
            key={`tika-${activeIndex}`}
            initial={{ y: 0, scale: 1 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.04 }}
          >
            <TikaMascot isCheering={true} className="w-20 h-26 sm:w-24 sm:h-30 md:w-28 md:h-34" />
          </motion.div>
        </div>

      </div>

    </main>
  );
}
