// src/components/ui/TactileButton.jsx
import React from "react";
import { motion } from "framer-motion";
import { useAudio } from "../../context/AudioContext.jsx";

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

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98, y: 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`font-display font-semibold select-none flex items-center justify-center gap-2 cursor-pointer transition-colors active:border-b-0 ${variantsMap[variant] || variantsMap.primary} ${sizesMap[size] || sizesMap.md} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
