// src/views/modules/MengetikHurufView.jsx
// SAKA TIKA: 16:9 Wide Arcade Typing Console Refactor for "Mengetik Huruf" (Mini-Game 2)
// Strictly adheres to Global 3-Tier Height Budgeting:
// - Central typing word slots stage wrapped with flex-1 min-h-0 max-h-[55vh]
// - Bottom mascots remain anchored in lower zones without intruding into keyboard hitboxes
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
  Keyboard,
} from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { speakWord } from "../../utils/speechEngine.js";
import { GAME_SAMPLES_50 } from "../../data/masterDataset.js";
import {
  playXylophoneNote,
  playRubberBoingSound,
  playChalkSound,
  playHoverSound,
  playSuccessSound,
  playFanfareSound,
} from "../../utils/soundSynthesizer.js";
import { ShuffleQueue } from "../../utils/shuffleQueue.js";
import GameLandscapeBackground from "../../components/background/GameLandscapeBackground.jsx";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";
import SakaMascot from "../../components/illustrations/SakaMascot.jsx";
import TikaMascot from "../../components/illustrations/TikaMascot.jsx";

// Alternating bright, playful pastel hues (Sunny Yellow, Mint Green, Pastel Coral, Sky Blue, Lilac)
const KEY_PASTELS = [
  { bg: "from-amber-100 to-amber-200", border: "border-amber-300 border-b-amber-400", shadow: "shadow-amber-200/50" },
  { bg: "from-emerald-100 to-teal-200", border: "border-emerald-300 border-b-teal-400", shadow: "shadow-emerald-200/50" },
  { bg: "from-rose-100 to-pink-200", border: "border-rose-300 border-b-rose-400", shadow: "shadow-rose-200/50" },
  { bg: "from-sky-100 to-blue-200", border: "border-sky-300 border-b-sky-400", shadow: "shadow-sky-200/50" },
  { bg: "from-purple-100 to-indigo-200", border: "border-purple-300 border-b-purple-400", shadow: "shadow-purple-200/50" },
];

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export default function MengetikHurufView() {
  const { addStars } = useGame();
  const { playSfx } = useAudio();

  // Non-deterministic shuffle queue initialization
  const shuffleQueueRef = useRef(null);
  if (!shuffleQueueRef.current) {
    shuffleQueueRef.current = new ShuffleQueue(GAME_SAMPLES_50.length);
  }

  const [wordIndex, setWordIndex] = useState(() => shuffleQueueRef.current.next());
  const [activeCharIndex, setActiveCharIndex] = useState(0);
  const [isWordComplete, setIsWordComplete] = useState(false);
  const [activePressedKey, setActivePressedKey] = useState(null);
  const [wobbleKey, setWobbleKey] = useState(null);
  const [scoreStreak, setScoreStreak] = useState(0);
  const [isSakaJumping, setIsSakaJumping] = useState(false);
  const [isTikaJumping, setIsTikaJumping] = useState(false);
  const [speechBubbleText, setSpeechBubbleText] = useState("");

  const autoAdvanceTimer = useRef(null);

  // Active word sample from master dataset
  const currentItem = useMemo(() => {
    return GAME_SAMPLES_50[wordIndex % GAME_SAMPLES_50.length];
  }, [wordIndex]);

  const wordChars = useMemo(() => {
    return currentItem.word.toUpperCase().split("");
  }, [currentItem]);

  const expectedChar = useMemo(() => {
    return wordChars[activeCharIndex] || "";
  }, [wordChars, activeCharIndex]);

  // Reset state on word change
  useEffect(() => {
    setActiveCharIndex(0);
    setIsWordComplete(false);
    setWobbleKey(null);
    setIsSakaJumping(false);
    setIsTikaJumping(false);
    setSpeechBubbleText(`Ayo ketik kata ${currentItem.word.toUpperCase()}!`);
    clearTimeout(autoAdvanceTimer.current);

    return () => clearTimeout(autoAdvanceTimer.current);
  }, [wordIndex, currentItem]);

  // Handle typing key
  const handleKeyPress = useCallback(
    (keyChar) => {
      if (isWordComplete) return;
      const upperKey = keyChar.toUpperCase();

      setActivePressedKey(upperKey);
      setTimeout(() => setActivePressedKey(null), 180);
      playChalkSound();

      if (upperKey === expectedChar) {
        setWobbleKey(null);
        playXylophoneNote(activeCharIndex);

        setIsSakaJumping(true);
        setIsTikaJumping(true);
        setTimeout(() => {
          setIsSakaJumping(false);
          setIsTikaJumping(false);
        }, 500);

        if (activeCharIndex + 1 < wordChars.length) {
          const nextIdx = activeCharIndex + 1;
          setActiveCharIndex(nextIdx);
          setSpeechBubbleText(`Bagus! Lanjut ketik huruf ${wordChars[nextIdx]}!`);
        } else {
          setIsWordComplete(true);
          setActiveCharIndex(wordChars.length);
          setScoreStreak((prev) => prev + 1);

          playSuccessSound();
          playFanfareSound();
          addStars(1);

          confetti({
            particleCount: 85,
            spread: 80,
            origin: { y: 0.58 },
            colors: ["#38BDF8", "#34D399", "#FBBF24", "#F472B6", "#A78BFA"],
          });

          setSpeechBubbleText(`Luar biasa! Kata ${currentItem.word.toUpperCase()} selesai!`);

          autoAdvanceTimer.current = setTimeout(() => {
            setWordIndex(shuffleQueueRef.current.next());
          }, 2200);
        }
      } else {
        playRubberBoingSound();
        setWobbleKey(upperKey);
        setSpeechBubbleText(`Itu tombol ${upperKey}. Tekan tombol ${expectedChar} ya!`);
        setTimeout(() => setWobbleKey(null), 450);
      }
    },
    [isWordComplete, expectedChar, activeCharIndex, wordChars, currentItem]
  );

  // Synchronize physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isWordComplete) return;
      if (e.key && e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress, isWordComplete]);

  const handleNextWord = useCallback(() => {
    playHoverSound();
    clearTimeout(autoAdvanceTimer.current);
    setWordIndex(shuffleQueueRef.current.next());
  }, []);

  const handleResetCurrentWord = useCallback(() => {
    playHoverSound();
    clearTimeout(autoAdvanceTimer.current);
    setActiveCharIndex(0);
    setIsWordComplete(false);
    setWobbleKey(null);
    setSpeechBubbleText(`Ayo ketik kata ${currentItem.word.toUpperCase()} lagi!`);
  }, [currentItem.word]);

  const handleSpeakWord = () => {
    playSfx("click");
    speakWord(currentItem.word);
    setSpeechBubbleText(`${currentItem.word}! Ayo ketik hurufnya!`);
  };

  return (
    <main className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none p-1 sm:p-2">
      {/* ── Background Base: Persistent Living Vector Landscape (Layer 0) ── */}
      <GameLandscapeBackground />

      {/* ── Contrast Tint Layer ── */}
      <div className="fixed inset-0 bg-sky-950/10 backdrop-blur-[0.5px] pointer-events-none z-0" />

      {/* ── Content Wrapper ── */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col justify-between max-w-7xl w-full mx-auto">
        
        {/* ── Top Tier: Spotlight Exhibition Card Banner ── */}
        <div className="w-full px-2 mt-1 flex justify-center flex-shrink-0">
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="bg-white/95 backdrop-blur-md border-3 border-sky-300 border-b-4 border-b-sky-400 rounded-3xl px-3 sm:px-4 py-1.5 shadow-md flex items-center justify-between gap-2.5 sm:gap-4 max-w-2xl w-full max-h-14"
          >
            {/* Object Illustration Card with speaker action */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08, rotate: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleSpeakWord}
              aria-label={`Dengarkan contoh kata ${currentItem.word}`}
              className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-b from-sky-50 to-indigo-50 border border-sky-200 rounded-2xl px-2 py-0.5 shadow-2xs cursor-pointer group flex-shrink-0"
              title="Klik untuk mendengarkan pengucapan kata"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center group-hover:scale-110 transition-transform">
                <WordIllustration
                  illustrationKey={currentItem.illustrationKey}
                  word={currentItem.word}
                  color={currentItem.color}
                  className="w-full h-full object-contain drop-shadow-xs"
                />
              </div>
              <div className="text-left">
                <span className="font-display font-black text-xs sm:text-sm text-[#1B4965] leading-tight block">
                  {currentItem.word}
                </span>
                <span className="font-sans font-semibold text-[9px] text-sky-600 block">
                  Ketuk Suara
                </span>
              </div>
              <div className="p-0.5 rounded-md bg-sky-100 text-[#0284C7] ml-0.5">
                <Volume2 size={13} />
              </div>
            </motion.button>

            {/* Center: Animated Pulse Hint Badge */}
            <div className="flex items-center gap-1.5 flex-1 justify-center">
              {!isWordComplete ? (
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 text-white font-display font-black text-xs sm:text-sm px-3 py-1 rounded-2xl shadow-sm border border-white flex items-center gap-1.5"
                >
                  <Keyboard size={14} className="text-amber-100" />
                  <span>
                    Ketik Huruf: <span className="underline decoration-2 decoration-white underline-offset-2">{expectedChar}</span>
                  </span>
                </motion.div>
              ) : (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-display font-black text-xs sm:text-sm px-3 py-1 rounded-2xl shadow-sm border border-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-yellow-300" />
                  <span>Kata Selesai!</span>
                </div>
              )}
            </div>

            {/* Quick Toolbar */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleResetCurrentWord}
                aria-label="Ketik Ulang Kata"
                className="p-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1B4965] border border-stone-200 shadow-2xs cursor-pointer"
                title="Ketik ulang kata ini dari awal"
              >
                <RotateCcw size={14} />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleNextWord}
                aria-label="Kata Berikutnya"
                className="p-1 rounded-xl bg-sky-100 hover:bg-sky-200 text-[#0284C7] border border-sky-300 shadow-2xs cursor-pointer"
                title="Lanjut ke kata berikutnya"
              >
                <ChevronRight size={15} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ── Central Stage: Juicy 3D Letter Slot Blocks ── */}
        <section className="relative z-20 flex-1 min-h-0 max-h-[50vh] flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 my-auto">
          
          <div className="flex items-center justify-center gap-2 sm:gap-3.5 flex-wrap">
            {wordChars.map((char, index) => {
              const isFilled = index < activeCharIndex || isWordComplete;
              const isActive = index === activeCharIndex && !isWordComplete;
              const isTargetWobble = isActive && wobbleKey;

              return (
                <motion.div
                  key={`${char}-${index}`}
                  animate={
                    isTargetWobble
                      ? { x: [-6, 6, -4, 4, 0] }
                      : isFilled
                      ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 2, -2, 0],
                        }
                      : isActive
                      ? {
                          scale: [1, 1.06, 1],
                          y: [0, -3, 0],
                        }
                      : {}
                  }
                  transition={
                    isActive
                      ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.35, ease: "easeOut" }
                  }
                  className={`relative w-13 h-15 sm:w-16 sm:h-18 lg:w-18 lg:h-20 rounded-2xl sm:rounded-3xl border-2 sm:border-3 flex flex-col items-center justify-center font-display font-black text-2xl sm:text-3xl lg:text-4xl transition-all shadow-md select-none ${
                    isFilled
                      ? "bg-gradient-to-b from-[#34D399] to-[#059669] border-teal-200 border-b-6 border-b-[#065F46] text-white shadow-emerald-200/50"
                      : isActive
                      ? "bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 border-amber-300 border-b-6 border-b-amber-600 text-amber-950 shadow-xl ring-4 ring-amber-300/80 animate-pulse"
                      : "bg-white/70 backdrop-blur-xs border-2 border-stone-200 border-dashed text-stone-300"
                  }`}
                >
                  <span>{isFilled ? char : isActive ? char : "?"}</span>

                  {isFilled && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border border-white flex items-center justify-center shadow-xs"
                    >
                      <Check size={10} strokeWidth={3} className="text-white" />
                    </motion.div>
                  )}

                  {isActive && (
                    <div className="absolute -bottom-1.5 inset-x-3 h-1 bg-amber-600 rounded-full animate-pulse shadow-xs" />
                  )}
                </motion.div>
              );
            })}
          </div>

        </section>

        {/* ── Bottom Tier: Chunky 3D Toy Keyboard for Children & Anchored Mascots (h-[32%] max-h-[195px]) ── */}
        <footer className="h-[32%] max-h-[195px] relative flex items-end justify-between px-2 sm:px-4 pb-1 pointer-events-none w-full max-w-6xl mx-auto flex-shrink-0">
          
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
                className="bg-white/95 border-2 border-[#1B4965]/20 rounded-2xl px-2 py-1 shadow-md w-[125px] sm:w-[150px] text-center mb-1 pointer-events-none relative z-30"
              >
                <p className="font-sans font-bold text-[10px] sm:text-[11px] text-[#1B4965] leading-snug">
                  {speechBubbleText}
                </p>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-[#1B4965]/20 rotate-45" />
              </motion.div>
            </AnimatePresence>

            {/* Saka Mascot (Height locked to h-20 sm:h-24) */}
            <motion.div
              animate={isSakaJumping ? { y: [-14, 0], scale: [1.08, 1] } : { y: [0, -3, 0] }}
              transition={
                isSakaJumping
                  ? { duration: 0.45, type: "spring", stiffness: 500 }
                  : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
              }
              className="origin-bottom"
            >
              <SakaMascot isWaving={isSakaJumping || isWordComplete} className="h-20 sm:h-24 w-auto object-contain" />
            </motion.div>

            {/* Grassy Mound Base */}
            <div className="w-18 sm:w-24 h-2 bg-[#4ADE80] rounded-full blur-[1px] opacity-80 -mt-1" />
          </div>

          {/* Center: Chunky 3D Toy Keyboard */}
          <div className="flex-1 flex flex-col items-center justify-center pb-1 pointer-events-auto z-20 px-1 sm:px-3">
            
            {/* Word Complete Banner (if solved) */}
            <AnimatePresence>
              {isWordComplete && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 450, damping: 20 }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3.5 py-0.5 rounded-2xl shadow-lg border border-white flex items-center gap-1.5 mb-1"
                >
                  <Sparkles size={13} className="text-yellow-300" />
                  <span className="font-display font-black text-xs">
                    Luar Biasa! Kata {currentItem.word.toUpperCase()} Selesai! (+1 Bintang)
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Keyboard Rows */}
            <div className="w-full max-w-lg lg:max-w-xl flex flex-col gap-1 sm:gap-1.5">
              {KEYBOARD_ROWS.map((rowKeys, rowIdx) => (
                <div key={rowIdx} className="flex justify-center gap-1 sm:gap-1.5">
                  {rowKeys.map((keyChar, keyIdx) => {
                    const isTarget = keyChar === expectedChar && !isWordComplete;
                    const isPressed = activePressedKey === keyChar;
                    const isKeyWobble = wobbleKey === keyChar;
                    const pastel = KEY_PASTELS[(keyChar.charCodeAt(0) + keyIdx) % KEY_PASTELS.length];

                    return (
                      <motion.button
                        key={keyChar}
                        type="button"
                        disabled={isWordComplete}
                        whileHover={!isWordComplete ? { scale: 1.08, y: -2 } : {}}
                        whileTap={{ scale: 0.92, y: 2 }}
                        animate={
                          isKeyWobble
                            ? {
                                rotate: [-8, 8, -6, 6, 0],
                                scale: [1, 1.15, 0.9, 1.06, 1],
                              }
                            : isTarget
                            ? {
                                scale: [1, 1.06, 1],
                              }
                            : {}
                        }
                        transition={{ duration: 0.35 }}
                        onClick={() => handleKeyPress(keyChar)}
                        className={`h-9 sm:h-11 md:h-12 min-w-[32px] sm:min-w-[40px] md:min-w-[48px] px-1 sm:px-2 rounded-2xl font-display font-black text-sm sm:text-base md:text-lg border-2 border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center select-none cursor-pointer shadow-xs ${
                          isPressed && isTarget
                            ? "bg-gradient-to-b from-emerald-400 to-teal-500 border-teal-300 border-b-teal-700 text-white translate-y-0.5"
                            : isKeyWobble
                            ? "bg-gradient-to-b from-rose-400 to-rose-500 border-rose-300 border-b-rose-700 text-white"
                            : isTarget
                            ? "bg-gradient-to-b from-amber-300 to-amber-400 border-amber-300 border-b-amber-500 text-amber-950 shadow-amber-200/80 shadow-md ring-3 ring-amber-400/80 font-black animate-pulse"
                            : `bg-gradient-to-b ${pastel.bg} ${pastel.border} ${pastel.shadow} text-slate-800`
                        }`}
                      >
                        {keyChar}
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>

          </div>

          {/* Right Side: Tika Mascot */}
          <div className="flex flex-col items-center pointer-events-auto origin-bottom-right pb-1 flex-shrink-0">
            {/* Tika Mascot (Height locked to h-20 sm:h-24) */}
            <motion.div
              animate={isTikaJumping ? { y: [-14, 0], scale: [1.08, 1] } : { y: [0, -3, 0] }}
              transition={
                isTikaJumping
                  ? { duration: 0.45, type: "spring", stiffness: 500, delay: 0.05 }
                  : { duration: 3.0, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
              }
              className="origin-bottom"
            >
              <TikaMascot isCheering={isTikaJumping || isWordComplete} className="h-20 sm:h-24 w-auto object-contain" />
            </motion.div>

            {/* Grassy Mound Base */}
            <div className="w-18 sm:w-24 h-2 bg-[#4ADE80] rounded-full blur-[1px] opacity-80 -mt-1" />
          </div>

        </footer>

      </div>
    </main>
  );
}
