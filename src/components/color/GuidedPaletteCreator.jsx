import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Globe,
  Smartphone,
  Share2,
  Video,
  FileImage,
  Sparkles,
  Megaphone,
  Layers,
  ArrowLeft,
  ArrowRight,
  Check,
  Wand2,
  RotateCcw,
  Copy,
  Palette,
  Shuffle,
  Code2,
  CheckCircle2,
} from 'lucide-react';
import { CopyButton } from '../common/CopyButton';
import { useToast } from '../../context/ToastContext';
import { hexToHsl, hslToHex, isValidHex, normalizeHex } from '../../utils/colorUtils';

// QUESTION 01 OPTIONS: What are you designing?
const DESIGN_PURPOSES = [
  { id: 'website', title: 'Website', desc: 'Modern web pages and landing pages', icon: Globe },
  { id: 'mobile', title: 'Mobile App', desc: 'Interfaces and product screens', icon: Smartphone },
  { id: 'social', title: 'Social Media', desc: 'Posts, reels and social graphics', icon: Share2 },
  { id: 'video', title: 'YouTube / Video', desc: 'Thumbnails, titles and video graphics', icon: Video },
  { id: 'poster', title: 'Poster', desc: 'Promotional and event designs', icon: FileImage },
  { id: 'brand', title: 'Brand / Logo', desc: 'Brand identity and visual language', icon: Sparkles },
  { id: 'ads', title: 'Advertisement', desc: 'Campaigns and promotional creatives', icon: Megaphone },
  { id: 'other', title: 'Other', desc: 'Something unique and different', icon: Layers },
];

// QUESTION 02 OPTIONS: Who is this design for?
const AUDIENCES = [
  { id: 'students', label: 'Students', desc: 'Educational, vibrant & accessible' },
  { id: 'genz', label: 'Young / Gen Z', desc: 'Trendy, energetic & expressive' },
  { id: 'professionals', label: 'Professionals', desc: 'Sleek, authoritative & clean' },
  { id: 'premium', label: 'Premium Customers', desc: 'Sophisticated, luxurious & refined' },
  { id: 'families', label: 'Families', desc: 'Warm, welcoming & trustworthy' },
  { id: 'general', label: 'General Customers', desc: 'Universal, friendly & clear' },
  { id: 'everyone', label: 'Everyone', desc: 'Inclusive & versatile' },
];

// QUESTION 03 OPTIONS: How should your design feel? (2-3 selections)
const EMOTIONS = [
  { id: 'trust', label: 'Trust', hueOffset: 215, sat: 75 },
  { id: 'energetic', label: 'Energetic', hueOffset: 16, sat: 88 },
  { id: 'premium', label: 'Premium', hueOffset: 270, sat: 65 },
  { id: 'calm', label: 'Calm', hueOffset: 165, sat: 55 },
  { id: 'creative', label: 'Creative', hueOffset: 280, sat: 80 },
  { id: 'friendly', label: 'Friendly', hueOffset: 35, sat: 85 },
  { id: 'bold', label: 'Bold', hueOffset: 350, sat: 85 },
  { id: 'fresh', label: 'Fresh', hueOffset: 145, sat: 70 },
  { id: 'elegant', label: 'Elegant', hueOffset: 25, sat: 40 },
  { id: 'playful', label: 'Playful', hueOffset: 320, sat: 80 },
  { id: 'professional', label: 'Professional', hueOffset: 210, sat: 60 },
  { id: 'modern', label: 'Modern', hueOffset: 250, sat: 75 },
];

// QUESTION 04 OPTIONS: What personality should it have?
const PERSONALITIES = [
  { id: 'minimal', label: 'Minimal', desc: 'Restrained, spacious & high contrast' },
  { id: 'professional', label: 'Professional', desc: 'Credible, organized & focused' },
  { id: 'premium', label: 'Premium', desc: 'Refined, rich depth & subtle elegance' },
  { id: 'friendly', label: 'Friendly', desc: 'Warm, approachable & soft rounded tones' },
  { id: 'bold', label: 'Bold', desc: 'Punchy contrasts & high visual punch' },
  { id: 'playful', label: 'Playful', desc: 'Vibrant, joyful & expressive hues' },
  { id: 'modern', label: 'Modern', desc: 'Tech-forward, crisp edges & clean lines' },
  { id: 'creative', label: 'Creative', desc: 'Unconventional, inspiring balance' },
  { id: 'serious', label: 'Serious', desc: 'Deep anchors, structured & formal' },
];

export function GuidedPaletteCreator({ onPaletteGenerated, onOpenContrast }) {
  const { showToast } = useToast();

  // Wizard state: 1 to 5, then 'thinking', then 'result'
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState('forward');

  // User responses
  const [selectedPurpose, setSelectedPurpose] = useState('website');
  const [selectedAudience, setSelectedAudience] = useState('general');
  const [selectedEmotions, setSelectedEmotions] = useState(['modern', 'creative']);
  const [selectedPersonality, setSelectedPersonality] = useState('minimal');
  const [colorChoiceType, setColorChoiceType] = useState('auto'); // 'picker', 'hex', 'auto'
  const [customColor, setCustomColor] = useState('#E24A2B'); // user's spicy paprika default
  const [hexInput, setHexInput] = useState('#E24A2B');

  // Generation & Result State
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [previewTab, setPreviewTab] = useState('website'); // 'website', 'card', 'mobile'
  const [variationSeed, setVariationSeed] = useState(0);

  const thinkingWords = ['Context', 'Personality', 'Emotion', 'Harmony', 'Palette'];

  // Handle single-choice selection with micro-delay animation
  const handleSelectAndAdvance = (setter, value, nextStep) => {
    setter(value);
    setDirection('forward');
    setTimeout(() => {
      setCurrentStep(nextStep);
    }, 240);
  };

  const handleBack = () => {
    if (typeof currentStep === 'number' && currentStep > 1) {
      setDirection('backward');
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Toggle emotion chip (keep between 1 and 3)
  const toggleEmotion = (id) => {
    setSelectedEmotions((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id]; // keep max 3
      }
      return [...prev, id];
    });
  };

  // Trigger Intelligent Generation Algorithm
  const handleStartGeneration = () => {
    setCurrentStep('thinking');
    setThinkingIndex(0);
  };

  // Step through thinking animation words cleanly without state collision
  useEffect(() => {
    if (currentStep !== 'thinking') return;

    if (thinkingIndex < thinkingWords.length - 1) {
      const timer = setTimeout(() => {
        setThinkingIndex((prev) => prev + 1);
      }, 260);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        synthesizePalette();
      }, 350);
      return () => clearTimeout(finishTimer);
    }
  }, [currentStep, thinkingIndex]);

  const synthesizePalette = (seedOffset = 0) => {
    // Intelligent Palette Synthesis
    let baseHue = 16; // default spicy paprika hue
    let baseSat = 85;
    let baseLight = 50;

    if (colorChoiceType === 'picker' || colorChoiceType === 'hex') {
      const hsl = hexToHsl(customColor);
      baseHue = hsl.h;
      baseSat = hsl.s;
      baseLight = hsl.l;
    } else {
      const firstEmotion = EMOTIONS.find((e) => e.id === selectedEmotions[0]);
      if (firstEmotion) {
        baseHue = firstEmotion.hueOffset;
        baseSat = firstEmotion.sat;
      }
      if (selectedPurpose === 'brand') baseHue = (baseHue + 15) % 360;
      if (selectedPurpose === 'video' || selectedPurpose === 'social') baseSat = Math.min(95, baseSat + 15);
      if (selectedPersonality === 'minimal') baseSat = Math.max(30, baseSat - 25);
    }

    baseHue = (baseHue + seedOffset * 30) % 360;
    const wrap = (val) => ((val % 360) + 360) % 360;

    const primaryHex = hslToHex(baseHue, baseSat, Math.max(45, Math.min(65, baseLight)));
    const secHue = selectedPersonality === 'bold' ? wrap(baseHue + 180) : wrap(baseHue + 25);
    const secondaryHex = hslToHex(secHue, Math.max(25, baseSat - 20), 18);
    const accentHue = wrap(baseHue + 150);
    const accentHex = hslToHex(accentHue, Math.min(95, baseSat + 10), 54);
    const bgHex = '#FAF9F6'; // Floral White
    const textHex = '#0D0C0B'; // Carbon Black
    const surfaceHex = '#FFFFFF';

    const emotionLabels = selectedEmotions
      .map((id) => EMOTIONS.find((e) => e.id === id)?.label)
      .filter(Boolean)
      .join(' • ');

    const purposeTitle = DESIGN_PURPOSES.find((p) => p.id === selectedPurpose)?.title || 'Design';
    const personalityLabel = PERSONALITIES.find((p) => p.id === selectedPersonality)?.label || 'Modern';

    const result = {
      title: `${personalityLabel} • ${emotionLabels}`,
      subtitle: `Engineered for ${purposeTitle} targeting ${AUDIENCES.find((a) => a.id === selectedAudience)?.label || 'General Audience'}.`,
      palette: [
        {
          role: 'PRIMARY',
          name: 'Primary Identity',
          hex: primaryHex.toUpperCase(),
          desc: 'Main brand identity, hero buttons, and active interactive elements.',
        },
        {
          role: 'SECONDARY',
          name: 'Supporting Structure',
          hex: secondaryHex.toUpperCase(),
          desc: 'Card headers, dark borders, secondary tabs, and grounding visual weight.',
        },
        {
          role: 'ACCENT',
          name: 'Action & CTA',
          hex: accentHex.toUpperCase(),
          desc: 'Conversion buttons, notification badges, and eye-catching focal highlights.',
        },
        {
          role: 'BACKGROUND',
          name: 'Canvas Surface',
          hex: bgHex.toUpperCase(),
          desc: 'Clean Floral White canvas that provides natural breathing room.',
        },
        {
          role: 'TEXT',
          name: 'Readable Typography',
          hex: textHex.toUpperCase(),
          desc: 'Carbon Black headings and body copy calibrated for maximum readability.',
        },
      ],
      surfaceHex,
      why: [
        {
          colorName: 'Primary Hue',
          text: `Establishes the ${selectedEmotions[0] || 'core'} emotion with calibrated visual weight.`,
        },
        {
          colorName: 'Deep Secondary',
          text: `Adds structured visual contrast and depth to cards and interface borders.`,
        },
        {
          colorName: 'High-Impact Accent',
          text: `Commands instant optical focus on critical buttons and call-to-action triggers.`,
        },
      ],
    };

    setGeneratedResult(result);
    setCurrentStep('result');

    try {
      confetti({
        particleCount: 65,
        spread: 55,
        origin: { y: 0.6 },
        colors: [primaryHex, accentHex, '#E24A2B', '#0D0C0B'],
      });
    } catch {
      // ignore
    }

    if (onPaletteGenerated) {
      onPaletteGenerated(result);
    }
  };

  const handleShuffleVariation = () => {
    const nextSeed = variationSeed + 1;
    setVariationSeed(nextSeed);
    synthesizePalette(nextSeed);
    showToast('Generated fresh harmonic variation!');
  };

  const handleCopyPalette = () => {
    if (!generatedResult) return;
    const text = generatedResult.palette.map((p) => `${p.role}: ${p.hex}`).join('\n');
    navigator.clipboard.writeText(text);
    showToast('Copied full LooksGood palette to clipboard!');
  };

  const handleCopyCSS = () => {
    if (!generatedResult) return;
    const css = `:root {\n${generatedResult.palette
      .map((p) => `  --color-${p.role.toLowerCase()}: ${p.hex};`)
      .join('\n')}\n}`;
    navigator.clipboard.writeText(css);
    showToast('Copied CSS Variables snippet!');
  };

  const handleReset = () => {
    setCurrentStep(1);
    setDirection('forward');
  };

  const getAnimationClass = () => {
    if (direction === 'forward') return 'question-enter';
    return 'question-enter-back';
  };

  return (
    <div className="w-full min-h-[75vh] flex flex-col justify-between py-4 sm:py-8 max-w-5xl mx-auto px-4 select-none">
      {/* ================= THINKING / GENERATION MOMENT ================= */}
      {currentStep === 'thinking' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-20 animate-fade-in text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-white border border-[#E8E5DF] p-1 shadow-card flex items-center justify-center">
              <Sparkles className="w-9 h-9 text-paprika animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <span className="absolute inset-0 rounded-3xl border border-paprika/30 animate-ping pointer-events-none" />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#78716C]">
              LOOKSGOOD DESIGN ENGINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D0C0B] tracking-tight">
              Understanding your design...
            </h2>

            {/* Dynamic Step Words Transition */}
            <div className="flex items-center justify-center gap-2 pt-3 flex-wrap">
              {thinkingWords.map((word, idx) => (
                <div key={word} className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold uppercase px-3.5 py-1.5 rounded-full transition-all duration-300 ${
                      idx === thinkingIndex
                        ? 'bg-paprika text-white scale-110 shadow-paprika-sm'
                        : idx < thinkingIndex
                        ? 'text-[#78716C] bg-white border border-[#E8E5DF] line-through opacity-60'
                        : 'text-[#A8A29E] bg-white/50 border border-[#E8E5DF] opacity-40'
                    }`}
                  >
                    {word}
                  </span>
                  {idx < thinkingWords.length - 1 && (
                    <span className="text-[#A8A29E] text-xs">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= RESULT SCREEN ================= */}
      {currentStep === 'result' && generatedResult && (
        <div className="space-y-10 animate-fade-in py-4">
          {/* Result Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-paprika-light text-paprika border border-paprika-border shadow-subtle">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CUSTOM SYNTHESIZED PALETTE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#0D0C0B] tracking-tight">
              Your LooksGood Palette
            </h1>

            <p className="text-sm sm:text-base font-mono font-semibold text-[#57534E]">
              {generatedResult.title}
            </p>
            <p className="text-xs text-[#78716C] max-w-lg mx-auto">
              {generatedResult.subtitle}
            </p>

            {/* Quick Action Pills */}
            <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
              <button
                onClick={handleShuffleVariation}
                className="px-4 py-2 text-xs font-mono font-bold text-[#0D0C0B] bg-white border border-[#E8E5DF] hover:border-[#0D0C0B] rounded-xl transition-all shadow-subtle flex items-center gap-1.5 hover:scale-105"
              >
                <Shuffle className="w-3.5 h-3.5 text-paprika" />
                <span>Shuffle Variation</span>
              </button>

              <button
                onClick={handleCopyCSS}
                className="px-4 py-2 text-xs font-mono font-bold text-[#0D0C0B] bg-white border border-[#E8E5DF] hover:border-[#0D0C0B] rounded-xl transition-all shadow-subtle flex items-center gap-1.5 hover:scale-105"
              >
                <Code2 className="w-3.5 h-3.5 text-[#78716C]" />
                <span>Copy CSS Variables</span>
              </button>
            </div>
          </div>

          {/* Large Color Blocks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {generatedResult.palette.map((block, idx) => {
              const hsl = hexToHsl(block.hex);
              const isLight = hsl.l > 60;

              return (
                <div
                  key={block.role}
                  className="minimal-card rounded-3xl overflow-hidden flex flex-col justify-between group"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Color Swatch Area */}
                  <div
                    className="w-full h-36 p-4 flex flex-col justify-between transition-transform relative overflow-hidden"
                    style={{ backgroundColor: block.hex }}
                  >
                    <span
                      className="px-2.5 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider rounded-md backdrop-blur-md shadow-sm self-start"
                      style={{
                        backgroundColor: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.25)',
                        color: isLight ? '#0D0C0B' : '#FAF9F6',
                      }}
                    >
                      {block.role}
                    </span>

                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-mono font-black tracking-tight"
                        style={{ color: isLight ? '#0D0C0B' : '#FAF9F6' }}
                      >
                        {block.hex}
                      </span>
                      <CopyButton
                        text={block.hex}
                        toastMessage={`Copied ${block.role} (${block.hex})`}
                        iconOnly
                        className="backdrop-blur-md bg-white hover:bg-white text-[#0D0C0B] border border-[#E8E5DF] p-1.5 shadow-sm rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Usage Details */}
                  <div className="p-4 space-y-1.5 bg-white flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#0D0C0B] tracking-tight">{block.name}</h4>
                      <p className="text-[11px] text-[#57534E] leading-relaxed mt-1">{block.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compact "Why this palette?" section */}
          <div className="minimal-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-paprika" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0D0C0B]">
                Why This Palette Works
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {generatedResult.why.map((item, i) => (
                <div key={i} className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] space-y-1">
                  <span className="text-xs font-bold text-paprika block">{item.colorName}</span>
                  <p className="text-xs text-[#57534E] leading-relaxed font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Realistic UI Preview */}
          <div className="minimal-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E5DF]">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0D0C0B]">
                  Live Applied Design Preview
                </h3>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Your generated palette rendered onto realistic interfaces.
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center bg-[#FAF9F6] p-1 rounded-xl border border-[#E8E5DF]">
                {[
                  { id: 'website', label: 'Website Hero', icon: Globe },
                  { id: 'card', label: 'Product Card', icon: Sparkles },
                  { id: 'mobile', label: 'Mobile App', icon: Smartphone },
                ].map((m) => {
                  const Icon = m.icon;
                  const isActive = previewTab === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPreviewTab(m.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        isActive
                          ? 'bg-[#0D0C0B] text-white shadow-sm'
                          : 'text-[#78716C] hover:text-[#0D0C0B]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Canvas */}
            <div
              className="w-full rounded-2xl border border-[#E8E5DF] p-6 sm:p-10 shadow-subtle transition-all duration-300 min-h-[300px] flex items-center justify-center"
              style={{
                backgroundColor: generatedResult.palette.find((p) => p.role === 'BACKGROUND')?.hex,
                color: generatedResult.palette.find((p) => p.role === 'TEXT')?.hex,
              }}
            >
              {previewTab === 'website' && (
                <div className="w-full max-w-xl space-y-6 text-center">
                  {/* Mock Navbar */}
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-2xl border shadow-subtle backdrop-blur-md"
                    style={{
                      backgroundColor: generatedResult.surfaceHex,
                      borderColor: '#E8E5DF',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-sm"
                        style={{
                          backgroundColor: generatedResult.palette.find((p) => p.role === 'PRIMARY')?.hex,
                        }}
                      >
                        ✦
                      </div>
                      <span className="font-extrabold text-sm tracking-tight text-[#0D0C0B]">LooksGood Studio</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-semibold text-[#57534E]">
                      <span className="hover:text-[#0D0C0B] cursor-pointer">Home</span>
                      <span className="hover:text-[#0D0C0B] cursor-pointer">About</span>
                      <button
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm transition-transform hover:scale-105"
                        style={{
                          backgroundColor: generatedResult.palette.find((p) => p.role === 'PRIMARY')?.hex,
                        }}
                      >
                        Get Started
                      </button>
                    </div>
                  </div>

                  {/* Hero Text */}
                  <div className="space-y-3 py-4">
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-subtle"
                      style={{
                        backgroundColor: generatedResult.surfaceHex,
                        color: generatedResult.palette.find((p) => p.role === 'PRIMARY')?.hex,
                        borderColor: '#E8E5DF',
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{generatedResult.title}</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-[#0D0C0B]">
                      Build better ideas. <br />
                      <span style={{ color: generatedResult.palette.find((p) => p.role === 'PRIMARY')?.hex }}>
                        Create with confidence.
                      </span>
                    </h2>

                    <p className="text-xs sm:text-sm text-[#57534E] max-w-md mx-auto leading-relaxed font-medium">
                      Every element in this layout adheres to optical hierarchy and mathematical contrast balance.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      className="px-6 py-3 rounded-2xl text-xs font-bold text-white shadow-sm hover:scale-105 transition-all"
                      style={{
                        backgroundColor: generatedResult.palette.find((p) => p.role === 'PRIMARY')?.hex,
                      }}
                    >
                      Get Started Free
                    </button>
                    <button
                      className="px-5 py-3 rounded-2xl text-xs font-bold border border-[#E8E5DF] text-[#0D0C0B] bg-white shadow-subtle hover:scale-105 transition-all"
                    >
                      View Live Work
                    </button>
                  </div>
                </div>
              )}

              {previewTab === 'card' && (
                <div
                  className="w-full max-w-sm rounded-3xl border border-[#E8E5DF] p-7 space-y-5 shadow-card bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2.5 py-1 text-[11px] font-extrabold uppercase rounded-xl"
                      style={{
                        backgroundColor: '#FAF9F6',
                        color: generatedResult.palette.find((p) => p.role === 'PRIMARY')?.hex,
                      }}
                    >
                      POPULAR
                    </span>
                    <span className="text-xs font-mono font-bold text-[#78716C]">PRO TIER</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl font-black tracking-tight text-[#0D0C0B]">$39 / month</div>
                    <h4 className="text-base font-extrabold text-[#0D0C0B]">Professional Design Suite</h4>
                    <p className="text-xs text-[#57534E] leading-relaxed font-medium">
                      Curated color harmony and typography tooling built for creative software developers.
                    </p>
                  </div>

                  <button
                    className="w-full py-3 rounded-2xl text-xs font-bold text-white shadow-sm hover:scale-[1.02] transition-transform"
                    style={{
                      backgroundColor: generatedResult.palette.find((p) => p.role === 'PRIMARY')?.hex,
                    }}
                  >
                    Claim Subscription
                  </button>
                </div>
              )}

              {previewTab === 'mobile' && (
                <div className="w-full max-w-xs rounded-3xl border border-[#E8E5DF] p-5 space-y-4 shadow-card bg-white text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                        style={{ backgroundColor: generatedResult.palette.find((p) => p.role === 'PRIMARY')?.hex }}
                      >
                        JD
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0D0C0B]">Jane Doe</div>
                        <div className="text-[10px] text-[#78716C]">Product Designer</div>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>

                  <div
                    className="p-4 rounded-2xl text-white space-y-2 shadow-sm"
                    style={{ backgroundColor: generatedResult.palette.find((p) => p.role === 'SECONDARY')?.hex }}
                  >
                    <span className="text-[10px] uppercase font-mono opacity-80">Weekly Growth</span>
                    <div className="text-xl font-black">+28.4%</div>
                    <p className="text-[11px] opacity-90">All systems operating within optimal thresholds.</p>
                  </div>

                  <button
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: generatedResult.palette.find((p) => p.role === 'ACCENT')?.hex }}
                  >
                    View Analytics
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E8E5DF]">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-3.5 text-xs font-bold text-[#0D0C0B] bg-white hover:bg-[#F2EFE9] rounded-2xl border border-[#E8E5DF] shadow-subtle transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#78716C]" />
              <span>Edit Answers & Try Another</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleCopyPalette}
                className="flex-1 sm:flex-none px-8 py-3.5 text-xs font-black text-white bg-paprika hover:bg-paprika-hover rounded-2xl shadow-paprika-sm transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Full Palette</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= QUESTION FLOW (STEPS 1 TO 5) ================= */}
      {currentStep !== 'thinking' && currentStep !== 'result' && (
        <div className="flex-1 flex flex-col justify-between space-y-8">
          {/* Progress Header with Clickable Steps to Jump */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E5DF]">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-xs font-mono font-bold text-[#57534E] hover:text-[#0D0C0B] transition-colors px-3 py-1.5 rounded-xl hover:bg-white border border-transparent hover:border-[#E8E5DF]"
              >
                <ArrowLeft className="w-4 h-4 text-paprika" />
                <span>Back</span>
              </button>
            ) : (
              <div className="text-xs font-mono text-[#78716C] font-bold">LOOKSGOOD GUIDED STUDIO</div>
            )}

            {/* Clickable Step Chips */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map((stepNum) => {
                const isCurrent = currentStep === stepNum;
                const isCompleted = currentStep > stepNum;
                return (
                  <button
                    key={stepNum}
                    onClick={() => {
                      if (stepNum <= currentStep || isCompleted) {
                        setDirection(stepNum < currentStep ? 'backward' : 'forward');
                        setCurrentStep(stepNum);
                      }
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center ${
                      isCurrent
                        ? 'bg-paprika text-white shadow-paprika-sm scale-105'
                        : isCompleted
                        ? 'bg-[#0D0C0B] text-white hover:bg-paprika'
                        : 'bg-white border border-[#E8E5DF] text-[#A8A29E]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : `0${stepNum}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Canvas */}
          <div className={`flex-1 flex flex-col justify-center space-y-8 max-w-4xl mx-auto w-full ${getAnimationClass()}`}>
            {/* QUESTION 01: What are you designing? */}
            {currentStep === 1 && (
              <div className="space-y-8 text-center">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-paprika">
                    LET'S START
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-[#0D0C0B] tracking-tight">
                    What are you designing?
                  </h2>
                  <p className="text-sm text-[#57534E] max-w-md mx-auto font-medium">
                    This helps us understand where your colors will be used.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-left">
                  {DESIGN_PURPOSES.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedPurpose === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectAndAdvance(setSelectedPurpose, item.id, 2)}
                        className={`group p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                          isSelected
                            ? 'border-paprika bg-white ring-2 ring-paprika shadow-paprika-sm scale-105'
                            : 'minimal-card'
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                            isSelected
                              ? 'bg-paprika text-white shadow-sm'
                              : 'bg-[#FAF9F6] text-[#78716C] group-hover:text-paprika group-hover:bg-paprika-light'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-[#0D0C0B] tracking-tight">{item.title}</h3>
                          <p className="text-[11px] text-[#57534E] mt-1 leading-snug font-medium">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QUESTION 02: Who is this design for? */}
            {currentStep === 2 && (
              <div className="space-y-8 text-center">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-paprika">
                    YOUR AUDIENCE
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-[#0D0C0B] tracking-tight">
                    Who is this design for?
                  </h2>
                  <p className="text-sm text-[#57534E] max-w-md mx-auto font-medium">
                    Different audiences respond to different visual personalities.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-left max-w-3xl mx-auto w-full">
                  {AUDIENCES.map((item) => {
                    const isSelected = selectedAudience === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectAndAdvance(setSelectedAudience, item.id, 3)}
                        className={`group p-5 rounded-3xl border transition-all duration-300 flex items-center justify-between ${
                          isSelected
                            ? 'border-paprika bg-white ring-2 ring-paprika shadow-paprika-sm scale-[1.02]'
                            : 'minimal-card'
                        }`}
                      >
                        <div>
                          <h3 className="text-sm font-bold text-[#0D0C0B] tracking-tight">{item.label}</h3>
                          <p className="text-xs text-[#57534E] mt-0.5 font-medium">{item.desc}</p>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-paprika border-paprika text-white' : 'border-[#E8E5DF]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QUESTION 03: How should your design feel? (2-3 selections) */}
            {currentStep === 3 && (
              <div className="space-y-8 text-center">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-paprika">
                    THE FEELING
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-[#0D0C0B] tracking-tight">
                    How should your design feel?
                  </h2>
                  <p className="text-sm text-[#57534E] max-w-md mx-auto font-medium">
                    Choose 2–3 emotions you want people to experience.
                  </p>
                </div>

                {/* Emotion Chips Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto w-full">
                  {EMOTIONS.map((item) => {
                    const isSelected = selectedEmotions.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleEmotion(item.id)}
                        className={`py-3.5 px-4 rounded-2xl border text-sm font-bold transition-all duration-200 flex items-center justify-between ${
                          isSelected
                            ? 'border-paprika bg-paprika text-white shadow-paprika-sm scale-105'
                            : 'bg-white border-[#E8E5DF] text-[#57534E] hover:text-[#0D0C0B] hover:border-[#0D0C0B] shadow-subtle'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {/* Continue Button */}
                <div className="pt-4 flex justify-center">
                  <button
                    onClick={() => {
                      setDirection('forward');
                      setCurrentStep(4);
                    }}
                    className="px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white bg-paprika hover:bg-paprika-hover rounded-2xl shadow-paprika-sm transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <span>Continue to Personality</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* QUESTION 04: What personality should it have? */}
            {currentStep === 4 && (
              <div className="space-y-8 text-center">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-paprika">
                    BRAND PERSONALITY
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-[#0D0C0B] tracking-tight">
                    What personality should it have?
                  </h2>
                  <p className="text-sm text-[#57534E] max-w-md mx-auto font-medium">
                    Pick the visual character that feels right for your vision.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left max-w-3xl mx-auto w-full">
                  {PERSONALITIES.map((item) => {
                    const isSelected = selectedPersonality === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectAndAdvance(setSelectedPersonality, item.id, 5)}
                        className={`group p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? 'border-paprika bg-white ring-2 ring-paprika shadow-paprika-sm scale-[1.02]'
                            : 'minimal-card'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-[#0D0C0B] tracking-tight">{item.label}</h3>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-paprika border-paprika text-white' : 'border-[#E8E5DF]'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>

                        <p className="text-xs text-[#57534E] leading-snug font-medium">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QUESTION 05: Do you already have a color in mind? */}
            {currentStep === 5 && (
              <div className="space-y-8 text-center">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-paprika">
                    ONE LAST THING
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-[#0D0C0B] tracking-tight">
                    Do you already have a color in mind?
                  </h2>
                  <p className="text-sm text-[#57534E] max-w-md mx-auto font-medium">
                    Pick a starter color, enter a HEX code, or let LooksGood choose automatically.
                  </p>
                </div>

                {/* 3 Main Choice Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto w-full text-left">
                  {/* Option 1: Choose For Me */}
                  <div
                    onClick={() => setColorChoiceType('auto')}
                    className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
                      colorChoiceType === 'auto'
                        ? 'border-paprika bg-white ring-2 ring-paprika shadow-paprika-sm scale-105'
                        : 'minimal-card'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-paprika-light text-paprika flex items-center justify-center border border-paprika-border">
                      <Wand2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#0D0C0B]">Choose For Me</h3>
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-paprika bg-paprika-light rounded border border-paprika-border">
                          EASIEST
                        </span>
                      </div>
                      <p className="text-xs text-[#57534E] mt-1 leading-snug font-medium">
                        LooksGood automatically computes the optimal starter shade from your answers.
                      </p>
                    </div>
                  </div>

                  {/* Option 2: Pick a Color */}
                  <div
                    onClick={() => setColorChoiceType('picker')}
                    className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
                      colorChoiceType === 'picker'
                        ? 'border-paprika bg-white ring-2 ring-paprika shadow-paprika-sm scale-105'
                        : 'minimal-card'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-[#FAF9F6] text-[#0D0C0B] flex items-center justify-center border border-[#E8E5DF]">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0D0C0B]">Pick a Color</h3>
                      <p className="text-xs text-[#57534E] mt-1 leading-snug font-medium">
                        Use the interactive palette slider to choose an exact starting hue.
                      </p>
                    </div>
                  </div>

                  {/* Option 3: Enter HEX */}
                  <div
                    onClick={() => setColorChoiceType('hex')}
                    className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
                      colorChoiceType === 'hex'
                        ? 'border-paprika bg-white ring-2 ring-paprika shadow-paprika-sm scale-105'
                        : 'minimal-card'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-[#FAF9F6] text-[#0D0C0B] flex items-center justify-center font-mono font-bold text-xs border border-[#E8E5DF]">
                      #HEX
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0D0C0B]">Enter HEX Code</h3>
                      <p className="text-xs text-[#57534E] mt-1 leading-snug font-medium">
                        Paste your existing brand hex code (e.g. #E24A2B).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sub-interfaces for Picker / HEX */}
                {colorChoiceType === 'picker' && (
                  <div className="minimal-card rounded-3xl p-6 max-w-md mx-auto space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#78716C]">YOUR STARTING COLOR</span>
                      <span className="text-xs font-mono font-bold text-[#0D0C0B]">{customColor.toUpperCase()}</span>
                    </div>

                    <div
                      className="w-full h-16 rounded-2xl shadow-subtle border border-[#E8E5DF] transition-colors"
                      style={{ backgroundColor: customColor }}
                    />

                    <div className="space-y-2">
                      <label className="text-xs text-[#57534E] block text-left font-medium">Hue Slider</label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={hexToHsl(customColor).h}
                        onChange={(e) => {
                          const newHex = hslToHex(Number(e.target.value), 80, 50);
                          setCustomColor(newHex);
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                {colorChoiceType === 'hex' && (
                  <div className="minimal-card rounded-3xl p-6 max-w-md mx-auto space-y-3 animate-fade-in">
                    <label className="text-xs font-mono font-bold text-[#78716C] block text-left">
                      ENTER 6-DIGIT HEX
                    </label>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl border border-[#E8E5DF] shrink-0"
                        style={{ backgroundColor: customColor }}
                      />
                      <input
                        type="text"
                        value={hexInput}
                        onChange={(e) => {
                          setHexInput(e.target.value);
                          if (isValidHex(e.target.value)) {
                            setCustomColor(normalizeHex(e.target.value));
                          }
                        }}
                        placeholder="#E24A2B"
                        className="w-full px-4 py-2.5 text-sm font-mono font-bold uppercase bg-white border border-[#E8E5DF] rounded-xl text-[#0D0C0B] focus:border-paprika focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <div className="pt-4 flex justify-center">
                  <button
                    onClick={handleStartGeneration}
                    className="px-10 py-4 text-sm font-black uppercase tracking-wider text-white bg-paprika hover:bg-paprika-hover rounded-2xl shadow-paprika-sm transition-all hover:scale-105 flex items-center gap-3"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate My LooksGood Palette</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
