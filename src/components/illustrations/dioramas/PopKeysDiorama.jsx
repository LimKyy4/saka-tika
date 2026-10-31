// src/components/illustrations/dioramas/PopKeysDiorama.jsx
// Studio-grade 3D Toy Diorama: Chunky Pop-Keys Stage for Mengetik Huruf
// STRICT ZERO EMOJIS POLICY: Only custom vector graphics.
// Mascots are strictly excluded per architectural directive.

import React from "react";
import { motion } from "framer-motion";

export default function PopKeysDiorama({ isActive = true, className = "" }) {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-visible select-none ${className}`}
    >
      <svg
        viewBox="0 0 280 180"
        className="w-full h-full max-h-[170px] drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ambient Flamingo Rose Glow */}
          <radialGradient id="keysGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBCFE8" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#F472B6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#DB2777" stopOpacity="0" />
          </radialGradient>

          {/* Keyboard Chassis Base Gradient */}
          <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF1F2" />
            <stop offset="50%" stopColor="#FCE7F3" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>

          {/* Keycap W (Pastel Cyan) */}
          <linearGradient id="keyWTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* Keycap A (Pastel Amber) */}
          <linearGradient id="keyATop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>

          {/* Keycap D (Pastel Mint) */}
          <linearGradient id="keyDTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>

          {/* Center Hero Keycap S (Cream Pearl with Golden Glow) */}
          <linearGradient id="keySTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#FFFDF7" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>
          <linearGradient id="keySSide" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Musical Wave Arc Filter */}
          <filter id="musicGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── 1. Warm Rose Atmosphere ── */}
        <circle cx="140" cy="90" r="75" fill="url(#keysGlow)" />

        {/* ── 2. Keyboard Stage Chassis Base ── */}
        <g id="keyboard-stage" transform="translate(0, 10)">
          {/* Ground Soft Shadow */}
          <ellipse cx="140" cy="154" rx="90" ry="12" fill="#831843" opacity="0.25" />

          {/* Slanted Isometric Keyboard Deck */}
          {/* Bottom Deck Skirt */}
          <polygon
            points="48,124 232,124 220,150 60,150"
            fill="#9D174D"
          />
          {/* Deck Top Surface */}
          <polygon
            points="60,82 220,82 232,124 48,124"
            fill="url(#chassisGrad)"
            stroke="#DB2777"
            strokeWidth="2"
          />
          {/* Metallic Accent Plate Inset */}
          <polygon
            points="68,88 212,88 222,120 58,120"
            fill="#831843"
            opacity="0.25"
          />

          {/* Left Keycap: 'A' (Pastel Amber) */}
          <g transform="translate(74, 94)">
            {/* Keycap Bevel Skirt */}
            <rect x="0" y="4" width="34" height="24" rx="6" fill="#B45309" />
            {/* Keycap Top Dish */}
            <rect x="1" y="0" width="32" height="20" rx="5" fill="url(#keyATop)" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />
            {/* Legend 'A' */}
            <text x="17" y="15" textAnchor="middle" fontFamily="'Fredoka', sans-serif" fontWeight="900" fontSize="14" fill="#78350F">
              A
            </text>
          </g>

          {/* Top Keycap: 'W' (Pastel Cyan) */}
          <g transform="translate(122, 68)">
            {/* Keycap Bevel Skirt */}
            <rect x="0" y="4" width="36" height="24" rx="6" fill="#0369A1" />
            {/* Keycap Top Dish */}
            <rect x="1" y="0" width="34" height="20" rx="5" fill="url(#keyWTop)" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />
            {/* Legend 'W' */}
            <text x="18" y="15" textAnchor="middle" fontFamily="'Fredoka', sans-serif" fontWeight="900" fontSize="14" fill="#0C4A6E">
              W
            </text>
          </g>

          {/* Right Keycap: 'D' (Pastel Mint) */}
          <g transform="translate(172, 94)">
            {/* Keycap Bevel Skirt */}
            <rect x="0" y="4" width="34" height="24" rx="6" fill="#047857" />
            {/* Keycap Top Dish */}
            <rect x="1" y="0" width="32" height="20" rx="5" fill="url(#keyDTop)" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />
            {/* Legend 'D' */}
            <text x="17" y="15" textAnchor="middle" fontFamily="'Fredoka', sans-serif" fontWeight="900" fontSize="14" fill="#064E3B">
              D
            </text>
          </g>
        </g>

        {/* ── 3. Bouncing Center Hero Keycap 'S' (Pop Animation) ── */}
        <motion.g
          animate={
            isActive
              ? {
                  y: [0, 5, 0],
                }
              : {}
          }
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Keycap S Shadow */}
          <ellipse cx="140" cy="138" rx="20" ry="5" fill="#831843" opacity="0.3" />

          {/* Center Keycap S Body */}
          <g transform="translate(120, 102)">
            {/* Outer Drop Shadow */}
            <rect x="0" y="6" width="40" height="28" rx="8" fill="#78350F" />
            {/* Beveled Side Skirt */}
            <rect x="0" y="4" width="40" height="26" rx="8" fill="url(#keySSide)" />
            {/* Glossy Top Dish */}
            <rect
              x="2"
              y="0"
              width="36"
              height="22"
              rx="6"
              fill="url(#keySTop)"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            {/* Specular Glare Arc */}
            <path d="M6,4 L34,4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />

            {/* Embossed Bold Legend 'S' */}
            <text
              x="20"
              y="17"
              textAnchor="middle"
              fontFamily="'Fredoka', sans-serif"
              fontWeight="900"
              fontSize="17"
              fill="#DB2777"
              stroke="#FDE047"
              strokeWidth="0.8"
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))" }}
            >
              S
            </text>
          </g>
        </motion.g>

        {/* ── 4. Tactical Cartoon Pop Waves & Shockwave Rings ── */}
        <motion.g
          transform="translate(140, 108)"
          animate={isActive ? { scale: [0.85, 1.3, 0.85], opacity: [0.8, 0.1, 0.8] } : {}}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
        >
          <ellipse cx="0" cy="0" rx="34" ry="14" fill="none" stroke="#FDE047" strokeWidth="2.5" opacity="0.7" />
          <ellipse cx="0" cy="0" rx="46" ry="18" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
        </motion.g>

        {/* ── 5. Stylized Floating Musical Melody Notes ── */}
        {/* Eighth Note (Left Floating) */}
        <motion.g
          transform="translate(76, 42)"
          animate={isActive ? { y: [0, -8, 0], rotate: [-8, 4, -8] } : {}}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Note Head */}
          <ellipse cx="0" cy="0" rx="6" ry="4.5" fill="#F43F5E" transform="rotate(-25)" />
          {/* Note Stem */}
          <rect x="3" y="-18" width="3" height="18" rx="1.5" fill="#F43F5E" />
          {/* Note Flag */}
          <path d="M6,-18 Q14,-14 10,-6" fill="none" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" />
          <circle cx="-1" cy="-1" r="1.5" fill="#FFFFFF" opacity="0.8" />
        </motion.g>

        {/* Beamed Sixteenth Notes (Right Floating Peak) */}
        <motion.g
          transform="translate(196, 36)"
          animate={isActive ? { y: [0, -10, 0], rotate: [4, -6, 4] } : {}}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        >
          {/* Left Note Head */}
          <ellipse cx="0" cy="0" rx="5.5" ry="4" fill="#38BDF8" transform="rotate(-25)" />
          <rect x="3" y="-18" width="2.5" height="18" fill="#38BDF8" />
          {/* Right Note Head */}
          <ellipse cx="14" cy="-2" rx="5.5" ry="4" fill="#38BDF8" transform="rotate(-25)" />
          <rect x="17" y="-20" width="2.5" height="18" fill="#38BDF8" />
          {/* Double Beam */}
          <polygon points="3,-18 19.5,-20 19.5,-16 3,-14" fill="#0284C7" />
          <polygon points="3,-12 19.5,-14 19.5,-10 3,-8" fill="#0284C7" />
        </motion.g>

        {/* Center Sparkle Melody Burst */}
        <motion.g
          transform="translate(140, 32)"
          animate={isActive ? { scale: [1, 1.3, 1], rotate: [0, 90, 0] } : {}}
          transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          <path d="M0,-8 Q1,-1 8,0 Q1,1 0,8 Q-1,1 -8,0 Q-1,-1 0,-8 Z" fill="#FDE047" filter="drop-shadow(0 0 4px #FBBF24)" />
        </motion.g>

        {/* Extra Pop Sparkles */}
        <circle cx="58" cy="74" r="2.5" fill="#FDE047" opacity="0.9" />
        <circle cx="224" cy="78" r="2.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="112" cy="46" r="2" fill="#F472B6" opacity="0.8" />
      </svg>
    </div>
  );
}
