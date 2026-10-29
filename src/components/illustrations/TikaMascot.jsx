// src/components/illustrations/TikaMascot.jsx
// Studio-grade vector mascot: Tika, cheerful Indonesian girl with pigtails in coral dress with 'T'.
// ZERO EMOJIS anywhere in this file.

import React from "react";
import { motion } from "framer-motion";

export default function TikaMascot({ className = "", isCheering = true }) {
  return (
    <motion.svg
      viewBox="0 0 160 220"
      className={`drop-shadow-md select-none ${className || "w-28 sm:w-36 h-auto"}`}
      initial={{ scale: 1 }}
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 2.9, ease: "easeInOut", delay: 0.2 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="tikaSkin" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFE3C7" />
          <stop offset="100%" stopColor="#F9C89B" />
        </radialGradient>
        <linearGradient id="tikaHair" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3E2723" />
          <stop offset="100%" stopColor="#241410" />
        </linearGradient>
        <linearGradient id="tikaDress" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>

      {/* Shadow under feet */}
      <ellipse cx="80" cy="214" rx="40" ry="6" fill="#1B4965" opacity="0.16" />

      {/* Left Pigtail & Yellow Ribbon */}
      <motion.g
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        style={{ originX: "42px", originY: "48px" }}
      >
        <ellipse cx="28" cy="62" rx="14" ry="20" fill="url(#tikaHair)" />
        {/* Yellow Bow */}
        <circle cx="40" cy="48" r="5" fill="#FACC15" />
        <path d="M40,48 L32,42 L32,54 Z" fill="#FACC15" />
        <path d="M40,48 L48,42 L48,54 Z" fill="#FACC15" />
      </motion.g>

      {/* Right Pigtail & Yellow Ribbon */}
      <motion.g
        animate={{ rotate: [4, -4, 4] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.1 }}
        style={{ originX: "118px", originY: "48px" }}
      >
        <ellipse cx="132" cy="62" rx="14" ry="20" fill="url(#tikaHair)" />
        {/* Yellow Bow */}
        <circle cx="120" cy="48" r="5" fill="#FACC15" />
        <path d="M120,48 L112,42 L112,54 Z" fill="#FACC15" />
        <path d="M120,48 L128,42 L128,54 Z" fill="#FACC15" />
      </motion.g>

      {/* Legs & Shoes */}
      <g>
        {/* Left Leg */}
        <rect x="56" y="156" width="14" height="34" rx="7" fill="url(#tikaSkin)" />
        <rect x="54" y="178" width="18" height="12" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        {/* Left Shoe */}
        <path d="M46,188 C46,184 56,184 72,184 C76,184 76,198 70,198 L48,198 C44,198 46,192 46,188 Z" fill="#FB7185" />
        <rect x="44" y="194" width="32" height="6" rx="3" fill="#FFFFFF" />

        {/* Right Leg */}
        <rect x="90" y="156" width="14" height="34" rx="7" fill="url(#tikaSkin)" />
        <rect x="88" y="178" width="18" height="12" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        {/* Right Shoe */}
        <path d="M88,184 C104,184 114,184 114,188 C114,192 116,198 112,198 L90,198 C84,198 84,184 88,184 Z" fill="#FB7185" />
        <rect x="84" y="194" width="32" height="6" rx="3" fill="#FFFFFF" />
      </g>

      {/* Dress (A-line Coral Red with Yellow Hem) */}
      <path
        d="M62,86 L98,86 C102,86 104,89 105,93 L126,156 C128,162 124,166 118,166 L42,166 C36,166 32,162 34,156 L55,93 C56,89 58,86 62,86 Z"
        fill="url(#tikaDress)"
      />
      {/* Bottom Yellow Hem Wave */}
      <path
        d="M34,156 Q57,162 80,158 Q103,162 126,156 L126,162 C126,166 122,168 118,168 L42,168 C38,168 34,166 34,162 Z"
        fill="#FACC15"
      />
      {/* Dress Collar detail */}
      <path d="M68,86 Q80,94 92,86" stroke="#FEF08A" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Bold Letter 'T' on Chest */}
      <text
        x="80"
        y="126"
        textAnchor="middle"
        fontFamily="'Fredoka', sans-serif"
        fontWeight="700"
        fontSize="34"
        fill="#FEF08A"
        stroke="#CA8A04"
        strokeWidth="1.5"
      >
        T
      </text>

      {/* Left Arm & Hand */}
      <path
        d="M56,90 C46,98 38,114 42,128 C44,132 48,132 52,128 C54,122 58,108 64,98"
        fill="url(#tikaSkin)"
      />
      <circle cx="44" cy="132" r="7.5" fill="url(#tikaSkin)" />

      {/* Right Arm & Hand (Cheering / Bouncing) */}
      <motion.g
        animate={isCheering ? { rotate: [0, -12, 4, -12, 0] } : {}}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        style={{ originX: "104px", originY: "90px" }}
      >
        <path
          d="M104,90 C114,94 126,104 132,118 C135,124 138,124 140,118 C138,104 124,88 112,86"
          fill="url(#tikaSkin)"
        />
        <circle cx="134" cy="124" r="7.5" fill="url(#tikaSkin)" />
      </motion.g>

      {/* Neck */}
      <rect x="74" y="70" width="12" height="18" rx="5" fill="url(#tikaSkin)" />

      {/* Head */}
      <circle cx="80" cy="50" r="30" fill="url(#tikaSkin)" />

      {/* Ears */}
      <circle cx="50" cy="52" r="6.5" fill="url(#tikaSkin)" />
      <circle cx="51" cy="52" r="3.5" fill="#F4B886" />
      <circle cx="110" cy="52" r="6.5" fill="url(#tikaSkin)" />
      <circle cx="109" cy="52" r="3.5" fill="#F4B886" />

      {/* Back Hair */}
      <path
        d="M48,46 C48,22 62,15 80,15 C98,15 112,22 112,46 C112,54 114,60 110,64 C104,46 98,34 80,34 C62,34 56,46 50,64 C46,60 48,54 48,46 Z"
        fill="url(#tikaHair)"
      />

      {/* Cute Rounded Bangs */}
      <path
        d="M50,42 C54,28 66,22 80,22 C94,22 106,28 110,42 C104,34 94,30 80,30 C66,30 56,34 50,42 Z"
        fill="url(#tikaHair)"
      />
      <circle cx="64" cy="34" r="8" fill="url(#tikaHair)" />
      <circle cx="96" cy="34" r="8" fill="url(#tikaHair)" />

      {/* Big Warm Shining Eyes */}
      {/* Left Eye */}
      <circle cx="68" cy="50" r="5.5" fill="#241410" />
      <circle cx="66" cy="48" r="2.2" fill="#FFFFFF" />
      <circle cx="70" cy="52" r="1.2" fill="#FFFFFF" />

      {/* Right Eye */}
      <circle cx="92" cy="50" r="5.5" fill="#241410" />
      <circle cx="90" cy="48" r="2.2" fill="#FFFFFF" />
      <circle cx="94" cy="52" r="1.2" fill="#FFFFFF" />

      {/* Eyelashes */}
      <path d="M62,45 L60,42" stroke="#241410" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M98,45 L100,42" stroke="#241410" strokeWidth="1.5" strokeLinecap="round" />

      {/* Eyebrows */}
      <path d="M63,40 Q68,37 73,40" stroke="#241410" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M87,40 Q92,37 97,40" stroke="#241410" strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* Rosy Cheeks */}
      <ellipse cx="61" cy="58" rx="6" ry="3.5" fill="#FF8A8A" opacity="0.65" />
      <ellipse cx="99" cy="58" rx="6" ry="3.5" fill="#FF8A8A" opacity="0.65" />

      {/* Cheerful Smile */}
      <path d="M72,58 Q80,68 88,58" stroke="#A83232" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M75,62 Q80,68 85,62" fill="#FF6B6B" />
    </motion.svg>
  );
}
