import { motion } from 'framer-motion'

export const MascotHero = () => {
  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden">
      {/* Hiasan latar belakang lembut */}
      <div className="absolute top-[-12%] left-[-12%] w-64 h-64 bg-amber-100 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-12%] right-[-12%] w-80 h-80 bg-pink-100 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div
        className="relative z-10 flex items-center gap-8"
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Saka - anak laki-laki */}
        <motion.div
          className="relative"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
        >
          <svg width="160" height="200" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sakaShirt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            <rect x="55" y="112" width="50" height="28" fill="url(#sakaShirt)" stroke="#1D4ED8" strokeWidth="4" strokeLinejoin="round" rx="10" />
            <rect x="52" y="106" width="56" height="14" fill="url(#sakaShirt)" stroke="#1D4ED8" strokeWidth="4" strokeLinejoin="round" rx="7" />
            <path d="M55 126 L40 132 L40 152" fill="none" stroke="#FDE68A" strokeWidth="10" strokeLinecap="round" />
            <path d="M105 126 L120 132 L120 152" fill="none" stroke="#FDE68A" strokeWidth="10" strokeLinecap="round" />
            <path d="M65 180 L65 198" fill="none" stroke="#B45309" strokeWidth="10" strokeLinecap="round" />
            <path d="M95 180 L95 198" fill="none" stroke="#B45309" strokeWidth="10" strokeLinecap="round" />
            <circle cx="77.5" cy="78" r="26" fill="#FDE68A" stroke="#B45309" strokeWidth="4" strokeLinejoin="round" />
            <path d="M55 80 Q77.5 56 100 80" fill="none" stroke="#451A03" strokeWidth="10" strokeLinecap="round" />
            <circle cx="66" cy="75" r="4" fill="#1F2937" />
            <circle cx="89" cy="75" r="4" fill="#1F2937" />
            <path d="M70 88 Q77.5 94 85 88" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-700 bg-white/90 px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">Saka</span>
        </motion.div>

        {/* Tika - anak perempuan */}
        <motion.div
          className="relative"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <svg width="160" height="200" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tikaDress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            <rect x="55" y="112" width="50" height="28" fill="url(#tikaDress)" stroke="#DB2777" strokeWidth="4" strokeLinejoin="round" rx="10" />
            <rect x="52" y="106" width="56" height="14" fill="url(#tikaDress)" stroke="#DB2777" strokeWidth="4" strokeLinejoin="round" rx="7" />
            <path d="M55 126 L40 132 L40 152" fill="none" stroke="#FBCFE8" strokeWidth="10" strokeLinecap="round" />
            <path d="M105 126 L120 132 L120 152" fill="none" stroke="#FBCFE8" strokeWidth="10" strokeLinecap="round" />
            <path d="M65 180 L65 198" fill="none" stroke="#BE185D" strokeWidth="10" strokeLinecap="round" />
            <path d="M95 180 L95 198" fill="none" stroke="#BE185D" strokeWidth="10" strokeLinecap="round" />
            <circle cx="77.5" cy="78" r="26" fill="#FDE68A" stroke="#B45309" strokeWidth="4" strokeLinejoin="round" />
            <path d="M55 80 Q77.5 56 100 80" fill="none" stroke="#451A03" strokeWidth="10" strokeLinecap="round" />
            <path d="M70 70 Q77.5 62 85 70 L85 74 Q77.5 68 70 74 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
            <circle cx="77.5" cy="72" r="3" fill="#DB2777" />
            <circle cx="66" cy="75" r="4" fill="#1F2937" />
            <circle cx="89" cy="75" r="4" fill="#1F2937" />
            <path d="M70 88 Q77.5 94 85 88" fill="none" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-700 bg-white/90 px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">Tika</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
