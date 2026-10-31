// src/context/GameContext.jsx
// SAKA TIKA Centralized Game State & Carousel Active Module Memory
// STRICT ZERO EMOJIS POLICY: Only custom vector graphics or lucide-react.

import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GameContext = createContext();

// Route-to-module index lookup table for instant synchronization
export const MODULE_ROUTE_INDEX_MAP = {
  "/mengenal-huruf": 0,
  "/menulis-huruf": 1,
  "/temukan-huruf": 2,
  "/mengetik-huruf": 3,
  "/mengetik": 3,
  "/melengkapi-kata": 4,
};

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

  // Centralized carousel active module index (persisted per session)
  const [activeCarouselIndex, setActiveCarouselIndexState] = useState(() => {
    try {
      const initialRoute = window?.location?.pathname;
      if (initialRoute && typeof MODULE_ROUTE_INDEX_MAP[initialRoute] === "number") {
        return MODULE_ROUTE_INDEX_MAP[initialRoute];
      }
      const stored = sessionStorage.getItem("saka_tika_carousel_idx");
      const parsed = Number(stored);
      return Number.isInteger(parsed) && parsed >= 0 && parsed <= 4 ? parsed : 0;
    } catch {
      return 0;
    }
  });

  // Safe setter with range validation (0 to 4) and sessionStorage synchronization
  const setActiveCarouselIndex = useCallback((index) => {
    const num = Number(index);
    const validIdx = Number.isFinite(num) ? Math.max(0, Math.min(4, Math.floor(num))) : 0;
    setActiveCarouselIndexState(validIdx);
    try {
      sessionStorage.setItem("saka_tika_carousel_idx", String(validIdx));
    } catch {
      // Ignore sessionStorage errors
    }
  }, []);

  // Automatically remember the active module when navigating into any module route
  useEffect(() => {
    const routeIndex = MODULE_ROUTE_INDEX_MAP[location.pathname];
    if (typeof routeIndex === "number") {
      setActiveCarouselIndexState(routeIndex);
      try {
        sessionStorage.setItem("saka_tika_carousel_idx", String(routeIndex));
      } catch {
        // Ignore sessionStorage errors
      }
    }
  }, [location.pathname]);

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
    setActiveCarouselIndex(0);
    localStorage.setItem("saka_tika_stars", "0");
    localStorage.setItem("saka_tika_progress", "{}");
    localStorage.setItem("saka_tika_discovered", "[]");
  }, [setActiveCarouselIndex]);

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
    activeCarouselIndex,
    setActiveCarouselIndex,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => React.useContext(GameContext);
