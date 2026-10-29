// src/components/layout/TopControlBar.jsx
// Studio Arcade-grade Game HUD with Real Client Button Sprites (Home, Suara, Pengaturan) & Zero Scrollbars.
// Strictly adheres to Tier 1: Top HUD Bar (Height: 10% - 12%, max 64px)
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { usePWAInstall } from "../../hooks/usePWAInstall.js";
import InstallModal from "../ui/InstallModal.jsx";
import ConfirmResetModal from "../ui/ConfirmResetModal.jsx";
import { MonitorDown, RotateCcw, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function TopControlBar() {
  const location = useLocation();
  const { stars, navigateTo, resetProgress } = useGame();
  const { isBgmEnabled, toggleBgm, playSfx } = useAudio();
  const { isInstalled, triggerInstall, showManualModal, setShowManualModal } = usePWAInstall();

  const [showResetModal, setShowResetModal] = useState(false);
  const [starHovered, setStarHovered] = useState(false);

  const isHome = location.pathname === "/";
  const isMenu = location.pathname === "/menu";

  const handleConfirmReset = () => {
    playSfx("click");
    resetProgress();
    setShowResetModal(false);
  };

  return (
    <>
      <header className="h-[10%] sm:h-[12%] max-h-[64px] min-h-[48px] relative z-40 flex-shrink-0 px-3 sm:px-6 pt-1 sm:pt-2 pointer-events-auto select-none flex items-center justify-center w-full">
        {/* Floating Glossy Arcade HUD Capsule */}
        <div className="bg-white/92 backdrop-blur-md border-b-4 border-slate-300 shadow-lg rounded-full px-3 sm:px-5 py-1.5 mx-auto max-w-5xl w-full flex items-center justify-between gap-2 transition-all">
          
          {/* ── Left: Dynamic Navigation (Brand on Home/Menu, Back on Sub-games) ── */}
          <div className="flex items-center gap-2">
            {!isHome && !isMenu ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.94, y: 2 }}
                transition={{ type: "spring", stiffness: 450, damping: 16 }}
                onClick={() => {
                  playSfx("click");
                  navigateTo("/menu");
                }}
                aria-label="Kembali ke Menu Utama"
                className="flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#F1F5F9] border-b-3 border-[#CBD5E1] text-[#1B4965] font-display font-bold text-xs sm:text-sm shadow-sm active:border-b-0 cursor-pointer"
              >
                <ArrowLeft size={16} className="text-[#1B4965]" />
                <span>Menu</span>
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.92, y: 2 }}
                transition={{ type: "spring", stiffness: 450, damping: 16 }}
                onClick={() => {
                  playSfx("click");
                  navigateTo("/");
                }}
                aria-label="Kembali ke Beranda"
                className="p-0 bg-transparent border-0 outline-none cursor-pointer flex items-center gap-2"
              >
                <img
                  src="/assets/buttons/home.png"
                  alt="Beranda"
                  draggable="false"
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow pointer-events-none select-none"
                  style={{ imageRendering: "-webkit-optimize-contrast" }}
                />
                <span className="font-display font-bold text-sm sm:text-base text-[#1B4965] hidden sm:inline-block tracking-tight hover:opacity-85 transition-opacity">
                  Saka Tika
                </span>
              </motion.button>
            )}
          </div>

          {/* ── Center / Right: Star Vault & Real Controls ─────── */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Interactive Star Vault */}
            <div
              onMouseEnter={() => {
                setStarHovered(true);
                playSfx("hover");
              }}
              onMouseLeave={() => setStarHovered(false)}
              className="relative flex items-center gap-1.5 sm:gap-2 bg-gradient-to-b from-[#FFFBEA] to-[#FEF3C7] border-2 border-[#F59E0B] rounded-full px-3 py-0.5 sm:py-1 shadow-xs cursor-default"
            >
              {/* Pulsing Star Sparkle Ring */}
              <motion.div
                animate={starHovered ? { scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] } : {}}
                transition={{ duration: 0.6 }}
                className="relative flex items-center justify-center"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-[#F59E0B] stroke-[#D97706] stroke-1 drop-shadow-xs" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </motion.div>

              <motion.span
                key={stars}
                initial={{ scale: 1.4 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 450 }}
                className="font-display font-bold text-xs sm:text-sm text-[#92400E] min-w-[1rem] text-center"
              >
                {stars}
              </motion.span>

              {/* Reset Stars Pill Action */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  playSfx("click");
                  setShowResetModal(true);
                }}
                aria-label="Atur Ulang Bintang"
                className="p-0.5 text-[#B45309] hover:text-[#78350F] rounded-full hover:bg-[#FDE68A]/60 transition-colors ml-0.5 cursor-pointer"
                title="Atur Ulang Bintang"
              >
                <RotateCcw size={11} strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* Real Studio Sound Toggle Button Sprite (suara.png) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.92, y: 2 }}
              transition={{ type: "spring", stiffness: 450, damping: 16 }}
              onClick={() => {
                playSfx("click");
                toggleBgm();
              }}
              aria-label={isBgmEnabled ? "Matikan Musik Latar" : "Nyalakan Musik Latar"}
              className={`p-0 bg-transparent border-0 outline-none cursor-pointer transition-opacity ${
                !isBgmEnabled ? "grayscale opacity-50" : ""
              }`}
            >
              <img
                src="/assets/buttons/suara.png"
                alt="Suara"
                draggable="false"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow pointer-events-none select-none"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </motion.button>

            {/* Real Settings Button Sprite (pengaturan.png) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.92, y: 2 }}
              transition={{ type: "spring", stiffness: 450, damping: 16 }}
              onClick={() => {
                playSfx("click");
                setShowResetModal(true);
              }}
              aria-label="Pengaturan / Atur Ulang Bintang"
              className="p-0 bg-transparent border-0 outline-none cursor-pointer"
            >
              <img
                src="/assets/buttons/pengaturan.png"
                alt="Pengaturan"
                draggable="false"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow pointer-events-none select-none"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            </motion.button>

            {/* Desktop Install Action (Arcade Mint-Green Pill) */}
            {!isInstalled && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95, y: 2 }}
                onClick={() => {
                  playSfx("click");
                  triggerInstall();
                }}
                aria-label="Pasang Aplikasi di Desktop"
                className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-b from-[#34D399] to-[#10B981] border-b-[3px] border-[#047857] text-white font-display font-bold text-xs shadow-sm cursor-pointer active:border-b-0 transition-all"
              >
                <MonitorDown size={13} />
                <span>Pasang</span>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <InstallModal isOpen={showManualModal} onClose={() => setShowManualModal(false)} />
      <ConfirmResetModal
        isOpen={showResetModal}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetModal(false)}
      />
    </>
  );
}
