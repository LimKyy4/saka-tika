// src/components/layout/TopControlBar.jsx
// Studio Arcade-grade Game HUD with Floating Corner Controls & Zero Scrollbars.
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
  const isTemukanHuruf = location.pathname === "/temukan-huruf";
  const isMengetikHuruf = location.pathname === "/mengetik-huruf";
  const isMelengkapiKata = location.pathname === "/melengkapi-kata";

  // Dedicated Floating Corner HUD Controls for Home View
  if (isHome) {
    return (
      <header className="fixed top-4 sm:top-5 left-4 sm:left-6 right-4 sm:right-6 flex items-start justify-between pointer-events-none z-40 select-none">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95, y: 1 }}
          transition={{ type: "spring", stiffness: 450, damping: 16 }}
          onClick={() => {
            playSfx("click");
            navigateTo("/");
          }}
          className="pointer-events-auto bg-[#FFFDF9]/95 backdrop-blur-xs border-2 border-white shadow-[0_6px_0_rgba(14,116,144,0.18),0_10px_20px_rgba(0,0,0,0.08)] rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
          aria-label="Saka Tika Beranda"
        >
          <img
            src="/assets/buttons/home.png"
            alt="Beranda"
            width={32}
            height={32}
            draggable="false"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow pointer-events-none"
          />
          <span className="font-display font-black text-sm sm:text-base text-[#1B4965] tracking-tight">
            Saka Tika
          </span>
        </motion.button>

        {/* Audio Toggle Control */}
        <div className="relative pointer-events-auto flex items-center justify-center mt-0.5 sm:mt-1 mr-1 sm:mr-2">
          {isBgmEnabled && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-sky-400 pointer-events-none"
              animate={{ scale: [1, 1.35, 1.45], opacity: [0.75, 0.25, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
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
            className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer select-none transition-all ${
              isBgmEnabled
                ? "bg-gradient-to-b from-sky-400 to-sky-500 border-b-4 border-b-sky-700 shadow-[0_6px_0_rgba(3,105,161,0.38),0_10px_16px_rgba(0,0,0,0.12)]"
                : "bg-gradient-to-b from-amber-400/90 to-amber-500/90 border-b-4 border-b-amber-700 shadow-md"
            }`}
          >
            {isBgmEnabled ? (
              <img
                src="/assets/buttons/suara.png"
                alt="Musik Aktif"
                draggable="false"
                className="w-7 h-7 sm:w-7.5 sm:h-7.5 object-contain drop-shadow pointer-events-none"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
            ) : (
              <div className="relative flex items-center justify-center">
                <img
                  src="/assets/buttons/suara.png"
                  alt="Musik Nonaktif"
                  draggable="false"
                  className="w-7 h-7 sm:w-7.5 sm:h-7.5 object-contain grayscale opacity-60 pointer-events-none"
                  style={{ imageRendering: "-webkit-optimize-contrast" }}
                />
                <span className="absolute w-7 sm:w-8 h-[3px] bg-rose-600 rotate-45 rounded-full shadow-sm" />
              </div>
            )}
          </motion.button>
        </div>
      </header>
    );
  }

  // Floating Corner Controls for All Game Modules and Menu
  let backTarget = "/menu";
  let backLabel = "Menu";
  let arrowColor = "text-[#0284C7]";
  let borderBottomColor = "border-b-sky-200/80";

  if (isMenu) {
    backTarget = "/";
    backLabel = "Beranda";
    arrowColor = "text-[#0284C7]";
    borderBottomColor = "border-b-sky-200/80";
  } else if (isTemukanHuruf) {
    arrowColor = "text-[#DC2626]";
    borderBottomColor = "border-b-red-200/80";
  } else if (isMengetikHuruf) {
    arrowColor = "text-[#DB2777]";
    borderBottomColor = "border-b-pink-200/80";
  } else if (isMelengkapiKata) {
    arrowColor = "text-[#059669]";
    borderBottomColor = "border-b-emerald-200/80";
  }

  return (
    <header className="fixed top-3.5 sm:top-5 left-4 sm:left-6 right-4 sm:right-6 flex items-start justify-between pointer-events-none z-40 select-none">
      <div className="flex items-center gap-3 pointer-events-auto">
        {isMenu && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 1 }}
            transition={{ type: "spring", stiffness: 450, damping: 16 }}
            onClick={() => {
              playSfx("click");
              navigateTo("/");
            }}
            aria-label="Saka Tika Beranda"
            className="bg-[#FFFDF9]/95 backdrop-blur-xs border-2 border-white shadow-[0_6px_0_rgba(76,29,149,0.12),0_10px_20px_rgba(0,0,0,0.08)] rounded-full px-3.5 py-2 sm:px-4 sm:py-2 flex items-center gap-2 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400"
          >
            <img
              src="/assets/buttons/home.png"
              alt="Beranda"
              width={28}
              height={28}
              draggable="false"
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain drop-shadow pointer-events-none"
            />
            <span className="font-display font-black text-sm sm:text-base text-[#1B4965] tracking-tight">
              Saka Tika
            </span>
          </motion.button>
        )}

        <motion.button
          type="button"
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94, y: 2 }}
          transition={{ type: "spring", stiffness: 450, damping: 16 }}
          onClick={() => {
            playSfx("click");
            navigateTo(backTarget);
          }}
          aria-label={`Kembali ke ${backLabel}`}
          className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#FFFDF9]/95 backdrop-blur-xs border-2 border-white border-b-4 ${borderBottomColor} shadow-[0_4px_12px_rgba(14,116,144,0.12)] font-display font-bold text-sm sm:text-base text-slate-800 cursor-pointer active:border-b-2 active:translate-y-1 transition-all select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400`}
        >
          <ArrowLeft size={18} aria-hidden="true" className={`${arrowColor} stroke-[2.8]`} />
          <span>{backLabel}</span>
        </motion.button>
      </div>

      <div className="relative pointer-events-auto flex items-center justify-center mt-0.5 sm:mt-1 mr-1 sm:mr-2">
        {isBgmEnabled && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-sky-400 pointer-events-none"
            animate={{ scale: [1, 1.35, 1.45], opacity: [0.75, 0.25, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
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
          className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer select-none transition-all ${
            isBgmEnabled
              ? "bg-gradient-to-b from-sky-400 to-sky-500 border-b-4 border-b-sky-700 shadow-[0_6px_0_rgba(3,105,161,0.38),0_10px_16px_rgba(0,0,0,0.12)]"
              : "bg-gradient-to-b from-amber-400/90 to-amber-500/90 border-b-4 border-b-amber-700 shadow-md"
          }`}
        >
          {isBgmEnabled ? (
            <img
              src="/assets/buttons/suara.png"
              alt="Musik Aktif"
              draggable="false"
              className="w-7 h-7 sm:w-7.5 sm:h-7.5 object-contain drop-shadow pointer-events-none"
              style={{ imageRendering: "-webkit-optimize-contrast" }}
            />
          ) : (
            <div className="relative flex items-center justify-center">
              <img
                src="/assets/buttons/suara.png"
                alt="Musik Nonaktif"
                draggable="false"
                className="w-7 h-7 sm:w-7.5 sm:h-7.5 object-contain grayscale opacity-60 pointer-events-none"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
              />
              <span className="absolute w-7 sm:w-8 h-[3px] bg-rose-600 rotate-45 rounded-full shadow-sm" />
            </div>
          )}
        </motion.button>
      </div>
    </header>
  );
}
