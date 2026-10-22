import { motion } from 'framer-motion'
import { ChevronLeft, Home } from 'lucide-react'
import { useAudio } from '../../hooks/useAudio'
import { AudioController } from './AudioController'

export const HeaderNavigation = ({
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
      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
      aria-label={label}
      title={label}
    >
      <span className="sr-only">{label}</span>
      {icon}
    </motion.button>
  )

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-md border-b-4 border-slate-100 shadow-sm sticky top-0 z-20"
    >
      <div className="flex items-center gap-3">
        {showBack && onBack && makeNavButton(<ChevronLeft size={22} strokeWidth={2.5} />, 'Kembali', onBack)}
        <div>
          {title && <h2 className="text-xl font-bold text-slate-800 leading-tight">{title}</h2>}
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showHome && onHome && makeNavButton(<Home size={22} strokeWidth={2.5} />, 'Beranda', onHome)}
        {showAudio && <AudioController className="" size="md" />}
      </div>
    </motion.div>
  )
}
