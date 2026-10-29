// src/views/modules/TemukanHurufView.jsx
// SAKA TIKA: Floating Glass Bubble Arena Overhaul for "Temukan Huruf" (Mini-Game 1 Refactor)
// Standardized 4-Tier Vertical Rhythm, Non-Deterministic Random Initialization with ShuffleQueue,
// Widescreen 16:9 Living Landscape, Juicy Pop Physics, Ascending Chimes, Forgiving Jelly Wobble,
// Single Floating Spotlight Target Banner, Saka & Tika Mascot Companions, and Mandatory 2.2-Second Hold.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowLeft, Volume2, Star, Sparkles, ChevronRight, RotateCcw } from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { ALPHABET_DATA } from "../../data/masterDataset.js";
import { speakLetter, speakInstruction } from "../../utils/speechEngine.js";
import {
  playBubblePopSound,
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

// Glass bubble pastel themes with soft translucent tints and matching specular rings
const GLASS_BUBBLE_THEMES = [
  { name: "sky", tint: "from-sky-300/35 via-white/40 to-blue-300/25", border: "border-sky-300/70", glow: "shadow-sky-300/30", text: "#0284C7" },
  { name: "rose", tint: "from-rose-300/35 via-white/40 to-pink-300/25", border: "border-rose-300/70", glow: "shadow-rose-300/30", text: "#E11D48" },
  { name: "emerald", tint: "from-emerald-300/35 via-white/40 to-teal-300/25", border: "border-emerald-300/70", glow: "shadow-emerald-300/30", text: "#059669" },
  { name: "amber", tint: "from-amber-300/35 via-white/40 to-orange-300/25", border: "border-amber-300/70", glow: "shadow-amber-300/30", text: "#D97706" },
  { name: "purple", tint: "from-purple-300/35 via-white/40 to-indigo-300/25", border: "border-purple-300/70", glow: "shadow-purple-300/30", text: "#9333EA" },
  { name: "teal", tint: "from-teal-300/35 via-white/40 to-cyan-300/25", border: "border-teal-300/70", glow: "shadow-teal-300/30", text: "#0D9488" },
];

// Natural, non-overlapping anchor positions across the 16:9 arena (leaving banner & mascots clear)
const BUBBLE_ZONE_ANCHORS = [
  { left: 14, top: 25 },
  { left: 32, top: 22 },
  { left: 50, top: 24 },
  { left: 68, top: 22 },
  { left: 86, top: 26 },
  { left: 22, top: 46 },
  { left: 41, top: 43 },
  { left: 60, top: 45 },
  { left: 78, top: 49 },
  { left: 28, top: 67 },
  { left: 52, top: 69 },
  { left: 74, top: 67 },
];

export default function TemukanHurufView() {
  const { navigateTo, addStars } = useGame();
  const { playSfx } = useAudio();

  // Task 1: Non-deterministic shuffle queue initialization (Never always starts on index 0 / letter A)
  const shuffleQueueRef = useRef(null);
  if (!shuffleQueueRef.current) {
    shuffleQueueRef.current = new ShuffleQueue(ALPHABET_DATA.length);
  }

  const [letterIndex, setLetterIndex] = useState(() => shuffleQueueRef.current.next());
  const [bubbles, setBubbles] = useState([]);
  const [foundIds, setFoundIds] = useState([]);
  const [wobbleId, setWobbleId] = useState(null);
  const [poppingId, setPoppingId] = useState(null);
  const [roundComplete, setRoundComplete] = useState(false);
  const [isSakaJumping, setIsSakaJumping] = useState(false);
  const [isTikaJumping, setIsTikaJumping] = useState(false);
  const [speechBubbleText, setSpeechBubbleText] = useState("");

  // Active target letter object from master dataset
  const currentTarget = useMemo(() => {
    return ALPHABET_DATA[letterIndex % ALPHABET_DATA.length];
  }, [letterIndex]);

  const targetLetter = currentTarget.letter;

  // Initialize bubble arena for target letter (3 targets + 9 distractors = 12 bubbles)
  const setupRound = useCallback((target) => {
    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const distractorsPool = allLetters.filter((l) => l !== target);
    const shuffledPool = [...distractorsPool].sort(() => 0.5 - Math.random());

    const targetCount = 3;
    const distractorCount = 9;
    const items = [];

    // 3 Target bubbles
    for (let i = 0; i < targetCount; i++) {
      const theme = GLASS_BUBBLE_THEMES[Math.floor(Math.random() * GLASS_BUBBLE_THEMES.length)];
      items.push({
        id: `target-${i}-${Date.now()}`,
        letter: target,
        isTarget: true,
        theme,
      });
    }

    // 9 Distractor bubbles
    for (let i = 0; i < distractorCount; i++) {
      const dLetter = shuffledPool[i % shuffledPool.length];
      const theme = GLASS_BUBBLE_THEMES[Math.floor(Math.random() * GLASS_BUBBLE_THEMES.length)];
      items.push({
        id: `distractor-${i}-${Date.now()}`,
        letter: dLetter,
        isTarget: false,
        theme,
      });
    }

    // Shuffle and assign natural anchor positions with subtle organic jitter
    const shuffledItems = items.sort(() => 0.5 - Math.random());
    const positionedBubbles = shuffledItems.map((item, idx) => {
      const anchor = BUBBLE_ZONE_ANCHORS[idx] || { left: 50, top: 50 };
      const jitterX = (Math.random() - 0.5) * 5;
      const jitterY = (Math.random() - 0.5) * 4;
      const floatDuration = 2.8 + Math.random() * 1.4;
      const floatDistance = 9 + Math.random() * 8;
      const floatDelay = Math.random() * 1.5;

      return {
        ...item,
        x: Math.max(8, Math.min(90, anchor.left + jitterX)),
        y: Math.max(20, Math.min(76, anchor.top + jitterY)),
        floatDuration,
        floatDistance,
        floatDelay,
      };
    });

    setBubbles(positionedBubbles);
    setFoundIds([]);
    setWobbleId(null);
    setPoppingId(null);
    setRoundComplete(false);
    setIsSakaJumping(false);
    setIsTikaJumping(false);
    setSpeechBubbleText(`Ayo temukan 3 gelembung huruf ${target}!`);
  }, []);

  // Initialize round — STRICT ZERO AUTO-PLAY (No voice/audio on mount or round change)
  useEffect(() => {
    setupRound(targetLetter);
  }, [targetLetter, setupRound]);

  // Handle bubble click interaction
  const handleBubbleClick = (bubble) => {
    if (roundComplete || foundIds.includes(bubble.id)) return;

    if (bubble.isTarget) {
      // Correct Bubble Click:
      const newFound = [...foundIds, bubble.id];
      const stageIdx = newFound.length - 1; // 0, 1, or 2

      setPoppingId(bubble.id);
      playBubblePopSound(stageIdx); // Ascending scale: Do, Re, Mi + crisp pop sound

      // Mascots jump with joy
      setIsSakaJumping(true);
      setIsTikaJumping(true);
      setTimeout(() => {
        setIsSakaJumping(false);
        setIsTikaJumping(false);
      }, 600);

      if (newFound.length === 1) {
        setSpeechBubbleText(`Bagus! Satu huruf ${targetLetter} ditemukan!`);
      } else if (newFound.length === 2) {
        setSpeechBubbleText(`Hebat! Tinggal satu huruf ${targetLetter} lagi!`);
      }

      // Hide bubble after pop burst animation finishes
      setTimeout(() => {
        setFoundIds(newFound);
        setPoppingId(null);
      }, 350);

      // Check if all 3 targets are found
      if (newFound.length >= 3) {
        setRoundComplete(true);
        playSuccessSound();
        playFanfareSound();
        addStars(1);

        confetti({
          particleCount: 85,
          spread: 80,
          origin: { y: 0.55 },
          colors: ["#38BDF8", "#34D399", "#FBBF24", "#F472B6", "#A78BFA"],
        });

        setSpeechBubbleText(`Luar biasa! Semua huruf ${targetLetter} ditemukan!`);

        // EXTENDED SUCCESS PAUSE: Exactly 2.2 seconds (2200ms) before auto-advancing
        setTimeout(() => {
          handleNextRound();
        }, 2200);
      }
    } else {
      // Incorrect Bubble Click: Forgiving jelly wobble with rubber boing sound (NO harsh errors)
      playRubberBoingSound();
      setWobbleId(bubble.id);
      setSpeechBubbleText(`Itu huruf ${bubble.letter}. Cari huruf ${targetLetter} ya!`);
      setTimeout(() => setWobbleId(null), 500);
    }
  };

  // Navigation handlers
  const handleNextRound = useCallback(() => {
    playHoverSound();
    setLetterIndex(shuffleQueueRef.current.next());
  }, []);

  const handleResetCurrentRound = useCallback(() => {
    playHoverSound();
    setupRound(targetLetter);
  }, [setupRound, targetLetter]);

  // Explicit user click audio trigger for target pronunciation
  const handleSpeakTarget = () => {
    playSfx("click");
    speakLetter(currentTarget);
    setSpeechBubbleText(`Huruf ${targetLetter}, dibaca '${currentTarget.phonetic}'!`);
  };

  const handleSpeakWord = () => {
    playSfx("click");
    speakInstruction(`${targetLetter} untuk ${currentTarget.word}!`);
    setSpeechBubbleText(`${targetLetter} untuk ${currentTarget.word}!`);
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

        {/* Top-Right: Target Progress Star Badge */}
        <div className="bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-2 border-[#F59E0B] rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm flex items-center gap-1.5 flex-shrink-0">
          <Star size={16} className="fill-[#F59E0B] text-[#D97706]" />
          <span className="font-display font-black text-xs sm:text-sm text-[#92400E]">
            {foundIds.length} / 3 Ditemukan
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
          className="bg-white/92 backdrop-blur-md border-2 border-amber-300 border-b-4 border-amber-400 rounded-3xl px-3.5 py-1.5 sm:px-5 sm:py-2 shadow-lg flex items-center gap-3 sm:gap-5"
        >
          {/* Target Word Illustration Card (Clickable Pronunciation) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.08, rotate: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleSpeakWord}
            aria-label={`Dengarkan contoh kata ${currentTarget.word}`}
            className="flex items-center gap-2 bg-amber-50/80 border-2 border-amber-200 rounded-2xl px-2.5 py-1 shadow-xs cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center group-hover:scale-110 transition-transform">
              <WordIllustration
                illustrationKey={currentTarget.illustrationKey}
                word={currentTarget.word}
                color={currentTarget.color}
                className="w-full h-full object-contain drop-shadow-xs"
              />
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-sans text-[10px] text-[#1B4965]/60 block leading-none font-semibold">
                Contoh:
              </span>
              <span className="font-display font-bold text-xs sm:text-sm text-[#1B4965] leading-tight block">
                {currentTarget.word}
              </span>
            </div>
          </motion.button>

          {/* Target Letter Spotlight Card with Audio Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              onClick={handleSpeakTarget}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-b from-white to-sky-50 border-3 flex items-center justify-center font-display font-black text-2xl sm:text-3xl shadow-sm cursor-pointer active:scale-95 transition-transform"
              style={{
                borderColor: currentTarget.color,
                color: currentTarget.color,
              }}
              title="Klik untuk mendengarkan bunyi huruf"
            >
              {targetLetter}
            </motion.div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xs sm:text-sm text-[#1B4965]">
                  Temukan 3 Gelembung Huruf <span style={{ color: currentTarget.color }}>{targetLetter}</span>!
                </span>
                <button
                  type="button"
                  onClick={handleSpeakTarget}
                  aria-label="Bunyikan Huruf"
                  className="p-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-[#0284C7] cursor-pointer transition-colors"
                >
                  <Volume2 size={14} />
                </button>
              </div>

              {/* 3 Golden Star Progress Slots */}
              <div className="flex items-center gap-2 mt-1">
                {[0, 1, 2].map((slotIdx) => {
                  const isSlotFilled = slotIdx < foundIds.length;
                  return (
                    <motion.div
                      key={slotIdx}
                      initial={false}
                      animate={isSlotFilled ? { scale: [1.3, 1] } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all ${
                        isSlotFilled
                          ? "bg-gradient-to-b from-[#FDE047] to-[#F59E0B] border-2 border-[#D97706] shadow-sm"
                          : "bg-white/80 border-2 border-stone-200 border-dashed"
                      }`}
                    >
                      <Star
                        size={12}
                        className={
                          isSlotFilled
                            ? "fill-[#F59E0B] text-[#B45309]"
                            : "text-stone-300 fill-transparent"
                        }
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Toolbar: Reset & Next */}
          <div className="flex items-center gap-1.5">
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleResetCurrentRound}
              aria-label="Acak Ulang Gelembung"
              className="p-1.5 sm:p-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-[#1B4965] border border-stone-200 shadow-xs cursor-pointer flex-shrink-0"
              title="Acak ulang posisi gelembung"
            >
              <RotateCcw size={15} />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleNextRound}
              aria-label="Ganti Huruf Berikutnya"
              className="p-1.5 sm:p-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-[#92400E] border border-amber-300 shadow-xs cursor-pointer flex-shrink-0"
              title="Lanjut ke Huruf Berikutnya"
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          TIER 3: INTERACTIVE CENTRAL STAGE (Floating Glass Bubble Arena)
         ══════════════════════════════════════════════════════════ */}
      <section className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-4 my-auto overflow-hidden">
        {bubbles.map((b) => {
          const isFound = foundIds.includes(b.id);
          const isPopping = poppingId === b.id;
          const isWobble = wobbleId === b.id;

          if (isFound) return null;

          return (
            <motion.button
              key={b.id}
              type="button"
              onClick={() => handleBubbleClick(b)}
              disabled={roundComplete}
              style={{
                position: "absolute",
                left: `${b.x}%`,
                top: `${b.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              whileHover={{ scale: 1.15, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.88 }}
              animate={
                isPopping
                  ? {
                      scale: [1, 1.45, 0],
                      opacity: [1, 0.8, 0],
                    }
                  : isWobble
                  ? {
                      scale: [1, 1.25, 0.85, 1.12, 1],
                      rotate: [-14, 14, -8, 8, 0],
                    }
                  : {
                      y: [-b.floatDistance, b.floatDistance, -b.floatDistance],
                      rotate: [-3, 3, -3],
                    }
              }
              transition={
                isPopping
                  ? { duration: 0.35, ease: "easeOut" }
                  : isWobble
                  ? { duration: 0.45, ease: "easeInOut" }
                  : {
                      duration: b.floatDuration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: b.floatDelay,
                    }
              }
              className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-full border-2 ${b.theme.border} bg-gradient-to-br ${b.theme.tint} backdrop-blur-xs ${b.theme.glow} shadow-lg flex items-center justify-center font-display font-black text-2xl sm:text-3xl lg:text-4xl select-none cursor-pointer relative active:scale-90 transition-transform`}
            >
              {/* Glossy Curved Glass Highlight */}
              <div className="absolute top-1.5 left-2.5 w-4 h-2.5 bg-white/70 rounded-full rotate-[-30deg] pointer-events-none" />
              <div className="absolute bottom-1.5 right-2.5 w-2 h-1 bg-white/40 rounded-full rotate-[-30deg] pointer-events-none" />

              {/* Letter Glyph */}
              <span style={{ color: b.theme.text }} className="drop-shadow-xs">
                {b.letter}
              </span>
            </motion.button>
          );
        })}
      </section>

      {/* ══════════════════════════════════════════════════════════
          TIER 4: BOTTOM LAWN CLEARANCE & FLANKING MASCOTS
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
            <SakaMascot isWaving={isSakaJumping || roundComplete} />
          </motion.div>

          {/* Grassy Mound Base */}
          <div className="w-24 sm:w-32 h-3 bg-[#4ADE80] rounded-full blur-[1px] opacity-80 -mt-2 shadow-xs" />
        </div>

        {/* Center: Completion Message (when all 3 bubbles found) */}
        <div className="flex-1 flex justify-center pb-2 pointer-events-auto">
          <AnimatePresence>
            {roundComplete && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-2xl shadow-xl border-2 border-white flex items-center gap-2"
              >
                <Sparkles size={18} className="text-yellow-300" />
                <span className="font-display font-black text-sm sm:text-base">
                  Luar Biasa! Semua Huruf {targetLetter} Ditemukan! (+1 Bintang)
                </span>
              </motion.div>
            )}
          </AnimatePresence>
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
            <TikaMascot isCheering={isTikaJumping || roundComplete} />
          </motion.div>

          {/* Grassy Mound Base */}
          <div className="w-24 sm:w-32 h-3 bg-[#4ADE80] rounded-full blur-[1px] opacity-80 -mt-2 shadow-xs" />
        </div>

      </footer>
    </main>
  );
}
