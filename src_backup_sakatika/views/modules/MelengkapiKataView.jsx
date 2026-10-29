// src/views/modules/MelengkapiKataView.jsx
// Ultimate Studio-Grade Word Completion Mini-Game for SAKA TIKA.
// Displays master dataset object illustration, missing letter slot (e.g. B _ L A),
// and 4 chunky tactile pastel letter choice cards.
// Spotlight Question Banner: "TEBAK HURUF HILANG" with "Huruf apakah yang hilang dari kata di layar?"
// Strict Audio Gate: Zero auto-play on load; audio only triggers on explicit click or correct match.
// Strict Success Pacing: Exactly 2.2s (2200ms) holding pause before auto-advancing to the next puzzle.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Volume2,
  Sparkles,
  Check,
  ChevronRight,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  HelpCircle,
} from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { speakWord, speakInstruction } from "../../utils/speechEngine.js";
import { GAME_SAMPLES_50 } from "../../data/masterDataset.js";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";
import SakaMascot from "../../components/illustrations/SakaMascot.jsx";
import TikaMascot from "../../components/illustrations/TikaMascot.jsx";
import AmbientDecor from "../../components/illustrations/AmbientDecor.jsx";
import TactileButton from "../../components/ui/TactileButton.jsx";

// Pastel colors for the 4 choice cards
const CHOICE_COLORS = [
  { bg: "#FEE2E2", border: "#FCA5A5", text: "#DC2626" }, // Pastel Red
  { bg: "#DBEAFE", border: "#93C5FD", text: "#2563EB" }, // Pastel Blue
  { bg: "#DCFCE7", border: "#86EFAC", text: "#16A34A" }, // Pastel Green
  { bg: "#FEF3C7", border: "#FCD34D", text: "#D97706" }, // Pastel Yellow
];

// Helper to generate 3 unique random distractors
function generateDistractors(targetLetter) {
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const available = allLetters.filter((l) => l !== targetLetter.toUpperCase());
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

export default function MelengkapiKataView() {
  const { navigateTo, addStars } = useGame();
  const { playSfx } = useAudio();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongChoices, setWrongChoices] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [scoreStreak, setScoreStreak] = useState(0);

  const autoAdvanceTimer = useRef(null);

  // Current question data
  const currentItem = useMemo(() => {
    return GAME_SAMPLES_50[currentIndex % GAME_SAMPLES_50.length];
  }, [currentIndex]);

  // Word broken down into individual characters
  const wordChars = useMemo(() => {
    return currentItem.word.toUpperCase().split("");
  }, [currentItem]);

  // Determine missing letter index (pedagogically choose first letter or defined missingIndex)
  const missingIndex = useMemo(() => {
    const idx = currentItem.missingIndex ?? 0;
    return idx >= 0 && idx < wordChars.length ? idx : 0;
  }, [currentItem, wordChars.length]);

  // Target letter in uppercase
  const targetLetter = useMemo(() => {
    return wordChars[missingIndex] || currentItem.targetLetter.toUpperCase();
  }, [wordChars, missingIndex, currentItem]);

  // 4 Option cards: 1 target + 3 distractors, shuffled
  const options = useMemo(() => {
    let distractors = currentItem.distractors;
    if (!distractors || distractors.some((d) => d === "?")) {
      distractors = generateDistractors(targetLetter);
    }
    const combined = [targetLetter, ...distractors.map((d) => d.toUpperCase())];
    const uniqueOptions = [...new Set(combined)].slice(0, 4);

    // If still less than 4, pad with random letters
    while (uniqueOptions.length < 4) {
      const extra = generateDistractors(targetLetter)[0];
      if (!uniqueOptions.includes(extra)) uniqueOptions.push(extra);
    }

    return uniqueOptions.sort(() => 0.5 - Math.random());
  }, [currentItem, targetLetter]);

  // Reset state upon question change — STRICT ZERO AUTO-PLAY (No audio triggered on mount/advance)
  useEffect(() => {
    setSelectedLetter(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setWrongChoices([]);
    setShowHint(false);
    clearTimeout(autoAdvanceTimer.current);

    return () => clearTimeout(autoAdvanceTimer.current);
  }, [currentIndex, currentItem]);

  // Handle letter option tap (Explicit Click Interaction)
  const handleSelectOption = (letter) => {
    if (isAnswered) return;

    if (letter === targetLetter) {
      // Correct choice!
      setSelectedLetter(letter);
      setIsAnswered(true);
      setIsCorrect(true);
      setScoreStreak((prev) => prev + 1);

      playSfx("success");
      speakWord(currentItem.word);

      // Trigger Confetti explosion
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.58 },
        colors: ["#3B82F6", "#10B981", "#F59E0B", "#EC4899"],
      });

      // Award +1 Star
      addStars(1);

      // STRICT SUCCESS PACING: Exactly 2.2 seconds (2200ms) before auto-advancing
      autoAdvanceTimer.current = setTimeout(() => {
        handleNext();
      }, 2200);
    } else {
      // Wrong choice
      playSfx("error");
      setScoreStreak(0);
      setWrongChoices((prev) => [...prev, letter]);
      speakInstruction("Yuk coba huruf yang lain!");
    }
  };

  const handleNext = useCallback(() => {
    clearTimeout(autoAdvanceTimer.current);
    setCurrentIndex((prev) => (prev + 1) % GAME_SAMPLES_50.length);
  }, []);

  const handleResetCurrentQuestion = useCallback(() => {
    clearTimeout(autoAdvanceTimer.current);
    setSelectedLetter(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setWrongChoices([]);
  }, []);

  // Explicit user click triggers audio pronunciation
  const handleReplayAudio = () => {
    playSfx("click");
    speakWord(currentItem.word);
  };

  const handleToggleHint = () => {
    playSfx("click");
    setShowHint(true);
    speakInstruction(`Huruf yang hilang adalah ${targetLetter}`);
  };

  return (
    <main className="relative flex-1 overflow-hidden flex px-3 sm:px-6 pb-2 gap-4 items-center justify-center select-none">
      {/* Background Ambience */}
      <AmbientDecor />

      {/* ── Left Panel: Mascot & Stats ──────────────────────── */}
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
            <span className="font-sans font-bold text-[10px] text-[#1B4965]/60 uppercase tracking-widest">
              Modul 3
            </span>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[#1B4965] leading-tight">
              Melengkapi<br />Kata
            </h1>
            <p className="font-sans font-medium text-xs text-[#1B4965]/75 mt-0.5">
              Tebak dan lengkapi huruf yang hilang!
            </p>
          </div>

          {/* Speech Bubble / Mascot Encouragement */}
          <div className="bg-white/90 border-2 border-[#1B4965]/15 rounded-2xl p-2.5 shadow-sm relative max-w-xs">
            <span className="font-sans font-semibold text-xs text-[#1B4965] leading-snug block">
              {isCorrect
                ? `Hebat! Kata ${currentItem.word.toUpperCase()} berhasil dilengkapi!`
                : wrongChoices.length > 0
                ? "Tidak apa-apa, ayo pilih kartu huruf yang lain!"
                : "Klik gambar atau pilih huruf yang hilang di layar!"}
            </span>
            <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white border-r-2 border-b-2 border-[#1B4965]/15 rotate-45" />
          </div>

          {/* Streak Indicator */}
          {scoreStreak > 1 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-amber-100 border border-amber-300 rounded-xl px-2.5 py-1 flex items-center gap-1.5 self-start shadow-xs"
            >
              <Sparkles size={14} className="text-amber-600" />
              <span className="font-display font-bold text-xs text-amber-800">
                {scoreStreak} Kata Berturut-turut!
              </span>
            </motion.div>
          )}
        </div>

        {/* Mascot */}
        <div className="flex items-end justify-center scale-85 sm:scale-100 origin-bottom mt-auto">
          {currentIndex % 2 === 0 ? (
            <SakaMascot isWaving={isCorrect} />
          ) : (
            <TikaMascot isCheering={isCorrect} />
          )}
        </div>
      </section>

      {/* ── Right Panel: Tablet Game Area ──────────────────── */}
      <section className="relative z-10 flex-1 overflow-hidden flex items-center justify-center h-full py-1">
        <div className="h-full max-h-[520px] w-full max-w-xl bg-zinc-900 rounded-[2.2rem] p-2.5 sm:p-3.5 shadow-2xl border-4 border-zinc-800 flex flex-col">
          {/* Camera Dot */}
          <div className="w-2.5 h-2.5 bg-zinc-700 rounded-full mx-auto mb-1.5 flex-shrink-0" />

          {/* Tablet Screen Interior */}
          <div className="flex-1 overflow-hidden bg-[#FDF6EC] rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between relative border border-stone-200">
            {/* Corner Decorative Blur */}
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#78B894]/20 rounded-full blur-lg pointer-events-none" />
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#F9D949]/20 rounded-full blur-lg pointer-events-none" />

            {/* ── SPOTLIGHT QUESTION BANNER ─────────────────────── */}
            <div className="w-full bg-gradient-to-r from-emerald-200 via-teal-100 to-emerald-200 border-3 border-emerald-400 rounded-2xl p-2 sm:p-2.5 shadow-md flex items-center justify-between z-10 flex-shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Illustration Preview in banner (Click to Listen) */}
                <div
                  onClick={handleReplayAudio}
                  className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white border-2 border-emerald-300 p-1 flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-transform"
                  title="Klik untuk mendengarkan kata"
                >
                  <WordIllustration
                    wordKey={currentItem.illustrationKey}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-[10px] sm:text-xs uppercase tracking-wider text-emerald-900 bg-emerald-300/40 px-2 py-0.5 rounded-full">
                      TEBAK HURUF HILANG
                    </span>
                    <span className="font-sans font-bold text-[11px] text-emerald-950/70 hidden sm:inline capitalize">
                      ({currentItem.category || "Kosakata"})
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-xs sm:text-sm text-[#1B4965] leading-tight mt-0.5">
                    Huruf apakah yang hilang dari kata di layar?
                  </h2>
                </div>
              </div>

              {/* Controls in banner */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleToggleHint}
                  disabled={showHint || isAnswered}
                  className={`p-1.5 rounded-xl border flex items-center gap-1 text-xs font-sans transition-all cursor-pointer ${
                    showHint
                      ? "bg-amber-100 border-amber-300 text-amber-700"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                  title="Petunjuk Huruf"
                >
                  <Lightbulb size={14} className={showHint ? "text-amber-500" : "text-stone-400"} />
                  <span className="font-medium hidden sm:inline">Petunjuk</span>
                </button>

                <button
                  onClick={handleReplayAudio}
                  className="p-1.5 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 text-[#1B4965] shadow-xs active:scale-95 transition-transform cursor-pointer"
                  title="Dengarkan Suara Kata"
                >
                  <Volume2 size={16} />
                </button>

                <button
                  onClick={handleNext}
                  className="p-1.5 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 text-[#1B4965] shadow-xs active:scale-95 transition-transform cursor-pointer"
                  title="Lewati ke Kata Berikutnya"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* ── Central Stage: Illustration & Word Slot Display ── */}
            <div className="flex-1 flex flex-col items-center justify-center my-1 z-10 gap-2 sm:gap-3">
              {/* Central 3D Illustration Card */}
              <motion.div
                key={currentItem.id}
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="w-22 h-22 sm:w-26 sm:h-26 bg-white rounded-2xl p-2 shadow-md border-2 border-[#1B4965]/10 flex flex-col items-center justify-center relative cursor-pointer group active:scale-95 transition-transform"
                onClick={handleReplayAudio}
                title="Klik untuk mendengarkan pengucapan kata"
              >
                <div className="w-16 h-16 sm:w-18 sm:h-18">
                  <WordIllustration
                    wordKey={currentItem.illustrationKey}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="font-sans font-bold text-xs text-[#1B4965]">
                    {currentItem.word}
                  </span>
                  <Volume2 size={10} className="text-[#1B4965]/60" />
                </div>
              </motion.div>

              {/* Word Letters Slot Display with Missing Character */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {wordChars.map((char, index) => {
                  const isMissing = index === missingIndex;
                  const isFilled = isMissing && isCorrect;

                  if (isMissing) {
                    return (
                      <motion.div
                        key={index}
                        animate={
                          isFilled
                            ? { scale: [1, 1.18, 1], rotate: [0, 5, -5, 0] }
                            : { scale: [1, 1.05, 1] }
                        }
                        transition={{ duration: 0.4 }}
                        className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-3 flex items-center justify-center shadow-md font-display font-bold text-2xl sm:text-3xl transition-all relative ${
                          isFilled
                            ? "bg-emerald-500 border-emerald-600 text-white shadow-emerald-200"
                            : "bg-white border-dashed border-[#3B82F6] text-[#3B82F6] animate-pulse ring-4 ring-blue-100"
                        }`}
                      >
                        {isFilled ? targetLetter : showHint ? targetLetter : "?"}

                        {/* Completed checkmark badge */}
                        {isFilled && (
                          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                      </motion.div>
                    );
                  }

                  return (
                    <div
                      key={index}
                      className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-white border-2 border-stone-200 flex items-center justify-center shadow-xs font-display font-bold text-2xl sm:text-3xl text-[#1B4965]"
                    >
                      {char}
                    </div>
                  );
                })}
              </div>

              {/* Status Message */}
              <div className="h-4 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {isCorrect ? (
                    <motion.div
                      key="correct"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-emerald-600 font-display font-bold text-xs sm:text-sm"
                    >
                      <Check size={15} />
                      <span>Benar! Kata {currentItem.word.toUpperCase()} lengkap! (+1 Bintang)</span>
                    </motion.div>
                  ) : showHint ? (
                    <motion.div
                      key="hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-amber-700 font-sans text-xs font-medium"
                    >
                      Pilih kartu huruf <strong>{targetLetter}</strong> di bawah ya!
                    </motion.div>
                  ) : (
                    <span className="font-sans text-xs text-[#1B4965]/70 font-medium">
                      Pilih salah satu huruf di bawah untuk mengisi kotak kosong!
                    </span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── 4 Tactile Choice Cards ─────────────────────────── */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 z-10 flex-shrink-0">
              {options.map((letter, optIdx) => {
                const isWrong = wrongChoices.includes(letter);
                const isSelected = selectedLetter === letter;
                const palette = CHOICE_COLORS[optIdx % CHOICE_COLORS.length];

                return (
                  <motion.button
                    key={letter}
                    disabled={isAnswered || isWrong}
                    whileHover={!isWrong && !isAnswered ? { scale: 1.06, y: -2 } : {}}
                    whileTap={!isWrong && !isAnswered ? { scale: 0.94, y: 2 } : {}}
                    animate={isWrong ? { x: [-4, 4, -3, 3, 0] } : {}}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleSelectOption(letter)}
                    className={`h-12 sm:h-14 rounded-2xl font-display font-bold text-xl sm:text-2xl shadow-md border-b-4 transition-all flex items-center justify-center select-none cursor-pointer ${
                      isWrong
                        ? "bg-stone-200 border-stone-300 text-stone-400 opacity-50 cursor-not-allowed scale-95"
                        : isSelected && isCorrect
                        ? "bg-emerald-500 border-emerald-600 text-white shadow-emerald-200"
                        : "hover:shadow-lg active:scale-95"
                    }`}
                    style={
                      !isWrong && !(isSelected && isCorrect)
                        ? {
                            backgroundColor: palette.bg,
                            borderColor: palette.border,
                            color: palette.text,
                          }
                        : {}
                    }
                  >
                    {letter}
                  </motion.button>
                );
              })}
            </div>

            {/* Tablet Home Bar Indicator */}
            <div className="w-16 h-1 bg-stone-300 rounded-full mx-auto mt-1 flex-shrink-0" />

            {/* ── Success Celebration Modal Overlay (2.2s Pacing) ── */}
            <AnimatePresence>
              {isCorrect && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className="absolute inset-0 bg-[#FFFDF9]/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center"
                >
                  {/* Star Badge Icon */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F9D968] border-4 border-[#E3C654] rounded-3xl flex items-center justify-center mb-2 shadow-lg animate-bounce">
                    <Sparkles size={36} className="text-[#1B4965] fill-[#1B4965]" />
                  </div>

                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1B4965] mb-0.5">
                    Tebakan Benar!
                  </h3>
                  <p className="font-sans font-semibold text-sm sm:text-base text-[#1B4965]/80 mb-2 max-w-xs">
                    Kata <span className="font-bold text-[#10B981]">{currentItem.word.toUpperCase()}</span> berhasil dilengkapi!
                  </p>

                  {/* Star Reward indicator */}
                  <div className="flex items-center gap-2 bg-[#FFFDF9] border-2 border-[#F9D968] px-4 py-1.5 rounded-2xl shadow-sm mb-3">
                    <svg className="w-5 h-5 fill-[#F9D968] stroke-[#E3C654]" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="font-display font-bold text-sm text-[#1B4965]">
                      +1 Bintang Didapatkan!
                    </span>
                  </div>

                  {/* 2.2-second Auto-Advance Countdown Bar */}
                  <div className="w-48 mb-3 flex flex-col items-center gap-1">
                    <span className="font-sans text-[11px] text-[#1B4965]/70">
                      Menuju tebakan berikutnya...
                    </span>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.2, ease: "linear" }}
                        className="h-full bg-[#10B981]"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <TactileButton
                      variant="secondary"
                      size="sm"
                      onClick={handleResetCurrentQuestion}
                      ariaLabel="Mainkan Lagi Kata Ini"
                    >
                      <RotateCcw size={15} />
                      <span>Main Lagi</span>
                    </TactileButton>

                    <TactileButton
                      variant="primary"
                      size="sm"
                      onClick={handleNext}
                      ariaLabel="Lanjut ke Kata Berikutnya Sekarang"
                    >
                      <span>Lanjut Sekarang</span>
                      <ArrowRight size={16} />
                    </TactileButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
