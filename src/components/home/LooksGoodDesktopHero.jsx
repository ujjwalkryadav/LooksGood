import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sun, 
  Monitor, 
  Wifi, 
  ArrowRight, 
  Palette, 
  Home, 
  Sparkles,
  LayoutGrid,
  X,
  Minus,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sliders,
  CheckCircle2,
  HelpCircle,
  Command,
  Layers,
  Flame,
  Type
} from 'lucide-react';
import FlowingWaveBackground from './FlowingWaveBackground';
import { StudioNavBar } from '../layout/StudioNavBar';
import { useSharedDesign } from '../../context/SharedDesignContext';
import { useToast } from '../../context/ToastContext';

// Studio Hubs
import { ColorStudioHub } from '../../studios/color/ColorStudioHub';
import { TypographyStudioHub } from '../../studios/typography/TypographyStudioHub';
import { AllToolsDirectory } from '../../studios/allTools/AllToolsDirectory';
import { STUDIOS_REGISTRY } from '../../studios/registry';

// Sub Apps for Standalone Floating Windows
import { GuidedPaletteCreator } from '../color/GuidedPaletteCreator';

export default function LooksGoodDesktopHero() {
  const { activePalette, activePrimaryHex, sendPaletteToColorStudio } = useSharedDesign();
  const { showToast } = useToast();

  // Active View Mode: 'home' (Desktop OS) | 'colors' | 'typography' | 'allTools'
  const [activeView, setActiveView] = useState('home');
  const [initialStudioTab, setInitialStudioTab] = useState(null);

  // Active Windows State Map (For Desktop OS Mode)
  // appId: { isOpen: boolean, isMinimized: boolean, isMaximized: boolean, isClosing: boolean, zIndex: number }
  const [openWindows, setOpenWindows] = useState({});
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [hoveredDock, setHoveredDock] = useState(null);
  const [isClosingAll, setIsClosingAll] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Live Date & Clock
  const [dateTime, setDateTime] = useState({
    dateStr: 'Tue 17 Sep',
    timeStr: '9:41 AM',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      setDateTime({ dateStr, timeStr });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Window Actions with Fluid macOS Transitions
  const openAppWindow = (appId, tabId = null) => {
    setActiveView('home');
    setOpenWindows((prev) => ({
      ...prev,
      [appId]: {
        isOpen: true,
        isMinimized: false,
        isMaximized: prev[appId]?.isMaximized || false,
        isClosing: false,
        zIndex: Date.now(),
        tabId: tabId || prev[appId]?.tabId,
      },
    }));
    setActiveWindowId(appId);
  };

  const closeAppWindow = (appId) => {
    setOpenWindows((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        isClosing: true,
      },
    }));

    setTimeout(() => {
      setOpenWindows((prev) => ({
        ...prev,
        [appId]: {
          ...prev[appId],
          isOpen: false,
          isClosing: false,
        },
      }));
      if (activeWindowId === appId) {
        const remaining = Object.entries(openWindows).filter(
          ([k, v]) => k !== appId && v.isOpen && !v.isMinimized
        );
        setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1][0] : null);
      }
    }, 220);
  };

  const minimizeAppWindow = (appId) => {
    setOpenWindows((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        isMinimized: true,
      },
    }));
    if (activeWindowId === appId) {
      setActiveWindowId(null);
    }
  };

  const restoreAppWindow = (appId) => {
    setOpenWindows((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        isOpen: true,
        isMinimized: false,
        zIndex: Date.now(),
      },
    }));
    setActiveWindowId(appId);
  };

  const toggleMaximizeWindow = (appId) => {
    setOpenWindows((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        isMaximized: !prev[appId]?.isMaximized,
        zIndex: Date.now(),
      },
    }));
    setActiveWindowId(appId);
  };

  const focusWindow = (appId) => {
    setOpenWindows((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        zIndex: Date.now(),
      },
    }));
    setActiveWindowId(appId);
  };

  // Toggle app from dock icon click
  const handleDockAppClick = (appId) => {
    if (appId === 'home') {
      setActiveView('home');
      setOpenWindows((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (next[k]?.isOpen) {
            next[k].isMinimized = true;
          }
        });
        return next;
      });
      setActiveWindowId(null);
      showToast('Returned to Desktop Home', 'info');
      return;
    }

    if (appId === 'colorStudio') {
      openAppWindow('colorStudio');
      return;
    }

    if (appId === 'typography') {
      openAppWindow('typography');
      return;
    }

    const current = openWindows[appId];
    if (!current || !current.isOpen) {
      openAppWindow(appId);
    } else if (current.isMinimized) {
      restoreAppWindow(appId);
    } else if (activeWindowId === appId) {
      minimizeAppWindow(appId);
    } else {
      focusWindow(appId);
    }
  };

  // Sweep Close All Windows
  const handleCloseAllWindows = () => {
    setIsClosingAll(true);
    showToast('Sweeping and closing all active windows...', 'info');
    setTimeout(() => {
      setOpenWindows({});
      setActiveWindowId(null);
      setIsClosingAll(false);
    }, 320);
  };

  const handleNavigateStudio = (studioId, tabId = null) => {
    setActiveView(studioId);
    setInitialStudioTab(tabId);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        else if (isMoreOpen) setIsMoreOpen(false);
        else if (activeWindowId) closeAppWindow(activeWindowId);
      } else if (e.key === '1') {
        setActiveView('home');
      } else if (e.key === '2') {
        setActiveView('colors');
      } else if (e.key === '3') {
        setActiveView('typography');
      } else if (e.key === '4') {
        setActiveView('allTools');
      } else if (e.code === 'Space') {
        e.preventDefault();
        const presets = [
          ['#7C3AED', '#A78BFA', '#F43F5E', '#FAF9F6', '#1E1B4B'],
          ['#2563EB', '#60A5FA', '#F59E0B', '#F8FAFC', '#0F172A'],
          ['#059669', '#34D399', '#EC4899', '#F0FDF4', '#064E3B'],
          ['#DC2626', '#F87171', '#38BDF8', '#FEF2F2', '#450A0A'],
          ['#D97706', '#FBBF24', '#8B5CF6', '#FFFBEB', '#451A03'],
        ];
        const picked = presets[Math.floor(Math.random() * presets.length)];
        sendPaletteToColorStudio({
          primary: picked[0],
          secondary: picked[1],
          accent: picked[2],
          background: picked[3],
          text: picked[4],
        });
        showToast('Shuffled creative harmonic palette!', 'success');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWindowId, isSearchOpen, isMoreOpen, openWindows]);

  const activeAppCount = Object.values(openWindows).filter((w) => w.isOpen && !w.isMinimized).length;

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-[#F7F7FA] text-stone-900 font-sans select-none flex flex-col justify-between">
      {/* 1. Ultra-Smooth 3D Gradient Waves Background */}
      <FlowingWaveBackground />

      {/* 2. Top Global Studio Navigation Bar */}
      <StudioNavBar
        activeView={activeView}
        onChangeView={(view) => {
          setActiveView(view);
          if (view !== 'home') setActiveWindowId(null);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        dateTime={dateTime}
      />

      {/* 3. Main Workspace Area */}
      <main className="relative flex-1 w-full flex items-start justify-center p-4 sm:p-6 z-10 overflow-y-auto">
        {/* VIEW A: DEDICATED COLORS STUDIO */}
        {activeView === 'colors' && (
          <div className="w-full animate-fade-in pb-16">
            <ColorStudioHub initialTab={initialStudioTab || 'palette'} />
          </div>
        )}

        {/* VIEW B: DEDICATED TYPOGRAPHY STUDIO */}
        {activeView === 'typography' && (
          <div className="w-full animate-fade-in pb-16">
            <TypographyStudioHub initialTab={initialStudioTab || 'explorer'} />
          </div>
        )}

        {/* VIEW C: ALL TOOLS DIRECTORY */}
        {activeView === 'allTools' && (
          <div className="w-full animate-fade-in pb-16">
            <AllToolsDirectory
              onSelectStudioTab={(studioId, tabId) => {
                handleNavigateStudio(studioId, tabId);
              }}
            />
          </div>
        )}

        {/* VIEW D: DESKTOP OS MODE */}
        {activeView === 'home' && (
          <div className="relative w-full h-[calc(100vh-8.5rem)] flex items-center justify-center">
            {/* Top-Left Floating Quote Glass Card */}
            <div className="hidden lg:flex absolute top-4 left-6 w-64 p-5 rounded-3xl bg-white/65 backdrop-blur-xl border border-white/80 shadow-lg shadow-purple-950/5 flex-col space-y-2 text-stone-700 pointer-events-auto">
              <span className="text-3xl font-serif text-stone-400 leading-none">“</span>
              <p className="text-xs font-semibold leading-relaxed text-stone-800 font-serif">
                Better design starts with better choices.
              </p>
              <span className="text-[11px] text-stone-400 font-medium font-mono pt-1">
                — LooksGood Studios
              </span>
            </div>

            {/* Left Handwritten Editorial Annotation */}
            <div className="hidden xl:block absolute left-[12%] top-[30%] -rotate-12 pointer-events-none opacity-85 select-none">
              <span className="font-serif italic text-lg sm:text-xl text-stone-400 tracking-wide block font-normal drop-shadow-xs">
                Design Smarter
              </span>
              <span className="font-serif italic text-lg sm:text-xl text-stone-400 tracking-wide block font-normal drop-shadow-xs -mt-1 pl-4">
                Everyday
              </span>
              <div className="w-24 h-1 border-b-2 border-stone-300 rounded-full mt-1 ml-3 transform -rotate-1" />
            </div>

            {/* Right Handwritten Editorial Annotation with Curved Arrow */}
            <div className="hidden xl:block absolute right-[10%] top-[16%] rotate-6 pointer-events-none opacity-85 select-none text-right">
              <span className="font-serif italic text-lg sm:text-xl text-stone-400 tracking-wide block font-normal drop-shadow-xs">
                Dedicated
              </span>
              <span className="font-serif italic text-lg sm:text-xl text-stone-400 tracking-wide block font-normal drop-shadow-xs -mt-1">
                Design
              </span>
              <span className="font-serif italic text-lg sm:text-xl text-stone-400 tracking-wide block font-normal drop-shadow-xs -mt-1 text-purple-600 font-bold">
                Studios
              </span>
              <svg className="w-10 h-10 text-stone-300 ml-auto mt-1 transform rotate-12" viewBox="0 0 40 40" fill="none">
                <path d="M10 5C25 8 32 20 28 32M28 32L22 28M28 32L34 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Center Hero Section */}
            <div 
              className={`max-w-2xl w-full text-center space-y-7 transition-all duration-500 ${
                activeAppCount > 0 ? 'opacity-20 scale-95 pointer-events-none blur-[1px]' : 'opacity-100 scale-100'
              }`}
            >
              {/* Main Title & Subtitle */}
              <div className="space-y-3">
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-stone-900 font-display">
                  LooksGood<span className="text-[#EC4899]">.</span>
                </h1>
                <p className="text-xl sm:text-2xl font-medium text-stone-700 tracking-tight font-sans">
                  Know what looks good.
                </p>
              </div>

              {/* Primary Action Buttons: Studios Launcher */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => handleNavigateStudio('colors')}
                  className="px-6 sm:px-8 py-4 rounded-full bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-bold text-sm sm:text-base flex items-center space-x-3 shadow-xl shadow-indigo-600/30 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group"
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <Palette className="w-4 h-4 text-white" />
                  </div>
                  <span className="tracking-tight">Open Colors Studio</span>
                  <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => handleNavigateStudio('typography')}
                  className="px-6 sm:px-8 py-4 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-900 font-bold text-sm sm:text-base flex items-center space-x-3 shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group"
                >
                  <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                    <Type className="w-4 h-4" />
                  </div>
                  <span className="tracking-tight">Open Typography Studio</span>
                  <ArrowRight className="w-5 h-5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Sub-text Category Links */}
              <div className="pt-2 flex items-center justify-center space-x-3 text-xs font-mono font-bold uppercase tracking-widest text-stone-500">
                <button onClick={() => handleNavigateStudio('colors')} className="hover:text-purple-600 transition-colors">
                  COLORS STUDIO
                </button>
                <span className="text-stone-300">•</span>
                <button onClick={() => handleNavigateStudio('typography')} className="hover:text-pink-600 transition-colors">
                  TYPOGRAPHY STUDIO
                </button>
                <span className="text-stone-300">•</span>
                <button onClick={() => handleNavigateStudio('allTools')} className="hover:text-stone-900 transition-colors">
                  ALL TOOLS DIRECTORY
                </button>
              </div>
            </div>

            {/* Bottom-Left Floating "Trending Now" Widget */}
            <div 
              onClick={() => handleNavigateStudio('colors', 'trending')}
              className="hidden md:flex absolute bottom-4 left-6 p-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-lg shadow-purple-950/5 items-center space-x-3.5 cursor-pointer hover:scale-105 hover:bg-white/90 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-inner flex-shrink-0 bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-0.5">
                <div className="w-full h-full rounded-[10px] bg-gradient-to-tr from-indigo-900 via-purple-700 to-pink-500 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="text-left pr-2">
                <h4 className="text-xs font-bold text-stone-900 group-hover:text-purple-600 transition-colors">
                  Trending Palettes
                </h4>
                <span className="text-[10px] text-stone-500 font-medium block">
                  100+ Designer Schemes
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Bottom-Right Minimal Slogan */}
            <div className="hidden md:block absolute bottom-6 right-6 text-right space-y-1 select-none pointer-events-none opacity-60">
              <span className="text-[11px] font-mono font-bold tracking-widest text-stone-500 block uppercase">
                DEDICATED STUDIOS.
              </span>
              <span className="text-[11px] font-mono font-bold tracking-widest text-stone-500 block uppercase">
                INFINITE CREATIVITY.
              </span>
              <div className="w-10 h-0.5 bg-stone-400 ml-auto rounded-full mt-1" />
            </div>

            {/* Active Application Windows Layer with macOS Physics */}
            {Object.entries(openWindows).map(([appId, winState]) => {
              if (!winState.isOpen || winState.isMinimized) return null;

              const isClosing = winState.isClosing;

              return (
                <div
                  key={appId}
                  onClick={() => focusWindow(appId)}
                  style={{ zIndex: winState.zIndex || 50 }}
                  className={`absolute transition-all duration-300 ${
                    isClosingAll
                      ? 'animate-mac-sweep pointer-events-none'
                      : isClosing
                      ? 'animate-mac-close pointer-events-none'
                      : 'animate-mac-open'
                  } ${
                    winState.isMaximized
                      ? 'inset-3 w-[calc(100vw-1.5rem)] h-[calc(100vh-1.5rem)]'
                      : 'w-[94vw] max-w-6xl h-[82vh] max-h-[760px]'
                  }`}
                >
                  {/* Frosted Window Container */}
                  <div 
                    className={`w-full h-full flex flex-col bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-2xl transition-all duration-200 overflow-hidden ${
                      activeWindowId === appId
                        ? 'ring-2 ring-purple-500/30 shadow-purple-950/25'
                        : 'opacity-95 shadow-stone-900/10'
                    }`}
                  >
                    {/* Window Title Bar */}
                    <div 
                      onDoubleClick={() => toggleMaximizeWindow(appId)}
                      className="h-11 px-4 flex items-center justify-between border-b border-stone-200/80 bg-stone-50/80 backdrop-blur-md select-none cursor-default"
                    >
                      {/* Traffic Light Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            closeAppWindow(appId);
                          }}
                          className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition flex items-center justify-center text-[#5F0000] group/btn"
                          title="Close (Esc)"
                        >
                          <X className="w-2 h-2 opacity-0 group-hover/btn:opacity-100" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            minimizeAppWindow(appId);
                          }}
                          className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:opacity-80 transition flex items-center justify-center text-[#5F3000] group/btn"
                          title="Minimize"
                        >
                          <Minus className="w-2 h-2 opacity-0 group-hover/btn:opacity-100" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMaximizeWindow(appId);
                          }}
                          className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:opacity-80 transition flex items-center justify-center text-[#004500] group/btn"
                          title={winState.isMaximized ? 'Restore' : 'Maximize'}
                        >
                          {winState.isMaximized ? (
                            <Minimize2 className="w-2 h-2 opacity-0 group-hover/btn:opacity-100" />
                          ) : (
                            <Maximize2 className="w-2 h-2 opacity-0 group-hover/btn:opacity-100" />
                          )}
                        </button>
                      </div>

                      {/* Window Title */}
                      <div className="text-xs font-bold text-stone-800 font-sans tracking-tight">
                        {appId === 'colorStudio' && 'Colors Studio Workspace (7 Unified Tools)'}
                        {appId === 'typography' && 'Typography Studio Workspace (6 Unified Tools)'}
                        {appId === 'trending' && 'Trending Palettes Gallery'}
                        {appId === 'imagePicker' && 'Image Color Extractor'}
                        {appId === 'contrast' && 'WCAG 2.1 Contrast Checker'}
                        {appId === 'guided' && 'Smart Guided Creator'}
                      </div>

                      {/* Right Status Indicator */}
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                        <span>STUDIO ACTIVE</span>
                      </div>
                    </div>

                    {/* Window Body Canvas */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF9F6]/60 select-text">
                      {appId === 'colorStudio' && (
                        <ColorStudioHub initialTab={winState.tabId || 'palette'} />
                      )}
                      {appId === 'typography' && (
                        <TypographyStudioHub initialTab={winState.tabId || 'explorer'} />
                      )}
                      {appId === 'trending' && (
                        <ColorStudioHub initialTab="trending" />
                      )}
                      {appId === 'imagePicker' && (
                        <ColorStudioHub initialTab="imagePicker" />
                      )}
                      {appId === 'contrast' && (
                        <ColorStudioHub initialTab="contrast" />
                      )}
                      {appId === 'guided' && (
                        <GuidedPaletteCreator
                          onPaletteGenerated={() => {
                            openAppWindow('colorStudio');
                          }}
                          onOpenContrast={() => openAppWindow('contrast')}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 5. Bottom macOS Frosted Glass Dock (Visible in Desktop Mode) */}
      {activeView === 'home' && (
        <footer className="relative z-30 pb-5 px-4 flex justify-center pointer-events-auto">
          <div className="px-4 py-2.5 bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[28px] shadow-2xl shadow-purple-950/10 flex items-center space-x-3 sm:space-x-4 transition-all duration-300">
            {/* 1. Home */}
            <button
              onClick={() => handleDockAppClick('home')}
              onMouseEnter={() => setHoveredDock('home')}
              onMouseLeave={() => setHoveredDock(null)}
              className="flex flex-col items-center group transition-transform hover:-translate-y-2 active:scale-90 relative"
            >
              {hoveredDock === 'home' && (
                <div className="absolute -top-9 px-2.5 py-0.5 bg-white text-stone-900 text-[11px] font-bold rounded-lg shadow-md border border-stone-200 pointer-events-none whitespace-nowrap animate-fade-in font-sans">
                  Home OS (1)
                </div>
              )}
              <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex items-center justify-center text-stone-800 group-hover:shadow-md transition">
                <Home className="w-6 h-6 fill-stone-800" />
              </div>
              <span className="text-[10px] font-bold text-stone-600 mt-1">Home</span>
            </button>

            {/* 2. Colors Studio */}
            <button
              onClick={() => handleDockAppClick('colorStudio')}
              onMouseEnter={() => setHoveredDock('colorStudio')}
              onMouseLeave={() => setHoveredDock(null)}
              className="flex flex-col items-center group transition-transform hover:-translate-y-2 active:scale-90 relative"
            >
              {hoveredDock === 'colorStudio' && (
                <div className="absolute -top-9 px-3 py-1 bg-white text-stone-900 text-xs font-bold rounded-xl shadow-lg border border-stone-200 pointer-events-none whitespace-nowrap animate-fade-in font-sans">
                  Colors Studio (2)
                </div>
              )}

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6366F1] via-[#7C3AED] to-[#9333EA] shadow-md shadow-purple-500/30 flex items-center justify-center text-white group-hover:scale-105 transition">
                <Palette className="w-6 h-6" />
              </div>

              <span className="text-[10px] font-bold text-[#6366F1] mt-1">Colors</span>
              <span
                className={`w-1.5 h-1.5 rounded-full mt-0.5 transition-all ${
                  openWindows['colorStudio']?.isOpen && !openWindows['colorStudio']?.isMinimized
                    ? 'bg-[#6366F1] scale-125 shadow-xs'
                    : 'bg-stone-300 opacity-60'
                }`}
              />
            </button>

            {/* 3. Typography Studio */}
            <button
              onClick={() => handleDockAppClick('typography')}
              onMouseEnter={() => setHoveredDock('typography')}
              onMouseLeave={() => setHoveredDock(null)}
              className="flex flex-col items-center group transition-transform hover:-translate-y-2 active:scale-90 relative"
            >
              {hoveredDock === 'typography' && (
                <div className="absolute -top-9 px-2.5 py-0.5 bg-white text-stone-900 text-[11px] font-bold rounded-lg shadow-md border border-stone-200 pointer-events-none whitespace-nowrap animate-fade-in font-sans">
                  Typography Studio (3)
                </div>
              )}
              <div className="w-12 h-12 rounded-2xl bg-[#FCE7F3] border border-pink-200 shadow-sm flex items-center justify-center text-[#DB2777] font-serif font-black text-xl group-hover:shadow-md transition">
                <span className="tracking-tighter">T<span className="text-base">T</span></span>
              </div>
              <span className="text-[10px] font-bold text-stone-600 mt-1">Typo</span>
              <span
                className={`w-1.5 h-1.5 rounded-full mt-0.5 transition-all ${
                  openWindows['typography']?.isOpen && !openWindows['typography']?.isMinimized
                    ? 'bg-pink-500 scale-125 shadow-xs'
                    : 'bg-transparent'
                }`}
              />
            </button>

            {/* 4. All Tools Directory */}
            <button
              onClick={() => handleNavigateStudio('allTools')}
              onMouseEnter={() => setHoveredDock('more')}
              onMouseLeave={() => setHoveredDock(null)}
              className="flex flex-col items-center group transition-transform hover:-translate-y-2 active:scale-90 relative"
            >
              {hoveredDock === 'more' && (
                <div className="absolute -top-9 px-2.5 py-0.5 bg-white text-stone-900 text-[11px] font-bold rounded-lg shadow-md border border-stone-200 pointer-events-none whitespace-nowrap animate-fade-in font-sans">
                  All Tools Directory (4)
                </div>
              )}
              <div className="w-12 h-12 rounded-2xl bg-white/80 border border-stone-200/80 shadow-sm flex items-center justify-center text-stone-700 group-hover:shadow-md transition">
                <LayoutGrid className="w-6 h-6 text-stone-700" />
              </div>
              <span className="text-[10px] font-bold text-stone-600 mt-1">Directory</span>
            </button>

            {/* 5. Sweep Close All Windows */}
            <button
              onClick={handleCloseAllWindows}
              onMouseEnter={() => setHoveredDock('closeAll')}
              onMouseLeave={() => setHoveredDock(null)}
              className="flex flex-col items-center group transition-transform hover:-translate-y-2 active:scale-90 relative"
              title="Close All Workspaces"
            >
              {hoveredDock === 'closeAll' && (
                <div className="absolute -top-9 px-2.5 py-0.5 bg-stone-900 text-white text-[11px] font-bold rounded-lg shadow-md pointer-events-none whitespace-nowrap animate-fade-in font-sans">
                  Close All Windows
                </div>
              )}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-stone-100 to-stone-200 border border-stone-300/80 shadow-sm flex items-center justify-center text-stone-600 group-hover:text-purple-600 group-hover:border-purple-300 transition">
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              </div>
              <span className="text-[10px] font-bold text-stone-600 mt-1">Sweep</span>
            </button>
          </div>
        </footer>
      )}

      {/* 6. Global Quick Command / Search Palette (⌘K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xl flex items-start justify-center pt-24 p-4 animate-fade-in select-none">
          <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl p-4 space-y-3 animate-window-open">
            <div className="flex items-center space-x-3 px-3 py-2 border-b border-stone-200">
              <Search className="w-5 h-5 text-purple-600" />
              <input
                type="text"
                autoFocus
                placeholder="Search tools across all studios (Colors, Typography, Scales)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium focus:outline-none text-stone-900 placeholder-stone-400"
              />
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-stone-100 border border-stone-300 rounded text-stone-500">
                ESC
              </kbd>
            </div>

            <div className="space-y-1 max-h-72 overflow-y-auto">
              {[
                { studio: 'colors', tab: 'palette', title: 'Colors: Palette & Harmony', desc: 'Harmonic color wheel & 5-role system', key: '2' },
                { studio: 'colors', tab: 'shades', title: 'Colors: Shades & Tints Scale', desc: '50-950 Tailwind shade scale generator', key: 'S' },
                { studio: 'colors', tab: 'contrast', title: 'Colors: WCAG Contrast Checker', desc: 'Realtime ratio scoring & 1-click Auto-Fix', key: 'C' },
                { studio: 'colors', tab: 'imagePicker', title: 'Colors: Image Color Extractor', desc: '5-pin real-time photo extractor', key: 'I' },
                { studio: 'colors', tab: 'gradient', title: 'Colors: Gradient Studio', desc: 'Linear & radial CSS gradient generator', key: 'G' },
                { studio: 'colors', tab: 'trending', title: 'Colors: Trending Palettes', desc: '100+ curated design inspirations', key: 'T' },
                { studio: 'typography', tab: 'explorer', title: 'Typography: Font Explorer', desc: '30+ Google fonts directory & search', key: '3' },
                { studio: 'typography', tab: 'pairings', title: 'Typography: Pairing Engine', desc: 'Curated heading + body pairings', key: 'P' },
                { studio: 'typography', tab: 'typeScale', title: 'Typography: Modular Scale', desc: 'Golden ratio & typography hierarchy', key: 'M' },
                { studio: 'typography', tab: 'playground', title: 'Typography: UI Playground', desc: 'Live landing & editorial tester', key: 'L' },
                { studio: 'typography', tab: 'reverse', title: 'Typography: Reverse Finder', desc: 'Find heading pairs for body font', key: 'R' },
                { studio: 'allTools', tab: null, title: 'Directory: All Studios & Roadmap', desc: 'Browse all active & upcoming tools', key: '4' },
              ]
                .filter((item) =>
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.desc.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.studio === 'allTools') {
                        setActiveView('allTools');
                      } else {
                        handleNavigateStudio(item.studio, item.tab);
                      }
                      setIsSearchOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-purple-50 hover:text-purple-900 flex items-center justify-between text-left transition group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 group-hover:text-purple-700">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium">{item.desc}</p>
                    </div>
                    <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-white border border-stone-200 rounded text-stone-500">
                      {item.key}
                    </kbd>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
