/**
 * ModuleCard - Kartu modul persegi (square) chunky 3D toy.
 * Semua konten (ikon, judul, deskripsi, tombol) berada tepat di tengah kotak.
 * Kartu tengah: membesar, bercahaya emas, dan melayang halus.
 * Kartu sisi: mengecil, sedikit pudar, dan miring 3D (rotateY).
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
  transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
}

const sparkleVariant = {
  opacity: [0.35, 1, 0.35],
  scale: [0.8, 1.2, 0.8],
  transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
}

export const ModuleCard = ({ module, onSelect, isCenter, isSide, side, onClickSide }) => {
  const { playSfx } = useAudio()
  const IconComponent = ICON_MAP[module.iconName || module.icon]

  const handleClick = () => {
    playSfx('click')
    if (isCenter) {
      onSelect(module.id)
    } else if (isSide && onClickSide) {
      onClickSide()
    }
  }

  const rotateY = isCenter ? 0 : side === 'left' ? -12 : 12

  return (
    <motion.div
      animate={{
        rotateY,
        scale: isCenter ? 1.05 : 0.9,
        opacity: isCenter ? 1 : 0.75,
        zIndex: isCenter ? 30 : 10,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{ transformStyle: 'preserve-3d' }}
      className="shrink-0"
    >
      {/* Float halus khusus kartu tengah */}
      <motion.div
        animate={{ y: isCenter ? [0, -6, 0] : 0 }}
        transition={
          isCenter
            ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
      >
        <motion.div
          whileHover={{ y: -6, scale: isCenter ? 1.05 : 0.9 }}
          whileTap={{ scale: isCenter ? 1.02 : 0.87 }}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleClick()
            }
          }}
          aria-label={isCenter ? `Buka modul ${module.title}` : `Tampilkan modul ${module.title}`}
          className={`w-72 sm:w-80 h-72 sm:h-80 aspect-square rounded-3xl border-4 border-b-8 p-6 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden cursor-pointer ${module.bgColor || module.cardBg} ${module.borderColor} ${module.borderBottomColor || module.edgeColor} ${isCenter ? 'ring-4 ring-amber-300/70' : ''}`}
        >
          {/* Hiasan glow lembut */}
          <div
            className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl ${module.glowColor}`}
          />

          {/* Kilauan bintang */}
          <motion.span
            className="pointer-events-none absolute right-4 top-4"
            animate={sparkleVariant}
            aria-hidden="true"
          >
            <Star size={18} strokeWidth={2.5} className="text-amber-400" />
          </motion.span>

          {/* Konten tengah */}
          <motion.div
            className={`relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white/90 shadow-lg ${module.iconBg}`}
            animate={iconFloatVariant}
            aria-hidden="true"
          >
            <IconComponent size={26} strokeWidth={2.8} className={module.iconColor} />
          </motion.div>

          <h3 className="relative my-2 text-xl sm:text-2xl font-black leading-tight text-indigo-950">
            {module.title}
          </h3>

          <p className="relative mb-3 text-slate-800 font-bold text-xs sm:text-sm line-clamp-2 max-w-[15rem]">
            {module.description}
          </p>

          {isCenter ? (
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex items-center justify-center gap-2 rounded-2xl border-b-4 border-amber-500 bg-amber-400 px-6 py-2.5 text-sm font-black text-indigo-950 shadow-md transition-colors duration-200 hover:bg-amber-300"
            >
              <span>BUKA MODUL</span>
              <motion.span whileHover={{ x: 3 }} className="flex items-center">
                <ChevronRight size={18} strokeWidth={3} aria-hidden="true" />
              </motion.span>
            </motion.div>
          ) : (
            <div className="relative flex items-center justify-center gap-2 rounded-2xl border-2 border-white/80 bg-white/50 px-5 py-2.5 text-sm font-black text-indigo-900 shadow-sm">
              <span>LIHAT</span>
              <ChevronRight
                size={16}
                strokeWidth={3}
                className={side === 'left' ? 'rotate-180' : ''}
                aria-hidden="true"
              />
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default ModuleCard