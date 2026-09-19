import React, { useState } from 'react';
import {
  Palette,
  Type,
  ArrowRight,
  Sparkles,
  Sliders,
  CheckCircle2,
  Layers,
  Flame,
  ShieldCheck,
  Eye,
  Zap,
  Code2,
  Copy,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const COLOR_TOOLS = [
  {
    id: 'custom',
    name: 'Smart Palette Synthesizer',
    category: 'Rule-Based 60-30-10 Systems',
    desc: 'AI questions to mathematical 5-role harmony schemes',
    icon: Sparkles,
    previewType: 'palette',
    previewData: ['#7C3AED', '#A78BFA', '#F43F5E', '#FAF9F6', '#1E1B4B'],
  },
  {
    id: 'palette',
    name: 'Harmonic Color Wheel',
    category: 'Color Theory & Conic Math',
    desc: 'Triadic, Analogous, Complementary & Split angles',
    icon: Palette,
    previewType: 'wheel',
    previewData: ['#3B82F6', '#60A5FA', '#F59E0B', '#F8FAFC', '#0F172A'],
  },
  {
    id: 'shades',
    name: 'Tailwind Shade Curves (50-950)',
    category: 'Design System Scales',
    desc: 'Mathematically distributed 11-step lightness steps',
    icon: Sliders,
    previewType: 'shades',
    previewData: ['#FAF5FF', '#F3E8FF', '#E9D5FF', '#D8B4FE', '#C084FC', '#A855F7', '#9333EA', '#7E22CE', '#6B21A8', '#581C87', '#3B0764'],
  },
  {
    id: 'contrast',
    name: 'WCAG 2.1 AAA Contrast Matrix',
    category: 'Accessibility Compliance',
    desc: 'Real-time 4.5:1 and 7:1 ratio validation with fix suggestions',
    icon: ShieldCheck,
    previewType: 'contrast',
    previewData: { ratio: '14.8:1', grade: 'AAA', text: '#FAF9F6', bg: '#1E1B4B' },
  },
  {
    id: 'imagePicker',
    name: 'Photo Palette Extractor',
    category: 'Image Processing',
    desc: 'Extract dominant color palettes directly from any image',
    icon: Layers,
    previewType: 'palette',
    previewData: ['#059669', '#10B981', '#F59E0B', '#FEF3C7', '#064E3B'],
  },
  {
    id: 'trending',
    name: '100+ Trending Designer Palettes',
    category: 'Curated Inspiration',
    desc: 'Explore categorized palettes from top digital products',
    icon: Flame,
    previewType: 'palette',
    previewData: ['#EC4899', '#F43F5E', '#FB7185', '#FFF1F2', '#881337'],
  },
];

const TYPO_TOOLS = [
  {
    id: 'explorer',
    name: 'Google Fonts Explorer',
    category: 'Curated Font Library',
    desc: '30+ top fonts with live category filters and preview typing',
    icon: Type,
    previewType: 'font',
    fontName: 'Playfair Display',
    fontFamily: '"Playfair Display", serif',
  },
  {
    id: 'pairings',
    name: 'Harmonic Font Pairing Engine',
    category: 'Algorithmic Typography',
    desc: 'Curated Headline + Body pairs with live 98% balance scores',
    icon: Sparkles,
    previewType: 'pairing',
    headlineFont: 'Syne',
    bodyFont: 'DM Sans',
    score: '98%',
  },
  {
    id: 'playground',
    name: 'Live Editorial Playground',
    category: 'Hero & Article Canvas',
    desc: 'Interactive UI playground with real-time typography styling',
    icon: Eye,
    previewType: 'editorial',
    fontName: 'Space Grotesk',
  },
  {
    id: 'typeScale',
    name: 'Modular Scale Hierarchy Ladder',
    category: 'Mathematical Sizing',
    desc: '1.25 Major Third & Golden Ratio responsive type scales',
    icon: Sliders,
    previewType: 'scale',
  },
  {
    id: 'reverse',
    name: 'Style Match & Personality Matcher',
    category: 'Font Recommendation',
    desc: 'Find the ideal typography match for modern, bold or luxury moods',
    icon: Zap,
    previewType: 'font',
    fontName: 'Outfit',
    fontFamily: '"Outfit", sans-serif',
  },
  {
    id: 'export',
    name: 'CSS & CDN Token Exporter',
    category: 'Developer Ready',
    desc: 'Instant @import, Tailwind config, and CSS variable export',
    icon: Code2,
    previewType: 'code',
  },
];

export function ToolsSplitSection({ onNavigateStudio }) {
  const { showToast } = useToast();
  const [activeColorTool, setActiveColorTool] = useState(COLOR_TOOLS[0]);
  const [activeTypoTool, setActiveTypoTool] = useState(TYPO_TOOLS[0]);

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied design token to clipboard!', 'success');
  };

  return (
    <section className="w-full py-16 sm:py-24 select-none relative overflow-hidden">
      {/* Background Decorative Flow Shapes */}
      <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-100/40 blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-pink-100/40 blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-14 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OUR POWERFUL CREATIVE ENGINES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-stone-950">
            Everything you need, in one place.
          </h2>

          <p className="text-sm sm:text-base text-stone-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Switch seamlessly between mathematical color systems and editorial typography hierarchy engines.
          </p>
        </div>

        {/* Side-by-Side Split Section with Center Dividing Architecture */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-stretch">
          {/* Vertical Center Line for Desktop with Glowing Center Node */}
          <div className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-purple-200 via-stone-200 to-pink-200">
            <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 rounded-full bg-white border-2 border-purple-500 shadow-md flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />
            </div>
          </div>

          {/* ================================================================= */}
          {/* 01 COLOR STUDIO CARD                                              */}
          {/* ================================================================= */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xl shadow-purple-950/5 flex flex-col justify-between space-y-6 group hover:border-purple-300 transition-all duration-300">
            <div className="space-y-6">
              {/* Studio Header */}
              <div className="flex items-start justify-between border-b border-stone-100 pb-5">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-mono font-bold text-xs">
                      01
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-600 tracking-wider uppercase">
                      Color Studio Suite
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black font-display text-stone-950">
                    Mathematical Color Systems
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-500 font-medium">
                    Generate harmonic 5-role systems, 11-step shade scales, and WCAG AAA compliance.
                  </p>
                </div>

                <button
                  onClick={() => onNavigateStudio && onNavigateStudio('colors', activeColorTool.id)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-purple-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                  title="Launch Full Color Studio"
                >
                  <span>Launch Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Interactive Tool Selector List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {COLOR_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  const isSelected = activeColorTool.id === tool.id;

                  return (
                    <div
                      key={tool.id}
                      onMouseEnter={() => setActiveColorTool(tool)}
                      onClick={() => {
                        setActiveColorTool(tool);
                        onNavigateStudio && onNavigateStudio('colors', tool.id);
                      }}
                      className={`p-3 rounded-2xl border transition-all duration-200 text-left cursor-pointer flex items-start space-x-3 group/item ${
                        isSelected
                          ? 'bg-purple-50/90 border-purple-300 shadow-xs'
                          : 'bg-stone-50/60 hover:bg-purple-50/40 border-stone-200/80 hover:border-purple-200'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-stone-600 border border-stone-200 group-hover/item:text-purple-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <span
                          className={`text-xs font-bold block truncate transition-colors ${
                            isSelected ? 'text-purple-950' : 'text-stone-900 group-hover/item:text-purple-700'
                          }`}
                        >
                          {tool.name}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium block truncate">
                          {tool.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Live Mini Simulation Widget */}
              <div className="p-4 rounded-2xl bg-stone-900 text-white shadow-inner space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 border-b border-stone-800 pb-2">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span>Live Interactive Preview: {activeColorTool.name}</span>
                  </span>
                  <span className="text-purple-400 font-bold">Mathematical Sync</span>
                </div>

                {/* Dynamic Preview Rendering */}
                {activeColorTool.previewType === 'palette' && (
                  <div className="grid grid-cols-5 gap-1.5 pt-1">
                    {activeColorTool.previewData.map((hex, i) => (
                      <div
                        key={i}
                        onClick={() => handleCopyCode(hex)}
                        className="h-14 rounded-xl flex flex-col justify-end p-1.5 text-[9px] font-mono font-bold cursor-pointer hover:scale-105 transition-transform"
                        style={{ backgroundColor: hex }}
                        title={`Click to copy ${hex}`}
                      >
                        <span className="bg-black/50 text-white px-1 py-0.5 rounded text-center block">
                          {hex}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeColorTool.previewType === 'shades' && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex rounded-xl overflow-hidden h-10 border border-stone-800">
                      {activeColorTool.previewData.map((hex, i) => (
                        <div
                          key={i}
                          className="flex-1 hover:flex-[1.5] transition-all cursor-pointer"
                          style={{ backgroundColor: hex }}
                          title={`Scale ${50 + i * 100}: ${hex}`}
                          onClick={() => handleCopyCode(hex)}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-stone-500">
                      <span>50 (Soft)</span>
                      <span>500 (Primary Base)</span>
                      <span>950 (Deep)</span>
                    </div>
                  </div>
                )}

                {activeColorTool.previewType === 'contrast' && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800 border border-stone-700">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500 text-stone-950 font-black text-xs flex items-center justify-center">
                        AAA
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white block">WCAG 2.1 Pass (14.8 : 1)</span>
                        <span className="text-[10px] text-stone-400">Normal, Large Text & UI Components</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                      100% Accessible
                    </span>
                  </div>
                )}

                {activeColorTool.previewType === 'wheel' && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400" />
                      <span className="text-xs font-medium text-stone-300">Triadic 120° Angle Harmony</span>
                    </div>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded">
                      Zero Clashing Guaranteed
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 02 TYPOGRAPHY STUDIO CARD                                         */}
          {/* ================================================================= */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xl shadow-pink-950/5 flex flex-col justify-between space-y-6 group hover:border-pink-300 transition-all duration-300">
            <div className="space-y-6">
              {/* Studio Header */}
              <div className="flex items-start justify-between border-b border-stone-100 pb-5">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-pink-100 text-pink-800 font-mono font-bold text-xs">
                      02
                    </span>
                    <span className="text-xs font-mono font-bold text-pink-600 tracking-wider uppercase">
                      Typography Studio Suite
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black font-display text-stone-950">
                    Editorial Type Hierarchy
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-500 font-medium">
                    Test Google fonts, algorithmic pairings, modular scales, and live playgrounds.
                  </p>
                </div>

                <button
                  onClick={() => onNavigateStudio && onNavigateStudio('typography', activeTypoTool.id)}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-pink-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                  title="Launch Full Typography Studio"
                >
                  <span>Launch Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Interactive Tool Selector List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TYPO_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  const isSelected = activeTypoTool.id === tool.id;

                  return (
                    <div
                      key={tool.id}
                      onMouseEnter={() => setActiveTypoTool(tool)}
                      onClick={() => {
                        setActiveTypoTool(tool);
                        onNavigateStudio && onNavigateStudio('typography', tool.id);
                      }}
                      className={`p-3 rounded-2xl border transition-all duration-200 text-left cursor-pointer flex items-start space-x-3 group/item ${
                        isSelected
                          ? 'bg-pink-50/90 border-pink-300 shadow-xs'
                          : 'bg-stone-50/60 hover:bg-pink-50/40 border-stone-200/80 hover:border-pink-200'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-pink-600 text-white'
                            : 'bg-white text-stone-600 border border-stone-200 group-hover/item:text-pink-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <span
                          className={`text-xs font-bold block truncate transition-colors ${
                            isSelected ? 'text-pink-950' : 'text-stone-900 group-hover/item:text-pink-700'
                          }`}
                        >
                          {tool.name}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium block truncate">
                          {tool.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Live Mini Simulation Widget */}
              <div className="p-4 rounded-2xl bg-stone-900 text-white shadow-inner space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 border-b border-stone-800 pb-2">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                    <span>Live Typography Engine: {activeTypoTool.name}</span>
                  </span>
                  <span className="text-pink-400 font-bold">Real-Time Pairing</span>
                </div>

                {/* Dynamic Preview Rendering */}
                {activeTypoTool.previewType === 'pairing' && (
                  <div className="p-2.5 rounded-xl bg-stone-800 space-y-1.5 border border-stone-700">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-lg text-white font-display">
                        Headline with {activeTypoTool.headlineFont}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[10px] font-bold">
                        {activeTypoTool.score} Balance
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 font-medium leading-relaxed font-sans">
                      Body paragraph paired with {activeTypoTool.bodyFont} provides maximum legibility across editorial spreads.
                    </p>
                  </div>
                )}

                {activeTypoTool.previewType === 'font' && (
                  <div className="p-2.5 rounded-xl bg-stone-800 space-y-1">
                    <span className="text-xs font-mono text-stone-400">Specimen Preview:</span>
                    <div
                      className="text-xl sm:text-2xl font-bold text-white tracking-wide truncate"
                      style={{ fontFamily: activeTypoTool.fontFamily }}
                    >
                      Sphinx of black quartz, judge my vow.
                    </div>
                  </div>
                )}

                {activeTypoTool.previewType === 'scale' && (
                  <div className="flex items-baseline justify-between p-2 rounded-xl bg-stone-800 text-stone-300 font-mono text-xs">
                    <span className="text-lg font-bold text-white">48px H1</span>
                    <span className="text-base font-semibold text-stone-200">32px H2</span>
                    <span className="text-sm text-stone-400">20px H3</span>
                    <span className="text-xs text-stone-500">16px Body</span>
                  </div>
                )}

                {activeTypoTool.previewType === 'editorial' && (
                  <div className="p-2.5 rounded-xl bg-stone-800 space-y-1">
                    <span className="text-xs font-mono text-pink-400 font-bold">Editorial Headline (Space Grotesk)</span>
                    <p className="text-xs text-stone-300">
                      Crafting state-of-the-art web experiences with curated Google fonts.
                    </p>
                  </div>
                )}

                {activeTypoTool.previewType === 'code' && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-stone-800 font-mono text-xs text-emerald-400">
                    <span className="truncate">@import url('https://fonts.googleapis.com/...');</span>
                    <button
                      onClick={() => handleCopyCode("@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');")}
                      className="ml-2 px-2 py-0.5 rounded bg-stone-700 hover:bg-stone-600 text-white text-[10px] cursor-pointer flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
