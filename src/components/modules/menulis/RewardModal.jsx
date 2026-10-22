/**
 * RewardModal - Selebrasi setelah huruf selesai ditulis.
 * 3 bintang emas 3D dengan stagger, teks pujian besar, 2 tombol aksi.
 */

import { motion } from 'framer-motion'
import { ChevronRight, RotateCcw, Star } from 'lucide-react'
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
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.1, 1], opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md overflow-hidden rounded-3xl border-4 border-amber-300 bg-white p-6 text-center shadow-2xl md:p-8"
      >
        {/* 3 bintang emas */}
        <div className="mb-5 flex items-end justify-center gap-3">
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
                size={index === 1 ? 64 : 48}
                strokeWidth={2}
                className="fill-amber-400 text-amber-500 drop-shadow-[0_4px_0_rgba(245,158,11,0.35)]"
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </div>

        <h2
          id="reward-title"
          className="text-2xl font-black leading-tight text-amber-900 md:text-3xl"
        >
          Hebat! Kamu Berhasil Menulis Huruf {letter}!
        </h2>
        <p className="mt-2 text-sm font-bold text-slate-700">
          Terus berlatih ya, kamu pintar sekali!
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={handleClose}
            className="flex items-center justify-center gap-2 rounded-2xl border-4 border-rose-200 bg-rose-50 px-5 py-3 font-bold text-rose-700 shadow-[0_6px_0_rgba(244,63,94,0.2)] transition-colors hover:bg-rose-100 active:translate-y-1 active:shadow-none"
          >
            <RotateCcw size={18} strokeWidth={2.5} />
            Coba Lagi
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={handleNext}
            className="flex items-center justify-center gap-2 rounded-2xl border-4 border-amber-200 bg-amber-100 px-5 py-3 font-bold text-amber-900 shadow-[0_6px_0_rgba(245,158,11,0.2)] transition-colors hover:bg-amber-200 active:translate-y-1 active:shadow-none"
          >
            Huruf Selanjutnya
            <ChevronRight size={18} strokeWidth={2.5} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
