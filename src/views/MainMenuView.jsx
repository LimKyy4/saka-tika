// src/views/MainMenuView.jsx
// SAKA TIKA: Soft Lavender Studio (/menu) with Solid #E4DDFC Backdrop, Floating Educational Ornaments,
// and Oversized 5-Card Toy-Block Deck with Thick Outer White Borders.
// STRICT ZERO EMOJIS & ZERO STAR COUNTER ICONS POLICY.

import { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useGame } from "../context/GameContext.jsx";
import { useAudio } from "../context/AudioContext.jsx";

// 5 Living Micro-World Diorama Components (ZERO EMOJIS, ZERO MASCOTS)
import AlphabetStorybookDiorama from "../components/illustrations/dioramas/AlphabetStorybookDiorama.jsx";
import EaselTracingDiorama from "../components/illustrations/dioramas/EaselTracingDiorama.jsx";
import BubblePrismDiorama from "../components/illustrations/dioramas/BubblePrismDiorama.jsx";
import PopKeysDiorama from "../components/illustrations/dioramas/PopKeysDiorama.jsx";
import WordPuzzleTrayDiorama from "../components/illustrations/dioramas/WordPuzzleTrayDiorama.jsx";

// 5 Core Educational Modules in Single-Row Toy-Block Deck
const MODULES = [
  {
    id: "mengenal",
    index: 0,
    title: "Mengenal Huruf",
    route: "/mengenal-huruf",
    cardBg: "bg-gradient-to-b from-[#2B8CE6] via-[#257FD6] to-[#1D4ED8]",
    windowBg: "bg-[#1E6BB8]/35",
    windowBorder: "border-white/50",
    glowColor: "rgba(43, 140, 230, 0.45)",
    DioramaComponent: AlphabetStorybookDiorama,
  },
  {
    id: "menulis",
    index: 1,
    title: "Menulis Huruf",
    route: "/menulis-huruf",
    cardBg: "bg-gradient-to-b from-[#F59E0B] via-[#D97706] to-[#B45309]",
    windowBg: "bg-[#92400E]/25",
    windowBorder: "border-white/55",
    glowColor: "rgba(245, 158, 11, 0.45)",
    DioramaComponent: EaselTracingDiorama,
  },
  {
    id: "temukan",
    index: 2,
    title: "Temukan Huruf",
    route: "/temukan-huruf",
    cardBg: "bg-gradient-to-b from-[#EF4444] via-[#E53935] to-[#DC2626]",
    windowBg: "bg-[#991B1B]/25",
    windowBorder: "border-white/50",
    glowColor: "rgba(239, 68, 68, 0.45)",
    DioramaComponent: BubblePrismDiorama,
  },
  {
    id: "mengetik",
    index: 3,
    title: "Mengetik Huruf",
    route: "/mengetik-huruf",
    cardBg: "bg-gradient-to-b from-[#EC4899] via-[#E13286] to-[#DB2777]",
    windowBg: "bg-[#9D174D]/25",
    windowBorder: "border-white/50",
    glowColor: "rgba(236, 72, 153, 0.45)",
    DioramaComponent: PopKeysDiorama,
  },
  {
    id: "melengkapi",
    index: 4,
    title: "Melengkapi Kata",
    route: "/melengkapi-kata",
    cardBg: "bg-gradient-to-b from-[#10B981] via-[#059669] to-[#047857]",
    windowBg: "bg-[#064E3B]/25",
    windowBorder: "border-white/50",
    glowColor: "rgba(16, 185, 129, 0.45)",
    DioramaComponent: WordPuzzleTrayDiorama,
  },
];

// Perimeter-only educational flat-vector ornaments framing the 5-card deck
function LavenderStudioOrnaments({ reduceMotion }) {
  const floatMotion = (yRange, rotRange, duration, delay = 0) =>
    reduceMotion
      ? {}
      : {
          animate: {
            y: yRange,
            rotate: rotRange,
          },
          transition: {
            duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          },
        };

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Upper-Left Corner: Rounded Blunt Puzzle Piece (#C9BCFA) */}
      <motion.svg
        width="108"
        height="108"
        viewBox="0 0 110 110"
        fill="none"
        className="absolute top-16 left-4 sm:left-8 opacity-90"
        {...floatMotion([-6, 6, -6], [-4, 2, -4], 6.4, 0)}
      >
        <path
          d="M24 22 H46 C46 12 64 12 64 22 H84 A12 12 0 0 1 96 34 V54 C106 54 106 72 96 72 V86 A12 12 0 0 1 84 98 H24 A12 12 0 0 1 12 86 V70 C22 70 22 52 12 52 V34 A12 12 0 0 1 24 22 Z"
          fill="#C9BCFA"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </motion.svg>

      {/* Upper-Left Margin: Chubby 4-Point Rounded Star (#FDE68A) */}
      <motion.svg
        width="48"
        height="48"
        viewBox="0 0 60 60"
        fill="none"
        className="absolute top-24 left-36 sm:left-44 opacity-95"
        {...floatMotion([-5, 5, -5], [-3, 3, -3], 5.4, 0.6)}
      >
        <path
          d="M30 6 C35 20 40 25 54 30 C40 35 35 40 30 54 C25 40 20 35 6 30 C20 25 25 20 30 6 Z"
          fill="#FDE68A"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </motion.svg>

      {/* Upper-Center-Left: Tilted Mint Pill Capsule */}
      <motion.svg
        width="74"
        height="38"
        viewBox="0 0 74 38"
        fill="none"
        className="absolute top-8 left-[28%] hidden md:block opacity-90"
        {...floatMotion([-5, 6, -5], [-26, -20, -26], 7.0, 0.3)}
      >
        <rect
          x="4"
          y="4"
          width="66"
          height="30"
          rx="15"
          fill="#A7F3D0"
          stroke="#FFFFFF"
          strokeWidth="4"
        />
      </motion.svg>

      {/* Upper-Center-Right: Chubby White 4-Point Rounded Star */}
      <motion.svg
        width="40"
        height="40"
        viewBox="0 0 60 60"
        fill="none"
        className="absolute top-10 right-[26%] hidden md:block opacity-95"
        {...floatMotion([-4, 6, -4], [0, 5, 0], 5.8, 1.0)}
      >
        <path
          d="M30 8 C35 21 39 25 52 30 C39 35 35 39 30 52 C25 39 21 35 8 30 C21 25 25 21 30 8 Z"
          fill="#FFFFFF"
        />
      </motion.svg>

      {/* Upper-Right Corner: Blunt Pastel Pencil Silhouette */}
      <motion.svg
        width="104"
        height="104"
        viewBox="0 0 110 110"
        fill="none"
        className="absolute top-16 right-4 sm:right-10 opacity-95"
        {...floatMotion([-6, 5, -6], [22, 28, 22], 6.8, 0.4)}
      >
        <g transform="rotate(32 55 55)">
          <rect
            x="40"
            y="14"
            width="30"
            height="18"
            rx="9"
            fill="#FBCFE8"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          <rect
            x="40"
            y="28"
            width="30"
            height="10"
            rx="3"
            fill="#DDD6FE"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          <rect
            x="40"
            y="36"
            width="30"
            height="44"
            rx="6"
            fill="#FDE68A"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          <path
            d="M41 78 L55 98 Q55 100 55 98 L69 78 Z"
            fill="#DDD6FE"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </g>
      </motion.svg>

      {/* Upper-Right Margin: Tilted Blush Pink Pill Capsule */}
      <motion.svg
        width="68"
        height="34"
        viewBox="0 0 68 34"
        fill="none"
        className="absolute top-32 right-32 sm:right-44 opacity-90"
        {...floatMotion([-4, 5, -4], [17, 23, 17], 6.1, 0.9)}
      >
        <rect
          x="4"
          y="4"
          width="60"
          height="26"
          rx="13"
          fill="#FBCFE8"
          stroke="#FFFFFF"
          strokeWidth="4"
        />
      </motion.svg>

      {/* Lower-Left Corner: Blunt Cartoon Pencil Silhouette */}
      <motion.svg
        width="110"
        height="110"
        viewBox="0 0 110 110"
        fill="none"
        className="absolute bottom-3 left-4 sm:left-8 opacity-95"
        {...floatMotion([-5, 6, -5], [-28, -22, -28], 7.4, 0.2)}
      >
        <g transform="rotate(-35 55 55)">
          <rect
            x="40"
            y="14"
            width="30"
            height="18"
            rx="9"
            fill="#C4B5FD"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          <rect
            x="40"
            y="28"
            width="30"
            height="10"
            rx="3"
            fill="#BAE6FD"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          <rect
            x="40"
            y="36"
            width="30"
            height="44"
            rx="6"
            fill="#DDD6FE"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          <path
            d="M41 78 L55 98 L69 78 Z"
            fill="#FDE68A"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </g>
      </motion.svg>

      {/* Lower-Left Margin: Chubby 4-Point Rounded Star (White) */}
      <motion.svg
        width="44"
        height="44"
        viewBox="0 0 60 60"
        fill="none"
        className="absolute bottom-10 left-36 sm:left-48 opacity-95"
        {...floatMotion([-6, 4, -6], [-4, 4, -4], 5.2, 0.8)}
      >
        <path
          d="M30 8 C35 21 39 25 52 30 C39 35 35 39 30 52 C25 39 21 35 8 30 C21 25 25 21 30 8 Z"
          fill="#FFFFFF"
        />
      </motion.svg>

      {/* Lower-Center-Left: Tilted Periwinkle Pill Capsule */}
      <motion.svg
        width="76"
        height="36"
        viewBox="0 0 76 36"
        fill="none"
        className="absolute bottom-4 left-[30%] hidden md:block opacity-90"
        {...floatMotion([-4, 5, -4], [18, 24, 18], 6.6, 1.2)}
      >
        <rect
          x="4"
          y="4"
          width="68"
          height="28"
          rx="14"
          fill="#C4B5FD"
          stroke="#FFFFFF"
          strokeWidth="4"
        />
      </motion.svg>

      {/* Lower-Center-Right: Chubby Butter-Yellow 4-Point Rounded Star */}
      <motion.svg
        width="46"
        height="46"
        viewBox="0 0 60 60"
        fill="none"
        className="absolute bottom-5 right-[28%] hidden md:block opacity-95"
        {...floatMotion([-5, 5, -5], [-3, 3, -3], 5.6, 0.5)}
      >
        <path
          d="M30 6 C35 20 40 25 54 30 C40 35 35 40 30 54 C25 40 20 35 6 30 C20 25 25 20 30 6 Z"
          fill="#FDE68A"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </motion.svg>

      {/* Lower-Right Corner: Pastel Sky Rounded Blunt Puzzle Piece (#BAE6FD) */}
      <motion.svg
        width="112"
        height="112"
        viewBox="0 0 110 110"
        fill="none"
        className="absolute bottom-3 right-4 sm:right-8 opacity-95"
        {...floatMotion([-6, 6, -6], [2, -4, 2], 7.2, 0.4)}
      >
        <path
          d="M24 22 H46 C46 12 64 12 64 22 H84 A12 12 0 0 1 96 34 V54 C106 54 106 72 96 72 V86 A12 12 0 0 1 84 98 H24 A12 12 0 0 1 12 86 V70 C22 70 22 52 12 52 V34 A12 12 0 0 1 24 22 Z"
          fill="#BAE6FD"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </motion.svg>

      {/* Lower-Right Margin: Tilted Pill Capsule (Mint) */}
      <motion.svg
        width="64"
        height="32"
        viewBox="0 0 64 32"
        fill="none"
        className="absolute bottom-14 right-36 sm:right-48 opacity-90"
        {...floatMotion([-4, 4, -4], [-37, -31, -37], 5.9, 1.1)}
      >
        <rect
          x="4"
          y="4"
          width="56"
          height="24"
          rx="12"
          fill="#A7F3D0"
          stroke="#FFFFFF"
          strokeWidth="4"
        />
      </motion.svg>
    </div>
  );
}

function ModuleCard({ module, onPlay, reduceMotion }) {
  const { playSfx } = useAudio();
  const [isHovered, setIsHovered] = useState(false);
  const Diorama = module.DioramaComponent;

  const handleClick = () => {
    if (typeof playSfx === "function") playSfx("click");
    onPlay(module.route, module.index);
  };

  return (
    <motion.button
      type="button"
      whileHover={reduceMotion ? {} : { scale: 1.03, y: -12 }}
      whileTap={reduceMotion ? {} : { scale: 0.97, y: 6 }}
      transition={{ type: "spring", stiffness: 450, damping: 18 }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (typeof playSfx === "function") playSfx("hover");
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        boxShadow: isHovered
          ? `0 20px 0 rgba(76, 29, 149, 0.16), 0 26px 42px ${module.glowColor}, 0 0 26px ${module.glowColor}`
          : "0 14px 0 rgba(76, 29, 149, 0.16), 0 20px 32px rgba(76, 29, 149, 0.14)",
      }}
      className={`relative group overflow-hidden w-full h-[56vh] min-h-[360px] max-h-[500px] rounded-[2rem] p-3 lg:p-4 ${module.cardBg} border-[5px] lg:border-[6px] border-white flex flex-col justify-between items-center select-none cursor-pointer transition-shadow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-700`}
      aria-label={`Pilih modul ${module.title}`}
    >
      {/* Top Inner Gloss Highlight */}
      <div
        aria-hidden="true"
        className="absolute top-2 inset-x-5 h-[3px] bg-white/45 rounded-full pointer-events-none z-20"
      />

      {/* Smooth Diagonal Gloss Shimmer on Hover */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-22deg] pointer-events-none z-20"
        animate={isHovered && !reduceMotion ? { x: ["-160%", "320%"] } : { x: "-160%" }}
        transition={{ duration: 0.85, ease: "easeInOut" }}
      />

      {/* 1. Upper Zone: Enlarged Diorama Window (~68% Card Height) */}
      <div
        className={`relative w-full h-[68%] rounded-[1.35rem] overflow-hidden ${module.windowBg} border-2 ${module.windowBorder} shadow-[inset_0_4px_10px_rgba(0,0,0,0.22)] flex items-center justify-center p-2.5 lg:p-3`}
      >
        <div
          aria-hidden="true"
          className="absolute top-1.5 inset-x-4 h-[2px] bg-white/35 rounded-full pointer-events-none z-10"
        />

        <motion.div
          className="relative z-10 w-full h-full flex items-center justify-center"
          animate={reduceMotion ? {} : { y: [-4, 4, -4] }}
          transition={{
            duration: 3.2 + module.index * 0.35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: module.index * 0.25,
          }}
        >
          <Diorama
            isActive={!reduceMotion}
            className="[&_svg]:max-h-none [&_svg]:w-full [&_svg]:h-full"
          />
        </motion.div>
      </div>

      {/* 2. Lower Zone: Bold High-Contrast White Title (~32% Card Height) */}
      <div className="w-full h-[32%] flex items-center justify-center px-2">
        <h2 className="font-display font-extrabold text-lg lg:text-xl xl:text-2xl text-white text-center leading-tight tracking-wide drop-shadow-[0_2px_3px_rgba(0,0,0,0.22)]">
          {module.title}
        </h2>
      </div>
    </motion.button>
  );
}

export default function MainMenuView() {
  const { navigateTo, setActiveCarouselIndex } = useGame();
  const { playSfx } = useAudio();
  const reduceMotion = useReducedMotion();

  const handlePlay = useCallback(
    (route, index) => {
      if (typeof setActiveCarouselIndex === "function") {
        setActiveCarouselIndex(index);
      }
      if (typeof playSfx === "function") {
        playSfx("fanfare");
      }
      if (typeof navigateTo === "function") {
        navigateTo(route);
      }
    },
    [setActiveCarouselIndex, playSfx, navigateTo]
  );

  return (
    <main className="relative w-screen h-screen max-h-screen overflow-hidden flex flex-col justify-center bg-[#E4DDFC] select-none">
      {/* 1. Perimeter Playful Educational Ornaments over Solid #E4DDFC Backdrop */}
      <LavenderStudioOrnaments reduceMotion={Boolean(reduceMotion)} />

      {/* 2. Centered Stage: Enlarged 5-Column Single-Row Toy-Block Deck */}
      <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center pt-14 sm:pt-16 pb-4">
        <div className="grid grid-cols-5 gap-4 lg:gap-5 max-w-[94vw] xl:max-w-[1440px] w-full mx-auto px-4 lg:px-6">
          {MODULES.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onPlay={handlePlay}
              reduceMotion={Boolean(reduceMotion)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
