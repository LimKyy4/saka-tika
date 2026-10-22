/**
 * ModuleTemukan - Modul 3: mini-game "Temukan Huruf".
 *
 * Satu sesi = 10 soal acak. Anak memilih huruf target pada papan 4x3.
 * Jawaban benar langsung lanjut soal berikutnya. Setelah 10 soal,
 * modal selebrasi + konfeti ditampilkan.
 *
 * "Main Lagi" membangun 10 soal baru lewat createSessionQuestions()
 * sehingga urutan huruf dan susunan grid selalu berbeda.
 */

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { CuteHeader } from '../common/CuteHeader'
import { ProgressBar } from './temukan/ProgressBar'
import { TargetCard } from './temukan/TargetCard'
import { LetterGrid } from './temukan/LetterGrid'
import { GameRewardModal } from './temukan/GameRewardModal'
import {
  QUESTIONS_PER_SESSION,
  createSessionQuestions,
} from '../../data/findLetterData'
import { findLetter } from '../../data/alphabetData'
import { playLetterAudio } from '../../utils/textToSpeech'

export const ModuleTemukan = ({ onBackToMenu }) => {
  const [questions, setQuestions] = useState(() => createSessionQuestions())
  const [round, setRound] = useState(1)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [sessionDone, setSessionDone] = useState(false)

  const question = questions[questionIndex] ?? questions[0]
  const letterData = findLetter(question.targetLetter)

  /* 3 bintang: maksimal 2 salah, 2 bintang: maksimal 5 salah, sisanya 1 */
  const stars = wrongCount <= 2 ? 3 : wrongCount <= 5 ? 2 : 1

  const playInstruction = () => {
    if (letterData) playLetterAudio(letterData)
  }

  const handleCorrect = () => {
    setCorrectCount((count) => count + 1)

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
    setQuestions(createSessionQuestions())
    setRound((value) => value + 1)
    setQuestionIndex(0)
    setCorrectCount(0)
    setWrongCount(0)
    setSessionDone(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-pink-50 via-white to-indigo-50 pb-12"
    >
      {/* Hiasan latar */}
      <div className="pointer-events-none absolute -left-16 top-24 h-52 w-52 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative">
        <CuteHeader
          title="Temukan Huruf"
          description={`Cari huruf yang diminta. Babak ${round} • ${QUESTIONS_PER_SESSION} soal`}
          onBack={onBackToMenu}
          showHome={false}
        />

        <div className="mx-auto mt-5 max-w-2xl space-y-4 px-4">
          <ProgressBar
            current={questionIndex + 1}
            total={QUESTIONS_PER_SESSION}
            stars={correctCount}
            done={sessionDone}
          />

          <TargetCard
            targetLetter={question.targetLetter}
            hintText={question.hintText}
            onPlayAudio={playInstruction}
          />

          <LetterGrid
            key={`${round}-${question.id}`}
            letters={question.gridLetters}
            targetLetter={question.targetLetter}
            disabled={sessionDone}
            onCorrect={handleCorrect}
            onWrong={handleWrong}
          />

          <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white/70 px-4 py-2 text-center text-xs font-bold text-slate-600">
            <Sparkles size={15} strokeWidth={2.6} className="shrink-0 text-amber-500" />
            <p>Pilih huruf yang benar. Kalau keliru, coba lagi, ya!</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {sessionDone && (
          <GameRewardModal
            stars={stars}
            maxStars={3}
            correct={correctCount}
            total={QUESTIONS_PER_SESSION}
            onReplay={handleReplay}
            onMenu={onBackToMenu}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
