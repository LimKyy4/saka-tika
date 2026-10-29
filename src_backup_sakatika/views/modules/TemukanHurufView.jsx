// src/views/modules/TemukanHurufView.jsx
// Interactive Search-and-Find Letter Recognition mini-game for SAKA TIKA.
// Prominent Glowing Spotlight Banner inside tablet workspace.
// Strict Audio Gate: Speech and audio ONLY trigger upon explicit user click or round completion.
// Extended Success Pause: Exactly 2.2s (2200ms) holding pause before auto-advancing.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowLeft, Volume2, Sparkles, Check, ChevronRight, Lightbulb, Search, RefreshCw } from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { speakLetter, speakInstruction } from "../../utils/speechEngine.js";
import { ALPHABET_DATA } from "../../data/masterDataset.js";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";
import SakaMascot from "../../components/illustrations/SakaMascot.jsx";
import TikaMascot from "../../components/illustrations/TikaMascot.jsx";
import AmbientDecor from "../../components/illustrations/AmbientDecor.jsx";
import TactileButton from "../../components/ui/TactileButton.jsx";

// Color palette for letter bubbles
const BUBBLE_COLORS = [
  { bg: "#FEE2E2", border: "#FCA5A5", text: "#DC2626" }, // Red
  { bg: "#DBEAFE", border: "#93C5FD", text: "#2563EB" }, // Blue
  { bg: "#DCFCE7", border: "#86EFAC", text: "#16A34A" }, // Green
  { bg: "#FEF3C7", border: "#FCD34D", text: "#D97706" }, // Yellow/Amber
  { bg: "#F3E8FF", border: "#D8B4FE", text: "#9333EA" }, // Purple
  { bg: "#FCE7F3", border: "#F9A8D4", text: "#DB2777" }, // Pink
  { bg: "#CCFBF1", border: "#5EEAD4", text: "#0D9488" }, // Teal
  { bg: "#FFEDD5", border: "#FDBA74", text: "#EA580C" }, // Orange
];

export default function TemukanHurufView() {
  const { navigateTo, addStars } = useGame();
  const { playSfx } = useAudio();

  const [letterIndex, setLetterIndex] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [foundIds, setFoundIds] = useState([]);
  const [wrongId, setWrongId] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);

  // Active target letter object
  const currentTarget = useMemo(() => {
    return ALPHABET_DATA[letterIndex % ALPHABET_DATA.length];
  }, [letterIndex]);

  const targetLetter = currentTarget.letter;

  // Generate bubble field (10 bubbles total: exactly 3 target letters and 7 distractors)
  const setupRound = useCallback((target) => {
    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const distractorsPool = allLetters.filter((l) => l !== target);
    const shuffledPool = [...distractorsPool].sort(() => 0.5 - Math.random());

    const targetCount = 3; // 3 target letters to find
    const distractorCount = 7; // 7 distractors

    const items = [];
    // Target bubbles
    for (let i = 0; i < targetCount; i++) {
      const colorScheme = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
      items.push({
        id: `target-${i}`,
        letter: target,
        isTarget: true,
        color: colorScheme,
        rotation: (Math.random() - 0.5) * 12,
      });
    }

    // Distractor bubbles
    for (let i = 0; i < distractorCount; i++) {
      const dLetter = shuffledPool[i % shuffledPool.length];
      const colorScheme = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
      items.push({
        id: `distractor-${i}`,
        letter: dLetter,
        isTarget: false,
        color: colorScheme,
        rotation: (Math.random() - 0.5) * 12,
      });
    }

    // Shuffle bubble positions
    const shuffledBubbles = items.sort(() => 0.5 - Math.random());
    setBubbles(shuffledBubbles);
    setFoundIds([]);
    setWrongId(null);
    setShowHint(false);
    setRoundComplete(false);
  }, []);

  // Initialize round — STRICT ZERO AUTO-PLAY (No audio triggered on mount or round change)
  useEffect(() => {
    setupRound(targetLetter);
  }, [targetLetter, setupRound]);

  // Handle tap on a bubble (Explicit Click Interaction)
  const handleBubbleClick = (bubble) => {
    if (roundComplete) return;

    if (bubble.isTarget) {
      if (foundIds.includes(bubble.id)) return;

      const newFound = [...foundIds, bubble.id];
      setFoundIds(newFound);
      setWrongId(null);
      playSfx("success");
      speakLetter(targetLetter);

      // Check if all 3 targets are found
      if (newFound.length >= 3) {
        setRoundComplete(true);
        playSfx("fanfare");
        addStars(1);

        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6"],
        });

        speakInstruction(`Luar biasa! Semua huruf ${targetLetter} berhasil ditemukan!`);

        // EXTENDED SUCCESS PAUSE: Exactly 2.2 seconds (2200ms) before auto-advancing
        setTimeout(() => {
          handleNextRound();
        }, 2200);
      }
    } else {
      // Wrong bubble tapped
      playSfx("error");
      setWrongId(bubble.id);
      speakInstruction(`Itu huruf ${bubble.letter}. Ayo cari huruf ${targetLetter}!`);
      setTimeout(() => setWrongId(null), 700);
    }
  };

  const handleNextRound = useCallback(() => {
    setLetterIndex((prev) => (prev + 1) % ALPHABET_DATA.length);
  }, []);

  const handlePrevRound = useCallback(() => {
    setLetterIndex((prev) => (prev - 1 + ALPHABET_DATA.length) % ALPHABET_DATA.length);
  }, []);

  // Explicit user click triggers audio pronunciation
  const handleReplayTarget = () => {
    playSfx("click");
    speakInstruction(`Ayo cari huruf ${targetLetter}!`);
  };

  const handleToggleHint = () => {
    playSfx("click");
    setShowHint(true);
    speakInstruction(`Perhatikan gelembung yang bersinar!`);
  };

  return (
    <main className="relative flex-1 overflow-hidden flex px-3 sm:px-6 pb-2 gap-4 items-center justify-center select-none">
      {/* Background Ambience */}
      <AmbientDecor />

      {/* ── Left Panel: Target Details & Mascot ─────────────── */}
      <section className="relative z-10 flex-shrink-0 w-44 sm:w-56 flex flex-col gap-2.5 h-full justify-between py-2">
        <div className="flex flex-col gap-2">
          <TactileButton
            variant="secondary"
            size="sm"
            onClick={() => navigateTo("/menu")}
            ariaLabel="Kembali ke Menu"
            className="self-start"
          >
            <ArrowLeft size={16} />
            <span>Menu</span>
          </TactileButton>

          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[#1B4965] leading-tight">
              Temukan Huruf
            </h1>
            <p className="font-sans font-medium text-xs text-[#1B4965]/75 mt-0.5">
              Sentuh semua gelembung huruf yang dicari!
            </p>
          </div>

          {/* Target Spotlight Preview Card (Click to Listen) */}
          <div
            onClick={handleReplayTarget}
            className="bg-white/95 border-2 border-[#1B4965]/15 rounded-2xl p-3 shadow-md flex items-center gap-3 cursor-pointer group active:scale-95 transition-transform"
            title="Klik untuk mendengarkan huruf target"
          >
            <div
              className="w-13 h-13 rounded-2xl flex items-center justify-center font-display font-bold text-3xl shadow-sm border-2 transition-transform group-hover:scale-105"
              style={{
                backgroundColor: currentTarget.color + "20",
                borderColor: currentTarget.color,
                color: currentTarget.color,
              }}
            >
              {targetLetter}
            </div>
            <div>
              <span className="font-sans text-[10px] font-semibold text-[#1B4965]/60 uppercase tracking-wider block">
                Target Huruf:
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-display font-bold text-base text-[#1B4965]">
                  {currentTarget.word}
                </span>
                <div className="p-1 rounded-lg bg-stone-100 text-[#1B4965]">
                  <Volume2 size={13} />
                </div>
              </div>
            </div>
          </div>

          {/* Progress Tracker: 3 target letters */}
          <div className="bg-white/90 border border-stone-200 rounded-xl p-2.5 shadow-xs flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-sans font-semibold text-[#1B4965]">
              <span>Ditemukan:</span>
              <span className="font-display text-emerald-600 font-bold">
                {foundIds.length} / 3
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    i < foundIds.length
                      ? "bg-emerald-500 shadow-xs"
                      : "bg-stone-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mascot */}
        <div className="flex items-end justify-center scale-85 sm:scale-100 origin-bottom mt-auto">
          {letterIndex % 2 === 0 ? (
            <SakaMascot isWaving={roundComplete} />
          ) : (
            <TikaMascot isCheering={roundComplete} />
          )}
        </div>
      </section>

      {/* ── Right Panel: Tablet Game Area ──────────────────── */}
      <section className="relative z-10 flex-1 overflow-hidden flex items-center justify-center h-full py-1">
        <div className="h-full max-h-[520px] w-full max-w-xl bg-zinc-900 rounded-[2.2rem] p-2.5 sm:p-3.5 shadow-2xl border-4 border-zinc-800 flex flex-col">
          {/* Camera Dot */}
          <div className="w-2.5 h-2.5 bg-zinc-700 rounded-full mx-auto mb-1.5 flex-shrink-0" />

          {/* Tablet Screen Interior */}
          <div className="flex-1 overflow-hidden bg-[#FDF6EC] rounded-2xl p-3 sm:p-4 flex flex-col justify-between relative border border-stone-200">
            {/* Background Pastel Blurs */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#F26B6B]/20 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#3B82F6]/20 rounded-full blur-xl pointer-events-none" />

            {/* ── SPOTLIGHT QUESTION BANNER ─────────────────────── */}
            <div className="w-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 border-3 border-amber-400 rounded-2xl p-2 sm:p-2.5 shadow-md flex items-center justify-between z-10 flex-shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Giant Bouncing Target Badge */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  onClick={handleReplayTarget}
                  className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white border-2 flex items-center justify-center font-display font-bold text-2xl sm:text-3xl shadow-sm cursor-pointer active:scale-95 transition-transform"
                  style={{
                    borderColor: currentTarget.color,
                    color: currentTarget.color,
                  }}
                  title="Klik untuk mendengarkan huruf target"
                >
                  {targetLetter}
                </motion.div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-[10px] sm:text-xs uppercase tracking-wider text-amber-900 bg-amber-400/30 px-2 py-0.5 rounded-full">
                      CARI HURUF: {targetLetter}
                    </span>
                    <span className="font-sans font-bold text-[11px] text-amber-950/70 hidden sm:inline">
                      ({currentTarget.word})
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-sm sm:text-base text-[#1B4965] leading-tight">
                    Sentuh semua gelembung huruf <span style={{ color: currentTarget.color }}>{targetLetter}</span>!
                  </h2>
                </div>
              </div>

              {/* Controls inside Spotlight Banner */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleToggleHint}
                  disabled={showHint || roundComplete}
                  className={`p-1.5 rounded-xl border flex items-center gap-1 text-xs font-sans transition-all cursor-pointer ${
                    showHint
                      ? "bg-amber-100 border-amber-300 text-amber-700"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                  title="Tunjukkan Petunjuk"
                >
                  <Lightbulb size={14} className={showHint ? "text-amber-500" : "text-stone-400"} />
                  <span className="font-medium hidden sm:inline">Petunjuk</span>
                </button>

                <button
                  onClick={handleReplayTarget}
                  className="p-1.5 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 text-[#1B4965] shadow-xs active:scale-95 transition-transform cursor-pointer"
                  title="Dengarkan Suara Huruf"
                >
                  <Volume2 size={16} />
                </button>

                <button
                  onClick={handleNextRound}
                  className="p-1.5 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 text-[#1B4965] shadow-xs active:scale-95 transition-transform cursor-pointer"
                  title="Huruf Berikutnya"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Bubbles Pond Area (Grid of 10 dynamic bubbles: 5x2) */}
            <div className="flex-1 my-2 z-10 flex items-center justify-center">
              <div className="grid grid-cols-5 gap-2 sm:gap-3.5 w-full max-w-md place-items-center">
                {bubbles.map((b) => {
                  const isFound = foundIds.includes(b.id);
                  const isWrong = wrongId === b.id;
                  const isHinted = showHint && b.isTarget && !isFound;

                  return (
                    <motion.button
                      key={b.id}
                      disabled={isFound}
                      whileHover={!isFound ? { scale: 1.1, y: -3 } : {}}
                      whileTap={!isFound ? { scale: 0.9 } : {}}
                      animate={
                        isWrong
                          ? { x: [-6, 6, -5, 5, 0], scale: 0.95 }
                          : isHinted
                          ? { scale: [1, 1.15, 1], boxShadow: "0 0 16px rgba(245, 158, 11, 0.7)" }
                          : isFound
                          ? { scale: 1 }
                          : { y: [0, -3, 0] }
                      }
                      transition={{
                        y: { duration: 2.5 + Math.random(), repeat: Infinity, ease: "easeInOut" },
                        duration: 0.3,
                      }}
                      onClick={() => handleBubbleClick(b)}
                      style={{
                        backgroundColor: isFound ? "#10B981" : b.color.bg,
                        borderColor: isFound ? "#059669" : b.color.border,
                        color: isFound ? "#FFFFFF" : b.color.text,
                        transform: `rotate(${b.rotation}deg)`,
                      }}
                      className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full border-3 shadow-md flex items-center justify-center font-display font-bold text-2xl sm:text-3xl select-none transition-colors relative cursor-pointer active:scale-95 ${
                        isFound
                          ? "shadow-emerald-200 cursor-default"
                          : "hover:shadow-lg"
                      }`}
                    >
                      {isFound ? (
                        <Check size={26} className="text-white drop-shadow-xs" />
                      ) : (
                        b.letter
                      )}

                      {/* Gloss Highlight on top of bubble */}
                      <div className="absolute top-1 left-2 w-3.5 h-2 bg-white/50 rounded-full rotate-[-25deg] pointer-events-none" />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Celebration Message / Guidance Banner */}
            <div className="h-8 flex items-center justify-center z-10">
              <AnimatePresence mode="wait">
                {roundComplete ? (
                  <motion.div
                    key="complete"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl font-display font-bold text-xs sm:text-sm shadow-xs"
                  >
                    <Sparkles size={16} className="text-emerald-600" />
                    <span>Luar biasa! Semua huruf {targetLetter} ditemukan! (+1 Bintang)</span>
                  </motion.div>
                ) : (
                  <div className="text-stone-500 font-sans text-xs">
                    Sentuh {3 - foundIds.length} huruf <strong>{targetLetter}</strong> lagi!
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Tablet Home Bar Indicator */}
            <div className="w-16 h-1 bg-stone-300 rounded-full mx-auto mt-1 flex-shrink-0" />
          </div>
        </div>
      </section>
    </main>
  );
}
