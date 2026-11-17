// src/views/modules/MelengkapiKataView.jsx
// SAKA TIKA: Mint Sage Wooden Puzzle Workshop for "Melengkapi Kata" (Module 5)
// 1. Level 1 (1 Huruf Hilang), Level 2 (2 Huruf Hilang), Level 3 (3 Huruf Hilang) with Standard Indonesian Vocabulary
// 2. Zero "?" Symbol: Clean glowing mystery slots with warm golden pulsing underline cursor
// 3. Enlarged High-Visibility Question Banner & Oversized 3D Wooden Letter Blocks
// 4. Sequential Step-by-Step Multi-Slot Completion with Do-Re-Mi Xylophone Feedback
// 5. Living Workshop Atmosphere: Interactive Tap-able Floating Puzzle Pieces, Sparkles & Chimes
// 6. Interactive Mascots (Saka & Tika with Dynamic Encouragement Speech Bubble)
// 7. 5 Rounds per Session with Golden Token Progress Bar & Grand Champion Celebration Modal
// STRICT ZERO SCROLLBAR APP LOCK: h-screen w-screen overflow-hidden select-none.
// STRICT ZERO EMOJIS & ZERO STAR ICONS POLICY: Exclusively lucide-react icons or bespoke vector graphics.
// STRICT AUDIO CONTROL: Never auto-play voice narration or SFX on initial mount.

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  RotateCcw,
  Shuffle,
  CheckCircle2,
  Check,
  Sparkles,
  Puzzle,
  Layers,
} from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { speakWord, speakLetter } from "../../utils/speechEngine.js";
import {
  playSuccessSound,
  playFanfareSound,
  playRubberBoingSound,
  playHoverSound,
  playClickSound,
  playXylophoneNote,
  playSunChime,
  playBubblePopSound,
} from "../../utils/soundSynthesizer.js";
import { ShuffleQueue } from "../../utils/shuffleQueue.js";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";

const TOTAL_QUESTIONS = 5;

// Kurasi kosakata baku Bahasa Indonesia (4 s.d. 6 huruf) ramah anak usia dini (TK / PAUD)
const WORKSHOP_WORD_POOL = [
  // 4 Huruf (Sempurna untuk Level 1 & Level 2)
  { word: "APEL", illustrationKey: "apel", color: "#EF4444" },
  { word: "AYAM", illustrationKey: "ayam", color: "#F59E0B" },
  { word: "AWAN", illustrationKey: "awan", color: "#38BDF8" },
  { word: "BOLA", illustrationKey: "bola", color: "#3B82F6" },
  { word: "BUKU", illustrationKey: "buku", color: "#6366F1" },
  { word: "BAJU", illustrationKey: "baju", color: "#EC4899" },
  { word: "CERI", illustrationKey: "ceri", color: "#E11D48" },
  { word: "DADU", illustrationKey: "dadu", color: "#F59E0B" },
  { word: "DAUN", illustrationKey: "daun", color: "#10B981" },
  { word: "FOTO", illustrationKey: "foto", color: "#8B5CF6" },
  { word: "GIGI", illustrationKey: "gigi", color: "#14B8A6" },
  { word: "IKAN", illustrationKey: "ikan", color: "#0EA5E9" },
  { word: "KUDA", illustrationKey: "kuda", color: "#8B5CF6" },
  { word: "KAKI", illustrationKey: "kaki", color: "#EC4899" },
  { word: "MATA", illustrationKey: "mata", color: "#F59E0B" },
  { word: "MEJA", illustrationKey: "meja", color: "#D97706" },
  { word: "OBOR", illustrationKey: "obor", color: "#EF4444" },
  { word: "ROTI", illustrationKey: "roti", color: "#D97706" },
  { word: "RODA", illustrationKey: "roda", color: "#3B82F6" },
  { word: "SAPI", illustrationKey: "sapi", color: "#10B981" },
  { word: "SUSU", illustrationKey: "susu", color: "#06B6D4" },
  { word: "TOPI", illustrationKey: "topi", color: "#F59E0B" },
  { word: "YOYO", illustrationKey: "yoyo", color: "#F59E0B" },

  // 5 Huruf (Sempurna untuk Level 1, Level 2, dan Level 3)
  { word: "BEBEK", illustrationKey: "bebek", color: "#10B981" },
  { word: "BULAN", illustrationKey: "bulan", color: "#8B5CF6" },
  { word: "BUNGA", illustrationKey: "bunga", color: "#EC4899" },
  { word: "DONAT", illustrationKey: "donat", color: "#F59E0B" },
  { word: "EMBER", illustrationKey: "ember", color: "#3B82F6" },
  { word: "GAJAH", illustrationKey: "gajah", color: "#64748B" },
  { word: "GITAR", illustrationKey: "gitar", color: "#D97706" },
  { word: "HUJAN", illustrationKey: "hujan", color: "#0EA5E9" },
  { word: "JERUK", illustrationKey: "jeruk", color: "#F97316" },
  { word: "KAPAL", illustrationKey: "kapal", color: "#06B6D4" },
  { word: "KURSI", illustrationKey: "kursi", color: "#10B981" },
  { word: "LEMON", illustrationKey: "lemon", color: "#EAB308" },
  { word: "NANAS", illustrationKey: "nanas", color: "#F59E0B" },
  { word: "POHON", illustrationKey: "pohon", color: "#10B981" },
  { word: "RUMAH", illustrationKey: "rumah", color: "#EF4444" },
  { word: "UDANG", illustrationKey: "udang", color: "#F97316" },
  { word: "WAJAN", illustrationKey: "wajan", color: "#F59E0B" },
  { word: "ZEBRA", illustrationKey: "zebra", color: "#334155" },

  // 6 Huruf (Sempurna untuk Level 2 dan Level 3)
  { word: "KERETA", illustrationKey: "kereta", color: "#3B82F6" },
  { word: "PISANG", illustrationKey: "pisang", color: "#EAB308" },
  { word: "PAYUNG", illustrationKey: "payung", color: "#EF4444" },
  { word: "SEPATU", illustrationKey: "sepatu", color: "#8B5CF6" },
  { word: "WAYANG", illustrationKey: "wayang", color: "#D97706" },
];

// Palet warna cerah balok pilihan huruf mainan 3D
const TOY_CHOICE_PALETTES = [
  {
    bg: "from-[#7DD3FC] via-[#38BDF8] to-[#0284C7]",
    border: "border-[#BAE6FD] border-b-[#0369A1]",
    text: "#0F172A",
    shadow: "shadow-sky-400/35",
  },
  {
    bg: "from-[#FDE047] via-[#FBBF24] to-[#F59E0B]",
    border: "border-[#FEF08A] border-b-[#B45309]",
    text: "#0F172A",
    shadow: "shadow-amber-400/35",
  },
  {
    bg: "from-[#F472B6] via-[#EC4899] to-[#DB2777]",
    border: "border-[#FBCFE8] border-b-[#9D174D]",
    text: "#0F172A",
    shadow: "shadow-rose-400/35",
  },
  {
    bg: "from-[#6EE7B7] via-[#34D399] to-[#059669]",
    border: "border-[#A7F3D0] border-b-[#047857]",
    text: "#0F172A",
    shadow: "shadow-emerald-400/35",
  },
];

// Penghasil 3 huruf pengalih acak yang berbeda dari huruf target
function generateDistractors(targetLetter) {
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const available = allLetters.filter((l) => l !== targetLetter.toUpperCase());
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

export default function MelengkapiKataView() {
  const { addStars } = useGame();
  const { playSfx } = useAudio();

  // State Level: 1 (1 huruf hilang), 2 (2 huruf hilang), 3 (3 huruf hilang)
  const [level, setLevel] = useState(1);

  // Filter pool kata berdasarkan kebutuhan level
  const filteredPool = useMemo(() => {
    if (level === 3) {
      return WORKSHOP_WORD_POOL.filter((w) => w.word.length >= 5);
    }
    return WORKSHOP_WORD_POOL;
  }, [level]);

  // Antrean acak non-repetitif
  const shuffleQueueRef = useRef(null);
  if (!shuffleQueueRef.current || shuffleQueueRef.current.length !== filteredPool.length) {
    shuffleQueueRef.current = new ShuffleQueue(filteredPool.length);
  }

  // State Progres Sesi: 0 s.d. 4 (5 Soal per Sesi)
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(() => {
    return shuffleQueueRef.current ? shuffleQueueRef.current.next() : 0;
  });

  // State Permainan & Slot Hilang
  const [missingIndices, setMissingIndices] = useState([]);
  const [currentMissingStep, setCurrentMissingStep] = useState(0);
  const [solvedIndices, setSolvedIndices] = useState([]);
  const [options, setOptions] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wobbleLetter, setWobbleLetter] = useState(null);
  const [isMascotCheering, setIsMascotCheering] = useState(false);
  const [speechBubbleText, setSpeechBubbleText] = useState("Lengkapi huruf yang hilang ya!");
  const [isChampion, setIsChampion] = useState(false);

  // Komponen interaktif ekstra
  const [isIllustrationBouncing, setIsIllustrationBouncing] = useState(false);
  const [spinPuzzleIdx, setSpinPuzzleIdx] = useState(null);
  const [tappedTileIdx, setTappedTileIdx] = useState(null);

  // Ref untuk baki kayu & slot aktif agar drop detection sangat toleran (tidak harus akurat)
  const trayBoardRef = useRef(null);
  const activeSlotRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [isDraggingAny, setIsDraggingAny] = useState(false);

  const autoAdvanceTimer = useRef(null);

  // Kata aktif saat ini
  const currentItem = useMemo(() => {
    if (!filteredPool || filteredPool.length === 0) {
      return { word: "APEL", illustrationKey: "apel", color: "#EF4444" };
    }
    return filteredPool[currentIndex % filteredPool.length];
  }, [filteredPool, currentIndex]);

  const currentWordChars = useMemo(() => {
    return currentItem.word.split("");
  }, [currentItem.word]);

  // Huruf target untuk slot yang sedang aktif diisi
  const activeMissingIndex = useMemo(() => {
    return missingIndices[currentMissingStep] ?? -1;
  }, [missingIndices, currentMissingStep]);

  const expectedLetter = useMemo(() => {
    if (activeMissingIndex >= 0 && activeMissingIndex < currentWordChars.length) {
      return currentWordChars[activeMissingIndex];
    }
    return "";
  }, [currentWordChars, activeMissingIndex]);

  // Siapkan ronde permainan baru
  const setupRound = useCallback((item, currentLevel) => {
    const chars = item.word.split("");
    // Jumlah huruf hilang disesuaikan dengan level (maksimal panjang kata - 2 agar tetap ada huruf pemandu)
    const targetCount = Math.min(currentLevel, Math.max(1, chars.length - 2));

    // Pilih indeks huruf yang hilang secara acak dan urutkan dari kiri ke kanan
    const allIndices = Array.from({ length: chars.length }, (_, i) => i);
    const shuffled = [...allIndices].sort(() => 0.5 - Math.random());
    const pickedMissing = shuffled.slice(0, targetCount).sort((a, b) => a - b);

    setMissingIndices(pickedMissing);
    setCurrentMissingStep(0);
    setSolvedIndices([]);
    setIsAnswered(false);
    setIsCorrect(false);
    setWobbleLetter(null);
    setIsMascotCheering(false);
    setTappedTileIdx(null);

    // Buat opsi pilihan untuk slot huruf hilang pertama
    const firstTarget = chars[pickedMissing[0]] || "A";
    const distractors = generateDistractors(firstTarget);
    const combined = [firstTarget, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(combined);

    if (currentLevel === 1) {
      setSpeechBubbleText("Tarik atau ketuk 1 huruf yang hilang ya!");
    } else if (currentLevel === 2) {
      setSpeechBubbleText("Tarik atau ketuk huruf pertama yang hilang!");
    } else {
      setSpeechBubbleText("Tantangan Level 3! Tarik atau ketuk hurufnya!");
    }

    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  }, []);

  // Perbarui saat kata atau level berubah
  useEffect(() => {
    setupRound(currentItem, level);
  }, [currentItem, level, setupRound]);

  // Pergantian Level (Level 1, Level 2, Level 3)
  const handleSelectLevel = (newLevel) => {
    if (newLevel === level) return;
    playClickSound();
    setLevel(newLevel);
    setQuestionIndex(0);
    setIsChampion(false);
    if (shuffleQueueRef.current) {
      shuffleQueueRef.current.refill();
      setCurrentIndex(shuffleQueueRef.current.next());
    }
  };

  // Letupan kembang api confetti
  const triggerConfettiRockets = () => {
    const end = Date.now() + 1600;
    const colors = ["#34D399", "#38BDF8", "#FDE047", "#F472B6", "#FFFFFF"];

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.65 },
        colors,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.65 },
        colors,
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Pilih balok huruf (melalui klik layar atau tombol keyboard fisik)
  const handleSelectOption = useCallback(
    (letter) => {
      if (isAnswered || isChampion) return;

      if (letter === expectedLetter) {
        // Tombol yang dipilih benar!
        playXylophoneNote(currentMissingStep % 5);

        const newSolved = [...solvedIndices, activeMissingIndex];
        setSolvedIndices(newSolved);

        const nextStep = currentMissingStep + 1;

        if (nextStep < missingIndices.length) {
          // Masih ada huruf hilang berikutnya yang harus diisi pada kata ini
          setCurrentMissingStep(nextStep);
          const nextMissingIdx = missingIndices[nextStep];
          const nextTarget = currentWordChars[nextMissingIdx];
          const distractors = generateDistractors(nextTarget);
          setOptions([nextTarget, ...distractors].sort(() => 0.5 - Math.random()));

          setIsMascotCheering(true);
          setTimeout(() => setIsMascotCheering(false), 450);

          if (nextStep === missingIndices.length - 1) {
            setSpeechBubbleText("Hebat! Lengkapi 1 huruf terakhir ya!");
          } else {
            setSpeechBubbleText("Pintar! Sekarang huruf berikutnya!");
          }
        } else {
          // Seluruh huruf yang hilang pada kata berhasil dilengkapi!
          setIsAnswered(true);
          setIsCorrect(true);
          setIsMascotCheering(true);
          setSpeechBubbleText(`Mantap! Kata ${currentItem.word} lengkap!`);

          playSuccessSound();
          playFanfareSound();
          if (typeof addStars === "function") addStars(1);

          triggerConfettiRockets();
          speakWord(currentItem.word);

          // Tahan perayaan selama 2.2 detik sebelum lanjut ke soal berikutnya
          autoAdvanceTimer.current = setTimeout(() => {
            if (questionIndex < TOTAL_QUESTIONS - 1) {
              setQuestionIndex((q) => q + 1);
              if (shuffleQueueRef.current) {
                setCurrentIndex(shuffleQueueRef.current.next());
              }
            } else {
              // Menyelesaikan 5 soal pada level ini: Tampilkan Juara Lengkapi Kata!
              setIsChampion(true);
              triggerConfettiRockets();
            }
          }, 2200);
        }
      } else {
        // Pilihan salah: getaran karet lentur tanpa hukuman
        playRubberBoingSound();
        setWobbleLetter(letter);
        setSpeechBubbleText(`Bukan huruf ${letter}. Coba huruf yang lain ya!`);
        setTimeout(() => setWobbleLetter(null), 450);
      }
    },
    [
      isAnswered,
      isChampion,
      expectedLetter,
      currentMissingStep,
      solvedIndices,
      activeMissingIndex,
      missingIndices,
      currentWordChars,
      currentItem.word,
      questionIndex,
      addStars,
    ]
  );

  // Handle Drag-and-Drop dengan toleransi ekstra tinggi untuk anak-anak (tidak harus akurat)
  const handleDropOption = useCallback(
    (letter, info) => {
      if (isAnswered || isChampion) return;

      const dropX = info.point.x;
      const dropY = info.point.y;

      let isHit = false;

      // 1. Cek jarak ke slot aktif (Toleransi ekstra lebar: radius 220px dari pusat slot)
      if (activeSlotRef.current) {
        const sRect = activeSlotRef.current.getBoundingClientRect();
        const centerX = sRect.left + sRect.width / 2;
        const centerY = sRect.top + sRect.height / 2;
        const distance = Math.hypot(dropX - centerX, dropY - centerY);
        if (distance < 220) {
          isHit = true;
        }
      }

      // 2. Cek apakah dilepas di area baki kayu (dengan margin ekstra 60px ke segala arah)
      if (!isHit && trayBoardRef.current) {
        const tRect = trayBoardRef.current.getBoundingClientRect();
        if (
          dropX >= tRect.left - 60 &&
          dropX <= tRect.right + 60 &&
          dropY >= tRect.top - 60 &&
          dropY <= tRect.bottom + 80
        ) {
          isHit = true;
        }
      }

      // 3. Cek gesture drag ke atas (jika anak melempar/menarik ke separuh atas layar menuju kata)
      if (!isHit && dropY < window.innerHeight * 0.65) {
        isHit = true;
      }

      if (isHit) {
        handleSelectOption(letter);
      }
    },
    [handleSelectOption, isAnswered, isChampion]
  );

  // Input Keyboard Fisik (A-Z)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnswered || isChampion) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      const key = e.key?.toUpperCase();
      if (/^[A-Z]$/.test(key) && options.includes(key)) {
        handleSelectOption(key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, isAnswered, isChampion, handleSelectOption]);

  // Pengucapan audio manual untuk kata target dengan animasi loncat pada ilustrasi
  const handleSpeakWord = useCallback(() => {
    playClickSound();
    setIsIllustrationBouncing(true);
    speakWord(currentItem.word);
    setSpeechBubbleText(`Dengarkan kata: ${currentItem.word}!`);
    setTimeout(() => setIsIllustrationBouncing(false), 600);
  }, [currentItem.word]);

  // Atur ulang tebakan kata saat ini
  const handleResetCurrent = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    playHoverSound();
    setupRound(currentItem, level);
    setSpeechBubbleText("Ayo coba lagi, tebak huruf yang pas!");
  }, [currentItem, level, setupRound]);

  // Ganti ke kata berikutnya secara acak
  const handleNextWord = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    playHoverSound();
    if (shuffleQueueRef.current) {
      setCurrentIndex(shuffleQueueRef.current.next());
    }
  }, []);

  // Interaksi Maskot Saka / Tika saat diketuk
  const handleMascotTap = () => {
    playHoverSound();
    setIsMascotCheering(true);
    setTimeout(() => setIsMascotCheering(false), 600);
  };

  // Interaksi Kepingan Puzzle Melayang di Latar Belakang
  const handleTapPuzzlePiece = (pIdx) => {
    playXylophoneNote(pIdx % 5);
    setSpinPuzzleIdx(pIdx);
    setTimeout(() => setSpinPuzzleIdx(null), 700);
  };

  // Interaksi Balok Huruf di Baki Kayu
  const handleTileClick = (index, char) => {
    setTappedTileIdx(index);
    playXylophoneNote(index % 5);
    speakLetter(char);
    setTimeout(() => setTappedTileIdx(null), 400);
  };

  // Mulai Ulang Permainan setelah Juara 5 Soal
  const handleRestartGame = () => {
    playHoverSound();
    setQuestionIndex(0);
    setIsChampion(false);
    if (shuffleQueueRef.current) {
      shuffleQueueRef.current.refill();
      setCurrentIndex(shuffleQueueRef.current.next());
    }
  };

  return (
    <main className="relative w-screen h-screen max-h-screen overflow-hidden flex flex-col justify-between select-none p-2 sm:p-3">
      {/* ── 1. Latar Belakang Bengkel Kayu Mint Sage yang Hidup (Gradien + Sinar Panggung) ── */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(180deg, #34D399 0%, #10B981 35%, #059669 70%, #047857 100%)",
        }}
      />

      {/* Pendar Sorot Panggung Radial Hangat */}
      <motion.div
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 50% 46%, rgba(254, 243, 199, 0.45) 0%, rgba(167, 243, 208, 0.2) 48%, rgba(4, 120, 87, 0.8) 100%)",
        }}
      />

      {/* ── 2. Ornamen Kepingan Puzzle 3D Melayang Interaktif (Dapat Disentuh/Diputar!) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Kepingan Puzzle Kiri Atas */}
        <motion.div
          onClick={() => handleTapPuzzlePiece(0)}
          animate={
            spinPuzzleIdx === 0
              ? { rotate: [0, 360], scale: [1, 1.3, 1] }
              : { y: [-6, 6, -6], rotate: [-4, 4, -4] }
          }
          whileHover={{ scale: 1.15 }}
          transition={
            spinPuzzleIdx === 0
              ? { duration: 0.65, ease: "easeOut" }
              : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
          }
          className="absolute top-4 left-6 w-18 h-18 sm:w-22 sm:h-22 opacity-30 hover:opacity-75 pointer-events-auto cursor-pointer drop-shadow-md text-emerald-100"
          title="Ketuk kepingan puzzle untuk memutarnya!"
        >
          <Puzzle size={72} className="w-full h-full stroke-[1.5]" />
        </motion.div>

        {/* Kepingan Puzzle Kanan Atas */}
        <motion.div
          onClick={() => handleTapPuzzlePiece(1)}
          animate={
            spinPuzzleIdx === 1
              ? { rotate: [0, -360], scale: [1, 1.3, 1] }
              : { y: [6, -6, 6], rotate: [5, -5, 5] }
          }
          whileHover={{ scale: 1.15 }}
          transition={
            spinPuzzleIdx === 1
              ? { duration: 0.65, ease: "easeOut" }
              : { duration: 6.0, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
          }
          className="absolute top-4 right-6 w-18 h-18 sm:w-22 sm:h-22 opacity-30 hover:opacity-75 pointer-events-auto cursor-pointer drop-shadow-md text-emerald-100 -scale-x-100"
          title="Ketuk kepingan puzzle untuk memutarnya!"
        >
          <Puzzle size={72} className="w-full h-full stroke-[1.5]" />
        </motion.div>

        {/* Partikel Berkilau Melayang yang Dapat Diketuk */}
        {[
          { top: "12%", left: "14%", size: 14, color: "#FEF08A" },
          { top: "20%", left: "86%", size: 12, color: "#FFFFFF" },
          { top: "34%", left: "8%", size: 10, color: "#A7F3D0" },
          { top: "38%", left: "92%", size: 12, color: "#FDE047" },
        ].map((sp, sIdx) => (
          <motion.div
            key={sIdx}
            onClick={() => playSunChime()}
            whileHover={{ scale: 1.4 }}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              top: sp.top,
              left: sp.left,
              width: sp.size,
              height: sp.size,
            }}
            animate={{
              opacity: [0.3, 0.9, 0.3],
              scale: [0.85, 1.25, 0.85],
            }}
            transition={{
              duration: 3 + sIdx * 0.4,
              repeat: Infinity,
              delay: sIdx * 0.5,
              ease: "easeInOut",
            }}
            title="Kilau bengkel"
          >
            <svg viewBox="0 0 24 24" fill={sp.color} className="w-full h-full drop-shadow-xs">
              <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* ── 3. Bukit Padang Rumput Zamrud di Bagian Bawah ── */}
      <div className="fixed bottom-0 inset-x-0 pointer-events-none z-0 h-28 sm:h-36 overflow-hidden">
        <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="w-full h-full block">
          <path
            d="M0,90 C320,40 560,110 880,60 C1160,20 1340,80 1440,50 L1440,160 L0,160 Z"
            fill="#065F46"
            opacity="0.8"
          />
          <path
            d="M0,115 C260,80 620,135 960,95 C1220,65 1360,110 1440,90 L1440,160 L0,160 Z"
            fill="#047857"
            opacity="0.95"
          />
        </svg>
      </div>

      {/* ── 4. Wadah Konten Utama Interaktif ── */}
      <div className="relative z-10 flex-1 min-h-0 w-full max-w-5xl mx-auto flex flex-col justify-between">

        {/* ── TIER 1: Konsol Header Diperbesar dengan Pilihan Level 1, 2, 3 ── */}
        <header className="w-full px-2 pt-1 flex justify-center flex-shrink-0 z-30">
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="max-w-4xl w-full mx-auto px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-[2.2rem] bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EE] to-[#FEF3C7] border-4 border-[#FBBF24] border-b-6 sm:border-b-8 border-b-[#D97706] shadow-[0_12px_28px_rgba(6,78,59,0.35),0_0_24px_rgba(251,191,36,0.2)] flex items-center justify-between gap-3 sm:gap-6"
          >
            {/* Sisi Kiri: Kartu Ilustrasi Objek 3D & Tombol Suara */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <motion.button
                type="button"
                whileHover={{ scale: 1.08, rotate: -2 }}
                whileTap={{ scale: 0.94 }}
                animate={
                  isIllustrationBouncing
                    ? { scale: [1, 1.25, 1], rotate: [-8, 8, 0] }
                    : {}
                }
                transition={{ duration: 0.45, ease: "easeOut" }}
                onClick={handleSpeakWord}
                aria-label={`Dengarkan pengucapan kata ${currentItem.word}`}
                className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100 border-2 border-amber-300 border-b-4 border-b-amber-500 p-1 shadow-md cursor-pointer flex items-center justify-center relative group"
                title="Ketuk gambar untuk mendengarkan pengucapan kata!"
              >
                <WordIllustration
                  illustrationKey={currentItem.illustrationKey}
                  wordKey={currentItem.illustrationKey}
                  word={currentItem.word}
                  color={currentItem.color}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-b from-sky-400 to-blue-500 border border-white flex items-center justify-center text-white shadow-xs">
                  <Volume2 size={10} className="stroke-[2.5]" />
                </div>
              </motion.button>
            </div>

            {/* Bagian Tengah: Teks Pertanyaan Diperbesar & Pilihan Tab Level 1, 2, 3 */}
            <div className="flex flex-col items-center justify-center flex-1 text-center min-w-0">
              {/* Ukuran Pertanyaan Diperbesar Sesuai Permintaan */}
              <h1 className="font-display font-black text-base sm:text-xl md:text-2xl text-emerald-950 tracking-wide leading-tight drop-shadow-xs">
                Lengkapi Huruf yang Hilang!
              </h1>

              {/* Pemilih Tab Level 1, Level 2, Level 3 */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 mt-1.5">
                {[
                  { lvl: 1, label: "Level 1", sub: "1 Huruf Hilang" },
                  { lvl: 2, label: "Level 2", sub: "2 Huruf Hilang" },
                  { lvl: 3, label: "Level 3", sub: "3 Huruf Hilang" },
                ].map((tab) => {
                  const isActive = level === tab.lvl;
                  return (
                    <motion.button
                      key={tab.lvl}
                      type="button"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleSelectLevel(tab.lvl)}
                      className={`px-2.5 sm:px-3.5 py-1 rounded-xl font-display font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
                        isActive
                          ? "bg-gradient-to-b from-[#FDE047] via-[#FBBF24] to-[#F59E0B] border-2 border-amber-200 border-b-3 border-b-amber-700 text-amber-950 shadow-md scale-105"
                          : "bg-white/80 hover:bg-white text-emerald-900 border border-emerald-300/80 shadow-xs"
                      }`}
                      title={`Pilih ${tab.label}: ${tab.sub}`}
                    >
                      <span>{tab.label}</span>
                      <span className="hidden sm:inline font-sans font-bold text-[10px] text-amber-900/80">
                        ({tab.lvl} Huruf)
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Sisi Kanan: Koin Progres Emas ("Soal X/5") & Tombol Reset / Acak */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="flex flex-col items-end">
                <span className="font-display font-bold text-xs text-amber-900/80">
                  Soal {questionIndex + 1}/{TOTAL_QUESTIONS}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: TOTAL_QUESTIONS }).map((_, pIdx) => {
                    const isDone = pIdx < questionIndex || isCorrect;
                    const isCurrent = pIdx === questionIndex && !isCorrect;

                    return (
                      <motion.div
                        key={pIdx}
                        whileHover={{ scale: 1.15 }}
                        className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full transition-all flex items-center justify-center font-display font-black text-[9px] ${
                          isDone
                            ? "bg-gradient-to-b from-[#FEF08A] via-[#FBBF24] to-[#D97706] border border-amber-300 border-b-2 border-b-amber-700 text-amber-950 shadow-xs"
                            : isCurrent
                            ? "bg-amber-300 border border-white ring-2 ring-amber-400 text-amber-950 animate-pulse"
                            : "bg-white/70 border border-dashed border-amber-400/70 text-amber-900/40"
                        }`}
                      >
                        {isDone && <Check size={10} strokeWidth={3.5} className="text-emerald-900" />}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Tombol Reset */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, rotate: 12 }}
                whileTap={{ scale: 0.9, y: 1 }}
                onClick={handleResetCurrent}
                aria-label="Ulangi Kata Saat Ini"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 border-2 border-amber-200 border-b-3 border-b-amber-700 text-amber-950 shadow-md cursor-pointer flex items-center justify-center active:border-b-0 flex-shrink-0"
                title="Ulangi tebakan kata ini"
              >
                <RotateCcw size={18} className="stroke-[2.5]" />
              </motion.button>

              {/* Tombol Acak Kata */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, rotate: -8 }}
                whileTap={{ scale: 0.9, y: 1 }}
                onClick={handleNextWord}
                aria-label="Ganti Kata Berikutnya"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-b from-emerald-400 to-teal-500 border-2 border-emerald-200 border-b-3 border-teal-700 text-white shadow-md cursor-pointer flex items-center justify-center active:border-b-0 flex-shrink-0"
                title="Ganti ke kata acak berikutnya"
              >
                <Shuffle size={18} className="stroke-[2.5]" />
              </motion.button>
            </div>
          </motion.div>
        </header>

        {/* ── TIER 2: Baki Kayu 3D Honey-Pine Diperbesar & Balok Huruf Hidup ── */}
        <section className="flex-1 min-h-0 flex flex-col items-center justify-center relative px-3 py-2">
          
          {/* Banner Apresiasi Melayang ("HEBAT! KATA LENGKAP!") saat Jawaban Benar */}
          <AnimatePresence>
            {isCorrect && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.7, opacity: 0, y: -15 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="absolute -top-6 sm:-top-8 inset-x-0 mx-auto w-fit z-30 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white px-5 sm:px-8 py-2 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-2 pointer-events-none"
              >
                <CheckCircle2 size={22} className="text-yellow-300 stroke-[2.5]" />
                <span className="font-display font-black text-base sm:text-lg md:text-xl tracking-wide uppercase">
                  HEBAT! KATA {currentItem.word} LENGKAP!
                </span>
                <Sparkles size={20} className="text-yellow-300 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Baki Kayu 3D Honey-Pine Diperbesar Ukurannya */}
          <motion.div
            ref={trayBoardRef}
            layout
            className={`relative bg-gradient-to-b from-[#D97706] to-[#B45309] border-4 border-[#FDE68A] border-b-8 border-b-[#78350F] rounded-[2.5rem] px-6 sm:px-10 py-5 sm:py-7 shadow-[0_18px_36px_rgba(6,78,59,0.38)] max-w-4xl w-full mx-auto transition-all ${
              isDraggingAny ? "ring-4 ring-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.6)]" : ""
            }`}
          >
            {/* Pantulan Cahaya Kilau Atas */}
            <div className="absolute top-2 inset-x-10 h-1 bg-white/40 rounded-full pointer-events-none" />

            {/* Baut Pasak Sudut Kayu */}
            <div className="absolute top-3.5 left-3.5 w-3 h-3 rounded-full bg-[#78350F] opacity-75 shadow-inner" />
            <div className="absolute top-3.5 right-3.5 w-3 h-3 rounded-full bg-[#78350F] opacity-75 shadow-inner" />
            <div className="absolute bottom-3.5 left-3.5 w-3 h-3 rounded-full bg-[#78350F] opacity-75 shadow-inner" />
            <div className="absolute bottom-3.5 right-3.5 w-3 h-3 rounded-full bg-[#78350F] opacity-75 shadow-inner" />

            {/* Alas Cekung Baki Tempat Balok Bertengger */}
            <div className="bg-[#78350F]/40 border-2 border-[#5B330F]/45 rounded-2xl p-3.5 sm:p-5 shadow-inner flex items-center justify-center gap-3 sm:gap-4 md:gap-5 flex-wrap">
              {currentWordChars.map((char, index) => {
                const isMissing = missingIndices.includes(index);
                const isSolved = solvedIndices.includes(index);
                const isActiveSlot = index === activeMissingIndex;
                const isTapped = tappedTileIdx === index;

                if (isMissing) {
                  return (
                    <motion.div
                      key={`missing-${index}`}
                      ref={isActiveSlot ? activeSlotRef : null}
                      animate={
                        isSolved
                          ? {
                              scale: [0.65, 1.15, 1],
                              rotate: [0, 4, -4, 0],
                              y: [12, -4, 0],
                            }
                          : isActiveSlot
                          ? {
                              scale: isDraggingAny ? [1.08, 1.16, 1.08] : [1, 1.05, 1],
                              y: [0, -3, 0],
                            }
                          : {}
                      }
                      transition={
                        isSolved
                          ? { duration: 0.5, ease: "easeOut" }
                          : isActiveSlot
                          ? { duration: isDraggingAny ? 0.8 : 1.8, repeat: Infinity, ease: "easeInOut" }
                          : { duration: 0.3 }
                      }
                      className={`relative w-16 h-22 sm:w-20 sm:h-26 md:w-24 md:h-30 lg:w-26 lg:h-32 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl transition-all select-none ${
                        isSolved
                          ? "bg-gradient-to-b from-[#34D399] to-[#059669] border-4 border-emerald-200 border-b-8 border-b-[#065F46] text-white shadow-xl cursor-pointer"
                          : isActiveSlot
                          ? isDraggingAny
                            ? "bg-gradient-to-b from-[#FFFBEB] via-[#FEF08A] to-[#FDE047] border-4 border-dashed border-amber-500 shadow-[0_0_45px_rgba(253,224,71,1)] ring-8 ring-amber-400/80 cursor-default scale-105"
                            : "bg-gradient-to-b from-[#FFFDF0] via-[#FEF9C3] to-[#FEF08A] border-4 border-dashed border-amber-400 shadow-[0_0_30px_rgba(253,224,71,0.85)] ring-4 ring-amber-300/80 cursor-default"
                          : "bg-white/20 border-3 border-dashed border-white/50 opacity-60 cursor-default"
                      }`}
                      title={
                        isSolved
                          ? `Huruf ${char} (Selesai)`
                          : isActiveSlot
                          ? "Slot huruf yang sedang dicari! (Pilih hurufnya di bawah)"
                          : "Slot huruf yang belum ditebak"
                      }
                    >
                      {/* Tampilan Huruf yang Telah Dipecahkan */}
                      {isSolved ? (
                        <>
                          <span className="relative z-10">{char}</span>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border-2 border-white flex items-center justify-center shadow-md text-amber-950"
                          >
                            <Check size={12} strokeWidth={3.5} />
                          </motion.div>
                        </>
                      ) : isActiveSlot ? (
                        /* Slot Aktif: Garis Emas Berdenyut + Hint Teks saat Drag */
                        <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                          <span className="w-10 sm:w-14 h-2 sm:h-2.5 rounded-full bg-amber-500 animate-pulse shadow-xs" />
                          {isDraggingAny && (
                            <span className="font-display font-black text-[9px] sm:text-[11px] text-amber-900 tracking-wider uppercase animate-bounce drop-shadow-xs">
                              LEPAS DI SINI!
                            </span>
                          )}
                        </div>
                      ) : (
                        /* Slot Belum Aktif: Garis Putih Halus Samar */
                        <span className="w-8 sm:w-10 h-1.5 sm:h-2 rounded-full bg-white/40" />
                      )}
                    </motion.div>
                  );
                }

                // Balok Huruf Kayu yang Sudah Diketahui (Ukuran Diperbesar & Taktil)
                return (
                  <motion.div
                    key={`known-${index}`}
                    onClick={() => handleTileClick(index, char)}
                    whileHover={{ scale: 1.06, y: -4 }}
                    animate={
                      isCorrect
                        ? {
                            y: [0, -14, 0],
                            scale: [1, 1.08, 1],
                          }
                        : isTapped
                        ? { y: [-12, 0], scale: [1, 1.15, 1] }
                        : {}
                    }
                    transition={
                      isCorrect
                        ? {
                            delay: index * 0.08,
                            duration: 0.5,
                            ease: "easeOut",
                          }
                        : isTapped
                        ? { duration: 0.35, ease: "easeOut" }
                        : {}
                    }
                    className="relative w-16 h-22 sm:w-20 sm:h-26 md:w-24 md:h-30 lg:w-26 lg:h-32 rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FFFDF8] border-4 border-amber-200 border-b-8 border-b-amber-400 text-slate-800 shadow-md flex items-center justify-center font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl select-none cursor-pointer"
                    title={`Huruf ${char} (Ketuk untuk membunyikan suara)`}
                  >
                    {/* Tekstur Halus Balok Kayu */}
                    <img
                      src="/assets/balok-kayu-3d.png"
                      alt="Balok Kayu"
                      draggable="false"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-25"
                    />
                    <span className="relative z-10">{char}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </section>

        {/* ── TIER 3: 4 Balok Pilihan Huruf Mainan 3D Ekstra Besar ── */}
        <footer className="w-full max-w-xl sm:max-w-2xl mx-auto flex flex-col items-center justify-center pb-2 sm:pb-3 px-2 flex-shrink-0 z-20">
          
          {/* Label Panduan */}
          <div className="flex items-center gap-1.5 mb-2 bg-white/95 px-4 py-1.5 rounded-full border border-emerald-300 shadow-xs">
            <Sparkles size={14} className="text-emerald-600" />
            <span className="font-display font-black text-xs sm:text-sm text-[#065F46] tracking-wide uppercase">
              Tarik atau Ketuk Huruf yang Tepat:
            </span>
          </div>

          {/* 4 Balok Mainan 3D Pilihan Huruf (Mendukung Drag-and-Drop & Ketukan Langsung) */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 flex-wrap">
            {options.map((letter, optIdx) => {
              const isMatchingTarget = isCorrect && letter === expectedLetter;
              const isWobble = wobbleLetter === letter;
              const palette = TOY_CHOICE_PALETTES[optIdx % TOY_CHOICE_PALETTES.length];

              return (
                <motion.div
                  key={`${letter}-${optIdx}`}
                  drag={!isAnswered && !isChampion}
                  dragSnapToOrigin={true}
                  dragElastic={0.45}
                  whileHover={!isAnswered ? { scale: 1.12, y: -4 } : {}}
                  whileTap={!isAnswered ? { scale: 0.96 } : {}}
                  whileDrag={{
                    scale: 1.22,
                    zIndex: 100,
                    rotate: 4,
                    boxShadow: "0 24px 45px rgba(0,0,0,0.38)",
                    cursor: "grabbing",
                  }}
                  onDragStart={() => {
                    isDraggingRef.current = true;
                    setIsDraggingAny(true);
                  }}
                  onDragEnd={(e, info) => {
                    setTimeout(() => {
                      isDraggingRef.current = false;
                    }, 60);
                    setIsDraggingAny(false);
                    handleDropOption(letter, info);
                  }}
                  onClick={() => {
                    if (!isDraggingRef.current) {
                      handleSelectOption(letter);
                    }
                  }}
                  animate={
                    isWobble
                      ? {
                          x: [-8, 8, -6, 6, -3, 3, 0],
                          rotate: [-4, 4, -3, 3, 0],
                        }
                      : isMatchingTarget
                      ? {
                          scale: [1, 1.2, 1],
                          y: [0, -14, 0],
                        }
                      : {}
                  }
                  transition={{ duration: isWobble ? 0.45 : 0.3 }}
                  className={`w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl sm:rounded-3xl font-display font-black text-3xl sm:text-4xl md:text-5xl border-3 sm:border-4 border-b-8 active:border-b-0 active:translate-y-1.5 transition-shadow flex items-center justify-center select-none cursor-grab active:cursor-grabbing shadow-xl relative aspect-square touch-none ${
                    isMatchingTarget
                      ? "bg-gradient-to-b from-[#34D399] to-[#059669] border-emerald-200 border-b-emerald-800 text-white shadow-emerald-400"
                      : `bg-gradient-to-b ${palette.bg} ${palette.border} ${palette.shadow}`
                  }`}
                  style={{ color: isMatchingTarget ? "#FFFFFF" : palette.text }}
                  title={`Tarik atau ketuk huruf ${letter}`}
                >
                  {/* Kilau Cahaya Sudut Atas */}
                  <div className="absolute top-1 inset-x-3 h-1 bg-white/50 rounded-full pointer-events-none" />

                  <span>{letter}</span>

                  {isMatchingTarget && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-xs pointer-events-none"
                    >
                      <Check size={13} strokeWidth={3} className="text-white" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

        </footer>

      </div>

      {/* ── 5. Maskot Saka & Tika Interaktif dengan Balon Percakapan Dinamis ── */}
      {/* Saka di Kiri Bawah */}
      <div className="absolute bottom-1 left-2 sm:left-4 z-10 select-none flex flex-col items-center">
        {/* Balon Percakapan Saka */}
        <AnimatePresence mode="wait">
          <motion.div
            key={speechBubbleText}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            onClick={handleMascotTap}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-1.5 px-3.5 py-1.5 rounded-2xl bg-white/95 border-2 border-emerald-300 shadow-md flex items-center gap-1.5 max-w-[210px] text-center cursor-pointer pointer-events-auto"
            title="Ketuk Saka untuk mendengar semangatnya!"
          >
            <span className="font-sans font-bold text-[11px] sm:text-xs text-[#065F46] leading-tight">
              {speechBubbleText}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Gambar Maskot Saka */}
        <div className="relative flex flex-col items-center">
          <motion.img
            src="/assets/saka-maskot-1-cutout.png"
            alt="Maskot Saka"
            draggable="false"
            onClick={handleMascotTap}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            animate={isMascotCheering ? { y: [0, -12, 0] } : { y: [0, -3, 0] }}
            transition={{
              duration: isMascotCheering ? 0.4 : 3.0,
              repeat: isMascotCheering ? 3 : Infinity,
              ease: "easeInOut",
            }}
            className="w-22 h-30 sm:w-28 sm:h-40 md:w-34 md:h-48 object-contain object-bottom pointer-events-auto cursor-pointer select-none drop-shadow-lg"
            title="Ketuk Saka untuk menyapanya!"
          />
          <div className="w-20 sm:w-24 h-3.5 bg-black/25 rounded-full blur-[2px] -mt-1 pointer-events-none" />
        </div>
      </div>

      {/* Tika di Kanan Bawah */}
      <div className="absolute bottom-1 right-2 sm:right-4 z-10 select-none flex flex-col items-center">
        <div className="relative flex flex-col items-center">
          <motion.img
            src="/assets/tika-maskot-1-cutout.png"
            alt="Maskot Tika"
            draggable="false"
            onClick={handleMascotTap}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            animate={isMascotCheering ? { y: [0, -12, 0], scale: [1, 1.05, 1] } : { y: [0, -3, 0] }}
            transition={{
              duration: isMascotCheering ? 0.4 : 3.2,
              repeat: isMascotCheering ? 3 : Infinity,
              ease: "easeInOut",
              delay: 0.15,
            }}
            className="w-22 h-30 sm:w-28 sm:h-40 md:w-34 md:h-48 object-contain object-bottom pointer-events-auto cursor-pointer select-none drop-shadow-lg"
            title="Ketuk Tika untuk menyapanya!"
          />
          <div className="w-20 sm:w-24 h-3.5 bg-black/25 rounded-full blur-[2px] -mt-1 pointer-events-none" />
        </div>
      </div>

      {/* ── 6. Modal Perayaan Juara 5 Soal (Bebas Bintang, Bebas Emoji) ── */}
      <AnimatePresence>
        {isChampion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/45 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.35, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              className="relative z-10 flex flex-col items-center justify-center text-center p-6 sm:p-8 max-w-lg w-full bg-gradient-to-b from-[#FFFDF8] via-[#FFF9EE] to-[#FEF3C7] rounded-[2.5rem] border-4 border-amber-300 border-b-8 border-b-amber-500 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-8 ring-amber-400/50"
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
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-[#065F46] tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(251,191,36,0.5)]">
                JUARA LENGKAPI KATA!
              </h2>

              <p className="font-sans font-black text-sm sm:text-base text-amber-950 mt-2 leading-relaxed">
                Luar Biasa! Kamu Berhasil Menyelesaikan 5 Soal pada Level {level} dengan Sempurna!
              </p>

              <div className="mt-3 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-sans font-bold text-xs shadow-md flex items-center gap-1.5">
                <Sparkles size={14} className="text-yellow-300" />
                <span>Siap mencoba tantangan level berikutnya?</span>
              </div>

              {/* Tombol Aksi */}
              <div className="flex items-center gap-3 mt-5">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleRestartGame}
                  className="px-5 py-2.5 rounded-2xl bg-white border-2 border-emerald-400 text-emerald-800 font-display font-black text-sm sm:text-base shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={16} className="stroke-[2.5]" />
                  <span>Main Lagi</span>
                </motion.button>

                {level < 3 && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleSelectLevel(level + 1)}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-display font-black text-sm sm:text-base shadow-xl border-2 border-white flex items-center gap-2 cursor-pointer"
                  >
                    <Layers size={16} className="stroke-[2.5]" />
                    <span>Lanjut Level {level + 1}</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
