import React, { useState } from 'react';
import { useSharedDesign } from '../../../context/SharedDesignContext';
import { useToast } from '../../../context/ToastContext';
import {
  hexToHsl,
  hslToHex,
  isValidHex,
  normalizeHex,
  getContrastRatio,
  getRelativeLuminance,
} from '../../../utils/colorUtils';
import {
  Copy,
  Code2,
  Info,
} from 'lucide-react';
import { CopyButton } from '../../../components/common/CopyButton';

// Standard 11-step Tailwind lightness curve mapping
const SHADE_STEPS = [
  { step: '50', lightness: 97, label: 'Subtle Tint' },
  { step: '100', lightness: 93, label: 'Soft Wash' },
  { step: '200', lightness: 85, label: 'Light Border' },
  { step: '300', lightness: 74, label: 'Muted Background' },
  { step: '400', lightness: 60, label: 'Secondary UI' },
  { step: '500', lightness: 48, label: 'Base Tone' },
  { step: '600', lightness: 38, label: 'Interactive Hover' },
  { step: '700', lightness: 30, label: 'Solid Contrast' },
  { step: '800', lightness: 22, label: 'Deep Surface' },
  { step: '900', lightness: 14, label: 'Heavy Shadow' },
  { step: '950', lightness: 8, label: 'Ink Obsidian' },
];

export function ShadesTintsTab() {
  const { showToast } = useToast();
  const { activePrimaryHex, activePalette, updatePrimaryHex } = useSharedDesign();

  const [baseHex, setBaseHex] = useState(activePrimaryHex || '#7C3AED');
  const [colorName, setColorName] = useState('brand');
  const [hexInput, setHexInput] = useState(activePrimaryHex || '#7C3AED');

  const baseHsl = hexToHsl(baseHex);

  // Generate 11 shades using curved saturation & lightness adjustments
  const shades = SHADE_STEPS.map(({ step, lightness, label }) => {
    // Dynamically adjust saturation for high-lightness tints to keep them vibrant instead of muddy
    let adjustedSat = baseHsl.s;
    if (lightness > 90) adjustedSat = Math.max(30, Math.min(100, baseHsl.s * 0.85));
    else if (lightness < 15) adjustedSat = Math.max(20, Math.min(100, baseHsl.s * 0.9));

    const hex = hslToHex(baseHsl.h, adjustedSat, lightness).toUpperCase();
    const contrastOnWhite = getContrastRatio(hex, '#FFFFFF');
    const contrastOnBlack = getContrastRatio(hex, '#000000');
    const luminance = (getRelativeLuminance(hex) * 100).toFixed(1);

    return {
      step,
      hex,
      label,
      lightness,
      luminance,
      isDark: lightness < 55,
      contrastOnWhite: contrastOnWhite.toFixed(2),
      contrastOnBlack: contrastOnBlack.toFixed(2),
    };
  });

  const handleBaseChange = (newHex) => {
    setBaseHex(newHex);
    setHexInput(newHex);
    updatePrimaryHex(newHex);
  };

  const handleCopyTailwindObj = () => {
    const obj = {};
    shades.forEach((s) => {
      obj[s.step] = s.hex;
    });
    const code = `'${colorName}': {\n${Object.entries(obj)
      .map(([k, v]) => `  ${k}: '${v}',`)
      .join('\n')}\n}`;
    navigator.clipboard.writeText(code);
    showToast(`Copied Tailwind '${colorName}' color object!`, 'success');
  };

  const handleCopyCssVars = () => {
    const css = `:root {\n${shades
      .map((s) => `  --color-${colorName}-${s.step}: ${s.hex};`)
      .join('\n')}\n}`;
    navigator.clipboard.writeText(css);
    showToast(`Copied CSS variables for ${colorName}!`, 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header & Controls */}
      <div className="bg-white/80 backdrop-blur-xl border border-stone-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
            <h2 className="text-xl font-black tracking-tight text-stone-900 font-display">
              Shades & Tints Scale Generator
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Produce an 11-step mathematical shade scale (50 to 950) with balanced saturation curves.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleCopyTailwindObj}
            className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center space-x-2 border border-purple-200 transition active:scale-95"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Copy Tailwind Tokens</span>
          </button>

          <button
            onClick={handleCopyCssVars}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition active:scale-95"
          >
            <Copy className="w-3.5 h-3.5 text-stone-300" />
            <span>Copy CSS Variables</span>
          </button>
        </div>
      </div>

      {/* Base Color Picker & Token Naming */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <input
            type="color"
            value={baseHex}
            onChange={(e) => handleBaseChange(e.target.value)}
            className="w-14 h-14 rounded-2xl cursor-pointer border-2 border-stone-200 p-0.5 bg-white shadow-xs"
          />
          <div>
            <label className="text-[10px] font-mono font-bold text-stone-400 uppercase block mb-1">
              Base Color Hex
            </label>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => {
                setHexInput(e.target.value);
                if (isValidHex(e.target.value)) {
                  handleBaseChange(normalizeHex(e.target.value));
                }
              }}
              className="w-36 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="#7C3AED"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div>
            <label className="text-[10px] font-mono font-bold text-stone-400 uppercase block mb-1">
              Token Prefix Name
            </label>
            <input
              type="text"
              value={colorName}
              onChange={(e) => setColorName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              className="w-36 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="brand"
            />
          </div>

          <div className="flex items-center space-x-1.5 pt-4">
            {Object.values(activePalette)
              .filter((h) => isValidHex(h))
              .slice(0, 5)
              .map((palHex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBaseChange(palHex)}
                  style={{ backgroundColor: palHex }}
                  className="w-8 h-8 rounded-xl border-2 border-white shadow-xs hover:scale-110 transition-transform"
                  title={`Use ${palHex} from palette`}
                />
              ))}
          </div>
        </div>
      </div>

      {/* 11-Step Shade Strip */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500">
          Generated 11-Step Scale Strip
        </h3>

        {/* Desktop Strip Layout */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-2">
          {shades.map((shade) => (
            <div
              key={shade.step}
              className="group rounded-2xl p-3 border border-stone-200/80 bg-white flex flex-col justify-between h-48 hover:shadow-lg transition-all"
            >
              <div
                className="w-full h-20 rounded-xl flex items-center justify-center relative shadow-inner overflow-hidden"
                style={{ backgroundColor: shade.hex }}
              >
                <span
                  className={`text-[11px] font-mono font-black ${
                    shade.isDark ? 'text-white' : 'text-stone-900'
                  }`}
                >
                  {shade.step}
                </span>
              </div>

              <div className="pt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-stone-900 truncate">
                    {shade.hex}
                  </span>
                  <CopyButton text={shade.hex} label="" />
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-stone-400">
                  <span>Lum: {shade.luminance}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Component Preview Using the Scale */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
        <h4 className="text-sm font-bold text-stone-900 font-sans">
          Scale in Action (UI Components)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Alert Card using 50 bg + 200 border + 700 text */}
          <div
            className="p-4 rounded-2xl border"
            style={{
              backgroundColor: shades[0].hex, // 50
              borderColor: shades[2].hex, // 200
              color: shades[7].hex, // 700
            }}
          >
            <div className="flex items-center space-x-2 font-bold text-xs mb-1">
              <Info className="w-4 h-4" />
              <span>Info Notice (50 + 200 + 700)</span>
            </div>
            <p className="text-[11px] font-medium opacity-90">
              Clean tone-on-tone tint for accessible badges, callouts and notifications.
            </p>
          </div>

          {/* 2. Interactive Solid Button using 600 bg + 700 hover */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-center items-center space-y-2">
            <button
              className="w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition transform active:scale-95 flex items-center justify-center space-x-2 text-white"
              style={{ backgroundColor: shades[6].hex }} // 600
            >
              <span>Solid Button (600)</span>
            </button>
            <span className="text-[10px] text-stone-400 font-mono">
              Hover tone: {shades[7].hex} (700)
            </span>
          </div>

          {/* 3. Deep Dark Card using 950 bg + 800 border */}
          <div
            className="p-4 rounded-2xl border text-white"
            style={{
              backgroundColor: shades[10].hex, // 950
              borderColor: shades[8].hex, // 800
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold font-sans" style={{ color: shades[3].hex }}>
                Dark Theme Surface (950)
              </span>
              <span
                className="text-[9px] font-mono px-2 py-0.5 rounded-md font-bold"
                style={{ backgroundColor: shades[8].hex, color: shades[2].hex }}
              >
                PRO
              </span>
            </div>
            <p className="text-[11px] font-medium opacity-80" style={{ color: shades[2].hex }}>
              High-depth dark mode card with precise shadow contrast.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
