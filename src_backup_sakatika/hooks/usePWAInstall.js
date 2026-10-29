// src/hooks/usePWAInstall.js
import { useState, useEffect, useCallback } from "react";

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  useEffect(() => {
    const beforeHandler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    const installedHandler = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };
    window.addEventListener("beforeinstallprompt", beforeHandler);
    window.addEventListener("appinstalled", installedHandler);
    // Detect if already running as standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", beforeHandler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const triggerInstall = useCallback(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
    } else {
      setShowManualModal(true);
    }
  }, [deferredPrompt]);

  return {
    isInstallable,
    isInstalled,
    triggerInstall,
    showManualModal,
    setShowManualModal,
  };
}
