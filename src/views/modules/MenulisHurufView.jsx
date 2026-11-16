// src/views/modules/MenulisHurufView.jsx
// SAKA TIKA: "Menulis Huruf" Paired Progression (A -> a -> B -> b) & Studio Polish
// 1. 52-Step Paired Uppercase-to-Lowercase Progression (A -> a -> B -> b ... -> Z -> z)
// 2. 9-Tile Paginated Top Ribbon with Paired Letter Badges (Aa, Bb, Cc... Zz)
// 3. 3D Storybook Artist Wooden Easel with Crayon/Marker Tray Ledge
// 4. Full-Color High-Contrast Right Object Reference Card with Sky-Blue Audio Pill
// 5. Clean Pedestal: 3D Lush Grass Mound with Zero Stray Lines & Crisp ABC Wooden Blocks
// STRICT ZERO SCROLLBAR APP LOCK: h-screen w-screen overflow-hidden select-none.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons and custom vector assets.

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, RotateCcw, Pencil, Check, CheckCircle2, Lock } from "lucide-react";

import { useAudio } from "../../context/AudioContext.jsx";
import { ALPHABET_DATA } from "../../data/masterDataset.js";
import { speakLetter, speakWord, speakInstruction } from "../../utils/speechEngine.js";
import LetterCanvas from "../../components/canvas/LetterCanvas.jsx";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";

export default function MenulisHurufView() {
  const { playSfx } = useAudio();

  // ── Mode State: Uppercase ('upper') vs Lowercase ('lower') ─────────
  const [mode, setMode] = useState("upper");

  // ── 52-Step Paired Sequential Unlocking State (persisted in localStorage) ──
  // step = letterIndex * 2 + (mode === 'lower' ? 1 : 0) -> ranges 0 to 52
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(() => {
    try {
      const stored = localStorage.getItem("saka_tika_menulis_paired_step");
      if (stored !== null) {
        const val = parseInt(stored, 10);
        return isNaN(val) ? 0 : Math.min(52, Math.max(0, val));
      }
      // Graceful fallback from legacy keys if user had prior progress
      const oldUpper = parseInt(localStorage.getItem("saka_tika_menulis_upper_unlocked") || "0", 10);
      const oldLower = parseInt(localStorage.getItem("saka_tika_menulis_lower_unlocked") || "0", 10);
      if (oldUpper > 0 || oldLower > 0) {
        return Math.min(52, Math.max(oldUpper * 2, oldLower * 2 + 1));
      }
    } catch {
      // fallback
    }
    return 0;
  });

  // Selected letter index (0 to 25)
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [wobbleIdx, setWobbleIdx] = useState(null);
  const [isLowerTabWobbling, setIsLowerTabWobbling] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isMascotJumping, setIsMascotJumping] = useState(false);

  // ── 5 Interactive 3D Crayons / Colored Chalk Sticks State ─────────
  const CRAYON_OPTIONS = useMemo(
    () => [
      {
        id: "blue",
        label: "Biru",
        color: "#2563EB",
        tipColor: "#1D4ED8",
        wrapperColor: "#60A5FA",
        stripeColor: "#1E3A8A",
      },
      {
        id: "red",
        label: "Merah",
        color: "#EF4444",
        tipColor: "#DC2626",
        wrapperColor: "#F87171",
        stripeColor: "#991B1B",
      },
      {
        id: "yellow",
        label: "Kuning",
        color: "#F59E0B",
        tipColor: "#D97706",
        wrapperColor: "#FBBF24",
        stripeColor: "#78350F",
      },
      {
        id: "green",
        label: "Hijau",
        color: "#10B981",
        tipColor: "#059669",
        wrapperColor: "#34D399",
        stripeColor: "#064E3B",
      },
      {
        id: "purple",
        label: "Ungu",
        color: "#8B5CF6",
        tipColor: "#7C3AED",
        wrapperColor: "#A78BFA",
        stripeColor: "#4C1D95",
      },
    ],
    []
  );
  const [activeInkColor, setActiveInkColor] = useState("#2563EB");

  const handleSelectCrayon = (color) => {
    playSfx("click");
    setActiveInkColor(color);
  };

  // ── 9-Letter Paginated Window (Page 0: 0-8, Page 1: 9-17, Page 2: 18-25) ──
  const activePage = Math.floor(selectedIdx / 9);
  const pageStartIndex = activePage * 9;
  const pageItems = useMemo(() => {
    return ALPHABET_DATA.slice(pageStartIndex, Math.min(pageStartIndex + 9, 26));
  }, [pageStartIndex]);

  const letterObj = ALPHABET_DATA[selectedIdx] || ALPHABET_DATA[0];
  const currentLetterChar = mode === "lower" ? letterObj.lowercase : letterObj.letter;

  // Dynamic Child-Friendly Speech Bubble Text
  const [speechBubbleText, setSpeechBubbleText] = useState(() => {
    return `Ayo tebalkan huruf ${currentLetterChar}!`;
  });

  // Check if current letter's lowercase mode is unlocked (requires uppercase completion)
  const isCurrentLowerLocked = selectedIdx * 2 + 1 > maxUnlockedStep;

  // ── Mode Tab Switch Handlers ──
  const handleSelectUpperTab = () => {
    if (mode === "upper") return;
    playSfx("click");
    setMode("upper");
    const msg = `Mode Huruf Besar! Ayo tebalkan ${letterObj.letter}!`;
    setSpeechBubbleText(msg);
    speakInstruction(msg);
  };

  const handleSelectLowerTab = () => {
    if (isCurrentLowerLocked) {
      // Locked: Uppercase must be completed first
      playSfx("error");
      setIsLowerTabWobbling(true);
      setTimeout(() => setIsLowerTabWobbling(false), 500);

      const msg = `Tulis huruf ${letterObj.letter} besar dulu ya!`;
      setSpeechBubbleText(msg);
      speakInstruction(msg);
      return;
    }

    if (mode === "lower") return;
    playSfx("click");
    setMode("lower");
    const msg = `Mode Huruf Kecil! Ayo tebalkan ${letterObj.lowercase}!`;
    setSpeechBubbleText(msg);
    speakInstruction(msg);
  };

  // Letter Ribbon Selection (with strict sequential lock check)
  const handleSelectLetter = (idx) => {
    // If even the uppercase of this letter is locked
    if (idx * 2 > maxUnlockedStep) {
      playSfx("error");
      setWobbleIdx(idx);
      setTimeout(() => setWobbleIdx(null), 500);

      const targetIdx = Math.floor(maxUnlockedStep / 2);
      const targetObj = ALPHABET_DATA[targetIdx] || ALPHABET_DATA[0];
      const requiredName =
        maxUnlockedStep % 2 === 0
          ? `${targetObj.letter} besar`
          : `${targetObj.lowercase} kecil`;
      const msg = `Selesaikan huruf ${requiredName} dulu ya!`;
      setSpeechBubbleText(msg);
      speakInstruction(msg);
      return;
    }

    playSfx("click");
    setSelectedIdx(idx);

    // If current mode is lowercase but this letter's lowercase is locked, revert to upper
    if (mode === "lower" && idx * 2 + 1 > maxUnlockedStep) {
      setMode("upper");
      const char = ALPHABET_DATA[idx].letter;
      setSpeechBubbleText(`Ayo tebalkan huruf ${char}!`);
    } else {
      const char = mode === "lower" ? ALPHABET_DATA[idx].lowercase : ALPHABET_DATA[idx].letter;
      setSpeechBubbleText(`Ayo tebalkan huruf ${char}!`);
    }
  };

  // Previous letter in ribbon (automatically flips page when crossing page boundary)
  const handlePrevLetter = useCallback(() => {
    if (selectedIdx <= 0) return;
    playSfx("hover");
    const prevIdx = selectedIdx - 1;
    setSelectedIdx(prevIdx);

    if (mode === "lower" && prevIdx * 2 + 1 > maxUnlockedStep) {
      setMode("upper");
    }
  }, [selectedIdx, mode, maxUnlockedStep, playSfx]);

  // Next letter in ribbon (capped at max accessible letter index)
  const maxAccessibleIdx = Math.min(25, Math.floor(maxUnlockedStep / 2));
  const handleNextLetter = useCallback(() => {
    if (selectedIdx < maxAccessibleIdx) {
      playSfx("hover");
      const nextIdx = selectedIdx + 1;
      setSelectedIdx(nextIdx);

      if (mode === "lower" && nextIdx * 2 + 1 > maxUnlockedStep) {
        setMode("upper");
      }
    } else {
      playSfx("error");
      const targetIdx = Math.floor(maxUnlockedStep / 2);
      const targetObj = ALPHABET_DATA[targetIdx] || ALPHABET_DATA[0];
      const requiredName =
        maxUnlockedStep % 2 === 0
          ? `${targetObj.letter} besar`
          : `${targetObj.lowercase} kecil`;
      const msg = `Selesaikan huruf ${requiredName} dulu ya!`;
      setSpeechBubbleText(msg);
      speakInstruction(msg);
    }
  }, [selectedIdx, maxAccessibleIdx, maxUnlockedStep, mode, playSfx]);

  // Audio hints
  const handleSpeakLetter = () => {
    playSfx("click");
    speakLetter(letterObj);
    const char = mode === "lower" ? letterObj.lowercase : letterObj.letter;
    setSpeechBubbleText(`Huruf ${char}, bunyinya '${letterObj.phonetic}'!`);
  };

  const handleSpeakWord = () => {
    playSfx("click");
    speakWord(letterObj);
    const char = mode === "lower" ? letterObj.lowercase : letterObj.letter;
    setSpeechBubbleText(`${char} untuk ${letterObj.word}!`);
  };

  // Eraser handler
  const handleEraserClick = () => {
    playSfx("click");
    setResetTrigger((prev) => prev + 1);
    setSpeechBubbleText("Kanvas sudah bersih, ayo mulai lagi!");
  };

  const handleStrokeUpdate = useCallback(() => {
    setSpeechBubbleText("Bagus sekali! Gores terus garisnya!");
  }, []);

  // Completion callback: invoked immediately when the final stroke is finished
  const handleLetterCompleted = useCallback(() => {
    setIsMascotJumping(true);
    setTimeout(() => setIsMascotJumping(false), 900);

    const currentStep = selectedIdx * 2 + (mode === "lower" ? 1 : 0);
    if (currentStep === maxUnlockedStep && maxUnlockedStep < 52) {
      const nextStep = maxUnlockedStep + 1;
      setMaxUnlockedStep(nextStep);
      try {
        localStorage.setItem("saka_tika_menulis_paired_step", String(nextStep));
      } catch {
        // ignore
      }
    }
  }, [selectedIdx, mode, maxUnlockedStep]);

  // Advance callback: invoked AFTER the 1.8-second grand completion hold finishes
  const handleAdvanceNext = useCallback(() => {
    if (mode === "upper") {
      // Uppercase finished -> seamlessly switch to lowercase for the SAME letter
      setMode("lower");
      const nextChar = letterObj.lowercase;
      const msg = `Hebat! Sekarang tulis huruf ${nextChar} kecil ya!`;
      setSpeechBubbleText(msg);
      speakInstruction(msg);
    } else {
      // Lowercase finished -> advance to the NEXT letter in uppercase
      if (selectedIdx < 25) {
        const nextIdx = selectedIdx + 1;
        setSelectedIdx(nextIdx);
        setMode("upper");
        const nextChar = ALPHABET_DATA[nextIdx].letter;
        const msg = `Luar biasa! Sekarang lanjut ke huruf ${nextChar} besar!`;
        setSpeechBubbleText(msg);
        speakInstruction(msg);
      } else {
        // Grand finale celebration for completing all 52 letters!
        const msg = "Hore! Kamu hebat sekali sudah bisa menulis semua 52 huruf besar dan kecil!";
        setSpeechBubbleText(msg);
        speakInstruction(msg);
      }
    }
  }, [mode, selectedIdx, letterObj]);

  // Deterministic golden & cyan sparkles in upper sky
  const sparkles = useMemo(
    () => [
      { top: "7%", left: "12%", size: 10, color: "#7DD3FC", delay: 0 },
      { top: "14%", left: "22%", size: 8, color: "#FDE68A", delay: 0.8 },
      { top: "9%", left: "45%", size: 11, color: "#FEF08A", delay: 1.4 },
      { top: "15%", left: "55%", size: 7, color: "#7DD3FC", delay: 0.4 },
      { top: "8%", left: "75%", size: 10, color: "#FDE68A", delay: 1.1 },
      { top: "16%", left: "86%", size: 9, color: "#7DD3FC", delay: 0.6 },
    ],
    []
  );

  return (
    <main className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none p-2 sm:p-3">
      {/* ── 1. Custom Golden-Honey & Caramel Amber Workshop Backdrop ── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Base Atmospheric Gradient */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: "linear-gradient(180deg, #F59E0B 0%, #E68A00 35%, #D97706 70%, #B45309 100%)",
          }}
        />

        {/* Soft Sunlit Radial Spotlight Glow Behind the Wooden Easel */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(254, 243, 199, 0.45) 0%, rgba(245, 158, 11, 0) 70%)",
          }}
        />

        {/* Floating Glowing Sparkles (Cyan-Blue & Warm Gold) */}
        {sparkles.map((sp, idx) => (
          <motion.div
            key={idx}
            className="absolute pointer-events-none"
            style={{
              top: sp.top,
              left: sp.left,
              width: sp.size,
              height: sp.size,
            }}
            animate={{
              opacity: [0.3, 0.95, 0.3],
              scale: [0.85, 1.25, 0.85],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              delay: sp.delay,
              ease: "easeInOut",
            }}
          >
            <svg viewBox="0 0 24 24" fill={sp.color} className="w-full h-full drop-shadow-xs">
              <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
            </svg>
          </motion.div>
        ))}

        {/* Upper-Left Corner Ornament: Cartoon Yellow Pencil with Cyan Dotted Trail */}
        <div className="absolute top-3 left-4 sm:top-4 sm:left-6 w-20 h-20 sm:w-24 sm:h-24 opacity-85 pointer-events-none drop-shadow-md z-0">
          <svg viewBox="0 0 90 90" fill="none" className="w-full h-full">
            <path
              d="M15 75 Q32 85 46 64 T64 32"
              stroke="#7DD3FC"
              strokeWidth="2.5"
              strokeDasharray="3 3"
              strokeLinecap="round"
            />
            <g transform="translate(32, 14) rotate(45)">
              <rect x="0" y="0" width="12" height="40" rx="2" fill="#FBBF24" stroke="#0F172A" strokeWidth="2" />
              <line x1="4" y1="0" x2="4" y2="40" stroke="#F59E0B" strokeWidth="1.5" />
              <line x1="8" y1="0" x2="8" y2="40" stroke="#FEF08A" strokeWidth="1.5" />
              <rect x="0" y="-8" width="12" height="8" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2" />
              <path d="M0 -8 Q6 -16 12 -8 Z" fill="#F472B6" stroke="#0F172A" strokeWidth="2" />
              <path d="M0 40 L6 52 L12 40 Z" fill="#FDE68A" stroke="#0F172A" strokeWidth="2" />
              <path d="M4 48 L6 52 L8 48 Z" fill="#334155" />
            </g>
          </svg>
        </div>

        {/* Upper-Right Corner Ornament: Artist Color-Dot Palette & Writing Lines */}
        <div className="absolute top-3 right-4 sm:top-4 sm:right-6 w-22 h-18 sm:w-26 sm:h-20 opacity-85 pointer-events-none drop-shadow-md z-0">
          <svg viewBox="0 0 100 70" fill="none" className="w-full h-full">
            <path
              d="M15 35 C15 15 35 8 55 10 C75 12 90 25 90 42 C90 58 75 65 58 62 C48 60 44 48 35 48 C28 48 24 55 18 50 C15 45 15 40 15 35 Z"
              fill="#FDE68A"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <ellipse cx="72" cy="48" rx="6" ry="8" fill="#D97706" stroke="#0F172A" strokeWidth="2" />
            <circle cx="32" cy="22" r="5.5" fill="#EF4444" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="50" cy="18" r="5.5" fill="#FACC15" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="68" cy="24" r="5.5" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="80" cy="35" r="5" fill="#10B981" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="22" y1="36" x2="48" y2="36" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="22" y1="41" x2="48" y2="41" stroke="#F87171" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Layered Warm Ochre Hills along Bottom Edge */}
        <div className="absolute bottom-0 inset-x-0 h-36 overflow-hidden pointer-events-none opacity-35">
          <svg viewBox="0 0 1440 200" fill="none" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 80 Q360 20 720 70 T1440 40 L1440 200 L0 200 Z" fill="#92400E" />
            <path d="M0 110 Q400 60 800 100 T1440 80 L1440 200 L0 200 Z" fill="#78350F" />
          </svg>
        </div>
      </div>

      {/* ── 2. Subtle Dark Tint Layer ───────────────────────── */}
      <div className="fixed inset-0 bg-[#000000]/10 pointer-events-none z-0" />

      {/* ── 3. Main Workspace Container ─────────────────────── */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col justify-between max-w-7xl w-full mx-auto">
        
        {/* ── Top Bar: 9-Letter Paginated Paired Alphabet Window (Zero Overflow) ── */}
        <header className="h-12 sm:h-14 max-h-14 flex items-center justify-center w-full flex-shrink-0 mb-1 px-2 z-20">
          <div className="w-full max-w-2xl flex items-center justify-center gap-2 sm:gap-3">
            
            {/* Real Client Sprite Left Arrow (kiri.png) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.15, rotate: -4 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: "spring", stiffness: 450, damping: 16 }}
              onClick={handlePrevLetter}
              disabled={selectedIdx <= 0}
              aria-label="Huruf Sebelumnya"
              className={`p-0 bg-transparent border-0 outline-none flex-shrink-0 ${
                selectedIdx <= 0 ? "opacity-35 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <img
                src="/assets/buttons/kiri.png"
                alt="Sebelumnya"
                draggable="false"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow select-none pointer-events-none"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </motion.button>

            {/* 9-Letter Paginated Window with Paired Letters (Aa, Bb, Cc... Zz) */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-2.5 px-3 py-1 bg-white/85 backdrop-blur-md rounded-2xl border-2 border-white/95 shadow-sm">
              {pageItems.map((item, localIdx) => {
                const globalIdx = pageStartIndex + localIdx;
                const isSelected = globalIdx === selectedIdx;
                // Both upper & lower are finished
                const isPairDone = globalIdx * 2 + 1 < maxUnlockedStep;
                // Current progression target letter
                const isTarget = Math.floor(maxUnlockedStep / 2) === globalIdx;
                // Uppercase not yet unlocked
                const isLocked = globalIdx * 2 > maxUnlockedStep;
                const isWobbling = wobbleIdx === globalIdx;
                const pairLabel = `${item.letter}${item.lowercase}`;

                return (
                  <motion.button
                    key={item.letter}
                    type="button"
                    animate={isWobbling ? { x: [-5, 5, -4, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={!isLocked ? { scale: 1.1 } : {}}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleSelectLetter(globalIdx)}
                    aria-label={`Pilih huruf ${pairLabel}`}
                    className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl font-display text-xs sm:text-sm md:text-base flex items-center justify-center relative select-none cursor-pointer transition-all ${
                      isSelected
                        ? "shadow-md scale-110 z-10 text-white font-black border-b-[3px]"
                        : isTarget
                        ? "ring-3 ring-amber-400 font-black text-white scale-105 z-10 shadow-sm"
                        : isPairDone
                        ? "bg-white font-bold border-b-2 shadow-2xs"
                        : "bg-slate-700/85 border-slate-800 text-slate-400 font-bold border-b-2"
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: item.color,
                            borderColor: item.color,
                          }
                        : isTarget
                        ? {
                            backgroundColor: item.color,
                            borderColor: item.color,
                          }
                        : isPairDone
                        ? {
                            backgroundColor: `${item.color}22`,
                            color: item.color,
                            borderColor: `${item.color}66`,
                          }
                        : {}
                    }
                  >
                    {pairLabel}

                    {/* Crisp Green Checkmark Circle for Completed Letter-Pairs (Zero Stars) */}
                    {isPairDone && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center shadow-xs text-white">
                        <Check size={9} strokeWidth={3.5} />
                      </span>
                    )}

                    {/* Padlock Badge for Locked Letters */}
                    {isLocked && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-xs text-amber-300">
                        <Lock size={8} strokeWidth={2.5} />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Real Client Sprite Right Arrow (kanan.png) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.15, rotate: 4 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: "spring", stiffness: 450, damping: 16 }}
              onClick={handleNextLetter}
              disabled={selectedIdx >= maxAccessibleIdx}
              aria-label="Huruf Selanjutnya"
              className={`p-0 bg-transparent border-0 outline-none flex-shrink-0 ${
                selectedIdx >= maxAccessibleIdx ? "opacity-35 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <img
                src="/assets/buttons/kanan.png"
                alt="Selanjutnya"
                draggable="false"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow select-none pointer-events-none"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </motion.button>

          </div>
        </header>

        {/* ── Main Stage: Left Mascot Stage, Center Spotlight Easel & Right Control Dock ── */}
        <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-[220px_1fr_140px] md:grid-cols-[235px_1fr_145px] lg:grid-cols-[255px_1fr_155px] gap-3 lg:gap-5 items-center my-auto w-full max-w-7xl mx-auto px-2 sm:px-4">
          
          {/* ══════════════════════════════════════════════════════
              LEFT COLUMN: Saka & Tika Mascot Stage with Grounded Grass Mound
             ══════════════════════════════════════════════════════ */}
          <aside className="w-full flex flex-col items-center justify-end relative h-full max-h-[80vh] pb-1 select-none overflow-visible">
            
            {/* Dynamic Child-Friendly Speech Bubble (Strict Clearance from Easel) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={speechBubbleText}
                initial={{ opacity: 0, y: 10, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
                className="bg-white/95 border-2 border-amber-300/80 rounded-2xl px-3 py-1.5 shadow-md w-full max-w-[190px] sm:max-w-[200px] text-center mb-2 pointer-events-none relative z-30"
              >
                <p className="font-sans font-bold text-[11px] sm:text-xs text-[#1B4965] leading-snug line-clamp-3">
                  {speechBubbleText}
                </p>
                {/* Pointer tail directed cleanly downward toward Saka & Tika */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-amber-300/80 rotate-45" />
              </motion.div>
            </AnimatePresence>

            {/* Saka & Tika Mascot Cutouts Standing Firmly on Top Grass Rim */}
            <div className="relative flex items-end justify-center z-10 -mb-2">
              {/* Saka Mascot Cutout (Left) */}
              <motion.img
                src="/assets/saka-maskot-1-cutout.png"
                alt="Saka Maskot"
                animate={
                  isMascotJumping
                    ? { y: [-16, 0, -8, 0], scale: [1, 1.05, 1] }
                    : { y: [0, -3, 0] }
                }
                transition={
                  isMascotJumping
                    ? { duration: 0.7, ease: "easeOut" }
                    : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                }
                className="h-28 sm:h-32 lg:h-38 w-auto object-contain object-bottom drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] select-none pointer-events-none z-10"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />

              {/* Tika Mascot Cutout (Right, safely separated from easel) */}
              <motion.img
                src="/assets/tika-maskot-1-cutout.png"
                alt="Tika Maskot"
                animate={
                  isMascotJumping
                    ? { y: [-18, 0, -9, 0], scale: [1, 1.05, 1] }
                    : { y: [0, -3.5, 0] }
                }
                transition={
                  isMascotJumping
                    ? { duration: 0.7, delay: 0.08, ease: "easeOut" }
                    : { duration: 3.5, repeat: Infinity, delay: 0.4, ease: "easeInOut" }
                }
                className="h-28 sm:h-32 lg:h-38 w-auto object-contain object-bottom drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] select-none pointer-events-none z-10 -ml-4"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </div>

            {/* Natural, Wide, Grounded Multi-Tone 3D Lush Green Grass Hill Mound (Zero ABC Blocks) */}
            <div className="relative w-full max-w-[220px] sm:max-w-[245px] flex flex-col items-center z-20">
              {/* Soft Contact Shadows Under Mascots' Sneakers */}
              <div className="absolute -top-1 left-5 w-14 h-3 bg-[#064E3B]/35 rounded-full blur-[2px] pointer-events-none" />
              <div className="absolute -top-1 right-5 w-14 h-3 bg-[#064E3B]/35 rounded-full blur-[2px] pointer-events-none" />

              {/* Multi-Tone 3D Lush Grass Mound SVG Contour */}
              <svg
                viewBox="0 0 240 68"
                fill="none"
                className="w-full h-auto drop-shadow-lg pointer-events-none select-none"
              >
                <defs>
                  <linearGradient id="moundGrassGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ADE80" />
                    <stop offset="40%" stopColor="#22C55E" />
                    <stop offset="100%" stopColor="#16A34A" />
                  </linearGradient>
                  <linearGradient id="moundGrassGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#86EFAC" />
                    <stop offset="100%" stopColor="#4ADE80" />
                  </linearGradient>
                  <linearGradient id="moundSoilGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#15803D" />
                    <stop offset="100%" stopColor="#14532D" />
                  </linearGradient>
                </defs>
                {/* Base Dark Turf Shadow */}
                <path
                  d="M 5 35 Q 120 2 235 35 L 235 68 L 5 68 Z"
                  fill="url(#moundSoilGrad)"
                />
                {/* Main 3D Lush Grass Contour */}
                <path
                  d="M 0 30 Q 120 -4 240 30 L 240 65 L 0 65 Z"
                  fill="url(#moundGrassGrad1)"
                />
                {/* Top Bright Highlight Rim */}
                <path
                  d="M 12 27 Q 120 -1 228 27 Q 120 5 12 27 Z"
                  fill="url(#moundGrassGrad2)"
                  opacity="0.85"
                />
                {/* Natural Vector Grass Tufts */}
                <path
                  d="M 40 24 Q 38 14 34 16 Q 39 18 42 24"
                  stroke="#22C55E"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 43 25 Q 46 12 50 15 Q 46 19 45 25"
                  stroke="#86EFAC"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 195 24 Q 192 14 188 17 Q 193 18 197 24"
                  stroke="#22C55E"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 198 25 Q 202 12 206 15 Q 201 19 200 25"
                  stroke="#86EFAC"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

          </aside>

          {/* ══════════════════════════════════════════════════════
              CENTER COLUMN: Spotlight 3D Storybook Artist Easel
             ══════════════════════════════════════════════════════ */}
          <section className="flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-center relative w-full">
            
            {/* Soft Sunlit Spotlight Glow Behind the Easel */}
            <div className="absolute -inset-6 bg-[radial-gradient(ellipse_at_50%_50%,rgba(254,240,138,0.35)_0%,rgba(255,255,255,0)_70%)] pointer-events-none blur-sm -z-10" />

            {/* Easel Header Strip: Mode Switch Tabs (Left) & Paired Progress Pill (Right) */}
            <div className="w-full flex items-center justify-between px-2 mb-2 flex-shrink-0 z-20">
              
              {/* Mode Switch Tabs: Huruf Besar (ABC) & Huruf Kecil (abc) */}
              <div className="flex items-center gap-1.5 p-1 bg-white/85 backdrop-blur-md rounded-2xl border-2 border-white shadow-xs">
                <button
                  type="button"
                  onClick={handleSelectUpperTab}
                  className={`px-3 py-1 rounded-xl font-display font-bold text-xs sm:text-sm cursor-pointer transition-all ${
                    mode === "upper"
                      ? "bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white border-b-2 border-[#0369A1] shadow-xs"
                      : "text-[#1B4965] hover:bg-white/60"
                  }`}
                >
                  Huruf Besar (ABC)
                </button>

                <motion.button
                  type="button"
                  animate={isLowerTabWobbling ? { x: [-4, 4, -3, 3, 0] } : { x: 0 }}
                  transition={{ duration: 0.35 }}
                  onClick={handleSelectLowerTab}
                  className={`px-3 py-1 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center gap-1 transition-all ${
                    mode === "lower"
                      ? "bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white border-b-2 border-[#0369A1] shadow-xs cursor-pointer"
                      : isCurrentLowerLocked
                      ? "bg-slate-200/60 text-slate-400 border border-slate-300/80 cursor-pointer"
                      : "text-[#1B4965] hover:bg-white/60 cursor-pointer"
                  }`}
                >
                  <span>Huruf Kecil (abc)</span>
                  {isCurrentLowerLocked && (
                    <Lock size={11} strokeWidth={2.5} className="text-slate-500" />
                  )}
                </motion.button>
              </div>

              {/* 52-Step Paired Progress Pill with Pencil Icon (Zero Stars Motif) */}
              <div className="bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-2 border-amber-400 rounded-2xl px-3 py-1 shadow-xs flex items-center gap-1.5 flex-shrink-0">
                <Pencil size={14} className="text-amber-600 stroke-[2.5]" />
                <span className="font-display font-bold text-xs sm:text-sm text-amber-900">
                  Selesai: {Math.min(maxUnlockedStep, 52)} / 52 Huruf
                </span>
              </div>
            </div>

            {/* 3D Storybook Artist Easel with Honey-Oak Frame & Interactive Crayon Tray Ledge */}
            <div className="relative w-full max-h-[52vh] aspect-[4/3] md:aspect-[16/10] my-auto rounded-[2rem] p-2.5 sm:p-3.5 bg-gradient-to-b from-[#C88E59] via-[#B57843] to-[#8D5B2F] border-[8px] sm:border-[10px] border-[#9A5B25] ring-4 ring-amber-200/90 border-b-[12px] border-b-[#5C3818] shadow-[0_18px_40px_rgba(120,53,15,0.35)] flex flex-col justify-between">
              
              {/* Top Gloss Light Reflex */}
              <div className="absolute top-1 inset-x-5 h-[1.5px] bg-white/40 rounded-full pointer-events-none" />

              {/* Wooden Stand Pegs Anchored Below */}
              <div className="absolute -bottom-6 sm:-bottom-7 left-1/4 w-4 sm:w-5 h-7 sm:h-8 bg-gradient-to-r from-[#78350F] to-[#451A03] rounded-b-lg shadow-md -z-10" />
              <div className="absolute -bottom-6 sm:-bottom-7 right-1/4 w-4 sm:w-5 h-7 sm:h-8 bg-gradient-to-r from-[#78350F] to-[#451A03] rounded-b-lg shadow-md -z-10" />

              {/* Cream Writing Surface Hosting Dual-Layer Canvas Engine */}
              <div className="flex-1 w-full h-full rounded-2xl overflow-hidden relative border-2 border-[#E7D7C1] shadow-inner bg-[#FFFDF8]">
                <LetterCanvas
                  letterObj={letterObj}
                  mode={mode}
                  activeColor={activeInkColor}
                  onNextLetter={handleAdvanceNext}
                  hasNextLetter={selectedIdx < 25 || mode === "upper"}
                  onStrokeUpdate={handleStrokeUpdate}
                  onLetterCompleted={handleLetterCompleted}
                  resetTrigger={resetTrigger}
                />
              </div>

              {/* Wooden Marker Tray Ledge along bottom border with 5 Interactive 3D Cartoon Crayons */}
              <div className="relative -mb-4 sm:-mb-5 mx-2 sm:mx-6 h-8 sm:h-9 bg-gradient-to-b from-[#6D340E] via-[#55270A] to-[#3B1904] rounded-b-2xl border-t-2 border-[#B87333] shadow-lg flex items-center justify-center gap-2 sm:gap-3.5 px-3 z-30">
                {CRAYON_OPTIONS.map((c) => {
                  const isActive = activeInkColor === c.color;
                  return (
                    <motion.button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCrayon(c.color)}
                      whileHover={{ y: isActive ? -9 : -5, scale: isActive ? 1.15 : 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      animate={isActive ? { y: -7, scale: 1.12 } : { y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 450, damping: 20 }}
                      aria-label={`Pilih krayon ${c.label}`}
                      aria-pressed={isActive}
                      className={`relative cursor-pointer outline-none rounded-md transition-all select-none ${
                        isActive
                          ? "ring-2 ring-white ring-offset-2 ring-offset-[#451A03] drop-shadow-[0_0_10px_rgba(255,255,255,0.85)] z-10"
                          : "opacity-85 hover:opacity-100 hover:drop-shadow-md"
                      }`}
                    >
                      <svg
                        viewBox="0 0 68 20"
                        className="w-11 sm:w-13 md:w-15 h-3.5 sm:h-4.5 filter drop-shadow pointer-events-none"
                      >
                        {/* Tapered Crayon Tip (pointed left) */}
                        <path d="M 12 10 L 2 10 Q 0 10 2 9 L 12 3 Z" fill={c.tipColor} />
                        <path d="M 12 10 L 2 10 Q 0 10 2 11 L 12 17 Z" fill={c.color} />
                        {/* Exposed Wax Neck */}
                        <rect x="12" y="3" width="5" height="14" rx="1" fill={c.tipColor} />
                        {/* Paper Wrapper Body */}
                        <rect x="17" y="2" width="45" height="16" rx="2" fill={c.wrapperColor} />
                        {/* Paper wrapper top highlight */}
                        <rect x="17" y="2" width="45" height="3.5" fill="rgba(255,255,255,0.4)" />
                        {/* Paper wrapper bottom shadow */}
                        <rect x="17" y="14.5" width="45" height="3.5" fill="rgba(0,0,0,0.22)" />
                        {/* Decorative wrapper stripes */}
                        <rect x="22" y="2" width="3" height="16" fill={c.stripeColor} opacity="0.8" />
                        <rect x="27" y="2" width="2" height="16" fill={c.stripeColor} opacity="0.8" />
                        <rect x="52" y="2" width="2" height="16" fill={c.stripeColor} opacity="0.8" />
                        <rect x="56" y="2" width="3" height="16" fill={c.stripeColor} opacity="0.8" />
                        {/* Center decorative oval badge */}
                        <ellipse cx="40" cy="10" rx="6.5" ry="4" fill="rgba(255,255,255,0.75)" />
                        {/* Right base end */}
                        <rect x="62" y="3" width="4" height="14" rx="1" fill={c.tipColor} />
                      </svg>

                      {/* Crisp Glowing Aura indicator when active */}
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#fff]" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

            </div>

          </section>

          {/* ══════════════════════════════════════════════════════
              RIGHT COLUMN: High-Contrast Object Card & Tactile Controls
             ══════════════════════════════════════════════════════ */}
          <aside className="w-full flex-shrink-0 flex flex-col justify-between items-center py-1 gap-2 overflow-hidden">
            
            {/* ── 1. Full-Color Object Illustration Card with Sky-Blue Audio Pill ── */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSpeakWord}
              aria-label={`Dengarkan contoh kata ${letterObj.word}`}
              className="w-full bg-white/95 rounded-3xl border-3 sm:border-4 border-amber-200 shadow-xl p-2 sm:p-2.5 flex flex-col items-center justify-center cursor-pointer group transition-all"
            >
              {/* Glossy cream-white rounded square illustration frame */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl p-2 border-2 border-amber-200/90 shadow-inner flex items-center justify-center group-hover:scale-108 transition-transform">
                <WordIllustration
                  illustrationKey={letterObj.illustrationKey}
                  word={letterObj.word}
                  color={letterObj.color}
                  showBadge={false}
                  className="w-full h-full object-contain drop-shadow-xs"
                />
              </div>

              {/* High-Contrast Word Title */}
              <span className="font-display font-black text-base sm:text-lg md:text-xl text-slate-800 mt-1.5 leading-tight tracking-wide truncate max-w-full">
                {letterObj.word}
              </span>

              {/* Sky-Blue Audio Pill */}
              <div className="mt-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-xs flex items-center gap-1">
                <Volume2 size={11} className="stroke-[2.5]" />
                <span className="font-sans font-bold text-[10px] leading-tight whitespace-nowrap">
                  Ketuk Gambar
                </span>
              </div>
            </motion.button>

            {/* ── 2. Compact Voice Hint Button (Volume2) ────────── */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSpeakLetter}
              aria-label={`Dengarkan bunyi huruf ${currentLetterChar}`}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-b from-[#38BDF8] to-[#0284C7] border-b-3 border-[#0369A1] text-white shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:border-b-0"
            >
              <Volume2 size={15} />
              <span className="font-display font-bold text-xs sm:text-sm">Suara</span>
            </motion.button>

            {/* ── 3. Compact Tactile Eraser Button (Hapus) ─────── */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEraserClick}
              aria-label="Hapus dan bersihkan kanvas"
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-b from-[#FDE047] to-[#F59E0B] border-b-3 border-[#B45309] text-[#78350F] shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:border-b-0"
            >
              <RotateCcw size={14} />
              <span className="font-display font-bold text-xs sm:text-sm">Hapus</span>
            </motion.button>

          </aside>

        </div>

      </div>
    </main>
  );
}
