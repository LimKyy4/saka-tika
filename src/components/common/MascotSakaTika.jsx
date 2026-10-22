/**
 * Karakter Maskot Saka & Tika - pasangan SVG vector pastel yang imut.
 * Saka: anak laki-laki berbaju biru dengan topi.
 * Tika: anak perempuan berbaju pink dengan pita rambut.
 * Animasi floating halus + kedipan mata berkala. Tanpa efek hover.
 */

import React from 'react'
import { motion } from 'framer-motion'

/* Kedipan mata: cepat di tengah siklus, lalu istirahat */
const blink = {
  scaleY: [1, 1, 0.12, 1, 1],
  transition: {
    duration: 5.5,
    times: [0, 0.88, 0.92, 0.96, 1],
    repeat: Infinity,
    repeatDelay: 1.4,
    ease: 'easeInOut',
  },
}

const eyeStyle = { transformBox: 'fill-box', transformOrigin: 'center' }

/* Satu mata: bola mata + pantulan cahaya */
const Eye = ({ cx, cy }) => (
  <motion.g animate={blink} style={eyeStyle}>
    <ellipse cx={cx} cy={cy} rx="7.5" ry="8.5" fill="#1F2937" />
    <circle cx={cx + 2.6} cy={cy - 3.2} r="2.6" fill="#FFFFFF" />
    <circle cx={cx - 2.4} cy={cy + 2.6} r="1.2" fill="#FFFFFF" opacity="0.65" />
  </motion.g>
)

export const MascotSakaTika = ({ compact = false }) => {
  return (
    <div className="flex w-full items-end justify-center gap-4 sm:gap-8">
      {/* ==================== SAKA ==================== */}
      <motion.div
        className="relative"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="160"
          height="200"
          viewBox="0 0 160 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={compact ? 'h-[84px] w-auto' : 'h-[150px] w-auto sm:h-[176px]'}
          role="img"
          aria-label="Saka"
        >
          <defs>
            <linearGradient id="sakaShirtClean" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>

          {/* Bayangan */}
          <ellipse cx="80" cy="192" rx="40" ry="6" fill="#0F172A" opacity="0.08" />

          {/* Kaki & sepatu */}
          <path d="M68 158 L68 182" stroke="#FBBF24" strokeWidth="12" strokeLinecap="round" />
          <path d="M92 158 L92 182" stroke="#FBBF24" strokeWidth="12" strokeLinecap="round" />
          <path d="M60 184 Q68 189 76 184" stroke="#92400E" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M84 184 Q92 189 100 184" stroke="#92400E" strokeWidth="9" strokeLinecap="round" fill="none" />

          {/* Badan / kaus biru */}
          <path
            d="M56 122 Q80 112 104 122 L108 162 Q80 172 52 162 Z"
            fill="url(#sakaShirtClean)"
            stroke="#1D4ED8"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Lengan kiri turun */}
          <path d="M58 130 Q46 140 42 154" stroke="#1D4ED8" strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="41" cy="157" r="8" fill="#FDE9B8" stroke="#B45309" strokeWidth="3" />

          {/* Lengan kanan melambai */}
          <motion.g
            animate={{ rotate: [0, -10, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: '82% 60%' }}
          >
            <path d="M102 130 Q116 118 122 106" stroke="#1D4ED8" strokeWidth="11" strokeLinecap="round" fill="none" />
            <circle cx="124" cy="102" r="9" fill="#FDE9B8" stroke="#B45309" strokeWidth="3" />
          </motion.g>

          {/* Leher */}
          <rect x="73" y="106" width="14" height="12" rx="6" fill="#FDE9B8" />

          {/* Kepala */}
          <circle cx="80" cy="76" r="40" fill="#FDE9B8" stroke="#B45309" strokeWidth="3.5" />
          <circle cx="40" cy="80" r="7" fill="#FDE9B8" stroke="#B45309" strokeWidth="3" />
          <circle cx="120" cy="80" r="7" fill="#FDE9B8" stroke="#B45309" strokeWidth="3" />

          {/* Rambut */}
          <path d="M41 74 Q46 42 80 40 Q114 42 119 74 Q106 58 80 58 Q54 58 41 74 Z" fill="#451A03" />

          {/* Topi */}
          <path
            d="M40 58 Q80 28 120 58 L120 66 Q80 50 40 66 Z"
            fill="#FBBF24"
            stroke="#B45309"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M120 60 Q136 60 139 70" stroke="#B45309" strokeWidth="5" strokeLinecap="round" fill="none" />

          {/* Mata */}
          <Eye cx={66} cy={78} />
          <Eye cx={94} cy={78} />

          {/* Alis ramah */}
          <path d="M59 66 Q66 63 73 66" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M87 66 Q94 63 101 66" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Pipi */}
          <ellipse cx="52" cy="92" rx="7" ry="4.5" fill="#FB7185" opacity="0.5" />
          <ellipse cx="108" cy="92" rx="7" ry="4.5" fill="#FB7185" opacity="0.5" />

          {/* Senyum */}
          <path d="M72 96 Q80 105 88 96" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </svg>

        {!compact && (
          <span className="mt-2 block text-center text-xs font-black uppercase tracking-wider text-indigo-900">
            Saka
          </span>
        )}
      </motion.div>

      {/* ==================== TIKA ==================== */}
      <motion.div
        className="relative"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
      >
        <svg
          width="160"
          height="200"
          viewBox="0 0 160 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={compact ? 'h-[84px] w-auto' : 'h-[150px] w-auto sm:h-[176px]'}
          role="img"
          aria-label="Tika"
        >
          <defs>
            <linearGradient id="tikaDressClean" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F9A8D4" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>

          {/* Bayangan */}
          <ellipse cx="80" cy="192" rx="40" ry="6" fill="#0F172A" opacity="0.08" />

          {/* Kaki & sepatu */}
          <path d="M70 160 L70 182" stroke="#FBCFE8" strokeWidth="11" strokeLinecap="round" />
          <path d="M90 160 L90 182" stroke="#FBCFE8" strokeWidth="11" strokeLinecap="round" />
          <path d="M63 184 Q70 189 77 184" stroke="#BE185D" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M83 184 Q90 189 97 184" stroke="#BE185D" strokeWidth="9" strokeLinecap="round" fill="none" />

          {/* Gaun pink */}
          <path
            d="M60 122 Q80 112 100 122 L112 164 Q80 176 48 164 Z"
            fill="url(#tikaDressClean)"
            stroke="#DB2777"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Lengan kiri turun */}
          <path d="M62 130 Q50 140 47 154" stroke="#DB2777" strokeWidth="10" strokeLinecap="round" fill="none" />
          <circle cx="46" cy="157" r="8" fill="#FDE9B8" stroke="#B45309" strokeWidth="3" />

          {/* Lengan kanan melambai */}
          <motion.g
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            style={{ transformBox: 'fill-box', transformOrigin: '20% 60%' }}
          >
            <path d="M98 130 Q112 118 117 106" stroke="#DB2777" strokeWidth="10" strokeLinecap="round" fill="none" />
            <circle cx="119" cy="102" r="9" fill="#FDE9B8" stroke="#B45309" strokeWidth="3" />
          </motion.g>

          {/* Leher */}
          <rect x="74" y="106" width="12" height="12" rx="6" fill="#FDE9B8" />

          {/* Kepala */}
          <circle cx="80" cy="76" r="40" fill="#FDE9B8" stroke="#B45309" strokeWidth="3.5" />
          <circle cx="40" cy="80" r="7" fill="#FDE9B8" stroke="#B45309" strokeWidth="3" />
          <circle cx="120" cy="80" r="7" fill="#FDE9B8" stroke="#B45309" strokeWidth="3" />

          {/* Rambut + kuncir */}
          <path d="M41 74 Q46 42 80 40 Q114 42 119 74 Q106 58 80 58 Q54 58 41 74 Z" fill="#7C2D12" />
          <circle cx="36" cy="96" r="13" fill="#7C2D12" />
          <circle cx="124" cy="96" r="13" fill="#7C2D12" />

          {/* Pita rambut */}
          <path d="M62 46 Q80 34 98 46 L94 56 Q80 50 66 56 Z" fill="#DB2777" stroke="#BE185D" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="80" cy="48" r="5" fill="#FBCFE8" />

          {/* Mata dengan bulu mata */}
          <Eye cx={66} cy={78} />
          <Eye cx={94} cy={78} />
          <path d="M58 68 Q64 64 70 68" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M90 68 Q96 64 102 68" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Pipi */}
          <ellipse cx="52" cy="92" rx="7" ry="4.5" fill="#FB7185" opacity="0.55" />
          <ellipse cx="108" cy="92" rx="7" ry="4.5" fill="#FB7185" opacity="0.55" />

          {/* Senyum */}
          <path d="M72 96 Q80 105 88 96" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </svg>

        {!compact && (
          <span className="mt-2 block text-center text-xs font-black uppercase tracking-wider text-pink-700">
            Tika
          </span>
        )}
      </motion.div>
    </div>
  )
}
