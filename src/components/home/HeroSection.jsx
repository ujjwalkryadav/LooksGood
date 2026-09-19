import React from 'react';
import { ArrowRight, Sparkles, Palette, Type, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CopyButton } from '../common/CopyButton';

export function HeroSection({
  onStartDesigning,
  onNavigateToColor,
  onNavigateToType,
  palette,
  headingFont,
  bodyFont,
}) {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16">
      {/* Subtle Background Glows */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: palette.primary }}
      />

      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10 px-4">
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-zinc-200/80 shadow-subtle text-zinc-800 animate-fade-in">
          <span className="w-2 h-2 rounded-full animate-pulse-subtle" style={{ backgroundColor: palette.primary }} />
          <span>LOOKSGOOD • Visual Design Decision Assistant</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tight leading-[1.1] animate-fade-in">
          Know what <span className="underline decoration-brand-400 decoration-wavy decoration-2">looks good.</span>
        </h1>

        {/* Core Subtitle Trio */}
        <p className="text-base sm:text-xl text-zinc-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Choose a color. Pick a font. Build with confidence. <br className="hidden sm:inline" />
          <span className="text-zinc-900 font-bold">Design decisions without the guesswork.</span>
        </p>

        {/* Primary Call To Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartDesigning}
            className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-2xl transition-all shadow-card hover:shadow-hover hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Start Designing in Color Lab</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onNavigateToType}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-2xl transition-all shadow-subtle flex items-center justify-center gap-2"
          >
            <Type className="w-4 h-4 text-brand-600" />
            <span>Explore Font Pairings</span>
          </button>
        </div>

        {/* Live Interactive Hero Preview Card */}
        <div className="pt-8 max-w-2xl mx-auto">
          <div
            className="p-6 sm:p-8 rounded-3xl border shadow-card text-left transition-all duration-300 space-y-4 relative overflow-hidden"
            style={{
              backgroundColor: palette.surface,
              borderColor: palette.border || 'rgba(0,0,0,0.1)',
              color: palette.text,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: palette.primary }}
                />
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: palette.accent }}
                >
                  LIVE HARMONY PREVIEW
                </span>
              </div>
              <span className="text-xs opacity-60 font-mono">
                {headingFont.name} + {bodyFont.name}
              </span>
            </div>

            <h3
              className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight"
              style={{ fontFamily: headingFont.family, color: palette.text }}
            >
              Design without memorizing textbooks.
            </h3>

            <p
              className="text-xs sm:text-sm opacity-85 leading-relaxed"
              style={{ fontFamily: bodyFont.family }}
            >
              LooksGood automatically calculates complementary hues, checks WCAG AA/AAA contrast ratios, and pairs fonts with balanced x-heights for crystal-clear readability.
            </p>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onStartDesigning}
                className="px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-transform hover:scale-105 flex items-center gap-1.5"
                style={{ backgroundColor: palette.primary, color: '#FFFFFF' }}
              >
                <span>Try This Combination</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1.5">
                {Object.values(palette).slice(0, 5).map((hex, i) => (
                  <span
                    key={i}
                    className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
