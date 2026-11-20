// src/views/modules/TemukanHurufView.jsx
// SAKA TIKA: "Juicy Arcade Bubble World" - Studio Grade Kindergarten Edition
// 1. Direct Instant Target Highlight: Target bubbles shine immediately with glowing golden halo & amber coin.
// 2. Rich Multi-Layered Landscape: Rolling grassy hills, cartoon swaying flowers, 3D toy blocks & golden star props.
// 3. Living Sky Atmosphere: Soft drifting clouds, fluttering butterfly, and gliding songbird.
// 4. Juicy Bubble Physics: Translucent 3D soap bubbles, squish & stretch on touch/hover, organic floating drift.
// 5. Fly-To-Slot Comet Projectiles: Popped letter coins shoot up to header slots with sparks & chime ("TING!").
// 6. Interactive Mascots: Saka & Tika can be tapped to bounce, giggle, and give voice encouragement!
// 7. Interactive Arena: Ambient mini-bubbles can be popped, background taps create ripple shockwaves.
// 8. Glorious Victory Celebration: Screen rumble, firecracker fireworks, rotating sunburst, and snappy "Lanjut" button.
// STRICT ZERO SCROLLBAR APP LOCK: h-screen w-screen overflow-hidden select-none.
// STRICT ZERO EMOJIS POLICY: Exclusively lucide-react icons or custom vector assets.
// STRICT AUDIO CONTROL: Never auto-play voice narration or SFX on initial mount.

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Volume2, RotateCcw, Shuffle, Check, Sparkles, Play } from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { ALPHABET_DATA } from "../../data/masterDataset.js";
import { speakLetter, speakWord, speakInstruction } from "../../utils/speechEngine.js";
import WordIllustration from "../../components/illustrations/WordIllustration.jsx";
import {
  playBubblePopSound,
  playRubberBoingSound,
  playHoverSound,
  playSuccessSound,
  playFanfareSound,
  playXylophoneNote,
  playCoinWhooshSound,
  playSlotSnapSound,
  playMascotGiggleSound,
  playAmbientRippleSound,
} from "../../utils/soundSynthesizer.js";
import { ShuffleQueue } from "../../utils/shuffleQueue.js";
import {
  AnimatedButterfly,
  AnimatedBird,
  FloatingCloud,
} from "../../components/illustrations/AmbientDecor.jsx";

// 10 Balanced, non-overlapping anchor positions arranged in a spacious 2-row curved formation
const BUBBLE_ZONE_ANCHORS = [
  // Row 1: Top Curved Formation (5 bubbles across upper stage)
  { left: 16, top: 29 },
  { left: 33, top: 25 },
  { left: 50, top: 24 },
  { left: 67, top: 25 },
  { left: 84, top: 29 },
  // Row 2: Bottom Curved Formation (5 bubbles across lower-mid stage)
  { left: 24, top: 62 },
  { left: 39, top: 58 },
  { left: 54, top: 57 },
  { left: 69, top: 58 },
  { left: 84, top: 62 },
];

// Cute Swaying Cartoon Flower for Stage Mound
function StageFlower({ cx, cy, petalColor, centerColor = "#FDE047", delay = 0 }) {
  return (
    <motion.g
      animate={{ rotate: [-7, 7, -7] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay }}
      style={{ originX: `${cx}px`, originY: `${cy + 14}px` }}
    >
      <path
        d={`M${cx},${cy + 14} Q${cx - 2},${cy + 7} ${cx},${cy}`}
        stroke="#15803D"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy - 4} r="3.5" fill={petalColor} />
      <circle cx={cx + 4} cy={cy} r="3.5" fill={petalColor} />
      <circle cx={cx} cy={cy + 4} r="3.5" fill={petalColor} />
      <circle cx={cx - 4} cy={cy} r="3.5" fill={petalColor} />
      <circle cx={cx} cy={cy} r="3.2" fill={centerColor} />
    </motion.g>
  );
}

// Custom Vector Gold-Rimmed Brass Magnifying Glass with Turquoise Handle
function MagnifyingGlassIcon({ className = "w-6 h-6 sm:w-7 sm:h-7" }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={`${className} flex-shrink-0 drop-shadow-xs`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lensBrassGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="85%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="lensHandleGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0E7490" />
        </linearGradient>
      </defs>
      {/* Handle */}
      <rect
        x="30"
        y="30"
        width="6"
        height="15"
        rx="3"
        transform="rotate(-45 30 30)"
        fill="url(#lensHandleGrad)"
        stroke="#0E7490"
        strokeWidth="1.2"
      />
      {/* Brass Ferrule */}
      <rect
        x="26"
        y="26"
        width="7"
        height="3"
        rx="1"
        transform="rotate(-45 26 26)"
        fill="url(#lensBrassGrad)"
        stroke="#78350F"
        strokeWidth="0.8"
      />
      {/* Outer Brass Ring */}
      <circle cx="18" cy="18" r="14" fill="url(#lensBrassGrad)" stroke="#78350F" strokeWidth="1.6" />
      {/* Inner Rim Lip */}
      <circle cx="18" cy="18" r="11.5" fill="#D97706" />
      {/* Optical Glass Lens */}
      <circle cx="18" cy="18" r="10.5" fill="#E0F2FE" fillOpacity="0.45" stroke="#FFFFFF" strokeWidth="1" />
      {/* Curved Glare Highlight */}
      <path
        d="M12 12 A8 8 0 0 1 24 12"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}

export default function TemukanHurufView() {
  const { addStars } = useGame();
  const { playSfx } = useAudio();

  // Non-repeating Fisher-Yates shuffle queue initialization
  const shuffleQueueRef = useRef(null);
  if (!shuffleQueueRef.current) {
    shuffleQueueRef.current = new ShuffleQueue(ALPHABET_DATA.length);
  }

  const [letterIndex, setLetterIndex] = useState(() => shuffleQueueRef.current.next());
  const [bubbles, setBubbles] = useState([]);
  const [foundIds, setFoundIds] = useState([]);
  const [wobbleId, setWobbleId] = useState(null);
  const [poppingId, setPoppingId] = useState(null);

  // Consecutive streak counter & 6-second inactivity hint
  const [streak, setStreak] = useState(0);
  const [hintBubbleId, setHintBubbleId] = useState(null);
  const idleTimerRef = useRef(null);

  // Juice & Particle effects
  const [splashDroplets, setSplashDroplets] = useState([]);
  const [shockwaves, setShockwaves] = useState([]);
  const [flyingCoins, setFlyingCoins] = useState([]);
  const [arenaRipples, setArenaRipples] = useState([]);
  const [floatingCombos, setFloatingCombos] = useState([]);
  const [slotBounceIndex, setSlotBounceIndex] = useState(null);

  // Game state
  const [roundComplete, setRoundComplete] = useState(false);
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [mascotAnimationState, setMascotAnimationState] = useState("idle"); // idle, cheer, giggle, encourage
  const [customSpeechText, setCustomSpeechText] = useState(null);
  const [roundCount, setRoundCount] = useState(1);

  // Element Refs for pixel-accurate projectile flight
  const bubbleRefs = useRef({});
  const slotRefs = [useRef(null), useRef(null), useRef(null)];
  const autoAdvanceTimer = useRef(null);

  // Active target letter object from master dataset
  const currentTarget = useMemo(() => {
    return ALPHABET_DATA[letterIndex % ALPHABET_DATA.length];
  }, [letterIndex]);

  const targetLetter = currentTarget.letter;

  // Smart 6-second inactivity shimmer hint
  const restartIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    setHintBubbleId(null);

    idleTimerRef.current = setTimeout(() => {
      setBubbles((currBubbles) => {
        setFoundIds((currFound) => {
          if (currFound.length < 3) {
            const remaining = currBubbles.find(
              (b) => b.isTarget && !currFound.includes(b.id)
            );
            if (remaining) {
              setHintBubbleId(remaining.id);
            }
          }
          return currFound;
        });
        return currBubbles;
      });
    }, 6000);
  }, []);

  // Initialize round: 10 bubbles (3 target bubbles + 7 unique distractors)
  const setupRound = useCallback((target) => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }

    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const distractorsPool = allLetters.filter((l) => l !== target);
    const shuffledDistractors = [...distractorsPool].sort(() => 0.5 - Math.random());

    const targetCount = 3;
    const distractorCount = 7;
    const items = [];

    // 3 Target bubbles
    for (let i = 0; i < targetCount; i++) {
      items.push({
        id: `target-${i}-${Date.now()}-${Math.random()}`,
        letter: target,
        isTarget: true,
      });
    }

    // 7 Distractor bubbles
    for (let i = 0; i < distractorCount; i++) {
      items.push({
        id: `distractor-${i}-${Date.now()}-${Math.random()}`,
        letter: shuffledDistractors[i % shuffledDistractors.length],
        isTarget: false,
      });
    }

    // Shuffle and assign clean 2-row curved anchor positions
    const shuffledItems = items.sort(() => 0.5 - Math.random());
    const positionedBubbles = shuffledItems.map((item, idx) => {
      const anchor = BUBBLE_ZONE_ANCHORS[idx] || { left: 50, top: 50 };
      const jitterX = (Math.random() - 0.5) * 1.8;
      const jitterY = (Math.random() - 0.5) * 1.8;
      const floatDuration = 3.0 + Math.random() * 1.5;
      const floatDelay = idx * 0.16;

      return {
        ...item,
        x: Math.max(12, Math.min(88, anchor.left + jitterX)),
        y: Math.max(22, Math.min(72, anchor.top + jitterY)),
        floatDuration,
        floatDelay,
      };
    });

    setBubbles(positionedBubbles);
    setFoundIds([]);
    setWobbleId(null);
    setPoppingId(null);
    setHintBubbleId(null);
    setSplashDroplets([]);
    setShockwaves([]);
    setFlyingCoins([]);
    setFloatingCombos([]);
    setRoundComplete(false);
    setIsScreenShaking(false);
    setMascotAnimationState("idle");
    setCustomSpeechText(null);
    restartIdleTimer();
  }, [restartIdleTimer]);

  // Initialize round when targetLetter changes
  useEffect(() => {
    setupRound(targetLetter);
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [targetLetter, setupRound]);

  // Celebratory confetti fireworks (2.2s duration)
  const fireFireworksRockets = () => {
    const end = Date.now() + 2200;
    const colors = ["#FDE047", "#F43F5E", "#38BDF8", "#34D399", "#C084FC", "#FB923C"];

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 60,
        origin: { x: 0.08, y: 0.72 },
        colors,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 60,
        origin: { x: 0.92, y: 0.72 },
        colors,
      });
      confetti({
        particleCount: 8,
        angle: 90,
        spread: 90,
        origin: { x: 0.5, y: 0.42 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Next round transition
  const handleNextRound = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    setHintBubbleId(null);
    playHoverSound();
    setRoundCount((prev) => prev + 1);
    setLetterIndex(shuffleQueueRef.current.next());
  }, []);

  // Reset current round
  const handleResetCurrentRound = useCallback(() => {
    playHoverSound();
    setStreak(0);
    setupRound(targetLetter);
  }, [setupRound, targetLetter]);

  // Handle bubble tap / click interaction
  const handleBubbleClick = (bubble, event) => {
    event?.stopPropagation();
    if (roundComplete || foundIds.includes(bubble.id) || poppingId === bubble.id) return;

    if (bubble.isTarget) {
      const stageIdx = foundIds.length;
      setPoppingId(bubble.id);
      setStreak((prev) => prev + 1);
      restartIdleTimer();

      // 1. Ascending musical chime (Do -> Re -> Mi) + juicy pop synthesizer
      playXylophoneNote(stageIdx);
      playBubblePopSound(stageIdx);
      playCoinWhooshSound();

      // 2. Measure starting pixel position from bubble and target slot
      const bubbleEl = bubbleRefs.current[bubble.id];
      const slotEl = slotRefs[stageIdx]?.current;
      let startX = window.innerWidth * (bubble.x / 100);
      let startY = window.innerHeight * (bubble.y / 100);
      let endX = window.innerWidth * 0.65;
      let endY = 60;

      if (bubbleEl) {
        const bRect = bubbleEl.getBoundingClientRect();
        startX = bRect.left + bRect.width / 2;
        startY = bRect.top + bRect.height / 2;
      }
      if (slotEl) {
        const sRect = slotEl.getBoundingClientRect();
        endX = sRect.left + sRect.width / 2;
        endY = sRect.top + sRect.height / 2;
      }

      // 3. Spawn expanding shockwave ring
      const shockwaveId = `sw-${Date.now()}-${Math.random()}`;
      setShockwaves((prev) => [...prev, { id: shockwaveId, x: startX, y: startY }]);
      setTimeout(() => {
        setShockwaves((prev) => prev.filter((sw) => sw.id !== shockwaveId));
      }, 450);

      // 4. Spawn burst of 12 water droplets & golden sparkle particles
      const newDroplets = Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.35;
        const dist = 4.5 + Math.random() * 5.5;
        return {
          id: `${bubble.id}-drop-${i}-${Date.now()}`,
          startX: bubble.x,
          startY: bubble.y,
          targetX: Math.max(5, Math.min(95, bubble.x + Math.cos(angle) * dist)),
          targetY: Math.max(5, Math.min(95, bubble.y + Math.sin(angle) * dist)),
          size: Math.random() * 7 + 4,
          isSpark: i % 2 === 0,
        };
      });
      setSplashDroplets((prev) => [...prev, ...newDroplets]);
      setTimeout(() => {
        setSplashDroplets((prev) => prev.filter((d) => !d.id.startsWith(bubble.id)));
      }, 550);

      // 5. Floating text combo juice (Strict Zero Emojis Policy)
      const comboLabels = ["Pecah 1!", "Keren! 2!", "Sempurna!"];
      const comboId = `combo-${Date.now()}`;
      setFloatingCombos((prev) => [
        ...prev,
        {
          id: comboId,
          text: comboLabels[stageIdx] || "Hebat!",
          x: bubble.x,
          y: bubble.y - 4,
        },
      ]);
      setTimeout(() => {
        setFloatingCombos((prev) => prev.filter((c) => c.id !== comboId));
      }, 750);

      // 6. Mascot cheer reaction
      setMascotAnimationState("cheer");
      setTimeout(() => setMascotAnimationState("idle"), 800);

      // 7. Launch Flying Coin Projectile towards the header slot
      const coinId = `coin-${Date.now()}-${stageIdx}`;
      setFlyingCoins((prev) => [
        ...prev,
        {
          id: coinId,
          letter: bubble.letter,
          startX,
          startY,
          endX,
          endY,
          stageIdx,
          bubbleId: bubble.id,
        },
      ]);

      // 8. Snap coin into slot after flight completion (~400ms)
      setTimeout(() => {
        playSlotSnapSound(stageIdx);
        setSlotBounceIndex(stageIdx);
        setTimeout(() => setSlotBounceIndex(null), 400);

        const newFound = [...foundIds, bubble.id];
        setFoundIds(newFound);
        setPoppingId(null);
        setFlyingCoins((prev) => prev.filter((c) => c.id !== coinId));

        if (newFound.length >= 3) {
          // VICTORY: Screen rumble + fanfare + confetti + victory modal (2200ms hold)
          if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
            idleTimerRef.current = null;
          }
          setHintBubbleId(null);

          setIsScreenShaking(true);
          setTimeout(() => setIsScreenShaking(false), 450);

          setRoundComplete(true);
          playSuccessSound();
          playFanfareSound();
          if (typeof addStars === "function") addStars(1);

          fireFireworksRockets();

          autoAdvanceTimer.current = setTimeout(() => {
            handleNextRound();
          }, 2200);
        }
      }, 420);
    } else {
      // Wrong bubble: soft rubber bounce + comical jelly wobble (reset streak gracefully to 0)
      playRubberBoingSound();
      setStreak(0);
      restartIdleTimer();
      setWobbleId(bubble.id);
      setTimeout(() => setWobbleId(null), 500);

      setMascotAnimationState("encourage");
      setTimeout(() => setMascotAnimationState("idle"), 600);

      setCustomSpeechText(`Bukan ${bubble.letter}, ayo cari huruf ${targetLetter} ya!`);
      setTimeout(() => setCustomSpeechText(null), 2500);
    }
  };

  // Interactive Mascot Tap Handler
  const handleMascotTap = (mascotName) => {
    playMascotGiggleSound();
    setMascotAnimationState("giggle");
    setTimeout(() => setMascotAnimationState("idle"), 850);

    const quotes = [
      `Ayo semangat! Ketuk 3 huruf ${targetLetter} yang bersinar!`,
      `Kamu hebat! Temukan huruf ${targetLetter} yang berwarna emas ya!`,
      `Saka dan Tika siap bermain bersamamu!`,
      `Huruf ${targetLetter} bersinar terang di gelembung!`,
    ];
    const pickedQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCustomSpeechText(pickedQuote);
    speakInstruction(pickedQuote);

    setTimeout(() => {
      setCustomSpeechText(null);
    }, 3500);
  };

  // Interactive Arena Tap (creates water ripples when tapping the open stage)
  const handleArenaTap = (e) => {
    if (roundComplete) return;
    restartIdleTimer();
    playAmbientRippleSound();
    const rippleId = `rip-${Date.now()}-${Math.random()}`;
    const x = e.clientX;
    const y = e.clientY;

    setArenaRipples((prev) => [...prev, { id: rippleId, x, y }]);
    setTimeout(() => {
      setArenaRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 550);
  };

  // Manual audio pronunciation triggers (Strict Audio Gating: only on explicit click)
  const handleSpeakTarget = () => {
    if (typeof playSfx === "function") playSfx("click");
    speakLetter(currentTarget);
  };

  const handleSpeakWord = () => {
    if (typeof playSfx === "function") playSfx("click");
    speakWord(currentTarget);
  };

  // Dynamic Encouraging Speech Bubble Text
  const speechBubbleText = useMemo(() => {
    if (customSpeechText) return customSpeechText;
    if (foundIds.length === 0) {
      return `Ayo ketuk 3 huruf ${targetLetter} yang bersinar!`;
    }
    if (foundIds.length === 1) {
      return `Mantap! Kurang 2 huruf ${targetLetter} lagi!`;
    }
    if (foundIds.length === 2) {
      return `Hebat! Tinggal 1 lagi!`;
    }
    return `Luar biasa! Semua huruf ${targetLetter} ditemukan!`;
  }, [customSpeechText, foundIds.length, targetLetter]);

  // 18 Soft translucent mini soap bubbles rising gently in background (Zero stars on wall)
  const backgroundMiniBubbles = useMemo(
    () => [
      { left: 8, bottom: 15, size: 22, opacity: 0.28, duration: 8.5, delay: 0 },
      { left: 16, bottom: 25, size: 14, opacity: 0.35, duration: 7.2, delay: 1.5 },
      { left: 24, bottom: 18, size: 28, opacity: 0.25, duration: 9.0, delay: 0.8 },
      { left: 32, bottom: 35, size: 16, opacity: 0.32, duration: 7.8, delay: 2.2 },
      { left: 40, bottom: 20, size: 24, opacity: 0.3, duration: 8.2, delay: 1.1 },
      { left: 48, bottom: 30, size: 18, opacity: 0.35, duration: 7.5, delay: 3.0 },
      { left: 56, bottom: 16, size: 30, opacity: 0.24, duration: 9.5, delay: 0.5 },
      { left: 64, bottom: 28, size: 20, opacity: 0.32, duration: 8.0, delay: 1.9 },
      { left: 72, bottom: 18, size: 26, opacity: 0.28, duration: 8.7, delay: 1.3 },
      { left: 80, bottom: 32, size: 15, opacity: 0.36, duration: 7.0, delay: 2.7 },
      { left: 88, bottom: 22, size: 24, opacity: 0.26, duration: 8.8, delay: 0.4 },
      { left: 94, bottom: 14, size: 18, opacity: 0.34, duration: 7.6, delay: 2.1 },
      { left: 12, bottom: 42, size: 12, opacity: 0.25, duration: 6.8, delay: 3.4 },
      { left: 36, bottom: 48, size: 14, opacity: 0.28, duration: 7.3, delay: 4.1 },
      { left: 60, bottom: 44, size: 16, opacity: 0.3, duration: 7.9, delay: 3.7 },
      { left: 84, bottom: 46, size: 12, opacity: 0.25, duration: 6.5, delay: 4.5 },
      { left: 20, bottom: 55, size: 14, opacity: 0.24, duration: 8.0, delay: 2.5 },
      { left: 76, bottom: 58, size: 15, opacity: 0.26, duration: 8.3, delay: 1.7 },
    ],
    []
  );

  return (
    <main
      onClick={handleArenaTap}
      className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none p-2 sm:p-3 cursor-default"
    >
      {/* ── 1. Living "Panggung Taman Gelembung" Stage Backdrop (True Coral-Red & Meadow) ── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Base Multi-Stop True Coral-Red Sky Linear Gradient Matching Cover Card */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(180deg, #F46B68 0%, #E84C48 35%, #DC3632 70%, #C6302C 100%)",
          }}
        />

        {/* Soft Warm Coral-Peach Radial Center Spotlight Behind Bubble Formation */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          animate={{ opacity: [0.75, 0.95, 0.75] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle at 50% 54%, rgba(255, 196, 180, 0.32) 0%, transparent 68%)",
          }}
        />

        {/* ── Atmospheric Sky Accessories: Drifting Clouds Repositioned Inward Away from HUD ── */}
        <div className="absolute top-8 left-[18%] pointer-events-none opacity-45">
          <FloatingCloud x={0} y={0} scale={0.75} duration={26} />
        </div>
        <div className="absolute top-12 right-[18%] pointer-events-none opacity-45 hidden sm:block">
          <FloatingCloud x={0} y={0} scale={0.7} duration={28} delay={3} />
        </div>
        <AnimatedBird initialY={35} delay={2} className="opacity-75" />
        <AnimatedButterfly initialY={130} delay={1} className="opacity-80" />

        {/* 18 Soft Translucent Rising Mini Soap Bubbles (Strict Zero Wall Stars Policy) */}
        {backgroundMiniBubbles.map((ab, idx) => (
          <motion.div
            key={`bmb-${idx}`}
            onClick={(e) => {
              e.stopPropagation();
              playAmbientRippleSound();
            }}
            className="absolute rounded-full border border-white/35 bg-white/10 pointer-events-auto cursor-pointer"
            style={{
              left: `${ab.left}%`,
              bottom: `${ab.bottom}%`,
              width: `${ab.size}px`,
              height: `${ab.size}px`,
              background:
                "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.7) 0%, rgba(254,205,211,0.2) 50%, rgba(255,255,255,0.05) 100%)",
              boxShadow:
                "inset 0 0 4px rgba(255,255,255,0.6), 0 0 8px rgba(255,255,255,0.2)",
              opacity: ab.opacity,
            }}
            animate={{
              y: [-10, -90, -180],
              x: [0, idx % 2 === 0 ? 12 : -12, 0],
              opacity: [ab.opacity, ab.opacity * 1.3, 0],
              scale: [0.9, 1.05, 0.95],
            }}
            transition={{
              duration: ab.duration,
              repeat: Infinity,
              delay: ab.delay,
              ease: "easeInOut",
            }}
          >
            <div className="absolute top-1 left-1.5 w-1.5 h-1 bg-white/90 rounded-full -rotate-45 pointer-events-none" />
          </motion.div>
        ))}

        {/* ── Layered Lush Green Meadow Hills at the Bottom with Delicate Wildflowers ── */}
        <div className="absolute bottom-0 inset-x-0 h-28 sm:h-32 overflow-hidden pointer-events-none z-10">
          <svg viewBox="0 0 1440 180" fill="none" className="w-full h-full" preserveAspectRatio="none">
            {/* Deep Ruby Horizon Layer */}
            <path d="M0 80 Q360 40 720 70 T1440 50 L1440 180 L0 180 Z" fill="#881337" opacity="0.65" />
            <path d="M0 100 Q480 60 960 95 T1440 80 L1440 180 L0 180 Z" fill="#701A75" opacity="0.45" />

            {/* Foreground Lush Green Rolling Hills */}
            <path d="M-40 115 Q280 75 600 110 T1240 95 Q1360 90 1480 105 L1480 180 L-40 180 Z" fill="#15803D" />
            <path d="M-20 125 Q320 85 700 120 T1460 110 L1460 180 L-20 180 Z" fill="#22C55E" />

            {/* Swaying Flowers Across the Grass Horizon */}
            <StageFlower cx={80} cy={110} petalColor="#FB7185" delay={0.2} />
            <StageFlower cx={130} cy={100} petalColor="#FDE047" delay={0.8} />
            <StageFlower cx={170} cy={115} petalColor="#38BDF8" delay={1.4} />
            <StageFlower cx={640} cy={115} petalColor="#F472B6" delay={0.5} />
            <StageFlower cx={700} cy={105} petalColor="#FBBF24" delay={1.1} />
            <StageFlower cx={760} cy={120} petalColor="#A78BFA" delay={1.7} />
            <StageFlower cx={1280} cy={100} petalColor="#FB7185" delay={0.4} />
            <StageFlower cx={1330} cy={110} petalColor="#FDE047" delay={1.2} />
            <StageFlower cx={1380} cy={95} petalColor="#38BDF8" delay={0.9} />
          </svg>
        </div>
      </div>

      {/* ── 2. Screen Shake Container for Game Rumble Juice ── */}
      <motion.div
        animate={isScreenShaking ? { x: [-5, 5, -3, 3, -1, 1, 0], y: [-3, 3, -1, 1, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col justify-between max-w-7xl w-full mx-auto"
      >
        {/* ── Top Header: Tactile 3D Target Question & Progress Bar ── */}
        <header className="w-full px-2 pt-1 sm:pt-2 flex justify-center flex-shrink-0 z-30">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="w-auto max-w-4xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-[2.5rem] bg-gradient-to-b from-[#FFFDF9] via-[#FFFBEB] to-[#FEF3C7] border-4 sm:border-[5px] border-amber-400 border-b-6 sm:border-b-8 border-b-amber-600 shadow-[0_16px_36px_rgba(136,19,55,0.45),0_0_45px_rgba(251,191,36,0.4)] ring-4 ring-amber-300/50 flex items-center justify-center gap-3 sm:gap-5 md:gap-7 relative"
          >
            {/* Left: Target Word Illustration Frame + Sky-Blue Speaker Button */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <motion.button
                type="button"
                whileHover={{ scale: 1.08, rotate: -2 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleSpeakWord}
                aria-label={`Dengarkan Kata ${currentTarget.word}`}
                className="w-13 h-13 sm:w-15 sm:h-15 md:w-16 md:h-16 rounded-2xl bg-white border-2 border-amber-300 border-b-4 border-b-amber-500 shadow-sm p-1 cursor-pointer flex items-center justify-center overflow-hidden flex-shrink-0"
                title={`Contoh kata: ${currentTarget.word} (Ketuk untuk dengar)`}
              >
                <WordIllustration
                  word={currentTarget.word}
                  illustrationKey={currentTarget.illustrationKey || currentTarget.word}
                  className="w-full h-full"
                  showBadge={false}
                />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.9, y: 2 }}
                onClick={handleSpeakTarget}
                aria-label={`Dengarkan Bunyi Huruf Target ${targetLetter}`}
                className="w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 border-b-4 border-blue-800 text-white shadow-md cursor-pointer flex items-center justify-center active:border-b-0 active:translate-y-1 flex-shrink-0"
                title="Ketuk untuk mendengarkan bunyi huruf"
              >
                <Volume2 size={22} className="stroke-[2.5]" />
              </motion.button>
            </div>

            {/* Center: Magnifying Glass + "CARI HURUF:" + 3D Golden Target Letter Tile */}
            <div className="flex items-center gap-2 sm:gap-3.5 flex-shrink-0">
              <MagnifyingGlassIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              <span className="font-display font-black text-xl sm:text-2xl md:text-3xl text-[#0F172A] tracking-wider leading-none uppercase drop-shadow-xs">
                CARI HURUF:
              </span>

              {/* 3D Golden-Amber Target Letter Tile with Breathing Pulse */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.92 }}
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                onClick={handleSpeakTarget}
                aria-label={`Huruf Target ${targetLetter}`}
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-2 border-white/90 border-b-6 border-b-amber-700 shadow-[0_10px_20px_rgba(217,119,6,0.5),inset_0_2px_4px_rgba(255,255,255,0.8)] flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none cursor-pointer"
                title="Huruf target yang harus dicari"
              >
                {targetLetter}
              </motion.button>
            </div>

            {/* Right: 3 Glossy Capsule Slots + Ronde Badge + Beruntun Streak + Controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* 3 Target Progress Slots with Ref Binding for Projectiles */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {[0, 1, 2].map((slotIdx) => {
                  const isFilled = slotIdx < foundIds.length;
                  const isBouncing = slotBounceIndex === slotIdx;

                  return (
                    <motion.div
                      key={slotIdx}
                      ref={slotRefs[slotIdx]}
                      initial={false}
                      animate={
                        isBouncing
                          ? { scale: [0.7, 1.35, 1], rotate: [0, -10, 0] }
                          : isFilled
                          ? { scale: 1 }
                          : { scale: [1, 1.04, 1] }
                      }
                      transition={{ type: "spring", stiffness: 450, damping: 14 }}
                      className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center relative transition-all ${
                        isFilled
                          ? "bg-gradient-to-b from-[#FEF08A] via-[#FDE047] to-[#F59E0B] border-2 border-amber-500 border-b-4 border-b-amber-700 shadow-[0_6px_16px_rgba(245,158,11,0.6)] ring-2 ring-amber-300 text-amber-950 font-black"
                          : "bg-amber-100/70 border-2 border-dashed border-amber-400/80 shadow-inner"
                      }`}
                    >
                      {isFilled ? (
                        <>
                          <span className="font-display font-black text-lg sm:text-xl text-amber-950 leading-none drop-shadow-xs">
                            {targetLetter}
                          </span>
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xs">
                            <Check size={10} strokeWidth={3.5} />
                          </span>
                        </>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Ronde & Consecutive Streak Badges */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                {/* Ronde Counter Badge */}
                <div className="px-2 sm:px-2.5 py-1 rounded-xl bg-amber-200/80 border border-amber-400/80 shadow-xs flex items-center justify-center">
                  <span className="font-display font-black text-[11px] sm:text-xs md:text-sm text-amber-900 tracking-wider whitespace-nowrap">
                    Ronde {roundCount}
                  </span>
                </div>

                {/* Consecutive Streak Badge (Beruntun) */}
                <motion.div
                  key={streak}
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className={`px-2 sm:px-2.5 py-1 rounded-xl border shadow-xs flex items-center justify-center transition-colors whitespace-nowrap ${
                    streak > 0
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700 ring-2 ring-emerald-200/60"
                      : "bg-slate-100/90 border-slate-200 text-slate-500"
                  }`}
                  title="Pecahkan gelembung target berturut-turut tanpa salah"
                >
                  <span className="font-display font-black text-[11px] sm:text-xs md:text-sm tracking-wider">
                    Beruntun: {streak}
                  </span>
                </motion.div>
              </div>

              {/* Control Action Buttons: Reset & Shuffle */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.9, y: 2 }}
                  onClick={handleResetCurrentRound}
                  aria-label="Acak Ulang Posisi"
                  className="p-2 sm:p-2.5 rounded-2xl bg-white hover:bg-slate-100 border-2 border-slate-200 border-b-4 border-slate-300 text-slate-700 shadow-sm cursor-pointer active:border-b-0 active:translate-y-1"
                  title="Acak ulang posisi gelembung"
                >
                  <RotateCcw size={17} className="stroke-[2.5]" />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.9, y: 2 }}
                  onClick={handleNextRound}
                  aria-label="Ganti Huruf Target"
                  className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 border-2 border-amber-300 border-b-4 border-amber-600 text-white shadow-md cursor-pointer active:border-b-0 active:translate-y-1"
                  title="Ganti ke huruf target acak berikutnya"
                >
                  <Shuffle size={17} className="stroke-[2.5]" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </header>

        {/* ── Main Playing Field: 10 Soap Bubbles with Direct Target Highlight ── */}
        <section className="relative z-20 flex-1 min-h-0 w-full max-w-6xl mx-auto px-4 my-auto overflow-hidden">
          {/* Floating Combo Badge Juice */}
          {floatingCombos.map((cb) => (
            <motion.div
              key={cb.id}
              initial={{ left: `${cb.x}%`, top: `${cb.y}%`, opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.25, 1, 0.9], y: -45 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-45 px-3 py-1 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 border-2 border-white text-white font-display font-black text-sm sm:text-base shadow-lg drop-shadow-sm flex items-center gap-1"
            >
              <Sparkles size={14} className="text-yellow-100" />
              <span>{cb.text}</span>
            </motion.div>
          ))}

          {/* Water Droplets and Gold Sparks on Correct Tap */}
          {splashDroplets.map((d) => (
            <motion.div
              key={d.id}
              initial={{ left: `${d.startX}%`, top: `${d.startY}%`, opacity: 0.95, scale: 1 }}
              animate={{ left: `${d.targetX}%`, top: `${d.targetY}%`, opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: `${d.size}px`,
                height: `${d.size}px`,
                borderRadius: "9999px",
                transform: "translate(-50%, -50%)",
                background: d.isSpark
                  ? "radial-gradient(circle, #FDE047 30%, #F59E0B 80%)"
                  : "radial-gradient(circle, rgba(255,255,255,0.95) 20%, rgba(56,189,248,0.75) 80%)",
                boxShadow: d.isSpark
                  ? "0 0 10px rgba(251,191,36,0.9)"
                  : "0 0 8px rgba(255,255,255,0.9)",
                pointerEvents: "none",
                zIndex: 40,
              }}
            />
          ))}

          {/* 10 Sleek 3D Soap Bubbles (Replacing chunky yellow rings with refined golden aura + crisp inner coins & magnifying lens hover) */}
          {bubbles.map((b) => {
            const isFound = foundIds.includes(b.id);
            const isPopping = poppingId === b.id;
            const isWobble = wobbleId === b.id;
            const isHint = hintBubbleId === b.id;

            if (isFound) return null;

            return (
              <motion.button
                key={b.id}
                ref={(el) => (bubbleRefs.current[b.id] = el)}
                type="button"
                onClick={(e) => handleBubbleClick(b, e)}
                disabled={roundComplete}
                style={{
                  position: "absolute",
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                whileHover={{
                  scale: 1.13,
                  transition: { type: "spring", stiffness: 450, damping: 16 },
                }}
                whileTap={{
                  scale: 0.9,
                  transition: { type: "spring", stiffness: 500, damping: 12 },
                }}
                animate={
                  isPopping
                    ? { scale: [1, 1.45, 0], opacity: [1, 0.9, 0] }
                    : isWobble
                    ? {
                        rotate: [-14, 14, -8, 8, -3, 3, 0],
                        scale: [1, 1.14, 0.92, 1.05, 1],
                      }
                    : b.isTarget
                    ? {
                        y: [-6, 6, -6],
                        scale: [1, 1.05, 1],
                      }
                    : {
                        y: [-4.5, 4.5, -4.5],
                      }
                }
                transition={
                  isPopping
                    ? { duration: 0.3, ease: "easeOut" }
                    : isWobble
                    ? { duration: 0.45, ease: "easeInOut" }
                    : {
                        duration: b.floatDuration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: b.floatDelay,
                      }
                }
                className={`w-24 h-24 sm:w-26 sm:h-26 md:w-28 md:h-28 rounded-full flex items-center justify-center select-none cursor-pointer relative active:scale-95 transition-all group ${
                  b.isTarget
                    ? "ring-2 ring-amber-200/85 shadow-[0_0_22px_rgba(253,224,71,0.65),0_10px_24px_rgba(127,29,29,0.28)]"
                    : "shadow-[0_10px_24px_rgba(127,29,29,0.28)]"
                }`}
              >
                {/* 6-Second Inactivity Golden Pulse Shimmer Hint */}
                {isHint && (
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.35, 0.9, 0.35],
                    }}
                    transition={{
                      duration: 1.25,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -inset-3 rounded-full border-3 border-amber-300 shadow-[0_0_25px_rgba(253,224,71,0.9)] pointer-events-none z-30"
                  />
                )}

                {/* Interactive Magnifying Glass Hover Optical Ring */}
                <div className="absolute -inset-1 rounded-full ring-4 ring-amber-300/90 shadow-[0_0_16px_rgba(251,191,36,0.6)] pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Iridescent Translucent Soap Bubble Sphere */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-white/80 bg-white/15 backdrop-blur-[2px] shadow-[inset_0_0_14px_rgba(255,255,255,0.75)] pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.75) 0%, rgba(224,242,254,0.3) 30%, rgba(252,231,243,0.2) 65%, rgba(254,240,138,0.2) 85%, rgba(56,189,248,0.25) 100%)",
                  }}
                />

                {/* 3D Soap Bubble Sprite (gelembung.png) */}
                <img
                  src="/assets/gelembung.png"
                  alt="Gelembung"
                  draggable="false"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none rounded-full opacity-75 group-hover:opacity-95 transition-opacity"
                />

                {/* Primary Specular Highlights */}
                <div className="absolute top-2 left-3 w-5 h-2.5 bg-white/95 rounded-full -rotate-45 blur-[0.2px] pointer-events-none z-20" />
                <div className="absolute top-5 left-2 w-1.5 h-1.5 bg-white/90 rounded-full pointer-events-none z-20" />

                {/* Diagonal Glass Glare Sweep Across Coin on Hover */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-25">
                  <div className="w-full h-full bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>

                {/* Crisp 3D Embossed Inner Letter Coin (Target: Golden-Amber; Distractor: Ivory-White) */}
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center pointer-events-none z-20 transition-transform group-hover:scale-105 ${
                    b.isTarget
                      ? "bg-gradient-to-b from-[#FDE047] via-[#FACC15] to-[#EAB308] border-2 border-[#FEF9C3] border-b-4 border-b-[#CA8A04] shadow-inner shadow-[0_4px_12px_rgba(202,138,4,0.45)]"
                      : "bg-gradient-to-b from-[#FFFFFF] to-[#F1F5F9] border-2 border-white border-b-4 border-b-slate-300 shadow-inner shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
                  }`}
                >
                  <span
                    className={`font-display font-black text-3xl md:text-4xl text-[#0F172A] leading-none ${
                      b.isTarget
                        ? "drop-shadow-[0_1px_1px_rgba(254,240,138,0.8)]"
                        : "drop-shadow-xs"
                    }`}
                  >
                    {b.letter}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </section>

        {/* ── Interactive Saka & Tika Mascot Stage Mound (Bottom-Left) + 3D Toy Block Prop ── */}
        <div className="fixed bottom-0 left-2 sm:left-4 z-30 select-none flex flex-col items-center">
          {/* Dynamic Encouraging Speech Bubble with Cartoon Tail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={speechBubbleText}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.9 }}
              transition={{ duration: 0.22 }}
              className="mb-1.5 px-3 py-1.5 rounded-2xl bg-white/95 border-2 border-amber-400 shadow-lg flex items-center gap-1.5 max-w-[240px] text-center relative pointer-events-none"
            >
              <Sparkles size={13} className="text-amber-500 flex-shrink-0" />
              <span className="font-sans font-black text-[11px] sm:text-xs text-amber-950 leading-tight">
                {speechBubbleText}
              </span>
              {/* Cartoon Speech Bubble Pointer Tail */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-amber-400 rotate-45" />
            </motion.div>
          </AnimatePresence>

          {/* Interactive Tap-Friendly Mascot Cutouts */}
          <div className="relative flex items-end justify-center -mb-1">
            {/* Saka Mascot Cutout */}
            <motion.button
              type="button"
              onClick={() => handleMascotTap("saka")}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.94 }}
              animate={
                roundComplete
                  ? { y: [-18, 0, -10, 0], scale: [1, 1.06, 1] }
                  : mascotAnimationState === "cheer"
                  ? { y: [-16, 0, -8, 0], scale: [1, 1.05, 1] }
                  : mascotAnimationState === "giggle"
                  ? { y: [-20, 0, -12, 0], rotate: [0, -6, 4, 0] }
                  : mascotAnimationState === "encourage"
                  ? { y: [-4, 0], rotate: [-3, 3, 0] }
                  : { y: [0, -2.5, 0] }
              }
              transition={
                roundComplete
                  ? { duration: 0.75, repeat: Infinity, ease: "easeOut" }
                  : mascotAnimationState === "giggle"
                  ? { duration: 0.65, ease: "easeOut" }
                  : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
              }
              className="cursor-pointer pointer-events-auto p-0 border-0 bg-transparent outline-none flex items-end focus:outline-none z-20"
              title="Ketuk Saka untuk mendengar semangatnya!"
            >
              <img
                src="/assets/saka-maskot-1-cutout.png"
                alt="Saka Maskot"
                className="h-28 sm:h-34 md:h-38 lg:h-42 w-auto object-contain object-bottom drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </motion.button>

            {/* Tika Mascot Cutout */}
            <motion.button
              type="button"
              onClick={() => handleMascotTap("tika")}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.94 }}
              animate={
                roundComplete
                  ? { y: [-20, 0, -12, 0], scale: [1, 1.06, 1] }
                  : mascotAnimationState === "cheer"
                  ? { y: [-18, 0, -9, 0], scale: [1, 1.05, 1] }
                  : mascotAnimationState === "giggle"
                  ? { y: [-20, 0, -12, 0], rotate: [0, 6, -4, 0] }
                  : mascotAnimationState === "encourage"
                  ? { y: [-4, 0], rotate: [3, -3, 0] }
                  : { y: [0, -3, 0] }
              }
              transition={
                roundComplete
                  ? { duration: 0.75, delay: 0.08, repeat: Infinity, ease: "easeOut" }
                  : mascotAnimationState === "giggle"
                  ? { duration: 0.65, delay: 0.08, ease: "easeOut" }
                  : { duration: 3.5, repeat: Infinity, delay: 0.4, ease: "easeInOut" }
              }
              className="cursor-pointer pointer-events-auto p-0 border-0 bg-transparent outline-none flex items-end -ml-4 focus:outline-none z-20"
              title="Ketuk Tika untuk mendengar semangatnya!"
            >
              <img
                src="/assets/tika-maskot-1-cutout.png"
                alt="Tika Maskot"
                className="h-28 sm:h-34 md:h-38 lg:h-42 w-auto object-contain object-bottom drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </motion.button>
          </div>

          {/* Soft Ground Stage Mound & Contact Shadows */}
          <div className="relative w-48 sm:w-56 h-3 flex items-center justify-around pointer-events-none -mt-1">
            <div className="w-20 h-3 bg-[#064E3B]/40 rounded-full blur-[2px]" />
            <div className="w-20 h-3 bg-[#064E3B]/40 rounded-full blur-[2px]" />
          </div>
        </div>
      </motion.div>

      {/* ── 3. Overlay Layer: Shockwaves, Flying Coins & Background Tap Ripples ── */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {/* Popping Shockwave Expanding Rings */}
        {shockwaves.map((sw) => (
          <motion.div
            key={sw.id}
            initial={{ left: sw.x, top: sw.y, scale: 0.5, opacity: 0.95 }}
            animate={{ scale: 2.3, opacity: 0 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="fixed rounded-full border-4 border-amber-300 shadow-[0_0_24px_rgba(253,224,71,0.9)] -translate-x-1/2 -translate-y-1/2"
            style={{ width: 85, height: 85 }}
          />
        ))}

        {/* Flying Coin Projectiles (From popped bubble to matching target slot) */}
        {flyingCoins.map((coin) => (
          <motion.div
            key={coin.id}
            initial={{
              left: coin.startX,
              top: coin.startY,
              scale: 1,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              left: coin.endX,
              top: coin.endY,
              scale: [1, 1.25, 0.95],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 0.42,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#FDE047] via-[#FACC15] to-[#EAB308] border-2 border-[#FEF9C3] border-b-4 border-b-[#CA8A04] shadow-[0_0_24px_rgba(251,191,36,1),0_8px_16px_rgba(0,0,0,0.3)] flex items-center justify-center font-display font-black text-3xl sm:text-4xl text-[#0F172A] z-50"
          >
            {coin.letter}
            {/* Sparkling Trail Sparks */}
            <motion.span
              animate={{ opacity: [1, 0], scale: [1, 0.3] }}
              transition={{ duration: 0.3, repeat: Infinity }}
              className="absolute -inset-1 rounded-full border-2 border-yellow-200"
            />
          </motion.div>
        ))}

        {/* Arena Touch Tap Ripples */}
        {arenaRipples.map((rip) => (
          <motion.div
            key={rip.id}
            initial={{ left: rip.x, top: rip.y, scale: 0.3, opacity: 0.7 }}
            animate={{ scale: 2.0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed rounded-full border-2 border-white/70 shadow-[0_0_14px_rgba(255,255,255,0.7)] -translate-x-1/2 -translate-y-1/2"
            style={{ width: 55, height: 55 }}
          />
        ))}
      </div>

      {/* ── 4. Celebratory Victory Modal: "CONGRATULATION!" with Petasan & Fireworks ── */}
      <AnimatePresence>
        {roundComplete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
            {/* Semi-translucent celebratory backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/45 backdrop-blur-xs"
            />

            {/* Main Celebratory 3D Card */}
            <motion.div
              initial={{ scale: 0.35, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              className="relative z-10 flex flex-col items-center justify-center text-center p-6 sm:p-8 max-w-lg w-full bg-gradient-to-b from-[#FFFDF8] via-[#FFF7ED] to-[#FEF3C7] rounded-[2.5rem] border-4 border-amber-300 border-b-8 border-b-amber-500 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-8 ring-amber-400/50"
            >
              {/* Rotating Sunburst Rays Background */}
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

              {/* 3D Festive Firecracker ("Petasan") & Fireworks Vector Artwork */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 mb-2 relative flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
                  <defs>
                    <linearGradient id="crackerRed" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="50%" stopColor="#DC2626" />
                      <stop offset="100%" stopColor="#991B1B" />
                    </linearGradient>
                    <linearGradient id="crackerGold" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FDE047" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>

                  {/* Exploding Firework Rays */}
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

                  {/* Sparkling Firework Comets */}
                  <circle cx="60" cy="8" r="3.5" fill="#38BDF8" />
                  <circle cx="100" cy="20" r="4" fill="#F43F5E" />
                  <circle cx="114" cy="60" r="3.5" fill="#34D399" />
                  <circle cx="100" cy="100" r="4" fill="#FDE047" />
                  <circle cx="20" cy="100" r="3.5" fill="#A78BFA" />
                  <circle cx="6" cy="60" r="4" fill="#F43F5E" />
                  <circle cx="20" cy="20" r="3.5" fill="#38BDF8" />

                  {/* Crossed Firecracker Sticks */}
                  <g transform="translate(60, 60) rotate(-25) translate(-60, -60)">
                    <rect x="52" y="28" width="16" height="64" rx="4" fill="url(#crackerRed)" stroke="#7F1D1D" strokeWidth="1.5" />
                    <rect x="52" y="34" width="16" height="8" fill="url(#crackerGold)" />
                    <rect x="52" y="78" width="16" height="8" fill="url(#crackerGold)" />
                    <path d="M 60 28 Q 60 18 68 14" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <circle cx="68" cy="14" r="3" fill="#FEF08A" />
                  </g>

                  <g transform="translate(60, 60) rotate(25) translate(-60, -60)">
                    <rect x="52" y="28" width="16" height="64" rx="4" fill="url(#crackerRed)" stroke="#7F1D1D" strokeWidth="1.5" />
                    <rect x="52" y="34" width="16" height="8" fill="url(#crackerGold)" />
                    <rect x="52" y="78" width="16" height="8" fill="url(#crackerGold)" />
                    <path d="M 60 28 Q 60 18 52 14" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <circle cx="52" cy="14" r="3" fill="#FEF08A" />
                  </g>

                  {/* Center Sparkle Explosion Flash */}
                  <circle cx="60" cy="60" r="10" fill="#FEF08A" />
                  <circle cx="60" cy="60" r="5" fill="#FFFFFF" />
                </svg>
              </div>

              {/* Bold Celebratory Title */}
              <h2 className="font-display font-black text-3xl sm:text-4xl text-[#B91C1C] tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(251,191,36,0.5)]">
                HORE! KAMU HEBAT!
              </h2>

              {/* Mission Success Affirmation Message */}
              <p className="font-sans font-black text-sm sm:text-base text-amber-950 mt-2 leading-relaxed">
                Semua 3 Gelembung Huruf{" "}
                <span className="font-display font-black text-xl sm:text-2xl text-red-600 px-1">
                  {targetLetter}
                </span>{" "}
                Berhasil Dipecahkan!
              </p>

              {/* Bouncy Interactive "Lanjut Huruf Baru" Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.94, y: 2 }}
                onClick={handleNextRound}
                className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 border-2 border-white/90 border-b-6 border-b-amber-700 text-white font-display font-black text-lg sm:text-xl shadow-[0_10px_20px_rgba(217,119,6,0.4)] flex items-center gap-2 cursor-pointer active:border-b-2 active:translate-y-1"
              >
                <Play size={20} className="fill-white" />
                <span>LANJUT HURUF BARU!</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
