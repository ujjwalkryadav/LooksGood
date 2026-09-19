import React, { useState, useEffect } from 'react';
import { Terminal, Sparkles, Cpu, CheckCircle2, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

export default function Bootloader({ onBootComplete }) {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const bootSequence = [
    { text: 'Initializing LooksGood Creative OS Kernel v2.4...', delay: 200 },
    { text: 'Loading HSL & OKLCH Color Space Engines [OK]', delay: 500 },
    { text: 'Calibrating WCAG 2.1 Contrast Luminance Matrix [OK]', delay: 850 },
    { text: 'Mounting 30+ Curated Google Typography Pipelines [OK]', delay: 1200 },
    { text: 'Starting Multi-Window Drag & Focus Compositor [OK]', delay: 1550 },
    { text: 'Syncing Shared Design State & Creative Harmonies [OK]', delay: 1850 },
    { text: 'LooksGood OS Environment Ready. Booting Workspace...', delay: 2200 },
  ];

  useEffect(() => {
    let timeoutIds = [];

    bootSequence.forEach((item, index) => {
      const id = setTimeout(() => {
        setLogs((prev) => [...prev, item.text]);
        const calculatedProgress = Math.min(100, Math.round(((index + 1) / bootSequence.length) * 100));
        setProgress(calculatedProgress);

        if (index === bootSequence.length - 1) {
          setTimeout(() => {
            setIsDone(true);
            setTimeout(() => {
              onBootComplete();
            }, 500);
          }, 400);
        }
      }, item.delay);
      timeoutIds.push(id);
    });

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, []);

  const handleSkip = () => {
    setIsDone(true);
    setTimeout(onBootComplete, 150);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0A0908] text-stone-200 font-mono flex flex-col justify-between p-6 sm:p-12 select-none transition-all duration-700 ${
        isDone ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Top Status Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 block">
              LOOKSGOOD_CORE // BIOS_BOOT
            </span>
            <span className="text-[10px] text-stone-500 font-medium">System Architecture: ARM64 / WebOS Desktop</span>
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-stone-400 hover:text-white text-xs font-semibold transition flex items-center space-x-1.5 group"
        >
          <span>Skip Boot</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Terminal Output Logs */}
      <div className="max-w-2xl w-full mx-auto my-auto space-y-4 py-8">
        <div className="space-y-2">
          {logs.map((log, i) => (
            <div key={i} className="flex items-start space-x-3 text-xs sm:text-sm animate-fade-in font-mono">
              <span className="text-purple-500 font-bold select-none">&gt;</span>
              <span className={i === logs.length - 1 ? 'text-white font-bold' : 'text-stone-400'}>
                {log}
              </span>
            </div>
          ))}
          {!isDone && (
            <div className="flex items-center space-x-2 text-purple-400 animate-pulse">
              <span>_</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-6">
          <div className="flex justify-between text-xs text-stone-400 font-bold">
            <span className="flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>COMPILATION PROGRESS</span>
            </span>
            <span className="text-purple-400 font-mono">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Boot Footer */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-stone-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1" />
            <span className="text-stone-400">KERNEL STATUS: HEALTHY</span>
          </span>
        </div>
        <span>© 2026 LooksGood Creative OS</span>
      </div>
    </div>
  );
}
