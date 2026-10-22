/**
 * HomeScreen - Halaman beranda dengan desain super cute, high contrast, dan playful.
 * Dilengkapi maskot Saka & Tika, latar animasi, dan tombol mulai yang memantul.
 * Semua emoji diganti ikon lucide, typografi Fredoka, dan struktur yang terorganisir.
 */

import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Star, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { MascotSakaTika } from '../common/MascotSakaTika'
import { AnimatedBackground } from '../common/AnimatedBackground'
import { CustomButton } from '../common/CustomButton'
import { AudioController } from '../common/AudioController'
import { useAudio } from '../../hooks/useAudio'

export const HomeScreen = ({ onStart }) => {
  const { playSfx, isMuted, toggleMute } = useAudio()

  const handleStart = () => {
    playSfx('click')
    setTimeout(() => {
      playSfx('celebration')
      confetti({
        particleCount: 140,
        spread: 110,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#F472B6', '#34D399', '#60A5FA', '#FDE047'],
      })
    }, 100)
    onStart()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen relative overflow-hidden"
    >
      <AnimatedBackground />

      {/* Floating Header Bar dengan backdrop blur */}
      <div className="fixed top-0 left-0 right-0 z-30 backdrop-blur-md bg-white/80 border-b-4 border-amber-300 p-4 px-6 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Star size={20} strokeWidth={2} className="text-amber-500" />
            <span className="font-black text-slate-900 text-lg tracking-tighter">SAKA TIKA</span>
          </div>
          <div className="flex items-center gap-2">
            <AudioController className="" size="lg" />
          </div>
        </div>
      </div>

      {/* Main Hero Area */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-8 max-w-2xl w-full"
        >
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-2">
            SAKA TIKA:<br />
            <span className="text-amber-600">Mengenal Huruf</span>
          </h1>
          <p className="mt-3 text-lg md:text-xl font-bold text-slate-700 max-w-2xl mx-auto">
            Belajar huruf jadi seru, mudah, dan menyenangkan!
          </p>
        </motion.div>

        <MascotSakaTika speechText="Ayo belajar huruf bersama Saka dan Tika!" speechPosition="bottom" speechDelay={0.5} />

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }}
          className="mt-12 w-full"
        >
          <CustomButton
            onClick={handleStart}
            variant="primary"
            size="xlarge"
            className="rounded-3xl border-4 font-bold flex items-center justify-center gap-2 transition-all duration-200 active:translate-y-2 active:border-b-8 active:border-amber-500 bg-amber-400 text-indigo-950 shadow-[0_10px_0_0_rgba(245,158,11,0.35)] hover:bg-amber-300 hover:shadow-[0_6px_0_0_rgba(245,158,11,0.35)] cursor-pointer"
          >
            <Sparkles size={20} strokeWidth={2} className="text-slate-900" /> Mulai Belajar
          </CustomButton>
          <p className="mt-6 text-sm font-bold text-slate-500">
            Ketik tombol di atas untuk memulai petualangan huruf
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}