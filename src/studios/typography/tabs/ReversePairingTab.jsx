import React, { useState } from 'react';
import { FONTS_DATABASE, getFontById, getHeadingsForBody } from '../../../data/fontsData';
import { useSharedDesign } from '../../../context/SharedDesignContext';
import { useToast } from '../../../context/ToastContext';
import { ArrowRightLeft, Sparkles, ArrowRight, Check } from 'lucide-react';

export function ReversePairingTab({ onNavigateTab }) {
  const { showToast } = useToast();
  const { setActiveFontId } = useSharedDesign();

  const [selectedBodyId, setSelectedBodyId] = useState('inter');
  const bodyFont = getFontById(selectedBodyId) || FONTS_DATABASE[0];
  const matchingHeadings = getHeadingsForBody(selectedBodyId);

  const handleApply = (headingFont) => {
    setActiveFontId(headingFont.id);
    showToast(`Set "${headingFont.name}" as Heading Font paired with "${bodyFont.name}"!`, 'success');
    if (onNavigateTab) onNavigateTab('pairings');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-stone-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-600 animate-pulse" />
            <h2 className="text-xl font-black tracking-tight text-stone-900 font-display">
              Reverse Pairing Finder
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Already have a favorite body font? Find stunning display & heading fonts that complement it perfectly.
          </p>
        </div>
      </div>

      {/* Body Font Selector */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-3">
        <label className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500 block">
          Choose Your Anchor Body Font
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {FONTS_DATABASE.filter((f) => f.ratings?.body >= 4).map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedBodyId(f.id)}
              className={`p-3 rounded-2xl border text-center transition ${
                selectedBodyId === f.id
                  ? 'border-pink-500 bg-pink-50/70 shadow-sm ring-2 ring-pink-500/20 text-pink-900 font-bold'
                  : 'border-stone-200 bg-stone-50/50 hover:bg-white text-stone-700'
              }`}
            >
              <span className="text-xs block font-sans truncate">{f.name}</span>
              <span className="text-[10px] font-mono text-stone-400 block">{f.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Matching Heading Recommendations */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500">
          Recommended Heading Fonts for "{bodyFont.name}" ({matchingHeadings.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {matchingHeadings.map((heading, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-xl transition-all space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-stone-900 font-sans group-hover:text-pink-600 transition-colors">
                      {heading.name}
                    </h4>
                    <span className="text-[10px] font-mono text-stone-400">
                      {heading.category}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    High Compatibility
                  </span>
                </div>

                {/* Sample Heading Preview in heading font */}
                <p
                  style={{ fontFamily: heading.family }}
                  className="text-2xl font-black text-stone-900 pt-2 line-clamp-1"
                >
                  Unlocking Creative Freedom
                </p>

                {/* Sample Body in selected body font */}
                <p
                  style={{ fontFamily: bodyFont.family }}
                  className="text-xs text-stone-600 leading-relaxed line-clamp-2"
                >
                  Paired with {bodyFont.name}, this headline style establishes high visual tension
                  and structural rhythm across your entire user interface.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
                <button
                  onClick={() => handleApply(heading)}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-pink-600 text-white font-bold text-xs flex items-center space-x-1.5 transition active:scale-95"
                >
                  <span>Apply Pairing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
