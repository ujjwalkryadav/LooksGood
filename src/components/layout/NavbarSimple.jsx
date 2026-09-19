import React, { useState, useRef, useEffect } from 'react';
import {
  Palette,
  Type,
  Sparkles,
  Wand2,
  ChevronDown,
  Flame,
  Image as ImageIcon,
  CheckCircle2,
  Shuffle,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function NavbarSimple({ activeTab, setActiveTab, onNavigateToColor }) {
  const { showToast } = useToast();
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsColorMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const colorTools = [
    {
      id: 'creator',
      title: 'Create My Palette',
      desc: '5-step guided visual decision wizard',
      icon: Sparkles,
      tag: 'Flagship',
      color: 'text-paprika bg-paprika-light',
    },
    {
      id: 'trending',
      title: 'Trending Palettes',
      desc: '100+ curated community palettes',
      icon: Flame,
      tag: 'Popular',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'image',
      title: 'Image Color Picker',
      desc: 'Extract harmonic swatches from photos',
      icon: ImageIcon,
      tag: 'Sampler',
      color: 'text-cyan-700 bg-cyan-50',
    },
    {
      id: 'contrast',
      title: 'Contrast Checker',
      desc: 'WCAG 2.1 AA/AAA compliance audit',
      icon: CheckCircle2,
      tag: 'Audit',
      color: 'text-emerald-700 bg-emerald-50',
    },
  ];

  const quickPalettes = [
    ['#E24A2B', '#2D2422', '#78716C', '#0D0C0B', '#FAF9F6'],
    ['#2563EB', '#1E293B', '#64748B', '#0F172A', '#F8FAFC'],
    ['#059669', '#064E3B', '#6EE7B7', '#022C22', '#F0FDF4'],
    ['#7C3AED', '#4C1D95', '#C4B5FD', '#1E1B4B', '#FAF5FF'],
  ];

  const handleQuickShuffle = () => {
    const randomPal = quickPalettes[Math.floor(Math.random() * quickPalettes.length)];
    navigator.clipboard.writeText(randomPal.join(', '));
    showToast(`Copied Quick Palette: ${randomPal[0]} & ${randomPal[1]}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F6]/90 backdrop-blur-xl border-b border-[#E8E5DF] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo - LooksGood. */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 group text-left focus-visible:outline-paprika rounded-2xl transition-transform shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0D0C0B] flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-subtle group-hover:bg-paprika transition-colors">
            LG
          </div>

          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tight text-[#0D0C0B] group-hover:text-paprika transition-colors leading-none">
              LooksGood<span className="text-paprika animate-pulse">.</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-[#78716C] tracking-wider uppercase mt-0.5">
              DESIGN DECISION SUITE
            </span>
          </div>
        </button>

        {/* Center Pill Navigation with Dropdown Menu */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-white border border-[#E8E5DF] rounded-2xl shadow-subtle">
          {/* Home Tab */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              activeTab === 'home'
                ? 'bg-[#0D0C0B] text-white shadow-sm'
                : 'text-[#78716C] hover:text-[#0D0C0B] hover:bg-[#F2EFE9]'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'home' ? 'text-paprika' : 'text-[#78716C]'}`} />
            <span>Home</span>
          </button>

          {/* Color Studio with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                if (activeTab !== 'color') {
                  onNavigateToColor('creator');
                } else {
                  setIsColorMenuOpen(!isColorMenuOpen);
                }
              }}
              onMouseEnter={() => setIsColorMenuOpen(true)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'color'
                  ? 'bg-[#0D0C0B] text-white shadow-sm'
                  : 'text-[#78716C] hover:text-[#0D0C0B] hover:bg-[#F2EFE9]'
              }`}
            >
              <Palette className={`w-4 h-4 ${activeTab === 'color' ? 'text-paprika' : 'text-[#78716C]'}`} />
              <span>Color Studio</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isColorMenuOpen ? 'rotate-180 text-paprika' : 'opacity-60'
                }`}
              />
            </button>

            {/* Rich Dropdown Flyout */}
            {isColorMenuOpen && (
              <div
                onMouseLeave={() => setIsColorMenuOpen(false)}
                className="absolute top-full left-0 mt-2 w-80 bg-white border border-[#E8E5DF] rounded-3xl shadow-card p-2.5 space-y-1 animate-fade-in z-50"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716C] border-b border-[#E8E5DF] mb-1">
                  Color Tools (4 Pro Modules)
                </div>

                {colorTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        onNavigateToColor(tool.id);
                        setIsColorMenuOpen(false);
                      }}
                      className="w-full p-2.5 rounded-2xl hover:bg-[#FAF9F6] border border-transparent hover:border-[#E8E5DF] transition-all flex items-center gap-3 text-left group/item"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tool.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0D0C0B] group-hover/item:text-paprika transition-colors">
                            {tool.title}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-[#78716C] bg-[#FAF9F6] px-1.5 py-0.5 rounded border border-[#E8E5DF]">
                            {tool.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#57534E] truncate font-medium mt-0.5">{tool.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Typography Tab */}
          <button
            onClick={() => setActiveTab('typography')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${
              activeTab === 'typography'
                ? 'bg-[#0D0C0B] text-white shadow-sm'
                : 'text-[#78716C] hover:text-[#0D0C0B] hover:bg-[#F2EFE9]'
            }`}
          >
            <Type className={`w-4 h-4 ${activeTab === 'typography' ? 'text-paprika' : 'text-[#78716C]'}`} />
            <span>Typography</span>
          </button>
        </nav>

        {/* Right Actions: Quick Shuffle & Create Palette CTA */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={handleQuickShuffle}
            title="Copy a surprise harmonic palette"
            className="px-3.5 py-2.5 text-xs font-mono font-bold text-[#0D0C0B] bg-white hover:bg-[#F2EFE9] border border-[#E8E5DF] hover:border-[#0D0C0B] rounded-2xl transition-all shadow-subtle flex items-center gap-2"
          >
            <Shuffle className="w-3.5 h-3.5 text-paprika" />
            <span className="hidden lg:inline">Quick Palette</span>
          </button>

          <button
            onClick={() => onNavigateToColor('creator')}
            className="px-5 py-2.5 text-xs font-bold font-mono text-white bg-paprika hover:bg-paprika-hover rounded-2xl transition-all flex items-center gap-2 shadow-paprika-sm hover:shadow-paprika-lg hover:scale-105"
          >
            <Wand2 className="w-4 h-4" />
            <span>Create Palette</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-2xl bg-white border border-[#E8E5DF] text-[#0D0C0B] hover:bg-[#FAF9F6]"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E5DF] bg-white/95 backdrop-blur-xl px-4 py-5 space-y-4 animate-fade-in shadow-card">
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab('home');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-sm ${
                activeTab === 'home' ? 'bg-[#0D0C0B] text-white' : 'text-[#0D0C0B] hover:bg-[#FAF9F6]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-paprika" />
                <span>Home Page</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setActiveTab('typography');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-sm ${
                activeTab === 'typography' ? 'bg-[#0D0C0B] text-white' : 'text-[#0D0C0B] hover:bg-[#FAF9F6]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Type className="w-4 h-4 text-paprika" />
                <span>Typography Studio</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-[#E8E5DF] space-y-2">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716C]">
              Color Studio Tools
            </div>

            {colorTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    onNavigateToColor(tool.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF9F6] text-left border border-[#E8E5DF]"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-paprika" />
                    <span className="text-xs font-bold text-[#0D0C0B]">{tool.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#78716C] bg-[#FAF9F6] px-1.5 py-0.5 rounded">
                    {tool.tag}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onNavigateToColor('creator');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-3 text-xs font-bold font-mono text-white bg-paprika rounded-2xl shadow-paprika-sm flex items-center justify-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              <span>Launch Guided Palette Creator</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
