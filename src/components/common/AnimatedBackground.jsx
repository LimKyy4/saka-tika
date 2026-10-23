/**
 * AnimatedBackground - Dunia pemandangan anak TK:
 * langit pastel, matahari tersenyum, awan melayang,
 * huruf A-E & angka 1-5 melayang, gunung kembar, dan bukit hijau.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

/* ---------------- Awan ---------------- */
const clouds = [
  { top: '5%', left: '2%', width: 150, delay: 0, duration: 22 },
  { top: '12%', left: '62%', width: 120, delay: 1.8, duration: 26 },
  { top: '22%', left: '24%', width: 100, delay: 3.2, duration: 24 },
  { top: '4%', left: '84%', width: 88, delay: 0.9, duration: 28 },
  { top: '17%', left: '44%', width: 74, delay: 4.2, duration: 20 },
]

const CloudSVG = ({ width, delay, duration }) => (
  <motion.svg
    width={width}
    height={(width * 65) / 140}
    viewBox="0 0 140 65"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ x: [0, 26, 0], y: [0, -7, 0] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <path
      d="M30 55 Q12 55 12 42 Q12 30 28 28 Q32 14 50 14 Q65 14 72 26 Q88 22 98 36 Q115 38 112 48 Q108 55 92 55 Z"
      fill="#FFFFFF"
      opacity="0.85"
    />
  </motion.svg>
)

/* ---------------- Matahari tersenyum ---------------- */
const SmilingSun = () => (
  <motion.div
    className="absolute top-4 right-8 sm:right-16 z-10"
    animate={{ scale: [1, 1.08, 1] }}
    transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
  >
    <motion.svg
      width="86"
      height="86"
      viewBox="0 0 86 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      >
        <g stroke="#FCD34D" strokeWidth="3.5" strokeLinecap="round">
          <line x1="43" y1="2" x2="43" y2="11" />
          <line x1="43" y1="75" x2="43" y2="84" />
          <line x1="2" y1="43" x2="11" y2="43" />
          <line x1="75" y1="43" x2="84" y2="43" />
          <line x1="14" y1="14" x2="21" y2="21" />
          <line x1="65" y1="65" x2="72" y2="72" />
          <line x1="14" y1="72" x2="21" y2="65" />
          <line x1="65" y1="21" x2="72" y2="14" />
        </g>
      </motion.g>
      <circle cx="43" cy="43" r="30" fill="#FDE047" stroke="#FBBF24" strokeWidth="3" />
      <circle cx="43" cy="43" r="21" fill="#FEF08A" />
      <circle cx="35" cy="37" r="3" fill="#92400E" />
      <circle cx="51" cy="37" r="3" fill="#92400E" />
      <ellipse cx="30" cy="46" rx="4" ry="2.5" fill="#FB923C" opacity="0.55" />
      <ellipse cx="56" cy="46" rx="4" ry="2.5" fill="#FB923C" opacity="0.55" />
      <path d="M34 49 Q43 58 52 49" stroke="#92400E" strokeWidth="3" strokeLinecap="round" fill="none" />
    </motion.svg>
  </motion.div>
)

/* ---------------- Huruf & angka melayang ---------------- */
const floatingTokens = [
  { char: 'A', top: '20%', left: '4%', size: 58, rotate: -7, duration: 5.2, delay: 0, color: 'bg-sky-200/90 border-sky-300 text-sky-800' },
  { char: 'B', top: '40%', left: '8%', size: 50, rotate: 6, duration: 6.0, delay: 0.8, color: 'bg-pink-200/90 border-pink-300 text-pink-800' },
  { char: 'C', top: '58%', left: '3%', size: 46, rotate: -5, duration: 5.4, delay: 1.6, color: 'bg-emerald-200/90 border-emerald-300 text-emerald-800' },
  { char: 'D', top: '26%', right: '5%', size: 54, rotate: 7, duration: 6.2, delay: 0.4, color: 'bg-amber-200/90 border-amber-300 text-amber-800' },
  { char: 'E', top: '52%', right: '8%', size: 46, rotate: -6, duration: 5.0, delay: 1.2, color: 'bg-orange-200/90 border-orange-300 text-orange-800' },
  { char: '1', top: '33%', left: '14%', size: 44, rotate: 5, duration: 5.6, delay: 2.0, color: 'bg-orange-200/90 border-orange-300 text-orange-800', hideOnMobile: true },
  { char: '2', top: '62%', right: '16%', size: 44, rotate: -4, duration: 4.8, delay: 0.6, color: 'bg-sky-200/90 border-sky-300 text-sky-800', hideOnMobile: true },
  { char: '3', top: '16%', right: '24%', size: 42, rotate: 6, duration: 5.8, delay: 2.4, color: 'bg-pink-200/90 border-pink-300 text-pink-800', hideOnMobile: true },
  { char: '4', top: '56%', left: '17%', size: 42, rotate: -5, duration: 5.2, delay: 1.0, color: 'bg-emerald-200/90 border-emerald-300 text-emerald-800', hideOnMobile: true },
  { char: '5', top: '38%', right: '2%', size: 40, rotate: 5, duration: 6.4, delay: 1.8, color: 'bg-amber-200/90 border-amber-300 text-amber-800' },
]

const sparkles = [
  { style: { top: '30%', left: '30%' }, size: 20, color: 'text-amber-400' },
  { style: { top: '22%', right: '32%' }, size: 16, color: 'text-pink-400' },
  { style: { top: '46%', left: '22%' }, size: 18, color: 'text-sky-400' },
  { style: { top: '48%', right: '26%' }, size: 14, color: 'text-emerald-400' },
]

/* ---------------- Gunung kembar ---------------- */
const TwinMountains = () => (
  <div className="absolute bottom-12 sm:bottom-16 left-0 right-0 w-full z-0 opacity-90">
    <svg
      viewBox="0 0 1440 500"
      preserveAspectRatio="none"
      className="h-[38vh] min-h-[200px] w-full"
      aria-hidden="true"
    >
      {/* Gunung jauh (biru lembut) */}
      <path d="M-40 500 L320 120 L700 500 Z" fill="#BAE6FD" opacity="0.75" />
      <path d="M760 500 L1100 150 L1460 500 Z" fill="#A5F3FC" opacity="0.6" />

      {/* Salju puncak gunung jauh */}
      <path d="M320 120 L378 206 L352 198 L330 224 L306 196 L276 208 Z" fill="#FFFFFF" opacity="0.9" />
      <path d="M1100 150 L1152 226 L1128 218 L1106 244 L1084 216 L1058 228 Z" fill="#FFFFFF" opacity="0.85" />

      {/* Gunung dekat (hijau pastel) */}
      <path d="M60 500 L430 170 L820 500 Z" fill="#6EE7B7" opacity="0.9" />
      <path d="M660 500 L1030 200 L1400 500 Z" fill="#34D399" opacity="0.75" />

      {/* Salju puncak gunung dekat */}
      <path d="M430 170 L482 246 L458 238 L436 262 L414 236 L388 248 Z" fill="#F0FDF4" opacity="0.95" />
      <path d="M1030 200 L1078 268 L1056 260 L1036 284 L1014 258 L990 270 Z" fill="#F0FDF4" opacity="0.9" />

      {/* Bukit hijau melengkung di dasar */}
      <path d="M0 500 L0 432 Q240 372 480 428 Q720 484 960 424 Q1200 364 1440 430 L1440 500 Z" fill="#A7F3D0" opacity="0.85" />
      <path d="M0 500 L0 468 Q360 420 720 462 Q1080 504 1440 458 L1440 500 Z" fill="#86EFAC" opacity="0.7" />
    </svg>
  </div>
)

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50">
      <SmilingSun />

      {/* Pemandangan gunung kembar + bukit */}
      <TwinMountains />

      {/* Awan, huruf & angka, kilauan bintang */}
      <div className="absolute inset-0 z-[5]">
        {clouds.map((cloud, index) => (
          <div key={index} className="absolute" style={{ top: cloud.top, left: cloud.left }}>
            <CloudSVG width={cloud.width} delay={cloud.delay} duration={cloud.duration} />
          </div>
        ))}

        {floatingTokens.map(({ char, top, left, right, size, rotate, duration, delay, color, hideOnMobile }) => (
          <motion.div
            key={char}
            className={`absolute items-center justify-center rounded-2xl border-4 font-black shadow-lg ${color} ${
              hideOnMobile ? 'hidden sm:flex' : 'flex'
            }`}
            style={{ top, left, right, width: size, height: size, fontSize: size * 0.44 }}
            animate={{ y: [0, -12, 0], rotate: [rotate, -rotate, rotate] }}
            transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            {char}
          </motion.div>
        ))}

        {sparkles.map(({ style, size, color }, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={style}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.15, 0.8] }}
            transition={{ duration: 3.5, delay: index * 0.7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={size} strokeWidth={2.5} className={color} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}