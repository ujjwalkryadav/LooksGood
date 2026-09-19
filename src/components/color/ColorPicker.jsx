import React, { useState, useEffect } from 'react';
import { hexToRgb, hexToHsl, isValidHex, normalizeHex } from '../../utils/colorUtils';
import { CopyButton } from '../common/CopyButton';
import { Pipette, Sparkles, RefreshCw } from 'lucide-react';

const SEED_PALETTES = [
  { name: 'Indigo Brand', hex: '#6C63FF' },
  { name: 'Electric Azure', hex: '#2563EB' },
  { name: 'Emerald Growth', hex: '#059669' },
  { name: 'Amber Warmth', hex: '#D97706' },
  { name: 'Rose Passion', hex: '#E11D48' },
  { name: 'Violet Creative', hex: '#7C3AED' },
  { name: 'Teal Modern', hex: '#0D9488' },
  { name: 'Charcoal Minimal', hex: '#18181B' },
];

export function ColorPicker({ primaryColor, onChangePrimary, recentColors = [] }) {
  const [hexInput, setHexInput] = useState(primaryColor);
  const [error, setError] = useState(null);

  useEffect(() => {
    setHexInput(primaryColor);
    setError(null);
  }, [primaryColor]);

  const rgb = hexToRgb(primaryColor);
  const hsl = hexToHsl(primaryColor);

  const handleHexChange = (e) => {
    const val = e.target.value;
    setHexInput(val);
    if (isValidHex(val)) {
      setError(null);
      onChangePrimary(normalizeHex(val));
    } else {
      setError('Enter a valid 3 or 6 digit HEX (e.g. #6C63FF)');
    }
  };

  const handleNativePicker = (e) => {
    const val = e.target.value;
    setHexInput(val);
    setError(null);
    onChangePrimary(val);
  };

  const handleRandomize = () => {
    const randomSeed = SEED_PALETTES[Math.floor(Math.random() * SEED_PALETTES.length)];
    onChangePrimary(randomSeed.hex);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-card space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Primary Color</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Pick your main brand anchor</p>
        </div>
        <button
          onClick={handleRandomize}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors"
          title="Random inspirational color"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Surprise Me</span>
        </button>
      </div>

      {/* Large Visual Color Preview & Native Picker */}
      <div className="relative group">
        <div
          className="w-full h-32 sm:h-36 rounded-2xl shadow-inner border border-black/10 flex flex-col justify-between p-4 transition-all duration-300 relative overflow-hidden"
          style={{ backgroundColor: primaryColor }}
        >
          {/* Top badge */}
          <div className="flex items-center justify-between z-10">
            <span
              className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg backdrop-blur-md border shadow-sm"
              style={{
                backgroundColor: hsl.l > 60 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                color: hsl.l > 60 ? '#111827' : '#FFFFFF',
                borderColor: hsl.l > 60 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.3)',
              }}
            >
              {primaryColor.toUpperCase()}
            </span>
            <CopyButton
              text={primaryColor.toUpperCase()}
              toastMessage={`Copied ${primaryColor.toUpperCase()} to clipboard`}
              className="backdrop-blur-md bg-white/90 border-white/50 text-zinc-900"
            />
          </div>

          {/* Native picker overlay trigger */}
          <label
            htmlFor="native-color-picker"
            className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 backdrop-blur-[2px] transition-all rounded-2xl"
          >
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/95 text-zinc-900 text-xs font-semibold rounded-xl shadow-card border border-white/80">
              <Pipette className="w-4 h-4 text-brand-600" />
              <span>Click to change color</span>
            </div>
            <input
              id="native-color-picker"
              type="color"
              value={primaryColor}
              onChange={handleNativePicker}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer pointer-events-none"
            />
          </label>
        </div>
      </div>

      {/* Color Inputs & Formats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* HEX Input */}
        <div className="sm:col-span-1">
          <label className="block text-[11px] font-semibold uppercase text-zinc-500 mb-1">HEX Code</label>
          <div className="relative">
            <input
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              placeholder="#6C63FF"
              className={`w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border bg-zinc-50 focus:bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all ${
                error ? 'border-rose-400 focus:ring-rose-400' : 'border-zinc-200'
              }`}
            />
          </div>
          {error && <span className="text-[10px] text-rose-500 mt-1 block">{error}</span>}
        </div>

        {/* RGB Display */}
        <div>
          <label className="block text-[11px] font-semibold uppercase text-zinc-500 mb-1">RGB</label>
          <div className="px-3 py-2 text-xs font-mono font-medium rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 flex items-center justify-between">
            <span>
              {rgb.r}, {rgb.g}, {rgb.b}
            </span>
            <CopyButton
              text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
              toastMessage={`Copied RGB values to clipboard`}
              iconOnly
            />
          </div>
        </div>

        {/* HSL Display */}
        <div>
          <label className="block text-[11px] font-semibold uppercase text-zinc-500 mb-1">HSL</label>
          <div className="px-3 py-2 text-xs font-mono font-medium rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 flex items-center justify-between">
            <span>
              {hsl.h}°, {hsl.s}%, {hsl.l}%
            </span>
            <CopyButton
              text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
              toastMessage={`Copied HSL values to clipboard`}
              iconOnly
            />
          </div>
        </div>
      </div>

      {/* Preset Inspirations */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase text-zinc-500">Popular Color Inspirations</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {SEED_PALETTES.map((p) => {
            const isSelected = primaryColor.toUpperCase() === p.hex.toUpperCase();
            return (
              <button
                key={p.hex}
                onClick={() => onChangePrimary(p.hex)}
                title={`${p.name} (${p.hex})`}
                className={`group relative flex flex-col items-center p-1 rounded-xl transition-all ${
                  isSelected ? 'ring-2 ring-brand-500 ring-offset-2' : 'hover:scale-105'
                }`}
              >
                <div
                  className="w-full aspect-square rounded-lg shadow-sm border border-black/10"
                  style={{ backgroundColor: p.hex }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Colors */}
      {recentColors && recentColors.length > 0 && (
        <div className="pt-2 border-t border-zinc-100">
          <span className="text-[11px] font-semibold uppercase text-zinc-400 block mb-2">Recent Colors</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {recentColors.slice(0, 7).map((color, idx) => (
              <button
                key={idx}
                onClick={() => onChangePrimary(color)}
                title={color}
                className="w-6 h-6 rounded-md border border-black/10 transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
