import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Palette, Type, Flame, Image as ImageIcon, CheckCircle2, Info, Sparkles, Home } from 'lucide-react';

const WindowManagerContext = createContext(null);

export const APP_REGISTRY = {
  home: {
    id: 'home',
    title: 'Desktop Home',
    icon: Home,
    dockLabel: 'Home',
    isSystem: true,
  },
  colorStudio: {
    id: 'colorStudio',
    title: 'Color Studio',
    icon: Palette,
    dockLabel: 'Color Studio',
    defaultWidth: 960,
    defaultHeight: 680,
    defaultX: 80,
    defaultY: 60,
    badge: 'Pro Tool',
  },
  typography: {
    id: 'typography',
    title: 'Typography Studio',
    icon: Type,
    dockLabel: 'Typography',
    defaultWidth: 920,
    defaultHeight: 660,
    defaultX: 130,
    defaultY: 90,
    badge: 'Fonts',
  },
  trending: {
    id: 'trending',
    title: 'Trending Palettes',
    icon: Flame,
    dockLabel: 'Trending',
    defaultWidth: 880,
    defaultHeight: 640,
    defaultX: 180,
    defaultY: 120,
    badge: 'Inspiration',
  },
  imagePicker: {
    id: 'imagePicker',
    title: 'Image Color Picker',
    icon: ImageIcon,
    dockLabel: 'Image Picker',
    defaultWidth: 860,
    defaultHeight: 640,
    defaultX: 220,
    defaultY: 140,
    badge: 'Extractor',
  },
  contrast: {
    id: 'contrast',
    title: 'Contrast Checker',
    icon: CheckCircle2,
    dockLabel: 'Contrast',
    defaultWidth: 840,
    defaultHeight: 620,
    defaultX: 160,
    defaultY: 100,
    badge: 'WCAG 2.1',
  },
  systemInfo: {
    id: 'systemInfo',
    title: 'About LooksGood OS',
    icon: Info,
    dockLabel: 'About',
    defaultWidth: 540,
    defaultHeight: 460,
    defaultX: 260,
    defaultY: 160,
    badge: 'System',
  },
};

export function WindowManagerProvider({ children }) {
  // Master Windows State Map
  const [windows, setWindows] = useState({
    colorStudio: {
      id: 'colorStudio',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 80,
      y: 60,
      width: 960,
      height: 680,
      zIndex: 10,
    },
    typography: {
      id: 'typography',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 130,
      y: 90,
      width: 920,
      height: 660,
      zIndex: 10,
    },
    trending: {
      id: 'trending',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 180,
      y: 120,
      width: 880,
      height: 640,
      zIndex: 10,
    },
    imagePicker: {
      id: 'imagePicker',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 220,
      y: 140,
      width: 860,
      height: 640,
      zIndex: 10,
    },
    contrast: {
      id: 'contrast',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 160,
      y: 100,
      width: 840,
      height: 620,
      zIndex: 10,
    },
    systemInfo: {
      id: 'systemInfo',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 260,
      y: 160,
      width: 540,
      height: 460,
      zIndex: 10,
    },
  });

  const [activeAppId, setActiveAppId] = useState('home');
  const [highestZIndex, setHighestZIndex] = useState(20);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [appLaunchParams, setAppLaunchParams] = useState({});

  // Bring window to focus with maximum z-index
  const focusApp = useCallback((appId) => {
    if (appId === 'home') {
      setActiveAppId('home');
      return;
    }

    setHighestZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((curr) => {
        if (!curr[appId]) return curr;
        return {
          ...curr,
          [appId]: {
            ...curr[appId],
            isMinimized: false,
            zIndex: nextZ,
          },
        };
      });
      return nextZ;
    });

    setActiveAppId(appId);
  }, []);

  // Open App Window
  const openApp = useCallback((appId, params = null) => {
    if (appId === 'home') {
      // Minimize or background windows to show desktop
      setActiveAppId('home');
      return;
    }

    if (params) {
      setAppLaunchParams((prev) => ({ ...prev, [appId]: params }));
    }

    setHighestZIndex((prevZ) => {
      const nextZ = prevZ + 1;
      setWindows((curr) => {
        const app = curr[appId];
        if (!app) return curr;

        // Cascade positions slightly if first time open
        let posX = app.x;
        let posY = app.y;
        if (!app.isOpen) {
          const cascadeOffset = (nextZ % 5) * 24;
          posX = Math.min(window.innerWidth - 300, (APP_REGISTRY[appId]?.defaultX || 100) + cascadeOffset);
          posY = Math.min(window.innerHeight - 200, (APP_REGISTRY[appId]?.defaultY || 80) + cascadeOffset);
        }

        return {
          ...curr,
          [appId]: {
            ...app,
            isOpen: true,
            isMinimized: false,
            x: posX,
            y: posY,
            zIndex: nextZ,
          },
        };
      });
      return nextZ;
    });

    setActiveAppId(appId);
  }, []);

  // Close App Window
  const closeApp = useCallback((appId) => {
    setWindows((curr) => {
      if (!curr[appId]) return curr;
      return {
        ...curr,
        [appId]: {
          ...curr[appId],
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
        },
      };
    });

    // Find next highest z-index open window to focus
    setActiveAppId((prevActive) => {
      if (prevActive === appId) {
        return 'home';
      }
      return prevActive;
    });
  }, []);

  // Minimize App Window
  const minimizeApp = useCallback((appId) => {
    setWindows((curr) => {
      if (!curr[appId]) return curr;
      return {
        ...curr,
        [appId]: {
          ...curr[appId],
          isMinimized: true,
        },
      };
    });

    setActiveAppId((prevActive) => {
      if (prevActive === appId) return 'home';
      return prevActive;
    });
  }, []);

  // Maximize / Restore App Window
  const maximizeApp = useCallback((appId) => {
    setWindows((curr) => {
      if (!curr[appId]) return curr;
      return {
        ...curr,
        [appId]: {
          ...curr[appId],
          isMaximized: !curr[appId].isMaximized,
        },
      };
    });
    focusApp(appId);
  }, [focusApp]);

  // Update Window Drag Position with viewport boundary clamping
  const updateWindowPosition = useCallback((appId, x, y) => {
    setWindows((curr) => {
      if (!curr[appId]) return curr;
      // Clamp coordinates so title bar never goes offscreen
      const clampedX = Math.max(10, Math.min(window.innerWidth - 120, x));
      const clampedY = Math.max(48, Math.min(window.innerHeight - 100, y));

      return {
        ...curr,
        [appId]: {
          ...curr[appId],
          x: clampedX,
          y: clampedY,
        },
      };
    });
  }, []);

  // Close / Minimize all to return to clean desktop
  const closeAllApps = useCallback(() => {
    setWindows((curr) => {
      const next = {};
      Object.keys(curr).forEach((k) => {
        next[k] = { ...curr[k], isOpen: false, isMinimized: false };
      });
      return next;
    });
    setActiveAppId('home');
  }, []);

  // Desktop OS Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept when user is typing inside text inputs/textareas
      const tag = e.target.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl) {
        if (e.key === '1') {
          e.preventDefault();
          openApp('home');
        } else if (e.key === '2') {
          e.preventDefault();
          openApp('colorStudio');
        } else if (e.key === '3') {
          e.preventDefault();
          openApp('typography');
        } else if (e.key === '4') {
          e.preventDefault();
          openApp('trending');
        } else if (e.key === '5') {
          e.preventDefault();
          openApp('imagePicker');
        } else if (e.key === 'w' || e.key === 'W') {
          if (activeAppId && activeAppId !== 'home') {
            e.preventDefault();
            closeApp(activeAppId);
          }
        } else if (e.key === 'm' || e.key === 'M') {
          if (activeAppId && activeAppId !== 'home') {
            e.preventDefault();
            minimizeApp(activeAppId);
          }
        }
      } else if (e.key === 'Escape') {
        if (isLauncherOpen) {
          setIsLauncherOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeAppId, isLauncherOpen, openApp, closeApp, minimizeApp]);

  // Ensure both contrast and contrastChecker work
  const handleOpenApp = (appId, params) => {
    const normalizedId = appId === 'contrastChecker' ? 'contrast' : appId;
    openApp(normalizedId, params);
  };

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        activeAppId,
        isLauncherOpen,
        setIsLauncherOpen,
        appLaunchParams,
        openApp: handleOpenApp,
        openWindow: handleOpenApp,
        closeApp,
        closeWindow: closeApp,
        minimizeApp,
        maximizeApp,
        focusApp,
        bringToFront: focusApp,
        updateWindowPosition,
        closeAllApps,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error('useWindowManager must be used within WindowManagerProvider');
  return ctx;
}

export default WindowManagerContext;
