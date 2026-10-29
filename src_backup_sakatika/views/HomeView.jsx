// src/views/HomeView.jsx
// Studio-grade welcome screen with ambient animals, redesigned cute mascots, and rolling hills.
// Strictly fits inside 100vw x 100vh — zero page scrolling.
// ZERO EMOJIS anywhere in this file.

import React from "react";
import { useGame } from "../context/GameContext.jsx";
import { useAudio } from "../context/AudioContext.jsx";
import { usePWAInstall } from "../hooks/usePWAInstall.js";
import TactileButton from "../components/ui/TactileButton.jsx";
import SakaMascot from "../components/illustrations/SakaMascot.jsx";
import TikaMascot from "../components/illustrations/TikaMascot.jsx";
import SmilingSun from "../components/illustrations/SmilingSun.jsx";
import LetterBlocks from "../components/illustrations/LetterBlocks.jsx";
import AmbientDecor from "../components/illustrations/AmbientDecor.jsx";
import { Play, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function HomeView() {
  const { navigateTo } = useGame();
  const { playSfx } = useAudio();
  const { triggerInstall, isInstalled } = usePWAInstall();

  const handleStart = () => {
    playSfx("fanfare");
    navigateTo("/menu");
  };

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
    <main className="flex-1 overflow-hidden relative flex flex-col justify-between select-none">
      {/* Ambient Animated Decor (Clouds, Butterflies, Birds) */}
      <AmbientDecor />

      {/* Smiling Pastel Sun in Top Right */}
      <div className="absolute top-2 right-6 sm:right-12 z-10 pointer-events-none">
        <SmilingSun />
      </div>

      {/* Hero Content Grid */}
      <div className="relative z-10 flex-1 overflow-hidden flex flex-col lg:flex-row items-center justify-center px-6 sm:px-12 gap-6 sm:gap-10 py-2">
        {/* Left Section: Titles & CTA */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-sm sm:max-w-md">
          {/* Multi-colored Title Letters */}
          <div className="flex items-center flex-wrap justify-center lg:justify-start gap-1 mb-1">
            {titleLetters.map((item, idx) => (
              <span
                key={idx}
                style={{ color: item.color }}
                className="font-display font-bold text-3xl sm:text-4xl md:text-5xl drop-shadow-sm select-none"
              >
                {item.char}
              </span>
            ))}
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-[#1B4965] mb-2 leading-tight">
            Mengenal Huruf
          </h1>

          <p className="font-sans font-semibold text-sm sm:text-base text-[#1B4965]/80 mb-6 max-w-xs sm:max-w-sm">
            Belajar huruf jadi seru, mudah, dan menyenangkan bersama Saka dan Tika!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <TactileButton
              variant="primary"
              size="lg"
              onClick={handleStart}
              ariaLabel="Mulai Belajar"
              className="w-full sm:w-auto shadow-md"
            >
              <Play size={20} className="fill-current" />
              <span>Mulai Belajar</span>
            </TactileButton>

            {!isInstalled && (
              <TactileButton
                variant="secondary"
                size="lg"
                onClick={triggerInstall}
                ariaLabel="Pasang Aplikasi Desktop"
                className="w-full sm:w-auto shadow-sm"
              >
                <Download size={18} />
                <span>Pasang Aplikasi</span>
              </TactileButton>
            )}
          </div>
        </div>

        {/* Right Section: Mascots & Letter Blocks */}
        <div className="flex flex-col items-center justify-end flex-shrink-0 z-10">
          <div className="flex items-end justify-center gap-2 sm:gap-6 relative">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <SakaMascot isWaving={true} />
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            >
              <TikaMascot isCheering={true} />
            </motion.div>
          </div>

          {/* Letter Blocks (A, B, C) */}
          <div className="mt-2">
            <LetterBlocks />
          </div>
        </div>
      </div>

      {/* Layered Rolling Hills at Bottom with vector flowers */}
      <div className="relative w-full h-20 sm:h-28 pointer-events-none mt-auto flex-shrink-0">
        {/* Secondary Hill (Pastel Yellow) */}
        <svg
          className="absolute bottom-0 left-0 w-full h-full text-[#F9E58B]"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,100 C320,40 500,150 900,70 C1200,20 1350,110 1440,80 L1440,180 L0,180 Z"
          />
        </svg>

        {/* Foreground Hill (Pastel Sage Green) */}
        <svg
          className="absolute bottom-0 left-0 w-full h-full text-[#C5E5A5]"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,120 C240,80 480,150 760,100 C1040,60 1280,130 1440,100 L1440,180 L0,180 Z"
          />
        </svg>

        {/* Little Meadow Flowers */}
        <div className="absolute bottom-3 left-16 flex items-center gap-4 opacity-75">
          <svg width="18" height="18" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="4" fill="#F9D968" />
            <circle cx="10" cy="5" r="3" fill="#F48B94" />
            <circle cx="10" cy="15" r="3" fill="#F48B94" />
            <circle cx="5" cy="10" r="3" fill="#F48B94" />
            <circle cx="15" cy="10" r="3" fill="#F48B94" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="4" fill="#F9D968" />
            <circle cx="10" cy="5" r="3" fill="#8FB8ED" />
            <circle cx="10" cy="15" r="3" fill="#8FB8ED" />
            <circle cx="5" cy="10" r="3" fill="#8FB8ED" />
            <circle cx="15" cy="10" r="3" fill="#8FB8ED" />
          </svg>
        </div>
        <div className="absolute bottom-4 right-20 flex items-center gap-3 opacity-75 hidden sm:flex">
          <svg width="16" height="16" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="4" fill="#F9D968" />
            <circle cx="10" cy="5" r="3" fill="#F48B94" />
            <circle cx="10" cy="15" r="3" fill="#F48B94" />
            <circle cx="5" cy="10" r="3" fill="#F48B94" />
            <circle cx="15" cy="10" r="3" fill="#F48B94" />
          </svg>
        </div>
      </div>
    </main>
  );
}
