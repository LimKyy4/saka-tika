// src/views/modules/MenulisHurufView.jsx
// SAKA TIKA: "Menulis Huruf" Clutter-Free Hero Wooden Board, Bottom Suara/Hapus Bar,
// and "HORE! KAMU HEBAT!" Celebration Finale.
// STRICT ZERO SCROLLBAR APP LOCK: h-screen w-screen overflow-hidden select-none.
// STRICT ZERO EMOJIS & ZERO STAR ICONS POLICY: Only lucide-react icons (no Star) and custom vectors.

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  RotateCcw,
  Check,
  Lock,
  Play,
} from "lucide-react";

import { useAudio } from "../../context/AudioContext.jsx";
import { ALPHABET_DATA } from "../../data/masterDataset.js";
import { speakInstruction } from "../../utils/speechEngine.js";
import LetterCanvas from "../../components/canvas/LetterCanvas.jsx";

const DEFAULT_INK_COLOR = "#2563EB";

export default function MenulisHurufView() {
  const { playSfx } = useAudio();

  // 52-Step Paired Progression State (Stored in localStorage)
  const [pairedMaxStep, setPairedMaxStep] = useState(() => {
    try {
      const stored = localStorage.getItem("saka_tika_menulis_paired_step");
      if (stored !== null) {
        const val = parseInt(stored, 10);
        return isNaN(val) ? 0 : Math.min(52, Math.max(0, val));
      }
      const storedUpper = localStorage.getItem("saka_tika_menulis_upper_unlocked");
      if (storedUpper !== null) {
        const uVal = parseInt(storedUpper, 10) || 0;
        return Math.min(52, uVal * 2);
      }
    } catch {
      // fallback
    }
    return 0;
  });

  const initialStep = Math.min(51, pairedMaxStep);
  const initialIdx = Math.floor(initialStep / 2);
  const initialMode = initialStep % 2 === 0 ? "upper" : "lower";

  const [selectedIdx, setSelectedIdx] = useState(initialIdx);
  const [mode, setMode] = useState(initialMode);
  const [wobbleIdx, setWobbleIdx] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isMascotJumping, setIsMascotJumping] = useState(false);
  const [completionCheer, setCompletionCheer] = useState(null);

  // Grand celebration overlay state after 1.8s completed-ink hold
  const [celebrationLetter, setCelebrationLetter] = useState(null);
  const autoAdvanceTimerRef = useRef(null);

  const letterObj = ALPHABET_DATA[selectedIdx] || ALPHABET_DATA[0];
  const currentLetterChar = mode === "lower" ? letterObj.lowercase : letterObj.letter;

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  const handleSetMode = (newMode) => {
    if (mode === newMode) return;
    playSfx("click");
    setMode(newMode);
    setResetTrigger((prev) => prev + 1);
    const char = newMode === "lower" ? letterObj.lowercase : letterObj.letter;
    const label = newMode === "lower" ? "kecil" : "besar";
    speakInstruction(`Huruf ${char} ${label}.`);
  };

  const speechBubbleText = useMemo(() => {
    if (completionCheer) return completionCheer;
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

  const handleMascotTap = () => {
    playSfx("hover");
    setIsMascotJumping(true);
    setTimeout(() => setIsMascotJumping(false), 800);

    confetti({
      particleCount: 36,
      spread: 60,
      origin: { x: 0.16, y: 0.72 },
      colors: ["#F59E0B", "#10B981", "#38BDF8", "#EC4899", "#8B5CF6"],
    });

    const randomCheer = mascotCheers[Math.floor(Math.random() * mascotCheers.length)];
    speakInstruction(randomCheer);
  };

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

  const handleSpeakLetter = () => {
    playSfx("click");
    const char = mode === "lower" ? letterObj.lowercase : letterObj.letter;
    const modeLabel = mode === "lower" ? "kecil" : "besar";
    speakInstruction(`Huruf ${char} ${modeLabel}, bunyinya '${letterObj.phonetic}'!`);
  };

  const handleEraserClick = () => {
    playSfx("click");
    setResetTrigger((prev) => prev + 1);
    speakInstruction("Kanvas sudah bersih, ayo mulai lagi!");
  };

  const handleLetterCompleted = useCallback(() => {
    setIsMascotJumping(true);
    setCompletionCheer("Hore! Tulisanmu rapi sekali!");
    setTimeout(() => {
      setIsMascotJumping(false);
      setCompletionCheer(null);
    }, 2000);

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

  const handleStrokeCompleted = useCallback(() => {
    setIsMascotJumping(true);
    setCompletionCheer("Bagus sekali! Teruskan garisnya!");
    setTimeout(() => {
      setIsMascotJumping(false);
      setCompletionCheer(null);
    }, 1100);
  }, []);

  const advanceToNextLetter = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setCelebrationLetter(null);

    if (mode === "upper") {
      setMode("lower");
      setResetTrigger((prev) => prev + 1);
      const char = letterObj.lowercase;
      speakInstruction(`Hebat! Sekarang tulis huruf ${char} kecil ya!`);
    } else if (selectedIdx < 25) {
      const nextIdx = selectedIdx + 1;
      setSelectedIdx(nextIdx);
      setMode("upper");
      setResetTrigger((prev) => prev + 1);
      const nextChar = ALPHABET_DATA[nextIdx].letter;
      speakInstruction(`Luar biasa! Sekarang lanjut ke huruf ${nextChar} besar!`);
    } else {
      setResetTrigger((prev) => prev + 1);
      speakInstruction("Hore! Kamu hebat sekali sudah menulis semua huruf A sampai Z!");
    }
  }, [mode, selectedIdx, letterObj]);

  // Invoked by LetterCanvas immediately after the 1.8s completed-ink hold
  const handleTriggerCelebration = useCallback(
    (completedChar) => {
      playSfx("fanfare");
      playSfx("success");

      confetti({
        particleCount: 85,
        angle: 60,
        spread: 70,
        origin: { x: 0.18, y: 0.6 },
        colors: ["#F59E0B", "#2563EB", "#10B981", "#EF4444", "#EC4899"],
      });
      confetti({
        particleCount: 85,
        angle: 120,
        spread: 70,
        origin: { x: 0.82, y: 0.6 },
        colors: ["#F59E0B", "#2563EB", "#10B981", "#EF4444", "#EC4899"],
      });
      confetti({
        particleCount: 100,
        spread: 95,
        origin: { y: 0.45 },
        colors: ["#FDE047", "#F59E0B", "#38BDF8", "#34D399", "#F43F5E"],
      });

      setCelebrationLetter(completedChar);

      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
      autoAdvanceTimerRef.current = setTimeout(() => {
        advanceToNextLetter();
      }, 2200);
    },
    [playSfx, advanceToNextLetter]
  );

  // Gentle floating golden-cream workshop light motes (zero Star icons)
  const ambientDots = useMemo(
    () => [
      { top: "10%", left: "10%", size: 10, color: "#FFFBEB", delay: 0, dur: 3.4 },
      { top: "18%", left: "21%", size: 7, color: "#FDE68A", delay: 0.8, dur: 4.1 },
      { top: "28%", left: "7%", size: 12, color: "#FEF3C7", delay: 1.4, dur: 3.8 },
      { top: "54%", left: "14%", size: 8, color: "#7DD3FC", delay: 0.5, dur: 4.3 },
      { top: "12%", left: "80%", size: 10, color: "#FFFBEB", delay: 1.1, dur: 3.6 },
      { top: "20%", left: "91%", size: 8, color: "#7DD3FC", delay: 0.4, dur: 4.0 },
      { top: "36%", left: "94%", size: 11, color: "#FDE68A", delay: 1.7, dur: 3.9 },
      { top: "62%", left: "91%", size: 9, color: "#FEF3C7", delay: 0.9, dur: 4.2 },
      { top: "74%", left: "86%", size: 7, color: "#FDE68A", delay: 1.3, dur: 3.5 },
      { top: "76%", left: "24%", size: 8, color: "#FFFBEB", delay: 0.2, dur: 4.4 },
    ],
    []
  );

  return (
    <main className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none px-2 sm:px-4 py-2">
      {/* Golden-Honey & Caramel Amber Workshop Backdrop */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: "linear-gradient(180deg, #F59E0B 0%, #E68A00 35%, #D97706 70%, #B45309 100%)",
          }}
        />
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse at 55% 50%, rgba(254, 243, 199, 0.58) 0%, rgba(251, 191, 36, 0.22) 42%, rgba(245, 158, 11, 0) 72%)",
          }}
        />
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(120, 53, 15, 0.3) 100%)",
          }}
        />

        {ambientDots.map((dot, idx) => (
          <motion.div
            key={idx}
            className="absolute rounded-full pointer-events-none"
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              backgroundColor: dot.color,
              boxShadow: `0 0 10px ${dot.color}`,
            }}
            animate={{
              y: [0, -16, 0],
              opacity: [0.22, 0.82, 0.22],
              scale: [0.85, 1.22, 0.85],
            }}
            transition={{
              duration: dot.dur,
              repeat: Infinity,
              delay: dot.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Top-Left Playful Pencil Silhouette Accent */}
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, -8, 0], rotate: [-14, -10, -14] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:block absolute top-18 left-5 w-14 h-14 opacity-45 pointer-events-none"
        >
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-sm">
            <rect x="22" y="10" width="20" height="36" rx="6" fill="#FDE68A" stroke="#78350F" strokeWidth="2.5" />
            <rect x="22" y="10" width="20" height="8" rx="3" fill="#FDA4AF" stroke="#78350F" strokeWidth="2.5" />
            <path d="M22 44 L32 57 L42 44 Z" fill="#FFFBEB" stroke="#78350F" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="32" cy="54" r="2.2" fill="#78350F" />
          </svg>
        </motion.div>

        {/* Top-Right Playful Paint Palette Ornament */}
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, 8, 0], rotate: [10, 15, 10] }}
          transition={{ duration: 5.0, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:block absolute top-20 right-6 w-16 h-16 opacity-45 pointer-events-none"
        >
          <svg viewBox="0 0 72 72" fill="none" className="w-full h-full drop-shadow-sm">
            <path
              d="M36 10 C20 10 10 22 10 36 C10 51 22 61 36 61 C44 61 48 56 46 50 C45 47 47 44 51 44 C58 44 62 39 62 33 C62 19 50 10 36 10 Z"
              fill="#FFFDF5"
              stroke="#78350F"
              strokeWidth="2.5"
            />
            <circle cx="24" cy="27" r="4.2" fill="#EF4444" />
            <circle cx="38" cy="22" r="4.2" fill="#3B82F6" />
            <circle cx="50" cy="29" r="4.2" fill="#10B981" />
            <circle cx="24" cy="43" r="4.2" fill="#F59E0B" />
            <circle cx="36" cy="51" r="3.8" fill="#B45309" opacity="0.25" />
          </svg>
        </motion.div>

        {/* Layered Warm Ochre Hills along Bottom Edge */}
        <div className="absolute bottom-0 inset-x-0 h-36 overflow-hidden pointer-events-none opacity-35">
          <svg viewBox="0 0 1440 200" fill="none" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 80 Q360 20 720 70 T1440 40 L1440 200 L0 200 Z" fill="#92400E" />
            <path d="M0 110 Q400 60 800 100 T1440 80 L1440 200 L0 200 Z" fill="#78350F" />
          </svg>
        </div>
      </div>

      <div className="fixed inset-0 bg-[#000000]/10 pointer-events-none z-0" />

      {/* Main Workspace Container */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col justify-between w-full mx-auto">
        {/* Top HUD Row: 2-Row x 13-Column Compact Alphabet Tray (A-M & N-Z) */}
        <header className="w-full flex-shrink-0 pt-0.5 sm:pt-1 pb-1 px-20 sm:px-28 lg:px-32 flex items-center justify-center z-30 pointer-events-none">
          <div className="w-fit mx-auto bg-[#FFFDF9]/95 border-2 border-amber-200 border-b-4 border-b-amber-300/80 rounded-2xl px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-md pointer-events-auto">
            <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1 sm:gap-1.5 justify-items-center">
              {ALPHABET_DATA.map((item, idx) => {
                const isSelected = idx === selectedIdx;
                const letterStepStart = idx * 2;
                const isPairDone = letterStepStart + 1 < pairedMaxStep;
                const isTarget =
                  pairedMaxStep === letterStepStart || pairedMaxStep === letterStepStart + 1;
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
                        ? "bg-sky-700 border-2 border-white text-white shadow-md scale-105 ring-2 ring-sky-300 font-black z-10"
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

                    {isPairDone && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white flex items-center justify-center shadow-xs text-white pointer-events-none z-10">
                        <Check size={8} strokeWidth={3.5} />
                      </span>
                    )}

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

        {/* Main 2-Column Stage: Grounded Left Mascots + Expanded Hero Wooden Writing Board */}
        <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-[210px_1fr] sm:grid-cols-[240px_1fr] lg:grid-cols-[270px_1fr] gap-4 sm:gap-6 items-center justify-center w-full max-w-[1380px] mx-auto px-3 sm:px-6 my-auto">
          {/* LEFT COLUMN: Grounded Saka & Tika Mascot Stage */}
          <aside className="w-full flex flex-col justify-end items-center h-full max-h-[72vh] pb-1 select-none overflow-visible">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              key={speechBubbleText}
              className="relative mb-2 px-3.5 py-1.5 bg-[#FFFDF9] border-2 border-white border-b-3 border-b-amber-200/80 rounded-2xl shadow-md text-center max-w-[225px] pointer-events-none z-30"
            >
              <span className="font-display font-bold text-xs sm:text-sm text-[#1B4965] leading-tight block">
                {speechBubbleText}
              </span>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-[#FFFDF9]" />
            </motion.div>

            <div
              onClick={handleMascotTap}
              title="Ketuk Saka & Tika untuk bersorak!"
              className="relative flex items-end justify-center z-10 -mb-2 cursor-pointer group"
            >
              <motion.img
                src="/assets/saka-maskot-1-cutout.png"
                alt="Saka Maskot"
                draggable="false"
                animate={
                  isMascotJumping
                    ? { y: [-24, 0, -14, 0], scale: [1, 1.1, 1], rotate: [-4, 4, 0] }
                    : { y: [0, -5, 0], rotate: [-1.2, 1.2, -1.2] }
                }
                transition={
                  isMascotJumping
                    ? { duration: 0.72, ease: "easeOut" }
                    : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                }
                className="h-36 sm:h-42 lg:h-48 w-auto object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)] select-none pointer-events-none z-10 transition-transform group-hover:scale-105"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />

              <motion.img
                src="/assets/icon-tika-utama.png"
                alt="Tika Maskot"
                draggable="false"
                animate={
                  isMascotJumping
                    ? { y: [-26, 0, -16, 0], scale: [1, 1.1, 1], rotate: [4, -4, 0] }
                    : { y: [0, -5, 0], rotate: [1.2, -1.2, 1.2] }
                }
                transition={
                  isMascotJumping
                    ? { duration: 0.72, delay: 0.08, ease: "easeOut" }
                    : { duration: 3.6, repeat: Infinity, delay: 0.45, ease: "easeInOut" }
                }
                className="h-36 sm:h-42 lg:h-48 w-auto object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)] select-none pointer-events-none z-10 -ml-4 transition-transform group-hover:scale-105"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </div>

            <div className="relative w-full max-w-[220px] sm:max-w-[245px] flex flex-col items-center z-20">
              <div className="absolute -top-1 left-6 w-12 h-2.5 bg-[#064E3B]/35 rounded-full blur-[2px] pointer-events-none" />
              <div className="absolute -top-1 right-6 w-12 h-2.5 bg-[#064E3B]/35 rounded-full blur-[2px] pointer-events-none" />

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

          {/* CENTER-RIGHT COLUMN: Hero Enlarged Wooden Board & Bottom Action Bar */}
          <section className="flex-1 min-h-0 flex flex-col items-center justify-center relative w-full mx-auto">
            {/* Breathing Warm Golden-White Radial Spotlight Glow Behind Wooden Easel */}
            <motion.div
              aria-hidden="true"
              animate={{ opacity: [0.7, 1, 0.7], scale: [0.98, 1.03, 0.98] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-10 sm:-inset-14 bg-[radial-gradient(ellipse_at_50%_48%,rgba(255,253,240,0.84)_0%,rgba(254,243,199,0.44)_45%,transparent_75%)] pointer-events-none blur-xl -z-10"
            />

            {/* Top-Left Mode Tabs Only (Selesai pill completely removed) */}
            <div className="w-[64vw] max-w-[940px] flex items-center justify-start px-1 mb-2 flex-shrink-0 z-20">
              <div className="flex items-center bg-white/95 backdrop-blur-md rounded-2xl p-1 border-2 border-white shadow-sm gap-1">
                <button
                  type="button"
                  onClick={() => handleSetMode("upper")}
                  className={`px-3.5 sm:px-5 py-1.5 rounded-xl font-display font-black text-xs sm:text-sm transition-all cursor-pointer ${
                    mode === "upper"
                      ? "bg-gradient-to-b from-[#0369A1] to-[#075985] text-white shadow-xs"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Huruf Besar (ABC)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetMode("lower")}
                  className={`px-3.5 sm:px-5 py-1.5 rounded-xl font-display font-black text-xs sm:text-sm transition-all cursor-pointer ${
                    mode === "lower"
                      ? "bg-gradient-to-b from-[#047857] to-[#065F46] text-white shadow-xs"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Huruf Kecil (abc)
                </button>
              </div>
            </div>

            {/* Enlarged Multi-Layered 3D Oak/Walnut Wooden Writing Board (Papan Tulis Kayu) */}
            <div className="relative w-[64vw] max-w-[940px] h-[56vh] min-h-[360px] max-h-[480px] bg-gradient-to-b from-[#B47844] via-[#9C6231] to-[#7C4A21] border-4 border-[#D9A066] rounded-[2rem] p-3.5 md:p-4 shadow-[0_18px_0_rgba(101,56,18,0.45),0_26px_45px_rgba(0,0,0,0.25)] flex flex-col justify-between">
              {/* Subtle Woodgrain Texture Lines on Frame */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[1.85rem] opacity-20 overflow-hidden"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(69,26,3,0.35) 29px, transparent 31px)",
                }}
              />
              {/* Top Gloss Highlight */}
              <div
                aria-hidden="true"
                className="absolute top-1.5 inset-x-8 h-[2px] bg-[#FDE68A]/55 rounded-full pointer-events-none"
              />

              {/* Crisp Inner Recessed Cream Paper */}
              <div className="relative z-10 flex-1 min-h-0 w-full rounded-[1.35rem] overflow-hidden border-2 border-[#E7D4BC] shadow-inner bg-[#FFFDF9]">
                <LetterCanvas
                  letterObj={letterObj}
                  mode={mode}
                  activeColor={DEFAULT_INK_COLOR}
                  onNextLetter={handleTriggerCelebration}
                  onStrokeCompleted={handleStrokeCompleted}
                  onLetterCompleted={handleLetterCompleted}
                  resetTrigger={resetTrigger}
                />
              </div>

              {/* Raised 3D Wooden Chalk/Marker Ledge Along Bottom Rim */}
              <div
                aria-hidden="true"
                className="relative z-10 mx-auto w-[92%] h-2.5 sm:h-3 mt-2 rounded-full bg-gradient-to-b from-[#D9A066] via-[#A96B37] to-[#6B3B16] border-t border-[#FDE68A]/60 shadow-[0_4px_6px_rgba(69,26,3,0.45)]"
              />
            </div>

            {/* Clean Centered Horizontal Action Bar Directly Beneath Bottom Wooden Frame */}
            <div className="flex items-center justify-center gap-4 mt-4 flex-shrink-0 z-20">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, y: 2 }}
                transition={{ type: "spring", stiffness: 450, damping: 16 }}
                onClick={handleSpeakLetter}
                aria-label={`Dengarkan bunyi huruf ${currentLetterChar}`}
                className="px-7 py-2.5 rounded-2xl bg-gradient-to-b from-[#0369A1] to-[#075985] border-2 border-white border-b-[5px] border-b-[#075985] text-white font-display font-extrabold text-base shadow-md flex items-center gap-2.5 cursor-pointer hover:-translate-y-0.5 hover:brightness-105 active:border-b-2 active:translate-y-1 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
              >
                <Volume2 size={20} aria-hidden="true" className="stroke-[2.5]" />
                <span>Suara</span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, y: 2 }}
                transition={{ type: "spring", stiffness: 450, damping: 16 }}
                onClick={handleEraserClick}
                aria-label="Hapus dan bersihkan papan tulis"
                className="px-7 py-2.5 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-400 border-2 border-white border-b-[5px] border-b-amber-600 text-slate-900 font-display font-extrabold text-base shadow-md flex items-center gap-2.5 cursor-pointer hover:-translate-y-0.5 hover:brightness-105 active:border-b-2 active:translate-y-1 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
              >
                <RotateCcw size={19} aria-hidden="true" className="stroke-[2.6]" />
                <span>Hapus</span>
              </motion.button>
            </div>
          </section>
        </div>
      </div>

      {/* Grand Celebration Finale Overlay ("HORE! KAMU HEBAT!", Zero Stars & Zero Emojis) */}
      <AnimatePresence>
        {celebrationLetter && (
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
              className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-6 max-w-md w-full bg-[#FFFDF9] rounded-[2rem] border-4 border-amber-300 border-b-8 border-b-amber-500 shadow-[0_20px_50px_rgba(15,23,42,0.35)] ring-8 ring-amber-400/40"
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
                    <linearGradient id="menulisCrackerRed" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="50%" stopColor="#DC2626" />
                      <stop offset="100%" stopColor="#991B1B" />
                    </linearGradient>
                    <linearGradient id="menulisCrackerGold" x1="0" y1="0" x2="1" y2="1">
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
                    <rect x="52" y="28" width="16" height="64" rx="4" fill="url(#menulisCrackerRed)" stroke="#7F1D1D" strokeWidth="1.5" />
                    <rect x="52" y="34" width="16" height="8" fill="url(#menulisCrackerGold)" />
                    <rect x="52" y="78" width="16" height="8" fill="url(#menulisCrackerGold)" />
                    <path d="M 60 28 Q 60 18 68 14" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <circle cx="68" cy="14" r="3" fill="#FEF08A" />
                  </g>

                  <g transform="translate(60, 60) rotate(25) translate(-60, -60)">
                    <rect x="52" y="28" width="16" height="64" rx="4" fill="url(#menulisCrackerRed)" stroke="#7F1D1D" strokeWidth="1.5" />
                    <rect x="52" y="34" width="16" height="8" fill="url(#menulisCrackerGold)" />
                    <rect x="52" y="78" width="16" height="8" fill="url(#menulisCrackerGold)" />
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
                Kamu Berhasil Menulis Huruf{" "}
                <span className="font-display font-black text-xl text-blue-700 px-0.5">
                  {celebrationLetter}
                </span>{" "}
                dengan Rapi!
              </p>

              <motion.button
                type="button"
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95, y: 1 }}
                onClick={() => {
                  playSfx("click");
                  advanceToNextLetter();
                }}
                className="mt-5 px-6 py-3 rounded-2xl bg-gradient-to-b from-[#B45309] to-[#9A3412] border-2 border-white border-b-6 border-b-[#7C2D12] text-white font-display font-black text-base sm:text-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play size={18} aria-hidden="true" className="fill-white" />
                <span>LANJUT HURUF BARU!</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
