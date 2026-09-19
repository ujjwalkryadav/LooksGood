import React, { useState } from 'react';
import { TRENDING_PALETTES, PALETTE_CATEGORIES } from '../../data/trendingPalettes';
import { useSharedDesign } from '../../context/SharedDesignContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useToast } from '../../context/ToastContext';
import { Search, Heart, Copy, Flame, Palette, ArrowRight } from 'lucide-react';

export function TrendingApp({ onUseInStudio }) {
  const { showToast } = useToast();
  const { sendPaletteToColorStudio } = useSharedDesign();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPalettes, setLikedPalettes] = useState({});

  const toggleLike = (id, e) => {
    e.stopPropagation();
    setLikedPalettes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopySingleColor = (hex, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    showToast(`Copied ${hex} to clipboard!`);
  };

  const handleCopyFullPalette = (palette, e) => {
    if (e) e.stopPropagation();
    const text = palette.colors.join(', ');
    navigator.clipboard.writeText(text);
    showToast(`Copied ${palette.name} (${text})!`);
  };

  const handleUseInStudio = (palette, e) => {
    if (e) e.stopPropagation();
    sendPaletteToColorStudio(palette.colors, palette.name);
    if (onUseInStudio) {
      onUseInStudio(palette);
    }
  };

  const filteredPalettes = TRENDING_PALETTES.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.tags.includes(activeCategory);
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="minimal-card rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[#E8E5DF]">
        <div>
          <h2 className="text-xl font-black text-[#0D0C0B] tracking-tight">Trending Palettes</h2>
          <p className="text-xs text-[#57534E] font-medium">
            Explore 100+ curated harmonic color schemes. Click stripes to copy or send directly to Color Studio.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search palettes (warm, SaaS, neon)..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-[#E8E5DF] bg-white text-[#0D0C0B] focus:outline-none focus:ring-2 focus:ring-brand-purple font-medium"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {PALETTE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-xl transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-[#0D0C0B] text-white shadow-sm'
                  : 'bg-white text-[#78716C] hover:text-[#0D0C0B] border border-[#E8E5DF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#78716C] font-bold">
          Showing {filteredPalettes.length} palettes
        </span>
      </div>

      {/* Palettes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPalettes.map((palette) => {
          const isLiked = likedPalettes[palette.id];
          const likesCount = palette.likes + (isLiked ? 1 : 0);

          return (
            <div
              key={palette.id}
              className="minimal-card rounded-3xl overflow-hidden flex flex-col justify-between group"
            >
              {/* Color Stripes Canvas */}
              <div className="w-full h-32 flex overflow-hidden relative cursor-pointer" title="Click stripe to copy color">
                {palette.colors.map((hex, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => handleCopySingleColor(hex, e)}
                    className="flex-1 h-full relative group/stripe flex flex-col justify-end p-2 transition-all hover:flex-[1.6]"
                    style={{ backgroundColor: hex }}
                  >
                    <span className="text-[10px] font-mono font-bold uppercase opacity-0 group-hover/stripe:opacity-100 transition-opacity bg-black/75 text-white px-1.5 py-0.5 rounded backdrop-blur-md self-center shadow-sm">
                      {hex}
                    </span>
                  </div>
                ))}
              </div>

              {/* Palette Info & Action Bar */}
              <div className="p-4 bg-white border-t border-[#E8E5DF] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0D0C0B] tracking-tight">{palette.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => toggleLike(palette.id, e)}
                      className={`p-1.5 rounded-xl border transition-all flex items-center gap-1 text-xs font-mono font-bold ${
                        isLiked
                          ? 'bg-pink-50 border-pink-200 text-pink-600'
                          : 'bg-[#FAF9F6] border-[#E8E5DF] text-[#78716C] hover:text-[#0D0C0B]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-pink-500' : ''}`} />
                      <span>{likesCount}</span>
                    </button>

                    <button
                      onClick={(e) => handleCopyFullPalette(palette, e)}
                      title="Copy full palette"
                      className="p-1.5 rounded-xl bg-[#FAF9F6] border border-[#E8E5DF] text-[#78716C] hover:text-[#0D0C0B]"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#E8E5DF]">
                  <div className="flex items-center gap-1 flex-wrap">
                    {palette.tags.map((t) => (
                      <span key={t} className="text-[9px] font-mono text-[#78716C] bg-[#FAF9F6] px-1.5 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => handleUseInStudio(palette, e)}
                    className="px-3 py-1 text-xs font-bold font-mono text-white bg-brand-purple hover:bg-brand-purpleDark rounded-xl transition-all flex items-center gap-1 shadow-purple-sm hover:scale-105"
                  >
                    <Palette className="w-3 h-3" />
                    <span>Use in Studio</span>
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

export default TrendingApp;
