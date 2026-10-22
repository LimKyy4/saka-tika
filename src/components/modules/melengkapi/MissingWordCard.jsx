/**
 * MissingWordCard - Kartu kata Modul 5 (Melengkapi Kata).
 *
 * Menampilkan ikon objek yang melayang dan barisan kotak huruf:
 * - huruf ada      : kotak putih, huruf indigo tebal
 * - huruf hilang   : kotak garis putus-putus amber yang berdenyut
 * - sudah dijawab  : seluruh kata berubah hijau mint + kilau Sparkles
 */

import { motion } from 'framer-motion'
import { HelpCircle, Lightbulb, Sparkles, Volume2 } from 'lucide-react'
import { getLetterIcon } from '../../../utils/letterIcons'

const ICON_PALETTES = [
  'border-sky-300 bg-sky-100 text-sky-700',
  'border-amber-300 bg-amber-100 text-amber-700',
  'border-rose-300 bg-rose-100 text-rose-700',
  'border-emerald-300 bg-emerald-100 text-emerald-700',
  'border-violet-300 bg-violet-100 text-violet-700',
  'border-orange-300 bg-orange-100 text-orange-700',
]

const SPARKLE_POSITIONS = [
  'left-4 top-1/3',
  'right-5 top-1/2',
  'bottom-8 left-8',
  'bottom-4 right-10',
]

export const MissingWordCard = ({
  word = '',
  missingIndex = 0,
  iconName,
  hintText,
  solved = false,
  onPlayAudio,
}) => {
  const Icon = getLetterIcon(iconName)
  const palette = ICON_PALETTES[(word.charCodeAt(0) || 0) % ICON_PALETTES.length]
  const answer = word[missingIndex] ?? ''

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`relative overflow-hidden rounded-[2rem] border-4 bg-white p-4 shadow-[0_10px_0_rgba(16,185,129,0.14)] transition-colors duration-300 sm:p-6 ${
        solved ? 'border-emerald-400' : 'border-emerald-200'
      }`}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-200/50 blur-2xl" />

      <div className="relative flex items-center justify-between gap-3">
        <span className="rounded-full border-2 border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-800">
          Lengkapi Kata
        </span>

        <button
          type="button"
          onClick={onPlayAudio}
          disabled={solved}
          className="flex items-center gap-1.5 rounded-full border-2 border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-800 shadow-[0_3px_0_rgba(16,185,129,0.16)] transition-transform hover:scale-105 active:translate-y-0.5 active:shadow-none disabled:cursor-default disabled:opacity-60"
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
        aria-label={`Kata ${word}, huruf ke-${missingIndex + 1} hilang`}
        className="mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3"
      >
        {word.split('').map((letter, index) => {
          if (index === missingIndex) {
            return (
              <motion.div
                key={`slot-${index}`}
                animate={
                  solved
                    ? { scale: [0.94, 1.05, 1], boxShadow: '0 0 0 0 rgba(251,191,36,0)' }
                    : {
                        boxShadow: [
                          '0 0 0 0 rgba(251,191,36,0.42)',
                          '0 0 0 10px rgba(251,191,36,0.06)',
                          '0 0 0 0 rgba(251,191,36,0.42)',
                        ],
                      }
                }
                transition={
                  solved
                    ? { duration: 0.4, ease: 'easeOut' }
                    : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }
                className={`flex h-16 w-12 items-center justify-center rounded-2xl border-4 transition-colors duration-300 sm:h-20 sm:w-16 ${
                  solved
                    ? 'border-solid border-emerald-400 bg-emerald-200'
                    : 'border-dashed border-amber-400 bg-amber-50'
                }`}
              >
                {solved ? (
                  <motion.span
                    layoutId="melengkapi-flying-letter"
                    className="text-3xl font-black leading-none text-indigo-950 sm:text-4xl"
                  >
                    {answer}
                  </motion.span>
                ) : (
                  <HelpCircle
                    size={28}
                    strokeWidth={2.6}
                    className="text-amber-400 opacity-80"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            )
          }

          return (
            <div
              key={`letter-${letter}-${index}`}
              className={`flex h-16 w-12 items-center justify-center rounded-2xl border-4 text-3xl font-black leading-none text-indigo-950 transition-colors duration-300 sm:h-20 sm:w-16 sm:text-4xl ${
                solved
                  ? 'border-emerald-300 bg-emerald-100 shadow-[0_5px_0_rgba(16,185,129,0.22)]'
                  : 'border-slate-200 bg-white shadow-[0_5px_0_rgba(148,163,184,0.18)]'
              }`}
            >
              {letter}
            </div>
          )
        })}
      </div>

      {hintText && (
        <p className="mx-auto mt-4 flex max-w-md items-start justify-center gap-1.5 text-center text-xs font-bold leading-snug text-slate-500">
          <Lightbulb size={15} strokeWidth={2.6} className="mt-0.5 shrink-0 text-amber-500" />
          {hintText}
        </p>
      )}

      {solved && (
        <div className="pointer-events-none absolute inset-0">
          {SPARKLE_POSITIONS.map((position, index) => (
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
