/**
 * AnimatedBackground - Latar dunia pastel anak yang kaya dan imersif.
 * Layer: gradien langit -> awan melayang -> gelembung huruf A/B/C -> kilauan bintang -> bukit hijau.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Cloud, Sun } from 'lucide-react'

const clouds = [
  { top: '4%', left: '3%', width: 160, delay: 0, duration: 20 },
  { top: '10%', left: '65%', width: 130, delay: 1.5, duration: 24 },
  { top: '22%', left: '25%', width: 110, delay: 3, duration: 22 },
  { top: '3%', left: '85%', width: 90, delay: 0.8, duration: 26 },
  { top: '18%', left: '45%', width: 80, delay: 4, duration: 18 },
]

const CloudSVG = ({ width, delay, duration }) => (
  <motion.svg
    width={width}
    height={(width * 65) / 140}
    viewBox="0 0 140 65"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ x: [0, 28, 0], y: [0, -8, 0] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <path
      d="M30 55 Q12 55 12 42 Q12 30 28 28 Q32 14 50 14 Q65 14 72 26 Q88 22 98 36 Q115 38 112 48 Q108 55 92 55 Z"
      fill="#FFFFFF"
      opacity="0.85"
    />
  </motion.svg>
)

const letterBubbles = [
  {
    char: 'A',
    className: 'bg-amber-200/85 border-amber-300 text-amber-700',
    style: { top: '32%', left: '5%', width: 58, height: 58 },
    duration: 5.2,
    delay: 0,
    rotate: -7,
  },
  {
    char: 'B',
    className: 'bg-pink-200/85 border-pink-300 text-pink-700',
    style: { top: '22%', right: '6%', width: 52, height: 52 },
    duration: 6,
    delay: 1,
    rotate: 6,
  },
  {
    char: 'C',
    className: 'bg-sky-200/85 border-sky-300 text-sky-700',
    style: { top: '50%', right: '12%', width: 48, height: 48 },
    duration: 5.5,
    delay: 2,
    rotate: -5,
  },
  {
    char: 'D',
    className: 'bg-emerald-200/85 border-emerald-300 text-emerald-700',
    style: { top: '42%', left: '10%', width: 44, height: 44 },
    duration: 4.8,
    delay: 0.5,
    rotate: 4,
  },
  {
    char: 'E',
    className: 'bg-orange-200/85 border-orange-300 text-orange-700',
    style: { top: '58%', left: '70%', width: 40, height: 40 },
    duration: 5.8,
    delay: 1.5,
    rotate: -3,
  },
]

const sparkles = [
  { style: { top: '16%', left: '42%' }, size: 24, color: 'text-amber-400' },
  { style: { top: '42%', left: '14%' }, size: 18, color: 'text-pink-400' },
  { style: { top: '36%', right: '24%' }, size: 20, color: 'text-sky-400' },
  { style: { top: '56%', left: '28%' }, size: 16, color: 'text-emerald-400' },
  { style: { top: '24%', right: '12%' }, size: 14, color: 'text-orange-400' },
]

const sunPosition = { top: '8%', right: '8%' }

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 pointer-events-none">
      {/* Matahari tersenyum di sudut kanan atas */}
      <motion.div
        className="absolute"
        style={sunPosition}
        animate={{ rotate: [0, 3, 0, -3, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="36" cy="36" r="28" fill="#FEF08A" stroke="#FDE047" strokeWidth="2" />
          <circle cx="36" cy="36" r="18" fill="#FEF9C3" />
          <circle cx="30" cy="30" r="2.5" fill="#854D0E" />
          <circle cx="42" cy="30" r="2.5" fill="#854D0E" />
          <path d="M28 42 Q36 48 44 42" stroke="#854D0E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Sinar matahari */}
          <motion.g animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            <g stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round">
              <line x1="36" y1="4" x2="36" y2="12" />
              <line x1="36" y1="60" x2="36" y2="68" />
              <line x1="4" y1="36" x2="12" y2="36" />
              <line x1="60" y1="36" x2="68" y2="36" />
              <line x1="13" y1="13" x2="19" y2="19" />
              <line x1="53" y1="53" x2="59" y2="59" />
              <line x1="13" y1="59" x2="19" y2="53" />
              <line x1="53" y1="19" x2="59" y2="13" />
            </g>
          </motion.g>
        </motion.svg>
      </motion.div>

      {/* Awan pastel melayang */}
      {clouds.map((cloud, index) => (
        <div key={index} className="absolute" style={{ top: cloud.top, left: cloud.left }}>
          <CloudSVG width={cloud.width} delay={cloud.delay} duration={cloud.duration} />
        </div>
      ))}

      {/* Gelembung huruf A, B, C, D, E */}
      {letterBubbles.map(({ char, className, style, duration, delay, rotate }) => (
        <motion.div
          key={char}
          className={`absolute flex items-center justify-center rounded-2xl border-4 font-black shadow-lg ${className}`}
          style={{ ...style, fontSize: style.width * 0.42 }}
          animate={{ y: [0, -16, 0], rotate: [rotate, -rotate, rotate] }}
          transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {char}
        </motion.div>
      ))}

      {/* Kilauan bintang */}
      {sparkles.map(({ style, size, color }, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={style}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.15, 0.8] }}
          transition={{ duration: 3.5, delay: index * 0.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles size={size} strokeWidth={2.5} className={color} />
        </motion.div>
      ))}

      {/* Bukit hijau pastel di dasar layar - lapisan berganda */}
      <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 rounded-t-[140px] border-t-4 border-emerald-300/80 bg-emerald-200/80" />
      <div className="absolute inset-x-0 bottom-0 h-16 rounded-t-[80px] bg-emerald-300/40" />
      <div className="absolute inset-x-0 bottom-0 h-8 rounded-t-[50px] bg-emerald-400/20" />
    </div>
  )
}