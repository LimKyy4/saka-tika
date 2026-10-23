/**
 * ModuleMenulis - Modul 2: Ayo Menulis Huruf.
 *
 * Tata letak SATU LAYAR (tanpa scrollbar):
 *  - Header ringkas h-14
 *  - Grid 12 kolom: toolbar spidol (2) | papan tulis 3D (8) | navigasi huruf (2)
 *  - Footer: indikator langkah angka bercahaya + kemajuan + bar pemilih A-Z
 */

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eraser,
  Pencil,
  Sparkles,
  Volume2,
} from 'lucide-react'
import { alphabetData } from '../../data/alphabetData'
import { getLetterStrokeCount } from '../../utils/letterPaths'
import { CuteHeader } from '../common/CuteHeader'
import { TracingCanvas, MARKER_COLORS } from './menulis/TracingCanvas'
import { LetterSelector } from './menulis/LetterSelector'
import { RewardModal } from './menulis/RewardModal'
import { playLetterAudio } from '../../utils/textToSpeech'
import { useAudio } from '../../hooks/useAudio'

const CONFETTI_COLORS = ['#FBBF24', '#FDE047', '#F472B6', '#34D399', '#60A5FA']

const ToolButton = ({ icon: Icon, label, onClick, tone }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.94, y: 2 }}
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`flex w-full items-center justify-center gap-1.5 rounded-2xl border-4 border-b-8 px-1.5 py-2 text-[11px] font-black shadow-lg transition-colors duration-200 active:translate-y-1 active:border-b-0 sm:px-2 sm:text-xs ${tone}`}
  >
    <Icon size={16} strokeWidth={2.8} aria-hidden="true" />
    <span className="hidden sm:inline">{label}</span>
  </motion.button>
)

export const ModuleMenulis = ({ onBackToMenu }) => {
  const [currentLetterId, setCurrentLetterId] = useState('A')
  const [completedLetters, setCompletedLetters] = useState(() => new Set())
  const [rewardOpen, setRewardOpen] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const [brushColor, setBrushColor] = useState(MARKER_COLORS[0].value)
  const [progress, setProgress] = useState({ steps: [], completion: 0 })

  const { playSfx } = useAudio()

  /* Kunci scroll dokumen hanya selama Modul 2 aktif (modul lain tetap bebas). */
  useEffect(() => {
    const { documentElement: html, body } = document
    html.classList.add('module-no-scroll')
    body.classList.add('module-no-scroll')
    return () => {
      html.classList.remove('module-no-scroll')
      body.classList.remove('module-no-scroll')
    }
  }, [])

  const currentIndex = alphabetData.findIndex((item) => item.id === currentLetterId)
  const currentLetter = alphabetData[currentIndex] || alphabetData[0]
  const isCompleted = completedLetters.has(currentLetter.id)

  const stepCount = progress.steps.length || getLetterStrokeCount(currentLetter.id)
  const activeStepIndex = progress.steps.findIndex((item) => !item.done)

  const selectLetter = (id) => {
    const nextLetter = alphabetData.find((item) => item.id === id)
    if (!nextLetter) return
    setCurrentLetterId(nextLetter.id)
    setRewardOpen(false)
    setProgress({ steps: [], completion: 0 })
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
      startVelocity: 45,
      origin: { y: 0.55 },
      colors: CONFETTI_COLORS,
    })

    setRewardOpen(true)
  }

  const resetCanvas = () => {
    /* Lepas status selesai lalu paksa kanvas bersih & terbuka kembali */
    setCompletedLetters((prev) => {
      const next = new Set(prev)
      next.delete(currentLetter.id)
      return next
    })
    setResetKey((key) => key + 1)
    setRewardOpen(false)
    setProgress({ steps: [], completion: 0 })
  }

  const handleErase = () => {
    playSfx('click')
    resetCanvas()
  }

  const handleTryAgain = () => {
    playSfx('click')
    resetCanvas()
  }

  const handleNextLetter = () => {
    moveBy(1)
    playSfx('transition')
  }

  const handleListen = () => {
    playSfx('click')
    playLetterAudio(currentLetter)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex h-screen w-screen select-none flex-col justify-between overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 p-3"
    >
      {/* Header ringkas (fixed) + spacer setinggi h-14 */}
      <div className="h-14 flex-none">
        <CuteHeader
          compact
          title="Ayo Menulis Huruf"
          onBack={onBackToMenu}
          showHome={false}
        />
      </div>

      {/* Playground 12 kolom */}
      <div className="my-1 mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-cols-12 items-center justify-center gap-2 overflow-hidden sm:gap-3">
        {/* Kiri: spidol + hapus + dengar */}
        <aside className="col-span-2 flex h-full min-h-0 flex-col items-center justify-center gap-2 sm:gap-3">
          <div className="w-full max-w-[168px] rounded-3xl border-4 border-amber-200 bg-white/85 p-2 shadow-xl">
            <p className="text-center text-[9px] font-black uppercase tracking-widest text-slate-500 sm:text-[10px]">
              Spidol
            </p>
            <div className="mt-1.5 grid grid-cols-1 place-items-center gap-1.5 sm:grid-cols-2 sm:gap-2">
              {MARKER_COLORS.map((color) => {
                const selected = brushColor === color.value
                return (
                  <motion.button
                    key={color.value}
                    type="button"
                    whileTap={{ scale: 0.88 }}
                    onClick={() => {
                      setBrushColor(color.value)
                      playSfx('click')
                    }}
                    aria-label={`Pilih spidol ${color.label}`}
                    aria-pressed={selected}
                    title={color.label}
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full border-4 border-white transition-all duration-200 sm:h-10 sm:w-10 ${
                      selected
                        ? 'scale-110 ring-4 ring-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.85)]'
                        : 'shadow-md hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                  >
                    {selected && (
                      <CheckCircle
                        size={15}
                        strokeWidth={3}
                        className="text-white drop-shadow"
                        aria-hidden="true"
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>

          <div className="flex w-full max-w-[168px] flex-col gap-2">
            <ToolButton
              icon={Eraser}
              label="Hapus"
              onClick={handleErase}
              tone="border-rose-500 bg-rose-300 text-rose-950 hover:bg-rose-200"
            />
            <ToolButton
              icon={Volume2}
              label="Dengar"
              onClick={handleListen}
              tone="border-sky-500 bg-sky-300 text-sky-950 hover:bg-sky-200"
            />
          </div>
        </aside>

        {/* Tengah: papan tulis mainan 3D */}
        <section className="col-span-8 flex h-full min-h-0 items-center justify-center">
          <div className="relative flex aspect-square w-full max-w-[min(100%,calc(100vh_-_150px))] items-center justify-center overflow-hidden rounded-3xl border-8 border-amber-300 bg-amber-50 shadow-[0_14px_0_rgba(245,158,11,0.28),0_22px_45px_rgba(15,23,42,0.2)] ring-4 ring-white/70">
            <TracingCanvas
              letter={currentLetter}
              isCompleted={isCompleted}
              brushColor={brushColor}
              resetKey={resetKey}
              onComplete={handleComplete}
              onProgress={setProgress}
            />

            {/* Kilau magis di dua sudut papan */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3 z-10 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
              animate={{ opacity: [0.35, 1, 0.35], rotate: [0, 18, 0], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles size={18} strokeWidth={2.6} />
            </motion.span>
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 right-3 z-10 text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]"
              animate={{ opacity: [1, 0.35, 1], rotate: [0, -18, 0], scale: [1.1, 0.9, 1.1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles size={16} strokeWidth={2.6} />
            </motion.span>

            {/* Sekrup mainan di empat sudut */}
            <span className="pointer-events-none absolute left-2 top-2 h-2.5 w-2.5 rounded-full bg-amber-300 shadow-inner" />
            <span className="pointer-events-none absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-amber-300 shadow-inner" />
            <span className="pointer-events-none absolute bottom-2 left-2 h-2.5 w-2.5 rounded-full bg-amber-300 shadow-inner" />
            <span className="pointer-events-none absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full bg-amber-300 shadow-inner" />

            {!isCompleted && progress.completion === 0 && (
              <div className="pointer-events-none absolute left-1/2 top-2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border-2 border-amber-200 bg-white/90 px-2.5 py-1 text-[10px] font-black text-amber-800 shadow-sm">
                <Pencil size={12} strokeWidth={2.8} aria-hidden="true" />
                Mulai dari angka 1
              </div>
            )}
          </div>
        </section>

        {/* Kanan: navigasi huruf */}
        <aside className="col-span-2 flex h-full min-h-0 flex-col items-center justify-center gap-2 sm:gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94, y: 2 }}
            onClick={() => moveBy(-1)}
            aria-label="Huruf sebelumnya"
            title="Huruf sebelumnya"
            className="flex h-14 w-full max-w-[168px] items-center justify-center rounded-2xl border-4 border-b-8 border-sky-500 bg-sky-300 text-sky-950 shadow-xl transition-colors hover:bg-sky-200 active:translate-y-1 active:border-b-0 sm:h-20"
          >
            <ChevronLeft size={34} strokeWidth={3.5} aria-hidden="true" />
          </motion.button>

          <div className="relative flex w-full max-w-[168px] flex-col items-center rounded-3xl border-4 border-amber-300 bg-white px-2 py-2 shadow-xl">
            <span className="text-4xl font-black leading-none text-indigo-950 sm:text-5xl">
              {currentLetter.capital}
            </span>
            <span className="text-lg font-extrabold leading-tight text-indigo-500 sm:text-xl">
              {currentLetter.small}
            </span>
            <span className="mt-0.5 w-full truncate text-center text-[10px] font-black uppercase tracking-wide text-slate-700 sm:text-xs">
              {currentLetter.word}
            </span>
            <span className="mt-0.5 text-[9px] font-bold text-slate-400">
              {currentIndex + 1} / {alphabetData.length}
            </span>

            {isCompleted && (
              <CheckCircle
                size={18}
                strokeWidth={3}
                className="absolute -right-2 -top-2 rounded-full bg-white text-emerald-600"
                aria-hidden="true"
              />
            )}
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94, y: 2 }}
            onClick={() => moveBy(1)}
            aria-label="Huruf berikutnya"
            title="Huruf berikutnya"
            className="flex h-14 w-full max-w-[168px] items-center justify-center rounded-2xl border-4 border-b-8 border-amber-500 bg-amber-300 text-amber-950 shadow-xl transition-colors hover:bg-amber-200 active:translate-y-1 active:border-b-0 sm:h-20"
          >
            <ChevronRight size={34} strokeWidth={3.5} aria-hidden="true" />
          </motion.button>
        </aside>
      </div>

      {/* Footer: langkah bintang + kemajuan + pemilih A-Z */}
      <footer className="mx-auto w-full max-w-6xl flex-none">
        <div className="flex items-center gap-2 rounded-2xl border-2 border-amber-200 bg-white/85 px-2.5 py-1.5 shadow-lg sm:gap-3 sm:px-3">
          <div
            className="flex shrink-0 items-center gap-1.5"
            aria-label={`Langkah menulis ${stepCount}`}
          >
            {Array.from({ length: stepCount }, (_, index) => {
              const stat = progress.steps[index]
              const done = Boolean(stat?.done)
              const active = !done && activeStepIndex === index

              return (
                <div
                  key={`step-${index + 1}`}
                  data-step={index + 1}
                  data-done={done ? 'true' : 'false'}
                  aria-label={`Langkah ${index + 1}${done ? ' selesai' : active ? ' sedang aktif' : ' belum'}`}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    done
                      ? 'scale-110 border-amber-400 bg-amber-300 text-amber-950 shadow-[0_0_16px_rgba(251,191,36,1)] ring-2 ring-amber-200'
                      : active
                        ? 'border-amber-400 bg-white text-amber-700 ring-2 ring-amber-200 motion-safe:animate-pulse-fast'
                        : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  <span className="text-xs font-black tabular-nums">{index + 1}</span>
                </div>
              )
            })}
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-[240px]">
            <div
              className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.completion}
              aria-label="Kemajuan menulis"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-400 transition-[width] duration-200"
                style={{ width: `${progress.completion}%` }}
              />
            </div>
            <span className="w-9 text-right text-[11px] font-black tabular-nums text-amber-800">
              {progress.completion}%
            </span>
          </div>

          <LetterSelector
            letters={alphabetData}
            currentId={currentLetterId}
            completedLetters={completedLetters}
            onSelect={selectLetter}
            className="ml-auto hidden shrink-0 lg:flex"
          />
        </div>
      </footer>

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
