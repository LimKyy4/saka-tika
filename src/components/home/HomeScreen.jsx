/**
 * HomeScreen - Beranda simetris dengan alur vertikal yang rapi:
 * header sticky -> judul -> subjudul -> balon ucapan -> maskot -> tombol 3D -> petunjuk.
 * Balon ucapan berada di tengah (max-w-md w-full) agar tidak pernah tertekan.
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
      className="relative flex min-h-screen flex-col overflow-x-hidden"
    >
      <AnimatedBackground />

      {/* Header non-obstructive (sticky, z-50) */}
      <CuteHeader logo showBack={false} showHome={false} />

      <FlyingAnimal />

      {/* Hero section */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-8 pt-20 text-center sm:px-6">
        {/* Judul */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-2xl"
        >
          <h1 className="text-3xl font-black leading-tight text-indigo-950 sm:text-5xl lg:text-6xl">
            SAKA TIKA:
            <br />
            <span className="text-amber-600">Mengenal Huruf</span>
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-700 sm:text-lg">
            Belajar huruf jadi seru, mudah, dan menyenangkan!
          </p>
        </motion.div>

        {/* Balon ucapan tunggal, di tengah, tidak bisa tertekan */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
          className="relative my-4 w-full max-w-md rounded-2xl border-4 border-amber-300 bg-amber-100 p-4 text-center shadow-md"
        >
          <p className="text-sm font-bold leading-relaxed text-indigo-950 sm:text-base">
            Ayo belajar huruf bersama Saka dan Tika!
          </p>
          <span
            aria-hidden="true"
            className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-4 border-r-4 border-amber-300 bg-amber-100"
          />
        </motion.div>

        {/* Maskot berdampingan, simetris, tanpa hover */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
          className="my-4 flex w-full max-w-md justify-center"
        >
          <MascotSakaTika />
        </motion.div>

        {/* Tombol chunky 3D, tepat di tengah */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
          className="my-6 flex w-full justify-center"
        >
          <motion.button
            type="button"
            onClick={handleStart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-3 rounded-3xl border-b-8 border-amber-500 bg-amber-400 px-8 py-4 text-lg font-black text-indigo-950 shadow-xl transition-colors duration-150 hover:bg-amber-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/40 active:translate-y-2 active:border-b-0 sm:px-10 sm:text-xl"
          >
            <Play size={22} strokeWidth={3} className="text-indigo-950" fill="currentColor" />
            Mulai Belajar
          </motion.button>
        </motion.div>

        <p className="flex items-center gap-1.5 text-center text-xs font-bold text-slate-500">
          <Sparkles size={13} strokeWidth={2.5} className="text-amber-500" />
          Ketik/klik tombol di atas untuk memulai petualangan huruf
        </p>
      </main>
    </motion.div>
  )
}
