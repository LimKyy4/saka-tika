// src/context/GameContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GameContext = createContext();

export function GameProvider({ children }) {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [stars, setStars] = useState(() => {
    const stored = localStorage.getItem("saka_tika_stars");
    return stored ? Number(stored) : 0;
  });

  const [moduleProgress, setModuleProgress] = useState(() => {
    const stored = localStorage.getItem("saka_tika_progress");
    return stored ? JSON.parse(stored) : {};
  });

  // Discovered letters (used by MengenalHuruf to give 1-time star reward per letter)
  const [discoveredLetters, setDiscoveredLetters] = useState(() => {
    const stored = localStorage.getItem("saka_tika_discovered");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("saka_tika_stars", stars);
  }, [stars]);

  useEffect(() => {
    localStorage.setItem("saka_tika_progress", JSON.stringify(moduleProgress));
  }, [moduleProgress]);

  useEffect(() => {
    localStorage.setItem("saka_tika_discovered", JSON.stringify(discoveredLetters));
  }, [discoveredLetters]);

  const addStars = useCallback((amount) => {
    setStars((prev) => prev + amount);
  }, []);

  const resetProgress = useCallback(() => {
    setStars(0);
    setModuleProgress({});
    setDiscoveredLetters([]);
    localStorage.setItem("saka_tika_stars", "0");
    localStorage.setItem("saka_tika_progress", "{}");
    localStorage.setItem("saka_tika_discovered", "[]");
  }, []);

  const discoverLetter = useCallback((letter) => {
    setDiscoveredLetters((prev) => {
      if (prev.includes(letter)) return prev;
      return [...prev, letter];
    });
  }, []);

  const isLetterDiscovered = useCallback(
    (letter) => discoveredLetters.includes(letter),
    [discoveredLetters]
  );

  const navigateTo = useCallback((path) => navigate(path), [navigate]);

  const currentModule = location.pathname.split("/")[1] || "home";

  const value = {
    stars,
    addStars,
    resetProgress,
    navigateTo,
    currentModule,
    moduleProgress,
    setModuleProgress,
    discoveredLetters,
    discoverLetter,
    isLetterDiscovered,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => React.useContext(GameContext);
