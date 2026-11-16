// src/views/modules/MengenalHurufView.jsx
// SAKA TIKA: "Mengenal Huruf A-Z" Spacing & Layout Polish.
// - Completely removed "PETUALANGAN HURUF A-Z" yellow badge.
// - Unified single top row with 3 connected folder tabs (Left) & progress pill (Right) flush to board.
// - 3x3 letter grid expands evenly across full board height (grid-rows-3 items-stretch) with zero top dead gap.
// - Strict non-overlapping 2-column layout (grid-cols-[250px_1fr] to [300px_1fr], gap-6 to gap-8)
//   giving Tika's hand generous open clearance away from kiri.png.
// - Firmly grounded Saka & Tika resting naturally on the 3D grass mound with contact shadows & neat props.
// - Decluttered active card (No "Buka!" sticker) and clean locked cards (No repetitive "Terkunci" text).
// STRICT ZERO SCROLLBAR APP LOCK: h-screen w-screen overflow-hidden select-none.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons and custom vector assets.

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  Trophy,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Lock,
  Sparkles,
} from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { ALPHABET_DATA } from "../../data/masterDataset.js";
import { speakLetter, speakWord, speakInstruction } from "../../utils/speechEngine.js";
import BlueStorybookBackground from "../../components/background/BlueStorybookBackground.jsx";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";

// ── 3 Page Category Groups (3x3 Grid per page) ──────────────────────
const PAGE_GROUPS = [
  ALPHABET_DATA.slice(0, 9),   // Page 1: A – I (9 letters)
  ALPHABET_DATA.slice(9, 18),  // Page 2: J – R (9 letters)
  ALPHABET_DATA.slice(18, 26), // Page 3: S – Z (8 letters + 1 Celebration Card)
];

const TABS = [
  { label: "Huruf A \u2013 I", page: 0, gradient: "from-[#38BDF8] to-[#0284C7]", border: "border-[#0369A1]" },
  { label: "Huruf J \u2013 R", page: 1, gradient: "from-[#FBBF24] to-[#D97706]", border: "border-[#B45309]" },
  { label: "Huruf S \u2013 Z", page: 2, gradient: "from-[#34D399] to-[#059669]", border: "border-[#047857]" },
];

export default function MengenalHurufView() {
  const { addStars, discoverLetter, isLetterDiscovered, discoveredLetters } = useGame();
  const { playSfx } = useAudio();

  // ── Sequential Unlocking State (persisted in localStorage) ─────────
  const [maxUnlockedIndex, setMaxUnlockedIndex] = useState(() => {
    try {
      const saved = localStorage.getItem("saka_tika_mengenal_unlocked_idx");
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 25) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return 0; // Starts with ONLY 'A' unlocked
  });

  const [activePage, setActivePage] = useState(() => {
    if (maxUnlockedIndex < 9) return 0;
    if (maxUnlockedIndex < 18) return 1;
    return 2;
  });

  const [selectedLetter, setSelectedLetter] = useState(null);
  const [wobbleKey, setWobbleKey] = useState(null);
  const [isMascotJumping, setIsMascotJumping] = useState(false);

  // Dynamic Speech Bubble State for Saka & Tika
  const [speechText, setSpeechText] = useState(() => {
    if (maxUnlockedIndex === 0) return "Ayo buka huruf A dulu!";
    if (maxUnlockedIndex >= 25) return "Luar biasa! Semua 26 huruf sudah terbuka!";
    return `Ayo buka huruf ${ALPHABET_DATA[maxUnlockedIndex].letter}!`;
  });

  // ── Handle Letter Card Click (Sequential Unlock Logic) ─────────────
  const handleCardClick = useCallback(
    (letterObj, globalIndex) => {
      // 1. Locked Letter Click: Wobble, soft error sound, voice prompt
      if (globalIndex > maxUnlockedIndex) {
        playSfx("error");
        setWobbleKey(letterObj.letter);
        setTimeout(() => setWobbleKey(null), 500);

        const targetLetter = ALPHABET_DATA[maxUnlockedIndex].letter;
        const msg = `Buka huruf ${targetLetter} dulu ya!`;
        setSpeechText(msg);
        speakInstruction(msg);
        return;
      }

      // 2. Unlocked Letter Click: Open Floating Detail Card & Pronounce
      playSfx("click");
      setSelectedLetter(letterObj);
      setIsMascotJumping(true);
      setTimeout(() => setIsMascotJumping(false), 700);

      speakLetter(letterObj);

      // 3. Unlock Next Letter if this was the active target
      if (globalIndex === maxUnlockedIndex && maxUnlockedIndex < 25) {
        const nextIdx = maxUnlockedIndex + 1;
        setMaxUnlockedIndex(nextIdx);
        try {
          localStorage.setItem("saka_tika_mengenal_unlocked_idx", String(nextIdx));
        } catch {
          // ignore
        }

        playSfx("success");
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.55 },
          colors: ["#F59E0B", "#10B981", "#3B82F6", "#EC4899", "#8B5CF6"],
        });

        const nextLetter = ALPHABET_DATA[nextIdx].letter;
        setSpeechText(`Hebat! Huruf ${nextLetter} sekarang terbuka!`);
      }

      // Track discovery in central game context
      if (!isLetterDiscovered(letterObj.letter)) {
        discoverLetter(letterObj.letter);
        addStars(1);
      }
    },
    [maxUnlockedIndex, playSfx, isLetterDiscovered, discoverLetter, addStars]
  );

  // ── Celebration Card Click (Slot 9 on Page 3) ─────────────────────
  const handleCelebrationClick = useCallback(() => {
    playSfx("fanfare");
    setIsMascotJumping(true);
    setTimeout(() => setIsMascotJumping(false), 800);
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.55 },
      colors: ["#F59E0B", "#E11D48", "#10B981", "#3B82F6", "#8B5CF6"],
    });
    setSpeechText("Hore! Kamu hebat sekali sudah mengenal semua huruf!");
    speakInstruction("Hore! Kamu hebat sekali sudah mengenal semua huruf!");
  }, [playSfx]);

  // Page navigation
  const prevPage = useCallback(() => {
    playSfx("hover");
    setActivePage((prev) => (prev === 0 ? 2 : prev - 1));
  }, [playSfx]);

  const nextPage = useCallback(() => {
    playSfx("hover");
    setActivePage((prev) => (prev === 2 ? 0 : prev + 1));
  }, [playSfx]);

  // Navigate letters inside the modal (with sequential unlocking forward)
  const handleNavigateModalLetter = useCallback(
    (direction) => {
      if (!selectedLetter) return;
      playSfx("click");
      const currentIndex = ALPHABET_DATA.findIndex((item) => item.letter === selectedLetter.letter);
      let newIndex = currentIndex + direction;

      // Restrict navigation
      if (newIndex < 0) return;
      if (newIndex >= ALPHABET_DATA.length) return;

      // If stepping forward into next locked letter, unlock it!
      if (newIndex > maxUnlockedIndex) {
        if (newIndex <= 25) {
          setMaxUnlockedIndex(newIndex);
          try {
            localStorage.setItem("saka_tika_mengenal_unlocked_idx", String(newIndex));
          } catch {
            // ignore
          }
          playSfx("success");
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.55 },
            colors: ["#F59E0B", "#10B981", "#3B82F6", "#EC4899"],
          });
          const nextLetter = ALPHABET_DATA[newIndex].letter;
          setSpeechText(`Hebat! Huruf ${nextLetter} sekarang terbuka!`);
        }
      }

      const nextLetterObj = ALPHABET_DATA[newIndex];
      setSelectedLetter(nextLetterObj);

      // Auto-sync page tab
      if (newIndex < 9) setActivePage(0);
      else if (newIndex < 18) setActivePage(1);
      else setActivePage(2);

      // Pronounce new letter
      speakLetter(nextLetterObj);

      // Track discovery in central game context
      if (!isLetterDiscovered(nextLetterObj.letter)) {
        discoverLetter(nextLetterObj.letter);
        addStars(1);
      }
    },
    [selectedLetter, maxUnlockedIndex, playSfx, isLetterDiscovered, discoverLetter, addStars]
  );

  const activeGroup = PAGE_GROUPS[activePage];

  return (
    <main className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none p-2 sm:p-3">
      {/* ── 1. Base Layer: Dedicated Royal & Sky Blue Storybook Background ── */}
      <BlueStorybookBackground />

      {/* ── 2. Subtle Depth Tint Layer ─────────────────────────── */}
      <div className="fixed inset-0 bg-[#0A3464]/10 backdrop-blur-[0.5px] pointer-events-none z-0" />

      {/* ── 3. Open Widescreen 2-Column Adventure Stage ───────── */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden grid grid-cols-[250px_1fr] md:grid-cols-[270px_1fr] lg:grid-cols-[300px_1fr] gap-5 md:gap-6 lg:gap-8 items-center max-w-7xl w-full mx-auto my-auto px-2 sm:px-4">
        
        {/* ═════════════════════════════════════════════════════
            LEFT COLUMN: Grounded 3D Grass Mound & Mascots Stage
           ═════════════════════════════════════════════════════ */}
        <aside className="w-full flex flex-col items-center justify-end relative h-full max-h-[82vh] overflow-visible select-none">
          {/* Dynamic Child-Friendly Speech Bubble */}
          <motion.div
            key={speechText}
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            onClick={() => {
              playSfx("click");
              speakInstruction(speechText);
            }}
            className="relative z-20 mb-3 px-3.5 py-1.5 bg-white/95 border-3 border-amber-300 shadow-md rounded-2xl max-w-[230px] text-center cursor-pointer hover:scale-103 transition-transform"
          >
            <p className="font-display font-bold text-xs sm:text-sm text-[#1B4965] leading-snug">
              {speechText}
            </p>
            {/* Speech Bubble Arrow pointing down to Saka & Tika */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-white" />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[7px] border-x-transparent border-t-[7px] border-t-amber-300 -z-10" />
          </motion.div>

          {/* Pedestal Stage with Firmly Grounded Saka & Tika */}
          <div className="relative flex flex-col items-center justify-end overflow-visible w-full mt-auto">
            {/* Dual Mascots Resting Naturally on Top of Grass Mound */}
            <motion.div
              animate={
                isMascotJumping
                  ? { y: [-24, 0], scale: [1.08, 1] }
                  : { y: [0, -5, 0] }
              }
              transition={
                isMascotJumping
                  ? { duration: 0.5, type: "spring", stiffness: 420, damping: 15 }
                  : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
              }
              className="relative flex items-end justify-center gap-1 z-10 origin-bottom -mb-3 sm:-mb-4"
            >
              {/* Saka Cutout */}
              <motion.img
                src="/assets/saka-maskot-1-cutout.png"
                alt="Saka Maskot"
                draggable="false"
                whileHover={{ scale: 1.05 }}
                className="h-[28vh] sm:h-[32vh] md:h-[36vh] max-h-[290px] w-auto object-contain object-bottom drop-shadow-md cursor-pointer select-none"
                onClick={() => {
                  playSfx("click");
                  setIsMascotJumping(true);
                  setTimeout(() => setIsMascotJumping(false), 700);
                  speakInstruction("Halo! Aku Saka! Ayo buka huruf berikutnya!");
                }}
              />
              {/* Tika Cutout (Positioned neatly with zero protrusion into board) */}
              <motion.img
                src="/assets/tika-maskot-1-cutout.png"
                alt="Tika Maskot"
                draggable="false"
                whileHover={{ scale: 1.05 }}
                className="h-[26vh] sm:h-[30vh] md:h-[34vh] max-h-[275px] w-auto object-contain object-bottom drop-shadow-md cursor-pointer select-none -ml-3"
                onClick={() => {
                  playSfx("click");
                  setIsMascotJumping(true);
                  setTimeout(() => setIsMascotJumping(false), 700);
                  speakInstruction("Hai! Aku Tika! Belajar huruf sangat menyenangkan!");
                }}
              />
            </motion.div>

            {/* Natural Contact Shadows beneath shoes */}
            <div className="flex items-center justify-center gap-3 w-full -mb-2 z-10 pointer-events-none">
              <div className="w-20 sm:w-24 h-2.5 bg-[#064E3B]/40 rounded-full blur-[2px]" />
              <div className="w-18 sm:w-22 h-2.5 bg-[#064E3B]/40 rounded-full blur-[2px] -ml-4" />
            </div>

            {/* Wide Grounded 3D Lush Grass Hill Mound with 3D Lip & Props */}
            <div className="relative w-full max-w-[250px] sm:max-w-[280px] rounded-t-[2.5rem] rounded-b-[1.75rem] bg-gradient-to-b from-[#4ADE80] via-[#22C55E] to-[#16A34A] border-t-3 border-x-3 border-[#86EFAC] border-b-8 border-[#15803D] shadow-[0_12px_24px_rgba(21,128,61,0.4)] px-3 pt-3 pb-3 z-0 flex flex-col items-center">
              {/* Cleanly Arranged 3D Toy Blocks & Open Storybook */}
              <div className="flex items-center justify-center gap-2.5 w-full drop-shadow-md">
                {/* 3D Toy Blocks A B C */}
                <div className="flex items-center gap-1.5">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -6 }}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-b from-[#EF4444] to-[#DC2626] border-b-4 border-[#991B1B] border-t border-l border-r border-red-300 text-white font-display font-black text-xs sm:text-sm md:text-base flex items-center justify-center shadow-md rotate-[-4deg] cursor-pointer select-none"
                  >
                    <span>A</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-b from-[#3B82F6] to-[#2563EB] border-b-4 border-[#1D4ED8] border-t border-l border-r border-blue-300 text-white font-display font-black text-xs sm:text-sm md:text-base flex items-center justify-center shadow-md rotate-[4deg] cursor-pointer select-none"
                  >
                    <span>B</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -3 }}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-b from-[#F59E0B] to-[#D97706] border-b-4 border-[#B45309] border-t border-l border-r border-amber-300 text-white font-display font-black text-xs sm:text-sm md:text-base flex items-center justify-center shadow-md rotate-[-2deg] cursor-pointer select-none"
                  >
                    <span>C</span>
                  </motion.div>
                </div>

                {/* Open Storybook Prop */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="w-13 h-9 sm:w-15 sm:h-10 md:w-16 md:h-11 cursor-pointer select-none flex-shrink-0"
                >
                  <svg viewBox="0 0 80 52" className="w-full h-full drop-shadow-md">
                    <path
                      d="M40 12 C28 6 12 6 4 10 L4 42 C12 38 28 38 40 44 C52 38 68 38 76 42 L76 10 C68 6 52 6 40 12 Z"
                      fill="#1E40AF"
                      stroke="#172554"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M40 14 C29 8 14 8 7 12 L7 40 C14 36 29 36 40 42 C51 36 66 36 73 40 L73 12 C66 8 51 8 40 14 Z"
                      fill="#FFFDF7"
                      stroke="#CBD5E1"
                      strokeWidth="1.5"
                    />
                    <line x1="40" y1="14" x2="40" y2="42" stroke="#94A3B8" strokeWidth="2" />
                    <path d="M14 20 Q24 18 34 20 M14 26 Q24 24 34 26 M14 32 Q24 30 34 32" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M46 20 Q56 18 66 20 M46 26 Q56 24 66 26 M46 32 Q56 30 66 32" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M40 42 L40 50 L36 47 L32 50 L34 42" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>
        </aside>

        {/* ═════════════════════════════════════════════════════
            RIGHT COLUMN: Unified Header Row & Balanced 3D Board
           ═════════════════════════════════════════════════════ */}
        <section className="w-full h-full max-h-[82vh] min-h-0 flex flex-col justify-between overflow-hidden">
          {/* Unified Board Header Row: Flush Folder Tabs (Left) & Progress Pill (Right) */}
          <div className="flex items-end justify-between px-4 sm:px-6 z-10 -mb-[4px] flex-shrink-0 w-full">
            {/* Left: 3 Connected Storybook Folder Tabs */}
            <div className="flex items-end gap-1 sm:gap-2">
              {TABS.map((tab) => {
                const isActive = activePage === tab.page;
                const tabStart = tab.page * 9;
                const tabEnd = tabStart + 9;
                const hasActiveTarget = maxUnlockedIndex >= tabStart && maxUnlockedIndex < tabEnd;

                return (
                  <motion.button
                    key={tab.page}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    onClick={() => {
                      playSfx("hover");
                      setActivePage(tab.page);
                    }}
                    aria-label={`Buka halaman ${tab.label}`}
                    className={`relative px-4 sm:px-6 rounded-t-2xl font-display font-black text-xs sm:text-sm cursor-pointer transition-all border-t-4 border-x-4 border-b-0 select-none ${
                      isActive
                        ? "bg-sky-50 text-[#0284C7] border-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-20 pt-2 pb-2.5 -mb-[4px]"
                        : "bg-white/75 hover:bg-white text-slate-600 border-white/70 shadow-none z-0 hover:text-slate-800 pt-1.5 pb-2"
                    }`}
                  >
                    <span className="drop-shadow-2xs">{tab.label}</span>
                    {hasActiveTarget && !isActive && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white animate-pulse" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Right: Sleek Progress Pill aligned on the same horizontal row */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 border-2 border-amber-300 shadow-sm mb-1">
              <Star size={14} className="fill-[#F59E0B] text-[#D97706]" />
              <span className="font-sans font-extrabold text-xs sm:text-sm text-[#92400E]">
                Terbuka: {Math.min(maxUnlockedIndex + 1, 26)} / 26 Huruf
              </span>
            </div>
          </div>

          {/* Sturdy 3D Toy Game Board Frame */}
          <div className="bg-sky-50/90 backdrop-blur-md border-4 border-white shadow-[0_12px_0_rgba(12,62,135,0.35),0_20px_35px_rgba(0,0,0,0.2)] rounded-[2rem] px-4 py-4 md:px-6 md:py-5 flex-1 min-h-0 flex flex-col justify-between overflow-hidden relative z-0">
            {/* Horizontal Track: Left Arrow, 3x3 Grid, Right Arrow */}
            <div className="flex-1 min-h-0 flex items-center justify-between gap-3 md:gap-4 w-full">
              {/* Left Arrow Button (Neatly framed inside board) */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.15, rotate: -3 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 450, damping: 16 }}
                onClick={prevPage}
                aria-label="Halaman Huruf Sebelumnya"
                className="p-0 bg-transparent border-0 outline-none cursor-pointer flex-shrink-0 z-20"
              >
                <img
                  src="/assets/buttons/kiri.png"
                  alt="Sebelumnya"
                  draggable="false"
                  className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 object-contain drop-shadow select-none pointer-events-none"
                  style={{ imageRendering: "-webkit-optimize-contrast" }}
                />
              </motion.button>

              {/* 3x3 Grid: Expands evenly across full height (grid-rows-3 items-stretch, zero top dead gap) */}
              <div className="flex-1 min-h-0 h-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="grid grid-cols-3 grid-rows-3 gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 h-full items-stretch"
                  >
                    {activeGroup.map((letterObj, slotIdx) => {
                      const globalIndex = activePage * 9 + slotIdx;
                      const isWobbling = wobbleKey === letterObj.letter;

                      return (
                        <ToyLetterCard
                          key={letterObj.letter}
                          item={letterObj}
                          globalIndex={globalIndex}
                          maxUnlockedIndex={maxUnlockedIndex}
                          isWobbling={isWobbling}
                          onClick={() => handleCardClick(letterObj, globalIndex)}
                          onHover={() => playSfx("hover")}
                        />
                      );
                    })}

                    {/* Slot 9 on Page 3: Special Celebration Reward Card */}
                    {activePage === 2 && (
                      <CelebrationRewardCard
                        maxUnlockedIndex={maxUnlockedIndex}
                        onClick={handleCelebrationClick}
                        onHover={() => playSfx("hover")}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Arrow Button (Neatly framed inside board) */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.15, rotate: 3 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 450, damping: 16 }}
                onClick={nextPage}
                aria-label="Halaman Huruf Selanjutnya"
                className="p-0 bg-transparent border-0 outline-none cursor-pointer flex-shrink-0 z-20"
              >
                <img
                  src="/assets/buttons/kanan.png"
                  alt="Selanjutnya"
                  draggable="false"
                  className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 object-contain drop-shadow select-none pointer-events-none"
                  style={{ imageRendering: "-webkit-optimize-contrast" }}
                />
              </motion.button>
            </div>

            {/* Candy Indicator Dots below 3x3 grid */}
            <div className="flex items-center justify-center gap-2 flex-shrink-0 z-20 mt-3">
              {[0, 1, 2].map((idx) => {
                const isActive = activePage === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      playSfx("click");
                      setActivePage(idx);
                    }}
                    aria-label={`Pilih Halaman ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      isActive
                        ? "w-7 sm:w-8 h-2.5 bg-[#F59E0B] border-2 border-white shadow-xs"
                        : "w-2.5 h-2.5 bg-white/70 hover:bg-white border border-[#1B4965]/20 shadow-2xs"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* ── 4. Interactive Floating Letter Detail Card Modal ──── */}
      <AnimatePresence>
        {selectedLetter && (
          <LetterDetailModal
            letterObj={selectedLetter}
            maxUnlockedIndex={maxUnlockedIndex}
            onClose={() => {
              playSfx("click");
              setSelectedLetter(null);
            }}
            onNavigate={handleNavigateModalLetter}
            playSfx={playSfx}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

// ── 3D Illustrated Toy Letter Card Component (With 3 Visual States) ──
function ToyLetterCard({
  item,
  globalIndex,
  maxUnlockedIndex,
  isWobbling,
  onClick,
  onHover,
}) {
  const isTarget = globalIndex === maxUnlockedIndex;
  const isLocked = globalIndex > maxUnlockedIndex;

  // ── State 3: Twilight Royal Blue 3D Mystery Locked Card ────────────
  if (isLocked) {
    return (
      <motion.button
        type="button"
        animate={isWobbling ? { x: [-5, 5, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={onHover}
        onClick={onClick}
        aria-label={`Huruf ${item.letter} masih terkunci.`}
        className="relative overflow-hidden group rounded-xl sm:rounded-2xl p-2 sm:p-2.5 lg:p-3 h-full w-full flex items-center justify-between cursor-pointer select-none transition-all bg-gradient-to-br from-[#3B69B0] via-[#2C5292] to-[#1E3D73] border-2 border-[#5D8AD4]/60 border-b-4 border-b-[#152C54] shadow-[inset_0_2px_0_rgba(255,255,255,0.22)] hover:border-[#5D8AD4]/90"
      >
        {/* Top Gloss Light Reflex Line */}
        <div className="absolute top-1 inset-x-2 h-[1px] bg-white/25 rounded-full pointer-events-none" />

        {/* Delicate Inner Dashed Storybook Frame */}
        <div className="absolute inset-1 rounded-lg sm:rounded-xl border border-dashed border-sky-200/25 pointer-events-none" />

        {/* Faint Decorative 4-Point Star Sparkle Watermarks */}
        <svg
          className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 text-sky-200/20 pointer-events-none"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
        </svg>
        <svg
          className="absolute bottom-2 left-1/3 w-2.5 h-2.5 text-sky-200/15 pointer-events-none"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
        </svg>

        {/* Left Side: Frosted Alphabet Glyphs & 3 Mystery Dots */}
        <div className="flex flex-col items-start justify-center z-10 min-w-0 pr-1">
          <div className="flex items-baseline">
            <span className="font-display font-black text-xl sm:text-2xl lg:text-3xl leading-none text-sky-100/90 drop-shadow-xs">
              {item.letter}
            </span>
            <span className="font-display font-bold text-base sm:text-lg lg:text-xl text-sky-200/75 ml-0.5 leading-none">
              {item.lowercase}
            </span>
          </div>

          {/* 3 Cute Mystery Dots representing the hidden word */}
          <div className="mt-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-950/40 border border-sky-300/20 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-300/70 shadow-2xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-sky-300/70 shadow-2xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-sky-300/70 shadow-2xs" />
          </div>
        </div>

        {/* Right Side: Circular 3D Padlock Crest Medallion with Shake Rotation */}
        <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-b from-[#234378] to-[#19325C] border-2 border-amber-300/45 shadow-[inset_0_2px_4px_rgba(0,0,0,0.35)] group-hover:border-amber-300/75 group-hover:scale-105 transition-all z-10 relative">
          <motion.div
            animate={isWobbling ? { rotate: [-12, 12, -8, 8, 0] } : { rotate: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="flex items-center justify-center text-amber-300 drop-shadow-[0_2px_4px_rgba(245,158,11,0.4)]"
          >
            <Lock className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5" strokeWidth={2.5} />
          </motion.div>
        </div>
      </motion.button>
    );
  }

  // ── State 1 & 2: Active Target (glowing ring, ZERO Buka! sticker) or Unlocked (vibrant + star)
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.95, y: 1 }}
      transition={{ type: "spring", stiffness: 450, damping: 18 }}
      onMouseEnter={onHover}
      onClick={onClick}
      aria-label={`Huruf ${item.letter} untuk ${item.word}`}
      className={`relative overflow-hidden group rounded-xl sm:rounded-2xl p-2 sm:p-2.5 lg:p-3 h-full w-full flex items-center justify-between cursor-pointer select-none transition-all ${
        isTarget
          ? "ring-4 ring-amber-300 ring-offset-2 border-b-6 shadow-md scale-102"
          : "border-b-4 shadow-xs hover:shadow-md"
      }`}
      style={{
        backgroundColor: `${item.color}15`,
        borderColor: item.color,
        borderTop: "1px solid rgba(255,255,255,0.8)",
        borderLeft: "1px solid rgba(255,255,255,0.8)",
        borderRight: "1px solid rgba(255,255,255,0.8)",
        boxShadow: isTarget ? "0 0 16px rgba(251, 191, 36, 0.45)" : undefined,
      }}
    >
      {/* Top Gloss Light Reflex Line */}
      <div className="absolute top-1 inset-x-2 h-[1px] bg-white/80 rounded-full pointer-events-none" />

      {/* Shimmer Highlight on Hover */}
      <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none group-hover:animate-shimmer" />

      {/* Left Section: Alphabet Glyphs & Noun Word */}
      <div className="flex flex-col items-start justify-center z-10 min-w-0 pr-1">
        <div className="flex items-baseline">
          <span
            className="font-display font-black text-xl sm:text-2xl lg:text-3xl leading-none drop-shadow-xs"
            style={{ color: item.color }}
          >
            {item.letter}
          </span>
          <span
            className="font-display font-bold text-base sm:text-lg lg:text-xl opacity-80 ml-0.5 leading-none"
            style={{ color: item.color }}
          >
            {item.lowercase}
          </span>
        </div>
        <span className="font-sans font-bold text-[11px] sm:text-xs text-[#1B4965] mt-0.5 leading-tight truncate">
          {item.word}
        </span>
      </div>

      {/* Right Section: Vector Object Illustration with high-contrast badge (100% unobstructed) */}
      <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-13 lg:h-13 flex-shrink-0 flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform drop-shadow-xs z-10">
        <WordIllustration
          illustrationKey={item.illustrationKey}
          word={item.word}
          color={item.color}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Top-Right Badge: Star ONLY for discovered letters (ZERO Buka! sticker on target card) */}
      {!isTarget && (
        <div className="absolute top-1.5 right-1.5 z-20">
          <div className="w-4 h-4 rounded-full bg-[#FEF3C7] border border-[#F59E0B] flex items-center justify-center shadow-2xs">
            <Star size={10} className="fill-[#F59E0B] text-[#D97706]" />
          </div>
        </div>
      )}
    </motion.button>
  );
}

// ── Milestone Reward Celebration Card (Page 3, Slot 9) ──────────────
function CelebrationRewardCard({ maxUnlockedIndex, onClick, onHover }) {
  const isAllComplete = maxUnlockedIndex >= 25;

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.95, y: 1 }}
      transition={{ type: "spring", stiffness: 450, damping: 18 }}
      onMouseEnter={onHover}
      onClick={onClick}
      aria-label="Pesta Perayaan Bintang Huruf"
      className="relative overflow-hidden group rounded-xl sm:rounded-2xl p-2 sm:p-2.5 lg:p-3 h-full w-full flex items-center justify-between shadow-xs hover:shadow-md cursor-pointer select-none bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-b-4 border-[#F59E0B] border-t border-l border-r border-white/80"
    >
      <div className="absolute top-1 inset-x-2 h-[1px] bg-white/70 rounded-full pointer-events-none" />
      <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none group-hover:animate-shimmer" />

      <div className="flex flex-col items-start justify-center z-10 pr-1">
        <span className="font-display font-black text-sm sm:text-base lg:text-lg text-[#B45309] leading-tight">
          {isAllComplete ? "Hebat!" : "Ayo Temukan!"}
        </span>
        <span className="font-sans font-bold text-[10px] text-[#92400E] mt-0.5 leading-tight">
          {isAllComplete ? "26 Huruf Selesai" : `${maxUnlockedIndex + 1}/26 Terbuka`}
        </span>
      </div>

      <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-13 lg:h-13 flex-shrink-0 flex items-center justify-center group-hover:scale-115 transition-transform drop-shadow-xs z-10 text-[#F59E0B]">
        <Trophy size={26} className="fill-[#FEF3C7] stroke-[#D97706] stroke-2" />
      </div>

      <div className="absolute top-1 right-1 z-20">
        <div className="w-4 h-4 rounded-full bg-[#F59E0B] flex items-center justify-center text-white shadow-2xs">
          <Star size={10} className="fill-current" />
        </div>
      </div>
    </motion.button>
  );
}

// ── Accessory-Rich Floating Detail Card Modal ────────────────────────
function LetterDetailModal({ letterObj, maxUnlockedIndex, onClose, onNavigate, playSfx }) {
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(null);
  const [isSpeakingSequence, setIsSpeakingSequence] = useState(false);
  const sequenceTimersRef = useRef([]);

  const currentIndex = useMemo(
    () => ALPHABET_DATA.findIndex((item) => item.letter === letterObj.letter),
    [letterObj.letter]
  );

  // Clear all pending audio sequence timers
  const clearTimers = useCallback(() => {
    sequenceTimersRef.current.forEach((t) => clearTimeout(t));
    sequenceTimersRef.current = [];
    setIsSpeakingSequence(false);
    setActiveHighlightIndex(null);
  }, []);

  // Cleanup on unmount or when letter changes
  useEffect(() => {
    return () => {
      clearTimers();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [letterObj, clearTimers]);

  // Pronounce a single word example card: "A, untuk Apel"
  const handleWordClick = useCallback(
    (example, index) => {
      clearTimers();
      playSfx("click");
      setActiveHighlightIndex(index);

      speakWord({ letter: letterObj.letter, word: example.word });

      const timer = setTimeout(() => {
        setActiveHighlightIndex(null);
      }, 1600);
      sequenceTimersRef.current.push(timer);
    },
    [letterObj.letter, playSfx, clearTimers]
  );

  // Play sequential audio: letter, then word 1, word 2, word 3
  const handlePlayAllSequence = useCallback(() => {
    clearTimers();
    playSfx("click");
    setIsSpeakingSequence(true);

    // Step 1: Speak Letter
    speakLetter(letterObj);

    // Step 2: Speak Example Word 1
    const t1 = setTimeout(() => {
      if (!letterObj.examples[0]) return;
      setActiveHighlightIndex(0);
      speakWord({ letter: letterObj.letter, word: letterObj.examples[0].word });
    }, 1500);

    // Step 3: Speak Example Word 2
    const t2 = setTimeout(() => {
      if (!letterObj.examples[1]) return;
      setActiveHighlightIndex(1);
      speakWord({ letter: letterObj.letter, word: letterObj.examples[1].word });
    }, 3300);

    // Step 4: Speak Example Word 3
    const t3 = setTimeout(() => {
      if (!letterObj.examples[2]) return;
      setActiveHighlightIndex(2);
      speakWord({ letter: letterObj.letter, word: letterObj.examples[2].word });
    }, 5100);

    // Step 5: Finish Sequence
    const t4 = setTimeout(() => {
      setActiveHighlightIndex(null);
      setIsSpeakingSequence(false);
    }, 6900);

    sequenceTimersRef.current = [t1, t2, t3, t4];
  }, [letterObj, playSfx, clearTimers]);

  const examples = letterObj.examples || [
    { word: letterObj.word, illustrationKey: letterObj.illustrationKey },
  ];

  // 3 distinct pastel color palettes for the 3 example cards
  const CARD_THEMES = [
    {
      cardBg: "from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA]/60",
      border: "border-orange-300",
      borderB: "border-b-orange-400",
      sparkleColor: "text-amber-500",
      accent: "#EA580C",
    },
    {
      cardBg: "from-[#FEFCE8] via-[#FEF9C3] to-[#FEF08A]/60",
      border: "border-amber-300",
      borderB: "border-b-amber-400",
      sparkleColor: "text-yellow-600",
      accent: "#D97706",
    },
    {
      cardBg: "from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0]/60",
      border: "border-emerald-300",
      borderB: "border-b-emerald-400",
      sparkleColor: "text-emerald-600",
      accent: "#16A34A",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/50 backdrop-blur-sm select-none">
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
        className="max-w-2xl sm:max-w-3xl w-full max-h-[85vh] rounded-[2rem] bg-gradient-to-b from-sky-50 via-white to-amber-50/60 border-4 border-white shadow-2xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden relative"
      >
        {/* Top Gloss Highlight Line */}
        <div className="absolute top-1 inset-x-4 h-[1.5px] bg-white/80 rounded-full pointer-events-none" />

        {/* ── Modal Header Strip ───────────────────────────────── */}
        <div
          className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border-2 border-white/80 shadow-xs flex-shrink-0 relative overflow-visible"
          style={{
            background: `linear-gradient(135deg, ${letterObj.color}20 0%, ${letterObj.color}08 100%)`,
          }}
        >
          {/* Left: 3D Glossy Letter Tile, Phonetic Guide & Sequence Pill */}
          <div className="flex items-center gap-3">
            {/* 3D Letter Tile */}
            <div
              className="px-3 py-1.5 rounded-2xl flex items-baseline gap-1 shadow-sm border-2 border-white"
              style={{
                backgroundColor: `${letterObj.color}25`,
                boxShadow: `0 4px 0 ${letterObj.color}40`,
              }}
            >
              <span
                className="font-display font-black text-3xl sm:text-4xl leading-none drop-shadow-xs"
                style={{ color: letterObj.color }}
              >
                {letterObj.letter}
              </span>
              <span
                className="font-display font-bold text-2xl sm:text-3xl leading-none opacity-85 ml-0.5"
                style={{ color: letterObj.color }}
              >
                {letterObj.lowercase}
              </span>
            </div>

            {/* Phonetic guide & Sequence pill */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm sm:text-base text-[#1B4965] leading-tight">
                  Huruf {letterObj.letter}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/90 border border-slate-200 text-[10px] font-sans font-bold text-slate-600 shadow-2xs">
                  Huruf ke-{currentIndex + 1} dari 26
                </span>
              </div>
              <span className="font-sans font-semibold text-xs text-[#1B4965]/75 mt-0.5 leading-snug">
                Pelafalan: &ldquo;{letterObj.phonetic || letterObj.letter}&rdquo;
              </span>
            </div>
          </div>

          {/* Center-Right: Tika Peeking, Speaker Button & Close Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tika Cheerful Cutout Peeking Playfully */}
            <motion.img
              src="/assets/tika-maskot-1-cutout.png"
              alt="Tika Peeking"
              draggable="false"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="h-12 sm:h-14 w-auto object-contain object-bottom drop-shadow hidden sm:inline-block pointer-events-none select-none"
            />

            {/* Chunky Golden 3D "Bunyi Huruf" Speaker Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                clearTimers();
                playSfx("click");
                speakLetter(letterObj);
              }}
              aria-label={`Ulangi bunyi huruf ${letterObj.letter}`}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-b from-[#FEF3C7] to-[#FDE68A] border-b-4 border-[#D97706] text-[#92400E] font-display font-black text-xs sm:text-sm shadow-sm active:border-b-0 active:translate-y-1 cursor-pointer transition-transform"
            >
              <Volume2 size={16} className="text-[#B45309]" />
              <span className="hidden sm:inline">Bunyi Huruf</span>
            </motion.button>

            {/* Glossy Red 3D Circular Close Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              aria-label="Tutup jendela detail huruf"
              className="w-9 h-9 rounded-full bg-gradient-to-b from-rose-400 to-rose-600 hover:from-rose-500 hover:to-rose-700 border-b-2 border-rose-800 text-white flex items-center justify-center cursor-pointer transition-all shadow-sm"
            >
              <X size={18} strokeWidth={2.8} />
            </motion.button>
          </div>
        </div>

        {/* ── 3-Column Vibrant Pastel Example Word Cards ────────── */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 my-auto py-3 sm:py-4">
          {examples.map((ex, idx) => {
            const isHighlighted = activeHighlightIndex === idx;
            const initialLetter = ex.word.charAt(0);
            const remainingLetters = ex.word.slice(1);
            const theme = CARD_THEMES[idx % CARD_THEMES.length];

            return (
              <motion.button
                key={ex.word + idx}
                type="button"
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleWordClick(ex, idx)}
                aria-label={`Contoh kata ${ex.word}`}
                className={`group relative flex flex-col items-center justify-between p-2.5 sm:p-4 rounded-2xl border-3 cursor-pointer transition-all select-none bg-gradient-to-b ${theme.cardBg} ${theme.border} ${theme.borderB} border-b-6 shadow-sm hover:shadow-md ${
                  isHighlighted ? "ring-4 ring-amber-400 ring-offset-2 scale-103" : ""
                }`}
              >
                {/* Decorative Corner Sparkle */}
                <div className={`absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity ${theme.sparkleColor}`}>
                  <Sparkles size={12} className="text-amber-500" />
                </div>

                {/* Rounded Inner Illustration Frame */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center p-1 bg-white/80 rounded-2xl shadow-inner border border-white group-hover:scale-108 transition-transform">
                  <WordIllustration
                    illustrationKey={ex.illustrationKey}
                    word={ex.word}
                    color={letterObj.color}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Large Word Typography with Initial Letter Highlight */}
                <div className="mt-2 text-center">
                  <span className="font-display font-black text-lg sm:text-2xl lg:text-3xl leading-none drop-shadow-2xs">
                    <span style={{ color: letterObj.color }}>{initialLetter}</span>
                    <span className="text-[#1E293B]">{remainingLetters}</span>
                  </span>
                </div>

                {/* Tactile Dengar Audio Pill Button */}
                <div
                  className={`mt-2 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-sans font-extrabold transition-colors shadow-2xs ${
                    isHighlighted
                      ? "bg-[#1E293B] text-white"
                      : "bg-white/90 group-hover:bg-white text-slate-700 border border-slate-200"
                  }`}
                >
                  <Volume2 size={12} />
                  <span>Dengar</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ── Modal Footer: Prev / Dengarkan Semua / Next Controls ── */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-shrink-0 gap-2">
          {/* Previous Letter Button */}
          <motion.button
            type="button"
            disabled={currentIndex <= 0}
            whileHover={currentIndex > 0 ? { scale: 1.04, x: -2 } : {}}
            whileTap={currentIndex > 0 ? { scale: 0.96 } : {}}
            onClick={() => onNavigate(-1)}
            aria-label="Huruf Sebelumnya"
            className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-2xl font-display font-bold text-xs sm:text-sm shadow-2xs transition-all ${
              currentIndex > 0
                ? "bg-white hover:bg-slate-50 border-2 border-slate-200 text-[#1B4965] cursor-pointer"
                : "bg-slate-100 border-2 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Sebelumnya</span>
          </motion.button>

          {/* "Dengarkan Semua" Sequential Playback Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 1 }}
            onClick={handlePlayAllSequence}
            aria-label="Dengarkan nama huruf dan semua contoh kata secara berurutan"
            className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-2xl font-display font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all border-b-3 ${
              isSpeakingSequence
                ? "bg-gradient-to-b from-[#10B981] to-[#059669] text-white border-[#047857] animate-pulse"
                : "bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white border-[#0369A1]"
            }`}
          >
            <Play size={14} className="fill-current" />
            <span>{isSpeakingSequence ? "Memutar Suara..." : "Dengarkan Semua"}</span>
          </motion.button>

          {/* Next Letter Button */}
          <motion.button
            type="button"
            disabled={currentIndex >= 25}
            whileHover={currentIndex < 25 ? { scale: 1.04, x: 2 } : {}}
            whileTap={currentIndex < 25 ? { scale: 0.96 } : {}}
            onClick={() => onNavigate(1)}
            aria-label="Huruf Selanjutnya"
            className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-2xl font-display font-bold text-xs sm:text-sm shadow-2xs transition-all ${
              currentIndex < 25
                ? "bg-white hover:bg-slate-50 border-2 border-slate-200 text-[#1B4965] cursor-pointer"
                : "bg-slate-100 border-2 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
