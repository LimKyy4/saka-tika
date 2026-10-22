/**
 * FlyingAnimal - Burung kecil imut yang melintas bergantian arah.
 * Lintasan horizontal (x) + gelombang naik-turun (y) + kepakan sayap.
 * Tiga burung dengan delay bertingkat menghasilkan kemunculan tiap ~3 detik.
 */

import React from 'react'
import { motion } from 'framer-motion'

const Bird = ({ color, delay = 0, duration = 8, top = '18%', direction = 'ltr' }) => {
  const startX = direction === 'ltr' ? '-14vw' : '114vw'
  const endX = direction === 'ltr' ? '114vw' : '-14vw'

  return (
    <motion.div
      className="absolute left-0 will-change-transform"
      style={{ top }}
      initial={{ x: startX }}
      animate={{ x: [startX, endX] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
        ease: 'linear',
      }}
    >
      {/* Gelombang naik-turun selama terbang */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <motion.svg
          width="48"
          height="34"
          viewBox="0 0 48 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ scaleX: direction === 'ltr' ? 1 : -1 }}
          aria-hidden="true"
        >
          {/* Sayap kiri */}
          <motion.path
            d="M22 20 Q14 10 4 14 Q12 16 16 22 Z"
            fill={color}
            animate={{ rotate: [-14, 12, -14] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: '90% 90%' }}
          />
          {/* Sayap kanan */}
          <motion.path
            d="M24 20 Q32 10 42 14 Q34 16 30 22 Z"
            fill={color}
            opacity="0.8"
            animate={{ rotate: [12, -14, 12] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: '10% 90%' }}
          />
          {/* Badan */}
          <ellipse cx="23" cy="21" rx="8" ry="6" fill={color} />
          {/* Mata */}
          <circle cx="27" cy="19" r="1.6" fill="#FFFFFF" />
          {/* Paruh */}
          <path d="M31 21 L36 22.5 L31 24 Z" fill="#F59E0B" />
        </motion.svg>
      </motion.div>
    </motion.div>
  )
}

export const FlyingAnimal = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <Bird color="#FBBF24" top="14%" delay={0} duration={8} direction="ltr" />
      <Bird color="#F472B6" top="26%" delay={3} duration={8} direction="rtl" />
      <Bird color="#60A5FA" top="38%" delay={6} duration={8} direction="ltr" />
    </div>
  )
}
