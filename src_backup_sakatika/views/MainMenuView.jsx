// src/views/MainMenuView.jsx
// Studio-grade tablet dashboard with tactile 3D module cards, lively cheering mascots & ambient decor.
// Strictly fits inside 100vw x 100vh — zero page scrolling.
// ZERO EMOJIS anywhere in this file.

import React from "react";
import { useGame } from "../context/GameContext.jsx";
import { useAudio } from "../context/AudioContext.jsx";
import TactileButton from "../components/ui/TactileButton.jsx";
import SakaMascot from "../components/illustrations/SakaMascot.jsx";
import TikaMascot from "../components/illustrations/TikaMascot.jsx";
import AmbientDecor from "../components/illustrations/AmbientDecor.jsx";
import { ArrowLeft, BookOpen, Puzzle, Search, PenTool, Keyboard } from "lucide-react";
import { motion } from "framer-motion";

export default function MainMenuView() {
  const { navigateTo } = useGame();
  const { playSfx } = useAudio();

  const titleLetters = [
    { char: "S", color: "#F48B94" },
    { char: "A", color: "#F9D968" },
    { char: "K", color: "#95D5B2" },
    { char: "A", color: "#F4978E" },
    { char: " ", color: "transparent" },
    { char: "T", color: "#8FB8ED" },
    { char: "I", color: "#F48B94" },
    { char: "K", color: "#F4978E" },
    { char: "A", color: "#F9D968" },
    { char: ":", color: "#F4978E" },
  ];

  return (
    <main className="relative flex-1 overflow-hidden flex px-3 sm:px-6 pb-2 gap-4 items-center justify-center select-none">
      {/* Background Ambience */}
      <AmbientDecor />

      {/* ── Left Panel: Navigation & Mascots ─────────────────── */}
      <section className="relative z-10 flex-shrink-0 w-48 sm:w-60 flex flex-col gap-2.5 h-full justify-between py-2">
        <div className="flex flex-col gap-2">
          <TactileButton
            variant="secondary"
            size="sm"
            onClick={() => navigateTo("/")}
            ariaLabel="Kembali ke Beranda"
            className="self-start"
          >
            <ArrowLeft size={16} />
            <span>Beranda</span>
          </TactileButton>

          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1B4965] leading-tight">
              Menu Utama
            </h1>
            <p className="font-sans font-medium text-xs sm:text-sm text-[#1B4965]/75 mt-1">
              Pilih menu favoritmu untuk belajar mengenal huruf!
            </p>
          </div>

          {/* Interactive Speech Bubble */}
          <div className="bg-white/90 border-2 border-[#1B4965]/15 rounded-2xl p-2.5 shadow-sm relative max-w-xs">
            <span className="font-sans font-semibold text-xs text-[#1B4965] leading-snug block">
              Ayo kumpulkan bintang di setiap permainan seru!
            </span>
            <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white border-r-2 border-b-2 border-[#1B4965]/15 rotate-45" />
          </div>
        </div>

        {/* Mascots side-by-side */}
        <div className="flex items-end justify-center gap-1 scale-80 sm:scale-95 origin-bottom mt-auto">
          <SakaMascot isWaving={true} />
          <TikaMascot isCheering={true} />
        </div>
      </section>

      {/* ── Right Panel: Landscape Tablet Frame ──────────────── */}
      <section className="relative z-10 flex-1 overflow-hidden flex items-center justify-center h-full py-1">
        <div className="h-full max-h-[520px] w-full max-w-xl bg-zinc-900 rounded-[2.2rem] p-2.5 sm:p-3.5 shadow-2xl border-4 border-zinc-800 flex flex-col">
          {/* Camera Dot */}
          <div className="w-2.5 h-2.5 bg-zinc-700 rounded-full mx-auto mb-2 flex-shrink-0" />

          {/* Tablet Screen Interior */}
          <div className="flex-1 overflow-hidden bg-[#FDF6EC] rounded-2xl p-3 sm:p-4 flex flex-col justify-between relative border border-stone-200">
            {/* Corner Accents */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#F9D949]/20 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#A8D5BA]/30 rounded-full blur-xl pointer-events-none" />

            {/* Screen Header inside tablet */}
            <div className="flex items-center justify-center gap-1 flex-wrap mb-2.5 z-10 flex-shrink-0">
              <div className="flex items-center gap-0.5">
                {titleLetters.map((item, idx) => (
                  <span
                    key={idx}
                    style={{ color: item.color }}
                    className="font-display font-bold text-base sm:text-lg drop-shadow-xs"
                  >
                    {item.char}
                  </span>
                ))}
              </div>
              <h2 className="font-display font-bold text-base sm:text-lg text-[#1B4965] ml-1">
                Mengenal Huruf
              </h2>
            </div>

            {/* 5 Interactive Module Cards (2 - 1 - 2 layout) */}
            <div className="flex-1 overflow-hidden grid grid-cols-2 gap-2 sm:gap-3 z-10 content-start">
              {/* 1. Mengenal Huruf */}
              <ModuleCard
                onClick={() => {
                  playSfx("click");
                  navigateTo("/mengenal-huruf");
                }}
                onHover={() => playSfx("hover")}
                bg="#64A6E8"
                border="#4A8FD6"
                textClass="text-white"
                Icon={BookOpen}
                title="Mengenal Huruf"
                sub="Belajar huruf A-Z"
              />

              {/* 2. Melengkapi Kata */}
              <ModuleCard
                onClick={() => {
                  playSfx("click");
                  navigateTo("/melengkapi-kata");
                }}
                onHover={() => playSfx("hover")}
                bg="#78B894"
                border="#5E9E7A"
                textClass="text-white"
                Icon={Puzzle}
                title="Melengkapi Kata"
                sub="Tebak huruf hilang"
              />

              {/* 3. Temukan Huruf (Center Spanning) */}
              <div
                className="col-span-2 cursor-pointer"
                onClick={() => {
                  playSfx("click");
                  navigateTo("/temukan-huruf");
                }}
                onMouseEnter={() => playSfx("hover")}
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98, y: 2 }}
                  className="bg-[#F26B6B] border-b-4 border-[#D95353] rounded-2xl p-2.5 sm:p-3 text-white shadow-md flex items-center gap-3 transition-colors hover:shadow-lg"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Search size={22} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm">Temukan Huruf</h3>
                    <span className="font-sans text-[10px] sm:text-xs opacity-90">
                      Cari huruf yang tersembunyi
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* 4. Menulis Huruf */}
              <ModuleCard
                onClick={() => {
                  playSfx("click");
                  navigateTo("/menulis-huruf");
                }}
                onHover={() => playSfx("hover")}
                bg="#FCE277"
                border="#E3C654"
                textClass="text-[#1B4965]"
                Icon={PenTool}
                title="Menulis Huruf"
                sub="Tebalkan garis huruf"
                iconBg="bg-[#1B4965]/10"
              />

              {/* 5. Mengetik */}
              <ModuleCard
                onClick={() => {
                  playSfx("click");
                  navigateTo("/mengetik-huruf");
                }}
                onHover={() => playSfx("hover")}
                bg="#F7A8A8"
                border="#DE8B8B"
                textClass="text-white"
                Icon={Keyboard}
                title="Mengetik"
                sub="Latihan ketik huruf"
              />
            </div>

            {/* Tablet Home Bar Indicator */}
            <div className="w-16 h-1 bg-stone-300 rounded-full mx-auto mt-2 flex-shrink-0" />
          </div>
        </div>
      </section>
    </main>
  );
}

function ModuleCard({
  onClick,
  onHover,
  bg,
  border,
  textClass,
  Icon,
  title,
  sub,
  iconBg = "bg-white/20",
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97, y: 2 }}
      onClick={onClick}
      onMouseEnter={onHover}
      className={`${textClass} rounded-2xl p-2.5 sm:p-3 shadow-md cursor-pointer flex flex-col items-center justify-center text-center group border-b-4 transition-all hover:shadow-lg select-none`}
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 ${iconBg} rounded-xl flex items-center justify-center mb-1 group-hover:rotate-6 transition-transform`}
      >
        <Icon size={20} />
      </div>
      <h3 className="font-display font-bold text-xs sm:text-sm leading-tight">{title}</h3>
      <span className="font-sans text-[10px] opacity-90">{sub}</span>
    </motion.div>
  );
}
