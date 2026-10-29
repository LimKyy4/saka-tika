// src/components/background/MountainRange.jsx
// Studio-grade dual-layer cartoon mountain ridges with atmospheric pastel depth.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React from "react";

export default function MountainRange({ className = "" }) {
  return (
    <div className={`w-full overflow-hidden select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1440 320"
        className="w-full h-auto block"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Back Mountain Ridge Gradient: Misty pastel periwinkle-blue */}
          <linearGradient id="backMtnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A8C7DE" />
            <stop offset="60%" stopColor="#BCD5E8" />
            <stop offset="100%" stopColor="#D8E8F5" />
          </linearGradient>

          {/* Front Mountain Ridge Gradient: Sage-teal rolling curves */}
          <linearGradient id="frontMtnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7EAE9B" />
            <stop offset="50%" stopColor="#8FBEAB" />
            <stop offset="100%" stopColor="#A8D1C0" />
          </linearGradient>

          {/* Mountain Crest Highlight */}
          <linearGradient id="crestHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* ── Layer 1: Back Ridge (Misty Periwinkle) ──────────── */}
        <path
          d="M0,190 
             C160,110 320,130 460,95 
             C600,60 720,120 860,80 
             C980,45 1120,110 1260,75 
             C1360,50 1410,70 1440,85 
             L1440,320 L0,320 Z"
          fill="url(#backMtnGrad)"
          opacity={0.85}
        />

        {/* Back Ridge Snow/Light Crest */}
        <path
          d="M440,100 C460,95 480,105 500,115"
          stroke="url(#crestHighlight)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M840,85 C860,80 880,90 900,100"
          stroke="url(#crestHighlight)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Layer 2: Front Ridge (Sage-Teal Curves) ─────────── */}
        <path
          d="M0,230 
             C120,170 260,140 380,165 
             C520,195 640,145 780,175 
             C920,205 1060,140 1200,160 
             C1320,180 1400,150 1440,160 
             L1440,320 L0,320 Z"
          fill="url(#frontMtnGrad)"
          opacity={0.95}
        />

        {/* Front Ridge Soft Crest Highlights */}
        <path
          d="M240,148 C280,140 330,145 370,160"
          stroke="#C4E4D7"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity={0.65}
        />
        <path
          d="M660,152 C700,142 750,150 790,170"
          stroke="#C4E4D7"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity={0.65}
        />
        <path
          d="M1070,146 C1120,138 1170,145 1210,160"
          stroke="#C4E4D7"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity={0.65}
        />
      </svg>
    </div>
  );
}
