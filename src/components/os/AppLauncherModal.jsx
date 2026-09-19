import React from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { X, Sparkles, Command } from 'lucide-react';
import AppIcon from './AppIcon';

export function AppLauncherModal() {
  const { isLauncherOpen, setIsLauncherOpen, openApp } = useWindowManager();

  if (!isLauncherOpen) return null;

  const appList = [
    {
      id: 'colorStudio',
      title: 'Color Studio',
      desc: 'Interactive Color Wheel, 5-Role Harmonies & Guided Creator',
      shortcut: '⌘2',
    },
    {
      id: 'typography',
      title: 'Typography Studio',
      desc: '30+ Google Font Pairings, Personality Ratings & Scale Tester',
      shortcut: '⌘3',
    },
    {
      id: 'trending',
      title: 'Trending Palettes',
      desc: '100+ Curated Palettes with 1-Click Copy & Studio Sync',
      shortcut: '⌘4',
    },
    {
      id: 'imagePicker',
      title: 'Image Color Picker',
      desc: 'Extract 5-Role Swatches from Any Photo via Eyedropper Pins',
      shortcut: '⌘5',
    },
    {
      id: 'contrast',
      title: 'Contrast Checker',
      desc: 'WCAG 2.1 AA/AAA Compliance Ratios & 1-Click Magic Auto-Fix',
      shortcut: '⌘6',
    },
    {
      id: 'systemInfo',
      title: 'System Information',
      desc: 'Desktop OS Architecture, Shortcuts & Design Engine',
      shortcut: 'About',
    },
  ];

  const handleLaunch = (appId) => {
    openApp(appId);
    setIsLauncherOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0C0B]/40 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="w-full max-w-3xl bg-white/95 backdrop-blur-2xl border border-stone-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative animate-window-open">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 tracking-tight font-display">
                LooksGood Application Launcher
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Select an installed creative tool to open in a dedicated application window
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLauncherOpen(false)}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3D App Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {appList.map((app) => (
            <button
              key={app.id}
              onClick={() => handleLaunch(app.id)}
              className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-3.5 text-left group hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <AppIcon appId={app.id} size="md" className="group-hover:scale-110 transition-transform" />
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-stone-600 bg-stone-100 border border-stone-200 rounded-md">
                  {app.shortcut}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-stone-900 tracking-tight group-hover:text-purple-700 transition-colors">
                  {app.title}
                </h3>
                <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5 font-medium">
                  {app.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Keyboard Shortcut Footer */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 font-mono">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-[10px]">⌘1</kbd> Desktop</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-[10px]">⌘2</kbd> Colors</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-[10px]">⌘3</kbd> Typography</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-[10px]">⌘W</kbd> Close App</span>
          </div>

          <span className="text-[11px]">Press <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-[10px]">Esc</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
}

export default AppLauncherModal;
