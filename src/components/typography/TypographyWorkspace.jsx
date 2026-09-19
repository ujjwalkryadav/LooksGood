import React, { useState, useEffect } from 'react';
import { FONTS_DATABASE, getFontById, getPairingsForHeading, getHeadingsForBody } from '../../data/fontsData';
import { loadGoogleFont } from '../../utils/fontLoader';
import { Search, Star, CheckCircle2, XCircle, Type, ArrowRight, Code2, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const FONT_CATEGORIES = ['All', 'sans-serif', 'serif', 'display', 'monospace'];

export function TypographyWorkspace({ activeFontId, onSelectFont }) {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('pairings'); // 'pairings', 'reverse', 'playground'
  const [customText, setCustomText] = useState('The art of good design is making the right things stand out.');
  const [fontSize, setFontSize] = useState(32);
  const [fontWeight, setFontWeight] = useState(600);
  const [lineHeight, setLineHeight] = useState(1.4);

  const selectedFont = getFontById(activeFontId);
  const pairings = getPairingsForHeading(selectedFont.id);
  const reverseHeadings = getHeadingsForBody(selectedFont.id);

  // Selected pairing preview font
  const [pairedBodyId, setPairedBodyId] = useState(() => {
    return pairings[0]?.bodyFont?.id || 'inter';
  });

  const pairedBodyFont = getFontById(pairedBodyId);

  // Load active fonts dynamically
  useEffect(() => {
    if (selectedFont?.googleFontQuery) loadGoogleFont(selectedFont.googleFontQuery);
    if (pairedBodyFont?.googleFontQuery) loadGoogleFont(pairedBodyFont.googleFontQuery);
  }, [selectedFont, pairedBodyFont]);

  // Filter fonts
  const filteredFonts = FONTS_DATABASE.filter((f) => {
    const matchesCategory = selectedCategory === 'All' || f.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.personality.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i <= rating ? 'text-amber-500 fill-amber-500' : 'text-[#D5D1C8]'}`}
          />
        ))}
      </div>
    );
  };

  const getRatingBadge = (score) => {
    if (score >= 5) return <span className="text-emerald-700 font-bold font-mono">Excellent ✓</span>;
    if (score >= 4) return <span className="text-[#0D0C0B] font-semibold font-mono">Good ✓</span>;
    if (score >= 3) return <span className="text-amber-700 font-medium font-mono">Acceptable</span>;
    return <span className="text-rose-700 font-normal font-mono">Avoid</span>;
  };

  const handleCopyPairingCSS = () => {
    const css = `/* LooksGood Font Pairing */\n/* Heading: ${selectedFont.name} */\nh1, h2, h3, h4 {\n  font-family: ${selectedFont.family};\n}\n\n/* Body: ${pairedBodyFont.name} */\np, span, body {\n  font-family: ${pairedBodyFont.family};\n}`;
    navigator.clipboard.writeText(css);
    showToast(`Copied ${selectedFont.name} + ${pairedBodyFont.name} CSS snippet!`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="minimal-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-paprika-light text-paprika border border-paprika-border shadow-subtle">
            <Type className="w-3.5 h-3.5" />
            <span>TYPOGRAPHY PAIRING & HIERARCHY STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0D0C0B] tracking-tight">
            Find the Perfect <span className="text-paprika">Font Pairings.</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] font-medium">
            Inspect font personalities, recommended UI roles, verified Google Font pairings, and live editorial scale.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fonts (e.g. Inter, Serif)..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-[#E8E5DF] bg-white text-[#0D0C0B] focus:outline-none focus:ring-2 focus:ring-paprika transition-all font-medium placeholder:text-[#A8A29E]"
          />
        </div>
      </div>

      {/* Main Workspace Layout (Desktop 3-Column Studio) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Popular Font Selection List */}
        <div className="lg:col-span-4 minimal-card rounded-3xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between px-1 pb-2 border-b border-[#E8E5DF]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">
              Fonts ({filteredFonts.length})
            </h3>
            <span className="text-[10px] font-mono text-paprika font-bold">Click to Inspect</span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {FONT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg uppercase transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#0D0C0B] text-white shadow-sm'
                    : 'bg-[#FAF9F6] text-[#78716C] hover:text-[#0D0C0B] border border-[#E8E5DF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredFonts.map((font) => {
              const isSelected = selectedFont.id === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => {
                    onSelectFont(font.id);
                    const newPairs = getPairingsForHeading(font.id);
                    if (newPairs.length > 0) setPairedBodyId(newPairs[0].bodyFont.id);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#0D0C0B] text-white border-[#0D0C0B] shadow-sm scale-[1.01]'
                      : 'bg-white border-[#E8E5DF] text-[#0D0C0B] hover:bg-[#FAF9F6] hover:border-paprika'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold tracking-tight">{font.name}</span>
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#FAF9F6] text-[#78716C] border border-[#E8E5DF]'
                        }`}
                      >
                        {font.category}
                      </span>
                    </div>
                    <div
                      className={`text-xs truncate ${isSelected ? 'text-zinc-300' : 'text-[#78716C]'}`}
                      style={{ fontFamily: font.family }}
                    >
                      Design without guesswork
                    </div>
                  </div>

                  <span className={`text-xs font-bold ${isSelected ? 'text-paprika' : 'text-[#78716C]'}`}>
                    Aa →
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center & Right Columns: Selected Font Details, Roles, Context & Pairings */}
        <div className="lg:col-span-8 space-y-6">
          {/* Selected Font Header & Specimen */}
          <div className="minimal-card rounded-3xl p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E5DF]">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#0D0C0B] tracking-tight">
                    {selectedFont.name}
                  </h3>
                  <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase tracking-wider bg-paprika-light text-paprika rounded-lg border border-paprika-border">
                    {selectedFont.category}
                  </span>
                </div>
                <p className="text-xs text-[#78716C] font-mono">
                  Designed by {selectedFont.designer || 'Google Fonts'}
                </p>
              </div>

              {/* Large "Aa" Specimen Badge */}
              <div
                className="w-16 h-16 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DF] flex items-center justify-center text-3xl font-extrabold text-[#0D0C0B] shadow-subtle shrink-0"
                style={{ fontFamily: selectedFont.family }}
              >
                Aa
              </div>
            </div>

            {/* Personality Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-bold uppercase text-[#78716C]">Personality:</span>
              {selectedFont.personality?.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-semibold bg-[#FAF9F6] text-[#57534E] border border-[#E8E5DF] rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Visual Role Recommendation Matrix */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">
                Best Used For (Role Recommendation)
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { role: 'MAIN TITLE', score: selectedFont.ratings?.heading || 5 },
                  { role: 'SUBTITLE', score: selectedFont.ratings?.subtitle || 5 },
                  { role: 'BODY TEXT', score: selectedFont.ratings?.body || 4 },
                  { role: 'UI ELEMENTS', score: selectedFont.ratings?.ui || 4 },
                  { role: 'BUTTONS', score: Math.min(5, (selectedFont.ratings?.ui || 4) + 1) },
                  { role: 'DISPLAY / HERO', score: selectedFont.ratings?.display || 3 },
                ].map((item) => (
                  <div
                    key={item.role}
                    className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#0D0C0B] block">{item.role}</span>
                      <span className="text-xs block mt-0.5">{getRatingBadge(item.score)}</span>
                    </div>
                    {renderStars(item.score)}
                  </div>
                ))}
              </div>
            </div>

            {/* Good For & Not Ideal For */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-1.5">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>GOOD FOR</span>
                </span>
                <ul className="text-xs text-emerald-900 space-y-1 font-medium">
                  {selectedFont.bestFor?.map((item, idx) => (
                    <li key={idx}>✓ {item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-rose-50/80 rounded-2xl border border-rose-200 space-y-1.5">
                <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5 font-mono">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>NOT IDEAL FOR</span>
                </span>
                <ul className="text-xs text-rose-900 space-y-1 font-medium">
                  {selectedFont.avoidFor?.map((item, idx) => (
                    <li key={idx}>× {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Real Context Hierarchy Live Preview */}
          <div className="minimal-card rounded-3xl p-6 sm:p-7 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">
              Font In Real Context
            </h4>

            <div
              className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DF] space-y-4 shadow-inner"
            >
              {/* Title */}
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-paprika block mb-1">
                  MAIN TITLE
                </span>
                <h3
                  className="text-2xl sm:text-4xl font-extrabold text-[#0D0C0B] tracking-tight leading-tight"
                  style={{ fontFamily: selectedFont.family }}
                >
                  Build Something Beautiful
                </h3>
              </div>

              {/* Subtitle */}
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#78716C] block mb-1">
                  SUBTITLE
                </span>
                <p
                  className="text-sm sm:text-base font-semibold text-[#2D2422] leading-snug"
                  style={{ fontFamily: selectedFont.family }}
                >
                  Good typography makes complex information effortless to understand.
                </p>
              </div>

              {/* Body */}
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#78716C] block mb-1">
                  BODY TEXT
                </span>
                <p
                  className="text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-xl font-medium"
                  style={{ fontFamily: selectedFont.family }}
                >
                  Typography creates hierarchy, improves readability, and guides readers through your design so they immediately understand what matters first.
                </p>
              </div>

              {/* Button */}
              <div className="pt-2">
                <button
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0D0C0B] hover:bg-paprika transition-colors shadow-sm"
                  style={{ fontFamily: selectedFont.family }}
                >
                  Action Button
                </button>
              </div>
            </div>
          </div>

          {/* Pairing Tabs (What should I pair it with? / Reverse Pairing / Playground) */}
          <div className="minimal-card rounded-3xl p-6 sm:p-7 space-y-5">
            {/* Tab Buttons & Copy Action */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E8E5DF] flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab('pairings')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'pairings'
                      ? 'bg-[#0D0C0B] text-white shadow-sm'
                      : 'bg-[#FAF9F6] text-[#78716C] hover:text-[#0D0C0B] border border-[#E8E5DF]'
                  }`}
                >
                  What to pair with {selectedFont.name}?
                </button>
                <button
                  onClick={() => setActiveTab('reverse')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'reverse'
                      ? 'bg-[#0D0C0B] text-white shadow-sm'
                      : 'bg-[#FAF9F6] text-[#78716C] hover:text-[#0D0C0B] border border-[#E8E5DF]'
                  }`}
                >
                  Reverse: Headings for {selectedFont.name}
                </button>
                <button
                  onClick={() => setActiveTab('playground')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'playground'
                      ? 'bg-[#0D0C0B] text-white shadow-sm'
                      : 'bg-[#FAF9F6] text-[#78716C] hover:text-[#0D0C0B] border border-[#E8E5DF]'
                  }`}
                >
                  Font Playground
                </button>
              </div>

              <button
                onClick={handleCopyPairingCSS}
                className="px-3 py-1.5 text-xs font-mono font-bold text-paprika hover:text-paprika-hover flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Copy Pairing CSS</span>
              </button>
            </div>

            {/* TAB 1: PAIRINGS (Heading -> Body) */}
            {activeTab === 'pairings' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pairings.map((pair) => {
                    const isSelectedPair = pairedBodyId === pair.bodyFont.id;
                    return (
                      <div
                        key={pair.fontId}
                        onClick={() => setPairedBodyId(pair.bodyFont.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-2 ${
                          isSelectedPair
                            ? 'bg-white border-paprika ring-2 ring-paprika shadow-paprika-sm'
                            : 'bg-[#FAF9F6] border-[#E8E5DF] hover:border-[#0D0C0B]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[#0D0C0B]">{pair.bodyFont.name}</span>
                          {renderStars(Math.round(pair.score / 20))}
                        </div>
                        <p className="text-xs text-[#57534E] leading-snug italic font-medium">
                          "{pair.why}"
                        </p>
                        <div className="flex items-center justify-between pt-2 text-[11px] font-bold font-mono">
                          <span className="text-paprika">{pair.score}% Compatibility</span>
                          {isSelectedPair && <span className="text-emerald-700">✓ Active Live Preview</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Combined Live 2-Font Pairing Stage */}
                <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DF] shadow-inner space-y-3">
                  <span className="text-[10px] font-mono uppercase text-paprika font-bold block">
                    PAIRING LIVE PREVIEW: {selectedFont.name} (Title) + {pairedBodyFont.name} (Body)
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-black text-[#0D0C0B] tracking-tight leading-tight"
                    style={{ fontFamily: selectedFont.family }}
                  >
                    The Art of Good Design
                  </h3>
                  <p
                    className="text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-xl font-normal"
                    style={{ fontFamily: pairedBodyFont.family }}
                  >
                    Good design is not about adding more. It is about making the right things stand out with clarity, breathing room, and effortless visual rhythm.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: REVERSE PAIRING (Body -> Heading) */}
            {activeTab === 'reverse' && (
              <div className="space-y-4">
                <p className="text-xs text-[#78716C] font-mono">
                  If you use <strong className="text-[#0D0C0B]">{selectedFont.name}</strong> for body paragraphs, pair it with these headlines:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reverseHeadings.slice(0, 4).map((item) => (
                    <div
                      key={item.headingFont.id}
                      className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DF] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#0D0C0B]">{item.headingFont.name}</span>
                        <span className="text-xs font-mono font-bold text-emerald-700">{item.score}% Match</span>
                      </div>
                      <div
                        className="text-lg font-bold text-[#0D0C0B]"
                        style={{ fontFamily: item.headingFont.family }}
                      >
                        Visual Impact & Clarity
                      </div>
                      <p className="text-xs text-[#57534E] leading-snug font-medium">
                        {item.why}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: MINIMAL PLAYGROUND */}
            {activeTab === 'playground' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold uppercase text-[#78716C]">Type Your Own Text</label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Write something here..."
                    className="w-full px-4 py-3 text-sm rounded-xl border border-[#E8E5DF] bg-white text-[#0D0C0B] focus:outline-none focus:ring-2 focus:ring-paprika transition-all font-medium"
                  />
                </div>

                {/* Minimal Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF]">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#0D0C0B]">
                      <span>Size</span>
                      <span className="font-mono text-paprika">{fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="16"
                      max="56"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#0D0C0B]">
                      <span>Weight</span>
                      <span className="font-mono text-paprika">{fontWeight}</span>
                    </div>
                    <input
                      type="range"
                      min="400"
                      max="800"
                      step="100"
                      value={fontWeight}
                      onChange={(e) => setFontWeight(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#0D0C0B]">
                      <span>Line Height</span>
                      <span className="font-mono text-paprika">{lineHeight}</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="2.0"
                      step="0.1"
                      value={lineHeight}
                      onChange={(e) => setLineHeight(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Interactive Live Output Box */}
                <div className="p-8 rounded-2xl bg-white border border-[#E8E5DF] shadow-inner overflow-hidden min-h-[140px] flex items-center justify-center text-center">
                  <div
                    style={{
                      fontFamily: selectedFont.family,
                      fontSize: `${fontSize}px`,
                      fontWeight: fontWeight,
                      lineHeight: lineHeight,
                    }}
                    className="text-[#0D0C0B] transition-all"
                  >
                    {customText || 'Write something here...'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
