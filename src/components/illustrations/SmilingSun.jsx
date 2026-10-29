// src/components/illustrations/SmilingSun.jsx
import React from "react";
import { motion } from "framer-motion";

export default function SmilingSun() {
  return (
    <motion.svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="28" fill="#FFD95A" />
      {/* Rays */}
      {[...Array(8)].map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="10"
          x2="50"
          y2="2"
          stroke="#FFD95A"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${i * 45} 50 50)`}
        />
      ))}
      {/* Face */}
      <circle cx="42" cy="45" r="3" fill="#1B4965" />
      <circle cx="58" cy="45" r="3" fill="#1B4965" />
      {/* Cheeks */}
      <circle cx="37" cy="53" r="3" fill="#F48B94" opacity="0.6" />
      <circle cx="63" cy="53" r="3" fill="#F48B94" opacity="0.6" />
      {/* Smile */}
      <path d="M42,55 Q50,65 58,55" stroke="#1B4965" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </motion.svg>
  );
}
