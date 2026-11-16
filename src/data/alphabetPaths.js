// src/data/alphabetPaths.js
// Clean-Slate Pedagogical Handwriting Stroke Dictionary for Uppercase Letters A-Z.
// Strictly 1-indexed strokes (1, 2, 3...), proportional coordinates within 100x120 viewBox,
// and deterministic start/end checkpoints for forgiving 80-100px hit detection.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

export const ALPHABET_PATHS = {
  "A": {
    "letter": "A",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik garis miring ke kiri bawah, 2. Tarik garis miring ke kanan bawah, 3. Sambung garis datar di tengah!",
    "paths": [
      "M50,16 L18,100",
      "M50,16 L82,100",
      "M30,66 L70,66"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 44,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 56,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 30,
        "y": 66,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 50,
          "y": 16
        },
        "end": {
          "x": 18,
          "y": 100
        }
      },
      {
        "start": {
          "x": 50,
          "y": 16
        },
        "end": {
          "x": 82,
          "y": 100
        }
      },
      {
        "start": {
          "x": 30,
          "y": 66
        },
        "end": {
          "x": 70,
          "y": 66
        }
      }
    ]
  },
  "B": {
    "letter": "B",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tegak lurus ke bawah, 2. Buat lengkungan atas, 3. Buat lengkungan bawah!",
    "paths": [
      "M24,16 L24,100",
      "M24,16 C66,16 74,26 74,44 C74,58 60,58 24,58",
      "M24,58 C68,58 78,62 78,80 C78,100 62,100 24,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 20,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 34,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 24,
        "y": 58,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 24,
          "y": 16
        },
        "end": {
          "x": 24,
          "y": 100
        }
      },
      {
        "start": {
          "x": 24,
          "y": 16
        },
        "end": {
          "x": 24,
          "y": 58
        }
      },
      {
        "start": {
          "x": 24,
          "y": 58
        },
        "end": {
          "x": 24,
          "y": 100
        }
      }
    ]
  },
  "C": {
    "letter": "C",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Mulai dari kanan atas, melengkung membulat ke kiri dan ke bawah!",
    "paths": [
      "M80,32 C68,16 34,16 22,46 C14,66 18,90 48,100 C70,102 80,88 82,82"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 80,
        "y": 32,
        "label": "Mulai 1"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 80,
          "y": 32
        },
        "end": {
          "x": 82,
          "y": 82
        }
      }
    ]
  },
  "D": {
    "letter": "D",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tegak ke bawah, 2. Buat lengkungan setengah lingkaran besar!",
    "paths": [
      "M24,16 L24,100",
      "M24,16 C78,16 84,40 84,58 C84,80 74,100 24,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 20,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 34,
        "y": 16,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 24,
          "y": 16
        },
        "end": {
          "x": 24,
          "y": 100
        }
      },
      {
        "start": {
          "x": 24,
          "y": 16
        },
        "end": {
          "x": 24,
          "y": 100
        }
      }
    ]
  },
  "E": {
    "letter": "E",
    "numStrokes": 4,
    "viewBox": "0 0 100 120",
    "instruction": "1. Garis tegak ke bawah, 2. Garis datar atas, 3. Garis datar tengah, 4. Garis datar bawah!",
    "paths": [
      "M24,16 L24,100",
      "M24,16 L76,16",
      "M24,58 L66,58",
      "M24,100 L76,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 20,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 34,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 24,
        "y": 58,
        "label": "Mulai 3"
      },
      {
        "number": 4,
        "x": 24,
        "y": 100,
        "label": "Mulai 4"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 24,
          "y": 16
        },
        "end": {
          "x": 24,
          "y": 100
        }
      },
      {
        "start": {
          "x": 24,
          "y": 16
        },
        "end": {
          "x": 76,
          "y": 16
        }
      },
      {
        "start": {
          "x": 24,
          "y": 58
        },
        "end": {
          "x": 66,
          "y": 58
        }
      },
      {
        "start": {
          "x": 24,
          "y": 100
        },
        "end": {
          "x": 76,
          "y": 100
        }
      }
    ]
  },
  "F": {
    "letter": "F",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Garis tegak ke bawah, 2. Garis datar atas, 3. Garis datar tengah!",
    "paths": [
      "M24,16 L24,100",
      "M24,16 L76,16",
      "M24,58 L64,58"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 20,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 34,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 24,
        "y": 58,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 24,
          "y": 16
        },
        "end": {
          "x": 24,
          "y": 100
        }
      },
      {
        "start": {
          "x": 24,
          "y": 16
        },
        "end": {
          "x": 76,
          "y": 16
        }
      },
      {
        "start": {
          "x": 24,
          "y": 58
        },
        "end": {
          "x": 64,
          "y": 58
        }
      }
    ]
  },
  "G": {
    "letter": "G",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat lengkungan melingkar dari atas ke bawah, 2. Tarik garis datar masuk ke dalam!",
    "paths": [
      "M80,32 C68,16 34,16 22,46 C14,68 18,92 48,100 C72,100 80,86 80,60",
      "M80,60 L52,60"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 80,
        "y": 32,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 80,
        "y": 60,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 80,
          "y": 32
        },
        "end": {
          "x": 80,
          "y": 60
        }
      },
      {
        "start": {
          "x": 80,
          "y": 60
        },
        "end": {
          "x": 52,
          "y": 60
        }
      }
    ]
  },
  "H": {
    "letter": "H",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tiang kiri ke bawah, 2. Tiang kanan ke bawah, 3. Sambungkan jembatan di tengah!",
    "paths": [
      "M22,16 L22,100",
      "M78,16 L78,100",
      "M22,58 L78,58"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 22,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 78,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 22,
        "y": 58,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 22,
          "y": 16
        },
        "end": {
          "x": 22,
          "y": 100
        }
      },
      {
        "start": {
          "x": 78,
          "y": 16
        },
        "end": {
          "x": 78,
          "y": 100
        }
      },
      {
        "start": {
          "x": 22,
          "y": 58
        },
        "end": {
          "x": 78,
          "y": 58
        }
      }
    ]
  },
  "I": {
    "letter": "I",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tegak di tengah, 2. Garis topi di atas, 3. Garis alas di bawah!",
    "paths": [
      "M50,16 L50,100",
      "M30,16 L70,16",
      "M30,100 L70,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 50,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 30,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 30,
        "y": 100,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 50,
          "y": 16
        },
        "end": {
          "x": 50,
          "y": 100
        }
      },
      {
        "start": {
          "x": 30,
          "y": 16
        },
        "end": {
          "x": 70,
          "y": 16
        }
      },
      {
        "start": {
          "x": 30,
          "y": 100
        },
        "end": {
          "x": 70,
          "y": 100
        }
      }
    ]
  },
  "J": {
    "letter": "J",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Garis topi di atas, 2. Tiang tegak meluncur lalu melengkung seperti payung!",
    "paths": [
      "M30,16 L74,16",
      "M56,16 L56,76 C56,98 42,102 24,92"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 30,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 56,
        "y": 16,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 30,
          "y": 16
        },
        "end": {
          "x": 74,
          "y": 16
        }
      },
      {
        "start": {
          "x": 56,
          "y": 16
        },
        "end": {
          "x": 24,
          "y": 92
        }
      }
    ]
  },
  "K": {
    "letter": "K",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tiang tegak ke bawah, 2. Garis miring ke tengah, 3. Garis kaki meluncur ke kanan bawah!",
    "paths": [
      "M24,16 L24,100",
      "M78,18 L26,60",
      "M26,60 L78,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 20,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 78,
        "y": 18,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 26,
        "y": 60,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 24,
          "y": 16
        },
        "end": {
          "x": 24,
          "y": 100
        }
      },
      {
        "start": {
          "x": 78,
          "y": 18
        },
        "end": {
          "x": 26,
          "y": 60
        }
      },
      {
        "start": {
          "x": 26,
          "y": 60
        },
        "end": {
          "x": 78,
          "y": 100
        }
      }
    ]
  },
  "L": {
    "letter": "L",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tiang lurus ke bawah, lalu belok datar ke kanan!",
    "paths": [
      "M24,16 L24,100 L78,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 24,
        "y": 16,
        "label": "Mulai 1"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 24,
          "y": 16
        },
        "end": {
          "x": 78,
          "y": 100
        }
      }
    ]
  },
  "M": {
    "letter": "M",
    "numStrokes": 4,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tiang kiri ke bawah, 2. Meluncur ke tengah bawah, 3. Naik ke kanan atas, 4. Tiang kanan ke bawah!",
    "paths": [
      "M18,16 L18,100",
      "M18,16 L50,72",
      "M50,72 L82,16",
      "M82,16 L82,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 18,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 24,
        "y": 20,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 50,
        "y": 72,
        "label": "Mulai 3"
      },
      {
        "number": 4,
        "x": 82,
        "y": 16,
        "label": "Mulai 4"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 18,
          "y": 16
        },
        "end": {
          "x": 18,
          "y": 100
        }
      },
      {
        "start": {
          "x": 18,
          "y": 16
        },
        "end": {
          "x": 50,
          "y": 72
        }
      },
      {
        "start": {
          "x": 50,
          "y": 72
        },
        "end": {
          "x": 82,
          "y": 16
        }
      },
      {
        "start": {
          "x": 82,
          "y": 16
        },
        "end": {
          "x": 82,
          "y": 100
        }
      }
    ]
  },
  "N": {
    "letter": "N",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tiang kiri ke bawah, 2. Meluncur miring ke kanan bawah, 3. Tiang kanan ke bawah!",
    "paths": [
      "M22,16 L22,100",
      "M22,16 L78,100",
      "M78,16 L78,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 22,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 28,
        "y": 20,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 78,
        "y": 16,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 22,
          "y": 16
        },
        "end": {
          "x": 22,
          "y": 100
        }
      },
      {
        "start": {
          "x": 22,
          "y": 16
        },
        "end": {
          "x": 78,
          "y": 100
        }
      },
      {
        "start": {
          "x": 78,
          "y": 16
        },
        "end": {
          "x": 78,
          "y": 100
        }
      }
    ]
  },
  "O": {
    "letter": "O",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Mulai dari atas, buat lingkaran bulat besar sampai bertemu kembali!",
    "paths": [
      "M50,16 C78,16 84,40 84,58 C84,82 76,100 50,100 C24,100 16,82 16,58 C16,40 22,16 50,16"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 50,
        "y": 16,
        "label": "Mulai 1"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 50,
          "y": 16
        },
        "end": {
          "x": 50,
          "y": 100
        }
      }
    ]
  },
  "P": {
    "letter": "P",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tiang tegak lurus ke bawah, 2. Buat kepala bundar di kanan atas!",
    "paths": [
      "M24,16 L24,100",
      "M24,16 C76,16 78,26 78,44 C78,62 66,62 24,62"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 20,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 32,
        "y": 16,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 24,
          "y": 16
        },
        "end": {
          "x": 24,
          "y": 100
        }
      },
      {
        "start": {
          "x": 24,
          "y": 16
        },
        "end": {
          "x": 24,
          "y": 62
        }
      }
    ]
  },
  "Q": {
    "letter": "Q",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat lingkaran bulat besar, 2. Beri ekor kecil miring di kanan bawah!",
    "paths": [
      "M50,16 C78,16 84,40 84,58 C84,82 76,100 50,100 C24,100 16,82 16,58 C16,40 22,16 50,16",
      "M58,76 L86,104"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 50,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 58,
        "y": 76,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 50,
          "y": 16
        },
        "end": {
          "x": 50,
          "y": 100
        }
      },
      {
        "start": {
          "x": 58,
          "y": 76
        },
        "end": {
          "x": 86,
          "y": 104
        }
      }
    ]
  },
  "R": {
    "letter": "R",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tiang tegak ke bawah, 2. Buat kepala bundar atas, 3. Tarik kaki miring ke kanan bawah!",
    "paths": [
      "M24,16 L24,100",
      "M24,16 C74,16 76,24 76,42 C76,58 64,58 24,58",
      "M46,58 L80,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 20,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 34,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 46,
        "y": 58,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 24,
          "y": 16
        },
        "end": {
          "x": 24,
          "y": 100
        }
      },
      {
        "start": {
          "x": 24,
          "y": 16
        },
        "end": {
          "x": 24,
          "y": 58
        }
      },
      {
        "start": {
          "x": 46,
          "y": 58
        },
        "end": {
          "x": 80,
          "y": 100
        }
      }
    ]
  },
  "S": {
    "letter": "S",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Mulai dari kanan atas, berliuk melengkung ke kiri, ke tengah, lalu ke kanan bawah!",
    "paths": [
      "M78,30 C70,16 42,16 28,28 C14,40 28,52 50,58 C74,66 84,76 80,90 C74,102 44,102 22,94"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 78,
        "y": 30,
        "label": "Mulai 1"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 78,
          "y": 30
        },
        "end": {
          "x": 22,
          "y": 94
        }
      }
    ]
  },
  "T": {
    "letter": "T",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Garis atap datar di atas, 2. Tiang tegak lurus di tengah ke bawah!",
    "paths": [
      "M15,16 L85,16",
      "M50,16 L50,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 15,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 50,
        "y": 16,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 15,
          "y": 16
        },
        "end": {
          "x": 85,
          "y": 16
        }
      },
      {
        "start": {
          "x": 50,
          "y": 16
        },
        "end": {
          "x": 50,
          "y": 100
        }
      }
    ]
  },
  "U": {
    "letter": "U",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Turun ke bawah, buat lengkungan cawan, lalu naik kembali ke atas!",
    "paths": [
      "M22,16 L22,72 C22,96 36,100 50,100 C64,100 78,96 78,72 L78,16"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 22,
        "y": 16,
        "label": "Mulai 1"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 22,
          "y": 16
        },
        "end": {
          "x": 78,
          "y": 16
        }
      }
    ]
  },
  "V": {
    "letter": "V",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik garis miring ke tengah bawah, 2. Naik miring ke kanan atas!",
    "paths": [
      "M18,16 L50,100",
      "M50,100 L82,16"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 18,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 50,
        "y": 100,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 18,
          "y": 16
        },
        "end": {
          "x": 50,
          "y": 100
        }
      },
      {
        "start": {
          "x": 50,
          "y": 100
        },
        "end": {
          "x": 82,
          "y": 16
        }
      }
    ]
  },
  "W": {
    "letter": "W",
    "numStrokes": 4,
    "viewBox": "0 0 100 120",
    "instruction": "1. Miring ke kiri bawah, 2. Naik ke tengah, 3. Turun miring lagi, 4. Naik ke kanan atas!",
    "paths": [
      "M14,16 L32,100",
      "M32,100 L50,48",
      "M50,48 L68,100",
      "M68,100 L86,16"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 14,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 32,
        "y": 100,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 50,
        "y": 48,
        "label": "Mulai 3"
      },
      {
        "number": 4,
        "x": 68,
        "y": 100,
        "label": "Mulai 4"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 14,
          "y": 16
        },
        "end": {
          "x": 32,
          "y": 100
        }
      },
      {
        "start": {
          "x": 32,
          "y": 100
        },
        "end": {
          "x": 50,
          "y": 48
        }
      },
      {
        "start": {
          "x": 50,
          "y": 48
        },
        "end": {
          "x": 68,
          "y": 100
        }
      },
      {
        "start": {
          "x": 68,
          "y": 100
        },
        "end": {
          "x": 86,
          "y": 16
        }
      }
    ]
  },
  "X": {
    "letter": "X",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik garis silang dari kiri atas ke kanan bawah, 2. Silang dari kanan atas ke kiri bawah!",
    "paths": [
      "M20,16 L80,100",
      "M80,16 L20,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 20,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 80,
        "y": 16,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 20,
          "y": 16
        },
        "end": {
          "x": 80,
          "y": 100
        }
      },
      {
        "start": {
          "x": 80,
          "y": 16
        },
        "end": {
          "x": 20,
          "y": 100
        }
      }
    ]
  },
  "Y": {
    "letter": "Y",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Miring dari kiri ke tengah, 2. Miring dari kanan ke tengah, 3. Tiang tegak ke bawah!",
    "paths": [
      "M18,16 L50,60",
      "M82,16 L50,60",
      "M50,60 L50,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 18,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 82,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 50,
        "y": 60,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 18,
          "y": 16
        },
        "end": {
          "x": 50,
          "y": 60
        }
      },
      {
        "start": {
          "x": 82,
          "y": 16
        },
        "end": {
          "x": 50,
          "y": 60
        }
      },
      {
        "start": {
          "x": 50,
          "y": 60
        },
        "end": {
          "x": 50,
          "y": 100
        }
      }
    ]
  },
  "Z": {
    "letter": "Z",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Garis datar atas ke kanan, 2. Meluncur miring ke kiri bawah, 3. Garis datar alas ke kanan!",
    "paths": [
      "M20,18 L80,18",
      "M80,18 L20,100",
      "M20,100 L80,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 20,
        "y": 18,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 80,
        "y": 18,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 20,
        "y": 100,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 20,
          "y": 18
        },
        "end": {
          "x": 80,
          "y": 18
        }
      },
      {
        "start": {
          "x": 80,
          "y": 18
        },
        "end": {
          "x": 20,
          "y": 100
        }
      },
      {
        "start": {
          "x": 20,
          "y": 100
        },
        "end": {
          "x": 80,
          "y": 100
        }
      }
    ]
  }
,
  "a": {
      "letter": "a",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Putar lengkungan bulat ke kiri, 2. Tarik garis tegak di sebelah kanan!",
      "paths": [
          "M66,68 C62,60 54,58 48,58 C36,58 30,68 30,79 C30,90 36,100 48,100 C58,100 64,94 66,88",
          "M66,58 L66,100"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 66,
              "y": 68,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 66,
              "y": 58,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 66,
                  "y": 68
              },
              "end": {
                  "x": 66,
                  "y": 88
              }
          },
          {
              "start": {
                  "x": 66,
                  "y": 58
              },
              "end": {
                  "x": 66,
                  "y": 100
              }
          }
      ]
  },
  "b": {
      "letter": "b",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik tiang tegak dari atas ke bawah, 2. Buat perut bulat di sebelah kanan bawah!",
      "paths": [
          "M32,16 L32,100",
          "M32,65 C40,58 56,58 64,68 C72,78 72,85 64,95 C56,100 40,100 32,95"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 32,
              "y": 16,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 32,
              "y": 65,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 32,
                  "y": 16
              },
              "end": {
                  "x": 32,
                  "y": 100
              }
          },
          {
              "start": {
                  "x": 32,
                  "y": 65
              },
              "end": {
                  "x": 32,
                  "y": 95
              }
          }
      ]
  },
  "c": {
      "letter": "c",
      "caseType": "lower",
      "numStrokes": 1,
      "viewBox": "0 0 100 120",
      "instruction": "1. Buat lengkungan bulat terbuka ke kanan!",
      "paths": [
          "M68,68 C62,60 54,58 48,58 C36,58 30,68 30,79 C30,90 36,100 48,100 C56,100 62,98 68,92"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 68,
              "y": 68,
              "label": "Mulai 1"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 68,
                  "y": 68
              },
              "end": {
                  "x": 68,
                  "y": 92
              }
          }
      ]
  },
  "d": {
      "letter": "d",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Buat perut bulat di kiri, 2. Tarik tiang tegak tinggi di kanan!",
      "paths": [
          "M68,68 C62,60 54,58 48,58 C36,58 30,68 30,79 C30,90 36,100 48,100 C56,100 62,96 68,88",
          "M68,16 L68,100"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 68,
              "y": 68,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 68,
              "y": 16,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 68,
                  "y": 68
              },
              "end": {
                  "x": 68,
                  "y": 88
              }
          },
          {
              "start": {
                  "x": 68,
                  "y": 16
              },
              "end": {
                  "x": 68,
                  "y": 100
              }
          }
      ]
  },
  "e": {
      "letter": "e",
      "caseType": "lower",
      "numStrokes": 1,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik garis tidur ke kanan, lalu putar lengkungan bulat ke kiri dan bawah!",
      "paths": [
          "M34,80 L68,80 C68,66 58,58 48,58 C36,58 30,68 30,79 C30,90 36,100 48,100 C58,100 64,96 68,92"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 34,
              "y": 80,
              "label": "Mulai 1"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 34,
                  "y": 80
              },
              "end": {
                  "x": 68,
                  "y": 92
              }
          }
      ]
  },
  "f": {
      "letter": "f",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Buat tongkat berpayung melengkung ke bawah, 2. Beri garis sabuk di tengahnya!",
      "paths": [
          "M64,22 C60,17 54,16 48,16 C44,16 42,20 42,28 L42,100",
          "M30,58 L56,58"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 64,
              "y": 22,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 30,
              "y": 58,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 64,
                  "y": 22
              },
              "end": {
                  "x": 42,
                  "y": 100
              }
          },
          {
              "start": {
                  "x": 30,
                  "y": 58
              },
              "end": {
                  "x": 56,
                  "y": 58
              }
          }
      ]
  },
  "g": {
      "letter": "g",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Buat kepala bulat di atas, 2. Tarik ekor tegak ke bawah lalu melengkung ke kiri!",
      "paths": [
          "M68,68 C62,60 54,58 48,58 C36,58 30,68 30,79 C30,90 36,100 48,100 C56,100 62,96 68,88",
          "M68,58 L68,104 C68,112 56,114 40,114"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 68,
              "y": 68,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 68,
              "y": 58,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 68,
                  "y": 68
              },
              "end": {
                  "x": 68,
                  "y": 88
              }
          },
          {
              "start": {
                  "x": 68,
                  "y": 58
              },
              "end": {
                  "x": 40,
                  "y": 114
              }
          }
      ]
  },
  "h": {
      "letter": "h",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik tiang tinggi dari atas ke bawah, 2. Buat jembatan lengkung ke kanan!",
      "paths": [
          "M32,16 L32,100",
          "M32,72 C38,62 50,58 60,58 C68,58 68,68 68,80 L68,100"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 32,
              "y": 16,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 32,
              "y": 72,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 32,
                  "y": 16
              },
              "end": {
                  "x": 32,
                  "y": 100
              }
          },
          {
              "start": {
                  "x": 32,
                  "y": 72
              },
              "end": {
                  "x": 68,
                  "y": 100
              }
          }
      ]
  },
  "i": {
      "letter": "i",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik garis pendek tegak ke bawah, 2. Beri titik di atasnya!",
      "paths": [
          "M50,62 L50,100",
          "M50,42 L50,46"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 50,
              "y": 62,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 50,
              "y": 44,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 50,
                  "y": 62
              },
              "end": {
                  "x": 50,
                  "y": 100
              }
          },
          {
              "start": {
                  "x": 50,
                  "y": 42
              },
              "end": {
                  "x": 50,
                  "y": 46
              }
          }
      ]
  },
  "j": {
      "letter": "j",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik tiang ke bawah lalu buat kail ke kiri, 2. Beri titik di atasnya!",
      "paths": [
          "M56,62 L56,106 C56,114 46,114 38,114",
          "M56,42 L56,46"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 56,
              "y": 62,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 56,
              "y": 44,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 56,
                  "y": 62
              },
              "end": {
                  "x": 38,
                  "y": 114
              }
          },
          {
              "start": {
                  "x": 56,
                  "y": 42
              },
              "end": {
                  "x": 56,
                  "y": 46
              }
          }
      ]
  },
  "k": {
      "letter": "k",
      "caseType": "lower",
      "numStrokes": 3,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik tiang tegak tinggi, 2. Tarik garis miring ke tengah tiang, 3. Tarik kaki miring ke kanan bawah!",
      "paths": [
          "M32,16 L32,100",
          "M68,62 L34,80",
          "M34,80 L68,100"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 32,
              "y": 16,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 68,
              "y": 62,
              "label": "Mulai 2"
          },
          {
              "number": 3,
              "x": 34,
              "y": 80,
              "label": "Mulai 3"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 32,
                  "y": 16
              },
              "end": {
                  "x": 32,
                  "y": 100
              }
          },
          {
              "start": {
                  "x": 68,
                  "y": 62
              },
              "end": {
                  "x": 34,
                  "y": 80
              }
          },
          {
              "start": {
                  "x": 34,
                  "y": 80
              },
              "end": {
                  "x": 68,
                  "y": 100
              }
          }
      ]
  },
  "l": {
      "letter": "l",
      "caseType": "lower",
      "numStrokes": 1,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik satu tiang lurus tegak dari atas ke bawah!",
      "paths": [
          "M50,16 L50,100"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 50,
              "y": 16,
              "label": "Mulai 1"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 50,
                  "y": 16
              },
              "end": {
                  "x": 50,
                  "y": 100
              }
          }
      ]
  },
  "m": {
      "letter": "m",
      "caseType": "lower",
      "numStrokes": 3,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik tiang pendek, 2. Buat bukit lengkung pertama, 3. Buat bukit lengkung kedua!",
      "paths": [
          "M24,60 L24,100",
          "M24,72 C28,62 38,58 44,58 C48,58 48,68 48,80 L48,100",
          "M48,72 C52,62 64,58 70,58 C74,58 74,68 74,80 L74,100"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 24,
              "y": 60,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 24,
              "y": 72,
              "label": "Mulai 2"
          },
          {
              "number": 3,
              "x": 48,
              "y": 72,
              "label": "Mulai 3"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 24,
                  "y": 60
              },
              "end": {
                  "x": 24,
                  "y": 100
              }
          },
          {
              "start": {
                  "x": 24,
                  "y": 72
              },
              "end": {
                  "x": 48,
                  "y": 100
              }
          },
          {
              "start": {
                  "x": 48,
                  "y": 72
              },
              "end": {
                  "x": 74,
                  "y": 100
              }
          }
      ]
  },
  "n": {
      "letter": "n",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik tiang pendek ke bawah, 2. Buat bukit lengkung ke kanan!",
      "paths": [
          "M32,60 L32,100",
          "M32,72 C38,62 52,58 62,58 C68,58 68,68 68,80 L68,100"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 32,
              "y": 60,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 32,
              "y": 72,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 32,
                  "y": 60
              },
              "end": {
                  "x": 32,
                  "y": 100
              }
          },
          {
              "start": {
                  "x": 32,
                  "y": 72
              },
              "end": {
                  "x": 68,
                  "y": 100
              }
          }
      ]
  },
  "o": {
      "letter": "o",
      "caseType": "lower",
      "numStrokes": 1,
      "viewBox": "0 0 100 120",
      "instruction": "1. Putar lingkaran bulat penuh seperti donat!",
      "paths": [
          "M50,58 C38,58 30,68 30,79 C30,90 38,100 50,100 C62,100 70,90 70,79 C70,68 62,58 50,58"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 50,
              "y": 58,
              "label": "Mulai 1"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 50,
                  "y": 58
              },
              "end": {
                  "x": 50,
                  "y": 58
              }
          }
      ]
  },
  "p": {
      "letter": "p",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik tiang lurus ke bawah sampai garis bawah, 2. Buat perut bulat di kanan!",
      "paths": [
          "M32,58 L32,114",
          "M32,65 C40,58 56,58 64,68 C72,78 72,85 64,95 C56,100 40,100 32,95"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 32,
              "y": 58,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 32,
              "y": 65,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 32,
                  "y": 58
              },
              "end": {
                  "x": 32,
                  "y": 114
              }
          },
          {
              "start": {
                  "x": 32,
                  "y": 65
              },
              "end": {
                  "x": 32,
                  "y": 95
              }
          }
      ]
  },
  "q": {
      "letter": "q",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Buat kepala bulat di kiri, 2. Tarik tiang tegak ke bawah sampai garis bawah!",
      "paths": [
          "M68,68 C62,60 54,58 48,58 C36,58 30,68 30,79 C30,90 36,100 48,100 C56,100 62,96 68,88",
          "M68,58 L68,114"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 68,
              "y": 68,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 68,
              "y": 58,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 68,
                  "y": 68
              },
              "end": {
                  "x": 68,
                  "y": 88
              }
          },
          {
              "start": {
                  "x": 68,
                  "y": 58
              },
              "end": {
                  "x": 68,
                  "y": 114
              }
          }
      ]
  },
  "r": {
      "letter": "r",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik tiang pendek ke bawah, 2. Buat dahan melengkung kecil di kanan!",
      "paths": [
          "M34,60 L34,100",
          "M34,72 C38,62 48,58 56,58 C62,58 64,60 66,64"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 34,
              "y": 60,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 34,
              "y": 72,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 34,
                  "y": 60
              },
              "end": {
                  "x": 34,
                  "y": 100
              }
          },
          {
              "start": {
                  "x": 34,
                  "y": 72
              },
              "end": {
                  "x": 66,
                  "y": 64
              }
          }
      ]
  },
  "s": {
      "letter": "s",
      "caseType": "lower",
      "numStrokes": 1,
      "viewBox": "0 0 100 120",
      "instruction": "1. Liukkan garis berkelok seperti ombak kecil!",
      "paths": [
          "M64,68 C60,60 54,58 48,58 C38,58 34,64 34,72 C34,80 40,84 48,86 C58,88 64,92 64,96 C64,100 56,100 48,100 C40,100 36,98 34,94"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 64,
              "y": 68,
              "label": "Mulai 1"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 64,
                  "y": 68
              },
              "end": {
                  "x": 34,
                  "y": 94
              }
          }
      ]
  },
  "t": {
      "letter": "t",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik tiang tegak dengan kaki melengkung, 2. Beri garis silang di tengahnya!",
      "paths": [
          "M48,24 L48,94 C48,99 53,100 58,100",
          "M34,58 L62,58"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 48,
              "y": 24,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 34,
              "y": 58,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 48,
                  "y": 24
              },
              "end": {
                  "x": 58,
                  "y": 100
              }
          },
          {
              "start": {
                  "x": 34,
                  "y": 58
              },
              "end": {
                  "x": 62,
                  "y": 58
              }
          }
      ]
  },
  "u": {
      "letter": "u",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik garis ke bawah lalu lengkungkan ke atas seperti cangkir, 2. Tarik tiang tegak di kanan!",
      "paths": [
          "M34,60 L34,90 C34,98 42,100 50,100 C58,100 66,98 66,90 L66,60",
          "M66,60 L66,100"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 34,
              "y": 60,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 66,
              "y": 60,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 34,
                  "y": 60
              },
              "end": {
                  "x": 66,
                  "y": 60
              }
          },
          {
              "start": {
                  "x": 66,
                  "y": 60
              },
              "end": {
                  "x": 66,
                  "y": 100
              }
          }
      ]
  },
  "v": {
      "letter": "v",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik garis miring ke bawah, 2. Tarik garis miring kembali ke atas!",
      "paths": [
          "M32,60 L50,100",
          "M50,100 L68,60"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 32,
              "y": 60,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 50,
              "y": 100,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 32,
                  "y": 60
              },
              "end": {
                  "x": 50,
                  "y": 100
              }
          },
          {
              "start": {
                  "x": 50,
                  "y": 100
              },
              "end": {
                  "x": 68,
                  "y": 60
              }
          }
      ]
  },
  "w": {
      "letter": "w",
      "caseType": "lower",
      "numStrokes": 4,
      "viewBox": "0 0 100 120",
      "instruction": "1. Miring ke bawah, 2. Miring ke atas, 3. Miring ke bawah lagi, 4. Miring ke atas!",
      "paths": [
          "M20,60 L34,100",
          "M34,100 L48,70",
          "M48,70 L62,100",
          "M62,100 L78,60"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 20,
              "y": 60,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 34,
              "y": 100,
              "label": "Mulai 2"
          },
          {
              "number": 3,
              "x": 48,
              "y": 70,
              "label": "Mulai 3"
          },
          {
              "number": 4,
              "x": 62,
              "y": 100,
              "label": "Mulai 4"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 20,
                  "y": 60
              },
              "end": {
                  "x": 34,
                  "y": 100
              }
          },
          {
              "start": {
                  "x": 34,
                  "y": 100
              },
              "end": {
                  "x": 48,
                  "y": 70
              }
          },
          {
              "start": {
                  "x": 48,
                  "y": 70
              },
              "end": {
                  "x": 62,
                  "y": 100
              }
          },
          {
              "start": {
                  "x": 62,
                  "y": 100
              },
              "end": {
                  "x": 78,
                  "y": 60
              }
          }
      ]
  },
  "x": {
      "letter": "x",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik garis miring ke kanan bawah, 2. Silangkan garis miring ke kiri bawah!",
      "paths": [
          "M34,60 L66,100",
          "M66,60 L34,100"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 34,
              "y": 60,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 66,
              "y": 60,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 34,
                  "y": 60
              },
              "end": {
                  "x": 66,
                  "y": 100
              }
          },
          {
              "start": {
                  "x": 66,
                  "y": 60
              },
              "end": {
                  "x": 34,
                  "y": 100
              }
          }
      ]
  },
  "y": {
      "letter": "y",
      "caseType": "lower",
      "numStrokes": 2,
      "viewBox": "0 0 100 120",
      "instruction": "1. Tarik garis miring pendek ke tengah, 2. Tarik garis miring panjang menembus ke kiri bawah!",
      "paths": [
          "M34,60 L50,84",
          "M66,60 L34,114"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 34,
              "y": 60,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 66,
              "y": 60,
              "label": "Mulai 2"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 34,
                  "y": 60
              },
              "end": {
                  "x": 50,
                  "y": 84
              }
          },
          {
              "start": {
                  "x": 66,
                  "y": 60
              },
              "end": {
                  "x": 34,
                  "y": 114
              }
          }
      ]
  },
  "z": {
      "letter": "z",
      "caseType": "lower",
      "numStrokes": 3,
      "viewBox": "0 0 100 120",
      "instruction": "1. Garis tidur ke kanan, 2. Garis miring ke kiri bawah, 3. Garis tidur lagi ke kanan!",
      "paths": [
          "M34,60 L66,60",
          "M66,60 L34,100",
          "M34,100 L66,100"
      ],
      "startNodes": [
          {
              "number": 1,
              "x": 34,
              "y": 60,
              "label": "Mulai 1"
          },
          {
              "number": 2,
              "x": 66,
              "y": 60,
              "label": "Mulai 2"
          },
          {
              "number": 3,
              "x": 34,
              "y": 100,
              "label": "Mulai 3"
          }
      ],
      "checkpoints": [
          {
              "start": {
                  "x": 34,
                  "y": 60
              },
              "end": {
                  "x": 66,
                  "y": 60
              }
          },
          {
              "start": {
                  "x": 66,
                  "y": 60
              },
              "end": {
                  "x": 34,
                  "y": 100
              }
          },
          {
              "start": {
                  "x": 34,
                  "y": 100
              },
              "end": {
                  "x": 66,
                  "y": 100
              }
          }
      ]
  }
};

export const LOWERCASE_PATHS = {
  "a": {
    "letter": "a",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Putar lengkungan bulat ke kiri, 2. Tarik garis tegak di sebelah kanan!",
    "paths": [
      "M66,68 C62,60 54,58 48,58 C36,58 30,68 30,79 C30,90 36,100 48,100 C58,100 64,94 66,88",
      "M66,58 L66,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 66,
        "y": 68,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 66,
        "y": 58,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 66,
          "y": 68
        },
        "end": {
          "x": 66,
          "y": 88
        }
      },
      {
        "start": {
          "x": 66,
          "y": 58
        },
        "end": {
          "x": 66,
          "y": 100
        }
      }
    ]
  },
  "b": {
    "letter": "b",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tegak dari atas ke bawah, 2. Buat perut bulat di sebelah kanan bawah!",
    "paths": [
      "M32,16 L32,100",
      "M32,65 C40,58 56,58 64,68 C72,78 72,85 64,95 C56,100 40,100 32,95"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 32,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 32,
        "y": 65,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 32,
          "y": 16
        },
        "end": {
          "x": 32,
          "y": 100
        }
      },
      {
        "start": {
          "x": 32,
          "y": 65
        },
        "end": {
          "x": 32,
          "y": 95
        }
      }
    ]
  },
  "c": {
    "letter": "c",
    "caseType": "lower",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat lengkungan bulat terbuka ke kanan!",
    "paths": [
      "M68,68 C62,60 54,58 48,58 C36,58 30,68 30,79 C30,90 36,100 48,100 C56,100 62,98 68,92"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 68,
        "y": 68,
        "label": "Mulai 1"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 68,
          "y": 68
        },
        "end": {
          "x": 68,
          "y": 92
        }
      }
    ]
  },
  "d": {
    "letter": "d",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat perut bulat di kiri, 2. Tarik tiang tegak tinggi di kanan!",
    "paths": [
      "M68,68 C62,60 54,58 48,58 C36,58 30,68 30,79 C30,90 36,100 48,100 C56,100 62,96 68,88",
      "M68,16 L68,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 68,
        "y": 68,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 68,
        "y": 16,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 68,
          "y": 68
        },
        "end": {
          "x": 68,
          "y": 88
        }
      },
      {
        "start": {
          "x": 68,
          "y": 16
        },
        "end": {
          "x": 68,
          "y": 100
        }
      }
    ]
  },
  "e": {
    "letter": "e",
    "caseType": "lower",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik garis tidur ke kanan, lalu putar lengkungan bulat ke kiri dan bawah!",
    "paths": [
      "M34,80 L68,80 C68,66 58,58 48,58 C36,58 30,68 30,79 C30,90 36,100 48,100 C58,100 64,96 68,92"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 34,
        "y": 80,
        "label": "Mulai 1"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 34,
          "y": 80
        },
        "end": {
          "x": 68,
          "y": 92
        }
      }
    ]
  },
  "f": {
    "letter": "f",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat tongkat berpayung melengkung ke bawah, 2. Beri garis sabuk di tengahnya!",
    "paths": [
      "M64,22 C60,17 54,16 48,16 C44,16 42,20 42,28 L42,100",
      "M30,58 L56,58"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 64,
        "y": 22,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 30,
        "y": 58,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 64,
          "y": 22
        },
        "end": {
          "x": 42,
          "y": 100
        }
      },
      {
        "start": {
          "x": 30,
          "y": 58
        },
        "end": {
          "x": 56,
          "y": 58
        }
      }
    ]
  },
  "g": {
    "letter": "g",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat kepala bulat di atas, 2. Tarik ekor tegak ke bawah lalu melengkung ke kiri!",
    "paths": [
      "M68,68 C62,60 54,58 48,58 C36,58 30,68 30,79 C30,90 36,100 48,100 C56,100 62,96 68,88",
      "M68,58 L68,104 C68,112 56,114 40,114"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 68,
        "y": 68,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 68,
        "y": 58,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 68,
          "y": 68
        },
        "end": {
          "x": 68,
          "y": 88
        }
      },
      {
        "start": {
          "x": 68,
          "y": 58
        },
        "end": {
          "x": 40,
          "y": 114
        }
      }
    ]
  },
  "h": {
    "letter": "h",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tinggi dari atas ke bawah, 2. Buat jembatan lengkung ke kanan!",
    "paths": [
      "M32,16 L32,100",
      "M32,72 C38,62 50,58 60,58 C68,58 68,68 68,80 L68,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 32,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 32,
        "y": 72,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 32,
          "y": 16
        },
        "end": {
          "x": 32,
          "y": 100
        }
      },
      {
        "start": {
          "x": 32,
          "y": 72
        },
        "end": {
          "x": 68,
          "y": 100
        }
      }
    ]
  },
  "i": {
    "letter": "i",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik garis pendek tegak ke bawah, 2. Beri titik di atasnya!",
    "paths": [
      "M50,62 L50,100",
      "M50,42 L50,46"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 50,
        "y": 62,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 50,
        "y": 44,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 50,
          "y": 62
        },
        "end": {
          "x": 50,
          "y": 100
        }
      },
      {
        "start": {
          "x": 50,
          "y": 42
        },
        "end": {
          "x": 50,
          "y": 46
        }
      }
    ]
  },
  "j": {
    "letter": "j",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang ke bawah lalu buat kail ke kiri, 2. Beri titik di atasnya!",
    "paths": [
      "M56,62 L56,106 C56,114 46,114 38,114",
      "M56,42 L56,46"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 56,
        "y": 62,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 56,
        "y": 44,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 56,
          "y": 62
        },
        "end": {
          "x": 38,
          "y": 114
        }
      },
      {
        "start": {
          "x": 56,
          "y": 42
        },
        "end": {
          "x": 56,
          "y": 46
        }
      }
    ]
  },
  "k": {
    "letter": "k",
    "caseType": "lower",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tegak tinggi, 2. Tarik garis miring ke tengah tiang, 3. Tarik kaki miring ke kanan bawah!",
    "paths": [
      "M32,16 L32,100",
      "M68,62 L34,80",
      "M34,80 L68,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 32,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 68,
        "y": 62,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 34,
        "y": 80,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 32,
          "y": 16
        },
        "end": {
          "x": 32,
          "y": 100
        }
      },
      {
        "start": {
          "x": 68,
          "y": 62
        },
        "end": {
          "x": 34,
          "y": 80
        }
      },
      {
        "start": {
          "x": 34,
          "y": 80
        },
        "end": {
          "x": 68,
          "y": 100
        }
      }
    ]
  },
  "l": {
    "letter": "l",
    "caseType": "lower",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik satu tiang lurus tegak dari atas ke bawah!",
    "paths": [
      "M50,16 L50,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 50,
        "y": 16,
        "label": "Mulai 1"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 50,
          "y": 16
        },
        "end": {
          "x": 50,
          "y": 100
        }
      }
    ]
  },
  "m": {
    "letter": "m",
    "caseType": "lower",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang pendek, 2. Buat bukit lengkung pertama, 3. Buat bukit lengkung kedua!",
    "paths": [
      "M24,60 L24,100",
      "M24,72 C28,62 38,58 44,58 C48,58 48,68 48,80 L48,100",
      "M48,72 C52,62 64,58 70,58 C74,58 74,68 74,80 L74,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 24,
        "y": 60,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 24,
        "y": 72,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 48,
        "y": 72,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 24,
          "y": 60
        },
        "end": {
          "x": 24,
          "y": 100
        }
      },
      {
        "start": {
          "x": 24,
          "y": 72
        },
        "end": {
          "x": 48,
          "y": 100
        }
      },
      {
        "start": {
          "x": 48,
          "y": 72
        },
        "end": {
          "x": 74,
          "y": 100
        }
      }
    ]
  },
  "n": {
    "letter": "n",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang pendek ke bawah, 2. Buat bukit lengkung ke kanan!",
    "paths": [
      "M32,60 L32,100",
      "M32,72 C38,62 52,58 62,58 C68,58 68,68 68,80 L68,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 32,
        "y": 60,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 32,
        "y": 72,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 32,
          "y": 60
        },
        "end": {
          "x": 32,
          "y": 100
        }
      },
      {
        "start": {
          "x": 32,
          "y": 72
        },
        "end": {
          "x": 68,
          "y": 100
        }
      }
    ]
  },
  "o": {
    "letter": "o",
    "caseType": "lower",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Putar lingkaran bulat penuh seperti donat!",
    "paths": [
      "M50,58 C38,58 30,68 30,79 C30,90 38,100 50,100 C62,100 70,90 70,79 C70,68 62,58 50,58"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 50,
        "y": 58,
        "label": "Mulai 1"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 50,
          "y": 58
        },
        "end": {
          "x": 50,
          "y": 58
        }
      }
    ]
  },
  "p": {
    "letter": "p",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang lurus ke bawah sampai garis bawah, 2. Buat perut bulat di kanan!",
    "paths": [
      "M32,58 L32,114",
      "M32,65 C40,58 56,58 64,68 C72,78 72,85 64,95 C56,100 40,100 32,95"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 32,
        "y": 58,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 32,
        "y": 65,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 32,
          "y": 58
        },
        "end": {
          "x": 32,
          "y": 114
        }
      },
      {
        "start": {
          "x": 32,
          "y": 65
        },
        "end": {
          "x": 32,
          "y": 95
        }
      }
    ]
  },
  "q": {
    "letter": "q",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat kepala bulat di kiri, 2. Tarik tiang tegak ke bawah sampai garis bawah!",
    "paths": [
      "M68,68 C62,60 54,58 48,58 C36,58 30,68 30,79 C30,90 36,100 48,100 C56,100 62,96 68,88",
      "M68,58 L68,114"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 68,
        "y": 68,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 68,
        "y": 58,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 68,
          "y": 68
        },
        "end": {
          "x": 68,
          "y": 88
        }
      },
      {
        "start": {
          "x": 68,
          "y": 58
        },
        "end": {
          "x": 68,
          "y": 114
        }
      }
    ]
  },
  "r": {
    "letter": "r",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang pendek ke bawah, 2. Buat dahan melengkung kecil di kanan!",
    "paths": [
      "M34,60 L34,100",
      "M34,72 C38,62 48,58 56,58 C62,58 64,60 66,64"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 34,
        "y": 60,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 34,
        "y": 72,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 34,
          "y": 60
        },
        "end": {
          "x": 34,
          "y": 100
        }
      },
      {
        "start": {
          "x": 34,
          "y": 72
        },
        "end": {
          "x": 66,
          "y": 64
        }
      }
    ]
  },
  "s": {
    "letter": "s",
    "caseType": "lower",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Liukkan garis berkelok seperti ombak kecil!",
    "paths": [
      "M64,68 C60,60 54,58 48,58 C38,58 34,64 34,72 C34,80 40,84 48,86 C58,88 64,92 64,96 C64,100 56,100 48,100 C40,100 36,98 34,94"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 64,
        "y": 68,
        "label": "Mulai 1"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 64,
          "y": 68
        },
        "end": {
          "x": 34,
          "y": 94
        }
      }
    ]
  },
  "t": {
    "letter": "t",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tegak dengan kaki melengkung, 2. Beri garis silang di tengahnya!",
    "paths": [
      "M48,24 L48,94 C48,99 53,100 58,100",
      "M34,58 L62,58"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 48,
        "y": 24,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 34,
        "y": 58,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 48,
          "y": 24
        },
        "end": {
          "x": 58,
          "y": 100
        }
      },
      {
        "start": {
          "x": 34,
          "y": 58
        },
        "end": {
          "x": 62,
          "y": 58
        }
      }
    ]
  },
  "u": {
    "letter": "u",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik garis ke bawah lalu lengkungkan ke atas seperti cangkir, 2. Tarik tiang tegak di kanan!",
    "paths": [
      "M34,60 L34,90 C34,98 42,100 50,100 C58,100 66,98 66,90 L66,60",
      "M66,60 L66,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 34,
        "y": 60,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 66,
        "y": 60,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 34,
          "y": 60
        },
        "end": {
          "x": 66,
          "y": 60
        }
      },
      {
        "start": {
          "x": 66,
          "y": 60
        },
        "end": {
          "x": 66,
          "y": 100
        }
      }
    ]
  },
  "v": {
    "letter": "v",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik garis miring ke bawah, 2. Tarik garis miring kembali ke atas!",
    "paths": [
      "M32,60 L50,100",
      "M50,100 L68,60"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 32,
        "y": 60,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 50,
        "y": 100,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 32,
          "y": 60
        },
        "end": {
          "x": 50,
          "y": 100
        }
      },
      {
        "start": {
          "x": 50,
          "y": 100
        },
        "end": {
          "x": 68,
          "y": 60
        }
      }
    ]
  },
  "w": {
    "letter": "w",
    "caseType": "lower",
    "numStrokes": 4,
    "viewBox": "0 0 100 120",
    "instruction": "1. Miring ke bawah, 2. Miring ke atas, 3. Miring ke bawah lagi, 4. Miring ke atas!",
    "paths": [
      "M20,60 L34,100",
      "M34,100 L48,70",
      "M48,70 L62,100",
      "M62,100 L78,60"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 20,
        "y": 60,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 34,
        "y": 100,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 48,
        "y": 70,
        "label": "Mulai 3"
      },
      {
        "number": 4,
        "x": 62,
        "y": 100,
        "label": "Mulai 4"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 20,
          "y": 60
        },
        "end": {
          "x": 34,
          "y": 100
        }
      },
      {
        "start": {
          "x": 34,
          "y": 100
        },
        "end": {
          "x": 48,
          "y": 70
        }
      },
      {
        "start": {
          "x": 48,
          "y": 70
        },
        "end": {
          "x": 62,
          "y": 100
        }
      },
      {
        "start": {
          "x": 62,
          "y": 100
        },
        "end": {
          "x": 78,
          "y": 60
        }
      }
    ]
  },
  "x": {
    "letter": "x",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik garis miring ke kanan bawah, 2. Silangkan garis miring ke kiri bawah!",
    "paths": [
      "M34,60 L66,100",
      "M66,60 L34,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 34,
        "y": 60,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 66,
        "y": 60,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 34,
          "y": 60
        },
        "end": {
          "x": 66,
          "y": 100
        }
      },
      {
        "start": {
          "x": 66,
          "y": 60
        },
        "end": {
          "x": 34,
          "y": 100
        }
      }
    ]
  },
  "y": {
    "letter": "y",
    "caseType": "lower",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik garis miring pendek ke tengah, 2. Tarik garis miring panjang menembus ke kiri bawah!",
    "paths": [
      "M34,60 L50,84",
      "M66,60 L34,114"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 34,
        "y": 60,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 66,
        "y": 60,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 34,
          "y": 60
        },
        "end": {
          "x": 50,
          "y": 84
        }
      },
      {
        "start": {
          "x": 66,
          "y": 60
        },
        "end": {
          "x": 34,
          "y": 114
        }
      }
    ]
  },
  "z": {
    "letter": "z",
    "caseType": "lower",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Garis tidur ke kanan, 2. Garis miring ke kiri bawah, 3. Garis tidur lagi ke kanan!",
    "paths": [
      "M34,60 L66,60",
      "M66,60 L34,100",
      "M34,100 L66,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 34,
        "y": 60,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 66,
        "y": 60,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 34,
        "y": 100,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 34,
          "y": 60
        },
        "end": {
          "x": 66,
          "y": 60
        }
      },
      {
        "start": {
          "x": 66,
          "y": 60
        },
        "end": {
          "x": 34,
          "y": 100
        }
      },
      {
        "start": {
          "x": 34,
          "y": 100
        },
        "end": {
          "x": 66,
          "y": 100
        }
      }
    ]
  }
};

export function getLetterPath(char, mode = 'upper') {
  if (mode === 'lower') {
    const key = (char || 'a').toLowerCase();
    return LOWERCASE_PATHS[key] || ALPHABET_PATHS[key] || LOWERCASE_PATHS['a'];
  }
  const key = (char || 'A').toUpperCase();
  return ALPHABET_PATHS[key] || ALPHABET_PATHS['A'];
}
