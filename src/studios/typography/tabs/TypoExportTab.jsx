import React, { useState } from 'react';
import { FONTS_DATABASE, getFontById, getPairingsForHeading } from '../../../data/fontsData';
import { useSharedDesign } from '../../../context/SharedDesignContext';
import { useToast } from '../../../context/ToastContext';
import { Code2, Copy, Download, CheckCircle2, FileCode } from 'lucide-react';
import { CopyButton } from '../../../components/common/CopyButton';

export function TypoExportTab() {
  const { showToast } = useToast();
  const { activeFontId } = useSharedDesign();

  const [activeFormat, setActiveFormat] = useState('html'); // 'html', 'import', 'css', 'tailwind'

  const headingFont = getFontById(activeFontId) || FONTS_DATABASE[0];
  const pairings = getPairingsForHeading(headingFont.id);
  const bodyFont = pairings[0]?.bodyFont || FONTS_DATABASE[0];

  const getExportCode = () => {
    switch (activeFormat) {
      case 'html':
        return `<!-- Google Fonts CDN Links for HTML <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${headingFont.googleFontQuery}&${bodyFont.googleFontQuery}&display=swap" rel="stylesheet">`;

      case 'import':
        return `/* CSS @import URL (Place at the top of your index.css) */
@import url('https://fonts.googleapis.com/css2?${headingFont.googleFontQuery}&${bodyFont.googleFontQuery}&display=swap');`;

      case 'css':
        return `/* Typography System Rules */
h1, h2, h3, h4, .font-heading {
  font-family: ${headingFont.family};
  font-weight: 700;
  letter-spacing: -0.02em;
}

body, p, input, textarea, .font-body {
  font-family: ${bodyFont.family};
  font-weight: 400;
  line-height: 1.6;
}`;

      case 'tailwind':
        return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        heading: [${headingFont.family.split(',')[0]}, 'sans-serif'],
        body: [${bodyFont.family.split(',')[0]}, 'sans-serif'],
      }
    }
  }
};`;

      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportCode());
    showToast(`Copied ${activeFormat.toUpperCase()} snippet to clipboard!`, 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-stone-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-600 animate-pulse" />
            <h2 className="text-xl font-black tracking-tight text-stone-900 font-display">
              Typography Code & CDN Exporter
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Export Google Fonts CDN links, CSS rules, or Tailwind font definitions for {headingFont.name} + {bodyFont.name}.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition active:scale-95"
          >
            <Copy className="w-3.5 h-3.5 text-stone-300" />
            <span>Copy Snippet</span>
          </button>
        </div>
      </div>

      {/* Format Selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'html', label: 'HTML <link> Tags' },
          { id: 'import', label: 'CSS @import' },
          { id: 'css', label: 'CSS Rules' },
          { id: 'tailwind', label: 'Tailwind Config' },
        ].map((fmt) => (
          <button
            key={fmt.id}
            onClick={() => setActiveFormat(fmt.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeFormat === fmt.id
                ? 'bg-pink-600 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {fmt.label}
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div className="bg-stone-900 rounded-3xl p-6 border border-stone-800 shadow-xl space-y-4 text-white">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-xs font-mono text-stone-400 pl-2">
              typography-export.{activeFormat === 'html' ? 'html' : activeFormat === 'tailwind' ? 'js' : 'css'}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-mono font-bold flex items-center space-x-1.5 transition text-stone-200"
          >
            <Copy className="w-3 h-3" />
            <span>Copy</span>
          </button>
        </div>

        <pre className="text-xs font-mono text-stone-200 overflow-x-auto leading-relaxed select-text p-2">
          {getExportCode()}
        </pre>
      </div>
    </div>
  );
}
