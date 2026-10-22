/**
 * LetterTile - Satu tombol huruf pada papan jawaban.
 * Menangani animasi benar (pop + centang) dan salah (getar + silang).
 */

import { useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'

const PASTELS = [
  'border-sky-300 bg-sky-100 text-sky-950',
  'border-amber-300 bg-amber-100 text-amber-950',
  'border-rose-300 bg-rose-100 text-rose-950',
  'border-emerald-300 bg-emerald-100 text-emerald-950',
  'border-violet-300 bg-violet-100 text-violet-950',
  'border-orange-300 bg-orange-100 text-orange-950',
  'border-teal-300 bg-teal-100 text-teal-950',
  'border-fuchsia-300 bg-fuchsia-100 text-fuchsia-950',
]

export const LetterTile = ({
  letter,
  index = 0,
  status = 'idle',
  disabled = false,
  onPick,
}) => {
  const controls = useAnimationControls()
  const palette = PASTELS[index % PASTELS.length]

  useEffect(() => {
    if (status === 'wrong') {
      controls.start({
        x: [0, -8, 8, -8, 8, 0],
        transition: { duration: 0.4 },
      })
    } else if (status === 'correct') {
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.45, ease: 'easeOut' },
      })
    }
  }, [controls, status])

  const stateClass =
    status === 'correct'
      ? 'border-emerald-500 bg-emerald-300 text-emerald-950 shadow-[0_8px_0_rgba(16,185,129,0.35)]'
      : status === 'wrong'
        ? 'border-rose-500 bg-rose-300 text-rose-950 shadow-[0_8px_0_rgba(244,63,94,0.3)]'
        : `${palette} shadow-[0_8px_0_rgba(0,0,0,0.08)]`

  return (
    <motion.button
      type="button"
      animate={controls}
      whileHover={disabled ? undefined : { y: -3 }}
      whileTap={disabled ? undefined : { y: 4, scale: 0.97 }}
      onClick={() => onPick?.(letter, index)}
      disabled={disabled}
      aria-label={`Huruf ${letter}`}
      className={`relative flex aspect-square w-full items-center justify-center rounded-3xl border-4 text-4xl font-black leading-none transition-colors sm:text-5xl ${stateClass} ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      <span>{letter}</span>

      {status === 'correct' && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-2 -top-2 rounded-full bg-white p-0.5 shadow-md"
        >
          <CheckCircle2 size={26} strokeWidth={3} className="text-emerald-500" />
        </motion.span>
      )}

      {status === 'wrong' && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-2 -top-2 rounded-full bg-white p-0.5 shadow-md"
        >
          <XCircle size={26} strokeWidth={3} className="text-rose-500" />
        </motion.span>
      )}
    </motion.button>
  )
}
