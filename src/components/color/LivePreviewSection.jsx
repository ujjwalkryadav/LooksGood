import React, { useState } from 'react';
import { SegmentedControl } from '../common/SegmentedControl';
import {
  Globe,
  LayoutDashboard,
  Smartphone,
  Presentation,
  CreditCard,
  Share2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Check,
  Star,
  Layers,
  BarChart3,
  Users,
} from 'lucide-react';

export function LivePreviewSection({ palette, headingFont, bodyFont }) {
  const [activeMode, setActiveMode] = useState('website');

  const modes = [
    { value: 'website', label: 'Website Landing', icon: <Globe className="w-3.5 h-3.5" /> },
    { value: 'card', label: 'Product Card', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { value: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { value: 'presentation', label: 'Slide Deck', icon: <Presentation className="w-3.5 h-3.5" /> },
    { value: 'mobile', label: 'Mobile UI', icon: <Smartphone className="w-3.5 h-3.5" /> },
    { value: 'social', label: 'Social Post', icon: <Share2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-card space-y-5">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Live Design Preview</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Real-time simulation of your active colors and typography</p>
        </div>
        <SegmentedControl options={modes} value={activeMode} onChange={setActiveMode} size="sm" />
      </div>

      {/* Preview Viewport Canvas */}
      <div
        className="w-full rounded-2xl border border-black/10 overflow-hidden shadow-inner transition-all duration-300 min-h-[380px] flex items-center justify-center p-4 sm:p-8"
        style={{
          backgroundColor: palette.background,
          color: palette.text,
          fontFamily: bodyFont?.family || 'Inter, sans-serif',
        }}
      >
        {/* 1. WEBSITE PREVIEW */}
        {activeMode === 'website' && (
          <div className="w-full max-w-2xl space-y-6">
            {/* Fake Mini Nav */}
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl border backdrop-blur-md shadow-sm"
              style={{
                backgroundColor: palette.surface,
                borderColor: palette.border || 'rgba(0,0,0,0.08)',
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: palette.primary, color: '#FFFFFF' }}
                >
                  ✦
                </div>
                <span className="font-bold text-sm" style={{ fontFamily: headingFont?.family }}>
                  Aura Studio
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs opacity-75">
                <span>Features</span>
                <span>Pricing</span>
                <button
                  className="px-3 py-1 rounded-lg text-xs font-semibold shadow-sm transition-transform hover:scale-105"
                  style={{ backgroundColor: palette.primary, color: '#FFFFFF' }}
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Hero Section */}
            <div className="text-center space-y-3.5 py-4">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.border || 'rgba(0,0,0,0.1)',
                  color: palette.accent,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Visual Systems</span>
              </div>

              <h2
                className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight"
                style={{ fontFamily: headingFont?.family }}
              >
                Build products that <br />
                <span style={{ color: palette.primary }}>command attention.</span>
              </h2>

              <p className="text-xs sm:text-sm max-w-md mx-auto opacity-80 leading-relaxed">
                Empower your team with intuitive design decisions, instant typographic harmony, and accessible contrast ratios.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  className="px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
                  style={{ backgroundColor: palette.primary, color: '#FFFFFF' }}
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border shadow-sm hover:bg-black/5 transition-all"
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: palette.border || 'rgba(0,0,0,0.12)',
                    color: palette.text,
                  }}
                >
                  View Live Demo
                </button>
              </div>
            </div>

            {/* Bottom 3 Feature Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: 'Harmonic Palettes', desc: 'Calculated visual color chords' },
                { title: 'Curated Typography', desc: 'Flawless heading & body pairings' },
                { title: 'WCAG AAA Contrast', desc: 'Zero guesswork accessibility' },
              ].map((f, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border shadow-sm space-y-1"
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: palette.border || 'rgba(0,0,0,0.08)',
                  }}
                >
                  <h4 className="text-xs font-bold" style={{ fontFamily: headingFont?.family }}>
                    {f.title}
                  </h4>
                  <p className="text-[11px] opacity-75">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. PRODUCT CARD PREVIEW */}
        {activeMode === 'card' && (
          <div className="w-full max-w-sm">
            <div
              className="rounded-2xl border shadow-card p-6 space-y-5"
              style={{
                backgroundColor: palette.surface,
                borderColor: palette.border || 'rgba(0,0,0,0.1)',
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md"
                    style={{ backgroundColor: palette.background, color: palette.accent }}
                  >
                    Pro Workspace
                  </span>
                  <h3
                    className="text-xl font-extrabold mt-2 tracking-tight"
                    style={{ fontFamily: headingFont?.family }}
                  >
                    Design Accelerator
                  </h3>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                  style={{ backgroundColor: palette.primary, color: '#FFFFFF' }}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black" style={{ fontFamily: headingFont?.family }}>
                  $29
                </span>
                <span className="text-xs opacity-70">/ month</span>
              </div>

              <ul className="space-y-2 text-xs opacity-85">
                {[
                  'Automated WCAG contrast compliance',
                  'Dynamic Google Font pairing engine',
                  'CSS tokens & JSON theme export',
                  'Unlimited live design previews',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: palette.primary, color: '#FFFFFF' }}
                    >
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                className="w-full py-3 rounded-xl text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                style={{ backgroundColor: palette.primary, color: '#FFFFFF' }}
              >
                <span>Upgrade to Pro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 3. DASHBOARD PREVIEW */}
        {activeMode === 'dashboard' && (
          <div className="w-full max-w-2xl space-y-4">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Active Users', val: '48,290', change: '+14%', icon: Users },
                { label: 'Conversion Rate', val: '4.85%', change: '+0.6%', icon: TrendingUp },
                { label: 'Design Score', val: '96 / 100', change: 'AAA', icon: Star },
              ].map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border shadow-sm space-y-1"
                    style={{
                      backgroundColor: palette.surface,
                      borderColor: palette.border || 'rgba(0,0,0,0.08)',
                    }}
                  >
                    <div className="flex items-center justify-between text-xs opacity-70">
                      <span>{s.label}</span>
                      <Icon className="w-3.5 h-3.5" style={{ color: palette.accent }} />
                    </div>
                    <div className="text-lg sm:text-xl font-extrabold" style={{ fontFamily: headingFont?.family }}>
                      {s.val}
                    </div>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: palette.background, color: palette.primary }}
                    >
                      {s.change} vs last month
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Visual Mini Chart & Recent Activity */}
            <div
              className="p-4 rounded-xl border shadow-sm space-y-3"
              style={{
                backgroundColor: palette.surface,
                borderColor: palette.border || 'rgba(0,0,0,0.08)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ fontFamily: headingFont?.family }}>
                  Weekly Interaction Volume
                </span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded"
                  style={{ backgroundColor: palette.primary, color: '#FFFFFF' }}
                >
                  Live Sync
                </span>
              </div>

              {/* Mini SVG Bar Graph */}
              <div className="flex items-end gap-2 h-20 pt-2">
                {[45, 60, 35, 80, 65, 95, 75, 90, 85, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                      style={{
                        height: `${h}%`,
                        backgroundColor: i === 9 ? palette.accent : palette.primary,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. PRESENTATION SLIDE PREVIEW */}
        {activeMode === 'presentation' && (
          <div
            className="w-full max-w-xl aspect-video rounded-2xl border shadow-card p-6 sm:p-8 flex flex-col justify-between"
            style={{
              backgroundColor: palette.surface,
              borderColor: palette.border || 'rgba(0,0,0,0.1)',
            }}
          >
            <div className="flex items-center justify-between opacity-75 text-xs">
              <span className="font-bold tracking-wider uppercase">Strategic Keynote</span>
              <span className="font-mono">Slide 03 / 12</span>
            </div>

            <div className="space-y-3">
              <h2
                className="text-2xl sm:text-3xl font-black leading-tight"
                style={{ fontFamily: headingFont?.family }}
              >
                Clarity is the ultimate differentiator.
              </h2>
              <p className="text-xs sm:text-sm opacity-85 leading-relaxed max-w-md">
                When cognitive friction is eliminated through clear typography and intentional contrast, user comprehension increases by over 40%.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: palette.border || 'rgba(0,0,0,0.1)' }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: palette.primary }} />
              <span className="text-xs font-semibold" style={{ color: palette.primary }}>
                Core Principle: 60-30-10 Rule
              </span>
            </div>
          </div>
        )}

        {/* 5. MOBILE UI PREVIEW */}
        {activeMode === 'mobile' && (
          <div
            className="w-64 sm:w-72 rounded-3xl border-4 shadow-modal p-4 space-y-4 overflow-hidden"
            style={{
              backgroundColor: palette.surface,
              borderColor: palette.text,
            }}
          >
            {/* Status Bar */}
            <div className="flex items-center justify-between text-[10px] opacity-70 px-1">
              <span>9:41</span>
              <span>100% 🔋</span>
            </div>

            {/* App Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] opacity-70 block">Welcome Back</span>
                <h4 className="text-sm font-bold" style={{ fontFamily: headingFont?.family }}>
                  Design Digest
                </h4>
              </div>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: palette.accent, color: '#18181B' }}
              >
                JD
              </div>
            </div>

            {/* Mobile Card */}
            <div
              className="p-3.5 rounded-xl border space-y-2"
              style={{
                backgroundColor: palette.background,
                borderColor: palette.border || 'rgba(0,0,0,0.08)',
              }}
            >
              <span
                className="px-2 py-0.5 text-[9px] font-bold rounded"
                style={{ backgroundColor: palette.primary, color: '#FFFFFF' }}
              >
                Featured
              </span>
              <h5 className="text-xs font-bold" style={{ fontFamily: headingFont?.family }}>
                Modern Typography Rules
              </h5>
              <p className="text-[10px] opacity-75">
                Why font line-height and x-height define reading rhythm.
              </p>
            </div>

            {/* Mobile Button */}
            <button
              className="w-full py-2.5 rounded-xl text-xs font-bold shadow-sm"
              style={{ backgroundColor: palette.primary, color: '#FFFFFF' }}
            >
              Explore Collection
            </button>
          </div>
        )}

        {/* 6. SOCIAL MEDIA POST */}
        {activeMode === 'social' && (
          <div
            className="w-full max-w-sm aspect-square rounded-2xl border shadow-card p-6 flex flex-col justify-between"
            style={{
              backgroundColor: palette.surface,
              borderColor: palette.border || 'rgba(0,0,0,0.1)',
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-lg"
                style={{ backgroundColor: palette.primary, color: '#FFFFFF' }}
              >
                Design Truth #42
              </span>
              <Sparkles className="w-4 h-4" style={{ color: palette.accent }} />
            </div>

            <div className="space-y-2">
              <h3
                className="text-xl sm:text-2xl font-black leading-snug"
                style={{ fontFamily: headingFont?.family }}
              >
                "If everything is emphasized, nothing is emphasized."
              </h3>
              <p className="text-xs opacity-80">
                Contrast is currency. Spend it carefully on elements that truly matter.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t text-xs opacity-75" style={{ borderColor: palette.border || 'rgba(0,0,0,0.1)' }}>
              <span className="font-bold">@looksgood.design</span>
              <span style={{ color: palette.accent, fontWeight: 'bold' }}>Save Post ↗</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
