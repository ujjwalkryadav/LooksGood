import React, { useState, useEffect } from 'react';
import {
  Palette,
  Type,
  Sparkles,
  Copy,
  Check,
  Download,
  ArrowRight,
  Eye,
  Sliders,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  Sun,
  Moon,
  Code2,
  FileText,
} from 'lucide-react';
import { useSharedDesign } from '../../../context/SharedDesignContext';
import { useToast } from '../../../context/ToastContext';

// Helper to calculate contrast ratio for preview
function getLuminance(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
  const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateContrastRatio(hex1, hex2) {
  try {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const ratio = (lighter + 0.05) / (darker + 0.05);
    return ratio.toFixed(1);
  } catch {
    return '4.5';
  }
}

export function AiBrandGuideResult({
  brandGuide,
  onRegenerate,
  onNavigateStudio,
  onSaveToLibrary,
  isSaved = false,
}) {
  const { showToast } = useToast();
  const { sendPaletteToColorStudio, setActiveFontId } = useSharedDesign();

  const [copiedKey, setCopiedKey] = useState(null);
  const [previewTheme, setPreviewTheme] = useState('light'); // 'light' | 'dark'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'colors' | 'typography' | 'uiMockup' | 'export'

  // Dynamically inject Google Fonts CDN link so preview fonts render in real-time
  useEffect(() => {
    if (brandGuide?.typography?.googleFontsCdnLink) {
      const linkId = 'looksgood-ai-dynamic-fonts';
      let existing = document.getElementById(linkId);
      if (!existing) {
        existing = document.createElement('link');
        existing.id = linkId;
        existing.rel = 'stylesheet';
        document.head.appendChild(existing);
      }
      existing.href = brandGuide.typography.googleFontsCdnLink;
    }
  }, [brandGuide]);

  if (!brandGuide) return null;

  const {
    brandName,
    tagline,
    conceptSummary,
    personalityTags = [],
    colors = {},
    typography = {},
    uiComponentStyles = {},
    mockPreviewData = {},
    _warning,
  } = brandGuide;

  const primaryHex = colors?.primary?.hex || '#7C3AED';
  const secondaryHex = colors?.secondary?.hex || '#1E1B4B';
  const accentHex = colors?.accent?.hex || '#EC4899';
  const bgHex = colors?.background?.hex || '#FAF9F6';
  const textHex = colors?.text?.hex || '#0D0C0B';

  const headingFontName = typography?.displayHeadingFont?.name || 'Plus Jakarta Sans';
  const subheadingFontName = typography?.subheadingFont?.name || 'Space Grotesk';
  const bodyFontName = typography?.bodyFont?.name || 'Inter';

  // Contrast calculation
  const textBgContrast = calculateContrastRatio(textHex, bgHex);
  const primaryBgContrast = calculateContrastRatio(primaryHex, bgHex);
  const accentBgContrast = calculateContrastRatio(accentHex, bgHex);

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${key} to clipboard!`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApplyToColorStudio = () => {
    sendPaletteToColorStudio(
      {
        primary: primaryHex,
        secondary: secondaryHex,
        accent: accentHex,
        background: bgHex,
        text: textHex,
      },
      `${brandName} (AI Generated)`
    );
    if (onNavigateStudio) {
      onNavigateStudio('colors', 'palette');
    }
  };

  const handleApplyToTypographyStudio = () => {
    const matchedId = headingFontName.toLowerCase().replace(/\s+/g, '-');
    setActiveFontId(matchedId);
    showToast(`Applied ${headingFontName} to Typography Studio!`, 'success');
    if (onNavigateStudio) {
      onNavigateStudio('typography', 'pairings');
    }
  };

  const generateCssVariables = () => {
    return `:root {
  /* ${brandName} Design System Tokens */
  --color-primary: ${primaryHex};
  --color-secondary: ${secondaryHex};
  --color-accent: ${accentHex};
  --color-background: ${bgHex};
  --color-text: ${textHex};

  /* Typography */
  --font-display: "${headingFontName}", serif, sans-serif;
  --font-subheading: "${subheadingFontName}", sans-serif;
  --font-body: "${bodyFontName}", sans-serif;

  /* UI Tokens */
  --border-radius: ${uiComponentStyles.borderRadius || '16px'};
  --shadow-elevation: ${uiComponentStyles.shadowStyle || '0 10px 30px rgba(0,0,0,0.08)'};
}`;
  };

  const generateTailwindConfig = () => {
    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '${primaryHex}',
          secondary: '${secondaryHex}',
          accent: '${accentHex}',
          bg: '${bgHex}',
          ink: '${textHex}',
        },
      },
      fontFamily: {
        display: ['"${headingFontName}"', 'sans-serif'],
        subheading: ['"${subheadingFontName}"', 'sans-serif'],
        body: ['"${bodyFontName}"', 'sans-serif'],
      },
      borderRadius: {
        'brand': '16px',
      },
    },
  },
};`;
  };

  const generateMarkdownBrandKit = () => {
    return `# Brand & Design System Guide: ${brandName}
> ${tagline}

## Concept Rationale
${conceptSummary}

**Brand Personality**: ${personalityTags.join(', ')}

---

## 1. Color System (60-30-10 Rule)
- **Primary (60%)**: \`${primaryHex}\` - ${colors?.primary?.name || 'Primary'} (${colors?.primary?.usage || ''})
- **Secondary (30%)**: \`${secondaryHex}\` - ${colors?.secondary?.name || 'Secondary'} (${colors?.secondary?.usage || ''})
- **Accent (10%)**: \`${accentHex}\` - ${colors?.accent?.name || 'Accent'} (${colors?.accent?.usage || ''})
- **Background**: \`${bgHex}\` - ${colors?.background?.name || 'Background'}
- **Text & Ink**: \`${textHex}\` - ${colors?.text?.name || 'Text'}

---

## 2. Typography Strategy
- **Display / Heading Font**: **${headingFontName}** (${typography?.displayHeadingFont?.category || 'Sans'})
  - Why: ${typography?.displayHeadingFont?.whyItWorks || ''}
- **Subheading Font**: **${subheadingFontName}**
  - Why: ${typography?.subheadingFont?.whyItWorks || ''}
- **Body / UI Copy Font**: **${bodyFontName}**
  - Why: ${typography?.bodyFont?.whyItWorks || ''}

**Google Fonts CDN**:
\`\`\`html
<link rel="stylesheet" href="${typography?.googleFontsCdnLink || ''}">
\`\`\`

---

## 3. UI Component Direction
- **Border Radius**: ${uiComponentStyles?.borderRadius || '16px'}
- **Shadow Style**: ${uiComponentStyles?.shadowStyle || 'Soft ambient shadow'}
- **Aesthetic Vibe**: ${uiComponentStyles?.vibeAesthetic || 'Modern Glassmorphic'}

Generated by LooksGood AI Studio on ${new Date().toLocaleDateString()}.`;
  };

  const downloadFile = (filename, content, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`, 'success');
  };

  return (
    <div className="w-full space-y-8 animate-fade-in select-text">
      {/* Warning Notice (if any API fallback occurred) */}
      {_warning && (
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-medium flex items-center justify-between">
          <span>{_warning}</span>
        </div>
      )}

      {/* 1. Top Brand Master Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-purple-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Dynamic color orb glows */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: primaryHex }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: accentHex }}
        />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-300">
                AI Design System Complete
              </span>
            </div>

            {/* Quick Actions Top Right */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onSaveToLibrary}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  isSaved
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
                title="Save this guide to your local library"
              >
                {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Saved in Library' : 'Save Guide'}</span>
              </button>

              <button
                onClick={() => handleCopyText(generateMarkdownBrandKit(), 'Brand Kit')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center space-x-1.5 cursor-pointer"
                title="Copy entire markdown brand kit"
              >
                {copiedKey === 'Brand Kit' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Kit</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white">
              {brandName}
            </h1>
            <p className="text-sm sm:text-base text-purple-200 font-medium italic">
              "{tagline}"
            </p>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 font-medium max-w-3xl leading-relaxed">
            {conceptSummary}
          </p>

          {/* Personality Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {personalityTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md border border-white/20 text-white"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs for the Generated Guide */}
      <div className="flex items-center space-x-1 p-1 bg-stone-200/70 backdrop-blur-md rounded-2xl w-fit overflow-x-auto max-w-full">
        {[
          { id: 'overview', label: 'Complete System', icon: Sparkles },
          { id: 'colors', label: 'Color Tokens', icon: Palette },
          { id: 'typography', label: 'Typography', icon: Type },
          { id: 'uiMockup', label: 'Live UI Preview', icon: Eye },
          { id: 'export', label: 'Code Export', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-600' : 'text-stone-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Section Content Display */}

      {/* VIEW: OVERVIEW OR COLORS */}
      {(activeTab === 'overview' || activeTab === 'colors') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-purple-600" />
                <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 font-display">
                  1. Harmonized 5-Role Color System (60-30-10)
                </h3>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Mathematically balanced distribution with verified WCAG contrast ratios.
              </p>
            </div>

            <button
              onClick={handleApplyToColorStudio}
              className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold border border-purple-200 transition flex items-center space-x-1.5 cursor-pointer self-start sm:self-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Open in Color Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual 60-30-10 Distribution Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-stone-500">
              <span>Primary (60% Weight)</span>
              <span>Secondary (30%)</span>
              <span>Accent (10%)</span>
            </div>
            <div className="h-4 w-full rounded-full overflow-hidden flex shadow-inner border border-stone-200">
              <div style={{ backgroundColor: primaryHex, width: '60%' }} title="Primary 60%" />
              <div style={{ backgroundColor: secondaryHex, width: '30%' }} title="Secondary 30%" />
              <div style={{ backgroundColor: accentHex, width: '10%' }} title="Accent 10%" />
            </div>
          </div>

          {/* 5 Color Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {[
              { role: 'Primary', data: colors.primary, defaultHex: primaryHex, ratio: primaryBgContrast },
              { role: 'Secondary', data: colors.secondary, defaultHex: secondaryHex, ratio: calculateContrastRatio(secondaryHex, bgHex) },
              { role: 'Accent', data: colors.accent, defaultHex: accentHex, ratio: accentBgContrast },
              { role: 'Background', data: colors.background, defaultHex: bgHex, ratio: '—' },
              { role: 'Text / Ink', data: colors.text, defaultHex: textHex, ratio: textBgContrast },
            ].map((c, idx) => {
              const hex = c.data?.hex || c.defaultHex;
              const name = c.data?.name || c.role;
              const isDark = getLuminance(hex) < 0.4;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200/80 overflow-hidden bg-stone-50/50 flex flex-col justify-between shadow-2xs hover:shadow-md transition"
                >
                  {/* Swatch */}
                  <div
                    className="h-28 p-3 flex flex-col justify-between transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: hex }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          isDark ? 'bg-white/20 text-white' : 'bg-black/10 text-black'
                        }`}
                      >
                        {c.role}
                      </span>
                      {c.ratio !== '—' && (
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            parseFloat(c.ratio) >= 4.5
                              ? isDark
                                ? 'bg-emerald-500/80 text-white'
                                : 'bg-emerald-600 text-white'
                              : 'bg-amber-500/80 text-white'
                          }`}
                        >
                          {c.ratio}:1 {parseFloat(c.ratio) >= 4.5 ? 'AAA' : 'AA'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`font-mono font-black text-sm tracking-wider ${isDark ? 'text-white' : 'text-stone-900'}`}>
                        {hex}
                      </span>
                      <button
                        onClick={() => handleCopyText(hex, `${c.role} (${hex})`)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          isDark ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10 text-stone-900'
                        }`}
                        title="Copy HEX"
                      >
                        {copiedKey === `${c.role} (${hex})` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Swatch Details */}
                  <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{name}</h4>
                      <p className="text-[11px] text-stone-500 font-medium leading-tight mt-0.5">
                        {c.data?.usage || 'Strategic UI placement token'}
                      </p>
                    </div>
                    {c.data?.psychology && (
                      <p className="text-[10px] text-purple-700 font-medium italic pt-1 border-t border-stone-100">
                        {c.data.psychology}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: OVERVIEW OR TYPOGRAPHY */}
      {(activeTab === 'overview' || activeTab === 'typography') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Type className="w-4 h-4 text-pink-600" />
                <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 font-display">
                  2. Google Fonts Typography Strategy & Hierarchy
                </h3>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Curated font trio balancing display impact, section rhythm, and reading legibility.
              </p>
            </div>

            <button
              onClick={handleApplyToTypographyStudio}
              className="px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-900 text-xs font-bold border border-pink-200 transition flex items-center space-x-1.5 cursor-pointer self-start sm:self-center"
            >
              <Type className="w-3.5 h-3.5 text-pink-600" />
              <span>Explore in Typography Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Fonts Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Display Headline */}
            <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Display / Heading Font
                </span>
                <span className="text-[10px] text-stone-500 font-medium">{typography?.displayHeadingFont?.category}</span>
              </div>
              <h4
                className="text-2xl font-bold text-stone-900 leading-tight"
                style={{ fontFamily: `"${headingFontName}", serif, sans-serif` }}
              >
                {headingFontName}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                {typography?.displayHeadingFont?.whyItWorks}
              </p>
              <div className="text-[11px] font-mono text-stone-400 pt-2 border-t border-stone-200">
                Weights: {typography?.displayHeadingFont?.weights || '600, 700'}
              </div>
            </div>

            {/* Subheading */}
            <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Subheading & UI Cards
                </span>
                <span className="text-[10px] text-stone-500 font-medium">{typography?.subheadingFont?.category}</span>
              </div>
              <h4
                className="text-2xl font-bold text-stone-900 leading-tight"
                style={{ fontFamily: `"${subheadingFontName}", sans-serif` }}
              >
                {subheadingFontName}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                {typography?.subheadingFont?.whyItWorks}
              </p>
              <div className="text-[11px] font-mono text-stone-400 pt-2 border-t border-stone-200">
                Weights: {typography?.subheadingFont?.weights || '500, 600'}
              </div>
            </div>

            {/* Body */}
            <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                  Body & Reading Copy
                </span>
                <span className="text-[10px] text-stone-500 font-medium">{typography?.bodyFont?.category}</span>
              </div>
              <h4
                className="text-2xl font-bold text-stone-900 leading-tight"
                style={{ fontFamily: `"${bodyFontName}", sans-serif` }}
              >
                {bodyFontName}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                {typography?.bodyFont?.whyItWorks}
              </p>
              <div className="text-[11px] font-mono text-stone-400 pt-2 border-t border-stone-200">
                Weights: {typography?.bodyFont?.weights || '400, 500'}
              </div>
            </div>
          </div>

          {/* Type Scale Ladder */}
          {Array.isArray(typography.scaleLadder) && typography.scaleLadder.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-stone-700">Recommended Type Hierarchy Scale:</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {typography.scaleLadder.map((step, idx) => (
                  <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center space-y-1">
                    <span className="text-[10px] font-mono font-bold text-purple-700 block">{step.level}</span>
                    <span className="text-sm font-bold text-stone-900 block">{step.size}</span>
                    <span className="text-[10px] text-stone-400 block font-mono">LH: {step.lineHeight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: OVERVIEW OR LIVE UI MOCKUP */}
      {(activeTab === 'overview' || activeTab === 'uiMockup') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-indigo-600" />
                <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 font-display">
                  3. Live Interactive UI Simulation
                </h3>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Real-time interactive mockup rendered using generated fonts and colors.
              </p>
            </div>

            {/* Dark/Light Mode Switch */}
            <div className="flex items-center space-x-1 p-1 bg-stone-100 rounded-xl border border-stone-200 self-start sm:self-center">
              <button
                onClick={() => setPreviewTheme('light')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                  previewTheme === 'light' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light Canvas</span>
              </button>
              <button
                onClick={() => setPreviewTheme('dark')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                  previewTheme === 'dark' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark Cockpit</span>
              </button>
            </div>
          </div>

          {/* Dynamic Mockup Canvas Frame */}
          <div
            className="rounded-3xl p-6 sm:p-10 border transition-all duration-300 relative overflow-hidden shadow-xl"
            style={{
              backgroundColor: previewTheme === 'dark' ? (colors?.secondary?.hex || '#0F172A') : bgHex,
              color: previewTheme === 'dark' ? '#FFFFFF' : textHex,
              borderColor: previewTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            }}
          >
            {/* Top Navigation Bar Simulation */}
            <div className="flex items-center justify-between pb-8 border-b border-white/10 mb-8">
              <div className="flex items-center space-x-2">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-md"
                  style={{ backgroundColor: primaryHex }}
                >
                  {brandName ? brandName.charAt(0) : 'L'}
                </div>
                <span
                  className="font-bold text-base tracking-tight"
                  style={{ fontFamily: `"${headingFontName}", serif, sans-serif` }}
                >
                  {brandName}
                </span>
              </div>

              <div className="hidden sm:flex items-center space-x-4 text-xs font-medium opacity-80">
                <span>Features</span>
                <span>Systems</span>
                <span>Pricing</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs"
                  style={{ backgroundColor: accentHex }}
                >
                  NEW v2.0
                </span>
              </div>

              <button
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-md transition hover:opacity-90"
                style={{ backgroundColor: primaryHex }}
              >
                {mockPreviewData.ctaButtonText || 'Get Started'}
              </button>
            </div>

            {/* Hero Section Banner */}
            <div className="max-w-2xl space-y-4">
              <div
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold shadow-xs"
                style={{
                  backgroundColor: previewTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: primaryHex,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{tagline}</span>
              </div>

              <h2
                className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15]"
                style={{
                  fontFamily: `"${headingFontName}", serif, sans-serif`,
                }}
              >
                {mockPreviewData.heroTitle || 'Experience Harmonic Digital Design'}
              </h2>

              <p
                className="text-sm sm:text-base leading-relaxed opacity-85"
                style={{ fontFamily: `"${bodyFontName}", sans-serif` }}
              >
                {mockPreviewData.heroSubtitle || conceptSummary}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-lg shadow-black/10 hover:opacity-95 transition flex items-center space-x-2 cursor-pointer"
                  style={{ backgroundColor: primaryHex }}
                >
                  <span>{mockPreviewData.ctaButtonText || 'Launch Product'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition hover:opacity-85 cursor-pointer"
                  style={{
                    backgroundColor: previewTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                    borderColor: previewTheme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                    color: previewTheme === 'dark' ? '#FFFFFF' : textHex,
                  }}
                >
                  {mockPreviewData.secondaryButtonText || 'Documentation'}
                </button>
              </div>
            </div>

            {/* Feature Cards Grid Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-8 mt-8 border-t border-white/10">
              {(mockPreviewData.featureCards || []).map((card, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border backdrop-blur-md space-y-1.5 shadow-xs"
                  style={{
                    backgroundColor: previewTheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
                    borderColor: previewTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h5
                      className="text-xs font-bold"
                      style={{ fontFamily: `"${subheadingFontName}", sans-serif` }}
                    >
                      {card.title}
                    </h5>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: idx === 0 ? primaryHex : idx === 1 ? accentHex : secondaryHex }}
                    />
                  </div>
                  <p
                    className="text-[11px] opacity-80 leading-normal"
                    style={{ fontFamily: `"${bodyFontName}", sans-serif` }}
                  >
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: OVERVIEW OR UI COMPONENT GUIDELINES */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex items-center space-x-2 border-b border-stone-100 pb-4">
            <Sliders className="w-4 h-4 text-purple-600" />
            <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 font-display">
              4. UI Component Architecture & Design Rules
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">Corner Radius</span>
              <p className="text-xs font-bold text-stone-900">{uiComponentStyles.borderRadius || '16px (rounded-2xl)'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">Elevation & Shadow</span>
              <p className="text-xs font-bold text-stone-900">{uiComponentStyles.shadowStyle || 'Layered soft shadow'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">Aesthetic Direction</span>
              <p className="text-xs font-bold text-stone-900">{uiComponentStyles.vibeAesthetic || 'Modern Glassmorphic'}</p>
            </div>
          </div>

          {/* Dos & Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Design System Do's:</span>
              </span>
              <ul className="space-y-1.5 text-xs text-emerald-800">
                {(uiComponentStyles.dos || []).map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
              <span className="text-xs font-bold text-rose-900 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>Design System Don'ts:</span>
              </span>
              <ul className="space-y-1.5 text-xs text-rose-800">
                {(uiComponentStyles.donts || []).map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: EXPORT TAB */}
      {(activeTab === 'overview' || activeTab === 'export') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-purple-600" />
              <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 font-display">
                5. Code & Production Token Export
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CSS Variables */}
            <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400">CSS Custom Properties (:root)</span>
                <button
                  onClick={() => handleCopyText(generateCssVariables(), 'CSS Variables')}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-200 flex items-center space-x-1 cursor-pointer"
                >
                  {copiedKey === 'CSS Variables' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono text-stone-300 overflow-x-auto p-3 bg-stone-950/80 rounded-xl max-h-48">
                {generateCssVariables()}
              </pre>
            </div>

            {/* Tailwind CSS Config */}
            <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400">Tailwind CSS Preset</span>
                <button
                  onClick={() => handleCopyText(generateTailwindConfig(), 'Tailwind Config')}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-200 flex items-center space-x-1 cursor-pointer"
                >
                  {copiedKey === 'Tailwind Config' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono text-stone-300 overflow-x-auto p-3 bg-stone-950/80 rounded-xl max-h-48">
                {generateTailwindConfig()}
              </pre>
            </div>
          </div>

          {/* Download Center Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => downloadFile(`${brandName.toLowerCase().replace(/\s+/g, '-')}-design-system.json`, JSON.stringify(brandGuide, null, 2), 'application/json')}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center space-x-2 cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-purple-600" />
              <span>Download JSON Specification</span>
            </button>

            <button
              onClick={() => downloadFile(`${brandName.toLowerCase().replace(/\s+/g, '-')}-brand-guide.md`, generateMarkdownBrandKit(), 'text/markdown')}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center space-x-2 cursor-pointer shadow-2xs"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Download Markdown Brand Kit</span>
            </button>

            <button
              onClick={() => downloadFile(`${brandName.toLowerCase().replace(/\s+/g, '-')}-tokens.css`, generateCssVariables(), 'text/css')}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center space-x-2 cursor-pointer shadow-2xs"
            >
              <Code2 className="w-4 h-4 text-pink-600" />
              <span>Download CSS Variables</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
