/**
 * LetterSelector - Bar pemilih huruf A-Z.
 * Rapi dalam 1-2 baris di desktop, indikator CheckCircle untuk huruf selesai.
 */

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useAudio } from '../../../hooks/useAudio'

export const LetterSelector = ({ letters, currentId, completedLetters, onSelect }) => {
  const { playSfx } = useAudio()

  const handleSelect = (id) => {
    playSfx('click')
    onSelect?.(id)
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border-2 border-amber-200 bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {letters.map((letter) => {
          const isActive = currentId === letter.id
          const isDone = completedLetters.has(letter.id)

          return (
            <motion.button
              key={letter.id}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelect(letter.id)}
              aria-label={`Pilih huruf ${letter.capital}${
                isDone ? ' (sudah selesai)' : ''
              }`}
              aria-current={isActive ? 'true' : undefined}
              className={`relative flex h-9 w-9 items-center justify-center rounded-xl border-2 text-sm font-extrabold transition-colors ${
                isDone
                  ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
                  : isActive
                    ? 'border-amber-400 bg-amber-100 text-amber-900 ring-2 ring-amber-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              {letter.capital}

              {isDone && (
                <CheckCircle
                  size={12}
                  strokeWidth={3}
                  className="absolute -right-1 -top-1 rounded-full bg-white text-emerald-600"
                  aria-hidden="true"
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
