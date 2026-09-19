import React from 'react';
import { calculateColorScore } from '../../utils/colorUtils';
import { ScoreMeter } from '../common/ScoreMeter';
import { Sparkles, Lightbulb, ArrowRight } from 'lucide-react';

export function ColorScoreCard({ palette, onApplyFix }) {
  const report = calculateColorScore(palette);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Color Decision Score</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Heuristic assessment of harmony, contrast, and visual equilibrium</p>
        </div>
        <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
          Guidance Metric
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Overall Score Dial */}
        <div className="md:col-span-4 flex justify-center">
          <ScoreMeter score={report.overall} label="Color Health Index" size="lg" />
        </div>

        {/* 4 Metric Sub-Scores */}
        <div className="md:col-span-8 space-y-3.5">
          <ScoreMeter score={report.breakdown.harmony} label="Color Harmony & Distance" />
          <ScoreMeter score={report.breakdown.contrast} label="Text & Element Contrast" />
          <ScoreMeter score={report.breakdown.accessibility} label="WCAG Accessibility" />
          <ScoreMeter score={report.breakdown.balance} label="Saturation & Lightness Balance" />
        </div>
      </div>

      {/* Actionable Suggestions */}
      {report.suggestions && report.suggestions.length > 0 && (
        <div className="pt-4 border-t border-zinc-100 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Actionable Polish Suggestions</span>
          </h4>

          <div className="space-y-2">
            {report.suggestions.map((sug, idx) => (
              <div
                key={idx}
                className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-start justify-between gap-3 text-xs"
              >
                <p className="text-zinc-700 leading-relaxed">{sug.text}</p>
                {sug.action && sug.type !== 'praise' && onApplyFix && (
                  <button
                    onClick={() => onApplyFix(sug)}
                    className="shrink-0 font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    <span>Fix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
