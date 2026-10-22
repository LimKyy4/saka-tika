/**
 * AnimatedBackground - Latar pastel dunia anak yang rapi dan ringan.
 * Layer: gradien langit -> awan melayang -> gelembung huruf A/B/C -> bukit hijau.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const clouds = [
  { top: '6%', left: '4%', width: 132, delay: 0, duration: 15 },
  { top: '13%', left: '62%', width: 108, delay: 1.2, duration: 18 },
  { top: '26%', left: '28%', width: 90, delay: 2.4, duration: 16 },
  { top: '4%', left: '84%', width: 78, delay: 0.6, duration: 20 },
]

const Cloud = ({ width, delay, duration }) => (
  <motion.svg
    width={width}
    height={(width * 60) / 120}
    viewBox="0 0 120 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ x: [0, 22, 0], y: [0, -7, 0] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    <path
      d="M26 48 Q10 48 10 36 Q10 26 22 24 Q24 12 38 12 Q50 12 54 22 Q63 15 72 23 Q86 21 90 33 Q102 35 100 45 Q98 51 86 51 Z"
      fill="#FFFFFF"
      opacity="0.8"
    />
  </motion.svg>
)

const letterBubbles = [
  {
    char: 'A',
    className: 'bg-amber-200/80 border-amber-300 text-amber-700',
    style: { top: '34%', left: '7%', width: 54, height: 54 },
    duration: 4.6,
    delay: 0,
    rotate: -6,
  },
  {
    char: 'B',
    className: 'bg-pink-200/80 border-pink-300 text-pink-700',
    style: { top: '24%', right: '8%', width: 48, height: 48 },
    duration: 5.4,
    delay: 0.8,
    rotate: 5,
  },
  {
    char: 'C',
    className: 'bg-sky-200/80 border-sky-300 text-sky-700',
    style: { top: '52%', right: '14%', width: 44, height: 44 },
    duration: 4.9,
    delay: 1.6,
    rotate: -4,
  },
]

const sparkles = [
  { style: { top: '18%', left: '46%' }, size: 22, color: 'text-amber-400' },
  { style: { top: '44%', left: '16%' }, size: 16, color: 'text-pink-400' },
  { style: { top: '38%', right: '26%' }, size: 18, color: 'text-sky-400' },
]

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 pointer-events-none">
      {/* Awan pastel melayang */}
      {clouds.map((cloud, index) => (
        <div key={index} className="absolute" style={{ top: cloud.top, left: cloud.left }}>
          <Cloud width={cloud.width} delay={cloud.delay} duration={cloud.duration} />
        </div>
      ))}

      {/* Gelembung huruf A, B, C */}
      {letterBubbles.map(({ char, className, style, duration, delay, rotate }) => (
        <motion.div
          key={char}
          className={`absolute flex items-center justify-center rounded-2xl border-4 font-black shadow-md ${className}`}
          style={{ ...style, fontSize: style.width * 0.46 }}
          animate={{ y: [0, -14, 0], rotate: [rotate, -rotate, rotate] }}
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
          animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 3.2, delay: index * 0.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles size={size} strokeWidth={2.5} className={color} />
        </motion.div>
      ))}

      {/* Bukit hijau pastel di dasar layar */}
      <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 rounded-t-[120px] border-t-4 border-emerald-300/70 bg-emerald-200/70" />
      <div className="absolute inset-x-0 bottom-0 h-12 rounded-t-[70px] bg-emerald-300/30" />
    </div>
  )
}
