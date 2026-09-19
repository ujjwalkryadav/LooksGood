import React, { useState } from 'react';
import { STUDIOS_REGISTRY } from '../registry';
import {
  Palette,
  Type,
  Layers,
  Sparkles,
  LayoutGrid,
  Search,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sliders,
  Code2,
  Flame,
  Image as ImageIcon,
  ArrowRightLeft,
  Star,
} from 'lucide-react';

const ICONS_MAP = {
  Palette,
  Type,
  Layers,
  Sparkles,
  LayoutGrid,
  Search,
  Sliders,
  Code2,
  Flame,
  Image: ImageIcon,
  CheckCircle2,
  Star,
  ArrowRightLeft,
};

export function AllToolsDirectory({ onSelectStudioTab }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudios = STUDIOS_REGISTRY.map((studio) => {
    const matchingTabs = studio.tabs.filter(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        studio.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...studio,
      matchingTabs,
    };
  }).filter((s) => s.matchingTabs.length > 0 || searchQuery === '');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 select-text pb-12 animate-fade-in">
      {/* Directory Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-purple-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-300">
                LooksGood Platform Architecture
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-white">
              Creative Studios & Tools Directory
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-medium max-w-2xl leading-relaxed">
              Explore dedicated studios for colors and typography, alongside our upcoming generative design engines.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all tools, gradients, fonts..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-stone-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>
      </div>

      {/* Studios Grid */}
      <div className="space-y-8">
        {filteredStudios.map((studio) => {
          const StudioIcon = ICONS_MAP[studio.icon] || Sparkles;
          const isActive = studio.status === 'active';

          return (
            <div
              key={studio.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6"
            >
              {/* Studio Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-5">
                <div className="flex items-center space-x-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: studio.accentColor }}
                  >
                    <StudioIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h2 className="text-xl font-black text-stone-900 font-display">
                        {studio.name}
                      </h2>
                      <span
                        className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {isActive ? studio.badge : 'ROADMAP'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      {studio.description}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <button
                    onClick={() => onSelectStudioTab(studio.id, studio.defaultTab)}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-purple-600 text-white font-bold text-xs flex items-center space-x-2 transition self-start sm:self-center active:scale-95"
                  >
                    <span>Open {studio.shortName} Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sub-Tools Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {studio.tabs.map((tab) => {
                  const TabIcon = ICONS_MAP[tab.icon] || Sparkles;

                  return (
                    <div
                      key={tab.id}
                      onClick={() => {
                        if (isActive) onSelectStudioTab(studio.id, tab.id);
                      }}
                      className={`p-4 rounded-2xl border transition-all duration-200 text-left flex flex-col justify-between ${
                        isActive
                          ? 'border-stone-200 bg-stone-50/60 hover:bg-white hover:border-purple-300 hover:shadow-md cursor-pointer group'
                          : 'border-stone-200/50 bg-stone-50/30 opacity-70 cursor-not-allowed'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{
                              backgroundColor: isActive ? studio.accentColor + '15' : '#E5E7EB',
                              color: isActive ? studio.accentColor : '#6B7280',
                            }}
                          >
                            <TabIcon className="w-4 h-4" />
                          </div>

                          {isActive ? (
                            <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
                          ) : (
                            <span className="text-[9px] font-mono text-stone-400 uppercase">
                              Upcoming
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xs font-bold text-stone-900 group-hover:text-purple-600 transition-colors">
                            {tab.name}
                          </h3>
                          <p className="text-[11px] text-stone-500 font-medium mt-0.5 leading-snug">
                            {tab.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
