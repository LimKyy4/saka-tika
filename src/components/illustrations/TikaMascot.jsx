// src/components/illustrations/TikaMascot.jsx
// Studio-grade character mascot: Tika
// Uses the client's authentic 3D character artwork with transparent alpha background:
// - /assets/tika-maskot-utama.png (main / idle pose)
// - /assets/tika-maskot-utama2.png (action / cheering pose)
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React from "react";
import { motion } from "framer-motion";

export default function TikaMascot({ className = "", isCheering = false }) {
  const imgSrc = isCheering ? "/assets/tika-maskot-utama2.png" : "/assets/tika-maskot-utama.png";

  return (
    <motion.div
      className={`relative flex items-end justify-center select-none overflow-visible pointer-events-none ${
        className || "w-20 h-24 sm:w-24 sm:h-28"
      }`}
      animate={isCheering ? { scale: [1, 1.05, 1], y: [-6, 0] } : { y: [0, -3, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <img
        src={imgSrc}
        alt="Maskot Tika"
        draggable="false"
        className="max-h-full max-w-full w-auto h-full object-contain pointer-events-none select-none drop-shadow-md"
        style={{
          imageRendering: "-webkit-optimize-contrast",
        }}
      />
    </motion.div>
  );
}
