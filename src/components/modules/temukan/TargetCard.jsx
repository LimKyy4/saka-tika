/**
 * TargetCard - Kartu instruksi soal: maskot Saka & Tika, balon ucapan,
 * badge huruf target yang berdenyut, dan tombol audio.
 */

import { motion } from 'framer-motion'
import { Sparkles, Volume2 } from 'lucide-react'
import { MascotSakaTika } from '../../common/MascotSakaTika'

const pulse = {
  scale: [1, 1.06, 1],
  rotate: [0, -2, 2, 0],
  transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
}

export const TargetCard = ({ targetLetter, hintText, onPlayAudio }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-3xl border-4 border-pink-300 bg-gradient-to-br from-pink-100 via-white to-amber-50 p-4 shadow-[0_10px_0_rgba(236,72,153,0.16)] sm:p-5"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-200/60 blur-2xl" />

      <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        {/* Maskot + balon ucapan */}
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="w-[116px] shrink-0">
            <MascotSakaTika compact />
          </div>

          <div className="relative flex-1 rounded-3xl border-4 border-amber-300 bg-amber-50 px-3 py-2.5 shadow-[0_6px_0_rgba(245,158,11,0.16)]">
            <p className="text-sm font-black leading-snug text-amber-950 sm:text-base">
              Temukan huruf{' '}
              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-white px-1 text-lg text-indigo-950 shadow-sm">
                {targetLetter}
              </span>{' '}
              di bawah ini!
            </p>
            <p className="mt-1 text-[11px] font-bold leading-snug text-amber-800">
              {hintText}
            </p>
            <span
              aria-hidden="true"
              className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b-4 border-l-4 border-amber-300 bg-amber-50"
            />
          </div>
        </div>

        {/* Badge huruf target + audio */}
        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:gap-2">
          <motion.div
            animate={pulse}
            className="relative flex h-24 w-24 items-center justify-center rounded-[1.75rem] border-4 border-indigo-300 bg-white shadow-[0_8px_0_rgba(79,70,229,0.2)]"
          >
            <span className="text-6xl font-black leading-none text-indigo-950">
              {targetLetter}
            </span>
            <Sparkles
              size={20}
              strokeWidth={2.6}
              className="absolute -right-2 -top-2 text-amber-400"
            />
            <Sparkles
              size={14}
              strokeWidth={2.6}
              className="absolute -left-2 bottom-1 text-pink-400"
            />
          </motion.div>

          <button
            type="button"
            onClick={onPlayAudio}
            className="flex items-center gap-1.5 rounded-full border-2 border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-black text-indigo-800 shadow-[0_3px_0_rgba(79,70,229,0.15)] transition-transform hover:scale-105 active:translate-y-0.5 active:shadow-none"
            aria-label={`Dengarkan instruksi huruf ${targetLetter}`}
          >
            <Volume2 size={15} strokeWidth={2.8} />
            Dengar Soal
          </button>
        </div>
      </div>
    </motion.section>
  )
}
