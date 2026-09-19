import React, { useState, useEffect, useRef } from 'react';
import { useWindowManager, APP_REGISTRY } from '../../context/WindowManagerContext';
import { useSharedDesign } from '../../context/SharedDesignContext';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  Shuffle,
  LayoutGrid,
  Command,
  Info,
  Layers,
  ChevronDown,
  X,
  Palette,
} from 'lucide-react';

export function SystemHeader() {
  const {
    activeAppId,
    openApp,
    closeAllApps,
    isLauncherOpen,
    setIsLauncherOpen,
  } = useWindowManager();

  const { activePrimaryHex, sendPaletteToColorStudio } = useSharedDesign();
  const { showToast } = useToast();

  const [timeString, setTimeString] = useState('');
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const activeAppInfo = APP_REGISTRY[activeAppId] || APP_REGISTRY.home;

  // Real-time digital system clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      setTimeString(now.toLocaleDateString('en-US', options));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsSystemMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const surprisePalettes = [
    ['#7C3AED', '#1E1B4B', '#EC4899', '#FAF9F6', '#0D0C0B'],
    ['#E24A2B', '#2D2422', '#F59E0B', '#FAF9F6', '#0D0C0B'],
    ['#2563EB', '#0F172A', '#38BDF8', '#F8FAFC', '#0F172A'],
    ['#059669', '#064E3B', '#10B981', '#F0FDF4', '#022C22'],
  ];

  const handleQuickPalette = () => {
    const pal = surprisePalettes[Math.floor(Math.random() * surprisePalettes.length)];
    sendPaletteToColorStudio(pal, 'Quick Surprise Generator');
    openApp('colorStudio');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-10 px-4 bg-white/80 backdrop-blur-xl border-b border-[#E8E5DF] flex items-center justify-between text-xs select-none z-50 shadow-subtle">
      {/* Left Area: Logo & Active App Context Menu */}
      <div className="flex items-center gap-3">
        {/* LooksGood Apple-Style Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsSystemMenuOpen(!isSystemMenuOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#FAF9F6] text-[#0D0C0B] font-black text-sm tracking-tight transition-colors group"
          >
            <div className="w-5 h-5 rounded-md bg-[#0D0C0B] flex items-center justify-center text-white text-[10px] font-black group-hover:bg-[#7C3AED] transition-colors">
              LG
            </div>
            <span>LooksGood<span className="text-brand-purple">.</span></span>
          </button>

          {/* System Dropdown */}
          {isSystemMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-[#E8E5DF] rounded-2xl shadow-card p-1.5 space-y-1 animate-fade-in z-50">
              <button
                onClick={() => {
                  openApp('systemInfo');
                  setIsSystemMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#0D0C0B] hover:bg-[#FAF9F6] flex items-center gap-2"
              >
                <Info className="w-3.5 h-3.5 text-brand-purple" />
                <span>About LooksGood OS</span>
              </button>

              <button
                onClick={() => {
                  setIsLauncherOpen(true);
                  setIsSystemMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#0D0C0B] hover:bg-[#FAF9F6] flex items-center gap-2"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-brand-purple" />
                <span>App Launcher</span>
              </button>

              <div className="border-t border-[#E8E5DF] my-1" />

              <button
                onClick={() => {
                  closeAllApps();
                  setIsSystemMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <X className="w-3.5 h-3.5" />
                <span>Show Desktop (Close Windows)</span>
              </button>
            </div>
          )}
        </div>

        {/* Separator */}
        <span className="text-[#E8E5DF] font-light">|</span>

        {/* Current Active Window Name */}
        <div className="flex items-center gap-2 font-bold text-[#0D0C0B]">
          <span className="px-2 py-0.5 bg-[#FAF9F6] border border-[#E8E5DF] rounded-lg text-[11px] text-[#57534E]">
            {activeAppInfo.title}
          </span>
        </div>
      </div>

      {/* Center: System Clock */}
      <div className="hidden md:flex items-center gap-2 text-xs font-mono font-bold text-[#78716C]">
        <span>{timeString}</span>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2">
        {/* Quick Magic Palette Generator */}
        <button
          onClick={handleQuickPalette}
          title="Instant Surprise Palette Generator"
          className="px-3 py-1 bg-white hover:bg-[#FAF9F6] border border-[#E8E5DF] hover:border-[#7C3AED] rounded-xl text-[11px] font-mono font-bold text-[#0D0C0B] transition-all flex items-center gap-1.5 shadow-subtle hover:scale-105"
        >
          <Shuffle className="w-3.5 h-3.5 text-brand-purple" />
          <span className="hidden sm:inline">Quick Palette</span>
        </button>

        {/* Active Primary Color Swatch */}
        <div
          onClick={() => openApp('colorStudio')}
          title={`Active Brand Hue: ${activePrimaryHex}`}
          className="w-6 h-6 rounded-lg border border-[#E8E5DF] cursor-pointer shadow-subtle hover:scale-110 transition-transform flex items-center justify-center p-0.5"
        >
          <div className="w-full h-full rounded-[6px]" style={{ backgroundColor: activePrimaryHex }} />
        </div>

        {/* App Launcher Toggle */}
        <button
          onClick={() => setIsLauncherOpen(!isLauncherOpen)}
          title="Toggle App Launcher"
          className="p-1.5 rounded-lg hover:bg-[#FAF9F6] text-[#78716C] hover:text-[#0D0C0B] transition-colors"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

export default SystemHeader;
