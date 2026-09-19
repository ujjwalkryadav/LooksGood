import React, { useState } from 'react';
import {
  getContrastRatio,
  evaluateContrast,
  getSuggestedAlternatives,
  isValidHex,
  normalizeHex,
  hexToHsl,
  hslToHex,
} from '../../utils/colorUtils';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ArrowLeftRight,
  Check,
  Wand2,
  Sliders,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function ContrastChecker() {
  const { showToast } = useToast();
  const [fgColor, setFgColor] = useState('#0D0C0B'); // Carbon black text
  const [bgColor, setBgColor] = useState('#FAF9F6'); // Floral white canvas
  const [fgInput, setFgInput] = useState('#0D0C0B');
  const [bgInput, setBgInput] = useState('#FAF9F6');
  const [previewFontSize, setPreviewFontSize] = useState(16); // 14, 16, 20, 32, 48

  const ratio = getContrastRatio(fgColor, bgColor);
  const evaluation = evaluateContrast(ratio);
  const alternatives = getSuggestedAlternatives(fgColor, bgColor, 4.5);

  const handleSwap = () => {
    const temp = fgColor;
    setFgColor(bgColor);
    setBgColor(temp);
    setFgInput(bgColor);
    setBgInput(temp);
    showToast('Swapped text and background colors!');
  };

  const handleApplyAlternative = (hex) => {
    setFgColor(hex);
    setFgInput(hex);
    showToast(`Applied accessible alternative ${hex}!`);
  };

  // Magic auto fix contrast
  const handleAutoFix = (targetRatio = 4.5) => {
    const bgHsl = hexToHsl(bgColor);
    const isBgLight = bgHsl.l > 50;

    // If light bg, darken fg; if dark bg, lighten fg
    const fgHsl = hexToHsl(fgColor);
    let newLightness = isBgLight ? Math.max(5, fgHsl.l - 40) : Math.min(95, fgHsl.l + 40);
    let newHex = hslToHex(fgHsl.h, fgHsl.s, newLightness);

    setFgColor(newHex);
    setFgInput(newHex);
    showToast(`Auto-calibrated color for WCAG compliance!`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="minimal-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-paprika-light text-paprika border border-paprika-border shadow-subtle">
            <CheckCircle2 className="w-3.5 h-3.5 text-paprika" />
            <span>WCAG 2.1 READABILITY & ACCESSIBILITY AUDIT</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0D0C0B] tracking-tight">
            Color Contrast Checker
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] font-medium">
            Calculate the exact contrast ratio between foreground and background colors to ensure readable text across all screens and lighting.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => handleAutoFix(4.5)}
            className="px-4 py-3 rounded-2xl bg-paprika text-white text-xs font-mono font-bold uppercase tracking-wider shadow-paprika-sm hover:bg-paprika-hover transition-all flex items-center justify-center gap-2 hover:scale-105 shrink-0"
          >
            <Wand2 className="w-4 h-4" />
            <span>Auto-Fix Contrast</span>
          </button>

          <button
            onClick={handleSwap}
            className="px-4 py-3 rounded-2xl bg-white hover:bg-[#F2EFE9] border border-[#E8E5DF] text-[#0D0C0B] text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-subtle shrink-0"
          >
            <ArrowLeftRight className="w-4 h-4 text-paprika" />
            <span>Swap Colors</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Controls & Score Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pickers & Contrast Dial */}
        <div className="lg:col-span-5 space-y-6">
          {/* Color Inputs */}
          <div className="minimal-card rounded-3xl p-6 space-y-4">
            {/* Text Color Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#78716C] uppercase">Text / Foreground Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => {
                    setFgColor(e.target.value);
                    setFgInput(e.target.value);
                  }}
                  className="w-11 h-11 rounded-xl bg-transparent border border-[#E8E5DF] cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={fgInput}
                  onChange={(e) => {
                    setFgInput(e.target.value);
                    if (isValidHex(e.target.value)) setFgColor(normalizeHex(e.target.value));
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#E8E5DF] bg-white text-[#0D0C0B] font-mono font-bold text-sm focus:outline-none focus:border-paprika uppercase"
                />
              </div>
            </div>

            {/* Background Color Input */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-mono font-bold text-[#78716C] uppercase">Background Canvas Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    setBgInput(e.target.value);
                  }}
                  className="w-11 h-11 rounded-xl bg-transparent border border-[#E8E5DF] cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={bgInput}
                  onChange={(e) => {
                    setBgInput(e.target.value);
                    if (isValidHex(e.target.value)) setBgColor(normalizeHex(e.target.value));
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#E8E5DF] bg-white text-[#0D0C0B] font-mono font-bold text-sm focus:outline-none focus:border-paprika uppercase"
                />
              </div>
            </div>
          </div>

          {/* Ratio & Rating Dial */}
          <div className="minimal-card rounded-3xl p-6 sm:p-8 text-center space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#78716C]">
              WCAG CONTRAST RATIO
            </span>

            <div className="py-2">
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-[#0D0C0B]">
                {ratio}:1
              </div>
              <div className="pt-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase ${
                    evaluation.status === 'pass'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : evaluation.status === 'warning'
                      ? 'bg-amber-50 text-amber-700 border border-amber-300'
                      : 'bg-rose-50 text-rose-700 border border-rose-300'
                  }`}
                >
                  {evaluation.scoreRating}
                </span>
              </div>
            </div>

            {/* Compliance Matrix */}
            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-[#E8E5DF] text-left">
              <div className="p-3 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] space-y-1">
                <span className="text-[10px] font-mono text-[#78716C] font-bold block">SMALL TEXT</span>
                <div className="flex items-center gap-1 text-xs font-bold font-mono">
                  {evaluation.bodyAA ? (
                    <span className="text-emerald-700 font-bold">Pass (AA)</span>
                  ) : (
                    <span className="text-rose-700 font-bold">Fail</span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] space-y-1">
                <span className="text-[10px] font-mono text-[#78716C] font-bold block">LARGE HEADERS</span>
                <div className="flex items-center gap-1 text-xs font-bold font-mono">
                  {evaluation.headingAA ? (
                    <span className="text-emerald-700 font-bold">Pass (AA)</span>
                  ) : (
                    <span className="text-rose-700 font-bold">Fail</span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] space-y-1">
                <span className="text-[10px] font-mono text-[#78716C] font-bold block">UI GRAPHICS</span>
                <div className="flex items-center gap-1 text-xs font-bold font-mono">
                  {evaluation.uiComponents ? (
                    <span className="text-emerald-700 font-bold">Pass (AA)</span>
                  ) : (
                    <span className="text-rose-700 font-bold">Fail</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Accessible Alternatives if needed */}
          {alternatives.length > 0 && (
            <div className="minimal-card rounded-3xl p-6 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#78716C] block">
                Suggested Accessible Alternatives:
              </span>
              <div className="space-y-2">
                {alternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg border border-[#E8E5DF]" style={{ backgroundColor: alt.hex }} />
                      <div>
                        <span className="text-xs font-mono font-bold text-[#0D0C0B] block">{alt.hex}</span>
                        <span className="text-[10px] font-mono text-emerald-700 font-bold">{alt.ratio}:1 Ratio</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyAlternative(alt.hex)}
                      className="px-3 py-1 rounded-xl bg-paprika text-white text-xs font-mono font-bold hover:bg-paprika-hover transition-all shadow-sm"
                    >
                      Apply Fix
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Realistic Live Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="minimal-card rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#E8E5DF]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0D0C0B] block">
                Live Real-World Readability Test
              </span>

              {/* Font size pills */}
              <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-xl border border-[#E8E5DF]">
                {[
                  { label: '14px', size: 14 },
                  { label: '16px', size: 16 },
                  { label: '20px', size: 20 },
                  { label: '32px', size: 32 },
                ].map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setPreviewFontSize(s.size)}
                    className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
                      previewFontSize === s.size
                        ? 'bg-[#0D0C0B] text-white shadow-sm'
                        : 'text-[#78716C] hover:text-[#0D0C0B]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Card rendered in user's selected foreground & background */}
            <div
              className="p-8 sm:p-12 rounded-3xl border shadow-subtle transition-all duration-300 space-y-6"
              style={{
                backgroundColor: bgColor,
                color: fgColor,
                borderColor: 'rgba(0,0,0,0.1)',
              }}
            >
              <span className="text-xs font-mono font-bold uppercase tracking-widest opacity-70 block">
                EDITORIAL SAMPLE • {ratio}:1 RATIO
              </span>

              <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Design that commands instant attention.
              </h3>

              <p
                className="leading-relaxed opacity-90 max-w-xl font-medium"
                style={{ fontSize: `${previewFontSize}px` }}
              >
                When foreground typography is calibrated for maximum luminance separation from its canvas, cognitive load drops significantly and reader comprehension surges.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  className="px-6 py-3 rounded-2xl text-xs font-extrabold shadow-sm transition-transform hover:scale-105"
                  style={{
                    backgroundColor: fgColor,
                    color: bgColor,
                  }}
                >
                  Primary Action
                </button>
                <button
                  className="px-5 py-3 rounded-2xl text-xs font-bold border transition-transform hover:scale-105"
                  style={{
                    borderColor: fgColor,
                    color: fgColor,
                  }}
                >
                  Secondary Outline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
