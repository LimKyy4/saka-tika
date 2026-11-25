// src/views/modules/MengetikHurufView.jsx
// SAKA TIKA: "Mengetik Huruf" - Living Arcade Redesign
// - Strictly common, unmistakable everyday Indonesian words & animals
// - Enlarged Hero Illustration -> Compact Sleek Question Pill -> Unique 3D Toy Typewriter Key-Bed Console
// - Lush grounded meadow hills for Saka & Tika + vibrant spotlight & pastel workshop motes
// STRICT ZERO SCROLLBAR APP LOCK: h-screen w-screen overflow-hidden select-none.
// STRICT ZERO EMOJIS & ZERO STAR ICONS POLICY: Only lucide-react icons (no Star) and custom vectors.
// STRICT AUDIO GATING: Never auto-play voice narration or SFX on initial mount or word load.

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Volume2, RotateCcw, Check, Play } from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { speakWord, speakLetter } from "../../utils/speechEngine.js";
import {
  playXylophoneNote,
  playRubberBoingSound,
  playHoverSound,
  playClickSound,
  playSuccessSound,
  playFanfareSound,
  playBubblePopSound,
  playSunChime,
} from "../../utils/soundSynthesizer.js";
import { ShuffleQueue } from "../../utils/shuffleQueue.js";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";

// Curated unambiguous everyday Indonesian objects & animals (all have PNG assets)
const COMMON_EVERYDAY_WORDS = [
  "APEL", "AYAM", "AWAN",
  "BOLA", "BUKU", "CERI",
  "DADU", "DAUN", "GAJAH",
  "GITAR", "IKAN", "JERUK",
  "KUCING", "KUDA", "LAMPU",
  "MOBIL", "NANAS", "PISANG",
  "RODA", "ROTI", "RUMAH",
  "SAPI", "SUSU", "TOPI",
  "ULAR", "WORTEL", "YOYO",
  "ZEBRA",
];

export default function MengetikHurufView() {
  const { addStars } = useGame();
  const { playSfx } = useAudio();

  const shuffleQueueRef = useRef(null);
  if (!shuffleQueueRef.current) {
    shuffleQueueRef.current = new ShuffleQueue(COMMON_EVERYDAY_WORDS.length);
  }

  const [currentWord, setCurrentWord] = useState(() => {
    const idx = shuffleQueueRef.current.next();
    return COMMON_EVERYDAY_WORDS[idx] || "AYAM";
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isWordComplete, setIsWordComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wobbleIndex, setWobbleIndex] = useState(null);
  const [tappedTileIndex, setTappedTileIndex] = useState(null);
  const [isMascotCheering, setIsMascotCheering] = useState(false);
  const [sparkleBursts, setSparkleBursts] = useState([]);

  const [isIllustrationBouncing, setIsIllustrationBouncing] = useState(false);
  const [spinBlock, setSpinBlock] = useState(null);
  const [spinMusicNote, setSpinMusicNote] = useState(false);
  const [poppedBubbles, setPoppedBubbles] = useState({});

  const celebrationDelayTimer = useRef(null);
  const autoAdvanceTimer = useRef(null);
  const confettiRafRef = useRef(null);

  const expectedChar = useMemo(() => {
    if (activeIndex < currentWord.length) {
      return currentWord[activeIndex];
    }
    return "";
  }, [currentWord, activeIndex]);

  useEffect(() => {
    return () => {
      if (celebrationDelayTimer.current) clearTimeout(celebrationDelayTimer.current);
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
      if (confettiRafRef.current) {
        cancelAnimationFrame(confettiRafRef.current);
        confettiRafRef.current = null;
      }
    };
  }, []);

  const loadWord = useCallback((word) => {
    if (celebrationDelayTimer.current) {
      clearTimeout(celebrationDelayTimer.current);
      celebrationDelayTimer.current = null;
    }
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    setCurrentWord(word);
    setActiveIndex(0);
    setIsWordComplete(false);
    setShowCelebration(false);
    setWobbleIndex(null);
    setTappedTileIndex(null);
    setSparkleBursts([]);
    setIsIllustrationBouncing(false);
  }, []);

  const handleNextWord = useCallback(() => {
    playHoverSound();
    const nextIdx = shuffleQueueRef.current.next();
    loadWord(COMMON_EVERYDAY_WORDS[nextIdx] || "BOLA");
  }, [loadWord]);

  const triggerConfettiRockets = () => {
    if (confettiRafRef.current) {
      cancelAnimationFrame(confettiRafRef.current);
    }
    const end = Date.now() + 1800;
    const colors = ["#FDE047", "#F43F5E", "#38BDF8", "#34D399", "#C084FC", "#FB923C"];

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 60,
        origin: { x: 0.08, y: 0.72 },
        colors,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 60,
        origin: { x: 0.92, y: 0.72 },
        colors,
      });
      if (Date.now() < end) {
        confettiRafRef.current = requestAnimationFrame(frame);
      } else {
        confettiRafRef.current = null;
      }
    })();
  };

  // Physical keyboard typing validation (A-Z)
  const validateKey = useCallback(
    (pressedChar) => {
      if (isWordComplete || showCelebration || activeIndex >= currentWord.length) return;

      if (pressedChar === expectedChar) {
        const nextIndex = activeIndex + 1;
        playXylophoneNote(activeIndex % 5);

        setTappedTileIndex(activeIndex);
        setTimeout(() => setTappedTileIndex(null), 260);

        const burstId = `burst-${activeIndex}-${Date.now()}`;
        setSparkleBursts((prev) => [...prev, { id: burstId, index: activeIndex }]);
        setTimeout(() => {
          setSparkleBursts((prev) => prev.filter((b) => b.id !== burstId));
        }, 600);

        setIsMascotCheering(true);
        setTimeout(() => setIsMascotCheering(false), 550);

        if (nextIndex >= currentWord.length) {
          setActiveIndex(nextIndex);
          setIsWordComplete(true);
          playSuccessSound();
          playFanfareSound();
          if (typeof addStars === "function") addStars(1);
          triggerConfettiRockets();

          celebrationDelayTimer.current = setTimeout(() => {
            setShowCelebration(true);
            autoAdvanceTimer.current = setTimeout(() => {
              handleNextWord();
            }, 2400);
          }, 550);
        } else {
          setActiveIndex(nextIndex);
        }
      } else {
        playRubberBoingSound();
        setWobbleIndex(activeIndex);
        setTimeout(() => setWobbleIndex(null), 450);
      }
    },
    [
      isWordComplete,
      showCelebration,
      activeIndex,
      currentWord,
      expectedChar,
      addStars,
      handleNextWord,
    ]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isWordComplete || showCelebration) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key && e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        validateKey(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [validateKey, isWordComplete, showCelebration]);

  const handleActiveBlockTap = () => {
    playXylophoneNote(activeIndex % 5);
    speakLetter(expectedChar);
    setWobbleIndex(activeIndex);
    setTimeout(() => setWobbleIndex(null), 400);
  };

  const handleCompletedBlockTap = (index) => {
    playXylophoneNote(index % 5);
    speakLetter(currentWord[index]);
    setTappedTileIndex(index);
    setTimeout(() => setTappedTileIndex(null), 350);
  };

  const handleResetCurrentWord = useCallback(() => {
    playHoverSound();
    if (celebrationDelayTimer.current) {
      clearTimeout(celebrationDelayTimer.current);
      celebrationDelayTimer.current = null;
    }
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    setActiveIndex(0);
    setIsWordComplete(false);
    setShowCelebration(false);
    setWobbleIndex(null);
    setTappedTileIndex(null);
  }, []);

  const handleSpeakTargetWord = () => {
    if (typeof playSfx === "function") playSfx("click");
    else playClickSound();
    setIsIllustrationBouncing(true);
    speakWord({ letter: currentWord[0], word: currentWord });
    setTimeout(() => setIsIllustrationBouncing(false), 600);
  };

  const handleMascotTap = () => {
    playHoverSound();
    setIsMascotCheering(true);
    setTimeout(() => setIsMascotCheering(false), 600);
  };

  const handleTapOrnamentBlock = (letter) => {
    playXylophoneNote(letter.charCodeAt(0) % 5);
    speakLetter(letter);
    setSpinBlock(letter);
    setTimeout(() => setSpinBlock(null), 700);
  };

  const handleTapMusicNote = () => {
    playSunChime();
    setSpinMusicNote(true);
    setTimeout(() => setSpinMusicNote(false), 800);
  };

  const handlePopBubble = (idx) => {
    playBubblePopSound(idx % 4);
    setPoppedBubbles((prev) => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      setPoppedBubbles((prev) => ({ ...prev, [idx]: false }));
    }, 1200);
  };

  const ambientBubbles = useMemo(
    () => [
      { left: 9, bottom: 14, size: 22, duration: 7.2, delay: 0 },
      { left: 19, bottom: 18, size: 15, duration: 6.4, delay: 1.5 },
      { left: 31, bottom: 12, size: 25, duration: 8.1, delay: 0.7 },
      { left: 46, bottom: 16, size: 18, duration: 7.0, delay: 2.2 },
      { left: 58, bottom: 12, size: 26, duration: 8.4, delay: 1.1 },
      { left: 71, bottom: 18, size: 17, duration: 6.8, delay: 2.6 },
      { left: 82, bottom: 14, size: 22, duration: 7.7, delay: 0.4 },
      { left: 90, bottom: 16, size: 18, duration: 6.6, delay: 1.8 },
    ],
    []
  );

  const pastelMotes = useMemo(
    () => [
      { top: "18%", left: "14%", size: 11, color: "#FDE68A", delay: 0.2 },
      { top: "28%", left: "8%", size: 9, color: "#7DD3FC", delay: 1.1 },
      { top: "48%", left: "12%", size: 10, color: "#FBCFE8", delay: 0.6 },
      { top: "20%", left: "85%", size: 11, color: "#A7F3D0", delay: 0.9 },
      { top: "36%", left: "92%", size: 10, color: "#FDE68A", delay: 1.5 },
      { top: "54%", left: "88%", size: 9, color: "#7DD3FC", delay: 0.4 },
    ],
    []
  );

  return (
    <main className="relative z-10 flex flex-col h-screen w-screen max-h-screen overflow-hidden justify-between select-none p-3 sm:p-4">
      {/* ── 1. Living Magenta-Berry Arcade Stage Backdrop ── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(180deg, #E92B7A 0%, #D81B60 28%, #BE185D 58%, #9D174D 82%, #831843 100%)",
          }}
        />

        {/* Upper-Center Diagonal Spotlight Beams */}
        <div
          aria-hidden="true"
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-[135vw] h-[85vh] opacity-25"
          style={{
            background:
              "conic-gradient(from 156deg at 50% 0%, transparent 0deg, rgba(255,241,242,0.5) 14deg, transparent 28deg, rgba(254,243,199,0.45) 42deg, transparent 56deg, rgba(255,241,242,0.5) 70deg, transparent 86deg)",
          }}
        />

        <motion.div
          className="absolute inset-0 w-full h-full"
          animate={{ opacity: [0.42, 0.62, 0.42] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse at 50% 38%, rgba(255, 241, 246, 0.52) 0%, rgba(233, 43, 122, 0.2) 48%, rgba(131, 24, 67, 0.72) 100%)",
          }}
        />

        {/* Pastel Floating Geometric Motes */}
        {pastelMotes.map((m, idx) => (
          <motion.div
            key={`mote-${idx}`}
            style={{
              top: m.top,
              left: m.left,
              width: m.size,
              height: m.size,
              backgroundColor: m.color,
              boxShadow: `0 0 12px ${m.color}`,
            }}
            animate={{ y: [0, -14, 0], opacity: [0.35, 0.9, 0.35], scale: [0.9, 1.2, 0.9] }}
            transition={{ duration: 3.6 + idx * 0.3, repeat: Infinity, delay: m.delay, ease: "easeInOut" }}
            className={`absolute ${idx % 2 === 0 ? "rounded-full" : "rounded-sm rotate-45"}`}
          />
        ))}

        {/* Softly Bobbing A, B, C & Musical Note Ornaments (Clear of Corner HUD) */}
        <motion.div
          onClick={() => handleTapOrnamentBlock("A")}
          animate={
            spinBlock === "A"
              ? { rotate: [0, 360], scale: [1, 1.25, 1] }
              : { y: [-5, 5, -5], rotate: [-4, 4, -4] }
          }
          whileHover={{ scale: 1.12 }}
          className="hidden sm:flex absolute top-22 right-24 w-11 h-11 md:w-13 md:h-13 rounded-2xl bg-gradient-to-b from-[#FCE7F3] to-[#FBCFE8] border-2 border-pink-300 border-b-4 border-b-pink-500 shadow-lg items-center justify-center opacity-85 pointer-events-auto cursor-pointer z-10"
        >
          <span className="font-display font-black text-xl text-pink-700">A</span>
        </motion.div>

        <motion.div
          onClick={() => handleTapOrnamentBlock("B")}
          animate={
            spinBlock === "B"
              ? { rotate: [0, -360], scale: [1, 1.25, 1] }
              : { y: [5, -5, 5], rotate: [5, -5, 5] }
          }
          whileHover={{ scale: 1.12 }}
          className="hidden sm:flex absolute top-24 right-8 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-b from-[#FEF08A] to-[#FDE047] border-2 border-amber-300 border-b-4 border-b-amber-500 shadow-lg items-center justify-center opacity-85 pointer-events-auto cursor-pointer z-10"
        >
          <span className="font-display font-black text-xl text-amber-900">B</span>
        </motion.div>

        <motion.div
          onClick={() => handleTapOrnamentBlock("C")}
          animate={
            spinBlock === "C"
              ? { rotate: [0, 360], scale: [1, 1.25, 1] }
              : { y: [-4, 6, -4], rotate: [-3, 5, -3] }
          }
          whileHover={{ scale: 1.12 }}
          className="hidden lg:flex absolute top-40 right-16 w-11 h-11 rounded-2xl bg-gradient-to-b from-[#BAE6FD] to-[#7DD3FC] border-2 border-sky-200 border-b-4 border-b-sky-600 shadow-lg items-center justify-center opacity-85 pointer-events-auto cursor-pointer z-10"
        >
          <span className="font-display font-black text-lg text-[#0F172A]">C</span>
        </motion.div>

        <motion.div
          onClick={handleTapMusicNote}
          animate={
            spinMusicNote
              ? { rotate: [0, 18, -18, 0], scale: [1, 1.2, 1] }
              : { y: [-4, 4, -4], scale: [0.97, 1.03, 0.97] }
          }
          whileHover={{ scale: 1.1 }}
          className="hidden sm:block absolute top-22 left-7 w-14 h-14 md:w-16 md:h-16 opacity-45 pointer-events-auto cursor-pointer drop-shadow-sm z-10"
        >
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
        </motion.div>

        {/* Translucent Floating Bubbles */}
        {ambientBubbles.map((ab, idx) => {
          if (poppedBubbles[idx]) return null;
          return (
            <motion.div
              key={`ab-${idx}`}
              onClick={() => handlePopBubble(idx)}
              className="absolute rounded-full border border-white/60 pointer-events-auto cursor-pointer"
              style={{
                left: `${ab.left}%`,
                bottom: `${ab.bottom}%`,
                width: `${ab.size}px`,
                height: `${ab.size}px`,
                background:
                  "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.92) 0%, rgba(254,205,211,0.4) 45%, rgba(244,114,182,0.22) 100%)",
                boxShadow: "inset 0 0 8px rgba(255,255,255,0.8), 0 0 10px rgba(255,255,255,0.35)",
                opacity: 0.45,
              }}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.7 }}
              animate={{
                y: [-10, -80, -150],
                x: [0, idx % 2 === 0 ? 12 : -12, 0],
                opacity: [0.35, 0.65, 0],
              }}
              transition={{ duration: ab.duration, repeat: Infinity, delay: ab.delay, ease: "easeInOut" }}
            >
              <div className="absolute top-1 left-1.5 w-1.5 h-1 bg-white/95 rounded-full -rotate-45" />
            </motion.div>
          );
        })}

        {/* Subtle Bottom Wave Silhouettes */}
        <div className="absolute bottom-0 inset-x-0 h-20 overflow-hidden pointer-events-none opacity-25">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 40 Q360 80 720 30 T1440 50 L1440 120 L0 120 Z" fill="#70072B" />
            <path d="M0 65 Q420 20 840 60 T1440 40 L1440 120 L0 120 Z" fill="#4A041C" />
          </svg>
        </div>
      </div>

      {/* ── 2. Vertical Center-Stacked Living Stage ── */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-4 overflow-hidden">
        {/* TIER 1 (Top-Center): Boldly Enlarged Hero Picture Box Container & Spotlight Halo */}
        <div className="relative flex items-center justify-center shrink-0">
          <div
            aria-hidden="true"
            className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(254,243,199,0.58)_0%,transparent_70%)] blur-xl pointer-events-none -z-10"
          />
          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            animate={
              isIllustrationBouncing
                ? { scale: [1, 1.14, 1], rotate: [-4, 4, 0] }
                : { y: [0, -3, 0] }
            }
            transition={
              isIllustrationBouncing
                ? { duration: 0.45, ease: "easeOut" }
                : { duration: 3.8, repeat: Infinity, ease: "easeInOut" }
            }
            onClick={handleSpeakTargetWord}
            aria-label={`Dengarkan kata ${currentWord}`}
            className="h-[35vh] min-h-[220px] max-h-[300px] aspect-square rounded-[2.25rem] bg-[#FFFDF9] border-[5px] border-amber-300 border-b-[8px] border-b-amber-500 shadow-[0_18px_38px_rgba(131,24,67,0.38)] p-3 flex items-center justify-center shrink-0 cursor-pointer relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            <WordIllustration
              word={currentWord}
              illustrationKey={currentWord.toLowerCase()}
              showBadge={false}
              className="w-full h-full object-contain drop-shadow-sm"
            />
          </motion.button>
        </div>

        {/* TIER 2 (Middle-Center): Compact, Sleek Question Word Pill */}
        <div className="mt-3 px-4 py-1.5 rounded-full bg-[#FFFDF9]/95 border-2 border-pink-200 border-b-4 border-b-pink-300 shadow-md flex items-center justify-center gap-3 shrink-0 z-20">
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleSpeakTargetWord}
            aria-label={`Dengarkan kata ${currentWord}`}
            className="w-8 h-8 rounded-full bg-gradient-to-b from-[#0284C7] to-[#0369A1] border border-white border-b-3 border-b-[#075985] text-white shadow-xs flex items-center justify-center cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <Volume2 size={15} aria-hidden="true" className="stroke-[2.5]" />
          </motion.button>

          <div className="flex items-center justify-center gap-1">
            {currentWord.split("").map((char, i) => {
              const isTyped = i < activeIndex;
              const isCurrent = i === activeIndex && !isWordComplete;
              return (
                <motion.span
                  key={`${currentWord}-word-${i}`}
                  whileHover={{ scale: 1.15 }}
                  onClick={() => {
                    playXylophoneNote(i % 5);
                    speakLetter(char);
                  }}
                  className={`font-display font-extrabold text-lg md:text-xl tracking-[0.16em] leading-none uppercase cursor-pointer select-none transition-colors ${
                    isTyped
                      ? "text-[#047857]"
                      : isCurrent
                      ? "text-[#B45309] underline decoration-amber-400 decoration-3 underline-offset-4"
                      : "text-[#0F172A]"
                  }`}
                >
                  {char}
                </motion.span>
              );
            })}
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.08, rotate: 12 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleResetCurrentWord}
            aria-label="Reset pengetikan kata ini"
            className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-300 to-amber-400 border border-white border-b-3 border-b-amber-600 text-[#0F172A] shadow-xs flex items-center justify-center cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <RotateCcw size={14} aria-hidden="true" className="stroke-[2.5]" />
          </motion.button>
        </div>

        {/* TIER 3 (Bottom-Center): Bright 3D Toy Key-Tray with Chunky True-Square Blocks */}
        <div className="mt-3.5 bg-white/25 backdrop-blur-md border-2 border-white/50 border-b-[6px] border-b-pink-900/30 rounded-[2rem] px-5 py-3.5 md:px-7 md:py-4 shadow-[0_16px_32px_rgba(80,7,36,0.32)] flex items-center justify-center gap-3 md:gap-4 relative shrink-0 z-20">
          {currentWord.split("").map((char, index) => {
            const isTyped = index < activeIndex;
            const isActive = index === activeIndex && !isWordComplete;
            const isWobble = wobbleIndex === index;
            const isTapped = tappedTileIndex === index;
            const hasBurst = sparkleBursts.some((b) => b.index === index);

            return (
              <motion.div
                key={`${currentWord}-block-${index}`}
                onClick={() => {
                  if (isTyped) handleCompletedBlockTap(index);
                  else if (isActive) handleActiveBlockTap();
                }}
                whileHover={
                  isTyped
                    ? { y: -3, scale: 1.05 }
                    : isActive
                    ? { scale: 1.04 }
                    : {}
                }
                animate={
                  isWobble
                    ? { x: [-6, 6, -4, 4, 0] }
                    : isTapped
                    ? { y: [0, 4, 0], scale: [1, 0.96, 1.04, 1] }
                    : isWordComplete
                    ? { y: [-8, 0, -4, 0], scale: [1, 1.05, 1] }
                    : isActive
                    ? { y: [0, -2, 0] }
                    : {}
                }
                transition={
                  isWobble
                    ? { duration: 0.4, ease: "easeInOut" }
                    : isTapped
                    ? { duration: 0.25, ease: "easeOut" }
                    : isWordComplete
                    ? { duration: 0.55, delay: index * 0.07, repeat: 1, ease: "easeOut" }
                    : isActive
                    ? { duration: 1.7, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.25 }
                }
                className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 lg:w-24 lg:h-24 aspect-square rounded-2xl font-display font-black text-3xl sm:text-4xl md:text-5xl leading-none flex items-center justify-center select-none transition-colors ${
                  isTyped
                    ? "bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#047857] border-2 border-emerald-200 border-b-[7px] border-b-[#065F46] text-white shadow-md cursor-pointer"
                    : isActive
                    ? "bg-gradient-to-b from-[#FFFBEB] to-[#FDE68A] border-3 border-amber-400 border-b-[7px] border-b-amber-600 text-[#0F172A] shadow-[0_0_26px_rgba(253,224,71,0.9)] cursor-pointer"
                    : "bg-[#FFFDF9] border-2 border-pink-200 border-b-[7px] border-b-pink-300 text-slate-400/50 shadow-sm cursor-default"
                }`}
              >
                <div className="absolute top-1.5 inset-x-3 h-1.5 rounded-full bg-white/55 pointer-events-none" />

                {isTyped ? (
                  <span className="drop-shadow-xs">{char}</span>
                ) : isActive ? (
                  <span className="text-slate-900/35 font-black">{char}</span>
                ) : (
                  <span className="text-slate-400/50 font-black">{char}</span>
                )}

                {isActive && (
                  <div className="absolute bottom-2 inset-x-3.5 h-1.5 bg-amber-600 rounded-full animate-pulse" />
                )}

                {isTyped && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white border border-emerald-600 flex items-center justify-center text-emerald-700 shadow-xs"
                  >
                    <Check size={11} strokeWidth={3.5} />
                  </motion.div>
                )}

                {hasBurst && (
                  <motion.span
                    initial={{ scale: 0.7, opacity: 0.9 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute inset-0 rounded-2xl border-3 border-amber-300 pointer-events-none"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── 3. Grounded Bottom Mascots on Lush Green Meadow Hills (Zero Speech Bubbles) ── */}
      {/* Saka Bottom-Left */}
      <div className="fixed bottom-1 left-3 sm:left-6 z-20 select-none flex flex-col items-center pointer-events-none">
        <div className="relative flex flex-col items-center">
          <div className="absolute -bottom-2 w-32 sm:w-36 md:w-44 h-8 sm:h-10 bg-gradient-to-b from-[#22C55E] via-[#16A34A] to-[#15803D] rounded-t-full border-t-2 border-emerald-300 shadow-md z-0" />
          <motion.img
            src="/assets/saka-maskot-1-cutout.png"
            alt="Saka Maskot"
            draggable="false"
            onClick={handleMascotTap}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            animate={
              isWordComplete || showCelebration
                ? { y: [-18, 0, -10, 0], scale: [1, 1.06, 1] }
                : isMascotCheering
                ? { y: [-14, 0, -8, 0], scale: [1, 1.06, 1] }
                : { y: [0, -3, 0] }
            }
            transition={
              isWordComplete || showCelebration
                ? { duration: 0.75, repeat: 2, ease: "easeOut" }
                : isMascotCheering
                ? { duration: 0.5, ease: "easeOut" }
                : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
            }
            className="h-32 sm:h-36 md:h-40 max-h-[175px] w-auto object-contain object-bottom drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] pointer-events-auto cursor-pointer relative z-10"
            style={{ imageRendering: "-webkit-optimize-contrast" }}
          />
          <div className="w-22 sm:w-26 h-3 bg-[#064E3B]/35 rounded-full blur-[2px] -mt-1 relative z-10 pointer-events-none" />
        </div>
      </div>

      {/* Tika Bottom-Right */}
      <div className="fixed bottom-1 right-3 sm:right-6 z-20 select-none flex flex-col items-center pointer-events-none">
        <div className="relative flex flex-col items-center">
          <div className="absolute -bottom-2 w-32 sm:w-36 md:w-44 h-8 sm:h-10 bg-gradient-to-b from-[#22C55E] via-[#16A34A] to-[#15803D] rounded-t-full border-t-2 border-emerald-300 shadow-md z-0" />
          <motion.img
            src="/assets/icon-tika-utama.png"
            alt="Tika Maskot"
            draggable="false"
            onClick={handleMascotTap}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            animate={
              isWordComplete || showCelebration
                ? { y: [-20, 0, -12, 0], scale: [1, 1.06, 1] }
                : isMascotCheering
                ? { y: [-16, 0, -9, 0], scale: [1, 1.06, 1] }
                : { y: [0, -3, 0] }
            }
            transition={
              isWordComplete || showCelebration
                ? { duration: 0.75, delay: 0.08, repeat: 2, ease: "easeOut" }
                : isMascotCheering
                ? { duration: 0.5, delay: 0.06, ease: "easeOut" }
                : { duration: 3.5, repeat: Infinity, delay: 0.4, ease: "easeInOut" }
            }
            className="h-32 sm:h-36 md:h-40 max-h-[175px] w-auto object-contain object-bottom drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] pointer-events-auto cursor-pointer relative z-10"
            style={{ imageRendering: "-webkit-optimize-contrast" }}
          />
          <div className="w-22 sm:w-26 h-3 bg-[#064E3B]/35 rounded-full blur-[2px] -mt-1 relative z-10 pointer-events-none" />
        </div>
      </div>

      {/* ── 4. Single "HORE! KAMU HEBAT!" Celebration Modal (Zero Stars, Zero Emojis) ── */}
      <AnimatePresence>
        {showCelebration && (
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
              className="relative z-10 flex flex-col items-center justify-center text-center p-6 sm:p-8 max-w-lg w-full bg-gradient-to-b from-[#FFFDF8] via-[#FFF7ED] to-[#FEF3C7] rounded-[2.5rem] border-4 border-amber-300 border-b-8 border-b-amber-500 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-8 ring-amber-400/50"
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

              <div className="w-28 h-28 sm:w-32 sm:h-32 mb-2 relative flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
                  <defs>
                    <linearGradient id="mengetikCrackerRed" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="50%" stopColor="#DC2626" />
                      <stop offset="100%" stopColor="#991B1B" />
                    </linearGradient>
                    <linearGradient id="mengetikCrackerGold" x1="0" y1="0" x2="1" y2="1">
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
                    <rect x="52" y="28" width="16" height="64" rx="4" fill="url(#mengetikCrackerRed)" stroke="#7F1D1D" strokeWidth="1.5" />
                    <rect x="52" y="34" width="16" height="8" fill="url(#mengetikCrackerGold)" />
                    <rect x="52" y="78" width="16" height="8" fill="url(#mengetikCrackerGold)" />
                    <path d="M 60 28 Q 60 18 68 14" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <circle cx="68" cy="14" r="3" fill="#FEF08A" />
                  </g>
                  <g transform="translate(60, 60) rotate(25) translate(-60, -60)">
                    <rect x="52" y="28" width="16" height="64" rx="4" fill="url(#mengetikCrackerRed)" stroke="#7F1D1D" strokeWidth="1.5" />
                    <rect x="52" y="34" width="16" height="8" fill="url(#mengetikCrackerGold)" />
                    <rect x="52" y="78" width="16" height="8" fill="url(#mengetikCrackerGold)" />
                    <path d="M 60 28 Q 60 18 52 14" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <circle cx="52" cy="14" r="3" fill="#FEF08A" />
                  </g>
                  <circle cx="60" cy="60" r="10" fill="#FEF08A" />
                  <circle cx="60" cy="60" r="5" fill="#FFFFFF" />
                </svg>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl text-[#9D174D] tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(251,191,36,0.5)]">
                HORE! KAMU HEBAT!
              </h2>

              <p className="font-sans font-black text-sm sm:text-base text-amber-950 mt-2 leading-relaxed">
                Kamu Berhasil Mengetik Kata{" "}
                <span className="font-display font-black text-xl sm:text-2xl text-[#047857] px-1">
                  {currentWord}
                </span>{" "}
                dengan Benar!
              </p>

              <motion.button
                type="button"
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.94, y: 2 }}
                onClick={handleNextWord}
                className="mt-5 px-6 py-3 rounded-2xl bg-gradient-to-b from-[#B45309] to-[#9A3412] border-2 border-white border-b-6 border-b-[#7C2D12] text-white font-display font-black text-lg sm:text-xl shadow-lg flex items-center gap-2 cursor-pointer active:border-b-2 active:translate-y-1"
              >
                <Play size={20} aria-hidden="true" className="fill-white" />
                <span>LANJUT KATA BARU!</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
