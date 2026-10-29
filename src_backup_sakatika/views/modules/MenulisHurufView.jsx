// src/views/modules/MenulisHurufView.jsx
// Modul 2 — Ayo Menulis Huruf: Clean, uncrowded tablet workspace with A-Z ribbon & auto-advance.
// Strictly fits inside 100vw x 100vh — zero scrollbars.
// ZERO EMOJIS anywhere in this file.

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, Sparkles, ChevronLeft, ChevronRight, Check } from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { ALPHABET_DATA } from "../../data/masterDataset.js";
import { ALPHABET_PATHS } from "../../data/alphabetPaths.js";
import { speakWord } from "../../utils/speechEngine.js";
import LetterCanvas from "../../components/canvas/LetterCanvas.jsx";
import SakaMascot from "../../components/illustrations/SakaMascot.jsx";
import TactileButton from "../../components/ui/TactileButton.jsx";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";
import AmbientDecor from "../../components/illustrations/AmbientDecor.jsx";

export default function MenulisHurufView() {
  const { navigateTo } = useGame();
  const { playSfx } = useAudio();

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [completedLetters, setCompletedLetters] = useState(() => {
    const stored = localStorage.getItem("saka_tika_written");
    return stored ? JSON.parse(stored) : [];
  });
  const [accuracy, setAccuracy] = useState(0);
  const [strokeInfo, setStrokeInfo] = useState({ current: 1, total: 1 });

  const letterObj = ALPHABET_DATA[selectedIdx];
  const letterPathInfo = ALPHABET_PATHS[letterObj.letter] || ALPHABET_PATHS.A;
  const ribbonRef = useRef(null);

  // Auto scroll active letter into view in the top ribbon
  useEffect(() => {
    if (ribbonRef.current) {
      const activeEl = ribbonRef.current.children[selectedIdx];
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [selectedIdx]);

  const handleSelectLetter = (idx) => {
    playSfx("click");
    setSelectedIdx(idx);
    setAccuracy(0);
  };

  const handleNextLetter = () => {
    if (selectedIdx < ALPHABET_DATA.length - 1) {
      setSelectedIdx((prev) => prev + 1);
      playSfx("click");
      setAccuracy(0);
    }
  };

  const handlePrevLetter = () => {
    if (selectedIdx > 0) {
      setSelectedIdx((prev) => prev - 1);
      playSfx("click");
      setAccuracy(0);
    }
  };

  const handleSpeak = () => {
    playSfx("click");
    speakWord(letterObj);
  };

  const markLetterCompleted = () => {
    if (!completedLetters.includes(letterObj.letter)) {
      const updated = [...completedLetters, letterObj.letter];
      setCompletedLetters(updated);
      localStorage.setItem("saka_tika_written", JSON.stringify(updated));
    }
  };

  return (
    <main className="relative flex-1 overflow-hidden flex flex-col px-3 sm:px-6 pb-2 pt-1 select-none">
      {/* Background Ambience */}
      <AmbientDecor />

      {/* Main Split Layout */}
      <div className="relative z-10 flex-1 overflow-hidden flex gap-3 sm:gap-4 items-stretch">
        {/* ── Left Column: Module Info & Mascot ─────────────────────── */}
        <section className="w-52 sm:w-56 flex-shrink-0 flex flex-col justify-between overflow-hidden py-1">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            {/* Back Button */}
            <TactileButton
              variant="secondary"
              size="sm"
              onClick={() => navigateTo("/menu")}
              ariaLabel="Kembali ke Menu Utama"
              className="self-start"
            >
              <ArrowLeft size={16} />
              <span>Menu</span>
            </TactileButton>

            {/* Title */}
            <div>
              <span className="font-sans font-bold text-[10px] text-[#1B4965]/60 uppercase tracking-widest">
                Modul 2
              </span>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1B4965] leading-tight">
                Menulis<br />Huruf
              </h1>
            </div>

            {/* Description */}
            <p className="font-sans text-xs text-[#1B4965]/80 leading-snug">
              Telusuri garis putus-putus dengan rapi. Ikuti nomor urutan goresan!
            </p>

            {/* Instruction Callout Box */}
            <div
              className="rounded-2xl p-2.5 border-b-4 text-[#1B4965] shadow-xs"
              style={{ backgroundColor: "#FCE277", borderColor: "#E3C654" }}
            >
              <div className="flex items-center gap-1.5 mb-1 font-sans font-bold text-xs">
                <Sparkles size={13} className="text-[#1B4965]" />
                <span>Petunjuk Goresan</span>
              </div>
              <p className="font-sans text-[11px] leading-tight text-[#1B4965]/90">
                {letterPathInfo.instruction}
              </p>
            </div>

            {/* Sound button */}
            <TactileButton
              variant="blue"
              size="sm"
              onClick={handleSpeak}
              ariaLabel="Dengarkan Contoh Bunyi"
              className="w-full"
            >
              <Volume2 size={15} />
              <span>Contoh Suara</span>
            </TactileButton>
          </div>

          {/* Cheerleader Mascot with speech tip */}
          <div className="flex flex-col items-center justify-end overflow-hidden mt-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={letterObj.letter}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-white/95 border border-[#1B4965]/15 rounded-2xl px-3 py-1.5 text-center shadow-xs mb-1 max-w-[13.5rem]"
              >
                <span className="font-sans text-[11px] font-semibold text-[#1B4965] leading-tight block">
                  Tebalkan huruf{" "}
                  <span className="font-bold font-display" style={{ color: letterObj.color }}>
                    {letterObj.letter}
                  </span>{" "}
                  untuk {letterObj.word}!
                </span>
              </motion.div>
            </AnimatePresence>
            <div className="scale-70 sm:scale-80 origin-bottom flex-shrink-0">
              <SakaMascot isWaving={true} />
            </div>
          </div>
        </section>

        {/* ── Right Column: Landscape Tablet Frame ──────────────────── */}
        <section className="flex-1 overflow-hidden flex flex-col py-0.5">
          <div className="flex-1 overflow-hidden bg-zinc-900 rounded-[2.2rem] p-2.5 sm:p-3 shadow-2xl border-4 border-zinc-800 flex flex-col">
            {/* Tablet Camera Dot */}
            <div className="w-2.5 h-2.5 bg-zinc-700 rounded-full mx-auto mb-1.5 flex-shrink-0" />

            {/* Tablet Interior Screen */}
            <div className="flex-1 overflow-hidden bg-[#FDF6EC] rounded-2xl p-2.5 sm:p-3 flex flex-col gap-2 relative border border-stone-200">
              {/* Corner Accents */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#F9D949]/20 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#A8D5BA]/30 rounded-full blur-xl pointer-events-none" />

              {/* Tablet Header: Navigation & Ribbon */}
              <div className="flex items-center justify-between gap-2 flex-shrink-0 z-10 h-10">
                <span className="font-display font-bold text-xs sm:text-sm text-[#1B4965] hidden md:inline">
                  Pilih Huruf:
                </span>

                {/* Left/Right Prev/Next Buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={handlePrevLetter}
                    disabled={selectedIdx === 0}
                    aria-label="Huruf Sebelumnya"
                    className="w-7 h-7 rounded-lg border border-[#1B4965]/15 bg-white/80 flex items-center justify-center text-[#1B4965] disabled:opacity-30 hover:scale-105 active:scale-95 transition-all shadow-xs"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNextLetter}
                    disabled={selectedIdx === ALPHABET_DATA.length - 1}
                    aria-label="Huruf Selanjutnya"
                    className="w-7 h-7 rounded-lg border border-[#1B4965]/15 bg-white/80 flex items-center justify-center text-[#1B4965] disabled:opacity-30 hover:scale-105 active:scale-95 transition-all shadow-xs"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Horizontal A-Z Carousel Ribbon */}
                <div
                  ref={ribbonRef}
                  className="flex-1 overflow-x-auto scroll-inner flex items-center gap-1.5 px-1 py-0.5"
                >
                  {ALPHABET_DATA.map((item, idx) => {
                    const isSelected = idx === selectedIdx;
                    const isDone = completedLetters.includes(item.letter);

                    return (
                      <motion.button
                        key={item.letter}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleSelectLetter(idx)}
                        aria-label={`Pilih huruf ${item.letter}`}
                        className={`flex-shrink-0 w-8 h-8 rounded-xl border-b-2 font-display font-bold text-xs flex items-center justify-center relative transition-all ${
                          isSelected
                            ? "shadow-sm scale-105 z-10 text-white"
                            : "bg-white/80 text-[#1B4965] border-[#1B4965]/15 hover:bg-white"
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
                        {item.letter}
                        {isDone && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#22C55E] text-white flex items-center justify-center shadow-xs">
                            <Check size={9} strokeWidth={3} />
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Main Workspace: Tracing Canvas + Side Tracker */}
              <div className="flex-1 overflow-hidden flex gap-2.5 sm:gap-3 z-10 min-h-0 items-stretch">
                {/* Center Canvas */}
                <div className="flex-1 overflow-hidden h-full rounded-2xl relative shadow-xs">
                  <LetterCanvas
                    letterObj={letterObj}
                    onNextLetter={handleNextLetter}
                    hasNextLetter={selectedIdx < ALPHABET_DATA.length - 1}
                    onProgressUpdate={(p) => {
                      setAccuracy(p);
                      if (p >= 100) markLetterCompleted();
                    }}
                    onStrokeUpdate={(sInfo) => setStrokeInfo(sInfo)}
                  />
                </div>

                {/* Right Side Panel: Progress & Object Hint */}
                <div className="w-28 sm:w-32 flex-shrink-0 flex flex-col justify-between gap-1.5 py-0.5 overflow-hidden">
                  {/* Big Letter Card */}
                  <div
                    className="rounded-2xl p-2 border-b-4 flex flex-col items-center justify-center shadow-xs text-center flex-shrink-0"
                    style={{
                      backgroundColor: letterObj.color + "22",
                      borderColor: letterObj.color,
                    }}
                  >
                    <span
                      className="font-display font-bold text-3xl leading-none drop-shadow-xs"
                      style={{ color: letterObj.color }}
                    >
                      {letterObj.letter}{letterObj.lowercase}
                    </span>
                    <span className="font-sans font-medium text-[11px] text-[#1B4965]/70 mt-0.5">
                      {letterObj.word}
                    </span>
                  </div>

                  {/* Circular Accuracy Meter */}
                  <div className="bg-white/90 border border-[#1B4965]/10 rounded-2xl p-2 flex flex-col items-center shadow-xs flex-shrink-0">
                    <span className="font-sans font-bold text-[10px] text-[#1B4965]/60 mb-0.5">
                      Kerapian
                    </span>
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          className="text-stone-200 stroke-current"
                          strokeWidth="3.5"
                          fill="none"
                        />
                        <motion.circle
                          cx="18"
                          cy="18"
                          r="15"
                          className="stroke-current"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          fill="none"
                          style={{ color: letterObj.color }}
                          strokeDasharray={2 * Math.PI * 15}
                          animate={{
                            strokeDashoffset: (2 * Math.PI * 15) * (1 - accuracy / 100),
                          }}
                          transition={{ duration: 0.25 }}
                        />
                      </svg>
                      <span className="absolute font-display font-bold text-xs text-[#1B4965]">
                        {accuracy}%
                      </span>
                    </div>

                    {/* Active Stroke Info */}
                    <span className="font-sans font-semibold text-[9px] text-[#1B4965]/60 mt-0.5">
                      Goresan {strokeInfo.current} / {strokeInfo.total}
                    </span>
                  </div>

                  {/* Word Illustration preview */}
                  <div className="bg-white/90 border border-[#1B4965]/10 rounded-2xl p-1.5 flex flex-col items-center shadow-xs flex-shrink-0">
                    <div className="w-11 h-11">
                      <WordIllustration
                        illustrationKey={letterObj.illustrationKey}
                        word={letterObj.word}
                        color={letterObj.color}
                        className="w-full h-full"
                      />
                    </div>
                    <span className="font-sans font-semibold text-[10px] text-[#1B4965]/80 mt-0.5 truncate max-w-full">
                      {letterObj.word}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tablet Home Bar */}
              <div className="w-16 h-1 bg-stone-300 rounded-full mx-auto flex-shrink-0" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
