import { motion } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'

const VARIANTS = {
  primary:
    'bg-amber-400 text-slate-900 border-amber-300 shadow-[0_8px_0_0_rgba(245,158,11,0.4)] hover:bg-amber-300 hover:shadow-[0_4px_0_0_rgba(245,158,11,0.4)] hover:-translate-y-1',
  secondary:
    'bg-white text-slate-800 border-slate-200 shadow-[0_8px_0_0_rgba(148,163,184,0.25)] hover:bg-slate-50 hover:shadow-[0_4px_0_0_rgba(148,163,184,0.25)] hover:-translate-y-1',
  pastel:
    'bg-pink-100 text-pink-800 border-pink-200 shadow-[0_8px_0_0_rgba(236,72,153,0.2)] hover:bg-pink-200 hover:shadow-[0_4px_0_0_rgba(236,72,153,0.2)] hover:-translate-y-1',
}

const SIZES = {
  small: 'px-5 py-2.5 text-sm',
  medium: 'px-8 py-3 text-base',
  large: 'px-10 py-4 text-lg',
  xlarge: 'px-12 py-5 text-xl',
}

export const CustomButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'large',
  className = '',
  animate = null,
  ...rest
}) => {
  const { playSfx } = useAudio()

  const handleClick = (event) => {
    playSfx('click')
    onClick?.(event)
  }

  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      animate={animate}
      className={`rounded-3xl border-4 font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 focus:outline-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

/* Tombol utama dengan efek pulsing/bounce yang memikat perhatian anak */
export const PulseButton = ({ children, onClick, className = '', ...rest }) => {
  const { playSfx } = useAudio()

  const handleClick = (event) => {
    playSfx('click')
    onClick?.(event)
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: [1, 1.05, 1],
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      }}
      className={`rounded-3xl border-4 font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 focus:outline-none bg-amber-300 text-slate-900 border-amber-200 shadow-[0_10px_0_0_rgba(245,158,11,0.35)] hover:bg-amber-200 hover:shadow-[0_6px_0_0_rgba(245,158,11,0.35)] ${className}`}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
