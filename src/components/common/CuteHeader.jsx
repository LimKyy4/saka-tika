/**
 * CuteHeader - Header bar non-obstructive.
 * Mode logo  : brand "SAKA TIKA" + kontrol audio (Home).
 * Mode halaman: tombol kembali 3D + judul/subjudul + total bintang + audio.
 * compact    : header ringkas h-14 flex-none (dipakai di HomeScreen 1 layar).
 */

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Home, Sparkles, Star } from 'lucide-react'
import { useAudio } from '../../hooks/useAudio'
import { AudioController } from './AudioController'

export const CuteHeader = ({
  title,
  description,
  logo = false,
  onBack,
  onHome,
  showBack = true,
  showHome = true,
  showAudio = true,
  showStars = false,
  stars = 0,
  compact = false,
}) => {
  const { playSfx } = useAudio()

  const handleNav = (onClick) => (event) => {
    playSfx('click')
    onClick?.(event)
  }

  const navButtonClass =
    'flex h-11 w-11 items-center justify-center rounded-full border-4 border-amber-300 bg-amber-200 text-amber-900 shadow-[0_5px_0_rgba(245,158,11,0.35)] transition-colors hover:bg-amber-100 active:translate-y-1 active:shadow-none focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/50'

  const headerClass = compact
    ? 'fixed top-0 left-0 right-0 z-50 flex h-14 w-full items-center justify-between gap-3 border-b-2 border-amber-200/60 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-md sm:px-5'
    : 'sticky top-0 z-50 flex w-full items-center justify-between gap-3 border-b-2 border-amber-200/50 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6'

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className={headerClass}
    >
      {/* Kiri: kembali + judul / logo */}
      <div className="flex min-w-0 items-center gap-3">
        {showBack && onBack && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.88, y: 2 }}
            onClick={handleNav(onBack)}
            className={navButtonClass}
            aria-label="Kembali ke menu"
            title="Kembali ke menu"
          >
            <ArrowLeft size={22} strokeWidth={3} aria-hidden="true" />
          </motion.button>
        )}

        {logo ? (
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-amber-400 bg-amber-300 shadow-[0_4px_0_rgba(245,158,11,0.35)]">
              <Sparkles size={20} strokeWidth={2.6} className="text-indigo-950" aria-hidden="true" />
            </div>
            <div className="leading-none">
              <p className="text-lg font-black tracking-tight text-indigo-950">SAKA TIKA</p>
              <p className="mt-1 text-[11px] font-bold text-slate-500">Mengenal Huruf</p>
            </div>
          </div>
        ) : (
          <div className="min-w-0">
            {title && (
              <h2 className="truncate text-xl font-black leading-tight tracking-tight text-indigo-950">
                {title}
              </h2>
            )}
            {description && (
              <p className="truncate text-xs font-bold text-slate-600">{description}</p>
            )}
          </div>
        )}
      </div>

      {/* Kanan: bintang + navigasi + audio */}
      <div className="flex shrink-0 items-center gap-2">
        {showStars && (
          <div
            className="flex items-center gap-1.5 rounded-full border-2 border-amber-300 bg-amber-100 px-2.5 py-1.5 shadow-sm"
            aria-label={`Total bintang terkumpul: ${stars}`}
            title="Total bintang terkumpul"
          >
            <Star
              size={16}
              strokeWidth={2.5}
              className="fill-amber-400 text-amber-500"
              aria-hidden="true"
            />
            <span className="text-sm font-black tabular-nums text-amber-900">{stars}</span>
          </div>
        )}

        {showHome && onHome && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.88, y: 2 }}
            onClick={handleNav(onHome)}
            className={navButtonClass}
            aria-label="Beranda"
            title="Beranda"
          >
            <Home size={20} strokeWidth={2.8} aria-hidden="true" />
          </motion.button>
        )}

        {showAudio && <AudioController size="md" />}
      </div>
    </motion.header>
  )
}