/**
 * Dataset 50 kata sederhana untuk Modul 4: Mengetik Huruf.
 *
 * Setiap kata:
 * - id       : 1 - 50
 * - word     : kata sasaran dalam huruf kapital (tanpa spasi)
 * - category : HEWAN | BUAH | MAINAN | BENDA | MAKANAN
 * - hintText : petunjuk singkat untuk anak TK
 * - iconName : nama ikon Lucide (lihat utils/letterIcons.js)
 *
 * Satu sesi memakai 10 kata acak tanpa pengulangan lewat Fisher-Yates.
 */

import { shuffle } from '../utils/shuffle'

export const WORDS_PER_SESSION = 10

export const typingWordData = [
  /* ---------------- HEWAN ---------------- */
  { id: 1, word: 'AYAM', category: 'HEWAN', iconName: 'Bird', hintText: 'Hewan berkaki dua yang berkokok di pagi hari.' },
  { id: 2, word: 'BEBEK', category: 'HEWAN', iconName: 'Bird', hintText: 'Hewan yang suka berenang dan berbunyi kwek.' },
  { id: 3, word: 'IKAN', category: 'HEWAN', iconName: 'Fish', hintText: 'Hewan yang hidup di air dan berenang.' },
  { id: 4, word: 'KUCING', category: 'HEWAN', iconName: 'Cat', hintText: 'Hewan berbulu yang berbunyi meong.' },
  { id: 5, word: 'ANJING', category: 'HEWAN', iconName: 'Dog', hintText: 'Hewan setia yang berbunyi guk guk.' },
  { id: 6, word: 'KELINCI', category: 'HEWAN', iconName: 'Rabbit', hintText: 'Hewan bertelinga panjang yang suka wortel.' },
  { id: 7, word: 'SEMUT', category: 'HEWAN', iconName: 'Bug', hintText: 'Serangga kecil yang suka bergotong royong.' },
  { id: 8, word: 'TIKUS', category: 'HEWAN', iconName: 'Rat', hintText: 'Hewan kecil yang suka keju.' },
  { id: 9, word: 'SINGA', category: 'HEWAN', iconName: 'PawPrint', hintText: 'Hewan besar dengan surai di kepalanya.' },
  { id: 10, word: 'BURUNG', category: 'HEWAN', iconName: 'Bird', hintText: 'Hewan bersayap yang terbang di langit.' },
  { id: 11, word: 'LEBAH', category: 'HEWAN', iconName: 'Bug', hintText: 'Serangga kecil yang suka bunga dan madu.' },
  { id: 12, word: 'GAJAH', category: 'HEWAN', iconName: 'PawPrint', hintText: 'Hewan besar dengan belalai yang panjang.' },

  /* ---------------- BUAH ---------------- */
  { id: 13, word: 'APEL', category: 'BUAH', iconName: 'Apple', hintText: 'Buah manis berwarna merah yang renyah.' },
  { id: 14, word: 'PISANG', category: 'BUAH', iconName: 'Banana', hintText: 'Buah panjang berwarna kuning.' },
  { id: 15, word: 'JERUK', category: 'BUAH', iconName: 'Citrus', hintText: 'Buah bulat berwarna oranye dan segar.' },
  { id: 16, word: 'CERI', category: 'BUAH', iconName: 'Cherry', hintText: 'Buah kecil bulat berwarna merah.' },
  { id: 17, word: 'MANGGA', category: 'BUAH', iconName: 'Apple', hintText: 'Buah manis berwarna hijau atau kuning.' },
  { id: 18, word: 'ANGGUR', category: 'BUAH', iconName: 'Cherry', hintText: 'Buah kecil-kecil yang tumbuh bergerombol.' },
  { id: 19, word: 'SEMANGKA', category: 'BUAH', iconName: 'Circle', hintText: 'Buah besar berwarna hijau dengan daging merah.' },
  { id: 20, word: 'NANAS', category: 'BUAH', iconName: 'Citrus', hintText: 'Buah berdaun tajam dengan rasa manis asam.' },
  { id: 21, word: 'PEPAYA', category: 'BUAH', iconName: 'Apple', hintText: 'Buah lonjong berwarna oranye di dalamnya.' },
  { id: 22, word: 'STROBERI', category: 'BUAH', iconName: 'Cherry', hintText: 'Buah merah kecil dengan biji di permukaan.' },

  /* ---------------- MAINAN ---------------- */
  { id: 23, word: 'BOLA', category: 'MAINAN', iconName: 'Circle', hintText: 'Mainan bulat yang bisa ditendang.' },
  { id: 24, word: 'DADU', category: 'MAINAN', iconName: 'Dice5', hintText: 'Kubus kecil berisi angka untuk bermain.' },
  { id: 25, word: 'GITAR', category: 'MAINAN', iconName: 'Guitar', hintText: 'Alat musik dengan senar yang dipetik.' },
  { id: 26, word: 'YOYO', category: 'MAINAN', iconName: 'Circle', hintText: 'Mainan yang naik turun di tali.' },
  { id: 27, word: 'ROKET', category: 'MAINAN', iconName: 'Rocket', hintText: 'Mainan yang bisa terbang tinggi.' },
  { id: 28, word: 'BALON', category: 'MAINAN', iconName: 'Circle', hintText: 'Mainan bulat yang bisa mengembang.' },
  { id: 29, word: 'KERETA', category: 'MAINAN', iconName: 'Train', hintText: 'Mainan panjang yang berjalan di rel.' },
  { id: 30, word: 'BONEKA', category: 'MAINAN', iconName: 'Gift', hintText: 'Mainan empuk yang enak untuk dipeluk.' },

  /* ---------------- BENDA ---------------- */
  { id: 31, word: 'BUKU', category: 'BENDA', iconName: 'BookOpen', hintText: 'Lembaran kertas untuk membaca.' },
  { id: 32, word: 'JAM', category: 'BENDA', iconName: 'Clock', hintText: 'Alat untuk melihat waktu.' },
  { id: 33, word: 'LAMPU', category: 'BENDA', iconName: 'Lamp', hintText: 'Benda yang menerangi ruangan.' },
  { id: 34, word: 'PAYUNG', category: 'BENDA', iconName: 'Umbrella', hintText: 'Dipakai saat hujan agar tidak basah.' },
  { id: 35, word: 'PENSIL', category: 'BENDA', iconName: 'Pencil', hintText: 'Alat untuk menulis dan menggambar.' },
  { id: 36, word: 'SEPATU', category: 'BENDA', iconName: 'Footprints', hintText: 'Dipakai di kaki saat berjalan.' },
  { id: 37, word: 'TOPI', category: 'BENDA', iconName: 'GraduationCap', hintText: 'Dipakai di kepala untuk melindungi dari panas.' },
  { id: 38, word: 'SAPU', category: 'BENDA', iconName: 'Paintbrush', hintText: 'Alat untuk membersihkan lantai.' },
  { id: 39, word: 'GELAS', category: 'BENDA', iconName: 'GlassWater', hintText: 'Wadah untuk minum air.' },
  { id: 40, word: 'DOMPET', category: 'BENDA', iconName: 'Wallet', hintText: 'Tempat menyimpan uang.' },
  { id: 41, word: 'KURSI', category: 'BENDA', iconName: 'Armchair', hintText: 'Tempat untuk duduk.' },
  { id: 42, word: 'MEJA', category: 'BENDA', iconName: 'Table', hintText: 'Tempat untuk menulis atau makan.' },

  /* ---------------- MAKANAN ---------------- */
  { id: 43, word: 'NASI', category: 'MAKANAN', iconName: 'Utensils', hintText: 'Makanan pokok berwarna putih.' },
  { id: 44, word: 'ROTI', category: 'MAKANAN', iconName: 'Cake', hintText: 'Makanan empuk yang dipanggang.' },
  { id: 45, word: 'KUE', category: 'MAKANAN', iconName: 'Cake', hintText: 'Makanan manis untuk ulang tahun.' },
  { id: 46, word: 'PIZZA', category: 'MAKANAN', iconName: 'Pizza', hintText: 'Makanan bulat dengan potongan.' },
  { id: 47, word: 'SUSU', category: 'MAKANAN', iconName: 'Milk', hintText: 'Minuman putih yang sehat.' },
  { id: 48, word: 'TELUR', category: 'MAKANAN', iconName: 'Egg', hintText: 'Berasal dari ayam, berbentuk bulat lonjong.' },
  { id: 49, word: 'ESKRIM', category: 'MAKANAN', iconName: 'IceCream', hintText: 'Makanan dingin dan manis yang disukai anak.' },
  { id: 50, word: 'BAKSO', category: 'MAKANAN', iconName: 'Utensils', hintText: 'Makanan bulat dari daging yang berkuah.' },
]

/* Ambil 10 kata acak tanpa pengulangan untuk satu sesi */
export const createTypingSession = (count = WORDS_PER_SESSION) =>
  shuffle(typingWordData).slice(0, count)
