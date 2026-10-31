// src/components/illustrations/dioramas/WordPuzzleTrayDiorama.jsx
// Studio-grade 3D Toy Diorama: Wooden Word Puzzle Tray & Mystery Block for Melengkapi Kata
// STRICT ZERO EMOJIS POLICY: Only custom vector graphics.
// Mascots are strictly excluded per architectural directive.

import React from "react";
import { motion } from "framer-motion";

export default function WordPuzzleTrayDiorama({ isActive = true, className = "" }) {
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
          {/* Ambient Mint Sage Glow */}
          <radialGradient id="puzzleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#6EE7B7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>

          {/* Wooden Puzzle Tray Gradients */}
          <linearGradient id="trayOuterWood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="trayInnerRecess" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          {/* Fitted Letter Block (Mint & Ivory) */}
          <linearGradient id="puzzleBlockTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D1FAE5" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>
          <linearGradient id="puzzleBlockSide" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Hovering Golden Mystery Block Gradients */}
          <linearGradient id="mysteryTop" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
          <linearGradient id="mysteryFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="mysterySide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Red Apple Gradients */}
          <radialGradient id="appleSkin" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="35%" stopColor="#EF4444" />
            <stop offset="85%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </radialGradient>

          {/* Golden Aura Filter */}
          <filter id="goldAura" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── 1. Warm Mint Workshop Backdrop ── */}
        <circle cx="140" cy="90" r="75" fill="url(#puzzleGlow)" />

        {/* Ground Soft Contact Shadow */}
        <ellipse cx="140" cy="158" rx="95" ry="11" fill="#064E3B" opacity="0.25" />

        {/* ── 2. Honey-Pine Carved Wooden Puzzle Tray ── */}
        <g id="wooden-tray" transform="translate(0, 15)">
          {/* Tray Bottom Depth Bevel */}
          <rect x="74" y="104" width="168" height="34" rx="10" fill="#78350F" />
          {/* Tray Main Wooden Lip */}
          <rect x="74" y="98" width="168" height="34" rx="10" fill="url(#trayOuterWood)" stroke="#D97706" strokeWidth="1.5" />
          {/* Tray Recessed Carved Bed */}
          <rect x="80" y="102" width="156" height="26" rx="6" fill="url(#trayInnerRecess)" />

          {/* ── 4 Puzzle Slots: [ A ] [ ? ] [ E ] [ L ] ── */}

          {/* Slot 1: Fitted Block 'A' */}
          <g transform="translate(86, 96)">
            {/* Block Side Shadow */}
            <rect x="0" y="3" width="28" height="24" rx="4" fill="url(#puzzleBlockSide)" />
            {/* Block Top Surface */}
            <rect x="0" y="0" width="28" height="20" rx="4" fill="url(#puzzleBlockTop)" stroke="#FFFFFF" strokeWidth="1" />
            <text x="14" y="15" textAnchor="middle" fontFamily="'Fredoka', sans-serif" fontWeight="900" fontSize="15" fill="#065F46">
              A
            </text>
          </g>

          {/* Slot 2: Empty Glowing Recessed Slot with Dashed Target Border */}
          <g transform="translate(124, 104)">
            <rect
              x="0"
              y="0"
              width="28"
              height="20"
              rx="4"
              fill="#065F46"
              fillOpacity="0.4"
              stroke="#34D399"
              strokeWidth="1.8"
              strokeDasharray="3 2"
            />
            {/* Slot Ground Glow Point */}
            <circle cx="14" cy="10" r="4" fill="#34D399" opacity="0.6" filter="url(#goldAura)" />
          </g>

          {/* Slot 3: Fitted Block 'E' */}
          <g transform="translate(162, 96)">
            <rect x="0" y="3" width="28" height="24" rx="4" fill="url(#puzzleBlockSide)" />
            <rect x="0" y="0" width="28" height="20" rx="4" fill="url(#puzzleBlockTop)" stroke="#FFFFFF" strokeWidth="1" />
            <text x="14" y="15" textAnchor="middle" fontFamily="'Fredoka', sans-serif" fontWeight="900" fontSize="15" fill="#065F46">
              E
            </text>
          </g>

          {/* Slot 4: Fitted Block 'L' */}
          <g transform="translate(200, 96)">
            <rect x="0" y="3" width="28" height="24" rx="4" fill="url(#puzzleBlockSide)" />
            <rect x="0" y="0" width="28" height="20" rx="4" fill="url(#puzzleBlockTop)" stroke="#FFFFFF" strokeWidth="1" />
            <text x="14" y="15" textAnchor="middle" fontFamily="'Fredoka', sans-serif" fontWeight="900" fontSize="15" fill="#065F46">
              L
            </text>
          </g>
        </g>

        {/* ── 3. 3D Fruit Prop: Glossy Red Cartoon Apple Beside the Tray ── */}
        <g id="apple-prop" transform="translate(42, 102)">
          {/* Apple Shadow */}
          <ellipse cx="22" cy="44" rx="18" ry="6" fill="#064E3B" opacity="0.25" />

          {/* Apple Body */}
          <path
            d="M8,20 C8,10 16,8 22,12 C28,8 36,10 36,20 C36,34 26,42 22,42 C18,42 8,34 8,20 Z"
            fill="url(#appleSkin)"
            stroke="#991B1B"
            strokeWidth="1.2"
          />

          {/* Specular Curved Glare on Apple */}
          <path
            d="M12,18 C12,14 16,13 19,14"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <circle cx="13" cy="22" r="1.5" fill="#FFFFFF" opacity="0.8" />

          {/* Wooden Stem */}
          <path d="M22,12 Q20,4 23,2" fill="none" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />

          {/* Fresh Green Leaf */}
          <path
            d="M23,6 Q32,4 34,9 Q28,12 23,6 Z"
            fill="#22C55E"
            stroke="#15803D"
            strokeWidth="0.8"
          />
        </g>

        {/* ── 4. Hovering Golden Mystery Block Emblazoned with '?' ── */}
        <motion.g
          animate={
            isActive
              ? {
                  y: [0, -8, 0],
                  rotate: [-3, 3, -3],
                }
              : {}
          }
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "138px", originY: "68px" }}
        >
          {/* Golden Aura Glow */}
          <ellipse cx="138" cy="70" rx="26" ry="24" fill="#FDE047" opacity="0.35" filter="url(#goldAura)" />

          {/* Shadow onto puzzle slot */}
          <ellipse cx="138" cy="116" rx="14" ry="4" fill="#78350F" opacity="0.28" />

          {/* Isometric Golden Mystery Cube */}
          <g transform="translate(120, 44)">
            {/* Top Face */}
            <polygon points="16,0 44,0 32,14 4,14" fill="url(#mysteryTop)" />
            <line x1="4" y1="14" x2="32" y2="14" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />

            {/* Side Face */}
            <polygon points="32,14 44,0 44,28 32,42" fill="url(#mysterySide)" />

            {/* Front Face */}
            <polygon points="4,14 32,14 32,42 4,42" fill="url(#mysteryFront)" />

            {/* Front Specular Bevel Line */}
            <line x1="4" y1="14" x2="4" y2="42" stroke="#FEF08A" strokeWidth="1" opacity="0.8" />

            {/* Mystery Question Mark '?' */}
            <text
              x="18"
              y="34"
              textAnchor="middle"
              fontFamily="'Fredoka', sans-serif"
              fontWeight="900"
              fontSize="23"
              fill="#78350F"
              stroke="#FFFBEB"
              strokeWidth="0.8"
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))" }}
            >
              ?
            </text>
          </g>
        </motion.g>

        {/* ── 5. Sparkling Workshop Confetti & Aura Stars ── */}
        <motion.g
          transform="translate(182, 38)"
          animate={isActive ? { scale: [1, 1.3, 1], rotate: [0, 45, 0] } : {}}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M0,-7 Q1,-1 7,0 Q1,1 0,7 Q-1,1 -7,0 Q-1,-1 0,-7 Z" fill="#FDE047" filter="drop-shadow(0 0 4px #FBBF24)" />
        </motion.g>

        <motion.g
          transform="translate(92, 36)"
          animate={isActive ? { scale: [0.9, 1.25, 0.9], rotate: [0, -45, 0] } : {}}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <path d="M0,-6 Q1,-1 6,0 Q1,1 0,6 Q-1,1 -6,0 Q-1,-1 0,-6 Z" fill="#34D399" filter="drop-shadow(0 0 3px #6EE7B7)" />
        </motion.g>

        <circle cx="238" cy="80" r="2.5" fill="#FEF08A" opacity="0.9" />
        <circle cx="56" cy="78" r="2" fill="#FFFFFF" opacity="0.8" />
      </svg>
    </div>
  );
}
