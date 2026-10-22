import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useAudio } from '../../hooks/useAudio'

export const AudioController = ({ className = '', size = 'md' }) => {
  const { isMuted, toggleMute } = useAudio()
  const { playSfx } = useAudio()

  const sizes = { sm: 'p-2', md: 'p-3', lg: 'p-4' }
  const iconSize = { sm: 16, md: 20, lg: 24 }

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      onClick={(event) => {
        playSfx('click')
        toggleMute()
      }}
      className={`rounded-2xl border shadow-sm flex items-center justify-center transition-all duration-200 ${sizes[size]} ${isMuted ? 'bg-rose-100 border-rose-200 text-rose-600 hover:bg-rose-200' : 'bg-sky-100 border-sky-200 text-sky-600 hover:bg-sky-200'} ${className}`}
      aria-label={isMuted ? 'Aktifkan suara BGM' : 'Matikan suara BGM'}
      title={isMuted ? 'Aktifkan suara BGM' : 'Matikan suara BGM'}
    >
      <span className="sr-only">{isMuted ? 'Suara mati' : 'Suara nyala'}</span>
      {isMuted ? <VolumeX size={iconSize[size]} strokeWidth={2.5} /> : <Volume2 size={iconSize[size]} strokeWidth={2.5} />}
    </motion.button>
  )
}
