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

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  RotateCcw,
  Check,
  Lock,
  Sparkles,
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

  // References for ribbon horizontal auto-scrolling
  const ribbonRef = useRef(null);
  const letterBtnRefs = useRef([]);

  // Active letter data
  const letterObj = ALPHABET_DATA[selectedIdx] || ALPHABET_DATA[0];
  const currentLetterChar = mode === "lower" ? letterObj.lowercase : letterObj.letter;
  const pathData = getLetterPath(currentLetterChar, mode);

  // Auto-scroll the active letter button into view ONLY when the ribbon actually overflows
  useEffect(() => {
    const ribbon = ribbonRef.current;
    const activeEl = letterBtnRefs.current[selectedIdx];
    if (ribbon && activeEl && ribbon.scrollWidth > ribbon.clientWidth) {
      const elLeft = activeEl.offsetLeft;
      const elWidth = activeEl.offsetWidth;
      const ribbonWidth = ribbon.clientWidth;
      // Center the active element safely without negative scroll
      const targetScroll = Math.max(0, elLeft - ribbonWidth / 2 + elWidth / 2);
      ribbon.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  }, [selectedIdx]);

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

  // Previous letter in ribbon
  const handlePrevLetter = useCallback(() => {
    if (selectedIdx <= 0) return;
    playSfx("hover");
    const prevIdx = selectedIdx - 1;
    setSelectedIdx(prevIdx);
    setMode("upper");
    setResetTrigger((prev) => prev + 1);
  }, [selectedIdx, playSfx]);

  // Next letter in ribbon (capped at max accessible letter index in active paired progression)
  const maxUnlockedLetterIdx = Math.min(25, Math.floor(pairedMaxStep / 2));
  const handleNextLetter = useCallback(() => {
    if (selectedIdx >= 25) return;
    if (selectedIdx < maxUnlockedLetterIdx) {
      playSfx("hover");
      const nextIdx = selectedIdx + 1;
      setSelectedIdx(nextIdx);
      setMode("upper");
      setResetTrigger((prev) => prev + 1);
    } else {
      playSfx("error");
      const lockedIdx = Math.min(25, selectedIdx + 1);
      setWobbleIdx(lockedIdx);
      setTimeout(() => setWobbleIdx(null), 500);
      const targetIdx = Math.floor(pairedMaxStep / 2);
      const targetObj = ALPHABET_DATA[targetIdx] || ALPHABET_DATA[0];
      const targetMode = pairedMaxStep % 2 === 0 ? "besar" : "kecil";
      const targetChar = pairedMaxStep % 2 === 0 ? targetObj.letter : targetObj.lowercase;
      speakInstruction(`Selesaikan huruf ${targetChar} ${targetMode} dulu ya!`);
    }
  }, [selectedIdx, maxUnlockedLetterIdx, pairedMaxStep, playSfx]);

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
    setTimeout(() => setIsMascotJumping(false), 900);

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
        
        {/* ── Top Bar: Full 26-Letter Alphabet Ribbon (A-Z) (Zero Clutter, Super Interactive) ── */}
        <header className="h-12 sm:h-14 max-h-14 flex items-center justify-center w-full flex-shrink-0 mb-1 px-1 sm:px-2 z-20">
          <div className="w-full max-w-6xl flex items-center justify-center gap-1.5 sm:gap-2">
            
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

            {/* Full 26-Letter Ribbon Container (A-Z) */}
            <div
              ref={ribbonRef}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-white/85 backdrop-blur-md rounded-2xl border-2 border-white/95 shadow-sm overflow-x-auto no-scrollbar max-w-full justify-start xl:justify-center"
            >
              {ALPHABET_DATA.map((item, idx) => {
                const isSelected = idx === selectedIdx;
                const letterStepStart = idx * 2;
                // Both upper and lower for this letter are completed!
                const isPairDone = letterStepStart + 1 < pairedMaxStep;
                // Currently active target letter in progression
                const isTarget =
                  pairedMaxStep === letterStepStart || pairedMaxStep === letterStepStart + 1;
                // Letter not yet unlocked
                const isLocked = letterStepStart > pairedMaxStep;
                const isWobbling = wobbleIdx === idx;

                // When selected and in lowercase mode, display lowercase; otherwise uppercase
                const letterDisplay = isSelected && mode === "lower" ? item.lowercase : item.letter;

                return (
                  <motion.button
                    key={item.letter}
                    ref={(el) => (letterBtnRefs.current[idx] = el)}
                    type="button"
                    animate={isWobbling ? { x: [-5, 5, -4, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={!isLocked ? { scale: 1.15, y: -2 } : {}}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleSelectLetter(idx)}
                    aria-label={`Pilih huruf ${item.letter}`}
                    className={`flex-shrink-0 w-7 h-7 sm:w-7.5 sm:h-7.5 md:w-8 md:h-8 lg:w-8.5 lg:h-8.5 rounded-xl font-display text-xs sm:text-sm md:text-base flex items-center justify-center relative select-none cursor-pointer transition-all ${
                      isSelected
                        ? "shadow-md scale-110 z-10 text-white font-black border-b-[3px] ring-2 ring-white"
                        : isTarget
                        ? "ring-2 ring-amber-400 font-black text-white scale-105 z-10 shadow-xs"
                        : isPairDone
                        ? "bg-white font-bold border-b-2 shadow-2xs hover:shadow-xs"
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
                    {letterDisplay}

                    {/* Crisp Green Checkmark Circle for Completed Pairs (Zero Star Icons Policy) */}
                    {isPairDone && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white flex items-center justify-center shadow-xs text-white pointer-events-none">
                        <Check size={9} strokeWidth={3.5} />
                      </span>
                    )}

                    {/* Padlock Badge for Locked Letters */}
                    {isLocked && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-xs text-amber-300 pointer-events-none">
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
              disabled={selectedIdx >= 25}
              aria-label="Huruf Selanjutnya"
              className={`p-0 bg-transparent border-0 outline-none flex-shrink-0 ${
                selectedIdx >= 25 ? "opacity-35 cursor-not-allowed" : "cursor-pointer"
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

        {/* ── Main Stage: Highlighted Central Easel Canvas & Responsive Flanks ── */}
        <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-[185px_1fr_205px] md:grid-cols-[200px_1fr_220px] lg:grid-cols-[215px_1fr_235px] gap-3 sm:gap-4 lg:gap-5 items-center my-auto w-full max-w-7xl mx-auto px-2 sm:px-4">
          
          {/* ══════════════════════════════════════════════════════
              LEFT COLUMN: Saka & Tika Mascot Cheer Zone (Foto 3 Card Removed)
             ══════════════════════════════════════════════════════ */}
          <aside className="w-full flex flex-col justify-end items-center h-full max-h-[84vh] pb-1 select-none overflow-visible">
            
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
                    ? { y: [-28, 0, -14, 0], scale: [1, 1.12, 1], rotate: [-5, 5, 0] }
                    : { y: [0, -3.8, 0] }
                }
                transition={
                  isMascotJumping
                    ? { duration: 0.75, ease: "easeOut" }
                    : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                }
                className="h-36 sm:h-44 lg:h-52 w-auto object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)] select-none pointer-events-none z-10 transition-transform group-hover:scale-108"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />

              {/* Tika Mascot Cutout (Right) */}
              <motion.img
                src="/assets/tika-maskot-1-cutout.png"
                alt="Tika Maskot"
                animate={
                  isMascotJumping
                    ? { y: [-30, 0, -16, 0], scale: [1, 1.12, 1], rotate: [5, -5, 0] }
                    : { y: [0, -4.2, 0] }
                }
                transition={
                  isMascotJumping
                    ? { duration: 0.75, delay: 0.08, ease: "easeOut" }
                    : { duration: 3.5, repeat: Infinity, delay: 0.4, ease: "easeInOut" }
                }
                className="h-36 sm:h-44 lg:h-52 w-auto object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)] select-none pointer-events-none z-10 -ml-4 transition-transform group-hover:scale-108"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </div>

            {/* Natural, Wide, Grounded Multi-Tone 3D Lush Green Grass Hill Mound */}
            <div className="relative w-full max-w-[210px] sm:max-w-[230px] flex flex-col items-center z-20">
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
              CENTER COLUMN: Highlighted & Enlarged 3D Storybook Artist Easel (Foto 2)
             ══════════════════════════════════════════════════════ */}
          <section className="flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-center relative w-full max-w-[760px] lg:max-w-[800px] mx-auto">
            
            {/* Luminous Sunlit Radial Spotlight Glow Behind the Easel */}
            <div className="absolute -inset-8 bg-[radial-gradient(ellipse_at_50%_50%,rgba(254,243,199,0.5)_0%,rgba(245,158,11,0)_75%)] pointer-events-none blur-md -z-10" />

            {/* Easel Header Strip: Interactive Mode Indicator (Left) & Paired Progress Pill (Right) */}
            <div className="w-full flex items-center justify-between px-1 sm:px-2 mb-2 flex-shrink-0 z-20">
              
              {/* Dynamic Child-Friendly Mode Indicator Badge */}
              <div className="flex items-center gap-2 px-3 py-1 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-white shadow-sm">
                <span
                  className={`w-6 h-6 rounded-xl flex items-center justify-center font-display font-black text-xs text-white shadow-2xs transition-colors ${
                    mode === "upper"
                      ? "bg-gradient-to-b from-[#38BDF8] to-[#0284C7]"
                      : "bg-gradient-to-b from-[#10B981] to-[#059669]"
                  }`}
                >
                  {mode === "upper" ? letterObj.letter : letterObj.lowercase}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-xs sm:text-sm text-[#1B4965]">
                    {mode === "upper"
                      ? `Huruf Besar (${letterObj.letter})`
                      : `Huruf Kecil (${letterObj.lowercase})`}
                  </span>

                  {mode === "lower" && pathData?.category && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Huruf {pathData.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Paired Step Progress Pill (Zero Stars Policy Compliant) */}
              <div className="bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-2 border-amber-400 rounded-2xl px-3 py-1 shadow-sm flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs" />
                  <span className="font-display font-black text-xs sm:text-sm text-amber-950">
                    Langkah: {Math.min(pairedMaxStep + 1, 52)} / 52
                  </span>
                </div>
                <span className="text-[10px] font-sans font-bold text-amber-800 bg-amber-200/70 px-1.5 py-0.5 rounded-md">
                  {completedPairsCount} / 26 Huruf
                </span>
              </div>
            </div>

            {/* Highlighted 3D Storybook Artist Easel with Honey-Oak Frame (Enlarged Drawing Area) */}
            <div className="relative w-full max-h-[57vh] md:max-h-[58vh] aspect-[4/3] md:aspect-[16/10.5] my-auto rounded-[2.2rem] p-3 sm:p-4 bg-gradient-to-b from-[#D99A60] via-[#B87B45] to-[#8C582B] border-[10px] sm:border-[12px] border-[#965520] ring-4 ring-amber-300/90 border-b-[14px] border-b-[#543214] shadow-[0_22px_45px_rgba(120,53,15,0.4)] flex flex-col justify-between">
              
              {/* Top Gloss Light Reflex */}
              <div className="absolute top-1.5 inset-x-6 h-[2px] bg-white/45 rounded-full pointer-events-none" />

              {/* Wooden Stand Pegs Anchored Below */}
              <div className="absolute -bottom-6 sm:-bottom-7 left-1/4 w-4 sm:w-5 h-7 sm:h-8 bg-gradient-to-r from-[#78350F] to-[#451A03] rounded-b-lg shadow-md -z-10" />
              <div className="absolute -bottom-6 sm:-bottom-7 right-1/4 w-4 sm:w-5 h-7 sm:h-8 bg-gradient-to-r from-[#78350F] to-[#451A03] rounded-b-lg shadow-md -z-10" />

              {/* Cream Writing Surface Hosting Dual-Layer Canvas Engine */}
              <div className="flex-1 w-full h-full rounded-2xl overflow-hidden relative border-2 border-[#E7D7C1] shadow-inner bg-[#FFFFFF]">
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
              RIGHT COLUMN: Symmetrical Object Card, Marker Color Tray & Action Dock
             ══════════════════════════════════════════════════════ */}
          <aside className="w-full flex flex-col justify-between items-center h-full max-h-[82vh] py-1 select-none overflow-hidden">
            
            {/* ── 1. Full-Color Object Illustration Card (Symmetrical to Left Card) ── */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSpeakWord}
              aria-label={`Dengarkan contoh kata ${letterObj.word}`}
              className="w-full bg-white/95 rounded-3xl border-3 sm:border-4 border-amber-200 shadow-xl p-2 sm:p-2.5 flex flex-col items-center justify-center cursor-pointer group transition-all"
            >
              {/* Glossy cream-white rounded square illustration frame */}
              <motion.div
                animate={
                  isObjectBouncing
                    ? { scale: [1, 1.2, 0.92, 1.1, 1], rotate: [-8, 8, -4, 4, 0] }
                    : { scale: 1, rotate: 0 }
                }
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl p-2 border-2 border-amber-200/90 shadow-inner flex items-center justify-center group-hover:scale-108 transition-transform"
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

            {/* ── 2. Interactive Crayon / Marker Ink Color Palette (TK Children Love Colors!) ── */}
            <div className="w-full flex flex-col items-center bg-white/90 backdrop-blur-md rounded-2xl border-2 border-white/95 shadow-md p-2">
              <div className="w-full flex items-center justify-between px-1 mb-1.5">
                <span className="font-display font-bold text-[11px] text-[#1B4965] flex items-center gap-1">
                  <Palette size={13} className="text-amber-600 stroke-[2.5]" />
                  Warna Spidol:
                </span>
                <span className="font-sans font-black text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md uppercase">
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
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center relative cursor-pointer transition-all ${
                        isSelectedColor
                          ? "ring-3 ring-amber-400 scale-115 shadow-md z-10 -translate-y-0.5"
                          : "opacity-80 hover:opacity-100 shadow-2xs hover:scale-105"
                      }`}
                      style={{ backgroundColor: crayon.hex }}
                    >
                      {isSelectedColor && (
                        <div className="w-2 h-2 rounded-full bg-white shadow-xs" />
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
                className="w-full py-2 px-2 rounded-xl bg-gradient-to-b from-[#38BDF8] to-[#0284C7] border-b-[3px] border-[#0369A1] text-white shadow-xs flex items-center justify-center gap-1 cursor-pointer active:border-b-0"
              >
                <Volume2 size={14} />
                <span className="font-display font-bold text-xs">Suara</span>
              </motion.button>

              {/* Compact Tactile Eraser Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEraserClick}
                aria-label="Hapus dan bersihkan kanvas"
                className="w-full py-2 px-2 rounded-xl bg-gradient-to-b from-[#FDE047] to-[#F59E0B] border-b-[3px] border-[#B45309] text-[#78350F] shadow-xs flex items-center justify-center gap-1 cursor-pointer active:border-b-0"
              >
                <RotateCcw size={13} />
                <span className="font-display font-bold text-xs">Hapus</span>
              </motion.button>
            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}
