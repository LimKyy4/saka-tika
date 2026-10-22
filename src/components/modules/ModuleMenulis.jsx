/**
 * ModuleMenulis - Halaman Utama Modul 2 (Ayo Menulis Huruf).
 *
 * Tata letak:
 *  - Atas   : CuteHeader + bar pemilih huruf A-Z
 *  - Tengah : papan tulis (TracingCanvas) + kotak petunjuk maskot
 *  - Bawah  : control bar (warna, hapus, prev/next)
 */

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Volume2 } from 'lucide-react'
import { alphabetData } from '../../data/alphabetData'
import { CuteHeader } from '../common/CuteHeader'
import { TracingCanvas } from './menulis/TracingCanvas'
import { LetterSelector } from './menulis/LetterSelector'
import { RewardModal } from './menulis/RewardModal'
import { playLetterAudio } from '../../utils/textToSpeech'
import { useAudio } from '../../hooks/useAudio'

export const ModuleMenulis = ({ onBackToMenu }) => {
  const [currentLetterId, setCurrentLetterId] = useState('A')
  const [completedLetters, setCompletedLetters] = useState(() => new Set())
  const [rewardOpen, setRewardOpen] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const { playSfx } = useAudio()

  const currentIndex = alphabetData.findIndex((item) => item.id === currentLetterId)
  const currentLetter = alphabetData[currentIndex] || alphabetData[0]
  const isCompleted = completedLetters.has(currentLetter.id)

  const selectLetter = (id) => {
    const nextLetter = alphabetData.find((item) => item.id === id)
    if (!nextLetter) return
    setCurrentLetterId(nextLetter.id)
    setRewardOpen(false)
    playLetterAudio(nextLetter)
  }

  const moveBy = (step) => {
    const next =
      alphabetData[(currentIndex + step + alphabetData.length) % alphabetData.length]
    selectLetter(next.id)
  }

  const handleComplete = () => {
    setCompletedLetters((prev) => {
      const next = new Set(prev)
      next.add(currentLetter.id)
      return next
    })

    confetti({
      particleCount: 160,
      spread: 110,
      origin: { y: 0.55 },
      colors: ['#FBBF24', '#FDE047', '#F472B6', '#34D399', '#60A5FA'],
    })

    setRewardOpen(true)
  }

  const handleTryAgain = () => {
    /* Lepas status selesai lalu paksa kanvas bersih & terbuka kembali */
    setCompletedLetters((prev) => {
      const next = new Set(prev)
      next.delete(currentLetter.id)
      return next
    })
    setResetKey((key) => key + 1)
    setRewardOpen(false)
  }

  const handleNextLetter = () => {
    moveBy(1)
    playSfx('transition')
  }

  const hint = isCompleted
    ? `Hebat! Kamu sudah berhasil menulis huruf ${currentLetter.capital}. Pilih huruf lain untuk melanjutkan.`
    : `Ayo telusuri garis putus-putus huruf ${currentLetter.capital} pakai mouse atau jarimu, mulai dari angka 1.`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-100 pb-12"
    >
      <CuteHeader
        title="Ayo Menulis Huruf"
        description="Telusuri garis putus-putus dengan seru"
        onBack={onBackToMenu}
        showHome={false}
      />

      <div className="mx-auto max-w-3xl px-4 pt-5">
        {/* Huruf aktif + tombol dengar */}
        <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border-2 border-amber-200 bg-white px-4 py-3 shadow-[0_6px_0_rgba(0,0,0,0.05)]">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black leading-none text-indigo-900">
              {currentLetter.capital}
            </span>
            <span className="text-xl font-extrabold text-indigo-600">
              {currentLetter.small}
            </span>
            <span className="ml-2 text-sm font-bold uppercase tracking-wider text-slate-700">
              {currentLetter.word}
            </span>
          </div>

          <button
            type="button"
            onClick={() => playLetterAudio(currentLetter)}
            className="flex shrink-0 items-center gap-1 rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-200"
            aria-label={`Dengarkan huruf ${currentLetter.capital}`}
          >
            <Volume2 size={15} strokeWidth={2.6} />
            Dengar
          </button>
        </div>

        {/* Bar pemilih huruf */}
        <p className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-slate-600">
          Pilih Huruf
        </p>
        <LetterSelector
          letters={alphabetData}
          currentId={currentLetterId}
          completedLetters={completedLetters}
          onSelect={selectLetter}
        />

        {/* Papan tulis + petunjuk + control bar */}
        <div className="mt-5">
          <TracingCanvas
            letter={currentLetter}
            isCompleted={isCompleted}
            onComplete={handleComplete}
            onPrev={() => moveBy(-1)}
            onNext={() => moveBy(1)}
            hint={hint}
            resetKey={resetKey}
          />
        </div>
      </div>

      <AnimatePresence>
        {rewardOpen && (
          <RewardModal
            letter={currentLetter.capital}
            onClose={handleTryAgain}
            onNext={handleNextLetter}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
