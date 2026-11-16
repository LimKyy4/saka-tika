// src/views/modules/MengetikHurufView.jsx
// SAKA TIKA: High-Impact Magenta Arcade Theme, Physical Keyboard Mode, Enlarged Clean Letter Slots, & 3-Level Missing-Letter System
// 1. Theme-Matched Magenta & Flamingo Rose Arcade Backdrop with Soft Bokeh & Corner Accents
// 2. Physical Keyboard Exclusive Mode (Zero Virtual QWERTY Keyboard, Clean Keydown Listener)
// 3. 3-Level x 3-Question Progression (Level 1: 1 Missing Letter, Level 2: 2 Missing Letters, Level 3: 3 Missing Letters)
// 4. Oversized 3D Letter Blocks with Blank Missing Slots (Strict Zero "?" Characters)
// 5. Clean Spotlight Target Word Card with Manual Audio Speaker Button (Strict Zero Auto-Play on Mount)
// 6. Grounded Saka & Tika Mascot Framing in Lower Corners with Soft Contact Shadows
// STRICT ZERO SCROLLBAR APP LOCK: h-screen w-screen overflow-hidden select-none.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector assets.

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  RotateCcw,
  Check,
  Keyboard,
  Sparkles,
  Trophy,
  Lock,
} from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { speakWord } from "../../utils/speechEngine.js";
import { ALPHABET_DATA, GAME_SAMPLES_50 } from "../../data/masterDataset.js";
import {
  playXylophoneNote,
  playRubberBoingSound,
  playHoverSound,
  playSuccessSound,
  playFanfareSound,
} from "../../utils/soundSynthesizer.js";

// Helper: generate 9 unique non-repeating words for the 3-level session (3 words per level)
function selectSessionWords(pool) {
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 9);
}

// Helper: randomly pick `count` distinct missing indices within wordLength (0 to wordLength - 1), sorted ascending
function sampleMissingIndices(wordLength, count) {
  const actualCount = Math.min(count, Math.max(1, wordLength - 1));
  const indices = Array.from({ length: wordLength }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, actualCount).sort((a, b) => a - b);
}

export default function MengetikHurufView() {
  const { addStars } = useGame();
  const { playSfx } = useAudio();

  // Curated Indonesian vocabulary pool (length >= 4 and <= 8)
  const candidateWords = useMemo(() => {
    const set = new Set();
    const list = [];
    const all = [...ALPHABET_DATA, ...GAME_SAMPLES_50];
    for (const item of all) {
      if (!item?.word) continue;
      const clean = item.word.trim().toUpperCase();
      if (clean.length >= 4 && clean.length <= 8 && /^[A-Z]+$/.test(clean)) {
        if (!set.has(clean)) {
          set.add(clean);
          list.push(clean);
        }
      }
    }
    return list;
  }, []);

  // 9 randomized words for the session
  const [sessionWords, setSessionWords] = useState(() => selectSessionWords(candidateWords));

  // Game state: Level (1, 2, 3) & Question Index in Level (0, 1, 2)
  const [level, setLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);

  // Solved missing indices for current question
  const [solvedIndices, setSolvedIndices] = useState([]);
  const [isWordComplete, setIsWordComplete] = useState(false);
  const [wobbleSlot, setWobbleSlot] = useState(null);
  const [isMascotCheering, setIsMascotCheering] = useState(false);

  // Level-up celebration toast & grand champion modal
  const [levelUpToast, setLevelUpToast] = useState(null);
  const [isChampion, setIsChampion] = useState(false);

  const autoAdvanceTimer = useRef(null);

  // Current active word for the current (level, questionIndex)
  // Level 1: words 0, 1, 2
  // Level 2: words 3, 4, 5
  // Level 3: words 6, 7, 8
  const currentWordIndex = (level - 1) * 3 + questionIndex;
  const currentWord = useMemo(() => {
    return sessionWords[currentWordIndex] || sessionWords[0] || "POHON";
  }, [sessionWords, currentWordIndex]);

  // Missing letter indices for this question (cached per question)
  const [missingIndices, setMissingIndices] = useState(() => {
    return sampleMissingIndices(currentWord.length, level);
  });

  // Re-generate missing indices whenever currentWord or level changes
  useEffect(() => {
    setMissingIndices(sampleMissingIndices(currentWord.length, level));
    setSolvedIndices([]);
    setIsWordComplete(false);
    setWobbleSlot(null);
    clearTimeout(autoAdvanceTimer.current);

    return () => clearTimeout(autoAdvanceTimer.current);
  }, [currentWord, level]);

  // Active missing index: the first index in missingIndices that is not yet solved
  const activeMissingIndex = useMemo(() => {
    return missingIndices.find((idx) => !solvedIndices.includes(idx));
  }, [missingIndices, solvedIndices]);

  // Expected character for the active missing slot
  const expectedChar = activeMissingIndex !== undefined ? currentWord[activeMissingIndex] : "";

  // Trigger celebration fireworks confetti
  const triggerConfettiRockets = () => {
    const end = Date.now() + 1500;
    const colors = ["#FDE047", "#F43F5E", "#38BDF8", "#34D399", "#C084FC", "#FB923C"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0.05, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 0.95, y: 0.7 },
        colors,
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Keystroke validation logic for physical keyboard input
  const validateKey = useCallback(
    (pressedChar) => {
      if (isWordComplete || isChampion || activeMissingIndex === undefined) return;

      if (pressedChar === expectedChar) {
        // Correct key pressed!
        const newSolved = [...solvedIndices, activeMissingIndex];
        setSolvedIndices(newSolved);
        playXylophoneNote(newSolved.length);

        // Mascots cheer
        setIsMascotCheering(true);
        setTimeout(() => setIsMascotCheering(false), 600);

        // Check if all missing letters for this word are solved
        if (newSolved.length >= missingIndices.length) {
          setIsWordComplete(true);
          playSuccessSound();
          playFanfareSound();
          addStars(1);
          triggerConfettiRockets();

          // Hold completed word for 2.0 seconds (2000ms) before advancing
          autoAdvanceTimer.current = setTimeout(() => {
            if (questionIndex < 2) {
              // Advance to next question in current level
              setQuestionIndex((prev) => prev + 1);
            } else if (level < 3) {
              // Level Completed! Advance to next Level
              const nextLevel = level + 1;
              setLevelUpToast(`Level ${level} Selesai! Lanjut ke Level ${nextLevel}!`);
              setTimeout(() => setLevelUpToast(null), 1800);
              setLevel(nextLevel);
              setQuestionIndex(0);
            } else {
              // Level 3 Question 3 finished: 3-Level Champion!
              setIsChampion(true);
              triggerConfettiRockets();
            }
          }, 2000);
        }
      } else {
        // Incorrect key: soft rubber bounce + gentle wobble on active slot
        playRubberBoingSound();
        setWobbleSlot(activeMissingIndex);
        setTimeout(() => setWobbleSlot(null), 450);
      }
    },
    [
      isWordComplete,
      isChampion,
      activeMissingIndex,
      expectedChar,
      solvedIndices,
      missingIndices,
      questionIndex,
      level,
      addStars,
    ]
  );

  // Synchronize physical keyboard events (case-insensitive, ignore modifier combos)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isWordComplete || isChampion) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key && e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        validateKey(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [validateKey, isWordComplete, isChampion]);

  // Manual reset current word (clears solved missing letters for retry)
  const handleResetCurrentWord = useCallback(() => {
    playHoverSound();
    clearTimeout(autoAdvanceTimer.current);
    setSolvedIndices([]);
    setIsWordComplete(false);
    setWobbleSlot(null);
  }, []);

  // Manual audio word pronunciation (Strict zero auto-play on mount)
  const handleSpeakTargetWord = () => {
    playSfx("click");
    speakWord(currentWord);
  };

  // Restart game after Grand Champion celebration
  const handleRestartGame = () => {
    playHoverSound();
    const newWords = selectSessionWords(candidateWords);
    setSessionWords(newWords);
    setLevel(1);
    setQuestionIndex(0);
    setSolvedIndices([]);
    setIsWordComplete(false);
    setIsChampion(false);
    setLevelUpToast(null);
  };

  // Floating background bokeh dots
  const bokehDots = useMemo(
    () => [
      { left: "10%", top: "18%", size: 14, color: "#FACC15", duration: 5.5, delay: 0 },
      { left: "22%", top: "72%", size: 18, color: "#FFFFFF", duration: 6.2, delay: 1.2 },
      { left: "35%", top: "25%", size: 12, color: "#F9A8D4", duration: 4.8, delay: 0.6 },
      { left: "68%", top: "16%", size: 16, color: "#FACC15", duration: 5.8, delay: 1.5 },
      { left: "80%", top: "68%", size: 20, color: "#FFFFFF", duration: 6.5, delay: 0.4 },
      { left: "88%", top: "30%", size: 14, color: "#F9A8D4", duration: 5.2, delay: 1.8 },
    ],
    []
  );

  return (
    <main className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none p-1 sm:p-2">
      {/* ── 1. Theme-Matched Magenta & Flamingo Rose Arcade Backdrop ── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Base Atmospheric Multi-Stop Linear Gradient */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(180deg, #E92B7A 0%, #D81B60 30%, #BE185D 60%, #9D174D 85%, #831843 100%)",
          }}
        />

        {/* Soft Warm Pink-White Radial Spotlight Glow Centered Behind Word Blocks */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% 48%, rgba(255, 235, 243, 0.45) 0%, rgba(233, 43, 122, 0.25) 50%, rgba(131, 24, 67, 0.75) 100%)",
          }}
        />

        {/* Floating Pastel Bokeh Dots Scattered Gently */}
        {bokehDots.map((dot, idx) => (
          <motion.div
            key={`dot-${idx}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: dot.left,
              top: dot.top,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              backgroundColor: dot.color,
              boxShadow: `0 0 10px ${dot.color}`,
              opacity: 0.35,
            }}
            animate={{
              y: [-8, 8, -8],
              scale: [0.9, 1.15, 0.9],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              delay: dot.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Top-Left Corner Accent: Cyan Musical Note with Golden Sparkle Ring */}
        <div className="absolute top-2 left-3 sm:top-4 sm:left-6 w-20 h-20 sm:w-24 sm:h-24 opacity-35 pointer-events-none drop-shadow-md z-0">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <circle cx="50" cy="50" r="32" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="4 4" />
            <path
              d="M 42 62 C 37 62 33 66 33 71 C 33 76 37 80 42 80 C 47 80 51 76 51 71 L 51 32 L 72 26 L 72 45 C 67 45 63 49 63 54 C 63 59 67 63 72 63 C 77 63 81 59 81 54 L 81 18 L 42 26 Z"
              fill="#38BDF8"
              stroke="#0284C7"
              strokeWidth="2"
            />
            <circle cx="28" cy="28" r="3.5" fill="#FEF08A" />
            <circle cx="78" cy="78" r="3" fill="#FEF08A" />
          </svg>
        </div>

        {/* Top-Right Corner Accent: Miniature Keycap Silhouettes */}
        <div className="absolute top-3 right-4 sm:top-4 sm:right-6 w-22 h-18 opacity-35 pointer-events-none drop-shadow-md z-0">
          <svg viewBox="0 0 100 80" fill="none" className="w-full h-full">
            <g transform="translate(10, 10)">
              <rect x="0" y="0" width="28" height="28" rx="6" fill="#FCE7F3" stroke="#F472B6" strokeWidth="2" />
              <rect x="0" y="24" width="28" height="4" rx="2" fill="#DB2777" />
              <text x="14" y="18" textAnchor="middle" fontSize="13" fontWeight="900" fill="#9D174D" fontFamily="Fredoka">A</text>
            </g>
            <g transform="translate(44, 16)">
              <rect x="0" y="0" width="28" height="28" rx="6" fill="#FEF08A" stroke="#FBBF24" strokeWidth="2" />
              <rect x="0" y="24" width="28" height="4" rx="2" fill="#D97706" />
              <text x="14" y="18" textAnchor="middle" fontSize="13" fontWeight="900" fill="#78350F" fontFamily="Fredoka">B</text>
            </g>
          </svg>
        </div>

        {/* Bottom Silhouette Ground Wave */}
        <div className="absolute bottom-0 inset-x-0 h-20 overflow-hidden pointer-events-none opacity-20">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 40 Q360 80 720 30 T1440 50 L1440 120 L0 120 Z" fill="#70072B" />
            <path d="M0 65 Q420 20 840 60 T1440 40 L1440 120 L0 120 Z" fill="#4A041C" />
          </svg>
        </div>
      </div>

      {/* ── 2. Subtle Dark Contrast Tint ─────────────────────── */}
      <div className="fixed inset-0 bg-black/10 pointer-events-none z-0" />

      {/* ── 3. Main Workspace Container ─────────────────────── */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col justify-between max-w-7xl w-full mx-auto">
        
        {/* ── Top Header Section: Level Badges & Question Progress Bar ── */}
        <header className="w-full px-2 mt-1 sm:mt-1.5 flex flex-col items-center flex-shrink-0 z-30 gap-1.5">
          {/* Level Badges & Question Pips Bar */}
          <div className="bg-white/95 backdrop-blur-md border-2 border-pink-200 shadow-md rounded-2xl px-4 py-1.5 flex items-center justify-between gap-4 sm:gap-8 max-w-2xl w-full">
            
            {/* 3 Level Badges */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {[1, 2, 3].map((lvlNum) => {
                const isCompleted = level > lvlNum || isChampion;
                const isActive = level === lvlNum && !isChampion;
                const isLocked = level < lvlNum && !isChampion;

                return (
                  <div
                    key={lvlNum}
                    className={`px-2.5 sm:px-3 py-1 rounded-xl font-display font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                      isCompleted
                        ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-xs border border-emerald-300"
                        : isActive
                        ? "bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 text-white shadow-md ring-2 ring-amber-300 border border-white scale-105"
                        : "bg-stone-100 text-slate-400 border border-stone-200"
                    }`}
                  >
                    <span>Level {lvlNum}</span>
                    {isCompleted ? (
                      <span className="w-4 h-4 rounded-full bg-white text-emerald-600 flex items-center justify-center">
                        <Check size={10} strokeWidth={3.5} />
                      </span>
                    ) : isLocked ? (
                      <Lock size={11} strokeWidth={2.5} className="text-slate-400" />
                    ) : (
                      <span className="text-[10px] font-sans font-bold bg-white/30 px-1 rounded">
                        {lvlNum} Huruf
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Question Progress Counter: Soal X / 3 */}
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xs sm:text-sm text-slate-700 whitespace-nowrap">
                Soal {questionIndex + 1} / 3
              </span>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((qPip) => {
                  const isDone = qPip < questionIndex || isWordComplete;
                  const isCurrent = qPip === questionIndex && !isWordComplete;

                  return (
                    <div
                      key={qPip}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all flex items-center justify-center ${
                        isDone
                          ? "bg-emerald-500 border border-white text-white shadow-xs"
                          : isCurrent
                          ? "bg-amber-400 border border-white ring-2 ring-amber-300 animate-pulse"
                          : "bg-white/80 border-2 border-dashed border-pink-300"
                      }`}
                    >
                      {isDone && <Check size={8} strokeWidth={3.5} />}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Clean Centered Target Word Card (Oversized, Bold Fredoka, Manual Audio Button) */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="bg-white/95 border-3 sm:border-4 border-pink-200 shadow-[0_8px_0_rgba(131,24,67,0.3)] rounded-3xl px-6 py-2 sm:py-2.5 flex items-center justify-between gap-4 max-w-2xl w-full"
          >
            {/* Left: Speaker Action Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, rotate: -4 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleSpeakTargetWord}
              aria-label={`Dengarkan pengucapan kata ${currentWord}`}
              className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-sky-400 to-blue-500 text-white shadow-md border border-white cursor-pointer transition-transform flex items-center justify-center"
              title="Ketuk untuk mendengarkan pengucapan kata"
            >
              <Volume2 size={20} className="stroke-[2.5]" />
            </motion.button>

            {/* Center: Oversized Bold Target Word */}
            <div className="flex-1 text-center min-w-0">
              <span className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-800 tracking-[0.14em] uppercase drop-shadow-xs">
                {currentWord}
              </span>
            </div>

            {/* Right: Reset Word Action Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, rotate: 8 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleResetCurrentWord}
              aria-label="Ketik ulang kata ini dari awal"
              className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 text-amber-950 shadow-md border border-white cursor-pointer transition-transform flex items-center justify-center"
              title="Ketik ulang kata ini dari awal"
            >
              <RotateCcw size={19} className="stroke-[2.5]" />
            </motion.button>
          </motion.div>
        </header>

        {/* ── Center Stage: Oversized 3D Letter Blocks (Zero "?" Characters) ── */}
        <section className="relative z-20 flex-1 min-h-0 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 py-2">
          
          {/* Blocks Container */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 md:gap-5 flex-wrap">
            {currentWord.split("").map((char, index) => {
              const isMissing = missingIndices.includes(index);
              const isSolved = isMissing && (solvedIndices.includes(index) || isWordComplete);
              const isActiveMissing = isMissing && index === activeMissingIndex && !isWordComplete;
              const isUpcomingMissing = isMissing && !isSolved && !isActiveMissing;
              const isGiven = !isMissing;
              const isWobble = wobbleSlot === index;

              return (
                <motion.div
                  key={`${currentWord}-${index}`}
                  animate={
                    isWobble
                      ? { x: [-6, 6, -4, 4, 0] }
                      : isSolved
                      ? {
                          scale: [0.75, 1.14, 1],
                          rotate: [0, -3, 3, 0],
                        }
                      : isActiveMissing
                      ? {
                          scale: [1, 1.05, 1],
                          y: [0, -3, 0],
                        }
                      : {}
                  }
                  transition={
                    isWobble
                      ? { duration: 0.4, ease: "easeInOut" }
                      : isSolved
                      ? { duration: 0.45, ease: "easeOut" }
                      : isActiveMissing
                      ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.3 }
                  }
                  className={`relative w-18 h-22 sm:w-22 sm:h-26 md:w-24 md:h-28 lg:w-28 lg:h-32 rounded-3xl font-display font-black text-4xl sm:text-5xl md:text-6xl flex items-center justify-center select-none transition-all ${
                    isGiven
                      ? "bg-[#FFFDF9] border-3 sm:border-4 border-pink-200 border-b-6 sm:border-b-8 border-b-pink-300 text-slate-800 shadow-[0_8px_20px_rgba(80,7,36,0.25)]"
                      : isSolved
                      ? "bg-gradient-to-b from-emerald-400 to-teal-500 border-3 sm:border-4 border-emerald-300 border-b-6 sm:border-b-8 border-b-teal-700 text-white shadow-lg"
                      : isActiveMissing
                      ? "bg-amber-50 border-3 sm:border-4 border-amber-300 border-b-6 sm:border-b-8 border-b-amber-500 shadow-[0_0_28px_rgba(253,224,71,0.85)] ring-4 ring-amber-300/80"
                      : "bg-white/80 border-3 sm:border-4 border-dashed border-pink-300/80 shadow-inner"
                  }`}
                >
                  {/* Letter Glyph inside slot */}
                  {isGiven ? (
                    <span className="drop-shadow-xs">{char}</span>
                  ) : isSolved ? (
                    <span className="drop-shadow-md">{char}</span>
                  ) : isUpcomingMissing ? (
                    /* Blank upcoming slot (Zero "?" Character) */
                    <span className="w-3.5 h-3.5 rounded-full bg-pink-200/70" />
                  ) : null}

                  {/* Active Slot: Horizontal Pulsing Cursor Bar (Zero "?" Character) */}
                  {isActiveMissing && (
                    <div className="absolute bottom-3 sm:bottom-3.5 inset-x-4 sm:inset-x-5 h-1.5 sm:h-2 bg-amber-500 rounded-full animate-pulse shadow-xs" />
                  )}

                  {/* Solved Slot: Green Checkmark Badge on Top-Right */}
                  {isSolved && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-md"
                    >
                      <Check size={12} strokeWidth={3.5} />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Physical Keyboard Instruction Cue Pill */}
          <div className="mt-4 sm:mt-5 bg-white/95 text-slate-800 border-2 border-pink-200 shadow-md rounded-2xl px-4 py-1.5 flex items-center gap-2 pointer-events-none">
            <Keyboard size={16} className="text-pink-600 stroke-[2.5]" />
            <span className="font-display font-bold text-xs sm:text-sm text-slate-800">
              Tekan huruf yang hilang pada keyboard
            </span>
          </div>

        </section>

        {/* ── 4. Balanced Mascot Framing (Saka & Tika in Lower Corners) ── */}
        {/* Saka on Bottom-Left */}
        <div className="fixed bottom-0 left-2 sm:left-4 z-20 pointer-events-none select-none flex flex-col items-center">
          <motion.img
            src="/assets/saka-maskot-1-cutout.png"
            alt="Saka Maskot"
            animate={
              isWordComplete || isChampion
                ? { y: [-20, 0, -12, 0], scale: [1, 1.08, 1] }
                : isMascotCheering
                ? { y: [-15, 0, -8, 0], scale: [1, 1.05, 1] }
                : { y: [0, -3, 0] }
            }
            transition={
              isWordComplete || isChampion
                ? { duration: 0.8, repeat: 2, ease: "easeOut" }
                : isMascotCheering
                ? { duration: 0.6, ease: "easeOut" }
                : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
            }
            className="h-28 sm:h-32 lg:h-36 w-auto object-contain object-bottom drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] pointer-events-none"
            style={{ imageRendering: "-webkit-optimize-contrast" }}
          />
          <div className="w-16 h-3 bg-[#4A041C]/40 rounded-full blur-[2px] -mt-1" />
        </div>

        {/* Tika on Bottom-Right */}
        <div className="fixed bottom-0 right-2 sm:right-4 z-20 pointer-events-none select-none flex flex-col items-center">
          <motion.img
            src="/assets/tika-maskot-1-cutout.png"
            alt="Tika Maskot"
            animate={
              isWordComplete || isChampion
                ? { y: [-22, 0, -14, 0], scale: [1, 1.08, 1] }
                : isMascotCheering
                ? { y: [-16, 0, -9, 0], scale: [1, 1.05, 1] }
                : { y: [0, -3.5, 0] }
            }
            transition={
              isWordComplete || isChampion
                ? { duration: 0.8, delay: 0.08, repeat: 2, ease: "easeOut" }
                : isMascotCheering
                ? { duration: 0.6, delay: 0.08, ease: "easeOut" }
                : { duration: 3.5, repeat: Infinity, delay: 0.4, ease: "easeInOut" }
            }
            className="h-28 sm:h-32 lg:h-36 w-auto object-contain object-bottom drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] pointer-events-none"
            style={{ imageRendering: "-webkit-optimize-contrast" }}
          />
          <div className="w-16 h-3 bg-[#4A041C]/40 rounded-full blur-[2px] -mt-1" />
        </div>

        {/* ── 5. Level-Up Celebratory Toast (Level 1 -> 2 -> 3 Transition) ── */}
        <AnimatePresence>
          {levelUpToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className="fixed top-20 inset-x-0 mx-auto w-fit z-50 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white px-6 py-2.5 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-2 pointer-events-none"
            >
              <Sparkles size={20} className="text-yellow-300 animate-spin" />
              <span className="font-display font-black text-sm sm:text-base">
                {levelUpToast}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 6. Grand 3-Level Champion Celebration Modal (Zero Stars, Zero Emojis) ── */}
        <AnimatePresence>
          {isChampion && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
              {/* Semi-translucent backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/45 backdrop-blur-xs"
              />

              {/* Main Champion Card */}
              <motion.div
                initial={{ scale: 0.35, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
                className="relative z-10 flex flex-col items-center justify-center text-center p-6 sm:p-8 max-w-lg w-full bg-gradient-to-b from-[#FFFDF8] via-[#FFF7ED] to-[#FEF3C7] rounded-[2.5rem] border-4 border-amber-300 border-b-8 border-b-amber-500 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-8 ring-amber-400/50"
              >
                {/* Rotating Sunburst Rays Background */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="absolute w-72 h-72 sm:w-80 sm:h-80 -z-10 pointer-events-none opacity-40"
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full fill-amber-300">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <polygon
                        key={i}
                        points="100,100 92,0 108,0"
                        transform={`rotate(${i * 30} 100 100)`}
                      />
                    ))}
                  </svg>
                </motion.div>

                {/* 3D Golden Champion Trophy Vector (Zero Stars, Zero Emojis) */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 mb-2 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
                    <defs>
                      <linearGradient id="trophyGold" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FDE047" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#D97706" />
                      </linearGradient>
                    </defs>
                    {/* Trophy Cup */}
                    <path
                      d="M 28 22 L 72 22 L 68 52 C 68 62 58 68 50 68 C 42 68 32 62 32 52 Z"
                      fill="url(#trophyGold)"
                      stroke="#B45309"
                      strokeWidth="2.5"
                    />
                    {/* Handles */}
                    <path
                      d="M 28 30 C 18 30 18 48 28 50"
                      stroke="url(#trophyGold)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 72 30 C 82 30 82 48 72 50"
                      stroke="url(#trophyGold)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Stem & Base */}
                    <rect x="46" y="68" width="8" height="14" fill="#D97706" />
                    <rect x="30" y="82" width="40" height="10" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="2" />
                    {/* Rim Highlight */}
                    <ellipse cx="50" cy="22" rx="22" ry="4" fill="#FEF08A" stroke="#B45309" strokeWidth="2" />
                  </svg>
                </div>

                {/* Champion Title */}
                <h2 className="font-display font-black text-3xl sm:text-4xl text-[#9D174D] tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(251,191,36,0.5)]">
                  JUARA MENGETIK!
                </h2>

                {/* Subtitle */}
                <p className="font-sans font-black text-sm sm:text-base text-amber-900 mt-2 leading-relaxed">
                  Luar Biasa! Kamu Berhasil Menyelesaikan Semua 3 Level dan 9 Kata dengan Sempurna!
                </p>

                {/* "Main Lagi" Action Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleRestartGame}
                  className="mt-5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-display font-black text-base sm:text-lg shadow-xl border-2 border-white flex items-center gap-2 cursor-pointer transition-transform"
                >
                  <RotateCcw size={18} className="stroke-[2.5]" />
                  <span>Main Lagi</span>
                </motion.button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
