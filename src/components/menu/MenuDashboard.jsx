/**
 * MenuDashboard - Halaman menu utama: header non-obstructive, sapaan maskot,
 * dan 1-row 3D cover-flow carousel untuk 5 modul dengan gestur drag/swipe.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CuteHeader } from '../common/CuteHeader'
import { ModuleCard } from './ModuleCard'
import { modulesData } from '../../data/modulesData'
import { AnimatedBackground } from '../common/AnimatedBackground'
import { FlyingAnimal } from '../common/FlyingAnimal'
import { MascotSakaTika } from '../common/MascotSakaTika'

const NAV_BUTTON_CLASS =
  'bg-amber-400 hover:bg-amber-300 border-b-4 border-amber-500 rounded-full p-4 shadow-xl active:translate-y-1 active:border-b-0'

const indicatorClass = (
  i,
  activeIndex,
  baseClass =
    'w-8 h-8 rounded-full bg-amber-200 border-2 border-amber-300 transition-all duration-300'
) => {
  if (i === activeIndex) {
    return `${baseClass} bg-amber-400 border-amber-500 shadow-lg scale-110`
  }
  return `${baseClass} hover:bg-amber-300 hover:scale-105`
}

export const MenuDashboard = ({ onBackToHome, onSelectModule }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const modules = modulesData.map((module) => ({
    ...module,
    IconComponent: module.icon,
  }))

  const handleLeft = () => {
    setActiveIndex((i) => Math.max(i - 1, 0))
  }

  const handleRight = () => {
    setActiveIndex((i) => Math.min(i + 1, modules.length - 1))
  }

  const prevClass =
    'w-10 h-10 rounded-full bg-amber-200 border-2 border-amber-300 transition-all duration-300 hover:bg-amber-300 hover:scale-110'
  const nextClass =
    'w-10 h-10 rounded-full bg-amber-200 border-2 border-amber-300 transition-all duration-300 hover:bg-amber-300 hover:scale-110'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen overflow-hidden pb-16"
    >
      <AnimatedBackground />
      <FlyingAnimal />

      <CuteHeader
        title="Menu Utama"
        description="Pilih modul favoritmu untuk belajar!"
        onBack={onBackToHome}
        showHome={false}
        showStars
        stars={0}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-24 sm:px-6">
        {/* Sapaan maskot dinamis berdasarkan modul aktif */}
        <section className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <motion.div
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="w-[170px] shrink-0"
          >
            <MascotSakaTika compact />
          </motion.div>

          <motion.div
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="relative w-full max-w-md rounded-2xl border-4 border-amber-300 bg-amber-100 p-4 text-center shadow-md"
          >
            <p className="text-sm font-bold leading-relaxed text-indigo-950 sm:text-base">
              Ayo pilih modul mana yang mau kamu mainkan hari ini!
            </p>
            <span
              aria-hidden="true"
              className="absolute -left-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border-b-4 border-l-4 border-amber-300 bg-amber-100 sm:block"
            />
          </motion.div>
        </section>

        {/* 3D Cover-Flow Carousel */}
        <section className="relative">
          {/* Navigasi kiri */}
          <motion.button
            type="button"
            onClick={handleLeft}
            className={NAV_BUTTON_CLASS}
            aria-label="Modul sebelumnya"
            whileHover={{ scale: 0.95 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} strokeWidth={3} className="text-amber-950" aria-hidden="true" />
          </motion.button>

          <div
            className="relative flex overflow-x-auto scrollbar-none -mx-4 space-x-2 pb-4 sm:-mx-6 sm:pb-6"
            style={{ overflowX: 'auto', touchAction: 'pan-y' }
          }>
            {/* Setiap kartu modul dengan idx 0..4 */}
            {modules.map((module, idx) => (
              <motion.div
                key={module.id}
                ref={null}
                index={idx}
                className="flex shrink-0 w-64 flex-col items-center rounded-3xl border-4 border-b-8 p-6 text-left transition-all duration-300 group-pointer-events-none"
                drag="x"
                dragConstraints={{ left: 0, right: (modules.length - 1) * 140 }}
                onDragStart={(e) => {
                  e.currentTarget.style.userSelect = 'none'
                }}
                onDragEnd={(e) => {
                  e.currentTarget.style.userSelect = ''
                }}
              >
                <ModuleCard
                  module={module}
                  onSelect={onSelectModule}
                  activeIndex={activeIndex}
                  idx={idx}
                />
              </motion.div>
            ))}
          </div>

          {/* Navigasi kanan */}
          <motion.button
            type="button"
            onClick={handleRight}
            className={NAV_BUTTON_CLASS}
            aria-label="Modul selanjutnya"
            whileHover={{ scale: 0.95 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} strokeWidth={3} className="text-amber-950" aria-hidden="true" />
          </motion.button>
        </section>

        {/* Indikator 5 titik di bagian bawah */}
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: modules.length }, (_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: i === activeIndex ? 1 : 0.7, opacity: i === activeIndex ? 1 : 0.4 }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              className={indicatorClass(i, activeIndex)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}