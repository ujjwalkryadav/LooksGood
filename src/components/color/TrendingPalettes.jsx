import React, { useState } from 'react';
import { TRENDING_PALETTES, PALETTE_CATEGORIES } from '../../data/trendingPalettes';
import { CopyButton } from '../common/CopyButton';
import { useToast } from '../../context/ToastContext';
import { Search, Heart, Sparkles, Copy, Flame, CheckCircle2, ArrowRight } from 'lucide-react';

export function TrendingPalettes({ onApplyPalette, onOpenContrast }) {
  const { showToast } = useToast();
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

  const handleApply = (palette) => {
    if (onApplyPalette) {
      onApplyPalette(palette);
      showToast(`Applied ${palette.name} as primary theme!`);
    }
  };

  // Filter palettes
  const filteredPalettes = TRENDING_PALETTES.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.tags.includes(activeCategory);
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="minimal-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-paprika-light text-paprika border border-paprika-border shadow-subtle">
            <Flame className="w-3.5 h-3.5 text-paprika" />
            <span>COMMUNITY & TRENDING CURATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0D0C0B] tracking-tight">
            Trending Color Palettes
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] font-medium">
            Explore {TRENDING_PALETTES.length} curated color combinations. Click any color strip to copy its exact HEX code.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search warm, neon, pastel, SaaS..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-[#E8E5DF] bg-white text-[#0D0C0B] focus:outline-none focus:ring-2 focus:ring-paprika transition-all font-medium placeholder:text-[#A8A29E]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#78716C] hover:text-[#0D0C0B]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PALETTE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#0D0C0B] text-white shadow-sm'
                    : 'bg-white text-[#78716C] hover:text-[#0D0C0B] hover:bg-[#F2EFE9] border border-[#E8E5DF]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-[#78716C] font-bold">
          Showing {filteredPalettes.length} palettes
        </span>
      </div>

      {/* Palettes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPalettes.map((palette) => {
          const isLiked = likedPalettes[palette.id];
          const likesCount = palette.likes + (isLiked ? 1 : 0);

          return (
            <div
              key={palette.id}
              className="minimal-card rounded-3xl overflow-hidden flex flex-col justify-between group"
            >
              {/* Interactive Color Strips Canvas */}
              <div className="w-full h-36 flex overflow-hidden relative cursor-pointer" title="Click any stripe to copy color">
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
              <div className="p-4 bg-white border-t border-[#E8E5DF] flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-[#0D0C0B] tracking-tight">{palette.name}</h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {palette.tags.map((tag) => (
                      <span
                        key={tag}
                        onClick={() => setActiveCategory(tag)}
                        className="text-[10px] font-mono text-[#78716C] hover:text-[#0D0C0B] bg-[#FAF9F6] px-1.5 py-0.5 rounded border border-[#E8E5DF] cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => toggleLike(palette.id, e)}
                    className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-mono font-bold ${
                      isLiked
                        ? 'bg-paprika-light border-paprika-border text-paprika'
                        : 'bg-white border-[#E8E5DF] text-[#78716C] hover:text-[#0D0C0B] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-paprika text-paprika' : ''}`} />
                    <span>{likesCount}</span>
                  </button>

                  <button
                    onClick={(e) => handleCopyFullPalette(palette, e)}
                    title="Copy full palette"
                    className="p-2 rounded-xl bg-white border border-[#E8E5DF] text-[#78716C] hover:text-[#0D0C0B] hover:bg-[#FAF9F6] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
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
