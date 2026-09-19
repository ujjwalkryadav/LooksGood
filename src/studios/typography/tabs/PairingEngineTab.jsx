import React, { useState, useEffect } from 'react';
import { FONTS_DATABASE, getFontById, getPairingsForHeading } from '../../../data/fontsData';
import { loadGoogleFont } from '../../../utils/fontLoader';
import { useSharedDesign } from '../../../context/SharedDesignContext';
import { useToast } from '../../../context/ToastContext';
import { Star, CheckCircle2, ArrowRight, Code2, Sparkles, Copy, Type } from 'lucide-react';

export function PairingEngineTab({ onNavigateTab }) {
  const { showToast } = useToast();
  const { activeFontId, setActiveFontId } = useSharedDesign();

  const selectedHeadingFont = getFontById(activeFontId) || FONTS_DATABASE[0];
  const pairings = getPairingsForHeading(selectedHeadingFont.id);

  const [pairedBodyId, setPairedBodyId] = useState(
    pairings[0]?.bodyFont?.id || 'inter'
  );
  const [headlineText, setHeadlineText] = useState('Crafting Extraordinary Digital Experiences');
  const [bodyText, setBodyText] = useState(
    'Great typography establishes clear visual hierarchy, draws the reader in, and communicates brand confidence before a single word is consciously read.'
  );

  const pairedBodyFont = getFontById(pairedBodyId) || FONTS_DATABASE[0];

  useEffect(() => {
    if (selectedHeadingFont?.googleFontQuery) loadGoogleFont(selectedHeadingFont.googleFontQuery);
    if (pairedBodyFont?.googleFontQuery) loadGoogleFont(pairedBodyFont.googleFontQuery);
  }, [selectedHeadingFont, pairedBodyFont]);

  const handleCopyPairingCSS = () => {
    const css = `/* LooksGood Font Pairing */
h1, h2, h3, h4 {
  font-family: ${selectedHeadingFont.family};
  font-weight: 700;
}

p, span, body {
  font-family: ${pairedBodyFont.family};
  font-weight: 400;
  line-height: 1.6;
}`;
    navigator.clipboard.writeText(css);
    showToast(`Copied ${selectedHeadingFont.name} + ${pairedBodyFont.name} CSS!`, 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-stone-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-600 animate-pulse" />
            <h2 className="text-xl font-black tracking-tight text-stone-900 font-display">
              Curated Font Pairing Engine
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Algorithmic typographic harmony — pairing high-character headings with high-legibility body fonts.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleCopyPairingCSS}
            className="px-4 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs flex items-center space-x-2 border border-pink-200 transition active:scale-95"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Copy Pairing CSS</span>
          </button>

          <button
            onClick={() => {
              if (onNavigateTab) onNavigateTab('playground');
            }}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-300" />
            <span>Open in Playground</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Pairing Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Heading Font Chooser & Verified Pairs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500">
                Primary Heading Font
              </span>
              <span className="text-[10px] font-mono text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md font-bold">
                {selectedHeadingFont.category}
              </span>
            </div>

            <select
              value={activeFontId}
              onChange={(e) => setActiveFontId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {FONTS_DATABASE.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.category})
                </option>
              ))}
            </select>
          </div>

          {/* Recommended Body Pairings */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500">
              Verified Body Font Pairings ({pairings.length})
            </h3>

            <div className="space-y-3">
              {pairings.map((pair, idx) => {
                const isSelected = pairedBodyId === pair.bodyFont.id;
                return (
                  <div
                    key={idx}
                    onClick={() => setPairedBodyId(pair.bodyFont.id)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/60 ring-2 ring-pink-500/20 shadow-md'
                        : 'border-stone-200 bg-stone-50/60 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-stone-900 font-sans">
                          {pair.bodyFont.name}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          ({pair.bodyFont.category})
                        </span>
                      </div>
                      <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {pair.score}% Harmony
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 font-medium leading-relaxed">
                      {pair.why}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Live Editorial Preview Canvas */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 block">
                Active Live Preview
              </span>
              <div className="flex items-center space-x-2 text-xs text-stone-700 font-bold mt-1">
                <span className="text-pink-600">{selectedHeadingFont.name}</span>
                <span className="text-stone-300">+</span>
                <span className="text-purple-600">{pairedBodyFont.name}</span>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded-md">
              LIVE GOOGLE FONTS
            </span>
          </div>

          {/* Editable Headline */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-stone-400 font-bold uppercase block">
              Heading (Font: {selectedHeadingFont.name})
            </label>
            <input
              type="text"
              value={headlineText}
              onChange={(e) => setHeadlineText(e.target.value)}
              style={{ fontFamily: selectedHeadingFont.family }}
              className="w-full text-3xl sm:text-4xl font-black text-stone-900 bg-transparent border-b border-dashed border-stone-200 focus:outline-none focus:border-pink-500 py-1"
            />
          </div>

          {/* Editable Paragraph */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-stone-400 font-bold uppercase block">
              Body Copy (Font: {pairedBodyFont.name})
            </label>
            <textarea
              rows={4}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              style={{ fontFamily: pairedBodyFont.family }}
              className="w-full text-base sm:text-lg text-stone-700 font-normal leading-relaxed bg-stone-50/50 p-4 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Micro Component Preview */}
          <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 style={{ fontFamily: selectedHeadingFont.family }} className="text-lg font-bold text-stone-900">
                Ready to elevate your UI?
              </h4>
              <p style={{ fontFamily: pairedBodyFont.family }} className="text-xs text-stone-500">
                Apply this typography pair across your design system.
              </p>
            </div>
            <button
              style={{ fontFamily: selectedHeadingFont.family }}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-pink-600 text-white font-bold text-xs shadow-sm transition active:scale-95 flex-shrink-0"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
