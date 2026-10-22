/**
 * CuteHeader - Header bar non-obstructive (sticky, z-50, backdrop blur).
 * Mode logo: brand "SAKA TIKA" + kontrol audio BGM.
 * Mode halaman: judul, deskripsi, tombol navigasi.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Home, Sparkles } from 'lucide-react'
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
}) => {
  const { playSfx } = useAudio()

  const makeNavButton = (icon, label, onClick) => (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={(event) => {
        playSfx('click')
        onClick?.(event)
      }}
      className="rounded-2xl border-4 border-slate-200 bg-slate-50 p-2.5 text-slate-700 shadow-[0_5px_0_0_rgba(0,0,0,0.07)] transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 active:translate-y-1 active:shadow-none"
      aria-label={label}
      title={label}
    >
      <span className="sr-only">{label}</span>
      {icon}
    </motion.button>
  )

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b-4 border-amber-200/80 bg-white/80 px-4 py-3 shadow-[0_6px_20px_rgba(15,23,42,0.06)] backdrop-blur-md sm:px-6"
    >
      <div className="flex min-w-0 items-center gap-3">
        {showBack && onBack && makeNavButton(<ChevronLeft size={22} strokeWidth={2.5} />, 'Kembali', onBack)}

        {logo ? (
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-amber-400 bg-amber-300 shadow-[0_4px_0_rgba(245,158,11,0.35)]">
              <Sparkles size={20} strokeWidth={2.6} className="text-indigo-950" />
            </div>
            <div className="leading-none">
              <p className="text-lg font-black tracking-tight text-indigo-950">SAKA TIKA</p>
              <p className="mt-1 text-[11px] font-bold text-slate-500">Mengenal Huruf</p>
            </div>
          </div>
        ) : (
          <div className="min-w-0">
            {title && (
              <h2 className="truncate text-lg font-black leading-tight tracking-tight text-indigo-950 sm:text-xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="truncate text-xs font-semibold text-slate-600 sm:text-sm">{description}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {showHome && onHome && makeNavButton(<Home size={22} strokeWidth={2.5} />, 'Beranda', onHome)}
        {showAudio && <AudioController size="md" />}
      </div>
    </motion.header>
  )
}
