// src/views/modules/TemukanHurufView.jsx
// SAKA TIKA: High-End Commercial 3D Soap Bubble Arena for "Temukan Huruf" (Mini-Game 1)
// Strictly adheres to Global 3-Tier Height Budgeting:
// - Top spotlight target instruction banner: "CARI HURUF: [ A ]" with 3 golden star progress slots & WordIllustration
// - Central glass bubble arena stage wrapped with flex-1 min-h-0 max-h-[55vh]
// - Glossy 3D soap bubbles with translucent iridescent gradients, white gloss reflections & bouncy jelly hover reactions
// - Mascots remain anchored in lower zones without intruding into game puzzle hitboxes
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

// 3D Soap bubble iridescent color themes with soft multi-layer refraction tints
const SOAP_BUBBLE_THEMES = [
  {
    name: "iridescent-cyan",
    tint: "bg-[radial-gradient(ellipse_at_30%_25%,rgba(255,255,255,0.9)_0%,rgba(240,249,255,0.45)_35%,rgba(224,242,254,0.35)_60%,rgba(244,114,182,0.25)_85%,rgba(56,189,248,0.45)_100%)]",
    border: "border-sky-300/80",
    glow: "shadow-[inset_0_0_14px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(192,132,252,0.2),0_8px_20px_rgba(56,189,248,0.25)]",
    reflex: "bg-pink-300/40",
  },
  {
    name: "iridescent-rose",
    tint: "bg-[radial-gradient(ellipse_at_30%_25%,rgba(255,255,255,0.9)_0%,rgba(255,241,242,0.45)_35%,rgba(254,205,211,0.35)_60%,rgba(165,243,252,0.25)_85%,rgba(244,114,182,0.45)_100%)]",
    border: "border-rose-300/80",
    glow: "shadow-[inset_0_0_14px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(147,197,253,0.2),0_8px_20px_rgba(244,114,182,0.25)]",
    reflex: "bg-sky-300/40",
  },
  {
    name: "iridescent-amber",
    tint: "bg-[radial-gradient(ellipse_at_30%_25%,rgba(255,255,255,0.9)_0%,rgba(254,249,195,0.45)_35%,rgba(254,215,170,0.35)_60%,rgba(196,181,253,0.25)_85%,rgba(251,191,36,0.45)_100%)]",
    border: "border-amber-300/80",
    glow: "shadow-[inset_0_0_14px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(167,243,208,0.2),0_8px_20px_rgba(251,191,36,0.25)]",
    reflex: "bg-emerald-300/40",
  },
  {
    name: "iridescent-mint",
    tint: "bg-[radial-gradient(ellipse_at_30%_25%,rgba(255,255,255,0.9)_0%,rgba(236,253,245,0.45)_35%,rgba(167,243,208,0.35)_60%,rgba(244,114,182,0.25)_85%,rgba(52,211,153,0.45)_100%)]",
    border: "border-emerald-300/80",
    glow: "shadow-[inset_0_0_14px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(196,181,253,0.2),0_8px_20px_rgba(52,211,153,0.25)]",
    reflex: "bg-indigo-300/40",
  },
  {
    name: "iridescent-lavender",
    tint: "bg-[radial-gradient(ellipse_at_30%_25%,rgba(255,255,255,0.9)_0%,rgba(245,243,255,0.45)_35%,rgba(221,214,254,0.35)_60%,rgba(254,215,170,0.25)_85%,rgba(167,139,250,0.45)_100%)]",
    border: "border-purple-300/80",
    glow: "shadow-[inset_0_0_14px_rgba(255,255,255,0.8),inset_0_-4px_8px_rgba(125,211,252,0.2),0_8px_20px_rgba(167,139,250,0.25)]",
    reflex: "bg-amber-300/40",
  },
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
  const [splashDroplets, setSplashDroplets] = useState([]);
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
      const theme = SOAP_BUBBLE_THEMES[Math.floor(Math.random() * SOAP_BUBBLE_THEMES.length)];
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
      const theme = SOAP_BUBBLE_THEMES[Math.floor(Math.random() * SOAP_BUBBLE_THEMES.length)];
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
      const floatDistance = 6 + Math.random() * 5;
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
    setSplashDroplets([]);
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

      // Spawn burst of 8 water droplet splash particles around the popped bubble
      const newDroplets = Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 3.5 + Math.random() * 4.5;
        return {
          id: `${bubble.id}-drop-${i}-${Date.now()}`,
          startX: bubble.x,
          startY: bubble.y,
          targetX: Math.max(5, Math.min(95, bubble.x + Math.cos(angle) * dist)),
          targetY: Math.max(5, Math.min(95, bubble.y + Math.sin(angle) * dist)),
          size: Math.random() * 6 + 4,
        };
      });
      setSplashDroplets((prev) => [...prev, ...newDroplets]);
      setTimeout(() => {
        setSplashDroplets((prev) => prev.filter((d) => !d.id.startsWith(bubble.id)));
      }, 500);

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
          particleCount: 90,
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
        
        {/* ── Top Tier: Spotlight Target Instruction Banner ("CARI HURUF: [ A ]") ── */}
        <div className="w-full px-2 mt-1 flex justify-center flex-shrink-0">
          <motion.div
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 450, damping: 22 }}
            className="bg-white/95 backdrop-blur-md border-3 border-amber-300 border-b-5 border-b-amber-500 rounded-3xl px-3 sm:px-5 py-1.5 sm:py-2 shadow-xl flex items-center justify-between gap-3 sm:gap-6 max-w-3xl w-full"
          >
            {/* Target Word Illustration Card with Speaker Action */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08, rotate: -2 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleSpeakWord}
              aria-label={`Dengarkan contoh kata ${currentTarget.word}`}
              className="flex items-center gap-2 bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl px-2.5 py-1 shadow-xs cursor-pointer group flex-shrink-0"
              title="Klik untuk mendengarkan pengucapan kata"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center group-hover:scale-110 transition-transform">
                <WordIllustration
                  illustrationKey={currentTarget.illustrationKey}
                  word={currentTarget.word}
                  color={currentTarget.color}
                  className="w-full h-full object-contain drop-shadow-xs"
                />
              </div>
              <div className="text-left hidden xs:block">
                <span className="font-display font-black text-xs sm:text-sm text-[#1B4965] leading-tight block">
                  {currentTarget.word}
                </span>
                <span className="font-sans font-semibold text-[9px] text-amber-600 block">
                  Ketuk Suara
                </span>
              </div>
            </motion.button>

            {/* Center: Spotlight Target Mission Banner ("CARI HURUF: [ A ]") */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-center min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm sm:text-base md:text-lg text-[#1B4965] tracking-wide uppercase">
                  CARI HURUF:
                </span>

                {/* Glowing 3D Target Letter Tile */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  whileTap={{ scale: 0.92 }}
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  onClick={handleSpeakTarget}
                  aria-label={`Dengarkan bunyi huruf target ${targetLetter}`}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-400 to-orange-400 text-white font-display font-black text-2xl sm:text-3xl flex items-center justify-center border-2 border-white shadow-lg ring-3 ring-amber-300/80 cursor-pointer flex-shrink-0"
                  title="Klik untuk mendengarkan bunyi huruf target"
                >
                  {targetLetter}
                </motion.button>

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
              <div className="flex items-center gap-1.5 sm:gap-2 bg-amber-50/80 border border-amber-200 px-2 sm:px-2.5 py-1 rounded-2xl shadow-inner">
                {[0, 1, 2].map((slotIdx) => {
                  const isSlotFilled = slotIdx < foundIds.length;
                  return (
                    <motion.div
                      key={slotIdx}
                      initial={false}
                      animate={isSlotFilled ? { scale: [1.35, 1], rotate: [0, 15, 0] } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSlotFilled
                          ? "bg-gradient-to-b from-[#FDE047] to-[#F59E0B] border-2 border-[#D97706] shadow-xs"
                          : "bg-white/80 border-2 border-stone-200 border-dashed"
                      }`}
                    >
                      {isSlotFilled ? (
                        <img
                          src="/assets/bintang-emas.png"
                          alt="Bintang Emas"
                          className="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain pointer-events-none drop-shadow-xs"
                        />
                      ) : (
                        <Star
                          size={12}
                          className="text-stone-300 fill-transparent"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Quick Toolbar */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleResetCurrentRound}
                aria-label="Acak Ulang Gelembung"
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1B4965] border border-stone-200 shadow-2xs cursor-pointer"
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
                className="p-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#92400E] border border-amber-300 shadow-2xs cursor-pointer"
                title="Lanjut ke Huruf Berikutnya"
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </motion.div>

          {/* Friendly Guidance Pill */}
          <AnimatePresence mode="wait">
            {speechBubbleText && (
              <motion.div
                key={speechBubbleText}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="mt-1.5 px-3 py-0.5 rounded-full bg-white/90 border border-amber-200 shadow-2xs flex items-center gap-1.5 text-center"
              >
                <span className="font-sans font-bold text-[11px] text-[#1B4965]">
                  {speechBubbleText}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Central Glass Bubble Arena Stage: Floating 3D Soap Bubbles ── */}
        <section className="relative z-20 flex-1 min-h-0 w-full max-w-6xl mx-auto px-4 my-auto overflow-hidden">
          
          {/* Water Droplet Splash Particles */}
          {splashDroplets.map((d) => (
            <motion.div
              key={d.id}
              initial={{ left: `${d.startX}%`, top: `${d.startY}%`, opacity: 0.95, scale: 1 }}
              animate={{ left: `${d.targetX}%`, top: `${d.targetY}%`, opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: `${d.size}px`,
                height: `${d.size}px`,
                borderRadius: "9999px",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, rgba(255,255,255,0.95) 20%, rgba(56,189,248,0.75) 80%)",
                boxShadow: "0 0 6px rgba(255,255,255,0.9)",
                pointerEvents: "none",
                zIndex: 35,
              }}
            />
          ))}

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
                  scale: 1.18,
                  rotate: [0, -4, 4, 0],
                  transition: { type: "spring", stiffness: 450, damping: 10 },
                }}
                whileTap={{ scale: 0.86 }}
                animate={
                  isPopping
                    ? {
                        scale: [1, 1.5, 0],
                        opacity: [1, 0.9, 0],
                      }
                    : isWobble
                    ? {
                        scale: [1, 1.25, 0.85, 1.12, 1],
                        rotate: [-14, 14, -8, 8, 0],
                      }
                    : {
                        y: [-b.floatDistance, b.floatDistance, -b.floatDistance],
                        x: [-2, 2, -2],
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
                className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-full border-2 ${b.theme.border} ${b.theme.tint} backdrop-blur-xs ${b.theme.glow} flex items-center justify-center font-display font-black text-2xl sm:text-3xl lg:text-4xl select-none cursor-pointer relative active:scale-90 transition-transform overflow-hidden`}
              >
                {/* ── Client Authentic 3D Soap Bubble Asset (gelembung.png) ── */}
                <img
                  src="/assets/gelembung.png"
                  alt="Gelembung"
                  draggable="false"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none rounded-full select-none"
                />

                {/* ── Primary Top-Left Curved Gloss Highlight ── */}
                <div className="absolute top-1.5 left-2 w-4 sm:w-5 h-2 sm:h-2.5 bg-white/90 rounded-full rotate-[-45deg] blur-[0.3px] shadow-[0_0_4px_rgba(255,255,255,0.9)] pointer-events-none z-10" />

                {/* ── Secondary Tiny Specular Point ── */}
                <div className="absolute top-3.5 left-1 w-1.5 h-1.5 bg-white/85 rounded-full pointer-events-none z-10" />

                {/* ── Bottom-Right Soft Iridescent Rim Reflex ── */}
                <div className={`absolute bottom-1.5 right-2 w-3 sm:w-3.5 h-1.5 sm:h-2 ${b.theme.reflex} rounded-full rotate-[-40deg] blur-[0.4px] pointer-events-none z-10`} />

                {/* ── High-Contrast Letter Glyph ── */}
                <span className="text-[#0F172A] drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] z-10">
                  {b.letter}
                </span>
              </motion.button>
            );
          })}
        </section>

        {/* ── Bottom Tier: Floating Completion Message Toast ── */}
        <div className="relative flex items-center justify-center px-4 pb-3 pointer-events-none w-full max-w-2xl mx-auto flex-shrink-0 min-h-[48px]">
          <AnimatePresence>
            {roundComplete && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-2xl shadow-xl border-2 border-white flex items-center gap-2 pointer-events-auto"
              >
                <Sparkles size={18} className="text-yellow-300" />
                <span className="font-display font-black text-xs sm:text-sm">
                  Luar Biasa! Semua Huruf {targetLetter} Ditemukan! (+1 Bintang)
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}
