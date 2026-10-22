/**
 * Karakter Maskot Saka & Tika - Vector SVG super imut dan animatif.
 * Saka: anak laki-laki berbaju biru dengan topi kancip.
 * Tika: anak perempuan berbaju pink dengan pita di rambut.
 * Keduanya dilengkapi animasi floating, kedipan mata, dan balon ucapan komik.
 * Visual sudah diupdate: mata yang lebih ekspresif dengan pantulan cahaya,
 * rona pipi merah pastel, dan tangan yang melambaikan salam hangat.
 */

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const float = {
  y: [0, -12, 0],
  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
}

const blink = {
  scaleY: [1, 0.1, 1],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut', times: [0, 0.5, 1] },
}

/* Balon ucapan gaya komik anak */
const SpeechBubble = ({ text, position = 'top', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="relative inline-block"
    >
      <div className="relative max-w-xs rounded-3xl border-4 border-amber-300 bg-amber-50 p-4 text-center shadow-[0_8px_0_0_rgba(245,158,11,0.2)] md:p-6">
        <p className="text-base font-bold leading-relaxed text-amber-900 md:text-lg">
          {text}
        </p>

        {/* Ekor balon ucapan */}
        <span
          aria-hidden="true"
          className={`absolute left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-amber-300 bg-amber-50 ${
            position === 'top'
              ? '-bottom-2 border-b-4 border-r-4'
              : '-top-2 border-l-4 border-t-4'
          }`}
        />
      </div>
    </motion.div>
  )
}

export const MascotSakaTika = ({
  speechText,
  speechPosition = 'top',
  speechDelay = 0,
  compact = false,
}) => {
  return (
    <motion.div
      className={`relative flex w-full items-center justify-center ${
        compact ? 'py-2' : 'overflow-hidden'
      }`}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Hiasan latar belakang lembut */}
      {!compact && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-amber-100 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-pink-100 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </>
      )}

      <motion.div
        className={`relative z-10 flex items-center ${
          compact ? 'gap-3' : 'gap-10 md:gap-16'
        }`}
      >
        {/* Saka - anak laki-laki */}
        <motion.div className="relative" animate={float}>
          <svg width="170" height="210" viewBox="0 0 170 210" fill="none" xmlns="http://www.w3.org/2000/svg" className={compact ? 'h-[92px] w-auto' : undefined}>
            <defs>
              <linearGradient id="sakaShirtMascot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            {/* Topi kancip */}
            <path d="M 60 90 L 110 90 L 105 85 Q 85 60 85 60 Q 65 60 65 85 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="4" strokeLinejoin="round" />
            <path d="M 55 85 Q 85 75 115 85" fill="none" stroke="#B45309" strokeWidth="4" strokeLinecap="round" />
            {/* Rambut */}
            <path d="M 65 90 Q 85 70 105 90" fill="none" stroke="#451A03" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Wajah */}
            <circle cx="85" cy="120" r="28" fill="#FDE68A" stroke="#B45309" strokeWidth="4" strokeLinejoin="round" />
            {/* Mata Saka dengan pantalan cahaya dan rona pipi */}
            <motion.circle cx="72" cy="112" r="6" fill="#1F2937" animate={blink} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
            <motion.circle cx="98" cy="112" r="6" fill="#1F2937" animate={blink} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
            <circle cx="72" cy="110" r="3" fill="#FBBF24" />
            <circle cx="98" cy="110" r="3" fill="#FBBF24" />
            {/* Pupil dengan pantulan */}
            <path d="M 75 128 Q 82 128 85 135 L 88 138 Q 85 138 82 132 Z" fill="#1F2937" />
            <path d="M 93 128 Q 102 128 105 135 L 108 138 Q 105 138 102 132 Z" fill="#1F2937" />
            {/* Lid mata menutup/buat kedipan */}
            <motion.path
              d="M 72 115 Q 78 112 85 115 Q 88 118 85 125"
              fill="#FDE68A"
              animate={blink}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
            <motion.path
              d="M 98 115 Q 104 112 105 118 Q 102 122 105 125"
              fill="#FDE68A"
              animate={blink}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
            {/* Pipi rona pastel */}
            <circle cx="66" cy="122" r="6" fill="#F472B6" opacity="0.9" />
            <circle cx="104" cy="122" r="6" fill="#F472B6" opacity="0.9" />
            {/* Mata (kedip) - already included above */}
            {/* Baju biru */}
            <rect x="60" y="140" width="50" height="30" fill="url(#sakaShirtMascot)" stroke="#1D4ED8" strokeWidth="4" strokeLinejoin="round" rx="10" />
            <rect x="56" y="134" width="58" height="14" fill="url(#sakaShirtMascot)" stroke="#1D4ED8" strokeWidth="4" strokeLinejoin="round" rx="7" />
            {/* Tangan - melambaikan salam hangat */}
            <path d="M 60 150 L 42 158 L 42 182" fill="none" stroke="#FDE68A" strokeWidth="10" strokeLinecap="round" />
            <path d="M 110 150 L 128 158 L 128 182" fill="none" stroke="#FDE68A" strokeWidth="10" strokeLinecap="round" />
            {/* Kaki */}
            <path d="M 70 180 L 70 198" fill="none" stroke="#B45309" strokeWidth="10" strokeLinecap="round" />
            <path d="M 100 180 L 100 198" fill="none" stroke="#B45309" strokeWidth="10" strokeLinecap="round" />
          </svg>
          <span className={`absolute -top-10 left-1/2 -translate-x-1/2 text-[11px] font-black text-slate-700 bg-white/95 px-3 py-1 rounded-full border-2 border-slate-200 shadow-lg ${compact ? 'hidden' : ''}`}>Saka</span>
        </motion.div>

        {speechText && !compact && <SpeechBubble text={speechText} position={speechPosition} delay={speechDelay} />}

        {/* Tika - anak perempuan */}
        <motion.div className="relative" animate={{ ...float, transition: { ...float.transition, delay: 0.5 } }}>
          <svg width="170" height="210" viewBox="0 0 170 210" fill="none" xmlns="http://www.w3.org/2000/svg" className={compact ? 'h-[92px] w-auto' : undefined}>
            <defs>
              <linearGradient id="tikaDressMascot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            {/* Pita di rambut */}
            <path d="M 65 90 Q 85 75 105 90 L 100 100 Q 85 95 70 100 Z" fill="#DB2777" stroke="#BE185D" strokeWidth="3" strokeLinejoin="round" />
            {/* Wajah */}
            <circle cx="85" cy="125" r="28" fill="#FDE68A" stroke="#B45309" strokeWidth="4" strokeLinejoin="round" />
            {/* Mata Tika dengan pantalan cahaya dan rona pipi */}
            <motion.circle cx="72" cy="117" r="6" fill="#1F2937" animate={blink} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
            <motion.circle cx="98" cy="117" r="6" fill="#1F2937" animate={blink} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
            <circle cx="72" cy="115" r="3" fill="#FBBF24" />
            <circle cx="98" cy="115" r="3" fill="#FBBF24" />
            {/* Pupil dengan pantulan */}
            <path d="M 75 125 Q 82 125 85 132 L 88 135 Q 85 135 82 132 Z" fill="#1F2937" />
            <path d="M 93 125 Q 102 125 105 132 L 108 135 Q 105 135 102 132 Z" fill="#1F2937" />
            {/* Lid mata menutup/buat kedipan */}
            <motion.path
              d="M 72 117 Q 78 114 85 117 Q 88 120 85 127"
              fill="#FDE68A"
              animate={blink}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
            <motion.path
              d="M 98 117 Q 104 114 105 120 Q 102 124 105 127"
              fill="#FDE68A"
              animate={blink}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
            {/* Pipi rona pastel */}
            <circle cx="66" cy="127" r="6" fill="#F472B6" opacity="0.9" />
            <circle cx="104" cy="127" r="6" fill="#F472B6" opacity="0.9" />
            {/* Mata (kedip) - already included above */}
            {/* Baju pink */}
            <rect x="60" y="145" width="50" height="32" fill="url(#tikaDressMascot)" stroke="#DB2777" strokeWidth="4" strokeLinejoin="round" rx="10" />
            <rect x="56" y="139" width="58" height="14" fill="url(#tikaDressMascot)" stroke="#DB2777" strokeWidth="4" strokeLinejoin="round" rx="7" />
            {/* Tangan - melambaikan salam hangat */}
            <path d="M 60 155 L 42 163 L 42 187" fill="none" stroke="#FBCFE8" strokeWidth="10" strokeLinecap="round" />
            <path d="M 110 155 L 128 163 L 128 187" fill="none" stroke="#FBCFE8" strokeWidth="10" strokeLinecap="round" />
            {/* Kaki */}
            <path d="M 70 185 L 70 203" fill="none" stroke="#BE185D" strokeWidth="10" strokeLinecap="round" />
            <path d="M 100 185 L 100 203" fill="none" stroke="#BE185D" strokeWidth="10" strokeLinecap="round" />
          </svg>
          <span className={`absolute -top-10 left-1/2 -translate-x-1/2 text-[11px] font-black text-slate-700 bg-white/95 px-3 py-1 rounded-full border-2 border-slate-200 shadow-lg ${compact ? 'hidden' : ''}`}>Tika</span>
        </motion.div>

        {!compact && <Sparkles size={28} strokeWidth={2.5} className="text-amber-500 animate-pulse" />}
      </motion.div>
    </motion.div>
  )
}