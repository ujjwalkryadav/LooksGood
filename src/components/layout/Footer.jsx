import React from 'react';
import { Palette, Type, Sparkles, Flame, Image as ImageIcon, Eye, Heart } from 'lucide-react';

export function Footer({ setActiveTab }) {
  const handleNavClick = (id) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-stone-200 mt-auto pt-12 pb-16 text-stone-500 text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black flex items-center justify-center text-xs shadow-sm">
                LG
              </div>
              <span className="font-black text-xl text-stone-900 tracking-tight font-display">
                LooksGood<span className="text-purple-600">.</span>
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-purple-700 bg-purple-50 border border-purple-200 rounded-md">
                v2.4
              </span>
            </div>
            <p className="text-stone-500 max-w-md leading-relaxed font-medium">
              <strong className="text-stone-900">Know what looks good. Without the guesswork.</strong> An opinionated, fast design tool suite helping founders, developers, and creators build balanced color harmonies and font pairings effortlessly.
            </p>
          </div>

          {/* Color Decision Tools */}
          <div>
            <h4 className="font-bold text-stone-900 mb-3 uppercase tracking-wider text-[11px] font-mono">
              Color Decision Suite
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={() => handleNavClick('color')} className="hover:text-purple-600 transition-colors flex items-center space-x-2">
                  <Palette className="w-3.5 h-3.5 text-purple-600" />
                  <span>Color Studio & Harmonies</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('guided')} className="hover:text-purple-600 transition-colors flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Smart Guided Creator</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('trending')} className="hover:text-purple-600 transition-colors flex items-center space-x-2">
                  <Flame className="w-3.5 h-3.5 text-purple-600" />
                  <span>Trending Palettes</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('imagePicker')} className="hover:text-purple-600 transition-colors flex items-center space-x-2">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>Image Color Extractor</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('contrast')} className="hover:text-purple-600 transition-colors flex items-center space-x-2">
                  <Eye className="w-3.5 h-3.5 text-purple-600" />
                  <span>WCAG Contrast Checker</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Typography Tools */}
          <div>
            <h4 className="font-bold text-stone-900 mb-3 uppercase tracking-wider text-[11px] font-mono">
              Typography Suite
            </h4>
            <ul className="space-y-2 font-medium mb-4">
              <li>
                <button onClick={() => handleNavClick('typography')} className="hover:text-purple-600 transition-colors flex items-center space-x-2">
                  <Type className="w-3.5 h-3.5 text-purple-600" />
                  <span>30+ Google Fonts & Pairings</span>
                </button>
              </li>
            </ul>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              Keyboard shortcuts: Press <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-stone-700 font-mono">Space</kbd> anywhere to randomize colors!
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 font-mono text-[11px]">
          <p>© {new Date().getFullYear()} LooksGood. Built for deliberate creative decisions.</p>
          <p className="flex items-center space-x-1 text-stone-600 font-medium">
            <span>Made with mathematical precision</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
