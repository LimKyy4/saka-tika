/**
 * AnimatedBackground - Layered background bertingkat dunia anak:
 * - Gradient langit biru pastel + kuning lembut
 * - Awan melayang horizontal
 * - Bukit hijau melengkung di bagian bawah
 * - Gelembung huruf A, B, C berwarna-warni yang melayang
 */

import { motion } from 'framer-motion'

const cloudVariants = {
  left: {
    x: [100, -10, 100],
    transition: { duration: 20, repeat: Infinity, ease: 'linear' },
  },
  right: {
    x: [-100, 100, -100],
    transition: { duration: 22, repeat: Infinity, ease: 'linear', delay: 1 },
  },
  down: {
    y: [0, 30, 0],
    transition: { duration: 15, repeat: Infinity, ease: 'easeInOut' },
  },
}

const bubbleVariants = {
  float: {
    y: [0, -30, 0],
    transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const AnimatedBackground = () => {
  return (
    <div className="relative inset-0 overflow-hidden">
      {/* Gradient dasar: Sky Blue pastel lembut */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50" />

      {/* Awan melayang horizontal - kiri */}
      <motion.div
        animate={cloudVariants.left}
        className="absolute top-[5%] left-[-10%] w-64 h-32 bg-white/40 rounded-full blur-[80px] pointer-events-none"
      />
      {/* Awan melayang horizontal - kanan */}
      <motion.div
        animate={cloudVariants.right}
        className="absolute top-[15%] right-[-15%] w-72 h-36 bg-white/35 rounded-full blur-[90px] pointer-events-none"
      />

      {/* Bukit hijau pastel melengkung di bagian bawah */}
      <div className="absolute bottom-0 left-0 right-0 bg-emerald-200/60 border-t-2 border-emerald-300 rounded-t-[100px] overflow-hidden pointer-events-none">
        <div className="h-full w-full bg-gradient-to-t from-emerald-100 via-emerald-50 to-white/20"></div>
      </div>

      {/* Gelembung huruf A, B, C pastel melayang acak */}
      {[1, 2, 3].map((i, index) => (
        <motion.div
          key={i}
          animate={bubbleVariants.float}
          className="absolute rounded-full bg-amber-300/70 border-2 border-amber-200"
          style={{
            left: index * 35 + 10 + '%',
            top: 40 + (index * 20) + '%',
            width: 28 + index * 12,
            height: 28 + index * 12,
            animationDelay: index * 2 + 's',
          }}
        />
      ))}

      {/* Detail bintang kecil yang mengambang di udara */}
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, delay: i * 1.5 }}
          className="absolute rounded-full bg-yellow-300/50"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
            width: 6,
            height: 6,
          }}
        />
      ))}
    </div>
  )
}