/**
 * ClueCard3D - Kartu petunjuk ringkas Modul 4.
 *
 * Kiri   : badge kategori + teks petunjuk.
 * Tengah : bingkai ikon objek pastel yang memantul lembut.
 * Kanan  : tombol "Dengar Kata" (TTS Bahasa Indonesia).
 */

import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { getLetterIcon } from '../../../utils/letterIcons'

const CATEGORY_STYLES = {
  HEWAN: 'border-sky-400 bg-sky-200 text-sky-900',
  BUAH: 'border-rose-400 bg-rose-200 text-rose-900',
  MAINAN: 'border-violet-400 bg-violet-200 text-violet-900',
  BENDA: 'border-amber-400 bg-amber-200 text-amber-900',
  MAKANAN: 'border-orange-400 bg-orange-200 text-orange-900',
}

const FALLBACK_CATEGORY = 'border-slate-400 bg-slate-200 text-slate-800'

export const ClueCard3D = ({ word, category, hintText, iconName, onPlayAudio }) => {
  const Icon = getLetterIcon(iconName)
  const badgeClass = CATEGORY_STYLES[category] || FALLBACK_CATEGORY

  return (
    <motion.section
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="z-20 mx-auto flex w-full max-w-lg items-center justify-between gap-3 rounded-3xl border-4 border-amber-300 bg-amber-100/90 px-3 py-1 shadow-md sm:px-4"
      aria-label={`Petunjuk kata ${word}`}
    >
      {/* Kategori + petunjuk */}
      <div className="min-w-0 flex-1">
        <span
          className={`inline-flex items-center rounded-full border-2 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.14em] ${badgeClass}`}
        >
          {category || 'KATA'}
        </span>
        <p className="mt-1 line-clamp-2 text-[11px] font-bold leading-snug text-amber-950 sm:text-xs">
          {hintText}
        </p>
      </div>

      {/* Ikon objek */}
      <div
        className="flex h-12 w-12 shrink-0 animate-bounce items-center justify-center rounded-2xl border-b-4 border-emerald-500 bg-emerald-300 shadow-md"
        aria-hidden="true"
      >
        <Icon size={28} strokeWidth={2.4} className="text-emerald-950" />
      </div>

      {/* Dengar kata */}
      <button
        type="button"
        onClick={onPlayAudio}
        aria-label={`Dengarkan kata ${word}`}
        title="Dengar Kata"
        className="flex shrink-0 items-center gap-1.5 rounded-2xl border-b-4 border-sky-500 bg-sky-400 px-3 py-2 text-[11px] font-black text-indigo-950 shadow-md transition-colors duration-150 hover:bg-sky-300 active:translate-y-1 active:border-b-0 sm:px-4 sm:text-xs"
      >
        <Volume2 size={17} strokeWidth={2.8} aria-hidden="true" />
        <span>Dengar Kata</span>
      </button>
    </motion.section>
  )
}
