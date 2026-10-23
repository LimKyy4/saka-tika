/**
 * ModuleTemukan - Modul 3: game "Temukan Huruf" 3x2.
 *
 * Satu sesi = 10 soal acak. Setiap soal menampilkan 6 kartu raksasa
 * (1 huruf target + 5 pengganggu). Jawaban benar lanjut otomatis,
 * jawaban salah boleh dicoba lagi. Selesai 10 soal = modal selebrasi.
 *
 * Tata letak wajib 1 layar (100vh) tanpa scrollbar.
 */

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, Star } from 'lucide-react'
import { CuteHeader } from '../common/CuteHeader'
import { AnimatedBackground } from '../common/AnimatedBackground'
import { QuestionBanner } from './temukan/QuestionBanner'
import { LetterGrid3D } from './temukan/LetterGrid3D'
import { FindRewardModal } from './temukan/FindRewardModal'
import {
  QUESTIONS_PER_SESSION,
  createFindLetterSession,
} from '../../data/findLetterData'
import { speakSentence } from '../../utils/textToSpeech'
import { useLockScroll } from '../../hooks/useLockScroll'

export const ModuleTemukan = ({ onBackToMenu }) => {
  const [questions, setQuestions] = useState(() => createFindLetterSession())
  const [questionIndex, setQuestionIndex] = useState(0)
  const [round, setRound] = useState(0)
  const [starsCount, setStarsCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [sessionDone, setSessionDone] = useState(false)

  useLockScroll()

  const question = questions[questionIndex] ?? questions[0]

  const playInstruction = () => {
    speakSentence(question.hintText)
  }

  const handleCorrect = () => {
    setStarsCount((count) => Math.min(QUESTIONS_PER_SESSION, count + 1))

    if (questionIndex + 1 >= questions.length) {
      setSessionDone(true)
      return
    }

    setQuestionIndex((index) => index + 1)
  }

  const handleWrong = () => {
    setWrongCount((count) => count + 1)
  }

  const handleReplay = () => {
    setQuestions(createFindLetterSession())
    setRound((value) => value + 1)
    setQuestionIndex(0)
    setStarsCount(0)
    setWrongCount(0)
    setSessionDone(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex h-screen w-screen select-none flex-col justify-between overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 p-3"
    >
      <AnimatedBackground />

      {/* Header floating ringkas + spacer setinggi h-14 */}
      <div className="h-14 flex-none">
        <CuteHeader
          compact
          title="Temukan Huruf"
          onBack={onBackToMenu}
          showHome={false}
          showStars
          stars={starsCount}
        />
      </div>

      <main className="relative z-20 mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col justify-center gap-2 py-1 sm:gap-3">
        <QuestionBanner
          key={`banner-${round}-${question.id}`}
          targetLetter={question.targetLetter}
          questionText={question.questionText}
          hintText={question.hintText}
          onPlayAudio={playInstruction}
        />

        {/* Baris status ringkas: soal & bintang */}
        <div className="flex items-center justify-between gap-2">
          <div className="rounded-full border-2 border-white/80 bg-white/85 px-3 py-1 shadow-sm backdrop-blur-sm">
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Soal
            </span>
            <span className="ml-1.5 text-sm font-black tabular-nums text-indigo-950">
              {Math.min(questionIndex + 1, QUESTIONS_PER_SESSION)} / {QUESTIONS_PER_SESSION}
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 rounded-full border-2 border-amber-300 bg-amber-100/95 px-3 py-1 shadow-sm"
            aria-label={`Bintang terkumpul ${starsCount} dari ${QUESTIONS_PER_SESSION}`}
          >
            <Star
              size={16}
              strokeWidth={2.6}
              className="fill-amber-400 text-amber-600"
              aria-hidden="true"
            />
            <span className="text-sm font-black tabular-nums text-amber-900">
              {starsCount}
              <span className="ml-0.5 text-xs font-extrabold text-amber-700">
                / {QUESTIONS_PER_SESSION}
              </span>
            </span>
          </div>
        </div>

        <LetterGrid3D
          key={`grid-${round}-${question.id}`}
          letters={question.gridLetters}
          targetLetter={question.targetLetter}
          disabled={sessionDone}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
        />

        <div className="mx-auto flex items-center justify-center gap-2 rounded-full border-2 border-white/70 bg-white/70 px-3 py-1 text-[10px] font-bold text-slate-600 shadow-sm backdrop-blur-sm sm:text-xs">
          <Sparkles size={14} strokeWidth={2.6} className="shrink-0 text-amber-500" aria-hidden="true" />
          <p>Pilih huruf yang benar. Kalau keliru, coba lagi ya!</p>
        </div>
      </main>

      <AnimatePresence>
        {sessionDone && (
          <FindRewardModal
            stars={starsCount}
            total={QUESTIONS_PER_SESSION}
            wrongCount={wrongCount}
            onReplay={handleReplay}
            onMenu={onBackToMenu}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
