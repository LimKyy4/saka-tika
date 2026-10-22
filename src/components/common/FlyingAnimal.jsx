/**
 * FlyingAnimal - Berbagai makhluk lucu yang terbang melintas layar secara periodik.
 * Burung, kupu-kupu, lebah dengan gerakan natural dan kepakan sayap halus.
 */

import React from 'react'
import { motion } from 'framer-motion'

const Bird = ({ color, delay = 0, duration = 10, top = '18%', direction = 'ltr' }) => {
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
        repeatDelay: 3,
        ease: 'linear',
      }}
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay }}
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
          <motion.path
            d="M22 20 Q14 10 4 14 Q12 16 16 22 Z"
            fill={color}
            animate={{ rotate: [-16, 14, -16] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: '90% 90%' }}
          />
          <motion.path
            d="M24 20 Q32 10 42 14 Q34 16 30 22 Z"
            fill={color}
            opacity="0.8"
            animate={{ rotate: [14, -16, 14] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: '10% 90%' }}
          />
          <ellipse cx="23" cy="21" rx="8" ry="6" fill={color} />
          <circle cx="27" cy="19" r="1.6" fill="#FFFFFF" />
          <path d="M31 21 L36 22.5 L31 24 Z" fill="#F59E0B" />
        </motion.svg>
      </motion.div>
    </motion.div>
  )
}

const Butterfly = ({ color, delay = 0, duration = 12, top = '25%', direction = 'ltr' }) => {
  const startX = direction === 'ltr' ? '-12vw' : '112vw'
  const endX = direction === 'ltr' ? '112vw' : '-12vw'

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
        repeatDelay: 4,
        ease: 'linear',
      }}
    >
      <motion.div
        animate={{
          y: [0, -8, 0, -10, 0],
          rotate: [0, 3, 0, -3, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <motion.svg
          width="40"
          height="36"
          viewBox="0 0 40 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ scaleX: direction === 'ltr' ? 1 : -1 }}
          aria-hidden="true"
        >
          <motion.path
            d="M20 18 Q10 6 2 14 Q12 16 18 22 Q26 16 38 14 Q30 6 20 18 Z"
            fill={color}
            opacity="0.9"
            animate={{ scaleX: [1, 0.7, 1, 0.85, 1] }}
            transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
          <motion.path
            d="M20 18 Q28 6 36 14 Q26 16 20 22 Q14 16 2 14 Q10 6 20 18 Z"
            fill={color}
            opacity="0.7"
            animate={{ scaleX: [1, 1.2, 1, 1.15, 1] }}
            transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
          <ellipse cx="20" cy="18" rx="3" ry="10" fill="#7C2D12" />
          <circle cx="18" cy="14" r="1.2" fill="#FFFFFF" />
          <circle cx="22" cy="14" r="1.2" fill="#FFFFFF" />
        </motion.svg>
      </motion.div>
    </motion.div>
  )
}

const Bee = ({ delay = 0, duration = 8, top = '35%', direction = 'ltr' }) => {
  const startX = direction === 'ltr' ? '-10vw' : '110vw'
  const endX = direction === 'ltr' ? '110vw' : '-10vw'

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
        repeatDelay: 2.5,
        ease: 'linear',
      }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <motion.svg
          width="36"
          height="28"
          viewBox="0 0 36 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ scaleX: direction === 'ltr' ? 1 : -1 }}
          aria-hidden="true"
        >
          <motion.path
            d="M18 14 Q14 8 10 12 Q14 16 18 14 Z"
            fill="#FBBF24"
            animate={{ rotate: [-25, 25, -25] }}
            transition={{ duration: 0.15, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: '85% 85%' }}
          />
          <motion.path
            d="M18 14 Q22 8 26 12 Q22 16 18 14 Z"
            fill="#FBBF24"
            opacity="0.8"
            animate={{ rotate: [25, -25, 25] }}
            transition={{ duration: 0.15, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: '15% 85%' }}
          />
          <ellipse cx="18" cy="14" rx="5" ry="7" fill="#1F2937" />
          <ellipse cx="18" cy="14" rx="5" ry="5" fill="#FBBF24" />
          <ellipse cx="18" cy="22" rx="6" ry="4" fill="#1F2937" />
          <circle cx="14" cy="12" r="1.2" fill="#FFFFFF" />
          <circle cx="22" cy="12" r="1.2" fill="#FFFFFF" />
          <path d="M14 18 Q18 20 22 18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </motion.svg>
      </motion.div>
    </motion.div>
  )
}

export const FlyingAnimal = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Burung - 3 ekor dengan warna berbeda */}
      <Bird color="#FBBF24" top="12%" delay={0} duration={11} direction="ltr" />
      <Bird color="#F472B6" top="22%" delay={4} duration={13} direction="rtl" />
      <Bird color="#60A5FA" top="32%" delay={8} duration={10} direction="ltr" />
      <Bird color="#A7F3D0" top="16%" delay={12} duration={14} direction="rtl" />
      <Bird color="#FDE68A" top="28%" delay={16} duration={12} direction="ltr" />

      {/* Kupu-kupu - 2 ekor */}
      <Butterfly color="#FBCFE8" top="14%" delay={2} duration={14} direction="ltr" />
      <Butterfly color="#BAE6FD" top="38%" delay={6} duration={16} direction="rtl" />

      {/* Lebah - 2 ekor */}
      <Bee top="20%" delay={1} duration={9} direction="ltr" />
      <Bee top="42%" delay={10} duration={8} direction="rtl" />
    </div>
  )
}