// src/data/alphabetPaths.js
// SAKA TIKA: Official Alphabet Stroke Standard Dictionary (A-Z & a-z)
// Conforms strictly to client's "Standar Penulisan Alfabet A-Z" specification chart.
// 26 Uppercase Letters (A-Z) & 26 Lowercase Letters (a-z) with exact stroke counts and single-storey shapes.
// Lowercase entries include category: 'Pendek' | 'Tinggi' | 'Ekor' metadata.
// STRICT ZERO EMOJIS & ZERO STAR ICONS POLICY.

export const ALPHABET_PATHS = {
  "A": {
    "letter": "A",
    "category": "Besar",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik garis miring ke kiri bawah, 2. Tarik garis miring ke kanan bawah, 3. Sambung garis datar di tengah!",
    "strokeInstructions": ["Kiri atas ke kiri bawah.", "Kanan atas ke kanan bawah.", "Garis tengah kiri ke kanan."],
    "paths": [
      "M50,16 L18,100",
      "M50,16 L82,100",
      "M30,66 L70,66"
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
        "x": 50,
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
    "category": "Besar",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tegak ke bawah, 2. Buat lengkungan atas searah jarum jam, 3. Buat lengkungan bawah!",
    "strokeInstructions": ["Garis tegak atas ke bawah.", "Lengkungan atas.", "Lengkungan bawah."],
    "paths": [
      "M26,16 L26,100",
      "M26,16 C66,16 74,26 74,44 C74,58 60,58 26,58",
      "M26,58 C68,58 78,62 78,80 C78,100 62,100 26,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 26,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 26,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 26,
        "y": 58,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 26,
          "y": 100
        }
      },
      {
        "start": {
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 26,
          "y": 58
        }
      },
      {
        "start": {
          "x": 26,
          "y": 58
        },
        "end": {
          "x": 26,
          "y": 100
        }
      }
    ]
  },
  "C": {
    "letter": "C",
    "category": "Besar",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat lengkungan besar berlawanan jarum jam dari kanan atas ke kanan bawah!",
    "strokeInstructions": ["Lengkungan dari kanan atas menuju kiri dan berakhir di kanan bawah."],
    "paths": [
      "M76,32 C70,16 30,16 26,58 C22,96 68,102 76,86"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 76,
        "y": 32,
        "label": "Mulai 1"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 76,
          "y": 32
        },
        "end": {
          "x": 76,
          "y": 86
        }
      }
    ]
  },
  "D": {
    "letter": "D",
    "category": "Besar",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tegak ke bawah, 2. Buat lengkungan besar dari puncak ke dasar!",
    "strokeInstructions": ["Garis tegak.", "Lengkungan dari atas menuju bawah."],
    "paths": [
      "M26,16 L26,100",
      "M26,16 C78,16 80,44 80,58 C80,72 78,100 26,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 26,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 26,
        "y": 16,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 26,
          "y": 100
        }
      },
      {
        "start": {
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 26,
          "y": 100
        }
      }
    ]
  },
  "E": {
    "letter": "E",
    "category": "Besar",
    "numStrokes": 4,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tegak ke bawah, 2. Garis datar atas, 3. Garis datar tengah, 4. Garis datar bawah!",
    "strokeInstructions": ["Garis tegak.", "Garis atas.", "Garis tengah.", "Garis bawah."],
    "paths": [
      "M26,16 L26,100",
      "M26,16 L76,16",
      "M26,58 L68,58",
      "M26,100 L76,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 26,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 26,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 26,
        "y": 58,
        "label": "Mulai 3"
      },
      {
        "number": 4,
        "x": 26,
        "y": 100,
        "label": "Mulai 4"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 26,
          "y": 100
        }
      },
      {
        "start": {
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 76,
          "y": 16
        }
      },
      {
        "start": {
          "x": 26,
          "y": 58
        },
        "end": {
          "x": 68,
          "y": 58
        }
      },
      {
        "start": {
          "x": 26,
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
    "category": "Besar",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tegak ke bawah, 2. Garis datar atas, 3. Garis datar tengah!",
    "strokeInstructions": ["Garis tegak.", "Garis atas.", "Garis tengah."],
    "paths": [
      "M26,16 L26,100",
      "M26,16 L76,16",
      "M26,58 L68,58"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 26,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 26,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 26,
        "y": 58,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 26,
          "y": 100
        }
      },
      {
        "start": {
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 76,
          "y": 16
        }
      },
      {
        "start": {
          "x": 26,
          "y": 58
        },
        "end": {
          "x": 68,
          "y": 58
        }
      }
    ]
  },
  "G": {
    "letter": "G",
    "category": "Besar",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat lengkungan setengah lingkaran ke bawah, 2. Tarik garis mendatar ke arah dalam pada garis tengah!",
    "strokeInstructions": ["Lengkungan seperti C.", "Garis mendatar ke dalam."],
    "paths": [
      "M76,32 C70,16 30,16 26,58 C22,96 68,102 76,74",
      "M76,58 L52,58"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 76,
        "y": 32,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 76,
        "y": 58,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 76,
          "y": 32
        },
        "end": {
          "x": 76,
          "y": 74
        }
      },
      {
        "start": {
          "x": 76,
          "y": 58
        },
        "end": {
          "x": 52,
          "y": 58
        }
      }
    ]
  },
  "H": {
    "letter": "H",
    "category": "Besar",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang kiri ke bawah, 2. Tarik tiang kanan ke bawah, 3. Hubungkan garis datar di tengah!",
    "strokeInstructions": ["Garis kiri.", "Garis kanan.", "Garis tengah."],
    "paths": [
      "M26,16 L26,100",
      "M74,16 L74,100",
      "M26,58 L74,58"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 26,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 74,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 26,
        "y": 58,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 26,
          "y": 100
        }
      },
      {
        "start": {
          "x": 74,
          "y": 16
        },
        "end": {
          "x": 74,
          "y": 100
        }
      },
      {
        "start": {
          "x": 26,
          "y": 58
        },
        "end": {
          "x": 74,
          "y": 58
        }
      }
    ]
  },
  "I": {
    "letter": "I",
    "category": "Besar",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Garis datar atas, 2. Tarik tiang tengah ke bawah, 3. Garis datar bawah!",
    "strokeInstructions": ["Garis atas.", "Garis tegak.", "Garis bawah."],
    "paths": [
      "M28,16 L72,16",
      "M50,16 L50,100",
      "M28,100 L72,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 28,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 50,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 28,
        "y": 100,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 28,
          "y": 16
        },
        "end": {
          "x": 72,
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
      },
      {
        "start": {
          "x": 28,
          "y": 100
        },
        "end": {
          "x": 72,
          "y": 100
        }
      }
    ]
  },
  "J": {
    "letter": "J",
    "category": "Besar",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang lurus ke bawah lalu lengkungkan ke kiri, 2. Buat topi mendatar di atas!",
    "strokeInstructions": ["Garis tegak dan lengkungan bawah.", "Garis atas."],
    "paths": [
      "M66,16 L66,80 C66,100 36,102 30,86",
      "M42,16 L86,16"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 66,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 42,
        "y": 16,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 66,
          "y": 16
        },
        "end": {
          "x": 30,
          "y": 86
        }
      },
      {
        "start": {
          "x": 42,
          "y": 16
        },
        "end": {
          "x": 86,
          "y": 16
        }
      }
    ]
  },
  "K": {
    "letter": "K",
    "category": "Besar",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tegak ke bawah, 2. Garis miring atas ke tengah, 3. Garis miring bawah keluar!",
    "strokeInstructions": ["Garis tegak.", "Garis miring atas.", "Garis miring bawah."],
    "paths": [
      "M26,16 L26,100",
      "M76,16 L26,58",
      "M26,58 L76,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 26,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 76,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 26,
        "y": 58,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 26,
          "y": 100
        }
      },
      {
        "start": {
          "x": 76,
          "y": 16
        },
        "end": {
          "x": 26,
          "y": 58
        }
      },
      {
        "start": {
          "x": 26,
          "y": 58
        },
        "end": {
          "x": 76,
          "y": 100
        }
      }
    ]
  },
  "L": {
    "letter": "L",
    "category": "Besar",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tegak ke bawah, 2. Tarik garis mendatar ke kanan!",
    "strokeInstructions": ["Garis tegak.", "Garis bawah."],
    "paths": [
      "M26,16 L26,100",
      "M26,100 L76,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 26,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 26,
        "y": 100,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 26,
          "y": 100
        }
      },
      {
        "start": {
          "x": 26,
          "y": 100
        },
        "end": {
          "x": 76,
          "y": 100
        }
      }
    ]
  },
  "M": {
    "letter": "M",
    "category": "Besar",
    "numStrokes": 4,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tiang kiri ke bawah, 2. Miring ke tengah bawah, 3. Miring ke kanan atas, 4. Tiang kanan ke bawah!",
    "strokeInstructions": ["Garis kiri.", "Garis miring naik.", "Garis miring turun.", "Garis kanan."],
    "paths": [
      "M20,16 L20,100",
      "M20,16 L50,100",
      "M50,100 L80,16",
      "M80,16 L80,100"
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
        "x": 20,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 50,
        "y": 100,
        "label": "Mulai 3"
      },
      {
        "number": 4,
        "x": 80,
        "y": 16,
        "label": "Mulai 4"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 20,
          "y": 16
        },
        "end": {
          "x": 20,
          "y": 100
        }
      },
      {
        "start": {
          "x": 20,
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
          "x": 80,
          "y": 16
        }
      },
      {
        "start": {
          "x": 80,
          "y": 16
        },
        "end": {
          "x": 80,
          "y": 100
        }
      }
    ]
  },
  "N": {
    "letter": "N",
    "category": "Besar",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tiang kiri ke bawah, 2. Miring diagonal ke kanan bawah, 3. Tiang kanan ke bawah!",
    "strokeInstructions": ["Garis kiri.", "Garis miring.", "Garis kanan."],
    "paths": [
      "M24,16 L24,100",
      "M24,16 L76,100",
      "M76,16 L76,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 24,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 24,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 76,
        "y": 16,
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
          "y": 100
        }
      },
      {
        "start": {
          "x": 76,
          "y": 16
        },
        "end": {
          "x": 76,
          "y": 100
        }
      }
    ]
  },
  "O": {
    "letter": "O",
    "category": "Besar",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat lingkaran lonjong penuh berlawanan jarum jam dari atas kembali ke atas!",
    "strokeInstructions": ["Lengkungan tertutup membentuk oval."],
    "paths": [
      "M50,16 C22,16 22,100 50,100 C78,100 78,16 50,16"
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
          "y": 16
        }
      }
    ]
  },
  "P": {
    "letter": "P",
    "category": "Besar",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tegak ke bawah, 2. Buat lengkungan atas searah jarum jam!",
    "strokeInstructions": ["Garis tegak.", "Lengkungan atas."],
    "paths": [
      "M26,16 L26,100",
      "M26,16 C74,16 78,28 78,44 C78,60 62,60 26,60"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 26,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 26,
        "y": 16,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 26,
          "y": 100
        }
      },
      {
        "start": {
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 26,
          "y": 60
        }
      }
    ]
  },
  "Q": {
    "letter": "Q",
    "category": "Besar",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat lingkaran lonjong penuh, 2. Tarik ekor miring kecil di kanan bawah!",
    "strokeInstructions": ["Bentuk O.", "Garis ekor kanan bawah."],
    "paths": [
      "M50,16 C22,16 22,100 50,100 C78,100 78,16 50,16",
      "M56,76 L82,102"
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
        "x": 56,
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
          "y": 16
        }
      },
      {
        "start": {
          "x": 56,
          "y": 76
        },
        "end": {
          "x": 82,
          "y": 102
        }
      }
    ]
  },
  "R": {
    "letter": "R",
    "category": "Besar",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tegak ke bawah, 2. Buat lengkungan atas, 3. Tarik kaki miring ke kanan bawah!",
    "strokeInstructions": ["Garis tegak.", "Lengkungan atas.", "Garis miring bawah."],
    "paths": [
      "M26,16 L26,100",
      "M26,16 C74,16 78,28 78,44 C78,60 62,60 26,60",
      "M50,60 L78,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 26,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 26,
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
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 26,
          "y": 100
        }
      },
      {
        "start": {
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 26,
          "y": 60
        }
      },
      {
        "start": {
          "x": 50,
          "y": 60
        },
        "end": {
          "x": 78,
          "y": 100
        }
      }
    ]
  },
  "S": {
    "letter": "S",
    "category": "Besar",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat liukan huruf S meliuk dari kanan atas, ke tengah, lalu ke kiri bawah!",
    "strokeInstructions": ["Lengkungan atas dan bawah membentuk S."],
    "paths": [
      "M74,32 C68,16 32,16 30,36 C28,54 74,52 72,78 C70,100 32,100 24,84"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 74,
        "y": 32,
        "label": "Mulai 1"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 74,
          "y": 32
        },
        "end": {
          "x": 24,
          "y": 84
        }
      }
    ]
  },
  "T": {
    "letter": "T",
    "category": "Besar",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik garis mendatar di atas, 2. Tarik tiang tegak dari tengah ke bawah!",
    "strokeInstructions": ["Garis atas.", "Garis tegak tengah."],
    "paths": [
      "M18,16 L82,16",
      "M50,16 L50,100"
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
        "y": 16,
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
          "x": 82,
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
    "category": "Besar",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang kiri ke bawah, 2. Lengkungkan di dasar lalu naik tegak ke kanan atas!",
    "strokeInstructions": ["Garis kiri ke bawah.", "Lengkungan bawah menuju kanan atas."],
    "paths": [
      "M26,16 L26,76",
      "M26,76 C26,100 74,100 74,76 L74,16"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 26,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 26,
        "y": 76,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 26,
          "y": 16
        },
        "end": {
          "x": 26,
          "y": 76
        }
      },
      {
        "start": {
          "x": 26,
          "y": 76
        },
        "end": {
          "x": 74,
          "y": 16
        }
      }
    ]
  },
  "V": {
    "letter": "V",
    "category": "Besar",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik garis miring ke tengah bawah, 2. Tarik garis miring naik ke kanan atas!",
    "strokeInstructions": ["Kiri atas ke bawah tengah.", "Bawah tengah ke kanan atas."],
    "paths": [
      "M20,16 L50,100",
      "M50,100 L80,16"
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
        "x": 50,
        "y": 100,
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
          "x": 80,
          "y": 16
        }
      }
    ]
  },
  "W": {
    "letter": "W",
    "category": "Besar",
    "numStrokes": 4,
    "viewBox": "0 0 100 120",
    "instruction": "1. Miring ke bawah, 2. Miring naik, 3. Miring ke bawah, 4. Miring naik ke kanan atas!",
    "strokeInstructions": ["Turun.", "Naik.", "Turun.", "Naik."],
    "paths": [
      "M16,16 L34,100",
      "M34,100 L50,36",
      "M50,36 L66,100",
      "M66,100 L84,16"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 16,
        "y": 16,
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
        "x": 50,
        "y": 36,
        "label": "Mulai 3"
      },
      {
        "number": 4,
        "x": 66,
        "y": 100,
        "label": "Mulai 4"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 16,
          "y": 16
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
          "x": 50,
          "y": 36
        }
      },
      {
        "start": {
          "x": 50,
          "y": 36
        },
        "end": {
          "x": 66,
          "y": 100
        }
      },
      {
        "start": {
          "x": 66,
          "y": 100
        },
        "end": {
          "x": 84,
          "y": 16
        }
      }
    ]
  },
  "X": {
    "letter": "X",
    "category": "Besar",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik garis silang dari kiri atas ke kanan bawah, 2. Tarik garis silang dari kanan atas ke kiri bawah!",
    "strokeInstructions": ["Kiri atas ke kanan bawah.", "Kanan atas ke kiri bawah."],
    "paths": [
      "M22,16 L78,100",
      "M78,16 L22,100"
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
          "y": 100
        }
      },
      {
        "start": {
          "x": 78,
          "y": 16
        },
        "end": {
          "x": 22,
          "y": 100
        }
      }
    ]
  },
  "Y": {
    "letter": "Y",
    "category": "Besar",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Miring kiri atas ke tengah, 2. Miring kanan atas ke tengah, 3. Tiang tengah lurus ke bawah!",
    "strokeInstructions": ["Kiri atas ke tengah.", "Kanan atas ke tengah.", "Tengah ke bawah."],
    "paths": [
      "M22,16 L50,58",
      "M78,16 L50,58",
      "M50,58 L50,100"
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
        "x": 50,
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
          "x": 50,
          "y": 58
        }
      },
      {
        "start": {
          "x": 78,
          "y": 16
        },
        "end": {
          "x": 50,
          "y": 58
        }
      },
      {
        "start": {
          "x": 50,
          "y": 58
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
    "category": "Besar",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Garis datar atas, 2. Garis miring ke kiri bawah, 3. Garis datar bawah ke kanan!",
    "strokeInstructions": ["Garis atas.", "Garis miring turun.", "Garis bawah."],
    "paths": [
      "M24,16 L76,16",
      "M76,16 L24,100",
      "M24,100 L76,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 24,
        "y": 16,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 76,
        "y": 16,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 24,
        "y": 100,
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
          "x": 76,
          "y": 16
        }
      },
      {
        "start": {
          "x": 76,
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
          "y": 100
        },
        "end": {
          "x": 76,
          "y": 100
        }
      }
    ]
  }
};

export const LOWERCASE_PATHS = {
  "a": {
    "letter": "a",
    "category": "Pendek",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat lingkaran kecil berlawanan jarum jam, 2. Tarik tiang pendek di sisi kanan ke bawah!",
    "strokeInstructions": ["Lingkaran kecil.", "Garis tegak kanan."],
    "paths": [
      "M66,74 C66,58 34,58 34,79 C34,100 66,100 66,79",
      "M66,58 L66,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 66,
        "y": 74,
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
          "y": 74
        },
        "end": {
          "x": 66,
          "y": 79
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
    "category": "Tinggi",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tinggi lurus ke bawah, 2. Buat perut melengkung di kanan bawah!",
    "strokeInstructions": ["Garis tegak.", "Lengkungan kanan bawah."],
    "paths": [
      "M32,16 L32,100",
      "M32,58 C68,58 74,70 74,80 C74,98 56,100 32,100"
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
        "y": 58,
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
          "y": 58
        },
        "end": {
          "x": 32,
          "y": 100
        }
      }
    ]
  },
  "c": {
    "letter": "c",
    "category": "Pendek",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat lengkungan kecil terbuka ke arah kanan!",
    "strokeInstructions": ["Lengkungan terbuka."],
    "paths": [
      "M70,68 C64,58 34,58 34,79 C34,100 64,100 70,90"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 70,
        "y": 68,
        "label": "Mulai 1"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 70,
          "y": 68
        },
        "end": {
          "x": 70,
          "y": 90
        }
      }
    ]
  },
  "d": {
    "letter": "d",
    "category": "Tinggi",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat lingkaran kecil di kiri, 2. Tarik tiang tinggi dari garis atas lurus ke bawah!",
    "strokeInstructions": ["Lingkaran kecil.", "Garis tegak kanan."],
    "paths": [
      "M66,79 C66,58 34,58 34,79 C34,100 66,100 66,79",
      "M66,16 L66,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 66,
        "y": 79,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 66,
        "y": 16,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 66,
          "y": 79
        },
        "end": {
          "x": 66,
          "y": 79
        }
      },
      {
        "start": {
          "x": 66,
          "y": 16
        },
        "end": {
          "x": 66,
          "y": 100
        }
      }
    ]
  },
  "e": {
    "letter": "e",
    "category": "Pendek",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik garis mendatar di tengah, 2. Lengkungkan melingkar ke atas lalu ke bawah!",
    "strokeInstructions": ["Garis mendatar pendek.", "Lengkungan memutar."],
    "paths": [
      "M34,79 L68,79",
      "M68,79 C68,58 34,58 34,79 C34,100 64,100 70,92"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 34,
        "y": 79,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 68,
        "y": 79,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 34,
          "y": 79
        },
        "end": {
          "x": 68,
          "y": 79
        }
      },
      {
        "start": {
          "x": 68,
          "y": 79
        },
        "end": {
          "x": 70,
          "y": 92
        }
      }
    ]
  },
  "f": {
    "letter": "f",
    "category": "Tinggi",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat kait lengkung di atas lalu tarik tiang lurus ke bawah, 2. Garis palang mendatar di tengah!",
    "strokeInstructions": ["Garis lengkung tegak.", "Garis mendatar."],
    "paths": [
      "M64,24 C56,16 46,16 46,26 L46,100",
      "M32,58 L62,58"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 64,
        "y": 24,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 32,
        "y": 58,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 64,
          "y": 24
        },
        "end": {
          "x": 46,
          "y": 100
        }
      },
      {
        "start": {
          "x": 32,
          "y": 58
        },
        "end": {
          "x": 62,
          "y": 58
        }
      }
    ]
  },
  "g": {
    "letter": "g",
    "category": "Ekor",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat lingkaran kecil di atas, 2. Tarik tiang ke bawah menembus dasar lalu melengkung ke kiri!",
    "strokeInstructions": ["Lingkaran kecil.", "Garis turun dan lengkungan ekor."],
    "paths": [
      "M66,74 C66,58 34,58 34,79 C34,100 66,100 66,79",
      "M66,58 L66,106 C66,116 38,116 34,106"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 66,
        "y": 74,
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
          "y": 74
        },
        "end": {
          "x": 66,
          "y": 79
        }
      },
      {
        "start": {
          "x": 66,
          "y": 58
        },
        "end": {
          "x": 34,
          "y": 106
        }
      }
    ]
  },
  "h": {
    "letter": "h",
    "category": "Tinggi",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tinggi lurus ke bawah, 2. Buat bukit lengkung ke kanan lalu turun ke bawah!",
    "strokeInstructions": ["Garis tegak.", "Lengkungan kanan."],
    "paths": [
      "M32,16 L32,100",
      "M32,68 C40,58 68,58 68,74 L68,100"
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
        "y": 68,
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
          "y": 68
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
    "category": "Pendek",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang pendek dari garis tengah ke bawah, 2. Beri titik di atasnya!",
    "strokeInstructions": ["Garis tegak.", "Titik di atas."],
    "paths": [
      "M50,58 L50,100",
      "M50,38 L50,42"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 50,
        "y": 58,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 50,
        "y": 38,
        "label": "Mulai 2"
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
          "y": 100
        }
      },
      {
        "start": {
          "x": 50,
          "y": 38
        },
        "end": {
          "x": 50,
          "y": 42
        }
      }
    ]
  },
  "j": {
    "letter": "j",
    "category": "Ekor",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang dari garis tengah ke bawah melengkung ke kiri, 2. Beri titik di atasnya!",
    "strokeInstructions": ["Garis tegak melengkung ke bawah.", "Titik di atas."],
    "paths": [
      "M56,58 L56,106 C56,116 34,116 30,106",
      "M56,38 L56,42"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 56,
        "y": 58,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 56,
        "y": 38,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 56,
          "y": 58
        },
        "end": {
          "x": 30,
          "y": 106
        }
      },
      {
        "start": {
          "x": 56,
          "y": 38
        },
        "end": {
          "x": 56,
          "y": 42
        }
      }
    ]
  },
  "k": {
    "letter": "k",
    "category": "Tinggi",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang tinggi lurus ke bawah, 2. Miring ke arah tiang, 3. Miring keluar ke kanan bawah!",
    "strokeInstructions": ["Garis tegak.", "Garis miring atas.", "Garis miring bawah."],
    "paths": [
      "M32,16 L32,100",
      "M68,58 L32,79",
      "M32,79 L68,100"
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
        "y": 58,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 32,
        "y": 79,
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
          "y": 58
        },
        "end": {
          "x": 32,
          "y": 79
        }
      },
      {
        "start": {
          "x": 32,
          "y": 79
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
    "category": "Tinggi",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik satu tiang lurus tinggi dari atas ke bawah!",
    "strokeInstructions": ["Garis tegak."],
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
    "category": "Pendek",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang pendek ke bawah, 2. Buat bukit lengkung pertama, 3. Buat bukit lengkung kedua!",
    "strokeInstructions": ["Garis tegak.", "Lengkungan pertama.", "Lengkungan kedua."],
    "paths": [
      "M22,58 L22,100",
      "M22,68 C28,58 48,58 48,74 L48,100",
      "M48,68 C54,58 76,58 76,74 L76,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 22,
        "y": 58,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 22,
        "y": 68,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 48,
        "y": 68,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 22,
          "y": 58
        },
        "end": {
          "x": 22,
          "y": 100
        }
      },
      {
        "start": {
          "x": 22,
          "y": 68
        },
        "end": {
          "x": 48,
          "y": 100
        }
      },
      {
        "start": {
          "x": 48,
          "y": 68
        },
        "end": {
          "x": 76,
          "y": 100
        }
      }
    ]
  },
  "n": {
    "letter": "n",
    "category": "Pendek",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang pendek ke bawah, 2. Buat satu bukit lengkung lalu turun ke bawah!",
    "strokeInstructions": ["Garis tegak.", "Satu lengkungan."],
    "paths": [
      "M30,58 L30,100",
      "M30,68 C38,58 70,58 70,74 L70,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 30,
        "y": 58,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 30,
        "y": 68,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 30,
          "y": 58
        },
        "end": {
          "x": 30,
          "y": 100
        }
      },
      {
        "start": {
          "x": 30,
          "y": 68
        },
        "end": {
          "x": 70,
          "y": 100
        }
      }
    ]
  },
  "o": {
    "letter": "o",
    "category": "Pendek",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat lingkaran bulat penuh berlawanan jarum jam di antara dua garis tengah!",
    "strokeInstructions": ["Lingkaran tertutup."],
    "paths": [
      "M50,58 C32,58 32,100 50,100 C68,100 68,58 50,58"
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
    "category": "Ekor",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang dari garis tengah tembus ke garis bawah, 2. Buat perut melengkung di kanan!",
    "strokeInstructions": ["Garis tegak turun.", "Lengkungan kanan."],
    "paths": [
      "M34,58 L34,114",
      "M34,58 C68,58 74,70 74,79 C74,98 56,100 34,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 34,
        "y": 58,
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
          "x": 34,
          "y": 58
        },
        "end": {
          "x": 34,
          "y": 114
        }
      },
      {
        "start": {
          "x": 34,
          "y": 58
        },
        "end": {
          "x": 34,
          "y": 100
        }
      }
    ]
  },
  "q": {
    "letter": "q",
    "category": "Ekor",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat lingkaran kecil di kiri, 2. Tarik tiang lurus di kanan tembus ke garis bawah!",
    "strokeInstructions": ["Lingkaran.", "Garis turun kanan."],
    "paths": [
      "M66,74 C66,58 34,58 34,79 C34,100 66,100 66,79",
      "M66,58 L66,114"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 66,
        "y": 74,
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
          "y": 74
        },
        "end": {
          "x": 66,
          "y": 79
        }
      },
      {
        "start": {
          "x": 66,
          "y": 58
        },
        "end": {
          "x": 66,
          "y": 114
        }
      }
    ]
  },
  "r": {
    "letter": "r",
    "category": "Pendek",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang pendek ke bawah, 2. Buat lengkungan kecil ke kanan atas!",
    "strokeInstructions": ["Garis tegak.", "Lengkungan kecil."],
    "paths": [
      "M34,58 L34,100",
      "M34,68 C38,60 60,60 66,66"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 34,
        "y": 58,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 34,
        "y": 68,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 34,
          "y": 58
        },
        "end": {
          "x": 34,
          "y": 100
        }
      },
      {
        "start": {
          "x": 34,
          "y": 68
        },
        "end": {
          "x": 66,
          "y": 66
        }
      }
    ]
  },
  "s": {
    "letter": "s",
    "category": "Pendek",
    "numStrokes": 1,
    "viewBox": "0 0 100 120",
    "instruction": "1. Buat liukan kecil huruf s dari kanan atas meliuk ke kiri bawah!",
    "strokeInstructions": ["Lengkungan membentuk S."],
    "paths": [
      "M66,66 C62,58 36,58 36,70 C36,80 66,78 66,90 C66,100 34,100 30,92"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 66,
        "y": 66,
        "label": "Mulai 1"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 66,
          "y": 66
        },
        "end": {
          "x": 30,
          "y": 92
        }
      }
    ]
  },
  "t": {
    "letter": "t",
    "category": "Tinggi",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang dari atas melengkung sedikit di dasar, 2. Beri palang mendatar di garis tengah!",
    "strokeInstructions": ["Garis tegak.", "Garis mendatar."],
    "paths": [
      "M48,28 L48,92 C48,100 56,100 62,98",
      "M32,58 L64,58"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 48,
        "y": 28,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 32,
        "y": 58,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 48,
          "y": 28
        },
        "end": {
          "x": 62,
          "y": 98
        }
      },
      {
        "start": {
          "x": 32,
          "y": 58
        },
        "end": {
          "x": 64,
          "y": 58
        }
      }
    ]
  },
  "u": {
    "letter": "u",
    "category": "Pendek",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik tiang melengkung di dasar naik ke atas, 2. Tarik tiang lurus ke bawah di sisi kanan!",
    "strokeInstructions": ["Garis turun lengkungan bawah.", "Garis tegak kanan."],
    "paths": [
      "M32,58 L32,90 C32,100 66,100 66,90",
      "M66,58 L66,100"
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
        "x": 66,
        "y": 58,
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
          "x": 66,
          "y": 90
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
  "v": {
    "letter": "v",
    "category": "Pendek",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik miring ke bawah, 2. Tarik miring naik ke kanan atas!",
    "strokeInstructions": ["Garis miring turun.", "Garis miring naik."],
    "paths": [
      "M28,58 L50,100",
      "M50,100 L72,58"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 28,
        "y": 58,
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
          "x": 28,
          "y": 58
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
          "x": 72,
          "y": 58
        }
      }
    ]
  },
  "w": {
    "letter": "w",
    "category": "Pendek",
    "numStrokes": 4,
    "viewBox": "0 0 100 120",
    "instruction": "1. Miring ke bawah, 2. Miring naik, 3. Miring ke bawah, 4. Miring naik ke kanan atas!",
    "strokeInstructions": ["Garis miring turun.", "Garis miring naik.", "Garis miring turun.", "Garis miring naik."],
    "paths": [
      "M20,58 L34,100",
      "M34,100 L50,70",
      "M50,70 L66,100",
      "M66,100 L80,58"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 20,
        "y": 58,
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
        "x": 50,
        "y": 70,
        "label": "Mulai 3"
      },
      {
        "number": 4,
        "x": 66,
        "y": 100,
        "label": "Mulai 4"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 20,
          "y": 58
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
          "x": 50,
          "y": 70
        }
      },
      {
        "start": {
          "x": 50,
          "y": 70
        },
        "end": {
          "x": 66,
          "y": 100
        }
      },
      {
        "start": {
          "x": 66,
          "y": 100
        },
        "end": {
          "x": 80,
          "y": 58
        }
      }
    ]
  },
  "x": {
    "letter": "x",
    "category": "Pendek",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik garis silang dari kiri ke kanan bawah, 2. Tarik silang dari kanan ke kiri bawah!",
    "strokeInstructions": ["Garis miring kiri ke kanan.", "Garis miring kanan ke kiri."],
    "paths": [
      "M30,58 L70,100",
      "M70,58 L30,100"
    ],
    "startNodes": [
      {
        "number": 1,
        "x": 30,
        "y": 58,
        "label": "Mulai 1"
      },
      {
        "number": 2,
        "x": 70,
        "y": 58,
        "label": "Mulai 2"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 30,
          "y": 58
        },
        "end": {
          "x": 70,
          "y": 100
        }
      },
      {
        "start": {
          "x": 70,
          "y": 58
        },
        "end": {
          "x": 30,
          "y": 100
        }
      }
    ]
  },
  "y": {
    "letter": "y",
    "category": "Ekor",
    "numStrokes": 2,
    "viewBox": "0 0 100 120",
    "instruction": "1. Tarik miring pendek ke kanan bawah, 2. Tarik garis panjang dari kanan atas tembus ke garis bawah!",
    "strokeInstructions": ["Garis miring turun.", "Garis miring membentuk ekor."],
    "paths": [
      "M32,58 L50,100",
      "M68,58 L36,114"
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
        "x": 68,
        "y": 58,
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
          "x": 50,
          "y": 100
        }
      },
      {
        "start": {
          "x": 68,
          "y": 58
        },
        "end": {
          "x": 36,
          "y": 114
        }
      }
    ]
  },
  "z": {
    "letter": "z",
    "category": "Pendek",
    "numStrokes": 3,
    "viewBox": "0 0 100 120",
    "instruction": "1. Garis mendatar atas, 2. Garis miring ke kiri bawah, 3. Garis mendatar bawah!",
    "strokeInstructions": ["Garis atas.", "Garis miring turun.", "Garis bawah."],
    "paths": [
      "M32,58 L68,58",
      "M68,58 L32,100",
      "M32,100 L68,100"
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
        "x": 68,
        "y": 58,
        "label": "Mulai 2"
      },
      {
        "number": 3,
        "x": 32,
        "y": 100,
        "label": "Mulai 3"
      }
    ],
    "checkpoints": [
      {
        "start": {
          "x": 32,
          "y": 58
        },
        "end": {
          "x": 68,
          "y": 58
        }
      },
      {
        "start": {
          "x": 68,
          "y": 58
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
          "x": 68,
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
