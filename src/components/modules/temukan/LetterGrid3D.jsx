/**
 * LetterGrid3D - Papan tebak huruf 3 kolom x 2 baris (6 kartu raksasa).
 *
 * Aturan:
 * - Jawaban BENAR : kartu hijau mint bercahaya, CheckCircle emas, pop 1.15,
 *                   SFX selebrasi + TTS "Pintar sekali!", lanjut setelah 1 detik.
 * - Jawaban SALAH : kartu merah pastel sementara + getar + XCircle,
 *                   SFX "oops" lembut, anak boleh mencoba kartu lain.
 */

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { CheckCircle, XCircle } from 'lucide-react'
import { shuffle } from '../../../utils/shuffle'
import { useAudio } from '../../../hooks/useAudio'
import { speakSentence } from '../../../utils/textToSpeech'

const CONFETTI_COLORS = ['#FBBF24', '#FDE047', '#F472B6', '#34D399', '#60A5FA', '#A78BFA']

const PASTELS = [
  'border-sky-400 bg-sky-200',
  'border-amber-400 bg-amber-200',
  'border-rose-400 bg-rose-200',
  'border-emerald-400 bg-emerald-200',
  'border-orange-400 bg-orange-200',
  'border-purple-400 bg-purple-200',
]

const RESET_WRONG_MS = 750
const ADVANCE_MS = 1000

export const LetterGrid3D = ({
  letters,
  targetLetter,
  disabled = false,
  onCorrect,
  onWrong,
}) => {
  const { playSfx } = useAudio()
  const [palette] = useState(() => shuffle(PASTELS))
  const [statuses, setStatuses] = useState(() => letters.map(() => 'idle'))
  const [locked, setLocked] = useState(false)
  const lockedRef = useRef(false)
  const timersRef = useRef([])

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
      timersRef.current = []
    },
    []
  )

  const isLocked = locked || disabled

  const handlePick = (letter, index, event) => {
    if (lockedRef.current || disabled || statuses[index] === 'wrong') return

    if (letter === targetLetter) {
      lockedRef.current = true
      setLocked(true)
      setStatuses((previous) =>
        previous.map((status, currentIndex) =>
          currentIndex === index ? 'correct' : status
        )
      )

      /* Ledakan konfeti tepat di kartu yang benar */
      const box = event?.currentTarget?.getBoundingClientRect()
      if (box) {
        confetti({
          particleCount: 70,
          spread: 75,
          startVelocity: 32,
          scalar: 0.9,
          origin: {
            x: (box.left + box.width / 2) / window.innerWidth,
            y: (box.top + box.height / 2) / window.innerHeight,
          },
          colors: CONFETTI_COLORS,
          zIndex: 70,
        })
      }

      playSfx('celebration')
      speakSentence('Pintar sekali!')

      timersRef.current.push(
        window.setTimeout(() => onCorrect?.(letter), ADVANCE_MS)
      )
      return
    }

    setStatuses((previous) =>
      previous.map((status, currentIndex) =>
        currentIndex === index ? 'wrong' : status
      )
    )
    playSfx('oops')
    onWrong?.(letter)

    timersRef.current.push(
      window.setTimeout(() => {
        setStatuses((previous) =>
          previous.map((status, currentIndex) =>
            currentIndex === index && status === 'wrong' ? 'idle' : status
          )
        )
      }, RESET_WRONG_MS)
    )
  }

  return (
    <div className="z-20 mx-auto grid w-full max-w-2xl grid-cols-3 gap-3 sm:gap-5">
      {letters.map((letter, index) => {
        const status = statuses[index]
        const lockedCard = isLocked && status !== 'correct'

        const stateClass =
          status === 'correct'
            ? 'border-emerald-600 bg-emerald-400 text-emerald-950 shadow-[0_0_30px_rgba(16,185,129,0.8)]'
            : status === 'wrong'
              ? 'border-rose-600 bg-rose-400 text-rose-950 shadow-[0_8px_0_rgba(244,63,94,0.3)]'
              : `${palette[index % palette.length]} text-indigo-950 shadow-[0_8px_0_rgba(15,23,42,0.14)]`

        return (
          <motion.button
            key={`${letter}-${index}`}
            type="button"
            data-letter={letter}
            data-status={status}
            animate={
              status === 'correct'
                ? { scale: [1, 1.15, 1.08], y: 0, x: 0, rotate: 0 }
                : status === 'wrong'
                  ? { x: [0, -10, 10, -8, 8, 0], rotate: [0, -2, 2, -1, 0] }
                  : { scale: 1, y: 0, x: 0, rotate: 0 }
            }
            transition={
              status === 'wrong'
                ? { duration: 0.42, ease: 'easeInOut' }
                : { type: 'spring', stiffness: 300, damping: 16 }
            }
            whileHover={lockedCard ? undefined : { y: -6, scale: 1.08 }}
            whileTap={lockedCard ? undefined : { y: 4, scale: 0.97 }}
            onClick={(event) => handlePick(letter, index, event)}
            disabled={lockedCard}
            aria-label={`Huruf ${letter}${status === 'correct' ? ', benar' : ''}${
              status === 'wrong' ? ', salah' : ''
            }`}
            className={`relative flex h-24 w-full cursor-pointer select-none items-center justify-center overflow-hidden rounded-3xl border-x-4 border-t-4 border-b-8 text-4xl font-black leading-none transition-colors duration-150 sm:h-32 sm:border-x-6 sm:border-t-6 sm:border-b-10 sm:text-5xl ${stateClass} ${
              lockedCard ? 'cursor-default' : ''
            }`}
          >
            {/* Kilau mainan 3D */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-5 top-2 h-2 rounded-full bg-white/45 blur-[1px]"
            />
            <span>{letter}</span>

            {status === 'correct' && (
              <motion.span
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-0.5 shadow-md"
              >
                <CheckCircle
                  size={30}
                  strokeWidth={3}
                  className="fill-amber-300 text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.95)]"
                  aria-hidden="true"
                />
              </motion.span>
            )}

            {status === 'wrong' && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-0.5 shadow-md"
              >
                <XCircle
                  size={30}
                  strokeWidth={3}
                  className="fill-rose-200 text-rose-600"
                  aria-hidden="true"
                />
              </motion.span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
