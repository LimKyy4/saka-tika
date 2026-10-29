// src/views/modules/MengetikHurufView.jsx
// SAKA TIKA: 16:9 Wide Arcade Typing Console Refactor for "Mengetik Huruf" (Mini-Game 2)
// Standardized 4-Tier Vertical Rhythm, Non-Deterministic Random Initialization with ShuffleQueue,
// 3D Floating Word Exhibition Board, Chunky 3D Toy Keyboard, Saka & Tika Mascot Cheerleaders,
// Physical/On-Screen Key Synchronization, and Mandatory 2.2s Hold.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

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
} from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { speakWord, speakInstruction } from "../../utils/speechEngine.js";
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

// Standard kid-friendly QWERTY keyboard rows with alternating chunky pastel palettes
const KEYBOARD_ROWS = [
  {
    theme: "sky",
    bg: "from-sky-100 to-sky-200",
    border: "border-sky-300 border-b-sky-400",
    text: "#0284C7",
    keys: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  },
  {
    theme: "mint",
    bg: "from-emerald-100 to-teal-200",
    border: "border-teal-300 border-b-teal-400",
    text: "#0D9488",
    keys: ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  },
  {
    theme: "amber",
    bg: "from-amber-100 to-orange-200",
    border: "border-amber-300 border-b-amber-400",
    text: "#D97706",
    keys: ["Z", "X", "C", "V", "B", "N", "M"],
  },
];

export default function MengetikHurufView() {
  const { navigateTo, addStars } = useGame();
  const { playSfx } = useAudio();

  // Task 1: Non-deterministic shuffle queue initialization (Never always starts on index 0 / Apel)
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

  // Reset state on word change — STRICT ZERO AUTO-PLAY (No voice/audio on mount or round change)
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

  // Handle typing key (both virtual on-screen toy keys and physical keyboard inputs)
  const handleKeyPress = useCallback(
    (keyChar) => {
      if (isWordComplete) return;
      const upperKey = keyChar.toUpperCase();

      // Tactile physical keypress compression feedback
      setActivePressedKey(upperKey);
      setTimeout(() => setActivePressedKey(null), 180);
      playChalkSound(); // Mechanical wooden tick sound

      if (upperKey === expectedChar) {
        // Correct Key Pressed:
        setWobbleKey(null);
        playXylophoneNote(activeCharIndex); // Ascending musical scale per letter

        // Mascots jump with excitement
        setIsSakaJumping(true);
        setIsTikaJumping(true);
        setTimeout(() => {
          setIsSakaJumping(false);
          setIsTikaJumping(false);
        }, 500);

        if (activeCharIndex + 1 < wordChars.length) {
          // Advance to next letter in the word
          const nextIdx = activeCharIndex + 1;
          setActiveCharIndex(nextIdx);
          setSpeechBubbleText(`Bagus! Sekarang ketik huruf ${wordChars[nextIdx]}!`);
        } else {
          // Entire word cleared!
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

          // EXTENDED 2.2-SECOND COMPLETION HOLD: Exactly 2200ms before auto-advancing
          autoAdvanceTimer.current = setTimeout(() => {
            setWordIndex(shuffleQueueRef.current.next());
          }, 2200);
        }
      } else {
        // Incorrect Key Pressed: Harmless playful jelly wobble with rubber boing (NO harsh penalties)
        playRubberBoingSound();
        setWobbleKey(upperKey);
        setSpeechBubbleText(`Itu tombol ${upperKey}. Cari tombol ${expectedChar} ya!`);
        setTimeout(() => setWobbleKey(null), 450);
      }
    },
    [isWordComplete, expectedChar, activeCharIndex, wordChars, currentItem]
  );

  // Synchronize physical keyboard events with on-screen keyboard
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

  // Navigation handlers
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

  // Explicit user click audio pronunciation triggers (Strictly gated, zero autoplay)
  const handleSpeakWord = () => {
    playSfx("click");
    speakWord(currentItem.word);
    setSpeechBubbleText(`${currentItem.word}! Ayo ketik hurufnya!`);
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
      <header className="relative z-30 w-full px-4 pt-3 flex items-center justify-between max-w-7xl mx-auto flex-shrink-0">
        
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
          TIER 2: TARGET SPOTLIGHT BANNER (Clean Prominent Pill Card)
         ══════════════════════════════════════════════════════════ */}
      <div className="relative z-30 w-full px-4 mt-1 sm:mt-2 flex justify-center flex-shrink-0">
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 450, damping: 20 }}
          className="bg-white/92 backdrop-blur-md border-2 border-sky-300 border-b-4 border-sky-400 rounded-3xl px-3 py-1.5 sm:px-5 sm:py-2 shadow-lg flex items-center gap-3 sm:gap-5"
        >
          {/* Object Illustration Card (Clickable Pronunciation) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.08, rotate: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleSpeakWord}
            aria-label={`Dengarkan contoh kata ${currentItem.word}`}
            className="flex items-center gap-2 bg-gradient-to-b from-sky-50 to-indigo-50 border-2 border-sky-200 rounded-2xl px-2.5 py-1 shadow-xs cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center group-hover:scale-110 transition-transform">
              <WordIllustration
                illustrationKey={currentItem.illustrationKey}
                word={currentItem.word}
                color={currentItem.color}
                className="w-full h-full object-contain drop-shadow-xs"
              />
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-sans text-[10px] text-[#1B4965]/60 block leading-none font-semibold">
                Kata:
              </span>
              <span className="font-display font-black text-sm sm:text-base text-[#1B4965] leading-tight block">
                {currentItem.word}
              </span>
            </div>
          </motion.button>

          {/* Clean Prompt & Audio Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-display font-black text-xs sm:text-sm text-[#1B4965]">
              Ketik: <span className="text-[#0284C7] font-black">{currentItem.word.toUpperCase()}</span>
            </span>
            <button
              type="button"
              onClick={handleSpeakWord}
              aria-label="Bunyikan Kata"
              className="p-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-[#0284C7] cursor-pointer transition-colors"
              title="Dengarkan pengucapan kata"
            >
              <Volume2 size={14} />
            </button>
            <span className="font-sans text-xs text-[#1B4965]/70 font-semibold hidden md:inline ml-1">
              (Tekan huruf <strong className="text-[#0284C7] font-black">{expectedChar}</strong>)
            </span>
          </div>

          {/* Quick Toolbar: Reset & Skip */}
          <div className="flex items-center gap-1.5">
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleResetCurrentWord}
              aria-label="Ketik Ulang Kata"
              className="p-1.5 sm:p-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-[#1B4965] border border-stone-200 shadow-xs cursor-pointer flex-shrink-0"
              title="Ketik ulang kata ini dari awal"
            >
              <RotateCcw size={15} />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleNextWord}
              aria-label="Kata Berikutnya"
              className="p-1.5 sm:p-2 rounded-2xl bg-sky-100 hover:bg-sky-200 text-[#0284C7] border border-sky-300 shadow-xs cursor-pointer flex-shrink-0"
              title="Lanjut ke kata berikutnya"
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          TIER 3: INTERACTIVE CENTRAL STAGE (Dynamic 3D Target Letter Slots)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative z-20 flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 my-auto">
        
        {/* Dynamic 3D Letter Toy Blocks */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap">
          {wordChars.map((char, index) => {
            const isFilled = index < activeCharIndex || isWordComplete;
            const isActive = index === activeCharIndex && !isWordComplete;
            const isTargetWobble = isActive && wobbleKey;

            return (
              <motion.div
                key={`${char}-${index}`}
                animate={
                  isTargetWobble
                    ? { x: [-5, 5, -4, 4, 0] }
                    : isFilled
                    ? {
                        scale: [1, 1.15, 1],
                        rotate: [0, 2, -2, 0],
                      }
                    : isActive
                    ? {
                        scale: [1, 1.06, 1],
                        y: [0, -4, 0],
                      }
                    : {}
                }
                transition={
                  isActive
                    ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.35, ease: "easeOut" }
                }
                className={`relative w-14 h-16 sm:w-17 sm:h-19 lg:w-20 lg:h-22 rounded-2xl sm:rounded-3xl border-3 flex flex-col items-center justify-center font-display font-black text-2xl sm:text-3xl lg:text-4xl transition-all shadow-lg select-none ${
                  isFilled
                    ? "bg-gradient-to-b from-[#34D399] to-[#059669] border-teal-300 border-b-6 border-b-[#065F46] text-white shadow-emerald-200"
                    : isActive
                    ? "bg-white/95 border-3 border-[#0284C7] border-b-6 border-b-[#0369A1] text-[#0284C7] shadow-xl ring-4 ring-sky-300/60"
                    : "bg-white/65 backdrop-blur-xs border-2 border-stone-200 border-dashed text-stone-300"
                }`}
              >
                {/* Character Glyph */}
                <span>{isFilled ? char : isActive ? char : "?"}</span>

                {/* Completed Star Sparkle Badge */}
                {isFilled && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border-2 border-white flex items-center justify-center shadow-xs"
                  >
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </motion.div>
                )}

                {/* Active Slot Inviting Pulsing Beacon Indicator */}
                {isActive && (
                  <div className="absolute -bottom-2 inset-x-4 h-1 bg-[#0284C7] rounded-full animate-pulse" />
                )}
              </motion.div>
            );
          })}
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════
          TIER 4: BOTTOM CONTROLS & FLANKING MASCOTS (Virtual Keyboard)
         ══════════════════════════════════════════════════════════ */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto px-4 pb-2 sm:pb-3 flex items-end justify-between pointer-events-none flex-shrink-0">
        
        {/* Left Side: Saka Mascot on Grassy Mound */}
        <div className="flex flex-col items-center pointer-events-auto origin-bottom-left pb-1">
          {/* Dynamic Speech Bubble */}
          <AnimatePresence mode="wait">
            <motion.div
              key={speechBubbleText}
              initial={{ scale: 0.8, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="bg-white/95 border-2 border-[#1B4965]/20 rounded-2xl px-3 py-1.5 shadow-lg w-[150px] sm:w-[180px] text-center mb-1 pointer-events-none relative z-30"
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
            className="scale-75 sm:scale-80 origin-bottom"
          >
            <SakaMascot isWaving={isSakaJumping || isWordComplete} />
          </motion.div>

          {/* Grassy Mound Base */}
          <div className="w-24 sm:w-32 h-3 bg-[#4ADE80] rounded-full blur-[1px] opacity-80 -mt-2 shadow-xs" />
        </div>

        {/* Center: Chunky 3D Toy Keyboard */}
        <div className="flex-1 flex flex-col items-center justify-center pb-1 pointer-events-auto z-20 px-1 sm:px-3">
          
          {/* Word Complete Banner (if solved) */}
          <AnimatePresence>
            {isWordComplete && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-2xl shadow-xl border-2 border-white flex items-center gap-2 mb-2"
              >
                <Sparkles size={16} className="text-yellow-300" />
                <span className="font-display font-black text-xs sm:text-sm">
                  Luar Biasa! Kata {currentItem.word.toUpperCase()} Selesai! (+1 Bintang)
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyboard Rows */}
          <div className="w-full max-w-xl lg:max-w-2xl flex flex-col gap-1.5 sm:gap-2">
            {KEYBOARD_ROWS.map((rowObj, rowIdx) => (
              <div key={rowIdx} className="flex justify-center gap-1 sm:gap-1.5">
                {rowObj.keys.map((keyChar) => {
                  const isTarget = keyChar === expectedChar && !isWordComplete;
                  const isPressed = activePressedKey === keyChar;
                  const isKeyWobble = wobbleKey === keyChar;

                  return (
                    <motion.button
                      key={keyChar}
                      type="button"
                      disabled={isWordComplete}
                      whileHover={!isWordComplete ? { scale: 1.08, y: -2 } : {}}
                      whileTap={{ scale: 0.92, y: 3 }}
                      animate={
                        isKeyWobble
                          ? {
                              rotate: [-8, 8, -6, 6, 0],
                              scale: [1, 1.15, 0.9, 1.06, 1],
                            }
                          : isTarget
                          ? {
                              scale: [1, 1.05, 1],
                            }
                          : {}
                      }
                      transition={{ duration: 0.35 }}
                      onClick={() => handleKeyPress(keyChar)}
                      className={`h-9 sm:h-11 lg:h-12 rounded-xl sm:rounded-2xl font-display font-black text-xs sm:text-base border-2 border-b-4 transition-all flex items-center justify-center select-none cursor-pointer shadow-md ${
                        rowIdx === 0
                          ? "w-7 sm:w-10 lg:w-11"
                          : rowIdx === 1
                          ? "w-7 sm:w-10 lg:w-11"
                          : "w-8 sm:w-11 lg:w-12"
                      } ${
                        isPressed && isTarget
                          ? "bg-gradient-to-b from-emerald-400 to-teal-500 border-teal-300 border-b-teal-600 text-white translate-y-1"
                          : isKeyWobble
                          ? "bg-gradient-to-b from-rose-400 to-rose-500 border-rose-300 border-b-rose-600 text-white"
                          : isTarget
                          ? "bg-gradient-to-b from-sky-400 to-blue-500 border-sky-300 border-b-blue-600 text-white shadow-sky-200 shadow-lg ring-3 ring-sky-300/60 font-black"
                          : `bg-gradient-to-b ${rowObj.bg} ${rowObj.border} active:translate-y-1`
                      }`}
                      style={
                        !isTarget && !isPressed && !isKeyWobble
                          ? { color: rowObj.text }
                          : {}
                      }
                    >
                      {keyChar}
                    </motion.button>
                  );
                })}
              </div>
            ))}
          </div>

        </div>

        {/* Right Side: Tika Mascot on Grassy Mound */}
        <div className="flex flex-col items-center pointer-events-auto origin-bottom-right pb-1">
          {/* Tika Mascot Jumping / Cheering */}
          <motion.div
            animate={isTikaJumping ? { y: [-24, 0], scale: [1.12, 1] } : { y: [0, -4, 0] }}
            transition={
              isTikaJumping
                ? { duration: 0.45, type: "spring", stiffness: 500, delay: 0.05 }
                : { duration: 3.0, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
            }
            className="scale-75 sm:scale-80 origin-bottom"
          >
            <TikaMascot isCheering={isTikaJumping || isWordComplete} />
          </motion.div>

          {/* Grassy Mound Base */}
          <div className="w-24 sm:w-32 h-3 bg-[#4ADE80] rounded-full blur-[1px] opacity-80 -mt-2 shadow-xs" />
        </div>

      </footer>
    </main>
  );
}
