// src/components/illustrations/dioramas/BubblePrismDiorama.jsx
// Studio-grade 3D Toy Diorama: Floating Glass Bubble Prism for Temukan Huruf
// STRICT ZERO EMOJIS POLICY: Only custom vector graphics.
// Mascots are strictly excluded per architectural directive.

import React from "react";
import { motion } from "framer-motion";

export default function BubblePrismDiorama({ isActive = true, className = "" }) {
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
          {/* Ambient Warm Coral Glow */}
          <radialGradient id="bubbleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FECDD3" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#FDA4AF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
          </radialGradient>

          {/* Realistic Iridescent Bubble Radial Fill */}
          <radialGradient id="soapBubbleFill" cx="35%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="25%" stopColor="#E0F2FE" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#FCE7F3" stopOpacity="0.25" />
            <stop offset="85%" stopColor="#FEF08A" stopOpacity="0.3" />
            <stop offset="96%" stopColor="#38BDF8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.75" />
          </radialGradient>

          {/* Golden Letter Token Gradient */}
          <linearGradient id="tokenGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="35%" stopColor="#FDE047" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="tokenRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Magnifying Glass Brass Rim */}
          <linearGradient id="brassRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="40%" stopColor="#FBBF24" />
            <stop offset="80%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Pastel Cyan Handle */}
          <linearGradient id="lensHandle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── 1. Warm Coral Atmosphere ── */}
        <circle cx="140" cy="90" r="75" fill="url(#bubbleGlow)" />

        {/* Ground Soft Contact Shadow */}
        <ellipse cx="132" cy="156" rx="60" ry="8" fill="#881337" opacity="0.18" />

        {/* ── 2. Small Companion Bubbles (Floating in Background) ── */}
        {/* Companion Bubble 1 (Upper Left) */}
        <motion.g
          transform="translate(68, 48)"
          animate={isActive ? { y: [0, -8, 0], x: [0, -3, 0] } : {}}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="0" cy="0" r="18" fill="url(#soapBubbleFill)" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.7" />
          {/* Curved Gloss Arc */}
          <path d="M-11,-10 A14 14 0 0 1 6,-14" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <circle cx="-9" cy="-7" r="1.5" fill="#FFFFFF" />
          {/* Inside Letter Hint 'A' */}
          <text x="0" y="5" textAnchor="middle" fontFamily="'Fredoka', sans-serif" fontWeight="bold" fontSize="13" fill="#E11D48" opacity="0.6">
            A
          </text>
        </motion.g>

        {/* Companion Bubble 2 (Lower Right) */}
        <motion.g
          transform="translate(208, 122)"
          animate={isActive ? { y: [0, -6, 0], x: [0, 4, 0] } : {}}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <circle cx="0" cy="0" r="14" fill="url(#soapBubbleFill)" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.6" />
          <path d="M-8,-8 A10 10 0 0 1 4,-11" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <text x="0" y="4" textAnchor="middle" fontFamily="'Fredoka', sans-serif" fontWeight="bold" fontSize="11" fill="#EA580C" opacity="0.6">
            C
          </text>
        </motion.g>

        {/* ── 3. Central Hero Bubble with Floating Golden Letter Token ── */}
        <motion.g
          animate={isActive ? { y: [0, -9, 0] } : {}}
          transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Central Bubble Base */}
          <g transform="translate(126, 88)">
            {/* Soft Ambient Bubble Aura */}
            <circle cx="0" cy="0" r="46" fill="#F43F5E" opacity="0.15" filter="url(#softGlow)" />
            {/* Soap Bubble Surface */}
            <circle cx="0" cy="0" r="44" fill="url(#soapBubbleFill)" stroke="#FFFFFF" strokeWidth="2.2" strokeOpacity="0.85" />

            {/* Specular Rim Highlights */}
            {/* Top-Left Strong Curved Glare */}
            <path
              d="M-30,-22 A36 36 0 0 1 14,-34"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />
            <circle cx="-25" cy="-14" r="2.8" fill="#FFFFFF" />

            {/* Bottom-Right Soft Refraction Rim */}
            <path
              d="M-10,36 A36 36 0 0 0 32,16"
              stroke="#BAE6FD"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
            />

            {/* ── Floating 3D Golden Letter Token Inside ── */}
            <motion.g
              animate={isActive ? { rotate: [-4, 4, -4], scale: [0.98, 1.02, 0.98] } : {}}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Token Contact Glow */}
              <circle cx="0" cy="0" r="24" fill="#FBBF24" opacity="0.4" filter="url(#softGlow)" />

              {/* Token Outer Gold Bevel Rim */}
              <circle cx="0" cy="0" r="22" fill="url(#tokenRimGrad)" stroke="#78350F" strokeWidth="1" />
              {/* Token Inner Face */}
              <circle cx="0" cy="0" r="18" fill="url(#tokenGoldGrad)" stroke="#FDE047" strokeWidth="1.5" />

              {/* Token Embossed 3D Letter 'B' */}
              <text
                x="0"
                y="8"
                textAnchor="middle"
                fontFamily="'Fredoka', sans-serif"
                fontWeight="900"
                fontSize="24"
                fill="#78350F"
                stroke="#FFFBEB"
                strokeWidth="1"
                style={{ filter: "drop-shadow(0 2px 2px rgba(120,53,15,0.4))" }}
              >
                B
              </text>

              {/* Token Shine Star */}
              <polygon
                points="-10,-10 -8,-10 -7,-12 -6,-10 -4,-10 -5,-8 -4,-6 -6,-7 -7,-5 -8,-7 -10,-6 -9,-8"
                fill="#FFFFFF"
                opacity="0.85"
              />
            </motion.g>
          </g>
        </motion.g>

        {/* ── 4. Cute Round Magnifying Glass Inspecting the Bubble ── */}
        <motion.g
          animate={
            isActive
              ? {
                  x: [0, -6, 0],
                  y: [0, -4, 0],
                  rotate: [-12, -8, -12],
                }
              : { rotate: -10 }
          }
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
          style={{ originX: "185px", originY: "80px" }}
        >
          <g transform="translate(182, 54)">
            {/* Handle Shadow */}
            <rect x="22" y="38" width="12" height="42" rx="6" fill="#881337" opacity="0.25" transform="rotate(-38 22 38)" />

            {/* Turquoise Pastel Handle */}
            <g transform="rotate(48 10 32)">
              <rect x="22" y="18" width="10" height="38" rx="5" fill="url(#lensHandle)" stroke="#0E7490" strokeWidth="1.2" />
              {/* Brass Ferrule on Handle */}
              <rect x="21" y="14" width="12" height="6" rx="2" fill="url(#brassRim)" stroke="#78350F" strokeWidth="0.8" />
              {/* Wooden grip ridges */}
              <line x1="23" y1="26" x2="31" y2="26" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
              <line x1="23" y1="32" x2="31" y2="32" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
            </g>

            {/* Brass Outer Lens Ring */}
            <circle cx="10" cy="18" r="28" fill="url(#brassRim)" stroke="#78350F" strokeWidth="2" />
            {/* Brass Inner Rim Lip */}
            <circle cx="10" cy="18" r="23" fill="#D97706" />

            {/* Glass Lens (Translucent Convex Glass) */}
            <circle cx="10" cy="18" r="22" fill="#E0F2FE" fillOpacity="0.25" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Lens Reflection Curved Glare */}
            <path
              d="M-4,4 A18 18 0 0 1 20,4"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M-2,26 A18 18 0 0 0 18,28"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
          </g>
        </motion.g>

        {/* ── 5. Sparkling Prism Accents & Floating Micro-Bubbles ── */}
        <motion.g
          transform="translate(48, 126)"
          animate={isActive ? { scale: [1, 1.3, 1], rotate: [0, 45, 0] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M0,-6 Q1,-1 6,0 Q1,1 0,6 Q-1,1 -6,0 Q-1,-1 0,-6 Z" fill="#FDE047" filter="drop-shadow(0 0 3px #FEF08A)" />
        </motion.g>

        <motion.g
          transform="translate(236, 32)"
          animate={isActive ? { scale: [0.9, 1.25, 0.9], rotate: [0, -45, 0] } : {}}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          <path d="M0,-7 Q1,-1 7,0 Q1,1 0,7 Q-1,1 -7,0 Q-1,-1 0,-7 Z" fill="#FFFFFF" filter="drop-shadow(0 0 4px #FECDD3)" />
        </motion.g>

        <circle cx="188" cy="146" r="4.5" fill="url(#soapBubbleFill)" stroke="#FFFFFF" strokeWidth="0.8" />
        <circle cx="92" cy="34" r="3.5" fill="url(#soapBubbleFill)" stroke="#FFFFFF" strokeWidth="0.8" />
      </svg>
    </div>
  );
}
