import React, { useState, useMemo } from 'react';
import { FONTS_DATABASE } from '../../data/fontsData';
import { Search, Filter, Sparkles, Check, ArrowRight } from 'lucide-react';
import { loadGoogleFont } from '../../utils/fontLoader';

export function FontExplorer({
  selectedFontId,
  onSelectFont,
  headingFontId,
  bodyFontId,
  onSelectAsHeading,
  onSelectAsBody,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUseCaseFilter, setSelectedUseCaseFilter] = useState('All');

  const categories = ['All', 'Sans Serif', 'Geometric Sans', 'Serif', 'Display Sans', 'Humanist Sans', 'Rounded Sans'];
  const useCaseFilters = ['All', 'Websites', 'Apps', 'Dashboards', 'Presentations', 'Posters', 'YouTube Thumbnails', 'Editorial'];

  // Filter fonts
  const filteredFonts = useMemo(() => {
    return FONTS_DATABASE.filter((font) => {
      const matchesSearch =
        font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        font.personality.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
        font.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || font.category === selectedCategory;

      const matchesUseCase =
        selectedUseCaseFilter === 'All' ||
        font.bestFor.some((bf) => bf.toLowerCase().includes(selectedUseCaseFilter.toLowerCase()));

      return matchesSearch && matchesCat && matchesUseCase;
    });
  }, [searchQuery, selectedCategory, selectedUseCaseFilter]);

  // Load first batch of fonts
  React.useEffect(() => {
    filteredFonts.slice(0, 12).forEach((f) => {
      if (f.googleFontQuery) loadGoogleFont(f.googleFontQuery);
    });
  }, [filteredFonts]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Font Library & Explorer</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Search and preview 25+ curated, high-performance web typefaces</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fonts (e.g. Modern, Editorial, Inter)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Use-Case Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-zinc-500">
        <span className="text-[11px] font-bold uppercase tracking-wider shrink-0 text-zinc-400">Filter By Goal:</span>
        {useCaseFilters.map((uc) => (
          <button
            key={uc}
            onClick={() => setSelectedUseCaseFilter(uc)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-all border ${
              selectedUseCaseFilter === uc
                ? 'bg-brand-50 text-brand-700 border-brand-300 font-bold'
                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
            }`}
          >
            {uc}
          </button>
        ))}
      </div>

      {/* Fonts Grid */}
      {filteredFonts.length === 0 ? (
        <div className="p-8 text-center text-zinc-500 text-xs bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
          No fonts found matching your search. Try resetting the filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredFonts.map((font) => {
            const isSelected = selectedFontId === font.id;
            const isHeading = headingFontId === font.id;
            const isBody = bodyFontId === font.id;

            return (
              <div
                key={font.id}
                onClick={() => onSelectFont(font.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                  isSelected
                    ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/20 shadow-sm'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-subtle'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-zinc-900 group-hover:text-brand-600 transition-colors">
                      {font.name}
                    </span>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-zinc-100 text-zinc-600 rounded">
                      {font.category}
                    </span>
                  </div>

                  {/* Specimen Preview */}
                  <div
                    className="text-xl font-bold text-zinc-800 my-2 truncate"
                    style={{ fontFamily: font.family }}
                  >
                    Design That Inspires
                  </div>

                  <p className="text-[11px] text-zinc-500 line-clamp-2 leading-snug">
                    {font.description}
                  </p>
                </div>

                {/* Bottom Role Badges & Triggers */}
                <div className="pt-3 mt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    {isHeading && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-100 text-brand-800 rounded">
                        Heading
                      </span>
                    )}
                    {isBody && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-zinc-900 text-white rounded">
                        Body
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-brand-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
