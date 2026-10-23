/**
 * Dataset alfabet A-Z untuk Modul 1: Mengenal Huruf.
 * Kata Indonesia anak-anak + ikon Lucide presisi + palet pastel cerah bergiliran.
 */

const PALETTES = [
  { bgColor: 'bg-sky-200', borderColor: 'border-sky-400', edgeColor: 'border-b-sky-500', textColor: 'text-sky-700' },
  { bgColor: 'bg-amber-200', borderColor: 'border-amber-400', edgeColor: 'border-b-amber-500', textColor: 'text-amber-700' },
  { bgColor: 'bg-rose-200', borderColor: 'border-rose-400', edgeColor: 'border-b-rose-500', textColor: 'text-rose-700' },
  { bgColor: 'bg-emerald-200', borderColor: 'border-emerald-400', edgeColor: 'border-b-emerald-500', textColor: 'text-emerald-700' },
  { bgColor: 'bg-orange-200', borderColor: 'border-orange-400', edgeColor: 'border-b-orange-500', textColor: 'text-orange-700' },
  { bgColor: 'bg-purple-200', borderColor: 'border-purple-400', edgeColor: 'border-b-purple-500', textColor: 'text-purple-700' },
]

/* Kata + ikon presisi sesuai objek Bahasa Indonesia */
const LETTERS = [
  { id: 'A', word: 'Apel', iconName: 'Apple' },
  { id: 'B', word: 'Buku', iconName: 'BookOpen' },
  { id: 'C', word: 'Cangkir', iconName: 'Coffee' },
  { id: 'D', word: 'Dadu', iconName: 'Dice5' },
  { id: 'E', word: 'Es Krim', iconName: 'IceCream' },
  { id: 'F', word: 'Kipas', iconName: 'Fan' },
  { id: 'G', word: 'Gelas', iconName: 'GlassWater' },
  { id: 'H', word: 'Hati', iconName: 'Heart' },
  { id: 'I', word: 'Ikan', iconName: 'Fish' },
  { id: 'J', word: 'Jam', iconName: 'Clock' },
  { id: 'K', word: 'Kunci', iconName: 'Key' },
  { id: 'L', word: 'Lampu', iconName: 'Lightbulb' },
  { id: 'M', word: 'Mobil', iconName: 'Car' },
  { id: 'N', word: 'Nanas', iconName: 'Citrus' },
  { id: 'O', word: 'Obor', iconName: 'Flame' },
  { id: 'P', word: 'Pensil', iconName: 'Pencil' },
  { id: 'Q', word: 'Ratu', iconName: 'Crown' },
  { id: 'R', word: 'Roket', iconName: 'Rocket' },
  { id: 'S', word: 'Senter', iconName: 'Flashlight' },
  { id: 'T', word: 'Topi', iconName: 'GraduationCap' },
  { id: 'U', word: 'Udang', iconName: 'Utensils' },
  { id: 'V', word: 'Vas Bunga', iconName: 'Flower2' },
  { id: 'W', word: 'Wortel', iconName: 'Carrot' },
  { id: 'X', word: 'Xylophone', iconName: 'Music' },
  { id: 'Y', word: 'Yoyo', iconName: 'Disc' },
  { id: 'Z', word: 'Zebra', iconName: 'PawPrint' },
]

export const alphabetData = LETTERS.map((letter, index) => ({
  ...letter,
  capital: letter.id,
  small: letter.id.toLowerCase(),
  sentence: `${letter.id} untuk ${letter.word}`,
  audioUrl: `/audio/letters/${letter.id}.ogg`,
  ...PALETTES[index % PALETTES.length],
}))

/* Pembagian halaman carousel: A-P (16 huruf) lalu Q-Z (10 huruf) */
export const alphabetPages = [alphabetData.slice(0, 16), alphabetData.slice(16, 26)]

/* Cari data huruf berdasarkan id (kapital) */
export const findLetter = (id) => alphabetData.find((item) => item.id === id)

/* Ambil huruf berikutnya atau sebelumnya dalam siklus A-Z */
export const nextLetter = (id) => {
  const currentIndex = alphabetData.findIndex((item) => item.id === id)
  return alphabetData[(currentIndex + 1) % alphabetData.length]
}

export const prevLetter = (id) => {
  const currentIndex = alphabetData.findIndex((item) => item.id === id)
  return alphabetData[(currentIndex - 1 + alphabetData.length) % alphabetData.length]
}

/* Warna pastel untuk hiasan latar */
export const pastelColors = [
  'bg-sky-200',
  'bg-amber-200',
  'bg-rose-200',
  'bg-emerald-200',
  'bg-orange-200',
  'bg-purple-200',
]

/* Warna kuat untuk teks high-contrast */
export const textStrongColors = {
  sky: 'text-sky-950',
  amber: 'text-amber-900',
  pink: 'text-pink-900',
  purple: 'text-purple-900',
  orange: 'text-orange-900',
  emerald: 'text-emerald-900',
  rose: 'text-rose-900',
}