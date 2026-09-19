import React from 'react';
import { Sliders, RefreshCw, Type } from 'lucide-react';

export function LiveTypePreview({
  headingFont,
  bodyFont,
  settings,
  onUpdateSetting,
  palette,
}) {
  const { headingSize, bodySize, lineHeight, letterSpacing, headingWeight, bodyWeight } = settings;

  const handleReset = () => {
    onUpdateSetting('headingSize', 36);
    onUpdateSetting('bodySize', 16);
    onUpdateSetting('lineHeight', 1.6);
    onUpdateSetting('letterSpacing', -0.01);
    onUpdateSetting('headingWeight', 700);
    onUpdateSetting('bodyWeight', 400);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-card space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Live Typography Preview & Playground</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Test reading rhythm, font weight scale, leading, and tracking in real-time</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* Interactive Typography Canvas */}
      <div
        className="p-6 sm:p-8 rounded-2xl border border-black/10 shadow-inner transition-all space-y-4"
        style={{
          backgroundColor: palette.background,
          color: palette.text,
        }}
      >
        <div className="flex items-center gap-2 text-xs opacity-60 uppercase font-mono tracking-wider">
          <span>Heading: {headingFont.name} ({headingWeight})</span>
          <span>•</span>
          <span>Body: {bodyFont.name} ({bodyWeight})</span>
        </div>

        {/* Live Headline */}
        <h2
          className="leading-tight transition-all"
          style={{
            fontFamily: headingFont.family,
            fontSize: `${headingSize}px`,
            fontWeight: headingWeight,
            letterSpacing: `${letterSpacing}em`,
            color: palette.primary,
          }}
        >
          THE ART OF GOOD DESIGN
        </h2>

        {/* Live Subtitle / Paragraph */}
        <p
          className="leading-relaxed transition-all max-w-2xl"
          style={{
            fontFamily: bodyFont.family,
            fontSize: `${bodySize}px`,
            fontWeight: bodyWeight,
            lineHeight: lineHeight,
            color: palette.text,
          }}
        >
          Good typography creates hierarchy, clarity, and visual rhythm. When typography is thoughtfully tuned with generous line height and disciplined weights, complex information transforms into an intuitive, frictionless reading journey.
        </p>

        {/* Sample Call-To-Action Button */}
        <div className="pt-2">
          <button
            className="px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-transform hover:scale-105"
            style={{
              backgroundColor: palette.primary,
              color: '#FFFFFF',
              fontFamily: bodyFont.family,
            }}
          >
            Explore Typography Systems
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200/80">
        {/* Heading Size */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-700">
            <span>Heading Size</span>
            <span className="font-mono font-bold text-brand-600">{headingSize}px</span>
          </div>
          <input
            type="range"
            min="24"
            max="64"
            value={headingSize}
            onChange={(e) => onUpdateSetting('headingSize', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Body Size */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-700">
            <span>Body Text Size</span>
            <span className="font-mono font-bold text-brand-600">{bodySize}px</span>
          </div>
          <input
            type="range"
            min="12"
            max="24"
            value={bodySize}
            onChange={(e) => onUpdateSetting('bodySize', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Line Height */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-700">
            <span>Line Height (Leading)</span>
            <span className="font-mono font-bold text-brand-600">{lineHeight}</span>
          </div>
          <input
            type="range"
            min="1.1"
            max="2.0"
            step="0.05"
            value={lineHeight}
            onChange={(e) => onUpdateSetting('lineHeight', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Letter Spacing */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-700">
            <span>Letter Spacing (Tracking)</span>
            <span className="font-mono font-bold text-brand-600">{letterSpacing}em</span>
          </div>
          <input
            type="range"
            min="-0.05"
            max="0.1"
            step="0.01"
            value={letterSpacing}
            onChange={(e) => onUpdateSetting('letterSpacing', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
