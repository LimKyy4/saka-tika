// src/views/modules/TemukanHurufView.jsx
// SAKA TIKA: Floating Glass Bubble Arena Overhaul for "Temukan Huruf" (Mini-Game 1 Refactor)
// Strictly adheres to Global 3-Tier Height Budgeting:
// - Central glass bubble arena stage wrapped with flex-1 min-h-0 max-h-[55vh]
// - Bottom mascots remain anchored in lower zones without intruding into game puzzle hitboxes
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Volume2, Star, Sparkles, ChevronRight, RotateCcw } from "lucide-react";

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
  { left: 14, top: 22 },
  { left: 32, top: 20 },
  { left: 50, top: 22 },
  { left: 68, top: 20 },
  { left: 86, top: 24 },
  { left: 22, top: 45 },
  { left: 41, top: 42 },
  { left: 60, top: 44 },
  { left: 78, top: 47 },
  { left: 28, top: 68 },
  { left: 52, top: 70 },
  { left: 74, top: 68 },
];

export default function TemukanHurufView() {
  const { addStars } = useGame();
  const { playSfx } = useAudio();

  // Non-deterministic shuffle queue initialization
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
      const jitterX = (Math.random() - 0.5) * 4;
      const jitterY = (Math.random() - 0.5) * 3;
      const floatDuration = 2.8 + Math.random() * 1.4;
      const floatDistance = 7 + Math.random() * 6;
      const floatDelay = Math.random() * 1.5;

      return {
        ...item,
        x: Math.max(10, Math.min(88, anchor.left + jitterX)),
        y: Math.max(18, Math.min(74, anchor.top + jitterY)),
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

  // Initialize round
  useEffect(() => {
    setupRound(targetLetter);
  }, [targetLetter, setupRound]);

  // Handle bubble click interaction
  const handleBubbleClick = (bubble) => {
    if (roundComplete || foundIds.includes(bubble.id)) return;

    if (bubble.isTarget) {
      const newFound = [...foundIds, bubble.id];
      const stageIdx = newFound.length - 1;

      setPoppingId(bubble.id);
      playBubblePopSound(stageIdx);

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

      setTimeout(() => {
        setFoundIds(newFound);
        setPoppingId(null);
      }, 350);

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

        setTimeout(() => {
          handleNextRound();
        }, 2200);
      }
    } else {
      playRubberBoingSound();
      setWobbleId(bubble.id);
      setSpeechBubbleText(`Itu huruf ${bubble.letter}. Cari huruf ${targetLetter} ya!`);
      setTimeout(() => setWobbleId(null), 500);
    }
  };

  const handleNextRound = useCallback(() => {
    playHoverSound();
    setLetterIndex(shuffleQueueRef.current.next());
  }, []);

  const handleResetCurrentRound = useCallback(() => {
    playHoverSound();
    setupRound(targetLetter);
  }, [setupRound, targetLetter]);

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
    <main className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none p-1 sm:p-2">
      {/* ── Background Base: Persistent Living Vector Landscape (Layer 0) ── */}
      <GameLandscapeBackground />

      {/* ── Contrast Tint Layer ── */}
      <div className="fixed inset-0 bg-sky-950/10 backdrop-blur-[0.5px] pointer-events-none z-0" />

      {/* ── Content Wrapper ── */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col justify-between max-w-7xl w-full mx-auto">
        
        {/* ── Target Spotlight Banner: Compact Single Pill Card ── */}
        <div className="w-full px-2 mt-1 flex justify-center flex-shrink-0">
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="bg-white/92 backdrop-blur-md border-2 border-amber-300 border-b-3 border-amber-400 rounded-2xl px-3 py-1 shadow-sm flex items-center gap-2.5 sm:gap-4 max-h-12"
          >
            {/* Target Word Illustration Card */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08, rotate: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleSpeakWord}
              aria-label={`Dengarkan contoh kata ${currentTarget.word}`}
              className="flex items-center gap-1.5 bg-amber-50/80 border border-amber-200 rounded-xl px-2 py-0.5 shadow-2xs cursor-pointer group"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
                <WordIllustration
                  illustrationKey={currentTarget.illustrationKey}
                  word={currentTarget.word}
                  color={currentTarget.color}
                  className="w-full h-full object-contain drop-shadow-xs"
                />
              </div>
              <div className="text-left hidden sm:block">
                <span className="font-display font-bold text-xs text-[#1B4965] leading-tight block">
                  {currentTarget.word}
                </span>
              </div>
            </motion.button>

            {/* Target Letter Spotlight */}
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                onClick={handleSpeakTarget}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-b from-white to-sky-50 border-2 flex items-center justify-center font-display font-black text-xl sm:text-2xl shadow-2xs cursor-pointer active:scale-95 transition-transform"
                style={{
                  borderColor: currentTarget.color,
                  color: currentTarget.color,
                }}
                title="Klik untuk mendengarkan bunyi huruf"
              >
                {targetLetter}
              </motion.div>

              <div>
                <div className="flex items-center gap-1">
                  <span className="font-display font-black text-xs sm:text-sm text-[#1B4965]">
                    Temukan 3 Gelembung <span style={{ color: currentTarget.color }}>{targetLetter}</span>!
                  </span>
                  <button
                    type="button"
                    onClick={handleSpeakTarget}
                    aria-label="Bunyikan Huruf"
                    className="p-0.5 rounded-md bg-sky-100 hover:bg-sky-200 text-[#0284C7] cursor-pointer transition-colors"
                  >
                    <Volume2 size={13} />
                  </button>
                </div>

                {/* 3 Golden Star Progress Slots */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  {[0, 1, 2].map((slotIdx) => {
                    const isSlotFilled = slotIdx < foundIds.length;
                    return (
                      <motion.div
                        key={slotIdx}
                        initial={false}
                        animate={isSlotFilled ? { scale: [1.25, 1] } : { scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-all ${
                          isSlotFilled
                            ? "bg-gradient-to-b from-[#FDE047] to-[#F59E0B] border border-[#D97706] shadow-2xs"
                            : "bg-white/80 border border-stone-200 border-dashed"
                        }`}
                      >
                        <Star
                          size={10}
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

            {/* Quick Toolbar */}
            <div className="flex items-center gap-1">
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleResetCurrentRound}
                aria-label="Acak Ulang Gelembung"
                className="p-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1B4965] border border-stone-200 shadow-2xs cursor-pointer flex-shrink-0"
                title="Acak ulang posisi gelembung"
              >
                <RotateCcw size={14} />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleNextRound}
                aria-label="Ganti Huruf Berikutnya"
                className="p-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#92400E] border border-amber-300 shadow-2xs cursor-pointer flex-shrink-0"
                title="Lanjut ke Huruf Berikutnya"
              >
                <ChevronRight size={15} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ── Central Glass Bubble Arena Stage (flex-1 min-h-0 max-h-[55vh]) ── */}
        <section className="relative z-20 flex-1 min-h-0 max-h-[55vh] w-full max-w-6xl mx-auto px-4 my-auto overflow-hidden">
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
                className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 ${b.theme.border} bg-gradient-to-br ${b.theme.tint} backdrop-blur-xs ${b.theme.glow} shadow-md flex items-center justify-center font-display font-black text-xl sm:text-2xl lg:text-3xl select-none cursor-pointer relative active:scale-90 transition-transform`}
              >
                {/* Curved Glass Specular Highlight */}
                <div className="absolute top-1 left-2 w-3.5 h-2 bg-white/70 rounded-full rotate-[-30deg] pointer-events-none" />
                <div className="absolute bottom-1 right-2 w-1.5 h-1 bg-white/40 rounded-full rotate-[-30deg] pointer-events-none" />

                {/* Letter Glyph */}
                <span style={{ color: b.theme.text }} className="drop-shadow-xs">
                  {b.letter}
                </span>
              </motion.button>
            );
          })}
        </section>

        {/* ── Bottom Tier: Mascots Anchored in Lower Zones (h-[20%] sm:h-[22%] max-h-[140px]) ── */}
        <footer className="h-[20%] sm:h-[22%] max-h-[140px] relative flex items-end justify-between px-4 pb-1 pointer-events-none w-full max-w-7xl mx-auto flex-shrink-0">
          
          {/* Left Side: Saka Mascot */}
          <div className="flex flex-col items-center pointer-events-auto origin-bottom-left pb-1">
            {/* Dynamic Speech Bubble */}
            <AnimatePresence mode="wait">
              <motion.div
                key={speechBubbleText}
                initial={{ scale: 0.8, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -6 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="bg-white/95 border-2 border-[#1B4965]/20 rounded-2xl px-2.5 py-1 shadow-md w-[140px] sm:w-[170px] text-center mb-1 pointer-events-none relative z-30"
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
              <SakaMascot isWaving={isSakaJumping || roundComplete} className="h-24 sm:h-28 w-auto object-contain" />
            </motion.div>

            {/* Grassy Mound Base */}
            <div className="w-20 sm:w-28 h-2.5 bg-[#4ADE80] rounded-full blur-[1px] opacity-80 -mt-1.5" />
          </div>

          {/* Center: Completion Message Toast */}
          <div className="flex-1 flex justify-center pb-2 pointer-events-auto">
            <AnimatePresence>
              {roundComplete && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 450, damping: 20 }}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1.5 rounded-2xl shadow-lg border border-white flex items-center gap-1.5"
                >
                  <Sparkles size={16} className="text-yellow-300" />
                  <span className="font-display font-black text-xs sm:text-sm">
                    Luar Biasa! Semua Huruf {targetLetter} Ditemukan! (+1 Bintang)
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side: Tika Mascot */}
          <div className="flex flex-col items-center pointer-events-auto origin-bottom-right pb-1">
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
              <TikaMascot isCheering={isTikaJumping || roundComplete} className="h-24 sm:h-28 w-auto object-contain" />
            </motion.div>

            {/* Grassy Mound Base */}
            <div className="w-20 sm:w-28 h-2.5 bg-[#4ADE80] rounded-full blur-[1px] opacity-80 -mt-1.5" />
          </div>

        </footer>

      </div>
    </main>
  );
}
