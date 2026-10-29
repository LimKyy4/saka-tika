// src/components/illustrations/AmbientDecor.jsx
// Ambient animated background decor: fluttering butterflies, gliding birds, and drifting clouds.
// ZERO EMOJIS anywhere in this file.

import React from "react";
import { motion } from "framer-motion";

// Friendly Animated Butterfly
export function AnimatedButterfly({ className = "", delay = 0, initialY = 120 }) {
  return (
    <motion.div
      initial={{ x: -60, y: initialY, opacity: 0 }}
      animate={{
        x: ["-5vw", "25vw", "55vw", "85vw", "105vw"],
        y: [initialY, initialY - 30, initialY + 20, initialY - 40, initialY - 10],
        opacity: [0, 0.9, 0.9, 0.9, 0],
      }}
      transition={{
        duration: 22,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute pointer-events-none z-0 ${className}`}
    >
      <svg width="34" height="34" viewBox="0 0 40 40">
        {/* Left Wing Flapping */}
        <motion.ellipse
          cx="14"
          cy="16"
          rx="10"
          ry="14"
          fill="#8FB8ED"
          stroke="#5B8AC5"
          strokeWidth="1.5"
          animate={{ scaleX: [1, 0.25, 1] }}
          transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
          style={{ originX: "20px", originY: "20px" }}
        />
        {/* Right Wing Flapping */}
        <motion.ellipse
          cx="26"
          cy="16"
          rx="10"
          ry="14"
          fill="#8FB8ED"
          stroke="#5B8AC5"
          strokeWidth="1.5"
          animate={{ scaleX: [1, 0.25, 1] }}
          transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
          style={{ originX: "20px", originY: "20px" }}
        />
        {/* Butterfly Body */}
        <ellipse cx="20" cy="20" rx="2.5" ry="9" fill="#1B4965" />
        {/* Antennae */}
        <path d="M19,12 Q15,6 12,8" stroke="#1B4965" strokeWidth="1.2" fill="none" />
        <path d="M21,12 Q25,6 28,8" stroke="#1B4965" strokeWidth="1.2" fill="none" />
      </svg>
    </motion.div>
  );
}

// Cheerful Gliding Bird
export function AnimatedBird({ className = "", delay = 4, initialY = 60 }) {
  return (
    <motion.div
      initial={{ x: "-10vw", y: initialY, opacity: 0 }}
      animate={{
        x: ["-10vw", "30vw", "60vw", "110vw"],
        y: [initialY, initialY + 18, initialY - 14, initialY + 10],
        opacity: [0, 0.85, 0.85, 0],
      }}
      transition={{
        duration: 26,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      className={`absolute pointer-events-none z-0 ${className}`}
    >
      <svg width="42" height="30" viewBox="0 0 50 36">
        {/* Body */}
        <ellipse cx="26" cy="18" rx="14" ry="9" fill="#F9D968" stroke="#E5B200" strokeWidth="1.5" />
        {/* Head */}
        <circle cx="38" cy="14" r="7" fill="#F9D968" stroke="#E5B200" strokeWidth="1.5" />
        {/* Beak */}
        <polygon points="44,14 50,16 44,18" fill="#F59E0B" />
        {/* Eye */}
        <circle cx="40" cy="12" r="1.5" fill="#1B4965" />
        {/* Wing Flapping */}
        <motion.path
          d="M20,16 C22,6 30,8 32,18 Z"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="1.2"
          animate={{ scaleY: [1, -0.6, 1] }}
          transition={{ repeat: Infinity, duration: 0.45, ease: "easeInOut" }}
          style={{ originX: "26px", originY: "18px" }}
        />
        {/* Tail */}
        <polygon points="12,18 4,14 6,22" fill="#E5B200" />
      </svg>
    </motion.div>
  );
}

// Drifting Fluffy Cloud
export function FloatingCloud({ x = 0, y = 20, scale = 1, duration = 18, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ x: x - 15 }}
      animate={{ x: [x - 15, x + 25, x - 15] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      style={{ top: `${y}px`, transform: `scale(${scale})` }}
      className={`absolute pointer-events-none opacity-75 z-0 ${className}`}
    >
      <svg width="130" height="65" viewBox="0 0 130 65" fill="#FFFFFF">
        <path d="M25,48 Q20,30 38,28 Q46,14 65,16 Q82,10 96,24 Q114,24 116,42 Q124,54 108,58 L28,58 Q14,58 25,48 Z" />
      </svg>
    </motion.div>
  );
}

// Complete Ambient Backdrop Wrapper
export default function AmbientDecor() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Drifting Clouds */}
      <FloatingCloud x={30} y={16} scale={0.9} duration={20} />
      <FloatingCloud x={380} y={42} scale={0.75} duration={24} delay={2} className="hidden md:block" />
      <FloatingCloud x={780} y={24} scale={0.85} duration={22} delay={1} className="hidden lg:block" />

      {/* Fluttering Butterflies */}
      <AnimatedButterfly delay={1} initialY={130} />
      <AnimatedButterfly delay={12} initialY={170} className="hidden sm:block" />

      {/* Gliding Bird */}
      <AnimatedBird delay={3} initialY={50} />
    </div>
  );
}
