/**
 * TypingProgressBar - Baris status ringkas Modul 4.
 * Menampilkan nomor kata (KATA 1/10), pip progres, dan bintang terkumpul.
 */

import { Star } from 'lucide-react'

export const TypingProgressBar = ({ current = 1, total = 10, stars = 0, done = false }) => {
  const safeCurrent = Math.min(Math.max(current, 1), total)

  return (
    <div className="z-20 mx-auto flex w-full max-w-xl items-center gap-2">
      <div className="shrink-0 rounded-full border-2 border-white/80 bg-white/85 px-3 py-1 shadow-sm backdrop-blur-sm">
        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
          Kata
        </span>
        <span className="ml-1.5 text-sm font-black tabular-nums text-indigo-950">
          {safeCurrent} / {total}
        </span>
      </div>

      <div className="mx-1 flex flex-1 items-center gap-1" aria-hidden="true">
        {Array.from({ length: total }).map((_, index) => {
          const filled = index < stars
          const active = !done && index === safeCurrent - 1

          return (
            <span
              key={`typing-pip-${index + 1}`}
              className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
                filled
                  ? 'bg-emerald-400'
                  : active
                    ? 'bg-amber-400'
                    : 'bg-white/70'
              }`}
            />
          )
        })}
      </div>

      <div
        className="flex shrink-0 items-center gap-1.5 rounded-full border-2 border-amber-300 bg-amber-100/95 px-3 py-1 shadow-sm"
        aria-label={`Bintang terkumpul ${stars} dari ${total}`}
      >
        <Star
          size={16}
          strokeWidth={2.6}
          className="fill-amber-400 text-amber-600"
          aria-hidden="true"
        />
        <span className="text-sm font-black tabular-nums text-amber-900">
          {stars}
          <span className="ml-0.5 text-xs font-extrabold text-amber-700"> / {total}</span>
        </span>
      </div>
    </div>
  )
}
