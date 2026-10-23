import React, { useState } from 'react'
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

/* Wrapper transisi halaman agar properti animasi tidak tersebar sebagai props.
   fit=true dipakai untuk layar yang wajib pas 1 viewport tanpa scrollbar. */
const Screen = ({ children, fit = false }) => (
  <motion.div
    initial={pageVariants.initial}
    animate={pageVariants.animate}
    exit={pageVariants.exit}
    className={fit ? 'h-screen w-full overflow-hidden' : 'min-h-screen'}
  >
    {children}
  </motion.div>
)

export default function App() {
  const [screen, setScreen] = useState('HOME')

  const goTo = (next) => setScreen(next)
  const backToHome = () => setScreen('HOME')
  const backToMenu = () => setScreen('MENU')

  return (
    <AudioProvider>
      <AnimatePresence mode="wait" initial={false}>
        {screen === 'HOME' && (
          <Screen key="HOME" fit>
            <HomeScreen onStart={() => goTo('MENU')} />
          </Screen>
        )}
        {screen === 'MENU' && (
          <Screen key="MENU">
            <MenuDashboard onBackToHome={backToHome} onSelectModule={goTo} />
          </Screen>
        )}
        {screen === 'MODULE_1' && (
          <Screen key="MODULE_1">
            <ModuleMengenal onBackToMenu={backToMenu} />
          </Screen>
        )}
        {screen === 'MODULE_2' && (
          <Screen key="MODULE_2" fit>
            <ModuleMenulis onBackToMenu={backToMenu} />
          </Screen>
        )}
        {screen === 'MODULE_3' && (
          <Screen key="MODULE_3" fit>
            <ModuleTemukan onBackToMenu={backToMenu} />
          </Screen>
        )}
        {screen === 'MODULE_4' && (
          <Screen key="MODULE_4">
            <ModuleMengetik onBackToMenu={backToMenu} />
          </Screen>
        )}
        {screen === 'MODULE_5' && (
          <Screen key="MODULE_5">
            <ModuleMelengkapi onBackToMenu={backToMenu} />
          </Screen>
        )}
      </AnimatePresence>
    </AudioProvider>
  )
}
