/**
 * QuestionBanner - Papan petunjuk ringkas Saka & Tika untuk Modul 3.
 * Kiri: maskot + kalimat soal. Tengah: badge huruf target 3D.
 * Kanan: tombol "Dengar Soal" (TTS bahasa Indonesia).
 */

import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { MascotSakaTika } from '../../common/MascotSakaTika'

const badgePulse = {
  scale: [1, 1.08, 1],
  transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
}

export const QuestionBanner = ({
  targetLetter,
  questionText,
  hintText,
  onPlayAudio,
}) => {
  return (
    <motion.section
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="z-20 mx-auto flex w-full max-w-2xl items-center justify-between gap-2 rounded-3xl border-4 border-amber-300 bg-amber-100/90 px-3 py-2 shadow-[0_8px_0_rgba(245,158,11,0.22)]"
      aria-label="Petunjuk soal"
    >
      {/* Maskot + kalimat soal */}
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <div className="w-[150px] shrink-0 overflow-hidden">
          <MascotSakaTika compact />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-black leading-snug text-amber-950 sm:text-sm">
            {questionText}
          </p>
          <p className="mt-0.5 truncate text-[10px] font-bold leading-snug text-amber-800 sm:text-xs">
            {hintText}
          </p>
        </div>
      </div>

      {/* Badge huruf target 3D */}
      <motion.div
        animate={badgePulse}
        data-target-letter={targetLetter}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-b-4 border-amber-600 bg-amber-400 shadow-md"
        aria-label={`Huruf target ${targetLetter}`}
      >
        <span className="text-3xl font-black leading-none text-indigo-950">
          {targetLetter}
        </span>
      </motion.div>

      {/* Tombol dengar soal */}
      <button
        type="button"
        onClick={onPlayAudio}
        aria-label={`Dengarkan soal huruf ${targetLetter}`}
        title="Dengar Soal"
        className="flex shrink-0 items-center gap-2 rounded-2xl border-b-4 border-sky-500 bg-sky-400 px-3 py-2 text-xs font-black text-indigo-950 shadow-md transition-colors duration-150 hover:bg-sky-300 active:translate-y-1 active:border-b-0 sm:px-4 sm:text-sm"
      >
        <Volume2 size={18} strokeWidth={2.8} aria-hidden="true" />
        <span className="hidden sm:inline">Dengar Soal</span>
      </button>
    </motion.section>
  )
}
