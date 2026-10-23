/**
 * LetterSelector - Bar pemilih huruf A-Z yang ringkas untuk footer Modul 2.
 * Satu baris horizontal, indikator CheckCircle untuk huruf yang sudah selesai.
 */

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useAudio } from '../../../hooks/useAudio'

export const LetterSelector = ({
  letters,
  currentId,
  completedLetters,
  onSelect,
  className = '',
}) => {
  const { playSfx } = useAudio()

  const handleSelect = (id) => {
    playSfx('click')
    onSelect?.(id)
  }

  return (
    <div
      className={`items-center gap-0.5 ${className}`}
      role="group"
      aria-label="Pilih huruf A sampai Z"
    >
      {letters.map((letter) => {
        const isActive = currentId === letter.id
        const isDone = completedLetters.has(letter.id)

        return (
          <motion.button
            key={letter.id}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => handleSelect(letter.id)}
            aria-label={`Pilih huruf ${letter.capital}${
              isDone ? ' (sudah selesai)' : ''
            }`}
            aria-current={isActive ? 'true' : undefined}
            className={`relative flex h-6 w-6 items-center justify-center rounded-lg border-2 text-[10px] font-black transition-colors duration-150 ${
              isDone
                ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
                : isActive
                  ? 'border-amber-400 bg-amber-200 text-amber-900 ring-2 ring-amber-300'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:bg-amber-50'
            }`}
          >
            {letter.capital}

            {isDone && (
              <CheckCircle
                size={9}
                strokeWidth={3.5}
                className="absolute -right-1 -top-1 rounded-full bg-white text-emerald-600"
                aria-hidden="true"
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
