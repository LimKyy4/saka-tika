// src/components/illustrations/SakaMascot.jsx
// Studio-grade vector mascot: Saka, cheerful Indonesian boy in blue 'S' shirt.
// ZERO EMOJIS anywhere in this file.

import React from "react";
import { motion } from "framer-motion";

export default function SakaMascot({ className = "", isWaving = true }) {
  return (
    <motion.svg
      viewBox="0 0 160 220"
      className={`w-28 sm:w-36 h-auto drop-shadow-md select-none ${className}`}
      initial={{ scale: 1 }}
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="sakaSkin" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFE0BD" />
          <stop offset="100%" stopColor="#F9C89B" />
        </radialGradient>
        <linearGradient id="sakaHair" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2D2424" />
          <stop offset="100%" stopColor="#1A1212" />
        </linearGradient>
        <linearGradient id="sakaShirt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4CA9EE" />
          <stop offset="100%" stopColor="#2575C8" />
        </linearGradient>
        <linearGradient id="sakaShorts" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2C4A6F" />
          <stop offset="100%" stopColor="#172A42" />
        </linearGradient>
      </defs>

      {/* Shadow under feet */}
      <ellipse cx="80" cy="214" rx="42" ry="6" fill="#1B4965" opacity="0.16" />

      {/* Legs & Shoes */}
      <g>
        {/* Left Leg */}
        <rect x="54" y="152" width="16" height="34" rx="8" fill="url(#sakaSkin)" />
        {/* Left Sock */}
        <rect x="53" y="176" width="18" height="12" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        {/* Left Shoe */}
        <path d="M44,188 C44,184 54,184 72,184 C76,184 76,198 70,198 L46,198 C42,198 44,192 44,188 Z" fill="#E24A4A" />
        <rect x="42" y="194" width="34" height="6" rx="3" fill="#FFFFFF" />

        {/* Right Leg */}
        <rect x="90" y="152" width="16" height="34" rx="8" fill="url(#sakaSkin)" />
        {/* Right Sock */}
        <rect x="89" y="176" width="18" height="12" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        {/* Right Shoe */}
        <path d="M88,184 C106,184 116,184 116,188 C116,192 118,198 114,198 L90,198 C84,198 84,184 88,184 Z" fill="#E24A4A" />
        <rect x="84" y="194" width="34" height="6" rx="3" fill="#FFFFFF" />
      </g>

      {/* Shorts */}
      <path
        d="M48,124 L112,124 C115,124 117,126 116,130 L110,158 C109,161 106,163 103,163 L86,163 L80,140 L74,163 L57,163 C54,163 51,161 50,158 L44,130 C43,126 45,124 48,124 Z"
        fill="url(#sakaShorts)"
      />

      {/* Body / Shirt */}
      <path
        d="M48,82 C56,76 104,76 112,82 L124,128 C124,132 120,134 116,134 L44,134 C40,134 36,132 36,128 Z"
        fill="url(#sakaShirt)"
      />
      {/* Shirt Collar detail */}
      <path d="M68,80 Q80,90 92,80" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Bold Letter 'S' on Chest */}
      <text
        x="80"
        y="114"
        textAnchor="middle"
        fontFamily="'Fredoka', sans-serif"
        fontWeight="700"
        fontSize="30"
        fill="#FFFFFF"
        stroke="#1A5B9C"
        strokeWidth="1.5"
      >
        S
      </text>

      {/* Left Arm (Relaxed) */}
      <path
        d="M46,84 C38,94 34,112 36,124 C37,130 42,132 46,128 C48,122 52,106 54,96"
        fill="url(#sakaSkin)"
        stroke="#2575C8"
        strokeWidth="1"
      />
      {/* Left Hand */}
      <circle cx="38" cy="130" r="8" fill="url(#sakaSkin)" />

      {/* Right Arm & Hand (Animated Cheerful Wave) */}
      <motion.g
        animate={isWaving ? { rotate: [0, 16, -4, 16, 0] } : {}}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        style={{ originX: "112px", originY: "84px" }}
      >
        <path
          d="M112,84 C122,82 136,70 142,58 C145,54 148,56 146,62 C140,78 126,96 114,96"
          fill="url(#sakaSkin)"
        />
        {/* Hand waving */}
        <circle cx="144" cy="54" r="9" fill="url(#sakaSkin)" />
        <ellipse cx="148" cy="50" rx="3" ry="5" fill="url(#sakaSkin)" />
      </motion.g>

      {/* Neck */}
      <rect x="74" y="68" width="12" height="16" rx="5" fill="url(#sakaSkin)" />

      {/* Head */}
      <circle cx="80" cy="48" r="30" fill="url(#sakaSkin)" />

      {/* Ears */}
      <circle cx="50" cy="50" r="7" fill="url(#sakaSkin)" />
      <circle cx="51" cy="50" r="4" fill="#F4B886" />
      <circle cx="110" cy="50" r="7" fill="url(#sakaSkin)" />
      <circle cx="109" cy="50" r="4" fill="#F4B886" />

      {/* Back Hair */}
      <path
        d="M48,46 C48,22 62,14 80,14 C98,14 112,22 112,46 C112,50 114,56 110,60 C104,44 100,34 80,34 C60,34 56,44 50,60 C46,56 48,50 48,46 Z"
        fill="url(#sakaHair)"
      />

      {/* Front Hair Tufts */}
      <path
        d="M50,40 C55,26 68,20 80,20 C96,20 108,28 110,38 C104,32 94,30 84,34 C76,30 64,32 58,40 Z"
        fill="url(#sakaHair)"
      />
      <path d="M74,20 C76,12 86,14 84,24 Z" fill="url(#sakaHair)" />

      {/* Big Cheerful Eyes */}
      {/* Left Eye */}
      <circle cx="68" cy="48" r="5.5" fill="#1A1212" />
      <circle cx="66" cy="46" r="2" fill="#FFFFFF" />
      <circle cx="70" cy="50" r="1" fill="#FFFFFF" />

      {/* Right Eye */}
      <circle cx="92" cy="48" r="5.5" fill="#1A1212" />
      <circle cx="90" cy="46" r="2" fill="#FFFFFF" />
      <circle cx="94" cy="50" r="1" fill="#FFFFFF" />

      {/* Eyebrows */}
      <path d="M63,38 Q68,35 73,38" stroke="#1A1212" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M87,38 Q92,35 97,38" stroke="#1A1212" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Rosy Cheeks */}
      <ellipse cx="61" cy="56" rx="5.5" ry="3.5" fill="#FF8A8A" opacity="0.65" />
      <ellipse cx="99" cy="56" rx="5.5" ry="3.5" fill="#FF8A8A" opacity="0.65" />

      {/* Cute Smile */}
      <path d="M72,56 Q80,67 88,56" stroke="#A83232" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Tongue inside smile */}
      <path d="M75,60 Q80,66 85,60" fill="#FF6B6B" />
    </motion.svg>
  );
}
