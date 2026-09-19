import React, { useState } from 'react';
import { Star, CheckCircle2, XCircle, Sparkles, Sliders } from 'lucide-react';
import { loadGoogleFont } from '../../utils/fontLoader';

export function FontDetailCard({ font, isSelectedAsHeading, isSelectedAsBody, onSelectAsHeading, onSelectAsBody }) {
  const [sampleText, setSampleText] = useState('The quick brown fox jumps over the lazy dog.');

  React.useEffect(() => {
    if (font?.googleFontQuery) {
      loadGoogleFont(font.googleFontQuery);
    }
  }, [font]);

  if (!font) return null;

  const renderStars = (count) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i <= count ? 'text-amber-400 fill-amber-400' : 'text-zinc-200'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-card space-y-5">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">{font.name}</h3>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 rounded-md">
              {font.category}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">Designed by {font.designer || 'Google Fonts Community'}</p>
        </div>

        {/* Heading / Body Selection Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectAsHeading(font.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              isSelectedAsHeading
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-white hover:border-zinc-300'
            }`}
          >
            {isSelectedAsHeading ? '✓ Active Heading Font' : 'Use as Heading'}
          </button>
          <button
            onClick={() => onSelectAsBody(font.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              isSelectedAsBody
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-white hover:border-zinc-300'
            }`}
          >
            {isSelectedAsBody ? '✓ Active Body Font' : 'Use as Body'}
          </button>
        </div>
      </div>

      {/* Personality Badges */}
      <div className="flex flex-wrap gap-1.5">
        {font.personality?.map((tag, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 text-[11px] font-medium bg-brand-50 text-brand-700 border border-brand-200/60 rounded-lg"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Live Typeface Specimen Box */}
      <div className="p-4 bg-zinc-50/70 rounded-2xl border border-zinc-200/80 space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
          <span>Editable Specimen</span>
          <span>Google Fonts</span>
        </div>
        <input
          type="text"
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          className="w-full text-2xl sm:text-3xl font-bold bg-transparent border-0 text-zinc-900 focus:outline-none placeholder-zinc-300"
          style={{ fontFamily: font.family }}
        />
        <p className="text-xs text-zinc-600 leading-relaxed font-normal" style={{ fontFamily: font.family }}>
          {font.description}
        </p>
      </div>

      {/* 6 Best Use Ratings */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Best Use Ratings</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {font.ratings &&
            Object.entries(font.ratings).map(([role, score]) => (
              <div key={role} className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
                <span className="text-xs font-semibold capitalize text-zinc-700">{role}</span>
                {renderStars(score)}
              </div>
            ))}
        </div>
      </div>

      {/* Best For & Avoid For Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Best For */}
        <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Best for:</span>
          </div>
          <ul className="space-y-1 text-xs text-emerald-900">
            {font.bestFor?.map((item, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Avoid For */}
        <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-950">
            <XCircle className="w-4 h-4 text-rose-500" />
            <span>Avoid for:</span>
          </div>
          <ul className="space-y-1 text-xs text-rose-900">
            {font.avoidFor?.map((item, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
