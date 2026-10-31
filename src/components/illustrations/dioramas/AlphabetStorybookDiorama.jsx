// src/components/illustrations/dioramas/AlphabetStorybookDiorama.jsx
// Studio-grade 3D Toy Diorama: Pop-Up 3D Alphabet Storybook for Mengenal Huruf
// STRICT ZERO EMOJIS POLICY: Only custom vector graphics.
// Mascots are strictly excluded per architectural directive.

import React from "react";
import { motion } from "framer-motion";

export default function AlphabetStorybookDiorama({ isActive = true, className = "" }) {
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
          {/* Radial Ambient Glow */}
          <radialGradient id="storybookGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#7DD3FC" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>

          {/* Book Cover Gradient */}
          <linearGradient id="bookCoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>

          {/* Left Page Gradient */}
          <linearGradient id="leftPageGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="15%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#FFFDF7" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>

          {/* Right Page Gradient */}
          <linearGradient id="rightPageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="15%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#FFFDF7" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>

          {/* Block A (Blue) Gradients */}
          <linearGradient id="blockATop" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#DBEAFE" />
          </linearGradient>
          <linearGradient id="blockAFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="blockASide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>

          {/* Block B (Coral Red) Gradients */}
          <linearGradient id="blockBTop" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="100%" stopColor="#FEE2E2" />
          </linearGradient>
          <linearGradient id="blockBFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
          <linearGradient id="blockBSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          {/* Block C (Emerald / Mint) Gradients */}
          <linearGradient id="blockCTop" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#D1FAE5" />
          </linearGradient>
          <linearGradient id="blockCFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="blockCSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="100%" stopColor="#065F46" />
          </linearGradient>

          {/* Golden Star Gradient */}
          <radialGradient id="goldStarGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="60%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>
        </defs>

        {/* ── 1. Soft Backdrop Aura ── */}
        <circle cx="140" cy="90" r="75" fill="url(#storybookGlow)" />

        {/* ── 2. Open Picture Book ── */}
        <g id="storybook-base" transform="translate(0, 15)">
          {/* Ground Contact Shadow */}
          <ellipse cx="140" cy="148" rx="85" ry="12" fill="#0C4A6E" opacity="0.25" />

          {/* Book Hardcover Base */}
          <path
            d="M48,138 C80,146 128,142 140,146 C152,142 200,146 232,138 C235,142 228,150 140,152 C52,150 45,142 48,138 Z"
            fill="url(#bookCoverGrad)"
          />

          {/* Page Edge Thickness (Stack of Pages) */}
          <path
            d="M52,132 C82,141 128,138 140,142 C152,138 198,141 228,132 L230,137 C200,145 152,142 140,146 C128,142 80,145 50,137 Z"
            fill="#CBD5E1"
          />

          {/* Left Open Page with Curved Fanning */}
          <path
            d="M140,140 C126,134 85,125 54,128 C51,124 53,105 56,102 C86,100 126,112 140,122 Z"
            fill="url(#leftPageGrad)"
            stroke="#94A3B8"
            strokeWidth="0.8"
          />
          {/* Left Page Illustrated Lines */}
          <path d="M68,110 C90,113 118,120 132,126" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <path d="M72,118 C92,121 116,127 130,133" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

          {/* Right Open Page with Curved Fanning */}
          <path
            d="M140,140 C154,134 195,125 226,128 C229,124 227,105 224,102 C194,100 154,112 140,122 Z"
            fill="url(#rightPageGrad)"
            stroke="#94A3B8"
            strokeWidth="0.8"
          />
          {/* Right Page Illustrated Lines */}
          <path d="M148,126 C162,120 190,113 212,110" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <path d="M150,133 C164,127 188,121 208,118" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

          {/* Book Spine Center Crease & Bookmark Ribbon */}
          <line x1="140" y1="120" x2="140" y2="144" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M140,142 Q144,152 148,158 Q145,159 140,155 Q135,159 132,158 Q136,152 140,142 Z" fill="#EF4444" />
        </g>

        {/* ── 3. Pop-Up Beveled 3D Alphabet Toy Blocks (A, B, C) ── */}

        {/* Block A: Chunky Blue Block (Front-Left, Main Anchor) */}
        <motion.g
          animate={isActive ? { y: [0, -6, 0] } : {}}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Block A Soft Drop Shadow onto book */}
          <ellipse cx="86" cy="118" rx="20" ry="5" fill="#0369A1" opacity="0.22" />

          {/* Block A Isometric Structure */}
          <g transform="translate(64, 52)">
            {/* Top Face */}
            <polygon points="18,0 44,0 32,13 6,13" fill="url(#blockATop)" />
            {/* Specular Edge Line */}
            <line x1="6" y1="13" x2="32" y2="13" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
            {/* Side Face */}
            <polygon points="32,13 44,0 44,28 32,41" fill="url(#blockASide)" />
            {/* Front Face */}
            <polygon points="6,13 32,13 32,41 6,41" fill="url(#blockAFront)" rx="2" />
            
            {/* Front Face Letter 'A' */}
            <text
              x="19"
              y="34"
              textAnchor="middle"
              fontFamily="'Fredoka', sans-serif"
              fontWeight="900"
              fontSize="22"
              fill="#FFFFFF"
              stroke="#1D4ED8"
              strokeWidth="1"
              style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.25))" }}
            >
              A
            </text>
          </g>
        </motion.g>

        {/* Block B: Chunky Coral Red Block (Center-Top, Floating Peak) */}
        <motion.g
          animate={isActive ? { y: [0, -10, 0], rotate: [-2, 2, -2] } : {}}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        >
          {/* Block B Shadow onto book */}
          <ellipse cx="140" cy="112" rx="18" ry="4" fill="#991B1B" opacity="0.18" />

          {/* Block B Isometric Structure */}
          <g transform="translate(118, 24)">
            {/* Top Face */}
            <polygon points="20,0 48,0 35,14 7,14" fill="url(#blockBTop)" />
            <line x1="7" y1="14" x2="35" y2="14" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
            {/* Side Face */}
            <polygon points="35,14 48,0 48,30 35,44" fill="url(#blockBSide)" />
            {/* Front Face */}
            <polygon points="7,14 35,14 35,44 7,44" fill="url(#blockBFront)" />
            
            {/* Front Face Letter 'B' */}
            <text
              x="21"
              y="37"
              textAnchor="middle"
              fontFamily="'Fredoka', sans-serif"
              fontWeight="900"
              fontSize="23"
              fill="#FFFFFF"
              stroke="#991B1B"
              strokeWidth="1"
              style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.25))" }}
            >
              B
            </text>
          </g>
        </motion.g>

        {/* Block C: Chunky Emerald Mint Block (Front-Right, Stepped) */}
        <motion.g
          animate={isActive ? { y: [0, -7, 0], rotate: [1, -2, 1] } : {}}
          transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          {/* Block C Shadow onto book */}
          <ellipse cx="196" cy="118" rx="20" ry="5" fill="#065F46" opacity="0.22" />

          {/* Block C Isometric Structure */}
          <g transform="translate(174, 50)">
            {/* Top Face */}
            <polygon points="18,0 44,0 32,13 6,13" fill="url(#blockCTop)" />
            <line x1="6" y1="13" x2="32" y2="13" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
            {/* Side Face */}
            <polygon points="32,13 44,0 44,28 32,41" fill="url(#blockCSide)" />
            {/* Front Face */}
            <polygon points="6,13 32,13 32,41 6,41" fill="url(#blockCFront)" />
            
            {/* Front Face Letter 'C' */}
            <text
              x="19"
              y="34"
              textAnchor="middle"
              fontFamily="'Fredoka', sans-serif"
              fontWeight="900"
              fontSize="22"
              fill="#FFFFFF"
              stroke="#047857"
              strokeWidth="1"
              style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.25))" }}
            >
              C
            </text>
          </g>
        </motion.g>

        {/* ── 4. Twinkling Golden Sparkles & Floating Magic ── */}
        {/* Star 1: Upper Left */}
        <motion.g
          transform="translate(48, 42)"
          animate={isActive ? { scale: [1, 1.3, 1], rotate: [0, 45, 0] } : {}}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M0,-8 Q1,-1 8,0 Q1,1 0,8 Q-1,1 -8,0 Q-1,-1 0,-8 Z"
            fill="url(#goldStarGrad)"
            filter="drop-shadow(0 0 4px #FDE047)"
          />
        </motion.g>

        {/* Star 2: Upper Right */}
        <motion.g
          transform="translate(236, 40)"
          animate={isActive ? { scale: [1, 1.25, 1], rotate: [0, -45, 0] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <path
            d="M0,-9 Q1,-1 9,0 Q1,1 0,9 Q-1,1 -9,0 Q-1,-1 0,-9 Z"
            fill="url(#goldStarGrad)"
            filter="drop-shadow(0 0 5px #FDE047)"
          />
        </motion.g>

        {/* Star 3: Center Magic Bloom */}
        <motion.g
          transform="translate(140, 18)"
          animate={isActive ? { scale: [0.9, 1.2, 0.9], opacity: [0.8, 1, 0.8] } : {}}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <path
            d="M0,-6 Q1,-1 6,0 Q1,1 0,6 Q-1,1 -6,0 Q-1,-1 0,-6 Z"
            fill="url(#goldStarGrad)"
            filter="drop-shadow(0 0 3px #FEF08A)"
          />
        </motion.g>

        {/* Tiny Sparkle Dots */}
        <circle cx="106" cy="38" r="2" fill="#FEF08A" opacity="0.9" />
        <circle cx="178" cy="32" r="2.2" fill="#FEF08A" opacity="0.9" />
        <circle cx="62" cy="80" r="1.5" fill="#FFFFFF" opacity="0.8" />
        <circle cx="224" cy="82" r="1.8" fill="#FFFFFF" opacity="0.8" />
      </svg>
    </div>
  );
}
