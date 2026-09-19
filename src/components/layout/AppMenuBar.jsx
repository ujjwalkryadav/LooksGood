import React, { useState, useEffect } from 'react';
import {
  Home,
  Palette,
  Type,
  LayoutGrid,
  Search,
  Sparkles,
  Layers,
  CheckCircle2,
  Image as ImageIcon,
  Sliders,
  Flame,
  Code2,
  Star,
  ArrowRightLeft,
  Sun,
  Wand2,
} from 'lucide-react';
import { STUDIOS_REGISTRY } from '../../studios/registry';
import { useSharedDesign } from '../../context/SharedDesignContext';
import { useToast } from '../../context/ToastContext';

export function AppMenuBar({
  activeStudio, // 'home' | 'colors' | 'typography' | 'allTools'
  activeTab,
  onNavigate,
  onOpenSearch,
}) {
  const { showToast } = useToast();
  const { activePalette } = useSharedDesign();

  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Live Date & Clock
  const [dateTime, setDateTime] = useState({
    dateStr: 'Fri, Sep 13',
    timeStr: '9:41 PM',
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
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

  const colorsStudioMeta = STUDIOS_REGISTRY.find((s) => s.id === 'colors');
  const typoStudioMeta = STUDIOS_REGISTRY.find((s) => s.id === 'typography');

  const getSubToolIcon = (iconName) => {
    switch (iconName) {
      case 'Wand2': return Wand2;
      case 'Sparkles': return Sparkles;
      case 'Layers': return Layers;
      case 'CheckCircle2': return CheckCircle2;
      case 'Image': return ImageIcon;
      case 'Sliders': return Sliders;
      case 'Flame': return Flame;
      case 'Code2': return Code2;
      case 'Search': return Search;
      case 'Star': return Star;
      case 'LayoutGrid': return LayoutGrid;
      case 'ArrowRightLeft': return ArrowRightLeft;
      default: return Sparkles;
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full px-3 sm:px-6 lg:px-8 transition-all duration-300 select-none ${
        isScrolled
          ? 'py-2 backdrop-blur-2xl bg-white/85 border-b border-stone-200/90 shadow-md shadow-stone-900/5'
          : 'py-2.5 sm:py-3 backdrop-blur-xl bg-white/70 border-b border-stone-200/60'
      }`}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand Logo */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <button
            onClick={() => onNavigate('home', null)}
            className="flex items-center space-x-1 text-left group cursor-pointer"
            title="LooksGood Home"
          >
            <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-stone-950 font-display group-hover:opacity-85 transition-opacity">
              LooksGood<span className="text-[#EC4899]">.</span>
            </span>
          </button>
        </div>

        {/* Center / Mobile Nav: 3 Compact Icons on Mobile, Full Pills with Submenus on Desktop */}
        <nav className="flex items-center space-x-0.5 sm:space-x-1 p-0.5 sm:p-1 bg-stone-100/90 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-2xs">
          {/* 1. Home */}
          <button
            onClick={() => onNavigate('home', null)}
            className={`px-2.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeStudio === 'home'
                ? 'bg-white text-stone-900 shadow-xs ring-1 ring-stone-200/60'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
            title="Home"
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            <span className="hidden md:inline">Home</span>
          </button>

          {/* 2. Color Studio (with purple dot) */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredMenu('colors')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <button
              onClick={() => onNavigate('colors', 'custom')}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 sm:space-x-2 cursor-pointer ${
                activeStudio === 'colors'
                  ? 'bg-white text-stone-900 shadow-xs ring-1 ring-purple-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
              title="Color Studio"
            >
              <Palette className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="hidden md:inline">Color Studio</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0" />
            </button>

            {/* Hover Submenu for Desktop */}
            {hoveredMenu === 'colors' && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-white/95 backdrop-blur-2xl border border-stone-200 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in divide-y divide-stone-100 hidden md:block">
                <div className="px-3 py-1.5">
                  <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest block">
                    Color Tools
                  </span>
                </div>
                <div className="py-1 space-y-0.5">
                  {colorsStudioMeta?.tabs.map((tool) => {
                    const Icon = getSubToolIcon(tool.icon);
                    const isCurrent = activeStudio === 'colors' && activeTab === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => {
                          onNavigate('colors', tool.id);
                          setHoveredMenu(null);
                        }}
                        className={`w-full p-2.5 rounded-xl flex items-center space-x-3 text-left transition cursor-pointer ${
                          isCurrent
                            ? 'bg-purple-50 text-purple-900 font-bold border border-purple-200/60'
                            : 'hover:bg-stone-50 text-stone-700 hover:text-stone-950'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold block leading-tight">
                          {tool.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. Typography Studio (with pink dot) */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredMenu('typography')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <button
              onClick={() => onNavigate('typography', 'explorer')}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 sm:space-x-2 cursor-pointer ${
                activeStudio === 'typography'
                  ? 'bg-white text-stone-900 shadow-xs ring-1 ring-pink-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
              title="Typography Studio"
            >
              <Type className="w-4 h-4 text-pink-500 flex-shrink-0" />
              <span className="hidden md:inline">Typography Studio</span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 flex-shrink-0" />
            </button>

            {/* Hover Submenu for Desktop */}
            {hoveredMenu === 'typography' && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-white/95 backdrop-blur-2xl border border-stone-200 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in divide-y divide-stone-100 hidden md:block">
                <div className="px-3 py-1.5">
                  <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest block">
                    Typography Tools
                  </span>
                </div>
                <div className="py-1 space-y-0.5">
                  {typoStudioMeta?.tabs.map((tool) => {
                    const Icon = getSubToolIcon(tool.icon);
                    const isCurrent = activeStudio === 'typography' && activeTab === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => {
                          onNavigate('typography', tool.id);
                          setHoveredMenu(null);
                        }}
                        className={`w-full p-2.5 rounded-xl flex items-center space-x-3 text-left transition cursor-pointer ${
                          isCurrent
                            ? 'bg-pink-50 text-pink-900 font-bold border border-pink-200/60'
                            : 'hover:bg-stone-50 text-stone-700 hover:text-stone-950'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 flex-shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold block leading-tight">
                          {tool.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4. All Tools (Shown on desktop or larger screens) */}
          <button
            onClick={() => onNavigate('allTools', null)}
            className={`hidden md:flex px-3.5 py-1.5 rounded-xl text-xs font-bold transition items-center space-x-1.5 cursor-pointer ${
              activeStudio === 'allTools'
                ? 'bg-white text-stone-900 shadow-xs ring-1 ring-stone-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
            }`}
            title="All Design Tools"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Tools</span>
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 text-stone-700 text-xs font-medium flex-shrink-0">
          {/* Active 4-color dots indicator */}
          <div
            onClick={() => onNavigate('colors', 'palette')}
            className="flex items-center space-x-1 sm:space-x-1.5 cursor-pointer hover:opacity-80 transition"
            title="Active Design Palette"
          >
            {['primary', 'accent', 'secondary', 'text'].map((role, idx) => {
              const defaultColors = ['#7C3AED', '#10B981', '#F59E0B', '#0D0C0B'];
              return (
                <span
                  key={idx}
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-2xs"
                  style={{ backgroundColor: activePalette[role] || defaultColors[idx] }}
                />
              );
            })}
          </div>

          {/* Sun / Theme icon */}
          <button
            onClick={() => showToast('Color profile calibrated for studio accuracy', 'info')}
            className="hidden sm:flex p-1 rounded-lg hover:bg-stone-100 text-stone-600 transition cursor-pointer"
            title="Studio Display Calibrated"
          >
            <Sun className="w-4 h-4" />
          </button>

          {/* Search Button (⌘K) */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-stone-100/90 hover:bg-stone-200/80 border border-stone-200 text-stone-600 transition flex items-center space-x-1.5 cursor-pointer"
            title="Search Tools (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden md:inline text-xs font-medium">Search</span>
            <kbd className="hidden md:inline px-1 py-0.2 text-[9px] font-mono bg-white border border-stone-300 rounded text-stone-500">
              ⌘ K
            </kbd>
          </button>

          {/* Date & Time */}
          {dateTime && (
            <div className="hidden lg:flex items-center space-x-2 font-medium text-stone-700 text-xs">
              <span>{dateTime.dateStr}</span>
              <span className="font-mono font-bold text-stone-900">{dateTime.timeStr}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

