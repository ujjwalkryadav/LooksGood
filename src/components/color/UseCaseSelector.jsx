import React from 'react';
import { USE_CASES } from '../../data/useCasesData';
import { Globe, Smartphone, LayoutDashboard, Presentation, Image, Share2, Tv, Briefcase, Sparkles } from 'lucide-react';

const ICON_MAP = {
  Globe,
  Smartphone,
  LayoutDashboard,
  Presentation,
  Image,
  Share2,
  Tv,
  Briefcase,
  Sparkles,
};

export function UseCaseSelector({ selectedUseCase, onSelectUseCase }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-card space-y-4">
      <div>
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">What are you designing?</h3>
        <p className="text-xs text-zinc-500 mt-0.5">Role assignments and previews adapt to your exact medium</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {USE_CASES.map((uc) => {
          const Icon = ICON_MAP[uc.icon] || Globe;
          const isSelected = selectedUseCase === uc.id;

          return (
            <button
              key={uc.id}
              onClick={() => onSelectUseCase(uc.id)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-150 ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/50 text-brand-950 ring-2 ring-brand-500/20 shadow-subtle'
                  : 'border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:bg-white hover:border-zinc-300'
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-brand-500 text-white shadow-sm' : 'bg-zinc-200/60 text-zinc-600'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate">{uc.label}</span>
                <span className="text-[10px] text-zinc-500 block truncate">{uc.description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
