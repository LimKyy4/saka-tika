// src/views/modules/MengetikHurufView.jsx
// SAKA TIKA: High-Craft Children's Arcade Full-Word Typing Game with Living Interactive Stage
// 1. Unified Tactile Arcade Marquee Console ("Foto Kedua") with Word Illustration & Interactive Elements
// 2. Deep Recessed Arcade Slot Chassis ("Foto Ketiga") with Chunky Living 3D Toy Letter Cubes & LED Bulbs
// 3. Living Interactive Mascot Companion Stage (Saka with Dynamic Speech Bubble & Tap Celebrations)
// 4. Pop-able Ambient Bubbles & Spin-able 3D Toy Letter Blocks in the Living Background
// 5. Real-Time Keystroke Physics & Visual Input Activity Monitor
// 6. 5 Randomized Questions per Session with Standard Indonesian Vocabulary (Kata Baku KBBI)
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

// Daftar kosakata baku Bahasa Indonesia (3 s.d. 6 huruf) yang ramah anak usia dini (TK / PAUD)
const KATA_BAKU_INDONESIA = [
  "APEL", "AYAM", "AWAN",
  "BOLA", "BUKU", "BAJU", "BULAN", "BUNGA", "BEBEK",
  "CERI",
  "DONAT",
  "EMBER",
  "FOTO",
  "GIGI", "GITAR", "GAJAH",
  "HUJAN",
  "IKAN",
  "JERUK",
  "KAPAL", "KERETA", "KUDA", "KURSI", "KAKI", "KUE",
  "LEMON",
  "MATA", "MEJA",
  "NANAS",
  "OBOR",
  "POHON", "PISANG", "PAYUNG",
  "RODA", "ROTI", "RUMAH",
  "SAPI", "SUSU", "SEPATU",
  "TOPI",
  "UDANG",
  "VAS",
  "WAJAN", "WAYANG",
  "YOYO",
  "ZEBRA",
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
    return KATA_BAKU_INDONESIA[idx] || "KAPAL";
  });

  // State pengetikan untuk kata yang sedang aktif
  const [activeIndex, setActiveIndex] = useState(0); // 0 s.d. currentWord.length
  const [isWordComplete, setIsWordComplete] = useState(false);
  const [wobbleIndex, setWobbleIndex] = useState(null);
  const [tappedTileIndex, setTappedTileIndex] = useState(null);
  const [isMascotCheering, setIsMascotCheering] = useState(false);
  const [isChampion, setIsChampion] = useState(false);
  const [sparkleBursts, setSparkleBursts] = useState([]);

  // Komponen interaktif hidup tambahan
  const [lastPressedKey, setLastPressedKey] = useState(null);
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

      // Catat tombol yang ditekan untuk indikator visual aktivitas keyboard
      setLastPressedKey(pressedChar);
      setTimeout(() => setLastPressedKey(null), 350);

      if (pressedChar === expectedChar) {
        // Tombol yang ditekan benar!
        const nextIndex = activeIndex + 1;
        playXylophoneNote(activeIndex % 5);

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
        // Tombol yang ditekan salah: pantulan karet lembut & goyangan jeli
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
    loadWord(KATA_BAKU_INDONESIA[nextWordIdx] || "KAPAL");
  };

  // Gelembung latar belakang mengapung halus
  const ambientBubbles = useMemo(
    () => [
      { left: 7, bottom: 8, size: 24, duration: 7.2, delay: 0 },
      { left: 16, bottom: 12, size: 18, duration: 6.5, delay: 1.5 },
      { left: 26, bottom: 6, size: 30, duration: 8.0, delay: 0.7 },
      { left: 42, bottom: 14, size: 22, duration: 7.0, delay: 2.2 },
      { left: 58, bottom: 8, size: 32, duration: 8.5, delay: 1.1 },
      { left: 72, bottom: 16, size: 20, duration: 6.8, delay: 2.6 },
      { left: 82, bottom: 10, size: 28, duration: 7.8, delay: 0.4 },
      { left: 92, bottom: 12, size: 22, duration: 6.6, delay: 1.8 },
      { left: 34, bottom: 18, size: 18, duration: 6.2, delay: 3.0 },
      { left: 66, bottom: 20, size: 26, duration: 7.4, delay: 2.9 },
    ],
    []
  );

  return (
    <main className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none p-2 sm:p-3">
      {/* ── 1. Latar Belakang Magenta Arkade yang Hidup (Balok Mainan, Nada Musik, Gelembung Interaktif) ── */}
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
              ? { rotate: [0, 360], scale: [1, 1.25, 1], y: [-8, -20, -8] }
              : { y: [-8, 8, -8], rotate: [-4, 4, -4] }
          }
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          transition={
            spinBlockA
              ? { duration: 0.65, ease: "easeOut" }
              : { duration: 5.0, repeat: Infinity, ease: "easeInOut" }
          }
          className="absolute top-4 right-18 sm:top-6 sm:right-24 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-[#FCE7F3] to-[#FBCFE8] border-2 border-pink-300 border-b-4 border-b-pink-500 shadow-lg flex items-center justify-center opacity-85 pointer-events-auto cursor-pointer"
          title="Ketuk balok A untuk memutar dan mendengarkan suaranya!"
        >
          <span className="font-display font-black text-2xl sm:text-3xl text-pink-700">A</span>
        </motion.div>

        {/* Balok B */}
        <motion.div
          onClick={handleTapBlockB}
          animate={
            spinBlockB
              ? { rotate: [0, -360], scale: [1, 1.25, 1], y: [8, -16, 8] }
              : { y: [8, -8, 8], rotate: [5, -5, 5] }
          }
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          transition={
            spinBlockB
              ? { duration: 0.65, ease: "easeOut" }
              : { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
          }
          className="absolute top-8 right-5 sm:top-10 sm:right-8 w-15 h-15 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-b from-[#FEF08A] to-[#FDE047] border-2 border-amber-300 border-b-4 border-b-amber-500 shadow-lg flex items-center justify-center opacity-85 pointer-events-auto cursor-pointer"
          title="Ketuk balok B untuk memutar dan mendengarkan suaranya!"
        >
          <span className="font-display font-black text-2xl sm:text-3xl text-amber-900">B</span>
        </motion.div>

        {/* Notasi Musik Melayang Interaktif (Kiri Atas) */}
        <motion.div
          onClick={handleTapMusicNote}
          animate={
            spinMusicNote
              ? { rotate: [0, 18, -18, 0], scale: [1, 1.25, 1] }
              : { y: [-6, 6, -6], scale: [0.96, 1.04, 0.96] }
          }
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          transition={
            spinMusicNote
              ? { duration: 0.6, ease: "easeOut" }
              : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
          }
          className="absolute top-3 left-4 sm:top-5 sm:left-8 w-18 h-18 sm:w-22 sm:h-22 opacity-75 pointer-events-auto cursor-pointer drop-shadow-md"
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

        {/* 10 Gelembung Mikro Mengambang Interaktif (Dapat Diletuskan!) */}
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
                opacity: 0.55,
              }}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.7 }}
              animate={{
                y: [-10, -90, -170],
                x: [0, idx % 2 === 0 ? 14 : -14, 0],
                opacity: [0.35, 0.7, 0],
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

      {/* ── 2. Lapisan Kontras Halus ── */}
      <div className="fixed inset-0 bg-black/10 pointer-events-none z-0" />

      {/* ── 3. Wadah Kerja Utama ── */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col justify-between max-w-7xl w-full mx-auto">
        
        {/* ── BAGIAN HEADER ATAS: Konsol Arkade Taktil ("Foto Kedua" Overhaul) ── */}
        <header className="w-full px-2 mt-1 sm:mt-2 flex justify-center flex-shrink-0 z-30">
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="relative bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EE] to-[#FEF3C7] border-4 border-[#FBBF24] border-b-6 sm:border-b-8 border-b-[#D97706] shadow-[0_12px_28px_rgba(131,24,67,0.38),0_0_24px_rgba(251,191,36,0.25)] rounded-[2.2rem] px-4 sm:px-7 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6 max-w-2xl w-full"
          >
            {/* Hiasan Baut Arkade di Sudut Kiri & Kanan */}
            <div className="absolute top-2.5 left-3 w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-400 shadow-inner opacity-75" />
            <div className="absolute bottom-2.5 left-3 w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-400 shadow-inner opacity-75" />
            <div className="absolute top-2.5 right-3 w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-400 shadow-inner opacity-75" />
            <div className="absolute bottom-2.5 right-3 w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-400 shadow-inner opacity-75" />

            {/* Sisi Kiri: Kartu Ilustrasi Objek 3D & Tombol Suara Hidup Interaktif */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.08, rotate: -4 }}
                whileTap={{ scale: 0.92 }}
                animate={
                  isIllustrationBouncing
                    ? { scale: [1, 1.22, 1], rotate: [-8, 8, 0] }
                    : {}
                }
                transition={{ duration: 0.45, ease: "easeOut" }}
                onClick={handleSpeakTargetWord}
                className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100 border-2 border-amber-300 border-b-4 border-b-amber-500 shadow-md flex items-center justify-center cursor-pointer p-1 relative flex-shrink-0"
                title={`Ketuk untuk mendengarkan pengucapan kata ${currentWord}!`}
              >
                <WordIllustration word={currentWord} showBadge={false} className="w-full h-full" />
                {/* Lencana Mini Speaker di Sudut Gambar */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-b from-sky-400 to-blue-500 border border-white flex items-center justify-center text-white shadow-xs">
                  <Volume2 size={10} className="stroke-[2.5]" />
                </div>
              </motion.div>
            </div>

            {/* Bagian Tengah: Teks Kata Target dengan Glif Interaktif */}
            <div className="flex-1 flex items-center justify-center min-w-0">
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                {currentWord.split("").map((c, i) => {
                  const isTyped = i < activeIndex;
                  const isCurrent = i === activeIndex && !isWordComplete;

                  return (
                    <motion.span
                      key={i}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        playXylophoneNote(i % 5);
                        speakLetter(c);
                      }}
                      className={`font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase cursor-pointer select-none transition-colors duration-200 ${
                        isTyped
                          ? "text-emerald-500 drop-shadow-xs"
                          : isCurrent
                          ? "text-amber-500 underline decoration-amber-400 decoration-4 underline-offset-8 animate-pulse drop-shadow-[0_2px_10px_rgba(251,191,36,0.7)]"
                          : "text-slate-800 hover:text-slate-900"
                      }`}
                      title={`Huruf ${c} (Ketuk untuk mendengarkan suaranya)`}
                    >
                      {c}
                    </motion.span>
                  );
                })}
              </div>
            </div>

            {/* Sisi Kanan: Koin Arkade Emas 3D ("Soal 1/5") & Tombol Reset Taktil */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 flex-shrink-0">
              <div className="flex flex-col items-end">
                <span className="font-display font-bold text-xs text-amber-900/80">
                  Soal {questionIndex + 1}/{TOTAL_QUESTIONS}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  {Array.from({ length: TOTAL_QUESTIONS }).map((_, pIdx) => {
                    const isDone = pIdx < questionIndex || isWordComplete;
                    const isCurrent = pIdx === questionIndex && !isWordComplete;

                    return (
                      <motion.div
                        key={pIdx}
                        whileHover={{ scale: 1.15 }}
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all flex items-center justify-center font-display font-black text-[10px] ${
                          isDone
                            ? "bg-gradient-to-b from-[#FEF08A] via-[#FBBF24] to-[#D97706] border-2 border-amber-300 border-b-3 border-b-amber-700 text-amber-950 shadow-[0_2px_6px_rgba(217,119,6,0.5)]"
                            : isCurrent
                            ? "bg-gradient-to-b from-amber-200 to-amber-400 border-2 border-white ring-2 ring-amber-400 ring-offset-1 text-amber-900 shadow-md animate-pulse"
                            : "bg-white/60 border-2 border-dashed border-amber-300/80 text-amber-800/40"
                        }`}
                      >
                        {isDone ? (
                          <Check size={11} strokeWidth={3.5} className="text-emerald-800" />
                        ) : (
                          <span>{pIdx + 1}</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Tombol Aksi Ulangi Pengetikan Kata */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, rotate: 12 }}
                whileTap={{ scale: 0.9, y: 2 }}
                onClick={handleResetCurrentWord}
                aria-label="Ketik ulang kata ini dari awal"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-2 border-amber-200 border-b-4 border-amber-700 text-amber-950 shadow-md cursor-pointer flex items-center justify-center active:border-b-2 flex-shrink-0"
                title="Ketik ulang kata ini dari awal"
              >
                <RotateCcw size={20} className="stroke-[2.5]" />
              </motion.button>
            </div>
          </motion.div>
        </header>

        {/* ── BAGIAN TENGAH: Baki Kunci Arkade 3D & Balok Huruf Hidup ("Foto Ketiga" Overhaul) ── */}
        <section className="relative z-20 flex-1 min-h-0 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 my-auto">
          
          {/* Baki Kunci Arkade 3D Berbingkai Kedalaman Taktil (Recessed Arcade Chassis) */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="relative bg-gradient-to-b from-[#70072B]/75 via-[#831843]/85 to-[#4A041C]/95 backdrop-blur-md border-4 border-pink-300/50 border-b-8 border-b-pink-950/80 rounded-[2.8rem] px-6 sm:px-8 py-5 sm:py-6 shadow-[inset_0_4px_16px_rgba(0,0,0,0.55),0_20px_45px_rgba(74,4,28,0.5)] flex flex-col items-center justify-center gap-3"
          >
            {/* Deretan Lampu LED Arkade (Arcade Marquee Bulbs) */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-1">
              {[
                { bg: "bg-cyan-400 shadow-[0_0_8px_#22D3EE]" },
                { bg: "bg-amber-300 shadow-[0_0_8px_#FDE047]" },
                { bg: "bg-pink-400 shadow-[0_0_8px_#F472B6]" },
                { bg: "bg-emerald-400 shadow-[0_0_8px_#34D399]" },
                { bg: "bg-orange-400 shadow-[0_0_8px_#FB923C]" },
                { bg: "bg-cyan-400 shadow-[0_0_8px_#22D3EE]" },
                { bg: "bg-amber-300 shadow-[0_0_8px_#FDE047]" },
              ].map((bulb, bIdx) => (
                <motion.div
                  key={bIdx}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: bIdx * 0.25, ease: "easeInOut" }}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white/60 ${bulb.bg}`}
                />
              ))}
            </div>

            {/* Jajaran Balok Huruf 3D Ekstra Besar & Hidup */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 flex-wrap">
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
                        ? { y: -6, scale: 1.08, transition: { type: "spring", stiffness: 450 } }
                        : isActive
                        ? { scale: 1.05 }
                        : {}
                    }
                    animate={
                      isWobble
                        ? { x: [-10, 10, -7, 7, -3, 3, 0] }
                        : isTapped
                        ? { y: [-14, 0], scale: [1, 1.15, 1], rotate: [0, -4, 4, 0] }
                        : isTyped
                        ? { scale: [0.75, 1.2, 1] }
                        : isActive
                        ? {
                            scale: [1, 1.05, 1],
                            y: [0, -4, 0],
                          }
                        : {}
                    }
                    transition={
                      isWobble
                        ? { duration: 0.42, ease: "easeInOut" }
                        : isTapped
                        ? { duration: 0.35, ease: "easeOut" }
                        : isTyped
                        ? { duration: 0.35, ease: "easeOut" }
                        : isActive
                        ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.3 }
                    }
                    className={`relative w-20 h-26 sm:w-24 sm:h-30 md:w-28 md:h-34 lg:w-30 lg:h-38 rounded-[2rem] font-display font-black text-5xl sm:text-6xl md:text-7xl flex items-center justify-center select-none transition-all ${
                      isTyped
                        ? "bg-gradient-to-b from-emerald-400 via-teal-500 to-emerald-600 border-4 border-emerald-200 border-b-8 border-b-teal-800 text-white shadow-[0_10px_24px_rgba(6,78,59,0.35)] active:translate-y-1 cursor-pointer"
                        : isActive
                        ? "bg-gradient-to-b from-[#FFFDF0] via-[#FEF08A] to-[#FBBF24] border-4 border-amber-300 border-b-8 border-b-amber-600 shadow-[0_0_36px_rgba(251,191,36,0.9),0_12px_24px_rgba(180,83,9,0.35)] ring-4 ring-amber-300/80 cursor-pointer"
                        : "bg-white/20 backdrop-blur-xs border-2 border-white/40 border-b-6 border-b-white/25 shadow-inner cursor-default"
                    }`}
                  >
                    {/* Tampilan Glif Huruf Sesuai Status */}
                    {isTyped ? (
                      /* 1. Huruf putih tebal padat yang sudah berhasil diketik */
                      <span className="drop-shadow-md">{char}</span>
                    ) : isActive ? (
                      /* 2. Huruf samar tebal jelas (Ghost Hint) dengan pendar emas */
                      <span className="text-amber-950 font-black opacity-85 drop-shadow-xs">{char}</span>
                    ) : isUpcoming ? (
                      /* 3. Huruf samar lembut untuk melihat siluet kata */
                      <span className="text-white/65 font-black">{char}</span>
                    ) : null}

                    {/* Slot Aktif: Kursor Garis Emas Berdenyut */}
                    {isActive && (
                      <div className="absolute bottom-3.5 sm:bottom-4 inset-x-5 sm:inset-x-6 h-1.5 sm:h-2 bg-amber-600 rounded-full animate-pulse shadow-xs" />
                    )}

                    {/* Lencana Centang Hijau pada Slot yang Sudah Selesai */}
                    {isTyped && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-md"
                      >
                        <Check size={12} strokeWidth={3.5} />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Petunjuk Papan Ketik Baku & Indikator Ketikan Langsung (Live Feedback) */}
          <div className="mt-4 px-5 py-2 rounded-full bg-white/95 border-2 border-pink-200 shadow-md flex items-center gap-3 pointer-events-none text-slate-700 font-display font-bold text-xs sm:text-sm">
            <div className="flex items-center gap-1.5">
              <Keyboard size={18} className="text-pink-600 stroke-[2.5]" />
              <span>Tekan huruf pada papan ketik komputer</span>
            </div>
            {/* Lampu Indikator Ketikan Aktif */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-pink-200">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-sans font-bold">Input:</span>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center font-display font-black text-xs transition-all duration-150 ${
                  lastPressedKey
                    ? "bg-amber-400 text-amber-950 scale-125 shadow-[0_0_8px_#F59E0B]"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {lastPressedKey || "-"}
              </div>
            </div>
          </div>

        </section>

        {/* ── MASKOT PENDAMPING SAKA & TIKA (Interaktif & Dilengkapi Balon Bicara) ── */}
        {/* Saka di Kiri Bawah dengan Balon Percakapan Dinamis */}
        <div className="fixed bottom-0 left-3 sm:left-6 z-20 select-none flex flex-col items-center">
          {/* Balon Percakapan Saka */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={isWordComplete ? "done" : activeIndex}
            onClick={handleMascotTap}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-1 sm:mb-2 relative bg-white/95 border-2 border-pink-300 rounded-2xl px-3.5 py-1.5 shadow-md pointer-events-auto cursor-pointer"
            title="Ketuk Saka untuk mendengar semangatnya!"
          >
            <p className="font-display font-bold text-xs sm:text-sm text-pink-700 whitespace-nowrap">
              {isWordComplete
                ? `Horeee! Kata ${currentWord} selesai!`
                : `Tekan huruf [${expectedChar}] ya!`}
            </p>
            {/* Ekor Balon Percakapan */}
            <div className="absolute -bottom-1.5 left-5 w-3 h-3 bg-white border-r-2 border-b-2 border-pink-300 rotate-45" />
          </motion.div>

          <motion.img
            src="/assets/saka-maskot-1-cutout.png"
            alt="Saka Maskot"
            onClick={handleMascotTap}
            whileHover={{ scale: 1.06 }}
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
            className="max-h-28 sm:max-h-32 md:max-h-36 w-auto object-contain object-bottom drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] pointer-events-auto cursor-pointer"
            style={{ imageRendering: "-webkit-optimize-contrast", maxHeight: "140px", height: "18vh", width: "auto" }}
            title="Ketuk Saka untuk menyapanya!"
          />
          <div className="w-18 h-3.5 bg-[#4A041C]/40 rounded-full blur-[2px] -mt-1" />
        </div>

        {/* Tika di Kanan Bawah */}
        <div className="fixed bottom-0 right-3 sm:right-6 z-20 select-none flex flex-col items-center">
          <motion.img
            src="/assets/tika-maskot-1-cutout.png"
            alt="Tika Maskot"
            onClick={handleMascotTap}
            whileHover={{ scale: 1.06 }}
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
            className="max-h-28 sm:max-h-32 md:max-h-36 w-auto object-contain object-bottom drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] pointer-events-auto cursor-pointer"
            style={{ imageRendering: "-webkit-optimize-contrast", maxHeight: "140px", height: "18vh", width: "auto" }}
            title="Ketuk Tika untuk menyapanya!"
          />
          <div className="w-18 h-3.5 bg-[#4A041C]/40 rounded-full blur-[2px] -mt-1" />
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
                    {/* Cawan Piala */}
                    <path
                      d="M 28 22 L 72 22 L 68 52 C 68 62 58 68 50 68 C 42 68 32 62 32 52 Z"
                      fill="url(#trophyGold)"
                      stroke="#B45309"
                      strokeWidth="2.5"
                    />
                    {/* Gagang */}
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
                    {/* Batang & Alas */}
                    <rect x="46" y="68" width="8" height="14" fill="#D97706" />
                    <rect x="30" y="82" width="40" height="10" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="2" />
                    {/* Kilau Bibir Piala */}
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

      </div>
    </main>
  );
}
