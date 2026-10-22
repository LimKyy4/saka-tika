import { motion } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'

export const ModuleCard = ({ module, onSelect }) => {
  const { playSfx } = useAudio()

  const handleClick = () => {
    playSfx('click')
    onSelect(module.id)
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="group relative rounded-3xl border-4 p-6 bg-white cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${module.iconBg} ${module.iconColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <module.IconComponent size={26} strokeWidth={2.5} />
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-bold text-slate-800 leading-tight">{module.title}</h3>
        <p className="mt-1 text-sm text-slate-500">{module.description}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-100/50 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Buka Modul</span>
        <motion.span whileHover={{ rotate: 45 }} className="w-6 h-6 text-slate-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </motion.span>
      </div>
      <div className="absolute inset-0 rounded-3xl border-4 border-transparent group-hover:border-amber-300/70 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  )
}
