import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Flame, 
  Image as ImageIcon, 
  Eye, 
  Sparkles, 
  Shuffle, 
  Copy, 
  Menu, 
  X,
  Layers
} from 'lucide-react';
import { useSharedDesign } from '../../context/SharedDesignContext';
import { useToast } from '../../context/ToastContext';

export function Navbar({ activeTab, setActiveTab, onRandomize }) {
  const { activePrimaryHex, activePalette, sendPaletteToColorStudio } = useSharedDesign();
  const { showToast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'color', label: 'Color Studio', icon: Palette, badge: 'Wheel & UI' },
    { id: 'typography', label: 'Typography', icon: Type, badge: 'Fonts & Pairings' },
    { id: 'trending', label: 'Trending Palettes', icon: Flame, badge: 'Inspiration' },
    { id: 'imagePicker', label: 'Image Picker', icon: ImageIcon, badge: 'Sampler' },
    { id: 'contrast', label: 'Contrast WCAG', icon: Eye, badge: 'Auto-Fix' },
    { id: 'guided', label: 'Smart Creator', icon: Sparkles, badge: 'AI Guided' },
  ];

  const handleCopyPalette = () => {
    const hexList = activePalette.map(p => `${p.role}: ${p.hex}`).join(' | ');
    navigator.clipboard.writeText(hexList);
    showToast('Copied active 5-role palette to clipboard!', 'success');
  };

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-stone-200/90 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <button
          onClick={() => handleNavClick('color')}
          className="flex items-center space-x-2.5 text-left group focus-visible:outline-purple-600 rounded-xl"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-sm text-white font-black text-sm tracking-tight group-hover:scale-105 transition-transform">
            LG
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight text-stone-900 group-hover:text-purple-600 transition-colors font-display">
                LooksGood<span className="text-purple-600">.</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200/80 rounded-md">
                PRO TOOLS
              </span>
            </div>
          </div>
        </button>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1 bg-stone-100/80 p-1 rounded-2xl border border-stone-200/70 shadow-2xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-sm border border-stone-200/90 scale-100'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-600' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Quick Shuffle Randomizer */}
          <button
            onClick={onRandomize}
            title="Randomize Palette (Spacebar)"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-700 transition hover:border-purple-300"
          >
            <Shuffle className="w-3.5 h-3.5 text-purple-600" />
            <span>Shuffle</span>
            <kbd className="hidden md:inline px-1 py-0.2 bg-white border border-stone-200 rounded text-[9px] text-stone-500">Space</kbd>
          </button>

          {/* Active 5-Role Swatch Strip */}
          <div 
            onClick={() => handleNavClick('color')}
            title="Active Palette (Click to open Color Studio)"
            className="flex items-center p-1 bg-white border border-stone-200 rounded-xl cursor-pointer hover:border-purple-300 transition shadow-2xs"
          >
            <div className="flex -space-x-1">
              {activePalette.map((p, idx) => (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-full border border-white shadow-2xs"
                  style={{ backgroundColor: p.hex }}
                />
              ))}
            </div>
          </div>

          {/* Copy Palette Button */}
          <button
            onClick={handleCopyPalette}
            title="Copy Palette HEX codes"
            className="hidden sm:flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition shadow-sm"
          >
            <Copy className="w-3.5 h-3.5 text-stone-300" />
            <span className="hidden md:inline">Copy Palette</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-fade-in shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2.5 p-3 rounded-xl text-left font-bold text-xs transition ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-stone-500'}`} />
                  <div>
                    <div className="block">{item.label}</div>
                    <span className="text-[10px] text-stone-400 font-normal">{item.badge}</span>
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs text-stone-500">
            <button onClick={onRandomize} className="flex items-center space-x-1 font-bold text-purple-600">
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle Palette</span>
            </button>
            <button onClick={handleCopyPalette} className="flex items-center space-x-1 font-bold text-stone-800">
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Palette</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
