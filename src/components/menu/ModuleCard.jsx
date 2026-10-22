/**
 * ModuleCard - Kartu modul bergaya mainan chunky 3D untuk carousel cover-flow 1-row.
 * Skala, opacity, dan zIndex dinamis berdasarkan posisi relatif terhadap modul tengah.
 * Drag & touch-swipe support via Framer Motion.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ChevronRight, Pencil, Search, Keyboard, Sparkles } from 'lucide-react'
import { useAudio } from '../../hooks/useAudio'

/* Variasi skala & opacity per kartu berdasarkan posisinya di carousel.
   activeIndex: indeks modul yang sedang di tengah (0..4).
   idx: indeks kartu saat ini (0..4).
   Perbedan offset = idx - activeIndex: -2, -1, 0, 1, 2.
*/

const getCardVariants = (activeIndex, idx) => {
  const offset = idx - activeIndex // -2, -1, 0, 1, 2
  const isCenter = offset === 0
  const isNear = Math.abs(offset) === 1
  const isFar = Math.abs(offset) >= 2

  /* Skala: tengah 110%, dekat 95%, jauh 85% */
  let scale
  if (isCenter) scale = 1.1
  else if (isNear) scale = 0.95
  else scale = 0.85

  /* Opacity: tengah 100%, dekat 80%, jauh 50% */
  let opacity
  if (isCenter) opacity = 1
  else if (isNear) opacity = 0.8
  else opacity = 0.5

  /* Z-index: di atas jika tengah, di bawah jika sisi/jauh */
  let zIndex
  if (isCenter) zIndex = 100
  else if (isNear) zIndex = 80
  else zIndex = 60

  return { scale, opacity, zIndex }
}

/* Gaya hover floating untuk ikon modul */
const iconVariant = {
  scale: [1, 1.05, 1],
  transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
}

export const ModuleCard = ({ module, onSelect, activeIndex, idx }) => {
  const { playSfx } = useAudio()

  const handleClick = () => {
    playSfx('click')
    onSelect(module.id)
  }

  /* Dapatkan varian skala/opacity/zIndex berdasarkan posisinya */
  const variants = getCardVariants(activeIndex, idx)

  return (
    <motion.div
      ref={null}
      index={idx}
      className="flex-shrink-0 w-[140px] flex-col items-center rounded-3xl border-4 border-b-8 p-6 text-left transition-all duration-300 group-pointer-events-none"
      drag="x"
      dragConstraints={{ left: 0, right: (5 - 1) * 140 }}
      onDragStart={(e) => {
        e.currentTarget.style.userSelect = 'none'
      }}
      onDragEnd={(e) => {
        e.currentTarget.style.userSelect = ''
      }}
    >
      {/* Ikon modul mengambang halus */}
      <motion.div
        className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white/70 shadow-md ${module.iconBg}`}
        animate={iconVariant}
      >
        <module.iconComponent size={34} strokeWidth={2.6} className={module.iconColor} aria-hidden="true" />
      </motion.div>

      {/* Judul & deskripsi */}
      <h3 className="relative mt-4 text-xl font-black leading-tight text-indigo-950 sm:text-2xl">
        {module.title}
      </h3>
      <p className="relative mb-4 mt-1 text-xs font-bold leading-relaxed text-slate-700 sm:text-sm">
        {module.description}
      </p>

      {/* Tombol BUKA MODUL – hanya muncul di kartu tengah */}
      {idx === activeIndex && (
        <motion.div
          className="relative mt-5 flex w-full items-center justify-between rounded-2xl border-b-4 border-amber-500 bg-amber-400 px-6 py-3 shadow-lg transition-colors duration-200 group-hover:bg-amber-300"
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-sm font-black tracking-wide text-indigo-950">BUKA MODUL</span>
          <motion.span className="flex items-center">
            <ChevronRight size={20} strokeWidth={3} className="text-indigo-950" aria-hidden="true" />
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  )
}