/**
 * LetterCard - Kartu huruf Modul 1 (Chunky 3D Pastel Toy Card).
 *
 * Isi kartu:
 *  a) Huruf kapital + kecil (font-black, tinggi kontras)
 *  b) Ikon objek besar di lingkaran pastel + floating/bounce halus
 *  c) Nama objek singkat (APEL) di font-black
 *  d) Tombol "Dengar" chunky 3D
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Volume2, Sparkles } from 'lucide-react'
import { useAudio } from '../../../hooks/useAudio'
import { getLetterIcon } from '../../../utils/letterIcons'
import { playLetterAudio } from '../../../utils/textToSpeech'

export const LetterCard = ({ letter, isActive, onSelect }) => {
  const { playSfx } = useAudio()
  const { capital, small, word, bgColor, borderColor, textColor, edgeColor } = letter

  /* Static, eksplisit, dan selalu punya fallback (Sparkles) */
  const Icon = getLetterIcon(letter.iconName)

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
      whileHover={{ y: -6, scale: 1.06 }}
      whileTap={{ y: 6, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleCardClick()
        }
      }}
      className={`group relative flex h-full cursor-pointer flex-col items-center justify-between gap-3 rounded-3xl border-4 border-b-8 p-4 text-center shadow-xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 ${bgColor} ${borderColor} ${edgeColor}`}
      style={isActive ? { borderColor: '#fbbf24', borderBottomColor: '#f59e0b', boxShadow: '0 10px 24px rgba(245,158,11,0.28)' } : undefined}
    >
      {/* Pemicu kilauan bintang saat hover */}
      <Sparkles
        size={16}
        strokeWidth={2.5}
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-3 text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Huruf kapital & kecil */}
      <div className="flex items-baseline justify-center gap-1 leading-none">
        <span className="text-3xl font-black tracking-tight text-indigo-950 sm:text-4xl">
          {capital}
        </span>
        <span className="text-xl font-black text-indigo-800 sm:text-3xl">{small}</span>
      </div>

      {/* Ikon objek dengan floating/bounce halus */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white/70 bg-white/70 shadow-md sm:h-20 sm:w-20"
      >
        <Icon size={38} strokeWidth={2.4} className={letter.textColor} aria-hidden="true" />
      </motion.div>

      {/* Nama objek */}
      <p className="text-sm font-black uppercase tracking-wide text-slate-800 sm:text-base">{word}</p>

      {/* Tombol akses cepat chunky "Dengar" */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={handleListen}
        className="flex items-center gap-1 rounded-xl border-b-4 border-amber-500 bg-amber-400 px-3 py-1.5 font-black text-xs text-indigo-950 shadow-md transition-colors duration-200 hover:bg-amber-300 mx-auto mt-2"
        aria-label={`Dengarkan bunyi huruf ${capital}`}
      >
        <Volume2 size={14} strokeWidth={2.6} aria-hidden="true" />
        Dengar
      </motion.button>
    </motion.div>
  )
}
