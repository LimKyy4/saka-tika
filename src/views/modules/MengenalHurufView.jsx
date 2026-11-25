// src/views/modules/MengenalHurufView.jsx
// SAKA TIKA: "Mengenal Huruf A-Z" - Unified 3x3 Board with Auto-Paginating "Play Lagu" Sync
// (A-I -> J-R -> S-Z), Intro RGB + Sway, Outro RGB + Bubble Pop, and Default-ON Auto-Loop.
// STRICT ZERO SCROLLBAR APP LOCK: h-screen w-screen overflow-hidden select-none.
// STRICT ZERO EMOJIS & ZERO STAR ICONS POLICY: Only lucide-react icons (no Star) and custom vectors.

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  Trophy,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Lock,
  Music,
  Square,
  RotateCcw,
  Repeat,
} from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { ALPHABET_DATA } from "../../data/masterDataset.js";
import {
  CALIBRATED_ABC_SONG_DURATION,
  ABC_SONG_BEAT_SEC,
  resolveSongLetterIndex,
} from "../../data/abcSongTimeline.js";
import { speakLetter, speakWord, speakInstruction } from "../../utils/speechEngine.js";
import BlueStorybookBackground from "../../components/background/BlueStorybookBackground.jsx";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";

// 3 Page Category Groups (3x3 Grid per page)
const PAGE_GROUPS = [
  ALPHABET_DATA.slice(0, 9),   // Page 1: A - I (9 letters)
  ALPHABET_DATA.slice(9, 18),  // Page 2: J - R (9 letters)
  ALPHABET_DATA.slice(18, 26), // Page 3: S - Z (8 letters + 1 Celebration Card)
];

const TABS = [
  { label: "Huruf A \u2013 I", page: 0 },
  { label: "Huruf J \u2013 R", page: 1 },
  { label: "Huruf S \u2013 Z", page: 2 },
];

export default function MengenalHurufView() {
  const { addStars, discoverLetter, isLetterDiscovered } = useGame();
  const { playSfx, isBgmEnabled, setIsBgmDucked } = useAudio();

  // Sequential unlocking state (persisted in localStorage)
  const [maxUnlockedIndex, setMaxUnlockedIndex] = useState(() => {
    try {
      const saved = localStorage.getItem("saka_tika_mengenal_unlocked_idx");
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 25) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return 0;
  });

  const [activePage, setActivePage] = useState(() => {
    if (maxUnlockedIndex < 9) return 0;
    if (maxUnlockedIndex < 18) return 1;
    return 2;
  });

  const [selectedLetter, setSelectedLetter] = useState(null);
  const [wobbleKey, setWobbleKey] = useState(null);
  const [isMascotJumping, setIsMascotJumping] = useState(false);

  // "Play Lagu" unified 3x3 board state
  const [isSongMode, setIsSongMode] = useState(false);
  const [activeSongLetterIndex, setActiveSongLetterIndex] = useState(-1);
  const [isLoopEnabled, setIsLoopEnabled] = useState(true);
  const [outroBubbleIndices, setOutroBubbleIndices] = useState([]);
  const isLoopEnabledRef = useRef(isLoopEnabled);
  const audioRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    isLoopEnabledRef.current = isLoopEnabled;
  }, [isLoopEnabled]);

  const songPhase =
    activeSongLetterIndex < 0
      ? "intro"
      : activeSongLetterIndex >= 26
      ? "outro"
      : "singing";

  // During Outro phase on Page 3 (S-Z), pop 3-4 random visible cards simultaneously
  useEffect(() => {
    if (!isSongMode || songPhase !== "outro") {
      setOutroBubbleIndices([]);
      return;
    }

    const pickRandomBubbles = () => {
      const bubbleCount = 3 + Math.floor(Math.random() * 2); // 3 to 4 simultaneous bubbles
      const picked = new Set();
      while (picked.size < bubbleCount) {
        // Indices 18..26 map to the 9 visible cards on Page 3 (S-Z + Reward slot 26)
        picked.add(18 + Math.floor(Math.random() * 9));
      }
      setOutroBubbleIndices(Array.from(picked));
    };

    pickRandomBubbles();
    const intervalId = setInterval(pickRandomBubbles, 400);
    return () => clearInterval(intervalId);
  }, [isSongMode, songPhase]);

  // Grand celebration modal state ("song" | "alphabet" | null)
  const [celebrationState, setCelebrationState] = useState(null);
  const pendingAlphabetCelebrationRef = useRef(false);

  const launchGrandCelebration = useCallback(
    (type) => {
      playSfx("fanfare");
      playSfx("success");
      setIsMascotJumping(true);
      setTimeout(() => setIsMascotJumping(false), 900);

      confetti({
        particleCount: 90,
        angle: 60,
        spread: 70,
        origin: { x: 0.15, y: 0.6 },
        colors: ["#F59E0B", "#EF4444", "#10B981", "#38BDF8", "#EC4899"],
      });
      confetti({
        particleCount: 90,
        angle: 120,
        spread: 70,
        origin: { x: 0.85, y: 0.6 },
        colors: ["#F59E0B", "#EF4444", "#10B981", "#38BDF8", "#EC4899"],
      });
      confetti({
        particleCount: 110,
        spread: 95,
        origin: { y: 0.45 },
        colors: ["#FDE047", "#F59E0B", "#38BDF8", "#34D399", "#F43F5E"],
      });

      setCelebrationState({ type });
    },
    [playSfx]
  );

  // Stop & reset /audio/lagu-abc.mp3 and restore BGM cleanly
  const stopAbcSong = useCallback(
    (exitSongMode = true) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current = null;
      }
      setIsBgmDucked(false);
      setActiveSongLetterIndex(-1);
      setOutroBubbleIndices([]);
      if (exitSongMode) {
        setIsSongMode(false);
      }
    },
    [setIsBgmDucked]
  );

  // Keep song mute state aligned with global audio toggle without halting visual sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isBgmEnabled;
    }
  }, [isBgmEnabled]);

  // Cleanup song audio and BGM ducking on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsBgmDucked(false);
    };
  }, [setIsBgmDucked]);

  // Start /audio/lagu-abc.mp3 on unified 3x3 board with 60 FPS auto-paginating sync
  const startAbcSong = useCallback(() => {
    stopAbcSong(false);
    setSelectedLetter(null);
    setCelebrationState(null);
    setActivePage(0);
    setIsSongMode(true);
    setActiveSongLetterIndex(-1);
    setIsBgmDucked(true);

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const audio = new Audio("/audio/lagu-abc.mp3");
    audio.preload = "auto";
    audio.volume = 0.92;
    audio.muted = !isBgmEnabled;
    audioRef.current = audio;

    const tick = () => {
      const el = audioRef.current;
      if (!el) return;

      const dur =
        Number.isFinite(el.duration) && el.duration > 0
          ? el.duration
          : CALIBRATED_ABC_SONG_DURATION;

      const nextIdx = resolveSongLetterIndex(el.currentTime, dur);
      const targetPage = nextIdx < 9 ? 0 : nextIdx < 18 ? 1 : 2;

      setActiveSongLetterIndex((prev) => (prev === nextIdx ? prev : nextIdx));
      setActivePage((prev) => (prev === targetPage ? prev : targetPage));

      if (!el.paused && !el.ended) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    audio.onended = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (isLoopEnabledRef.current) {
        // Seamless continuous loop back to Page 1 (Huruf A - I) from intro
        audio.currentTime = 0;
        setActivePage(0);
        setActiveSongLetterIndex(-1);
        setOutroBubbleIndices([]);
        audio
          .play()
          .then(() => {
            rafRef.current = requestAnimationFrame(tick);
          })
          .catch(() => stopAbcSong(true));
        return;
      }

      stopAbcSong(true);
      launchGrandCelebration("song");
    };

    audio.onerror = () => {
      stopAbcSong(true);
    };

    audio
      .play()
      .then(() => {
        rafRef.current = requestAnimationFrame(tick);
      })
      .catch(() => {
        // If autoplay blocked unexpectedly, fall back muted so visual sync still runs
        audio.muted = true;
        audio
          .play()
          .then(() => {
            rafRef.current = requestAnimationFrame(tick);
          })
          .catch(() => {
            stopAbcSong(true);
          });
      });
  }, [stopAbcSong, setIsBgmDucked, isBgmEnabled, launchGrandCelebration]);

  const handleToggleSongMode = useCallback(() => {
    playSfx("click");
    if (isSongMode) {
      stopAbcSong(true);
    } else {
      startAbcSong();
    }
  }, [isSongMode, playSfx, stopAbcSong, startAbcSong]);

  // Handle Letter Card Click (Sequential Unlock Logic)
  const handleCardClick = useCallback(
    (letterObj, globalIndex) => {
      if (isSongMode) {
        stopAbcSong(true);
      }
      if (globalIndex > maxUnlockedIndex) {
        playSfx("error");
        setWobbleKey(letterObj.letter);
        setTimeout(() => setWobbleKey(null), 500);

        const targetLetter = ALPHABET_DATA[maxUnlockedIndex].letter;
        speakInstruction(`Buka huruf ${targetLetter} dulu ya!`);
        return;
      }

      playSfx("click");
      setSelectedLetter(letterObj);
      setIsMascotJumping(true);
      setTimeout(() => setIsMascotJumping(false), 700);

      speakLetter(letterObj);

      if (globalIndex === maxUnlockedIndex && maxUnlockedIndex < 25) {
        const nextIdx = maxUnlockedIndex + 1;
        setMaxUnlockedIndex(nextIdx);
        try {
          localStorage.setItem("saka_tika_mengenal_unlocked_idx", String(nextIdx));
        } catch {
          // ignore
        }

        playSfx("success");
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.55 },
          colors: ["#F59E0B", "#10B981", "#3B82F6", "#EC4899", "#8B5CF6"],
        });

        const nextLetter = ALPHABET_DATA[nextIdx].letter;
        speakInstruction(`Hebat! Huruf ${nextLetter} sekarang terbuka!`);
      }

      // Mark completion milestone when 26th letter (Zz) is opened
      if (globalIndex === 25) {
        pendingAlphabetCelebrationRef.current = true;
      }

      if (!isLetterDiscovered(letterObj.letter)) {
        discoverLetter(letterObj.letter);
        addStars(1);
      }
    },
    [isSongMode, stopAbcSong, maxUnlockedIndex, playSfx, isLetterDiscovered, discoverLetter, addStars]
  );

  // Handle Celebration Card Click (Slot 9 on Page 3)
  const handleCelebrationClick = useCallback(() => {
    if (isSongMode) {
      stopAbcSong(true);
    }
    if (maxUnlockedIndex >= 25) {
      launchGrandCelebration("alphabet");
      speakInstruction("Hore! Kamu hebat sekali sudah mengenal semua huruf!");
      return;
    }
    playSfx("fanfare");
    setIsMascotJumping(true);
    setTimeout(() => setIsMascotJumping(false), 800);
    confetti({
      particleCount: 90,
      spread: 85,
      origin: { y: 0.55 },
      colors: ["#F59E0B", "#E11D48", "#10B981", "#3B82F6", "#8B5CF6"],
    });
    speakInstruction("Ayo terus belajar sampai huruf Z!");
  }, [isSongMode, stopAbcSong, maxUnlockedIndex, launchGrandCelebration, playSfx]);

  const prevPage = useCallback(() => {
    playSfx("hover");
    if (isSongMode) stopAbcSong(true);
    setActivePage((prev) => (prev === 0 ? 2 : prev - 1));
  }, [playSfx, isSongMode, stopAbcSong]);

  const nextPage = useCallback(() => {
    playSfx("hover");
    if (isSongMode) stopAbcSong(true);
    setActivePage((prev) => (prev === 2 ? 0 : prev + 1));
  }, [playSfx, isSongMode, stopAbcSong]);

  // Navigate letters inside the modal (with sequential unlocking forward)
  const handleNavigateModalLetter = useCallback(
    (direction) => {
      if (!selectedLetter) return;
      playSfx("click");
      const currentIndex = ALPHABET_DATA.findIndex((item) => item.letter === selectedLetter.letter);
      const newIndex = currentIndex + direction;

      if (newIndex < 0 || newIndex >= ALPHABET_DATA.length) return;

      if (newIndex > maxUnlockedIndex && newIndex <= 25) {
        setMaxUnlockedIndex(newIndex);
        try {
          localStorage.setItem("saka_tika_mengenal_unlocked_idx", String(newIndex));
        } catch {
          // ignore
        }
        playSfx("success");
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.55 },
          colors: ["#F59E0B", "#10B981", "#3B82F6", "#EC4899"],
        });
        const nextLetter = ALPHABET_DATA[newIndex].letter;
        speakInstruction(`Hebat! Huruf ${nextLetter} sekarang terbuka!`);
      }

      if (newIndex === 25) {
        pendingAlphabetCelebrationRef.current = true;
      }

      const nextLetterObj = ALPHABET_DATA[newIndex];
      setSelectedLetter(nextLetterObj);

      if (newIndex < 9) setActivePage(0);
      else if (newIndex < 18) setActivePage(1);
      else setActivePage(2);

      speakLetter(nextLetterObj);

      if (!isLetterDiscovered(nextLetterObj.letter)) {
        discoverLetter(nextLetterObj.letter);
        addStars(1);
      }
    },
    [selectedLetter, maxUnlockedIndex, playSfx, isLetterDiscovered, discoverLetter, addStars]
  );

  const handleCloseDetailModal = useCallback(() => {
    playSfx("click");
    setSelectedLetter(null);
    if (pendingAlphabetCelebrationRef.current) {
      pendingAlphabetCelebrationRef.current = false;
      launchGrandCelebration("alphabet");
      speakInstruction("Hore! Semua 26 huruf A sampai Z berhasil kamu pelajari!");
    }
  }, [playSfx, launchGrandCelebration]);

  const activeGroup = PAGE_GROUPS[activePage];

  return (
    <main className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none p-2 sm:p-3">
      {/* Base Layer: Dedicated Royal & Sky Blue Storybook Background */}
      <BlueStorybookBackground />

      {/* Subtle Depth Tint Layer */}
      <div className="fixed inset-0 bg-[#0A3464]/10 backdrop-blur-[0.5px] pointer-events-none z-0" />

      {/* Open Widescreen 2-Column Adventure Stage */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden grid grid-cols-[250px_1fr] md:grid-cols-[270px_1fr] lg:grid-cols-[300px_1fr] gap-5 md:gap-6 lg:gap-8 items-center max-w-7xl w-full mx-auto my-auto px-2 sm:px-4">
        {/* LEFT COLUMN: Grounded 3D Grass Mound & Mascots Stage */}
        <aside className="w-full flex flex-col items-center justify-end relative h-full max-h-[82vh] overflow-visible select-none">
          {/* Musical encouragement speech bubble during Lagu ABC mode */}
          <AnimatePresence>
            {isSongMode && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
                className="mb-2 z-20 bg-[#FFFDF9] border-2 border-amber-300 shadow-lg rounded-2xl px-3.5 py-2 text-center relative max-w-[250px]"
              >
                <p className="font-display font-extrabold text-xs sm:text-sm text-[#1B4965] leading-snug">
                  {songPhase === "intro"
                    ? "Ikuti irama! Sebentar lagi A dimulai!"
                    : songPhase === "outro"
                    ? isLoopEnabled
                      ? "Ayo nyanyi lagi dari A sampai Z!"
                      : "Hore! Lagu A sampai Z selesai!"
                    : "Ayo bernyanyi A sampai Z bersama!"}
                </p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[8px] border-t-amber-300" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pedestal Stage with Firmly Grounded Saka & Tika */}
          <div className="relative flex flex-col items-center justify-end overflow-visible w-full mt-auto">
            <motion.div
              key={
                isSongMode
                  ? songPhase === "singing"
                    ? `dance-${activeSongLetterIndex}`
                    : `groove-${songPhase}`
                  : "idle"
              }
              animate={
                isSongMode
                  ? songPhase === "singing"
                    ? {
                        y: [0, -10, 0],
                        rotate: activeSongLetterIndex % 2 === 0 ? [-2, 2, -1] : [2, -2, 1],
                      }
                    : {
                        y: [0, -8, 0],
                        rotate: [-2.5, 2.5, -2.5],
                      }
                  : isMascotJumping
                  ? { y: [-24, 0], scale: [1.08, 1] }
                  : { y: [0, -5, 0] }
              }
              transition={
                isSongMode
                  ? songPhase === "singing"
                    ? { duration: 0.42, ease: "easeOut" }
                    : {
                        duration: ABC_SONG_BEAT_SEC * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                  : isMascotJumping
                  ? { duration: 0.5, type: "spring", stiffness: 420, damping: 15 }
                  : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
              }
              className="relative flex items-end justify-center gap-1 z-10 origin-bottom -mb-5 sm:-mb-6"
            >
              {/* Saka Cutout & Direct Ground Contact Shadow */}
              <div className="relative flex flex-col items-center">
                <motion.img
                  src="/assets/saka-maskot-1-cutout.png"
                  alt="Saka Maskot"
                  draggable="false"
                  whileHover={{ scale: 1.05 }}
                  className="h-[28vh] sm:h-[32vh] md:h-[36vh] max-h-[290px] w-auto object-contain object-bottom drop-shadow-md cursor-pointer select-none relative z-10"
                  onClick={() => {
                    playSfx("click");
                    setIsMascotJumping(true);
                    setTimeout(() => setIsMascotJumping(false), 700);
                    speakInstruction("Halo! Aku Saka! Ayo buka huruf berikutnya!");
                  }}
                />
                <div className="w-24 sm:w-28 h-2.5 bg-emerald-950/25 blur-[2px] rounded-full -mt-2 z-0 pointer-events-none" />
              </div>

              {/* Tika Cutout & Direct Ground Contact Shadow */}
              <div className="relative flex flex-col items-center -ml-3">
                <motion.img
                  src="/assets/icon-tika-utama.png"
                  alt="Tika Maskot"
                  draggable="false"
                  whileHover={{ scale: 1.05 }}
                  className="h-[26vh] sm:h-[30vh] md:h-[34vh] max-h-[275px] w-auto object-contain object-bottom drop-shadow-md cursor-pointer select-none relative z-10"
                  onClick={() => {
                    playSfx("click");
                    setIsMascotJumping(true);
                    setTimeout(() => setIsMascotJumping(false), 700);
                    speakInstruction("Hai! Aku Tika! Belajar huruf sangat menyenangkan!");
                  }}
                />
                <div className="w-20 sm:w-24 h-2.5 bg-emerald-950/25 blur-[2px] rounded-full -mt-2 z-0 pointer-events-none" />
              </div>
            </motion.div>

            {/* Wide Grounded 3D Lush Grass Hill Mound with 3D Lip & Props */}
            <div className="relative w-full max-w-[250px] sm:max-w-[280px] rounded-t-[2.5rem] rounded-b-[1.75rem] bg-gradient-to-b from-[#4ADE80] via-[#22C55E] to-[#16A34A] border-t-3 border-x-3 border-[#86EFAC] border-b-8 border-[#15803D] shadow-[0_12px_24px_rgba(21,128,61,0.4)] px-3 pt-3 pb-3 z-0 flex flex-col items-center">
              <div className="flex items-center justify-center gap-2.5 w-full drop-shadow-md">
                <div className="flex items-center gap-1.5">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -6 }}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-b from-[#EF4444] to-[#DC2626] border-b-4 border-[#991B1B] border-t border-l border-r border-red-300 text-white font-display font-black text-xs sm:text-sm md:text-base flex items-center justify-center shadow-md rotate-[-4deg] cursor-pointer select-none"
                  >
                    <span>A</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-b from-[#3B82F6] to-[#2563EB] border-b-4 border-[#1D4ED8] border-t border-l border-r border-blue-300 text-white font-display font-black text-xs sm:text-sm md:text-base flex items-center justify-center shadow-md rotate-[4deg] cursor-pointer select-none"
                  >
                    <span>B</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -3 }}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-b from-[#F59E0B] to-[#D97706] border-b-4 border-[#B45309] border-t border-l border-r border-amber-300 text-white font-display font-black text-xs sm:text-sm md:text-base flex items-center justify-center shadow-md rotate-[-2deg] cursor-pointer select-none"
                  >
                    <span>C</span>
                  </motion.div>
                </div>

                {/* Open Storybook Prop */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="w-13 h-9 sm:w-15 sm:h-10 md:w-16 md:h-11 cursor-pointer select-none flex-shrink-0"
                >
                  <svg viewBox="0 0 80 52" className="w-full h-full drop-shadow-md">
                    <path
                      d="M40 12 C28 6 12 6 4 10 L4 42 C12 38 28 38 40 44 C52 38 68 38 76 42 L76 10 C68 6 52 6 40 12 Z"
                      fill="#1E40AF"
                      stroke="#172554"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M40 14 C29 8 14 8 7 12 L7 40 C14 36 29 36 40 42 C51 36 66 36 73 40 L73 12 C66 8 51 8 40 14 Z"
                      fill="#FFFDF7"
                      stroke="#CBD5E1"
                      strokeWidth="1.5"
                    />
                    <line x1="40" y1="14" x2="40" y2="42" stroke="#94A3B8" strokeWidth="2" />
                    <path d="M14 20 Q24 18 34 20 M14 26 Q24 24 34 26 M14 32 Q24 30 34 32" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M46 20 Q56 18 66 20 M46 26 Q56 24 66 26 M46 32 Q56 30 66 32" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M40 42 L40 50 L36 47 L32 50 L34 42" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Unified Header Row & Balanced 3D Board */}
        <section className="w-full h-full max-h-[82vh] min-h-0 flex flex-col justify-between overflow-hidden">
          {/* Unified Board Header Row: Flush Folder Tabs (Left) & Loop + Play/Stop Lagu (Right) */}
          <div className="flex items-end justify-between px-3 sm:px-5 z-10 -mb-[4px] flex-shrink-0 w-full gap-2">
            {/* Left: 3 Connected Storybook Folder Tabs */}
            <div className="flex items-end gap-1 sm:gap-1.5">
              {TABS.map((tab) => {
                const isActive = activePage === tab.page;
                const tabStart = tab.page * 9;
                const tabEnd = tabStart + 9;
                const hasActiveTarget =
                  !isSongMode && maxUnlockedIndex >= tabStart && maxUnlockedIndex < tabEnd;

                return (
                  <motion.button
                    key={tab.page}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    onClick={() => {
                      playSfx("hover");
                      if (isSongMode) stopAbcSong(true);
                      setActivePage(tab.page);
                    }}
                    aria-label={`Buka halaman ${tab.label}`}
                    className={`relative px-3 sm:px-5 rounded-t-2xl font-display font-black text-xs sm:text-sm cursor-pointer transition-all border-t-4 border-x-4 border-b-0 select-none ${
                      isActive
                        ? "bg-sky-50 text-[#0284C7] border-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-20 pt-2 pb-2.5 -mb-[4px]"
                        : "bg-white/75 hover:bg-white text-slate-600 border-white/70 shadow-none z-0 hover:text-slate-800 pt-1.5 pb-2"
                    }`}
                  >
                    <span className="drop-shadow-2xs">{tab.label}</span>
                    {hasActiveTarget && !isActive && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white animate-pulse" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Right: Tactile "Play Lagu" / "Stop Lagu" + Default-ON "Loop: ON" Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 shrink-0">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.94, y: 1 }}
                transition={{ type: "spring", stiffness: 450, damping: 16 }}
                onClick={handleToggleSongMode}
                aria-label={isSongMode ? "Hentikan Lagu ABC" : "Putar Lagu ABC"}
                className={`px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full border-2 border-white border-b-4 font-display font-extrabold text-xs sm:text-sm text-white shadow-md flex items-center gap-1.5 cursor-pointer select-none transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
                  isSongMode
                    ? "bg-gradient-to-b from-rose-600 to-red-700 border-b-red-900"
                    : "bg-gradient-to-b from-[#B45309] to-[#9A3412] border-b-[#7C2D12]"
                }`}
              >
                {isSongMode ? (
                  <>
                    <Square size={13} aria-hidden="true" className="fill-current" />
                    <span>Stop Lagu</span>
                  </>
                ) : (
                  <>
                    <Music size={15} aria-hidden="true" className="stroke-[2.5]" />
                    <span>Play Lagu</span>
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.94, y: 1 }}
                transition={{ type: "spring", stiffness: 450, damping: 16 }}
                onClick={() => {
                  playSfx("click");
                  setIsLoopEnabled((prev) => !prev);
                }}
                aria-pressed={isLoopEnabled}
                aria-label={isLoopEnabled ? "Matikan ulang otomatis Lagu ABC" : "Nyalakan ulang otomatis Lagu ABC"}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-b-4 font-display text-xs sm:text-sm shadow-md flex items-center gap-1.5 cursor-pointer select-none transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
                  isLoopEnabled
                    ? "bg-gradient-to-b from-[#0369A1] to-[#1D4ED8] border-white border-b-[#1E3A8A] text-white font-extrabold"
                    : "bg-white border-slate-200 border-b-slate-300 text-slate-700 font-bold"
                }`}
              >
                <Repeat size={13} aria-hidden="true" className="stroke-[2.6]" />
                <span>{isLoopEnabled ? "Loop: ON" : "Loop: OFF"}</span>
              </motion.button>
            </div>
          </div>

          {/* Sturdy 3D Toy Game Board Frame (Unified Permanent 3x3 Stage) */}
          <div className="bg-sky-50/90 backdrop-blur-md border-4 border-white shadow-[0_12px_0_rgba(12,62,135,0.35),0_20px_35px_rgba(0,0,0,0.2)] rounded-[2rem] px-4 py-4 md:px-6 md:py-5 flex-1 min-h-0 flex flex-col justify-between overflow-hidden relative z-0">
            <style>{`
              @keyframes abcPastelRgbAura {
                0% {
                  border-color: #FDA4AF;
                  box-shadow: 0 0 14px rgba(253, 164, 175, 0.55), 0 4px 0 #F43F5E44;
                }
                25% {
                  border-color: #FCD34D;
                  box-shadow: 0 0 14px rgba(252, 211, 77, 0.55), 0 4px 0 #F59E0B44;
                }
                50% {
                  border-color: #6EE7B7;
                  box-shadow: 0 0 14px rgba(110, 231, 183, 0.55), 0 4px 0 #10B98144;
                }
                75% {
                  border-color: #7DD3FC;
                  box-shadow: 0 0 14px rgba(125, 211, 252, 0.55), 0 4px 0 #0EA5E944;
                }
                100% {
                  border-color: #C4B5FD;
                  box-shadow: 0 0 14px rgba(196, 181, 253, 0.55), 0 4px 0 #8B5CF644;
                }
              }
              .abc-pastel-rgb-aura {
                border-width: 2.5px;
                animation: abcPastelRgbAura 3.4s linear infinite alternate;
              }
            `}</style>

            <div className="flex-1 min-h-0 flex items-center justify-between gap-3 md:gap-4 w-full">
              <motion.button
                type="button"
                whileHover={{ scale: 1.15, rotate: -3 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 450, damping: 16 }}
                onClick={prevPage}
                aria-label="Halaman Huruf Sebelumnya"
                className="p-0 bg-transparent border-0 outline-none cursor-pointer flex-shrink-0 z-20 focus-visible:ring-4 focus-visible:ring-amber-300 rounded-full"
              >
                <img
                  src="/assets/buttons/kiri.png"
                  alt="Sebelumnya"
                  draggable="false"
                  className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 object-contain drop-shadow select-none pointer-events-none"
                  style={{ imageRendering: "-webkit-optimize-contrast" }}
                />
              </motion.button>

              <div className="flex-1 min-h-0 h-full overflow-visible p-1">
                {isSongMode ? (
                  /* Instant zero-lag page swap during Play Lagu mode so J & S ignite on beat */
                  <div
                    key={`song-page-${activePage}`}
                    className="grid grid-cols-3 grid-rows-3 gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 h-full items-stretch"
                  >
                    {activeGroup.map((letterObj, slotIdx) => {
                      const globalIndex = activePage * 9 + slotIdx;
                      return (
                        <ToyLetterCard
                          key={letterObj.letter}
                          item={letterObj}
                          globalIndex={globalIndex}
                          maxUnlockedIndex={maxUnlockedIndex}
                          isWobbling={false}
                          isSongMode={true}
                          songPhase={songPhase}
                          activeSongLetterIndex={activeSongLetterIndex}
                          isOutroBubble={
                            songPhase === "outro" && outroBubbleIndices.includes(globalIndex)
                          }
                          onClick={() => handleCardClick(letterObj, globalIndex)}
                          onHover={() => playSfx("hover")}
                        />
                      );
                    })}

                    {activePage === 2 && (
                      <CelebrationRewardCard
                        maxUnlockedIndex={maxUnlockedIndex}
                        isSongMode={true}
                        songPhase={songPhase}
                        isOutroBubble={
                          songPhase === "outro" && outroBubbleIndices.includes(26)
                        }
                        onClick={handleCelebrationClick}
                        onHover={() => playSfx("hover")}
                      />
                    )}
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePage}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="grid grid-cols-3 grid-rows-3 gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 h-full items-stretch"
                    >
                      {activeGroup.map((letterObj, slotIdx) => {
                        const globalIndex = activePage * 9 + slotIdx;
                        const isWobbling = wobbleKey === letterObj.letter;

                        return (
                          <ToyLetterCard
                            key={letterObj.letter}
                            item={letterObj}
                            globalIndex={globalIndex}
                            maxUnlockedIndex={maxUnlockedIndex}
                            isWobbling={isWobbling}
                            isSongMode={false}
                            songPhase="idle"
                            activeSongLetterIndex={-1}
                            isOutroBubble={false}
                            onClick={() => handleCardClick(letterObj, globalIndex)}
                            onHover={() => playSfx("hover")}
                          />
                        );
                      })}

                      {activePage === 2 && (
                        <CelebrationRewardCard
                          maxUnlockedIndex={maxUnlockedIndex}
                          isSongMode={false}
                          songPhase="idle"
                          isOutroBubble={false}
                          onClick={handleCelebrationClick}
                          onHover={() => playSfx("hover")}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.15, rotate: 3 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 450, damping: 16 }}
                onClick={nextPage}
                aria-label="Halaman Huruf Selanjutnya"
                className="p-0 bg-transparent border-0 outline-none cursor-pointer flex-shrink-0 z-20 focus-visible:ring-4 focus-visible:ring-amber-300 rounded-full"
              >
                <img
                  src="/assets/buttons/kanan.png"
                  alt="Selanjutnya"
                  draggable="false"
                  className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 object-contain drop-shadow select-none pointer-events-none"
                  style={{ imageRendering: "-webkit-optimize-contrast" }}
                />
              </motion.button>
            </div>

            {/* Candy Indicator Dots below 3x3 grid */}
            <div className="flex items-center justify-center gap-2 flex-shrink-0 z-20 mt-3">
              {[0, 1, 2].map((idx) => {
                const isActive = activePage === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      playSfx("click");
                      if (isSongMode) stopAbcSong(true);
                      setActivePage(idx);
                    }}
                    aria-label={`Pilih Halaman ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      isActive
                        ? "w-7 sm:w-8 h-2.5 bg-[#F59E0B] border-2 border-white shadow-xs"
                        : "w-2.5 h-2.5 bg-white/70 hover:bg-white border border-[#1B4965]/20 shadow-2xs"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Interactive Floating Letter Detail Card Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <LetterDetailModal
            letterObj={selectedLetter}
            onClose={handleCloseDetailModal}
            onNavigate={handleNavigateModalLetter}
            playSfx={playSfx}
          />
        )}
      </AnimatePresence>

      {/* Grand Celebration Finale Modal ("Temukan Huruf" Style, Zero Stars/Emojis) */}
      <AnimatePresence>
        {celebrationState && (
          <GrandCelebrationModal
            type={celebrationState.type}
            onReplaySong={() => {
              playSfx("click");
              startAbcSong();
            }}
            onContinue={() => {
              playSfx("click");
              setCelebrationState(null);
              if (isSongMode) {
                stopAbcSong(true);
              }
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

// 3D Illustrated Toy Letter Card Component (3 Visual States + Play Lagu Choreography, Zero Star Icons)
function ToyLetterCard({
  item,
  globalIndex,
  maxUnlockedIndex,
  isWobbling,
  isSongMode,
  songPhase,
  activeSongLetterIndex,
  isOutroBubble,
  onClick,
  onHover,
}) {
  const isTarget = !isSongMode && globalIndex === maxUnlockedIndex;
  const isLocked = !isSongMode && globalIndex > maxUnlockedIndex;
  const isSongIntro = isSongMode && songPhase === "intro";
  const isSongOutro = isSongMode && songPhase === "outro";
  const isSongActive =
    isSongMode && songPhase === "singing" && globalIndex === activeSongLetterIndex;
  const isSongSung =
    isSongMode && songPhase === "singing" && globalIndex < activeSongLetterIndex;

  if (isLocked) {
    return (
      <motion.button
        type="button"
        animate={isWobbling ? { x: [-5, 5, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={onHover}
        onClick={onClick}
        aria-label={`Huruf ${item.letter} masih terkunci.`}
        className="relative overflow-hidden group rounded-xl sm:rounded-2xl p-2 sm:p-2.5 lg:p-3 h-full w-full flex items-center justify-between cursor-pointer select-none transition-all bg-gradient-to-br from-[#3B69B0] via-[#2C5292] to-[#1E3D73] border-2 border-[#5D8AD4]/60 border-b-4 border-b-[#152C54] shadow-[inset_0_2px_0_rgba(255,255,255,0.22)] hover:border-[#5D8AD4]/90"
      >
        <div className="absolute top-1 inset-x-2 h-[1px] bg-white/25 rounded-full pointer-events-none" />
        <div className="absolute inset-1 rounded-lg sm:rounded-xl border border-dashed border-sky-200/25 pointer-events-none" />

        <div className="flex flex-col items-start justify-center z-10 min-w-0 pr-1">
          <div className="flex items-baseline">
            <span className="font-display font-black text-xl sm:text-2xl lg:text-3xl leading-none text-sky-100/90 drop-shadow-xs">
              {item.letter}
            </span>
            <span className="font-display font-bold text-base sm:text-lg lg:text-xl text-sky-200/75 ml-0.5 leading-none">
              {item.lowercase}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-950/40 border border-sky-300/20 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-300/70 shadow-2xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-sky-300/70 shadow-2xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-sky-300/70 shadow-2xs" />
          </div>
        </div>

        <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-b from-[#234378] to-[#19325C] border-2 border-amber-300/45 shadow-[inset_0_2px_4px_rgba(0,0,0,0.35)] group-hover:border-amber-300/75 group-hover:scale-105 transition-all z-10 relative">
          <motion.div
            animate={isWobbling ? { rotate: [-12, 12, -8, 8, 0] } : { rotate: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="flex items-center justify-center text-amber-300 drop-shadow-[0_2px_4px_rgba(245,158,11,0.4)]"
          >
            <Lock className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5" strokeWidth={2.5} />
          </motion.div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      whileHover={!isSongMode ? { scale: 1.04, y: -2 } : {}}
      whileTap={{ scale: 0.95, y: 1 }}
      animate={
        isSongIntro
          ? { rotate: [-3.5, 3.5, -3.5], y: [0, -3, 0], scale: 1 }
          : isSongActive
          ? { scale: 1.06, y: -5, rotate: 0 }
          : isSongOutro && isOutroBubble
          ? { scale: [1, 1.12, 1.02], y: -5, rotate: 0 }
          : { scale: 1, y: 0, rotate: 0 }
      }
      transition={
        isSongIntro
          ? {
              duration: ABC_SONG_BEAT_SEC * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : isSongOutro && isOutroBubble
          ? { type: "spring", stiffness: 360, damping: 14 }
          : isSongMode
          ? { type: "spring", stiffness: 540, damping: 24 }
          : { type: "spring", stiffness: 450, damping: 18 }
      }
      onMouseEnter={onHover}
      onClick={onClick}
      aria-label={`Huruf ${item.letter} untuk ${item.word}`}
      className={`relative group rounded-xl sm:rounded-2xl p-2 sm:p-2.5 lg:p-3 h-full w-full flex items-center justify-between cursor-pointer select-none transition-colors ${
        isSongActive
          ? "border-[3px] border-amber-400 border-b-4 border-b-amber-500 ring-4 ring-yellow-300/95 bg-gradient-to-b from-amber-50 via-yellow-100 to-amber-100 shadow-[0_0_28px_rgba(251,191,36,0.95)] z-20"
          : isSongOutro && isOutroBubble
          ? "abc-pastel-rgb-aura ring-4 ring-cyan-300/90 bg-gradient-to-b from-cyan-50 via-white to-amber-50 shadow-[0_0_22px_rgba(56,189,248,0.65)] z-20"
          : isSongIntro || isSongOutro
          ? "abc-pastel-rgb-aura bg-white/95"
          : isSongSung
          ? "bg-sky-50/90 border-2 border-sky-300 border-b-4 border-b-sky-400 shadow-xs"
          : isSongMode
          ? "bg-white/95 border-2 border-slate-200 border-b-4 border-b-slate-300 shadow-xs"
          : isTarget
          ? "ring-4 ring-amber-300 ring-offset-2 border-b-6 shadow-md scale-102 overflow-hidden"
          : "border-b-4 shadow-xs hover:shadow-md overflow-hidden"
      }`}
      style={
        !isSongMode
          ? {
              backgroundColor: `${item.color}15`,
              borderColor: item.color,
              borderTop: "1px solid rgba(255,255,255,0.8)",
              borderLeft: "1px solid rgba(255,255,255,0.8)",
              borderRight: "1px solid rgba(255,255,255,0.8)",
              boxShadow: isTarget ? "0 0 16px rgba(251, 191, 36, 0.45)" : undefined,
            }
          : undefined
      }
    >
      <div className="absolute top-1 inset-x-2 h-[1px] bg-white/80 rounded-full pointer-events-none" />

      {isSongActive && (
        <span
          aria-hidden="true"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-600 border-2 border-white text-white flex items-center justify-center shadow-md z-30"
        >
          <Music size={12} className="stroke-[2.8]" />
        </span>
      )}

      <div className="flex flex-col items-start justify-center z-10 min-w-0 pr-1">
        <div className="flex items-baseline">
          <span
            className="font-display font-black text-xl sm:text-2xl lg:text-3xl leading-none drop-shadow-xs"
            style={{ color: item.color }}
          >
            {item.letter}
          </span>
          <span
            className="font-display font-bold text-base sm:text-lg lg:text-xl opacity-85 ml-0.5 leading-none"
            style={{ color: item.color }}
          >
            {item.lowercase}
          </span>
        </div>
        <span className="font-sans font-bold text-[11px] sm:text-xs text-[#1B4965] mt-0.5 leading-tight truncate">
          {item.word}
        </span>
      </div>

      <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-13 lg:h-13 flex-shrink-0 flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform drop-shadow-xs z-10">
        <WordIllustration
          illustrationKey={item.illustrationKey}
          word={item.word}
          color={item.color}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Completed indicator badge using Check icon (zero Star icons) */}
      {!isSongMode && !isTarget && (
        <div className="absolute top-1.5 right-1.5 z-20">
          <div className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-500 flex items-center justify-center shadow-2xs">
            <Check size={10} className="text-emerald-700 stroke-[3]" />
          </div>
        </div>
      )}
    </motion.button>
  );
}

// Milestone Reward Card (Page 3, Slot 9, zero Star icons)
function CelebrationRewardCard({
  maxUnlockedIndex,
  isSongMode,
  songPhase,
  isOutroBubble,
  onClick,
  onHover,
}) {
  const isAllComplete = maxUnlockedIndex >= 25;
  const isSongOutro = isSongMode && songPhase === "outro";

  return (
    <motion.button
      type="button"
      whileHover={!isSongMode ? { scale: 1.03, y: -2 } : {}}
      whileTap={{ scale: 0.95, y: 1 }}
      animate={
        isSongOutro && isOutroBubble
          ? { scale: [1, 1.12, 1.02], y: -5 }
          : { scale: 1, y: 0 }
      }
      transition={
        isSongOutro && isOutroBubble
          ? { type: "spring", stiffness: 360, damping: 14 }
          : { type: "spring", stiffness: 450, damping: 18 }
      }
      onMouseEnter={onHover}
      onClick={onClick}
      aria-label="Pesta Perayaan Huruf A sampai Z"
      className={`relative group rounded-xl sm:rounded-2xl p-2 sm:p-2.5 lg:p-3 h-full w-full flex items-center justify-between shadow-xs hover:shadow-md cursor-pointer select-none ${
        isSongOutro && isOutroBubble
          ? "abc-pastel-rgb-aura ring-4 ring-cyan-300/90 bg-gradient-to-b from-cyan-50 via-[#FFFBEB] to-amber-50 shadow-[0_0_22px_rgba(56,189,248,0.65)] z-20"
          : isSongOutro
          ? "abc-pastel-rgb-aura bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7]"
          : "bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-b-4 border-[#F59E0B] border-t border-l border-r border-white/80 overflow-hidden"
      }`}
    >
      <div className="absolute top-1 inset-x-2 h-[1px] bg-white/70 rounded-full pointer-events-none" />

      <div className="flex flex-col items-start justify-center z-10 pr-1">
        <span className="font-display font-black text-sm sm:text-base lg:text-lg text-[#B45309] leading-tight">
          {isSongMode ? "Lagu ABC!" : isAllComplete ? "Hebat!" : "Ayo Temukan!"}
        </span>
        <span className="font-sans font-bold text-[10px] text-[#92400E] mt-0.5 leading-tight">
          {isSongMode
            ? "Ikut Bernyanyi!"
            : isAllComplete
            ? "26 Huruf Selesai"
            : `${maxUnlockedIndex + 1}/26 Terbuka`}
        </span>
      </div>

      <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-13 lg:h-13 flex-shrink-0 flex items-center justify-center group-hover:scale-115 transition-transform drop-shadow-xs z-10 text-[#F59E0B]">
        <Trophy size={26} className="fill-[#FEF3C7] stroke-[#D97706] stroke-2" />
      </div>
    </motion.button>
  );
}

// Floating Detail Card Modal (Clean Header: Zero Cluttered Small Descriptive Texts)
function LetterDetailModal({ letterObj, onClose, onNavigate, playSfx }) {
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(null);
  const [isSpeakingSequence, setIsSpeakingSequence] = useState(false);
  const sequenceTimersRef = useRef([]);

  const currentIndex = useMemo(
    () => ALPHABET_DATA.findIndex((item) => item.letter === letterObj.letter),
    [letterObj.letter]
  );

  const clearTimers = useCallback(() => {
    sequenceTimersRef.current.forEach((t) => clearTimeout(t));
    sequenceTimersRef.current = [];
    setIsSpeakingSequence(false);
    setActiveHighlightIndex(null);
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [letterObj, clearTimers]);

  const handleWordClick = useCallback(
    (example, index) => {
      clearTimers();
      playSfx("click");
      setActiveHighlightIndex(index);

      speakWord({ letter: letterObj.letter, word: example.word });

      const timer = setTimeout(() => {
        setActiveHighlightIndex(null);
      }, 1600);
      sequenceTimersRef.current.push(timer);
    },
    [letterObj.letter, playSfx, clearTimers]
  );

  const handlePlayAllSequence = useCallback(() => {
    clearTimers();
    playSfx("click");
    setIsSpeakingSequence(true);

    speakLetter(letterObj);

    const t1 = setTimeout(() => {
      if (!letterObj.examples[0]) return;
      setActiveHighlightIndex(0);
      speakWord({ letter: letterObj.letter, word: letterObj.examples[0].word });
    }, 1500);

    const t2 = setTimeout(() => {
      if (!letterObj.examples[1]) return;
      setActiveHighlightIndex(1);
      speakWord({ letter: letterObj.letter, word: letterObj.examples[1].word });
    }, 3300);

    const t3 = setTimeout(() => {
      if (!letterObj.examples[2]) return;
      setActiveHighlightIndex(2);
      speakWord({ letter: letterObj.letter, word: letterObj.examples[2].word });
    }, 5100);

    const t4 = setTimeout(() => {
      setActiveHighlightIndex(null);
      setIsSpeakingSequence(false);
    }, 6900);

    sequenceTimersRef.current = [t1, t2, t3, t4];
  }, [letterObj, playSfx, clearTimers]);

  const examples = letterObj.examples || [
    { word: letterObj.word, illustrationKey: letterObj.illustrationKey },
  ];

  const CARD_THEMES = [
    {
      cardBg: "from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA]/60",
      border: "border-orange-300",
      borderB: "border-b-orange-400",
    },
    {
      cardBg: "from-[#FEFCE8] via-[#FEF9C3] to-[#FEF08A]/60",
      border: "border-amber-300",
      borderB: "border-b-amber-400",
    },
    {
      cardBg: "from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0]/60",
      border: "border-emerald-300",
      borderB: "border-b-emerald-400",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/50 backdrop-blur-sm select-none">
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
        className="max-w-2xl sm:max-w-3xl w-full max-h-[85vh] rounded-[2rem] bg-gradient-to-b from-sky-50 via-white to-amber-50/60 border-4 border-white shadow-2xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden relative"
      >
        <div className="absolute top-1 inset-x-4 h-[1.5px] bg-white/80 rounded-full pointer-events-none" />

        {/* Clean Modal Header: Large 3D Letter Tile (Left) & Tika + Audio + Close (Right) */}
        <div
          className="flex items-center justify-between p-2.5 sm:p-3.5 rounded-2xl border-2 border-white/80 shadow-xs flex-shrink-0 relative overflow-visible"
          style={{
            background: `linear-gradient(135deg, ${letterObj.color}20 0%, ${letterObj.color}08 100%)`,
          }}
        >
          {/* Left: Prominent Glossy 3D Letter Tile (Aa) */}
          <div
            className="px-4 py-2 rounded-2xl flex items-baseline gap-1 shadow-sm border-2 border-white"
            style={{
              backgroundColor: `${letterObj.color}25`,
              boxShadow: `0 4px 0 ${letterObj.color}40`,
            }}
          >
            <span
              className="font-display font-black text-4xl sm:text-5xl leading-none drop-shadow-xs"
              style={{ color: letterObj.color }}
            >
              {letterObj.letter}
            </span>
            <span
              className="font-display font-bold text-2xl sm:text-3xl leading-none opacity-85 ml-0.5"
              style={{ color: letterObj.color }}
            >
              {letterObj.lowercase}
            </span>
          </div>

          {/* Right: Cheerful Tika Mascot, Speaker Button & Close Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.img
              src="/assets/icon-tika-utama.png"
              alt="Tika Mascot"
              draggable="false"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="h-12 sm:h-14 w-auto object-contain object-bottom drop-shadow hidden sm:inline-block pointer-events-none select-none"
            />

            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                clearTimers();
                playSfx("click");
                speakLetter(letterObj);
              }}
              aria-label={`Ulangi bunyi huruf ${letterObj.letter}`}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-b from-[#FEF3C7] to-[#FDE68A] border-b-4 border-[#D97706] text-[#92400E] font-display font-black text-xs sm:text-sm shadow-sm active:border-b-0 active:translate-y-1 cursor-pointer transition-transform"
            >
              <Volume2 size={16} aria-hidden="true" className="text-[#B45309]" />
              <span className="hidden sm:inline">Bunyi Huruf</span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              aria-label="Tutup jendela detail huruf"
              className="w-9 h-9 rounded-full bg-gradient-to-b from-rose-400 to-rose-600 hover:from-rose-500 hover:to-rose-700 border-b-2 border-rose-800 text-white flex items-center justify-center cursor-pointer transition-all shadow-sm"
            >
              <X size={18} aria-hidden="true" strokeWidth={2.8} />
            </motion.button>
          </div>
        </div>

        {/* 3-Column Maximized Example Word Cards with 2D Cartoon Bitmap Illustrations */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 my-auto py-3 sm:py-4 flex-1 min-h-0 items-stretch">
          {examples.map((ex, idx) => {
            const isHighlighted = activeHighlightIndex === idx;
            const initialLetter = ex.word.charAt(0);
            const remainingLetters = ex.word.slice(1);
            const theme = CARD_THEMES[idx % CARD_THEMES.length];

            return (
              <motion.button
                key={ex.word + idx}
                type="button"
                animate={
                  isHighlighted
                    ? { scale: [1, 1.06, 1.04], y: -5 }
                    : { scale: 1, y: 0 }
                }
                transition={{ type: "spring", stiffness: 450, damping: 18 }}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleWordClick(ex, idx)}
                aria-label={`Contoh kata ${ex.word}`}
                className={`group relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl border-3 cursor-pointer transition-all select-none bg-gradient-to-b ${theme.cardBg} ${theme.border} ${theme.borderB} border-b-6 shadow-sm hover:shadow-md ${
                  isHighlighted
                    ? "ring-4 ring-amber-400 ring-offset-2 shadow-[0_0_24px_rgba(251,191,36,0.6)]"
                    : ""
                }`}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center p-1.5 bg-white/85 rounded-2xl shadow-inner border border-white group-hover:scale-108 transition-transform">
                  <WordIllustration
                    illustrationKey={ex.illustrationKey}
                    word={ex.word}
                    color={letterObj.color}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="mt-2 text-center">
                  <span className="font-display font-black text-xl sm:text-2xl lg:text-3xl leading-none drop-shadow-2xs">
                    <span
                      className="inline-block transition-transform"
                      style={{ color: letterObj.color || "#EF4444" }}
                    >
                      {initialLetter}
                    </span>
                    <span className="text-[#1E293B]">{remainingLetters}</span>
                  </span>
                </div>

                <div
                  className={`mt-2 flex items-center gap-1 px-3 py-1 rounded-full text-[11px] sm:text-xs font-sans font-extrabold transition-colors shadow-2xs ${
                    isHighlighted
                      ? "bg-[#1E293B] text-white"
                      : "bg-white/90 group-hover:bg-white text-slate-700 border border-slate-200"
                  }`}
                >
                  <Volume2 size={12} aria-hidden="true" />
                  <span>Dengar</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Modal Footer: Prev / Dengarkan Semua / Next Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-shrink-0 gap-2">
          <motion.button
            type="button"
            disabled={currentIndex <= 0}
            whileHover={currentIndex > 0 ? { scale: 1.04, x: -2 } : {}}
            whileTap={currentIndex > 0 ? { scale: 0.96 } : {}}
            onClick={() => onNavigate(-1)}
            aria-label="Huruf Sebelumnya"
            className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-2xl font-display font-bold text-xs sm:text-sm shadow-2xs transition-all ${
              currentIndex > 0
                ? "bg-white hover:bg-slate-50 border-2 border-slate-200 text-[#1B4965] cursor-pointer"
                : "bg-slate-100 border-2 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            <ChevronLeft size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 1 }}
            onClick={handlePlayAllSequence}
            aria-label="Dengarkan nama huruf dan semua contoh kata secara berurutan"
            className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-2xl font-display font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all border-b-[3px] ${
              isSpeakingSequence
                ? "bg-gradient-to-b from-[#10B981] to-[#059669] text-white border-[#047857] animate-pulse"
                : "bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white border-[#0369A1]"
            }`}
          >
            <Play size={14} aria-hidden="true" className="fill-current" />
            <span>{isSpeakingSequence ? "Memutar Suara..." : "Dengarkan Semua"}</span>
          </motion.button>

          <motion.button
            type="button"
            disabled={currentIndex >= 25}
            whileHover={currentIndex < 25 ? { scale: 1.04, x: 2 } : {}}
            whileTap={currentIndex < 25 ? { scale: 0.96 } : {}}
            onClick={() => onNavigate(1)}
            aria-label="Huruf Selanjutnya"
            className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-2xl font-display font-bold text-xs sm:text-sm shadow-2xs transition-all ${
              currentIndex < 25
                ? "bg-white hover:bg-slate-50 border-2 border-slate-200 text-[#1B4965] cursor-pointer"
                : "bg-slate-100 border-2 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <ChevronRight size={16} aria-hidden="true" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// Temukan-Huruf Style Grand Celebration Overlay (Zero Star Icons, Zero Emojis)
function GrandCelebrationModal({ type, onReplaySong, onContinue }) {
  const isSongMilestone = type === "song";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto select-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs"
      />

      <motion.div
        initial={{ scale: 0.35, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: -20 }}
        transition={{ type: "spring", stiffness: 420, damping: 20 }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-7 max-w-md w-full bg-[#FFFDF9] rounded-[2rem] border-4 border-amber-300 border-b-8 border-b-amber-500 shadow-[0_20px_50px_rgba(15,23,42,0.35)] ring-8 ring-amber-400/40"
      >
        {/* Rotating Warm Golden Radial Sunburst Rays */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute w-72 h-72 -z-10 pointer-events-none opacity-45"
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

        {/* Festive Firecracker & Party Ribbon Burst Emblem (Zero Stars, Zero Emojis) */}
        <div className="w-28 h-28 mb-2 relative flex items-center justify-center">
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
            <defs>
              <linearGradient id="mengenalCrackerRed" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="50%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#991B1B" />
              </linearGradient>
              <linearGradient id="mengenalCrackerGold" x1="0" y1="0" x2="1" y2="1">
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
              <rect x="52" y="28" width="16" height="64" rx="4" fill="url(#mengenalCrackerRed)" stroke="#7F1D1D" strokeWidth="1.5" />
              <rect x="52" y="34" width="16" height="8" fill="url(#mengenalCrackerGold)" />
              <rect x="52" y="78" width="16" height="8" fill="url(#mengenalCrackerGold)" />
              <path d="M 60 28 Q 60 18 68 14" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="68" cy="14" r="3" fill="#FEF08A" />
            </g>

            <g transform="translate(60, 60) rotate(25) translate(-60, -60)">
              <rect x="52" y="28" width="16" height="64" rx="4" fill="url(#mengenalCrackerRed)" stroke="#7F1D1D" strokeWidth="1.5" />
              <rect x="52" y="34" width="16" height="8" fill="url(#mengenalCrackerGold)" />
              <rect x="52" y="78" width="16" height="8" fill="url(#mengenalCrackerGold)" />
              <path d="M 60 28 Q 60 18 52 14" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="52" cy="14" r="3" fill="#FEF08A" />
            </g>

            <circle cx="60" cy="60" r="10" fill="#FEF08A" />
            <circle cx="60" cy="60" r="5" fill="#FFFFFF" />
          </svg>
        </div>

        <h2 className="font-display font-black text-3xl md:text-4xl text-amber-600 tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(251,191,36,0.4)]">
          HORE! KAMU HEBAT!
        </h2>

        <p className="font-sans font-bold text-sm sm:text-base text-slate-700 mt-2 leading-relaxed">
          {isSongMilestone
            ? "Kamu Sudah Bernyanyi Huruf A Sampai Z!"
            : "Semua 26 Huruf A-Z Berhasil Kamu Pelajari!"}
        </p>

        <div className="mt-5 flex items-center justify-center gap-3 w-full flex-wrap">
          {isSongMilestone ? (
            <>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, y: 1 }}
                onClick={onReplaySong}
                className="flex-1 min-w-[140px] px-4 py-3 rounded-2xl bg-gradient-to-b from-[#B45309] to-[#9A3412] border-2 border-white border-b-4 border-b-[#7C2D12] text-white font-display font-black text-sm sm:text-base shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw size={17} aria-hidden="true" className="stroke-[2.6]" />
                <span>NYANYI LAGI</span>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, y: 1 }}
                onClick={onContinue}
                className="flex-1 min-w-[140px] px-4 py-3 rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 border-2 border-white border-b-4 border-b-blue-900 text-white font-display font-black text-sm sm:text-base shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play size={16} aria-hidden="true" className="fill-white" />
                <span>LANJUT BELAJAR</span>
              </motion.button>
            </>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.95, y: 1 }}
              onClick={onContinue}
              className="px-7 py-3 rounded-2xl bg-gradient-to-b from-[#B45309] to-[#9A3412] border-2 border-white border-b-6 border-b-[#7C2D12] text-white font-display font-black text-base sm:text-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play size={18} aria-hidden="true" className="fill-white" />
              <span>LANJUT BERMAIN</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
