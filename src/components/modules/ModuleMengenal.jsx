/**
 * ModuleMengenal - Modul 1: Mengenal Huruf A-Z.
 * Grid 4x4 per halaman (Slide 1: A-P, Slide 2: Q-Z) dengan navigasi panah 3D
 * dan indikator halaman. Semua muat dalam 1 layar tanpa scrollbar vertikal.
 */

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles, Star } from 'lucide-react'
import { alphabetPages, findLetter } from '../../data/alphabetData'
import { CuteHeader } from '../common/CuteHeader'
import { LetterCard } from './mengenal/LetterCard'
import { LetterModal } from './mengenal/LetterModal'
import { useAudio } from '../../hooks/useAudio'

const ARROW_CLASS =
  'flex shrink-0 items-center justify-center rounded-full border-4 border-b-8 border-amber-500 bg-amber-400 p-2 text-indigo-950 shadow-xl transition-all duration-200 hover:bg-amber-300 active:translate-y-1 active:border-b-0 sm:p-3'

export const ModuleMengenal = ({ onBackToMenu }) => {
  const { playSfx } = useAudio()
  const [currentId, setCurrentId] = useState('A')
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(0)

  const currentLetter = findLetter(currentId)
  const pageCount = alphabetPages.length

  const handleSelectLetter = (letter) => {
    setCurrentId(letter.id)
    setModalOpen(true)
  }

  const handleNextLetter = () => {
    setCurrentId((prev) => {
      const flat = alphabetPages.flat()
      const idx = flat.findIndex((item) => item.id === prev)
      return flat[(idx + 1) % flat.length].id
    })
  }

  const handlePrevLetter = () => {
    setCurrentId((prev) => {
      const flat = alphabetPages.flat()
      const idx = flat.findIndex((item) => item.id === prev)
      return flat[(idx - 1 + flat.length) % flat.length].id
    })
  }

  const changePage = (nextPage) => {
    playSfx('click')
    setPage((nextPage + pageCount) % pageCount)
  }

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-gradient-to-b from-sky-100 via-white to-emerald-50">
      <CuteHeader
        title="Mengenal Huruf A-Z"
        description="Pilih huruf untuk melihat dan mendengar bunyinya"
        onBack={onBackToMenu}
        showHome={false}
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-3 pb-2 pt-2 sm:px-6">
        {/* Petunjuk ringkas */}
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="mb-2 flex flex-none items-center justify-center gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50 px-3 py-1 sm:justify-start"
        >
          <Sparkles size={16} strokeWidth={2.5} className="shrink-0 text-amber-600" aria-hidden="true" />
          <p className="text-[11px] font-bold text-amber-900 sm:text-sm">
            Klik kartu huruf untuk detail, atau tekan Dengar untuk bunyinya.
          </p>
        </motion.div>

        {/* Carousel grid 4x4 */}
        <div className="flex min-h-0 flex-1 items-center gap-2 sm:gap-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changePage(page - 1)}
            className={ARROW_CLASS}
            aria-label="Halaman huruf sebelumnya"
          >
            <ChevronLeft size={22} strokeWidth={3} aria-hidden="true" />
          </motion.button>

          <div className="min-h-0 flex-1 self-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={page}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="mx-auto grid w-full max-w-5xl grid-cols-4 auto-rows-[clamp(92px,16vh,148px)] gap-2 sm:gap-3"
              >
                {alphabetPages[page].map((letter, index) => (
                  <LetterCard
                    key={letter.id}
                    letter={letter}
                    index={index}
                    isActive={currentId === letter.id}
                    onSelect={handleSelectLetter}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changePage(page + 1)}
            className={ARROW_CLASS}
            aria-label="Halaman huruf selanjutnya"
          >
            <ChevronRight size={22} strokeWidth={3} aria-hidden="true" />
          </motion.button>
        </div>

        {/* Indikator halaman */}
        <div className="flex flex-none items-center justify-center gap-3 pt-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 sm:text-xs">
            {page === 0 ? 'A - P' : 'Q - Z'}
          </span>
          {Array.from({ length: pageCount }, (_, i) => (
            <motion.button
              key={i}
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={() => changePage(i)}
              aria-label={`Buka halaman ${i + 1}`}
              aria-current={page === i}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-amber-300 bg-amber-100 transition-colors hover:bg-amber-200"
            >
              <Star
                size={14}
                strokeWidth={2.5}
                className={page === i ? 'fill-amber-400 text-amber-500' : 'text-amber-300'}
                aria-hidden="true"
              />
            </motion.button>
          ))}
        </div>
      </div>

      {modalOpen && currentLetter && (
        <LetterModal
          letter={currentLetter}
          onClose={() => setModalOpen(false)}
          onNext={handleNextLetter}
          onPrev={handlePrevLetter}
        />
      )}
    </div>
  )
}