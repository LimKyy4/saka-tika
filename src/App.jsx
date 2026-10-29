// src/App.jsx
// Main Application Routing, Audio & Game Providers for SAKA TIKA: Mengenal Huruf.
// STRICT ZERO EMOJIS POLICY: Only lucide-react icons or custom vector graphics.

import React, { useState, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { GameProvider } from "./context/GameContext.jsx";
import { AudioProvider } from "./context/AudioContext.jsx";
import TopControlBar from "./components/layout/TopControlBar.jsx";
import PageTransition from "./components/layout/PageTransition.jsx";
import SplashScreen from "./components/layout/SplashScreen.jsx";

// Lazy loaded module views
const HomeView           = React.lazy(() => import("./views/HomeView.jsx"));
const MainMenuView       = React.lazy(() => import("./views/MainMenuView.jsx"));
const MengenalHurufView  = React.lazy(() => import("./views/modules/MengenalHurufView.jsx"));
const MenulisHurufView   = React.lazy(() => import("./views/modules/MenulisHurufView.jsx"));
const MelengkapiKataView = React.lazy(() => import("./views/modules/MelengkapiKataView.jsx"));
const TemukanHurufView   = React.lazy(() => import("./views/modules/TemukanHurufView.jsx"));
const MengetikHurufView  = React.lazy(() => import("./views/modules/MengetikHurufView.jsx"));

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem("sakatika_intro_shown");
    } catch {
      return false;
    }
  });

  return (
    <Router>
      <GameProvider>
        <AudioProvider>
          <div className="w-screen h-screen max-h-screen overflow-hidden flex flex-col justify-between select-none relative bg-[#FFFDF9]">
            {/* Fullscreen Video Splash Screen (Runs once per session) */}
            <AnimatePresence>
              {showSplash && (
                <SplashScreen onFinish={() => setShowSplash(false)} />
              )}
            </AnimatePresence>

            <TopControlBar />
            <Suspense
              fallback={
                <div className="flex items-center justify-center flex-1">
                  <span className="font-display text-lg text-[#1B4965]">Memuat...</span>
                </div>
              }
            >
              <PageTransition>
                <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-between">
                  <Routes>
                    <Route path="/"                  element={<HomeView />} />
                    <Route path="/menu"               element={<MainMenuView />} />
                    <Route path="/mengenal-huruf"     element={<MengenalHurufView />} />
                    <Route path="/menulis-huruf"      element={<MenulisHurufView />} />
                    <Route path="/melengkapi-kata"    element={<MelengkapiKataView />} />
                    <Route path="/temukan-huruf"      element={<TemukanHurufView />} />
                    <Route path="/mengetik-huruf"     element={<MengetikHurufView />} />
                    <Route path="/mengetik"           element={<MengetikHurufView />} />
                    <Route path="*"                   element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </PageTransition>
            </Suspense>
          </div>
        </AudioProvider>
      </GameProvider>
    </Router>
  );
}
