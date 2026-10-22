/**
 * LetterOptions - 4 balok gelembung pilihan huruf Modul 5.
 *
 * - Jawaban benar : balok meluncur mengisi kotak kosong (layout animation),
 *                   lalu seluruh baris meredup saat selebrasi.
 * - Jawaban salah : balok bergetar, memerah sebentar, dan anak boleh
 *                   mencoba huruf lain (tidak ada nyawa yang hilang).
 */

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

const TONES = [
  'border-amber-300 bg-amber-100 text-amber-900 shadow-[0_8px_0_rgba(245,158,11,0.28)]',
  'border-sky-300 bg-sky-100 text-sky-900 shadow-[0_8px_0_rgba(14,165,233,0.25)]',
  'border-rose-300 bg-rose-100 text-rose-900 shadow-[0_8px_0_rgba(244,63,94,0.22)]',
  'border-violet-300 bg-violet-100 text-violet-900 shadow-[0_8px_0_rgba(139,92,246,0.24)]',
]

const WRONG_TONE =
  'border-rose-500 bg-rose-200 text-rose-950 shadow-[0_8px_0_rgba(190,18,60,0.3)] ring-4 ring-rose-200'

const OptionBubble = ({
  option,
  tone,
  isWrong,
  wrongTick,
  solved,
  isAnswer,
  disabled,
  onPick,
}) => {
  const controls = useAnimationControls()
  const lastTickRef = useRef(wrongTick)

  useEffect(() => {
    if (wrongTick === lastTickRef.current) return
    lastTickRef.current = wrongTick
    if (!isWrong) return

    controls.start({
      x: [0, -9, 9, -9, 9, 0],
      transition: { duration: 0.42, ease: 'easeInOut' },
    })
  }, [controls, isWrong, wrongTick])

  return (
    <motion.button
      type="button"
      animate={controls}
      onClick={() => onPick(option)}
      disabled={disabled || solved}
      aria-label={`Pilih huruf ${option}`}
      className={`relative flex h-20 w-full items-center justify-center rounded-3xl border-4 text-4xl font-black leading-none transition-transform duration-150 sm:h-24 sm:text-5xl ${
        isWrong ? WRONG_TONE : tone
      } ${
        disabled || solved
          ? 'cursor-default'
          : 'hover:-translate-y-1 hover:brightness-105 active:translate-y-1 active:shadow-none'
      }`}
    >
      {!(solved && isAnswer) && (
        <motion.span
          layoutId={isAnswer ? 'melengkapi-flying-letter' : undefined}
          className="block"
        >
          {option}
        </motion.span>
      )}
    </motion.button>
  )
}

export const LetterOptions = ({
  options = [],
  correctLetter = '',
  solved = false,
  disabled = false,
  onCorrect,
  onWrong,
}) => {
  const [wrong, setWrong] = useState({ option: null, tick: 0 })
  const timerRef = useRef(null)

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    },
    []
  )

  const handlePick = (option) => {
    if (disabled || solved) return

    if (option === correctLetter) {
      onCorrect?.(option)
      return
    }

    setWrong((current) => ({ option, tick: current.tick + 1 }))
    onWrong?.(option)

    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setWrong((current) => (current.option === option ? { ...current, option: null } : current))
    }, 480)
  }

  return (
    <motion.div
      animate={{ opacity: solved ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${solved ? 'pointer-events-none' : ''}`}
      aria-hidden={solved}
    >
      {options.map((option, index) => (
        <OptionBubble
          key={`option-${option}`}
          option={option}
          tone={TONES[index % TONES.length]}
          isWrong={wrong.option === option}
          wrongTick={wrong.tick}
          solved={solved}
          isAnswer={option === correctLetter}
          disabled={disabled}
          onPick={handlePick}
        />
      ))}
    </motion.div>
  )
}
