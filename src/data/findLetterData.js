/**
 * Dataset game "Temukan Huruf" (Modul 3).
 *
 * Soal dibuat dinamis setiap sesi memakai Fisher-Yates Shuffle:
 * - 10 huruf target unik diambil dari alfabet A-Z.
 * - Soal pertama tidak selalu huruf "A".
 * - Grid 3x2 berisi tepat 1 huruf target + 5 pengganggu unik.
 * - Teks petunjuk otomatis mengikuti huruf target.
 */

import { alphabetData } from './alphabetData'
import { shuffle } from '../utils/shuffle'

const ALPHABET = alphabetData.map((item) => item.id)
const WORD_BY_LETTER = Object.fromEntries(
  alphabetData.map((item) => [item.id, item.word.toUpperCase()])
)

export const GRID_SIZE = 6
export const QUESTIONS_PER_SESSION = 10

/* 1 target + 5 pengganggu unik, lalu posisi target diacak 0-5 */
const buildGrid = (targetLetter) => {
  const distractors = shuffle(
    ALPHABET.filter((letter) => letter !== targetLetter)
  ).slice(0, GRID_SIZE - 1)

  return shuffle([targetLetter, ...distractors])
}

const buildQuestion = (targetLetter, index) => ({
  id: index + 1,
  targetLetter,
  targetWord: WORD_BY_LETTER[targetLetter],
  gridLetters: buildGrid(targetLetter),
  questionText: `Tebak mana huruf ${targetLetter} di bawah ini!`,
  hintText: `Cari huruf ${targetLetter} untuk ${WORD_BY_LETTER[targetLetter]}!`,
})

/**
 * Buat satu sesi 10 soal yang benar-benar acak.
 * Huruf "A" tidak dibiarkan menempati soal pertama agar anak tidak
 * melihat urutan yang sama setiap kali membuka modul.
 */
export const createFindLetterSession = (count = QUESTIONS_PER_SESSION) => {
  const targetLetters = shuffle(ALPHABET).slice(0, count)

  if (targetLetters.length > 1 && targetLetters[0] === 'A') {
    const swapIndex = 1 + Math.floor(Math.random() * (targetLetters.length - 1))
    const first = targetLetters[0]
    targetLetters[0] = targetLetters[swapIndex]
    targetLetters[swapIndex] = first
  }

  return targetLetters.map((letter, index) => buildQuestion(letter, index))
}
