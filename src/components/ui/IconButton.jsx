// src/components/ui/IconButton.jsx
// Studio-grade sprite icon button with 3D press physics and responsive audio feedback.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React from "react";
import { motion } from "framer-motion";
import { useAudio } from "../../context/AudioContext.jsx";

const SPRITE_MAP = {
  home: { src: "/assets/buttons/home.png", defaultAlt: "Beranda" },
  play: { src: "/assets/buttons/play.png", defaultAlt: "Mulai" },
  sound: { src: "/assets/buttons/suara.png", defaultAlt: "Suara" },
  suara: { src: "/assets/buttons/suara.png", defaultAlt: "Suara" },
  settings: { src: "/assets/buttons/pengaturan.png", defaultAlt: "Pengaturan" },
  pengaturan: { src: "/assets/buttons/pengaturan.png", defaultAlt: "Pengaturan" },
  next: { src: "/assets/buttons/next.png", defaultAlt: "Lanjut" },
  lanjut: { src: "/assets/buttons/next.png", defaultAlt: "Lanjut" },
  left: { src: "/assets/buttons/kiri.png", defaultAlt: "Sebelumnya" },
  kiri: { src: "/assets/buttons/kiri.png", defaultAlt: "Sebelumnya" },
  right: { src: "/assets/buttons/kanan.png", defaultAlt: "Selanjutnya" },
  kanan: { src: "/assets/buttons/kanan.png", defaultAlt: "Selanjutnya" },
  stop: { src: "/assets/buttons/stop.png", defaultAlt: "Berhenti" },
};

const SIZES = {
  xs: "w-7 h-7 min-w-[28px] min-h-[28px]",
  sm: "w-8 h-8 min-w-[32px] min-h-[32px]",
  md: "w-10 h-10 min-w-[40px] min-h-[40px]",
  lg: "w-12 h-12 min-w-[48px] min-h-[48px]",
  xl: "w-16 h-16 min-w-[64px] min-h-[64px]",
  banner: "h-12 sm:h-14 w-auto",
};

export default function IconButton({
  sprite,
  onClick,
  ariaLabel,
  disabled = false,
  size = "md",
  className = "",
  isActive = true,
  alt,
  children,
  ...props
}) {
  const { playSfx } = useAudio();

  const spriteMeta = SPRITE_MAP[sprite] || {
    src: sprite,
    defaultAlt: ariaLabel || "Tombol",
  };

  const handleMouseEnter = () => {
    if (!disabled) playSfx("hover");
  };

  const handleClick = (e) => {
    if (disabled) return;
    playSfx("click");
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      type="button"
      whileHover={disabled ? {} : { scale: 1.08, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.92, y: 2 }}
      transition={{ type: "spring", stiffness: 450, damping: 16 }}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      aria-label={ariaLabel || spriteMeta.defaultAlt}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center p-0 bg-transparent border-0 outline-none select-none cursor-pointer focus:outline-none transition-opacity ${
        disabled ? "opacity-35 cursor-not-allowed" : "hover:opacity-95"
      } ${!isActive ? "grayscale opacity-50" : ""} ${className}`}
      {...props}
    >
      <img
        src={spriteMeta.src}
        alt={alt || ariaLabel || spriteMeta.defaultAlt}
        draggable="false"
        className={`${SIZES[size] || size} object-contain pointer-events-none drop-shadow-md select-none`}
        style={{
          imageRendering: "-webkit-optimize-contrast",
        }}
      />
      {children}
    </motion.button>
  );
}
