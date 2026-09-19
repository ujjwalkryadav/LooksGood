import React from 'react';
import { getHeadingsForBody, getFontById } from '../../data/fontsData';
import { loadGoogleFont } from '../../utils/fontLoader';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

export function ReversePairingSection({ bodyFontId, headingFontId, onSelectHeadingFont }) {
  const bodyFont = getFontById(bodyFontId);
  const headings = getHeadingsForBody(bodyFontId);

  React.useEffect(() => {
    headings.slice(0, 6).forEach((h) => {
      if (h.headingFont?.googleFontQuery) {
        loadGoogleFont(h.headingFont.googleFontQuery);
      }
    });
  }, [headings]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-card space-y-5">
      <div>
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
          Reverse Pairing: Ideal Headings for "{bodyFont.name}" Body
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Already love your body font? Here are commanding headlines that elevate it.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {headings.slice(0, 6).map((item) => {
          const isCurrentHeading = headingFontId === item.headingFont.id;

          return (
            <div
              key={item.headingFont.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                isCurrentHeading
                  ? 'bg-brand-50/40 border-brand-500 ring-2 ring-brand-500/20 shadow-sm'
                  : 'bg-zinc-50/60 border-zinc-200 hover:bg-white hover:border-zinc-300 shadow-subtle'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-zinc-900">{item.headingFont.name}</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-zinc-100 text-zinc-700 rounded-full">
                    {item.score}% Match
                  </span>
                </div>

                <div
                  className="text-lg font-bold text-zinc-900 my-1 truncate"
                  style={{ fontFamily: item.headingFont.family }}
                >
                  Visual Impact Matters
                </div>

                <p className="text-[11px] text-zinc-500 leading-relaxed italic line-clamp-2">
                  "{item.why}"
                </p>
              </div>

              <button
                onClick={() => onSelectHeadingFont(item.headingFont.id)}
                className={`w-full py-1.5 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1 ${
                  isCurrentHeading
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                {isCurrentHeading ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Active Heading</span>
                  </>
                ) : (
                  <>
                    <span>Use {item.headingFont.name}</span>
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
