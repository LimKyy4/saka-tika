/**
 * FlyingAnimal - Animasi burung/lebat imut yang terbang melintasi layar secara periodik.
 * Setiap 3-5 detik, satu bird terbang dari sisi ke sisi layar dengan gerakan sayap.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Feather, Sun, Cloud } from 'lucide-react'

const birdVariants = {
  leftToRight: {
    x: [-100, '100%'],
    scaleX: 1,
    transition: {
      duration: 8,
      repeatType: 'repeat',
      ease: 'linear',
    },
  },
  rightToLeft: {
    x: ['100%', -100],
    scaleX: -1,
    transition: {
      duration: 7,
      repeatType: 'repeat',
      ease: 'linear',
      delay: 2,
    },
  },
  wingFlap: {
    rotate: [0, 20, -10, 0, 20, 0],
    transition: {
      duration: 0.3,
      repeatType: 'repeat',
      ease: 'easeInOut',
    },
  },
}

export const FlyingAnimal = () => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top: '20%',
        width: 40,
        height: 40,
      }}
    >
      {/* Burung pertama - kiri ke kanan */}
      <motion.svg
        key="bird1"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        animate={"leftToRight"}
        className="text-amber-400"
      >
        <path d="M20 5 L35 15 L35 25 L20 35 L5 25 L5 15 Z" fill="currentColor" />
        <path d="M20 5 Q25 0 30 5" stroke="currentColor" strokeWidth="1" fill="none" />
      </motion.svg>

      {/* Burung kedua - kanan ke kiri dengan delay */}
      <motion.svg
        key="bird2"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        animate="rightToLeft"
        className="text-pink-400"
        style={{
          right: '-40px',
          transform: 'scaleX(-1)',
        }}
      >
        <path d="M20 5 L35 15 L35 25 L20 35 L5 25 L5 15 Z" fill="currentColor" />
        <path d="M20 5 Q25 0 30 5" stroke="currentColor" strokeWidth="1" fill="none" />
      </motion.svg>

      {/* Ketuban awan di latar belakang */}
      <motion.svg
        key="cloud1"
        width="60"
        height="30"
        viewBox="0 0 60 30"
        animate="{{ x: [-100, '120%'], transition: { duration: 15, repeatType: 'repeat', ease: 'linear', delay: 1 } }}"
        className="text-slate-200 absolute top-[8%] left-[-10%] pointer-events-none"
      >
        <path d="M10 15 Q20 5 40 15 Q50 25 30 15 T10 15" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </motion.svg>

      {/* Detail bintang kecil */}
      <motion.div
        key="star1"
        animate={{ opacity: [0.3, 1, 0.3], transition: { duration: 4, repeatType: 'repeat', ease: 'easeInOut', delay: 0.5 } }}
        className="absolute text-yellow-300"
        style={{
          left: '15%',
          top: '45%',
          width: 6,
          height: 6,
          borderRadius: 50,
        }}
      />
    </motion.div>
  )
}