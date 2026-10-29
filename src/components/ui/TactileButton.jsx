// src/components/ui/TactileButton.jsx
// Studio-grade tactile button supporting both vector CSS 3D physics and client PNG button sprites.
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

const variantsMap = {
  primary: "bg-[#F9D968] border-[#E3C654] text-[#1B4965]",
  secondary: "bg-[#FFFDF9] border-[#E2E8F0] text-[#1B4965]",
  blue: "bg-[#64A6E8] border-[#4A8FD6] text-white",
  green: "bg-[#78B894] border-[#5E9E7A] text-white",
  red: "bg-[#F26B6B] border-[#D95353] text-white",
  yellow: "bg-[#FCE277] border-[#E3C654] text-[#1B4965]",
  pink: "bg-[#F7A8A8] border-[#DE8B8B] text-white",
  ghost: "bg-transparent border-transparent text-[#1B4965] shadow-none",
};

const sizesMap = {
  sm: "px-3 py-1.5 text-sm rounded-lg border-b-2",
  md: "px-5 py-2.5 text-base rounded-xl border-b-4",
  lg: "px-6 py-3.5 text-lg rounded-2xl border-b-4",
  xl: "px-8 py-4.5 text-xl rounded-2xl border-b-[6px]",
};

export default function TactileButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  ariaLabel,
  disabled = false,
  sprite,
  spriteClassName = "",
  ...props
}) {
  const { playSfx } = useAudio();

  const handleMouseEnter = () => {
    if (!disabled) playSfx("hover");
  };

  const handleClick = (e) => {
    if (disabled) return;
    playSfx("click");
    if (onClick) onClick(e);
  };

  // If rendering a full sprite button (e.g. play.png or next.png)
  if (sprite && (sprite === "play" || sprite === "next" || sprite === "lanjut")) {
    const spriteMeta = SPRITE_MAP[sprite] || { src: sprite, defaultAlt: ariaLabel || "Tombol" };
    return (
      <motion.button
        type="button"
        whileHover={disabled ? {} : { scale: 1.05, y: -2 }}
        whileTap={disabled ? {} : { scale: 0.95, y: 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        aria-label={ariaLabel || spriteMeta.defaultAlt}
        disabled={disabled}
        className={`inline-flex items-center justify-center p-0 bg-transparent border-0 outline-none select-none cursor-pointer focus:outline-none transition-transform ${
          disabled ? "opacity-40 cursor-not-allowed" : ""
        } ${className}`}
        {...props}
      >
        <img
          src={spriteMeta.src}
          alt={ariaLabel || spriteMeta.defaultAlt}
          draggable="false"
          className={`h-11 sm:h-13 w-auto object-contain drop-shadow-md pointer-events-none select-none ${spriteClassName}`}
          style={{ imageRendering: "-webkit-optimize-contrast" }}
        />
        {children && <span className="sr-only">{children}</span>}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98, y: 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`font-display font-semibold select-none flex items-center justify-center gap-2 cursor-pointer transition-colors active:border-b-0 ${
        variantsMap[variant] || variantsMap.primary
      } ${sizesMap[size] || sizesMap.md} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      {...props}
    >
      {sprite && SPRITE_MAP[sprite] && (
        <img
          src={SPRITE_MAP[sprite].src}
          alt=""
          draggable="false"
          className="w-5 h-5 object-contain pointer-events-none select-none"
        />
      )}
      {children}
    </motion.button>
  );
}
