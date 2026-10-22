/**
 * WordCard - Kartu kata Modul 4.
 *
 * Menampilkan ikon objek yang melayang, kategori, petunjuk singkat,
 * tombol audio, dan kotak-kotak huruf dengan tiga keadaan:
 * - belum diketik : putih, border abu-abu
 * - aktif         : kuning pastel, cincin berdenyut, kursor berkedip
 * - selesai       : hijau mint, huruf indigo tebal, animasi pop
 */

import { useEffect, useRef } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { Lightbulb, Sparkles, Volume2 } from 'lucide-react'
import { getLetterIcon } from '../../../utils/letterIcons'

const ICON_PALETTES = [
  'border-sky-300 bg-sky-100 text-sky-700',
  'border-amber-300 bg-amber-100 text-amber-700',
  'border-rose-300 bg-rose-100 text-rose-700',
  'border-emerald-300 bg-emerald-100 text-emerald-700',
  'border-violet-300 bg-violet-100 text-violet-700',
  'border-orange-300 bg-orange-100 text-orange-700',
]

const LetterBox = ({ letter, status, compact, shakeSignal }) => {
  const controls = useAnimationControls()
  const lastShakeRef = useRef(shakeSignal)

  useEffect(() => {
    if (shakeSignal === lastShakeRef.current) return
    lastShakeRef.current = shakeSignal

    if (status === 'active') {
      controls.start({
        x: [0, -7, 7, -7, 7, 0],
        transition: { duration: 0.38, ease: 'easeInOut' },
      })
    }
  }, [controls, shakeSignal, status])

  useEffect(() => {
    if (status === 'done') {
      controls.start({
        scale: [0.82, 1.12, 1],
        transition: { duration: 0.4, ease: 'easeOut' },
      })
    }
  }, [controls, status])

  const sizeClass = compact
    ? 'h-12 w-8 text-xl sm:h-16 sm:w-12 sm:text-3xl'
    : 'h-14 w-10 text-2xl sm:h-20 sm:w-16 sm:text-4xl'

  const stateClass =
    status === 'done'
      ? 'border-emerald-500 bg-emerald-200 text-indigo-950 shadow-[0_5px_0_rgba(16,185,129,0.28)]'
      : status === 'active'
        ? 'border-amber-400 bg-amber-100 text-amber-900 shadow-[0_5px_0_rgba(245,158,11,0.3)] ring-4 ring-amber-200'
        : 'border-slate-200 bg-white text-slate-300 shadow-[0_5px_0_rgba(148,163,184,0.16)]'

  return (
    <motion.div
      animate={controls}
      className={`flex items-center justify-center rounded-2xl border-4 font-black leading-none transition-colors ${sizeClass} ${stateClass}`}
    >
      {status === 'done' && <span>{letter}</span>}

      {status === 'active' && (
        <motion.span
          aria-hidden="true"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          className="h-5 w-1 rounded-full bg-amber-500 sm:h-7 sm:w-1.5"
        />
      )}
    </motion.div>
  )
}

export const WordCard = ({
  word = '',
  iconName,
  category,
  hintText,
  typedCount = 0,
  completed = false,
  shakeSignal = 0,
  onPlayAudio,
}) => {
  const Icon = getLetterIcon(iconName)
  const compact = word.length > 5
  const palette = ICON_PALETTES[(word.charCodeAt(0) || 0) % ICON_PALETTES.length]

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-[2rem] border-4 border-orange-300 bg-white p-4 shadow-[0_10px_0_rgba(249,115,22,0.14)] sm:p-6"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-200/50 blur-2xl" />

      <div className="relative flex items-center justify-between gap-3">
        <span className="rounded-full border-2 border-slate-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-600">
          {category || 'Kata'}
        </span>

        <button
          type="button"
          onClick={onPlayAudio}
          disabled={completed}
          className="flex items-center gap-1.5 rounded-full border-2 border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-800 shadow-[0_3px_0_rgba(249,115,22,0.16)] transition-transform hover:scale-105 active:translate-y-0.5 active:shadow-none disabled:cursor-default disabled:opacity-60"
          aria-label={`Dengarkan kata ${word}`}
        >
          <Volume2 size={15} strokeWidth={2.8} />
          Dengar Kata
        </button>
      </div>

      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className={`relative mx-auto mt-3 flex h-24 w-24 items-center justify-center rounded-[1.75rem] border-4 sm:h-28 sm:w-28 ${palette} shadow-[0_8px_0_rgba(0,0,0,0.08)]`}
      >
        <Icon size={60} strokeWidth={2.2} />
        <Sparkles
          size={20}
          strokeWidth={2.6}
          className="absolute -right-2 -top-2 text-amber-400"
        />
      </motion.div>

      <div
        role="group"
        aria-label={`Kata ${word}, ${typedCount} dari ${word.length} huruf terisi`}
        className={`mt-5 flex flex-wrap items-center justify-center ${compact ? 'gap-1 sm:gap-2' : 'gap-1.5 sm:gap-3'}`}
      >
        {word.split('').map((letter, index) => {
          const status =
            index < typedCount ? 'done' : index === typedCount && !completed ? 'active' : 'pending'

          return (
            <LetterBox
              key={`${letter}-${index}`}
              letter={letter}
              status={status}
              compact={compact}
              shakeSignal={shakeSignal}
            />
          )
        })}
      </div>

      {hintText && (
        <p className="mx-auto mt-4 flex max-w-md items-start justify-center gap-1.5 text-center text-xs font-bold leading-snug text-slate-500">
          <Lightbulb size={15} strokeWidth={2.6} className="mt-0.5 shrink-0 text-amber-500" />
          {hintText}
        </p>
      )}

      {completed && (
        <div className="pointer-events-none absolute inset-0">
          {[
            'left-4 top-4',
            'right-5 top-1/3',
            'bottom-6 left-8',
            'bottom-4 right-10',
          ].map((position, index) => (
            <motion.span
              key={position}
              animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.45, 1, 0.45] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut',
              }}
              className={`absolute ${position} text-amber-400`}
            >
              <Sparkles size={index % 2 === 0 ? 24 : 18} strokeWidth={2.4} />
            </motion.span>
          ))}
        </div>
      )}
    </motion.section>
  )
}
