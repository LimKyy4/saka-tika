// src/components/illustrations/dioramas/EaselTracingDiorama.jsx
// Studio-grade 3D Toy Diorama: Mini Easel & Tracing Glow for Menulis Huruf
// STRICT ZERO EMOJIS POLICY: Only custom vector graphics.
// Mascots are strictly excluded per architectural directive.

import React from "react";
import { motion } from "framer-motion";

export default function EaselTracingDiorama({ isActive = true, className = "" }) {
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
          {/* Ambient Warm Golden Glow */}
          <radialGradient id="easelGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#FDE047" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>

          {/* Wooden Easel Legs Gradient */}
          <linearGradient id="woodLegGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Canvas Board Surface */}
          <linearGradient id="canvasSurface" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#FFFDF7" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>

          {/* Pencil Body Gradient (3 facets of hexagonal pencil) */}
          <linearGradient id="pencilFacetTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#FACC15" />
          </linearGradient>
          <linearGradient id="pencilFacetMid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="pencilFacetBot" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Neon Blue Glow Filter for Handwriting Trail */}
          <filter id="neonBlueGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── 1. Warm Workshop Backdrop ── */}
        <circle cx="140" cy="90" r="75" fill="url(#easelGlow)" />

        {/* ── 2. Tabletop Wooden Drawing Easel ── */}
        <g id="easel-structure">
          {/* Ground Contact Shadow */}
          <ellipse cx="140" cy="162" rx="95" ry="10" fill="#78350F" opacity="0.22" />

          {/* Rear Support Leg */}
          <polygon points="135,35 145,35 148,155 132,155" fill="#78350F" opacity="0.8" />

          {/* Left Tripod Leg */}
          <polygon points="134,35 142,35 68,160 58,158" fill="url(#woodLegGrad)" />
          {/* Right Tripod Leg */}
          <polygon points="138,35 146,35 222,158 212,160" fill="url(#woodLegGrad)" />

          {/* Lower Crossbar Supporting the Canvas Shelf */}
          <rect x="52" y="132" width="176" height="10" rx="3" fill="#B45309" stroke="#78350F" strokeWidth="1" />
          {/* Shelf Lip */}
          <rect x="50" y="130" width="180" height="4" rx="2" fill="#D97706" />

          {/* Top Mast Peg */}
          <rect x="135" y="24" width="10" height="24" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="1" />
          <circle cx="140" cy="28" r="3.5" fill="#FDE68A" />

          {/* Canvas Board (Warm Cream Art Board) */}
          <g transform="translate(62, 38)">
            {/* Board Thickness & Drop Shadow */}
            <rect x="2" y="3" width="156" height="96" rx="10" fill="#78350F" opacity="0.3" />
            {/* Board Outer Wooden Frame */}
            <rect x="0" y="0" width="156" height="96" rx="10" fill="#FDE68A" stroke="#D97706" strokeWidth="2.5" />
            {/* Canvas Surface Inside */}
            <rect x="5" y="5" width="146" height="86" rx="7" fill="url(#canvasSurface)" />

            {/* Handwriting Guideline Tracks (3 Clean Kindergarten Lined Rules) */}
            {/* Top Guideline */}
            <line x1="16" y1="28" x2="140" y2="28" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.75" />
            {/* Middle Guideline */}
            <line x1="16" y1="48" x2="140" y2="48" stroke="#0284C7" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.85" />
            {/* Baseline */}
            <line x1="16" y1="68" x2="140" y2="68" stroke="#94A3B8" strokeWidth="2" opacity="0.8" />

            {/* Neon Glowing Traced Letter 'A' */}
            {/* Outer Soft Glow Path */}
            <path
              d="M36,68 L58,24 L80,68 M44,52 L72,52"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
              filter="url(#neonBlueGlow)"
            />
            {/* Core Dotted Tracing Path */}
            <path
              d="M36,68 L58,24 L80,68 M44,52 L72,52"
              fill="none"
              stroke="#0284C7"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 7"
            />
            {/* Completed Bright Segment */}
            <path
              d="M36,68 L58,24"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M36,68 L58,24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Completed Sparkle Stars on the Traced Letter */}
            <circle cx="36" cy="68" r="3" fill="#38BDF8" />
            <circle cx="58" cy="24" r="3.5" fill="#38BDF8" />
            <circle cx="58" cy="24" r="1.5" fill="#FFFFFF" />

            {/* Mini Color Pots / Paint Dots on Bottom Canvas Margin */}
            <circle cx="104" cy="74" r="4.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
            <circle cx="116" cy="74" r="4.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
            <circle cx="128" cy="74" r="4.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
          </g>
        </g>

        {/* ── 3. Chubby Cartoon Wooden Pencil Hovering & Tracing ── */}
        <motion.g
          animate={
            isActive
              ? {
                  x: [0, 8, 0],
                  y: [0, -5, 0],
                  rotate: [32, 35, 32],
                }
              : {}
          }
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "140px", originY: "65px" }}
        >
          {/* Pencil Drop Shadow onto Canvas */}
          <ellipse cx="132" cy="74" rx="22" ry="5" fill="#0C4A6E" opacity="0.25" />

          {/* Pencil Body Assembly */}
          <g transform="translate(112, 28) rotate(32)">
            {/* Pink Rubber Eraser */}
            <rect x="0" y="0" width="16" height="12" rx="4" fill="#F472B6" stroke="#DB2777" strokeWidth="1" />
            <rect x="0" y="7" width="16" height="4" fill="#DB2777" opacity="0.3" />

            {/* Silver Metal Ferrule Band */}
            <rect x="0" y="11" width="16" height="8" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />
            <line x1="0" y1="13" x2="16" y2="13" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="0" y1="16" x2="16" y2="16" stroke="#64748B" strokeWidth="1" />

            {/* Hexagonal Wooden Shaft (3 Facets) */}
            {/* Left Facet (Light) */}
            <rect x="0" y="19" width="5" height="42" fill="url(#pencilFacetTop)" />
            {/* Center Facet (Mid) */}
            <rect x="5" y="19" width="6" height="42" fill="url(#pencilFacetMid)" />
            {/* Right Facet (Dark) */}
            <rect x="11" y="19" width="5" height="42" fill="url(#pencilFacetBot)" />

            {/* Sharpened Wood Cone Collar */}
            <polygon points="0,61 16,61 8,76" fill="#FDE68A" stroke="#D97706" strokeWidth="0.8" />
            <polygon points="3,61 8,61 8,76" fill="#FEF3C7" />

            {/* Graphite Tip */}
            <polygon points="6,72 10,72 8,78" fill="#1E293B" />
          </g>

          {/* Radiant Neon Starburst at Pencil Tip Contact */}
          <g transform="translate(138, 70)">
            <circle cx="0" cy="0" r="7" fill="#38BDF8" opacity="0.6" filter="url(#neonBlueGlow)" />
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
            {/* 4-point tip sparkle */}
            <path d="M0,-8 Q1,-1 8,0 Q1,1 0,8 Q-1,1 -8,0 Q-1,-1 0,-8 Z" fill="#FFFFFF" opacity="0.9" />
          </g>
        </motion.g>

        {/* ── 4. Floating Sparkle Particles in the Air ── */}
        <motion.g
          transform="translate(46, 36)"
          animate={isActive ? { scale: [1, 1.3, 1], rotate: [0, 90, 0] } : {}}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M0,-7 Q1,-1 7,0 Q1,1 0,7 Q-1,1 -7,0 Q-1,-1 0,-7 Z" fill="#F59E0B" filter="drop-shadow(0 0 3px #FBBF24)" />
        </motion.g>

        <motion.g
          transform="translate(230, 60)"
          animate={isActive ? { scale: [0.9, 1.25, 0.9], rotate: [0, -90, 0] } : {}}
          transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <path d="M0,-6 Q1,-1 6,0 Q1,1 0,6 Q-1,1 -6,0 Q-1,-1 0,-6 Z" fill="#38BDF8" filter="drop-shadow(0 0 4px #7DD3FC)" />
        </motion.g>

        <circle cx="218" cy="110" r="2" fill="#FBBF24" opacity="0.9" />
        <circle cx="68" cy="118" r="2.2" fill="#38BDF8" opacity="0.8" />
      </svg>
    </div>
  );
}
