/**
 * VirtualKeyboard - Papan ketik visual 3D untuk Modul 4.
 *
 * Tata letak QWERTY. Setiap tombol bisa diklik/diketuk, memberi efek
 * tekan ke bawah, menyala saat huruf yang sama diketik di keyboard fisik,
 * dan bergetar merah saat salah.
 */

import { useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { Keyboard } from 'lucide-react'

const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']
const ROW_WIDTHS = ['100%', '90%', '70%']

const KeyboardKey = ({ letter, status, disabled, onPress }) => {
  const controls = useAnimationControls()

  useEffect(() => {
    if (status === 'wrong') {
      controls.start({
        x: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.34, ease: 'easeInOut' },
      })
    }
  }, [controls, status])

  const stateClass =
    status === 'wrong'
      ? 'border-rose-300 border-b-rose-500 bg-rose-200 text-rose-950'
      : status === 'active'
        ? 'border-amber-300 border-b-amber-500 bg-amber-200 text-amber-950'
        : 'border-slate-200 border-b-slate-300 bg-white text-slate-800 hover:bg-slate-50'

  return (
    <motion.button
      type="button"
      animate={controls}
      whileTap={disabled ? undefined : { y: 3, scale: 0.96 }}
      onClick={() => onPress(letter)}
      disabled={disabled}
      aria-label={`Tombol huruf ${letter}`}
      className={`flex h-10 min-w-0 flex-1 items-center justify-center rounded-xl border-2 border-b-4 text-sm font-black leading-none shadow-[0_2px_0_rgba(148,163,184,0.22)] transition-colors active:border-b-2 active:shadow-none disabled:cursor-default disabled:opacity-50 sm:h-12 sm:text-lg ${stateClass}`}
    >
      {letter}
    </motion.button>
  )
}

export const VirtualKeyboard = ({
  onKey,
  disabled = false,
  activeKey = null,
  wrongKey = null,
}) => {
  return (
    <section
      aria-label="Papan ketik huruf"
      className="mx-auto w-full max-w-2xl rounded-[1.75rem] border-4 border-sky-200 bg-sky-50/80 p-3 shadow-[0_8px_0_rgba(14,165,233,0.12)] sm:p-4"
    >
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-sky-800">
        <Keyboard size={14} strokeWidth={2.8} />
        Papan Ketik
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        {KEY_ROWS.map((row, rowIndex) => (
          <div
            key={row}
            className="mx-auto flex gap-1 sm:gap-2"
            style={{ width: ROW_WIDTHS[rowIndex] }}
          >
            {row.split('').map((letter) => {
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
                  status={status}
                  disabled={disabled}
                  onPress={onKey}
                />
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}
