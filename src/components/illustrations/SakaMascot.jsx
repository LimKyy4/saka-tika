// src/components/illustrations/SakaMascot.jsx
// Studio character mascot: Saka (boy with black hair, big round eyes, light blue shirt with 'S')
// Upgraded with authentic transparent cutout asset, breathing sway, spring hop & grounded shadow.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SakaMascot({
  className = "",
  isWaving = false,
  isHopping = false,
  speechText = "",
  showBubble = false,
}) {
  const [imgSrc, setImgSrc] = useState("/assets/saka-maskot-1-cutout.png");

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && speechText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="absolute -top-12 z-30 pointer-events-none whitespace-nowrap bg-white/95 border-2 border-amber-300 shadow-md px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5"
          >
            <span className="font-display font-extrabold text-xs sm:text-sm text-[#1B4965]">
              {speechText}
            </span>
            {/* Pointer arrow pointing down */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-amber-300" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Cutout with Gentle Breathing / Sway / Hop */}
      <motion.div
        animate={
          isHopping
            ? { y: [0, -14, 0], scale: [1, 1.06, 1], rotate: [0, -2, 0] }
            : isWaving
            ? { scale: [1, 1.05, 1], y: [-8, 0] }
            : { y: [0, -4, 0], rotate: [-0.8, 0.8, -0.8] }
        }
        transition={
          isHopping
            ? { duration: 0.45, ease: "easeOut" }
            : isWaving
            ? { duration: 0.8, repeat: 3, ease: "easeInOut" }
            : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative z-10 flex items-end justify-center"
      >
        <img
          src={imgSrc}
          onError={() => setImgSrc("/assets/saka-maskot-utama.png")}
          alt="Maskot Saka"
          draggable="false"
          className="h-[25vh] min-h-[165px] max-h-[240px] w-auto object-contain pointer-events-none select-none drop-shadow-md"
          style={{ imageRendering: "-webkit-optimize-contrast" }}
        />
      </motion.div>

      {/* Grounded Contact Drop Shadow */}
      <div className="w-28 h-5 bg-emerald-950/25 blur-[3px] rounded-full -mt-2 mx-auto pointer-events-none" />
    </div>
  );
}
