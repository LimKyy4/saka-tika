// src/views/modules/MengetikHurufView.jsx
// SAKA TIKA: High-Craft Children's Arcade Full-Word Typing Game with Unified Single-Board Rebuild
// - Unified cream-white 3D Game Board (Zero overlapping elements, clean top header & 2-column playfield)
// - Curated 3-5 letter concrete, child-familiar Indonesian nouns & animals (All studio SVG illustrations)
// - 3 High-contrast child-friendly letter block states: Emerald (typed), Golden (active target), Ivory (upcoming)
// - Tactile mechanical depression physics, ascending xylophone scale, and gentle rubber wobble feedback
// - Grounded mascots with contact shadows, scaled-down subtle music note, and zero scrollbar lock
// STRICT ZERO SCROLLBAR APP LOCK: h-screen w-screen overflow-hidden select-none.
// STRICT ZERO EMOJIS & ZERO STAR ICONS POLICY: Exclusively lucide-react icons or bespoke vector graphics.
// STRICT AUDIO CONTROL: Never auto-play voice narration or SFX on initial mount.

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Volume2, RotateCcw, Check, Sparkles, Keyboard } from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { speakWord, speakLetter } from "../../utils/speechEngine.js";
import {
  playXylophoneNote,
  playRubberBoingSound,
  playHoverSound,
  playClickSound,
  playSuccessSound,
  playFanfareSound,
  playBubblePopSound,
  playSunChime,
} from "../../utils/soundSynthesizer.js";
import { ShuffleQueue } from "../../utils/shuffleQueue.js";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";

const TOTAL_QUESTIONS = 5;

// Kosakata baku Bahasa Indonesia kurasi 3 s.d. 5 huruf dengan ilustrasi SVG akurat dan konkret
const KATA_BAKU_INDONESIA = [
  "APEL", "AYAM", "AWAN",
  "BOLA", "BUKU", "BAJU",
  "CERI",
  "DADU", "DAUN",
  "FOTO",
  "GIGI",
  "IKAN",
  "KUDA", "KAKI", "KUE",
  "MATA", "MEJA",
  "NAGA",
  "OBOR",
  "RODA", "ROTI",
  "SAPI", "SUSU",
  "TOPI",
  "ULAR",
  "VAS",
  "YOYO",
];

export default function MengetikHurufView() {
  const { addStars } = useGame();
  const { playSfx } = useAudio();

  // Persistent ShuffleQueue untuk menjamin pengacakan 5 soal tanpa pengulangan langsung
  const shuffleQueueRef = useRef(null);
  if (!shuffleQueueRef.current) {
    shuffleQueueRef.current = new ShuffleQueue(KATA_BAKU_INDONESIA.length);
  }

  // State sesi: indeks soal saat ini (0 s.d. 4 untuk 5 soal acak)
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(() => {
    const idx = shuffleQueueRef.current.next();
    return KATA_BAKU_INDONESIA[idx] || "BOLA";
  });

  // State pengetikan untuk kata yang sedang aktif
  const [activeIndex, setActiveIndex] = useState(0); // 0 s.d. currentWord.length
  const [isWordComplete, setIsWordComplete] = useState(false);
  const [wobbleIndex, setWobbleIndex] = useState(null);
  const [tappedTileIndex, setTappedTileIndex] = useState(null);
  const [isMascotCheering, setIsMascotCheering] = useState(false);
  const [isChampion, setIsChampion] = useState(false);
  const [sparkleBursts, setSparkleBursts] = useState([]);

  // Komponen interaktif hidup latar belakang
  const [isIllustrationBouncing, setIsIllustrationBouncing] = useState(false);
  const [spinBlockA, setSpinBlockA] = useState(false);
  const [spinBlockB, setSpinBlockB] = useState(false);
  const [spinMusicNote, setSpinMusicNote] = useState(false);
  const [poppedBubbles, setPoppedBubbles] = useState({});

  const autoAdvanceTimer = useRef(null);

  // Huruf yang diharapkan pada slot yang sedang aktif
  const expectedChar = useMemo(() => {
    if (activeIndex < currentWord.length) {
      return currentWord[activeIndex];
    }
    return "";
  }, [currentWord, activeIndex]);

  // Muat kata baru untuk soal berikutnya
  const loadWord = useCallback((word) => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    setCurrentWord(word);
    setActiveIndex(0);
    setIsWordComplete(false);
    setWobbleIndex(null);
    setTappedTileIndex(null);
    setSparkleBursts([]);
    setIsIllustrationBouncing(false);
  }, []);

  // Letupan kembang api confetti saat kata / sesi selesai
  const triggerConfettiRockets = () => {
    const end = Date.now() + 1600;
    const colors = ["#FDE047", "#F43F5E", "#38BDF8", "#34D399", "#C084FC", "#FB923C"];

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0.08, y: 0.72 },
        colors,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 0.92, y: 0.72 },
        colors,
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Validasi tombol keyboard fisik (A–Z)
  const validateKey = useCallback(
    (pressedChar) => {
      if (isWordComplete || isChampion || activeIndex >= currentWord.length) return;

      if (pressedChar === expectedChar) {
        // Tombol yang ditekan benar!
        const nextIndex = activeIndex + 1;
        playXylophoneNote(activeIndex % 5);

        // Efek mekanik tombol ditekan
        setTappedTileIndex(activeIndex);
        setTimeout(() => setTappedTileIndex(null), 300);

        // Letupan partikel kilau emas pada balok yang baru terisi
        const burstId = `burst-${activeIndex}-${Date.now()}`;
        setSparkleBursts((prev) => [...prev, { id: burstId, index: activeIndex }]);
        setTimeout(() => {
          setSparkleBursts((prev) => prev.filter((b) => b.id !== burstId));
        }, 600);

        // Sorak ceria maskot
        setIsMascotCheering(true);
        setTimeout(() => setIsMascotCheering(false), 500);

        if (nextIndex >= currentWord.length) {
          // Seluruh huruf dalam kata berhasil diketik!
          setActiveIndex(nextIndex);
          setIsWordComplete(true);
          playSuccessSound();
          playFanfareSound();
          if (typeof addStars === "function") addStars(1);
          triggerConfettiRockets();

          // Tahan kata yang selesai selama 2.0 detik sebelum lanjut ke soal berikutnya
          autoAdvanceTimer.current = setTimeout(() => {
            if (questionIndex < TOTAL_QUESTIONS - 1) {
              const nextIdx = questionIndex + 1;
              setQuestionIndex(nextIdx);
              const nextWordIdx = shuffleQueueRef.current.next();
              loadWord(KATA_BAKU_INDONESIA[nextWordIdx] || "BOLA");
            } else {
              // Menyelesaikan 5 soal: Tampilkan perayaan Juara Mengetik!
              setIsChampion(true);
              triggerConfettiRockets();
            }
          }, 2000);
        } else {
          setActiveIndex(nextIndex);
        }
      } else {
        // Tombol yang ditekan salah: pantulan karet lembut & goyangan jeli horizontal
        playRubberBoingSound();
        setWobbleIndex(activeIndex);
        setTimeout(() => setWobbleIndex(null), 450);
      }
    },
    [
      isWordComplete,
      isChampion,
      activeIndex,
      currentWord,
      expectedChar,
      questionIndex,
      loadWord,
      addStars,
    ]
  );

  // Event listener tombol keyboard fisik (case-insensitive, abaikan kombinasi Ctrl/Alt/Meta)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isWordComplete || isChampion) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key && e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        validateKey(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [validateKey, isWordComplete, isChampion]);

  // Interaksi balok yang sedang aktif (bantuan audio suara huruf)
  const handleActiveBlockTap = () => {
    playXylophoneNote(activeIndex % 5);
    speakLetter(expectedChar);
    setWobbleIndex(activeIndex);
    setTimeout(() => setWobbleIndex(null), 400);
  };

  // Interaksi balok huruf yang sudah diketik (alat musik xylophone interaktif)
  const handleCompletedBlockTap = (index) => {
    playXylophoneNote(index % 5);
    speakLetter(currentWord[index]);
    setTappedTileIndex(index);
    setTimeout(() => setTappedTileIndex(null), 400);
  };

  // Atur ulang pengetikan kata saat ini dari huruf pertama
  const handleResetCurrentWord = useCallback(() => {
    playHoverSound();
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    setActiveIndex(0);
    setIsWordComplete(false);
    setWobbleIndex(null);
    setTappedTileIndex(null);
  }, []);

  // Pengucapan audio manual untuk kata target dengan animasi loncat pada ilustrasi
  const handleSpeakTargetWord = () => {
    playClickSound();
    setIsIllustrationBouncing(true);
    speakWord(currentWord);
    setTimeout(() => setIsIllustrationBouncing(false), 600);
  };

  // Interaksi Maskot Saka / Tika saat diketuk
  const handleMascotTap = () => {
    playHoverSound();
    setIsMascotCheering(true);
    setTimeout(() => setIsMascotCheering(false), 600);
  };

  // Interaksi Balok Mainan Latar Belakang (A & B)
  const handleTapBlockA = () => {
    playXylophoneNote(0);
    speakLetter("A");
    setSpinBlockA(true);
    setTimeout(() => setSpinBlockA(false), 700);
  };

  const handleTapBlockB = () => {
    playXylophoneNote(1);
    speakLetter("B");
    setSpinBlockB(true);
    setTimeout(() => setSpinBlockB(false), 700);
  };

  // Interaksi Notasi Musik Latar Belakang
  const handleTapMusicNote = () => {
    playSunChime();
    setSpinMusicNote(true);
    setTimeout(() => setSpinMusicNote(false), 800);
  };

  // Interaksi Letup Gelembung Latar Belakang
  const handlePopBubble = (idx) => {
    playBubblePopSound(idx % 4);
    setPoppedBubbles((prev) => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      setPoppedBubbles((prev) => ({ ...prev, [idx]: false }));
    }, 1200);
  };

  // Ulangi permainan setelah perayaan Juara 5 Soal
  const handleRestartGame = () => {
    playHoverSound();
    setQuestionIndex(0);
    setIsChampion(false);
    const nextWordIdx = shuffleQueueRef.current.next();
    loadWord(KATA_BAKU_INDONESIA[nextWordIdx] || "BOLA");
  };

  // Gelembung latar belakang mengapung halus
  const ambientBubbles = useMemo(
    () => [
      { left: 8, bottom: 10, size: 22, duration: 7.2, delay: 0 },
      { left: 18, bottom: 14, size: 16, duration: 6.5, delay: 1.5 },
      { left: 28, bottom: 8, size: 26, duration: 8.0, delay: 0.7 },
      { left: 44, bottom: 14, size: 20, duration: 7.0, delay: 2.2 },
      { left: 56, bottom: 8, size: 28, duration: 8.5, delay: 1.1 },
      { left: 70, bottom: 16, size: 18, duration: 6.8, delay: 2.6 },
      { left: 80, bottom: 10, size: 24, duration: 7.8, delay: 0.4 },
      { left: 90, bottom: 12, size: 20, duration: 6.6, delay: 1.8 },
      { left: 36, bottom: 18, size: 16, duration: 6.2, delay: 3.0 },
      { left: 64, bottom: 20, size: 22, duration: 7.4, delay: 2.9 },
    ],
    []
  );

  return (
    <main className="relative z-10 flex flex-col h-screen w-screen max-h-screen overflow-hidden justify-between select-none p-3 sm:p-4 md:p-6">
      {/* ── 1. Latar Belakang Magenta Arkade yang Hidup ── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Gradien Linier Atmosferik Utama */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(180deg, #E92B7A 0%, #D81B60 28%, #BE185D 58%, #9D174D 82%, #831843 100%)",
          }}
        />

        {/* Pendar Sorot Panggung Radial Halus */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          animate={{ opacity: [0.38, 0.54, 0.38] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse at 50% 46%, rgba(255, 235, 243, 0.45) 0%, rgba(233, 43, 122, 0.22) 48%, rgba(131, 24, 67, 0.75) 100%)",
          }}
        />

        {/* Balok Huruf 3D Mengapung Interaktif (A & B di Kanan Atas) */}
        {/* Balok A */}
        <motion.div
          onClick={handleTapBlockA}
          animate={
            spinBlockA
              ? { rotate: [0, 360], scale: [1, 1.25, 1], y: [-6, -18, -6] }
              : { y: [-6, 6, -6], rotate: [-4, 4, -4] }
          }
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          transition={
            spinBlockA
              ? { duration: 0.65, ease: "easeOut" }
              : { duration: 5.0, repeat: Infinity, ease: "easeInOut" }
          }
          className="absolute top-5 right-20 sm:top-6 sm:right-24 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-b from-[#FCE7F3] to-[#FBCFE8] border-2 border-pink-300 border-b-4 border-b-pink-500 shadow-lg flex items-center justify-center opacity-85 pointer-events-auto cursor-pointer z-10"
          title="Ketuk balok A untuk memutar dan mendengarkan suaranya!"
        >
          <span className="font-display font-black text-xl sm:text-2xl text-pink-700">A</span>
        </motion.div>

        {/* Balok B */}
        <motion.div
          onClick={handleTapBlockB}
          animate={
            spinBlockB
              ? { rotate: [0, -360], scale: [1, 1.25, 1], y: [6, -14, 6] }
              : { y: [6, -6, 6], rotate: [5, -5, 5] }
          }
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          transition={
            spinBlockB
              ? { duration: 0.65, ease: "easeOut" }
              : { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
          }
          className="absolute top-8 right-6 sm:top-9 sm:right-8 w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-b from-[#FEF08A] to-[#FDE047] border-2 border-amber-300 border-b-4 border-b-amber-500 shadow-lg flex items-center justify-center opacity-85 pointer-events-auto cursor-pointer z-10"
          title="Ketuk balok B untuk memutar dan mendengarkan suaranya!"
        >
          <span className="font-display font-black text-xl sm:text-2xl text-amber-900">B</span>
        </motion.div>

        {/* Notasi Musik Melayang Berimbang (Kiri Atas, Skala Lembut) */}
        <motion.div
          onClick={handleTapMusicNote}
          animate={
            spinMusicNote
              ? { rotate: [0, 18, -18, 0], scale: [1, 1.2, 1] }
              : { y: [-4, 4, -4], scale: [0.97, 1.03, 0.97] }
          }
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          transition={
            spinMusicNote
              ? { duration: 0.6, ease: "easeOut" }
              : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
          }
          className="absolute top-18 left-6 sm:top-20 sm:left-8 w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 opacity-40 pointer-events-auto cursor-pointer drop-shadow-sm z-10"
          title="Ketuk untuk membunyikan melodi musik!"
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <circle cx="50" cy="50" r="32" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="4 4" />
            <path
              d="M 42 62 C 37 62 33 66 33 71 C 33 76 37 80 42 80 C 47 80 51 76 51 71 L 51 32 L 72 26 L 72 45 C 67 45 63 49 63 54 C 63 59 67 63 72 63 C 77 63 81 59 81 54 L 81 18 L 42 26 Z"
              fill="#38BDF8"
              stroke="#0284C7"
              strokeWidth="2"
            />
            <circle cx="28" cy="28" r="3.5" fill="#FEF08A" />
            <circle cx="78" cy="78" r="3" fill="#FEF08A" />
          </svg>
        </motion.div>

        {/* 10 Gelembung Mikro Mengambang Interaktif */}
        {ambientBubbles.map((ab, idx) => {
          const isPopped = poppedBubbles[idx];
          if (isPopped) return null;

          return (
            <motion.div
              key={`ab-${idx}`}
              onClick={() => handlePopBubble(idx)}
              className="absolute rounded-full border border-white/60 pointer-events-auto cursor-pointer"
              style={{
                left: `${ab.left}%`,
                bottom: `${ab.bottom}%`,
                width: `${ab.size}px`,
                height: `${ab.size}px`,
                background:
                  "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.92) 0%, rgba(254,205,211,0.4) 45%, rgba(244,114,182,0.22) 100%)",
                boxShadow: "inset 0 0 8px rgba(255,255,255,0.8), 0 0 10px rgba(255,255,255,0.35)",
                opacity: 0.5,
              }}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.7 }}
              animate={{
                y: [-10, -80, -150],
                x: [0, idx % 2 === 0 ? 12 : -12, 0],
                opacity: [0.35, 0.65, 0],
              }}
              transition={{
                duration: ab.duration,
                repeat: Infinity,
                delay: ab.delay,
                ease: "easeInOut",
              }}
              title="Ketuk gelembung untuk meletuskannya!"
            >
              <div className="absolute top-1 left-1.5 w-1.5 h-1 bg-white/95 rounded-full -rotate-45" />
            </motion.div>
          );
        })}

        {/* Siluet Ombak Arkade Dasar Bawah */}
        <div className="absolute bottom-0 inset-x-0 h-20 overflow-hidden pointer-events-none opacity-20">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 40 Q360 80 720 30 T1440 50 L1440 120 L0 120 Z" fill="#70072B" />
            <path d="M0 65 Q420 20 840 60 T1440 40 L1440 120 L0 120 Z" fill="#4A041C" />
          </svg>
        </div>
      </div>

      {/* ── 2. Lapisan Kedalaman Halus ── */}
      <div className="fixed inset-0 bg-black/10 pointer-events-none z-0" />

      {/* ── 3. Wadah Kerja Utama (Ruang Bebas Tabrakan HUD & Maskot) ── */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center max-w-5xl w-full mx-auto my-auto px-4 pt-12 sm:pt-14 pb-14 sm:pb-16 overflow-hidden">
        
        {/* ── SATU PAPAN PERMAINAN 3D UTUH (UNIFIED CREAM-WHITE TOY BOARD) ── */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 440, damping: 22 }}
          className="bg-[#FFFDF9] border-4 border-amber-300 shadow-[0_16px_0_rgba(131,24,67,0.35),0_24px_40px_rgba(0,0,0,0.22)] rounded-[2.25rem] p-4 sm:p-5 md:p-6 flex flex-col gap-4 sm:gap-5 max-w-4xl w-full mx-auto flex-shrink-0 z-20"
        >
          {/* ═════════════════════════════════════════════════════════════
              BARIS 1: BILAH HEADER INTERNAL PAPAN (BEBAS TABRAKAN)
             ═════════════════════════════════════════════════════════════ */}
          <div className="flex items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b-2 border-amber-100 flex-shrink-0 w-full">
            {/* Kiri: Tombol Taktil Biru Langit "Dengar Kata" */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSpeakTargetWord}
              aria-label={`Dengarkan pengucapan kata ${currentWord}`}
              className="px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-b from-sky-400 to-sky-500 border-2 border-white border-b-4 border-sky-700 text-white font-display font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer active:border-b-2 active:translate-y-0.5 select-none flex-shrink-0"
              title="Ketuk untuk mendengarkan pengucapan kata"
            >
              <Volume2 size={16} className="stroke-[2.5]" />
              <span>Dengar Kata</span>
            </motion.button>

            {/* Tengah: Kata Target Utuh Tipografi Fredoka (Warna Status Huruf) */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap min-w-0">
              {currentWord.split("").map((c, i) => {
                const isTyped = i < activeIndex;
                const isCurrent = i === activeIndex && !isWordComplete;

                return (
                  <motion.span
                    key={i}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      playXylophoneNote(i % 5);
                      speakLetter(c);
                    }}
                    className={`font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase cursor-pointer select-none transition-colors duration-200 tracking-wider ${
                      isTyped
                        ? "text-emerald-500 drop-shadow-xs"
                        : isCurrent
                        ? "text-amber-500 underline decoration-amber-400 decoration-4 underline-offset-8 animate-pulse drop-shadow-[0_2px_8px_rgba(251,191,36,0.7)]"
                        : "text-slate-800 hover:text-slate-900"
                    }`}
                    title={`Huruf ${c} (Ketuk untuk dengar suara)`}
                  >
                    {c}
                  </motion.span>
                );
              })}
            </div>

            {/* Kanan: Grup Progres Soal (5 Pip Lingkaran Ceria & Tombol Reset Taktil) */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
              <div className="flex flex-col items-end">
                <span className="font-display font-black text-[11px] sm:text-xs text-amber-900/85">
                  Soal {questionIndex + 1} / {TOTAL_QUESTIONS}
                </span>
                <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                  {Array.from({ length: TOTAL_QUESTIONS }).map((_, pIdx) => {
                    const isDone = pIdx < questionIndex || isWordComplete;
                    const isCurrent = pIdx === questionIndex && !isWordComplete;

                    return (
                      <div
                        key={pIdx}
                        className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full transition-all flex items-center justify-center font-display font-black text-[10px] select-none ${
                          isDone
                            ? "bg-gradient-to-b from-[#FEF08A] via-[#FBBF24] to-[#D97706] border border-amber-300 border-b-2 border-b-amber-700 text-amber-950 shadow-xs"
                            : isCurrent
                            ? "bg-gradient-to-b from-amber-200 to-amber-400 border border-white ring-2 ring-amber-400 ring-offset-1 text-amber-900 shadow-xs animate-pulse"
                            : "bg-amber-100/70 border border-dashed border-amber-300/80 text-amber-800/40"
                        }`}
                      >
                        {isDone ? (
                          <Check size={11} strokeWidth={3.5} className="text-emerald-900" />
                        ) : (
                          <span>{pIdx + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tombol Reset Taktil di Dalam Baris Header */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9, y: 1 }}
                onClick={handleResetCurrentWord}
                aria-label="Ketik ulang kata ini dari awal"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 border border-amber-200 border-b-3 border-amber-700 text-amber-950 shadow-sm cursor-pointer flex items-center justify-center active:border-b-1 flex-shrink-0"
                title="Ketik ulang kata ini dari awal"
              >
                <RotateCcw size={18} className="stroke-[2.5]" />
              </motion.button>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════
              BARIS 2: ARENA DUA KOLOM DI DALAM PAPAN (ILUSTRASI & BALOK 3D)
             ═════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-[160px_1fr] sm:grid-cols-[200px_1fr] md:grid-cols-[230px_1fr] gap-4 sm:gap-6 items-center flex-1 min-h-0">
            {/* Kolom Kiri: Ilustrasi Vektor SVG Terbingkai Indah */}
            <div className="flex flex-col items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={
                  isIllustrationBouncing
                    ? { scale: [1, 1.15, 1], rotate: [-4, 4, 0] }
                    : {}
                }
                transition={{ duration: 0.45, ease: "easeOut" }}
                onClick={handleSpeakTargetWord}
                className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-3xl bg-amber-50/90 border-3 border-amber-200 flex items-center justify-center p-3 sm:p-4 shadow-inner cursor-pointer relative group"
                title={`Ketuk untuk mendengarkan pengucapan kata ${currentWord}!`}
              >
                <WordIllustration word={currentWord} showBadge={false} className="w-full h-full object-contain drop-shadow-sm" />
              </motion.div>
            </div>

            {/* Kolom Kanan: Baki Slot Balok Huruf Mainan 3D */}
            <div className="flex flex-col items-center justify-center w-full">
              <div className="bg-rose-50/80 border-2 border-pink-200/80 rounded-3xl p-3 sm:p-4 md:p-5 flex items-center justify-center gap-2.5 sm:gap-3.5 md:gap-4 shadow-inner w-full flex-wrap">
                {currentWord.split("").map((char, index) => {
                  const isTyped = index < activeIndex;
                  const isActive = index === activeIndex && !isWordComplete;
                  const isUpcoming = index > activeIndex && !isWordComplete;
                  const isWobble = wobbleIndex === index;
                  const isTapped = tappedTileIndex === index;

                  return (
                    <motion.div
                      key={`${currentWord}-${index}`}
                      onClick={() => {
                        if (isTyped) {
                          handleCompletedBlockTap(index);
                        } else if (isActive) {
                          handleActiveBlockTap();
                        }
                      }}
                      whileHover={
                        isTyped
                          ? { y: -4, scale: 1.06, transition: { type: "spring", stiffness: 450 } }
                          : isActive
                          ? { scale: 1.05 }
                          : {}
                      }
                      animate={
                        isWobble
                          ? { x: [-7, 7, -4, 4, 0] }
                          : isTapped
                          ? { y: [0, 6, 0], scale: [1, 0.94, 1.07, 1] }
                          : isWordComplete
                          ? { y: [-10, 0, -5, 0], scale: [1, 1.06, 1] }
                          : isActive
                          ? {
                              scale: [1, 1.04, 1],
                              y: [0, -3, 0],
                            }
                          : {}
                      }
                      transition={
                        isWobble
                          ? { duration: 0.4, ease: "easeInOut" }
                          : isTapped
                          ? { duration: 0.3, ease: "easeOut" }
                          : isWordComplete
                          ? { duration: 0.6, delay: index * 0.08, repeat: 1, ease: "easeOut" }
                          : isActive
                          ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                          : { duration: 0.25 }
                      }
                      className={`relative w-15 h-20 sm:w-18 sm:h-24 md:w-20 md:h-26 rounded-2xl font-display font-black text-3xl sm:text-4xl md:text-5xl flex items-center justify-center select-none transition-all ${
                        isTyped
                          ? "bg-gradient-to-b from-emerald-400 to-emerald-500 border-2 border-emerald-200 border-b-[7px] border-b-emerald-700 text-white shadow-md active:translate-y-0.5 cursor-pointer"
                          : isActive
                          ? "bg-gradient-to-b from-[#FFFBEB] to-[#FDE68A] border-3 border-amber-400 border-b-[7px] border-b-amber-600 text-slate-900 shadow-[0_0_24px_rgba(253,224,71,0.8)] cursor-pointer"
                          : "bg-white border-2 border-pink-200 border-b-[7px] border-b-pink-300 text-slate-400/50 shadow-sm cursor-default"
                      }`}
                    >
                      {/* Tampilan Glif Huruf Sesuai Status */}
                      {isTyped ? (
                        <span className="drop-shadow-sm">{char}</span>
                      ) : isActive ? (
                        <span className="text-slate-900/40 font-black">{char}</span>
                      ) : isUpcoming ? (
                        <span className="text-slate-400/50 font-black">{char}</span>
                      ) : null}

                      {/* Kursor Garis Emas Berdenyut pada Slot Aktif */}
                      {isActive && (
                        <div className="absolute bottom-2.5 sm:bottom-3 inset-x-3.5 sm:inset-x-4 h-1.5 bg-amber-600 rounded-full animate-pulse shadow-xs" />
                      )}

                      {/* Lencana Centang Hijau pada Slot yang Sudah Selesai */}
                      {isTyped && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white border border-emerald-500 flex items-center justify-center text-emerald-600 shadow-sm"
                        >
                          <Check size={11} strokeWidth={3.5} />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Petunjuk Fisik Papan Ketik (Pengganti Bersih Badge INPUT) ── */}
        <div className="mt-3 sm:mt-4 px-5 py-2 rounded-full bg-white/95 border-2 border-pink-200 shadow-md flex items-center gap-2 pointer-events-none text-slate-800 font-display font-bold text-xs sm:text-sm flex-shrink-0 z-20">
          <Keyboard size={18} className="text-pink-600 stroke-[2.5]" />
          <span>Tekan huruf pada keyboard</span>
        </div>

      </div>

      {/* ── MASKOT PENDAMPING SAKA & TIKA (Interaktif & Berbayang Tanah) ── */}
      {/* Saka di Kiri Bawah dengan Balon Percakapan Dinamis */}
      <div className="fixed bottom-0 left-3 sm:left-6 z-20 select-none flex flex-col items-center pointer-events-none">
        {/* Balon Percakapan Saka */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          key={isWordComplete ? "done" : activeIndex}
          onClick={handleMascotTap}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-1 sm:mb-2 ml-4 relative bg-white/95 border-2 border-pink-300 rounded-2xl px-3.5 py-1.5 shadow-md pointer-events-auto cursor-pointer"
          title="Ketuk Saka untuk mendengar semangatnya!"
        >
          <p className="font-display font-bold text-xs sm:text-sm text-pink-700 whitespace-nowrap">
            {isWordComplete
              ? `Horeee! Kata ${currentWord} selesai!`
              : `Tekan huruf [${expectedChar}] ya!`}
          </p>
          <div className="absolute -bottom-1.5 left-5 w-3 h-3 bg-white border-r-2 border-b-2 border-pink-300 rotate-45" />
        </motion.div>

        <motion.img
          src="/assets/saka-maskot-1-cutout.png"
          alt="Saka Maskot"
          onClick={handleMascotTap}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          animate={
            isWordComplete || isChampion
              ? { y: [-18, 0, -10, 0], scale: [1, 1.06, 1] }
              : isMascotCheering
              ? { y: [-14, 0, -8, 0], scale: [1, 1.06, 1] }
              : { y: [0, -2.5, 0] }
          }
          transition={
            isWordComplete || isChampion
              ? { duration: 0.8, repeat: 2, ease: "easeOut" }
              : isMascotCheering
              ? { duration: 0.5, ease: "easeOut" }
              : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
          }
          className="h-28 sm:h-32 md:h-36 max-h-[150px] w-auto object-contain object-bottom drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] pointer-events-auto cursor-pointer"
          style={{ imageRendering: "-webkit-optimize-contrast" }}
          title="Ketuk Saka untuk menyapanya!"
        />
        <div className="w-20 sm:w-24 h-3 bg-[#4A041C]/40 rounded-full blur-[2px] -mt-1 pointer-events-none" />
      </div>

      {/* Tika di Kanan Bawah */}
      <div className="fixed bottom-0 right-3 sm:right-6 z-20 select-none flex flex-col items-center pointer-events-none">
        <motion.img
          src="/assets/tika-maskot-1-cutout.png"
          alt="Tika Maskot"
          onClick={handleMascotTap}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          animate={
            isWordComplete || isChampion
              ? { y: [-20, 0, -12, 0], scale: [1, 1.06, 1] }
              : isMascotCheering
              ? { y: [-16, 0, -9, 0], scale: [1, 1.06, 1] }
              : { y: [0, -3, 0] }
          }
          transition={
            isWordComplete || isChampion
              ? { duration: 0.8, delay: 0.08, repeat: 2, ease: "easeOut" }
              : isMascotCheering
              ? { duration: 0.5, delay: 0.06, ease: "easeOut" }
              : { duration: 3.5, repeat: Infinity, delay: 0.4, ease: "easeInOut" }
          }
          className="h-28 sm:h-32 md:h-36 max-h-[150px] w-auto object-contain object-bottom drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] pointer-events-auto cursor-pointer"
          style={{ imageRendering: "-webkit-optimize-contrast" }}
          title="Ketuk Tika untuk menyapanya!"
        />
        <div className="w-20 sm:w-24 h-3 bg-[#4A041C]/40 rounded-full blur-[2px] -mt-1 pointer-events-none" />
      </div>

      {/* ── Modal Perayaan Juara 5 Soal (Bebas Bintang, Bebas Emoji) ── */}
      <AnimatePresence>
        {isChampion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
            {/* Latar Belakang Gelap Transparan */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/45 backdrop-blur-xs"
            />

            {/* Kartu Utama Juara */}
            <motion.div
              initial={{ scale: 0.35, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              className="relative z-10 flex flex-col items-center justify-center text-center p-6 sm:p-8 max-w-lg w-full bg-gradient-to-b from-[#FFFDF8] via-[#FFF7ED] to-[#FEF3C7] rounded-[2.5rem] border-4 border-amber-300 border-b-8 border-b-amber-500 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-8 ring-amber-400/50"
            >
              {/* Pancaran Cahaya Matahari Berputar */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute w-72 h-72 sm:w-80 sm:h-80 -z-10 pointer-events-none opacity-40"
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

              {/* Vektor Piala Emas Juara 3D */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 mb-2 flex items-center justify-center">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
                  <defs>
                    <linearGradient id="trophyGold" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FDE047" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 28 22 L 72 22 L 68 52 C 68 62 58 68 50 68 C 42 68 32 62 32 52 Z"
                    fill="url(#trophyGold)"
                    stroke="#B45309"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M 28 30 C 18 30 18 48 28 50"
                    stroke="url(#trophyGold)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 72 30 C 82 30 82 48 72 50"
                    stroke="url(#trophyGold)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <rect x="46" y="68" width="8" height="14" fill="#D97706" />
                  <rect x="30" y="82" width="40" height="10" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="2" />
                  <ellipse cx="50" cy="22" rx="22" ry="4" fill="#FEF08A" stroke="#B45309" strokeWidth="2" />
                </svg>
              </div>

              {/* Judul Juara */}
              <h2 className="font-display font-black text-3xl sm:text-4xl text-[#9D174D] tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(251,191,36,0.5)]">
                JUARA MENGETIK!
              </h2>

              {/* Pesan Apresiasi Baku */}
              <p className="font-sans font-black text-sm sm:text-base text-amber-900 mt-2 leading-relaxed">
                Luar Biasa! Kamu Berhasil Menyelesaikan Semua 5 Soal dengan Sempurna!
              </p>

              {/* Lencana Semangat */}
              <div className="mt-3 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-sans font-bold text-xs shadow-md flex items-center gap-1.5">
                <Sparkles size={14} className="text-yellow-300" />
                <span>Hebat Sekali! Siap Berlatih Lagi?</span>
              </div>

              {/* Tombol Aksi "Main Lagi" */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={handleRestartGame}
                className="mt-5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-display font-black text-base sm:text-lg shadow-xl border-2 border-white flex items-center gap-2 cursor-pointer transition-transform"
              >
                <RotateCcw size={18} className="stroke-[2.5]" />
                <span>Main Lagi</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
