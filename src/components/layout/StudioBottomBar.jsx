import React from 'react';
import {
  Wand2,
  Sparkles,
  Layers,
  CheckCircle2,
  Image as ImageIcon,
  Sliders,
  Flame,
  Code2,
  Search,
  Star,
  LayoutGrid,
  ArrowRightLeft,
} from 'lucide-react';
import { getStudioById } from '../../studios/registry';

const ICONS_MAP = {
  Wand2,
  Sparkles,
  Layers,
  CheckCircle2,
  Image: ImageIcon,
  Sliders,
  Flame,
  Code2,
  Search,
  Star,
  LayoutGrid,
  ArrowRightLeft,
};

export function StudioBottomBar({ studioId, activeTab, onSelectTab }) {
  const studioMeta = getStudioById(studioId);
  if (!studioMeta || !studioMeta.tabs) return null;

  const isColorStudio = studioId === 'colors';

  return (
    <div className="fixed bottom-5 inset-x-0 mx-auto w-fit z-40 px-4 pointer-events-auto animate-fade-in select-none">
      <div className="p-1.5 bg-[#0D0C0B]/95 backdrop-blur-2xl border border-stone-800/90 rounded-2xl shadow-2xl shadow-black/60 flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto max-w-[95vw]">
        {/* Studio Badge Indicator */}
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-stone-900/80 rounded-xl border border-stone-800 text-[11px] font-mono font-bold text-stone-400 mr-1 flex-shrink-0">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: studioMeta.accentColor }}
          />
          <span className="text-white">{studioMeta.shortName}</span>
        </div>

        {/* Sub-Tools List */}
        {studioMeta.tabs.map((tab, idx) => {
          const Icon = ICONS_MAP[tab.icon] || Sparkles;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap flex-shrink-0 group ${
                isActive
                  ? isColorStudio
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400/40'
                    : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30 ring-1 ring-pink-400/40'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
              }`}
              title={tab.desc}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-stone-200'}`} />
              <span>{tab.name.split(' ')[0]}</span>
              <kbd className={`hidden lg:inline text-[9px] font-mono px-1 py-0.2 rounded ${
                isActive ? 'bg-white/20 text-white' : 'bg-stone-800 text-stone-500'
              }`}>
                {idx + 1}
              </kbd>
            </button>
          );
        })}
      </div>
    </div>
  );
}
