// src/views/modules/MelengkapiKataView.jsx
// SAKA TIKA: "Melengkapi Kata" - Level Gate, Two-Zone Board (Wooden Question vs. Answer Dock),
// and Dynamic Randomized Missing-Letter Positions.
// STRICT ZERO SCROLLBAR APP LOCK: h-screen w-screen overflow-hidden select-none.
// STRICT ZERO EMOJIS & ZERO STAR ICONS POLICY: Only lucide-react icons (no Star) and custom vectors.
// STRICT AUDIO GATING: Never auto-play voice narration or SFX on initial mount or round start.

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  RotateCcw,
  Shuffle,
  Check,
  Puzzle,
  Layers,
  Play,
} from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { speakWord, speakLetter } from "../../utils/speechEngine.js";
import {
  playSuccessSound,
  playFanfareSound,
  playRubberBoingSound,
  playHoverSound,
  playClickSound,
  playXylophoneNote,
  playSunChime,
} from "../../utils/soundSynthesizer.js";
import { ShuffleQueue } from "../../utils/shuffleQueue.js";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";

const TOTAL_QUESTIONS = 5;

const LEVEL_CARDS = [
  {
    lvl: 1,
    badge: "MUDAH",
    title: "LEVEL 1",
    cardClass:
      "bg-gradient-to-b from-[#0369A1] to-[#1D4ED8] border-4 border-white border-b-[8px] border-b-[#1E3A8A] text-white",
    badgeClass: "bg-white text-[#0369A1]",
  },
  {
    lvl: 2,
    badge: "SEDANG",
    title: "LEVEL 2",
    cardClass:
      "bg-gradient-to-b from-[#FDE047] via-[#FBBF24] to-[#F59E0B] border-4 border-white border-b-[8px] border-b-[#B45309] text-[#0F172A]",
    badgeClass: "bg-white text-[#92400E]",
  },
  {
    lvl: 3,
    badge: "TANTANGAN",
    title: "LEVEL 3",
    cardClass:
      "bg-gradient-to-b from-[#E11D48] to-[#BE185D] border-4 border-white border-b-[8px] border-b-[#831843] text-white",
    badgeClass: "bg-white text-[#9F1239]",
  },
];

// Curated concrete Indonesian words (all backed by /assets/illustrations/*.png)
const WORKSHOP_WORD_POOL = [
  // 4 Letters (Level 1 & Level 2)
  { word: "APEL", illustrationKey: "apel", color: "#EF4444" },
  { word: "AYAM", illustrationKey: "ayam", color: "#F59E0B" },
  { word: "AWAN", illustrationKey: "awan", color: "#38BDF8" },
  { word: "BOLA", illustrationKey: "bola", color: "#3B82F6" },
  { word: "BUKU", illustrationKey: "buku", color: "#6366F1" },
  { word: "BAJU", illustrationKey: "baju", color: "#EC4899" },
  { word: "CERI", illustrationKey: "ceri", color: "#E11D48" },
  { word: "DADU", illustrationKey: "dadu", color: "#F59E0B" },
  { word: "DAUN", illustrationKey: "daun", color: "#10B981" },
  { word: "FOTO", illustrationKey: "foto", color: "#8B5CF6" },
  { word: "GIGI", illustrationKey: "gigi", color: "#14B8A6" },
  { word: "IKAN", illustrationKey: "ikan", color: "#0EA5E9" },
  { word: "KUDA", illustrationKey: "kuda", color: "#8B5CF6" },
  { word: "KAKI", illustrationKey: "kaki", color: "#EC4899" },
  { word: "MATA", illustrationKey: "mata", color: "#F59E0B" },
  { word: "MEJA", illustrationKey: "meja", color: "#D97706" },
  { word: "OBOR", illustrationKey: "obor", color: "#EF4444" },
  { word: "ROTI", illustrationKey: "roti", color: "#D97706" },
  { word: "RODA", illustrationKey: "roda", color: "#3B82F6" },
  { word: "SAPI", illustrationKey: "sapi", color: "#10B981" },
  { word: "SUSU", illustrationKey: "susu", color: "#06B6D4" },
  { word: "TOPI", illustrationKey: "topi", color: "#F59E0B" },
  { word: "YOYO", illustrationKey: "yoyo", color: "#F59E0B" },

  // 5 Letters (Level 1, 2, & 3)
  { word: "BEBEK", illustrationKey: "bebek", color: "#10B981" },
  { word: "BULAN", illustrationKey: "bulan", color: "#8B5CF6" },
  { word: "BUNGA", illustrationKey: "bunga", color: "#EC4899" },
  { word: "LAMPU", illustrationKey: "lampu", color: "#F59E0B" },
  { word: "EMBER", illustrationKey: "ember", color: "#3B82F6" },
  { word: "GAJAH", illustrationKey: "gajah", color: "#64748B" },
  { word: "GITAR", illustrationKey: "gitar", color: "#D97706" },
  { word: "HUJAN", illustrationKey: "hujan", color: "#0EA5E9" },
  { word: "JERUK", illustrationKey: "jeruk", color: "#F97316" },
  { word: "KAPAL", illustrationKey: "kapal", color: "#06B6D4" },
  { word: "KURSI", illustrationKey: "kursi", color: "#10B981" },
  { word: "MOBIL", illustrationKey: "mobil", color: "#EF4444" },
  { word: "NANAS", illustrationKey: "nanas", color: "#F59E0B" },
  { word: "POHON", illustrationKey: "pohon", color: "#10B981" },
  { word: "RUMAH", illustrationKey: "rumah", color: "#EF4444" },
  { word: "UDANG", illustrationKey: "udang", color: "#F97316" },
  { word: "WAJAN", illustrationKey: "wajan", color: "#F59E0B" },
  { word: "ZEBRA", illustrationKey: "zebra", color: "#334155" },

  // 6 Letters (Level 1, 2, & 3)
  { word: "KERETA", illustrationKey: "kereta", color: "#3B82F6" },
  { word: "PISANG", illustrationKey: "pisang", color: "#EAB308" },
  { word: "PAYUNG", illustrationKey: "payung", color: "#EF4444" },
  { word: "SEPATU", illustrationKey: "sepatu", color: "#8B5CF6" },
  { word: "WAYANG", illustrationKey: "wayang", color: "#D97706" },
];

// Vibrant high-contrast toy choice palettes (all use #0F172A text)
const TOY_CHOICE_PALETTES = [
  {
    bg: "from-[#7DD3FC] via-[#38BDF8] to-[#0EA5E9]",
    border: "border-[#BAE6FD] border-b-[#0369A1]",
    shadow: "shadow-sky-400/35",
  },
  {
    bg: "from-[#FDE047] via-[#FBBF24] to-[#F59E0B]",
    border: "border-[#FEF08A] border-b-[#B45309]",
    shadow: "shadow-amber-400/35",
  },
  {
    bg: "from-[#F9A8D4] via-[#F472B6] to-[#EC4899]",
    border: "border-[#FBCFE8] border-b-[#9D174D]",
    shadow: "shadow-rose-400/35",
  },
  {
    bg: "from-[#6EE7B7] via-[#34D399] to-[#10B981]",
    border: "border-[#A7F3D0] border-b-[#047857]",
    shadow: "shadow-emerald-400/35",
  },
];

function generateDistractors(targetLetter, count = 3) {
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const available = allLetters.filter((l) => l !== targetLetter.toUpperCase());
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function MelengkapiKataView() {
  const { addStars } = useGame();
  const { playSfx } = useAudio();

  // Initial level gate (null shows Level 1-3 selection cards first)
  const [selectedLevel, setSelectedLevel] = useState(null);
  const activeLevel = selectedLevel ?? 1;

  // Level-appropriate word pool (Level 3 requires >=5 letters so >=2 clues stay visible)
  const filteredPool = useMemo(() => {
    if (activeLevel === 3) {
      return WORKSHOP_WORD_POOL.filter((w) => w.word.length >= 5);
    }
    return WORKSHOP_WORD_POOL.filter((w) => w.word.length >= 4);
  }, [activeLevel]);

  const shuffleQueueRef = useRef(null);
  if (!shuffleQueueRef.current || shuffleQueueRef.current.length !== filteredPool.length) {
    shuffleQueueRef.current = new ShuffleQueue(filteredPool.length);
  }

  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(() => {
    return shuffleQueueRef.current ? shuffleQueueRef.current.next() : 0;
  });

  const [missingIndices, setMissingIndices] = useState([]);
  const [currentMissingStep, setCurrentMissingStep] = useState(0);
  const [solvedIndices, setSolvedIndices] = useState([]);
  const [options, setOptions] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wobbleLetter, setWobbleLetter] = useState(null);
  const [isMascotCheering, setIsMascotCheering] = useState(false);
  const [isChampion, setIsChampion] = useState(false);

  const [isIllustrationBouncing, setIsIllustrationBouncing] = useState(false);
  const [spinPuzzleIdx, setSpinPuzzleIdx] = useState(null);
  const [tappedTileIdx, setTappedTileIdx] = useState(null);

  const trayBoardRef = useRef(null);
  const activeSlotRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [isDraggingAny, setIsDraggingAny] = useState(false);
  const lastBlankPatternRef = useRef("");
  const autoAdvanceTimer = useRef(null);
  const confettiRafRef = useRef(null);

  const currentItem = useMemo(() => {
    if (!filteredPool || filteredPool.length === 0) {
      return { word: "APEL", illustrationKey: "apel", color: "#EF4444" };
    }
    return filteredPool[currentIndex % filteredPool.length];
  }, [filteredPool, currentIndex]);

  const currentWordChars = useMemo(() => {
    return currentItem.word.split("");
  }, [currentItem.word]);

  const activeMissingIndex = useMemo(() => {
    return missingIndices[currentMissingStep] ?? -1;
  }, [missingIndices, currentMissingStep]);

  const expectedLetter = useMemo(() => {
    if (activeMissingIndex >= 0 && activeMissingIndex < currentWordChars.length) {
      return currentWordChars[activeMissingIndex];
    }
    return "";
  }, [currentWordChars, activeMissingIndex]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
      if (confettiRafRef.current) {
        cancelAnimationFrame(confettiRafRef.current);
        confettiRafRef.current = null;
      }
    };
  }, []);

  // Dynamically pick randomized start/middle/end blank positions without repeating consecutively
  const setupRound = useCallback((item, currentLevel) => {
    const chars = item.word.split("");
    const targetCount = Math.min(currentLevel, Math.max(1, chars.length - 2));
    const allIndices = Array.from({ length: chars.length }, (_, i) => i);

    let pickedMissing = [];
    let attempts = 0;
    do {
      const shuffled = [...allIndices].sort(() => 0.5 - Math.random());
      pickedMissing = shuffled.slice(0, targetCount).sort((a, b) => a - b);
      attempts++;
    } while (
      pickedMissing.join(",") === lastBlankPatternRef.current &&
      attempts < 10
    );
    lastBlankPatternRef.current = pickedMissing.join(",");

    setMissingIndices(pickedMissing);
    setCurrentMissingStep(0);
    setSolvedIndices([]);
    setIsAnswered(false);
    setIsCorrect(false);
    setWobbleLetter(null);
    setIsMascotCheering(false);
    setTappedTileIdx(null);

    const firstTarget = chars[pickedMissing[0]] || "A";
    const distractors = generateDistractors(firstTarget, 3);
    setOptions([firstTarget, ...distractors].sort(() => 0.5 - Math.random()));

    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  }, []);

  useEffect(() => {
    if (selectedLevel !== null) {
      setupRound(currentItem, selectedLevel);
    }
  }, [currentItem, selectedLevel, setupRound]);

  const handleChooseLevel = (lvl) => {
    playClickSound();
    setSelectedLevel(lvl);
    setQuestionIndex(0);
    setIsChampion(false);
    const pool =
      lvl === 3
        ? WORKSHOP_WORD_POOL.filter((w) => w.word.length >= 5)
        : WORKSHOP_WORD_POOL.filter((w) => w.word.length >= 4);
    shuffleQueueRef.current = new ShuffleQueue(pool.length);
    setCurrentIndex(shuffleQueueRef.current.next());
  };

  const handleBackToLevelGate = () => {
    playHoverSound();
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    setSelectedLevel(null);
    setIsChampion(false);
  };

  const triggerConfettiRockets = () => {
    if (confettiRafRef.current) {
      cancelAnimationFrame(confettiRafRef.current);
    }
    const end = Date.now() + 1600;
    const colors = ["#34D399", "#38BDF8", "#FDE047", "#F472B6", "#FFFFFF"];

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.65 },
        colors,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.65 },
        colors,
      });
      if (Date.now() < end) {
        confettiRafRef.current = requestAnimationFrame(frame);
      } else {
        confettiRafRef.current = null;
      }
    })();
  };

  const handleSelectOption = useCallback(
    (letter) => {
      if (selectedLevel === null || isAnswered || isChampion) return;

      if (letter === expectedLetter) {
        playXylophoneNote(currentMissingStep % 5);

        const newSolved = [...solvedIndices, activeMissingIndex];
        setSolvedIndices(newSolved);

        const nextStep = currentMissingStep + 1;

        if (nextStep < missingIndices.length) {
          setCurrentMissingStep(nextStep);
          const nextMissingIdx = missingIndices[nextStep];
          const nextTarget = currentWordChars[nextMissingIdx];
          const distractors = generateDistractors(nextTarget, 3);
          setOptions([nextTarget, ...distractors].sort(() => 0.5 - Math.random()));

          setIsMascotCheering(true);
          setTimeout(() => setIsMascotCheering(false), 450);
        } else {
          setIsAnswered(true);
          setIsCorrect(true);
          setIsMascotCheering(true);

          playSuccessSound();
          playFanfareSound();
          if (typeof addStars === "function") addStars(1);

          triggerConfettiRockets();
          speakWord({ letter: currentItem.word[0], word: currentItem.word });

          autoAdvanceTimer.current = setTimeout(() => {
            if (questionIndex < TOTAL_QUESTIONS - 1) {
              setQuestionIndex((q) => q + 1);
              if (shuffleQueueRef.current) {
                setCurrentIndex(shuffleQueueRef.current.next());
              }
            } else {
              setIsChampion(true);
              triggerConfettiRockets();
            }
          }, 2000);
        }
      } else {
        playRubberBoingSound();
        setWobbleLetter(letter);
        setTimeout(() => setWobbleLetter(null), 450);
      }
    },
    [
      selectedLevel,
      isAnswered,
      isChampion,
      expectedLetter,
      currentMissingStep,
      solvedIndices,
      activeMissingIndex,
      missingIndices,
      currentWordChars,
      currentItem.word,
      questionIndex,
      addStars,
    ]
  );

  const handleDropOption = useCallback(
    (letter, info) => {
      if (isAnswered || isChampion) return;

      const dropX = info.point.x;
      const dropY = info.point.y;
      let isHit = false;

      if (activeSlotRef.current) {
        const sRect = activeSlotRef.current.getBoundingClientRect();
        const centerX = sRect.left + sRect.width / 2;
        const centerY = sRect.top + sRect.height / 2;
        if (Math.hypot(dropX - centerX, dropY - centerY) < 220) {
          isHit = true;
        }
      }

      if (!isHit && trayBoardRef.current) {
        const tRect = trayBoardRef.current.getBoundingClientRect();
        if (
          dropX >= tRect.left - 60 &&
          dropX <= tRect.right + 60 &&
          dropY >= tRect.top - 60 &&
          dropY <= tRect.bottom + 80
        ) {
          isHit = true;
        }
      }

      if (!isHit && dropY < window.innerHeight * 0.65) {
        isHit = true;
      }

      if (isHit) {
        handleSelectOption(letter);
      }
    },
    [handleSelectOption, isAnswered, isChampion]
  );

  // Physical keyboard support (A-Z) during gameplay
  useEffect(() => {
    if (selectedLevel === null) return;
    const handleKeyDown = (e) => {
      if (isAnswered || isChampion) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      const key = e.key?.toUpperCase();
      if (/^[A-Z]$/.test(key) && options.includes(key)) {
        handleSelectOption(key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedLevel, options, isAnswered, isChampion, handleSelectOption]);

  const handleSpeakWord = useCallback(() => {
    if (typeof playSfx === "function") playSfx("click");
    else playClickSound();
    setIsIllustrationBouncing(true);
    speakWord({ letter: currentItem.word[0], word: currentItem.word });
    setTimeout(() => setIsIllustrationBouncing(false), 600);
  }, [currentItem.word, playSfx]);

  const handleResetCurrent = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    playHoverSound();
    setupRound(currentItem, activeLevel);
  }, [currentItem, activeLevel, setupRound]);

  const handleNextWord = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    playHoverSound();
    if (shuffleQueueRef.current) {
      setCurrentIndex(shuffleQueueRef.current.next());
    }
  }, []);

  const handleMascotTap = () => {
    playHoverSound();
    setIsMascotCheering(true);
    setTimeout(() => setIsMascotCheering(false), 600);
  };

  const handleTapPuzzlePiece = (pIdx) => {
    playXylophoneNote(pIdx % 5);
    setSpinPuzzleIdx(pIdx);
    setTimeout(() => setSpinPuzzleIdx(null), 700);
  };

  const handleTileClick = (index, char) => {
    setTappedTileIdx(index);
    playXylophoneNote(index % 5);
    speakLetter(char);
    setTimeout(() => setTappedTileIdx(null), 400);
  };

  const handleRestartGame = () => {
    playHoverSound();
    setQuestionIndex(0);
    setIsChampion(false);
    if (shuffleQueueRef.current) {
      shuffleQueueRef.current.refill();
      setCurrentIndex(shuffleQueueRef.current.next());
    }
  };

  return (
    <main className="relative w-screen h-screen max-h-screen overflow-hidden flex flex-col justify-between select-none p-3 sm:p-4 md:p-5">
      {/* ── 1. Emerald-Mint Workshop Backdrop ── */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(180deg, #34D399 0%, #10B981 35%, #059669 70%, #047857 100%)",
        }}
      />

      <motion.div
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 50% 46%, rgba(254, 243, 199, 0.45) 0%, rgba(167, 243, 208, 0.2) 48%, rgba(4, 120, 87, 0.8) 100%)",
        }}
      />

      {/* Ambient Floating Puzzle Pieces & Light Motes (Clear of HUD Corners) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          onClick={() => handleTapPuzzlePiece(0)}
          animate={
            spinPuzzleIdx === 0
              ? { rotate: [0, 360], scale: [1, 1.3, 1] }
              : { y: [-6, 6, -6], rotate: [-4, 4, -4] }
          }
          whileHover={{ scale: 1.15 }}
          transition={
            spinPuzzleIdx === 0
              ? { duration: 0.65, ease: "easeOut" }
              : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
          }
          className="hidden sm:block absolute top-22 left-6 w-16 h-16 md:w-20 md:h-20 opacity-30 hover:opacity-75 pointer-events-auto cursor-pointer drop-shadow-md text-emerald-100"
        >
          <Puzzle size={72} className="w-full h-full stroke-[1.5]" />
        </motion.div>

        <motion.div
          onClick={() => handleTapPuzzlePiece(1)}
          animate={
            spinPuzzleIdx === 1
              ? { rotate: [0, -360], scale: [1, 1.3, 1] }
              : { y: [6, -6, 6], rotate: [5, -5, 5] }
          }
          whileHover={{ scale: 1.15 }}
          transition={
            spinPuzzleIdx === 1
              ? { duration: 0.65, ease: "easeOut" }
              : { duration: 6.0, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
          }
          className="hidden sm:block absolute top-22 right-6 w-16 h-16 md:w-20 md:h-20 opacity-30 hover:opacity-75 pointer-events-auto cursor-pointer drop-shadow-md text-emerald-100 -scale-x-100"
        >
          <Puzzle size={72} className="w-full h-full stroke-[1.5]" />
        </motion.div>

        {[
          { top: "14%", left: "14%", size: 12, color: "#FEF08A" },
          { top: "20%", left: "86%", size: 12, color: "#FFFFFF" },
          { top: "36%", left: "8%", size: 10, color: "#A7F3D0" },
          { top: "38%", left: "92%", size: 11, color: "#FDE047" },
        ].map((sp, sIdx) => (
          <motion.div
            key={sIdx}
            className="absolute rounded-full pointer-events-none"
            style={{
              top: sp.top,
              left: sp.left,
              width: sp.size,
              height: sp.size,
              backgroundColor: sp.color,
              boxShadow: `0 0 10px ${sp.color}`,
            }}
            animate={{ opacity: [0.3, 0.85, 0.3], scale: [0.85, 1.25, 0.85] }}
            transition={{ duration: 3 + sIdx * 0.4, repeat: Infinity, delay: sIdx * 0.5 }}
          />
        ))}
      </div>

      {/* Layered Emerald Meadow Hills along Bottom Edge */}
      <div className="fixed bottom-0 inset-x-0 pointer-events-none z-0 h-28 sm:h-36 overflow-hidden">
        <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="w-full h-full block">
          <path
            d="M0,90 C320,40 560,110 880,60 C1160,20 1340,80 1440,50 L1440,160 L0,160 Z"
            fill="#065F46"
            opacity="0.8"
          />
          <path
            d="M0,115 C260,80 620,135 960,95 C1220,65 1360,110 1440,90 L1440,160 L0,160 Z"
            fill="#047857"
            opacity="0.95"
          />
        </svg>
      </div>

      {/* Compact Top-Left "Ganti Level" Pill During Play (Sits Right Beside Menu Button) */}
      {selectedLevel !== null && (
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95, y: 1 }}
          transition={{ type: "spring", stiffness: 450, damping: 16 }}
          onClick={handleBackToLevelGate}
          aria-label="Ganti Level Bermain"
          className="fixed top-3.5 sm:top-5 left-[132px] sm:left-[152px] z-40 px-4 py-2 sm:py-2.5 rounded-full bg-[#FFFDF9]/95 border-2 border-white border-b-4 border-b-emerald-200/80 shadow-[0_4px_12px_rgba(6,78,59,0.16)] font-display font-bold text-sm sm:text-base text-[#047857] flex items-center gap-1.5 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
        >
          <Layers size={16} aria-hidden="true" className="stroke-[2.5]" />
          <span>Ganti Level</span>
        </motion.button>
      )}

      {/* ── 2. Stage Content: Level Selection Gate OR Two-Zone Puzzle Workshop ── */}
      {selectedLevel === null ? (
        <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-4 overflow-hidden">
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="mb-6 sm:mb-8 px-7 py-3 rounded-full bg-[#FFFDF9]/95 border-4 border-amber-300 border-b-6 border-b-amber-500 shadow-[0_12px_24px_rgba(6,78,59,0.28)]"
          >
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-[#0F172A] tracking-wide">
              Pilih Level Bermain
            </h1>
          </motion.div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-4xl w-full mx-auto px-2 sm:px-6">
            {LEVEL_CARDS.map((card, idx) => (
              <motion.button
                key={card.lvl}
                type="button"
                initial={{ opacity: 0, y: 24, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 20,
                  delay: idx * 0.08,
                }}
                whileHover={{ scale: 1.05, y: -6 }}
                whileTap={{ scale: 0.96, y: 2 }}
                onClick={() => handleChooseLevel(card.lvl)}
                className={`rounded-[2rem] p-5 sm:p-6 shadow-[0_16px_32px_rgba(6,78,59,0.32)] flex flex-col items-center justify-between text-center cursor-pointer select-none min-h-[220px] sm:min-h-[250px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${card.cardClass}`}
              >
                <span
                  className={`px-3.5 py-1 rounded-full font-display font-black text-xs tracking-wider shadow-xs ${card.badgeClass}`}
                >
                  {card.badge}
                </span>

                <span className="font-display font-black text-6xl sm:text-7xl leading-none my-2 drop-shadow-sm">
                  {card.lvl}
                </span>

                <div className="font-display font-black text-xl sm:text-2xl leading-tight tracking-wide">
                  {card.title}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        /* TWO-ZONE GAMEPLAY WORKBENCH */
        <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-2 sm:px-4 pt-10 sm:pt-12 pb-8 overflow-hidden">
          {/* ZONE 1: Upper Unified Wooden Question Board (Picture + Sound + Incomplete Word Blocks) */}
          <motion.div
            ref={trayBoardRef}
            layout
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className={`relative max-w-4xl w-full mx-auto bg-gradient-to-b from-[#C87D32] via-[#B46924] to-[#924E14] border-4 border-[#FDE68A] border-b-[10px] border-b-[#6B3408] rounded-[2.25rem] p-4 md:p-5 shadow-[0_18px_36px_rgba(6,78,59,0.35)] transition-all ${
              isDraggingAny ? "ring-4 ring-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.65)]" : ""
            }`}
          >
            <div className="absolute top-2 inset-x-10 h-1 bg-white/35 rounded-full pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
              {/* Left Side: Question Picture + Manual "Dengar" Audio Trigger */}
              <div className="flex items-center sm:flex-col gap-3 sm:gap-2.5 shrink-0">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  animate={
                    isIllustrationBouncing
                      ? { scale: [1, 1.18, 1], rotate: [-5, 5, 0] }
                      : {}
                  }
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  onClick={handleSpeakWord}
                  aria-label={`Dengarkan kata ${currentItem.word}`}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-[#FFFDF9] border-3 border-amber-200 p-2.5 shadow-md cursor-pointer flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
                >
                  <WordIllustration
                    illustrationKey={currentItem.illustrationKey}
                    word={currentItem.word}
                    color={currentItem.color}
                    showBadge={false}
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95, y: 1 }}
                  onClick={handleSpeakWord}
                  aria-label={`Dengar pengucapan kata ${currentItem.word}`}
                  className="px-4 py-1.5 rounded-full bg-gradient-to-b from-[#0284C7] to-[#0369A1] border-2 border-white border-b-4 border-b-[#075985] text-white font-display font-bold text-xs md:text-sm shadow-md flex items-center gap-1.5 cursor-pointer active:border-b-1 active:translate-y-0.5 select-none shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
                >
                  <Volume2 size={15} aria-hidden="true" className="stroke-[2.5]" />
                  <span>Dengar</span>
                </motion.button>
              </div>

              {/* Right Side: Clean Word Puzzle Channel + Compact Reset/Shuffle Actions */}
              <div className="flex-1 min-w-0 flex flex-col gap-3 w-full">
                <div className="flex items-center justify-end gap-1.5 px-1">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.08, rotate: 12 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={handleResetCurrent}
                      aria-label="Ulangi tebakan kata"
                      className="w-9 h-9 rounded-xl bg-amber-300 hover:bg-amber-200 border border-amber-100 border-b-3 border-b-amber-600 text-[#0F172A] shadow-sm cursor-pointer flex items-center justify-center"
                    >
                      <RotateCcw size={16} aria-hidden="true" className="stroke-[2.5]" />
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={handleNextWord}
                      aria-label="Acak kata baru"
                      className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 border border-emerald-300 border-b-3 border-b-emerald-800 text-white shadow-sm cursor-pointer flex items-center justify-center"
                    >
                      <Shuffle size={16} aria-hidden="true" className="stroke-[2.5]" />
                    </motion.button>
                </div>

                {/* Recessed Dark-Wood Puzzle Channel Holding Word Blocks */}
                <div className="bg-[#6B3408]/45 border-2 border-[#4E2304]/55 rounded-2xl px-3.5 py-4 md:px-5 md:py-5 shadow-inner flex items-center justify-center gap-2 sm:gap-2.5 md:gap-3 flex-nowrap">
                  {currentWordChars.map((char, index) => {
                    const isMissing = missingIndices.includes(index);
                    const isSolved = solvedIndices.includes(index);
                    const isActiveSlot = index === activeMissingIndex;
                    const isTapped = tappedTileIdx === index;

                    if (isMissing) {
                      return (
                        <motion.div
                          key={`missing-${index}`}
                          ref={isActiveSlot ? activeSlotRef : null}
                          animate={
                            isSolved
                              ? { scale: [0.55, 1.18, 0.96, 1], y: [6, -4, 0] }
                              : isActiveSlot
                              ? {
                                  scale: isDraggingAny ? [1.06, 1.14, 1.06] : [1, 1.04, 1],
                                  y: [0, -3, 0],
                                }
                              : {}
                          }
                          transition={
                            isSolved
                              ? { duration: 0.45, ease: "easeOut" }
                              : isActiveSlot
                              ? {
                                  duration: isDraggingAny ? 0.8 : 1.8,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }
                              : { duration: 0.25 }
                          }
                          className={`relative w-13 h-17 sm:w-14 sm:h-18 md:w-16 md:h-20 lg:w-18 lg:h-22 rounded-2xl flex flex-col items-center justify-center font-display font-black text-3xl md:text-4xl transition-all select-none ${
                            isSolved
                              ? "bg-gradient-to-b from-[#10B981] to-[#047857] border-2 border-emerald-200 border-b-[6px] border-b-[#065F46] text-white shadow-lg"
                              : isActiveSlot
                              ? isDraggingAny
                                ? "bg-gradient-to-b from-[#FFFBEB] via-[#FEF08A] to-[#FDE047] border-3 border-dashed border-amber-500 shadow-[0_0_32px_rgba(253,224,71,1)] scale-105"
                                : "bg-gradient-to-b from-[#FFFBEB] to-[#FEF08A] border-3 border-amber-400 border-b-[6px] border-b-amber-600 shadow-[0_0_24px_rgba(253,224,71,0.9)]"
                              : "bg-[#78350F]/45 border-2 border-dashed border-[#FDE68A]/80"
                          }`}
                        >
                          {isSolved ? (
                            <>
                              <span>{char}</span>
                              <span
                                aria-hidden="true"
                                className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-amber-400 border border-white flex items-center justify-center text-[#0F172A] shadow-xs"
                              >
                                <Check size={10} strokeWidth={3.5} />
                              </span>
                            </>
                          ) : isActiveSlot ? (
                            <span className="font-display font-black text-3xl md:text-4xl text-[#B45309] animate-pulse">
                              _
                            </span>
                          ) : (
                            <span className="font-display font-black text-2xl md:text-3xl text-[#FDE68A]/75">
                              _
                            </span>
                          )}
                        </motion.div>
                      );
                    }

                    return (
                      <motion.button
                        key={`known-${index}`}
                        type="button"
                        onClick={() => handleTileClick(index, char)}
                        whileHover={{ scale: 1.05, y: -3 }}
                        animate={
                          isCorrect
                            ? { y: [0, -10, 0], scale: [1, 1.06, 1] }
                            : isTapped
                            ? { y: [-8, 0], scale: [1, 1.1, 1] }
                            : {}
                        }
                        transition={
                          isCorrect
                            ? { delay: index * 0.08, duration: 0.5, ease: "easeOut" }
                            : isTapped
                            ? { duration: 0.35, ease: "easeOut" }
                            : {}
                        }
                        aria-label={`Huruf ${char}`}
                        className="relative w-13 h-17 sm:w-14 sm:h-18 md:w-16 md:h-20 lg:w-18 lg:h-22 rounded-2xl bg-[#FFFDF9] border-2 border-amber-200 border-b-[6px] border-b-amber-300 text-[#0F172A] shadow-md flex items-center justify-center font-display font-black text-3xl md:text-4xl select-none cursor-pointer"
                      >
                        {char}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ZONE 2: Lower Contrasting Recessed Ivory-Emerald Answer Choice Dock */}
          <div className="mt-5 md:mt-6 bg-[#FFFDF9]/95 border-4 border-emerald-200 border-b-[8px] border-b-emerald-400 rounded-[2rem] px-6 py-3.5 shadow-[0_14px_28px_rgba(6,78,59,0.28)] flex items-center justify-center gap-3.5 md:gap-5 z-20 shrink-0">
            {options.map((letter, optIdx) => {
              const isMatchingTarget = isCorrect && letter === expectedLetter;
              const isWobble = wobbleLetter === letter;
              const palette = TOY_CHOICE_PALETTES[optIdx % TOY_CHOICE_PALETTES.length];

              return (
                <div
                  key={`${letter}-${optIdx}`}
                  className="p-1.5 rounded-2xl bg-emerald-50/90 border border-emerald-100 shadow-inner"
                >
                  <motion.div
                    drag={!isAnswered && !isChampion}
                    dragSnapToOrigin={true}
                    dragElastic={0.45}
                    whileHover={!isAnswered ? { scale: 1.08, y: -3 } : {}}
                    whileTap={!isAnswered ? { scale: 0.95 } : {}}
                    whileDrag={{
                      scale: 1.18,
                      zIndex: 100,
                      rotate: 3,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                      cursor: "grabbing",
                    }}
                    onDragStart={() => {
                      isDraggingRef.current = true;
                      setIsDraggingAny(true);
                    }}
                    onDragEnd={(e, info) => {
                      setTimeout(() => {
                        isDraggingRef.current = false;
                      }, 60);
                      setIsDraggingAny(false);
                      handleDropOption(letter, info);
                    }}
                    onClick={() => {
                      if (!isDraggingRef.current) {
                        handleSelectOption(letter);
                      }
                    }}
                    animate={
                      isWobble
                        ? { x: [-7, 7, -4, 4, 0], rotate: [-3, 3, -2, 2, 0] }
                        : isMatchingTarget
                        ? { scale: [1, 1.14, 1], y: [0, -10, 0] }
                        : {}
                    }
                    transition={{ duration: isWobble ? 0.45 : 0.3 }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Pilih atau tarik huruf ${letter}`}
                    className={`w-16 h-18 md:w-18 md:h-20 rounded-2xl font-display font-black text-3xl md:text-4xl border-3 border-b-[6px] active:border-b-1 active:translate-y-1 transition-shadow flex items-center justify-center select-none cursor-grab active:cursor-grabbing shadow-md relative touch-none ${
                      isMatchingTarget
                        ? "bg-gradient-to-b from-[#10B981] to-[#047857] border-emerald-200 border-b-[#065F46] text-white"
                        : `bg-gradient-to-b ${palette.bg} ${palette.border} ${palette.shadow} text-[#0F172A]`
                    }`}
                  >
                    <div className="absolute top-1 inset-x-3 h-1 bg-white/50 rounded-full pointer-events-none" />
                    <span>{letter}</span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 3. Grounded Bottom Mascots (Zero Speech Bubble) ── */}
      <div className="fixed bottom-1 left-4 sm:left-8 z-20 select-none flex flex-col items-center pointer-events-none">
        <div className="relative flex flex-col items-center">
          <div className="absolute -bottom-2 w-32 sm:w-36 md:w-44 h-8 sm:h-10 bg-gradient-to-b from-[#22C55E] via-[#16A34A] to-[#15803D] rounded-t-full border-t-2 border-emerald-300 shadow-md z-0" />
          <motion.img
            src="/assets/saka-maskot-1-cutout.png"
            alt="Maskot Saka"
            draggable="false"
            onClick={handleMascotTap}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            animate={
              isAnswered || isMascotCheering
                ? { y: [-16, 0, -8, 0], scale: [1, 1.06, 1] }
                : { y: [0, -3, 0] }
            }
            transition={{
              duration: isAnswered || isMascotCheering ? 0.6 : 3.0,
              repeat: isAnswered || isMascotCheering ? 2 : Infinity,
              ease: "easeInOut",
            }}
            className="h-28 sm:h-34 md:h-40 w-auto object-contain object-bottom pointer-events-auto cursor-pointer select-none drop-shadow-lg relative z-10"
          />
          <div className="w-20 sm:w-24 h-3 bg-black/25 rounded-full blur-[2px] -mt-1 relative z-10 pointer-events-none" />
        </div>
      </div>

      <div className="fixed bottom-1 right-4 sm:right-8 z-20 select-none flex flex-col items-center pointer-events-none">
        <div className="relative flex flex-col items-center">
          <div className="absolute -bottom-2 w-32 sm:w-36 md:w-44 h-8 sm:h-10 bg-gradient-to-b from-[#22C55E] via-[#16A34A] to-[#15803D] rounded-t-full border-t-2 border-emerald-300 shadow-md z-0" />
          <motion.img
            src="/assets/icon-tika-utama.png"
            alt="Maskot Tika"
            draggable="false"
            onClick={handleMascotTap}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            animate={
              isAnswered || isMascotCheering
                ? { y: [-18, 0, -10, 0], scale: [1, 1.06, 1] }
                : { y: [0, -3, 0] }
            }
            transition={{
              duration: isAnswered || isMascotCheering ? 0.6 : 3.2,
              repeat: isAnswered || isMascotCheering ? 2 : Infinity,
              ease: "easeInOut",
              delay: 0.1,
            }}
            className="h-28 sm:h-34 md:h-40 w-auto object-contain object-bottom pointer-events-auto cursor-pointer select-none drop-shadow-lg relative z-10"
          />
          <div className="w-20 sm:w-24 h-3 bg-black/25 rounded-full blur-[2px] -mt-1 relative z-10 pointer-events-none" />
        </div>
      </div>

      {/* ── 4. "HORE! KAMU HEBAT!" Celebration Modal (Zero Stars, Zero Emojis) ── */}
      <AnimatePresence>
        {isChampion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/45 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.35, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              className="relative z-10 flex flex-col items-center justify-center text-center p-6 sm:p-8 max-w-lg w-full bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EE] to-[#FEF3C7] rounded-[2.5rem] border-4 border-amber-300 border-b-8 border-b-amber-500 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-8 ring-amber-400/50"
            >
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

              <div className="w-28 h-28 sm:w-32 sm:h-32 mb-2 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
                  <defs>
                    <linearGradient id="melengkapiCrackerRed" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="50%" stopColor="#DC2626" />
                      <stop offset="100%" stopColor="#991B1B" />
                    </linearGradient>
                    <linearGradient id="melengkapiCrackerGold" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FDE047" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                  <g stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="60" y1="12" x2="60" y2="4" strokeDasharray="3 3" />
                    <line x1="95" y1="25" x2="102" y2="18" />
                    <line x1="108" y1="60" x2="116" y2="60" strokeDasharray="3 3" />
                    <line x1="95" y1="95" x2="102" y2="102" />
                    <line x1="60" y1="108" x2="60" y2="116" strokeDasharray="3 3" />
                    <line x1="25" y1="95" x2="18" y2="102" />
                    <line x1="12" y1="60" x2="4" y2="60" strokeDasharray="3 3" />
                    <line x1="25" y1="25" x2="18" y2="18" />
                  </g>
                  <circle cx="60" cy="8" r="3.5" fill="#38BDF8" />
                  <circle cx="100" cy="20" r="4" fill="#F43F5E" />
                  <circle cx="114" cy="60" r="3.5" fill="#34D399" />
                  <circle cx="100" cy="100" r="4" fill="#FDE047" />
                  <circle cx="20" cy="100" r="3.5" fill="#A78BFA" />
                  <circle cx="6" cy="60" r="4" fill="#F43F5E" />
                  <circle cx="20" cy="20" r="3.5" fill="#38BDF8" />
                  <g transform="translate(60, 60) rotate(-25) translate(-60, -60)">
                    <rect x="52" y="28" width="16" height="64" rx="4" fill="url(#melengkapiCrackerRed)" stroke="#7F1D1D" strokeWidth="1.5" />
                    <rect x="52" y="34" width="16" height="8" fill="url(#melengkapiCrackerGold)" />
                    <rect x="52" y="78" width="16" height="8" fill="url(#melengkapiCrackerGold)" />
                    <path d="M 60 28 Q 60 18 68 14" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <circle cx="68" cy="14" r="3" fill="#FEF08A" />
                  </g>
                  <g transform="translate(60, 60) rotate(25) translate(-60, -60)">
                    <rect x="52" y="28" width="16" height="64" rx="4" fill="url(#melengkapiCrackerRed)" stroke="#7F1D1D" strokeWidth="1.5" />
                    <rect x="52" y="34" width="16" height="8" fill="url(#melengkapiCrackerGold)" />
                    <rect x="52" y="78" width="16" height="8" fill="url(#melengkapiCrackerGold)" />
                    <path d="M 60 28 Q 60 18 52 14" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <circle cx="52" cy="14" r="3" fill="#FEF08A" />
                  </g>
                  <circle cx="60" cy="60" r="10" fill="#FEF08A" />
                  <circle cx="60" cy="60" r="5" fill="#FFFFFF" />
                </svg>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl text-[#065F46] tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(251,191,36,0.5)]">
                HORE! KAMU HEBAT!
              </h2>

              <p className="font-sans font-black text-sm sm:text-base text-amber-950 mt-2 leading-relaxed">
                Kamu Berhasil Menyelesaikan 5 Soal Level {activeLevel} dengan Benar!
              </p>

              <div className="flex items-center gap-3 mt-5 flex-wrap justify-center">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleRestartGame}
                  className="px-5 py-2.5 rounded-2xl bg-white border-2 border-emerald-400 border-b-4 border-b-emerald-600 text-emerald-900 font-display font-black text-sm sm:text-base shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={16} aria-hidden="true" className="stroke-[2.5]" />
                  <span>Main Lagi</span>
                </motion.button>

                {activeLevel < 3 ? (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleChooseLevel(activeLevel + 1)}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-b from-[#059669] to-[#047857] border-2 border-white border-b-4 border-b-[#065F46] text-white font-display font-black text-sm sm:text-base shadow-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Play size={16} aria-hidden="true" className="fill-white" />
                    <span>Lanjut Level {activeLevel + 1}</span>
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={handleBackToLevelGate}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-b from-[#B45309] to-[#9A3412] border-2 border-white border-b-4 border-b-[#7C2D12] text-white font-display font-black text-sm sm:text-base shadow-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Layers size={16} aria-hidden="true" className="stroke-[2.5]" />
                    <span>Pilih Level</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
