// src/views/modules/MengenalHurufView.jsx
// SAKA TIKA: "Mengenal Huruf A-Z" - Full 26-Letter Single-Screen Board (No Mascots, No Slides),
// 100% Beat-Synced "Play Lagu" + Intro/Outro RGB & Default-ON Auto-Loop.
// STRICT ZERO SCROLLBAR APP LOCK: h-screen w-screen overflow-hidden select-none.
// STRICT ZERO EMOJIS & ZERO STAR ICONS POLICY: Only lucide-react icons (no Star) and custom vectors.

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Music,
  Square,
  RotateCcw,
  Repeat,
} from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { ALPHABET_DATA } from "../../data/masterDataset.js";
import {
  CALIBRATED_ABC_SONG_DURATION,
  ABC_SONG_BEAT_SEC,
  resolveSongLetterIndex,
} from "../../data/abcSongTimeline.js";
import { speakLetter, speakWord } from "../../utils/speechEngine.js";
import BlueStorybookBackground from "../../components/background/BlueStorybookBackground.jsx";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";

// 4 balanced horizontal rows across all 26 letters: 7 + 7 + 6 + 6
const ALPHABET_ROWS = [
  { offset: 0, items: ALPHABET_DATA.slice(0, 7) },   // Row 1: A - G
  { offset: 7, items: ALPHABET_DATA.slice(7, 14) },  // Row 2: H - N
  { offset: 14, items: ALPHABET_DATA.slice(14, 20) }, // Row 3: O - T
  { offset: 20, items: ALPHABET_DATA.slice(20, 26) }, // Row 4: U - Z
];

export default function MengenalHurufView() {
  const { addStars, discoverLetter, isLetterDiscovered } = useGame();
  const { playSfx, isBgmEnabled, setIsBgmDucked } = useAudio();

  const [selectedLetter, setSelectedLetter] = useState(null);

  // "Play Lagu" full-board state
  const [isSongMode, setIsSongMode] = useState(false);
  const [activeSongLetterIndex, setActiveSongLetterIndex] = useState(-1);
  const [isLoopEnabled, setIsLoopEnabled] = useState(true);
  const [outroBubbleIndices, setOutroBubbleIndices] = useState([]);
  const isLoopEnabledRef = useRef(isLoopEnabled);
  const audioRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    isLoopEnabledRef.current = isLoopEnabled;
  }, [isLoopEnabled]);

  const songPhase =
    activeSongLetterIndex < 0
      ? "intro"
      : activeSongLetterIndex >= 26
      ? "outro"
      : "singing";

  // During Outro phase after Z, pop 3-5 random cards simultaneously across the 26-card board
  useEffect(() => {
    if (!isSongMode || songPhase !== "outro") {
      setOutroBubbleIndices([]);
      return;
    }

    const pickRandomBubbles = () => {
      const bubbleCount = 3 + Math.floor(Math.random() * 3); // 3 to 5 simultaneous bubbles
      const picked = new Set();
      while (picked.size < bubbleCount) {
        picked.add(Math.floor(Math.random() * 26));
      }
      setOutroBubbleIndices(Array.from(picked));
    };

    pickRandomBubbles();
    const intervalId = setInterval(pickRandomBubbles, 400);
    return () => clearInterval(intervalId);
  }, [isSongMode, songPhase]);

  const [celebrationState, setCelebrationState] = useState(null);

  const launchGrandCelebration = useCallback(
    (type) => {
      playSfx("fanfare");
      playSfx("success");

      confetti({
        particleCount: 90,
        angle: 60,
        spread: 70,
        origin: { x: 0.15, y: 0.6 },
        colors: ["#F59E0B", "#EF4444", "#10B981", "#38BDF8", "#EC4899"],
      });
      confetti({
        particleCount: 90,
        angle: 120,
        spread: 70,
        origin: { x: 0.85, y: 0.6 },
        colors: ["#F59E0B", "#EF4444", "#10B981", "#38BDF8", "#EC4899"],
      });
      confetti({
        particleCount: 110,
        spread: 95,
        origin: { y: 0.45 },
        colors: ["#FDE047", "#F59E0B", "#38BDF8", "#34D399", "#F43F5E"],
      });

      setCelebrationState({ type });
    },
    [playSfx]
  );

  // Stop & reset /audio/lagu-abc.mp3 and restore BGM cleanly
  const stopAbcSong = useCallback(
    (exitSongMode = true) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } catch {
          // Ignore teardown errors on partially loaded media elements
        }
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current = null;
      }
      setIsBgmDucked(false);
      setActiveSongLetterIndex(-1);
      setOutroBubbleIndices([]);
      if (exitSongMode) {
        setIsSongMode(false);
      }
    },
    [setIsBgmDucked]
  );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isBgmEnabled;
    }
  }, [isBgmEnabled]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch {
          // Ignore pause errors on unmount
        }
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current = null;
      }
      setIsBgmDucked(false);
    };
  }, [setIsBgmDucked]);

  // Start /audio/lagu-abc.mp3 on the full 26-card board with 60 FPS cue sync
  const startAbcSong = useCallback(() => {
    stopAbcSong(false);
    setSelectedLetter(null);
    setCelebrationState(null);
    setIsSongMode(true);
    setActiveSongLetterIndex(-1);
    setIsBgmDucked(true);

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const audio = new Audio("/audio/lagu-abc.mp3");
    audio.preload = "auto";
    audio.volume = 0.92;
    audio.muted = !isBgmEnabled;
    audioRef.current = audio;

    const tick = () => {
      const el = audioRef.current;
      if (!el) return;

      const dur =
        Number.isFinite(el.duration) && el.duration > 0
          ? el.duration
          : CALIBRATED_ABC_SONG_DURATION;

      const nextIdx = resolveSongLetterIndex(el.currentTime, dur);
      setActiveSongLetterIndex((prev) => (prev === nextIdx ? prev : nextIdx));

      if (!el.paused && !el.ended) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    audio.onended = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (isLoopEnabledRef.current) {
        audio.currentTime = 0;
        setActiveSongLetterIndex(-1);
        setOutroBubbleIndices([]);
        audio
          .play()
          .then(() => {
            rafRef.current = requestAnimationFrame(tick);
          })
          .catch(() => stopAbcSong(true));
        return;
      }

      stopAbcSong(true);
      launchGrandCelebration("song");
    };

    audio.onerror = () => {
      stopAbcSong(true);
    };

    audio
      .play()
      .then(() => {
        rafRef.current = requestAnimationFrame(tick);
      })
      .catch(() => {
        // Fallback muted so visual choreography still runs if audio autoplay is blocked
        audio.muted = true;
        audio
          .play()
          .then(() => {
            rafRef.current = requestAnimationFrame(tick);
          })
          .catch(() => {
            stopAbcSong(true);
          });
      });
  }, [stopAbcSong, setIsBgmDucked, isBgmEnabled, launchGrandCelebration]);

  const handleToggleSongMode = useCallback(() => {
    playSfx("click");
    if (isSongMode) {
      stopAbcSong(true);
    } else {
      startAbcSong();
    }
  }, [isSongMode, playSfx, stopAbcSong, startAbcSong]);

  // All 26 letter cards are unlocked and freely clickable at any time
  const handleCardClick = useCallback(
    (letterObj) => {
      if (isSongMode) {
        stopAbcSong(true);
      }
      playSfx("click");
      setSelectedLetter(letterObj);
      speakLetter(letterObj);

      if (!isLetterDiscovered(letterObj.letter)) {
        discoverLetter(letterObj.letter);
        addStars(1);
      }
    },
    [isSongMode, stopAbcSong, playSfx, isLetterDiscovered, discoverLetter, addStars]
  );

  // Navigate freely across all 26 letters inside the detail modal
  const handleNavigateModalLetter = useCallback(
    (direction) => {
      if (!selectedLetter) return;
      playSfx("click");
      const currentIndex = ALPHABET_DATA.findIndex(
        (item) => item.letter === selectedLetter.letter
      );
      const newIndex = currentIndex + direction;
      if (newIndex < 0 || newIndex >= ALPHABET_DATA.length) return;

      const nextLetterObj = ALPHABET_DATA[newIndex];
      setSelectedLetter(nextLetterObj);
      speakLetter(nextLetterObj);

      if (!isLetterDiscovered(nextLetterObj.letter)) {
        discoverLetter(nextLetterObj.letter);
        addStars(1);
      }
    },
    [selectedLetter, playSfx, isLetterDiscovered, discoverLetter, addStars]
  );

  const handleCloseDetailModal = useCallback(() => {
    playSfx("click");
    setSelectedLetter(null);
  }, [playSfx]);

  return (
    <main className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none p-2 sm:p-3">
      {/* Base Layer: Dedicated Royal & Sky Blue Storybook Background */}
      <BlueStorybookBackground />

      {/* Subtle Depth Tint Layer */}
      <div className="fixed inset-0 bg-[#0A3464]/10 backdrop-blur-[0.5px] pointer-events-none z-0" />

      {/* Full-Width Centered 26-Letter Adventure Board (Zero Characters, Zero Slides) */}
      <section className="relative z-10 max-w-6xl w-full flex-1 min-h-0 mx-auto my-auto bg-white/92 backdrop-blur-md border-4 border-sky-200 shadow-[0_14px_0_rgba(15,65,140,0.28)] rounded-[2rem] px-5 py-3.5 md:px-7 md:py-4 flex flex-col justify-between overflow-hidden">
        <style>{`
          @keyframes abcPastelRgbAura {
            0% {
              border-color: #FDA4AF;
              box-shadow: 0 0 14px rgba(253, 164, 175, 0.55), 0 4px 0 #F43F5E44;
            }
            25% {
              border-color: #FCD34D;
              box-shadow: 0 0 14px rgba(252, 211, 77, 0.55), 0 4px 0 #F59E0B44;
            }
            50% {
              border-color: #6EE7B7;
              box-shadow: 0 0 14px rgba(110, 231, 183, 0.55), 0 4px 0 #10B98144;
            }
            75% {
              border-color: #7DD3FC;
              box-shadow: 0 0 14px rgba(125, 211, 252, 0.55), 0 4px 0 #0EA5E944;
            }
            100% {
              border-color: #C4B5FD;
              box-shadow: 0 0 14px rgba(196, 181, 253, 0.55), 0 4px 0 #8B5CF644;
            }
          }
          .abc-pastel-rgb-aura {
            border-width: 2.5px;
            animation: abcPastelRgbAura 3.4s linear infinite alternate;
          }
        `}</style>

        {/* Board Top Header Row: "Play Lagu" / "Stop Lagu" + Default-ON "Loop: ON" Pills */}
        <div className="shrink-0 flex items-center justify-end gap-3 mb-2.5 w-full">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.94, y: 1 }}
            transition={{ type: "spring", stiffness: 450, damping: 16 }}
            onClick={handleToggleSongMode}
            aria-label={isSongMode ? "Hentikan Lagu ABC" : "Putar Lagu ABC"}
            className={`px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full border-2 border-white border-b-4 font-display font-extrabold text-xs sm:text-sm text-white shadow-md flex items-center gap-1.5 cursor-pointer select-none transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
              isSongMode
                ? "bg-gradient-to-b from-rose-600 to-red-700 border-b-red-900"
                : "bg-gradient-to-b from-[#B45309] to-[#9A3412] border-b-[#7C2D12]"
            }`}
          >
            {isSongMode ? (
              <>
                <Square size={13} aria-hidden="true" className="fill-current" />
                <span>Stop Lagu</span>
              </>
            ) : (
              <>
                <Music size={15} aria-hidden="true" className="stroke-[2.5]" />
                <span>Play Lagu</span>
              </>
            )}
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.94, y: 1 }}
            transition={{ type: "spring", stiffness: 450, damping: 16 }}
            onClick={() => {
              playSfx("click");
              setIsLoopEnabled((prev) => !prev);
            }}
            aria-pressed={isLoopEnabled}
            aria-label={
              isLoopEnabled
                ? "Matikan ulang otomatis Lagu ABC"
                : "Nyalakan ulang otomatis Lagu ABC"
            }
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-b-4 font-display text-xs sm:text-sm shadow-md flex items-center gap-1.5 cursor-pointer select-none transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
              isLoopEnabled
                ? "bg-gradient-to-b from-[#0369A1] to-[#1D4ED8] border-white border-b-[#1E3A8A] text-white font-extrabold"
                : "bg-white border-slate-200 border-b-slate-300 text-slate-700 font-bold"
            }`}
          >
            <Repeat size={13} aria-hidden="true" className="stroke-[2.6]" />
            <span>{isLoopEnabled ? "Loop: ON" : "Loop: OFF"}</span>
          </motion.button>
        </div>

        {/* 4 Balanced Rows Displaying All 26 Letters (Aa - Zz) Simultaneously */}
        <div className="flex-1 min-h-0 flex flex-col justify-between gap-2.5 md:gap-3 overflow-visible py-1">
          {ALPHABET_ROWS.map((row) => (
            <div
              key={row.offset}
              className="flex items-center justify-center gap-2.5 md:gap-3.5 flex-1 min-h-0"
            >
              {row.items.map((letterObj, slotIdx) => {
                const globalIndex = row.offset + slotIdx;
                return (
                  <ToyLetterCard
                    key={letterObj.letter}
                    item={letterObj}
                    globalIndex={globalIndex}
                    isSongMode={isSongMode}
                    songPhase={songPhase}
                    activeSongLetterIndex={activeSongLetterIndex}
                    isOutroBubble={
                      isSongMode &&
                      songPhase === "outro" &&
                      outroBubbleIndices.includes(globalIndex)
                    }
                    onClick={() => handleCardClick(letterObj)}
                    onHover={() => playSfx("hover")}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Floating Letter Detail Card Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <LetterDetailModal
            letterObj={selectedLetter}
            onClose={handleCloseDetailModal}
            onNavigate={handleNavigateModalLetter}
            playSfx={playSfx}
          />
        )}
      </AnimatePresence>

      {/* Grand Celebration Finale Modal (Shown on Play Lagu Completion when Loop is OFF) */}
      <AnimatePresence>
        {celebrationState && (
          <GrandCelebrationModal
            onReplaySong={() => {
              playSfx("click");
              startAbcSong();
            }}
            onContinue={() => {
              playSfx("click");
              setCelebrationState(null);
              if (isSongMode) {
                stopAbcSong(true);
              }
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

// 3D Illustrated Toy Letter Card Component (All Unlocked + Play Lagu Choreography, Zero Star Icons)
function ToyLetterCard({
  item,
  globalIndex,
  isSongMode,
  songPhase,
  activeSongLetterIndex,
  isOutroBubble,
  onClick,
  onHover,
}) {
  const isSongIntro = isSongMode && songPhase === "intro";
  const isSongOutro = isSongMode && songPhase === "outro";
  const isSongActive =
    isSongMode && songPhase === "singing" && globalIndex === activeSongLetterIndex;
  const isSongSung =
    isSongMode && songPhase === "singing" && globalIndex < activeSongLetterIndex;

  return (
    <motion.button
      type="button"
      whileHover={!isSongMode ? { scale: 1.05, y: -3 } : {}}
      whileTap={{ scale: 0.95, y: 1 }}
      animate={
        isSongIntro
          ? { rotate: [-3.5, 3.5, -3.5], y: [0, -3, 0], scale: 1 }
          : isSongActive
          ? { scale: 1.05, y: -4, rotate: 0 }
          : isSongOutro && isOutroBubble
          ? { scale: 1.1, y: -5, rotate: 0 }
          : { scale: 1, y: 0, rotate: 0 }
      }
      transition={
        isSongIntro
          ? {
              duration: ABC_SONG_BEAT_SEC * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : isSongOutro && isOutroBubble
          ? { type: "spring", stiffness: 360, damping: 12 }
          : isSongMode
          ? { type: "spring", stiffness: 540, damping: 24 }
          : { type: "spring", stiffness: 450, damping: 18 }
      }
      onMouseEnter={onHover}
      onClick={onClick}
      aria-label={`Huruf ${item.letter} untuk ${item.word}`}
      className={`relative group w-[13%] max-w-[146px] h-full rounded-2xl px-2 py-1.5 md:px-2.5 md:py-2 flex flex-col items-center justify-between cursor-pointer select-none transition-colors ${
        isSongActive
          ? "border-[3px] border-amber-400 border-b-4 border-b-amber-500 ring-4 ring-yellow-300/95 bg-gradient-to-b from-amber-50 via-yellow-100 to-amber-100 shadow-[0_0_26px_rgba(251,191,36,0.95)] z-20"
          : isSongOutro && isOutroBubble
          ? "abc-pastel-rgb-aura ring-4 ring-cyan-300/90 bg-gradient-to-b from-cyan-50 via-white to-amber-50 shadow-[0_0_22px_rgba(56,189,248,0.65)] z-20"
          : isSongIntro || isSongOutro
          ? "abc-pastel-rgb-aura bg-white/95"
          : isSongSung
          ? "bg-sky-50/90 border-2 border-sky-300 border-b-4 border-b-sky-400 shadow-xs"
          : isSongMode
          ? "bg-white/95 border-2 border-slate-200 border-b-4 border-b-slate-300 shadow-xs"
          : "border-2 border-b-4 shadow-xs hover:shadow-md"
      }`}
      style={
        !isSongMode
          ? {
              backgroundColor: `${item.color}16`,
              borderColor: item.color,
              borderTop: "1.5px solid rgba(255,255,255,0.85)",
              borderLeft: "1.5px solid rgba(255,255,255,0.85)",
              borderRight: "1.5px solid rgba(255,255,255,0.85)",
            }
          : undefined
      }
    >
      <div className="absolute top-1 inset-x-2 h-[1px] bg-white/80 rounded-full pointer-events-none" />

      {isSongActive && (
        <span
          aria-hidden="true"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-600 border-2 border-white text-white flex items-center justify-center shadow-md z-30"
        >
          <Music size={12} className="stroke-[2.8]" />
        </span>
      )}

      {/* Bold Colored Uppercase + Lowercase Title (Aa) */}
      <div className="flex items-baseline justify-center z-10 leading-none pt-0.5">
        <span
          className="font-display font-black text-2xl md:text-3xl leading-none drop-shadow-xs"
          style={{ color: item.color }}
        >
          {item.letter}
        </span>
        <span
          className="font-display font-bold text-lg md:text-xl opacity-85 ml-0.5 leading-none"
          style={{ color: item.color }}
        >
          {item.lowercase}
        </span>
      </div>

      {/* 2D Cartoon Bitmap Vocabulary Illustration */}
      <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform drop-shadow-xs z-10 my-auto">
        <WordIllustration
          illustrationKey={item.illustrationKey}
          word={item.word}
          color={item.color}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Crisp Indonesian Vocabulary Label */}
      <span className="font-sans font-bold text-xs md:text-sm text-slate-700 leading-tight max-w-full truncate z-10 pb-0.5">
        {item.word}
      </span>
    </motion.button>
  );
}

// Floating Detail Card Modal (Clean Header: Zero Cluttered Small Descriptive Texts)
function LetterDetailModal({ letterObj, onClose, onNavigate, playSfx }) {
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(null);
  const [isSpeakingSequence, setIsSpeakingSequence] = useState(false);
  const sequenceTimersRef = useRef([]);

  const currentIndex = useMemo(
    () => ALPHABET_DATA.findIndex((item) => item.letter === letterObj.letter),
    [letterObj.letter]
  );

  const clearTimers = useCallback(() => {
    sequenceTimersRef.current.forEach((t) => clearTimeout(t));
    sequenceTimersRef.current = [];
    setIsSpeakingSequence(false);
    setActiveHighlightIndex(null);
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [letterObj, clearTimers]);

  const handleWordClick = useCallback(
    (example, index) => {
      clearTimers();
      playSfx("click");
      setActiveHighlightIndex(index);

      speakWord({ letter: letterObj.letter, word: example.word });

      const timer = setTimeout(() => {
        setActiveHighlightIndex(null);
      }, 1600);
      sequenceTimersRef.current.push(timer);
    },
    [letterObj.letter, playSfx, clearTimers]
  );

  const handlePlayAllSequence = useCallback(() => {
    clearTimers();
    playSfx("click");
    setIsSpeakingSequence(true);

    speakLetter(letterObj);

    const t1 = setTimeout(() => {
      if (!letterObj.examples[0]) return;
      setActiveHighlightIndex(0);
      speakWord({ letter: letterObj.letter, word: letterObj.examples[0].word });
    }, 1500);

    const t2 = setTimeout(() => {
      if (!letterObj.examples[1]) return;
      setActiveHighlightIndex(1);
      speakWord({ letter: letterObj.letter, word: letterObj.examples[1].word });
    }, 3300);

    const t3 = setTimeout(() => {
      if (!letterObj.examples[2]) return;
      setActiveHighlightIndex(2);
      speakWord({ letter: letterObj.letter, word: letterObj.examples[2].word });
    }, 5100);

    const t4 = setTimeout(() => {
      setActiveHighlightIndex(null);
      setIsSpeakingSequence(false);
    }, 6900);

    sequenceTimersRef.current = [t1, t2, t3, t4];
  }, [letterObj, playSfx, clearTimers]);

  const examples = letterObj.examples || [
    { word: letterObj.word, illustrationKey: letterObj.illustrationKey },
  ];

  const CARD_THEMES = [
    {
      cardBg: "from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA]/60",
      border: "border-orange-300",
      borderB: "border-b-orange-400",
    },
    {
      cardBg: "from-[#FEFCE8] via-[#FEF9C3] to-[#FEF08A]/60",
      border: "border-amber-300",
      borderB: "border-b-amber-400",
    },
    {
      cardBg: "from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0]/60",
      border: "border-emerald-300",
      borderB: "border-b-emerald-400",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/50 backdrop-blur-sm select-none">
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
        className="max-w-2xl sm:max-w-3xl w-full max-h-[85vh] rounded-[2rem] bg-gradient-to-b from-sky-50 via-white to-amber-50/60 border-4 border-white shadow-2xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden relative"
      >
        <div className="absolute top-1 inset-x-4 h-[1.5px] bg-white/80 rounded-full pointer-events-none" />

        {/* Clean Modal Header: Large 3D Letter Tile (Left) & Tika + Audio + Close (Right) */}
        <div
          className="flex items-center justify-between p-2.5 sm:p-3.5 rounded-2xl border-2 border-white/80 shadow-xs flex-shrink-0 relative overflow-visible"
          style={{
            background: `linear-gradient(135deg, ${letterObj.color}20 0%, ${letterObj.color}08 100%)`,
          }}
        >
          {/* Left: Prominent Glossy 3D Letter Tile (Aa) */}
          <div
            className="px-4 py-2 rounded-2xl flex items-baseline gap-1 shadow-sm border-2 border-white"
            style={{
              backgroundColor: `${letterObj.color}25`,
              boxShadow: `0 4px 0 ${letterObj.color}40`,
            }}
          >
            <span
              className="font-display font-black text-4xl sm:text-5xl leading-none drop-shadow-xs"
              style={{ color: letterObj.color }}
            >
              {letterObj.letter}
            </span>
            <span
              className="font-display font-bold text-2xl sm:text-3xl leading-none opacity-85 ml-0.5"
              style={{ color: letterObj.color }}
            >
              {letterObj.lowercase}
            </span>
          </div>

          {/* Right: Cheerful Tika Mascot, Speaker Button & Close Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.img
              src="/assets/icon-tika-utama.png"
              alt="Tika Mascot"
              draggable="false"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="h-12 sm:h-14 w-auto object-contain object-bottom drop-shadow hidden sm:inline-block pointer-events-none select-none"
            />

            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                clearTimers();
                playSfx("click");
                speakLetter(letterObj);
              }}
              aria-label={`Ulangi bunyi huruf ${letterObj.letter}`}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-b from-[#FEF3C7] to-[#FDE68A] border-b-4 border-[#D97706] text-[#92400E] font-display font-black text-xs sm:text-sm shadow-sm active:border-b-0 active:translate-y-1 cursor-pointer transition-transform"
            >
              <Volume2 size={16} aria-hidden="true" className="text-[#B45309]" />
              <span className="hidden sm:inline">Bunyi Huruf</span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              aria-label="Tutup jendela detail huruf"
              className="w-9 h-9 rounded-full bg-gradient-to-b from-rose-400 to-rose-600 hover:from-rose-500 hover:to-rose-700 border-b-2 border-rose-800 text-white flex items-center justify-center cursor-pointer transition-all shadow-sm"
            >
              <X size={18} aria-hidden="true" strokeWidth={2.8} />
            </motion.button>
          </div>
        </div>

        {/* 3-Column Maximized Example Word Cards with 2D Cartoon Bitmap Illustrations */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 my-auto py-3 sm:py-4 flex-1 min-h-0 items-stretch">
          {examples.map((ex, idx) => {
            const isHighlighted = activeHighlightIndex === idx;
            const initialLetter = ex.word.charAt(0);
            const remainingLetters = ex.word.slice(1);
            const theme = CARD_THEMES[idx % CARD_THEMES.length];

            return (
              <motion.button
                key={ex.word + idx}
                type="button"
                animate={
                  isHighlighted
                    ? { scale: 1.05, y: -5 }
                    : { scale: 1, y: 0 }
                }
                transition={{ type: "spring", stiffness: 450, damping: 18 }}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleWordClick(ex, idx)}
                aria-label={`Contoh kata ${ex.word}`}
                className={`group relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl border-3 cursor-pointer transition-all select-none bg-gradient-to-b ${theme.cardBg} ${theme.border} ${theme.borderB} border-b-6 shadow-sm hover:shadow-md ${
                  isHighlighted
                    ? "ring-4 ring-amber-400 ring-offset-2 shadow-[0_0_24px_rgba(251,191,36,0.6)]"
                    : ""
                }`}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center p-1.5 bg-white/85 rounded-2xl shadow-inner border border-white group-hover:scale-108 transition-transform">
                  <WordIllustration
                    illustrationKey={ex.illustrationKey}
                    word={ex.word}
                    color={letterObj.color}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="mt-2 text-center">
                  <span className="font-display font-black text-xl sm:text-2xl lg:text-3xl leading-none drop-shadow-2xs">
                    <span
                      className="inline-block transition-transform"
                      style={{ color: letterObj.color || "#EF4444" }}
                    >
                      {initialLetter}
                    </span>
                    <span className="text-[#1E293B]">{remainingLetters}</span>
                  </span>
                </div>

                <div
                  className={`mt-2 flex items-center gap-1 px-3 py-1 rounded-full text-[11px] sm:text-xs font-sans font-extrabold transition-colors shadow-2xs ${
                    isHighlighted
                      ? "bg-[#1E293B] text-white"
                      : "bg-white/90 group-hover:bg-white text-slate-700 border border-slate-200"
                  }`}
                >
                  <Volume2 size={12} aria-hidden="true" />
                  <span>Dengar</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Modal Footer: Prev / Dengarkan Semua / Next Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-shrink-0 gap-2">
          <motion.button
            type="button"
            disabled={currentIndex <= 0}
            whileHover={currentIndex > 0 ? { scale: 1.04, x: -2 } : {}}
            whileTap={currentIndex > 0 ? { scale: 0.96 } : {}}
            onClick={() => onNavigate(-1)}
            aria-label="Huruf Sebelumnya"
            className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-2xl font-display font-bold text-xs sm:text-sm shadow-2xs transition-all ${
              currentIndex > 0
                ? "bg-white hover:bg-slate-50 border-2 border-slate-200 text-[#1B4965] cursor-pointer"
                : "bg-slate-100 border-2 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            <ChevronLeft size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 1 }}
            onClick={handlePlayAllSequence}
            aria-label="Dengarkan nama huruf dan semua contoh kata secara berurutan"
            className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-2xl font-display font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all border-b-[3px] ${
              isSpeakingSequence
                ? "bg-gradient-to-b from-[#10B981] to-[#059669] text-white border-[#047857] animate-pulse"
                : "bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white border-[#0369A1]"
            }`}
          >
            <Play size={14} aria-hidden="true" className="fill-current" />
            <span>{isSpeakingSequence ? "Memutar Suara..." : "Dengarkan Semua"}</span>
          </motion.button>

          <motion.button
            type="button"
            disabled={currentIndex >= 25}
            whileHover={currentIndex < 25 ? { scale: 1.04, x: 2 } : {}}
            whileTap={currentIndex < 25 ? { scale: 0.96 } : {}}
            onClick={() => onNavigate(1)}
            aria-label="Huruf Selanjutnya"
            className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-2xl font-display font-bold text-xs sm:text-sm shadow-2xs transition-all ${
              currentIndex < 25
                ? "bg-white hover:bg-slate-50 border-2 border-slate-200 text-[#1B4965] cursor-pointer"
                : "bg-slate-100 border-2 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <ChevronRight size={16} aria-hidden="true" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// Grand Celebration Finale Overlay (Zero Star Icons, Zero Emojis)
function GrandCelebrationModal({ onReplaySong, onContinue }) {
  return (
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
        className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-7 max-w-md w-full bg-[#FFFDF9] rounded-[2rem] border-4 border-amber-300 border-b-8 border-b-amber-500 shadow-[0_20px_50px_rgba(15,23,42,0.35)] ring-8 ring-amber-400/40"
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
              <linearGradient id="mengenalCrackerRed" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="50%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#991B1B" />
              </linearGradient>
              <linearGradient id="mengenalCrackerGold" x1="0" y1="0" x2="1" y2="1">
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
              <rect x="52" y="28" width="16" height="64" rx="4" fill="url(#mengenalCrackerRed)" stroke="#7F1D1D" strokeWidth="1.5" />
              <rect x="52" y="34" width="16" height="8" fill="url(#mengenalCrackerGold)" />
              <rect x="52" y="78" width="16" height="8" fill="url(#mengenalCrackerGold)" />
              <path d="M 60 28 Q 60 18 68 14" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="68" cy="14" r="3" fill="#FEF08A" />
            </g>

            <g transform="translate(60, 60) rotate(25) translate(-60, -60)">
              <rect x="52" y="28" width="16" height="64" rx="4" fill="url(#mengenalCrackerRed)" stroke="#7F1D1D" strokeWidth="1.5" />
              <rect x="52" y="34" width="16" height="8" fill="url(#mengenalCrackerGold)" />
              <rect x="52" y="78" width="16" height="8" fill="url(#mengenalCrackerGold)" />
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
          Kamu Sudah Bernyanyi Huruf A Sampai Z!
        </p>

        <div className="mt-5 flex items-center justify-center gap-3 w-full flex-wrap">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 1 }}
            onClick={onReplaySong}
            className="flex-1 min-w-[140px] px-4 py-3 rounded-2xl bg-gradient-to-b from-[#B45309] to-[#9A3412] border-2 border-white border-b-4 border-b-[#7C2D12] text-white font-display font-black text-sm sm:text-base shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw size={17} aria-hidden="true" className="stroke-[2.6]" />
            <span>NYANYI LAGI</span>
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 1 }}
            onClick={onContinue}
            className="flex-1 min-w-[140px] px-4 py-3 rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 border-2 border-white border-b-4 border-b-blue-900 text-white font-display font-black text-sm sm:text-base shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play size={16} aria-hidden="true" className="fill-white" />
            <span>LANJUT BELAJAR</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
