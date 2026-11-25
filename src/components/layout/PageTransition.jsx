// src/components/layout/PageTransition.jsx
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const location = useLocation();
  // Non-blocking route fade-in avoids AnimatePresence mode="wait" stalling on rapid/back navigation
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0.92 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className="flex-1 min-h-0 w-full h-full overflow-hidden flex flex-col"
    >
      {children}
    </motion.div>
  );
}
