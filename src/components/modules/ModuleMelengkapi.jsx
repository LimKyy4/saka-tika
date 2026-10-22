/**
 * ModuleMelengkapi - Modul 5: game "Melengkapi Kata".
 *
 * Satu sesi = 10 soal acak (Fisher-Yates). Anak memilih satu huruf dari
 * empat balok gelembung untuk mengisi kotak yang kosong. Jawaban benar
 * membuat kata berubah hijau mint, memutar suara kata utuh, lalu otomatis
 * lanjut ke soal berikutnya setelah 1,2 detik.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Puzzle } from 'lucide-react'
import { CuteHeader } from '../common/CuteHeader'
import { MissingProgressBar } from './melengkapi/MissingProgressBar'
import { MissingWordCard } from './melengkapi/MissingWordCard'
import { LetterOptions } from './melengkapi/LetterOptions'
import { MissingRewardModal } from './melengkapi/MissingRewardModal'
import { QUESTIONS_PER_SESSION, createMissingSession } from '../../data/missingLetterData'
import { useAudio } from '../../hooks/useAudio'
import { speakSentence, stopSpeech } from '../../utils/textToSpeech'

const ADVANCE_MS = 1200

export const ModuleMelengkapi = ({ onBackToMenu }) => {
  const { playSfx } = useAudio()

  const [session, setSession] = useState(() => createMissingSession())
  const [round, setRound] = useState(1)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [solved, setSolved] = useState(false)
  const [completed, setCompleted] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [locked, setLocked] = useState(false)
  const [showReward, setShowReward] = useState(false)

  const timersRef = useRef([])

  const current = session[questionIndex] ?? session[0]
  const word = current?.word ?? ''
  const missingIndex = current?.missingIndex ?? 0
  const correctLetter = word[missingIndex] ?? ''

  const schedule = useCallback((callback, delay) => {
    const timer = window.setTimeout(callback, delay)
    timersRef.current.push(timer)
    return timer
  }, [])

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
      timersRef.current = []
      stopSpeech()
    },
    []
  )

  const handleCorrect = useCallback(() => {
    setLocked(true)
    setSolved(true)
    setCompleted((count) => count + 1)
    playSfx('celebration')

    /* "A P E L! APEL!" - ejaan lalu kata utuh */
    speakSentence(`${word.split('').join(' ')}! ${word}!`)

    schedule(() => {
      if (questionIndex + 1 >= session.length) {
        setShowReward(true)
        return
      }

      setQuestionIndex((index) => index + 1)
      setSolved(false)
      setLocked(false)
    }, ADVANCE_MS)
  }, [playSfx, questionIndex, schedule, session.length, word])

  const handleWrong = useCallback(() => {
    playSfx('oops')
    setWrongCount((count) => count + 1)
  }, [playSfx])

  const handlePlayWord = () => {
    if (!word || locked) return
    speakSentence(`${word}!`)
  }

  const handleReplay = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
    stopSpeech()

    setSession(createMissingSession())
    setRound((value) => value + 1)
    setQuestionIndex(0)
    setSolved(false)
    setCompleted(0)
    setWrongCount(0)
    setLocked(false)
    setShowReward(false)
  }

  const handleBack = () => {
    stopSpeech()
    onBackToMenu?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-teal-50 pb-12"
    >
      {/* Hiasan latar */}
      <div className="pointer-events-none absolute -left-16 top-24 h-52 w-52 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative">
        <CuteHeader
          title="Melengkapi Kata"
          description={`Pilih huruf yang hilang. Babak ${round} • ${QUESTIONS_PER_SESSION} soal`}
          onBack={handleBack}
          showHome={false}
        />

        <div className="mx-auto mt-5 max-w-3xl space-y-4 px-4">
          <MissingProgressBar
            current={Math.min(questionIndex + 1, session.length)}
            total={session.length}
            stars={completed}
            done={showReward}
          />

          <MissingWordCard
            key={`${round}-${questionIndex}`}
            word={word}
            missingIndex={missingIndex}
            iconName={current?.iconName}
            hintText={current?.hintText}
            solved={solved}
            onPlayAudio={handlePlayWord}
          />

          <LetterOptions
            options={current?.options ?? []}
            correctLetter={correctLetter}
            solved={solved}
            disabled={locked || showReward}
            onCorrect={handleCorrect}
            onWrong={handleWrong}
          />

          <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white/70 px-4 py-2 text-center text-xs font-bold text-slate-600">
            <Puzzle size={15} strokeWidth={2.6} className="shrink-0 text-emerald-500" />
            <p>Klik huruf yang tepat untuk mengisi kotak kosong.</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showReward && (
          <MissingRewardModal
            solved={completed}
            total={session.length}
            mistakes={wrongCount}
            onReplay={handleReplay}
            onMenu={handleBack}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
