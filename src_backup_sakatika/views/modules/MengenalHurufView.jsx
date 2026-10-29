// src/views/modules/MengenalHurufView.jsx
// Modul 1 — Mengenal & Bunyi Huruf A-Z
// Strictly fits inside 100vw x 100vh — zero scrollbars.
import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowLeft, ArrowRight, Volume2, Grid3X3, Target } from "lucide-react";

import { useGame }    from "../../context/GameContext.jsx";
import { useAudio }   from "../../context/AudioContext.jsx";
import { ALPHABET_DATA } from "../../data/masterDataset.js";
import { speakLetter, speakWord } from "../../utils/speechEngine.js";
import CarouselContainer from "../../components/ui/CarouselContainer.jsx";
import WordIllustration  from "../../components/illustrations/WordIllustration.jsx";
import SakaMascot        from "../../components/illustrations/SakaMascot.jsx";
import TactileButton     from "../../components/ui/TactileButton.jsx";
import AmbientDecor      from "../../components/illustrations/AmbientDecor.jsx";

// ── Split 26 letters into 3 pages: A-I (9), J-R (9), S-Z (8) ──────────────
const PAGE_GROUPS = [
  ALPHABET_DATA.slice(0,  9),   // A–I
  ALPHABET_DATA.slice(9, 18),   // J–R
  ALPHABET_DATA.slice(18, 26),  // S–Z
];
const PAGE_LABELS = ["A — I", "J — R", "S — Z"];

// ── View Mode 1: Rainbow Alphabet Board ────────────────────────────────────
function AlphabetBoard({ onSelectLetter, externalPage, onPageChange }) {
  const { addStars, discoverLetter, isLetterDiscovered } = useGame();
  const { playSfx } = useAudio();

  const handleCardClick = useCallback(
    (letterObj) => {
      playSfx("click");
      speakLetter(letterObj);
      const isNew = !isLetterDiscovered(letterObj.letter);
      if (isNew) {
        discoverLetter(letterObj.letter);
        addStars(1);
        // Milestone confetti
        const totalDiscovered = ALPHABET_DATA.filter((l) =>
          isLetterDiscovered(l.letter)
        ).length + 1;
        if (totalDiscovered === 5 || totalDiscovered === 13 || totalDiscovered === 26) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.55 },
            colors: ["#F48B94", "#F9D968", "#95D5B2", "#8FB8ED", "#FA7070"],
          });
        }
      }
      onSelectLetter(letterObj);
    },
    [playSfx, isLetterDiscovered, discoverLetter, addStars, onSelectLetter]
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col gap-2">
      {/* 3D Pill Filter Tabs — synced with carousel */}
      <div className="flex gap-2 flex-shrink-0 justify-center">
        {PAGE_LABELS.map((label, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(i)}
            className={`font-display font-semibold text-xs sm:text-sm px-4 py-1.5 rounded-full border-2 transition-colors ${
              externalPage === i
                ? "bg-[#1B4965] text-white border-[#1B4965] shadow-md shadow-[#1B4965]/30"
                : "bg-white/70 text-[#1B4965] border-[#1B4965]/20 hover:border-[#1B4965]/50"
            }`}
          >
            {label}
          </motion.button>
        ))}
      </div>

      {/* Letter grid carousel — controlled page index */}
      <div className="flex-1 overflow-hidden">
        <CarouselContainer pageLabel={false} controlledPage={externalPage} onPageChange={onPageChange}>
          {PAGE_GROUPS.map((group, pi) => (
            <div
              key={pi}
              className="h-full grid grid-cols-3 gap-1.5 sm:gap-2 content-center p-1"
            >
              {group.map((letterObj) => {
                const discovered = isLetterDiscovered(letterObj.letter);
                return (
                  <motion.button
                    key={letterObj.letter}
                    whileHover={{ scale: 1.07, y: -3 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => handleCardClick(letterObj)}
                    aria-label={`Huruf ${letterObj.letter} untuk ${letterObj.word}`}
                    className="relative flex flex-col items-center justify-center rounded-2xl border-b-4 p-2 shadow-md cursor-pointer select-none"
                    style={{
                      backgroundColor: letterObj.color + "22",
                      borderColor: letterObj.color,
                    }}
                  >
                    {/* Discovered star badge */}
                    {discovered && (
                      <span className="absolute top-1 right-1">
                        <svg className="w-3.5 h-3.5 fill-[#F9D968] stroke-[#E3C654] stroke-1" viewBox="0 0 24 24">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </span>
                    )}
                    <span
                      className="font-display font-bold text-lg sm:text-xl leading-none"
                      style={{ color: letterObj.color }}
                    >
                      {letterObj.letter}{letterObj.lowercase}
                    </span>
                    <span className="font-sans font-medium text-[9px] sm:text-[11px] text-[#1B4965]/70 mt-0.5 truncate w-full text-center">
                      {letterObj.word}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          ))}
        </CarouselContainer>
      </div>
    </div>
  );
}

// ── View Mode 2: Bunyi Huruf Detail Stage ──────────────────────────────────
function BunyiHurufStage({ letterObj, onBack, onPrev, onNext, currentIndex }) {
  const { playSfx } = useAudio();
  const [speakerPulsing, setSpeakerPulsing] = useState(false);
  const [bouncing, setBouncing]             = useState(false);

  const handleSpeak = () => {
    playSfx("click");
    speakWord(letterObj);
    setSpeakerPulsing(true);
    setBouncing(true);
    setTimeout(() => setSpeakerPulsing(false), 1400);
    setTimeout(() => setBouncing(false), 900);
  };

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < ALPHABET_DATA.length - 1;

  return (
    <div className="flex-1 overflow-hidden flex flex-col gap-2">
      {/* Nav bar */}
      <div className="flex items-center justify-between flex-shrink-0">
        <TactileButton variant="secondary" size="sm" onClick={onBack} ariaLabel="Lihat Semua Huruf">
          <Grid3X3 size={14} />
          <span className="text-xs">A-Z</span>
        </TactileButton>
        <div className="flex gap-1.5">
          <TactileButton variant="secondary" size="sm" onClick={onPrev} disabled={!hasPrev} ariaLabel="Huruf Sebelumnya">
            <ArrowLeft size={14} />
          </TactileButton>
          <span className="font-display font-bold text-xs text-[#1B4965] self-center px-1">
            {currentIndex + 1}/{ALPHABET_DATA.length}
          </span>
          <TactileButton variant="secondary" size="sm" onClick={onNext} disabled={!hasNext} ariaLabel="Huruf Selanjutnya">
            <ArrowRight size={14} />
          </TactileButton>
        </div>
      </div>

      {/* Stage content */}
      <div className="flex-1 overflow-hidden flex gap-3">
        {/* Left: info panel */}
        <div className="flex flex-col justify-between w-5/12 min-w-0">
          <div className="flex flex-col gap-2">
            <p className="font-sans font-semibold text-[10px] text-[#1B4965]/50 uppercase tracking-wider">
              Bunyi Huruf
            </p>
            <h3 className="font-display font-bold text-base sm:text-lg text-[#1B4965] leading-tight">
              Dengarkan Bunyi Huruf
            </h3>
            <p className="font-sans text-[10px] sm:text-xs text-[#1B4965]/65">
              Tekan ikon suara untuk mendengar contoh bunyi huruf.
            </p>
            <div className="bg-[#FDE08D]/60 border border-[#F9D968] rounded-xl p-2">
              <p className="font-sans text-xs text-[#1B4965]/80">
                Contoh:{" "}
                <span style={{ color: letterObj.color }} className="font-display font-bold text-sm">
                  {letterObj.letter}
                </span>{" "}
                untuk{" "}
                <span style={{ color: letterObj.color }} className="font-display font-bold text-sm">
                  {letterObj.word}
                </span>
              </p>
            </div>
            <p className="font-sans text-[9px] text-[#1B4965]/40 italic leading-tight">
              Ayo hubungkan huruf, bunyi, dan kata bersama!
            </p>
          </div>

          {/* Speaker button */}
          <div className="flex flex-col items-start gap-1 mt-2">
            <motion.button
              animate={speakerPulsing ? { scale: [1, 1.18, 1, 1.1, 1] } : {}}
              transition={{ duration: 0.65 }}
              onClick={handleSpeak}
              aria-label={`Dengarkan bunyi huruf ${letterObj.letter}`}
              className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-b-4 cursor-pointer"
              style={{ backgroundColor: "#FA7070", borderColor: "#D95353" }}
            >
              <Volume2 size={24} className="text-white" />
              {speakerPulsing && (
                <>
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-[#FA7070]"
                    animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
                    transition={{ duration: 0.7, repeat: 2 }}
                  />
                  <motion.span
                    className="absolute inset-0 rounded-full border border-[#FA7070]"
                    animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                    transition={{ duration: 0.9, repeat: 2, delay: 0.1 }}
                  />
                </>
              )}
            </motion.button>
            <span className="font-sans text-[9px] text-[#1B4965]/45">Tekan untuk bicara</span>
          </div>
        </div>

        {/* Right: Giant letter card + pedestal + illustration */}
        <div className="flex-1 flex flex-col items-center justify-end gap-1 min-w-0">
          {/* Giant 3D letter card */}
          <motion.div
            onClick={handleSpeak}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="w-20 h-24 sm:w-24 sm:h-28 rounded-3xl flex flex-col items-center justify-center shadow-xl border-b-[5px] cursor-pointer relative flex-shrink-0"
            style={{ backgroundColor: letterObj.color, borderColor: letterObj.color + "99" }}
          >
            <span className="absolute top-1.5 right-2.5 font-display font-bold text-sm text-white/60">
              {letterObj.lowercase}
            </span>
            <span className="font-display font-bold text-5xl sm:text-6xl text-white leading-none drop-shadow-md">
              {letterObj.letter}
            </span>
            <span className="font-sans text-[10px] text-white/75 mt-0.5">{letterObj.phonetic}</span>
          </motion.div>

          {/* Illustration on pedestal */}
          <div className="flex flex-col items-center flex-shrink-0">
            <motion.div
              animate={bouncing ? { y: [0, -14, 0] } : { y: [0, -3, 0] }}
              transition={bouncing
                ? { duration: 0.5, type: "spring", stiffness: 300 }
                : { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
              className="w-16 h-16 sm:w-20 sm:h-20"
            >
              <WordIllustration
                illustrationKey={letterObj.illustrationKey}
                word={letterObj.word}
                color={letterObj.color}
                className="w-full h-full"
              />
            </motion.div>

            {/* Pedestal */}
            <div className="flex flex-col items-center -mt-1">
              <div
                className="w-20 h-5 rounded-t-xl flex items-center justify-center"
                style={{ backgroundColor: letterObj.color + "44" }}
              >
                <span className="font-display font-semibold text-xs text-[#1B4965]">
                  <span style={{ color: letterObj.color }} className="font-bold">
                    {letterObj.word[0]}
                  </span>
                  {letterObj.word.slice(1)}
                </span>
              </div>
              <div
                className="w-24 h-3 rounded-b-xl"
                style={{ backgroundColor: letterObj.color + "28" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main View ───────────────────────────────────────────────────────────────
export default function MengenalHurufView() {
  const { navigateTo } = useGame();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [carouselPage, setCarouselPage]   = useState(0);

  const handleSelectLetter = (letterObj) => {
    const idx = ALPHABET_DATA.findIndex((l) => l.letter === letterObj.letter);
    setSelectedIndex(idx);
  };

  const handleBack = () => setSelectedIndex(null);
  const handlePrev = () => setSelectedIndex((i) => Math.max(0, (i ?? 0) - 1));
  const handleNext = () => setSelectedIndex((i) => Math.min(ALPHABET_DATA.length - 1, (i ?? 0) + 1));

  const currentLetter = selectedIndex !== null ? ALPHABET_DATA[selectedIndex] : null;

  return (
    <main className="relative flex-1 overflow-hidden flex flex-col px-3 pb-2 select-none">
      <AmbientDecor />
      <div className="relative z-10 flex-1 overflow-hidden flex gap-3 sm:gap-4">
        {/* ── Left Column: Info & Mascot ─────────────────────── */}
        <section className="w-52 sm:w-60 flex-shrink-0 flex flex-col gap-2.5 overflow-hidden py-1">
          <TactileButton
            variant="secondary"
            size="sm"
            onClick={() => navigateTo("/menu")}
            ariaLabel="Kembali ke Menu Utama"
            className="self-start"
          >
            <ArrowLeft size={15} />
            <span>Menu</span>
          </TactileButton>

          <div>
            <p className="font-sans font-semibold text-[10px] text-[#1B4965]/55 uppercase tracking-widest">
              Modul 1
            </p>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1B4965] leading-tight">
              Mengenal<br />Huruf A-Z
            </h1>
          </div>

          <p className="font-sans text-xs text-[#1B4965]/70 leading-snug">
            Kartu huruf kapital dan huruf kecil dengan gambar. Sentuh setiap huruf untuk mendengar bunyinya.
          </p>

          <div className="bg-[#FDE08D]/70 border border-[#F9D968] rounded-2xl p-2.5 flex gap-2 items-start">
            <Target size={16} className="text-[#B45309] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-sans font-bold text-[10px] text-[#B45309] mb-0.5">Tujuan</p>
              <p className="font-sans text-[10px] text-[#92400E] leading-snug">
                Mengenali bentuk dan bunyi huruf A sampai Z.
              </p>
            </div>
          </div>

          {/* Mascot + tip bubble */}
          <div className="flex-1 flex flex-col items-center justify-end gap-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex ?? "grid"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-white/80 border border-[#1B4965]/15 rounded-2xl px-3 py-2 text-center shadow-sm"
              >
                <p className="font-sans text-[10px] sm:text-xs text-[#1B4965]">
                  {selectedIndex === null
                    ? "Sentuh huruf untuk mendengar bunyinya!"
                    : `Klik kartu atau tombol suara untuk huruf ${currentLetter?.letter}!`}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="scale-75 sm:scale-90 origin-bottom flex-shrink-0">
              <SakaMascot />
            </div>
          </div>
        </section>

        {/* ── Right Column: Tablet Frame ──────────────────────── */}
        <section className="flex-1 overflow-hidden flex flex-col py-1">
          <div className="flex-1 overflow-hidden bg-zinc-900 rounded-[2rem] p-2 sm:p-3 shadow-2xl border-4 border-zinc-800 flex flex-col">
            <div className="w-2.5 h-2.5 bg-zinc-700 rounded-full mx-auto mb-2 flex-shrink-0" />

            <div className="flex-1 overflow-hidden bg-[#FDF6EC] rounded-2xl p-2.5 sm:p-3.5 flex flex-col relative border border-stone-200">
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#F9D949]/20 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#A8D5BA]/30 rounded-full blur-xl pointer-events-none" />

              <div className="flex-shrink-0 mb-2 text-center">
                <p className="font-display font-bold text-sm text-[#1B4965]">Mengenal Huruf</p>
              </div>

              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {selectedIndex === null ? (
                    <motion.div
                      key="grid"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      className="h-full flex flex-col"
                    >
                      <AlphabetBoard
                        onSelectLetter={handleSelectLetter}
                        externalPage={carouselPage}
                        onPageChange={setCarouselPage}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`detail-${selectedIndex}`}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      className="h-full flex flex-col"
                    >
                      <BunyiHurufStage
                        letterObj={currentLetter}
                        onBack={handleBack}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        currentIndex={selectedIndex}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-16 h-1 bg-stone-300 rounded-full mx-auto mt-2 flex-shrink-0" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
