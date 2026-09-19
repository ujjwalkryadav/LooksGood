import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

export function HarmonySelector({ harmonies, selectedHarmony, onSelectHarmony, onOpenWhy }) {
  const harmonyKeys = [
    { key: 'complementary', label: 'Complementary', simple: 'Opposite & Punchy' },
    { key: 'analogous', label: 'Analogous', simple: 'Neighbors & Calm' },
    { key: 'triadic', label: 'Triadic', simple: '3-Point Vibrant' },
    { key: 'splitComplementary', label: 'Split Complementary', simple: 'Nuanced Contrast' },
    { key: 'monochromatic', label: 'Monochromatic', simple: 'Single Hue Minimal' },
    { key: 'tetradic', label: 'Tetradic', simple: '4-Way Versatile' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Color Relationships</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Calculated combinations that naturally work well together</p>
        </div>
        <button
          onClick={onOpenWhy}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200/80 rounded-lg transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Why this works</span>
        </button>
      </div>

      {/* Harmony Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {harmonyKeys.map(({ key, label, simple }) => {
          const item = harmonies[key];
          const isSelected = selectedHarmony === key;
          if (!item) return null;

          return (
            <button
              key={key}
              onClick={() => onSelectHarmony(key)}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all duration-200 group ${
                isSelected
                  ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/20 shadow-sm'
                  : 'border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold ${isSelected ? 'text-brand-600' : 'text-zinc-800'}`}>
                  {label}
                </span>
              </div>

              {/* Swatch Mini Strip */}
              <div className="flex h-4 w-full rounded-md overflow-hidden border border-black/10 mb-2 shadow-inner">
                {item.colors.slice(0, 4).map((c, i) => (
                  <div key={i} className="flex-1 h-full" style={{ backgroundColor: c.hex }} />
                ))}
              </div>

              <span className="text-[10px] text-zinc-500 leading-tight block">{simple}</span>
            </button>
          );
        })}
      </div>

      {/* Active Harmony Description Banner */}
      {harmonies[selectedHarmony] && (
        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 flex items-start gap-2.5 text-xs text-zinc-600">
          <HelpCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-zinc-800">{harmonies[selectedHarmony].name}: </span>
            {harmonies[selectedHarmony].description}
          </div>
        </div>
      )}
    </div>
  );
}
