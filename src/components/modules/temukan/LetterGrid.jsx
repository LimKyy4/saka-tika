/**
 * LetterGrid - Papan 4x3 berisi 12 pilihan huruf.
 *
 * Aturan:
 * - Jawaban BENAR : kartu hijau, pop, CheckCircle, SFX + TTS "Pintar!",
 *                   grid terkunci 1 detik lalu lanjut soal berikutnya.
 * - Jawaban SALAH : kartu merah sementara + getar + XCircle + SFX lembut,
 *                   anak boleh mencoba lagi tanpa kehilangan kesempatan.
 */

import { useEffect, useRef, useState } from 'react'
import { LetterTile } from './LetterTile'
import { useAudio } from '../../../hooks/useAudio'
import { speakSentence } from '../../../utils/textToSpeech'

const RESET_WRONG_MS = 750
const ADVANCE_MS = 1000

export const LetterGrid = ({
  letters,
  targetLetter,
  disabled = false,
  onCorrect,
  onWrong,
}) => {
  const { playSfx } = useAudio()
  const [statuses, setStatuses] = useState(() => letters.map(() => 'idle'))
  const [locked, setLocked] = useState(false)
  const timersRef = useRef([])

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
      timersRef.current = []
    },
    []
  )

  const isLocked = locked || disabled

  const handlePick = (letter, index) => {
    if (isLocked) return

    if (letter === targetLetter) {
      setStatuses((previous) =>
        previous.map((status, currentIndex) =>
          currentIndex === index ? 'correct' : status
        )
      )
      setLocked(true)
      playSfx('celebration')
      speakSentence('Pintar!')

      timersRef.current.push(
        window.setTimeout(() => onCorrect?.(letter), ADVANCE_MS)
      )
      return
    }

    setStatuses((previous) =>
      previous.map((status, currentIndex) =>
        currentIndex === index ? 'wrong' : status
      )
    )
    playSfx('oops')
    onWrong?.(letter)

    timersRef.current.push(
      window.setTimeout(() => {
        setStatuses((previous) =>
          previous.map((status, currentIndex) =>
            currentIndex === index && status === 'wrong' ? 'idle' : status
          )
        )
      }, RESET_WRONG_MS)
    )
  }

  return (
    <div className="mx-auto grid w-full max-w-xl grid-cols-4 gap-3 sm:gap-4">
      {letters.map((letter, index) => (
        <LetterTile
          key={`${letter}-${index}`}
          letter={letter}
          index={index}
          status={statuses[index]}
          disabled={isLocked}
          onPick={handlePick}
        />
      ))}
    </div>
  )
}
