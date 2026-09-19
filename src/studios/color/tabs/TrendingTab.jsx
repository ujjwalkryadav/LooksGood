import React, { useState } from 'react';
import { TRENDING_PALETTES } from '../../../data/trendingPalettes';
import { useSharedDesign } from '../../../context/SharedDesignContext';
import { useToast } from '../../../context/ToastContext';
import { Search, Heart, Sparkles, Copy, ArrowRight, CheckCheck, Check } from 'lucide-react';
import { hexToHsl } from '../../../utils/colorUtils';

const CATEGORIES = ['All', 'Warm', 'Cool', 'Neon', 'Earthy', 'SaaS', 'Dark', 'Pastel'];

export function TrendingTab({ onNavigateTab }) {
  const { showToast } = useToast();
  const { sendPaletteToColorStudio } = useSharedDesign();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedMap, setLikedMap] = useState({});
  const [copiedHex, setCopiedHex] = useState(null);
  const [copiedPalId, setCopiedPalId] = useState(null);

  const filtered = TRENDING_PALETTES.filter((p) => {
    const matchesCat =
      selectedCategory === 'All' ||
      p.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCopySingleHex = (e, hex) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${hex} to clipboard!`, 'success');
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleCopyPaletteHexes = (e, item) => {
    e.stopPropagation();
    const hexList = item.colors.join(', ');
    navigator.clipboard.writeText(hexList);
    setCopiedPalId(item.id);
    showToast(`Copied all ${item.colors.length} hex codes!`, 'success');
    setTimeout(() => setCopiedPalId(null), 2000);
  };

  const handleApplyPalette = (palette) => {
    sendPaletteToColorStudio({
      primary: palette.colors[2] || palette.colors[0],
      secondary: palette.colors[1] || palette.colors[0],
      accent: palette.colors[3] || palette.colors[2],
      background: palette.colors[4] || '#FAF9F6',
      text: palette.colors[0] || '#0D0C0B',
    });
    showToast(`Loaded "${palette.name}" into Color Studio!`, 'success');
    if (onNavigateTab) onNavigateTab('palette');
  };

  const handleToggleLike = (id) => {
    setLikedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 select-text">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
            <h2 className="text-xl font-black tracking-tight text-stone-900 font-display">
              Trending Palettes & Inspiration
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Click any color swatch to instantly copy its HEX code to clipboard.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search palettes (SaaS, Neon, Dark)..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white font-medium shadow-2xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Palettes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => {
          const isLiked = !!likedMap[item.id];
          const isPalCopied = copiedPalId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              {/* 5-Color Horizontal Swatch Strip with Instant Auto-Copy */}
              <div className="space-y-1.5">
                <div className="w-full h-24 rounded-2xl flex overflow-hidden shadow-inner border border-stone-200 group-hover:scale-[1.01] transition-transform">
                  {item.colors.map((hex, i) => {
                    const isDark = hexToHsl(hex).l < 55;
                    const isThisCopied = copiedHex === hex;

                    return (
                      <div
                        key={i}
                        style={{ backgroundColor: hex }}
                        onClick={(e) => handleCopySingleHex(e, hex)}
                        className="flex-1 h-full relative group/swatch hover:flex-[1.6] transition-all cursor-pointer flex flex-col items-center justify-between p-1.5 select-none"
                        title={`Click to copy ${hex}`}
                      >
                        {/* Top Indicator */}
                        <span
                          className={`text-[8px] font-mono font-bold uppercase px-1 py-0.2 rounded transition-opacity ${
                            isDark ? 'bg-black/40 text-white' : 'bg-white/70 text-stone-900'
                          } ${isThisCopied ? 'opacity-100' : 'opacity-0 group-hover/swatch:opacity-100'}`}
                        >
                          {isThisCopied ? '✓' : `C${i + 1}`}
                        </span>

                        {/* Bottom Hex Code Badge */}
                        <div
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black transition-all ${
                            isDark ? 'bg-black/50 text-white' : 'bg-white/80 text-stone-900'
                          } ${isThisCopied ? 'ring-2 ring-emerald-400 scale-105' : 'group-hover/swatch:shadow-sm'}`}
                        >
                          {isThisCopied ? 'COPIED!' : hex}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 px-1">
                  <span>Click color to copy hex</span>
                  <span>{item.colors.length} Colors</span>
                </div>
              </div>

              {/* Title & Tags */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-stone-900 font-sans group-hover:text-purple-700 transition-colors">
                    {item.name}
                  </h4>
                  <button
                    onClick={() => handleToggleLike(item.id)}
                    className={`flex items-center space-x-1 text-xs font-mono font-bold transition cursor-pointer ${
                      isLiked ? 'text-rose-600' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600' : ''}`} />
                    <span>{item.likes + (isLiked ? 1 : 0)}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => handleCopyPaletteHexes(e, item)}
                  className="text-xs font-mono font-bold text-stone-600 hover:text-stone-950 flex items-center space-x-1.5 cursor-pointer transition"
                >
                  {isPalCopied ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied All!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-purple-600" />
                      <span>Copy All</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleApplyPalette(item)}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-purple-600 text-white font-bold text-xs flex items-center space-x-1.5 transition active:scale-95 shadow-xs cursor-pointer"
                >
                  <span>Use in Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
