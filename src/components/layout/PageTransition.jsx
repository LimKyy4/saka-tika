// src/components/layout/PageTransition.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.85 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="flex-1 min-h-0 w-full h-full overflow-hidden flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
