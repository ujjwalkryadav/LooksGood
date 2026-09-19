import React from 'react';
import { calculateOverallDesignScore } from '../../utils/designScorer';
import { ScoreMeter } from '../common/ScoreMeter';
import { Sparkles, Lightbulb, CheckCircle2, ArrowRight, ShieldCheck, Palette, Type } from 'lucide-react';
import confetti from 'canvas-confetti';

export function OverallDesignScore({
  palette,
  headingFont,
  bodyFont,
  useCase,
  mood,
  onNavigateToColor,
  onNavigateToType,
}) {
  const scoreReport = calculateOverallDesignScore({
    palette,
    headingFont,
    bodyFont,
    useCase,
    mood,
  });

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: [palette.primary, palette.accent, '#10B981', '#6C63FF'],
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Scorecard Banner */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Comprehensive Design Health Check</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Your Overall Design Decision Score
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Evaluates how seamlessly your active color palette, typographic hierarchy, and WCAG contrast interact to deliver an intuitive user experience.
          </p>
        </div>

        {/* Big Overall Gauge */}
        <div className="shrink-0 flex flex-col items-center">
          <ScoreMeter score={scoreReport.overall} label="Composite Health Index" size="lg" />
          {scoreReport.overall >= 88 && (
            <button
              onClick={handleCelebrate}
              className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebrate score 🎉</span>
            </button>
          )}
        </div>
      </div>

      {/* 5-Dimensional Metric Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metric Meters */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-2">Metric Breakdown</h3>
          <ScoreMeter score={scoreReport.breakdown.colorHarmony} label="Color Harmony & Undertones" />
          <ScoreMeter score={scoreReport.breakdown.contrast} label="Text & UI Component Contrast" />
          <ScoreMeter score={scoreReport.breakdown.accessibility} label="Accessibility (WCAG 2.1 AA/AAA)" />
          <ScoreMeter score={scoreReport.breakdown.typography} label="Typography Pairing Compatibility" />
          <ScoreMeter score={scoreReport.breakdown.hierarchy} label="Visual Hierarchy & Scale Differentiation" />
        </div>

        {/* Active Configuration Summary */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">Active System Snapshot</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-brand-600" />
                  <span className="font-medium text-zinc-700">Primary Color:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: palette.primary }} />
                  <span className="font-mono font-bold">{palette.primary.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-brand-600" />
                  <span className="font-medium text-zinc-700">Typography Pair:</span>
                </div>
                <span className="font-bold text-zinc-900">
                  {headingFont.name} + {bodyFont.name}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="font-medium text-zinc-700">Medium & Mood:</span>
                <span className="font-semibold capitalize text-zinc-800">
                  {useCase} • {mood}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-[11px] text-zinc-500 italic">
            * Note: LooksGood scores are assistive design heuristics calibrated from UI principles, not absolute artistic verdicts.
          </div>
        </div>
      </div>

      {/* Actionable Recommendations & "One thing to improve" */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Top Recommendations & Adjustments</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scoreReport.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block mb-1">
                  {rec.category}
                </span>
                <h4 className="text-sm font-bold text-zinc-900 mb-1">{rec.title}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">{rec.detail}</p>
              </div>

              {rec.category === 'Typography' && onNavigateToType && (
                <button
                  onClick={onNavigateToType}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <span>Explore Font Pairings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {rec.category === 'Contrast' && onNavigateToColor && (
                <button
                  onClick={onNavigateToColor}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <span>Adjust in Color Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
