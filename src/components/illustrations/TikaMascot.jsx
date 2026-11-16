// src/components/illustrations/TikaMascot.jsx
// Studio character mascot: Tika (girl with braided black hair, white collar, red dress with yellow stripes & 'T')
// Uses the client's authentic character artwork with transparent alpha background:
// - /assets/tika-maskot-utama.png (main / idle pose)
// - /assets/tika-maskot-utama2.png (action / cheering pose)
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React from "react";
import { motion } from "framer-motion";

export default function TikaMascot({ className = "", isCheering = false }) {
  const imgSrc = isCheering ? "/assets/tika-maskot-utama2.png" : "/assets/tika-maskot-utama.png";

  return (
    <motion.div
      className={`relative flex items-end justify-center select-none overflow-visible ${
        className || "w-28 h-36 sm:w-36 sm:h-48 md:w-44 md:h-56 lg:w-52 lg:h-64"
      }`}
      animate={isCheering ? { scale: [1, 1.05, 1], y: [-8, 0] } : { y: [0, -4, 0] }}
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
