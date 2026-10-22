/**
 * MenuDashboard - Halaman menu utama: header non-obstructive, sapaan maskot,
 * dan grid 5 kartu modul chunky 3D dengan tema pastel.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Pencil, Search, Keyboard, Sparkles } from 'lucide-react'
import { CuteHeader } from '../common/CuteHeader'
import { ModuleCard } from './ModuleCard'
import { modulesData } from '../../data/modulesData'
import { AnimatedBackground } from '../common/AnimatedBackground'
import { FlyingAnimal } from '../common/FlyingAnimal'
import { MascotSakaTika } from '../common/MascotSakaTika'

const ICON_MAP = {
  BookOpen,
  Pencil,
  Search,
  Keyboard,
  Sparkles,
}

const STORAGE_KEY = 'saka-tika-total-stars'

const readTotalStars = () => {
  try {
    const parsed = Number(window.localStorage.getItem(STORAGE_KEY))
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
  } catch {
    return 0
  }
}

export const MenuDashboard = ({ onBackToHome, onSelectModule }) => {
  const modules = modulesData.map((module) => ({
    ...module,
    IconComponent: ICON_MAP[module.icon],
  }))
  const totalStars = readTotalStars()

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
        stars={totalStars}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-24 sm:px-6">
        {/* Sapaan maskot */}
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

        {/* Grid modul */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 * index, ease: 'easeOut' }}
              className="h-full"
            >
              <ModuleCard module={module} onSelect={onSelectModule} />
            </motion.div>
          ))}
        </div>

        <p className="mt-10 flex items-center justify-center gap-1.5 text-center text-xs font-bold text-slate-500">
          <Sparkles size={13} strokeWidth={2.5} className="text-amber-500" aria-hidden="true" />
          Pilih satu kartu untuk mulai bermain dan belajar huruf.
        </p>
      </div>
    </motion.div>
  )
}
