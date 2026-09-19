import React, { useState, useEffect } from 'react';
import { FONTS_DATABASE, getFontById } from '../../../data/fontsData';
import { loadGoogleFont } from '../../../utils/fontLoader';
import { useSharedDesign } from '../../../context/SharedDesignContext';
import { useToast } from '../../../context/ToastContext';
import { Search, ArrowRight } from 'lucide-react';

const CATEGORIES = ['All', 'Sans Serif', 'Serif', 'Display', 'Monospace'];

export function FontExplorerTab({ onNavigateTab }) {
  const { showToast } = useToast();
  const { activeFontId, setActiveFontId } = useSharedDesign();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [samplePhrase, setSamplePhrase] = useState('Design is intelligence made visible.');

  const selectedFont = getFontById(activeFontId) || FONTS_DATABASE[0];

  // Preload visible fonts
  useEffect(() => {
    FONTS_DATABASE.slice(0, 15).forEach((f) => {
      if (f.googleFontQuery) loadGoogleFont(f.googleFontQuery);
    });
  }, []);

  const filtered = FONTS_DATABASE.filter((f) => {
    const matchesCat =
      selectedCategory === 'All' ||
      f.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.personality.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleSelectFont = (font) => {
    if (font.googleFontQuery) loadGoogleFont(font.googleFontQuery);
    setActiveFontId(font.id);
    showToast(`Selected "${font.name}" as active font!`, 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header & Controls */}
      <div className="bg-white/80 backdrop-blur-xl border border-stone-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-600 animate-pulse" />
            <h2 className="text-xl font-black tracking-tight text-stone-900 font-display">
              Font Explorer & Directory
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Explore 30+ Google fonts categorized by classification, personality, and visual voice.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fonts (Inter, Serif, Brutalist)..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white font-medium"
          />
        </div>
      </div>

      {/* Category Pills & Interactive Sample Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            value={samplePhrase}
            onChange={(e) => setSamplePhrase(e.target.value)}
            placeholder="Custom test phrase..."
            className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Fonts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((font) => {
          const isSelected = activeFontId === font.id;
          return (
            <div
              key={font.id}
              onClick={() => handleSelectFont(font)}
              className={`bg-white rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer hover:shadow-xl ${
                isSelected
                  ? 'border-pink-500 ring-2 ring-pink-500/20 shadow-lg'
                  : 'border-stone-200/80 hover:border-stone-300'
              }`}
            >
              {/* Header: Name, Category, Designer */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-stone-900 tracking-tight font-sans">
                    {font.name}
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                    {font.category}
                  </span>
                </div>
                <span className="text-[11px] text-stone-400 font-medium block">
                  By {font.designer}
                </span>
              </div>

              {/* Live Preview Text Strip */}
              <div className="py-2 border-y border-stone-100">
                <p
                  style={{ fontFamily: font.family }}
                  className="text-2xl text-stone-900 leading-snug line-clamp-2"
                >
                  {samplePhrase}
                </p>
              </div>

              {/* Personality Tags */}
              <div className="space-y-3">
                <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                  {font.personality.slice(0, 3).map((p, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-[10px] font-mono text-stone-400">
                    {font.weights?.length || 4} Weights Available
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectFont(font);
                      if (onNavigateTab) onNavigateTab('pairings');
                    }}
                    className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center space-x-1"
                  >
                    <span>View Pairings</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
