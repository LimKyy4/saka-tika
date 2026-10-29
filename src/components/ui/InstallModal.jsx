// src/components/ui/InstallModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Monitor } from "lucide-react";
import TactileButton from "./TactileButton.jsx";

export default function InstallModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#FFFDF9] border-4 border-[#1B4965]/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
        >
          <button
            onClick={onClose}
            aria-label="Tutup petunjuk"
            className="absolute top-4 right-4 p-2 text-primary-navy hover:bg-black/5 rounded-full"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#BFE2FF] rounded-2xl flex items-center justify-center mb-4 text-[#1B4965]">
              <Monitor size={36} />
            </div>

            <h3 className="font-display font-bold text-2xl text-primary-navy mb-2">
              Pasang Saka Tika
            </h3>
            
            <p className="font-sans text-primary-navy/80 mb-6 text-sm sm:text-base">
              Aplikasi ini dapat dipasang langsung di desktop Chrome/Edge untuk dimainkan secara offline kapan saja tanpa koneksi internet!
            </p>

            <div className="bg-[#E8F4FF] rounded-2xl p-4 w-full text-left mb-6 border border-[#BFE2FF]">
              <p className="font-sans font-semibold text-primary-navy text-sm mb-2">
                Cara memasang:
              </p>
              <ol className="list-decimal list-inside text-sm text-primary-navy/80 space-y-1">
                <li>Buka menu browser di pojok kanan atas</li>
                <li>Pilih opsi <span className="font-bold">"Install Saka Tika"</span> atau klik ikon pasang di address bar browser</li>
                <li>Selesai! Buka aplikasi lewat ikon desktop</li>
              </ol>
            </div>

            <TactileButton variant="primary" size="md" onClick={onClose} className="w-full">
              Saya Mengerti
            </TactileButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
