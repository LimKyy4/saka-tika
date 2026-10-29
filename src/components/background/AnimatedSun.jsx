// src/components/background/AnimatedSun.jsx
// Studio-grade smiling cartoon sun with rotating petal rays, breathing face & chime on hover.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "../../context/AudioContext.jsx";

export default function AnimatedSun({ className = "" }) {
  const { playSfx } = useAudio();
  const [isHovered, setIsHovered] = useState(false);
  const [ringWaves, setRingWaves] = useState([]);

  const handleHover = () => {
    setIsHovered(true);
    playSfx("sun-chime");
    const waveId = Date.now();
    setRingWaves((prev) => [...prev, waveId]);
    setTimeout(() => {
      setRingWaves((prev) => prev.filter((id) => id !== waveId));
    }, 1200);
  };

  const handleLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    playSfx("sun-chime");
    const waveId = Date.now();
    setRingWaves((prev) => [...prev, waveId]);
    setTimeout(() => {
      setRingWaves((prev) => prev.filter((id) => id !== waveId));
    }, 1200);
  };

  // 12 surrounding petal rays
  const rays = Array.from({ length: 12 }).map((_, i) => i * 30);

  return (
    <div
      className={`relative select-none cursor-pointer ${className}`}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      {/* Expansion Ring Wave when hovered/clicked */}
      <AnimatePresence>
        {ringWaves.map((waveId) => (
          <motion.div
            key={waveId}
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute inset-0 m-auto w-24 h-24 rounded-full border-4 border-[#FFD13B] pointer-events-none"
          />
        ))}
      </AnimatePresence>

      <svg
        viewBox="0 0 160 160"
        className="w-24 sm:w-28 md:w-32 h-auto drop-shadow-lg overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="sunDiscGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF275" />
            <stop offset="65%" stopColor="#FFD13B" />
            <stop offset="100%" stopColor="#FFAA00" />
          </radialGradient>
          <linearGradient id="sunRayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="100%" stopColor="#FFB300" />
          </linearGradient>
        </defs>

        {/* Outer Rotating Petal Rays */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 24, ease: "linear", repeat: Infinity }}
          style={{ originX: "80px", originY: "80px" }}
        >
          {rays.map((angle) => (
            <g key={angle} transform={`rotate(${angle} 80 80)`}>
              <path
                d="M74,18 C74,10 80,4 80,4 C80,4 86,10 86,18 L84,36 L76,36 Z"
                fill="url(#sunRayGrad)"
                opacity={0.92}
              />
              <circle cx="80" cy="14" r="5" fill="#FFE066" />
            </g>
          ))}
        </motion.g>

        {/* Center Stabilized Breathing Face */}
        <motion.g
          animate={{ scale: isHovered ? 1.12 : [1, 1.05, 1] }}
          transition={
            isHovered
              ? { type: "spring", stiffness: 400, damping: 15 }
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ originX: "80px", originY: "80px" }}
        >
          {/* Main Disc */}
          <circle cx="80" cy="80" r="44" fill="url(#sunDiscGrad)" />

          {/* Rosy Cheeks */}
          <ellipse cx="60" cy="88" rx="8" ry="5" fill="#FF9EAA" opacity={0.8} />
          <ellipse cx="100" cy="88" rx="8" ry="5" fill="#FF9EAA" opacity={0.8} />

          {/* Eyes: Normal or Winking */}
          {isHovered ? (
            <>
              {/* Left Eye: Happy Arc */}
              <path
                d="M57,75 Q62,69 67,75"
                fill="none"
                stroke="#422006"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Right Eye: Wink Arc */}
              <path
                d="M93,76 Q98,72 103,76"
                fill="none"
                stroke="#422006"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              {/* Left Eye */}
              <ellipse cx="62" cy="74" rx="4.5" ry="6" fill="#422006" />
              <circle cx="64" cy="72" r="2" fill="#FFFFFF" />

              {/* Right Eye */}
              <ellipse cx="98" cy="74" rx="4.5" ry="6" fill="#422006" />
              <circle cx="100" cy="72" r="2" fill="#FFFFFF" />
            </>
          )}

          {/* Cheerful Smile */}
          <path
            d="M66,86 Q80,102 94,86"
            fill="#B43E00"
            stroke="#422006"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Little pink tongue */}
          <path
            d="M74,93 Q80,98 86,93 Q80,96 74,93"
            fill="#FF8095"
          />

          {/* Sparkle Highlights */}
          <circle cx="58" cy="56" r="3.5" fill="#FFFFFF" opacity={0.7} />
          <circle cx="67" cy="50" r="2" fill="#FFFFFF" opacity={0.6} />
        </motion.g>
      </svg>
    </div>
  );
}
