// src/views/modules/MenulisHurufView.jsx
// SAKA TIKA: Clean-Slate Rebuild of "Menulis Huruf Latihan Goresan A - Z"
// Centered 16:9 Warm Wooden Easel Frame, Real Client Button Sprites (kiri.png, kanan.png),
// Persistent Living Nature Background, Saka Cheerleader Mascot & Tactile Control Dock.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, RotateCcw, Star } from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { ALPHABET_DATA } from "../../data/masterDataset.js";
import { speakLetter, speakWord } from "../../utils/speechEngine.js";
import LetterCanvas from "../../components/canvas/LetterCanvas.jsx";
import SakaMascot from "../../components/illustrations/SakaMascot.jsx";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";
import GameLandscapeBackground from "../../components/background/GameLandscapeBackground.jsx";

export default function MenulisHurufView() {
  const { navigateTo } = useGame();
  const { playSfx } = useAudio();

  const ribbonRef = useRef(null);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [completedLetters, setCompletedLetters] = useState(() => {
    try {
      const stored = localStorage.getItem("saka_tika_written");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [accuracy, setAccuracy] = useState(0);
  const [isSakaJumping, setIsSakaJumping] = useState(false);
  const [speechBubbleText, setSpeechBubbleText] = useState(
    "Tebalkan garisnya pelan-pelan ya!"
  );

  const letterObj = ALPHABET_DATA[selectedIdx];

  // Auto-scroll the active letter into the center of the ribbon
  useEffect(() => {
    if (ribbonRef.current) {
      const activeEl = ribbonRef.current.children[selectedIdx];
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
    setAccuracy(0);
    setSpeechBubbleText(`Ayo tebalkan huruf ${letterObj.letter}!`);
  }, [selectedIdx, letterObj.letter]);

  // Navigation handlers
  const handleSelectLetter = (idx) => {
    playSfx("click");
    setSelectedIdx(idx);
  };

  const handleNextLetter = useCallback(() => {
    playSfx("hover");
    setSelectedIdx((prev) => (prev < ALPHABET_DATA.length - 1 ? prev + 1 : 0));
  }, [playSfx]);

  const handlePrevLetter = useCallback(() => {
    playSfx("hover");
    setSelectedIdx((prev) => (prev > 0 ? prev - 1 : ALPHABET_DATA.length - 1));
  }, [playSfx]);

  // Explicit audio triggers (Strictly user-gated, zero autoplay on mount)
  const handleSpeakLetter = () => {
    playSfx("click");
    speakLetter(letterObj);
    setSpeechBubbleText(`Huruf ${letterObj.letter}, dibaca '${letterObj.phonetic}'!`);
  };

  const handleSpeakWord = () => {
    playSfx("click");
    speakWord(letterObj);
    setSpeechBubbleText(`${letterObj.letter} untuk ${letterObj.word}!`);
  };

  // Manual Sponge/Eraser button handler
  const handleEraserClick = () => {
    playSfx("click");
    setResetTrigger((prev) => prev + 1);
    setAccuracy(0);
    setSpeechBubbleText("Kanvas sudah bersih, ayo mulai lagi!");
  };

  const handleProgressUpdate = useCallback((p) => {
    setAccuracy(p);
  }, []);

  const handleStrokeUpdate = useCallback(() => {
    setSpeechBubbleText("Bagus sekali! Gores terus garisnya!");
  }, []);

  // Completion callback
  const handleLetterCompleted = useCallback((letter) => {
    setCompletedLetters((prev) => {
      if (!prev.includes(letter)) {
        const updated = [...prev, letter];
        try {
          localStorage.setItem("saka_tika_written", JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      }
      return prev;
    });
    setIsSakaJumping(true);
    setSpeechBubbleText(`Hebat sekali! Huruf ${letter} sudah selesai!`);
    setTimeout(() => setIsSakaJumping(false), 900);
  }, []);

  return (
    <main className="relative flex-1 overflow-hidden flex flex-col justify-between select-none p-2 sm:p-4">
      {/* ── 1. Persistent Living Vector Landscape ────────────── */}
      <GameLandscapeBackground />

      {/* ── 2. Subtle Glassmorphism Contrast Tint ────────────── */}
      <div className="absolute inset-0 bg-sky-950/10 backdrop-blur-[1px] pointer-events-none z-10" />

      {/* ── 3. Widescreen Magic Wooden Easel Workspace ────────── */}
      <div className="relative z-20 flex-1 overflow-hidden flex flex-col justify-between max-w-7xl w-full mx-auto">
        
        {/* ── Top Bar: Back Button, Alphabet Carousel & Star Counter ── */}
        <header className="flex items-center justify-between gap-2 sm:gap-4 w-full flex-shrink-0 mb-1.5 sm:mb-2">
          
          {/* Back to Menu 3D Candy Button */}
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
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#F1F5F9] border-b-4 border-[#CBD5E1] text-[#1B4965] font-display font-bold text-xs sm:text-sm shadow-md active:border-b-0 cursor-pointer flex-shrink-0"
          >
            <ArrowLeft size={16} className="text-[#1B4965]" />
            <span>Kembali ke Menu</span>
          </motion.button>

          {/* Center: Sliding Alphabet Carousel Ribbon */}
          <div className="flex-1 max-w-2xl flex items-center justify-center gap-1.5 sm:gap-2">
            
            {/* Real Client Sprite Left Arrow (kiri.png) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.15, rotate: -4 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: "spring", stiffness: 450, damping: 16 }}
              onClick={handlePrevLetter}
              aria-label="Huruf Sebelumnya"
              className="p-0 bg-transparent border-0 outline-none cursor-pointer flex-shrink-0"
            >
              <img
                src="/assets/buttons/kiri.png"
                alt="Sebelumnya"
                draggable="false"
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow select-none pointer-events-none"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </motion.button>

            {/* A-Z Carousel Window */}
            <div
              ref={ribbonRef}
              className="flex-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex items-center gap-1.5 px-2 py-1 bg-white/70 backdrop-blur-md rounded-2xl border-2 border-white/90 shadow-sm"
            >
              {ALPHABET_DATA.map((item, idx) => {
                const isSelected = idx === selectedIdx;
                const isDone = completedLetters.includes(item.letter);

                return (
                  <motion.button
                    key={item.letter}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleSelectLetter(idx)}
                    aria-label={`Pilih huruf ${item.letter}`}
                    className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-display text-xs sm:text-sm flex items-center justify-center relative cursor-pointer transition-all ${
                      isSelected
                        ? "shadow-md scale-110 z-10 text-white font-black border-b-[3px]"
                        : "bg-white/80 text-[#1B4965] border-b-2 border-slate-200 hover:bg-white font-bold"
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: item.color,
                            borderColor: item.color,
                          }
                        : {}
                    }
                  >
                    {item.letter}
                    {isDone && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FEF3C7] border border-[#F59E0B] flex items-center justify-center shadow-xs">
                        <Star size={9} className="fill-[#F59E0B] text-[#D97706]" />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Real Client Sprite Right Arrow (kanan.png) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.15, rotate: 4 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: "spring", stiffness: 450, damping: 16 }}
              onClick={handleNextLetter}
              aria-label="Huruf Selanjutnya"
              className="p-0 bg-transparent border-0 outline-none cursor-pointer flex-shrink-0"
            >
              <img
                src="/assets/buttons/kanan.png"
                alt="Selanjutnya"
                draggable="false"
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow select-none pointer-events-none"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </motion.button>

          </div>

          {/* Right: Golden Star Completion Badge */}
          <div className="bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-2 border-[#F59E0B] rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm flex items-center gap-1.5 flex-shrink-0">
            <Star size={16} className="fill-[#F59E0B] text-[#D97706]" />
            <span className="font-display font-bold text-xs sm:text-sm text-[#92400E]">
              {completedLetters.length} / 26
            </span>
          </div>

        </header>

        {/* ── Main Stage: Left Cheerleader, Wooden Easel & Right Dock ── */}
        <div className="flex-1 overflow-hidden flex gap-2 sm:gap-4 items-stretch my-auto">
          
          {/* ══════════════════════════════════════════════════════
              LEFT COLUMN: Cheerleader Saka on Grassy Mound
             ══════════════════════════════════════════════════════ */}
          <aside className="w-40 sm:w-48 lg:w-56 flex-shrink-0 flex flex-col justify-end items-center overflow-visible pb-1">
            
            {/* Dynamic Speech Bubble */}
            <AnimatePresence mode="wait">
              <motion.div
                key={speechBubbleText}
                initial={{ scale: 0.8, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -6 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="bg-white/95 border-2 border-[#1B4965]/20 rounded-2xl px-3 py-1.5 sm:py-2 shadow-lg w-[160px] sm:w-[190px] text-center mb-2 pointer-events-none relative z-30"
              >
                <p className="font-sans font-bold text-xs text-[#1B4965] leading-snug">
                  {speechBubbleText}
                </p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-r-2 border-b-2 border-[#1B4965]/20 rotate-45" />
              </motion.div>
            </AnimatePresence>

            {/* Saka Mascot with Idle & Completion Jump Animation */}
            <motion.div
              animate={isSakaJumping ? { y: [-16, 0], scale: [1.08, 1] } : { y: [0, -4, 0] }}
              transition={
                isSakaJumping
                  ? { duration: 0.45, type: "spring", stiffness: 450 }
                  : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
              }
              className="scale-80 sm:scale-90 lg:scale-95 origin-bottom"
            >
              <SakaMascot isWaving={true} />
            </motion.div>

            {/* Grassy Mound Vector Base */}
            <div className="w-28 sm:w-36 h-3 bg-[#4ADE80] rounded-full blur-[1px] opacity-75 -mt-2" />

          </aside>

          {/* ══════════════════════════════════════════════════════
              CENTER COLUMN: "Papan Tulis Kayu Ajaib" (Magic Wooden Easel)
             ══════════════════════════════════════════════════════ */}
          <section className="flex-1 overflow-hidden flex flex-col items-center justify-center relative">
            
            {/* Wooden Easel Outer Frame */}
            <div className="relative w-full h-full max-h-[540px] rounded-3xl p-2.5 sm:p-3.5 bg-gradient-to-b from-[#D49B6A] via-[#C88E59] to-[#9A5F32] border-4 border-[#8D5B2F] border-b-[8px] sm:border-b-[10px] border-b-[#5C3818] shadow-2xl flex flex-col justify-between">
              {/* Top Gloss Light Reflex */}
              <div className="absolute top-1.5 inset-x-6 h-[2px] bg-white/40 rounded-full pointer-events-none" />

              {/* Wooden Stand Pegs Anchored Below */}
              <div className="absolute -bottom-5 sm:-bottom-7 left-1/4 w-4 sm:w-6 h-6 sm:h-8 bg-gradient-to-r from-[#8D5B2F] to-[#5C3818] rounded-b-lg shadow-md -z-10" />
              <div className="absolute -bottom-5 sm:-bottom-7 right-1/4 w-4 sm:w-6 h-6 sm:h-8 bg-gradient-to-r from-[#8D5B2F] to-[#5C3818] rounded-b-lg shadow-md -z-10" />

              {/* Cream Parchment Tracing Surface Hosting Dual-Layer Canvas Engine */}
              <div className="flex-1 w-full h-full rounded-2xl overflow-hidden relative border-2 border-[#E7D7C1] shadow-inner bg-gradient-to-b from-[#FFFFFF] to-[#FBF8F1]">
                <LetterCanvas
                  letterObj={letterObj}
                  onNextLetter={handleNextLetter}
                  hasNextLetter={selectedIdx < ALPHABET_DATA.length - 1}
                  onProgressUpdate={handleProgressUpdate}
                  onStrokeUpdate={handleStrokeUpdate}
                  onLetterCompleted={handleLetterCompleted}
                  resetTrigger={resetTrigger}
                />
              </div>

            </div>

          </section>

          {/* ══════════════════════════════════════════════════════
              RIGHT COLUMN: Reference Card & Tactile Control Dock
             ══════════════════════════════════════════════════════ */}
          <aside className="w-28 sm:w-32 lg:w-36 flex-shrink-0 flex flex-col justify-between items-center py-1 gap-2 overflow-hidden">
            
            {/* ── 1. Object Illustration Reference Card ─────────── */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSpeakWord}
              aria-label={`Dengarkan contoh kata ${letterObj.word}`}
              className="w-full bg-white/92 border-2 border-stone-200 border-b-4 rounded-2xl p-2 sm:p-2.5 shadow-md flex flex-col items-center justify-center cursor-pointer group"
              style={{ borderBottomColor: letterObj.color }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform">
                <WordIllustration
                  illustrationKey={letterObj.illustrationKey}
                  word={letterObj.word}
                  color={letterObj.color}
                  className="w-full h-full object-contain drop-shadow-xs"
                />
              </div>

              <span className="font-display font-black text-xs sm:text-sm text-[#1B4965] mt-1 leading-tight truncate">
                {letterObj.word}
              </span>
              <span className="font-sans text-xs text-[#1B4965]/60 mt-0.5">
                Sentuh Gambar
              </span>
            </motion.button>

            {/* ── 2. Voice Hint Button (Volume2) ────────────────── */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleSpeakLetter}
              aria-label={`Dengarkan bunyi huruf ${letterObj.letter}`}
              className="w-full py-2 px-2.5 rounded-2xl bg-gradient-to-b from-[#38BDF8] to-[#0284C7] border-b-4 border-[#0369A1] text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:border-b-0"
            >
              <Volume2 size={16} />
              <span className="font-display font-bold text-xs">Suara</span>
            </motion.button>

            {/* ── 3. Tactile Sponge/Eraser Button (Hapus) ────────── */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleEraserClick}
              aria-label="Hapus dan bersihkan kanvas"
              className="w-full py-2 px-2.5 rounded-2xl bg-gradient-to-b from-[#FDE047] to-[#F59E0B] border-b-4 border-[#B45309] text-[#78350F] shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:border-b-0"
            >
              <RotateCcw size={15} />
              <span className="font-display font-bold text-xs">Hapus</span>
            </motion.button>

          </aside>

        </div>

      </div>
    </main>
  );
}
