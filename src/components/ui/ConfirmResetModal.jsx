// src/components/ui/ConfirmResetModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import TactileButton from "./TactileButton.jsx";

export default function ConfirmResetModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Konfirmasi Reset Bintang"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 16 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="bg-[#FFFDF9] border-4 border-[#F9D968] rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative text-center"
        >
          {/* Close */}
          <button
            onClick={onCancel}
            aria-label="Batal"
            className="absolute top-3 right-3 p-2 text-[#1B4965]/50 hover:text-[#1B4965] rounded-full"
          >
            <X size={20} />
          </button>

          {/* Icon */}
          <div className="w-16 h-16 bg-[#FDE08D] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RotateCcw size={32} className="text-[#1B4965]" />
          </div>

          <h3 className="font-display font-bold text-2xl text-[#1B4965] mb-2">
            Ulangi Bintang dari Nol?
          </h3>
          <p className="font-sans text-sm text-[#1B4965]/70 mb-6">
            Semua bintang yang sudah kamu kumpulkan akan dihapus. Kamu bisa mulai lagi dari awal!
          </p>

          <div className="flex gap-3">
            <TactileButton
              variant="secondary"
              size="md"
              onClick={onCancel}
              className="flex-1"
            >
              Batal
            </TactileButton>
            <TactileButton
              variant="red"
              size="md"
              onClick={onConfirm}
              className="flex-1"
            >
              <RotateCcw size={16} />
              Ya, Reset
            </TactileButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
