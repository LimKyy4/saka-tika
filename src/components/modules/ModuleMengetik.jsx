/**
 * ModuleMengetik - Modul 4: game "Mengetik Huruf".
 *
 * Satu sesi = 10 kata acak (Fisher-Yates). Anak mengetik huruf satu per
 * satu lewat keyboard fisik ATAU papan ketik maya 3D. Huruf benar mengisi
 * slot dan memajukan kursor; huruf salah hanya menggoyang slot + tombol
 * tanpa mengurangi skor. Setelah 10 kata, modal selebrasi + konfeti tampil.
 *
 * Tata letak wajib 1 layar (100vh) tanpa scrollbar.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CuteHeader } from '../common/CuteHeader'
import { AnimatedBackground } from '../common/AnimatedBackground'
import { TypingProgressBar } from './mengetik/TypingProgressBar'
import { ClueCard3D } from './mengetik/ClueCard3D'
import { LetterSlots3D } from './mengetik/LetterSlots3D'
import { QwertyKeyboard3D } from './mengetik/QwertyKeyboard3D'
import { TypingRewardModal } from './mengetik/TypingRewardModal'
import { WORDS_PER_SESSION, createTypingSession } from '../../data/typingWordData'
import { useAudio } from '../../hooks/useAudio'
import { useLockScroll } from '../../hooks/useLockScroll'
import { speakSentence, stopSpeech } from '../../utils/textToSpeech'

const ADVANCE_MS = 1200
const KEY_FEEDBACK_MS = 160
const WRONG_FEEDBACK_MS = 450
const IGNORED_KEYS = ['Control', 'Alt', 'Shift', 'Meta', 'Tab', 'CapsLock']

export const ModuleMengetik = ({ onBackToMenu }) => {
  const { playSfx } = useAudio()

  const [session, setSession] = useState(() => createTypingSession())
  const [round, setRound] = useState(1)
  const [wordIndex, setWordIndex] = useState(0)
  const [typedCount, setTypedCount] = useState(0)
  const [completedWords, setCompletedWords] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [locked, setLocked] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [shakeSignal, setShakeSignal] = useState(0)
  const [slotError, setSlotError] = useState(false)
  const [activeKey, setActiveKey] = useState(null)
  const [wrongKey, setWrongKey] = useState(null)

  const timersRef = useRef([])
  const lockedRef = useRef(false)

  useLockScroll()

  const currentWord = session[wordIndex] ?? session[0]
  const word = currentWord?.word ?? ''
  const wordDone = word.length > 0 && typedCount >= word.length

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

  const finishWord = useCallback(() => {
    lockedRef.current = true
    setLocked(true)
    setCompletedWords((count) => count + 1)
    setSlotError(false)
    setWrongKey(null)

    playSfx('celebration')
    speakSentence(`${word.split('').join('-')}! ${word}!`)

    schedule(() => {
      if (wordIndex + 1 >= session.length) {
        setShowReward(true)
        return
      }

      setWordIndex((index) => index + 1)
      setTypedCount(0)
      setLocked(false)
      setSlotError(false)
      setWrongKey(null)
      lockedRef.current = false
    }, ADVANCE_MS)
  }, [playSfx, schedule, session.length, word, wordIndex])

  const handleKey = useCallback(
    (rawKey) => {
      if (lockedRef.current || locked || showReward) return

      const key = String(rawKey ?? '')
      if (!/^[a-zA-Z]$/.test(key)) return

      const normalized = key.toLowerCase()
      const target = (word[typedCount] ?? '').toLowerCase()

      setActiveKey(normalized)
      schedule(() => {
        setActiveKey((current) => (current === normalized ? null : current))
      }, KEY_FEEDBACK_MS)

      if (normalized === target) {
        playSfx('click')
        setSlotError(false)
        setWrongKey(null)

        const nextCount = typedCount + 1
        setTypedCount(nextCount)

        if (nextCount >= word.length) finishWord()
        return
      }

      playSfx('oops')
      setWrongCount((count) => count + 1)
      setWrongKey(normalized)
      setSlotError(true)
      setShakeSignal((signal) => signal + 1)

      schedule(() => {
        setWrongKey((current) => (current === normalized ? null : current))
        setSlotError(false)
      }, WRONG_FEEDBACK_MS)
    },
    [finishWord, locked, playSfx, schedule, showReward, typedCount, word]
  )

  const handleBackspace = useCallback(() => {
    if (lockedRef.current || locked || showReward || typedCount <= 0) return

    playSfx('click')
    setTypedCount((count) => Math.max(0, count - 1))
    setSlotError(false)
    setWrongKey(null)
  }, [locked, playSfx, showReward, typedCount])

  const handleReset = useCallback(() => {
    if (lockedRef.current || locked || showReward) return

    playSfx('click')
    setTypedCount(0)
    setSlotError(false)
    setWrongKey(null)
    setActiveKey(null)
  }, [locked, playSfx, showReward])

  /* Simpan handler terbaru agar listener keyboard fisik tidak basi */
  const handleKeyRef = useRef(handleKey)
  handleKeyRef.current = handleKey

  const handleBackspaceRef = useRef(handleBackspace)
  handleBackspaceRef.current = handleBackspace

  useEffect(() => {
    const handlePhysicalKeyPress = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return
      if (IGNORED_KEYS.includes(event.key)) return

      if (event.key === 'Backspace') {
        event.preventDefault()
        handleBackspaceRef.current()
        return
      }

      if (/^[a-zA-Z]$/.test(event.key)) {
        handleKeyRef.current(event.key)
      }
    }

    window.addEventListener('keydown', handlePhysicalKeyPress)
    return () => window.removeEventListener('keydown', handlePhysicalKeyPress)
  }, [])

  const handlePlayWord = () => {
    if (!word || lockedRef.current || locked) return
    playSfx('click')
    speakSentence(word)
  }

  const handleReplay = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
    stopSpeech()

    setSession(createTypingSession())
    setRound((value) => value + 1)
    setWordIndex(0)
    setTypedCount(0)
    setCompletedWords(0)
    setWrongCount(0)
    setLocked(false)
    setShowReward(false)
    setShakeSignal(0)
    setSlotError(false)
    setActiveKey(null)
    setWrongKey(null)
    lockedRef.current = false
  }

  const handleBack = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
    stopSpeech()
    onBackToMenu?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex h-screen w-screen select-none flex-col justify-between overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 p-2 sm:p-3"
    >
      <AnimatedBackground />

      {/* Header floating ringkas + spacer setinggi h-14 */}
      <div className="h-14 flex-none">
        <CuteHeader
          compact
          title="Mengetik Huruf"
          onBack={handleBack}
          showHome={false}
          showStars
          stars={completedWords}
        />
      </div>

      <main className="relative z-20 mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col justify-center gap-2 py-1 sm:gap-3">
        <TypingProgressBar
          current={Math.min(wordIndex + 1, session.length)}
          total={session.length}
          stars={completedWords}
          done={showReward}
        />

        <ClueCard3D
          key={`clue-${round}-${wordIndex}`}
          word={word}
          category={currentWord?.category}
          hintText={currentWord?.hintText}
          iconName={currentWord?.iconName}
          onPlayAudio={handlePlayWord}
        />

        <LetterSlots3D
          key={`slots-${round}-${wordIndex}`}
          word={word}
          typedCount={typedCount}
          completed={wordDone}
          error={slotError}
          shakeSignal={shakeSignal}
        />

        <QwertyKeyboard3D
          onKey={handleKey}
          onBackspace={handleBackspace}
          onReset={handleReset}
          disabled={locked || showReward}
          activeKey={activeKey}
          wrongKey={wrongKey}
        />
      </main>

      <AnimatePresence>
        {showReward && (
          <TypingRewardModal
            words={completedWords}
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
