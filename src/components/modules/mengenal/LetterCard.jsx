/**
 * LetterCard - Kartu huruf chunky 3D pastel cerah untuk Modul 1.
 * Konten ringkas: "A a" -> badge ikon objek -> nama objek -> tombol Dengar.
 * Kartu melayang halus, terangkat saat hover, dan tertekan saat klik.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Volume2, Sparkles } from 'lucide-react'
import { useAudio } from '../../../hooks/useAudio'
import { getLetterIcon } from '../../../utils/letterIcons'
import { playLetterAudio } from '../../../utils/textToSpeech'

export const LetterCard = ({ letter, isActive, onSelect, index = 0 }) => {
  const { playSfx } = useAudio()
  const { capital, small, word, bgColor, borderColor, textColor, edgeColor } = letter

  /* Statis, eksplisit, selalu ada fallback (Sparkles) */
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
      animate={{ y: [0, -4, 0] }}
      transition={{
        duration: 2.4 + (index % 4) * 0.25,
        delay: (index % 5) * 0.18,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="h-full"
    >
      <motion.div
        role="button"
        tabIndex={0}
        whileHover={{ y: -4, scale: 1.05 }}
        whileTap={{ y: 2, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        onClick={handleCardClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleCardClick()
          }
        }}
        aria-label={`Huruf ${capital}, ${word}. Buka detail.`}
        className={`group relative flex h-full w-full cursor-pointer flex-col items-center justify-between gap-0.5 rounded-3xl border-4 border-b-8 p-1.5 text-center shadow-xl transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 sm:gap-1 sm:p-3 ${bgColor} ${borderColor} ${edgeColor} ${
          isActive ? 'ring-4 ring-amber-300' : ''
        }`}
      >
        {/* Kilauan bintang saat hover */}
        <Sparkles
          size={14}
          strokeWidth={2.5}
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-2 text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Header huruf */}
        <div className="flex items-baseline justify-center gap-1 leading-none">
          <span className="text-xl font-black tracking-tight text-indigo-950 sm:text-3xl">
            {capital}
          </span>
          <span className="text-sm font-black text-indigo-800 sm:text-2xl">{small}</span>
        </div>

        {/* Badge ikon objek */}
        <div className="flex h-8 w-8 items-center justify-center rounded-2xl border-2 border-white/80 bg-white/80 p-1 shadow-inner sm:h-10 sm:w-10 sm:p-1.5">
          <Icon size={22} strokeWidth={2.5} className={textColor} aria-hidden="true" />
        </div>

        {/* Nama objek */}
        <p className="w-full truncate text-[10px] font-black uppercase leading-tight tracking-wide text-slate-900 sm:text-sm">
          {word}
        </p>

        {/* Tombol Dengar chunky 3D */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={handleListen}
          className="mx-auto flex items-center gap-1 rounded-xl border-b-4 border-amber-500 bg-amber-400 px-2 py-0.5 text-[10px] font-black text-indigo-950 shadow-md transition-colors duration-200 hover:bg-amber-300 active:translate-y-0.5 active:border-b-0 sm:px-3 sm:py-1 sm:text-xs"
          aria-label={`Dengarkan bunyi huruf ${capital}`}
        >
          <Volume2 size={12} strokeWidth={2.6} aria-hidden="true" />
          Dengar
        </motion.button>
      </motion.div>
    </motion.div>
  )
}