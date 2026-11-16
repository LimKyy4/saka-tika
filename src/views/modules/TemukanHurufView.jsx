// src/views/modules/TemukanHurufView.jsx
// SAKA TIKA: High-Impact Coral-Ruby Bubble Arena, Spotlight Target Card & Giant Fireworks Celebration ("Temukan Huruf")
// 1. Theme-Matched Coral-Red & Ruby-Crimson Bubble Arena with Ambient Floating Mini Bubbles
// 2. High-Impact Central Spotlight Target Card with 3 Golden Bubble Coin Slots (Zero Stars, Zero Emojis)
// 3. 3D Iridescent Glass Bubbles with High-Contrast Letter Medallions, Magnifying Hover & 6s Idle Hint
// 4. Giant 3D Firecracker ("Petasan") & Fireworks Burst + Bold "CONGRATULATION!" Celebration (2.2s Duration)
// 5. Grounded Saka & Tika Companion Stage Anchored in Bottom-Left Corner with Soft Contact Shadows
// STRICT ZERO SCROLLBAR APP LOCK: h-screen w-screen overflow-hidden select-none.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector assets.

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Volume2, RotateCcw, Shuffle, Check, Sparkles } from "lucide-react";

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
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";

// 12 Natural, non-overlapping anchor positions across the 16:9 arena
// Bottom-left zone (< 35% left, > 60% top) is strictly reserved for Saka & Tika mascots
const BUBBLE_ZONE_ANCHORS = [
  // Top Row (5 bubbles)
  { left: 16, top: 22 },
  { left: 33, top: 20 },
  { left: 50, top: 23 },
  { left: 67, top: 20 },
  { left: 84, top: 23 },
  // Middle Row (4 bubbles)
  { left: 24, top: 46 },
  { left: 43, top: 43 },
  { left: 62, top: 45 },
  { left: 81, top: 47 },
  // Bottom Row (3 bubbles shifted right of mascots)
  { left: 42, top: 71 },
  { left: 64, top: 73 },
  { left: 85, top: 69 },
];

export default function TemukanHurufView() {
  const { addStars } = useGame();
  const { playSfx } = useAudio();

  // Non-repeating shuffle queue initialization (random start letter, no immediate repeats)
  const shuffleQueueRef = useRef(null);
  if (!shuffleQueueRef.current) {
    shuffleQueueRef.current = new ShuffleQueue(ALPHABET_DATA.length);
  }

  const [letterIndex, setLetterIndex] = useState(() => shuffleQueueRef.current.next());
  const [bubbles, setBubbles] = useState([]);
  const [foundIds, setFoundIds] = useState([]);
  const [wobbleId, setWobbleId] = useState(null);
  const [poppingId, setPoppingId] = useState(null);
  const [splashDroplets, setSplashDroplets] = useState([]);
  const [roundComplete, setRoundComplete] = useState(false);
  const [isMascotCheering, setIsMascotCheering] = useState(false);
  const [hintBubbleId, setHintBubbleId] = useState(null);

  const idleHintTimerRef = useRef(null);

  // Active target letter object from master dataset
  const currentTarget = useMemo(() => {
    return ALPHABET_DATA[letterIndex % ALPHABET_DATA.length];
  }, [letterIndex]);

  const targetLetter = currentTarget.letter;

  // Clear existing idle hint timer
  const clearIdleHint = useCallback(() => {
    setHintBubbleId(null);
    if (idleHintTimerRef.current) {
      clearTimeout(idleHintTimerRef.current);
      idleHintTimerRef.current = null;
    }
  }, []);

  // Schedule smart idle hint after 6 seconds of inactivity
  const scheduleIdleHint = useCallback((activeBubbles, activeFound) => {
    clearIdleHint();
    idleHintTimerRef.current = setTimeout(() => {
      const remainingTarget = activeBubbles.find(
        (b) => b.isTarget && !activeFound.includes(b.id)
      );
      if (remainingTarget) {
        setHintBubbleId(remainingTarget.id);
      }
    }, 6000);
  }, [clearIdleHint]);

  // Clean up idle hint timer on unmount
  useEffect(() => {
    return () => {
      if (idleHintTimerRef.current) {
        clearTimeout(idleHintTimerRef.current);
      }
    };
  }, []);

  // Initialize bubble arena for target letter (3 targets + 9 distractors = 12 bubbles)
  const setupRound = useCallback((target) => {
    clearIdleHint();

    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const distractorsPool = allLetters.filter((l) => l !== target);
    const shuffledPool = [...distractorsPool].sort(() => 0.5 - Math.random());

    const targetCount = 3;
    const distractorCount = 9;
    const items = [];

    // 3 Target bubbles
    for (let i = 0; i < targetCount; i++) {
      items.push({
        id: `target-${i}-${Date.now()}-${Math.random()}`,
        letter: target,
        isTarget: true,
      });
    }

    // 9 Distractor bubbles
    for (let i = 0; i < distractorCount; i++) {
      const dLetter = shuffledPool[i % shuffledPool.length];
      items.push({
        id: `distractor-${i}-${Date.now()}-${Math.random()}`,
        letter: dLetter,
        isTarget: false,
      });
    }

    // Shuffle and assign non-overlapping anchor positions
    const shuffledItems = items.sort(() => 0.5 - Math.random());
    const positionedBubbles = shuffledItems.map((item, idx) => {
      const anchor = BUBBLE_ZONE_ANCHORS[idx] || { left: 50, top: 50 };
      const jitterX = (Math.random() - 0.5) * 3;
      const jitterY = (Math.random() - 0.5) * 2.5;
      const floatDuration = 3.2 + Math.random() * 1.6;
      const floatDistance = 5 + Math.random() * 4;
      const floatDelay = Math.random() * 1.8;

      return {
        ...item,
        x: Math.max(12, Math.min(88, anchor.left + jitterX)),
        y: Math.max(18, Math.min(76, anchor.top + jitterY)),
        floatDuration,
        floatDistance,
        floatDelay,
      };
    });

    setBubbles(positionedBubbles);
    setFoundIds([]);
    setWobbleId(null);
    setPoppingId(null);
    setSplashDroplets([]);
    setRoundComplete(false);
    setIsMascotCheering(false);

    // Schedule 6-second smart idle hint for this round
    scheduleIdleHint(positionedBubbles, []);
  }, [clearIdleHint, scheduleIdleHint]);

  // Initialize round when targetLetter changes
  useEffect(() => {
    setupRound(targetLetter);
  }, [targetLetter, setupRound]);

  // Trigger multi-angle celebratory fireworks confetti rockets
  const fireFireworksRockets = () => {
    const end = Date.now() + 1800;
    const colors = ["#FDE047", "#F43F5E", "#38BDF8", "#34D399", "#C084FC", "#FB923C"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0.05, y: 0.75 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 0.95, y: 0.75 },
        colors,
      });
      confetti({
        particleCount: 6,
        angle: 90,
        spread: 80,
        origin: { x: 0.5, y: 0.5 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Next round transition
  const handleNextRound = useCallback(() => {
    playHoverSound();
    setLetterIndex(shuffleQueueRef.current.next());
  }, []);

  // Manual reset current round
  const handleResetCurrentRound = useCallback(() => {
    playHoverSound();
    setupRound(targetLetter);
  }, [setupRound, targetLetter]);

  // Handle bubble tap / click interaction
  const handleBubbleClick = (bubble) => {
    if (roundComplete || foundIds.includes(bubble.id)) return;

    // Reset idle hint timer on any tap
    clearIdleHint();

    if (bubble.isTarget) {
      const newFound = [...foundIds, bubble.id];
      const stageIdx = newFound.length - 1;

      setPoppingId(bubble.id);
      playBubblePopSound(stageIdx); // Ascending Do -> Re -> Mi chime

      // Spawn burst of 10 water droplet and golden spark particles
      const newDroplets = Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.35;
        const dist = 3.5 + Math.random() * 5.0;
        return {
          id: `${bubble.id}-drop-${i}-${Date.now()}`,
          startX: bubble.x,
          startY: bubble.y,
          targetX: Math.max(5, Math.min(95, bubble.x + Math.cos(angle) * dist)),
          targetY: Math.max(5, Math.min(95, bubble.y + Math.sin(angle) * dist)),
          size: Math.random() * 7 + 4,
          isSpark: i % 2 === 0,
        };
      });
      setSplashDroplets((prev) => [...prev, ...newDroplets]);
      setTimeout(() => {
        setSplashDroplets((prev) => prev.filter((d) => !d.id.startsWith(bubble.id)));
      }, 550);

      // Trigger mascot cheer
      setIsMascotCheering(true);
      setTimeout(() => setIsMascotCheering(false), 700);

      setTimeout(() => {
        setFoundIds(newFound);
        setPoppingId(null);
      }, 300);

      if (newFound.length >= 3) {
        // Round Complete: Launch Giant Fireworks Celebration
        setRoundComplete(true);
        playSuccessSound();
        playFanfareSound();
        addStars(1);

        fireFireworksRockets();

        // Hold celebration for 2.2 seconds (2200ms) before advancing
        setTimeout(() => {
          handleNextRound();
        }, 2200);
      } else {
        // Schedule next 6-second idle hint for remaining target
        scheduleIdleHint(bubbles, newFound);
      }
    } else {
      // Wrong bubble: soft rubber bounce + jelly jiggle (no punitive feedback)
      playRubberBoingSound();
      setWobbleId(bubble.id);
      setTimeout(() => setWobbleId(null), 500);

      // Reschedule idle hint
      scheduleIdleHint(bubbles, foundIds);
    }
  };

  // Manual audio pronunciation triggers (Strict zero auto-play on mount)
  const handleSpeakTarget = () => {
    playSfx("click");
    speakLetter(currentTarget);
  };

  const handleSpeakWord = () => {
    playSfx("click");
    speakInstruction(`${targetLetter} untuk ${currentTarget.word}!`);
  };

  // Ambient floating background mini soap bubbles (deterministic set)
  const ambientMiniBubbles = useMemo(
    () => [
      { left: 8, bottom: 12, size: 22, opacity: 0.35, duration: 7.5, delay: 0 },
      { left: 22, bottom: 8, size: 16, opacity: 0.4, duration: 6.8, delay: 1.5 },
      { left: 38, bottom: 14, size: 26, opacity: 0.3, duration: 8.2, delay: 0.8 },
      { left: 58, bottom: 10, size: 18, opacity: 0.45, duration: 7.0, delay: 2.2 },
      { left: 75, bottom: 16, size: 24, opacity: 0.35, duration: 7.8, delay: 1.1 },
      { left: 92, bottom: 12, size: 20, opacity: 0.4, duration: 6.5, delay: 0.4 },
    ],
    []
  );

  return (
    <main className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none p-1 sm:p-2">
      {/* ── 1. Theme-Matched Coral-Red & Ruby-Crimson Bubble Arena Backdrop ── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Base Atmospheric Linear Gradient */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(180deg, #F87171 0%, #EF4444 28%, #DC2626 58%, #B91C1C 82%, #991B1B 100%)",
          }}
        />

        {/* Soft Coral-Red to Ruby-Crimson Radial Stage Glow (#F26B6B to #A82424) */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% 42%, rgba(254, 202, 202, 0.42) 0%, rgba(242, 107, 107, 0.28) 45%, rgba(168, 36, 36, 0.72) 100%)",
          }}
        />

        {/* Ambient Floating Translucent Mini Soap Bubbles at Varied Depths */}
        {ambientMiniBubbles.map((ab, idx) => (
          <motion.div
            key={`ab-${idx}`}
            className="absolute rounded-full border border-white/45 pointer-events-none"
            style={{
              left: `${ab.left}%`,
              bottom: `${ab.bottom}%`,
              width: `${ab.size}px`,
              height: `${ab.size}px`,
              background:
                "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.75) 0%, rgba(254,205,211,0.28) 45%, rgba(244,114,182,0.18) 100%)",
              boxShadow:
                "inset 0 0 6px rgba(255,255,255,0.65), 0 0 8px rgba(255,255,255,0.22)",
              opacity: ab.opacity,
            }}
            animate={{
              y: [-10, -70, -130],
              x: [0, idx % 2 === 0 ? 10 : -10, 0],
              opacity: [ab.opacity, ab.opacity * 1.35, 0],
            }}
            transition={{
              duration: ab.duration,
              repeat: Infinity,
              delay: ab.delay,
              ease: "easeInOut",
            }}
          >
            <div className="absolute top-1 left-1.5 w-1.5 h-1 bg-white/85 rounded-full rotate-[-45deg]" />
          </motion.div>
        ))}

        {/* Decorative Magnifying-Glass Vector Accent in Top-Left Corner */}
        <div className="absolute top-2 left-3 sm:top-4 sm:left-6 w-20 h-20 sm:w-24 sm:h-24 opacity-35 pointer-events-none drop-shadow-md z-0">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <circle cx="42" cy="42" r="26" stroke="#FEF08A" strokeWidth="5" />
            <circle
              cx="42"
              cy="42"
              r="20"
              fill="rgba(255,255,255,0.14)"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="2"
            />
            <path
              d="M 30 26 Q 42 20 54 28"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="61"
              y1="61"
              x2="84"
              y2="84"
              stroke="#FEF08A"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <line
              x1="68"
              y1="68"
              x2="80"
              y2="80"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Decorative Sparkle Vector Accents in Top-Right Corner */}
        <div className="absolute top-3 right-4 sm:top-4 sm:right-6 w-22 h-18 opacity-40 pointer-events-none drop-shadow-md z-0">
          <svg viewBox="0 0 100 80" fill="none" className="w-full h-full">
            <path
              d="M 25 15 L 28 25 L 38 28 L 28 31 L 25 41 L 22 31 L 12 28 L 22 25 Z"
              fill="#FDE047"
            />
            <path
              d="M 68 28 L 70 35 L 77 37 L 70 39 L 68 46 L 66 39 L 59 37 L 66 35 Z"
              fill="#FFFFFF"
            />
            <path
              d="M 82 12 L 83 17 L 88 18 L 83 19 L 82 24 L 81 19 L 76 18 L 81 17 Z"
              fill="#FDE047"
            />
          </svg>
        </div>

        {/* Subtle Wave Floor / Ground Silhouette at Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-20 overflow-hidden pointer-events-none opacity-25">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path d="M0 40 Q360 80 720 30 T1440 50 L1440 120 L0 120 Z" fill="#7F1D1D" />
            <path d="M0 65 Q420 20 840 60 T1440 40 L1440 120 L0 120 Z" fill="#450A0A" />
          </svg>
        </div>
      </div>

      {/* ── 2. Subtle Dark Contrast Tint ─────────────────────── */}
      <div className="fixed inset-0 bg-[#000000]/10 pointer-events-none z-0" />

      {/* ── 3. Main Workspace Container ─────────────────────── */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col justify-between max-w-7xl w-full mx-auto">
        
        {/* ── Top Tier: High-Impact Spotlight Target Card (Zero Stars, Zero Overlap) ── */}
        <header className="w-full px-2 mt-1 sm:mt-1.5 flex justify-center flex-shrink-0 z-30">
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 450, damping: 22 }}
            className="bg-gradient-to-b from-[#FFFDF8] to-[#FFF7ED] border-3 sm:border-4 border-amber-300 border-b-6 border-b-amber-500 rounded-3xl px-3 sm:px-5 py-1.5 sm:py-2 shadow-[0_10px_28px_rgba(153,27,27,0.35)] ring-4 ring-amber-200/90 flex items-center justify-between gap-3 sm:gap-6 max-w-3xl w-full"
          >
            {/* Left Section: Target Word Illustration Card with Manual Audio Cue */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleSpeakWord}
              aria-label={`Dengarkan contoh kata ${currentTarget.word}`}
              className="flex items-center gap-2 bg-gradient-to-b from-amber-50 to-orange-50/90 border-2 border-amber-200 rounded-2xl px-2.5 py-1 shadow-xs cursor-pointer group flex-shrink-0"
              title="Ketuk untuk mendengarkan kata contoh"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center group-hover:scale-108 transition-transform">
                <WordIllustration
                  illustrationKey={currentTarget.illustrationKey}
                  word={currentTarget.word}
                  color={currentTarget.color}
                  showBadge={false}
                  className="w-full h-full object-contain drop-shadow-xs"
                />
              </div>
              <div className="text-left hidden xs:block">
                <span className="font-display font-black text-xs sm:text-sm text-slate-800 leading-tight block truncate max-w-[90px]">
                  {currentTarget.word}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Volume2 size={11} className="text-amber-600 stroke-[2.5]" />
                  <span className="font-sans font-bold text-[9px] text-amber-700 block whitespace-nowrap">
                    Ketuk Suara
                  </span>
                </div>
              </div>
            </motion.button>

            {/* Center Section: Highlighted Target Letter (Giant 3D Embossed Tile) */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-center min-w-0">
              <span className="font-display font-black text-xs sm:text-sm md:text-base text-amber-900 tracking-wider uppercase whitespace-nowrap">
                CARI HURUF:
              </span>

              {/* Giant Glowing 3D Target Letter Tile */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.12, rotate: 3 }}
                whileTap={{ scale: 0.92 }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                onClick={handleSpeakTarget}
                aria-label={`Dengarkan bunyi huruf target ${targetLetter}`}
                className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-b from-[#FDE047] via-[#F59E0B] to-[#D97706] text-white font-display font-black text-2xl sm:text-3xl flex items-center justify-center border-2 border-white shadow-lg ring-3 ring-amber-300/90 cursor-pointer flex-shrink-0"
                title="Ketuk untuk mendengarkan bunyi huruf target"
              >
                {targetLetter}
              </motion.button>

              {/* Quick Speaker Action */}
              <button
                type="button"
                onClick={handleSpeakTarget}
                aria-label="Bunyikan Huruf Target"
                className="p-1 sm:p-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-[#0284C7] cursor-pointer transition-colors shadow-2xs"
              >
                <Volume2 size={15} />
              </button>
            </div>

            {/* Right Section: 3 Large Golden Bubble Coin Slots (Zero Stars Motif) */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div
                className="flex items-center gap-1.5 sm:gap-2 bg-amber-100/70 border-2 border-amber-300/80 px-2.5 py-1 rounded-2xl shadow-inner"
                title="Kumpulkan 3 gelembung huruf target!"
              >
                {[0, 1, 2].map((slotIdx) => {
                  const isFilled = slotIdx < foundIds.length;
                  return (
                    <motion.div
                      key={slotIdx}
                      initial={false}
                      animate={
                        isFilled
                          ? { scale: [0.6, 1.25, 1], rotate: [0, -10, 0] }
                          : { scale: 1 }
                      }
                      transition={{ type: "spring", stiffness: 500, damping: 16 }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center relative transition-all ${
                        isFilled
                          ? "bg-gradient-to-b from-[#FDE047] via-[#F59E0B] to-[#D97706] border-2 border-white shadow-md ring-2 ring-amber-400"
                          : "bg-white/70 border-2 border-dashed border-amber-300 shadow-inner"
                      }`}
                    >
                      {isFilled ? (
                        <>
                          <span className="font-display font-black text-xs sm:text-sm text-white drop-shadow">
                            {targetLetter}
                          </span>
                          {/* Mini checkmark sparkle badge on top-right */}
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-white shadow-xs">
                            <Check size={8} strokeWidth={3.5} />
                          </span>
                        </>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full border border-amber-400/50 bg-amber-200/40" />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Round Controls: Reset Round & Shuffle New Letter */}
              <div className="flex items-center gap-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1, rotate: -8 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleResetCurrentRound}
                  aria-label="Acak Ulang Posisi Gelembung"
                  className="p-1.5 rounded-xl bg-white hover:bg-stone-100 text-slate-700 border border-stone-200 shadow-xs cursor-pointer"
                  title="Acak ulang posisi gelembung"
                >
                  <RotateCcw size={15} />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1, rotate: 8 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNextRound}
                  aria-label="Ganti Huruf Target Baru"
                  className="p-1.5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white border border-amber-600 shadow-xs cursor-pointer"
                  title="Ganti ke huruf target baru"
                >
                  <Shuffle size={15} />
                </motion.button>
              </div>
            </div>

          </motion.div>
        </header>

        {/* ── Central Glass Bubble Arena Stage: 3D Iridescent Soap Bubbles ── */}
        <section className="relative z-20 flex-1 min-h-0 w-full max-w-6xl mx-auto px-4 my-auto overflow-hidden">
          
          {/* Water Droplet and Golden Spark Particles */}
          {splashDroplets.map((d) => (
            <motion.div
              key={d.id}
              initial={{ left: `${d.startX}%`, top: `${d.startY}%`, opacity: 0.95, scale: 1 }}
              animate={{ left: `${d.targetX}%`, top: `${d.targetY}%`, opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: `${d.size}px`,
                height: `${d.size}px`,
                borderRadius: "9999px",
                transform: "translate(-50%, -50%)",
                background: d.isSpark
                  ? "radial-gradient(circle, #FDE047 30%, #F59E0B 80%)"
                  : "radial-gradient(circle, rgba(255,255,255,0.95) 20%, rgba(56,189,248,0.75) 80%)",
                boxShadow: d.isSpark
                  ? "0 0 8px rgba(251,191,36,0.9)"
                  : "0 0 6px rgba(255,255,255,0.9)",
                pointerEvents: "none",
                zIndex: 40,
              }}
            />
          ))}

          {/* 12 Interactive 3D Soap Bubbles */}
          {bubbles.map((b) => {
            const isFound = foundIds.includes(b.id);
            const isPopping = poppingId === b.id;
            const isWobble = wobbleId === b.id;
            const isHinted = hintBubbleId === b.id && !isFound && !roundComplete;

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
                whileHover={{
                  scale: 1.15,
                  rotate: [0, -3, 3, 0],
                  transition: { type: "spring", stiffness: 450, damping: 12 },
                }}
                whileTap={{ scale: 0.88 }}
                animate={
                  isPopping
                    ? {
                        scale: [1, 1.45, 0],
                        opacity: [1, 0.9, 0],
                      }
                    : isWobble
                    ? {
                        scale: [1, 1.25, 0.85, 1.12, 1],
                        rotate: [-14, 14, -8, 8, 0],
                      }
                    : isHinted
                    ? {
                        y: [-b.floatDistance, b.floatDistance, -b.floatDistance],
                        scale: [1, 1.14, 1],
                        filter: [
                          "drop-shadow(0 0 4px rgba(251,191,36,0.4))",
                          "drop-shadow(0 0 16px rgba(251,191,36,0.95))",
                          "drop-shadow(0 0 4px rgba(251,191,36,0.4))",
                        ],
                      }
                    : {
                        y: [-b.floatDistance, b.floatDistance, -b.floatDistance],
                        x: [-2, 2, -2],
                        rotate: [-2, 2, -2],
                      }
                }
                transition={
                  isPopping
                    ? { duration: 0.35, ease: "easeOut" }
                    : isWobble
                    ? { duration: 0.45, ease: "easeInOut" }
                    : isHinted
                    ? {
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : {
                        duration: b.floatDuration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: b.floatDelay,
                      }
                }
                className="w-18 h-18 sm:w-21 sm:h-21 lg:w-24 lg:h-24 rounded-full flex items-center justify-center select-none cursor-pointer relative active:scale-90 transition-transform group"
              >
                {/* Outer Glass Sphere with Specular Glow & Rainbow Rim */}
                <div className="absolute inset-0 rounded-full border-2 border-white/60 bg-[radial-gradient(ellipse_at_30%_25%,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.3)_40%,rgba(244,114,182,0.2)_75%,rgba(56,189,248,0.35)_100%)] shadow-[inset_0_0_14px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(192,132,252,0.25),0_8px_20px_rgba(0,0,0,0.2)] group-hover:shadow-[0_0_18px_rgba(255,255,255,0.85),inset_0_0_16px_rgba(255,255,255,0.95)] transition-shadow pointer-events-none" />

                {/* Client Authentic 3D Soap Bubble Sprite (gelembung.png) */}
                <img
                  src="/assets/gelembung.png"
                  alt="Gelembung"
                  draggable="false"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none rounded-full select-none opacity-90"
                />

                {/* Primary Curved Specular Gloss Highlight (Top-Left) */}
                <div className="absolute top-1.5 left-2.5 w-5 sm:w-6 h-2 sm:h-2.5 bg-white/95 rounded-full rotate-[-45deg] blur-[0.3px] shadow-[0_0_5px_rgba(255,255,255,0.95)] pointer-events-none z-20" />

                {/* Secondary Tiny Specular Point */}
                <div className="absolute top-4 left-1.5 w-1.5 h-1.5 bg-white/90 rounded-full pointer-events-none z-20" />

                {/* High-Contrast Cream & Gold Letter Medallion (Guarantees Total Readability) */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-13 lg:h-13 rounded-full bg-gradient-to-b from-white to-amber-50/95 border-2 border-amber-300/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.2)] flex items-center justify-center pointer-events-none z-15 group-hover:scale-105 transition-transform">
                  <span className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-none drop-shadow-xs">
                    {b.letter}
                  </span>
                </div>

                {/* Smart Golden Shimmer Ring Ripple when idle for 6 seconds */}
                {isHinted && (
                  <motion.div
                    className="absolute -inset-1 rounded-full border-2 border-amber-400 pointer-events-none"
                    animate={{ scale: [1, 1.25], opacity: [0.9, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </motion.button>
            );
          })}
        </section>

        {/* ── 4. Saka & Tika Mascot Companion Stage (Anchored Bottom-Left Corner) ── */}
        <div className="fixed bottom-0 left-2 sm:left-4 z-30 pointer-events-none select-none flex flex-col items-center">
          {/* Saka & Tika Mascot Cutouts Standing Firmly */}
          <div className="relative flex items-end justify-center -mb-2">
            {/* Saka Mascot Cutout */}
            <motion.img
              src="/assets/saka-maskot-1-cutout.png"
              alt="Saka Maskot"
              animate={
                roundComplete
                  ? { y: [-20, 0, -12, 0], scale: [1, 1.08, 1] }
                  : isMascotCheering
                  ? { y: [-16, 0, -8, 0], scale: [1, 1.05, 1] }
                  : { y: [0, -3, 0] }
              }
              transition={
                roundComplete
                  ? { duration: 0.8, repeat: 2, ease: "easeOut" }
                  : isMascotCheering
                  ? { duration: 0.65, ease: "easeOut" }
                  : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
              }
              className="h-28 sm:h-32 lg:h-36 w-auto object-contain object-bottom drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] pointer-events-none"
              style={{ imageRendering: "-webkit-optimize-contrast" }}
            />

            {/* Tika Mascot Cutout */}
            <motion.img
              src="/assets/tika-maskot-1-cutout.png"
              alt="Tika Maskot"
              animate={
                roundComplete
                  ? { y: [-22, 0, -14, 0], scale: [1, 1.08, 1] }
                  : isMascotCheering
                  ? { y: [-18, 0, -9, 0], scale: [1, 1.05, 1] }
                  : { y: [0, -3.5, 0] }
              }
              transition={
                roundComplete
                  ? { duration: 0.8, delay: 0.08, repeat: 2, ease: "easeOut" }
                  : isMascotCheering
                  ? { duration: 0.65, delay: 0.08, ease: "easeOut" }
                  : { duration: 3.5, repeat: Infinity, delay: 0.4, ease: "easeInOut" }
              }
              className="h-28 sm:h-32 lg:h-36 w-auto object-contain object-bottom drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] pointer-events-none -ml-4"
              style={{ imageRendering: "-webkit-optimize-contrast" }}
            />
          </div>

          {/* Soft Ground Contact Shadows Beneath Sneakers */}
          <div className="relative w-44 sm:w-48 h-3 flex items-center justify-around pointer-events-none -mt-1">
            <div className="w-16 h-3 bg-[#450A0A]/40 rounded-full blur-[2px]" />
            <div className="w-16 h-3 bg-[#450A0A]/40 rounded-full blur-[2px]" />
          </div>
        </div>

        {/* ── 5. Giant Firecracker ("Petasan") & Fireworks CONGRATULATION! Celebration Modal ── */}
        <AnimatePresence>
          {roundComplete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
              {/* Semi-translucent celebratory backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-xs"
              />

              {/* Main Celebratory 3D Firecracker & Fireworks Card */}
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

                {/* 3D Festive Firecracker ("Petasan") & Fireworks Burst Vector Artwork */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 mb-2 relative flex items-center justify-center">
                  <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
                    <defs>
                      <linearGradient id="crackerRed" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#EF4444" />
                        <stop offset="50%" stopColor="#DC2626" />
                        <stop offset="100%" stopColor="#991B1B" />
                      </linearGradient>
                      <linearGradient id="crackerGold" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FDE047" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>

                    {/* Exploding Firework Rays */}
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

                    {/* Sparkling Firework Comets */}
                    <circle cx="60" cy="8" r="3.5" fill="#38BDF8" />
                    <circle cx="100" cy="20" r="4" fill="#F43F5E" />
                    <circle cx="114" cy="60" r="3.5" fill="#34D399" />
                    <circle cx="100" cy="100" r="4" fill="#FDE047" />
                    <circle cx="20" cy="100" r="3.5" fill="#A78BFA" />
                    <circle cx="6" cy="60" r="4" fill="#F43F5E" />
                    <circle cx="20" cy="20" r="3.5" fill="#38BDF8" />

                    {/* Crossed Firecracker ("Petasan") Sticks */}
                    <g transform="translate(60, 60) rotate(-25) translate(-60, -60)">
                      <rect x="52" y="28" width="16" height="64" rx="4" fill="url(#crackerRed)" stroke="#7F1D1D" strokeWidth="1.5" />
                      <rect x="52" y="34" width="16" height="8" fill="url(#crackerGold)" />
                      <rect x="52" y="78" width="16" height="8" fill="url(#crackerGold)" />
                      <path d="M 60 28 Q 60 18 68 14" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <circle cx="68" cy="14" r="3" fill="#FEF08A" />
                    </g>

                    <g transform="translate(60, 60) rotate(25) translate(-60, -60)">
                      <rect x="52" y="28" width="16" height="64" rx="4" fill="url(#crackerRed)" stroke="#7F1D1D" strokeWidth="1.5" />
                      <rect x="52" y="34" width="16" height="8" fill="url(#crackerGold)" />
                      <rect x="52" y="78" width="16" height="8" fill="url(#crackerGold)" />
                      <path d="M 60 28 Q 60 18 52 14" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <circle cx="52" cy="14" r="3" fill="#FEF08A" />
                    </g>

                    {/* Center Sparkle Explosion Flash */}
                    <circle cx="60" cy="60" r="10" fill="#FEF08A" />
                    <circle cx="60" cy="60" r="5" fill="#FFFFFF" />
                  </svg>
                </div>

                {/* Bold 3D "CONGRATULATION!" Celebratory Title */}
                <h2 className="font-display font-black text-3xl sm:text-4xl text-[#B91C1C] tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(251,191,36,0.5)]">
                  CONGRATULATION!
                </h2>

                {/* Mission Success Affirmation Message */}
                <p className="font-sans font-black text-sm sm:text-base text-amber-900 mt-2 leading-relaxed">
                  Luar Biasa! Semua 3 Gelembung Huruf{" "}
                  <span className="font-display font-black text-xl sm:text-2xl text-red-600 px-1">
                    {targetLetter}
                  </span>{" "}
                  Berhasil Ditemukan!
                </p>

                {/* Subtitle badge */}
                <div className="mt-3 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-sans font-bold text-xs shadow-md flex items-center gap-1.5">
                  <Sparkles size={14} className="text-yellow-300" />
                  <span>Siap Lanjut ke Huruf Berikutnya!</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
