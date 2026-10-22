/**
 * ModuleMengenal - Halaman Modul 1 (Mengenal Huruf A-Z).
 * Grid 26 kartu huruf rapi, simetris, responsif, dan tidak tertutup header.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { alphabetData, findLetter } from '../../data/alphabetData'
import { CuteHeader } from '../common/CuteHeader'
import { LetterCard } from './mengenal/LetterCard'
import { LetterModal } from './mengenal/LetterModal'

export const ModuleMengenal = ({ onBackToMenu }) => {
  const [currentId, setCurrentId] = useState('A')
  const [modalOpen, setModalOpen] = useState(false)

  const currentLetter = findLetter(currentId)

  const handleSelectLetter = (letter) => {
    setCurrentId(letter.id)
    setModalOpen(true)
  }

  const handleNext = () => {
    setCurrentId((prev) => {
      const idx = alphabetData.findIndex((item) => item.id === prev)
      return alphabetData[(idx + 1) % alphabetData.length].id
    })
  }

  const handlePrev = () => {
    setCurrentId((prev) => {
      const idx = alphabetData.findIndex((item) => item.id === prev)
      return alphabetData[(idx - 1 + alphabetData.length) % alphabetData.length].id
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-emerald-50 pb-12">
      <CuteHeader
        title="Mengenal Huruf A-Z"
        description="Pilih huruf untuk mendengar bunyinya"
        onBack={onBackToMenu}
        showHome={false}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        {/* Petunjuk singkat */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-5 flex items-center gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3"
        >
          <Sparkles
            size={20}
            strokeWidth={2.5}
            className="shrink-0 text-amber-600"
            aria-hidden="true"
          />
          <p className="text-sm font-bold text-amber-900">
            Klik kartu huruf untuk melihat detail, atau tekan tombol Dengar
            untuk mendengarkan bunyinya.
          </p>
        </motion.div>

        {/* Grid 26 kartu alfabet */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {alphabetData.map((letter) => (
            <LetterCard
              key={letter.id}
              letter={letter}
              isActive={currentId === letter.id}
              onSelect={handleSelectLetter}
            />
          ))}
        </div>
      </div>

      {modalOpen && currentLetter && (
        <LetterModal
          letter={currentLetter}
          onClose={() => setModalOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  )
}
