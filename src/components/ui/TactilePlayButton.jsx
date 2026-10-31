// src/components/ui/TactilePlayButton.jsx
// Studio-grade Supreme Tactile "MAINKAN" Action Button for Saka Tika
// Integrates client's authentic play button asset (/assets/buttons/play.png)
// with high-satisfaction 3D arcade tactile physics, gloss shimmer, and acoustic chime triggers.
// STRICT ZERO EMOJIS POLICY: Only custom vector graphics and client assets.

import React from "react";
import { motion } from "framer-motion";
import { useAudio } from "../../context/AudioContext.jsx";

export default function TactilePlayButton({
  onClick,
  bgGradient = "from-[#FDE047] via-[#FBBF24] to-[#F59E0B]",
  textColor = "text-[#78350F]",
  borderColor = "border-[#B45309]",
  glowColor = "rgba(217,119,6,0.45)",
  className = "",
  label = "MAINKAN",
  disabled = false,
}) {
  const { playSfx } = useAudio();

  const handleMouseEnter = () => {
    if (!disabled && typeof playSfx === "function") {
      playSfx("hover");
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (typeof playSfx === "function") {
      playSfx("fanfare");
    }
    if (typeof onClick === "function") {
      onClick(e);
    }
  };

  return (
    <motion.button
      type="button"
      whileHover={disabled ? {} : { scale: 1.05, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.95, y: 3 }}
      transition={{ type: "spring", stiffness: 450, damping: 16 }}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      disabled={disabled}
      aria-label={`${label} Sekarang`}
      style={{
        boxShadow: `0 8px 20px -4px ${glowColor}, 0 2px 4px rgba(0,0,0,0.12)`,
      }}
      className={`group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-b ${bgGradient} border-b-[5px] sm:border-b-[6px] ${borderColor} active:border-b-0 active:translate-y-1.5 active:shadow-inner px-4 py-2.5 sm:py-3 select-none cursor-pointer flex items-center justify-center gap-3 transition-shadow ${className}`}
    >
      {/* ── Top Gloss Reflection Highlight ── */}
      <div className="absolute top-1 inset-x-3 h-[2px] bg-white/60 rounded-full pointer-events-none" />

      {/* ── Periodic Gloss Shimmer Glider Sweep on Hover ── */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none transition-transform ease-out" />

      {/* ── Authentic Client Play Button Asset Sprite Badge ── */}
      <div className="relative z-10 w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/25 shadow-inner group-hover:scale-110 transition-transform">
        <img
          src="/assets/buttons/play.png"
          alt=""
          aria-hidden="true"
          draggable="false"
          className="w-full h-full object-contain pointer-events-none select-none drop-shadow"
          style={{ imageRendering: "-webkit-optimize-contrast" }}
        />
      </div>

      {/* ── Extra-Bold High-Contrast Display Typography ── */}
      <span
        className={`relative z-10 font-display font-black text-base sm:text-lg tracking-wider ${textColor} drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]`}
      >
        {label}
      </span>

      {/* ── Right Play Pulse Glow Indicator ── */}
      <div className="relative z-10 flex items-center justify-center ml-0.5">
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            viewBox="0 0 16 16"
            className="w-4 h-4 fill-current opacity-70 group-hover:opacity-100 transition-opacity"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 2.5 L13 8 L4 13.5 Z" />
          </svg>
        </motion.div>
      </div>
    </motion.button>
  );
}
