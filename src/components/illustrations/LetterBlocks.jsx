// src/components/illustrations/LetterBlocks.jsx
// Studio-grade musical 3D toy alphabet blocks with xylophone notes & confetti burst.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useAudio } from "../../context/AudioContext.jsx";

const BLOCKS = [
  {
    letter: "A",
    note: "note-do",
    label: "Do",
    bgGrad: "from-[#60A5FA] to-[#3B82F6]",
    border: "border-[#1D4ED8]",
    shadow: "shadow-blue-500/30",
    tilt: "-rotate-6",
    confettiColor: ["#60A5FA", "#93C5FD", "#3B82F6"],
  },
  {
    letter: "B",
    note: "note-re",
    label: "Re",
    bgGrad: "from-[#F87171] to-[#EF4444]",
    border: "border-[#B91C1C]",
    shadow: "shadow-red-500/30",
    tilt: "rotate-3",
    confettiColor: ["#F87171", "#FCA5A5", "#EF4444"],
  },
  {
    letter: "C",
    note: "note-mi",
    label: "Mi",
    bgGrad: "from-[#34D399] to-[#10B981]",
    border: "border-[#047857]",
    shadow: "shadow-emerald-500/30",
    tilt: "-rotate-3",
    confettiColor: ["#34D399", "#A7F3D0", "#10B981"],
  },
];

export default function LetterBlocks({ className = "" }) {
  const { playSfx } = useAudio();

  const handleBlockClick = (block, e) => {
    e.stopPropagation();
    playSfx(block.note);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { x, y },
      colors: block.confettiColor,
      disableForReducedMotion: true,
    });
  };

  return (
    <div className={`flex items-end justify-center gap-3 sm:gap-4 select-none ${className}`}>
      {BLOCKS.map((block) => (
        <motion.button
          key={block.letter}
          type="button"
          whileHover={{ scale: 1.15, y: -6 }}
          whileTap={{ scale: 0.88, y: 3 }}
          transition={{ type: "spring", stiffness: 450, damping: 15 }}
          onClick={(e) => handleBlockClick(block, e)}
          aria-label={`Balok Huruf ${block.letter} Nada ${block.label}`}
          className={`relative overflow-hidden w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-b ${block.bgGrad} border-b-[5px] ${block.border} shadow-lg ${block.shadow} flex flex-col items-center justify-center cursor-pointer ${block.tilt} transition-transform active:border-b-0`}
        >
          {/* Authentic 3D Wooden Block Texture */}
          <img
            src="/assets/balok-kayu-3d.png"
            alt="Balok Kayu 3D"
            draggable="false"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40 select-none"
          />
          <span className="relative z-10 font-display font-bold text-white text-2xl sm:text-3xl leading-none drop-shadow-md">
            {block.letter}
          </span>
          <span className="relative z-10 font-sans font-bold text-[9px] text-white/90 leading-none mt-0.5">
            {block.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
