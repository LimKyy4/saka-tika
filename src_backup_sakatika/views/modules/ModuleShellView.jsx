// src/views/modules/ModuleShellView.jsx
// Placeholder shell for Modules 2-5 (to be built in Phases 3-4).
// Strictly fits inside 100vw x 100vh — no scrollbars.
import React from "react";
import { useParams } from "react-router-dom";
import { useGame } from "../../context/GameContext.jsx";
import { useAudio } from "../../context/AudioContext.jsx";
import TactileButton from "../../components/ui/TactileButton.jsx";
import confetti from "canvas-confetti";
import { ArrowLeft, Sparkles, BookOpen, Puzzle, Search, PenTool, Keyboard } from "lucide-react";
import { motion } from "framer-motion";

const MODULE_META = {
  "melengkapi-kata": {
    title: "Melengkapi Kata",
    desc: "Tebak dan lengkapi huruf yang hilang untuk menyusun kata buah atau benda!",
    color: "#78B894", borderColor: "#5E9E7A", textColor: "text-white",
    Icon: Puzzle,
  },
  "temukan-huruf": {
    title: "Temukan Huruf",
    desc: "Cari huruf yang bersembunyi di antara benda-benda seru di layar!",
    color: "#F26B6B", borderColor: "#D95353", textColor: "text-white",
    Icon: Search,
  },
  "menulis-huruf": {
    title: "Menulis Huruf",
    desc: "Tebalkan garis putus-putus dan belajar membentuk huruf dengan rapi!",
    color: "#FCE277", borderColor: "#E3C654", textColor: "text-[#1B4965]",
    Icon: PenTool,
  },
  "mengetik-huruf": {
    title: "Mengetik Huruf",
    desc: "Tekan huruf pada keyboard fisik atau virtual untuk melatih refleks jari!",
    color: "#F7A8A8", borderColor: "#DE8B8B", textColor: "text-white",
    Icon: Keyboard,
  },
};

const FALLBACK_META = {
  title: "Modul",
  desc: "Segera hadir di pembaruan berikutnya!",
  color: "#64A6E8", borderColor: "#4A8FD6", textColor: "text-white",
  Icon: BookOpen,
};

export default function ModuleShellView() {
  const { moduleSlug } = useParams();
  const { navigateTo, addStars } = useGame();
  const { playSfx } = useAudio();

  const meta = MODULE_META[moduleSlug] || FALLBACK_META;
  const ModuleIcon = meta.Icon;

  const handleRewardTest = () => {
    playSfx("fanfare");
    confetti({
      particleCount: 60,
      spread: 65,
      origin: { y: 0.65 },
      colors: ["#F48B94", "#F9D968", "#95D5B2", "#8FB8ED"],
    });
    addStars(1);
  };

  return (
    <main className="flex-1 overflow-hidden flex flex-col items-center justify-center px-4 py-2">
      {/* Tablet frame */}
      <div className="w-full max-w-xl bg-zinc-900 rounded-[2.2rem] p-2.5 sm:p-3.5 shadow-2xl border-4 border-zinc-800 flex flex-col max-h-[520px] h-full">
        <div className="w-2.5 h-2.5 bg-zinc-700 rounded-full mx-auto mb-2 flex-shrink-0" />

        <div className="flex-1 overflow-hidden bg-[#FDF6EC] rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-between border border-stone-200 relative">
          <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#F9D949]/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#A8D5BA]/30 rounded-full blur-xl pointer-events-none" />

          {/* Top bar */}
          <div className="w-full flex items-center justify-between z-10 flex-shrink-0">
            <TactileButton variant="secondary" size="sm" onClick={() => navigateTo("/menu")} ariaLabel="Kembali ke Menu">
              <ArrowLeft size={16} />
              <span>Menu</span>
            </TactileButton>
            <span
              className={`font-display font-semibold text-xs px-3 py-1 rounded-full shadow-sm ${meta.textColor}`}
              style={{ backgroundColor: meta.color }}
            >
              {meta.title}
            </span>
          </div>

          {/* Center content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center z-10 gap-4"
          >
            <div
              className="w-20 h-20 rounded-3xl border-b-4 flex items-center justify-center shadow-lg"
              style={{ backgroundColor: meta.color, borderColor: meta.borderColor }}
            >
              <ModuleIcon size={40} className={meta.textColor} />
            </div>

            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#1B4965] mb-1">
                {meta.title}
              </h2>
              <p className="font-sans text-sm text-[#1B4965]/70 max-w-xs">
                {meta.desc}
              </p>
            </div>

            <TactileButton variant="primary" size="md" onClick={handleRewardTest} ariaLabel="Uji Coba Hadiah Bintang" className="shadow-md">
              <Sparkles size={18} />
              <span>Uji Hadiah (+1 Bintang)</span>
            </TactileButton>
          </motion.div>

          <div className="w-16 h-1 bg-stone-300 rounded-full mx-auto z-10 flex-shrink-0" />
        </div>
      </div>
    </main>
  );
}
