/**
 * ModuleMengetik - Modul 4: game "Mengetik Huruf".
 *
 * Satu sesi = 10 kata acak (Fisher-Yates). Anak mengetik huruf satu per
 * satu lewat keyboard fisik atau papan ketik visual. Huruf benar mengisi
 * kotak dan memajukan kursor; huruf salah hanya menggoyang kotak aktif.
 * Setelah 10 kata, modal selebrasi + konfeti ditampilkan.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Keyboard } from 'lucide-react'
import { CuteHeader } from '../common/CuteHeader'
import { TypingProgressBar } from './mengetik/TypingProgressBar'
import { WordCard } from './mengetik/WordCard'
import { VirtualKeyboard } from './mengetik/VirtualKeyboard'
import { TypingRewardModal } from './mengetik/TypingRewardModal'
import { WORDS_PER_SESSION, createTypingSession } from '../../data/typingData'
import { useAudio } from '../../hooks/useAudio'
import { speakSentence, stopSpeech } from '../../utils/textToSpeech'

const ADVANCE_MS = 1200
const KEY_FEEDBACK_MS = 180
const WRONG_FEEDBACK_MS = 450

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
  const [activeKey, setActiveKey] = useState(null)
  const [wrongKey, setWrongKey] = useState(null)

  const timersRef = useRef([])

  const currentWord = session[wordIndex] ?? session[0]
  const word = currentWord?.word ?? ''
  const wordDone = typedCount >= word.length

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
    setLocked(true)
    setCompletedWords((count) => count + 1)
    playSfx('celebration')
    speakSentence(`${word}!`)

    schedule(() => {
      if (wordIndex + 1 >= session.length) {
        setShowReward(true)
        return
      }

      setWordIndex((index) => index + 1)
      setTypedCount(0)
      setLocked(false)
    }, ADVANCE_MS)
  }, [playSfx, schedule, session.length, word, wordIndex])

  const handleKey = useCallback(
    (rawKey) => {
      if (locked || showReward) return

      const key = String(rawKey ?? '').toLowerCase()
      if (!/^[a-z]$/.test(key)) return

      setActiveKey(key)
      schedule(() => {
        setActiveKey((current) => (current === key ? null : current))
      }, KEY_FEEDBACK_MS)

      if (key === (word[typedCount] ?? '').toLowerCase()) {
        playSfx('click')
        const nextCount = typedCount + 1
        setTypedCount(nextCount)

        if (nextCount >= word.length) finishWord()
        return
      }

      playSfx('oops')
      setWrongCount((count) => count + 1)
      setWrongKey(key)
      setShakeSignal((signal) => signal + 1)
      schedule(() => {
        setWrongKey((current) => (current === key ? null : current))
      }, WRONG_FEEDBACK_MS)
    },
    [finishWord, locked, playSfx, schedule, showReward, typedCount, word]
  )

  /* Simpan handler terbaru agar listener keyboard fisik tidak basi */
  const handleKeyRef = useRef(handleKey)
  handleKeyRef.current = handleKey

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return
      handleKeyRef.current(event.key)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handlePlayWord = () => {
    if (!word || locked) return
    speakSentence(`${word}!`)
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
    setActiveKey(null)
    setWrongKey(null)
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
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-50 via-white to-sky-50 pb-12"
    >
      {/* Hiasan latar */}
      <div className="pointer-events-none absolute -left-16 top-24 h-52 w-52 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative">
        <CuteHeader
          title="Mengetik Huruf"
          description={`Ketik kata yang muncul. Babak ${round} • ${WORDS_PER_SESSION} kata`}
          onBack={handleBack}
          showHome={false}
        />

        <div className="mx-auto mt-5 max-w-3xl space-y-4 px-4">
          <TypingProgressBar
            current={Math.min(wordIndex + 1, session.length)}
            total={session.length}
            stars={completedWords}
            done={showReward}
          />

          <WordCard
            key={`${round}-${wordIndex}`}
            word={word}
            iconName={currentWord?.iconName}
            category={currentWord?.category}
            hintText={currentWord?.hintText}
            typedCount={typedCount}
            completed={wordDone}
            shakeSignal={shakeSignal}
            onPlayAudio={handlePlayWord}
          />

          <VirtualKeyboard
            onKey={handleKey}
            disabled={locked || showReward}
            activeKey={activeKey}
            wrongKey={wrongKey}
          />

          <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white/70 px-4 py-2 text-center text-xs font-bold text-slate-600">
            <Keyboard size={15} strokeWidth={2.6} className="shrink-0 text-orange-500" />
            <p>Ketik di keyboard, atau klik tombol huruf di papan ketik.</p>
          </div>
        </div>
      </div>

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
