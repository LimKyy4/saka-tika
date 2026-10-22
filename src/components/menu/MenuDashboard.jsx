/**
 * MenuDashboard - Halaman menu utama dengan 5 kartu modul 3D pastel dan ikon glow.
 */

import { motion } from 'framer-motion'
import { BookOpen, Pencil, Search, Keyboard, Sparkles } from 'lucide-react'
import { CuteHeader } from '../common/CuteHeader'
import { ModuleCard } from './ModuleCard'
import { modulesData } from '../../data/modulesData'
import { AnimatedBackground } from '../common/AnimatedBackground'

const ICON_MAP = {
  BookOpen,
  Pencil,
  Search,
  Keyboard,
  Sparkles,
}

export const MenuDashboard = ({ onBackToHome, onSelectModule }) => {
  const modules = modulesData.map((module) => ({
    ...module,
    IconComponent: ICON_MAP[module.icon],
  }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-emerald-50 py-8 relative overflow-hidden"
    >
      <AnimatedBackground />
      <CuteHeader
        title="Menu Utama"
        description="Pilih menu favoritmu untuk belajar mengenal huruf dengan seru!"
        onBack={onBackToHome}
        showHome={false}
      />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} onSelect={onSelectModule} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
