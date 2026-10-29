// src/views/modules/MelengkapiKataView.jsx
// SAKA TIKA: Visual Overhaul for "Melengkapi Kata" (Mini-Game 3)
// Strictly adheres to Global 3-Tier Height Budgeting:
// - Central puzzle board & stage wrapped with flex-1 min-h-0 max-h-[55vh] flex flex-col justify-center items-center
// - Bottom mascots remain anchored in lower zones without intruding into game puzzle hitboxes
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
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
  const { addStars } = useGame();
  const { playSfx } = useAudio();

  // Non-deterministic shuffle queue initialization
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

  // Reset state on question change
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

  // Handle letter option click
  const handleSelectOption = (letter) => {
    if (isAnswered) return;

    if (letter === targetLetter) {
      // Correct choice
      setSelectedLetter(letter);
      setIsAnswered(true);
      setIsCorrect(true);
      setScoreStreak((prev) => prev + 1);

      playXylophoneNote(0);
      playSuccessSound();
      playFanfareSound();

      setIsSakaJumping(true);
      setIsTikaJumping(true);
      setSpeechBubbleText(`Hebat! Kata ${currentItem.word.toUpperCase()} berhasil dilengkapi!`);

      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.58 },
        colors: ["#38BDF8", "#34D399", "#FBBF24", "#F472B6", "#A78BFA"],
      });

      addStars(1);
      speakWord(currentItem.word);

      autoAdvanceTimer.current = setTimeout(() => {
        handleNext();
      }, 2200);
    } else {
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
    <main className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none p-1 sm:p-2">
      {/* ── Background Base: Persistent Living Vector Landscape (Layer 0) ── */}
      <GameLandscapeBackground />

      {/* ── Contrast Tint Layer ── */}
      <div className="fixed inset-0 bg-sky-950/10 backdrop-blur-[0.5px] pointer-events-none z-0" />

      {/* ── Interactive Content Wrapper ── */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col justify-between max-w-5xl w-full mx-auto">
        
        {/* ── Target Spotlight Banner: Compact Single Pill Card ── */}
        <div className="w-full px-2 mt-1 flex justify-center flex-shrink-0">
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="bg-white/92 backdrop-blur-md border-2 border-emerald-300 border-b-3 border-emerald-400 rounded-2xl px-3 py-1 shadow-sm flex items-center gap-2.5 sm:gap-4 max-h-12"
          >
            {/* Object Illustration Card (Clickable Pronunciation) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08, rotate: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleReplayAudio}
              aria-label={`Dengarkan contoh kata ${currentItem.word}`}
              className="flex items-center gap-1.5 bg-gradient-to-b from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-1 shadow-2xs cursor-pointer group flex-shrink-0"
              title="Klik untuk mendengarkan pengucapan kata"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center group-hover:scale-110 transition-transform">
                <WordIllustration
                  illustrationKey={currentItem.illustrationKey}
                  wordKey={currentItem.illustrationKey}
                  word={currentItem.word}
                  color={currentItem.color}
                  className="w-full h-full object-contain drop-shadow-xs"
                />
              </div>
            </motion.button>

            {/* Instruction */}
            <div className="flex flex-col text-left">
              <h2 className="font-display font-black text-xs sm:text-sm text-[#1B4965] leading-tight">
                Lengkapi Huruf yang Hilang!
              </h2>
              <span className="font-sans font-semibold text-[10px] sm:text-xs text-[#1B4965]/65 leading-none mt-0.5 capitalize">
                Kata: <strong className="text-[#059669] font-black">{currentItem.word}</strong>
                {scoreStreak > 0 && (
                  <span className="ml-2 text-amber-600 font-bold">({scoreStreak} Kata)</span>
                )}
              </span>
            </div>

            {/* Quick Audio & Controls */}
            <div className="flex items-center gap-1 ml-1 sm:ml-2">
              <button
                type="button"
                onClick={handleReplayAudio}
                aria-label="Dengarkan Suara Kata"
                className="p-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-[#059669] cursor-pointer transition-colors shadow-2xs"
                title="Dengarkan pengucapan kata"
              >
                <Volume2 size={14} />
              </button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleToggleHint}
                disabled={showHint || isAnswered}
                aria-label="Petunjuk Huruf"
                className={`p-1 rounded-lg border shadow-2xs cursor-pointer transition-colors ${
                  showHint
                    ? "bg-amber-100 border-amber-300 text-amber-700"
                    : "bg-white hover:bg-stone-50 border-stone-200 text-stone-600"
                }`}
                title="Tampilkan petunjuk huruf yang hilang"
              >
                <Lightbulb size={14} className={showHint ? "text-amber-500 fill-amber-300" : "text-stone-400"} />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleResetCurrentQuestion}
                aria-label="Mainkan Ulang Kata"
                className="p-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#1B4965] border border-stone-200 shadow-2xs cursor-pointer"
                title="Mainkan ulang kata ini dari awal"
              >
                <RotateCcw size={14} />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleNext}
                aria-label="Kata Berikutnya"
                className="p-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-[#059669] border border-emerald-300 shadow-2xs cursor-pointer"
                title="Lanjut ke kata berikutnya"
              >
                <ChevronRight size={15} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ── Central Stage: flex-1 min-h-0 max-h-[55vh] flex flex-col justify-center items-center ── */}
        <section className="flex-1 min-h-0 max-h-[55vh] flex flex-col justify-center items-center my-auto w-full relative px-2">
          
          {/* Floating Celebration Toast */}
          <AnimatePresence>
            {isCorrect && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="absolute -top-9 inset-x-0 mx-auto w-fit bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-2xl shadow-lg border border-white flex items-center gap-1.5 z-30 pointer-events-none"
              >
                <Sparkles size={14} className="text-yellow-300" />
                <span className="font-display font-black text-xs sm:text-sm">
                  Luar Biasa! Kata {currentItem.word.toUpperCase()} Selesai! (+1 Bintang)
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D Handcrafted Wooden Toy Puzzle Tray */}
          <motion.div
            layout
            className="relative bg-gradient-to-b from-[#E7C495] via-[#D5A570] to-[#B8824C] border-3 sm:border-4 border-[#875525] border-b-6 border-b-[#54300E] rounded-3xl shadow-xl p-2.5 sm:p-4"
          >
            {/* Corner Joinery Pegs */}
            <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-[#54300E] opacity-50 shadow-inner" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#54300E] opacity-50 shadow-inner" />
            <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-[#54300E] opacity-50 shadow-inner" />
            <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-[#54300E] opacity-50 shadow-inner" />

            {/* Inset Felt Inlay */}
            <div className="bg-gradient-to-b from-[#4A2609]/30 to-black/20 rounded-2xl p-2 sm:p-3.5 border border-[#54300E]/40 shadow-inner flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap">
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
                              scale: [0.8, 1.2, 1],
                              rotate: [0, 6, -6, 0],
                              y: [10, -6, 0],
                            }
                          : {
                              scale: [1, 1.05, 1],
                              y: [0, -2, 0],
                            }
                      }
                      transition={
                        isFilled
                          ? { duration: 0.5, ease: "easeOut" }
                          : { duration: 2.0, repeat: Infinity, ease: "easeInOut" }
                      }
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-2xl border-2 sm:border-3 flex flex-col items-center justify-center font-display font-black text-2xl sm:text-3xl lg:text-4xl transition-all shadow-lg select-none aspect-square ${
                        isFilled
                          ? "bg-gradient-to-b from-[#34D399] to-[#059669] border-teal-300 border-b-5 border-b-[#065F46] text-white shadow-emerald-200"
                          : "bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 border-amber-300 border-b-5 border-b-amber-600 text-amber-950 shadow-lg ring-3 ring-amber-300/80 animate-pulse"
                      }`}
                    >
                      <span>{isFilled ? targetLetter : showHint ? targetLetter : "?"}</span>

                      {isFilled && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border border-white flex items-center justify-center shadow-xs"
                        >
                          <Check size={11} strokeWidth={3} className="text-white" />
                        </motion.div>
                      )}

                      {!isFilled && (
                        <div className="absolute -bottom-1.5 inset-x-2.5 h-1 bg-amber-500 rounded-full animate-pulse shadow-xs" />
                      )}
                    </motion.div>
                  );
                }

                // Fixed Known Letters
                return (
                  <motion.div
                    key={`known-${index}`}
                    animate={
                      isCorrect
                        ? {
                            y: [0, -8, 0],
                            scale: [1, 1.06, 1],
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
                    className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-2xl bg-gradient-to-b from-[#FFFFFF] to-[#F7EFE5] border-2 border-[#E3D1BE] border-b-5 border-b-[#C2AB92] flex flex-col items-center justify-center font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#1B4965] shadow-xs select-none aspect-square"
                  >
                    <span>{char}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </section>

        {/* ── Bottom Tier: Mascots Anchored Without Intruding on Puzzle Hitboxes (h-[24%] max-h-[140px]) ── */}
        <footer className="h-[24%] max-h-[140px] relative flex items-end justify-between px-4 pb-1 pointer-events-none w-full max-w-4xl mx-auto flex-shrink-0">
          
          {/* Left Side: Saka Mascot */}
          <div className="flex flex-col items-center pointer-events-auto origin-bottom-left pb-1 flex-shrink-0">
            {/* Dynamic Speech Bubble */}
            <AnimatePresence mode="wait">
              <motion.div
                key={speechBubbleText}
                initial={{ scale: 0.8, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -6 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="bg-white/95 border-2 border-[#1B4965]/20 rounded-2xl px-2.5 py-1 shadow-md w-[135px] sm:w-[160px] text-center mb-1 pointer-events-none relative z-30"
              >
                <p className="font-sans font-bold text-[11px] text-[#1B4965] leading-snug">
                  {speechBubbleText}
                </p>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-[#1B4965]/20 rotate-45" />
              </motion.div>
            </AnimatePresence>

            {/* Saka Mascot (Height locked to h-24 sm:h-28) */}
            <motion.div
              animate={isSakaJumping ? { y: [-16, 0], scale: [1.08, 1] } : { y: [0, -3, 0] }}
              transition={
                isSakaJumping
                  ? { duration: 0.45, type: "spring", stiffness: 500 }
                  : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
              }
              className="origin-bottom"
            >
              <SakaMascot isWaving={isSakaJumping || isCorrect} className="h-24 sm:h-28 w-auto object-contain" />
            </motion.div>

            {/* Grassy Mound Base */}
            <div className="w-20 sm:w-28 h-2.5 bg-[#4ADE80] rounded-full blur-[1px] opacity-80 -mt-1.5" />
          </div>

          {/* Center: 4 Chunky 3D Square Toy Choice Tiles */}
          <div className="flex-1 flex items-center justify-center pb-1 pointer-events-auto z-20 px-2 sm:px-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
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
                    whileHover={!isAnswered ? { scale: 1.08, y: -3 } : {}}
                    whileTap={{ scale: 0.92, y: 3 }}
                    animate={
                      isWobble
                        ? {
                            rotate: [-10, 10, -7, 7, 0],
                            scale: [1, 1.15, 0.9, 1.08, 1],
                          }
                        : isMatchingTarget
                        ? {
                            scale: [1, 1.2, 1],
                            y: [0, -18, 0],
                          }
                        : isHighlightedHint
                        ? {
                            scale: [1, 1.06, 1],
                            y: [0, -3, 0],
                          }
                        : {}
                    }
                    transition={
                      isHighlightedHint
                        ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.35 }
                    }
                    onClick={() => handleSelectOption(letter)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl font-display font-black text-xl sm:text-2xl lg:text-3xl border-2 border-b-5 transition-all flex items-center justify-center select-none cursor-pointer shadow-md relative aspect-square ${
                      isMatchingTarget
                        ? "bg-gradient-to-b from-emerald-400 to-teal-500 border-teal-300 border-b-teal-700 text-white shadow-emerald-200"
                        : isWobble
                        ? "bg-gradient-to-b from-rose-400 to-rose-500 border-rose-300 border-b-rose-700 text-white"
                        : isHighlightedHint
                        ? "bg-gradient-to-b from-amber-300 to-yellow-400 border-amber-300 border-b-amber-600 text-amber-950 ring-3 ring-amber-300/80 shadow-amber-200"
                        : `bg-gradient-to-b ${palette.bg} ${palette.border} ${palette.glow} active:translate-y-1`
                    }`}
                    style={{ color: palette.text }}
                  >
                    <span>{letter}</span>

                    {isMatchingTarget && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-300 border border-white flex items-center justify-center shadow-xs"
                      >
                        <Check size={9} strokeWidth={3} className="text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right Side: Tika Mascot */}
          <div className="flex flex-col items-center pointer-events-auto origin-bottom-right pb-1 flex-shrink-0">
            {/* Tika Mascot (Height locked to h-24 sm:h-28) */}
            <motion.div
              animate={isTikaJumping ? { y: [-16, 0], scale: [1.08, 1] } : { y: [0, -3, 0] }}
              transition={
                isTikaJumping
                  ? { duration: 0.45, type: "spring", stiffness: 500, delay: 0.05 }
                  : { duration: 3.0, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
              }
              className="origin-bottom"
            >
              <TikaMascot isCheering={isTikaJumping || isCorrect} className="h-24 sm:h-28 w-auto object-contain" />
            </motion.div>

            {/* Grassy Mound Base */}
            <div className="w-20 sm:w-28 h-2.5 bg-[#4ADE80] rounded-full blur-[1px] opacity-80 -mt-1.5" />
          </div>

        </footer>

      </div>
    </main>
  );
}
