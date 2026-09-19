import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, Lightbulb, Check } from 'lucide-react';

export function TheoryCard({ principle }) {
  const [viewMode, setViewMode] = useState('good'); // 'good' or 'bad'

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-card space-y-5 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight">{principle.title}</h3>
            <p className="text-xs text-brand-600 font-semibold mt-0.5">{principle.tagline}</p>
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-zinc-600 leading-relaxed">{principle.summary}</p>

        {/* Interactive Bad vs Good Demonstrator */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Interactive Demo</span>
            <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
              <button
                onClick={() => setViewMode('bad')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  viewMode === 'bad' ? 'bg-rose-500 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                ✕ Bad Example
              </button>
              <button
                onClick={() => setViewMode('good')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  viewMode === 'good' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                ✓ Good Example
              </button>
            </div>
          </div>

          {/* Visual Canvas Demo based on principle */}
          <div
            className={`p-4 rounded-xl border transition-all duration-300 min-h-[130px] flex flex-col justify-center ${
              viewMode === 'bad' ? 'bg-rose-50/50 border-rose-200' : 'bg-emerald-50/40 border-emerald-200'
            }`}
          >
            {/* Visual simulation for each type */}
            {principle.id === 'contrast' && (
              <div className="space-y-1 text-center">
                <div
                  className={`text-base font-bold ${
                    viewMode === 'bad' ? 'text-zinc-300' : 'text-zinc-900'
                  }`}
                >
                  {viewMode === 'bad' ? 'Can you read this faint text?' : 'Crystal Clear High Contrast'}
                </div>
                <p className={`text-xs ${viewMode === 'bad' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  {viewMode === 'bad'
                    ? 'Faint gray text on white causes immense eye strain and fails WCAG AA.'
                    : 'Deep slate text against white gives effortless scanning and instant comprehension.'}
                </p>
              </div>
            )}

            {principle.id === 'hierarchy' && (
              <div className={`space-y-1.5 ${viewMode === 'bad' ? 'text-center' : 'text-left'}`}>
                <div
                  className={`font-bold ${
                    viewMode === 'bad' ? 'text-xs text-zinc-700' : 'text-xl text-zinc-900 font-extrabold'
                  }`}
                >
                  Headline That Commands Focus
                </div>
                <div className={`text-xs ${viewMode === 'bad' ? 'font-normal text-zinc-700' : 'text-zinc-500'}`}>
                  Secondary supportive subtitle explaining context.
                </div>
              </div>
            )}

            {principle.id === 'white-space' && (
              <div
                className={`rounded-lg border border-black/10 bg-white transition-all ${
                  viewMode === 'bad' ? 'p-1 text-[10px]' : 'p-5 text-xs'
                }`}
              >
                <div className="font-bold text-zinc-900">Spacious Comfort Card</div>
                <div className="text-zinc-500 mt-1">Breathing room communicates luxury and calm.</div>
              </div>
            )}

            {principle.id === 'alignment' && (
              <div className={`space-y-2 ${viewMode === 'bad' ? 'space-y-1 pl-4' : 'pl-0'}`}>
                <div className={`h-2.5 bg-brand-500 rounded ${viewMode === 'bad' ? 'w-24 ml-6' : 'w-28'}`} />
                <div className={`h-2.5 bg-zinc-400 rounded ${viewMode === 'bad' ? 'w-36 ml-2' : 'w-48'}`} />
                <div className={`h-2.5 bg-zinc-300 rounded ${viewMode === 'bad' ? 'w-20 ml-8' : 'w-36'}`} />
              </div>
            )}

            {principle.id === 'proximity' && (
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-zinc-900">Article Title</div>
                  <div className="text-[11px] text-zinc-500">Related metadata closely grouped</div>
                </div>
                {viewMode === 'bad' && <div className="text-[10px] text-rose-600 italic">Unrelated text colliding</div>}
              </div>
            )}

            {principle.id === 'color' && (
              <div className="flex items-center gap-2">
                <div
                  className={`h-8 flex-1 rounded-lg flex items-center justify-center text-xs font-bold ${
                    viewMode === 'bad' ? 'bg-amber-400 text-purple-900' : 'bg-brand-600 text-white'
                  }`}
                >
                  Primary CTA
                </div>
                <div
                  className={`h-8 px-3 rounded-lg flex items-center justify-center text-xs font-semibold ${
                    viewMode === 'bad' ? 'bg-emerald-400 text-pink-900' : 'bg-zinc-200 text-zinc-800'
                  }`}
                >
                  Secondary
                </div>
              </div>
            )}

            {!['contrast', 'hierarchy', 'white-space', 'alignment', 'proximity', 'color'].includes(principle.id) && (
              <div className="text-center space-y-1">
                <span className="text-xs font-bold block text-zinc-800">
                  {viewMode === 'bad' ? principle.badExample.title : principle.goodExample.title}
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  {viewMode === 'bad' ? principle.badExample.description : principle.goodExample.description}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* One Practical Rule & Checklist */}
      <div className="space-y-3 pt-3 border-t border-zinc-100">
        {/* The Golden Rule */}
        <div className="p-3 bg-zinc-900 text-white rounded-xl shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-brand-400 text-[10px] font-bold uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>One Practical Rule</span>
          </div>
          <p className="text-xs font-medium text-zinc-100 leading-snug">
            "{principle.rule}"
          </p>
        </div>

        {/* Quick Tips */}
        {principle.quickTips && (
          <ul className="space-y-1 text-[11px] text-zinc-600">
            {principle.quickTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
