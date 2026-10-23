/**
 * LetterModal - Pop-up detail huruf Modul 1 (Ceria, besar, 3D Audio Buttons).
 */

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Volume2, X } from 'lucide-react'
import {
  playLetterAudio,
  speakSentence,
  stopLetterAudio,
  stopSpeech,
} from '../../../utils/textToSpeech'
import { getLetterIcon } from '../../../utils/letterIcons'
import { useAudio } from '../../../hooks/useAudio'

export const LetterModal = ({ letter, onClose, onNext, onPrev }) => {
  const { capital, small, word, sentence, iconName, bgColor, borderColor, textColor } = letter
  const { playSfx } = useAudio()

  /* Static + fallback aman, tidak ada dynamic import */
  const Icon = getLetterIcon(iconName)

  const handleClose = () => {
    playSfx('click')
    stopSpeech()
    stopLetterAudio()
    onClose()
  }

  const handleNext = () => {
    playSfx('click')
    stopSpeech()
    stopLetterAudio()
    onNext()
  }

  const handlePrev = () => {
    playSfx('click')
    stopSpeech()
    stopLetterAudio()
    onPrev()
  }

  /* Tutup dengan Escape + bersihkan audio saat modal dilepas */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      stopSpeech()
      stopLetterAudio()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose()
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: [0.8, 1.05, 1], opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-50 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border-4 border-amber-200 bg-amber-50 shadow-2xl"
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-xl border-2 border-rose-200 bg-rose-50 p-2 text-rose-600 transition-colors hover:bg-rose-100"
          aria-label="Tutup detail huruf"
        >
          <X size={20} strokeWidth={2.5} />
        </motion.button>

        <div className="p-6 pt-10 text-center md:p-10 md:pt-12">
          {/* Header Huruf: kapital + kecil, font-black tebal */}
          <div className="mb-4 flex items-baseline justify-center gap-2 leading-none">
            <span className="text-6xl font-black tracking-tighter text-indigo-950">
              {capital}
            </span>
            <span className="text-4xl font-black text-indigo-800">{small}</span>
          </div>

          {/* Kartu Ilustrasi Utama: ikon objek di lingkaran pastel besar */}
          <div
            className={`mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-3xl border-4 shadow-md ${bgColor} ${borderColor}`}
          >
            <Icon size={64} strokeWidth={2.4} className={textColor} aria-hidden="true" />
          </div>

          {/* Teks kalimat utama */}
          <h2 className="mb-1 text-2xl font-black text-indigo-950 text-center my-3">
            {capital} untuk {word}
          </h2>
          <p className="mb-8 text-base font-bold text-slate-700 text-center">{sentence}</p>

          {/* Tombol audio 3D interaktif */}
          <div className="mb-8 flex flex-col justify-center gap-3 sm:flex-row">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                playSfx('click')
                playLetterAudio(letter)
              }}
              className="flex items-center justify-center gap-2 rounded-2xl border-b-4 border-sky-500 bg-sky-400 px-5 py-3 font-black text-indigo-950 shadow-md transition-colors hover:bg-sky-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/50"
            >
              <Volume2 size={20} strokeWidth={2.5} />
              Bunyi Huruf
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                playSfx('click')
                speakSentence(sentence)
              }}
              className="flex items-center justify-center gap-2 rounded-2xl border-b-4 border-amber-500 bg-amber-400 px-5 py-3 font-black text-indigo-950 shadow-md transition-colors hover:bg-amber-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/50"
            >
              <Volume2 size={20} strokeWidth={2.5} />
              Dengar Kalimat
            </motion.button>
          </div>

          {/* Navigasi huruf */}
          <div className="flex items-center justify-between">
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="rounded-2xl border-4 border-slate-200 bg-slate-50 p-3 text-slate-700 shadow-[0_4px_0_rgba(0,0,0,0.06)] transition-colors hover:bg-slate-100"
              aria-label="Huruf sebelumnya"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </motion.button>

            <span className="text-sm font-black uppercase tracking-wider text-slate-500">
              {capital} / {small}
            </span>

            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="rounded-2xl border-4 border-slate-200 bg-slate-50 p-3 text-slate-700 shadow-[0_4px_0_rgba(0,0,0,0.06)] transition-colors hover:bg-slate-100"
              aria-label="Huruf berikutnya"
            >
              <ChevronRight size={24} strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
