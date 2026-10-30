// src/views/modules/MengenalHurufView.jsx
// SAKA TIKA: Ultimate Desktop Refactor for "Mengenal Huruf A-Z" (Wide Adventure Board & Object Illustrations)
// Strictly adheres to Global 3-Tier Height Budgeting:
// - 3x3 letter card grid container limited to max-h-[54vh] flex-1 min-h-0
// - Category tabs (A-I, J-R, S-Z) sit compactly in a slim header row
// - Mascot and sidebar target pills scale proportionally (h-24 to h-28) without overlapping board
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowLeft, Star, Volume2, Sparkles, Trophy } from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { ALPHABET_DATA } from "../../data/masterDataset.js";
import { speakLetter, speakWord } from "../../utils/speechEngine.js";
import GameLandscapeBackground from "../../components/background/GameLandscapeBackground.jsx";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";
import SakaMascot from "../../components/illustrations/SakaMascot.jsx";

// ── 3 Page Category Groups (3x3 Grid per page) ──────────────────────
const PAGE_GROUPS = [
  ALPHABET_DATA.slice(0, 9),   // Page 1: A — I (9 letters)
  ALPHABET_DATA.slice(9, 18),  // Page 2: J — R (9 letters)
  ALPHABET_DATA.slice(18, 26), // Page 3: S — Z (8 letters + 1 Celebration Card)
];

const TABS = [
  { label: "Huruf A — I", page: 0, gradient: "from-[#38BDF8] to-[#0284C7]", border: "border-[#0369A1]" },
  { label: "Huruf J — R", page: 1, gradient: "from-[#FBBF24] to-[#D97706]", border: "border-[#B45309]" },
  { label: "Huruf S — Z", page: 2, gradient: "from-[#34D399] to-[#059669]", border: "border-[#047857]" },
];

export default function MengenalHurufView() {
  const { navigateTo, addStars, discoverLetter, isLetterDiscovered, discoveredLetters } = useGame();
  const { playSfx } = useAudio();

  const [activePage, setActivePage] = useState(0);
  const [clickedLetter, setClickedLetter] = useState(null);
  const [isSakaJumping, setIsSakaJumping] = useState(false);

  // ── Letter Card Click Interaction ─────────────────────────────────
  const handleCardClick = useCallback(
    (letterObj) => {
      playSfx("click");
      setClickedLetter(letterObj);
      setIsSakaJumping(true);
      setTimeout(() => setIsSakaJumping(false), 700);

      // Acoustic pronunciation: speak letter, then example word
      speakLetter(letterObj);
      setTimeout(() => {
        speakWord(letterObj);
      }, 1000);

      // Discovery tracking & star progression
      const isNew = !isLetterDiscovered(letterObj.letter);
      if (isNew) {
        discoverLetter(letterObj.letter);
        addStars(1);

        const newTotal = discoveredLetters.length + 1;
        // Celebration milestones at 5, 13, and 26 letters
        if (newTotal === 5 || newTotal === 13 || newTotal === 26) {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.55 },
            colors: ["#F59E0B", "#10B981", "#3B82F6", "#EC4899", "#8B5CF6"],
          });
          playSfx("fanfare");
        }
      }
    },
    [playSfx, isLetterDiscovered, discoverLetter, addStars, discoveredLetters]
  );

  // ── Celebration Card Click (Slot 9 on Page 3) ──────────────────────
  const handleCelebrationClick = useCallback(() => {
    playSfx("fanfare");
    setIsSakaJumping(true);
    setTimeout(() => setIsSakaJumping(false), 800);
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.55 },
      colors: ["#F59E0B", "#E11D48", "#10B981", "#3B82F6", "#8B5CF6"],
    });
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

  const activeGroup = PAGE_GROUPS[activePage];

  return (
    <main className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none p-2 sm:p-3">
      {/* ── 1. Base Layer: Living Vector Landscape (Layer 0) ── */}
      <GameLandscapeBackground />

      {/* ── 2. Subtle Glassmorphism Contrast Tint ────────────── */}
      <div className="fixed inset-0 bg-sky-950/10 backdrop-blur-[0.5px] pointer-events-none z-0" />

      {/* ── 3. Open Widescreen Adventure Board ────────────────── */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col justify-between max-w-7xl w-full mx-auto my-auto">
        
        {/* ── "Papan Petualangan Huruf" Stage Container ───────── */}
        <div className="bg-white/88 backdrop-blur-md border-3 sm:border-4 border-white/95 shadow-2xl rounded-3xl p-2.5 sm:p-3.5 flex-1 min-h-0 max-h-[82vh] flex gap-2.5 sm:gap-4 overflow-hidden my-auto w-full">
          
          {/* ══════════════════════════════════════════════════════
              LEFT COLUMN: Compact Game Stage & Animated Mascot
             ══════════════════════════════════════════════════════ */}
          <aside className="w-44 sm:w-52 md:w-56 flex-shrink-0 flex flex-col justify-between overflow-hidden">
            
            {/* Top Area: Back Button, Header & Star Target Badge */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              
              {/* Back Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, y: 2 }}
                transition={{ type: "spring", stiffness: 450, damping: 16 }}
                onClick={() => {
                  playSfx("click");
                  navigateTo("/menu");
                }}
                aria-label="Kembali ke Menu Utama"
                className="flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#F1F5F9] border-b-3 border-[#CBD5E1] text-[#1B4965] font-display font-bold text-xs sm:text-sm shadow-xs active:border-b-0 cursor-pointer self-start"
              >
                <ArrowLeft size={14} className="text-[#1B4965]" />
                <span>Menu</span>
              </motion.button>

              {/* Title Header */}
              <div>
                <div className="flex items-center gap-1 text-[#0284C7] font-sans font-bold text-[10px] uppercase tracking-wider">
                  <Sparkles size={12} className="text-[#F59E0B]" />
                  <span>Petualangan Huruf</span>
                </div>
                <h1 className="font-display font-black text-lg sm:text-xl text-[#1B4965] leading-tight">
                  Mengenal Huruf A-Z
                </h1>
                <p className="font-sans font-medium text-[11px] text-[#1B4965]/70 mt-0.5 leading-snug line-clamp-1">
                  Sentuh kartu untuk melihat gambar dan bunyinya!
                </p>
              </div>

              {/* Golden Star Target Badge with Live Progress */}
              <div className="bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-2 border-[#F59E0B] rounded-2xl p-2 sm:p-2.5 shadow-xs flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-[#F59E0B] text-[#D97706]" />
                    <span className="font-display font-bold text-xs text-[#92400E]">
                      Target Bintang
                    </span>
                  </div>
                  <span className="font-display font-black text-xs text-[#B45309]">
                    {discoveredLetters.length} / 26
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-2 bg-[#FDE68A] rounded-full overflow-hidden p-0.5 border border-[#F59E0B]/30">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#F59E0B] to-[#10B981] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(discoveredLetters.length / 26) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                <p className="font-sans font-medium text-[10px] text-[#92400E]/80 leading-tight truncate">
                  {discoveredLetters.length === 26
                    ? "Semua 26 huruf telah kamu kuasai!"
                    : "Kumpulkan 26 Bintang Huruf!"}
                </p>
              </div>

            </div>

            {/* Bottom Area: Saka Mascot Scaled Proportionally (h-24 to h-28) */}
            <div className="relative flex flex-col items-center justify-end overflow-visible mt-auto pt-2 flex-shrink-0">
              
              {/* Dynamic Speech Bubble */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={clickedLetter ? clickedLetter.letter : "idle"}
                  initial={{ scale: 0.8, opacity: 0, y: 8 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: -6 }}
                  transition={{ type: "spring", stiffness: 450, damping: 20 }}
                  className="absolute -top-12 sm:-top-14 left-1/2 -translate-x-1/2 z-30 bg-white/95 border-2 border-[#1B4965]/20 rounded-2xl px-2.5 py-1 shadow-md w-[170px] sm:w-[190px] text-center pointer-events-none"
                >
                  <p className="font-sans font-bold text-[11px] text-[#1B4965] leading-snug">
                    {clickedLetter
                      ? `Huruf ${clickedLetter.letter} untuk ${clickedLetter.word}! Bunyinya '${clickedLetter.phonetic}'!`
                      : "Pilih hurufnya dan dengarkan bunyinya!"}
                  </p>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-[#1B4965]/20 rotate-45" />
                </motion.div>
              </AnimatePresence>

              {/* Saka Mascot (Height locked to h-24 sm:h-28) */}
              <motion.div
                animate={isSakaJumping ? { y: [-12, 0], scale: [1.06, 1] } : { y: [0, -4, 0] }}
                transition={
                  isSakaJumping
                    ? { duration: 0.45, type: "spring", stiffness: 450 }
                    : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                }
                className="origin-bottom"
              >
                <SakaMascot isWaving={true} className="w-20 h-24 sm:w-24 sm:h-28" />
              </motion.div>

              {/* Grassy Mound Vector Base */}
              <div className="w-24 sm:w-28 h-2.5 bg-[#4ADE80] rounded-full blur-[1px] opacity-70 -mt-1.5" />
            </div>

          </aside>

          {/* ══════════════════════════════════════════════════════
              RIGHT COLUMN: 3D Illustrated Toy Letter Cards (3x3 Grid)
             ══════════════════════════════════════════════════════ */}
          <section className="flex-1 min-h-0 overflow-hidden flex flex-col justify-between">
            
            {/* ── Playful Category Filter Ribbon (Slim Header Row) ── */}
            <div className="flex items-center justify-center gap-2 flex-shrink-0">
              {TABS.map((tab) => {
                const isActive = activePage === tab.page;
                return (
                  <motion.button
                    key={tab.page}
                    type="button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95, y: 1 }}
                    onClick={() => {
                      playSfx("hover");
                      setActivePage(tab.page);
                    }}
                    aria-label={`Buka halaman ${tab.label}`}
                    className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-2xl font-display font-bold text-xs sm:text-sm cursor-pointer transition-all ${
                      isActive
                        ? `bg-gradient-to-b ${tab.gradient} text-white border-b-3 ${tab.border} shadow-sm scale-105`
                        : "bg-white/85 text-[#1B4965] border-b-2 border-slate-300 hover:bg-white shadow-2xs"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* ── Card Grid Stage: max-h-[54vh] flex-1 min-h-0 ── */}
            <div className="flex-1 min-h-0 max-h-[54vh] overflow-hidden flex items-center justify-center gap-2 sm:gap-3 my-auto py-1">
              
              {/* Left Arrow Button Sprite (/assets/buttons/kiri.png) */}
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
                  className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 object-contain drop-shadow select-none pointer-events-none"
                  style={{ imageRendering: "-webkit-optimize-contrast" }}
                />
              </motion.button>

              {/* 3x3 Grid of Illustrated Letter Cards */}
              <div className="flex-1 min-h-0 overflow-hidden h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="grid grid-cols-3 gap-2 sm:gap-2.5 lg:gap-3 h-full content-center"
                  >
                    {activeGroup.map((letterObj) => {
                      const isDiscovered = isLetterDiscovered(letterObj.letter);
                      return (
                        <ToyLetterCard
                          key={letterObj.letter}
                          item={letterObj}
                          isDiscovered={isDiscovered}
                          onClick={() => handleCardClick(letterObj)}
                          onHover={() => playSfx("hover")}
                        />
                      );
                    })}

                    {/* Slot 9 on Page 3: Special Celebration Reward Card */}
                    {activePage === 2 && (
                      <CelebrationRewardCard
                        discoveredCount={discoveredLetters.length}
                        onClick={handleCelebrationClick}
                        onHover={() => playSfx("hover")}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Arrow Button Sprite (/assets/buttons/kanan.png) */}
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
                  className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 object-contain drop-shadow select-none pointer-events-none"
                  style={{ imageRendering: "-webkit-optimize-contrast" }}
                />
              </motion.button>

            </div>

            {/* ── 3 Candy Indicator Dots ───────────────────────── */}
            <div className="flex items-center justify-center gap-2 flex-shrink-0 z-20 mt-1">
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

          </section>

        </div>

      </div>
    </main>
  );
}

// ── 3D Illustrated Toy Letter Card Component ────────────────────────
function ToyLetterCard({ item, isDiscovered, onClick, onHover }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.95, y: 1 }}
      transition={{ type: "spring", stiffness: 450, damping: 18 }}
      onMouseEnter={onHover}
      onClick={onClick}
      aria-label={`Huruf ${item.letter} untuk ${item.word}`}
      className="relative overflow-hidden group rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex items-center justify-between shadow-xs hover:shadow-md cursor-pointer select-none transition-all"
      style={{
        backgroundColor: `${item.color}15`,
        borderBottom: `4px solid ${item.color}`,
        borderTop: "1px solid rgba(255,255,255,0.7)",
        borderLeft: "1px solid rgba(255,255,255,0.7)",
        borderRight: "1px solid rgba(255,255,255,0.7)",
      }}
    >
      {/* Top Gloss Light Reflex Line */}
      <div className="absolute top-1 inset-x-2 h-[1px] bg-white/70 rounded-full pointer-events-none" />

      {/* Diagonal Shimmer Highlight on Hover */}
      <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none group-hover:animate-shimmer" />

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

      {/* Right Section: Vector Object Illustration */}
      <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-13 lg:h-13 flex-shrink-0 flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform drop-shadow-xs z-10">
        <WordIllustration
          illustrationKey={item.illustrationKey}
          word={item.word}
          color={item.color}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Top-Right Badge: Star or Volume Speaker */}
      <div className="absolute top-1 right-1 z-20">
        {isDiscovered ? (
          <div className="w-4 h-4 rounded-full bg-[#FEF3C7] border border-[#F59E0B] flex items-center justify-center shadow-2xs">
            <Star size={10} className="fill-[#F59E0B] text-[#D97706]" />
          </div>
        ) : (
          <div className="w-4 h-4 rounded-full bg-white/70 flex items-center justify-center text-[#1B4965]/40 group-hover:text-[#1B4965]/80 transition-colors">
            <Volume2 size={10} />
          </div>
        )}
      </div>
    </motion.button>
  );
}

// ── Milestone Reward Celebration Card (Page 3, Slot 9) ──────────────
function CelebrationRewardCard({ discoveredCount, onClick, onHover }) {
  const isAllComplete = discoveredCount >= 26;

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.95, y: 1 }}
      transition={{ type: "spring", stiffness: 450, damping: 18 }}
      onMouseEnter={onHover}
      onClick={onClick}
      aria-label="Pesta Perayaan Bintang Huruf"
      className="relative overflow-hidden group rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex items-center justify-between shadow-xs hover:shadow-md cursor-pointer select-none bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-b-4 border-[#F59E0B] border-t border-l border-r border-white/80"
    >
      <div className="absolute top-1 inset-x-2 h-[1px] bg-white/70 rounded-full pointer-events-none" />
      <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none group-hover:animate-shimmer" />

      <div className="flex flex-col items-start justify-center z-10 pr-1">
        <span className="font-display font-black text-sm sm:text-base lg:text-lg text-[#B45309] leading-tight">
          {isAllComplete ? "Hebat!" : "Ayo Temukan!"}
        </span>
        <span className="font-sans font-bold text-[10px] text-[#92400E] mt-0.5 leading-tight">
          {isAllComplete ? "26 Huruf Selesai" : `${discoveredCount}/26 Bintang`}
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
