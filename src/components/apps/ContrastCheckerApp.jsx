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
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function ContrastCheckerApp() {
  const { showToast } = useToast();
  const [fgColor, setFgColor] = useState('#0D0C0B'); // Carbon black text
  const [bgColor, setBgColor] = useState('#FAF9F6'); // Floral white canvas
  const [fgInput, setFgInput] = useState('#0D0C0B');
  const [bgInput, setBgInput] = useState('#FAF9F6');
  const [previewFontSize, setPreviewFontSize] = useState(16);

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

  const handleAutoFix = () => {
    const bgHsl = hexToHsl(bgColor);
    const isBgLight = bgHsl.l > 50;
    const fgHsl = hexToHsl(fgColor);
    let newLightness = isBgLight ? Math.max(5, fgHsl.l - 40) : Math.min(95, fgHsl.l + 40);
    let newHex = hslToHex(fgHsl.h, fgHsl.s, newLightness);

    setFgColor(newHex);
    setFgInput(newHex);
    showToast(`Auto-calibrated color for WCAG 2.1 compliance!`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="minimal-card rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[#E8E5DF]">
        <div>
          <h2 className="text-xl font-black text-[#0D0C0B] tracking-tight">Contrast Checker</h2>
          <p className="text-xs text-[#57534E] font-medium">
            Test WCAG 2.1 AA/AAA compliance ratios for body text, headers, and UI elements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoFix}
            className="px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purpleDark text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-purple-sm hover:scale-105"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Auto-Fix Contrast</span>
          </button>

          <button
            onClick={handleSwap}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF9F6] border border-[#E8E5DF] text-[#0D0C0B] text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-subtle hover:scale-105"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-brand-purple" />
            <span>Swap</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Inputs & Score */}
        <div className="lg:col-span-5 space-y-6">
          {/* Inputs */}
          <div className="minimal-card rounded-3xl p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#78716C] uppercase">Text / Foreground</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => {
                    setFgColor(e.target.value);
                    setFgInput(e.target.value);
                  }}
                  className="w-10 h-10 rounded-xl bg-transparent border border-[#E8E5DF] cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={fgInput}
                  onChange={(e) => {
                    setFgInput(e.target.value);
                    if (isValidHex(e.target.value)) setFgColor(normalizeHex(e.target.value));
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-white text-[#0D0C0B] font-mono font-bold text-xs uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#78716C] uppercase">Background Canvas</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    setBgInput(e.target.value);
                  }}
                  className="w-10 h-10 rounded-xl bg-transparent border border-[#E8E5DF] cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={bgInput}
                  onChange={(e) => {
                    setBgInput(e.target.value);
                    if (isValidHex(e.target.value)) setBgColor(normalizeHex(e.target.value));
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#E8E5DF] bg-white text-[#0D0C0B] font-mono font-bold text-xs uppercase"
                />
              </div>
            </div>
          </div>

          {/* Ratio Score Dial */}
          <div className="minimal-card rounded-3xl p-6 text-center space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#78716C]">
              WCAG CONTRAST RATIO
            </span>

            <div>
              <div className="text-5xl font-black font-mono tracking-tight text-[#0D0C0B]">
                {ratio}:1
              </div>
              <div className="pt-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold font-mono uppercase ${
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
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E8E5DF] text-left">
              <div className="p-2.5 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] space-y-0.5">
                <span className="text-[9px] font-mono text-[#78716C] font-bold block">SMALL TEXT</span>
                <span className="text-xs font-bold font-mono text-emerald-700">
                  {evaluation.bodyAA ? 'Pass (AA)' : 'Fail'}
                </span>
              </div>

              <div className="p-2.5 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] space-y-0.5">
                <span className="text-[9px] font-mono text-[#78716C] font-bold block">HEADERS</span>
                <span className="text-xs font-bold font-mono text-emerald-700">
                  {evaluation.headingAA ? 'Pass (AA)' : 'Fail'}
                </span>
              </div>

              <div className="p-2.5 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] space-y-0.5">
                <span className="text-[9px] font-mono text-[#78716C] font-bold block">UI GRAPHICS</span>
                <span className="text-xs font-bold font-mono text-emerald-700">
                  {evaluation.uiComponents ? 'Pass (AA)' : 'Fail'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Reading Sample */}
        <div className="lg:col-span-7 space-y-6">
          <div className="minimal-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E5DF]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0D0C0B]">
                Live Editorial Sample
              </span>

              <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-xl border border-[#E8E5DF]">
                {[
                  { label: '14px', size: 14 },
                  { label: '16px', size: 16 },
                  { label: '20px', size: 20 },
                  { label: '28px', size: 28 },
                ].map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setPreviewFontSize(s.size)}
                    className={`px-2 py-0.5 text-xs font-mono font-bold rounded-lg transition-all ${
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

            <div
              className="p-8 rounded-2xl border shadow-subtle space-y-5 transition-colors"
              style={{
                backgroundColor: bgColor,
                color: fgColor,
                borderColor: 'rgba(0,0,0,0.1)',
              }}
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-70 block">
                READABILITY AUDIT • {ratio}:1 RATIO
              </span>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Design that commands instant attention.
              </h3>

              <p
                className="leading-relaxed opacity-90 max-w-lg font-medium"
                style={{ fontSize: `${previewFontSize}px` }}
              >
                When foreground typography is calibrated for maximum luminance separation from its canvas, cognitive load drops significantly and reader comprehension surges.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition-transform hover:scale-105"
                  style={{ backgroundColor: fgColor, color: bgColor }}
                >
                  Primary Action
                </button>
                <button
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border transition-transform hover:scale-105"
                  style={{ borderColor: fgColor, color: fgColor }}
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

export default ContrastCheckerApp;
