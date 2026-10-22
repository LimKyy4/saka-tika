/**
 * CuteHeader - Header navigasi seru ala dunia anak.
 * Tampilkan judul, deskripsi, tombol navigasi, dan pengatur audio.
 * Header non-obstructive dengan backdrop blur dan spacer konten.
 */

import { motion } from 'framer-motion'
import { ChevronLeft, Home, Sparkles, BookOpen } from 'lucide-react'
import { useAudio } from '../../hooks/useAudio'
import { AudioController } from './AudioController'

export const CuteHeader = ({
  title,
  description,
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
      className="p-3 rounded-2xl bg-slate-50 border-4 border-slate-200 text-slate-700 font-bold hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 transition-all active:translate-y-1 active:shadow-none shadow-[0_6px_0_0_rgba(0,0,0,0.08)]"
      aria-label={label}
      title={label}
    >
      <span className="sr-only">{label}</span>
      {icon}
    </motion.button>
  )

  return (
    <motion.div
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b-6 border-slate-100 shadow-[0_6px_0_0_rgba(0,0,0,0.05)] sticky top-0 z-50"
    >
      <div className="flex items-center gap-3">
        {showBack && onBack && makeNavButton(<ChevronLeft size={24} strokeWidth={2.5} />, 'Kembali', onBack)}
        <div>
          {title && (
            <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight tracking-tight">
              {title}
            </h2>
          )}
          {description && <p className="text-sm md:text-base font-semibold text-slate-600">{description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showHome && onHome && makeNavButton(<Home size={24} strokeWidth={2.5} />, 'Beranda', onHome)}
        {showAudio && <AudioController className="" size="md" />}
      </div>
    </motion.div>
  )
}