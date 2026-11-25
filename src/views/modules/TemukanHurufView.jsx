// src/views/modules/TemukanHurufView.jsx
// SAKA TIKA: "Temukan Huruf" - Clean Clutter-Free Console, 100% Uniform Hint-Free Bubbles,
// & Living Coral Bubble Garden Stage.
// STRICT ZERO SCROLLBAR APP LOCK: h-screen w-screen overflow-hidden select-none.
// STRICT ZERO EMOJIS & ZERO STAR ICONS POLICY: Only lucide-react icons (no Star) and custom vectors.
// STRICT AUDIO GATING: Never auto-play voice narration or SFX on initial mount or round start.

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Volume2, Shuffle, Check, Sparkles, Play } from "lucide-react";

import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { ALPHABET_DATA } from "../../data/masterDataset.js";
import { speakLetter } from "../../utils/speechEngine.js";
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

// 10 Balanced, wide-spread anchor positions in a 2-row curved formation (keeps bottom-left mascots clear)
const BUBBLE_ZONE_ANCHORS = [
  // Row 1: Upper Curved Arc (5 bubbles)
  { left: 11, top: 25 },
  { left: 30.5, top: 20 },
  { left: 50, top: 18 },
  { left: 69.5, top: 20 },
  { left: 89, top: 25 },
  // Row 2: Lower-Mid Curved Arc (5 bubbles, clear of bottom-left Saka & Tika)
  { left: 19, top: 61 },
  { left: 35, top: 56 },
  { left: 52, top: 54 },
  { left: 69, top: 56 },
  { left: 86, top: 61 },
];

// Swaying wildflower blossom for the foreground meadow hills
function StageFlower({ cx, cy, petalColor, centerColor = "#FDE047", delay = 0 }) {
  return (
    <motion.g
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut", delay }}
      style={{ originX: `${cx}px`, originY: `${cy + 14}px` }}
    >
      <path
        d={`M${cx},${cy + 14} Q${cx - 2},${cy + 7} ${cx},${cy}`}
        stroke="#15803D"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy - 4} r="3.6" fill={petalColor} />
      <circle cx={cx + 4} cy={cy} r="3.6" fill={petalColor} />
      <circle cx={cx} cy={cy + 4} r="3.6" fill={petalColor} />
      <circle cx={cx - 4} cy={cy} r="3.6" fill={petalColor} />
      <circle cx={cx} cy={cy} r="3.0" fill={centerColor} />
    </motion.g>
  );
}

// Gentle grass tuft along meadow crest
function GrassTuft({ x, y, delay = 0 }) {
  return (
    <motion.g
      animate={{ rotate: [-4, 4, -4] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay }}
      style={{ originX: `${x}px`, originY: `${y}px` }}
    >
      <path
        d={`M${x},${y} Q${x - 4},${y - 10} ${x - 7},${y - 14} M${x},${y} Q${x},${y - 12} ${x + 1},${y - 16} M${x},${y} Q${x + 4},${y - 9} ${x + 7},${y - 13}`}
        stroke="#86EFAC"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </motion.g>
  );
}

export default function TemukanHurufView() {
  const { addStars } = useGame();
  const { playSfx } = useAudio();

  // Non-repeating Fisher-Yates shuffle queue
  const shuffleQueueRef = useRef(null);
  if (!shuffleQueueRef.current) {
    shuffleQueueRef.current = new ShuffleQueue(ALPHABET_DATA.length);
  }

  const [letterIndex, setLetterIndex] = useState(() => shuffleQueueRef.current.next());
  const [bubbles, setBubbles] = useState([]);
  const [foundIds, setFoundIds] = useState([]);
  const [wobbleId, setWobbleId] = useState(null);
  const [poppingIds, setPoppingIds] = useState([]);

  // Visual pop & projectile effects
  const [splashDroplets, setSplashDroplets] = useState([]);
  const [shockwaves, setShockwaves] = useState([]);
  const [flyingCoins, setFlyingCoins] = useState([]);
  const [arenaRipples, setArenaRipples] = useState([]);
  const [floatingCombos, setFloatingCombos] = useState([]);
  const [slotBounceIndex, setSlotBounceIndex] = useState(null);

  // Game & mascot reaction state
  const [roundComplete, setRoundComplete] = useState(false);
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [mascotAnimationState, setMascotAnimationState] = useState("idle");

  // Element refs for pixel-accurate projectile flight
  const bubbleRefs = useRef({});
  const slotRefs = [useRef(null), useRef(null), useRef(null)];
  const autoAdvanceTimer = useRef(null);
  const confettiRafRef = useRef(null);
  const foundCountRef = useRef(0);

  const currentTarget = useMemo(() => {
    return ALPHABET_DATA[letterIndex % ALPHABET_DATA.length];
  }, [letterIndex]);

  const targetLetter = currentTarget.letter;

  // Build round: 10 completely uniform bubbles (3 targets + 7 distinct distractors)
  const setupRound = useCallback((target) => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }

    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const distractorsPool = allLetters.filter((l) => l !== target);
    const shuffledDistractors = [...distractorsPool].sort(() => 0.5 - Math.random());

    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push({
        id: `target-${i}-${Date.now()}-${Math.random()}`,
        letter: target,
        isTarget: true,
      });
    }
    for (let i = 0; i < 7; i++) {
      items.push({
        id: `distractor-${i}-${Date.now()}-${Math.random()}`,
        letter: shuffledDistractors[i % shuffledDistractors.length],
        isTarget: false,
      });
    }

    const shuffledItems = items.sort(() => 0.5 - Math.random());
    const positionedBubbles = shuffledItems.map((item, idx) => {
      const anchor = BUBBLE_ZONE_ANCHORS[idx] || { left: 50, top: 45 };
      const jitterX = (Math.random() - 0.5) * 1.6;
      const jitterY = (Math.random() - 0.5) * 1.6;
      const floatDuration = 3.4 + Math.random() * 1.4;
      const floatDelay = idx * 0.19;

      return {
        ...item,
        x: Math.max(8, Math.min(92, anchor.left + jitterX)),
        y: Math.max(16, Math.min(66, anchor.top + jitterY)),
        floatDuration,
        floatDelay,
      };
    });

    setBubbles(positionedBubbles);
    foundCountRef.current = 0;
    setFoundIds([]);
    setWobbleId(null);
    setPoppingIds([]);
    setSplashDroplets([]);
    setShockwaves([]);
    setFlyingCoins([]);
    setFloatingCombos([]);
    setRoundComplete(false);
    setIsScreenShaking(false);
    setMascotAnimationState("idle");
  }, []);

  useEffect(() => {
    setupRound(targetLetter);
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
      if (confettiRafRef.current) {
        cancelAnimationFrame(confettiRafRef.current);
        confettiRafRef.current = null;
      }
    };
  }, [targetLetter, setupRound]);

  // Multi-angle confetti fireworks (~2.2s)
  const fireFireworksRockets = () => {
    if (confettiRafRef.current) {
      cancelAnimationFrame(confettiRafRef.current);
    }
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
        confettiRafRef.current = requestAnimationFrame(frame);
      } else {
        confettiRafRef.current = null;
      }
    })();
  };

  // Switch to a new random target letter
  const handleNextRound = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    playHoverSound();
    setLetterIndex(shuffleQueueRef.current.next());
  }, []);

  // Bubble tap / pop handler
  const handleBubbleClick = (bubble, event) => {
    event?.stopPropagation();
    if (roundComplete || foundIds.includes(bubble.id) || poppingIds.includes(bubble.id)) return;

    if (bubble.isTarget) {
      const stageIdx = foundCountRef.current;
      if (stageIdx >= 3) return;
      foundCountRef.current = stageIdx + 1;
      setPoppingIds((prev) => [...prev, bubble.id]);

      // Ascending Do-Re-Mi chimes + bubble pop SFX
      playXylophoneNote(stageIdx);
      playBubblePopSound(stageIdx);
      playCoinWhooshSound();

      const bubbleEl = bubbleRefs.current[bubble.id];
      const slotEl = slotRefs[stageIdx]?.current;
      let startX = window.innerWidth * (bubble.x / 100);
      let startY = window.innerHeight * (bubble.y / 100);
      let endX = window.innerWidth * 0.62;
      let endY = 64;

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

      const shockwaveId = `sw-${Date.now()}-${Math.random()}`;
      setShockwaves((prev) => [...prev, { id: shockwaveId, x: startX, y: startY }]);
      setTimeout(() => {
        setShockwaves((prev) => prev.filter((sw) => sw.id !== shockwaveId));
      }, 450);

      const newDroplets = Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.35;
        const dist = 4.5 + Math.random() * 6;
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

      const comboLabels = ["POP!", "KEREN!", "HEBAT!"];
      const comboId = `combo-${Date.now()}`;
      setFloatingCombos((prev) => [
        ...prev,
        {
          id: comboId,
          text: comboLabels[stageIdx] || "POP!",
          x: bubble.x,
          y: bubble.y - 4,
        },
      ]);
      setTimeout(() => {
        setFloatingCombos((prev) => prev.filter((c) => c.id !== comboId));
      }, 750);

      // Synchronized Saka & Tika cheer hop
      setMascotAnimationState("cheer");
      setTimeout(() => setMascotAnimationState("idle"), 800);

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
        },
      ]);

      setTimeout(() => {
        playSlotSnapSound(stageIdx);
        setSlotBounceIndex(stageIdx);
        setTimeout(() => setSlotBounceIndex(null), 400);

        setFoundIds((prev) => {
          const next = prev.includes(bubble.id) ? prev : [...prev, bubble.id];
          if (next.length >= 3) {
            setIsScreenShaking(true);
            setTimeout(() => setIsScreenShaking(false), 450);

            setRoundComplete(true);
            playSuccessSound();
            playFanfareSound();
            if (typeof addStars === "function") addStars(1);

            fireFireworksRockets();

            autoAdvanceTimer.current = setTimeout(() => {
              handleNextRound();
            }, 2400);
          }
          return next;
        });
        setPoppingIds((prev) => prev.filter((id) => id !== bubble.id));
        setFlyingCoins((prev) => prev.filter((c) => c.id !== coinId));
      }, 420);
    } else {
      // Gentle rubbery bounce + jelly wobble on distractor tap (non-punitive)
      playRubberBoingSound();
      setWobbleId(bubble.id);
      setTimeout(() => setWobbleId(null), 500);

      setMascotAnimationState("encourage");
      setTimeout(() => setMascotAnimationState("idle"), 550);
    }
  };

  // Interactive mascot tap (giggle + hop, no speech bubble)
  const handleMascotTap = (e) => {
    e?.stopPropagation();
    playMascotGiggleSound();
    setMascotAnimationState("giggle");
    setTimeout(() => setMascotAnimationState("idle"), 850);
  };

  // Interactive backdrop ripple
  const handleArenaTap = (e) => {
    if (roundComplete) return;
    playAmbientRippleSound();
    const rippleId = `rip-${Date.now()}-${Math.random()}`;
    setArenaRipples((prev) => [...prev, { id: rippleId, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setArenaRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 550);
  };

  // Manual audio narration only when speaker or letter tile is clicked
  const handleSpeakTarget = (e) => {
    e?.stopPropagation();
    if (typeof playSfx === "function") playSfx("click");
    speakLetter(currentTarget);
  };

  // 18 Rising translucent micro soap bubbles kept well within inner horizontal bounds
  const backgroundMiniBubbles = useMemo(
    () => [
      { left: 8, bottom: 10, size: 22, opacity: 0.34, duration: 8.4, delay: 0 },
      { left: 14, bottom: 18, size: 13, opacity: 0.4, duration: 7.1, delay: 1.4 },
      { left: 21, bottom: 12, size: 30, opacity: 0.28, duration: 9.2, delay: 0.7 },
      { left: 29, bottom: 26, size: 16, opacity: 0.36, duration: 7.7, delay: 2.1 },
      { left: 37, bottom: 14, size: 26, opacity: 0.32, duration: 8.5, delay: 1.0 },
      { left: 45, bottom: 22, size: 18, opacity: 0.38, duration: 7.4, delay: 2.9 },
      { left: 53, bottom: 11, size: 34, opacity: 0.26, duration: 9.6, delay: 0.4 },
      { left: 61, bottom: 24, size: 20, opacity: 0.35, duration: 8.1, delay: 1.8 },
      { left: 69, bottom: 14, size: 28, opacity: 0.3, duration: 8.8, delay: 1.2 },
      { left: 77, bottom: 28, size: 14, opacity: 0.4, duration: 6.9, delay: 2.5 },
      { left: 83, bottom: 16, size: 24, opacity: 0.3, duration: 8.9, delay: 0.3 },
      { left: 88, bottom: 12, size: 19, opacity: 0.36, duration: 7.5, delay: 2.0 },
      { left: 10, bottom: 38, size: 11, opacity: 0.28, duration: 6.8, delay: 3.2 },
      { left: 34, bottom: 42, size: 15, opacity: 0.3, duration: 7.3, delay: 4.0 },
      { left: 58, bottom: 40, size: 17, opacity: 0.32, duration: 7.9, delay: 3.6 },
      { left: 80, bottom: 42, size: 12, opacity: 0.28, duration: 6.6, delay: 4.4 },
      { left: 25, bottom: 52, size: 14, opacity: 0.26, duration: 8.0, delay: 2.4 },
      { left: 74, bottom: 54, size: 16, opacity: 0.28, duration: 8.3, delay: 1.6 },
    ],
    []
  );

  // Subtle giant background alphabet silhouettes kept inward so edges never clip
  const alphabetWatermarks = useMemo(
    () => [
      { char: "A", className: "top-16 left-10 -rotate-12 text-[105px] md:text-[135px]" },
      { char: "B", className: "top-18 right-14 rotate-12 text-[100px] md:text-[130px]" },
      { char: "C", className: "bottom-36 right-16 -rotate-6 text-[95px] md:text-[124px]" },
      { char: "S", className: "bottom-40 left-[22%] rotate-6 text-[95px] md:text-[120px] hidden lg:block" },
    ],
    []
  );

  return (
    <main
      onClick={handleArenaTap}
      className="relative z-10 flex flex-col h-full w-full max-h-screen overflow-hidden justify-between select-none p-2 sm:p-3 cursor-default"
    >
      {/* ── 1. Living "Coral Bubble Garden" Stage Backdrop ── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Warm Coral-to-Ruby Multi-Stop Gradient */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(180deg, #F46B68 0%, #E54848 50%, #B92B2B 100%)",
          }}
        />

        {/* Diagonal Translucent Warm Stage Light Rays Fanning From Upper Center */}
        <div
          aria-hidden="true"
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-[140vw] h-[88vh] opacity-30"
          style={{
            background:
              "conic-gradient(from 155deg at 50% 0%, transparent 0deg, rgba(255,228,214,0.45) 14deg, transparent 28deg, rgba(255,237,213,0.4) 40deg, transparent 54deg, rgba(255,228,214,0.45) 68deg, transparent 84deg)",
          }}
        />

        {/* Warm Coral-Peach Radial Center Spotlight Behind Playfield */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          animate={{ opacity: [0.72, 0.96, 0.72] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse at 52% 48%, rgba(255, 214, 198, 0.36) 0%, rgba(244, 107, 104, 0.12) 45%, transparent 72%)",
          }}
        />

        {/* Subtle Oversized Alphabet Watermark Silhouettes */}
        {alphabetWatermarks.map((wm) => (
          <span
            key={wm.char}
            aria-hidden="true"
            className={`absolute font-display font-black text-white opacity-[0.06] leading-none pointer-events-none select-none ${wm.className}`}
          >
            {wm.char}
          </span>
        ))}

        {/* 3 Fluffy Drifting Upper Clouds Away from HUD Corners */}
        <div className="absolute top-6 left-[20%] opacity-35">
          <FloatingCloud x={0} y={0} scale={0.78} duration={26} />
        </div>
        <div className="absolute top-4 left-[52%] -translate-x-1/2 opacity-30 hidden md:block">
          <FloatingCloud x={0} y={0} scale={0.62} duration={30} delay={1.8} />
        </div>
        <div className="absolute top-9 right-[18%] opacity-35 hidden sm:block">
          <FloatingCloud x={0} y={0} scale={0.72} duration={28} delay={3.2} />
        </div>
        <AnimatedBird initialY={44} delay={2} className="opacity-70" />
        <AnimatedButterfly initialY={135} delay={1} className="opacity-75" />

        {/* 18 Abundant Rising Translucent Micro Soap Bubbles */}
        {backgroundMiniBubbles.map((ab, idx) => (
          <motion.div
            key={`bmb-${idx}`}
            className="absolute rounded-full border border-white/40 pointer-events-none"
            style={{
              left: `${ab.left}%`,
              bottom: `${ab.bottom}%`,
              width: `${ab.size}px`,
              height: `${ab.size}px`,
              background:
                "radial-gradient(circle at 32% 30%, rgba(255,255,255,0.75) 0%, rgba(254,205,211,0.22) 52%, rgba(255,255,255,0.06) 100%)",
              boxShadow:
                "inset 0 0 5px rgba(255,255,255,0.65), 0 0 8px rgba(255,255,255,0.22)",
              opacity: ab.opacity,
            }}
            animate={{
              y: [-8, -110, -210],
              x: [0, idx % 2 === 0 ? 14 : -14, 0],
              opacity: [ab.opacity, ab.opacity * 1.25, 0],
              scale: [0.9, 1.06, 0.94],
            }}
            transition={{
              duration: ab.duration,
              repeat: Infinity,
              delay: ab.delay,
              ease: "easeInOut",
            }}
          >
            <div className="absolute top-1 left-1.5 w-1.5 h-1 bg-white/95 rounded-full -rotate-45 pointer-events-none" />
          </motion.div>
        ))}

        {/* Two Overlapping Lush Curved 3D Meadow Hills + 14 Swaying Wildflowers & Grass Tufts */}
        <div className="absolute bottom-0 inset-x-0 h-32 sm:h-36 md:h-40 overflow-hidden pointer-events-none z-10">
          <svg viewBox="0 0 1440 200" fill="none" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="frontMeadowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#15803D" />
              </linearGradient>
            </defs>

            {/* Warm Olive-Emerald Back Rolling Hill */}
            <path
              d="M-40 105 Q260 55 580 98 T1180 78 Q1340 72 1480 92 L1480 200 L-40 200 Z"
              fill="#16A34A"
            />
            {/* Back hill subtle rim highlight */}
            <path
              d="M-40 105 Q260 55 580 98 T1180 78 Q1340 72 1480 92"
              stroke="#4ADE80"
              strokeOpacity="0.45"
              strokeWidth="3"
              fill="none"
            />

            {/* Sweeping Front Vibrant Meadow Lawn */}
            <path
              d="M-20 132 Q320 82 720 124 T1460 112 L1460 200 L-20 200 Z"
              fill="url(#frontMeadowGrad)"
            />
            <path
              d="M-20 132 Q320 82 720 124 T1460 112"
              stroke="#86EFAC"
              strokeOpacity="0.6"
              strokeWidth="4"
              fill="none"
            />

            {/* Grass Tufts along Hill Crests */}
            <GrassTuft x={310} y={108} delay={0.2} />
            <GrassTuft x={540} y={120} delay={0.9} />
            <GrassTuft x={860} y={118} delay={0.5} />
            <GrassTuft x={1120} y={112} delay={1.3} />
            <GrassTuft x={1360} y={114} delay={0.7} />

            {/* 14 Swaying Daisies & Coral Wildflowers along Both Hill Crests */}
            <StageFlower cx={60} cy={120} petalColor="#FFFFFF" delay={0.1} />
            <StageFlower cx={115} cy={110} petalColor="#FB7185" delay={0.6} />
            <StageFlower cx={175} cy={124} petalColor="#FEF08A" delay={1.1} />
            <StageFlower cx={245} cy={96} petalColor="#FFFFFF" delay={0.4} />
            <StageFlower cx={365} cy={104} petalColor="#FB7185" delay={0.9} />
            <StageFlower cx={455} cy={112} petalColor="#FEF08A" delay={1.4} />
            <StageFlower cx={595} cy={116} petalColor="#FFFFFF" delay={0.3} />
            <StageFlower cx={680} cy={108} petalColor="#FB7185" delay={1.0} />
            <StageFlower cx={785} cy={118} petalColor="#FEF08A" delay={1.6} />
            <StageFlower cx={925} cy={106} petalColor="#FFFFFF" delay={0.5} />
            <StageFlower cx={1025} cy={96} petalColor="#FB7185" delay={1.2} />
            <StageFlower cx={1195} cy={104} petalColor="#FEF08A" delay={0.8} />
            <StageFlower cx={1295} cy={98} petalColor="#FFFFFF" delay={1.5} />
            <StageFlower cx={1395} cy={106} petalColor="#FB7185" delay={0.2} />
          </svg>
        </div>
      </div>

      {/* ── 2. Screen Shake Wrapper & Clean Main Stage (overflow-visible prevents HUD/bubble halo clipping) ── */}
      <motion.div
        animate={isScreenShaking ? { x: [-5, 5, -3, 3, -1, 1, 0], y: [-3, 3, -1, 1, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex-1 min-h-0 overflow-visible flex flex-col justify-between max-w-7xl w-full mx-auto"
      >
        {/* Streamlined Top "CARI HURUF" Console (Generous min-h & overflow-visible for unclipped slots) */}
        <header className="w-full px-2 pt-2 sm:pt-3 flex justify-center flex-shrink-0 z-30 overflow-visible">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 20 }}
            className="w-fit mx-auto px-7 sm:px-8 py-4 min-h-[76px] rounded-[2rem] bg-[#FFFDF9]/95 border-4 border-amber-300 border-b-6 border-b-amber-500 shadow-[0_12px_0_rgba(153,27,27,0.32)] flex items-center justify-center gap-4 sm:gap-5 md:gap-7 relative overflow-visible"
          >
            {/* 1. Manual Audio Button (Strict Audio Gating) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.92, y: 2 }}
              onClick={handleSpeakTarget}
              aria-label={`Dengarkan bunyi huruf ${targetLetter}`}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-[#0284C7] to-[#0369A1] border-2 border-white border-b-4 border-b-[#075985] text-white shadow-md cursor-pointer flex items-center justify-center active:border-b-2 active:translate-y-1 flex-shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
            >
              <Volume2 size={21} aria-hidden="true" className="stroke-[2.5]" />
            </motion.button>

            {/* 2. Oversized "CARI HURUF:" + 3D Golden-Amber Target Letter Tile */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <span className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-[#0F172A] tracking-wide leading-none uppercase">
                CARI HURUF:
              </span>

              <motion.button
                type="button"
                whileHover={{ scale: 1.08, rotate: 2 }}
                whileTap={{ scale: 0.92 }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                onClick={handleSpeakTarget}
                aria-label={`Huruf target ${targetLetter}`}
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-b from-[#D97706] to-[#B45309] border-2 border-amber-200 border-b-4 border-b-[#78350F] shadow-md flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-display font-black text-white leading-none cursor-pointer flex-shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
              >
                {targetLetter}
              </motion.button>
            </div>

            {/* 3. Three Glossy Progress Capsule Slots (Zero Star Icons, Unclipped Borders) */}
            <div className="flex items-center gap-2 sm:gap-2.5 py-0.5 flex-shrink-0 overflow-visible">
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
                        ? { scale: [0.7, 1.32, 1], rotate: [0, -10, 0] }
                        : { scale: 1 }
                    }
                    transition={{ type: "spring", stiffness: 450, damping: 14 }}
                    className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center relative shrink-0 transition-all ${
                      isFilled
                        ? "bg-gradient-to-b from-[#059669] to-[#047857] border-2 border-[#065F46] ring-2 ring-amber-300 text-white shadow-md"
                        : "bg-amber-50/80 border-[3px] border-dashed border-amber-400 shadow-inner"
                    }`}
                  >
                    {isFilled ? (
                      <>
                        <span className="font-display font-black text-xl sm:text-2xl text-white leading-none">
                          {targetLetter}
                        </span>
                        <span
                          aria-hidden="true"
                          className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-slate-900 shadow-xs"
                        >
                          <Check size={10} strokeWidth={3.5} />
                        </span>
                      </>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* 4. Circular Shuffle / New Letter Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.92, y: 2 }}
              onClick={handleNextRound}
              aria-label="Ganti ke huruf target acak berikutnya"
              className="w-11 h-11 rounded-full bg-white hover:bg-slate-50 border-2 border-slate-200 border-b-4 border-b-slate-300 text-slate-700 shadow-sm cursor-pointer flex items-center justify-center active:border-b-2 active:translate-y-1 flex-shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
            >
              <Shuffle size={18} aria-hidden="true" className="stroke-[2.5]" />
            </motion.button>
          </motion.div>
        </header>

        {/* ── Wide Curved Arena: 10 Identical Hint-Free Glossy Soap Bubbles (overflow-visible) ── */}
        <section className="relative z-20 flex-1 min-h-0 max-w-5xl w-full mx-auto px-6 my-auto overflow-visible">
          {/* Floating Pop Juice Badges */}
          {floatingCombos.map((cb) => (
            <motion.div
              key={cb.id}
              initial={{ left: `${cb.x}%`, top: `${cb.y}%`, opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.25, 1, 0.9], y: -45 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-45 px-3 py-1 rounded-full bg-[#B45309] border-2 border-white text-white font-display font-black text-sm sm:text-base shadow-lg flex items-center gap-1"
            >
              <Sparkles size={14} aria-hidden="true" className="text-amber-200" />
              <span>{cb.text}</span>
            </motion.div>
          ))}

          {/* Water Droplets and Sparkles on Correct Pop */}
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

          {/* All 10 Playable Bubbles (Wrapped cleanly so Framer Motion transforms never wipe out centering) */}
          {bubbles.map((b) => {
            const isFound = foundIds.includes(b.id);
            const isPopping = poppingIds.includes(b.id);
            const isWobble = wobbleId === b.id;

            if (isFound) return null;

            return (
              <div
                key={b.id}
                style={{ left: `${b.x}%`, top: `${b.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <motion.button
                  ref={(el) => (bubbleRefs.current[b.id] = el)}
                  type="button"
                  onClick={(e) => handleBubbleClick(b, e)}
                  disabled={roundComplete}
                  aria-label={`Gelembung huruf ${b.letter}`}
                  whileHover={{
                    scale: 1.12,
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
                          x: [-7, 7, -5, 5, 0],
                          rotate: [-10, 10, -6, 6, 0],
                          scale: [1, 1.08, 0.94, 1.03, 1],
                        }
                      : {
                          y: [-6, 6, -6],
                          rotate: [-2.5, 2.5, -2.5],
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
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center select-none cursor-pointer relative active:scale-95 transition-shadow group shadow-[0_12px_26px_rgba(127,29,29,0.28)]"
                >
                  {/* Uniform White Specular Rim Sheen on Hover */}
                  <div className="absolute -inset-1 rounded-full ring-3 ring-white/90 shadow-[0_0_18px_rgba(255,255,255,0.65)] pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Uniform Iridescent Translucent Soap-Bubble Shell */}
                  <div
                    className="absolute inset-0 rounded-full border-[2.5px] border-white/85 bg-white/15 backdrop-blur-[2px] shadow-[inset_0_0_14px_rgba(255,255,255,0.75)] pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.78) 0%, rgba(224,242,254,0.32) 32%, rgba(252,231,243,0.22) 66%, rgba(254,240,138,0.18) 85%, rgba(56,189,248,0.24) 100%)",
                    }}
                  />

                  {/* Uniform Bubble Sprite Texture */}
                  <img
                    src="/assets/gelembung.png"
                    alt=""
                    aria-hidden="true"
                    draggable="false"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none rounded-full opacity-75 group-hover:opacity-95 transition-opacity"
                  />

                  {/* Top-Left Curved Specular Highlight */}
                  <div className="absolute top-2.5 left-3.5 w-6 h-3 bg-white/95 rounded-full -rotate-45 blur-[0.2px] pointer-events-none z-20" />
                  <div className="absolute top-6 left-2.5 w-2 h-2 bg-white/90 rounded-full pointer-events-none z-20" />

                  {/* Diagonal Specular Sheen Sweep on Hover */}
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-25">
                    <div className="w-full h-full bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </div>

                  {/* 100% Uniform Solid Ivory-White Inner Letter Coin (Unclipped glyphs J, Q, G) */}
                  <div className="w-18 h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#F1F5F9] border-2 border-white border-b-4 border-b-slate-300 shadow-inner flex items-center justify-center overflow-visible pointer-events-none z-20 transition-transform group-hover:scale-105">
                    <span className="font-display font-black text-3xl md:text-4xl leading-normal text-[#0F172A] select-none">
                      {b.letter}
                    </span>
                  </div>
                </motion.button>
              </div>
            );
          })}
        </section>
      </motion.div>

      {/* ── Foreground Saka & Tika Positioned Cleanly In Front of Green Meadow Hill (z-20) ── */}
      <div className="fixed bottom-3 md:bottom-4 left-4 sm:left-6 z-20 select-none flex flex-col items-center">
          <div className="relative flex items-end justify-center -mb-1">
            <motion.button
              type="button"
              onClick={handleMascotTap}
              whileHover={{ scale: 1.07, y: -4 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Saka Maskot"
              animate={
                roundComplete
                  ? { y: [0, -18, 0], scale: [1, 1.06, 1] }
                  : mascotAnimationState === "cheer"
                  ? { y: [0, -18, 0], scale: [1, 1.06, 1] }
                  : mascotAnimationState === "giggle"
                  ? { y: [0, -18, 0], rotate: [0, -6, 4, 0] }
                  : mascotAnimationState === "encourage"
                  ? { y: [-4, 0], rotate: [-3, 3, 0] }
                  : { y: [0, -3.5, 0], rotate: [-1, 1, -1] }
              }
              transition={
                roundComplete
                  ? { duration: 0.72, repeat: Infinity, ease: "easeOut" }
                  : mascotAnimationState === "cheer" || mascotAnimationState === "giggle"
                  ? { duration: 0.68, ease: "easeOut" }
                  : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
              }
              className="cursor-pointer pointer-events-auto p-0 border-0 bg-transparent outline-none flex items-end z-20"
            >
              <img
                src="/assets/saka-maskot-1-cutout.png"
                alt="Saka Maskot"
                draggable="false"
                className="h-[24vh] min-h-[160px] max-h-[225px] w-auto object-contain object-bottom drop-shadow-[0_6px_12px_rgba(0,0,0,0.3)]"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </motion.button>

            <motion.button
              type="button"
              onClick={handleMascotTap}
              whileHover={{ scale: 1.07, y: -4 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Tika Maskot"
              animate={
                roundComplete
                  ? { y: [0, -18, 0], scale: [1, 1.06, 1] }
                  : mascotAnimationState === "cheer"
                  ? { y: [0, -18, 0], scale: [1, 1.06, 1] }
                  : mascotAnimationState === "giggle"
                  ? { y: [0, -18, 0], rotate: [0, 6, -4, 0] }
                  : mascotAnimationState === "encourage"
                  ? { y: [-4, 0], rotate: [3, -3, 0] }
                  : { y: [0, -3.5, 0], rotate: [1, -1, 1] }
              }
              transition={
                roundComplete
                  ? { duration: 0.72, delay: 0.08, repeat: Infinity, ease: "easeOut" }
                  : mascotAnimationState === "cheer" || mascotAnimationState === "giggle"
                  ? { duration: 0.68, delay: 0.08, ease: "easeOut" }
                  : { duration: 3.6, repeat: Infinity, delay: 0.4, ease: "easeInOut" }
              }
              className="cursor-pointer pointer-events-auto p-0 border-0 bg-transparent outline-none flex items-end -ml-5 z-20"
            >
              <img
                src="/assets/icon-tika-utama.png"
                alt="Tika Maskot"
                draggable="false"
                className="h-[24vh] min-h-[160px] max-h-[225px] w-auto object-contain object-bottom drop-shadow-[0_6px_12px_rgba(0,0,0,0.3)]"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </motion.button>
          </div>

          {/* Elliptical Shoe Contact Shadows */}
          <div className="relative w-52 sm:w-60 h-3 flex items-center justify-around pointer-events-none -mt-1.5 z-10">
            <div className="w-22 h-3 bg-[#064E3B]/40 rounded-full blur-[2px]" />
            <div className="w-22 h-3 bg-[#064E3B]/40 rounded-full blur-[2px]" />
          </div>
        </div>

      {/* ── 3. Overlay Layer: Shockwaves, Flying Coins & Tap Ripples ── */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
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
            <motion.span
              animate={{ opacity: [1, 0], scale: [1, 0.3] }}
              transition={{ duration: 0.3, repeat: Infinity }}
              className="absolute -inset-1 rounded-full border-2 border-yellow-200"
            />
          </motion.div>
        ))}

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

      {/* ── 4. Single "HORE! KAMU HEBAT!" Celebration Overlay (Zero Stars, Zero Emojis) ── */}
      <AnimatePresence>
        {roundComplete && (
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
              className="relative z-10 flex flex-col items-center justify-center text-center p-6 sm:p-8 max-w-lg w-full bg-gradient-to-b from-[#FFFDF8] via-[#FFF7ED] to-[#FEF3C7] rounded-[2.5rem] border-4 border-amber-300 border-b-8 border-b-amber-500 shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-8 ring-amber-400/50"
            >
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

                  <circle cx="60" cy="60" r="10" fill="#FEF08A" />
                  <circle cx="60" cy="60" r="5" fill="#FFFFFF" />
                </svg>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl text-[#B91C1C] tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(251,191,36,0.5)]">
                HORE! KAMU HEBAT!
              </h2>

              <p className="font-sans font-black text-sm sm:text-base text-amber-950 mt-2 leading-relaxed">
                Semua 3 Gelembung Huruf{" "}
                <span className="font-display font-black text-xl sm:text-2xl text-red-700 px-1">
                  {targetLetter}
                </span>{" "}
                Berhasil Dipecahkan!
              </p>

              <motion.button
                type="button"
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.94, y: 2 }}
                onClick={handleNextRound}
                className="mt-5 px-6 py-3 rounded-2xl bg-gradient-to-b from-[#B45309] to-[#9A3412] border-2 border-white border-b-6 border-b-[#7C2D12] text-white font-display font-black text-lg sm:text-xl shadow-lg flex items-center gap-2 cursor-pointer active:border-b-2 active:translate-y-1"
              >
                <Play size={20} aria-hidden="true" className="fill-white" />
                <span>LANJUT HURUF BARU!</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
