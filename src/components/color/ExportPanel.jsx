import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CopyButton } from '../common/CopyButton';
import { SegmentedControl } from '../common/SegmentedControl';
import {
  generateCssVariables,
  generateTailwindConfigSnippet,
  generateDesignTokensJson,
} from '../../utils/exportUtils';
import { downloadPaletteAsPng } from '../../utils/canvasExporter';
import { Download, Code2, Sparkles, FileJson, Layers, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function ExportPanel({
  isOpen,
  onClose,
  palette,
  headingFont,
  bodyFont,
  harmonyType,
  useCase,
  mood,
}) {
  const [activeTab, setActiveTab] = useState('css');
  const { addToast } = useToast();

  const cssVariables = generateCssVariables(palette, headingFont, bodyFont);
  const tailwindSnippet = generateTailwindConfigSnippet(palette, headingFont, bodyFont);
  const tokensJson = generateDesignTokensJson(palette, headingFont, bodyFont, useCase, mood);
  const hexList = Object.entries(palette)
    .map(([role, hex]) => `${role}: ${hex}`)
    .join('\n');

  const handleDownloadPng = () => {
    downloadPaletteAsPng(
      palette,
      harmonyType,
      headingFont?.name || 'Plus Jakarta Sans',
      bodyFont?.name || 'Inter'
    );
    addToast({
      title: 'Palette PNG Downloaded',
      message: 'High-resolution palette card ready for sharing and design systems.',
      type: 'success',
    });
  };

  const tabs = [
    { value: 'css', label: 'CSS Variables', icon: <Code2 className="w-3.5 h-3.5" /> },
    { value: 'tailwind', label: 'Tailwind Config', icon: <Layers className="w-3.5 h-3.5" /> },
    { value: 'json', label: 'Design Tokens', icon: <FileJson className="w-3.5 h-3.5" /> },
    { value: 'hex', label: 'HEX List', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Design System & Tokens" maxWidth="max-w-2xl">
      <div className="space-y-5">
        {/* Quick PNG Card Download Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white rounded-2xl shadow-card">
          <div className="space-y-1">
            <h4 className="text-sm font-bold flex items-center gap-1.5 text-zinc-100">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Palette Swatch Card (PNG)</span>
            </h4>
            <p className="text-xs text-zinc-400">
              Download a 1200x630 high-res card with color swatches, font pairings, and contrast ratings.
            </p>
          </div>
          <button
            onClick={handleDownloadPng}
            className="px-4 py-2 text-xs font-bold text-zinc-900 bg-white hover:bg-zinc-100 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex items-center justify-between">
          <SegmentedControl options={tabs} value={activeTab} onChange={setActiveTab} size="sm" />
          <CopyButton
            text={
              activeTab === 'css'
                ? cssVariables
                : activeTab === 'tailwind'
                ? tailwindSnippet
                : activeTab === 'json'
                ? tokensJson
                : hexList
            }
            label="Copy Code"
            toastMessage={`Copied ${activeTab.toUpperCase()} snippet to clipboard`}
          />
        </div>

        {/* Code View Area */}
        <div className="relative rounded-2xl bg-zinc-950 p-4 font-mono text-xs text-zinc-200 border border-zinc-800 overflow-x-auto max-h-72">
          <pre className="leading-relaxed">
            {activeTab === 'css' && <code>{cssVariables}</code>}
            {activeTab === 'tailwind' && <code>{tailwindSnippet}</code>}
            {activeTab === 'json' && <code>{tokensJson}</code>}
            {activeTab === 'hex' && <code>{hexList}</code>}
          </pre>
        </div>

        {/* Developer Integration Guidance */}
        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-start gap-2.5 text-xs text-zinc-600">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            These variables are completely ready for React, Next.js, Vite, Tailwind CSS, or any standard web project.
          </p>
        </div>
      </div>
    </Modal>
  );
}
