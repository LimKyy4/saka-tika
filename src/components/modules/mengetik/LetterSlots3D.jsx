/**
 * LetterSlots3D - Deretan kotak huruf 3D untuk Modul 4.
 *
 * Tiga keadaan:
 * - aktif   : kuning bercahaya + cincin berdenyut + kursor berkedip.
 * - terisi  : hijau mint, huruf indigo tebal, sedikit membesar.
 * - kosong  : putih pastel pudar.
 *
 * Saat huruf salah, slot aktif bergetar dan berkedip merah pastel.
 * Saat kata selesai, muncul kilauan Sparkles di sekitar deretan.
 */

import { useEffect, useRef } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const SPARKLE_POSITIONS = [
  '-left-3 -top-4',
  '-right-3 -top-5',
  '-bottom-4 left-6',
  '-bottom-5 right-8',
]

const Slot = ({ letter, status, error, shakeSignal }) => {
  const controls = useAnimationControls()
  const lastShakeRef = useRef(shakeSignal)

  useEffect(() => {
    if (shakeSignal === lastShakeRef.current) return
    lastShakeRef.current = shakeSignal

    if (error) {
      controls.start({
        x: [0, -8, 8, -6, 6, 0],
        transition: { duration: 0.4, ease: 'easeInOut' },
      })
    }
  }, [controls, error, shakeSignal])

  const stateClass =
    status === 'error'
      ? 'border-rose-500 bg-rose-300 text-rose-950 ring-4 ring-rose-300/60'
      : status === 'filled'
        ? 'scale-105 border-emerald-500 bg-emerald-300 text-indigo-950'
        : status === 'active'
          ? 'border-amber-400 bg-amber-200 text-amber-950 ring-4 ring-amber-300/50 animate-pulse'
          : 'border-slate-300 bg-white/80 text-slate-300'

  return (
    <motion.div
      animate={controls}
      data-slot-status={status}
      className={`flex h-14 w-12 shrink-0 items-center justify-center rounded-2xl border-4 border-b-6 font-black text-2xl leading-none shadow-lg transition-colors duration-150 sm:h-16 sm:w-14 sm:text-3xl ${stateClass}`}
    >
      {status === 'filled' && <span>{letter}</span>}

      {status === 'active' && (
        <motion.span
          aria-hidden="true"
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          className="h-6 w-1 rounded-full bg-amber-600 sm:h-7 sm:w-1.5"
        />
      )}

      {status === 'error' && (
        <motion.span
          aria-hidden="true"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.4, repeat: Infinity }}
          className="h-6 w-1 rounded-full bg-rose-600 sm:h-7 sm:w-1.5"
        />
      )}
    </motion.div>
  )
}

export const LetterSlots3D = ({
  word = '',
  typedCount = 0,
  completed = false,
  error = false,
  shakeSignal = 0,
}) => {
  return (
    <div
      className="relative z-20 mx-auto flex w-full items-center justify-center gap-2 py-2 sm:gap-3"
      data-word={word}
      data-typed={typedCount}
      role="group"
      aria-label={`Kata ${word}, ${typedCount} dari ${word.length} huruf terisi`}
    >
      {word.split('').map((letter, index) => {
        const filled = index < typedCount
        const active = index === typedCount && !completed
        const activeError = active && error

        const status = activeError
          ? 'error'
          : filled
            ? 'filled'
            : active
              ? 'active'
              : 'empty'

        return (
          <Slot
            key={`${letter}-${index}`}
            letter={letter}
            status={status}
            error={activeError}
            shakeSignal={shakeSignal}
          />
        )
      })}

      {/* Kilauan saat kata selesai */}
      {completed && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {SPARKLE_POSITIONS.map((position, index) => (
            <motion.span
              key={position}
              animate={{ scale: [0.75, 1.3, 0.75], opacity: [0.4, 1, 0.4], rotate: [0, 18, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.16,
                ease: 'easeInOut',
              }}
              className={`absolute ${position} text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]`}
            >
              <Sparkles size={index % 2 === 0 ? 24 : 18} strokeWidth={2.6} />
            </motion.span>
          ))}
        </div>
      )}
    </div>
  )
}
