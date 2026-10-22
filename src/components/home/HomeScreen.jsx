/**
 * HomeScreen - Halaman beranda dengan desain super cute, high contrast, dan playful.
 * Dilengkapi maskot Saka & Tika, latar animasi, dan tombol mulai yang memantul.
 */

import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Star, Sparkles } from 'lucide-react'
import { MascotSakaTika } from '../common/MascotSakaTika'
import { AnimatedBackground } from '../common/AnimatedBackground'
import { PulseButton } from '../common/CustomButton'
import { AudioController } from '../common/AudioController'
import { useAudio } from '../../hooks/useAudio'

export const HomeScreen = ({ onStart }) => {
  const { playSfx } = useAudio()

  const handleStart = () => {
    playSfx('celebration')
    confetti({
      particleCount: 140,
      spread: 110,
      origin: { y: 0.6 },
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
      className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 relative overflow-hidden"
    >
      <AnimatedBackground />

      <div className="absolute top-6 right-6 z-30">
        <AudioController className="" size="lg" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 border-4 border-white px-4 py-1.5 text-amber-600 font-black text-sm shadow-lg mb-3 animate-pulse">
            <Sparkles size={16} strokeWidth={2.5} />
            Selamat Datang
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 leading-tight mb-2">
            SAKA TIKA:<br />
            <span className="text-amber-600">Mengenal Huruf</span>
          </h1>
          <p className="mt-3 text-lg md:text-xl font-bold text-slate-600 max-w-2xl mx-auto">
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
          <PulseButton onClick={handleStart} className="mx-auto w-full md:w-80">
            <Star size={24} strokeWidth={2.5} className="text-slate-900" />
            Mulai Belajar
          </PulseButton>
          <p className="mt-6 text-sm font-bold text-slate-500">
            Ketik tombol di atas untuk memulai petualangan huruf
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
