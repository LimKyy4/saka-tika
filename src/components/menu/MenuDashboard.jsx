/**
 * MenuDashboard - Halaman menu utama: 3-Card Centered Viewport Carousel
 * Side 3D Toy Arrow Navigation, Dynamic Mascot Greetings, Ultra-Vibrant Colors
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CuteHeader } from '../common/CuteHeader'
import { ModuleCard } from './ModuleCard'
import { modulesData } from '../../data/modulesData'
import { AnimatedBackground } from '../common/AnimatedBackground'
import { FlyingAnimal } from '../common/FlyingAnimal'
import { MascotSakaTika } from '../common/MascotSakaTika'

export const MenuDashboard = ({ onBackToHome, onSelectModule }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const totalModules = modulesData.length

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalModules) % totalModules)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalModules)
  }

  const getCardIndex = (offset) => {
    return (activeIndex + offset + totalModules) % totalModules
  }

  const leftIndex = getCardIndex(-1)
  const centerIndex = getCardIndex(0)
  const rightIndex = getCardIndex(1)

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

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-24 sm:px-6">
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

          <AnimatePresence mode="wait">
            <motion.div
              key={centerIndex}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="relative w-full max-w-md rounded-2xl border-4 border-amber-300 bg-amber-100 p-4 text-center shadow-md"
            >
              <p className="text-sm font-bold leading-relaxed text-indigo-950 sm:text-base">
                {modulesData[centerIndex].mascotGreeting}
              </p>
              <span
                aria-hidden="true"
                className="absolute -left-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border-b-4 border-l-4 border-amber-300 bg-amber-100 sm:block"
              />
            </motion.div>
          </AnimatePresence>
        </section>

        {/* 3-Card Centered Viewport Carousel */}
        <section className="relative flex items-center justify-between gap-2 sm:gap-6 max-w-7xl mx-auto overflow-hidden">
          {/* Tombol Panah Kiri 3D Toy */}
          <motion.button
            type="button"
            onClick={handlePrev}
            className="bg-amber-400 hover:bg-amber-300 border-4 border-b-8 border-amber-500 text-indigo-950 rounded-full p-4 sm:p-5 shadow-2xl active:translate-y-2 active:border-b-0 cursor-pointer transition-all duration-200 z-30 flex items-center justify-center shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Modul sebelumnya"
          >
            <ChevronLeft size={28} strokeWidth={3} className="text-indigo-950" aria-hidden="true" />
          </motion.button>

          {/* Container 3 Kartu dengan kedalaman 3D */}
          <div
            className="flex items-center justify-center gap-6 sm:gap-8 py-6 flex-1"
            style={{ perspective: '1200px' }}
          >
            {/* Kartu Sisi Kiri */}
            <ModuleCard
              module={modulesData[leftIndex]}
              onSelect={onSelectModule}
              isCenter={false}
              isSide={true}
              side="left"
              onClickSide={handlePrev}
            />

            {/* Kartu Tengah */}
            <ModuleCard
              module={modulesData[centerIndex]}
              onSelect={onSelectModule}
              isCenter={true}
              isSide={false}
              side="center"
            />

            {/* Kartu Sisi Kanan */}
            <ModuleCard
              module={modulesData[rightIndex]}
              onSelect={onSelectModule}
              isCenter={false}
              isSide={true}
              side="right"
              onClickSide={handleNext}
            />
          </div>

          {/* Tombol Panah Kanan 3D Toy */}
          <motion.button
            type="button"
            onClick={handleNext}
            className="bg-amber-400 hover:bg-amber-300 border-4 border-b-8 border-amber-500 text-indigo-950 rounded-full p-4 sm:p-5 shadow-2xl active:translate-y-2 active:border-b-0 cursor-pointer transition-all duration-200 z-30 flex items-center justify-center shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Modul selanjutnya"
          >
            <ChevronRight size={28} strokeWidth={3} className="text-indigo-950" aria-hidden="true" />
          </motion.button>
        </section>

        {/* Indikator Gelembung Bintang */}
        <div className="mt-6 flex justify-center gap-2">
          {modulesData.map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{
                scale: i === centerIndex ? 1.25 : 0.8,
                opacity: i === centerIndex ? 1 : 0.5,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                i === centerIndex
                  ? 'bg-amber-400 border-amber-600 shadow-lg'
                  : 'bg-amber-200 border-amber-300'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}