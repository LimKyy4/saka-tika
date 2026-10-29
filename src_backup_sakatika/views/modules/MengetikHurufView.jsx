// src/views/modules/MengetikHurufView.jsx
// Ultimate Studio-Grade Word Typing Practice Mini-Game for SAKA TIKA.
// Displays master dataset object illustration, sequential dynamic letter outline boxes (e.g. B O L A),
// and a colorful tactile on-screen virtual keyboard with full physical keyboard listener.
// Spotlight Header Banner: "LATIHAN KETIK HURUF" with "Ketik huruf yang sesuai dengan gambar!"
// Strict Audio Gate: Zero auto-play on load; audio only triggers on explicit click or correct match.
// Strict Success Pacing: Exactly 2.2s (2200ms) holding pause before auto-advancing to the next word.
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
  Keyboard as KeyboardIcon,
  Lightbulb,
  ArrowRight,
  RotateCcw,
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

// Standard kid-friendly QWERTY layout with distinct pastel themes per row
const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export default function MengetikHurufView() {
  const { navigateTo, addStars } = useGame();
  const { playSfx } = useAudio();

  const [wordIndex, setWordIndex] = useState(0);
  const [activeCharIndex, setActiveCharIndex] = useState(0);
  const [isWordComplete, setIsWordComplete] = useState(false);
  const [activePressedKey, setActivePressedKey] = useState(null);
  const [wrongKey, setWrongKey] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [scoreStreak, setScoreStreak] = useState(0);

  const autoAdvanceTimer = useRef(null);

  const currentItem = useMemo(() => {
    return GAME_SAMPLES_50[wordIndex % GAME_SAMPLES_50.length];
  }, [wordIndex]);

  const wordChars = useMemo(() => {
    return currentItem.word.toUpperCase().split("");
  }, [currentItem]);

  const expectedChar = useMemo(() => {
    return wordChars[activeCharIndex] || "";
  }, [wordChars, activeCharIndex]);

  // Reset state on word change — STRICT ZERO AUTO-PLAY (No audio triggered on mount/advance)
  useEffect(() => {
    setActiveCharIndex(0);
    setIsWordComplete(false);
    setWrongKey(null);
    setShowHint(false);
    clearTimeout(autoAdvanceTimer.current);

    return () => clearTimeout(autoAdvanceTimer.current);
  }, [wordIndex, currentItem]);

  // Handle typing key (both virtual on-screen keyboard and physical keyboard)
  const handleKeyPress = useCallback(
    (keyChar) => {
      if (isWordComplete) return;
      const upperKey = keyChar.toUpperCase();

      setActivePressedKey(upperKey);
      setTimeout(() => setActivePressedKey(null), 220);

      if (upperKey === expectedChar) {
        // Correct letter typed!
        setWrongKey(null);

        if (activeCharIndex + 1 < wordChars.length) {
          // Advance to next letter in word
          playSfx("click");
          setActiveCharIndex((prev) => prev + 1);
        } else {
          // Entire word completed!
          setIsWordComplete(true);
          setActiveCharIndex(wordChars.length);
          setScoreStreak((prev) => prev + 1);

          playSfx("success");
          playSfx("fanfare");
          speakWord(currentItem.word);

          confetti({
            particleCount: 70,
            spread: 75,
            origin: { y: 0.58 },
            colors: ["#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6"],
          });

          addStars(1);

          // STRICT SUCCESS PACING: Exactly 2.2 seconds (2200ms) before auto-advancing
          autoAdvanceTimer.current = setTimeout(() => {
            setWordIndex((prev) => (prev + 1) % GAME_SAMPLES_50.length);
          }, 2200);
        }
      } else {
        // Wrong key typed
        playSfx("error");
        setWrongKey(upperKey);
        speakInstruction(`Itu huruf ${upperKey}. Cari tombol ${expectedChar}!`);
        setTimeout(() => setWrongKey(null), 650);
      }
    },
    [isWordComplete, expectedChar, activeCharIndex, wordChars.length, currentItem, playSfx, addStars]
  );

  // Listen to physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Capture single alphabet keys A-Z
      if (e.key && e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  const handleNextWord = useCallback(() => {
    clearTimeout(autoAdvanceTimer.current);
    setWordIndex((prev) => (prev + 1) % GAME_SAMPLES_50.length);
  }, []);

  const handleResetCurrentWord = useCallback(() => {
    clearTimeout(autoAdvanceTimer.current);
    setActiveCharIndex(0);
    setIsWordComplete(false);
    setWrongKey(null);
  }, []);

  // Explicit user click triggers audio pronunciation
  const handleReplayWord = () => {
    playSfx("click");
    speakWord(currentItem.word);
  };

  const handleToggleHint = () => {
    playSfx("click");
    setShowHint(true);
    speakInstruction(`Tombol ${expectedChar} sedang bersinar!`);
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
              Modul 5
            </span>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[#1B4965] leading-tight">
              Mengetik<br />Huruf
            </h1>
            <p className="font-sans font-medium text-xs text-[#1B4965]/75 mt-0.5">
              Latihan mengetik kata lengkap dengan papan ketik!
            </p>
          </div>

          {/* Speech Bubble / Mascot Encouragement */}
          <div className="bg-white/90 border-2 border-[#1B4965]/15 rounded-2xl p-2.5 shadow-sm relative max-w-xs">
            <span className="font-sans font-semibold text-xs text-[#1B4965] leading-snug block">
              {isWordComplete
                ? `Hebat! Kata ${currentItem.word.toUpperCase()} berhasil diselesaikan!`
                : wrongKey
                ? `Itu tombol ${wrongKey}. Ayo cari tombol ${expectedChar}!`
                : `Tekan huruf ${expectedChar} pada keyboard untuk kata ${currentItem.word}!`}
            </span>
            <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white border-r-2 border-b-2 border-[#1B4965]/15 rotate-45" />
          </div>

          {/* Streak Indicator */}
          {scoreStreak > 1 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-purple-100 border border-purple-300 rounded-xl px-2.5 py-1 flex items-center gap-1.5 self-start shadow-xs"
            >
              <Sparkles size={14} className="text-purple-600" />
              <span className="font-display font-bold text-xs text-purple-800">
                {scoreStreak} Kata Berturut-turut!
              </span>
            </motion.div>
          )}
        </div>

        {/* Mascot */}
        <div className="flex items-end justify-center scale-85 sm:scale-100 origin-bottom mt-auto">
          {wordIndex % 2 === 0 ? (
            <SakaMascot isWaving={isWordComplete} />
          ) : (
            <TikaMascot isCheering={isWordComplete} />
          )}
        </div>
      </section>

      {/* ── Right Panel: Tablet Frame & Typing Game ─────────── */}
      <section className="relative z-10 flex-1 overflow-hidden flex items-center justify-center h-full py-1">
        <div className="h-full max-h-[520px] w-full max-w-xl bg-zinc-900 rounded-[2.2rem] p-2.5 sm:p-3.5 shadow-2xl border-4 border-zinc-800 flex flex-col">
          {/* Camera Dot */}
          <div className="w-2.5 h-2.5 bg-zinc-700 rounded-full mx-auto mb-1.5 flex-shrink-0" />

          {/* Tablet Screen Interior */}
          <div className="flex-1 overflow-hidden bg-[#FDF6EC] rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between relative border border-stone-200">
            {/* Background Pastel Blurs */}
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#F7A8A8]/20 rounded-full blur-lg pointer-events-none" />
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#3B82F6]/20 rounded-full blur-lg pointer-events-none" />

            {/* ── SPOTLIGHT HEADER BANNER ─────────────────────── */}
            <div className="w-full bg-gradient-to-r from-sky-200 via-indigo-100 to-sky-200 border-3 border-sky-400 rounded-2xl p-2 sm:p-2.5 shadow-md flex items-center justify-between z-10 flex-shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Illustration Preview inside banner (Click to Listen) */}
                <div
                  onClick={handleReplayWord}
                  className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white border-2 border-sky-300 p-1 flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-transform"
                  title="Klik untuk mendengarkan kata"
                >
                  <WordIllustration
                    wordKey={currentItem.illustrationKey}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-[10px] sm:text-xs uppercase tracking-wider text-sky-900 bg-sky-300/40 px-2 py-0.5 rounded-full">
                      LATIHAN KETIK HURUF
                    </span>
                    <span className="font-sans font-bold text-[11px] text-sky-950/70 hidden sm:inline capitalize">
                      ({currentItem.word.toUpperCase()})
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-xs sm:text-sm text-[#1B4965] leading-tight mt-0.5">
                    Ketik huruf yang sesuai dengan gambar!
                  </h2>
                </div>
              </div>

              {/* Toolbar controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleToggleHint}
                  disabled={showHint || isWordComplete}
                  className={`p-1.5 rounded-xl border flex items-center gap-1 text-xs font-sans transition-all cursor-pointer ${
                    showHint
                      ? "bg-amber-100 border-amber-300 text-amber-700"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                  title="Sorot Tombol"
                >
                  <Lightbulb size={14} className={showHint ? "text-amber-500" : "text-stone-400"} />
                  <span className="font-medium hidden sm:inline">Petunjuk</span>
                </button>

                <button
                  onClick={handleReplayWord}
                  className="p-1.5 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 text-[#1B4965] shadow-xs active:scale-95 transition-transform cursor-pointer"
                  title="Dengarkan Suara Kata"
                >
                  <Volume2 size={16} />
                </button>

                <button
                  onClick={handleNextWord}
                  className="p-1.5 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 text-[#1B4965] shadow-xs active:scale-95 transition-transform cursor-pointer"
                  title="Kata Berikutnya"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* ── Central Stage: Illustration & Dynamic Letter Boxes ── */}
            <div className="flex-1 flex flex-col items-center justify-center my-1 z-10 gap-2 sm:gap-3">
              {/* Central 3D Illustration Card */}
              <motion.div
                key={currentItem.word}
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl p-2 shadow-md border-2 border-stone-200 flex flex-col items-center justify-center cursor-pointer group active:scale-95 transition-transform"
                onClick={handleReplayWord}
                title="Klik untuk mendengarkan pengucapan kata"
              >
                <div className="w-14 h-14">
                  <WordIllustration
                    illustrationKey={currentItem.illustrationKey}
                    word={currentItem.word}
                    color={currentItem.color}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-sans font-bold text-xs text-[#1B4965]">
                    {currentItem.word}
                  </span>
                  <Volume2 size={10} className="text-[#1B4965]/60" />
                </div>
              </motion.div>

              {/* Dynamic Letter Outline Boxes */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {wordChars.map((char, index) => {
                  const isFilled = index < activeCharIndex || isWordComplete;
                  const isActive = index === activeCharIndex && !isWordComplete;
                  const isShake = isActive && wrongKey;

                  return (
                    <motion.div
                      key={index}
                      animate={
                        isShake
                          ? { x: [-4, 4, -3, 3, 0] }
                          : isFilled
                          ? { scale: [1, 1.15, 1], rotate: [0, 4, -4, 0] }
                          : isActive
                          ? { scale: [1, 1.05, 1] }
                          : {}
                      }
                      transition={{ duration: 0.3 }}
                      className={`w-11 h-13 sm:w-13 sm:h-15 rounded-2xl border-3 flex flex-col items-center justify-center font-display font-bold text-2xl sm:text-3xl transition-all shadow-md relative ${
                        isFilled
                          ? "bg-emerald-500 border-emerald-600 text-white shadow-emerald-200"
                          : isActive
                          ? "bg-white border-[#3B82F6] text-[#3B82F6] shadow-blue-200 animate-pulse ring-4 ring-blue-100"
                          : "bg-white/70 border-stone-300 text-stone-400"
                      }`}
                    >
                      {/* Character text */}
                      {isFilled ? char : isActive ? char : "?"}

                      {/* Completed checkmark badge */}
                      {isFilled && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Live Guidance status */}
              <div className="h-4 flex items-center justify-center">
                <span className="font-sans text-xs text-[#1B4965]/70 font-medium">
                  {isWordComplete ? (
                    <span className="text-emerald-600 font-bold">Hebat! Kata lengkap! +1 Bintang!</span>
                  ) : (
                    <span>
                      Tekan tombol <strong>{expectedChar}</strong> (huruf ke-{activeCharIndex + 1} dari {wordChars.length})
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* ── Tactile Virtual On-Screen Keyboard ─────────────── */}
            <div className="flex flex-col gap-1 sm:gap-1.5 z-10 flex-shrink-0 max-w-lg mx-auto w-full">
              {KEYBOARD_ROWS.map((row, rowIdx) => (
                <div key={rowIdx} className="flex justify-center gap-1 sm:gap-1.5">
                  {row.map((keyChar) => {
                    const isTarget = keyChar === expectedChar && !isWordComplete;
                    const isPressed = activePressedKey === keyChar;
                    const isKeyWrong = wrongKey === keyChar;
                    const isKeyHinted = showHint && isTarget;

                    return (
                      <motion.button
                        key={keyChar}
                        disabled={isWordComplete}
                        whileHover={!isWordComplete ? { scale: 1.08, y: -2 } : {}}
                        whileTap={{ scale: 0.92, y: 2 }}
                        animate={
                          isKeyWrong
                            ? { x: [-4, 4, -3, 3, 0] }
                            : isKeyHinted
                            ? {
                                scale: [1, 1.12, 1],
                                boxShadow: "0 0 12px rgba(245, 158, 11, 0.8)",
                              }
                            : {}
                        }
                        transition={{ duration: 0.3 }}
                        onClick={() => handleKeyPress(keyChar)}
                        className={`h-9 sm:h-11 rounded-xl font-display font-bold text-sm sm:text-base border-b-3 transition-all flex items-center justify-center select-none cursor-pointer ${
                          rowIdx === 0
                            ? "w-8 sm:w-10"
                            : rowIdx === 1
                            ? "w-8 sm:w-10"
                            : "w-9 sm:w-11"
                        } ${
                          isKeyWrong
                            ? "bg-rose-500 border-rose-600 text-white"
                            : isPressed && isTarget
                            ? "bg-emerald-500 border-emerald-600 text-white"
                            : isKeyHinted
                            ? "bg-amber-100 border-amber-400 text-amber-800"
                            : isTarget
                            ? "bg-white border-[#3B82F6] text-[#3B82F6] shadow-sm font-black"
                            : "bg-white border-stone-300 text-[#1B4965] hover:border-[#3B82F6] hover:text-[#3B82F6] shadow-xs active:border-stone-400 active:bg-stone-100"
                        }`}
                      >
                        {keyChar}
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Tablet Home Bar Indicator */}
            <div className="w-16 h-1 bg-stone-300 rounded-full mx-auto mt-1 flex-shrink-0" />

            {/* ── Success Celebration Modal Overlay (2.2s Pacing) ── */}
            <AnimatePresence>
              {isWordComplete && (
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
                    Luar Biasa!
                  </h3>
                  <p className="font-sans font-semibold text-sm sm:text-base text-[#1B4965]/80 mb-2 max-w-xs">
                    Kata <span className="font-bold text-[#3B82F6]">{currentItem.word.toUpperCase()}</span> berhasil diketik lengkap!
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
                      Menuju kata berikutnya...
                    </span>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.2, ease: "linear" }}
                        className="h-full bg-[#3B82F6]"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <TactileButton
                      variant="secondary"
                      size="sm"
                      onClick={handleResetCurrentWord}
                      ariaLabel="Ketik Ulang Kata Ini"
                    >
                      <RotateCcw size={15} />
                      <span>Ketik Lagi</span>
                    </TactileButton>

                    <TactileButton
                      variant="primary"
                      size="sm"
                      onClick={handleNextWord}
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
