/**
 * ModuleCard - Kartu modul bergaya mainan chunky 3D.
 * Seluruh kartu dapat diklik, ikon melayang saat hover,
 * dan tombol "BUKA MODUL" bergaya tombol mainan fisik.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Sparkles } from 'lucide-react'
import { useAudio } from '../../hooks/useAudio'

const cardVariants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -8, scale: 1 },
  press: { y: 0, scale: 0.98 },
}

const iconVariants = {
  rest: { y: 0, rotate: 0 },
  hover: {
    y: [0, -7, 0],
    rotate: [-5, 5, -5],
    transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
  },
}

const arrowVariants = {
  rest: { x: 0 },
  hover: { x: 4 },
}

export const ModuleCard = ({ module, onSelect }) => {
  const { playSfx } = useAudio()

  const handleClick = () => {
    playSfx('click')
    onSelect(module.id)
  }

  return (
    <motion.button
      type="button"
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      whileTap="press"
      animate="rest"
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      onClick={handleClick}
      aria-label={`Buka modul ${module.title}`}
      className={`group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-3xl border-4 border-b-8 p-6 text-left shadow-xl transition-colors duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/50 ${module.cardBg} ${module.borderColor} ${module.edgeColor}`}
    >
      {/* Hiasan lembut di sudut */}
      <div className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl ${module.glowColor}`} />
      <Sparkles
        size={18}
        strokeWidth={2.5}
        aria-hidden="true"
        className={`pointer-events-none absolute right-4 top-4 opacity-40 ${module.iconColor}`}
      />

      {/* Ikon modul */}
      <motion.div
        variants={iconVariants}
        className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white/70 shadow-md ${module.iconBg}`}
      >
        <module.IconComponent size={30} strokeWidth={2.6} className={module.iconColor} aria-hidden="true" />
      </motion.div>

      {/* Judul & deskripsi */}
      <h3 className="relative mt-5 text-xl font-black leading-tight text-indigo-950 sm:text-2xl">
        {module.title}
      </h3>
      <p className="relative mb-6 mt-1 text-xs font-bold leading-relaxed text-slate-700 sm:text-sm">
        {module.description}
      </p>

      {/* Tombol mainan 3D */}
      <div className="relative mt-auto flex w-full items-center justify-between rounded-2xl border-b-4 border-amber-500 bg-amber-400 px-5 py-2.5 shadow-md transition-colors duration-200 group-hover:bg-amber-300">
        <span className="text-sm font-black tracking-wide text-indigo-950">BUKA MODUL</span>
        <motion.span variants={arrowVariants} className="flex items-center">
          <ChevronRight size={20} strokeWidth={3} className="text-indigo-950" aria-hidden="true" />
        </motion.span>
      </div>
    </motion.button>
  )
}
