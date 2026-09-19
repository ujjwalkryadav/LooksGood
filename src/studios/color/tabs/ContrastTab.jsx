import React, { useState, useEffect } from 'react';
import { useSharedDesign } from '../../../context/SharedDesignContext';
import { useToast } from '../../../context/ToastContext';
import {
  getContrastRatio,
  evaluateContrast,
  getSuggestedAlternatives,
  isValidHex,
  normalizeHex,
  hexToHsl,
  hslToHex,
} from '../../../utils/colorUtils';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowLeftRight,
  Check,
  Wand2,
  Sliders,
  Eye,
  CheckCheck,
  Copy,
} from 'lucide-react';

export function ContrastTab() {
  const { showToast } = useToast();
  const { activePalette } = useSharedDesign();

  const [fgColor, setFgColor] = useState('#0D0C0B');
  const [bgColor, setBgColor] = useState('#FAF9F6');
  const [fgInput, setFgInput] = useState('#0D0C0B');
  const [bgInput, setBgInput] = useState('#FAF9F6');

  // Synchronize with active palette when activePalette changes
  useEffect(() => {
    if (activePalette) {
      const newFg = activePalette.text || activePalette.primary || '#0D0C0B';
      const newBg = activePalette.background || '#FAF9F6';
      setFgColor(newFg);
      setFgInput(newFg);
      setBgColor(newBg);
      setBgInput(newBg);
    }
  }, [activePalette]);

  const ratio = getContrastRatio(fgColor, bgColor);
  const evaluation = evaluateContrast(ratio);
  const alternatives = getSuggestedAlternatives(fgColor, bgColor, 4.5);

  const handleSwap = () => {
    const tempFg = fgColor;
    const tempBg = bgColor;
    setFgColor(tempBg);
    setFgInput(tempBg);
    setBgColor(tempFg);
    setBgInput(tempFg);
    showToast('Swapped text and background colors!', 'info');
  };

  const handleApplyAlternative = (hex) => {
    setFgColor(hex);
    setFgInput(hex);
    showToast(`Applied accessible alternative ${hex}!`, 'success');
  };

  const handleAutoFix = (targetRatio = 4.5) => {
    const bgHsl = hexToHsl(bgColor);
    const isBgLight = bgHsl.l > 50;
    const fgHsl = hexToHsl(fgColor);

    let newLightness = isBgLight ? Math.max(5, fgHsl.l - 40) : Math.min(95, fgHsl.l + 40);
    let newHex = hslToHex(fgHsl.h, fgHsl.s, newLightness);

    for (let step = 0; step < 100; step++) {
      const currentRatio = getContrastRatio(newHex, bgColor);
      if (currentRatio >= targetRatio) break;
      newLightness = isBgLight ? newLightness - 1 : newLightness + 1;
      if (newLightness < 0 || newLightness > 100) break;
      newHex = hslToHex(fgHsl.h, fgHsl.s, newLightness);
    }

    setFgColor(newHex);
    setFgInput(newHex);
    showToast(`Auto-adjusted foreground to ${newHex} for WCAG compliance!`, 'success');
  };

  const paletteSwatches = [
    { label: 'Primary', hex: activePalette?.primary || '#7C3AED' },
    { label: 'Secondary', hex: activePalette?.secondary || '#1E1B4B' },
    { label: 'Accent', hex: activePalette?.accent || '#EC4899' },
    { label: 'Background', hex: activePalette?.background || '#FAF9F6' },
    { label: 'Text', hex: activePalette?.text || '#0D0C0B' },
  ].filter((s) => isValidHex(s.hex));

  return (
    <div className="space-y-6 animate-fade-in pb-8 select-text">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
            <h2 className="text-xl font-black tracking-tight text-stone-900 font-display">
              WCAG 2.1 Contrast Checker
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Test and validate readability scores across all your design system color tokens.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => handleAutoFix(4.5)}
            className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center space-x-2 border border-purple-200 transition active:scale-95 cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Auto-Fix for AA (4.5:1)</span>
          </button>
        </div>
      </div>

      {/* Main Ratio Score Hero & Color Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Ratio Dial */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col items-center justify-center text-center space-y-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-stone-400">
            Contrast Ratio Score
          </span>

          <div className="text-6xl font-black font-mono tracking-tight text-stone-900 flex items-baseline justify-center">
            <span>{ratio.toFixed(2)}</span>
            <span className="text-2xl text-stone-400 ml-1">:1</span>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-xs font-bold font-mono inline-flex items-center space-x-1.5 ${
              ratio >= 7
                ? 'bg-emerald-100 text-emerald-800'
                : ratio >= 4.5
                ? 'bg-blue-100 text-blue-800'
                : ratio >= 3
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {ratio >= 4.5 ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            <span>
              {ratio >= 7
                ? 'Enhanced AAA Passed'
                : ratio >= 4.5
                ? 'Standard AA Passed'
                : ratio >= 3
                ? 'Large Text Only'
                : 'Fails WCAG 2.1'}
            </span>
          </div>
        </div>

        {/* Right: Color Inputs & Palette Quick-Select */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Foreground */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
                <span>Foreground / Text</span>
                <span className="font-mono text-stone-400 font-normal text-[11px]">{fgColor}</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => {
                    setFgColor(e.target.value);
                    setFgInput(e.target.value);
                  }}
                  className="w-11 h-11 rounded-xl cursor-pointer border p-0.5 bg-white shadow-xs"
                />
                <input
                  type="text"
                  value={fgInput}
                  onChange={(e) => {
                    setFgInput(e.target.value);
                    if (isValidHex(e.target.value)) setFgColor(normalizeHex(e.target.value));
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Background */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
                <span>Background Canvas</span>
                <span className="font-mono text-stone-400 font-normal text-[11px]">{bgColor}</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    setBgInput(e.target.value);
                  }}
                  className="w-11 h-11 rounded-xl cursor-pointer border p-0.5 bg-white shadow-xs"
                />
                <input
                  type="text"
                  value={bgInput}
                  onChange={(e) => {
                    setBgInput(e.target.value);
                    if (isValidHex(e.target.value)) setBgColor(normalizeHex(e.target.value));
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Quick Active Palette Swatches */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase">
                Active Tokens:
              </span>
              <div className="flex items-center space-x-1.5">
                {paletteSwatches.map((swatch, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setFgColor(swatch.hex);
                      setFgInput(swatch.hex);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setBgColor(swatch.hex);
                      setBgInput(swatch.hex);
                    }}
                    style={{ backgroundColor: swatch.hex }}
                    className="w-7 h-7 rounded-lg border border-stone-300 shadow-2xs hover:scale-110 transition cursor-pointer"
                    title={`Click to set FG to ${swatch.label} (${swatch.hex}), Right-click for BG`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleSwap}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Swap Colors</span>
            </button>
          </div>
        </div>
      </div>

      {/* WCAG Criteria Validation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* AA Normal Text */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">WCAG AA Normal Text</span>
            <span className="text-[10px] font-mono text-stone-400">Min 4.5:1</span>
          </div>
          <div
            className={`p-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 ${
              evaluation.aaNormal ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
            }`}
          >
            {evaluation.aaNormal ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{evaluation.aaNormal ? 'Passed (Body text readable)' : 'Failed (Low contrast)'}</span>
          </div>
        </div>

        {/* AA Large Text */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">WCAG AA Large (18pt+)</span>
            <span className="text-[10px] font-mono text-stone-400">Min 3.0:1</span>
          </div>
          <div
            className={`p-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 ${
              evaluation.aaLarge ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
            }`}
          >
            {evaluation.aaLarge ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{evaluation.aaLarge ? 'Passed (Headlines clear)' : 'Failed (Too faint)'}</span>
          </div>
        </div>

        {/* AAA Enhanced */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">WCAG AAA Enhanced</span>
            <span className="text-[10px] font-mono text-stone-400">Min 7.0:1</span>
          </div>
          <div
            className={`p-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 ${
              evaluation.aaaNormal ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
            }`}
          >
            {evaluation.aaaNormal ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
            <span>{evaluation.aaaNormal ? 'Passed (Top-tier accessibility)' : 'AA Only'}</span>
          </div>
        </div>
      </div>

      {/* Live Preview Card */}
      <div
        className="rounded-3xl p-8 border shadow-lg transition-all"
        style={{ backgroundColor: bgColor, color: fgColor, borderColor: fgColor + '20' }}
      >
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span
              className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full"
              style={{ backgroundColor: fgColor + '15', color: fgColor }}
            >
              Live Contrast Preview
            </span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-black font-display tracking-tight">
            High contrast guarantees effortless readability.
          </h3>

          <p className="text-sm font-normal leading-relaxed opacity-90 font-sans">
            Good design is inclusive by default. When typography contrasts sharply with background
            surfaces, users can scan information quickly without eye fatigue across any screen brightness.
          </p>

          <div className="pt-2 flex items-center space-x-3">
            <button
              className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition"
              style={{ backgroundColor: fgColor, color: bgColor }}
            >
              Primary Action Button
            </button>
            <span className="text-xs font-mono opacity-70">
              Ratio: {ratio.toFixed(2)}:1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
