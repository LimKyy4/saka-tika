/**
 * HomeScreen - Beranda 1 layar penuh (100vh) tanpa scrollbar.
 * Struktur: header ringkas (flex-none) -> hero tengah (flex-1) -> bukit hijau + tombol (flex-none).
 */

import React from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Play, Sparkles } from 'lucide-react'
import { CuteHeader } from '../common/CuteHeader'
import { MascotSakaTika } from '../common/MascotSakaTika'
import { AnimatedBackground } from '../common/AnimatedBackground'
import { FlyingAnimal } from '../common/FlyingAnimal'
import { useAudio } from '../../hooks/useAudio'

export const HomeScreen = ({ onStart }) => {
  const { playSfx } = useAudio()

  const handleStart = () => {
    playSfx('celebration')
    confetti({
      particleCount: 130,
      spread: 100,
      origin: { y: 0.7 },
      colors: ['#FBBF24', '#F472B6', '#34D399', '#60A5FA', '#FDE047'],
    })
    onStart()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative h-screen w-full overflow-hidden flex flex-col justify-between bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 select-none"
    >
      <AnimatedBackground />
      <FlyingAnimal />

      {/* Bagian atas: header ringkas non-obstructive */}
      <CuteHeader compact logo showBack={false} showHome={false} />

      {/* Bagian tengah: hero */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-1 overflow-hidden">
        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-2xl sm:text-4xl font-black text-indigo-950 text-center tracking-wide drop-shadow-sm leading-tight"
        >
          SAKA TIKA:
          <span className="block text-amber-600">Mengenal Huruf</span>
        </motion.h1>

        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
          className="text-slate-700 font-bold text-xs sm:text-sm text-center mt-0.5 mb-2"
        >
          Belajar huruf jadi seru, mudah, dan menyenangkan!
        </motion.p>

        {/* Balon ucapan komik */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.14, ease: 'easeOut' }}
          className="relative bg-amber-100/90 border-2 sm:border-4 border-amber-300 rounded-2xl px-4 py-1.5 shadow-sm text-center font-bold text-indigo-950 text-xs sm:text-sm max-w-sm sm:max-w-md mx-auto mb-2"
        >
          Ayo belajar huruf bersama Saka dan Tika!
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 bg-amber-100 sm:h-4 sm:w-4 sm:border-b-4 sm:border-r-4 border-amber-300"
          />
        </motion.div>

        {/* Maskot Saka & Tika */}
        <motion.div
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="flex items-end justify-center gap-6 sm:gap-10 h-32 sm:h-40"
        >
          <MascotSakaTika hideNames />
        </motion.div>
      </main>

      {/* Bagian bawah: bukit hijau + tombol utama */}
      <section className="relative z-20 flex-none w-full bg-emerald-200/80 rounded-t-[50px] sm:rounded-t-[80px] pt-3 pb-4 px-4 flex flex-col items-center justify-center shadow-inner border-t-2 border-emerald-300/50">
        <motion.button
          type="button"
          onClick={handleStart}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.28, ease: 'easeOut' }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-amber-400 hover:bg-amber-300 border-b-4 sm:border-b-8 border-amber-500 rounded-2xl sm:rounded-3xl text-indigo-950 font-black text-lg sm:text-xl px-8 sm:px-12 py-2.5 sm:py-3.5 shadow-xl active:translate-y-1.5 active:border-b-0 cursor-pointer flex items-center gap-3 transition-all duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/40"
        >
          <Play size={22} strokeWidth={3} fill="currentColor" aria-hidden="true" />
          Mulai Belajar
        </motion.button>

        <p className="text-[10px] sm:text-xs font-bold text-emerald-900/80 mt-1.5 text-center flex items-center justify-center gap-1.5">
          <Sparkles size={12} strokeWidth={2.5} className="text-amber-600" aria-hidden="true" />
          Ketik/klik tombol di atas untuk memulai petualangan huruf
        </p>
      </section>
    </motion.div>
  )
}