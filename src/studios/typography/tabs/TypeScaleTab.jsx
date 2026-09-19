import React, { useState } from 'react';
import { FONTS_DATABASE, getFontById } from '../../../data/fontsData';
import { useSharedDesign } from '../../../context/SharedDesignContext';
import { useToast } from '../../../context/ToastContext';
import { Sliders, Copy, Code2, Sparkles, Layers, Type } from 'lucide-react';
import { CopyButton } from '../../../components/common/CopyButton';

const SCALE_RATIOS = [
  { id: 'minor-second', name: 'Minor Second', ratio: 1.067, desc: 'Subtle & compact' },
  { id: 'major-second', name: 'Major Second', ratio: 1.125, desc: 'Balanced for mobile' },
  { id: 'minor-third', name: 'Minor Third', ratio: 1.2, desc: 'Versatile standard' },
  { id: 'major-third', name: 'Major Third', ratio: 1.25, desc: 'Crisp editorial punch' },
  { id: 'perfect-fourth', name: 'Perfect Fourth', ratio: 1.333, desc: 'High visual dynamic' },
  { id: 'augmented-fourth', name: 'Aug. Fourth', ratio: 1.414, desc: 'Striking modern hierarchy' },
  { id: 'perfect-fifth', name: 'Perfect Fifth', ratio: 1.5, desc: 'Bold poster scale' },
  { id: 'golden-ratio', name: 'Golden Ratio', ratio: 1.618, desc: 'Divine mathematical contrast' },
];

const HIERARCHY_STEPS = [
  { tag: 'Display', power: 4, label: 'Hero Display' },
  { tag: 'h1', power: 3, label: 'Heading 1' },
  { tag: 'h2', power: 2, label: 'Heading 2' },
  { tag: 'h3', power: 1, label: 'Heading 3' },
  { tag: 'body', power: 0, label: 'Body Base' },
  { tag: 'small', power: -1, label: 'Caption / Meta' },
];

export function TypeScaleTab() {
  const { showToast } = useToast();
  const { activeFontId } = useSharedDesign();

  const [baseSize, setBaseSize] = useState(16);
  const [selectedRatioId, setSelectedRatioId] = useState('major-third');

  const selectedFont = getFontById(activeFontId) || FONTS_DATABASE[0];
  const activeRatioObj = SCALE_RATIOS.find((r) => r.id === selectedRatioId) || SCALE_RATIOS[3];
  const ratio = activeRatioObj.ratio;

  const calculatedHierarchy = HIERARCHY_STEPS.map((step) => {
    const px = Math.round(baseSize * Math.pow(ratio, step.power));
    const rem = (px / 16).toFixed(3);
    const lineHeight = (Math.max(1.1, Math.min(1.6, 1.6 - step.power * 0.1))).toFixed(2);
    return {
      ...step,
      px,
      rem,
      lineHeight,
    };
  });

  const handleCopyCssScale = () => {
    const css = `/* LooksGood Modular Type Scale (${activeRatioObj.name}: ${ratio}) */
:root {
${calculatedHierarchy
  .map((s) => `  --font-size-${s.tag}: ${s.rem}rem; /* ${s.px}px */`)
  .join('\n')}
}`;
    navigator.clipboard.writeText(css);
    showToast(`Copied ${activeRatioObj.name} scale CSS!`, 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-stone-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-600 animate-pulse" />
            <h2 className="text-xl font-black tracking-tight text-stone-900 font-display">
              Modular Type Scale Calculator
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Calculate harmonic font hierarchies based on classic mathematical proportions.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleCopyCssScale}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition active:scale-95"
          >
            <Copy className="w-3.5 h-3.5 text-stone-300" />
            <span>Copy Scale CSS</span>
          </button>
        </div>
      </div>

      {/* Controls Bar: Ratio Selector & Base Size */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 block mb-1">
              Base Body Size (px)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="12"
                max="24"
                value={baseSize}
                onChange={(e) => setBaseSize(Number(e.target.value))}
                className="w-20 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono font-bold text-stone-900"
              />
              <span className="text-xs text-stone-400 font-medium">px</span>
            </div>
          </div>

          <div className="h-10 w-px bg-stone-200 hidden sm:block" />

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 block mb-1">
              Active Font Preview
            </span>
            <span className="text-xs font-bold text-stone-900 font-sans">
              {selectedFont.name} ({selectedFont.category})
            </span>
          </div>
        </div>

        {/* Ratio Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-xl">
          {SCALE_RATIOS.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRatioId(r.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedRatioId === r.id
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-stone-50 border border-stone-200 text-stone-600 hover:bg-white'
              }`}
            >
              <span>{r.name}</span>
              <span className="opacity-70 font-mono text-[10px] ml-1">({r.ratio})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Hierarchy Ladder */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500">
          Typographic Hierarchy Ladder ({activeRatioObj.name})
        </h3>

        <div className="space-y-6 divide-y divide-stone-100">
          {calculatedHierarchy.map((step) => (
            <div
              key={step.tag}
              className="pt-6 first:pt-0 flex flex-col md:flex-row md:items-baseline justify-between gap-4"
            >
              {/* Meta information */}
              <div className="w-48 flex-shrink-0 space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md">
                    {step.tag.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-stone-800">{step.label}</span>
                </div>
                <div className="text-[11px] font-mono text-stone-400">
                  {step.rem}rem • {step.px}px • LH: {step.lineHeight}
                </div>
              </div>

              {/* Sample rendered line */}
              <div className="flex-1 overflow-hidden">
                <p
                  style={{
                    fontFamily: selectedFont.family,
                    fontSize: `${step.px}px`,
                    lineHeight: step.lineHeight,
                  }}
                  className="text-stone-900 font-bold tracking-tight truncate"
                >
                  Visual clarity in every layout.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
