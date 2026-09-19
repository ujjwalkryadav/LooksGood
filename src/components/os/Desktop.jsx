import React, { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  Type, 
  Flame, 
  Image as ImageIcon, 
  Eye, 
  ArrowRight,
  Shuffle,
  ChevronRight,
  Layers,
  Zap,
  CheckCircle2,
  Sliders,
  Maximize2
} from 'lucide-react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useSharedDesign } from '../../context/SharedDesignContext';
import { useToast } from '../../context/ToastContext';
import AppWindow from './AppWindow';
import AppIcon from './AppIcon';

// Applications
import ColorStudioApp from '../apps/ColorStudioApp';
import TypographyApp from '../apps/TypographyApp';
import TrendingApp from '../apps/TrendingApp';
import ImagePickerApp from '../apps/ImagePickerApp';
import ContrastCheckerApp from '../apps/ContrastCheckerApp';
import SystemInfoApp from '../apps/SystemInfoApp';

const APP_COMPONENTS = {
  colorStudio: ColorStudioApp,
  typography: TypographyApp,
  trending: TrendingApp,
  imagePicker: ImagePickerApp,
  contrast: ContrastCheckerApp,
  contrastChecker: ContrastCheckerApp,
  systemInfo: SystemInfoApp,
};

export default function Desktop() {
  const { windows, openWindow, activeWindowId } = useWindowManager();
  const { activePrimaryHex, activePalette, sendPaletteToColorStudio, activeFontPairing, setFontPairing } = useSharedDesign();
  const { showToast } = useToast();

  const [activeFeatureHover, setActiveFeatureHover] = useState(null);
  const openAppCount = Object.values(windows).filter(w => w.isOpen && !w.isMinimized).length;

  // Feature Showcase Cards Data
  const toolShowcases = [
    {
      id: 'colorStudio',
      title: 'Color Studio',
      badge: 'Core Engine',
      accent: 'border-purple-200 hover:border-purple-400 bg-gradient-to-b from-white to-purple-50/30',
      tagline: 'Interactive Wheel & 5-Role Intentional Palette System',
      description: 'Dial in precise HSL harmonies, test live UI mockups, or run the 5-step Smart Palette journey.',
      pillText: '5-Role Palette Generator',
      shortcut: '⌘2',
      previewType: 'palette',
    },
    {
      id: 'typography',
      title: 'Typography',
      badge: 'Font Studio',
      accent: 'border-cyan-200 hover:border-cyan-400 bg-gradient-to-b from-white to-cyan-50/30',
      tagline: 'Google Fonts Directory & Scale Testing',
      description: 'Explore 30+ Google fonts, compare personality scores, test pairings and optical line heights.',
      pillText: 'Live Pairing Engine',
      shortcut: '⌘3',
      previewType: 'typography',
    },
    {
      id: 'trending',
      title: 'Trending',
      badge: 'Inspiration',
      accent: 'border-pink-200 hover:border-pink-400 bg-gradient-to-b from-white to-pink-50/30',
      tagline: 'Curated Harmonic Styles & Visual Moods',
      description: 'Browse top editorial palettes (Minimal, Bold, Pastel, Dark) and sync directly into Color Studio.',
      pillText: '1-Click Palette Sync',
      shortcut: '⌘4',
      previewType: 'trending',
    },
    {
      id: 'imagePicker',
      title: 'Image Picker',
      badge: 'Photo Sampler',
      accent: 'border-emerald-200 hover:border-emerald-400 bg-gradient-to-b from-white to-emerald-50/30',
      tagline: '5-Point Real-time Image Color Sampler',
      description: 'Upload photographs or select presets to extract 5 deliberate UI roles directly from photos.',
      pillText: '5-Point Color Sampling',
      shortcut: '⌘5',
      previewType: 'imagePicker',
    },
    {
      id: 'contrast',
      title: 'Contrast WCAG',
      badge: 'Accessibility',
      accent: 'border-amber-200 hover:border-amber-400 bg-gradient-to-b from-white to-amber-50/30',
      tagline: 'WCAG 2.1 AA/AAA Ratio & Auto-Fixer',
      description: 'Real-time luminance scoring with 1-click intelligent color shifting for guaranteed readability.',
      pillText: 'WCAG 2.1 Auto-Fix',
      shortcut: '⌘6',
      previewType: 'contrast',
    },
  ];

  const handleRandomizeDesktopColor = (e) => {
    e.stopPropagation();
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
    showToast('Applied fresh creative harmony to desktop!', 'success');
  };

  return (
    <main className="relative flex-1 w-full h-[calc(100vh-2rem)] overflow-hidden select-none">
      {/* 1. Subtle Dynamic Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[850px] h-[500px] rounded-full blur-3xl opacity-30 animate-pulse transition-all duration-1000"
          style={{ background: 'radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, rgba(236, 72, 153, 0.2) 45%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-[10%] right-[5%] w-[600px] h-[450px] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, rgba(124, 58, 237, 0.15) 55%, transparent 75%)' }}
        />
      </div>

      {/* 2. Interactive OS Desktop Command Center */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-start overflow-y-auto px-4 sm:px-6 pt-4 pb-28 transition-all duration-500 z-0 ${
          openAppCount > 0 ? 'opacity-25 scale-98 pointer-events-none blur-[1px]' : 'opacity-100 scale-100 pointer-events-auto'
        }`}
      >
        <div className="max-w-6xl w-full mx-auto space-y-6 text-center">
          {/* Header OS Pill & Logo */}
          <div className="space-y-2 pt-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/90 shadow-xs text-xs font-semibold text-stone-700">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
              <span>LooksGood Creative OS • Desktop Workspace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-stone-900 font-display">
              LooksGood<span className="text-purple-600">.</span>
            </h1>

            <p className="text-base sm:text-lg font-medium text-stone-500 font-serif italic max-w-lg mx-auto">
              Know what looks good — select a tool below or launch from the dock.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-1 flex-wrap">
            <button
              onClick={() => openWindow('colorStudio')}
              className="px-6 py-3 rounded-2xl bg-stone-950 hover:bg-stone-900 text-white font-semibold text-xs sm:text-sm flex items-center space-x-2.5 shadow-xl shadow-stone-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <AppIcon appId="colorStudio" size="sm" className="w-5 h-5 !rounded-lg" />
              <span>Launch Color Studio</span>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleRandomizeDesktopColor}
              className="px-5 py-3 rounded-2xl bg-white/90 hover:bg-white text-stone-800 font-semibold text-xs sm:text-sm border border-stone-200/90 hover:border-purple-300 flex items-center space-x-2 shadow-xs hover:shadow-md transition-all group"
            >
              <Shuffle className="w-4 h-4 text-purple-600 group-hover:rotate-180 transition-transform duration-500" />
              <span>Shuffle Creative Palette</span>
            </button>
          </div>

          {/* 3. Animated Feature Showcase Grid (Pointing directly to Dock Options) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-2 text-xs font-bold text-stone-500 uppercase tracking-wider font-mono">
              <span>Interactive Tool Radar & Features</span>
              <span className="text-purple-600 font-semibold">Click any card to open tool window</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-left">
              {toolShowcases.map((tool) => {
                const isHovered = activeFeatureHover === tool.id;
                return (
                  <div
                    key={tool.id}
                    onClick={() => openWindow(tool.id)}
                    onMouseEnter={() => setActiveFeatureHover(tool.id)}
                    onMouseLeave={() => setActiveFeatureHover(null)}
                    className={`p-4 rounded-2xl border ${tool.accent} backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden`}
                  >
                    {/* Top Icon & Badge */}
                    <div className="flex items-center justify-between">
                      <AppIcon appId={tool.id} size="md" className="group-hover:scale-110 transition-transform" />
                      <div className="flex flex-col items-end">
                        <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-stone-100 text-stone-600 rounded-md border border-stone-200">
                          {tool.shortcut}
                        </span>
                      </div>
                    </div>

                    {/* Tool Information */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-stone-900 group-hover:text-purple-700 transition-colors">
                          {tool.title}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-[11px] text-stone-500 font-medium leading-relaxed line-clamp-2">
                        {tool.description}
                      </p>
                    </div>

                    {/* Mini Dynamic Preview Module */}
                    <div className="pt-2 border-t border-stone-200/60">
                      {tool.previewType === 'palette' && (
                        <div className="flex items-center space-x-1">
                          {activePalette.map((p, i) => (
                            <div
                              key={i}
                              className="flex-1 h-5 rounded-md shadow-2xs transition-transform group-hover:scale-105"
                              style={{ backgroundColor: p.hex }}
                              title={`${p.role}: ${p.hex}`}
                            />
                          ))}
                        </div>
                      )}

                      {tool.previewType === 'typography' && (
                        <div className="bg-white/80 p-1.5 rounded-lg border border-stone-200/70 text-center">
                          <span className="text-xs font-serif font-black text-stone-800 block">Aa Font Pair</span>
                          <span className="text-[9px] text-stone-400 font-mono">Playfair + Inter</span>
                        </div>
                      )}

                      {tool.previewType === 'trending' && (
                        <div className="flex items-center justify-between text-[10px] font-mono text-pink-700 bg-pink-50/80 px-2 py-1 rounded-lg border border-pink-200">
                          <span>Styles: Minimal, Neon, Pastel</span>
                        </div>
                      )}

                      {tool.previewType === 'imagePicker' && (
                        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-800 bg-emerald-50/80 px-2 py-1 rounded-lg border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>5-Pin Sampler</span>
                        </div>
                      )}

                      {tool.previewType === 'contrast' && (
                        <div className="flex items-center justify-between text-[10px] font-mono text-amber-900 bg-amber-50/80 px-2 py-1 rounded-lg border border-amber-200">
                          <span className="font-bold">WCAG AA 4.5:1</span>
                          <span className="text-[9px] bg-amber-200/70 px-1 rounded">Pass</span>
                        </div>
                      )}
                    </div>

                    {/* Animated Pulsing Pointer Ray */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center pointer-events-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Animated Connecting Visual Beams pointing down to Bottom Dock */}
          <div className="hidden sm:flex flex-col items-center justify-center space-y-1 pt-1 opacity-70">
            <span className="text-[11px] font-mono font-bold text-stone-400">
              ▼ LAUNCH TOOLS FROM RADAR OR DOCK BELOW ▼
            </span>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" />
          </div>
        </div>
      </div>

      {/* 4. Open Application Windows Container */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {Object.entries(windows).map(([appId, winState]) => {
          if (!winState.isOpen) return null;
          const AppComponent = APP_COMPONENTS[appId];
          if (!AppComponent) return null;

          return (
            <div key={appId} className="pointer-events-auto">
              <AppWindow appId={appId}>
                <AppComponent />
              </AppWindow>
            </div>
          );
        })}
      </div>
    </main>
  );
}
