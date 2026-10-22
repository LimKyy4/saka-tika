/**
 * Dataset 50 kata sederhana untuk Modul 4: Mengetik Huruf.
 *
 * Setiap kata:
 * - id       : 1 - 50
 * - word     : kata dalam huruf kapital
 * - iconName : nama ikon Lucide (lihat utils/letterIcons.js)
 * - category : kelompok benda
 * - hintText : petunjuk singkat untuk anak
 *
 * Satu sesi memakai 10 kata acak lewat Fisher-Yates Shuffle.
 */

import { shuffle } from '../utils/shuffle'

export const WORDS_PER_SESSION = 10

export const typingData = [
  { id: 1, word: 'APEL', iconName: 'Apple', category: 'Buah', hintText: 'Buah bulat berwarna merah atau hijau.' },
  { id: 2, word: 'AYAM', iconName: 'Bird', category: 'Hewan', hintText: 'Hewan berkaki dua yang berkokok.' },
  { id: 3, word: 'BOLA', iconName: 'Circle', category: 'Mainan', hintText: 'Mainan bulat yang bisa ditendang.' },
  { id: 4, word: 'BUKU', iconName: 'BookOpen', category: 'Sekolah', hintText: 'Lembaran kertas untuk membaca.' },
  { id: 5, word: 'BEBEK', iconName: 'Bird', category: 'Hewan', hintText: 'Hewan yang suka berenang dan berbunyi kwek.' },
  { id: 6, word: 'BUNGA', iconName: 'Flower2', category: 'Alam', hintText: 'Tanaman cantik yang berwarna-warni.' },
  { id: 7, word: 'CANGKIR', iconName: 'Coffee', category: 'Dapur', hintText: 'Wadah untuk minum teh atau kopi.' },
  { id: 8, word: 'CERI', iconName: 'Cherry', category: 'Buah', hintText: 'Buah kecil bulat berwarna merah.' },
  { id: 9, word: 'CELANA', iconName: 'Shirt', category: 'Pakaian', hintText: 'Dipakai di bagian bawah tubuh.' },
  { id: 10, word: 'DADU', iconName: 'Dice5', category: 'Mainan', hintText: 'Kubus kecil berisi angka untuk bermain.' },
  { id: 11, word: 'DAUN', iconName: 'Leaf', category: 'Alam', hintText: 'Bagian hijau pada tanaman.' },
  { id: 12, word: 'DOMPET', iconName: 'Wallet', category: 'Benda', hintText: 'Tempat menyimpan uang.' },
  { id: 13, word: 'ELANG', iconName: 'Bird', category: 'Hewan', hintText: 'Burung besar yang terbang tinggi.' },
  { id: 14, word: 'GELAS', iconName: 'GlassWater', category: 'Dapur', hintText: 'Wadah untuk minum air.' },
  { id: 15, word: 'GITAR', iconName: 'Guitar', category: 'Mainan', hintText: 'Alat musik dengan senar.' },
  { id: 16, word: 'HATI', iconName: 'Heart', category: 'Tubuh', hintText: 'Organ di dalam dada yang berdetak.' },
  { id: 17, word: 'IKAN', iconName: 'Fish', category: 'Hewan', hintText: 'Hewan yang hidup di air.' },
  { id: 18, word: 'JAM', iconName: 'Clock', category: 'Benda', hintText: 'Alat untuk melihat waktu.' },
  { id: 19, word: 'JERUK', iconName: 'Citrus', category: 'Buah', hintText: 'Buah bulat berwarna oranye.' },
  { id: 20, word: 'KAPAL', iconName: 'Ship', category: 'Kendaraan', hintText: 'Kendaraan besar yang berlayar di laut.' },
  { id: 21, word: 'KELINCI', iconName: 'Rabbit', category: 'Hewan', hintText: 'Hewan bertelinga panjang yang suka wortel.' },
  { id: 22, word: 'KERETA', iconName: 'Train', category: 'Kendaraan', hintText: 'Kendaraan panjang yang berjalan di rel.' },
  { id: 23, word: 'KUCING', iconName: 'Cat', category: 'Hewan', hintText: 'Hewan berbulu yang berbunyi meong.' },
  { id: 24, word: 'KUE', iconName: 'Cake', category: 'Makanan', hintText: 'Makanan manis untuk ulang tahun.' },
  { id: 25, word: 'KURSI', iconName: 'Armchair', category: 'Rumah', hintText: 'Tempat untuk duduk.' },
  { id: 26, word: 'LAMPU', iconName: 'Lamp', category: 'Rumah', hintText: 'Benda yang menerangi ruangan.' },
  { id: 27, word: 'LILIN', iconName: 'Flame', category: 'Benda', hintText: 'Benda yang menyala dengan api kecil.' },
  { id: 28, word: 'MEJA', iconName: 'Table', category: 'Rumah', hintText: 'Tempat untuk menulis atau makan.' },
  { id: 29, word: 'MOBIL', iconName: 'Car', category: 'Kendaraan', hintText: 'Kendaraan beroda empat.' },
  { id: 30, word: 'NASI', iconName: 'Utensils', category: 'Makanan', hintText: 'Makanan pokok berwarna putih.' },
  { id: 31, word: 'OBAT', iconName: 'Pill', category: 'Kesehatan', hintText: 'Diminum saat sakit.' },
  { id: 32, word: 'PAYUNG', iconName: 'Umbrella', category: 'Benda', hintText: 'Dipakai saat hujan.' },
  { id: 33, word: 'PENSIL', iconName: 'Pencil', category: 'Sekolah', hintText: 'Alat untuk menulis dan menggambar.' },
  { id: 34, word: 'PESAWAT', iconName: 'Plane', category: 'Kendaraan', hintText: 'Kendaraan yang terbang di langit.' },
  { id: 35, word: 'PISANG', iconName: 'Banana', category: 'Buah', hintText: 'Buah panjang berwarna kuning.' },
  { id: 36, word: 'PIZZA', iconName: 'Pizza', category: 'Makanan', hintText: 'Makanan bulat dengan potongan.' },
  { id: 37, word: 'ROKET', iconName: 'Rocket', category: 'Kendaraan', hintText: 'Kendaraan yang terbang ke angkasa.' },
  { id: 38, word: 'SALJU', iconName: 'Snowflake', category: 'Alam', hintText: 'Butiran putih yang turun saat dingin.' },
  { id: 39, word: 'SAPU', iconName: 'Paintbrush', category: 'Rumah', hintText: 'Alat untuk membersihkan lantai.' },
  { id: 40, word: 'SEMUT', iconName: 'Bug', category: 'Hewan', hintText: 'Serangga kecil yang suka bergotong royong.' },
  { id: 41, word: 'SEPATU', iconName: 'Footprints', category: 'Pakaian', hintText: 'Dipakai di kaki saat berjalan.' },
  { id: 42, word: 'SEPEDA', iconName: 'Bike', category: 'Kendaraan', hintText: 'Kendaraan beroda dua yang dikayuh.' },
  { id: 43, word: 'SINGA', iconName: 'PawPrint', category: 'Hewan', hintText: 'Hewan besar dengan surai di kepalanya.' },
  { id: 44, word: 'SUSU', iconName: 'Milk', category: 'Minuman', hintText: 'Minuman putih yang sehat.' },
  { id: 45, word: 'TELUR', iconName: 'Egg', category: 'Makanan', hintText: 'Berasal dari ayam, berbentuk bulat lonjong.' },
  { id: 46, word: 'TIKUS', iconName: 'Rat', category: 'Hewan', hintText: 'Hewan kecil yang suka keju.' },
  { id: 47, word: 'TOPI', iconName: 'GraduationCap', category: 'Pakaian', hintText: 'Dipakai di kepala.' },
  { id: 48, word: 'VAS', iconName: 'Flower2', category: 'Rumah', hintText: 'Wadah untuk meletakkan bunga.' },
  { id: 49, word: 'WORTEL', iconName: 'Carrot', category: 'Sayur', hintText: 'Sayuran oranye kesukaan kelinci.' },
  { id: 50, word: 'YOYO', iconName: 'Circle', category: 'Mainan', hintText: 'Mainan yang naik turun di tali.' },
]

/* Ambil 10 kata acak tanpa pengulangan untuk satu babak */
export const createTypingSession = (count = WORDS_PER_SESSION) =>
  shuffle(typingData).slice(0, count)
