// src/components/layout/TopControlBar.jsx
// Studio Arcade-grade Game HUD with Real Client Button Sprites (Home, Suara) & Zero Scrollbars.
// Strictly adheres to Tier 1: Top HUD Bar (Height: 10% - 12%, max 64px)
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import { useLocation } from "react-router-dom";
import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function TopControlBar() {
  const location = useLocation();
  const { navigateTo } = useGame();
  const { isBgmEnabled, toggleBgm, playSfx } = useAudio();

  const isHome = location.pathname === "/";
  const isMenu = location.pathname === "/menu";

  return (
    <header className="h-[10%] sm:h-[12%] max-h-[64px] min-h-[48px] relative z-40 flex-shrink-0 px-3 sm:px-6 pt-1 sm:pt-2 pointer-events-auto select-none flex items-center justify-center w-full">
      <div className="bg-white/92 backdrop-blur-md border-b-4 border-slate-300 shadow-lg rounded-full px-3 sm:px-5 py-1.5 mx-auto max-w-5xl w-full flex items-center justify-between gap-2 transition-all">
        {/* Navigation Control */}
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
              className="flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#F1F5F9] border-b-[3px] border-[#CBD5E1] text-[#1B4965] font-display font-bold text-xs sm:text-sm shadow-sm active:border-b-0 cursor-pointer"
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

        {/* Audio Toggle Control */}
        <div className="flex items-center gap-2 sm:gap-3">
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
        </div>
      </div>
    </header>
  );
}
