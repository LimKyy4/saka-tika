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
        initial={{ opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.99 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="flex-1 min-h-0 w-full h-full overflow-hidden flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
