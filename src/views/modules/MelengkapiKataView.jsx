// src/views/modules/MelengkapiKataView.jsx
// SAKA TIKA: Visual Overhaul for "Melengkapi Kata" (Mini-Game 3)
// Expansive 3D Wooden Toy Puzzle Tray with Rounded-Square Letter Blocks,
// Decluttered Single Floating Pill Target Banner, Absolute Celebration Toast (Zero Vertical Squashing),
// Harmonized Playmate Mascot Positioning (Saka & Tika Close to Table),
// Strict Zero-Scrollbar Lock, Zero Emojis, and Mandatory 2.2s Completion Hold.

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Volume2,
  Star,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Check,
  Lightbulb,
} from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { speakWord, speakInstruction } from "../../utils/speechEngine.js";
import { GAME_SAMPLES_50 } from "../../data/masterDataset.js";
import {
  playXylophoneNote,
  playRubberBoingSound,
  playHoverSound,
  playSuccessSound,
  playFanfareSound,
} from "../../utils/soundSynthesizer.js";
import { ShuffleQueue } from "../../utils/shuffleQueue.js";
import GameLandscapeBackground from "../../components/background/GameLandscapeBackground.jsx";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";
import SakaMascot from "../../components/illustrations/SakaMascot.jsx";
import TikaMascot from "../../components/illustrations/TikaMascot.jsx";

// 4 vibrant chunky 3D square toy block palettes with thick tactile bottom borders
const TOY_CHOICE_PALETTES = [
  {
    theme: "sky",
    bg: "from-sky-300 via-sky-400 to-blue-500",
    border: "border-sky-200 border-b-blue-700",
    text: "#FFFFFF",
    glow: "shadow-sky-300/40",
  },
  {
    theme: "amber",
    bg: "from-amber-300 via-amber-400 to-orange-500",
    border: "border-amber-200 border-b-orange-700",
    text: "#FFFFFF",
    glow: "shadow-amber-300/40",
  },
  {
    theme: "emerald",
    bg: "from-emerald-300 via-emerald-400 to-teal-500",
    border: "border-emerald-200 border-b-teal-700",
    text: "#FFFFFF",
    glow: "shadow-emerald-300/40",
  },
  {
    theme: "rose",
    bg: "from-rose-300 via-pink-400 to-rose-500",
    border: "border-rose-200 border-b-rose-700",
    text: "#FFFFFF",
    glow: "shadow-rose-300/40",
  },
];

// Helper to generate 3 unique random distractors
function generateDistractors(targetLetter) {
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const available = allLetters.filter((l) => l !== targetLetter.toUpperCase());
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

export default function MelengkapiKataView() {
  const { navigateTo, addStars } = useGame();
  const { playSfx } = useAudio();

  // Task 1: Non-deterministic shuffle queue initialization (Never starts predictably on index 0 / Apel)
  const shuffleQueueRef = useRef(null);
  if (!shuffleQueueRef.current) {
    shuffleQueueRef.current = new ShuffleQueue(GAME_SAMPLES_50.length);
  }

  const [currentIndex, setCurrentIndex] = useState(() => shuffleQueueRef.current.next());
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wobbleLetter, setWobbleLetter] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [scoreStreak, setScoreStreak] = useState(0);
  const [isSakaJumping, setIsSakaJumping] = useState(false);
  const [isTikaJumping, setIsTikaJumping] = useState(false);
  const [speechBubbleText, setSpeechBubbleText] = useState("");

  const autoAdvanceTimer = useRef(null);

  // Active question data from master dataset
  const currentItem = useMemo(() => {
    return GAME_SAMPLES_50[currentIndex % GAME_SAMPLES_50.length];
  }, [currentIndex]);

  // Word broken down into individual uppercase characters
  const wordChars = useMemo(() => {
    return currentItem.word.toUpperCase().split("");
  }, [currentItem]);

  // Determine missing letter index
  const missingIndex = useMemo(() => {
    const idx = currentItem.missingIndex ?? 0;
    return idx >= 0 && idx < wordChars.length ? idx : 0;
  }, [currentItem, wordChars.length]);

  // Target missing letter in uppercase
  const targetLetter = useMemo(() => {
    return wordChars[missingIndex] || currentItem.targetLetter.toUpperCase();
  }, [wordChars, missingIndex, currentItem]);

  // 4 Option blocks: 1 target + 3 distractors, shuffled
  const options = useMemo(() => {
    let distractors = currentItem.distractors;
    if (!distractors || distractors.some((d) => d === "?")) {
      distractors = generateDistractors(targetLetter);
    }
    const combined = [targetLetter, ...distractors.map((d) => d.toUpperCase())];
    const uniqueOptions = [...new Set(combined)].slice(0, 4);

    while (uniqueOptions.length < 4) {
      const extra = generateDistractors(targetLetter)[0];
      if (!uniqueOptions.includes(extra)) uniqueOptions.push(extra);
    }

    return uniqueOptions.sort(() => 0.5 - Math.random());
  }, [currentItem, targetLetter]);

  // Reset state on question change — STRICT ZERO AUTO-PLAY (No voice/audio on mount or round advance)
  useEffect(() => {
    setSelectedLetter(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setWobbleLetter(null);
    setShowHint(false);
    setIsSakaJumping(false);
    setIsTikaJumping(false);
    setSpeechBubbleText(`Ayo lengkapi kata ${currentItem.word.toUpperCase()}!`);
    clearTimeout(autoAdvanceTimer.current);

    return () => clearTimeout(autoAdvanceTimer.current);
  }, [currentIndex, currentItem]);

  // Handle letter option click (Tactile Interaction with flight-snap physics)
  const handleSelectOption = (letter) => {
    if (isAnswered) return;

    if (letter === targetLetter) {
      // Correct choice!
      setSelectedLetter(letter);
      setIsAnswered(true);
      setIsCorrect(true);
      setScoreStreak((prev) => prev + 1);

      // Auditory feedback: Ascending xylophone note + success & fanfare chords
      playXylophoneNote(0);
      playSuccessSound();
      playFanfareSound();

      // Mascots jump with joy
      setIsSakaJumping(true);
      setIsTikaJumping(true);
      setSpeechBubbleText(`Hebat! Kata ${currentItem.word.toUpperCase()} berhasil dilengkapi!`);

      // Trigger colorful confetti burst
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.58 },
        colors: ["#38BDF8", "#34D399", "#FBBF24", "#F472B6", "#A78BFA"],
      });

      // Award +1 Star
      addStars(1);

      // Pronounce completed word strictly on victory
      speakWord(currentItem.word);

      // MANDATORY 2.2-SECOND (2200ms) COMPLETION HOLD before auto-advancing
      autoAdvanceTimer.current = setTimeout(() => {
        handleNext();
      }, 2200);
    } else {
      // Incorrect choice: Forgiving jelly wobble with rubber boing sound (NO harsh buzzers or penalties)
      playRubberBoingSound();
      setWobbleLetter(letter);
      setSpeechBubbleText(`Itu huruf ${letter}. Coba pilih huruf yang lain ya!`);
      setTimeout(() => setWobbleLetter(null), 500);
    }
  };

  const handleNext = useCallback(() => {
    playHoverSound();
    clearTimeout(autoAdvanceTimer.current);
    setCurrentIndex(shuffleQueueRef.current.next());
  }, []);

  const handleResetCurrentQuestion = useCallback(() => {
    playHoverSound();
    clearTimeout(autoAdvanceTimer.current);
    setSelectedLetter(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setWobbleLetter(null);
    setShowHint(false);
    setSpeechBubbleText(`Ayo lengkapi kata ${currentItem.word.toUpperCase()} lagi!`);
  }, [currentItem.word]);

  // Explicit user click audio pronunciation triggers (Strictly gated, zero autoplay)
  const handleReplayAudio = () => {
    playSfx("click");
    speakWord(currentItem.word);
    setSpeechBubbleText(`${currentItem.word}! Huruf apakah yang hilang?`);
  };

  const handleToggleHint = () => {
    playSfx("click");
    setShowHint(true);
    speakInstruction(`Huruf yang hilang adalah ${targetLetter}`);
    setSpeechBubbleText(`Petunjuk: Pilih kartu huruf ${targetLetter} di bawah!`);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none">
      {/* ── Background Base: Persistent Living Vector Landscape ── */}
      <GameLandscapeBackground />

      {/* ── Contrast Tint Layer ── */}
      <div className="absolute inset-0 bg-sky-950/10 backdrop-blur-[0.5px] pointer-events-none z-10" />

      {/* ══════════════════════════════════════════════════════════
          TIER 1: TOP CONTROL BAR (Fixed at top with clean padding)
         ══════════════════════════════════════════════════════════ */}
      <header className="relative z-30 w-full px-4 pt-3 flex items-center justify-between max-w-5xl mx-auto flex-shrink-0">
        
        {/* Top-Left: Menu Navigation Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playSfx("click");
            navigateTo("/menu");
          }}
          aria-label="Kembali ke Menu Utama"
          className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-white/92 backdrop-blur-md border-b-4 border-[#CBD5E1] text-[#1B4965] font-display font-bold text-xs sm:text-sm shadow-md active:border-b-0 cursor-pointer flex-shrink-0"
        >
          <ArrowLeft size={16} className="text-[#1B4965]" />
          <span>Menu</span>
        </motion.button>

        {/* Top-Right: Streak Star Badge */}
        <div className="bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-2 border-[#F59E0B] rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm flex items-center gap-1.5 flex-shrink-0">
          <Star size={16} className="fill-[#F59E0B] text-[#D97706]" />
          <span className="font-display font-black text-xs sm:text-sm text-[#92400E]">
            {scoreStreak} Kata
          </span>
        </div>

      </header>

      {/* ══════════════════════════════════════════════════════════
          TIER 2: TARGET SPOTLIGHT BANNER (Clean Single Pill Banner)
         ══════════════════════════════════════════════════════════ */}
      <div className="relative z-30 w-full px-4 mt-1 sm:mt-2 flex justify-center flex-shrink-0">
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 450, damping: 20 }}
          className="bg-white/92 backdrop-blur-md border-2 border-emerald-300 border-b-4 border-emerald-400 rounded-3xl px-3 py-1.5 sm:px-5 sm:py-2 shadow-lg flex items-center gap-3 sm:gap-4.5"
        >
          {/* Object Illustration Card (Clickable Pronunciation) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.08, rotate: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleReplayAudio}
            aria-label={`Dengarkan contoh kata ${currentItem.word}`}
            className="flex items-center gap-2 bg-gradient-to-b from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-1.5 shadow-xs cursor-pointer group flex-shrink-0"
            title="Klik untuk mendengarkan pengucapan kata"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center group-hover:scale-110 transition-transform">
              <WordIllustration
                illustrationKey={currentItem.illustrationKey}
                wordKey={currentItem.illustrationKey}
                word={currentItem.word}
                color={currentItem.color}
                className="w-full h-full object-contain drop-shadow-xs"
              />
            </div>
          </motion.button>

          {/* Clean Instruction (No redundant repetition of word) */}
          <div className="flex flex-col text-left">
            <h2 className="font-display font-black text-xs sm:text-sm text-[#1B4965] leading-tight">
              Lengkapi Huruf yang Hilang!
            </h2>
            <span className="font-sans font-semibold text-[11px] sm:text-xs text-[#1B4965]/65 leading-none mt-0.5 capitalize">
              Kata: <strong className="text-[#059669] font-black">{currentItem.word}</strong>
            </span>
          </div>

          {/* Audio Speaker & Quick Controls */}
          <div className="flex items-center gap-1.5 ml-1 sm:ml-2">
            <button
              type="button"
              onClick={handleReplayAudio}
              aria-label="Dengarkan Suara Kata"
              className="p-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-[#059669] cursor-pointer transition-colors shadow-2xs"
              title="Dengarkan pengucapan kata"
            >
              <Volume2 size={16} />
            </button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleToggleHint}
              disabled={showHint || isAnswered}
              aria-label="Petunjuk Huruf"
              className={`p-1.5 rounded-xl border shadow-2xs cursor-pointer transition-colors ${
                showHint
                  ? "bg-amber-100 border-amber-300 text-amber-700"
                  : "bg-white hover:bg-stone-50 border-stone-200 text-stone-600"
              }`}
              title="Tampilkan petunjuk huruf yang hilang"
            >
              <Lightbulb size={16} className={showHint ? "text-amber-500 fill-amber-300" : "text-stone-400"} />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleResetCurrentQuestion}
              aria-label="Mainkan Ulang Kata"
              className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1B4965] border border-stone-200 shadow-2xs cursor-pointer"
              title="Mainkan ulang kata ini dari awal"
            >
              <RotateCcw size={16} />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleNext}
              aria-label="Kata Berikutnya"
              className="p-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-[#059669] border border-emerald-300 shadow-2xs cursor-pointer"
              title="Lanjut ke kata berikutnya"
            >
              <ChevronRight size={17} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          TIER 3: INTERACTIVE CENTRAL STAGE (Spacious 3D Wooden Toy Puzzle Tray)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative z-20 flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 my-auto">
        
        {/* Floating Celebration Toast (Positioned absolutely above tray so it NEVER squashes buttons) */}
        <AnimatePresence>
          {isCorrect && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="absolute -top-11 sm:-top-13 inset-x-0 mx-auto w-fit bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-1.5 sm:py-2 rounded-2xl shadow-xl border-2 border-white flex items-center gap-2 z-30 pointer-events-none"
            >
              <Sparkles size={16} className="text-yellow-300" />
              <span className="font-display font-black text-xs sm:text-sm">
                Luar Biasa! Kata {currentItem.word.toUpperCase()} Selesai! (+1 Bintang)
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Handcrafted Wooden Toy Puzzle Tray */}
        <motion.div
          layout
          className="relative bg-gradient-to-b from-[#E7C495] via-[#D5A570] to-[#B8824C] border-4 sm:border-5 border-[#875525] border-b-8 border-b-[#54300E] rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl p-3.5 sm:p-5 lg:p-6"
        >
          {/* Subtle Decorative Wooden Corner Joinery Pegs */}
          <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-[#54300E] opacity-50 shadow-inner" />
          <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#54300E] opacity-50 shadow-inner" />
          <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-[#54300E] opacity-50 shadow-inner" />
          <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-[#54300E] opacity-50 shadow-inner" />

          {/* Inset Carved Wooden Groove / Felt Inlay */}
          <div className="bg-gradient-to-b from-[#4A2609]/30 to-black/20 rounded-[2rem] sm:rounded-[2.4rem] p-3 sm:p-5 border-2 border-[#54300E]/40 shadow-inner flex items-center justify-center gap-3 sm:gap-4.5 flex-wrap">
            {wordChars.map((char, index) => {
              const isMissing = index === missingIndex;
              const isFilled = isMissing && isCorrect;

              if (isMissing) {
                return (
                  <motion.div
                    key={`missing-${index}`}
                    animate={
                      isFilled
                        ? {
                            scale: [0.8, 1.25, 1],
                            rotate: [0, 6, -6, 0],
                            y: [14, -8, 0],
                          }
                        : {
                            scale: [1, 1.06, 1],
                            y: [0, -3, 0],
                          }
                    }
                    transition={
                      isFilled
                        ? { duration: 0.5, ease: "easeOut" }
                        : { duration: 2.0, repeat: Infinity, ease: "easeInOut" }
                    }
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 rounded-2xl sm:rounded-3xl border-3 flex flex-col items-center justify-center font-display font-black text-3xl sm:text-4xl lg:text-5xl transition-all shadow-xl select-none aspect-square ${
                      isFilled
                        ? "bg-gradient-to-b from-[#34D399] to-[#059669] border-teal-300 border-b-6 border-b-[#065F46] text-white shadow-emerald-200"
                        : "bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 border-amber-300 border-b-6 border-b-amber-600 text-amber-950 shadow-xl shadow-amber-400/50 ring-4 ring-amber-300/80 animate-pulse"
                    }`}
                  >
                    {/* Mystery Glyph Display */}
                    <span>{isFilled ? targetLetter : showHint ? targetLetter : "?"}</span>

                    {/* Completed Checkmark Star Badge */}
                    {isFilled && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border-2 border-white flex items-center justify-center shadow-md"
                      >
                        <Check size={14} strokeWidth={3} className="text-white" />
                      </motion.div>
                    )}

                    {/* Golden Mystery Pulsing Beacon Glow */}
                    {!isFilled && (
                      <div className="absolute -bottom-2 inset-x-3 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-sm" />
                    )}
                  </motion.div>
                );
              }

              // Fixed Known Letters (Chunky rounded-square 3D toy blocks)
              return (
                <motion.div
                  key={`known-${index}`}
                  animate={
                    isCorrect
                      ? {
                          y: [0, -10, 0],
                          scale: [1, 1.08, 1],
                        }
                      : {}
                  }
                  transition={
                    isCorrect
                      ? {
                          delay: index * 0.08,
                          duration: 0.45,
                          repeat: 2,
                          ease: "easeInOut",
                        }
                      : {}
                  }
                  className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#FFFFFF] to-[#F7EFE5] border-2 border-[#E3D1BE] border-b-6 border-b-[#C2AB92] flex flex-col items-center justify-center font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#1B4965] shadow-md select-none aspect-square"
                >
                  <span>{char}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </section>

      {/* ══════════════════════════════════════════════════════════
          TIER 4: BOTTOM CONTROLS & HARMONIZED PLAYMATE MASCOTS
         ══════════════════════════════════════════════════════════ */}
      <footer className="relative z-30 w-full max-w-4xl mx-auto px-4 pb-2 sm:pb-3 flex items-end justify-between pointer-events-none flex-shrink-0">
        
        {/* Left Side: Saka Mascot positioned close as playmate */}
        <div className="flex flex-col items-center pointer-events-auto origin-bottom-left pb-1 flex-shrink-0">
          {/* Dynamic Speech Bubble */}
          <AnimatePresence mode="wait">
            <motion.div
              key={speechBubbleText}
              initial={{ scale: 0.8, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="bg-white/95 border-2 border-[#1B4965]/20 rounded-2xl px-3 py-1.5 shadow-lg w-[145px] sm:w-[170px] text-center mb-1 pointer-events-none relative z-30"
            >
              <p className="font-sans font-bold text-xs text-[#1B4965] leading-snug">
                {speechBubbleText}
              </p>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-r-2 border-b-2 border-[#1B4965]/20 rotate-45" />
            </motion.div>
          </AnimatePresence>

          {/* Saka Mascot Jumping / Cheering */}
          <motion.div
            animate={isSakaJumping ? { y: [-24, 0], scale: [1.12, 1] } : { y: [0, -4, 0] }}
            transition={
              isSakaJumping
                ? { duration: 0.45, type: "spring", stiffness: 500 }
                : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
            }
            className="scale-75 sm:scale-85 origin-bottom"
          >
            <SakaMascot isWaving={isSakaJumping || isCorrect} />
          </motion.div>

          {/* Grassy Mound Base */}
          <div className="w-24 sm:w-32 h-3 bg-[#4ADE80] rounded-full blur-[1px] opacity-80 -mt-2 shadow-xs" />
        </div>

        {/* Center: 4 Chunky 3D Square Toy Choice Tiles */}
        <div className="flex-1 flex items-center justify-center pb-2 pointer-events-auto z-20 px-3 sm:px-6">
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap">
            {options.map((letter, optIdx) => {
              const isMatchingTarget = isCorrect && letter === targetLetter;
              const isWobble = wobbleLetter === letter;
              const isHighlightedHint = showHint && letter === targetLetter && !isCorrect;
              const palette = TOY_CHOICE_PALETTES[optIdx % TOY_CHOICE_PALETTES.length];

              return (
                <motion.button
                  key={letter}
                  type="button"
                  disabled={isAnswered}
                  whileHover={!isAnswered ? { scale: 1.08, y: -4 } : {}}
                  whileTap={{ scale: 0.92, y: 4 }}
                  animate={
                    isWobble
                      ? {
                          rotate: [-10, 10, -7, 7, 0],
                          scale: [1, 1.18, 0.9, 1.08, 1],
                        }
                      : isMatchingTarget
                      ? {
                          scale: [1, 1.25, 1],
                          y: [0, -25, 0],
                        }
                      : isHighlightedHint
                      ? {
                          scale: [1, 1.08, 1],
                          y: [0, -4, 0],
                        }
                      : {}
                  }
                  transition={
                    isHighlightedHint
                      ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.35 }
                  }
                  onClick={() => handleSelectOption(letter)}
                  className={`w-14 h-14 sm:w-17 sm:h-17 lg:w-20 lg:h-20 rounded-2xl sm:rounded-3xl font-display font-black text-2xl sm:text-3xl lg:text-4xl border-3 border-b-6 sm:border-b-8 transition-all flex items-center justify-center select-none cursor-pointer shadow-lg relative aspect-square ${
                    isMatchingTarget
                      ? "bg-gradient-to-b from-emerald-400 to-teal-500 border-teal-300 border-b-teal-700 text-white shadow-emerald-200 shadow-xl"
                      : isWobble
                      ? "bg-gradient-to-b from-rose-400 to-rose-500 border-rose-300 border-b-rose-700 text-white"
                      : isHighlightedHint
                      ? "bg-gradient-to-b from-amber-300 to-yellow-400 border-amber-300 border-b-amber-600 text-amber-950 ring-4 ring-amber-300/80 shadow-amber-200 shadow-xl"
                      : `bg-gradient-to-b ${palette.bg} ${palette.border} ${palette.glow} active:translate-y-1`
                  }`}
                  style={{ color: palette.text }}
                >
                  <span>{letter}</span>

                  {/* Sparkling check badge on correct match */}
                  {isMatchingTarget && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-300 border border-white flex items-center justify-center shadow-xs"
                    >
                      <Check size={10} strokeWidth={3} className="text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Tika Mascot positioned close as playmate */}
        <div className="flex flex-col items-center pointer-events-auto origin-bottom-right pb-1 flex-shrink-0">
          {/* Tika Mascot Jumping / Cheering */}
          <motion.div
            animate={isTikaJumping ? { y: [-24, 0], scale: [1.12, 1] } : { y: [0, -4, 0] }}
            transition={
              isTikaJumping
                ? { duration: 0.45, type: "spring", stiffness: 500, delay: 0.05 }
                : { duration: 3.0, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
            }
            className="scale-75 sm:scale-85 origin-bottom"
          >
            <TikaMascot isCheering={isTikaJumping || isCorrect} />
          </motion.div>

          {/* Grassy Mound Base */}
          <div className="w-24 sm:w-32 h-3 bg-[#4ADE80] rounded-full blur-[1px] opacity-80 -mt-2 shadow-xs" />
        </div>

      </footer>
    </main>
  );
}
