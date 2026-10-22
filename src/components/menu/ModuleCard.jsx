/**
 * ModuleCard - Kartu modul bergaya mainan chunky 3D toy dengan warna ultra-vibrant.
 * Ukuran fixed, badge ikon floating, tombol BUKA MODUL 3D tebal.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ChevronRight, Pencil, Search, Keyboard, Sparkles, Star } from 'lucide-react'
import { useAudio } from '../../hooks/useAudio'

const ICON_MAP = {
  BookOpen,
  Pencil,
  Search,
  Keyboard,
  Sparkles,
}

const iconFloatVariant = {
  y: [0, -8, 0],
  transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
}

const sparkleVariant = {
  opacity: [0.4, 1, 0.4],
  scale: [0.8, 1.2, 0.8],
  transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
}

export const ModuleCard = ({ module, onSelect, isCenter, isSide, onClickSide }) => {
  const { playSfx } = useAudio()
  const IconComponent = ICON_MAP[module.icon || module.iconName]

  const handleClick = () => {
    playSfx('click')
    if (isCenter) {
      onSelect(module.id)
    } else if (isSide && onClickSide) {
      onClickSide()
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: isCenter ? 1.05 : 0.95,
        opacity: isCenter ? 1 : 0.8,
        zIndex: isCenter ? 20 : 10,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      whileHover={isCenter ? { y: -6 } : { y: -4 }}
      whileTap={{ scale: isCenter ? 1.0 : 0.9, y: 2 }}
      onClick={handleClick}
      className={`w-72 sm:w-80 h-[420px] rounded-3xl border-4 border-b-8 ${
        module.bgColor || module.cardBg
      } ${module.borderColor} ${module.borderBottomColor || module.edgeColor} shadow-2xl flex flex-col justify-between relative overflow-hidden cursor-pointer`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      aria-label={`Buka modul ${module.title}`}
    >
      {/* Badge Ikon Floating di pojok atas */}
      <div className="absolute -top-5 -right-5">
        <motion.div
          className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white/90 shadow-xl ${
            module.iconBg
          }`}
          animate={iconFloatVariant}
        >
          <IconComponent size={32} strokeWidth={2.8} className={module.iconColor} aria-hidden="true" />
        </motion.div>
        {/* Partikel kilauan bintang */}
        <motion.span className="absolute -top-1 -right-1" animate={sparkleVariant}>
          <Star size={18} strokeWidth={2.5} className="text-amber-400" aria-hidden="true" />
        </motion.span>
      </div>

      {/* Hiasan lembut di sudut kartu */}
      <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl ${module.glowColor}`} />

      {/* Konten utama */}
      <div className="relative flex-1 flex flex-col justify-start pt-8">
        <h3 className="text-2xl sm:text-3xl font-black leading-tight text-indigo-950 mb-3">
          {module.title}
        </h3>
        <p className="text-sm sm:text-base font-bold leading-relaxed text-slate-900">
          {module.description}
        </p>
      </div>

      {/* Tombol BUKA MODUL - hanya untuk kartu tengah */}
      {isCenter && (
        <motion.div
          className="relative mt-auto w-full flex items-center justify-between bg-amber-400 hover:bg-amber-300 border-b-4 border-amber-500 rounded-2xl text-indigo-950 font-black text-base py-3 px-6 shadow-lg active:translate-y-1 active:border-b-0 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="tracking-wide">BUKA MODUL</span>
          <motion.span whileHover={{ x: 4 }}>
            <ChevronRight size={22} strokeWidth={3} aria-hidden="true" />
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ModuleCard
