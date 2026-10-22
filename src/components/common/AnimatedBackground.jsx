/**
 * AnimatedBackground - Background interaktif dengan elemen SVG melayang halus:
 * awan pastel, gelembung warna-warni, dan bintang berkilau.
 */

import { motion } from 'framer-motion'

const variants = {
  float: {
    y: [0, -20, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
  floatDelay: {
    y: [0, -20, 0],
    transition: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 },
  },
  twinkle: {
    opacity: [0.4, 1, 0.4],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Awan pastel melayang */}
      <motion.div
        animate={variants.float}
        className="absolute top-[-8%] left-[-6%] w-80 h-80 bg-amber-100/60 rounded-full blur-[120px]"
      />
      <motion.div
        animate={variants.floatDelay}
        className="absolute bottom-[-10%] right-[-12%] w-96 h-96 bg-pink-100/60 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ ...variants.float, transition: { ...variants.float.transition, delay: 2 } }}
        className="absolute top-[20%] left-[70%] w-64 h-64 bg-sky-100/50 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ ...variants.floatDelay, transition: { ...variants.floatDelay.transition, delay: 3 } }}
        className="absolute bottom-[20%] left-[10%] w-72 h-72 bg-purple-100/40 rounded-full blur-[110px]"
      />

      {/* Bintang berkilau */}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <motion.div
          key={i}
          animate={variants.twinkle}
          className="absolute rounded-full bg-white/60"
          style={{
            left: `${10 + i * 11}%`,
            top: `${15 + (i * 7) % 70}%`,
            width: 4 + (i % 3),
            height: 4 + (i % 3),
          }}
        />
      ))}
    </div>
  )
}
