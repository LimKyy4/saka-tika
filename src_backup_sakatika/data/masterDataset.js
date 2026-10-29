// src/data/masterDataset.js
// Master dataset — 50 Indonesian child-friendly words for all mini-games.
// ZERO EMOJIS anywhere in this file.

export const ALPHABET_DATA = [
  { letter: "A", lowercase: "a", phonetic: "a",     word: "Apel",     color: "#EF4444", illustrationKey: "apel"     },
  { letter: "B", lowercase: "b", phonetic: "be",    word: "Bola",     color: "#3B82F6", illustrationKey: "bola"     },
  { letter: "C", lowercase: "c", phonetic: "ce",    word: "Ceri",     color: "#22C55E", illustrationKey: "ceri"     },
  { letter: "D", lowercase: "d", phonetic: "de",    word: "Dadu",     color: "#F59E0B", illustrationKey: "dadu"     },
  { letter: "E", lowercase: "e", phonetic: "e",     word: "Ember",    color: "#8B5CF6", illustrationKey: "ember"    },
  { letter: "F", lowercase: "f", phonetic: "ef",    word: "Foto",     color: "#EC4899", illustrationKey: "foto"     },
  { letter: "G", lowercase: "g", phonetic: "ge",    word: "Gajah",    color: "#14B8A6", illustrationKey: "gajah"    },
  { letter: "H", lowercase: "h", phonetic: "ha",    word: "Harimau",  color: "#EF4444", illustrationKey: "harimau"  },
  { letter: "I", lowercase: "i", phonetic: "i",     word: "Ikan",     color: "#3B82F6", illustrationKey: "ikan"     },
  { letter: "J", lowercase: "j", phonetic: "je",    word: "Jeruk",    color: "#F59E0B", illustrationKey: "jeruk"    },
  { letter: "K", lowercase: "k", phonetic: "ka",    word: "Kucing",   color: "#22C55E", illustrationKey: "kucing"   },
  { letter: "L", lowercase: "l", phonetic: "el",    word: "Lampu",    color: "#8B5CF6", illustrationKey: "lampu"    },
  { letter: "M", lowercase: "m", phonetic: "em",    word: "Mobil",    color: "#EC4899", illustrationKey: "mobil"    },
  { letter: "N", lowercase: "n", phonetic: "en",    word: "Nanas",    color: "#14B8A6", illustrationKey: "nanas"    },
  { letter: "O", lowercase: "o", phonetic: "o",     word: "Obat",     color: "#EF4444", illustrationKey: "obat"     },
  { letter: "P", lowercase: "p", phonetic: "pe",    word: "Pisang",   color: "#3B82F6", illustrationKey: "pisang"   },
  { letter: "Q", lowercase: "q", phonetic: "ki",    word: "Quran",    color: "#22C55E", illustrationKey: "quran"    },
  { letter: "R", lowercase: "r", phonetic: "er",    word: "Roti",     color: "#F59E0B", illustrationKey: "roti"     },
  { letter: "S", lowercase: "s", phonetic: "es",    word: "Susu",     color: "#8B5CF6", illustrationKey: "susu"     },
  { letter: "T", lowercase: "t", phonetic: "te",    word: "Topi",     color: "#EC4899", illustrationKey: "topi"     },
  { letter: "U", lowercase: "u", phonetic: "u",     word: "Udang",    color: "#14B8A6", illustrationKey: "udang"    },
  { letter: "V", lowercase: "v", phonetic: "fe",    word: "Vas",      color: "#EF4444", illustrationKey: "vas"      },
  { letter: "W", lowercase: "w", phonetic: "we",    word: "Wortel",   color: "#3B82F6", illustrationKey: "wortel"   },
  { letter: "X", lowercase: "x", phonetic: "eks",   word: "Xilofon",  color: "#22C55E", illustrationKey: "xilofon"  },
  { letter: "Y", lowercase: "y", phonetic: "ye",    word: "Yoyo",     color: "#F59E0B", illustrationKey: "yoyo"     },
  { letter: "Z", lowercase: "z", phonetic: "zet",   word: "Zebra",    color: "#8B5CF6", illustrationKey: "zebra"    },
];

// Additional 24 words to form a 50-item bank for mini-games
const EXTRA_WORDS = [
  { id: "w27", targetLetter: "B", word: "Buku",    missingIndex: 0, distractors: ["A","C","D"], illustrationKey: "buku",    category: "benda",   color: "#3B82F6" },
  { id: "w28", targetLetter: "M", word: "Meja",    missingIndex: 0, distractors: ["N","L","K"], illustrationKey: "meja",    category: "benda",   color: "#EC4899" },
  { id: "w29", targetLetter: "K", word: "Kursi",   missingIndex: 0, distractors: ["G","H","B"], illustrationKey: "kursi",   category: "benda",   color: "#22C55E" },
  { id: "w30", targetLetter: "B", word: "Bunga",   missingIndex: 0, distractors: ["D","G","P"], illustrationKey: "bunga",   category: "alam",    color: "#EC4899" },
  { id: "w31", targetLetter: "P", word: "Pohon",   missingIndex: 0, distractors: ["B","M","T"], illustrationKey: "pohon",   category: "alam",    color: "#22C55E" },
  { id: "w32", targetLetter: "R", word: "Rumah",   missingIndex: 0, distractors: ["S","T","N"], illustrationKey: "rumah",   category: "benda",   color: "#EF4444" },
  { id: "w33", targetLetter: "M", word: "Mata",    missingIndex: 0, distractors: ["N","L","B"], illustrationKey: "mata",    category: "tubuh",   color: "#F59E0B" },
  { id: "w34", targetLetter: "K", word: "Kaki",    missingIndex: 0, distractors: ["G","H","T"], illustrationKey: "kaki",    category: "tubuh",   color: "#8B5CF6" },
  { id: "w35", targetLetter: "G", word: "Gigi",    missingIndex: 0, distractors: ["B","D","K"], illustrationKey: "gigi",    category: "tubuh",   color: "#14B8A6" },
  { id: "w36", targetLetter: "B", word: "Baju",    missingIndex: 0, distractors: ["D","P","M"], illustrationKey: "baju",    category: "pakaian", color: "#3B82F6" },
  { id: "w37", targetLetter: "S", word: "Sepatu",  missingIndex: 0, distractors: ["B","T","K"], illustrationKey: "sepatu",  category: "pakaian", color: "#8B5CF6" },
  { id: "w38", targetLetter: "P", word: "Payung",  missingIndex: 0, distractors: ["B","M","T"], illustrationKey: "payung",  category: "benda",   color: "#EF4444" },
  { id: "w39", targetLetter: "B", word: "Balon",   missingIndex: 0, distractors: ["D","G","K"], illustrationKey: "balon",   category: "mainan",  color: "#F59E0B" },
  { id: "w40", targetLetter: "K", word: "Kue",     missingIndex: 0, distractors: ["B","M","S"], illustrationKey: "kue",     category: "makanan", color: "#EC4899" },
  { id: "w41", targetLetter: "E", word: "Es",      missingIndex: 0, distractors: ["A","I","O"], illustrationKey: "es",      category: "makanan", color: "#3B82F6" },
  { id: "w42", targetLetter: "A", word: "Awan",    missingIndex: 0, distractors: ["I","O","E"], illustrationKey: "awan",    category: "alam",    color: "#EF4444" },
  { id: "w43", targetLetter: "B", word: "Bulan",   missingIndex: 0, distractors: ["D","G","M"], illustrationKey: "bulan",   category: "alam",    color: "#8B5CF6" },
  { id: "w44", targetLetter: "B", word: "Bintang", missingIndex: 0, distractors: ["D","G","K"], illustrationKey: "bintang", category: "alam",    color: "#F59E0B" },
  { id: "w45", targetLetter: "K", word: "Kapal",   missingIndex: 0, distractors: ["G","B","T"], illustrationKey: "kapal",   category: "kendaraan", color: "#14B8A6" },
  { id: "w46", targetLetter: "K", word: "Kereta",  missingIndex: 0, distractors: ["G","B","M"], illustrationKey: "kereta",  category: "kendaraan", color: "#3B82F6" },
  { id: "w47", targetLetter: "A", word: "Ayam",    missingIndex: 0, distractors: ["I","E","O"], illustrationKey: "ayam",    category: "hewan",   color: "#F59E0B" },
  { id: "w48", targetLetter: "B", word: "Bebek",   missingIndex: 0, distractors: ["D","G","K"], illustrationKey: "bebek",   category: "hewan",   color: "#22C55E" },
  { id: "w49", targetLetter: "S", word: "Sapi",    missingIndex: 0, distractors: ["B","T","K"], illustrationKey: "sapi",    category: "hewan",   color: "#EF4444" },
  { id: "w50", targetLetter: "K", word: "Kuda",    missingIndex: 0, distractors: ["G","B","T"], illustrationKey: "kuda",    category: "hewan",   color: "#8B5CF6" },
];

// Build structured 50-item bank: first 26 from ALPHABET_DATA, then 24 extras
export const GAME_SAMPLES_50 = [
  ...ALPHABET_DATA.map((item, i) => ({
    id: `a${i + 1}`,
    targetLetter: item.letter,
    word: item.word,
    missingIndex: 0,
    distractors: ["?", "?", "?"], // filled by game logic
    illustrationKey: item.illustrationKey,
    category: "huruf",
    color: item.color,
  })),
  ...EXTRA_WORDS,
];
