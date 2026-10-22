/**
 * ModuleCard - Kartu modul bergaya mainan chunky 3D toy.
 * Sudut melengkung tebal, border pastel dengan bayangan 3D,
 * badge ikon floating, animasi press-down, tombol BUKA MODUL 3D.
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

const getCardVariants = (activeIndex, idx) => {
  const offset = idx - activeIndex
  const isCenter = offset === 0
  const isNear = Math.abs(offset) === 1
  const isFar = Math.abs(offset) >= 2

  let scale
  if (isCenter) scale = 1.1
  else if (isNear) scale = 0.95
  else scale = 0.85

  let opacity
  if (isCenter) opacity = 1
  else if (isNear) opacity = 0.8
  else opacity = 0.5

  let zIndex
  if (isCenter) zIndex = 100
  else if (isNear) zIndex = 80
  else zIndex = 60

  return { scale, opacity, zIndex }
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

export const ModuleCard = ({ module, onSelect, activeIndex, idx }) => {
  const { playSfx } = useAudio()
  const IconComponent = ICON_MAP[module.icon]

  const handleClick = () => {
    playSfx('click')
    onSelect(module.id)
  }

  const variants = getCardVariants(activeIndex, idx)
  const isCenter = idx === activeIndex

  return (
    <motion.div
      style={{
        transform: `scale(${variants.scale})`,
        opacity: variants.opacity,
        zIndex: variants.zIndex,
      }}
      className="flex-shrink-0 w-[160px] flex-col items-center rounded-3xl border-4 border-b-8 p-6 text-left transition-all duration-300 cursor-pointer"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ y: 2, scale: 0.98 }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick() } }}
      aria-label={`Buka modul ${module.title}`}
    >
      {/* Badge Ikon Floating di pojok atas */}
      <div className="absolute -top-4 -right-4">
        <motion.div
          className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white/80 shadow-lg ${module.iconBg}`}
          animate={iconFloatVariant}
        >
          <IconComponent size={28} strokeWidth={2.8} className={module.iconColor} aria-hidden="true" />
        </motion.div>
        {/* Partikel kilauan bintang di sekitar badge */}
        <motion.span
          className="absolute -top-1 -right-1"
          animate={sparkleVariant}
        >
          <Star size={16} strokeWidth={2.5} className="text-amber-400" aria-hidden="true" />
        </motion.span>
      </div>

      {/* Hiasan lembut di sudut kartu */}
      <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl ${module.glowColor}`} />

      {/* Judul Modul */}
      <h3 className="relative mt-6 text-xl font-black leading-tight text-indigo-950 sm:text-2xl">
        {module.title}
      </h3>

      {/* Deskripsi Modul */}
      <p className="relative mt-2 mb-6 text-xs font-bold leading-relaxed text-slate-700 sm:text-sm">
        {module.description}
      </p>

      {/* Tombol BUKA MODUL – hanya muncul di kartu tengah */}
      {isCenter && (
        <motion.div
          className="relative mt-auto flex w-full items-center justify-between rounded-2xl border-b-4 border-amber-500 bg-amber-400 px-5 py-3 shadow-lg transition-colors duration-200 hover:bg-amber-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-sm font-black tracking-wide text-indigo-950">BUKA MODUL</span>
          <motion.span
            className="flex items-center"
            whileHover={{ x: 3 }}
          >
            <ChevronRight size={20} strokeWidth={3} className="text-indigo-950" aria-hidden="true" />
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  )
}