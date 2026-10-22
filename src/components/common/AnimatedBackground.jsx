/**
 * AnimatedBackground - Layered background bertingkat dunia anak yang kaya aset edukasi:
 * - Gradient langit biru pastel + kuning lembut
 * - Awan melayang horizontal
 * - Bukit hijau melengkung di bagian bawah
 * - Gelembung huruf A, B, C berwarna-warni
 * - Aset edukasi terang-teras melayang: laptop, buku, balok huruf, pensil, bintang
 */

import { motion } from 'framer-motion'
import { Sparkles, BookOpen, Laptop, GraduationCap, Pencil, Sun, Cloud } from 'lucide-react'

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

      {/* Aset edukasi melayang - laptop */}
      <motion.svg
        key="laptop"
        width="60"
        height="40"
        viewBox="0 0 60 40"
        animate={{
          x: [0, '110%', 0],
          y: [30, 10, 30],
          transition: {
            duration: 10,
            repeatType: 'repeat',
            ease: 'easeInOut',
            delay: 3,
          },
        }}
        className="absolute text-slate-300 pointer-events-none"
        style={{
          left: '-60px',
          top: '60%',
        }}
      >
        <rect x="5" y="5" width="50" height="25" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="15" y="10" width="20" height="10" fill="currentColor" />
        <rect x="15" y="20" width="25" height="5" fill="currentColor" />
      </motion.svg>

      {/* Buku terbuka */}
      <motion.svg
        key="book"
        width="50"
        height="60"
        viewBox="0 0 50 60"
        animate={{
          x: ['-50%', 50, '-50%'],
          y: [20, 40, 20],
          transition: {
            duration: 12,
            repeatType: 'repeat',
            ease: 'easeInOut',
            delay: 1,
          },
        }}
        className="absolute text-slate-300 pointer-events-none"
        style={{
          left: '-50px',
          top: '70%',
        }}
      >
        <path d="M10 10 L40 10 L40 45 L10 45 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M10 10 Q25 5 40 10 Q45 15 45 25 Q45 35 40 40 Q25 45 10 45 Z" fill="currentColor" />
        <path d="M10 25 Q20 20 35 25 Q40 30 40 40" stroke="currentColor" strokeWidth="1" fill="none" />
      </motion.svg>

      {/* Balok huruf A, B, C 3D pastel yang melayang */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{ x: [0, -30, 0], transition: { duration: 6, repeatType: 'repeat', ease: 'easeInOut', delay: i * 2 } }}
          className="absolute rounded bg-amber-300/60 border border-amber-200 shadow-lg"
          style={{
            left: i * 30 + 15 + '%',
            top: 50 + (i * 10) + '%',
            width: 35 + i * 8,
            height: 25 + i * 6,
          }}
        />
      ))}

      {/* Pensil melayang */}
      <motion.svg
        key="pencil"
        width="50"
        height="50"
        viewBox="0 0 50 50"
        animate={{
          x: ['100%', -50, '100%'],
          y: [10, 30, 10],
          transition: {
            duration: 9,
            repeatType: 'repeat',
            ease: 'easeInOut',
            delay: 2.5,
          },
        }}
        className="absolute text-indigo-400 pointer-events-none"
        style={{
          right: '-50px',
          top: '55%',
        }}
      >
        <path d="M5 5 L45 5 L40 15 L10 15 L5 5 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M25 5 Q25 -5 50 0 Q25 5 25 5 Z" fill="currentColor" />
        <circle cx="25" cy="25" r="3" fill="currentColor" />
      </motion.svg>

      {/* Matahari di langit */}
      <motion.svg
        key="sun"
        width="50"
        height="50"
        viewBox="0 0 50 50"
        animate={{ x: [0, '100%', 0], transition: { duration: 15, repeatType: 'repeat', ease: 'easeInOut' } }}
        className="absolute top-[10%] right-[-5%] text-yellow-300 pointer-events-none"
        style={{ right: '-50px' }}
      >
        <circle cx="25" cy="25" r="20" fill="currentColor" />
        <path d="M25 5 L25 15 M25 35 M5 25 L35 25 M10 15 L40 15 M10 35 L40 35" stroke="currentColor" strokeWidth="2" fill="none" />
      </motion.svg>

      {/* Awan kecil melayang di bagian atas */}
      {[1, 2].map((i) => (
        <motion.svg
          key={`cloud-${i}`}
          width="70"
          height="40"
          viewBox="0 0 70 40"
          animate="{{ x: [-100, '120%'], transition: { duration: 18, repeatType: 'repeat', ease: 'linear', delay: i * 3 } }}"
          className="absolute text-slate-200 pointer-events-none"
          style={{
            top: i === 0 ? '8%' : '12%',
            left: i === 0 ? '-100%' : '110%',
          }}
        >
          <path d="M10 20 Q20 5 40 20 Q50 35 30 35 T10 20" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </motion.svg>
      ))}

      {/* Kilauan bintang Sparkles */}
      <Sparkles size={20} strokeWidth={2} className="absolute text-amber-500 animate-pulse" style={{ left: '5%', top: '70%' }} />
    </div>
  )
}