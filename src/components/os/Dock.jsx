import React, { useState } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import AppIcon from './AppIcon';
import { LayoutGrid } from 'lucide-react';

export function Dock({ onOpenMore }) {
  const {
    windows,
    activeAppId,
    openApp,
    minimizeApp,
    focusApp,
    isLauncherOpen,
    setIsLauncherOpen,
  } = useWindowManager();

  const [hoveredAppId, setHoveredAppId] = useState(null);

  const dockApps = [
    {
      id: 'home',
      label: 'Home',
      tagline: 'Minimal Workspace',
      shortcut: '⌘1',
    },
    {
      id: 'colorStudio',
      label: 'Color Studio',
      tagline: 'Wheel, Harmonies & Roles',
      shortcut: '⌘2',
    },
    {
      id: 'typography',
      label: 'Typography',
      tagline: 'Google Fonts & Pairings',
      shortcut: '⌘3',
    },
    {
      id: 'trending',
      label: 'Trending',
      tagline: 'Curated Inspirations',
      shortcut: '⌘4',
    },
    {
      id: 'imagePicker',
      label: 'Image Picker',
      tagline: '5-Pin Color Sampler',
      shortcut: '⌘5',
    },
    {
      id: 'contrast',
      label: 'Contrast WCAG',
      tagline: 'Accessibility & Auto-Fix',
      shortcut: '⌘6',
    },
  ];

  const handleAppClick = (appId) => {
    if (appId === 'home') {
      // Minimize all or focus home
      Object.keys(windows).forEach((id) => {
        if (windows[id]?.isOpen && !windows[id]?.isMinimized) {
          minimizeApp(id);
        }
      });
      return;
    }

    const win = windows[appId];
    if (!win || !win.isOpen) {
      openApp(appId);
    } else if (win.isMinimized) {
      openApp(appId);
    } else if (activeAppId === appId) {
      minimizeApp(appId);
    } else {
      focusApp(appId);
    }
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 pointer-events-auto select-none">
      <div
        className="flex items-end gap-2 sm:gap-3 px-4 py-2.5 bg-white/80 backdrop-blur-2xl border border-stone-200/90 rounded-3xl shadow-2xl shadow-stone-900/10 transition-all duration-300"
        onMouseLeave={() => setHoveredAppId(null)}
      >
        {dockApps.map((app) => {
          const win = windows[app.id];
          const isOpen = app.id === 'home' ? false : win?.isOpen;
          const isMinimized = win?.isMinimized;
          const isActive = activeAppId === app.id && !isMinimized;
          const isHovered = hoveredAppId === app.id;

          return (
            <div
              key={app.id}
              className="relative flex flex-col items-center group/icon"
              onMouseEnter={() => setHoveredAppId(app.id)}
            >
              {/* Floating Tooltip Card */}
              {isHovered && (
                <div className="absolute -top-14 px-3.5 py-1.5 bg-stone-950/95 text-white rounded-2xl shadow-2xl backdrop-blur-md whitespace-nowrap animate-fade-in pointer-events-none border border-white/15 flex flex-col items-center z-50">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white font-sans">{app.label}</span>
                    <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950/80 px-1.5 py-0.2 rounded border border-purple-800/60">
                      {app.shortcut}
                    </span>
                  </div>
                  <span className="text-[9px] text-stone-400 font-medium">{app.tagline}</span>
                </div>
              )}

              {/* 3D App Icon Launcher */}
              <button
                onClick={() => handleAppClick(app.id)}
                className={`relative transition-all duration-200 flex flex-col items-center group active:scale-90 ${
                  isHovered ? '-translate-y-2.5 scale-115' : 'hover:-translate-y-1'
                }`}
                title={app.label}
              >
                <AppIcon appId={app.id} size="md" />

                {/* Micro Label Below Icon on Large Screens */}
                <span className={`text-[10px] font-bold tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-purple-700' : 'text-stone-600'
                }`}>
                  {app.label}
                </span>
              </button>

              {/* Running / Focused Status LED */}
              <div className="h-1 flex items-center justify-center mt-0.5">
                {isOpen && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-purple-600 scale-125 shadow-sm shadow-purple-500'
                        : isMinimized
                        ? 'bg-amber-500 opacity-80'
                        : 'bg-stone-400'
                    }`}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Elegant Divider */}
        <div className="w-px h-10 bg-stone-200/80 mx-1 self-center" />

        {/* More / Launcher Button */}
        <div
          className="relative flex flex-col items-center group/icon"
          onMouseEnter={() => setHoveredAppId('launcher')}
        >
          {hoveredAppId === 'launcher' && (
            <div className="absolute -top-14 px-3 py-1.5 bg-stone-950/95 text-white text-xs font-bold rounded-2xl shadow-2xl backdrop-blur-md whitespace-nowrap animate-fade-in pointer-events-none border border-white/15 z-50 text-center">
              <span className="text-white block font-sans">App Launcher</span>
              <span className="text-[9px] text-stone-400 font-medium">All Design Utilities</span>
            </div>
          )}

          <button
            onClick={() => {
              if (onOpenMore) onOpenMore();
              else setIsLauncherOpen(!isLauncherOpen);
            }}
            className={`transition-all duration-200 flex flex-col items-center group active:scale-90 ${
              hoveredAppId === 'launcher' ? '-translate-y-2.5 scale-115' : 'hover:-translate-y-1'
            }`}
          >
            <AppIcon appId="launcher" size="md" />
            <span className="text-[10px] font-bold tracking-tight text-stone-600 mt-1">
              Apps
            </span>
          </button>

          <div className="h-1 flex items-center justify-center mt-0.5">
            {isLauncherOpen && <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shadow-sm" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dock;
