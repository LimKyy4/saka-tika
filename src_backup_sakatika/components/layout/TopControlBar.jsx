// src/components/layout/TopControlBar.jsx
import React, { useState } from "react";
import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { usePWAInstall } from "../../hooks/usePWAInstall.js";
import InstallModal from "../ui/InstallModal.jsx";
import ConfirmResetModal from "../ui/ConfirmResetModal.jsx";
import { Volume2, VolumeX, Sparkles, BellOff, Download, Home, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function TopControlBar() {
  const { stars, navigateTo, resetProgress } = useGame();
  const { isBgmEnabled, isSfxEnabled, toggleBgm, toggleSfx, playSfx } = useAudio();
  const { isInstalled, triggerInstall, showManualModal, setShowManualModal } = usePWAInstall();

  const [showResetModal, setShowResetModal] = useState(false);

  const handleConfirmReset = () => {
    playSfx("click");
    resetProgress();
    setShowResetModal(false);
  };

  return (
    <>
      <header className="relative z-40 flex-shrink-0 px-3 py-2 flex items-center justify-between bg-transparent">
        {/* Brand / Home */}
        <button
          onClick={() => navigateTo("/")}
          aria-label="Kembali ke Beranda"
          className="flex items-center gap-2 bg-white/80 backdrop-blur border border-[#1B4965]/15 px-3 py-1.5 rounded-2xl shadow-sm hover:scale-105 active:scale-95 transition-transform"
        >
          <Home size={18} className="text-[#1B4965]" />
          <span className="font-display font-bold text-sm text-[#1B4965] hidden sm:inline">
            Saka Tika
          </span>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Star Counter Pill */}
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur border-2 border-[#F9D968] px-3 py-1 rounded-2xl shadow-sm">
            <svg className="w-4 h-4 fill-[#F9D968] stroke-[#E3C654] stroke-1" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <motion.span
              key={stars}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="font-display font-bold text-sm text-[#1B4965] min-w-[1.2rem] text-center"
            >
              {stars}
            </motion.span>
          </div>

          {/* Reset Stars */}
          <button
            onClick={() => setShowResetModal(true)}
            aria-label="Reset Bintang"
            className="w-9 h-9 bg-white/80 backdrop-blur border border-[#1B4965]/15 rounded-xl flex items-center justify-center text-[#1B4965] shadow-sm hover:scale-105 active:scale-95 transition-transform"
          >
            <RotateCcw size={15} />
          </button>

          {/* BGM Toggle */}
          <button
            onClick={toggleBgm}
            aria-label={isBgmEnabled ? "Matikan Musik" : "Nyalakan Musik"}
            className="w-9 h-9 bg-white/80 backdrop-blur border border-[#1B4965]/15 rounded-xl flex items-center justify-center text-[#1B4965] shadow-sm hover:scale-105 active:scale-95 transition-transform"
          >
            {isBgmEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* SFX Toggle */}
          <button
            onClick={toggleSfx}
            aria-label={isSfxEnabled ? "Matikan Efek Suara" : "Nyalakan Efek Suara"}
            className="w-9 h-9 bg-white/80 backdrop-blur border border-[#1B4965]/15 rounded-xl flex items-center justify-center text-[#1B4965] shadow-sm hover:scale-105 active:scale-95 transition-transform"
          >
            {isSfxEnabled ? <Sparkles size={15} /> : <BellOff size={15} />}
          </button>

          {/* Desktop Install */}
          {!isInstalled && (
            <button
              onClick={triggerInstall}
              aria-label="Pasang di Desktop"
              className="flex items-center gap-1 bg-[#BFE2FF]/90 backdrop-blur border border-[#8FB8ED] text-[#1B4965] px-2.5 py-1.5 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-transform font-display font-semibold text-xs"
            >
              <Download size={14} />
              <span className="hidden md:inline">Pasang</span>
            </button>
          )}
        </div>
      </header>

      <InstallModal isOpen={showManualModal} onClose={() => setShowManualModal(false)} />
      <ConfirmResetModal
        isOpen={showResetModal}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetModal(false)}
      />
    </>
  );
}
