/**
 * RewardModal - Selebrasi 3D setelah huruf berhasil ditulis.
 * Tiga bintang emas bercahaya, badge huruf, dan dua tombol aksi chunky.
 */

import { motion } from 'framer-motion'
import { ChevronRight, RotateCcw, Sparkles, Star } from 'lucide-react'
import { useAudio } from '../../../hooks/useAudio'

export const RewardModal = ({ letter, onClose, onNext }) => {
  const { playSfx } = useAudio()

  const handleClose = () => {
    playSfx('click')
    onClose()
  }

  const handleNext = () => {
    playSfx('click')
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose()
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reward-title"
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: [0, 1.08, 1], opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border-8 border-amber-300 bg-gradient-to-b from-white to-amber-50 p-6 text-center shadow-2xl md:p-8"
      >
        <Sparkles
          size={22}
          strokeWidth={2.6}
          className="absolute left-5 top-5 text-amber-400"
          aria-hidden="true"
        />
        <Sparkles
          size={18}
          strokeWidth={2.6}
          className="absolute right-6 top-8 text-sky-400"
          aria-hidden="true"
        />

        {/* Tiga bintang emas 3D */}
        <div className="mb-4 flex items-end justify-center gap-3">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, rotate: -40, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                delay: 0.2 + index * 0.15,
                type: 'spring',
                damping: 12,
                stiffness: 260,
              }}
            >
              <Star
                size={index === 1 ? 68 : 50}
                strokeWidth={2}
                className="fill-amber-400 text-amber-500 drop-shadow-[0_5px_0_rgba(245,158,11,0.35)]"
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </div>

        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl border-4 border-amber-300 bg-white shadow-inner">
          <span className="text-4xl font-black leading-none text-indigo-950">{letter}</span>
        </div>

        <h2
          id="reward-title"
          className="text-2xl font-black leading-tight text-indigo-950 md:text-3xl"
        >
          Hebat! Kamu Berhasil Menulis Huruf {letter}!
        </h2>
        <p className="mt-2 text-sm font-bold text-slate-600">
          Terus berlatih ya, kamu pintar sekali!
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <motion.button
            type="button"
            whileTap={{ scale: 0.94, y: 2 }}
            onClick={handleClose}
            className="flex items-center justify-center gap-2 rounded-2xl border-4 border-b-8 border-rose-500 bg-rose-300 px-5 py-3 font-black text-rose-950 shadow-lg transition-colors hover:bg-rose-200 active:translate-y-1 active:border-b-0"
          >
            <RotateCcw size={18} strokeWidth={2.8} aria-hidden="true" />
            Coba Lagi
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.94, y: 2 }}
            onClick={handleNext}
            className="flex items-center justify-center gap-2 rounded-2xl border-4 border-b-8 border-amber-500 bg-amber-300 px-5 py-3 font-black text-amber-950 shadow-lg transition-colors hover:bg-amber-200 active:translate-y-1 active:border-b-0"
          >
            Huruf Selanjutnya
            <ChevronRight size={18} strokeWidth={2.8} aria-hidden="true" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
