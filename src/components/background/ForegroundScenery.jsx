// src/components/background/ForegroundScenery.jsx
// Studio-grade lush foreground landscape with rolling hills, wooden cartoon fence, trees & swaying flowers.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React from "react";
import { motion } from "framer-motion";

function SwayingFlower({ cx, cy, petalColor, centerColor = "#FFE066", delay = 0 }) {
  return (
    <motion.g
      animate={{ rotate: [-6, 6, -6] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay }}
      style={{ originX: `${cx}px`, originY: `${cy + 12}px` }}
    >
      {/* Stem */}
      <path
        d={`M${cx},${cy + 12} Q${cx - 2},${cy + 6} ${cx},${cy}`}
        stroke="#4E8D38"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Tiny leaf */}
      <path
        d={`M${cx - 1},${cy + 7} Q${cx - 5},${cy + 4} ${cx - 2},${cy + 2}`}
        fill="#66BB6A"
      />
      {/* Flower Petals */}
      <circle cx={cx} cy={cy - 4} r="3" fill={petalColor} />
      <circle cx={cx + 4} cy={cy} r="3" fill={petalColor} />
      <circle cx={cx} cy={cy + 4} r="3" fill={petalColor} />
      <circle cx={cx - 4} cy={cy} r="3" fill={petalColor} />
      {/* Flower Center */}
      <circle cx={cx} cy={cy} r="3.2" fill={centerColor} />
    </motion.g>
  );
}

function CartoonTree({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Trunk with slight texture */}
      <path
        d="M26,90 C26,70 24,50 20,38 C28,38 34,50 36,90 Z"
        fill="#795548"
      />
      {/* Roots */}
      <path d="M16,92 Q22,86 26,90" stroke="#5D4037" strokeWidth="2.5" fill="none" />
      <path d="M40,92 Q34,86 32,90" stroke="#5D4037" strokeWidth="2.5" fill="none" />

      {/* Foliage Puffs */}
      {/* Bottom foliage layer (darker green) */}
      <circle cx="16" cy="38" r="22" fill="#388E3C" />
      <circle cx="40" cy="38" r="22" fill="#388E3C" />
      <circle cx="28" cy="22" r="25" fill="#43A047" />

      {/* Mid foliage layer */}
      <circle cx="18" cy="34" r="19" fill="#4CAF50" />
      <circle cx="38" cy="34" r="19" fill="#4CAF50" />
      <circle cx="28" cy="18" r="22" fill="#66BB6A" />

      {/* Top highlight domes */}
      <ellipse cx="28" cy="12" rx="14" ry="9" fill="#81C784" opacity={0.8} />
      <ellipse cx="18" cy="26" rx="9" ry="6" fill="#A5D6A7" opacity={0.7} />
      <ellipse cx="38" cy="26" rx="9" ry="6" fill="#A5D6A7" opacity={0.7} />
    </g>
  );
}

function WoodenFenceSection({ x, y, scale = 1, count = 5 }) {
  const pickets = Array.from({ length: count });
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Horizontal rails */}
      <rect x="0" y="24" width={count * 20 + 8} height="5" rx="2" fill="#966036" />
      <rect x="0" y="40" width={count * 20 + 8} height="5" rx="2" fill="#966036" />

      {/* Vertical pickets with rounded point tops */}
      {pickets.map((_, i) => (
        <g key={i} transform={`translate(${i * 20 + 4}, 0)`}>
          {/* Post shadow */}
          <path
            d="M0,12 L6,2 L12,12 L12,58 L0,58 Z"
            fill="#C88E59"
            stroke="#966036"
            strokeWidth="1.5"
          />
          {/* Picket top highlight */}
          <path d="M2,12 L6,5 L10,12" stroke="#E0AB78" strokeWidth="1.2" fill="none" />
          {/* Wood grain notch */}
          <line x1="6" y1="18" x2="6" y2="34" stroke="#845028" strokeWidth="1" strokeDasharray="4 3" />
        </g>
      ))}
    </g>
  );
}

export default function ForegroundScenery({ className = "" }) {
  return (
    <div className={`w-full overflow-hidden select-none pointer-events-none relative ${className}`}>
      <svg
        viewBox="0 0 1440 360"
        className="w-full h-auto block overflow-visible"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Back Hill: Golden-Lush Pastel Grass */}
          <linearGradient id="backHillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B6E07A" />
            <stop offset="60%" stopColor="#A2D662" />
            <stop offset="100%" stopColor="#81BF45" />
          </linearGradient>

          {/* Front Hill: Vibrant Pure Meadow Green */}
          <linearGradient id="frontHillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9CCC65" />
            <stop offset="40%" stopColor="#8BC34A" />
            <stop offset="100%" stopColor="#689F38" />
          </linearGradient>
        </defs>

        {/* ── Background Hill with Gentle Wave ─────────────────── */}
        <path
          d="M0,160 
             C280,85 480,180 840,110 
             C1120,55 1300,140 1440,95 
             L1440,360 L0,360 Z"
          fill="url(#backHillGrad)"
        />

        {/* Trees positioned naturally on background hill crest */}
        <CartoonTree x={120} y={50} scale={1.1} />
        <CartoonTree x={60} y={65} scale={0.9} />
        <CartoonTree x={1280} y={40} scale={1.2} />
        <CartoonTree x={1360} y={55} scale={0.95} />

        {/* Wooden Cartoon Fence positioned on hill slope */}
        <WoodenFenceSection x={190} y={115} scale={0.88} count={6} />
        <WoodenFenceSection x={1080} y={80} scale={0.9} count={7} />

        {/* ── Foreground Rolling Hill (Front Meadow) ───────────── */}
        <path
          d="M0,210 
             C260,165 520,240 880,175 
             C1160,125 1320,190 1440,160 
             L1440,360 L0,360 Z"
          fill="url(#frontHillGrad)"
        />

        {/* Front Hill Tree Accent */}
        <CartoonTree x={-10} y={120} scale={1.25} />
        <CartoonTree x={1390} y={90} scale={1.3} />

        {/* Little Wooden Garden Gate on Front Hill */}
        <WoodenFenceSection x={340} y={190} scale={0.75} count={4} />

        {/* Little Grass Tufts */}
        <g stroke="#558B2F" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M140,245 Q145,235 150,245 Q153,230 156,245 Q160,238 164,245" />
          <path d="M420,265 Q425,255 430,265 Q433,250 436,265 Q440,258 444,265" />
          <path d="M780,240 Q785,230 790,240 Q793,225 796,240 Q800,233 804,240" />
          <path d="M1020,225 Q1025,215 1030,225 Q1033,210 1036,225 Q1040,218 1044,225" />
          <path d="M1240,230 Q1245,220 1250,230 Q1253,215 1256,230 Q1260,223 1264,230" />
        </g>

        {/* Swaying Daisies and Wildflowers */}
        <SwayingFlower cx={180} cy={240} petalColor="#FF8BA7" delay={0} />
        <SwayingFlower cx={210} cy={252} petalColor="#FFF176" delay={0.4} />
        <SwayingFlower cx={235} cy={242} petalColor="#BA68C8" delay={0.8} />

        <SwayingFlower cx={460} cy={270} petalColor="#4FC3F7" delay={0.2} />
        <SwayingFlower cx={490} cy={262} petalColor="#FF8BA7" delay={0.6} />

        <SwayingFlower cx={820} cy={245} petalColor="#FFF176" delay={0.3} />
        <SwayingFlower cx={850} cy={255} petalColor="#BA68C8" delay={0.7} />

        <SwayingFlower cx={1160} cy={232} petalColor="#FF8BA7" delay={0.1} />
        <SwayingFlower cx={1190} cy={240} petalColor="#4FC3F7" delay={0.5} />
        <SwayingFlower cx={1215} cy={228} petalColor="#FFF176" delay={0.9} />
      </svg>
    </div>
  );
}
