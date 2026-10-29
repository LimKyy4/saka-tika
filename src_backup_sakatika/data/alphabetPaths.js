// src/data/alphabetPaths.js
// Pedagogical handwriting stroke dictionary for uppercase letters A-Z.
// Standard primary school stroke order, precise start coordinates, and proportional guidelines.
// Coordinate space: 100 x 120 (Ascender: Y=16, Midline: Y=58, Baseline: Y=100, Descender: Y=114).
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

export const ALPHABET_PATHS = {
  A: {
    letter: "A",
    numStrokes: 3,
    viewBox: "0 0 100 120",
    instruction: "1. Tarik garis miring ke kiri bawah, 2. Tarik garis miring ke kanan bawah, 3. Sambung garis datar di tengah!",
    paths: [
      "M50,16 L18,100",  // 1: Top down-left
      "M50,16 L82,100",  // 2: Top down-right
      "M30,66 L70,66",   // 3: Middle crossbar left to right
    ],
    startNodes: [
      { number: 1, x: 44, y: 16, label: "Mulai 1" },
      { number: 2, x: 56, y: 16, label: "Mulai 2" },
      { number: 3, x: 30, y: 66, label: "Mulai 3" },
    ],
  },
  B: {
    letter: "B",
    numStrokes: 3,
    viewBox: "0 0 100 120",
    instruction: "1. Tarik tiang tegak lurus ke bawah, 2. Buat lengkungan atas, 3. Buat lengkungan bawah!",
    paths: [
      "M24,16 L24,100",
      "M24,16 C66,16 74,26 74,44 C74,58 60,58 24,58",
      "M24,58 C68,58 78,62 78,80 C78,100 62,100 24,100",
    ],
    startNodes: [
      { number: 1, x: 20, y: 16, label: "Mulai 1" },
      { number: 2, x: 34, y: 16, label: "Mulai 2" },
      { number: 3, x: 24, y: 58, label: "Mulai 3" },
    ],
  },
  C: {
    letter: "C",
    numStrokes: 1,
    viewBox: "0 0 100 120",
    instruction: "1. Mulai dari kanan atas, melengkung membulat ke kiri dan ke bawah!",
    paths: [
      "M80,32 C68,16 34,16 22,46 C14,66 18,90 48,100 C70,102 80,88 82,82",
    ],
    startNodes: [
      { number: 1, x: 80, y: 32, label: "Mulai 1" },
    ],
  },
  D: {
    letter: "D",
    numStrokes: 2,
    viewBox: "0 0 100 120",
    instruction: "1. Tarik tiang tegak ke bawah, 2. Buat lengkungan setengah lingkaran besar!",
    paths: [
      "M24,16 L24,100",
      "M24,16 C78,16 84,40 84,58 C84,80 74,100 24,100",
    ],
    startNodes: [
      { number: 1, x: 20, y: 16, label: "Mulai 1" },
      { number: 2, x: 34, y: 16, label: "Mulai 2" },
    ],
  },
  E: {
    letter: "E",
    numStrokes: 4,
    viewBox: "0 0 100 120",
    instruction: "1. Garis tegak ke bawah, 2. Garis datar atas, 3. Garis datar tengah, 4. Garis datar bawah!",
    paths: [
      "M24,16 L24,100",
      "M24,16 L76,16",
      "M24,58 L66,58",
      "M24,100 L76,100",
    ],
    startNodes: [
      { number: 1, x: 20, y: 16, label: "Mulai 1" },
      { number: 2, x: 34, y: 16, label: "Mulai 2" },
      { number: 3, x: 24, y: 58, label: "Mulai 3" },
      { number: 4, x: 24, y: 100, label: "Mulai 4" },
    ],
  },
  F: {
    letter: "F",
    numStrokes: 3,
    viewBox: "0 0 100 120",
    instruction: "1. Garis tegak ke bawah, 2. Garis datar atas, 3. Garis datar tengah!",
    paths: [
      "M24,16 L24,100",
      "M24,16 L76,16",
      "M24,58 L64,58",
    ],
    startNodes: [
      { number: 1, x: 20, y: 16, label: "Mulai 1" },
      { number: 2, x: 34, y: 16, label: "Mulai 2" },
      { number: 3, x: 24, y: 58, label: "Mulai 3" },
    ],
  },
  G: {
    letter: "G",
    numStrokes: 2,
    viewBox: "0 0 100 120",
    instruction: "1. Lengkung membulat ke bawah lalu naik, 2. Tarik garis datar ke dalam!",
    paths: [
      "M80,32 C68,16 34,16 22,46 C14,68 18,92 48,100 C72,100 80,86 80,60",
      "M80,60 L52,60",
    ],
    startNodes: [
      { number: 1, x: 80, y: 32, label: "Mulai 1" },
      { number: 2, x: 80, y: 60, label: "Mulai 2" },
    ],
  },
  H: {
    letter: "H",
    numStrokes: 3,
    viewBox: "0 0 100 120",
    instruction: "1. Tiang kiri ke bawah, 2. Tiang kanan ke bawah, 3. Jembatan mendatar di tengah!",
    paths: [
      "M22,16 L22,100",
      "M78,16 L78,100",
      "M22,58 L78,58",
    ],
    startNodes: [
      { number: 1, x: 22, y: 16, label: "Mulai 1" },
      { number: 2, x: 78, y: 16, label: "Mulai 2" },
      { number: 3, x: 22, y: 58, label: "Mulai 3" },
    ],
  },
  I: {
    letter: "I",
    numStrokes: 3,
    viewBox: "0 0 100 120",
    instruction: "1. Tiang tegak lurus di tengah, 2. Topi mendatar atas, 3. Alas mendatar bawah!",
    paths: [
      "M50,16 L50,100",
      "M30,16 L70,16",
      "M30,100 L70,100",
    ],
    startNodes: [
      { number: 1, x: 50, y: 24, label: "Mulai 1" },
      { number: 2, x: 30, y: 16, label: "Mulai 2" },
      { number: 3, x: 30, y: 100, label: "Mulai 3" },
    ],
  },
  J: {
    letter: "J",
    numStrokes: 2,
    viewBox: "0 0 100 120",
    instruction: "1. Atap mendatar atas, 2. Tiang turun melengkung ke kiri!",
    paths: [
      "M30,16 L74,16",
      "M56,16 L56,76 C56,98 42,102 24,92",
    ],
    startNodes: [
      { number: 1, x: 30, y: 16, label: "Mulai 1" },
      { number: 2, x: 56, y: 22, label: "Mulai 2" },
    ],
  },
  K: {
    letter: "K",
    numStrokes: 3,
    viewBox: "0 0 100 120",
    instruction: "1. Tiang tegak ke bawah, 2. Garis miring ke tengah, 3. Kaki miring ke bawah!",
    paths: [
      "M24,16 L24,100",
      "M78,18 L26,60",
      "M26,60 L78,100",
    ],
    startNodes: [
      { number: 1, x: 24, y: 16, label: "Mulai 1" },
      { number: 2, x: 78, y: 18, label: "Mulai 2" },
      { number: 3, x: 30, y: 60, label: "Mulai 3" },
    ],
  },
  L: {
    letter: "L",
    numStrokes: 1,
    viewBox: "0 0 100 120",
    instruction: "1. Tarik tegak lurus ke bawah, lalu langsung belok mendatar ke kanan!",
    paths: [
      "M24,16 L24,100 L78,100",
    ],
    startNodes: [
      { number: 1, x: 24, y: 16, label: "Mulai 1" },
    ],
  },
  M: {
    letter: "M",
    numStrokes: 4,
    viewBox: "0 0 100 120",
    instruction: "1. Tiang kiri ke bawah, 2. Meluncur ke tengah bawah, 3. Naik ke kanan atas, 4. Tiang kanan ke bawah!",
    paths: [
      "M18,16 L18,100",
      "M18,16 L50,72",
      "M50,72 L82,16",
      "M82,16 L82,100",
    ],
    startNodes: [
      { number: 1, x: 18, y: 16, label: "Mulai 1" },
      { number: 2, x: 24, y: 20, label: "Mulai 2" },
      { number: 3, x: 50, y: 72, label: "Mulai 3" },
      { number: 4, x: 82, y: 16, label: "Mulai 4" },
    ],
  },
  N: {
    letter: "N",
    numStrokes: 3,
    viewBox: "0 0 100 120",
    instruction: "1. Tiang kiri ke bawah, 2. Meluncur miring ke kanan bawah, 3. Tiang kanan ke bawah!",
    paths: [
      "M22,16 L22,100",
      "M22,16 L78,100",
      "M78,16 L78,100",
    ],
    startNodes: [
      { number: 1, x: 22, y: 16, label: "Mulai 1" },
      { number: 2, x: 28, y: 20, label: "Mulai 2" },
      { number: 3, x: 78, y: 16, label: "Mulai 3" },
    ],
  },
  O: {
    letter: "O",
    numStrokes: 1,
    viewBox: "0 0 100 120",
    instruction: "1. Mulai dari atas, buat lingkaran bulat besar sampai bertemu kembali!",
    paths: [
      "M50,16 C78,16 84,40 84,58 C84,82 76,100 50,100 C24,100 16,82 16,58 C16,40 22,16 50,16",
    ],
    startNodes: [
      { number: 1, x: 50, y: 16, label: "Mulai 1" },
    ],
  },
  P: {
    letter: "P",
    numStrokes: 2,
    viewBox: "0 0 100 120",
    instruction: "1. Tiang tegak lurus ke bawah, 2. Buat kepala bundar di kanan atas!",
    paths: [
      "M24,16 L24,100",
      "M24,16 C76,16 78,26 78,44 C78,62 66,62 24,62",
    ],
    startNodes: [
      { number: 1, x: 20, y: 16, label: "Mulai 1" },
      { number: 2, x: 32, y: 16, label: "Mulai 2" },
    ],
  },
  Q: {
    letter: "Q",
    numStrokes: 2,
    viewBox: "0 0 100 120",
    instruction: "1. Buat lingkaran bulat penuh, 2. Beri ekor miring kecil di kanan bawah!",
    paths: [
      "M50,16 C78,16 84,40 84,58 C84,82 76,100 50,100 C24,100 16,82 16,58 C16,40 22,16 50,16",
      "M58,76 L86,104",
    ],
    startNodes: [
      { number: 1, x: 50, y: 16, label: "Mulai 1" },
      { number: 2, x: 58, y: 76, label: "Mulai 2" },
    ],
  },
  R: {
    letter: "R",
    numStrokes: 3,
    viewBox: "0 0 100 120",
    instruction: "1. Tiang tegak ke bawah, 2. Kepala bundar atas, 3. Kaki miring ke kanan bawah!",
    paths: [
      "M24,16 L24,100",
      "M24,16 C74,16 76,24 76,42 C76,58 64,58 24,58",
      "M46,58 L80,100",
    ],
    startNodes: [
      { number: 1, x: 20, y: 16, label: "Mulai 1" },
      { number: 2, x: 32, y: 16, label: "Mulai 2" },
      { number: 3, x: 46, y: 58, label: "Mulai 3" },
    ],
  },
  S: {
    letter: "S",
    numStrokes: 1,
    viewBox: "0 0 100 120",
    instruction: "1. Lengkung ke kiri atas, putar meliuk ke kanan, lalu ke kiri bawah!",
    paths: [
      "M78,30 C70,16 42,16 28,28 C14,40 28,52 50,58 C74,66 84,76 80,90 C74,102 44,102 22,94",
    ],
    startNodes: [
      { number: 1, x: 78, y: 30, label: "Mulai 1" },
    ],
  },
  T: {
    letter: "T",
    numStrokes: 2,
    viewBox: "0 0 100 120",
    instruction: "1. Atap mendatar di atas, 2. Tiang tegak lurus di tengah!",
    paths: [
      "M15,16 L85,16",
      "M50,16 L50,100",
    ],
    startNodes: [
      { number: 1, x: 15, y: 16, label: "Mulai 1" },
      { number: 2, x: 50, y: 22, label: "Mulai 2" },
    ],
  },
  U: {
    letter: "U",
    numStrokes: 1,
    viewBox: "0 0 100 120",
    instruction: "1. Turun melengkung seperti mangkuk sup, lalu naik kembali ke atas!",
    paths: [
      "M22,16 L22,72 C22,96 36,100 50,100 C64,100 78,96 78,72 L78,16",
    ],
    startNodes: [
      { number: 1, x: 22, y: 16, label: "Mulai 1" },
    ],
  },
  V: {
    letter: "V",
    numStrokes: 2,
    viewBox: "0 0 100 120",
    instruction: "1. Turun miring ke titik tengah bawah, 2. Naik miring ke kanan atas!",
    paths: [
      "M18,16 L50,100",
      "M50,100 L82,16",
    ],
    startNodes: [
      { number: 1, x: 18, y: 16, label: "Mulai 1" },
      { number: 2, x: 50, y: 100, label: "Mulai 2" },
    ],
  },
  W: {
    letter: "W",
    numStrokes: 4,
    viewBox: "0 0 100 120",
    instruction: "1. Turun miring, 2. Naik ke tengah, 3. Turun lagi, 4. Naik kembali ke atas!",
    paths: [
      "M14,16 L32,100",
      "M32,100 L50,48",
      "M50,48 L68,100",
      "M68,100 L86,16",
    ],
    startNodes: [
      { number: 1, x: 14, y: 16, label: "Mulai 1" },
      { number: 2, x: 32, y: 100, label: "Mulai 2" },
      { number: 3, x: 50, y: 48, label: "Mulai 3" },
      { number: 4, x: 68, y: 100, label: "Mulai 4" },
    ],
  },
  X: {
    letter: "X",
    numStrokes: 2,
    viewBox: "0 0 100 120",
    instruction: "1. Silang miring ke kanan bawah, 2. Silang miring ke kiri bawah!",
    paths: [
      "M20,16 L80,100",
      "M80,16 L20,100",
    ],
    startNodes: [
      { number: 1, x: 20, y: 16, label: "Mulai 1" },
      { number: 2, x: 80, y: 16, label: "Mulai 2" },
    ],
  },
  Y: {
    letter: "Y",
    numStrokes: 3,
    viewBox: "0 0 100 120",
    instruction: "1. Cabang miring kiri ke tengah, 2. Cabang miring kanan ke tengah, 3. Tiang tegak ke bawah!",
    paths: [
      "M18,16 L50,60",
      "M82,16 L50,60",
      "M50,60 L50,100",
    ],
    startNodes: [
      { number: 1, x: 18, y: 16, label: "Mulai 1" },
      { number: 2, x: 82, y: 16, label: "Mulai 2" },
      { number: 3, x: 50, y: 60, label: "Mulai 3" },
    ],
  },
  Z: {
    letter: "Z",
    numStrokes: 3,
    viewBox: "0 0 100 120",
    instruction: "1. Garis datar atas, 2. Meluncur miring ke kiri bawah, 3. Garis datar bawah!",
    paths: [
      "M20,18 L80,18",
      "M80,18 L20,100",
      "M20,100 L80,100",
    ],
    startNodes: [
      { number: 1, x: 20, y: 18, label: "Mulai 1" },
      { number: 2, x: 80, y: 18, label: "Mulai 2" },
      { number: 3, x: 20, y: 100, label: "Mulai 3" },
    ],
  },
};
