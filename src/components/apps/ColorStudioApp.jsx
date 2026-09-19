import React, { useState, useEffect } from 'react';
import { useSharedDesign } from '../../context/SharedDesignContext';
import { useToast } from '../../context/ToastContext';
import {
  hexToHsl,
  hslToHex,
  hexToRgb,
  rgbToHex,
  isValidHex,
  normalizeHex,
  getContrastRatio,
  getRelativeLuminance,
} from '../../utils/colorUtils';
import {
  Sparkles,
  Shuffle,
  RotateCcw,
  Copy,
  Sliders,
  Layers,
  Code2,
  Check,
  CheckCircle2,
  ArrowRightLeft,
  SunMedium,
  Palette,
  Eye,
  Lock,
  Unlock
} from 'lucide-react';
import { CopyButton } from '../common/CopyButton';

// Recommended starting primaries
const RECOMMENDED_PRIMARIES = [
  { name: 'Electric Violet', hex: '#7C3AED' },
  { name: 'Royal Indigo', hex: '#4F46E5' },
  { name: 'Cobalt Blue', hex: '#2563EB' },
  { name: 'Ocean Cyan', hex: '#0284C7' },
  { name: 'Emerald Forest', hex: '#059669' },
  { name: 'Sunset Crimson', hex: '#E11D48' },
  { name: 'Spicy Paprika', hex: '#EA580C' },
  { name: 'Amber Gold', hex: '#D97706' },
  { name: 'Dark Obsidian', hex: '#18181B' },
];

export function ColorStudioApp({ onOpenGuided }) {
  const { showToast } = useToast();
  const {
    activePalette,
    activePrimaryHex,
    updatePrimaryHex,
    updatePalette,
  } = useSharedDesign();

  const [selectedColor, setSelectedColor] = useState(activePrimaryHex || '#7C3AED');
  const [hexInputValue, setHexInputValue] = useState(activePrimaryHex || '#7C3AED');
  const [harmonyMode, setHarmonyMode] = useState('complementary'); // 'complementary', 'analogous', 'triadic', 'split', 'monochromatic'
  const [lockedColors, setLockedColors] = useState({});
  const [compareColorB, setCompareColorB] = useState('#FAF9F6');
  const [exportFormat, setExportFormat] = useState('css'); // 'css', 'tailwind', 'json'

  const hsl = hexToHsl(selectedColor);
  const rgb = hexToRgb(selectedColor);

  // Sync external primary updates
  useEffect(() => {
    if (activePrimaryHex && activePrimaryHex !== selectedColor) {
      setSelectedColor(activePrimaryHex);
      setHexInputValue(activePrimaryHex);
    }
  }, [activePrimaryHex]);

  // Generate 5-role palette automatically from current selected color & harmony mode
  const generateAndSetPalette = (baseHex, mode = harmonyMode) => {
    const baseHsl = hexToHsl(baseHex);
    const wrap = (val) => ((val % 360) + 360) % 360;

    let secHue = wrap(baseHsl.h + 30);
    let accHue = wrap(baseHsl.h + 150);

    if (mode === 'complementary') {
      secHue = wrap(baseHsl.h + 180);
      accHue = wrap(baseHsl.h + 90);
    } else if (mode === 'triadic') {
      secHue = wrap(baseHsl.h + 120);
      accHue = wrap(baseHsl.h + 240);
    } else if (mode === 'split') {
      secHue = wrap(baseHsl.h + 150);
      accHue = wrap(baseHsl.h + 210);
    } else if (mode === 'monochromatic') {
      secHue = baseHsl.h;
      accHue = baseHsl.h;
    }

    const primary = lockedColors['PRIMARY'] || baseHex.toUpperCase();
    const secondary = lockedColors['SECONDARY'] || (mode === 'monochromatic' 
      ? hslToHex(baseHsl.h, Math.max(20, baseHsl.s - 20), 30).toUpperCase()
      : hslToHex(secHue, Math.max(30, baseHsl.s - 15), 35).toUpperCase());
    
    const accent = lockedColors['ACCENT'] || (mode === 'monochromatic'
      ? hslToHex(baseHsl.h, Math.min(100, baseHsl.s + 15), 65).toUpperCase()
      : hslToHex(accHue, Math.min(95, baseHsl.s + 10), 55).toUpperCase());
    
    const bg = lockedColors['BACKGROUND'] || '#FAF9F6';
    const text = lockedColors['TEXT'] || '#0D0C0B';

    const newPal = [
      { role: 'PRIMARY', name: 'Primary Brand', hex: primary, desc: 'Main identity color & primary interactive buttons' },
      { role: 'SECONDARY', name: 'Secondary Supporting', hex: secondary, desc: 'Structural cards, headers & secondary elements' },
      { role: 'ACCENT', name: 'Vibrant Accent', hex: accent, desc: 'Notice badges, highlights & attention-grabbers' },
      { role: 'BACKGROUND', name: 'Canvas Surface', hex: bg, desc: 'Clean high-comfort background backdrop' },
      { role: 'TEXT', name: 'Typography Text', hex: text, desc: 'Sharp contrast body paragraphs and reading titles' },
    ];

    updatePalette(newPal);
  };

  const handleHueChange = (newHue) => {
    const newHex = hslToHex(newHue, hsl.s || 80, hsl.l || 50);
    setSelectedColor(newHex);
    setHexInputValue(newHex);
    updatePrimaryHex(newHex);
    generateAndSetPalette(newHex, harmonyMode);
  };

  const handleHexSubmit = (value) => {
    setHexInputValue(value);
    const normalized = normalizeHex(value);
    if (isValidHex(normalized)) {
      setSelectedColor(normalized);
      updatePrimaryHex(normalized);
      generateAndSetPalette(normalized, harmonyMode);
    }
  };

  const handleRandomize = () => {
    const randomHue = Math.floor(Math.random() * 360);
    const randomHex = hslToHex(randomHue, 80, 50);
    setSelectedColor(randomHex);
    setHexInputValue(randomHex);
    updatePrimaryHex(randomHex);
    generateAndSetPalette(randomHex, harmonyMode);
    showToast('Generated fresh harmonic combination!', 'success');
  };

  const toggleLockColor = (role, hex, e) => {
    e.stopPropagation();
    setLockedColors((prev) => {
      const copy = { ...prev };
      if (copy[role]) {
        delete copy[role];
        showToast(`Unlocked ${role}`, 'info');
      } else {
        copy[role] = hex;
        showToast(`Locked ${role} (${hex})`, 'success');
      }
      return copy;
    });
  };

  // Generate Tint & Shade Ladder (50 - 900)
  const generateShades = (hex) => {
    const baseH = hexToHsl(hex);
    return [
      { step: 50, hex: hslToHex(baseH.h, Math.max(20, baseH.s - 20), 96) },
      { step: 100, hex: hslToHex(baseH.h, Math.max(30, baseH.s - 15), 90) },
      { step: 200, hex: hslToHex(baseH.h, Math.max(40, baseH.s - 10), 80) },
      { step: 300, hex: hslToHex(baseH.h, Math.max(50, baseH.s - 5), 70) },
      { step: 400, hex: hslToHex(baseH.h, baseH.s, 60) },
      { step: 500, hex: hex },
      { step: 600, hex: hslToHex(baseH.h, baseH.s, 42) },
      { step: 700, hex: hslToHex(baseH.h, Math.min(100, baseH.s + 5), 32) },
      { step: 800, hex: hslToHex(baseH.h, Math.min(100, baseH.s + 10), 22) },
      { step: 900, hex: hslToHex(baseH.h, Math.min(100, baseH.s + 15), 12) },
    ];
  };

  // Comparison metrics between Primary and selected Color B
  const contrastWithB = getContrastRatio(selectedColor, compareColorB);
  const isAA = contrastWithB >= 4.5;
  const isAAA = contrastWithB >= 7.0;

  // Code Export String Builder
  const getExportCode = () => {
    if (exportFormat === 'css') {
      return `:root {\n  --color-primary: ${activePalette[0]?.hex || '#7C3AED'};\n  --color-secondary: ${activePalette[1]?.hex || '#4F46E5'};\n  --color-accent: ${activePalette[2]?.hex || '#EC4899'};\n  --color-background: ${activePalette[3]?.hex || '#FAF9F6'};\n  --color-text: ${activePalette[4]?.hex || '#0D0C0B'};\n}`;
    }
    if (exportFormat === 'tailwind') {
      return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        brand: {\n          primary: '${activePalette[0]?.hex || '#7C3AED'}',\n          secondary: '${activePalette[1]?.hex || '#4F46E5'}',\n          accent: '${activePalette[2]?.hex || '#EC4899'}',\n          surface: '${activePalette[3]?.hex || '#FAF9F6'}',\n          ink: '${activePalette[4]?.hex || '#0D0C0B'}',\n        }\n      }\n    }\n  }\n}`;
    }
    return JSON.stringify(
      activePalette.reduce((acc, p) => ({ ...acc, [p.role.toLowerCase()]: p.hex }), {}),
      null,
      2
    );
  };

  return (
    <div className="space-y-6 pb-6 select-text text-stone-900 font-sans">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight">Color Studio Engine</h2>
            <p className="text-xs text-stone-500 font-medium">Input any primary color to calculate harmonies, contrast & 5-role systems</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRandomize}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold font-mono transition flex items-center space-x-1.5"
          >
            <Shuffle className="w-3.5 h-3.5 text-purple-600" />
            <span>Randomize</span>
          </button>

          {onOpenGuided && (
            <button
              onClick={onOpenGuided}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Creator</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Workstation: Color Wheel, Input & 5-Role Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Color Wheel & Precise Color Controls (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-xs font-mono font-bold uppercase text-stone-600">1. Primary Input</span>
            <span className="text-xs font-mono font-bold text-purple-600">{selectedColor.toUpperCase()}</span>
          </div>

          {/* Interactive Color Wheel */}
          <div className="relative flex justify-center py-2">
            <div
              className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-full cursor-pointer shadow-md border-4 border-white transition-transform hover:scale-[1.02]"
              style={{
                background: 'conic-gradient(from 0deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
                if (angle < 0) angle += 360;
                handleHueChange(Math.round(angle));
              }}
            >
              {/* Inner Circle Cutout */}
              <div className="absolute inset-7 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                <div
                  className="w-10 h-10 rounded-xl shadow-sm border border-stone-200 mb-1"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="text-xs font-mono font-bold text-stone-900">{selectedColor.toUpperCase()}</span>
              </div>

              {/* Angle Indicator Pin */}
              <div
                className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  top: `${50 - 45 * Math.cos((hsl.h * Math.PI) / 180)}%`,
                  left: `${50 + 45 * Math.sin((hsl.h * Math.PI) / 180)}%`,
                  backgroundColor: selectedColor,
                }}
              />
            </div>
          </div>

          {/* Hue Range Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono font-semibold text-stone-500">
              <span>Hue Angle</span>
              <span>{Math.round(hsl.h)}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={Math.round(hsl.h)}
              onChange={(e) => handleHueChange(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>

          {/* Color Inputs: HEX, RGB, HSL */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-mono font-bold text-stone-400 block uppercase">HEX</span>
              <input
                type="text"
                value={hexInputValue}
                onChange={(e) => handleHexSubmit(e.target.value)}
                className="w-full bg-transparent text-xs font-mono font-bold text-stone-900 focus:outline-none"
              />
            </div>
            <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-mono font-bold text-stone-400 block uppercase">RGB</span>
              <span className="text-xs font-mono font-bold text-stone-800">{rgb.r}, {rgb.g}, {rgb.b}</span>
            </div>
            <div className="p-2 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-mono font-bold text-stone-400 block uppercase">HSL</span>
              <span className="text-xs font-mono font-bold text-stone-800">{hsl.h}°, {hsl.s}%, {hsl.l}%</span>
            </div>
          </div>

          {/* Recommended Starting Colors */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-mono font-bold text-stone-500 uppercase block">
              Curated Starting Primaries:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {RECOMMENDED_PRIMARIES.map((p) => (
                <button
                  key={p.hex}
                  onClick={() => handleHexSubmit(p.hex)}
                  title={p.name}
                  className="w-6 h-6 rounded-lg border border-stone-200 hover:scale-110 active:scale-95 transition-transform shadow-2xs"
                  style={{ backgroundColor: p.hex }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Calculated 5-Role Harmony System (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-stone-600 block">
                2. Intentional 5-Role Palette
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                Balanced color roles with mathematical luminance contrast
              </span>
            </div>

            {/* Harmony Mode Selector */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              {[
                { id: 'complementary', label: 'Complementary' },
                { id: 'analogous', label: 'Analogous' },
                { id: 'triadic', label: 'Triadic' },
                { id: 'split', label: 'Split' },
                { id: 'monochromatic', label: 'Mono' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setHarmonyMode(m.id);
                    generateAndSetPalette(selectedColor, m.id);
                  }}
                  className={`px-2 py-1 text-[11px] font-mono font-bold rounded-lg transition ${
                    harmonyMode === m.id
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5 Swatches Stack */}
          <div className="space-y-2.5">
            {activePalette.map((item) => {
              const isLocked = !!lockedColors[item.role];
              const lum = getRelativeLuminance(item.hex);
              const isDark = lum < 0.45;

              return (
                <div
                  key={item.role}
                  className="p-3 rounded-xl border border-stone-200 flex items-center justify-between gap-3 hover:border-purple-300 transition"
                  style={{ backgroundColor: '#FAF9F6' }}
                >
                  <div className="flex items-center space-x-3">
                    {/* Swatch Pill */}
                    <div
                      className="w-12 h-12 rounded-xl shadow-xs border border-black/10 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: item.hex }}
                    >
                      <button
                        onClick={(e) => toggleLockColor(item.role, item.hex, e)}
                        className="p-1 rounded-md bg-black/20 hover:bg-black/40 text-white transition"
                        title={isLocked ? 'Unlock color' : 'Lock color'}
                      >
                        {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 opacity-60" />}
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-black text-stone-900">{item.hex}</span>
                        <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded bg-purple-100 text-purple-700 border border-purple-200">
                          {item.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 font-medium">{item.desc}</p>
                    </div>
                  </div>

                  <CopyButton
                    text={item.hex}
                    toastMessage={`Copied ${item.role} (${item.hex})`}
                    className="px-2.5 py-1 text-xs font-mono font-semibold bg-white border border-stone-200 rounded-lg hover:border-purple-300 shadow-2xs"
                  />
                </div>
              );
            })}
          </div>

          {/* Tint & Shade Ladder Strip */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <span className="text-[11px] font-mono font-bold text-stone-500 uppercase block">
              Primary Tint & Shade Ladder (50 - 900):
            </span>
            <div className="grid grid-cols-10 gap-1">
              {generateShades(selectedColor).map((s) => (
                <div
                  key={s.step}
                  onClick={() => handleHexSubmit(s.hex)}
                  title={`${s.step}: ${s.hex}`}
                  className="h-8 rounded-lg cursor-pointer border border-black/10 hover:scale-105 active:scale-95 transition-transform flex flex-col justify-end p-0.5"
                  style={{ backgroundColor: s.hex }}
                >
                  <span className={`text-[8px] font-mono font-bold text-center ${s.step > 400 ? 'text-white' : 'text-stone-800'}`}>
                    {s.step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Color Comparison & Contrast Checker Module */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-mono font-bold uppercase text-stone-700">3. Color Comparison & Contrast Check</h3>
          </div>
          <span className="text-[11px] font-mono text-stone-400">WCAG 2.1 Optical Matrix</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {/* Color A (Primary) */}
          <div className="p-4 rounded-xl border border-stone-200 space-y-2 bg-stone-50">
            <span className="text-[10px] font-mono font-bold text-stone-400 uppercase">Color A (Active Primary)</span>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl shadow-xs border border-black/10" style={{ backgroundColor: selectedColor }} />
              <div>
                <span className="text-xs font-mono font-bold text-stone-900 block">{selectedColor.toUpperCase()}</span>
                <span className="text-[10px] text-stone-500 font-mono">Luminance: {getRelativeLuminance(selectedColor).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Color B (Comparison) */}
          <div className="p-4 rounded-xl border border-stone-200 space-y-2 bg-stone-50">
            <span className="text-[10px] font-mono font-bold text-stone-400 uppercase">Color B (Canvas / Target)</span>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={compareColorB}
                onChange={(e) => setCompareColorB(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-black/10"
              />
              <div>
                <input
                  type="text"
                  value={compareColorB}
                  onChange={(e) => setCompareColorB(e.target.value)}
                  className="text-xs font-mono font-bold text-stone-900 bg-transparent focus:outline-none w-20"
                />
                <span className="text-[10px] text-stone-500 font-mono block">Luminance: {getRelativeLuminance(compareColorB).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Contrast Result Score Card */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2 text-center">
            <span className="text-[10px] font-mono font-bold text-purple-700 uppercase block">Contrast Ratio</span>
            <div className="text-2xl font-black font-mono text-stone-900">
              {contrastWithB.toFixed(1)} : 1
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${isAA ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                AA {isAA ? 'Pass' : 'Fail'}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${isAAA ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                AAA {isAAA ? 'Pass' : 'Fail'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Export Design Tokens Panel */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-mono font-bold uppercase text-stone-700">4. Export Color Tokens</h3>
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            {['css', 'tailwind', 'json'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setExportFormat(fmt)}
                className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-lg transition ${
                  exportFormat === fmt ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div className="relative p-3 rounded-xl bg-stone-900 text-purple-200 font-mono text-xs overflow-x-auto">
          <pre>{getExportCode()}</pre>
          <div className="absolute top-2 right-2">
            <CopyButton
              text={getExportCode()}
              toastMessage={`Copied ${exportFormat.toUpperCase()} tokens to clipboard!`}
              className="px-2 py-1 text-[10px] bg-stone-800 hover:bg-stone-700 text-white rounded-md border border-stone-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorStudioApp;
