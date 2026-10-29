// src/components/illustrations/LetterBlocks.jsx
import React from "react";
import { motion } from "framer-motion";

export default function LetterBlocks() {
  const blockVariants = {
    hover: { y: -8, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <div className="flex gap-4">
      {/* Block A */}
      <motion.div
        variants={blockVariants}
        whileHover="hover"
        className="w-16 h-16 bg-[#64A6E8] border-b-4 border-[#4A8FD6] rounded-xl flex items-center justify-center shadow-lg cursor-pointer"
      >
        <span className="font-display text-white text-3xl font-bold">A</span>
      </motion.div>
      {/* Block B */}
      <motion.div
        variants={blockVariants}
        whileHover="hover"
        className="w-16 h-16 bg-[#F48B94] border-b-4 border-[#DE8B8B] rounded-xl flex items-center justify-center shadow-lg cursor-pointer"
      >
        <span className="font-display text-white text-3xl font-bold">B</span>
      </motion.div>
      {/* Block C */}
      <motion.div
        variants={blockVariants}
        whileHover="hover"
        className="w-16 h-16 bg-[#78B894] border-b-4 border-[#5E9E7A] rounded-xl flex items-center justify-center shadow-lg cursor-pointer"
      >
        <span className="font-display text-white text-3xl font-bold">C</span>
      </motion.div>
    </div>
  );
}
