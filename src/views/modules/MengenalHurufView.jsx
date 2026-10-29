// src/views/modules/MengenalHurufView.jsx
// SAKA TIKA: Ultimate Desktop Refactor for "Mengenal Huruf A-Z" (Wide Adventure Board & Object Illustrations)
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
    <main className="relative flex-1 overflow-hidden flex flex-col justify-between select-none p-2 sm:p-4 md:p-6">
      {/* ── 1. Base Layer: Living Vector Landscape ───────────── */}
      <GameLandscapeBackground />

      {/* ── 2. Subtle Glassmorphism Contrast Tint ────────────── */}
      <div className="absolute inset-0 bg-sky-950/10 backdrop-blur-[1px] pointer-events-none z-10" />

      {/* ── 3. Open Widescreen Adventure Board ────────────────── */}
      <div className="relative z-20 flex-1 overflow-hidden flex flex-col justify-between max-w-7xl w-full mx-auto">
        
        {/* ── "Papan Petualangan Huruf" Stage Container ───────── */}
        <div className="bg-white/88 backdrop-blur-md border-4 border-white/95 shadow-2xl rounded-3xl p-3 sm:p-4 lg:p-5 flex-1 flex gap-3 sm:gap-5 overflow-hidden my-auto">
          
          {/* ══════════════════════════════════════════════════════
              LEFT COLUMN: Compact Game Stage & Animated Mascot
             ══════════════════════════════════════════════════════ */}
          <aside className="w-52 sm:w-60 md:w-64 flex-shrink-0 flex flex-col justify-between overflow-hidden">
            
            {/* Top Area: Back Button, Header & Star Target Badge */}
            <div className="flex flex-col gap-2.5 sm:gap-3 flex-shrink-0">
              
              {/* 3D Chunky Candy Button: Kembali ke Menu */}
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
                className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#F1F5F9] border-b-4 border-[#CBD5E1] text-[#1B4965] font-display font-bold text-xs sm:text-sm shadow-md active:border-b-0 cursor-pointer self-start"
              >
                <ArrowLeft size={16} className="text-[#1B4965]" />
                <span>Kembali ke Menu</span>
              </motion.button>

              {/* Title Header */}
              <div>
                <div className="flex items-center gap-1.5 text-[#0284C7] font-sans font-bold text-[11px] uppercase tracking-wider">
                  <Sparkles size={14} className="text-[#F59E0B]" />
                  <span>Petualangan Huruf</span>
                </div>
                <h1 className="font-display font-black text-xl sm:text-2xl text-[#1B4965] leading-tight">
                  Mengenal Huruf A-Z
                </h1>
                <p className="font-sans font-medium text-xs text-[#1B4965]/70 mt-0.5 leading-snug">
                  Sentuh kartu untuk melihat gambar dan mendengar bunyinya!
                </p>
              </div>

              {/* Sleek Golden Star Target Badge with Live Progress */}
              <div className="bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-2 border-[#F59E0B] rounded-2xl p-2.5 sm:p-3 shadow-sm flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star size={16} className="fill-[#F59E0B] text-[#D97706]" />
                    <span className="font-display font-bold text-xs sm:text-sm text-[#92400E]">
                      Target Bintang
                    </span>
                  </div>
                  <span className="font-display font-black text-xs sm:text-sm text-[#B45309]">
                    {discoveredLetters.length} / 26
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-2.5 bg-[#FDE68A] rounded-full overflow-hidden p-0.5 border border-[#F59E0B]/30">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#F59E0B] to-[#10B981] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(discoveredLetters.length / 26) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                <p className="font-sans font-medium text-[11px] text-[#92400E]/80 leading-tight">
                  {discoveredLetters.length === 26
                    ? "Luar biasa! Semua 26 huruf telah kamu kuasai!"
                    : "Kumpulkan 26 Bintang Huruf!"}
                </p>
              </div>

            </div>

            {/* Bottom Area: Saka Mascot on Grassy Mound with Speech Bubble */}
            <div className="relative flex flex-col items-center justify-end overflow-visible mt-auto pt-4 flex-shrink-0">
              
              {/* Dynamic Speech Bubble */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={clickedLetter ? clickedLetter.letter : "idle"}
                  initial={{ scale: 0.8, opacity: 0, y: 8 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: -6 }}
                  transition={{ type: "spring", stiffness: 450, damping: 20 }}
                  className="absolute -top-12 sm:-top-14 left-1/2 -translate-x-1/2 z-30 bg-white/95 border-2 border-[#1B4965]/20 rounded-2xl px-3 py-1.5 shadow-lg w-[190px] sm:w-[220px] text-center pointer-events-none"
                >
                  <p className="font-sans font-bold text-xs text-[#1B4965] leading-snug">
                    {clickedLetter
                      ? `Huruf ${clickedLetter.letter} untuk ${clickedLetter.word}! Bunyinya '${clickedLetter.phonetic}'!`
                      : "Pilih hurufnya dan dengarkan bunyinya!"}
                  </p>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-[#1B4965]/20 rotate-45" />
                </motion.div>
              </AnimatePresence>

              {/* Saka Mascot with Idle Waving & Jump Animation */}
              <motion.div
                animate={isSakaJumping ? { y: [-14, 0], scale: [1.06, 1] } : { y: [0, -4, 0] }}
                transition={
                  isSakaJumping
                    ? { duration: 0.45, type: "spring", stiffness: 450 }
                    : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                }
                className="scale-80 sm:scale-90 origin-bottom"
              >
                <SakaMascot isWaving={true} />
              </motion.div>

              {/* Grassy Mound Vector Base */}
              <div className="w-32 sm:w-36 h-3 bg-[#4ADE80] rounded-full blur-[1px] opacity-70 -mt-2" />
            </div>

          </aside>

          {/* ══════════════════════════════════════════════════════
              RIGHT COLUMN: 3D Illustrated Toy Letter Cards (3x3 Grid)
             ══════════════════════════════════════════════════════ */}
          <section className="flex-1 overflow-hidden flex flex-col justify-between">
            
            {/* ── Playful Category Filter Ribbon ──────────────── */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-shrink-0">
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
                    className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-2xl font-display font-bold text-xs sm:text-sm cursor-pointer transition-all ${
                      isActive
                        ? `bg-gradient-to-b ${tab.gradient} text-white border-b-4 ${tab.border} shadow-md scale-105`
                        : "bg-white/85 text-[#1B4965] border-b-3 border-slate-300 hover:bg-white shadow-xs"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* ── Card Grid Stage with Real Client Arrow Controls ── */}
            <div className="flex-1 overflow-hidden flex items-center justify-center gap-2 sm:gap-3 my-auto py-1">
              
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
                  className="w-11 h-11 sm:w-13 sm:h-13 lg:w-14 lg:h-14 object-contain drop-shadow select-none pointer-events-none"
                  style={{ imageRendering: "-webkit-optimize-contrast" }}
                />
              </motion.button>

              {/* 3x3 Grid of Illustrated Letter Cards */}
              <div className="flex-1 overflow-hidden h-full max-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-3.5 h-full content-center"
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
                  className="w-11 h-11 sm:w-13 sm:h-13 lg:w-14 lg:h-14 object-contain drop-shadow select-none pointer-events-none"
                  style={{ imageRendering: "-webkit-optimize-contrast" }}
                />
              </motion.button>

            </div>

            {/* ── 3 Candy Indicator Dots ───────────────────────── */}
            <div className="flex items-center justify-center gap-2.5 flex-shrink-0 z-20">
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
                        ? "w-8 sm:w-9 h-3 bg-[#F59E0B] border-2 border-white shadow-md"
                        : "w-3 h-3 bg-white/70 hover:bg-white border border-[#1B4965]/20 shadow-xs"
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
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.94, y: 2 }}
      transition={{ type: "spring", stiffness: 450, damping: 18 }}
      onMouseEnter={onHover}
      onClick={onClick}
      aria-label={`Huruf ${item.letter} untuk ${item.word}`}
      className="relative overflow-hidden group rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 flex items-center justify-between shadow-md hover:shadow-xl cursor-pointer select-none transition-all"
      style={{
        backgroundColor: `${item.color}15`,
        borderBottom: `6px solid ${item.color}`,
        borderTop: "1px solid rgba(255,255,255,0.7)",
        borderLeft: "1px solid rgba(255,255,255,0.7)",
        borderRight: "1px solid rgba(255,255,255,0.7)",
      }}
    >
      {/* Top Gloss Light Reflex Line */}
      <div className="absolute top-1 inset-x-3 h-[1.5px] bg-white/70 rounded-full pointer-events-none" />

      {/* Diagonal Shimmer Highlight on Hover */}
      <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none group-hover:animate-shimmer" />

      {/* Left Section: Alphabet Glyphs & Noun Word */}
      <div className="flex flex-col items-start justify-center z-10 min-w-0 pr-1">
        <div className="flex items-baseline">
          <span
            className="font-display font-black text-2xl sm:text-3xl lg:text-4xl leading-none drop-shadow-xs"
            style={{ color: item.color }}
          >
            {item.letter}
          </span>
          <span
            className="font-display font-bold text-lg sm:text-xl lg:text-2xl opacity-80 ml-0.5 leading-none"
            style={{ color: item.color }}
          >
            {item.lowercase}
          </span>
        </div>
        <span className="font-sans font-bold text-xs sm:text-sm text-[#1B4965] mt-0.5 leading-tight truncate">
          {item.word}
        </span>
      </div>

      {/* Right Section: Vector Object Illustration */}
      <div className="w-11 h-11 sm:w-13 sm:h-13 lg:w-16 lg:h-16 flex-shrink-0 flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform drop-shadow-xs z-10">
        <WordIllustration
          illustrationKey={item.illustrationKey}
          word={item.word}
          color={item.color}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Top-Right Badge: Star or Volume Speaker */}
      <div className="absolute top-1.5 right-1.5 z-20">
        {isDiscovered ? (
          <div className="w-5 h-5 rounded-full bg-[#FEF3C7] border border-[#F59E0B] flex items-center justify-center shadow-xs">
            <Star size={11} className="fill-[#F59E0B] text-[#D97706]" />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full bg-white/70 flex items-center justify-center text-[#1B4965]/40 group-hover:text-[#1B4965]/80 transition-colors">
            <Volume2 size={11} />
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
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.94, y: 2 }}
      transition={{ type: "spring", stiffness: 450, damping: 18 }}
      onMouseEnter={onHover}
      onClick={onClick}
      aria-label="Pesta Perayaan Bintang Huruf"
      className="relative overflow-hidden group rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 flex items-center justify-between shadow-md hover:shadow-xl cursor-pointer select-none bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-b-6 border-[#F59E0B] border-t border-l border-r border-white/80"
    >
      <div className="absolute top-1 inset-x-3 h-[1.5px] bg-white/70 rounded-full pointer-events-none" />
      <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none group-hover:animate-shimmer" />

      <div className="flex flex-col items-start justify-center z-10 pr-1">
        <span className="font-display font-black text-lg sm:text-xl lg:text-2xl text-[#B45309] leading-tight">
          {isAllComplete ? "Hebat!" : "Ayo Temukan!"}
        </span>
        <span className="font-sans font-bold text-xs text-[#92400E] mt-0.5 leading-tight">
          {isAllComplete ? "26 Huruf Selesai" : `${discoveredCount}/26 Bintang`}
        </span>
      </div>

      <div className="w-11 h-11 sm:w-13 sm:h-13 lg:w-16 lg:h-16 flex-shrink-0 flex items-center justify-center group-hover:scale-115 transition-transform drop-shadow-xs z-10 text-[#F59E0B]">
        <Trophy size={32} className="fill-[#FEF3C7] stroke-[#D97706] stroke-2" />
      </div>

      <div className="absolute top-1.5 right-1.5 z-20">
        <div className="w-5 h-5 rounded-full bg-[#F59E0B] flex items-center justify-center text-white shadow-xs">
          <Star size={11} className="fill-current" />
        </div>
      </div>
    </motion.button>
  );
}
