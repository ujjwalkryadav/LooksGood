import React, { useState, useEffect } from 'react';
import { useSharedDesign } from '../../../context/SharedDesignContext';
import { useToast } from '../../../context/ToastContext';
import {
  hexToHsl,
  hslToHex,
  hexToRgb,
  isValidHex,
  normalizeHex,
  getContrastRatio,
  evaluateContrast,
} from '../../../utils/colorUtils';
import {
  Shuffle,
  Lock,
  Unlock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CopyButton } from '../../../components/common/CopyButton';

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

const HARMONY_MODES = [
  { id: 'complementary', label: 'Complementary', angle: '180°', desc: 'High visual punch & maximum contrast' },
  { id: 'analogous', label: 'Analogous', angle: '30°', desc: 'Serene, natural & cohesive feel' },
  { id: 'triadic', label: 'Triadic', angle: '120°', desc: 'Vibrant, balanced 3-point energy' },
  { id: 'split', label: 'Split-Comp', angle: '150°/210°', desc: 'Rich contrast with subtle balance' },
  { id: 'monochromatic', label: 'Monochromatic', angle: '0°', desc: 'Clean, elegant single-hue depth' },
];

export function PaletteGeneratorTab({ onNavigateTab }) {
  const { showToast } = useToast();
  const {
    activePalette,
    activePrimaryHex,
    updatePrimaryHex,
    updatePalette,
    sendPaletteToColorStudio,
  } = useSharedDesign();

  const [selectedColor, setSelectedColor] = useState(activePrimaryHex || '#7C3AED');
  const [hexInput, setHexInput] = useState(activePrimaryHex || '#7C3AED');
  const [harmonyMode, setHarmonyMode] = useState('complementary');
  const [lockedRoles, setLockedRoles] = useState({});

  const hsl = hexToHsl(selectedColor);
  const rgb = hexToRgb(selectedColor);

  useEffect(() => {
    if (activePrimaryHex && activePrimaryHex !== selectedColor) {
      setSelectedColor(activePrimaryHex);
      setHexInput(activePrimaryHex);
    }
  }, [activePrimaryHex]);

  // Generate 5-role palette
  const generatePaletteFromBase = (baseHex, mode = harmonyMode) => {
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

    const primary = lockedRoles['PRIMARY'] || baseHex.toUpperCase();
    const secondary =
      lockedRoles['SECONDARY'] ||
      (mode === 'monochromatic'
        ? hslToHex(baseHsl.h, Math.max(20, baseHsl.s - 20), 30).toUpperCase()
        : hslToHex(secHue, Math.max(30, baseHsl.s - 15), 35).toUpperCase());

    const accent =
      lockedRoles['ACCENT'] ||
      (mode === 'monochromatic'
        ? hslToHex(baseHsl.h, Math.min(100, baseHsl.s + 15), 65).toUpperCase()
        : hslToHex(accHue, Math.min(100, baseHsl.s + 10), 55).toUpperCase());

    const isPrimaryDark = baseHsl.l < 50;
    const background =
      lockedRoles['BACKGROUND'] ||
      (isPrimaryDark ? '#FAF9F6' : hslToHex(baseHsl.h, 15, 96).toUpperCase());

    const text =
      lockedRoles['TEXT'] ||
      (isPrimaryDark ? '#0D0C0B' : '#0F172A');

    return {
      primary,
      secondary,
      accent,
      background,
      text,
    };
  };

  const handleBaseColorChange = (newHex) => {
    setSelectedColor(newHex);
    setHexInput(newHex);
    updatePrimaryHex(newHex);
    const newPal = generatePaletteFromBase(newHex, harmonyMode);
    updatePalette(newPal);
  };

  const handleHarmonyChange = (newMode) => {
    setHarmonyMode(newMode);
    const newPal = generatePaletteFromBase(selectedColor, newMode);
    updatePalette(newPal);
    showToast(`Switched harmony mode to ${newMode.toUpperCase()}`);
  };

  const toggleLock = (roleKey) => {
    setLockedRoles((prev) => {
      const next = { ...prev };
      if (next[roleKey]) {
        delete next[roleKey];
        showToast(`Unlocked ${roleKey} color`, 'info');
      } else {
        const val = activePalette[roleKey.toLowerCase()];
        next[roleKey] = val;
        showToast(`Locked ${roleKey} to ${val}`, 'success');
      }
      return next;
    });
  };

  const handleRandomHarmonize = () => {
    const randomHue = Math.floor(Math.random() * 360);
    const randomSat = Math.floor(60 + Math.random() * 35);
    const randomLit = Math.floor(40 + Math.random() * 20);
    const newHex = hslToHex(randomHue, randomSat, randomLit);
    handleBaseColorChange(newHex);
    showToast('Generated fresh harmonic palette!', 'success');
  };

  const roles = [
    { key: 'PRIMARY', label: 'Primary Brand (60%)', hex: activePalette.primary || selectedColor, desc: 'Main brand anchors, CTA buttons & hero highlights' },
    { key: 'SECONDARY', label: 'Secondary Depth (30%)', hex: activePalette.secondary || '#2D2422', desc: 'Structural cards, headers & visual grounding' },
    { key: 'ACCENT', label: 'Accent Energy (10%)', hex: activePalette.accent || '#E11D48', desc: 'Notification badges, key callouts & highlights' },
    { key: 'BACKGROUND', label: 'Surface Canvas', hex: activePalette.background || '#FAF9F6', desc: 'Main canvas background & clean surface area' },
    { key: 'TEXT', label: 'Ink Typography', hex: activePalette.text || '#0D0C0B', desc: 'Readable body copy & high-contrast headlines' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* 1. Header with Harmonize & Quick Action bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-stone-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
            <h2 className="text-xl font-black tracking-tight text-stone-900 font-display">
              Harmonic Color Generator
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Pick a core brand hue and calculate mathematical 5-role harmonious UI palette.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleRandomHarmonize}
            className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center space-x-2 border border-purple-200 transition active:scale-95"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Random Harmonize (Space)</span>
          </button>

          <button
            onClick={() => {
              if (onNavigateTab) onNavigateTab('shades');
            }}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition active:scale-95"
          >
            <Layers className="w-3.5 h-3.5 text-stone-300" />
            <span>Build Shade Scale</span>
          </button>
        </div>
      </div>

      {/* 2. Main 5-Role Palette Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500">
            Active 5-Role System
          </h3>
          <span className="text-[11px] text-stone-400 font-medium">
            Click lock icon to preserve individual role during harmonization
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {roles.map((role) => {
            const isLocked = !!lockedRoles[role.key];
            const contrastOnWhite = getContrastRatio(role.hex, '#FFFFFF');
            const isDark = hexToHsl(role.hex).l < 55;

            return (
              <div
                key={role.key}
                className="group relative rounded-2xl p-4 transition-all duration-300 hover:shadow-lg border border-stone-200/80 bg-white flex flex-col justify-between h-48 overflow-hidden"
              >
                {/* Top swatch pill preview */}
                <div
                  className="w-full h-16 rounded-xl transition-transform group-hover:scale-102 flex items-center justify-between px-3 shadow-inner relative overflow-hidden"
                  style={{ backgroundColor: role.hex }}
                >
                  <span
                    className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-md ${
                      isDark ? 'bg-black/30 text-white' : 'bg-white/40 text-stone-900'
                    }`}
                  >
                    {role.key}
                  </span>

                  <button
                    onClick={() => toggleLock(role.key)}
                    className={`p-1.5 rounded-lg backdrop-blur-md transition ${
                      isLocked
                        ? 'bg-amber-500 text-white shadow-xs'
                        : isDark
                        ? 'bg-black/20 text-white/80 hover:bg-black/40 hover:text-white'
                        : 'bg-white/50 text-stone-800 hover:bg-white/80'
                    }`}
                    title={isLocked ? 'Unlock color' : 'Lock color'}
                  >
                    {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Bottom Details */}
                <div className="pt-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 font-mono">
                      {role.hex.toUpperCase()}
                    </span>
                    <CopyButton text={role.hex} label="" />
                  </div>
                  <p className="text-[10px] text-stone-500 font-medium leading-tight">
                    {role.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Color Controls & Harmony Modes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Primary Color Wheel / Sliders */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-900 font-sans">
              Base Color Chooser
            </h4>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-100">
              {selectedColor.toUpperCase()}
            </span>
          </div>

          {/* Native HTML Color Picker + Live Hex Input */}
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleBaseColorChange(e.target.value)}
              className="w-14 h-14 rounded-2xl cursor-pointer border-2 border-stone-200 p-0.5 bg-white shadow-xs"
            />
            <div className="flex-1">
              <label className="text-[11px] font-mono text-stone-400 font-bold uppercase block mb-1">
                HEX Value
              </label>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => {
                  setHexInput(e.target.value);
                  if (isValidHex(e.target.value)) {
                    handleBaseColorChange(normalizeHex(e.target.value));
                  }
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                placeholder="#7C3AED"
              />
            </div>
          </div>

          {/* Color Values Readout: HSL, RGB */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-mono">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <span className="text-stone-400 block text-[9px] uppercase font-bold">HSL Values</span>
              <span className="font-bold text-stone-800">
                {hsl.h}°, {hsl.s}%, {hsl.l}%
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <span className="text-stone-400 block text-[9px] uppercase font-bold">RGB Values</span>
              <span className="font-bold text-stone-800">
                {rgb.r}, {rgb.g}, {rgb.b}
              </span>
            </div>
          </div>

          {/* Recommended Starter Primaries */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <span className="text-[11px] font-mono font-bold text-stone-400 uppercase block">
              Curated Starter Hues
            </span>
            <div className="grid grid-cols-3 gap-2">
              {RECOMMENDED_PRIMARIES.map((item) => (
                <button
                  key={item.hex}
                  onClick={() => handleBaseColorChange(item.hex)}
                  className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition ${
                    selectedColor.toUpperCase() === item.hex.toUpperCase()
                      ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20'
                      : 'border-stone-200 bg-stone-50/60 hover:bg-white'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shadow-xs flex-shrink-0"
                    style={{ backgroundColor: item.hex }}
                  />
                  <span className="text-[11px] font-bold text-stone-800 truncate font-sans">
                    {item.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Harmony Calculation Modes & Live Theory */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-900 font-sans">
                Color Harmony Algorithm
              </h4>
              <span className="text-xs text-stone-400 font-medium">
                Mathematical color wheel ratios
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HARMONY_MODES.map((mode) => {
                const isSelected = harmonyMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleHarmonyChange(mode.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-2 ring-purple-500/20'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-900 font-sans">
                        {mode.label}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-100">
                        {mode.angle}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-medium leading-relaxed">
                      {mode.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Navigation to Other Color Tools */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-stone-900 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-purple-950/10">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-bold tracking-tight font-display">
                Need WCAG 2.1 Accessibility Verification?
              </h4>
              <p className="text-xs text-purple-200 font-medium">
                Test contrast compliance ratio between any role pair and apply 1-click auto-fix.
              </p>
            </div>

            <button
              onClick={() => {
                if (onNavigateTab) onNavigateTab('contrast');
              }}
              className="px-5 py-2.5 rounded-xl bg-white text-stone-900 font-bold text-xs hover:bg-purple-50 transition flex items-center space-x-1.5 shadow-md flex-shrink-0 active:scale-95"
            >
              <span>Launch WCAG Checker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
