import React, { useState } from 'react';
import { useSharedDesign } from '../../../context/SharedDesignContext';
import { useToast } from '../../../context/ToastContext';
import { Code2, Copy, Check, Download, FileCode, CheckCircle2, Layers } from 'lucide-react';
import { CopyButton } from '../../../components/common/CopyButton';

export function ExportTab() {
  const { showToast } = useToast();
  const { activePalette, activePrimaryHex } = useSharedDesign();

  const [activeFormat, setActiveFormat] = useState('css'); // 'css', 'tailwind', 'scss', 'json', 'svg'

  const pal = {
    primary: activePalette.primary || activePrimaryHex || '#7C3AED',
    secondary: activePalette.secondary || '#2D2422',
    accent: activePalette.accent || '#E11D48',
    background: activePalette.background || '#FAF9F6',
    text: activePalette.text || '#0D0C0B',
  };

  const getExportCode = () => {
    switch (activeFormat) {
      case 'css':
        return `/* LooksGood Studio Color Tokens */
:root {
  --color-primary: ${pal.primary};
  --color-secondary: ${pal.secondary};
  --color-accent: ${pal.accent};
  --color-background: ${pal.background};
  --color-text: ${pal.text};
}`;

      case 'tailwind':
        return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '${pal.primary}',
          secondary: '${pal.secondary}',
          accent: '${pal.accent}',
          canvas: '${pal.background}',
          ink: '${pal.text}',
        }
      }
    }
  }
};`;

      case 'scss':
        return `// SCSS Design Tokens
$color-primary: ${pal.primary};
$color-secondary: ${pal.secondary};
$color-accent: ${pal.accent};
$color-background: ${pal.background};
$color-text: ${pal.text};`;

      case 'json':
        return JSON.stringify(
          {
            name: 'LooksGood Harmonic Palette',
            roles: {
              primary: { hex: pal.primary, role: 'Primary Brand' },
              secondary: { hex: pal.secondary, role: 'Secondary Depth' },
              accent: { hex: pal.accent, role: 'Accent Action' },
              background: { hex: pal.background, role: 'Canvas Surface' },
              text: { hex: pal.text, role: 'Ink Typography' },
            },
          },
          null,
          2
        );

      case 'svg':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 100" width="500" height="100">
  <rect x="0" y="0" width="100" height="100" fill="${pal.primary}" />
  <rect x="100" y="0" width="100" height="100" fill="${pal.secondary}" />
  <rect x="200" y="0" width="100" height="100" fill="${pal.accent}" />
  <rect x="300" y="0" width="100" height="100" fill="${pal.background}" />
  <rect x="400" y="0" width="100" height="100" fill="${pal.text}" />
</svg>`;

      default:
        return '';
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getExportCode());
    showToast(`Copied ${activeFormat.toUpperCase()} tokens to clipboard!`, 'success');
  };

  const handleDownloadFile = () => {
    const code = getExportCode();
    const extMap = { css: 'css', tailwind: 'js', scss: 'scss', json: 'json', svg: 'svg' };
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `looksgood-palette.${extMap[activeFormat]}`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded looksgood-palette.${extMap[activeFormat]}!`, 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-stone-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
            <h2 className="text-xl font-black tracking-tight text-stone-900 font-display">
              Code & Export Center
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Export production-ready tokens in CSS, Tailwind, SCSS, JSON, or SVG vector swatches.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleDownloadFile}
            className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center space-x-2 border border-purple-200 transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .{activeFormat}</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition active:scale-95"
          >
            <Copy className="w-3.5 h-3.5 text-stone-300" />
            <span>Copy Snippet</span>
          </button>
        </div>
      </div>

      {/* Format Selector Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'css', label: 'CSS Custom Properties', ext: '.css' },
          { id: 'tailwind', label: 'Tailwind Config', ext: '.js' },
          { id: 'scss', label: 'SCSS Variables', ext: '.scss' },
          { id: 'json', label: 'JSON Tokens', ext: '.json' },
          { id: 'svg', label: 'SVG Swatch Strip', ext: '.svg' },
        ].map((fmt) => (
          <button
            key={fmt.id}
            onClick={() => setActiveFormat(fmt.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
              activeFormat === fmt.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span>{fmt.label}</span>
            <span className="opacity-70 font-mono text-[10px]">{fmt.ext}</span>
          </button>
        ))}
      </div>

      {/* Code Viewer Canvas */}
      <div className="bg-stone-900 rounded-3xl p-6 border border-stone-800 shadow-xl space-y-4 text-white">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-xs font-mono text-stone-400 pl-2">
              looksgood-palette.{activeFormat === 'tailwind' ? 'js' : activeFormat}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
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
