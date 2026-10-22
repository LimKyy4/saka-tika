/**
 * MissingProgressBar - Header progres Modul 5.
 * Menampilkan nomor soal, bintang soal yang selesai, dan pip warna-warni.
 */

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const PIP_COLORS = [
  'bg-rose-400',
  'bg-orange-400',
  'bg-amber-400',
  'bg-lime-400',
  'bg-emerald-400',
  'bg-teal-400',
  'bg-sky-400',
  'bg-indigo-400',
  'bg-violet-400',
  'bg-fuchsia-400',
]

export const MissingProgressBar = ({ current = 1, total = 10, stars = 0, done = false }) => {
  const safeCurrent = Math.min(Math.max(current, 1), total)

  return (
    <div className="rounded-3xl border-4 border-emerald-200 bg-white p-4 shadow-[0_8px_0_rgba(16,185,129,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            Soal
          </p>
          <p className="text-2xl font-black leading-none text-indigo-950">
            {safeCurrent}{' '}
            <span className="text-base font-extrabold text-slate-500">/ {total}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border-2 border-amber-300 bg-amber-100 px-3 py-1.5">
          <Star size={18} strokeWidth={2.6} className="fill-amber-400 text-amber-600" />
          <span className="text-sm font-black text-amber-900">
            {stars}
            <span className="ml-0.5 text-xs font-extrabold text-amber-700">/ {total}</span>
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, index) => {
          const filled = index < stars
          const active = !done && index === safeCurrent - 1

          return (
            <motion.div
              key={`soal-pip-${index + 1}`}
              layout
              className={`h-2.5 flex-1 rounded-full transition-colors ${
                filled
                  ? PIP_COLORS[index % PIP_COLORS.length]
                  : active
                    ? 'bg-amber-400'
                    : 'bg-slate-200'
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
