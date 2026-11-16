// src/components/background/DriftingClouds.jsx
// Studio-grade multi-layer parallax drifting cartoon clouds strictly constrained to upper 25% sky band.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import { motion } from "framer-motion";

function CloudPuff({ width = 140, height = 75, className = "" }) {
  return (
    <svg
      viewBox="0 0 160 85"
      className={`drop-shadow-sm overflow-visible ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="75%" stopColor="#F5F9FD" />
          <stop offset="100%" stopColor="#E2EDF8" />
        </linearGradient>
      </defs>

      <rect x="25" y="44" width="110" height="30" rx="15" fill="url(#cloudGrad)" />
      <circle cx="48" cy="46" r="26" fill="url(#cloudGrad)" />
      <circle cx="82" cy="36" r="32" fill="url(#cloudGrad)" />
      <circle cx="118" cy="48" r="24" fill="url(#cloudGrad)" />

      <path
        d="M32,46 C32,32 44,22 58,22 C64,22 70,24 74,28 C80,18 92,12 104,16"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity={0.85}
      />
    </svg>
  );
}

export default function DriftingClouds({ className = "" }) {
  return (
    <div className={`absolute inset-x-0 top-0 h-[25%] overflow-hidden pointer-events-none select-none z-10 ${className}`}>
      {/* Cloud 1: Large puffy cloud - Left to Right (45s) */}
      <motion.div
        initial={{ x: "-15vw" }}
        animate={{ x: "110vw" }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute top-2 left-0"
      >
        <CloudPuff width={150} height={80} className="opacity-75" />
      </motion.div>

      {/* Cloud 2: Mid-sized cloud - Right to Left (36s) */}
      <motion.div
        initial={{ x: "105vw" }}
        animate={{ x: "-20vw" }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear", delay: 4 }}
        className="absolute top-8 left-0"
      >
        <CloudPuff width={120} height={65} className="opacity-70" />
      </motion.div>

      {/* Cloud 3: High background small cloud - Left to Right (58s) */}
      <motion.div
        initial={{ x: "-10vw" }}
        animate={{ x: "115vw" }}
        transition={{ duration: 58, repeat: Infinity, ease: "linear", delay: 12 }}
        className="absolute top-1 left-0"
      >
        <CloudPuff width={90} height={48} className="opacity-60 scale-90" />
      </motion.div>

      {/* Cloud 4: Mid-height background cloud - Left to Right (50s) */}
      <motion.div
        initial={{ x: "-25vw" }}
        animate={{ x: "110vw" }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear", delay: 24 }}
        className="absolute top-14 left-0"
      >
        <CloudPuff width={110} height={58} className="opacity-65 scale-95" />
      </motion.div>

      {/* Cloud 5: High drifting accent cloud - Right to Left (42s) */}
      <motion.div
        initial={{ x: "110vw" }}
        animate={{ x: "-15vw" }}
        transition={{ duration: 42, repeat: Infinity, ease: "linear", delay: 18 }}
        className="absolute top-6 left-0"
      >
        <CloudPuff width={100} height={54} className="opacity-65" />
      </motion.div>
    </div>
  );
}
