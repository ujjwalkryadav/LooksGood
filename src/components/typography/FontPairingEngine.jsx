import React from 'react';
import { getPairingsForHeading, getFontById } from '../../data/fontsData';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { loadGoogleFont } from '../../utils/fontLoader';

export function FontPairingEngine({ headingFontId, bodyFontId, onSelectBodyFont, onOpenWhy }) {
  const headingFont = getFontById(headingFontId);
  const pairings = getPairingsForHeading(headingFontId);

  React.useEffect(() => {
    pairings.forEach((p) => {
      if (p.bodyFont?.googleFontQuery) {
        loadGoogleFont(p.bodyFont.googleFontQuery);
      }
    });
  }, [pairings]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
            Automatic Font Pairings for "{headingFont.name}"
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Engineered typographic harmonies that balance personality and reading comfort
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pairings.map((pair) => {
          const isCurrentBody = bodyFontId === pair.bodyFont.id;

          return (
            <div
              key={pair.fontId}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                isCurrentBody
                  ? 'bg-brand-50/40 border-brand-500 ring-2 ring-brand-500/20 shadow-sm'
                  : 'bg-zinc-50/60 border-zinc-200 hover:bg-white hover:border-zinc-300 shadow-subtle'
              }`}
            >
              <div>
                {/* Header & Compatibility Score */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-zinc-900">{pair.bodyFont.name}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white border border-zinc-200 text-zinc-600 rounded">
                      {pair.bodyFont.category}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-emerald-100 text-emerald-800 rounded-full">
                    {pair.score}% Match
                  </span>
                </div>

                {/* Specimen Preview */}
                <div className="p-3 bg-white rounded-xl border border-zinc-200/80 mb-3 space-y-1">
                  <div
                    className="text-lg font-bold text-zinc-900"
                    style={{ fontFamily: headingFont.family }}
                  >
                    The Beauty of Form
                  </div>
                  <p
                    className="text-xs text-zinc-600 leading-relaxed font-normal"
                    style={{ fontFamily: pair.bodyFont.family }}
                  >
                    Clear typography guides the eye with rhythm, balance, and effortless comprehension.
                  </p>
                </div>

                {/* Why Explanation */}
                <p className="text-xs text-zinc-600 leading-relaxed italic">
                  "{pair.why}"
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectBodyFont(pair.bodyFont.id)}
                className={`w-full py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                  isCurrentBody
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-100 shadow-subtle'
                }`}
              >
                {isCurrentBody ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Active Body Pairing</span>
                  </>
                ) : (
                  <>
                    <span>Apply {pair.bodyFont.name} Body</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
