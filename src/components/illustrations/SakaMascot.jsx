// src/components/illustrations/SakaMascot.jsx
// Studio character mascot: Saka (boy with black hair, big round eyes, rosy cheeks, light blue shirt with 'S')
// Uses the client's authentic character artwork with transparent alpha background:
// - /assets/saka-maskot-utama.png (main / idle pose)
// - /assets/saka-maskot-utama2.png (action / waving / cheering pose)
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import { motion } from "framer-motion";

export default function SakaMascot({ className = "", isWaving = false }) {
  const imgSrc = isWaving ? "/assets/saka-maskot-utama2.png" : "/assets/saka-maskot-utama.png";

  return (
    <motion.div
      className={`relative flex items-end justify-center select-none overflow-visible ${
        className || "w-28 h-36 sm:w-36 sm:h-48 md:w-44 md:h-56 lg:w-52 lg:h-64"
      }`}
      animate={isWaving ? { scale: [1, 1.05, 1], y: [-8, 0] } : { y: [0, -4, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <img
        src={imgSrc}
        alt="Maskot Saka"
        draggable="false"
        className="max-h-full max-w-full w-auto h-full object-contain pointer-events-none select-none drop-shadow-md"
        style={{
          imageRendering: "-webkit-optimize-contrast",
        }}
      />
    </motion.div>
  );
}
