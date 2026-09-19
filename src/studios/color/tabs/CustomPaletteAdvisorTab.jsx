import React, { useState } from 'react';
import { useSharedDesign } from '../../../context/SharedDesignContext';
import { useToast } from '../../../context/ToastContext';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Copy,
  RotateCcw,
  Shuffle,
  Globe,
  Smartphone,
  ShieldCheck,
  Utensils,
  Crown,
  Leaf,
  Gamepad2,
  Zap,
  Flame,
  Snowflake,
  Gem,
  Check,
  Layers,
  Sliders,
  CheckCircle2,
  Presentation,
  Package,
  BookOpen,
  Eye,
  CheckCheck,
} from 'lucide-react';
import {
  hexToHsl,
  hslToHex,
} from '../../../utils/colorUtils';

// ============================================================================
// DESIGNER-FOCUSED WIZARD STEPS
// ============================================================================

const COLOR_COUNT_OPTIONS = [
  {
    count: 1,
    title: '1 Color',
    subtitle: 'Monotone Signature',
    tag: 'Monochrome',
    previewHues: [255],
  },
  {
    count: 2,
    title: '2 Colors',
    subtitle: 'High-Contrast Duo',
    tag: 'Dominant + CTA',
    previewHues: [220, 25],
  },
  {
    count: 3,
    title: '3 Colors',
    subtitle: '60-30-10 Rule',
    tag: 'Golden Standard',
    previewHues: [215, 230, 28],
    recommended: true,
  },
  {
    count: 4,
    title: '4 Colors',
    subtitle: 'Quad Brand System',
    tag: 'Brand Suite',
    previewHues: [265, 220, 340, 45],
  },
  {
    count: 5,
    title: '5 Colors',
    subtitle: 'Full UI System',
    tag: 'Design System',
    previewHues: [218, 160, 350, 220, 225],
  },
  {
    count: 6,
    title: '6 Colors',
    subtitle: 'Extended Palette',
    tag: 'Multi-Tier',
    previewHues: [250, 200, 150, 45, 10, 280],
  },
  {
    count: 7,
    title: '7 Colors',
    subtitle: 'Enterprise Scale',
    tag: 'Master Tokens',
    previewHues: [220, 260, 340, 160, 40, 200, 290],
  },
];

const VIBE_OPTIONS = [
  {
    id: 'cool',
    title: 'Cool Spectrum',
    tag: 'Trust, Calm & Tech',
    icon: Snowflake,
    desc: 'Deep blues, fresh teals & royal purples for technology, SaaS, and enterprise credibility.',
    baseHue: 218,
    previewHexes: ['#2563EB', '#0D9488', '#7C3AED'],
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'warm',
    title: 'Warm Spectrum',
    tag: 'Energy, Urgency & Appetite',
    icon: Flame,
    desc: 'Vibrant crimsons, amber oranges & sun golds for high-converting marketing, sales, and food.',
    baseHue: 16,
    previewHexes: ['#E11D48', '#EA580C', '#D97706'],
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  {
    id: 'neutral',
    title: 'Obsidian & Neutrals',
    tag: 'Luxury, Power & Minimal',
    icon: Gem,
    desc: 'Charcoal slate, warm cream & champagne accents for luxury brands, editorial, and minimal UI.',
    baseHue: 230,
    previewHexes: ['#0F172A', '#475569', '#E2E8F0'],
    badgeClass: 'bg-stone-100 text-stone-800 border-stone-300',
  },
  {
    id: 'electric',
    title: 'Electric & Cyber',
    tag: 'High Voltage & Modern',
    icon: Zap,
    desc: 'Neon violet, electric cyan & hyper pink for gaming, web3, and avant-garde creative studios.',
    baseHue: 280,
    previewHexes: ['#8B5CF6', '#06B6D4', '#EC4899'],
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
  },
];

const PURPOSE_OPTIONS = [
  {
    id: 'presentation',
    title: 'Pitch Deck & Presentation',
    category: 'Slides & Decks',
    icon: Presentation,
    desc: 'High-contrast slides, clean chart accents, and strong presenter readability.',
    hueMod: 5,
    satMod: -5,
  },
  {
    id: 'brand',
    title: 'Brand Identity & Logo',
    category: 'Identity System',
    icon: Sparkles,
    desc: 'Memorable signature brand color, distinct secondary, and versatile assets.',
    hueMod: 0,
    satMod: 15,
  },
  {
    id: 'saas',
    title: 'Website & SaaS Platform',
    category: 'Digital Product',
    icon: Globe,
    desc: 'Clear visual hierarchy, structural cards, and high-converting CTA buttons.',
    hueMod: 0,
    satMod: 5,
  },
  {
    id: 'marketing',
    title: 'Marketing Ad & Poster',
    category: 'Advertising & Social',
    icon: Zap,
    desc: 'Thumb-stopping visual contrast, strong urgency, and quick focal points.',
    hueMod: 20,
    satMod: 25,
  },
  {
    id: 'app',
    title: 'Mobile App (iOS / Android)',
    category: 'Mobile UI/UX',
    icon: Smartphone,
    desc: 'Comfortable dark/light surfaces, accessible touch targets, and balanced states.',
    hueMod: -15,
    satMod: 0,
  },
  {
    id: 'print',
    title: 'Packaging & Editorial',
    category: 'Print & Publication',
    icon: Package,
    desc: 'Rich tactile ink depths, elegant paper surfaces, and shelf appeal.',
    hueMod: 30,
    satMod: -10,
  },
  {
    id: 'fintech',
    title: 'Fintech & Enterprise',
    category: 'Finance & Security',
    icon: ShieldCheck,
    desc: 'Dependable deep navy blues, structured borders, and secure aesthetics.',
    hueMod: 10,
    satMod: -15,
  },
  {
    id: 'food',
    title: 'Food, Cafe & Restaurant',
    category: 'Hospitality',
    icon: Utensils,
    desc: 'Appetizing spicy warm tones, fresh natural highlights, and warm ambiance.',
    hueMod: 35,
    satMod: 20,
  },
  {
    id: 'luxury',
    title: 'Luxury, Fashion & Beauty',
    category: 'Prestige Goods',
    icon: Crown,
    desc: 'Obsidian blacks, warm champagne gold trims, and understated elegance.',
    hueMod: 40,
    satMod: -30,
  },
  {
    id: 'eco',
    title: 'Eco, Botanic & Health',
    category: 'Wellness & Nature',
    icon: Leaf,
    desc: 'Restorative botanic emeralds, fresh vitality greens, and organic tones.',
    hueMod: 140,
    satMod: 10,
  },
  {
    id: 'cyber',
    title: 'Gaming & Cyber Tech',
    category: 'Entertainment',
    icon: Gamepad2,
    desc: 'High-voltage electric neons on ultra-deep dark backgrounds.',
    hueMod: 65,
    satMod: 35,
  },
  {
    id: 'editorial',
    title: 'Magazine & Content Hub',
    category: 'Publishing',
    icon: BookOpen,
    desc: 'Sharp typography contrast, editorial margin tones, and comfortable longform reading.',
    hueMod: -30,
    satMod: -20,
  },
];

const HARMONY_OPTIONS = [
  {
    id: 'rule-60-30-10',
    title: '60-30-10 Golden Ratio',
    tag: 'Industry Standard',
    desc: '60% Dominant Base, 30% Secondary Structure, 10% Pop Accent CTA.',
    icon: Sparkles,
  },
  {
    id: 'complementary',
    title: 'Complementary Contrast',
    tag: '180° Wheel Opposites',
    desc: 'Maximum visual tension between background and call-to-action buttons.',
    icon: ArrowRight,
  },
  {
    id: 'split-complementary',
    title: 'Split-Complementary',
    tag: 'Softened High Contrast',
    desc: 'Base color with adjacent hues of its opposite. High impact without visual fatigue.',
    icon: Layers,
  },
  {
    id: 'analogous',
    title: 'Analogous Harmony',
    tag: '30° Adjacent Hues',
    desc: 'Smooth, continuous natural flow seen in organic lifestyle designs.',
    icon: Sliders,
  },
  {
    id: 'triadic',
    title: 'Triadic Dynamic',
    tag: '120° Triangle Points',
    desc: 'Vibrant, playful, and energetic multi-tone balance.',
    icon: Shuffle,
  },
  {
    id: 'monochromatic',
    title: 'Monochromatic Tonal',
    tag: 'Single-Hue Depth',
    desc: 'Sophisticated lightness and saturation steps of one core color.',
    icon: Gem,
  },
];

export function CustomPaletteAdvisorTab({ onNavigateTab }) {
  const { showToast } = useToast();
  const { sendPaletteToColorStudio } = useSharedDesign();

  // Wizard Step: 1 -> 2 -> 3 -> 4 -> 5 (Palettes)
  const [currentStep, setCurrentStep] = useState(1);

  // Selections
  const [selectedCount, setSelectedCount] = useState(3);
  const [selectedVibe, setSelectedVibe] = useState('cool');
  const [selectedPurpose, setSelectedPurpose] = useState('presentation');
  const [selectedHarmony, setSelectedHarmony] = useState('rule-60-30-10');
  const [seed, setSeed] = useState(1);
  const [copiedPaletteId, setCopiedPaletteId] = useState(null);

  // --------------------------------------------------------------------------
  // Auto-Advancing Click Handlers
  // --------------------------------------------------------------------------
  const handleSelectCount = (count) => {
    setSelectedCount(count);
    setCurrentStep(2);
  };

  const handleSelectVibe = (vibeId) => {
    setSelectedVibe(vibeId);
    setCurrentStep(3);
  };

  const handleSelectPurpose = (purposeId) => {
    setSelectedPurpose(purposeId);
    setCurrentStep(4);
  };

  const handleSelectHarmony = (harmonyId) => {
    setSelectedHarmony(harmonyId);
    setCurrentStep(5);
  };

  // --------------------------------------------------------------------------
  // Algorithmic Palette Synthesis (Strictly 4 Clean Output Palettes)
  // --------------------------------------------------------------------------
  const synthesizePalettes = () => {
    const wrap = (h) => ((h % 360) + 360) % 360;

    const vibeObj = VIBE_OPTIONS.find((v) => v.id === selectedVibe) || VIBE_OPTIONS[0];
    const purposeObj = PURPOSE_OPTIONS.find((p) => p.id === selectedPurpose) || PURPOSE_OPTIONS[0];

    const calculatedBaseHue = wrap(vibeObj.baseHue + purposeObj.hueMod + (seed - 1) * 35);
    const baseSat = Math.min(95, Math.max(25, 70 + purposeObj.satMod));

    const buildPaletteSwatches = (h1Offset, h2Offset, accentOffset, satDelta, litDelta, mode = 'normal') => {
      const hDom = wrap(calculatedBaseHue + h1Offset);
      const hSec = wrap(calculatedBaseHue + h2Offset);
      const hAcc = wrap(calculatedBaseHue + accentOffset);
      const hSub = wrap(calculatedBaseHue + h1Offset + 45);

      const sat1 = Math.min(100, Math.max(20, baseSat + satDelta));
      const sat2 = Math.min(95, Math.max(15, baseSat * 0.75 + satDelta));
      const satAcc = Math.min(100, Math.max(60, baseSat + 20 + satDelta));

      const c1Dominant = hslToHex(hDom, sat1, Math.min(75, Math.max(30, 48 + litDelta)));
      const c2Secondary = hslToHex(hSec, sat2, Math.min(65, Math.max(18, 28 + litDelta)));
      const c3Accent = hslToHex(hAcc, satAcc, 54);
      const c4Surface = hslToHex(hDom, 12, 96);
      const c5Ink = hslToHex(hSec, 30, 10);
      const c6SubtleWash = hslToHex(hSub, 55, 88);
      const c7DeepBorder = hslToHex(hAcc, 75, 20);

      const pool = [
        { hex: c1Dominant, role: '60% Dominant Base' },
        { hex: c2Secondary, role: '30% Secondary Structure' },
        { hex: c3Accent, role: '10% Action Accent (CTA)' },
        { hex: c4Surface, role: 'Canvas Surface' },
        { hex: c5Ink, role: 'Ink Typography' },
        { hex: c6SubtleWash, role: 'Subtle Wash' },
        { hex: c7DeepBorder, role: 'Structural Border' },
      ];

      if (mode === 'mono') {
        const monoPool = [
          { hex: hslToHex(hDom, sat1, 48), role: 'Primary Core' },
          { hex: hslToHex(hDom, sat1 + 10, 24), role: 'Deep Structure' },
          { hex: hslToHex(hDom, Math.min(100, sat1 + 25), 65), role: 'Vibrant Accent' },
          { hex: hslToHex(hDom, 15, 96), role: 'Canvas Surface' },
          { hex: hslToHex(hDom, 35, 12), role: 'Charcoal Ink' },
          { hex: hslToHex(hDom, 50, 85), role: 'Highlight Tint' },
          { hex: hslToHex(hDom, sat1, 35), role: 'Interactive State' },
        ];
        return monoPool.slice(0, selectedCount);
      }

      if (selectedCount === 1) {
        return [{ hex: c1Dominant, role: 'Signature Single Brand Hue' }];
      }
      if (selectedCount === 2) {
        return [
          { hex: c1Dominant, role: '70% Dominant Base' },
          { hex: c3Accent, role: '30% High-Contrast Accent' },
        ];
      }
      if (selectedCount === 3) {
        return [
          { hex: c1Dominant, role: '60% Dominant Base' },
          { hex: c2Secondary, role: '30% Secondary Structure' },
          { hex: c3Accent, role: '10% Action Accent' },
        ];
      }
      return pool.slice(0, selectedCount);
    };

    return [
      {
        id: 'pal-1',
        title: '60-30-10 Golden Harmony',
        badge: 'Recommended',
        desc: `Mathematically balanced for ${purposeObj.title}. 60% dominant base with high-contrast CTA.`,
        swatches: buildPaletteSwatches(0, 25, 180, 0, 0),
      },
      {
        id: 'pal-2',
        title: 'Complementary High-Contrast',
        badge: 'High Action',
        desc: 'Opposite wheel hues providing maximum separation and instant focal recognition.',
        swatches: buildPaletteSwatches(15, 180, 200, 15, -4),
      },
      {
        id: 'pal-3',
        title: 'Analogous Organic Flow',
        badge: 'Serene & Cohesive',
        desc: 'Adjacent color spectrum creating natural lifestyle harmony and visual comfort.',
        swatches: buildPaletteSwatches(-30, 30, 45, -10, 4),
      },
      {
        id: 'pal-4',
        title: 'Monochromatic Architectural',
        badge: 'Minimal & Clean',
        desc: 'Single-hue depth utilizing controlled saturation and luminance steps.',
        swatches: buildPaletteSwatches(0, 0, 0, 0, 0, 'mono'),
      },
    ];
  };

  const results = synthesizePalettes();

  const handleApplyToStudio = (palette, targetTab = 'palette') => {
    const sw = palette.swatches;
    sendPaletteToColorStudio({
      primary: sw[0]?.hex || '#7C3AED',
      secondary: sw[1]?.hex || sw[0]?.hex || '#2D2422',
      accent: sw[2]?.hex || sw[0]?.hex || '#E11D48',
      background: sw[3]?.hex || '#FAF9F6',
      text: sw[4]?.hex || '#0D0C0B',
    });
    showToast(`Applied "${palette.title}" to Color Studio!`, 'success');
    if (onNavigateTab) onNavigateTab(targetTab);
  };

  const handleCopyPaletteHexes = (palId, swatches) => {
    const hexList = swatches.map((s) => s.hex).join(', ');
    navigator.clipboard.writeText(hexList);
    setCopiedPaletteId(palId);
    showToast(`Copied ${swatches.length} hex codes!`, 'success');
    setTimeout(() => setCopiedPaletteId(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 select-text animate-fade-in pb-20">
      {/* 1. Sleek Clickable Progress Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-0.5">
          {[
            { step: 1, label: 'Count', value: `${selectedCount} Colors` },
            { step: 2, label: 'Temperature', value: VIBE_OPTIONS.find((v) => v.id === selectedVibe)?.title.split(' ')[0] },
            { step: 3, label: 'Purpose', value: PURPOSE_OPTIONS.find((p) => p.id === selectedPurpose)?.title.split(' ')[0] },
            { step: 4, label: 'Harmony', value: HARMONY_OPTIONS.find((h) => h.id === selectedHarmony)?.title.split(' ')[0] },
            { step: 5, label: 'Palettes', value: '4 Generated' },
          ].map((item) => {
            const isDone = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <button
                key={item.step}
                onClick={() => setCurrentStep(item.step)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-left transition whitespace-nowrap flex-shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-purple-50 border border-purple-200 text-purple-900 font-bold shadow-2xs'
                    : isDone
                    ? 'hover:bg-stone-50 text-stone-700 font-semibold'
                    : 'opacity-40 text-stone-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-black ${
                    isCurrent
                      ? 'bg-purple-600 text-white'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {isDone ? '✓' : item.step}
                </span>
                <div className="leading-tight">
                  <span className="text-xs block font-bold">{item.label}</span>
                  <span className="text-[10px] text-stone-500 block font-normal">{item.value}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress Track */}
        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${currentStep === 5 ? 100 : (currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: COLOR COUNT (1 to 7)                                              */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 animate-fade-in text-center">
          <div className="space-y-1.5 max-w-xl mx-auto">
            <span className="text-[11px] font-mono font-bold text-purple-600 uppercase tracking-widest">
              Step 1 of 4 • Color Count
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-display tracking-tight">
              Select Color Count
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              Click any count (1 to 7) to start your customized color system.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 max-w-5xl mx-auto pt-2">
            {COLOR_COUNT_OPTIONS.map((opt) => {
              const isSelected = selectedCount === opt.count;

              return (
                <button
                  key={opt.count}
                  onClick={() => handleSelectCount(opt.count)}
                  className={`group relative p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-between h-44 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50/50 shadow-md ring-2 ring-purple-400'
                      : 'border-stone-200 bg-stone-50/60 hover:bg-white hover:border-purple-300 hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      opt.recommended
                        ? 'bg-purple-100 text-purple-700 font-black'
                        : 'bg-stone-200/60 text-stone-500 group-hover:bg-purple-50 group-hover:text-purple-600'
                    }`}
                  >
                    {opt.recommended ? '★ 60-30-10' : opt.tag}
                  </span>

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-2xl transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-white border border-stone-200 text-stone-900 group-hover:border-purple-300 group-hover:text-purple-600'
                    }`}
                  >
                    {opt.count}
                  </div>

                  <div className="flex items-center space-x-1">
                    {opt.previewHues.map((hue, hIdx) => (
                      <span
                        key={hIdx}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: hslToHex(hue, 80, 50) }}
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <span className="text-xs font-bold text-stone-900 group-hover:text-purple-700 block">
                      {opt.title}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium block">
                      {opt.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: TEMPERATURE & PSYCHOLOGY                                          */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-[11px] font-mono font-bold text-purple-600 uppercase tracking-widest block">
                Step 2 of 4 • Color Temperature
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display tracking-tight">
                Choose Color Spectrum
              </h2>
            </div>

            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs font-mono font-bold text-stone-500 hover:text-stone-900 flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VIBE_OPTIONS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedVibe === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectVibe(item.id)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer active:scale-98 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50/40 shadow-md ring-2 ring-purple-400'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-purple-600 shadow-2xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${item.badgeClass}`}>
                        {item.tag}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      {item.previewHexes.map((hex, hIdx) => (
                        <span
                          key={hIdx}
                          className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-stone-900 font-sans">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium leading-relaxed mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: DESIGN PURPOSE & MEDIUM                                           */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-[11px] font-mono font-bold text-purple-600 uppercase tracking-widest block">
                Step 3 of 4 • Design Medium
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display tracking-tight">
                Select Project Purpose
              </h2>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="text-xs font-mono font-bold text-stone-500 hover:text-stone-900 flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {PURPOSE_OPTIONS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedPurpose === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectPurpose(item.id)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-36 cursor-pointer transition-all duration-200 active:scale-98 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50/50 shadow-md ring-2 ring-purple-400'
                      : 'border-stone-200 bg-stone-50/60 hover:bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-purple-600 shadow-2xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-stone-400 uppercase">
                      {item.category}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-stone-900 font-sans block leading-snug">
                      {item.title}
                    </span>
                    <p className="text-[11px] text-stone-500 font-medium leading-tight line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: COLOR HARMONY RULE                                                */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-[11px] font-mono font-bold text-purple-600 uppercase tracking-widest block">
                Step 4 of 4 • Harmony Model
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display tracking-tight">
                Select Harmony Distribution
              </h2>
            </div>

            <button
              onClick={() => setCurrentStep(3)}
              className="text-xs font-mono font-bold text-stone-500 hover:text-stone-900 flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {HARMONY_OPTIONS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedHarmony === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectHarmony(item.id)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 cursor-pointer transition-all duration-200 active:scale-98 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50/50 shadow-md ring-2 ring-purple-400'
                      : 'border-stone-200 bg-stone-50/60 hover:bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60">
                      {item.tag}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-purple-600" />
                  </div>

                  <div>
                    <span className="text-xs font-black text-stone-900 font-sans block">
                      {item.title}
                    </span>
                    <p className="text-[11px] text-stone-500 font-medium leading-relaxed mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: OUTPUT — 4 CLEAN TAILORED PALETTES                                */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Actions */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h2 className="text-lg sm:text-xl font-black text-stone-900 font-display tracking-tight">
                  4 Synthesized Palettes ({selectedCount} Colors Each)
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-medium">
                <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-700 font-mono font-bold text-[11px]">
                  {selectedCount} Colors
                </span>
                <span>•</span>
                <span>{VIBE_OPTIONS.find((v) => v.id === selectedVibe)?.title}</span>
                <span>•</span>
                <span>{PURPOSE_OPTIONS.find((p) => p.id === selectedPurpose)?.title}</span>
                <span>•</span>
                <span>{HARMONY_OPTIONS.find((h) => h.id === selectedHarmony)?.title}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setSeed((prev) => prev + 1);
                  showToast('Synthesized new variations!', 'success');
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center space-x-1.5 border border-purple-200 transition active:scale-95 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle Variations</span>
              </button>

              <button
                onClick={() => setCurrentStep(1)}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center space-x-1.5 transition active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-300" />
                <span>Edit Inputs</span>
              </button>
            </div>
          </div>

          {/* 4 Clean Direct Result Palettes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {results.map((pal, idx) => (
              <div
                key={pal.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60">
                        {pal.badge}
                      </span>
                      <h3 className="text-sm font-black text-stone-900 font-display mt-1">
                        {pal.title}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-400">
                      Option 0{idx + 1}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    {pal.desc}
                  </p>

                  {/* Clean Direct Swatch Bar */}
                  <div className="space-y-2">
                    <div className="w-full h-24 rounded-xl flex overflow-hidden shadow-inner border border-stone-200">
                      {pal.swatches.map((swatch, sIdx) => {
                        const isDark = hexToHsl(swatch.hex).l < 55;
                        return (
                          <div
                            key={sIdx}
                            style={{ backgroundColor: swatch.hex }}
                            onClick={() => {
                              navigator.clipboard.writeText(swatch.hex);
                              showToast(`Copied ${swatch.hex}!`);
                            }}
                            className="flex-1 h-full relative cursor-pointer hover:flex-[1.5] transition-all flex flex-col items-center justify-between p-2 select-none"
                            title={`Click to copy ${swatch.hex} (${swatch.role})`}
                          >
                            <span
                              className={`text-[9px] font-mono font-bold uppercase px-1 py-0.2 rounded ${
                                isDark ? 'bg-black/40 text-white' : 'bg-white/70 text-stone-900'
                              }`}
                            >
                              C{sIdx + 1}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-black ${
                                isDark ? 'text-white' : 'text-stone-900'
                              }`}
                            >
                              {swatch.hex}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Roles Legend */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-[10px] font-mono text-stone-600">
                      {pal.swatches.map((swatch, sIdx) => (
                        <div key={sIdx} className="flex items-center space-x-1.5 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span className="truncate">{swatch.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => handleCopyPaletteHexes(pal.id, pal.swatches)}
                    className="text-xs font-mono font-bold text-stone-600 hover:text-stone-950 flex items-center space-x-1.5 cursor-pointer"
                  >
                    {copiedPaletteId === pal.id ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-purple-600" />
                        <span>Copy Hexes</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleApplyToStudio(pal, 'contrast')}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs cursor-pointer"
                      title="Test in WCAG Contrast Checker"
                    >
                      WCAG Check
                    </button>

                    <button
                      onClick={() => handleApplyToStudio(pal, 'palette')}
                      className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-purple-600 text-white font-bold text-xs flex items-center space-x-1.5 transition active:scale-95 shadow-xs cursor-pointer"
                    >
                      <span>Use in Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
