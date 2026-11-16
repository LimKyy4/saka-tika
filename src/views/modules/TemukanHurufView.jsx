// src/views/modules/TemukanHurufView.jsx
// SAKA TIKA: Studio-Grade Coral-Ruby Bubble Arena Overhaul for "Temukan Huruf" (Kindergarten / TK Edition)
// 1. Removed Question Word Image (Zero image distraction; children focus 100% on letter shape)
// 2. Enlarged & Highlighted 3D Question Card with High-Gloss Amber Frame & Chunky Audio Button
// 3. Ultra-Legible Target Letter Coins with Radiant Golden Glow Halos & Deep Dark-Navy Fredoka Typography
// 4. Balanced, Spacious 10-Bubble Curved Formation with Zero Edge Cropping or Zoom Distortion
// 5. Living Ambient Coral-Red Arena with 14 Floating Micro-Bubbles & Twinkling 4-Point Sparkles (Unchanged Color)
// 6. Compact Grounded Saka & Tika Stage Mound with Multi-Stage Speech Bubble (No Screen Intrusion)
// 7. Juicy Pop Physics (Do-Re-Mi Chimes) & Giant Firecracker ("Petasan") CONGRATULATION! Celebration
// STRICT ZERO SCROLLBAR APP LOCK: h-screen w-screen overflow-hidden select-none.
// STRICT ZERO EMOJIS & ZERO STAR ICONS POLICY: Exclusively lucide-react icons or custom vector assets.
// STRICT AUDIO CONTROL: Never auto-play voice narration or SFX on initial mount.

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Volume2, RotateCcw, Shuffle, Check, Sparkles } from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { ALPHABET_DATA } from "../../data/masterDataset.js";
import { speakLetter } from "../../utils/speechEngine.js";
import {
  playBubblePopSound,
  playRubberBoingSound,
  playHoverSound,
  playSuccessSound,
  playFanfareSound,
  playXylophoneNote,
} from "../../utils/soundSynthesizer.js";
import { ShuffleQueue } from "../../utils/shuffleQueue.js";

// 10 Balanced, non-overlapping anchor positions arranged in a spacious 2-row curved formation
// Row 1 (Top Arc, 5 bubbles) & Row 2 (Bottom Arc, 5 bubbles)
// Shifted safely to leave the bottom-left quadrant entirely clear for Saka & Tika's compact stage mound
const BUBBLE_ZONE_ANCHORS = [
  // Row 1: Top Curved Formation (5 bubbles across upper stage)
  { left: 16, top: 29 },
  { left: 33, top: 25 },
  { left: 50, top: 24 },
  { left: 67, top: 25 },
  { left: 84, top: 29 },
  // Row 2: Bottom Curved Formation (5 bubbles across lower-mid stage)
  { left: 24, top: 62 },
  { left: 39, top: 58 },
  { left: 54, top: 57 },
  { left: 69, top: 58 },
  { left: 84, top: 62 },
];

export default function TemukanHurufView() {
  const { addStars } = useGame();
  const { playSfx } = useAudio();

  // Non-repeating Fisher-Yates shuffle queue initialization
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

  const autoAdvanceTimer = useRef(null);

  // Active target letter object from master dataset
  const currentTarget = useMemo(() => {
    return ALPHABET_DATA[letterIndex % ALPHABET_DATA.length];
  }, [letterIndex]);

  const targetLetter = currentTarget.letter;

  // Initialize round: 10 bubbles (3 target bubbles + 7 unique distractors)
  const setupRound = useCallback((target) => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }

    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const distractorsPool = allLetters.filter((l) => l !== target);
    const shuffledDistractors = [...distractorsPool].sort(() => 0.5 - Math.random());

    const targetCount = 3;
    const distractorCount = 7;
    const items = [];

    // 3 Target bubbles
    for (let i = 0; i < targetCount; i++) {
      items.push({
        id: `target-${i}-${Date.now()}-${Math.random()}`,
        letter: target,
        isTarget: true,
      });
    }

    // 7 Distractor bubbles
    for (let i = 0; i < distractorCount; i++) {
      items.push({
        id: `distractor-${i}-${Date.now()}-${Math.random()}`,
        letter: shuffledDistractors[i % shuffledDistractors.length],
        isTarget: false,
      });
    }

    // Shuffle and assign clean 2-row curved anchor positions
    const shuffledItems = items.sort(() => 0.5 - Math.random());
    const positionedBubbles = shuffledItems.map((item, idx) => {
      const anchor = BUBBLE_ZONE_ANCHORS[idx] || { left: 50, top: 50 };
      const jitterX = (Math.random() - 0.5) * 1.8;
      const jitterY = (Math.random() - 0.5) * 1.8;
      const floatDuration = 3.2 + Math.random() * 1.4;
      const floatDelay = idx * 0.18;

      return {
        ...item,
        x: Math.max(12, Math.min(88, anchor.left + jitterX)),
        y: Math.max(22, Math.min(72, anchor.top + jitterY)),
        floatDuration,
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
  }, []);

  // Initialize round when targetLetter changes
  useEffect(() => {
    setupRound(targetLetter);
    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
    };
  }, [targetLetter, setupRound]);

  // Celebratory confetti rockets
  const fireFireworksRockets = () => {
    const end = Date.now() + 1800;
    const colors = ["#FDE047", "#F43F5E", "#38BDF8", "#34D399", "#C084FC", "#FB923C"];

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0.08, y: 0.72 },
        colors,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 0.92, y: 0.72 },
        colors,
      });
      confetti({
        particleCount: 7,
        angle: 90,
        spread: 85,
        origin: { x: 0.5, y: 0.45 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Next round transition
  const handleNextRound = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    playHoverSound();
    setLetterIndex(shuffleQueueRef.current.next());
  }, []);

  // Reset current round
  const handleResetCurrentRound = useCallback(() => {
    playHoverSound();
    setupRound(targetLetter);
  }, [setupRound, targetLetter]);

  // Handle bubble tap / click interaction
  const handleBubbleClick = (bubble) => {
    if (roundComplete || foundIds.includes(bubble.id)) return;

    if (bubble.isTarget) {
      const newFound = [...foundIds, bubble.id];
      const stageIdx = newFound.length - 1;

      setPoppingId(bubble.id);

      // Ascending musical chime (Do -> Re -> Mi) + pop synthesizer
      playXylophoneNote(stageIdx);
      playBubblePopSound(stageIdx);

      // Spawn burst of 10 water droplet & gold spark particles
      const newDroplets = Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.35;
        const dist = 3.5 + Math.random() * 4.5;
        return {
          id: `${bubble.id}-drop-${i}-${Date.now()}`,
          startX: bubble.x,
          startY: bubble.y,
          targetX: Math.max(5, Math.min(95, bubble.x + Math.cos(angle) * dist)),
          targetY: Math.max(5, Math.min(95, bubble.y + Math.sin(angle) * dist)),
          size: Math.random() * 6 + 4,
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
        // Round Complete: Launch Giant Firecracker Celebration Modal
        setRoundComplete(true);
        playSuccessSound();
        playFanfareSound();
        if (typeof addStars === "function") addStars(1);

        fireFireworksRockets();

        // Hold celebration for exactly 2.2 seconds (2200ms) before advancing
        autoAdvanceTimer.current = setTimeout(() => {
          handleNextRound();
        }, 2200);
      }
    } else {
      // Wrong bubble: soft rubber bounce + playful jelly jiggle (no punitive buzzer)
      playRubberBoingSound();
      setWobbleId(bubble.id);
      setTimeout(() => setWobbleId(null), 500);
    }
  };

  // Manual audio pronunciation trigger (Strict zero auto-play on mount)
  const handleSpeakTarget = () => {
    if (typeof playSfx === "function") playSfx("click");
    speakLetter(currentTarget);
  };

  // Dynamic Encouraging Speech Bubble Text based on progress
  const speechBubbleText = useMemo(() => {
    if (foundIds.length === 0) {
      return `Ayo ketuk 3 huruf ${targetLetter} yang bersinar!`;
    }
    if (foundIds.length === 1) {
      return "Hebat! Kurang 2 lagi!";
    }
    if (foundIds.length === 2) {
      return `Tinggal 1 huruf ${targetLetter} lagi!`;
    }
    return `Luar biasa! Semua huruf ${targetLetter} ditemukan!`;
  }, [foundIds.length, targetLetter]);

  // 14 Ambient floating background mini soap bubbles (Unchanged colors, living animation)
  const ambientMiniBubbles = useMemo(
    () => [
      { left: 6, bottom: 10, size: 22, opacity: 0.35, duration: 7.2, delay: 0 },
      { left: 14, bottom: 6, size: 16, opacity: 0.4, duration: 6.5, delay: 1.8 },
      { left: 22, bottom: 12, size: 28, opacity: 0.32, duration: 8.0, delay: 0.5 },
      { left: 32, bottom: 8, size: 18, opacity: 0.42, duration: 7.4, delay: 2.5 },
      { left: 44, bottom: 14, size: 24, opacity: 0.36, duration: 8.2, delay: 1.2 },
      { left: 54, bottom: 9, size: 32, opacity: 0.3, duration: 8.8, delay: 0.7 },
      { left: 63, bottom: 15, size: 20, opacity: 0.45, duration: 6.8, delay: 2.1 },
      { left: 72, bottom: 7, size: 26, opacity: 0.38, duration: 7.6, delay: 1.4 },
      { left: 81, bottom: 13, size: 18, opacity: 0.4, duration: 7.0, delay: 0.3 },
      { left: 90, bottom: 8, size: 30, opacity: 0.34, duration: 8.4, delay: 2.0 },
      { left: 96, bottom: 14, size: 16, opacity: 0.42, duration: 6.6, delay: 0.9 },
      { left: 28, bottom: 18, size: 14, opacity: 0.35, duration: 6.2, delay: 3.1 },
      { left: 68, bottom: 20, size: 22, opacity: 0.36, duration: 7.5, delay: 2.8 },
      { left: 48, bottom: 16, size: 16, opacity: 0.38, duration: 6.9, delay: 3.5 },
    ],
    []
  );

  // 10 Twinkling 4-Point Sparkles (Zero emojis, zero star icons)
  const ambientSparkles = useMemo(
    () => [
      { left: 10, top: 18, size: 20, duration: 3.5, delay: 0.2, color: "#FEF08A" },
      { left: 22, top: 40, size: 16, duration: 4.2, delay: 1.5, color: "#FFFFFF" },
      { left: 88, top: 20, size: 22, duration: 3.8, delay: 0.8, color: "#FDE047" },
      { left: 92, top: 48, size: 18, duration: 4.5, delay: 2.2, color: "#FFFFFF" },
      { left: 40, top: 16, size: 14, duration: 3.2, delay: 1.1, color: "#FEF08A" },
      { left: 60, top: 15, size: 15, duration: 3.9, delay: 2.7, color: "#FDE047" },
      { left: 18, top: 76, size: 16, duration: 4.0, delay: 0.6, color: "#FEF08A" },
      { left: 80, top: 78, size: 18, duration: 3.6, delay: 1.9, color: "#FFFFFF" },
      { left: 48, top: 74, size: 14, duration: 4.4, delay: 3.0, color: "#FDE047" },
      { left: 74, top: 38, size: 16, duration: 3.7, delay: 1.3, color: "#FEF08A" },
    ],
    []
  );

  return (
    <main className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none p-2 sm:p-3">
      {/* ── 1. Living Coral-Red & Ruby-Crimson Bubble Arena (Unchanged Palette, Highly Dynamic) ── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Base Atmospheric Linear Gradient */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(180deg, #F25C5C 0%, #EF4444 26%, #DC2626 55%, #B91C1C 80%, #991B1B 100%)",
          }}
        />

        {/* Living Breathing Stage Spotlight Glow */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          animate={{ opacity: [0.38, 0.54, 0.38] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse at 50% 48%, rgba(254, 215, 170, 0.45) 0%, rgba(244, 114, 182, 0.22) 42%, rgba(153, 27, 27, 0.7) 100%)",
          }}
        />

        {/* 14 Living Ambient Micro-Bubbles Drifting & Floating Smoothly */}
        {ambientMiniBubbles.map((ab, idx) => (
          <motion.div
            key={`ab-${idx}`}
            className="absolute rounded-full border border-white/55 pointer-events-none"
            style={{
              left: `${ab.left}%`,
              bottom: `${ab.bottom}%`,
              width: `${ab.size}px`,
              height: `${ab.size}px`,
              background:
                "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.85) 0%, rgba(254,205,211,0.35) 45%, rgba(244,114,182,0.2) 100%)",
              boxShadow:
                "inset 0 0 6px rgba(255,255,255,0.75), 0 0 10px rgba(255,255,255,0.3)",
              opacity: ab.opacity,
            }}
            animate={{
              y: [-10, -90, -180],
              x: [0, idx % 2 === 0 ? 15 : -15, 0],
              opacity: [ab.opacity, ab.opacity * 1.4, 0],
              scale: [0.9, 1.05, 0.95],
            }}
            transition={{
              duration: ab.duration,
              repeat: Infinity,
              delay: ab.delay,
              ease: "easeInOut",
            }}
          >
            <div className="absolute top-1 left-1.5 w-1.5 h-1 bg-white/95 rounded-full -rotate-45" />
          </motion.div>
        ))}

        {/* Twinkling 4-Point Sparkles Distributed Across the Arena */}
        {ambientSparkles.map((sp, idx) => (
          <motion.div
            key={`sp-${idx}`}
            className="absolute pointer-events-none"
            style={{
              left: `${sp.left}%`,
              top: `${sp.top}%`,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
            }}
            animate={{
              opacity: [0.1, 0.75, 0.1],
              scale: [0.75, 1.25, 0.75],
              rotate: [0, 45, 0],
            }}
            transition={{
              duration: sp.duration,
              repeat: Infinity,
              delay: sp.delay,
              ease: "easeInOut",
            }}
          >
            <svg viewBox="0 0 24 24" fill={sp.color} className="w-full h-full drop-shadow-sm">
              <path d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z" />
            </svg>
          </motion.div>
        ))}

        {/* Smooth Natural Ground Silhouette at Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-20 overflow-hidden pointer-events-none opacity-20">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path d="M0 45 Q360 80 720 35 T1440 50 L1440 120 L0 120 Z" fill="#7F1D1D" />
            <path d="M0 70 Q420 25 840 65 T1440 45 L1440 120 L0 120 Z" fill="#450A0A" />
          </svg>
        </div>
      </div>

      {/* ── 2. Subtle Overall Contrast Tint ── */}
      <div className="fixed inset-0 bg-[#000000]/10 pointer-events-none z-0" />

      {/* ── 3. Main Workspace Container ── */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col justify-between max-w-7xl w-full mx-auto">
        
        {/* ── Tier 1: Enlarged & Highlighted Spotlight Target Question Card (No Word Image) ── */}
        <header className="w-full px-2 pt-1 sm:pt-2 flex justify-center flex-shrink-0 z-30">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="w-auto max-w-4xl mx-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-[2.5rem] bg-gradient-to-b from-[#FFFDF9] via-[#FFFBEB] to-[#FEF3C7] border-4 sm:border-[5px] border-amber-400 border-b-6 sm:border-b-8 border-b-amber-600 shadow-[0_16px_36px_rgba(136,19,55,0.45),0_0_45px_rgba(251,191,36,0.4)] ring-4 ring-amber-300/50 flex items-center justify-center gap-5 sm:gap-7 md:gap-9"
          >
            {/* Left: Tactile Sky-Blue Speaker Button to Hear Letter Sound */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.92, y: 2 }}
              onClick={handleSpeakTarget}
              aria-label={`Dengarkan Bunyi Huruf Target ${targetLetter}`}
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 border-b-4 border-blue-800 text-white shadow-md cursor-pointer flex items-center justify-center active:border-b-0 active:translate-y-1 flex-shrink-0"
              title="Ketuk untuk mendengarkan bunyi huruf"
            >
              <Volume2 size={24} className="stroke-[2.5]" />
            </motion.button>

            {/* Center: "CARI HURUF:" + Oversized 3D Golden Target Letter Tile */}
            <div className="flex items-center gap-3.5 sm:gap-5 flex-shrink-0">
              <span className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-[#0F172A] tracking-wider leading-none uppercase drop-shadow-xs">
                CARI HURUF:
              </span>

              {/* Oversized 3D Golden-Amber Target Letter Tile with Breathing Pulse */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.92 }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                onClick={handleSpeakTarget}
                aria-label={`Huruf Target ${targetLetter}`}
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-2 border-white/90 border-b-6 border-b-amber-700 shadow-[0_10px_20px_rgba(217,119,6,0.5),inset_0_2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-black text-white leading-none cursor-pointer"
                title="Huruf target yang harus dicari"
              >
                {targetLetter}
              </motion.button>
            </div>

            {/* Right: 3 Large Circular Golden Bubble Coin Slots + Round Action Buttons */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              {/* 3 Golden Progress Slots */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                {[0, 1, 2].map((slotIdx) => {
                  const isFilled = slotIdx < foundIds.length;
                  return (
                    <motion.div
                      key={slotIdx}
                      initial={false}
                      animate={
                        isFilled
                          ? { scale: [0.6, 1.25, 1], rotate: [0, -8, 0] }
                          : { scale: 1 }
                      }
                      transition={{ type: "spring", stiffness: 500, damping: 16 }}
                      className={`w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full flex items-center justify-center relative transition-all ${
                        isFilled
                          ? "bg-gradient-to-b from-[#FEF08A] via-[#FDE047] to-[#F59E0B] border-2 border-amber-500 border-b-4 border-b-amber-700 shadow-[0_6px_14px_rgba(245,158,11,0.5)] ring-2 ring-amber-300 text-amber-950 font-black"
                          : "bg-amber-100/70 border-3 border-dashed border-amber-400/80 shadow-inner"
                      }`}
                    >
                      {isFilled ? (
                        <>
                          <span className="font-display font-black text-xl sm:text-2xl text-amber-950 leading-none drop-shadow-xs">
                            {targetLetter}
                          </span>
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xs">
                            <Check size={11} strokeWidth={3.5} />
                          </span>
                        </>
                      ) : (
                        <span className="w-3 h-3 rounded-full bg-amber-400/60" />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Control Action Buttons: Reset & Next/Shuffle */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.92, y: 2 }}
                  onClick={handleResetCurrentRound}
                  aria-label="Acak Ulang Posisi"
                  className="p-2.5 sm:p-3 rounded-2xl bg-white hover:bg-slate-100 border-2 border-slate-200 border-b-4 border-slate-300 text-slate-700 shadow-sm cursor-pointer active:border-b-0 active:translate-y-1"
                  title="Acak ulang posisi gelembung"
                >
                  <RotateCcw size={18} className="stroke-[2.5]" />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.92, y: 2 }}
                  onClick={handleNextRound}
                  aria-label="Ganti Huruf Target"
                  className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 border-2 border-amber-300 border-b-4 border-amber-600 text-white shadow-md cursor-pointer active:border-b-0 active:translate-y-1"
                  title="Ganti ke huruf target acak berikutnya"
                >
                  <Shuffle size={18} className="stroke-[2.5]" />
                </motion.button>
              </div>
            </div>

          </motion.div>
        </header>

        {/* ── Tier 2: 10 Bubbles in Clean 2-Row Curved Formation ── */}
        <section className="relative z-20 flex-1 min-h-0 w-full max-w-6xl mx-auto px-4 my-auto overflow-hidden">
          
          {/* Water Droplet and Golden Spark Particles on Correct Tap */}
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

          {/* 10 Interactive 3D Soap Bubbles with Solid Opaque Coins & High Visibility */}
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
                whileHover={{
                  scale: 1.16,
                  transition: { type: "spring", stiffness: 450, damping: 15 },
                }}
                whileTap={{ scale: 0.9 }}
                animate={
                  isPopping
                    ? { scale: [1, 1.4, 0], opacity: [1, 0.8, 0] }
                    : isWobble
                    ? { x: [-8, 8, -5, 5, 0], rotate: [-8, 8, -4, 4, 0] }
                    : b.isTarget
                    ? {
                        y: [-5, 5, -5],
                        scale: [1, 1.07, 1],
                      }
                    : {
                        y: [-4, 4, -4],
                      }
                }
                transition={
                  isPopping
                    ? { duration: 0.32, ease: "easeOut" }
                    : isWobble
                    ? { duration: 0.45, ease: "easeInOut" }
                    : {
                        duration: b.floatDuration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: b.floatDelay,
                      }
                }
                className={`w-24 h-24 sm:w-26 sm:h-26 md:w-28 md:h-28 rounded-full flex items-center justify-center select-none cursor-pointer relative active:scale-95 transition-all group ${
                  b.isTarget
                    ? "ring-4 sm:ring-[5px] ring-amber-300 ring-offset-2 ring-offset-amber-500/30 shadow-[0_0_36px_rgba(253,224,71,1)]"
                    : "shadow-xl hover:ring-4 hover:ring-white/90 hover:shadow-[0_0_24px_rgba(255,255,255,0.8)]"
                }`}
              >
                {/* Glossy Translucent Soap-Bubble Outer Rim */}
                <div className="absolute inset-0 rounded-full border-2 border-white/85 bg-[radial-gradient(ellipse_at_30%_25%,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.3)_35%,rgba(254,205,211,0.2)_65%,rgba(56,189,248,0.3)_100%)] shadow-[inset_0_0_12px_rgba(255,255,255,0.8),0_8px_20px_rgba(0,0,0,0.22)] pointer-events-none" />

                {/* Client Authentic 3D Soap Bubble Sprite (gelembung.png) */}
                <img
                  src="/assets/gelembung.png"
                  alt="Gelembung"
                  draggable="false"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none rounded-full opacity-80"
                />

                {/* Primary Specular Curved Highlight in Top-Left */}
                <div className="absolute top-2 left-3 w-4.5 h-2.5 bg-white/95 rounded-full -rotate-45 blur-[0.2px] pointer-events-none z-20" />
                <div className="absolute top-4 left-2 w-1.5 h-1.5 bg-white/90 rounded-full pointer-events-none z-20" />

                {/* Solid Opaque Circular Letter Coin (100% Contrast & Legibility for Kindergarteners) */}
                <div
                  className={`w-17 h-17 sm:w-19 sm:h-19 md:w-21 md:h-21 rounded-full shadow-inner flex items-center justify-center pointer-events-none z-15 transition-transform group-hover:scale-105 ${
                    b.isTarget
                      ? "bg-gradient-to-b from-[#FFFBEB] via-[#FEF08A] to-[#FDE047] border-3 border-amber-400 border-b-4 border-b-amber-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_4px_12px_rgba(217,119,6,0.45)]"
                      : "bg-[#FFFFFF] border-2 border-slate-300 border-b-3 border-b-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_3px_8px_rgba(0,0,0,0.15)]"
                  }`}
                >
                  <span
                    className={`font-display font-black text-4xl sm:text-5xl md:text-5xl leading-none ${
                      b.isTarget
                        ? "text-[#0F172A] drop-shadow-[0_1.5px_0_#FDE68A]"
                        : "text-[#1E293B] drop-shadow-[0_1px_0_#E2E8F0]"
                    }`}
                  >
                    {b.letter}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </section>

        {/* ── Tier 3: Compact Grounded Saka & Tika Stage Mound (Bottom-Left, Zero Edge Zooming) ── */}
        <div className="fixed bottom-0 left-2 sm:left-4 z-30 pointer-events-none select-none flex flex-col items-center">
          {/* Dynamic Encouraging Speech Bubble above Mascots */}
          <AnimatePresence mode="wait">
            <motion.div
              key={speechBubbleText}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="mb-1 px-3 py-1.5 rounded-2xl bg-white/95 border-2 border-amber-300 shadow-md flex items-center gap-1.5 max-w-[210px] text-center"
            >
              <span className="font-sans font-bold text-[11px] sm:text-xs text-amber-950 leading-tight">
                {speechBubbleText}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Saka & Tika Mascot Cutouts Standing Firmly and Compact */}
          <div className="relative flex items-end justify-center -mb-1">
            {/* Saka Mascot Cutout */}
            <motion.img
              src="/assets/saka-maskot-1-cutout.png"
              alt="Saka Maskot"
              animate={
                roundComplete
                  ? { y: [-14, 0, -8, 0], scale: [1, 1.05, 1] }
                  : isMascotCheering
                  ? { y: [-12, 0, -6, 0], scale: [1, 1.04, 1] }
                  : { y: [0, -2.5, 0] }
              }
              transition={
                roundComplete
                  ? { duration: 0.8, repeat: 2, ease: "easeOut" }
                  : isMascotCheering
                  ? { duration: 0.65, ease: "easeOut" }
                  : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
              }
              className="h-22 sm:h-26 md:h-28 w-auto object-contain object-bottom drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] pointer-events-none"
              style={{ imageRendering: "-webkit-optimize-contrast" }}
            />

            {/* Tika Mascot Cutout */}
            <motion.img
              src="/assets/tika-maskot-1-cutout.png"
              alt="Tika Maskot"
              animate={
                roundComplete
                  ? { y: [-16, 0, -10, 0], scale: [1, 1.05, 1] }
                  : isMascotCheering
                  ? { y: [-14, 0, -7, 0], scale: [1, 1.04, 1] }
                  : { y: [0, -3, 0] }
              }
              transition={
                roundComplete
                  ? { duration: 0.8, delay: 0.08, repeat: 2, ease: "easeOut" }
                  : isMascotCheering
                  ? { duration: 0.65, delay: 0.08, ease: "easeOut" }
                  : { duration: 3.5, repeat: Infinity, delay: 0.4, ease: "easeInOut" }
              }
              className="h-22 sm:h-26 md:h-28 w-auto object-contain object-bottom drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] pointer-events-none -ml-3"
              style={{ imageRendering: "-webkit-optimize-contrast" }}
            />
          </div>

          {/* Soft Ground Stage Mound & Contact Shadows */}
          <div className="relative w-40 sm:w-44 h-3 flex items-center justify-around pointer-events-none -mt-1">
            <div className="w-16 h-3 bg-[#450A0A]/40 rounded-full blur-[2px]" />
            <div className="w-16 h-3 bg-[#450A0A]/40 rounded-full blur-[2px]" />
          </div>
        </div>

        {/* ── Tier 4: Giant Firecracker ("Petasan") & Fireworks CONGRATULATION! Celebration Modal ── */}
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
                <p className="font-sans font-black text-sm sm:text-base text-amber-950 mt-2 leading-relaxed">
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
