import React from 'react';
import { Palette, Type, Home, LayoutGrid, Search, Sparkles, Monitor, Wifi, Sun } from 'lucide-react';
import { useSharedDesign } from '../../context/SharedDesignContext';
import { useToast } from '../../context/ToastContext';

export function StudioNavBar({
  activeView, // 'home' | 'colors' | 'typography' | 'allTools'
  onChangeView,
  onOpenSearch,
  dateTime,
}) {
  const { showToast } = useToast();
  const { activePrimaryHex, activeFontId } = useSharedDesign();

  return (
    <header className="relative z-40 w-full px-4 sm:px-8 py-3 flex items-center justify-between backdrop-blur-md bg-white/60 border-b border-white/60 shadow-2xs">
      {/* Left: Brand Logo & Studio Switcher Tabs */}
      <div className="flex items-center space-x-6">
        <button
          onClick={() => onChangeView('home')}
          className="flex items-center space-x-2 text-left group"
        >
          <span className="font-extrabold text-xl tracking-tight text-stone-900 font-display group-hover:opacity-80 transition-opacity">
            LooksGood<span className="text-[#EC4899]">.</span>
          </span>
        </button>

        {/* Global Studio Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 p-1 bg-stone-200/60 backdrop-blur-md rounded-2xl border border-stone-300/40">
          <button
            onClick={() => onChangeView('home')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeView === 'home'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/40'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Desktop OS</span>
          </button>

          <button
            onClick={() => onChangeView('colors')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeView === 'colors'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-500/30'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/40'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Colors Studio</span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md ${
                activeView === 'colors' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
              }`}
            >
              7
            </span>
          </button>

          <button
            onClick={() => onChangeView('typography')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeView === 'typography'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm shadow-pink-500/30'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/40'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Typography Studio</span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md ${
                activeView === 'typography' ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-700'
              }`}
            >
              6
            </span>
          </button>

          <button
            onClick={() => onChangeView('allTools')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeView === 'allTools'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/40'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Tools</span>
          </button>
        </nav>
      </div>

      {/* Right: macOS Controls, Live Clock & Active System State */}
      <div className="flex items-center space-x-3.5 text-stone-700 text-xs font-medium">
        {/* Quick Search Shortcut */}
        <button
          onClick={onOpenSearch}
          className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-stone-200 shadow-2xs hover:text-stone-950 transition flex items-center space-x-2 text-stone-600"
          title="Search Tools & Studios (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-purple-600" />
          <span className="hidden sm:inline text-xs font-medium">Search Studios</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-[9px] font-mono bg-stone-100 border border-stone-300 rounded text-stone-500">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={() => showToast('Display profile balanced', 'info')}
          className="p-1.5 rounded-lg hover:bg-white/60 hover:text-stone-950 transition hidden sm:flex"
          title="Display Profile"
        >
          <Sun className="w-4 h-4" />
        </button>

        <button
          onClick={() => showToast('LooksGood Cloud Engine Connected', 'success')}
          className="p-1.5 rounded-lg hover:bg-white/60 hover:text-stone-950 transition hidden sm:flex"
          title="Status Online"
        >
          <Wifi className="w-4 h-4 text-emerald-600" />
        </button>

        <div className="h-3.5 w-px bg-stone-300 mx-1 hidden sm:block" />

        {dateTime && (
          <div className="flex items-center space-x-2 font-medium text-stone-800">
            <span className="hidden sm:inline">{dateTime.dateStr}</span>
            <span className="font-bold font-mono text-xs">{dateTime.timeStr}</span>
          </div>
        )}
      </div>
    </header>
  );
}
