import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AudioProvider } from './context/AudioContext'
import { HomeScreen } from './components/home/HomeScreen'
import { MenuDashboard } from './components/menu/MenuDashboard'
import { ModuleMengenal } from './components/modules/ModuleMengenal'
import { ModuleMenulis } from './components/modules/ModuleMenulis'
import { ModuleTemukan } from './components/modules/ModuleTemukan'
import { ModuleMengetik } from './components/modules/ModuleMengetik'
import { ModuleMelengkapi } from './components/modules/ModuleMelengkapi'

const pageVariants = {
  initial: { x: 30, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: 'spring', damping: 22, stiffness: 120 } },
  exit: { x: -30, opacity: 0, transition: { duration: 0.2 } },
}

export default function App() {
  const [screen, setScreen] = useState('HOME')

  const goTo = (next) => setScreen(next)
  const backToHome = () => setScreen('HOME')
  const backToMenu = () => setScreen('MENU')

  return (
    <AudioProvider>
      <AnimatePresence mode="wait" initial={false}>
        {screen === 'HOME' && (
          <motion.div key="HOME" {...pageVariants.animate} exit={pageVariants.exit}>
            <HomeScreen onStart={() => goTo('MENU')} />
          </motion.div>
        )}
        {screen === 'MENU' && (
          <motion.div key="MENU" {...pageVariants.animate} exit={pageVariants.exit}>
            <MenuDashboard onBackToHome={backToHome} onSelectModule={goTo} />
          </motion.div>
        )}
        {screen === 'MODULE_1' && (
          <motion.div key="MODULE_1" {...pageVariants.animate} exit={pageVariants.exit}>
            <ModuleMengenal onBackToMenu={backToMenu} />
          </motion.div>
        )}
        {screen === 'MODULE_2' && (
          <motion.div key="MODULE_2" {...pageVariants.animate} exit={pageVariants.exit}>
            <ModuleMenulis onBackToMenu={backToMenu} />
          </motion.div>
        )}
        {screen === 'MODULE_3' && (
          <motion.div key="MODULE_3" {...pageVariants.animate} exit={pageVariants.exit}>
            <ModuleTemukan onBackToMenu={backToMenu} />
          </motion.div>
        )}
        {screen === 'MODULE_4' && (
          <motion.div key="MODULE_4" {...pageVariants.animate} exit={pageVariants.exit}>
            <ModuleMengetik onBackToMenu={backToMenu} />
          </motion.div>
        )}
        {screen === 'MODULE_5' && (
          <motion.div key="MODULE_5" {...pageVariants.animate} exit={pageVariants.exit}>
            <ModuleMelengkapi onBackToMenu={backToMenu} />
          </motion.div>
        )}
      </AnimatePresence>
    </AudioProvider>
  )
}
