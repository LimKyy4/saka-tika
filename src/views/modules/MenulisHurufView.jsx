// src/views/modules/MenulisHurufView.jsx
// SAKA TIKA: "Menulis Huruf" Paired Progression (A -> a -> B -> b ... -> Z -> z) & Symmetrical Studio Polish
// 1. Perfectly Balanced & Symmetrical 3-Column Stage (Left Mascot, Center Spotlight Easel, Right Control Dock)
// 2. Interactive Crayon/Marker Color Palette (5 Child-Friendly Vibrant Inks with Sound Feedback)
// 3. Tap-Interactive Mascot Companion Card & Burst Celebrations (Saka & Tika on 3D Grass Mound)
// 4. Interactive Bouncy Object Card with Phonetic Audio & Elastic Jiggle Animation
// 5. Full 26-Letter Alphabet Ribbon (A-Z) with Gentle Spring Physics & Active Pulse Halo
// STRICT ZERO SCROLLBAR APP LOCK: h-screen w-screen overflow-hidden select-none.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons and custom vector assets.
// STRICT ZERO STAR ICONS POLICY: Zero star icons rendered anywhere in the UI.

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  RotateCcw,
  Check,
  Lock,
  Palette,
  Pencil,
} from "lucide-react";

import { useAudio } from "../../context/AudioContext.jsx";
import { ALPHABET_DATA } from "../../data/masterDataset.js";
import { getLetterPath } from "../../data/alphabetPaths.js";
import { speakWord, speakInstruction } from "../../utils/speechEngine.js";
import { playXylophoneNote } from "../../utils/soundSynthesizer.js";
import LetterCanvas from "../../components/canvas/LetterCanvas.jsx";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";

export default function MenulisHurufView() {
  const { playSfx } = useAudio();

  // ── 52-Step Paired Progression State (Stored in localStorage) ──────
  // Step 0: A (Upper), Step 1: a (Lower)
  // Step 2: B (Upper), Step 3: b (Lower) ...
  // Step 50: Z (Upper), Step 51: z (Lower)
  // Step 52: All 52 letters completed!
  const [pairedMaxStep, setPairedMaxStep] = useState(() => {
    try {
      const stored = localStorage.getItem("saka_tika_menulis_paired_step");
      if (stored !== null) {
        const val = parseInt(stored, 10);
        return isNaN(val) ? 0 : Math.min(52, Math.max(0, val));
      }
      // Migrate legacy individual upper/lower unlocked keys if present
      const storedUpper = localStorage.getItem("saka_tika_menulis_upper_unlocked");
      if (storedUpper !== null) {
        const uVal = parseInt(storedUpper, 10) || 0;
        return Math.min(52, uVal * 2);
      }
    } catch {
      // fallback
    }
    return 0; // Step 0: 'A' upper is unlocked by default
  });

  // Calculate initial letter index and mode based on stored progress
  const initialStep = Math.min(51, pairedMaxStep);
  const initialIdx = Math.floor(initialStep / 2);
  const initialMode = initialStep % 2 === 0 ? "upper" : "lower";

  const [selectedIdx, setSelectedIdx] = useState(initialIdx);
  const [mode, setMode] = useState(initialMode);
  const [wobbleIdx, setWobbleIdx] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isMascotJumping, setIsMascotJumping] = useState(false);
  const [isObjectBouncing, setIsObjectBouncing] = useState(false);
  const [completionCheer, setCompletionCheer] = useState(null);

  // ── Interactive Crayon / Marker Ink Color Palette ─────────────────
  const CRAYON_COLORS = useMemo(
    () => [
      { id: "blue", hex: "#2563EB", name: "Biru" },
      { id: "emerald", hex: "#10B981", name: "Hijau" },
      { id: "red", hex: "#EF4444", name: "Merah" },
      { id: "amber", hex: "#F59E0B", name: "Oranye" },
      { id: "purple", hex: "#8B5CF6", name: "Ungu" },
    ],
    []
  );
  const [activeInkColor, setActiveInkColor] = useState(CRAYON_COLORS[0].hex);

  // Active letter data
  const letterObj = ALPHABET_DATA[selectedIdx] || ALPHABET_DATA[0];
  const currentLetterChar = mode === "lower" ? letterObj.lowercase : letterObj.letter;
  const pathData = getLetterPath(currentLetterChar, mode);

  // Mode switch handler (Huruf Besar / Huruf Kecil)
  const handleSetMode = (newMode) => {
    if (mode === newMode) return;
    playSfx("click");
    setMode(newMode);
    setResetTrigger((prev) => prev + 1);
    const char = newMode === "lower" ? letterObj.lowercase : letterObj.letter;
    const label = newMode === "lower" ? "kecil" : "besar";
    speakInstruction(`Huruf ${char} ${label}.`);
  };

  // Dynamic child-friendly speech bubble prompt above Saka & Tika
  const speechBubbleText = useMemo(() => {
    if (completionCheer) {
      return completionCheer;
    }
    if (wobbleIdx !== null) {
      const targetIdx = Math.floor(pairedMaxStep / 2);
      const targetObj = ALPHABET_DATA[targetIdx] || ALPHABET_DATA[0];
      const targetMode = pairedMaxStep % 2 === 0 ? "besar" : "kecil";
      const targetChar = pairedMaxStep % 2 === 0 ? targetObj.letter : targetObj.lowercase;
      return `Selesaikan huruf ${targetChar} ${targetMode} dulu ya!`;
    }
    if (pairedMaxStep >= 52) {
      return "Hebat! Semua huruf selesai!";
    }
    return `Ayo tebalkan huruf ${currentLetterChar}!`;
  }, [completionCheer, wobbleIdx, pairedMaxStep, currentLetterChar]);

  // Mascot cheer encouragement pool
  const mascotCheers = useMemo(
    () => [
      "Ayo semangat! Kamu pasti bisa!",
      "Hebat sekali belajarnya!",
      "Saka dan Tika senang belajar bersamamu!",
      "Garisnya rapi sekali!",
      "Terus mencoba ya, kamu anak pintar!",
    ],
    []
  );

  // Interactive Mascot Tap Action (Fun for TK children)
  const handleMascotTap = () => {
    playSfx("hover");
    setIsMascotJumping(true);
    setTimeout(() => setIsMascotJumping(false), 800);

    // Celebratory local confetti burst near mascots
    confetti({
      particleCount: 36,
      spread: 60,
      origin: { x: 0.16, y: 0.72 },
      colors: ["#F59E0B", "#10B981", "#38BDF8", "#EC4899", "#8B5CF6"],
    });

    const randomCheer = mascotCheers[Math.floor(Math.random() * mascotCheers.length)];
    speakInstruction(randomCheer);
  };

  // Color selection with tactile sound
  const handleSelectColor = (hex, idx) => {
    setActiveInkColor(hex);
    playXylophoneNote(idx % 3);
  };

  // Letter Ribbon Selection (with sequential lock check per pair)
  const handleSelectLetter = (idx) => {
    const letterStepStart = idx * 2;
    if (letterStepStart > pairedMaxStep) {
      playSfx("error");
      setWobbleIdx(idx);
      setTimeout(() => setWobbleIdx(null), 500);

      const targetIdx = Math.floor(pairedMaxStep / 2);
      const targetObj = ALPHABET_DATA[targetIdx] || ALPHABET_DATA[0];
      const targetMode = pairedMaxStep % 2 === 0 ? "besar" : "kecil";
      const targetChar = pairedMaxStep % 2 === 0 ? targetObj.letter : targetObj.lowercase;
      speakInstruction(`Selesaikan huruf ${targetChar} ${targetMode} dulu ya!`);
      return;
    }

    playSfx("click");
    setSelectedIdx(idx);
    setResetTrigger((prev) => prev + 1);

    if (pairedMaxStep === letterStepStart + 1) {
      setMode("lower");
      speakInstruction(`Huruf ${ALPHABET_DATA[idx].lowercase} kecil.`);
    } else {
      setMode("upper");
      speakInstruction(`Huruf ${ALPHABET_DATA[idx].letter} besar.`);
    }
  };

  // Audio hints
  const handleSpeakLetter = () => {
    playSfx("click");
    const char = mode === "lower" ? letterObj.lowercase : letterObj.letter;
    const modeLabel = mode === "lower" ? "kecil" : "besar";
    const msg = `Huruf ${char} ${modeLabel}, bunyinya '${letterObj.phonetic}'!`;
    speakInstruction(msg);
  };

  const handleSpeakWord = () => {
    playSfx("click");
    setIsObjectBouncing(true);
    setTimeout(() => setIsObjectBouncing(false), 700);
    speakWord(letterObj);
  };

  // Eraser handler
  const handleEraserClick = () => {
    playSfx("click");
    setResetTrigger((prev) => prev + 1);
    speakInstruction("Kanvas sudah bersih, ayo mulai lagi!");
  };

  // Optional stroke update callback
  const handleStrokeUpdate = useCallback(() => {
    // Canvas handles internal stroke feedback seamlessly
  }, []);

  // Completion callback: invoked immediately when the final stroke is finished
  const handleLetterCompleted = useCallback(() => {
    setIsMascotJumping(true);
    setCompletionCheer("Hebat! Lanjut ke huruf berikutnya!");
    setTimeout(() => {
      setIsMascotJumping(false);
      setCompletionCheer(null);
    }, 1800);

    const currentStep = selectedIdx * 2 + (mode === "lower" ? 1 : 0);
    if (currentStep === pairedMaxStep && pairedMaxStep < 52) {
      const nextStep = pairedMaxStep + 1;
      setPairedMaxStep(nextStep);
      try {
        localStorage.setItem("saka_tika_menulis_paired_step", String(nextStep));
        const nextUpper = Math.min(25, Math.floor(nextStep / 2));
        const nextLower = Math.min(25, Math.floor((nextStep + 1) / 2));
        localStorage.setItem("saka_tika_menulis_upper_unlocked", String(nextUpper));
        localStorage.setItem("saka_tika_menulis_lower_unlocked", String(nextLower));
      } catch {
        // ignore
      }
    }
  }, [selectedIdx, mode, pairedMaxStep]);

  // Advance callback: invoked AFTER the 1.8-second grand completion hold finishes
  const handleAdvanceNext = useCallback(() => {
    if (mode === "upper") {
      setMode("lower");
      setResetTrigger((prev) => prev + 1);
      const char = letterObj.lowercase;
      speakInstruction(`Hebat! Sekarang tulis huruf ${char} kecil ya!`);
    } else {
      if (selectedIdx < 25) {
        const nextIdx = selectedIdx + 1;
        setSelectedIdx(nextIdx);
        setMode("upper");
        setResetTrigger((prev) => prev + 1);
        const nextChar = ALPHABET_DATA[nextIdx].letter;
        speakInstruction(`Luar biasa! Sekarang lanjut ke huruf ${nextChar} besar!`);
      } else {
        speakInstruction("Hore! Selamat! Kamu hebat sekali sudah berhasil menulis semua huruf dari A sampai Z!");
      }
    }
  }, [mode, selectedIdx, letterObj]);

  // Deterministic sparkles in background sky
  const sparkles = useMemo(
    () => [
      { top: "6%", left: "10%", size: 12, color: "#7DD3FC", delay: 0 },
      { top: "12%", left: "20%", size: 9, color: "#FDE68A", delay: 0.8 },
      { top: "8%", left: "42%", size: 13, color: "#FEF08A", delay: 1.4 },
      { top: "14%", left: "58%", size: 8, color: "#7DD3FC", delay: 0.4 },
      { top: "7%", left: "78%", size: 11, color: "#FDE68A", delay: 1.1 },
      { top: "15%", left: "88%", size: 10, color: "#7DD3FC", delay: 0.6 },
    ],
    []
  );

  // Calculate completed pairs count for display
  const completedPairsCount = Math.min(26, Math.floor(pairedMaxStep / 2));

  return (
    <main className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none px-2 sm:px-4 py-2">
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
              "radial-gradient(ellipse at 50% 50%, rgba(254, 243, 199, 0.55) 0%, rgba(251, 191, 36, 0.2) 40%, rgba(245, 158, 11, 0) 70%)",
          }}
        />

        {/* Warm-Amber Outer Vignette to Gently Darken Peripheral Corners */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(120, 53, 15, 0.32) 100%)",
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
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 3.2,
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

        {/* Upper-Left Corner Ornament: Cartoon Yellow Pencil with Active Ink Color Sync */}
        <div className="absolute top-16 left-3 sm:top-18 sm:left-4 w-16 h-16 sm:w-20 sm:h-20 opacity-40 sm:opacity-50 pointer-events-none drop-shadow-md z-0 transition-all duration-300">
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
              <line x1="8" y1="0" x2="8" y2="40" stroke={activeInkColor} strokeWidth="1.8" />
              <rect x="0" y="-8" width="12" height="8" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2" />
              <path d="M0 -8 Q6 -16 12 -8 Z" fill="#F472B6" stroke="#0F172A" strokeWidth="2" />
              <path d="M0 40 L6 52 L12 40 Z" fill="#FDE68A" stroke="#0F172A" strokeWidth="2" />
              <path d="M4 48 L6 52 L8 48 Z" fill={activeInkColor} />
            </g>
          </svg>
        </div>

        {/* Upper-Right Corner Ornament: Artist Color-Dot Palette & Writing Lines */}
        <div className="absolute top-22 right-6 w-16 h-16 sm:w-20 sm:h-20 opacity-80 pointer-events-none drop-shadow-md z-0">
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
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col justify-between w-full mx-auto">
        
        {/* ── Top HUD Row: 2-Row × 13-Column Compact High-Contrast Alphabet Tray (A–M & N–Z) ── */}
        {/* Centered on the same horizontal plane between top-left "← Menu" and top-right audio toggle */}
        <header className="w-full flex-shrink-0 pt-0.5 sm:pt-1 pb-1 px-20 sm:px-28 lg:px-32 flex items-center justify-center z-30 pointer-events-none">
          <div className="w-fit mx-auto bg-[#FFFDF9]/95 border-2 border-amber-200 border-b-4 border-b-amber-300/80 rounded-2xl px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-md pointer-events-auto">
            <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1 sm:gap-1.5 justify-items-center">
              {ALPHABET_DATA.map((item, idx) => {
                const isSelected = idx === selectedIdx;
                const letterStepStart = idx * 2;
                // Both upper and lower for this letter are completed
                const isPairDone = letterStepStart + 1 < pairedMaxStep;
                // Currently active target letter in progression
                const isTarget =
                  pairedMaxStep === letterStepStart || pairedMaxStep === letterStepStart + 1;
                // Letter not yet unlocked
                const isLocked = letterStepStart > pairedMaxStep;
                const isWobbling = wobbleIdx === idx;

                const letterDisplay = isSelected && mode === "lower" ? item.lowercase : item.letter;

                return (
                  <motion.button
                    key={item.letter}
                    type="button"
                    animate={isWobbling ? { x: [-5, 5, -4, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={!isLocked ? { scale: 1.15, y: -2 } : {}}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleSelectLetter(idx)}
                    aria-label={`Pilih huruf ${item.letter}`}
                    className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 lg:w-9 lg:h-9 rounded-lg sm:rounded-xl font-display font-black text-sm sm:text-base flex items-center justify-center relative cursor-pointer select-none transition-all ${
                      isSelected
                        ? "shadow-md scale-105 z-20 text-white font-black ring-2 ring-amber-400 border-b-2"
                        : isTarget
                        ? "bg-sky-500 border-2 border-white text-white shadow-md scale-105 ring-2 ring-sky-300 font-black z-10"
                        : isPairDone
                        ? "bg-white border-2 border-emerald-400 text-slate-900 shadow-xs font-black hover:bg-emerald-50/50"
                        : "bg-slate-700 border border-slate-600 text-white/90 font-extrabold"
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: item.color,
                            borderColor: item.color,
                          }
                        : {}
                    }
                  >
                    {letterDisplay}

                    {/* Crisp Emerald Checkmark Badge for Completed Letters (Zero Star Icons Policy) */}
                    {isPairDone && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white flex items-center justify-center shadow-xs text-white pointer-events-none z-10">
                        <Check size={8} strokeWidth={3.5} />
                      </span>
                    )}

                    {/* Golden Padlock Badge for Locked Letters */}
                    {isLocked && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-600 flex items-center justify-center shadow-xs text-amber-300 pointer-events-none z-10">
                        <Lock size={7.5} strokeWidth={2.5} />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </header>

        {/* ── Main Stage: Spotlight Wooden Easel & Balanced Flanks ── */}
        <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-[210px_1fr_215px] sm:grid-cols-[230px_1fr_235px] lg:grid-cols-[245px_1fr_250px] gap-3 sm:gap-4 lg:gap-5 items-center justify-center w-full max-w-[1420px] mx-auto px-3 sm:px-5 my-auto">
          
          {/* ══════════════════════════════════════════════════════
              LEFT COLUMN: Saka & Tika Mascot Cheer Stage & Grounded Grass Mound
             ══════════════════════════════════════════════════════ */}
          <aside className="w-full flex flex-col justify-end items-center h-full max-h-[72vh] pb-0 select-none overflow-visible">
            
            {/* Speech Bubble Above Mascots */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              key={speechBubbleText}
              className="relative mb-2 px-3 py-1.5 bg-[#FFFDF9] border-2 border-white border-b-3 border-b-amber-200/80 rounded-2xl shadow-md text-center max-w-[210px] pointer-events-none z-30"
            >
              <span className="font-display font-bold text-xs sm:text-sm text-[#1B4965] leading-tight block">
                {speechBubbleText}
              </span>
              {/* Speech Bubble Downward Tail */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-[#FFFDF9]" />
            </motion.div>

            {/* Saka & Tika Mascot Cutouts (Tap to Cheer with Confetti!) */}
            <div
              onClick={handleMascotTap}
              title="Ketuk Saka & Tika untuk bersorak!"
              className="relative flex items-end justify-center z-10 -mb-2 cursor-pointer group"
            >
              {/* Saka Mascot Cutout (Left) */}
              <motion.img
                src="/assets/saka-maskot-1-cutout.png"
                alt="Saka Maskot"
                animate={
                  isMascotJumping
                    ? { y: [-24, 0, -12, 0], scale: [1, 1.1, 1], rotate: [-4, 4, 0] }
                    : { y: [0, -4, 0] }
                }
                transition={
                  isMascotJumping
                    ? { duration: 0.75, ease: "easeOut" }
                    : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                }
                className="h-36 sm:h-42 lg:h-48 w-auto object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)] select-none pointer-events-none z-10 transition-transform group-hover:scale-105"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />

              {/* Tika Mascot Cutout (Right) */}
              <motion.img
                src="/assets/tika-maskot-1-cutout.png"
                alt="Tika Maskot"
                animate={
                  isMascotJumping
                    ? { y: [-26, 0, -14, 0], scale: [1, 1.1, 1], rotate: [4, -4, 0] }
                    : { y: [0, -4, 0] }
                }
                transition={
                  isMascotJumping
                    ? { duration: 0.75, delay: 0.08, ease: "easeOut" }
                    : { duration: 3.5, repeat: Infinity, delay: 0.4, ease: "easeInOut" }
                }
                className="h-36 sm:h-42 lg:h-48 w-auto object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)] select-none pointer-events-none z-10 -ml-4 transition-transform group-hover:scale-105"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </div>

            {/* Seamless 3D Lush Green Grass Hill Mound with Contact Shadows */}
            <div className="relative w-full max-w-[210px] sm:max-w-[230px] flex flex-col items-center z-20">
              {/* Soft Contact Shadows Under Mascots' Sneakers */}
              <div className="absolute -top-1 left-5 w-12 h-2.5 bg-[#064E3B]/35 rounded-full blur-[2px] pointer-events-none" />
              <div className="absolute -top-1 right-5 w-12 h-2.5 bg-[#064E3B]/35 rounded-full blur-[2px] pointer-events-none" />

              {/* 3D Mound Block */}
              <div className="w-full h-12 sm:h-14 rounded-t-[2.2rem] bg-gradient-to-b from-[#4ADE80] via-[#22C55E] to-[#15803D] shadow-lg border-t-2 border-white/60 relative overflow-hidden flex items-center justify-center">
                <div className="absolute top-0 inset-x-4 h-1.5 bg-[#86EFAC]/70 rounded-full" />
                <svg viewBox="0 0 240 60" fill="none" className="w-full h-full opacity-60 pointer-events-none">
                  <path d="M 40 20 Q 36 10 32 12 Q 37 14 42 20" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 44 22 Q 48 8 52 11 Q 48 16 46 22" stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 195 20 Q 191 10 187 13 Q 192 14 197 20" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 199 22 Q 203 9 207 12 Q 202 16 201 22" stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

          </aside>

          {/* ══════════════════════════════════════════════════════
              CENTER COLUMN: Hero Spotlight Wooden Writing Board
             ══════════════════════════════════════════════════════ */}
          <section className="flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-center relative w-full max-w-[880px] lg:max-w-[940px] xl:max-w-[980px] mx-auto">
            
            {/* Luminous Warm Radial Spotlight Glow Directly Behind the Easel */}
            <div className="absolute -inset-10 sm:-inset-16 bg-[radial-gradient(ellipse_at_50%_50%,rgba(254,243,199,0.7)_0%,rgba(251,191,36,0.25)_50%,transparent_75%)] pointer-events-none blur-xl -z-10" />

            {/* Easel Top Header: Interactive Mode Tabs (Left) & Progress Pill (Right) */}
            <div className="w-full flex items-center justify-between px-1 sm:px-2 mb-1.5 flex-shrink-0 z-20">
              
              {/* Left Group: Mode Tabs (Huruf Besar / Huruf Kecil) */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex items-center bg-white/95 backdrop-blur-md rounded-2xl p-1 border-2 border-white shadow-sm gap-1">
                  <button
                    type="button"
                    onClick={() => handleSetMode("upper")}
                    className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl font-display font-black text-xs sm:text-sm transition-all cursor-pointer ${
                      mode === "upper"
                        ? "bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    Huruf Besar (ABC)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetMode("lower")}
                    className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl font-display font-black text-xs sm:text-sm transition-all cursor-pointer ${
                      mode === "lower"
                        ? "bg-gradient-to-b from-[#10B981] to-[#059669] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    Huruf Kecil (abc)
                  </button>
                </div>
              </div>

              {/* Right Group: Clean Progress Pill (Zero Star Icons Policy) */}
              <div className="bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-2 border-amber-400 rounded-2xl px-3 sm:px-3.5 py-1 sm:py-1.5 shadow-sm flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <Pencil size={13} className="text-amber-700 stroke-[2.5]" />
                <span className="font-display font-black text-xs sm:text-sm text-amber-950">
                  Selesai: {completedPairsCount} / 26 Huruf
                </span>
              </div>
            </div>

            {/* Hero 3D Storybook Artist Easel with Honey-Oak Frame (Maximally Expanded Canvas) */}
            <div className="relative w-full h-[62vh] sm:h-[65vh] lg:h-[68vh] max-h-[580px] rounded-[2.2rem] p-2.5 sm:p-3.5 lg:p-4 bg-gradient-to-b from-[#E2A76F] via-[#B87B45] to-[#783D16] border-[10px] sm:border-[12px] lg:border-[14px] border-[#8C4E1D] border-b-[14px] sm:border-b-[16px] lg:border-b-[18px] border-b-[#4A250B] ring-4 ring-amber-300/80 shadow-[0_24px_50px_rgba(120,53,15,0.45),inset_0_2px_4px_rgba(255,255,255,0.35)] flex flex-col justify-between">
              
              {/* Top Gloss Light Reflex */}
              <div className="absolute top-1.5 inset-x-6 h-[2px] bg-white/50 rounded-full pointer-events-none" />

              {/* Wooden Stand Pegs Anchored Below */}
              <div className="absolute -bottom-5 sm:-bottom-6 left-1/4 w-4 sm:w-5 h-6 sm:h-7 bg-gradient-to-r from-[#78350F] to-[#451A03] rounded-b-lg shadow-md -z-10" />
              <div className="absolute -bottom-5 sm:-bottom-6 right-1/4 w-4 sm:w-5 h-6 sm:h-7 bg-gradient-to-r from-[#78350F] to-[#451A03] rounded-b-lg shadow-md -z-10" />

              {/* Cream Writing Surface Hosting Dual-Layer Canvas Engine */}
              <div className="flex-1 w-full h-full rounded-2xl overflow-hidden relative border-2 border-[#E2CEB5] shadow-inner bg-[#FFFDF8]">
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

            </div>

          </section>

          {/* ══════════════════════════════════════════════════════
              RIGHT COLUMN: Streamlined Object Card, Marker Color Tray & Action Dock
             ══════════════════════════════════════════════════════ */}
          <aside className="w-full flex flex-col justify-between items-center h-full max-h-[72vh] py-0.5 select-none overflow-hidden">
            
            {/* ── 1. Full-Color Object Illustration Card ── */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSpeakWord}
              aria-label={`Dengarkan contoh kata ${letterObj.word}`}
              className="w-full bg-white/95 rounded-3xl border-3 border-amber-200 shadow-xl p-2 sm:p-2.5 flex flex-col items-center justify-center cursor-pointer group transition-all"
            >
              {/* Glossy cream-white rounded square illustration frame */}
              <motion.div
                animate={
                  isObjectBouncing
                    ? { scale: [1, 1.12, 0.96, 1.03, 1], rotate: [0, -4, 4, 0] }
                    : { scale: 1, rotate: 0 }
                }
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="w-22 h-22 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-[#FFFDF9] rounded-2xl p-2 border-2 border-amber-200/90 shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform"
              >
                <WordIllustration
                  illustrationKey={letterObj.illustrationKey}
                  word={letterObj.word}
                  color={letterObj.color}
                  showBadge={false}
                  className="w-full h-full object-contain drop-shadow-xs"
                />
              </motion.div>

              {/* High-Contrast Word Title */}
              <span className="font-display font-black text-base sm:text-lg lg:text-xl text-slate-800 mt-1 leading-tight tracking-wide truncate max-w-full">
                {letterObj.word}
              </span>

              {/* Sky-Blue Audio Pill */}
              <div className="mt-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-xs flex items-center gap-1.5">
                <Volume2 size={11} className="stroke-[2.5]" />
                <span className="font-sans font-bold text-[11px] leading-tight whitespace-nowrap">
                  Ketuk untuk Dengar
                </span>
              </div>
            </motion.button>

            {/* ── 2. Interactive Crayon / Marker Ink Color Palette ── */}
            <div className="w-full flex flex-col items-center bg-white/95 backdrop-blur-md rounded-2xl border-2 border-white shadow-md p-2">
              <div className="w-full flex items-center justify-between px-1 mb-1.5">
                <span className="font-display font-bold text-xs text-[#1B4965] flex items-center gap-1">
                  <Palette size={13} className="text-amber-600 stroke-[2.5]" />
                  Warna Spidol:
                </span>
                <span className="font-sans font-black text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded uppercase">
                  {CRAYON_COLORS.find((c) => c.hex === activeInkColor)?.name || "Biru"}
                </span>
              </div>

              {/* 5 Vibrant Crayon Dot Buttons with Spring Haptic Pop */}
              <div className="w-full flex items-center justify-between gap-1">
                {CRAYON_COLORS.map((crayon, i) => {
                  const isSelectedColor = activeInkColor === crayon.hex;
                  return (
                    <motion.button
                      key={crayon.id}
                      type="button"
                      whileHover={{ scale: 1.25, y: -2 }}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => handleSelectColor(crayon.hex, i)}
                      aria-label={`Pilih warna ${crayon.name}`}
                      className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center relative cursor-pointer transition-all ${
                        isSelectedColor
                          ? "ring-4 ring-amber-400 scale-110 shadow-md z-10 -translate-y-0.5"
                          : "opacity-80 hover:opacity-100 shadow-xs hover:scale-105"
                      }`}
                      style={{ backgroundColor: crayon.hex }}
                    >
                      {isSelectedColor && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* ── 3. Tactile Action Controls (Suara & Hapus Side-by-Side) ── */}
            <div className="w-full grid grid-cols-2 gap-2">
              {/* Compact Voice Hint Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSpeakLetter}
                aria-label={`Dengarkan bunyi huruf ${currentLetterChar}`}
                className="w-full py-2 px-2.5 rounded-2xl bg-gradient-to-b from-[#38BDF8] to-[#0284C7] border-b-4 border-[#0369A1] text-white shadow-md flex items-center justify-center gap-1 cursor-pointer active:border-b-2 active:translate-y-0.5"
              >
                <Volume2 size={15} />
                <span className="font-display font-black text-xs sm:text-sm">Suara</span>
              </motion.button>

              {/* Compact Tactile Eraser Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEraserClick}
                aria-label="Hapus dan bersihkan kanvas"
                className="w-full py-2 px-2.5 rounded-2xl bg-gradient-to-b from-[#FDE047] to-[#F59E0B] border-b-4 border-[#B45309] text-[#78350F] shadow-md flex items-center justify-center gap-1 cursor-pointer active:border-b-2 active:translate-y-0.5"
              >
                <RotateCcw size={14} />
                <span className="font-display font-black text-xs sm:text-sm">Hapus</span>
              </motion.button>
            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}
