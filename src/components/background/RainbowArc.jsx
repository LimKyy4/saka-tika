// src/components/background/RainbowArc.jsx
// Studio-grade 7-band pastel rainbow arc with soft ambient glow.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React from "react";
import { motion } from "framer-motion";

const BANDS = [
  { color: "#FF7A85", radius: 460, strokeWidth: 16 }, // Band 1: Outer Coral Red
  { color: "#FFA962", radius: 444, strokeWidth: 16 }, // Band 2: Pastel Orange
  { color: "#FFDC5E", radius: 428, strokeWidth: 16 }, // Band 3: Sunny Yellow
  { color: "#7BDCB5", radius: 412, strokeWidth: 16 }, // Band 4: Mint Green
  { color: "#68B8F8", radius: 396, strokeWidth: 16 }, // Band 5: Sky Blue
  { color: "#7B88FF", radius: 380, strokeWidth: 16 }, // Band 6: Soft Indigo
  { color: "#C078FF", radius: 364, strokeWidth: 16 }, // Band 7: Inner Violet
];

export default function RainbowArc({ className = "" }) {
  // Arc path generator from angle 195 to -15 degrees
  const getArcD = (r) => {
    const cx = 500;
    const cy = 520;
    const startX = cx - r;
    const endX = cx + r;
    return `M ${startX} ${cy} A ${r} ${r} 0 0 1 ${endX} ${cy}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: [0.85, 0.95, 0.85], scale: [1, 1.01, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute inset-x-0 top-0 pointer-events-none select-none flex justify-center ${className}`}
      style={{
        filter: "drop-shadow(0 0 20px rgba(255,255,255,0.7))",
      }}
    >
      <svg
        viewBox="0 0 1000 540"
        className="w-full max-w-5xl h-auto overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="rainbowFade" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>
        </defs>

        {BANDS.map((band, idx) => (
          <path
            key={idx}
            d={getArcD(band.radius)}
            stroke={band.color}
            strokeWidth={band.strokeWidth}
            strokeLinecap="round"
            opacity={0.88}
          />
        ))}
      </svg>
    </motion.div>
  );
}
