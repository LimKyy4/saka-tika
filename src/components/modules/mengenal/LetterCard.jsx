/**
 * LetterCard - Kartu huruf Modul 1 (versi ringkas & rapi).
 *
 * Isi kartu HANYA:
 *  a) Huruf kapital + kecil (besar, tebal, kontras tinggi)
 *  b) Ikon objek di tengah
 *  c) Nama objek singkat (APEL)
 *  d) Tombol "Dengar"
 *
 * Kalimat lengkap ("A untuk Apel") hanya muncul di LetterModal.
 */

import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { useAudio } from '../../../hooks/useAudio'
import { getLetterIcon } from '../../../utils/letterIcons'
import { playLetterAudio } from '../../../utils/textToSpeech'

export const LetterCard = ({ letter, isActive, onSelect }) => {
  const { playSfx } = useAudio()
  const { capital, small, word, iconName } = letter

  /* Static, eksplisit, dan selalu punya fallback (Sparkles) */
  const Icon = getLetterIcon(iconName)

  const handleCardClick = () => {
    playSfx('click')
    playLetterAudio(letter)
    onSelect?.(letter)
  }

  const handleListen = (event) => {
    event.stopPropagation()
    playSfx('click')
    playLetterAudio(letter)
  }

  return (
    <motion.div
      role="button"
      tabIndex={0}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleCardClick()
        }
      }}
      className={`group relative flex h-full cursor-pointer flex-col items-center justify-between gap-3 rounded-3xl border-4 bg-white p-4 text-center transition-colors duration-200 shadow-[0_8px_0_rgba(79,70,229,0.14)] focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 active:translate-y-1 active:shadow-none ${
        isActive
          ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-200'
          : 'border-indigo-100 hover:border-indigo-300'
      }`}
    >
      {/* Huruf kapital & kecil */}
      <div className="flex items-baseline justify-center gap-1 leading-none">
        <span className="text-4xl font-extrabold tracking-tight text-indigo-900">
          {capital}
        </span>
        <span className="text-2xl font-extrabold text-indigo-600">{small}</span>
      </div>

      {/* Ikon objek */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-indigo-100 bg-indigo-50 text-indigo-600 transition-transform duration-200 group-hover:scale-110">
        <Icon size={38} strokeWidth={2.4} aria-hidden="true" />
      </div>

      {/* Nama objek singkat */}
      <p className="text-sm font-bold uppercase tracking-wider text-slate-800">
        {word}
      </p>

      {/* Tombol dengar */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={handleListen}
        className="flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        aria-label={`Dengarkan bunyi huruf ${capital}`}
      >
        <Volume2 size={14} strokeWidth={2.6} aria-hidden="true" />
        Dengar
      </motion.button>
    </motion.div>
  )
}
