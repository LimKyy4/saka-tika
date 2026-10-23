/**
 * QwertyKeyboard3D - Papan ketik maya 3D mainan untuk Modul 4.
 *
 * Tiga baris QWERTY + tombol Hapus (Backspace) dan Reset Kata.
 * Bisa diklik dengan tetikus dan menyala saat huruf yang sama
 * diketik lewat keyboard fisik. Huruf salah membuat tombol bergetar
 * merah pastel tanpa mengurangi skor.
 */

import { useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { Eraser, Keyboard, RotateCcw } from 'lucide-react'

const KEY_ROWS = [
  { letters: 'QWERTYUIOP', width: '100%', tone: 'amber' },
  { letters: 'ASDFGHJKL', width: '92%', tone: 'sky' },
  { letters: 'ZXCVBNM', width: '76%', tone: 'rose' },
]

const TONE_CLASSES = {
  amber: 'border-amber-300 border-b-amber-500 bg-amber-100 hover:bg-amber-50',
  sky: 'border-sky-300 border-b-sky-500 bg-sky-100 hover:bg-sky-50',
  rose: 'border-rose-300 border-b-rose-500 bg-rose-100 hover:bg-rose-50',
}

const KEY_BASE =
  'flex h-10 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-2xl border-x-2 border-t-2 border-b-4 text-base font-black leading-none text-indigo-950 shadow-md transition-all duration-100 active:translate-y-1 active:border-b-0 disabled:cursor-default disabled:opacity-50 sm:h-11 sm:border-x-4 sm:border-t-4 sm:border-b-6 sm:text-xl'

const CONTROL_BASE =
  'flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-2xl border-x-2 border-t-2 border-b-4 text-xs font-black shadow-md transition-all duration-100 active:translate-y-1 active:border-b-0 disabled:cursor-default disabled:opacity-50 sm:h-11 sm:border-x-4 sm:border-t-4 sm:border-b-6 sm:text-sm'

const KeyboardKey = ({ letter, tone, status, disabled, onPress }) => {
  const controls = useAnimationControls()

  useEffect(() => {
    if (status === 'wrong') {
      controls.start({
        x: [0, -8, 8, -6, 6, 0],
        transition: { duration: 0.4, ease: 'easeInOut' },
      })
    }
  }, [controls, status])

  const stateClass =
    status === 'wrong'
      ? 'border-rose-500 border-b-rose-600 bg-rose-300 text-rose-950'
      : status === 'active'
        ? 'border-amber-400 border-b-amber-600 bg-amber-300 text-amber-950'
        : TONE_CLASSES[tone]

  return (
    <motion.button
      type="button"
      data-key={letter}
      animate={controls}
      onClick={() => onPress(letter)}
      disabled={disabled}
      aria-label={`Tombol huruf ${letter}`}
      className={`${KEY_BASE} ${stateClass}`}
    >
      {letter}
    </motion.button>
  )
}

export const QwertyKeyboard3D = ({
  onKey,
  onBackspace,
  onReset,
  disabled = false,
  activeKey = null,
  wrongKey = null,
}) => {
  return (
    <section
      aria-label="Papan ketik huruf QWERTY"
      className="z-20 mx-auto flex w-full max-w-xl flex-col gap-1.5 rounded-3xl border-4 border-sky-300 bg-sky-100/90 p-2.5 shadow-xl"
    >
      <div className="flex items-center justify-between px-1">
        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-sky-800">
          <Keyboard size={13} strokeWidth={2.8} aria-hidden="true" />
          Papan Ketik
        </span>
        <span className="text-[9px] font-bold text-sky-700 sm:text-[10px]">
          Klik tombol atau ketik di keyboard
        </span>
      </div>

      {KEY_ROWS.map((row) => (
        <div
          key={row.letters}
          className="mx-auto flex gap-1 sm:gap-1.5"
          style={{ width: row.width }}
        >
          {row.letters.split('').map((letter) => {
            const normalized = letter.toLowerCase()
            const status =
              wrongKey === normalized
                ? 'wrong'
                : activeKey === normalized
                  ? 'active'
                  : 'idle'

            return (
              <KeyboardKey
                key={letter}
                letter={letter}
                tone={row.tone}
                status={status}
                disabled={disabled}
                onPress={onKey}
              />
            )
          })}
        </div>
      ))}

      {/* Hapus & Reset */}
      <div className="mt-0.5 flex gap-1.5">
        <button
          type="button"
          data-action="backspace"
          onClick={onBackspace}
          disabled={disabled}
          aria-label="Hapus huruf terakhir"
          title="Hapus huruf terakhir"
          className={`${CONTROL_BASE} border-rose-300 border-b-rose-500 bg-rose-100 text-rose-950 hover:bg-rose-50`}
        >
          <Eraser size={16} strokeWidth={2.8} aria-hidden="true" />
          Hapus
        </button>

        <button
          type="button"
          data-action="reset"
          onClick={onReset}
          disabled={disabled}
          aria-label="Reset kata"
          title="Reset kata"
          className={`${CONTROL_BASE} border-sky-300 border-b-sky-500 bg-sky-100 text-sky-950 hover:bg-sky-50`}
        >
          <RotateCcw size={16} strokeWidth={2.8} aria-hidden="true" />
          Reset Kata
        </button>
      </div>
    </section>
  )
}
