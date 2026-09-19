import React, { useState } from 'react';
import { FONTS_DATABASE, getFontById } from '../../../data/fontsData';
import { useSharedDesign } from '../../../context/SharedDesignContext';
import { useToast } from '../../../context/ToastContext';
import { Sparkles } from 'lucide-react';

const TEMPLATES = [
  { id: 'hero', name: 'SaaS Hero Banner' },
  { id: 'article', name: 'Editorial Journal' },
  { id: 'card', name: 'Feature & Pricing Card' },
];

export function EditorialPlaygroundTab() {
  const { showToast } = useToast();
  const { activeFontId, activePalette, activePrimaryHex } = useSharedDesign();

  const [activeTemplate, setActiveTemplate] = useState('hero');
  const [headingSize, setHeadingSize] = useState(48);
  const [headingWeight, setHeadingWeight] = useState(800);
  const [headingLineHeight, setHeadingLineHeight] = useState(1.15);
  const [letterSpacing, setLetterSpacing] = useState(-1);
  const [bodySize, setBodySize] = useState(16);
  const [bodyLineHeight, setBodyLineHeight] = useState(1.6);

  const selectedFont = getFontById(activeFontId) || FONTS_DATABASE[0];

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-stone-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-600 animate-pulse" />
            <h2 className="text-xl font-black tracking-tight text-stone-900 font-display">
              Editorial & UI Typography Playground
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Test real-world layouts with live controls for font-size, line-height, letter-spacing, and weight.
          </p>
        </div>

        {/* Template Switcher */}
        <div className="flex items-center space-x-1.5 p-1 bg-stone-100 rounded-2xl">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTemplate(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTemplate === t.id
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls + Live Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Typography Tuning Controls */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500">
              Type Adjuster
            </h3>
            <span className="text-xs font-bold text-pink-600 font-mono">
              {selectedFont.name}
            </span>
          </div>

          {/* Heading Size */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Heading Size</span>
              <span className="font-mono text-stone-500">{headingSize}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="72"
              value={headingSize}
              onChange={(e) => setHeadingSize(Number(e.target.value))}
              className="w-full accent-pink-600"
            />
          </div>

          {/* Heading Weight */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Heading Weight</span>
              <span className="font-mono text-stone-500">{headingWeight}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[400, 600, 700, 900].map((w) => (
                <button
                  key={w}
                  onClick={() => setHeadingWeight(w)}
                  className={`py-1 rounded-lg text-xs font-mono font-bold transition ${
                    headingWeight === w ? 'bg-pink-600 text-white shadow-xs' : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Line Height */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Heading Line Height</span>
              <span className="font-mono text-stone-500">{headingLineHeight}</span>
            </div>
            <input
              type="range"
              min="1"
              max="1.8"
              step="0.05"
              value={headingLineHeight}
              onChange={(e) => setHeadingLineHeight(Number(e.target.value))}
              className="w-full accent-pink-600"
            />
          </div>

          {/* Letter Spacing */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Letter Spacing</span>
              <span className="font-mono text-stone-500">{letterSpacing}px</span>
            </div>
            <input
              type="range"
              min="-3"
              max="4"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(Number(e.target.value))}
              className="w-full accent-pink-600"
            />
          </div>

          {/* Body Size */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Body Font Size</span>
              <span className="font-mono text-stone-500">{bodySize}px</span>
            </div>
            <input
              type="range"
              min="13"
              max="22"
              value={bodySize}
              onChange={(e) => setBodySize(Number(e.target.value))}
              className="w-full accent-pink-600"
            />
          </div>
        </div>

        {/* Right: Live Interactive Template Render */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-stone-200/80 shadow-xs">
          {/* 1. Hero Template */}
          {activeTemplate === 'hero' && (
            <div className="space-y-8 max-w-2xl py-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-pink-700 text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Design System</span>
              </div>

              <h1
                style={{
                  fontFamily: selectedFont.family,
                  fontSize: `${headingSize}px`,
                  fontWeight: headingWeight,
                  lineHeight: headingLineHeight,
                  letterSpacing: `${letterSpacing}px`,
                }}
                className="text-stone-900 tracking-tight"
              >
                Where precision meets aesthetic perfection.
              </h1>

              <p
                style={{
                  fontSize: `${bodySize}px`,
                  lineHeight: bodyLineHeight,
                }}
                className="text-stone-600 font-sans"
              >
                Build unforgettable digital products with cohesive color palettes, verified contrast,
                and mathematically aligned typography scales.
              </p>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  style={{ backgroundColor: activePalette.primary || '#7C3AED' }}
                  className="px-6 py-3 rounded-full text-white font-bold text-xs shadow-lg transition transform hover:scale-105"
                >
                  Start Building Now
                </button>
                <button className="px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition">
                  Explore Components
                </button>
              </div>
            </div>
          )}

          {/* 2. Article Template */}
          {activeTemplate === 'article' && (
            <article className="space-y-6 max-w-xl py-4">
              <div className="text-xs font-mono text-stone-400 uppercase tracking-widest">
                ESSAY • 6 MIN READ • DESIGN THEORY
              </div>

              <h2
                style={{
                  fontFamily: selectedFont.family,
                  fontSize: `${headingSize * 0.85}px`,
                  fontWeight: headingWeight,
                  lineHeight: headingLineHeight,
                  letterSpacing: `${letterSpacing}px`,
                }}
                className="text-stone-900 font-black tracking-tight"
              >
                The Silent Architecture of Typographic Harmony
              </h2>

              <p
                style={{
                  fontSize: `${bodySize}px`,
                  lineHeight: bodyLineHeight,
                }}
                className="text-stone-700 font-serif leading-relaxed"
              >
                <span
                  style={{ fontFamily: selectedFont.family }}
                  className="float-left text-5xl font-black pr-3 pt-1 text-stone-900 leading-none"
                >
                  T
                </span>
                ypography is not simply the decoration of written words; it is the physical manifestation of thought. When scale, weight, and tracking converge in harmony, the interface fades away, leaving pure clarity.
              </p>

              {/* Pull Quote */}
              <blockquote
                style={{
                  fontFamily: selectedFont.family,
                  borderColor: activePalette.primary || '#7C3AED',
                }}
                className="pl-4 py-2 border-l-4 italic text-lg text-stone-900 font-medium my-4 bg-stone-50 rounded-r-xl"
              >
                “Good design is making something intelligible and memorable. Great design is making it unforgettable.”
              </blockquote>
            </article>
          )}

          {/* 3. Card Template */}
          {activeTemplate === 'card' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
                <span className="text-xs font-mono font-bold text-stone-400 uppercase">Starter Tier</span>
                <div className="flex items-baseline space-x-1">
                  <span
                    style={{ fontFamily: selectedFont.family }}
                    className="text-4xl font-black text-stone-900"
                  >
                    $0
                  </span>
                  <span className="text-xs text-stone-500 font-medium">/ forever</span>
                </div>
                <p style={{ fontSize: `${bodySize}px` }} className="text-stone-600">
                  Full access to color palettes, Google fonts directory, and basic contrast checks.
                </p>
                <button className="w-full py-2.5 rounded-xl bg-white border border-stone-300 font-bold text-xs text-stone-900 shadow-xs hover:bg-stone-100 transition">
                  Get Started Free
                </button>
              </div>

              <div
                className="p-6 rounded-3xl border space-y-4 text-white shadow-xl relative overflow-hidden"
                style={{ backgroundColor: activePalette.primary || '#7C3AED' }}
              >
                <span className="text-xs font-mono font-bold text-white/80 uppercase">Studio Pro</span>
                <div className="flex items-baseline space-x-1">
                  <span
                    style={{ fontFamily: selectedFont.family }}
                    className="text-4xl font-black text-white"
                  >
                    $19
                  </span>
                  <span className="text-xs text-white/70 font-medium">/ month</span>
                </div>
                <p style={{ fontSize: `${bodySize}px` }} className="text-white/90">
                  Unlimited shade scale exports, custom WCAG audits, and full team token sync.
                </p>
                <button className="w-full py-2.5 rounded-xl bg-white font-bold text-xs text-stone-900 shadow-md hover:bg-stone-100 transition">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
