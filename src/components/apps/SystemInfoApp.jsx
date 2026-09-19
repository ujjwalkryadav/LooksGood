import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Cpu, 
  Keyboard, 
  Palette, 
  Type, 
  Flame, 
  Image as ImageIcon, 
  Eye, 
  Command, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { useWindowManager } from '../../context/WindowManagerContext';

export default function SystemInfoApp() {
  const { openWindow } = useWindowManager();

  const shortcuts = [
    { key: '⌘ / Ctrl + 1', desc: 'Return to Minimal Desktop Home' },
    { key: '⌘ / Ctrl + 2', desc: 'Launch Color Studio application' },
    { key: '⌘ / Ctrl + 3', desc: 'Launch Typography Studio application' },
    { key: '⌘ / Ctrl + 4', desc: 'Launch Trending Palettes application' },
    { key: '⌘ / Ctrl + 5', desc: 'Launch Image Color Picker application' },
    { key: '⌘ / Ctrl + W', desc: 'Close currently focused window' },
    { key: '⌘ / Ctrl + M', desc: 'Minimize currently focused window' },
    { key: 'Esc', desc: 'Dismiss application launcher / modals' },
  ];

  const apps = [
    { id: 'colorStudio', name: 'Color Studio', icon: Palette, color: 'text-purple-600 bg-purple-100', desc: 'Interactive color wheel, harmonies, 5-role palette generation, and guided decision journey' },
    { id: 'typography', name: 'Typography Studio', icon: Type, color: 'text-blue-600 bg-blue-100', desc: 'Curated Google fonts, readability scores, personality tags, pairings, and scale testing' },
    { id: 'trending', name: 'Trending Palettes', icon: Flame, color: 'text-pink-600 bg-pink-100', desc: 'Curated aesthetic color harmonies with direct sync into Color Studio' },
    { id: 'imagePicker', name: 'Image Color Picker', icon: ImageIcon, color: 'text-emerald-600 bg-emerald-100', desc: '5-point interactive image sampling with automatic UI role mapping' },
    { id: 'contrastChecker', name: 'Contrast Checker', icon: Eye, color: 'text-amber-600 bg-amber-100', desc: 'WCAG 2.1 AA/AAA compliance analyzer with 1-click automatic contrast enhancement' },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-stone-50/50 text-stone-800 p-6 space-y-8 select-text">
      {/* Hero Header */}
      <div className="flex items-center space-x-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 flex-shrink-0">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-display">LooksGood OS</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full border border-purple-200">
              v2.4 Desktop Edition
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Desktop-first creative design operating system for deliberate, beautiful visual decisions.
          </p>
        </div>
      </div>

      {/* Core OS Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900">Multi-Window Environment</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Every design tool runs as an independent application window with real drag, minimize, maximize, and focus layering.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900">Shared Design Context</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Changes in Trending, Image Picker, or Color Studio seamlessly propagate across all open tools in real time.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900">Intentional Systems</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            No random 20-color blobs. Every generated system assigns purposeful roles: Primary, Secondary, Accent, Background, and Text.
          </p>
        </div>
      </div>

      {/* Registered Applications */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>Installed Creative Applications</span>
          </h3>
          <span className="text-xs text-stone-400 font-medium">5 System Apps Loaded</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {apps.map(app => {
            const Icon = app.icon;
            return (
              <div 
                key={app.id} 
                className="flex items-start justify-between p-3.5 rounded-xl border border-stone-150 hover:border-purple-200 hover:bg-purple-50/20 transition group"
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-9 h-9 rounded-xl ${app.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 group-hover:text-purple-700 transition">
                      {app.name}
                    </h4>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">
                      {app.desc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => openWindow(app.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition opacity-0 group-hover:opacity-100 flex-shrink-0 ml-2"
                >
                  Launch
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyboard Shortcuts Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2">
          <Keyboard className="w-4 h-4 text-purple-600" />
          <span>Global OS Keyboard Shortcuts</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
              <span className="text-xs text-stone-600">{sc.desc}</span>
              <kbd className="px-2 py-0.5 text-xs font-mono font-semibold bg-white border border-stone-300 rounded shadow-2xs text-stone-700">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* System Footer Note */}
      <div className="text-center text-xs text-stone-400 pb-2">
        LooksGood Creative Operating System • Know what looks good.
      </div>
    </div>
  );
}
