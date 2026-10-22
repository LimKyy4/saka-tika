/**
 * TypingRewardModal - Selebrasi akhir game "Mengetik Huruf".
 * Konfeti, 3 bintang emas 3D, dan tombol Main Lagi / Menu Utama.
 */

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Home, Keyboard, RotateCcw, Star } from 'lucide-react'

const CONFETTI_COLORS = ['#FBBF24', '#FDE047', '#F472B6', '#34D399', '#60A5FA', '#A78BFA']

const starMotion = (index) => ({
  initial: { scale: 0, rotate: -35, opacity: 0 },
  animate: {
    scale: 1,
    rotate: index === 1 ? 0 : index === 0 ? -8 : 8,
    opacity: 1,
    transition: {
      delay: 0.25 + index * 0.18,
      type: 'spring',
      stiffness: 260,
      damping: 14,
    },
  },
})

export const TypingRewardModal = ({
  words = 10,
  total = 10,
  mistakes = 0,
  onReplay,
  onMenu,
}) => {
  useEffect(() => {
    confetti({
      particleCount: 110,
      spread: 85,
      origin: { x: 0.2, y: 0.4 },
      colors: CONFETTI_COLORS,
      zIndex: 60,
    })
    confetti({
      particleCount: 110,
      spread: 85,
      origin: { x: 0.8, y: 0.4 },
      colors: CONFETTI_COLORS,
      zIndex: 60,
    })

    const timer = window.setTimeout(() => {
      confetti({
        particleCount: 160,
        spread: 120,
        origin: { y: 0.6 },
        colors: CONFETTI_COLORS,
        zIndex: 60,
      })
    }, 380)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Selebrasi menyelesaikan game Mengetik Huruf"
    >
      <motion.div
        initial={{ scale: 0.85, y: 32, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border-4 border-amber-300 bg-white p-6 text-center shadow-[0_24px_0_rgba(0,0,0,0.12)] sm:p-8"
      >
        <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-pink-200/50 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-sky-200/50 blur-2xl" />

        <div className="relative">
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 15 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-amber-400 bg-gradient-to-b from-amber-200 to-amber-400 shadow-[0_7px_0_rgba(180,83,9,0.45)]"
          >
            <Keyboard size={38} strokeWidth={2.4} className="text-amber-800" />
          </motion.div>

          <div className="mt-4 flex items-end justify-center gap-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={`typing-star-${index + 1}`}
                {...starMotion(index)}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-200 to-amber-400 shadow-[0_5px_0_rgba(180,83,9,0.45)] ${
                  index === 1 ? '-translate-y-2' : ''
                }`}
              >
                <Star size={32} strokeWidth={2.2} className="fill-white text-white" />
              </motion.div>
            ))}
          </div>

          <h2 className="mt-5 text-2xl font-black leading-tight text-indigo-950 sm:text-3xl">
            Hebat Sekali! Jari-jarimu Makin Pintar Mengetik!
          </h2>

          <p className="mt-2 text-sm font-bold leading-relaxed text-slate-600">
            Kamu berhasil mengetik {words} dari {total} kata
            {mistakes === 0 ? ' tanpa salah!' : ` dengan ${mistakes} percobaan salah.`}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onReplay}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-4 border-amber-500 bg-amber-400 px-4 py-3 text-base font-black text-amber-950 shadow-[0_6px_0_rgba(180,83,9,0.45)] transition-transform hover:brightness-105 active:translate-y-1 active:shadow-none"
            >
              <RotateCcw size={19} strokeWidth={2.8} />
              Main Lagi
            </button>
            <button
              type="button"
              onClick={onMenu}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-4 border-slate-200 bg-white px-4 py-3 text-base font-black text-slate-700 shadow-[0_6px_0_rgba(148,163,184,0.25)] transition-colors hover:bg-slate-50 active:translate-y-1 active:shadow-none"
            >
              <Home size={19} strokeWidth={2.8} />
              Menu Utama
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
