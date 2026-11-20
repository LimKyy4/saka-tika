// src/components/background/FlyingBirds.jsx
// Studio-grade animated cartoon songbirds with flapping wings and click chirps.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import { motion } from "framer-motion";
import { useAudio } from "../../context/AudioContext.jsx";

function Songbird({ bodyColor, beakColor = "#FF9F1C", wingDelay = 0, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer select-none group p-1"
      title="Sentuh burung untuk mendengar kicauannya"
    >
      <svg
        viewBox="0 0 54 42"
        className="w-8 sm:w-10 h-auto overflow-visible drop-shadow-sm group-hover:scale-115 transition-transform"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tail Feathers */}
        <path d="M12,22 L2,18 L6,25 L2,28 L14,26 Z" fill={bodyColor} opacity={0.9} />

        {/* Round Body */}
        <ellipse cx="26" cy="22" rx="14" ry="11" fill={bodyColor} />

        {/* Belly Pastel Tone */}
        <path d="M18,22 C18,29 26,32 34,29 C30,32 22,32 18,22 Z" fill="#FFFFFF" opacity={0.4} />

        {/* Beak */}
        <polygon points="38,20 48,23 38,26" fill={beakColor} />

        {/* Eye */}
        <circle cx="34" cy="18" r="2.2" fill="#1E293B" />
        <circle cx="34.8" cy="17.2" r="0.8" fill="#FFFFFF" />

        {/* Flapping Wing */}
        <motion.g
          animate={{
            rotate: [-28, 38, -28],
            y: [0, -3, 0],
          }}
          transition={{
            duration: 0.38,
            repeat: Infinity,
            ease: "easeInOut",
            delay: wingDelay,
          }}
          style={{ originX: "24px", originY: "18px" }}
        >
          <path
            d="M24,18 C28,10 36,12 34,20 C32,24 24,24 24,18 Z"
            fill={bodyColor}
            stroke="#FFFFFF"
            strokeWidth="1.2"
            opacity={0.95}
          />
        </motion.g>
      </svg>
    </div>
  );
}

export default function FlyingBirds({ className = "" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Bird 1: Pastel Yellow Songbird crossing high from left to right */}
      <motion.div
        initial={{ x: "-10vw" }}
        animate={{ x: "115vw" }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear", delay: 2 }}
        className="absolute top-[8%] left-0 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, -10, 0, 10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="scale-75 sm:scale-85 opacity-75"
        >
          <Songbird bodyColor="#FDE047" wingDelay={0} />
        </motion.div>
      </motion.div>

      {/* Bird 2: Baby Blue Songbird crossing from right to left */}
      <motion.div
        initial={{ x: "110vw" }}
        animate={{ x: "-15vw" }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 11 }}
        className="absolute top-[14%] left-0 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 8, 0, -8, 0] }}
          transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "scaleX(-1)" }}
          className="scale-75 sm:scale-85 opacity-75"
        >
          <Songbird bodyColor="#7DD3FC" wingDelay={0.15} />
        </motion.div>
      </motion.div>
    </div>
  );
}
