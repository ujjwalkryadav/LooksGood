import React, { useState } from 'react';
import {
  ArrowRight,
  Palette,
  Type,
  Sparkles,
  Flame,
  Image as ImageIcon,
  CheckCircle2,
  Wand2,
  Shuffle,
  Copy,
  Layers,
  Check,
  Zap,
  Sliders,
  Eye,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// 5 Interactive Design Presets for the Live Hero Playground
const HERO_THEMES = [
  {
    id: 'paprika',
    name: 'Spicy Paprika (Brand)',
    bg: '#FAF9F6',
    primary: '#E24A2B',
    secondary: '#2D2422',
    text: '#0D0C0B',
    accent: '#E24A2B',
    surface: '#FFFFFF',
    tag: 'Signature Identity',
  },
  {
    id: 'nordic',
    name: 'Nordic Indigo',
    bg: '#F8FAFC',
    primary: '#2563EB',
    secondary: '#1E293B',
    text: '#0F172A',
    accent: '#38BDF8',
    surface: '#FFFFFF',
    tag: 'SaaS Modern',
  },
  {
    id: 'sunset',
    name: 'Neo Sunset',
    bg: '#FFF7ED',
    primary: '#EA580C',
    secondary: '#431407',
    text: '#1C1917',
    accent: '#F59E0B',
    surface: '#FFFFFF',
    tag: 'Warm Creative',
  },
  {
    id: 'emerald',
    name: 'Forest Emerald',
    bg: '#F0FDF4',
    primary: '#059669',
    secondary: '#064E3B',
    text: '#022C22',
    accent: '#10B981',
    surface: '#FFFFFF',
    tag: 'Fresh Eco',
  },
  {
    id: 'violet',
    name: 'Tokyo Violet',
    bg: '#FAF5FF',
    primary: '#7C3AED',
    secondary: '#3B0764',
    text: '#1E1B4B',
    accent: '#A855F7',
    surface: '#FFFFFF',
    tag: 'Editorial Depth',
  },
];

export function HomeSimple({ onNavigateToColor, onNavigateToType }) {
  const { showToast } = useToast();
  const [activeThemeIndex, setActiveThemeIndex] = useState(0);
  const currentTheme = HERO_THEMES[activeThemeIndex];

  const brandSwatches = [
    { name: 'Spicy Paprika', hex: '#E24A2B', role: 'Vibrant Accent' },
    { name: 'Carbon Black', hex: '#0D0C0B', role: 'Sharp Ink' },
    { name: 'Charcoal Brown', hex: '#2D2422', role: 'Structure' },
    { name: 'Dust Grey', hex: '#78716C', role: 'Neutral Tone' },
    { name: 'Floral White', hex: '#FAF9F6', role: 'Crisp Canvas' },
  ];

  const handleShuffleTheme = () => {
    const nextIdx = (activeThemeIndex + 1) % HERO_THEMES.length;
    setActiveThemeIndex(nextIdx);
    showToast(`Switched Live Preview to ${HERO_THEMES[nextIdx].name}!`);
  };

  const handleCopyHex = (hex, name) => {
    navigator.clipboard.writeText(hex);
    showToast(`Copied ${name} (${hex}) to clipboard!`);
  };

  return (
    <div className="space-y-20 py-4 sm:py-10 animate-fade-in relative">
      {/* ================= HERO SECTION ================= */}
      <div className="relative text-center space-y-8 px-4 max-w-5xl mx-auto pt-2">
        {/* Modern Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white border border-[#E8E5DF] text-[#0D0C0B] shadow-subtle hover:border-paprika transition-all">
          <span className="w-2 h-2 rounded-full bg-paprika animate-ping" />
          <span>LOOKSGOOD STUDIO v2.0 • FOR MODERN CREATORS</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#0D0C0B] tracking-tight leading-[1.06]">
          Design that commands attention. <br />
          Colors & fonts that <span className="text-paprika relative inline-block">
            look good.
            <span className="absolute bottom-1 left-0 w-full h-1.5 bg-paprika/20 rounded-full" />
          </span>
        </h1>

        {/* Hero Description */}
        <p className="text-base sm:text-xl text-[#57534E] max-w-2xl mx-auto font-medium leading-relaxed">
          The visual decision assistant for founders, developers, and designers. Build harmonized 5-role color palettes, explore 100+ trending curations, sample shades from photos, and audit WCAG contrast with zero guesswork.
        </p>

        {/* THE 2 HIGH-IMPACT MAIN BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
          {/* Button 1: Colors Studio */}
          <button
            onClick={() => onNavigateToColor('creator')}
            className="group relative w-full sm:w-auto px-8 py-4 text-base font-extrabold text-white rounded-2xl transition-all duration-300 shadow-paprika-sm hover:shadow-paprika-lg hover:scale-105 flex items-center justify-center gap-3 bg-paprika hover:bg-paprika-hover"
          >
            <Palette className="w-5 h-5 text-white" />
            <span>Open Color Studio (4 Tools)</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1.5 transition-transform" />
          </button>

          {/* Button 2: Typography Studio */}
          <button
            onClick={onNavigateToType}
            className="group relative w-full sm:w-auto px-8 py-4 text-base font-extrabold text-[#0D0C0B] bg-white hover:bg-[#F2EFE9] border border-[#E8E5DF] hover:border-[#0D0C0B] rounded-2xl transition-all duration-300 shadow-subtle hover:scale-105 flex items-center justify-center gap-3"
          >
            <Type className="w-5 h-5 text-paprika" />
            <span>Open Typography Studio</span>
            <ArrowRight className="w-5 h-5 text-[#78716C] group-hover:text-[#0D0C0B] group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* ================= INTERACTIVE LIVE DESIGN PLAYGROUND ================= */}
        <div className="pt-8">
          <div className="minimal-card rounded-3xl p-6 sm:p-8 space-y-6 text-left relative overflow-hidden border-[#E8E5DF] shadow-card">
            {/* Playground Header & Theme Switchers */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8E5DF]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0D0C0B]">
                    Interactive Live Design Stage
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-paprika-light text-paprika rounded border border-paprika-border">
                    {currentTheme.tag}
                  </span>
                </div>
                <p className="text-xs text-[#78716C] mt-0.5 font-medium">
                  Click any preset or shuffle to watch typography and UI hierarchy adapt in real time.
                </p>
              </div>

              {/* Theme Preset Pills & Shuffle */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-[#FAF9F6] p-1 rounded-2xl border border-[#E8E5DF]">
                  {HERO_THEMES.map((theme, idx) => (
                    <button
                      key={theme.id}
                      onClick={() => setActiveThemeIndex(idx)}
                      className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl transition-all ${
                        activeThemeIndex === idx
                          ? 'bg-[#0D0C0B] text-white shadow-sm'
                          : 'text-[#78716C] hover:text-[#0D0C0B]'
                      }`}
                    >
                      {theme.name.split(' ')[0]}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleShuffleTheme}
                  className="px-3.5 py-2 text-xs font-mono font-bold text-[#0D0C0B] bg-white hover:bg-[#F2EFE9] border border-[#E8E5DF] rounded-2xl transition-all shadow-subtle flex items-center gap-1.5 hover:scale-105"
                >
                  <Shuffle className="w-3.5 h-3.5 text-paprika" />
                  <span>Morph</span>
                </button>
              </div>
            </div>

            {/* Live Rendered Canvas */}
            <div
              className="w-full rounded-2xl border border-[#E8E5DF] p-6 sm:p-10 shadow-subtle transition-all duration-500 space-y-6"
              style={{
                backgroundColor: currentTheme.bg,
                color: currentTheme.text,
              }}
            >
              {/* Mock App Header */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-2xl border shadow-subtle backdrop-blur-md transition-colors"
                style={{
                  backgroundColor: currentTheme.surface,
                  borderColor: 'rgba(0,0,0,0.08)',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-sm"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    ✦
                  </div>
                  <span className="font-extrabold text-sm tracking-tight text-[#0D0C0B]">
                    Studio Workspace
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-[#57534E]">
                  <span className="hidden sm:inline opacity-80">Overview</span>
                  <span className="hidden sm:inline opacity-80">Components</span>
                  <button
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm transition-transform hover:scale-105"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    Launch Pro
                  </button>
                </div>
              </div>

              {/* Mock Content Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-3">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-subtle"
                    style={{
                      backgroundColor: currentTheme.surface,
                      color: currentTheme.primary,
                      borderColor: 'rgba(0,0,0,0.08)',
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Optical Hierarchy Active</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                    Clarity commands attention. <br />
                    <span style={{ color: currentTheme.primary }}>
                      Harmonized across every screen.
                    </span>
                  </h3>

                  <p className="text-xs sm:text-sm opacity-80 max-w-lg leading-relaxed font-medium">
                    Every color role in this layout has mathematically verified luminance contrast and geometric breathing room.
                  </p>

                  <div className="pt-2 flex items-center gap-3 flex-wrap">
                    <button
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:scale-105 transition-all"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      Start Project
                    </button>
                    <button
                      className="px-4 py-2.5 rounded-xl text-xs font-bold border bg-white shadow-subtle hover:scale-105 transition-all"
                      style={{ borderColor: 'rgba(0,0,0,0.15)', color: currentTheme.text }}
                    >
                      Inspect Hierarchy
                    </button>
                  </div>
                </div>

                {/* Right Side Stats Card */}
                <div
                  className="p-5 rounded-2xl border space-y-3 shadow-subtle transition-colors"
                  style={{
                    backgroundColor: currentTheme.surface,
                    borderColor: 'rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#78716C]">
                      LUMINANCE SCORE
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-3xl font-black font-mono tracking-tight" style={{ color: currentTheme.primary }}>
                    21:1 AAA
                  </div>
                  <p className="text-[11px] opacity-75 font-medium leading-snug">
                    Zero eye fatigue verified on OLED and LCD displays.
                  </p>
                </div>
              </div>
            </div>

            {/* Brand Color Strip with 1-Click Copy */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#78716C] font-bold mb-2">
                <span>FLORAL WHITE</span>
                <span>DUST GREY</span>
                <span>CHARCOAL</span>
                <span>CARBON</span>
                <span className="text-paprika font-black">SPICY PAPRIKA</span>
              </div>
              <div className="grid grid-cols-5 h-8 rounded-2xl overflow-hidden border border-[#E8E5DF] shadow-subtle p-0.5 bg-white gap-1">
                {brandSwatches.map((s) => (
                  <div
                    key={s.name}
                    onClick={() => handleCopyHex(s.hex, s.name)}
                    className="h-full rounded-xl cursor-pointer transition-transform hover:scale-[1.03] flex items-center justify-center group/swatch"
                    style={{ backgroundColor: s.hex }}
                    title={`Click to copy ${s.name} (${s.hex})`}
                  >
                    <span className="text-[9px] font-mono font-bold uppercase opacity-0 group-hover/swatch:opacity-100 transition-opacity bg-black/70 text-white px-1 py-0.5 rounded backdrop-blur-md">
                      {s.hex}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4 COLOR TOOLS OVERVIEW MATRIX ================= */}
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-paprika-light text-paprika border border-paprika-border shadow-subtle">
            <Palette className="w-3.5 h-3.5" />
            <span>THE 4 COLOR DECISION TOOLS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0D0C0B] tracking-tight">
            Four focused tools. Zero confusion.
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] max-w-lg mx-auto font-medium">
            Each tool is built to solve one specific design challenge without overwhelming you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Guided Palette Creator */}
          <div
            onClick={() => onNavigateToColor('creator')}
            className="minimal-card rounded-3xl p-6 flex flex-col justify-between space-y-6 cursor-pointer group hover:scale-[1.02]"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-paprika text-white flex items-center justify-center shadow-paprika-sm group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-paprika uppercase tracking-wider block">
                  FLAGSHIP STUDIO
                </span>
                <h3 className="text-lg font-black text-[#0D0C0B] tracking-tight mt-0.5">
                  Create My Palette
                </h3>
              </div>

              <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                Answer 5 simple visual questions. LooksGood analyzes your context, audience, and personality to synthesize a custom 5-role palette.
              </p>

              {/* Step indicator preview */}
              <div className="flex items-center gap-1.5 pt-1">
                {['Type', 'User', 'Feel', 'Tone', 'Hue'].map((label, idx) => (
                  <span
                    key={label}
                    className="flex-1 py-1 text-center text-[9px] font-mono font-bold uppercase bg-[#FAF9F6] text-[#78716C] border border-[#E8E5DF] rounded-lg"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-paprika group-hover:translate-x-1 transition-transform pt-4 border-t border-[#E8E5DF]">
              <span>Start Guided Flow</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Trending Palettes */}
          <div
            onClick={() => onNavigateToColor('trending')}
            className="minimal-card rounded-3xl p-6 flex flex-col justify-between space-y-6 cursor-pointer group hover:scale-[1.02]"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D0C0B] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6 text-paprika" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-[#78716C] uppercase tracking-wider block">
                  COMMUNITY EXPLORER
                </span>
                <h3 className="text-lg font-black text-[#0D0C0B] tracking-tight mt-0.5">
                  Trending Palettes
                </h3>
              </div>

              <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                Browse 100+ curated harmonic combinations filtered by Warm, Cool, Neon, Pastel, and SaaS tags with 1-click hex copy.
              </p>

              {/* Mini Swatch Demo */}
              <div className="flex h-5 rounded-xl overflow-hidden border border-[#E8E5DF]">
                {['#E24A2B', '#0D0C0B', '#2D2422', '#78716C', '#FAF9F6'].map((c) => (
                  <div key={c} className="flex-1 h-full" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-[#0D0C0B] group-hover:text-paprika transition-colors pt-4 border-t border-[#E8E5DF]">
              <span>Explore Trending</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Image Palette Picker */}
          <div
            onClick={() => onNavigateToColor('image')}
            className="minimal-card rounded-3xl p-6 flex flex-col justify-between space-y-6 cursor-pointer group hover:scale-[1.02]"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D0C0B] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6 text-paprika" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-[#78716C] uppercase tracking-wider block">
                  PHOTO SAMPLER
                </span>
                <h3 className="text-lg font-black text-[#0D0C0B] tracking-tight mt-0.5">
                  Image Color Picker
                </h3>
              </div>

              <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                Upload any image and position 5 interactive eyedropper pins directly on the photo to sample clean natural harmonies.
              </p>

              {/* Mini Pin Demo */}
              <div className="flex items-center justify-between px-2 py-1 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] text-[10px] font-mono font-bold text-[#78716C]">
                <span>5 Pins Active</span>
                <span className="text-paprika font-bold">1-Click Sample</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-[#0D0C0B] group-hover:text-paprika transition-colors pt-4 border-t border-[#E8E5DF]">
              <span>Extract From Photo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Contrast Checker */}
          <div
            onClick={() => onNavigateToColor('contrast')}
            className="minimal-card rounded-3xl p-6 flex flex-col justify-between space-y-6 cursor-pointer group hover:scale-[1.02]"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0D0C0B] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-[#78716C] uppercase tracking-wider block">
                  ACCESSIBILITY AUDIT
                </span>
                <h3 className="text-lg font-black text-[#0D0C0B] tracking-tight mt-0.5">
                  Contrast Checker
                </h3>
              </div>

              <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                Test WCAG 2.1 AA/AAA compliance ratios for body text, headers, and UI elements with 1-click automatic accessible fixes.
              </p>

              {/* Mini Dial Demo */}
              <div className="flex items-center justify-between px-2.5 py-1 bg-emerald-50 rounded-xl border border-emerald-200 text-[10px] font-mono font-bold text-emerald-800">
                <span>WCAG 2.1 Pass</span>
                <span>21:1 AAA</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-[#0D0C0B] group-hover:text-paprika transition-colors pt-4 border-t border-[#E8E5DF]">
              <span>Check Contrast</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= TYPOGRAPHY HIGHLIGHT BANNER ================= */}
      <div className="max-w-6xl mx-auto px-4">
        <div
          onClick={onNavigateToType}
          className="minimal-card rounded-3xl p-8 sm:p-12 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-8 group hover:scale-[1.01]"
        >
          <div className="space-y-3 text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase text-paprika bg-paprika-light border border-paprika-border shadow-subtle">
              <Type className="w-3.5 h-3.5" />
              <span>TYPOGRAPHY PAIRINGS & SCALE STUDIO</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-[#0D0C0B] tracking-tight">
              Pair your colors with verified typography.
            </h3>
            <p className="text-xs sm:text-sm text-[#57534E] font-medium leading-relaxed">
              Explore 30+ Google Font pairings, inspect personality ratings, test live hierarchy scales, and preview custom copy in real time.
            </p>
          </div>

          <button className="px-8 py-4 text-xs font-bold font-mono text-white bg-[#0D0C0B] group-hover:bg-paprika rounded-2xl transition-all shadow-subtle flex items-center gap-2.5 shrink-0 group-hover:scale-105">
            <span>Explore Font Pairings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= THE LOOKSGOOD PHILOSOPHY ================= */}
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#78716C]">
            OUR DESIGN PHILOSOPHY
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0D0C0B] tracking-tight">
            Why mathematical harmony matters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="minimal-card rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-paprika-light text-paprika flex items-center justify-center font-bold text-sm border border-paprika-border">
              60%
            </div>
            <h4 className="text-base font-bold text-[#0D0C0B]">60-30-10 Rule</h4>
            <p className="text-xs text-[#57534E] leading-relaxed font-medium">
              60% canvas surface gives breathing space, 30% structural contrast defines layout edges, and 10% signature accent commands instant conversion.
            </p>
          </div>

          <div className="minimal-card rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF9F6] text-[#0D0C0B] flex items-center justify-center font-bold text-sm border border-[#E8E5DF]">
              4.5:1
            </div>
            <h4 className="text-base font-bold text-[#0D0C0B]">Zero Visual Fatigue</h4>
            <p className="text-xs text-[#57534E] leading-relaxed font-medium">
              Every synthesized palette is mathematically tuned against WCAG luminance formulas so your users can read for hours without eye strain.
            </p>
          </div>

          <div className="minimal-card rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF9F6] text-[#0D0C0B] flex items-center justify-center font-bold text-sm border border-[#E8E5DF]">
              5 Roles
            </div>
            <h4 className="text-base font-bold text-[#0D0C0B]">5 Intentional Roles</h4>
            <p className="text-xs text-[#57534E] leading-relaxed font-medium">
              Instead of 50 chaotic colors, we provide 5 clear functional roles: Primary, Secondary, Accent, Canvas, and Readable Typography.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
