// src/components/background/BlueStorybookBackground.jsx
// SAKA TIKA: Dedicated Royal & Sky Blue Storybook Background for "Mengenal Huruf A-Z".
// Multi-layered visual environment:
// 1. Sky Blue (#3898EC) to Royal Blue (#165BB5) vertical atmospheric gradient
// 2. Central radial light glow for warm storybook illumination
// 3. Subtle twinkling golden and white stars
// 4. Drifting translucent white clouds
// 5. Soft layered rolling wave hills at the bottom (opacity 20%-25%)
// 6. Faint storybook ABC blocks and alphabet silhouettes in background corners
// STRICT ZERO EMOJIS POLICY: Only bespoke vector paths and CSS.

import { useMemo } from "react";
import { motion } from "framer-motion";

export default function BlueStorybookBackground() {
  // Deterministic starfield data to prevent hydration/render re-calculations
  const stars = useMemo(
    () => [
      { top: "8%", left: "6%", size: 10, delay: 0, duration: 2.4, color: "#FEF08A" },
      { top: "14%", left: "18%", size: 7, delay: 0.8, duration: 3.1, color: "#FFFFFF" },
      { top: "22%", left: "10%", size: 8, delay: 1.5, duration: 2.7, color: "#FDE047" },
      { top: "7%", left: "32%", size: 6, delay: 0.3, duration: 3.5, color: "#FFFFFF" },
      { top: "18%", left: "42%", size: 9, delay: 1.2, duration: 2.8, color: "#FEF08A" },
      { top: "10%", left: "60%", size: 8, delay: 0.5, duration: 3.0, color: "#FFFFFF" },
      { top: "15%", left: "74%", size: 11, delay: 1.8, duration: 2.5, color: "#FDE047" },
      { top: "9%", left: "88%", size: 7, delay: 0.9, duration: 3.2, color: "#FFFFFF" },
      { top: "26%", left: "84%", size: 9, delay: 1.4, duration: 2.9, color: "#FEF08A" },
      { top: "28%", left: "94%", size: 6, delay: 0.2, duration: 3.4, color: "#FFFFFF" },
      { top: "35%", left: "5%", size: 8, delay: 1.7, duration: 2.6, color: "#FFFFFF" },
      { top: "45%", left: "92%", size: 7, delay: 0.6, duration: 3.3, color: "#FDE047" },
    ],
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* ── 1. Sky Blue to Royal Blue Gradient ─────────────────── */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(180deg, #3898EC 0%, #2B8AE8 35%, #1B6EC2 70%, #165BB5 100%)",
        }}
      />

      {/* ── 2. Central Radial Light Glow ───────────────────────── */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 45%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 65%)",
        }}
      />

      {/* ── 2b. Soft Pastel Rainbow Arc in Upper Sky ────────────── */}
      <div className="absolute -top-24 sm:-top-32 left-1/2 -translate-x-1/2 w-[1100px] sm:w-[1400px] h-[550px] sm:h-[700px] pointer-events-none opacity-30 blur-[1px]">
        <svg viewBox="0 0 1200 600" fill="none" className="w-full h-full">
          <ellipse cx="600" cy="600" rx="540" ry="460" stroke="#F472B6" strokeWidth="14" opacity="0.6" />
          <ellipse cx="600" cy="600" rx="526" ry="446" stroke="#FBBF24" strokeWidth="14" opacity="0.65" />
          <ellipse cx="600" cy="600" rx="512" ry="432" stroke="#34D399" strokeWidth="14" opacity="0.6" />
          <ellipse cx="600" cy="600" rx="498" ry="418" stroke="#38BDF8" strokeWidth="14" opacity="0.65" />
          <ellipse cx="600" cy="600" rx="484" ry="404" stroke="#A78BFA" strokeWidth="14" opacity="0.6" />
        </svg>
      </div>

      {/* ── 3. Subtle Twinkling Stars ──────────────────────────── */}
      {stars.map((star, idx) => (
        <motion.div
          key={idx}
          className="absolute pointer-events-none"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.25, 0.9, 0.25],
            scale: [0.85, 1.2, 0.85],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" fill={star.color} className="w-full h-full drop-shadow-xs">
            <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
          </svg>
        </motion.div>
      ))}

      {/* ── 4. Translucent Floating Storybook Clouds ───────────── */}
      <motion.div
        className="absolute top-[6%] -left-32 w-56 h-20 opacity-30 pointer-events-none"
        animate={{ x: ["0vw", "115vw"] }}
        transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 160 60" fill="white">
          <circle cx="40" cy="40" r="24" />
          <circle cx="70" cy="30" r="28" />
          <circle cx="105" cy="34" r="22" />
          <circle cx="130" cy="42" r="18" />
          <rect x="25" y="36" width="115" height="24" rx="12" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-[18%] -left-48 w-72 h-24 opacity-25 pointer-events-none"
        animate={{ x: ["0vw", "125vw"] }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear", delay: 25 }}
      >
        <svg viewBox="0 0 160 60" fill="white">
          <circle cx="35" cy="38" r="22" />
          <circle cx="68" cy="28" r="26" />
          <circle cx="110" cy="32" r="24" />
          <circle cx="135" cy="40" r="16" />
          <rect x="20" y="34" width="125" height="26" rx="13" />
        </svg>
      </motion.div>

      {/* ── 5. Vivid Decorative Corner Storybook Motifs (Sharpened) ── */}
      {/* Top-Left: Vivid 3D 'A' Toy Block (Sky-Cyan / Gold / Coral) */}
      <div className="absolute top-3 left-4 sm:top-4 sm:left-5 opacity-85 pointer-events-none w-20 h-20 sm:w-22 sm:h-22 drop-shadow-md">
        <svg viewBox="0 0 84 84" fill="none" className="w-full h-full">
          {/* Top Face (Warm Golden Amber) */}
          <path
            d="M16 16 L38 5 L74 12 L52 23 Z"
            fill="#FBBF24"
            stroke="#0F172A"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M18 16 L38 7 L70 13" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />

          {/* Right Face (Vibrant Coral Rose) */}
          <path
            d="M52 23 L74 12 L74 54 L52 65 Z"
            fill="#F43F5E"
            stroke="#0F172A"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M54 24 L72 14 L72 52" stroke="#FDA4AF" strokeWidth="1.2" strokeLinecap="round" />

          {/* Front Face (Bright Sky-Cyan) */}
          <path
            d="M10 23 L52 23 L52 65 L10 65 Z"
            fill="#38BDF8"
            stroke="#0F172A"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Front Inner Gloss Bevel */}
          <path d="M12 25 L50 25 L50 27 L12 27 Z" fill="white" opacity="0.6" />
          <path d="M12 25 L12 63 L14 63 L14 25 Z" fill="white" opacity="0.4" />

          {/* Bold Centered 'A' Emblem */}
          <text
            x="31"
            y="52"
            fill="#0F172A"
            fontFamily="Fredoka, system-ui, sans-serif"
            fontWeight="900"
            fontSize="26"
            textAnchor="middle"
            opacity="0.3"
          >
            A
          </text>
          <text
            x="31"
            y="50"
            fill="#FFFFFF"
            fontFamily="Fredoka, system-ui, sans-serif"
            fontWeight="900"
            fontSize="26"
            textAnchor="middle"
          >
            A
          </text>
        </svg>
      </div>

      {/* Top-Right: Vivid Open Storybook Prop (Golden-Amber Cover & Ribbon) */}
      <div className="absolute top-3 right-4 sm:top-4 sm:right-6 opacity-85 pointer-events-none w-24 h-18 sm:w-28 sm:h-20 drop-shadow-md">
        <svg viewBox="0 0 100 68" fill="none" className="w-full h-full">
          {/* Outer Cover Trim (Golden Amber / Warm Caramel) */}
          <path
            d="M50 22 C37 14 17 14 6 18 L6 57 C17 53 37 53 50 59 C63 53 83 53 94 57 L94 18 C83 14 63 14 50 22 Z"
            fill="#F59E0B"
            stroke="#0F172A"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Book Spine Center Ridge */}
          <path d="M50 22 L50 59" stroke="#B45309" strokeWidth="3" />

          {/* Left Cream-White Page */}
          <path
            d="M48 21 C36 15 18 15 8 19 L8 54 C18 50 36 50 48 56 Z"
            fill="#FFFDF7"
            stroke="#0F172A"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Right Cream-White Page */}
          <path
            d="M52 21 C64 15 82 15 92 19 L92 54 C82 50 64 50 52 56 Z"
            fill="#FFFDF7"
            stroke="#0F172A"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Storybook Text Lines (Playful Cyan Dashes) */}
          <path d="M16 28 C24 26 34 26 42 28" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="1 3" />
          <path d="M16 35 C24 33 34 33 42 35" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="1 3" />
          <path d="M16 42 C24 40 34 40 42 42" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="1 3" />

          <path d="M58 28 C66 26 76 26 84 28" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="1 3" />
          <path d="M58 35 C66 33 76 33 84 35" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="1 3" />
          <path d="M58 42 C66 40 76 40 84 42" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="1 3" />

          {/* Red Ribbon Bookmark Hanging from Spine */}
          <path
            d="M49 22 C49 32 52 46 53 62 L49 59 L45 62 C46 46 49 32 49 22 Z"
            fill="#EF4444"
            stroke="#0F172A"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* ── 6. Rolling Blue-Teal & Soft Meadow Hills at Bottom ── */}
      <div className="absolute bottom-0 inset-x-0 h-44 overflow-hidden pointer-events-none">
        {/* Back Teal/Sky Wave Hill */}
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-36 opacity-25 text-[#0369A1]"
          fill="currentColor"
        >
          <path d="M0,70 C320,130 460,25 760,65 C1060,110 1220,35 1440,60 L1440,200 L0,200 Z" />
        </svg>

        {/* Middle Meadow Green Hill */}
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-28 opacity-20 text-[#059669]"
          fill="currentColor"
        >
          <path d="M0,90 C260,40 540,115 840,80 C1140,50 1300,105 1440,90 L1440,200 L0,200 Z" />
        </svg>

        {/* Front Soft Teal-Meadow Layer with White Daisy Flowers */}
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-20 opacity-30 text-[#047857]"
          fill="currentColor"
        >
          <path d="M0,110 C240,65 520,125 820,95 C1120,65 1320,110 1440,100 L1440,200 L0,200 Z" />
        </svg>

        {/* Subtle Scattered White Daisy Flowers along Meadow Edge */}
        <div className="absolute bottom-2 inset-x-0 flex justify-around opacity-40 px-6">
          {[12, 28, 45, 62, 78, 91].map((_, i) => (
            <svg key={i} viewBox="0 0 24 24" className="w-4 h-4 text-white">
              <circle cx="12" cy="7" r="3" fill="currentColor" />
              <circle cx="17" cy="12" r="3" fill="currentColor" />
              <circle cx="12" cy="17" r="3" fill="currentColor" />
              <circle cx="7" cy="12" r="3" fill="currentColor" />
              <circle cx="12" cy="12" r="3" fill="#FBBF24" />
            </svg>
          ))}
        </div>
      </div>

      {/* ── 7. Floating Gentle Translucent Bubbles ──────────────── */}
      {[
        { left: "12%", size: 14, delay: 0, duration: 9 },
        { left: "28%", size: 18, delay: 3, duration: 11 },
        { left: "52%", size: 12, delay: 1.5, duration: 10 },
        { left: "74%", size: 20, delay: 4.5, duration: 12 },
        { left: "88%", size: 16, delay: 2, duration: 8.5 },
      ].map((b, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full pointer-events-none border border-white/40 bg-white/15 backdrop-blur-[0.5px]"
          style={{
            bottom: "-20px",
            left: b.left,
            width: b.size,
            height: b.size,
          }}
          animate={{
            y: ["0vh", "-110vh"],
            x: [0, idx % 2 === 0 ? 15 : -15, 0],
            opacity: [0, 0.45, 0.45, 0],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
