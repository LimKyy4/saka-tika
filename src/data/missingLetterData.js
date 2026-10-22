/**
 * Dataset 50 kata sederhana untuk Modul 5: Melengkapi Kata.
 *
 * Setiap kata:
 * - id           : 1 - 50
 * - word         : kata dalam huruf kapital (3-5 huruf)
 * - missingIndex : posisi huruf yang disembunyikan (bervariasi)
 * - options      : 4 huruf pilihan (1 benar + 3 pengecoh, acak)
 * - iconName     : nama ikon Lucide (lihat utils/letterIcons.js)
 * - hintText     : petunjuk singkat untuk anak
 *
 * Satu sesi memakai 10 kata acak lewat Fisher-Yates Shuffle.
 */

import { shuffle } from '../utils/shuffle'

export const QUESTIONS_PER_SESSION = 10

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

/* Susun 4 pilihan: huruf jawaban + 3 huruf pengecoh yang berbeda */
const buildOptions = (word, missingIndex) => {
  const answer = word[missingIndex]
  const distractors = shuffle(ALPHABET.filter((letter) => letter !== answer)).slice(0, 3)

  return shuffle([answer, ...distractors])
}

const RAW_WORDS = [
  { word: 'APEL', missingIndex: 2, iconName: 'Apple', hintText: 'Buah bulat berwarna merah atau hijau.' },
  { word: 'AYAM', missingIndex: 1, iconName: 'Bird', hintText: 'Hewan berkaki dua yang berkokok.' },
  { word: 'BOLA', missingIndex: 0, iconName: 'Circle', hintText: 'Mainan bulat yang bisa ditendang.' },
  { word: 'BUKU', missingIndex: 3, iconName: 'BookOpen', hintText: 'Lembaran kertas untuk membaca.' },
  { word: 'BEBEK', missingIndex: 2, iconName: 'Bird', hintText: 'Hewan yang suka berenang dan berbunyi kwek.' },
  { word: 'BUNGA', missingIndex: 4, iconName: 'Flower2', hintText: 'Tanaman cantik yang berwarna-warni.' },
  { word: 'CERI', missingIndex: 1, iconName: 'Cherry', hintText: 'Buah kecil bulat berwarna merah.' },
  { word: 'DADU', missingIndex: 2, iconName: 'Dice5', hintText: 'Kubus kecil berisi angka untuk bermain.' },
  { word: 'DAUN', missingIndex: 0, iconName: 'Leaf', hintText: 'Bagian hijau pada tanaman.' },
  { word: 'GELAS', missingIndex: 3, iconName: 'GlassWater', hintText: 'Wadah untuk minum air.' },
  { word: 'GITAR', missingIndex: 1, iconName: 'Guitar', hintText: 'Alat musik dengan senar.' },
  { word: 'HATI', missingIndex: 3, iconName: 'Heart', hintText: 'Organ di dalam dada yang berdetak.' },
  { word: 'IKAN', missingIndex: 2, iconName: 'Fish', hintText: 'Hewan yang hidup di air.' },
  { word: 'JAM', missingIndex: 1, iconName: 'Clock', hintText: 'Alat untuk melihat waktu.' },
  { word: 'JERUK', missingIndex: 2, iconName: 'Citrus', hintText: 'Buah bulat berwarna oranye.' },
  { word: 'KUE', missingIndex: 0, iconName: 'Cake', hintText: 'Makanan manis untuk ulang tahun.' },
  { word: 'KURSI', missingIndex: 4, iconName: 'Armchair', hintText: 'Tempat untuk duduk.' },
  { word: 'KUNCI', missingIndex: 3, iconName: 'Key', hintText: 'Alat untuk membuka pintu.' },
  { word: 'LAMPU', missingIndex: 1, iconName: 'Lamp', hintText: 'Benda yang menerangi ruangan.' },
  { word: 'LILIN', missingIndex: 4, iconName: 'Flame', hintText: 'Benda yang menyala dengan api kecil.' },
  { word: 'MEJA', missingIndex: 2, iconName: 'Table', hintText: 'Tempat untuk menulis atau makan.' },
  { word: 'MOBIL', missingIndex: 0, iconName: 'Car', hintText: 'Kendaraan beroda empat.' },
  { word: 'MATA', missingIndex: 1, iconName: 'Eye', hintText: 'Bagian tubuh untuk melihat.' },
  { word: 'NASI', missingIndex: 3, iconName: 'Utensils', hintText: 'Makanan pokok berwarna putih.' },
  { word: 'OBAT', missingIndex: 0, iconName: 'Pill', hintText: 'Diminum saat sakit.' },
  { word: 'PALU', missingIndex: 2, iconName: 'Hammer', hintText: 'Alat untuk memukul paku.' },
  { word: 'PENA', missingIndex: 1, iconName: 'Pen', hintText: 'Alat untuk menulis dengan tinta.' },
  { word: 'PETA', missingIndex: 3, iconName: 'Map', hintText: 'Gambar wilayah untuk menunjukkan arah.' },
  { word: 'PIZZA', missingIndex: 2, iconName: 'Pizza', hintText: 'Makanan bulat dengan potongan.' },
  { word: 'ROKET', missingIndex: 4, iconName: 'Rocket', hintText: 'Kendaraan yang terbang ke angkasa.' },
  { word: 'RADIO', missingIndex: 1, iconName: 'Radio', hintText: 'Benda untuk mendengarkan siaran suara.' },
  { word: 'SAPU', missingIndex: 0, iconName: 'Paintbrush', hintText: 'Alat untuk membersihkan lantai.' },
  { word: 'SEMUT', missingIndex: 3, iconName: 'Bug', hintText: 'Serangga kecil yang suka bergotong royong.' },
  { word: 'SUSU', missingIndex: 2, iconName: 'Milk', hintText: 'Minuman putih yang sehat.' },
  { word: 'SALJU', missingIndex: 2, iconName: 'Snowflake', hintText: 'Butiran putih yang turun saat dingin.' },
  { word: 'TELUR', missingIndex: 1, iconName: 'Egg', hintText: 'Berasal dari ayam, berbentuk bulat lonjong.' },
  { word: 'TIKUS', missingIndex: 0, iconName: 'Rat', hintText: 'Hewan kecil yang suka keju.' },
  { word: 'TOPI', missingIndex: 3, iconName: 'GraduationCap', hintText: 'Dipakai di kepala.' },
  { word: 'TAS', missingIndex: 1, iconName: 'Backpack', hintText: 'Dipakai untuk membawa buku.' },
  { word: 'VAS', missingIndex: 0, iconName: 'Flower2', hintText: 'Wadah untuk meletakkan bunga.' },
  { word: 'YOYO', missingIndex: 2, iconName: 'Circle', hintText: 'Mainan yang naik turun di tali.' },
  { word: 'AWAN', missingIndex: 1, iconName: 'Cloud', hintText: 'Kumpulan uap putih di langit.' },
  { word: 'BULAN', missingIndex: 3, iconName: 'Moon', hintText: 'Benda langit yang bersinar di malam hari.' },
  { word: 'HUJAN', missingIndex: 2, iconName: 'CloudRain', hintText: 'Air yang turun dari langit.' },
  { word: 'POHON', missingIndex: 4, iconName: 'TreePine', hintText: 'Tanaman besar berbatang kayu.' },
  { word: 'OMBAK', missingIndex: 3, iconName: 'Waves', hintText: 'Gelombang air di laut.' },
  { word: 'AIR', missingIndex: 1, iconName: 'Droplet', hintText: 'Benda cair yang kita minum.' },
  { word: 'KAPAL', missingIndex: 4, iconName: 'Ship', hintText: 'Kendaraan besar yang berlayar di laut.' },
  { word: 'KAOS', missingIndex: 2, iconName: 'Shirt', hintText: 'Pakaian yang dipakai di badan.' },
  { word: 'KAKI', missingIndex: 3, iconName: 'Footprints', hintText: 'Bagian tubuh untuk berjalan.' },
]

export const missingLetterData = RAW_WORDS.map((item, index) => ({
  id: index + 1,
  word: item.word,
  missingIndex: item.missingIndex,
  options: buildOptions(item.word, item.missingIndex),
  iconName: item.iconName,
  hintText: item.hintText,
}))

/* Ambil 10 soal acak tanpa pengulangan untuk satu babak.
   Urutan pilihan diacak ulang supaya tiap sesi terasa baru. */
export const createMissingSession = (count = QUESTIONS_PER_SESSION) =>
  shuffle(missingLetterData)
    .slice(0, count)
    .map((question) => ({ ...question, options: shuffle(question.options) }))
