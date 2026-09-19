import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../../context/ToastContext';
import { useSharedDesign } from '../../context/SharedDesignContext';

// Master Curated Designer Luxury Palettes (12 Prestigious Color Triads)
const LUXURY_PALETTES = [
  // 0: Royal Sunset Silk (Indigo / Magenta Rose / Neon Tangerine)
  ['#6366F1', '#EC4899', '#F97316'],
  // 1: Tokyo Cyber Neon (Vivid Violet / Radiant Ruby / Warm Amber)
  ['#7C3AED', '#F43F5E', '#FBBF24'],
  // 2: Cyber Orchid Glow (Electric Iris / Vivid Orchid / Bright Coral)
  ['#8B5CF6', '#D946EF', '#FB7185'],
  // 3: Nordic Lagoon (Deep Teal / Ocean Cyan / Electric Azure)
  ['#0D9488', '#06B6D4', '#3B82F6'],
  // 4: Emerald Velvet Radiance (Emerald Jade / Bright Mint / Sky Blue)
  ['#059669', '#10B981', '#38BDF8'],
  // 5: Sunset Amber Flame (Ruby Rose / Vivid Tangerine / Solar Gold)
  ['#E11D48', '#F97316', '#FBBF24'],
  // 6: Imperial Amethyst (Royal Amethyst / Fuchsia Bloom / Sky Crystal)
  ['#9333EA', '#E879F9', '#38BDF8'],
  // 7: Cobalt Mint Horizon (Sapphire Blue / Ocean Cerulean / Mint Turquoise)
  ['#1D4ED8', '#0EA5E9', '#10B981'],
  // 8: Midnight Velvet Neon (Midnight Indigo / Electric Violet / Hot Fuchsia)
  ['#4F46E5', '#A855F7', '#F43F5E'],
  // 9: Flamingo Amber Sun (Crimson Pink / Bright Peach / Amber Glow)
  ['#E11D48', '#FB7185', '#F59E0B'],
  // 10: Boreal Jade Gold (Ocean Cyan / Emerald / Sunlight Gold)
  ['#0284C7', '#10B981', '#FACC15'],
  // 11: Lavender Rose Silk (Deep Violet / Lavender Glow / Bubblegum Rose)
  ['#6D28D9', '#A78BFA', '#F472B6'],
];

const getLuxuryPaletteForAngle = (deg) => {
  const normalized = ((deg % 360) + 360) % 360;
  const index = Math.floor((normalized / 360) * LUXURY_PALETTES.length) % LUXURY_PALETTES.length;
  return LUXURY_PALETTES[index];
};

const DEFAULT_PALETTE_HEXES = LUXURY_PALETTES[0];

const LOOKS_LETTERS = ['L', 'o', 'o', 'k', 's'];
const GOOD_LETTERS = ['G', 'o', 'o', 'd', '.'];

const INITIAL_COLORS_LOOKS = ['#6366F1', '#EC4899', '#F97316', '#06B6D4', '#10B981'];
const INITIAL_COLORS_GOOD = ['#8B5CF6', '#F43F5E', '#FBBF24', '#0D9488', '#38BDF8'];

const VIBRANT_HUES = [
  '#6366F1', '#EC4899', '#F97316', '#7C3AED', '#F43F5E', '#FBBF24',
  '#0D9488', '#06B6D4', '#3B82F6', '#10B981', '#D946EF', '#8B5CF6'
];

const FONTS_LIST = [
  { id: 'inter', name: 'Inter', family: '"Inter", sans-serif' },
  { id: 'poppins', name: 'Poppins', family: '"Poppins", sans-serif' },
  { id: 'space', name: 'Space Grotesk', family: '"Space Grotesk", sans-serif' },
  { id: 'manrope', name: 'Manrope', family: '"Manrope", sans-serif' },
  { id: 'dmsans', name: 'DM Sans', family: '"DM Sans", sans-serif' },
  { id: 'jakarta', name: 'Plus Jakarta Sans', family: '"Plus Jakarta Sans", sans-serif' },
  { id: 'playfair', name: 'Playfair Display', family: '"Playfair Display", serif' },
  { id: 'syne', name: 'Syne', family: '"Syne", sans-serif' },
];

export function HomeHeroCanvas() {
  const { showToast } = useToast();
  const { sendPaletteToColorStudio } = useSharedDesign();

  // 1. "Looks" Letter Liquid Fill & Drain State
  const [looksFillState, setLooksFillState] = useState({
    0: { fillPercent: 100, color: INITIAL_COLORS_LOOKS[0] },
    1: { fillPercent: 100, color: INITIAL_COLORS_LOOKS[1] },
    2: { fillPercent: 100, color: INITIAL_COLORS_LOOKS[2] },
    3: { fillPercent: 100, color: INITIAL_COLORS_LOOKS[3] },
    4: { fillPercent: 100, color: INITIAL_COLORS_LOOKS[4] },
  });
  const looksTimeoutRefs = useRef({});

  // 2. "Good." Letter Liquid Fill & Drain State
  const [goodFillState, setGoodFillState] = useState({
    0: { fillPercent: 100, color: INITIAL_COLORS_GOOD[0] },
    1: { fillPercent: 100, color: INITIAL_COLORS_GOOD[1] },
    2: { fillPercent: 100, color: INITIAL_COLORS_GOOD[2] },
    3: { fillPercent: 100, color: INITIAL_COLORS_GOOD[3] },
    4: { fillPercent: 100, color: INITIAL_COLORS_GOOD[4] },
  });
  const goodTimeoutRefs = useRef({});

  // 3. Color Wheel State & Coordinates (Harmonic 3-Color Triad)
  const wheelRef = useRef(null);
  const [selectorAngle, setSelectorAngle] = useState(270); // In degrees
  const [isHoveringWheel, setIsHoveringWheel] = useState(false);
  const [activePalette, setActivePalette] = useState(DEFAULT_PALETTE_HEXES);
  const [isWheelClicked, setIsWheelClicked] = useState(false);

  // 4. Capsule Liquid Fills State ([percent0, percent1, percent2]) - Always 100% on start
  const [capsuleFills, setCapsuleFills] = useState([100, 100, 100]);

  // 5. Typography State
  const [activeFontIndex, setActiveFontIndex] = useState(0);
  const [activeFont, setActiveFont] = useState(FONTS_LIST[0]);
  const [isTypeClicked, setIsTypeClicked] = useState(false);
  const [isAaFilled, setIsAaFilled] = useState(true);
  const [copiedHex, setCopiedHex] = useState(null);
  const fontCycleIntervalRef = useRef(null);

  // 6. Sequence Step Tracker (0 to 6)
  const [stepPhase, setStepPhase] = useState(6);

  // Run the exact user-specified progressive flow
  const runSequence = () => {
    setStepPhase(0);
    setSelectorAngle(45);
    setActivePalette(DEFAULT_PALETTE_HEXES);
    setCapsuleFills([0, 0, 0]);
    setIsAaFilled(false);
    setActiveFont(FONTS_LIST[0]);
    setActiveFontIndex(0);

    // Initial liquid color drain on "Looks Good." after 800ms
    const liquidDrainTimer = setTimeout(() => {
      setLooksFillState({
        0: { fillPercent: 0, color: INITIAL_COLORS_LOOKS[0] },
        1: { fillPercent: 0, color: INITIAL_COLORS_LOOKS[1] },
        2: { fillPercent: 0, color: INITIAL_COLORS_LOOKS[2] },
        3: { fillPercent: 0, color: INITIAL_COLORS_LOOKS[3] },
        4: { fillPercent: 0, color: INITIAL_COLORS_LOOKS[4] },
      });
      setGoodFillState({
        0: { fillPercent: 0, color: INITIAL_COLORS_GOOD[0] },
        1: { fillPercent: 0, color: INITIAL_COLORS_GOOD[1] },
        2: { fillPercent: 0, color: INITIAL_COLORS_GOOD[2] },
        3: { fillPercent: 0, color: INITIAL_COLORS_GOOD[3] },
        4: { fillPercent: 0, color: INITIAL_COLORS_GOOD[4] },
      });
    }, 800);

    // Relaxed, smooth font cycling on Typography Aa right from start until color arrives (650ms per font)
    let cycleCount = 0;
    if (fontCycleIntervalRef.current) {
      clearInterval(fontCycleIntervalRef.current);
    }
    fontCycleIntervalRef.current = setInterval(() => {
      cycleCount++;
      const nextFont = FONTS_LIST[cycleCount % FONTS_LIST.length];
      setActiveFont(nextFont);
      setActiveFontIndex(cycleCount % FONTS_LIST.length);
    }, 650);

    // =========================================================================
    // PROFESSIONAL CAPSULE FLOW TIMELINE:
    // -------------------------------------------------------------------------
    // Phase 0 (0ms):
    //   - All 3 components (Wheel, Plate with Empty Capsules, Typography Aa cycling fonts) visible immediately on load!
    //
    // Phase 1 (300ms):
    //   - Wheel auto-spins smoothly (45° -> 270°) dynamically selecting 3 luxury colors
    //
    // Phase 2 (1400ms):
    //   - Line 1 draws from Wheel to Plate (900ms)
    //   - 3 Liquid color droplets stream along Line 1 into the Plate
    //
    // Phase 3 (2300ms):
    //   - Line 1 hits the Plate!
    //   - 3 3D Glass Capsules fill up sequentially with liquid color (0% -> 100%) like real glass capsules
    //
    // Phase 4 (3400ms):
    //   - Capsules are full! Line 2 draws forward from Plate to Aa (1000ms)
    //   - 3 Glowing color droplets stream along Line 2 towards Aa
    //
    // Phase 5 (4500ms):
    //   - Colors reach Aa and dissolve into Aa
    //   - Font shuffle stops and settles on Inter
    //   - Aa absorbs the liquid colors and blooms with the 3-color luxury gradient!
    //
    // Phase 6 (5400ms):
    //   - Settled into live interactive mode
    // =========================================================================

    // Phase 1: Wheel spin
    let animFrameId;
    const t1 = setTimeout(() => {
      setStepPhase(1);
      const startAngle = 45;
      const targetAngle = 270;
      const startTime = Date.now();
      const spinDuration = 1000;

      const spinStep = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / spinDuration);
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentAngle = startAngle + (targetAngle - startAngle) * ease;
        setSelectorAngle(currentAngle);

        const newPal = getLuxuryPaletteForAngle(currentAngle);
        setActivePalette(newPal);

        if (progress < 1) {
          animFrameId = requestAnimationFrame(spinStep);
        }
      };
      animFrameId = requestAnimationFrame(spinStep);
    }, 300);

    // Phase 2: Line 1 draws from Wheel to Plate
    const t2 = setTimeout(() => setStepPhase(2), 1400);

    // Phase 3: Line 1 arrives at Plate -> 3 Capsules fill sequentially with liquid color!
    let fillTimer1, fillTimer2;
    const t3 = setTimeout(() => {
      setStepPhase(3);
      setCapsuleFills([100, 0, 0]);
      fillTimer1 = setTimeout(() => {
        setCapsuleFills([100, 100, 0]);
      }, 220);
      fillTimer2 = setTimeout(() => {
        setCapsuleFills([100, 100, 100]);
      }, 440);
    }, 2300);

    // Phase 4: Line 2 draws forward from Plate to Aa carrying 3 colors
    const t4 = setTimeout(() => setStepPhase(4), 3400);

    // Phase 5: Colors reach Aa -> Stop font cycling, lock on Inter, fill Aa with 3-color luxury gradient!
    const t5 = setTimeout(() => {
      setStepPhase(5);
      if (fontCycleIntervalRef.current) {
        clearInterval(fontCycleIntervalRef.current);
        fontCycleIntervalRef.current = null;
      }
      setActiveFont(FONTS_LIST[0]); // Settle on Inter
      setActiveFontIndex(0);
      setIsAaFilled(true);
    }, 4500);

    // Phase 6: Settled in interactive mode
    const t6 = setTimeout(() => setStepPhase(6), 5400);

    return () => {
      clearTimeout(liquidDrainTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      if (fillTimer1) clearTimeout(fillTimer1);
      if (fillTimer2) clearTimeout(fillTimer2);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (fontCycleIntervalRef.current) clearInterval(fontCycleIntervalRef.current);
    };
  };

  useEffect(() => {
    const cleanup = runSequence();
    return () => {
      if (cleanup) cleanup();
      if (fontCycleIntervalRef.current) clearInterval(fontCycleIntervalRef.current);
      Object.values(looksTimeoutRefs.current).forEach((t) => clearTimeout(t));
      Object.values(goodTimeoutRefs.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  // Handle Letter Hover on "Looks" (Fill with vibrant liquid color)
  const handleLooksHover = (index) => {
    if (looksTimeoutRefs.current[index]) {
      clearTimeout(looksTimeoutRefs.current[index]);
    }
    const randomColor = VIBRANT_HUES[Math.floor(Math.random() * VIBRANT_HUES.length)];
    setLooksFillState((prev) => ({
      ...prev,
      [index]: { fillPercent: 100, color: randomColor },
    }));
  };

  // Handle Letter Leave on "Looks" (Slowly drain back to glass transparency)
  const handleLooksLeave = (index) => {
    looksTimeoutRefs.current[index] = setTimeout(() => {
      setLooksFillState((prev) => ({
        ...prev,
        [index]: { ...prev[index], fillPercent: 0 },
      }));
    }, 900);
  };

  // Handle Letter Hover on "Good." (Fill with vibrant liquid color)
  const handleGoodHover = (index) => {
    if (goodTimeoutRefs.current[index]) {
      clearTimeout(goodTimeoutRefs.current[index]);
    }
    const randomColor = VIBRANT_HUES[Math.floor(Math.random() * VIBRANT_HUES.length)];
    setGoodFillState((prev) => ({
      ...prev,
      [index]: { fillPercent: 100, color: randomColor },
    }));
  };

  // Handle Letter Leave on "Good." (Slowly drain back to glass transparency)
  const handleGoodLeave = (index) => {
    goodTimeoutRefs.current[index] = setTimeout(() => {
      setGoodFillState((prev) => ({
        ...prev,
        [index]: { ...prev[index], fillPercent: 0 },
      }));
    }, 900);
  };

  // Handle Mouse Hover on Color Wheel (Map to Master Curated Designer Palettes)
  const handleWheelMouseMove = (e) => {
    if (!wheelRef.current) return;
    setIsHoveringWheel(true);
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    let rad = Math.atan2(dy, dx);
    let deg = (rad * 180) / Math.PI;
    if (deg < 0) deg += 360;

    setSelectorAngle(deg);

    // Map angle to rich luxury designer palette
    const newPal = getLuxuryPaletteForAngle(deg);
    setActivePalette(newPal);
    if (stepPhase >= 3 || isAaFilled) {
      setCapsuleFills([100, 100, 100]);
    }
  };

  // Touch move for mobile wheel rotation
  const handleWheelTouchMove = (e) => {
    if (!wheelRef.current || !e.touches || !e.touches[0]) return;
    setIsHoveringWheel(true);
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const touch = e.touches[0];
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;

    let rad = Math.atan2(dy, dx);
    let deg = (rad * 180) / Math.PI;
    if (deg < 0) deg += 360;

    setSelectorAngle(deg);

    const newPal = getLuxuryPaletteForAngle(deg);
    setActivePalette(newPal);
    if (stepPhase >= 3 || isAaFilled) {
      setCapsuleFills([100, 100, 100]);
    }
  };

  const handleWheelMouseLeave = () => {
    setIsHoveringWheel(false);
  };

  // Wheel Click: Pulse and Lock In Color Scheme without annoying notification popup
  const handleWheelClick = (e) => {
    e.stopPropagation();
    setIsWheelClicked(true);
    setTimeout(() => setIsWheelClicked(false), 600);

    const newAngle = (selectorAngle + 45 + Math.floor(Math.random() * 90)) % 360;
    setSelectorAngle(newAngle);

    const newPal = getLuxuryPaletteForAngle(newAngle);
    setActivePalette(newPal);
    setCapsuleFills([100, 100, 100]);
    sendPaletteToColorStudio({
      primary: newPal[0],
      secondary: newPal[1],
      accent: newPal[2],
      background: '#FAF9F6',
      text: '#0D0C0B',
    });
    // Toast notification removed on wheel click as requested!
  };

  // Fast dynamic font cycling when hovering over "Aa" (rapid 75ms shuffle for 12 steps)
  const handleTypeHover = () => {
    if (fontCycleIntervalRef.current) return;
    let count = 0;
    const totalSteps = 12;
    fontCycleIntervalRef.current = setInterval(() => {
      count++;
      setActiveFontIndex((prev) => {
        const nextIdx = (prev + 1) % FONTS_LIST.length;
        setActiveFont(FONTS_LIST[nextIdx]);
        return nextIdx;
      });
      if (count >= totalSteps) {
        clearInterval(fontCycleIntervalRef.current);
        fontCycleIntervalRef.current = null;
      }
    }, 75);
  };

  // Typography Aa Click: Cycle Font without redirecting
  const handleTypeClick = (e) => {
    e.stopPropagation();
    if (fontCycleIntervalRef.current) {
      clearInterval(fontCycleIntervalRef.current);
      fontCycleIntervalRef.current = null;
    }
    setIsTypeClicked(true);
    setTimeout(() => setIsTypeClicked(false), 300);

    setActiveFontIndex((prev) => {
      const nextIdx = (prev + 1) % FONTS_LIST.length;
      setActiveFont(FONTS_LIST[nextIdx]);
      return nextIdx;
    });
  };

  // Copy Swatch HEX without redirecting
  const handleCopySwatch = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${hex} to clipboard!`, 'success');
    setTimeout(() => setCopiedHex(null), 1800);
  };

  // 3 Harmonic Points Coordinates on Circle (viewBox 0 0 300 300, center 150, 150, radius 84)
  const radius = 84;
  // Point 1 (Primary)
  const selectorRad = (selectorAngle * Math.PI) / 180;
  const dot1X = 150 + radius * Math.cos(selectorRad);
  const dot1Y = 150 + radius * Math.sin(selectorRad);

  // Point 2 (Harmonic Accent 1: +35°)
  const rad2 = ((selectorAngle + 35) * Math.PI) / 180;
  const dot2X = 150 + radius * Math.cos(rad2);
  const dot2Y = 150 + radius * Math.sin(rad2);

  // Point 3 (Harmonic Accent 2: +75°)
  const rad3 = ((selectorAngle + 75) * Math.PI) / 180;
  const dot3X = 150 + radius * Math.cos(rad3);
  const dot3Y = 150 + radius * Math.sin(rad3);

  return (
    <section className="relative w-full pt-8 sm:pt-16 md:pt-24 pb-10 sm:pb-20 select-none overflow-hidden">
      {/* Top Right Framed Monospace Badge */}
      <div className="absolute top-6 sm:top-14 right-4 sm:right-12 z-10 hidden md:block text-right">
        <div className="inline-block p-3 sm:p-3.5 rounded-2xl border border-stone-300/80 bg-white/70 backdrop-blur-md shadow-sm font-mono text-[9px] font-black text-stone-600 tracking-[0.24em] leading-relaxed uppercase hover:border-purple-300 transition-colors">
          S I M P L E<br />
          T O O L S .<br />
          B I G G E R<br />
          I D E A S .
        </div>
      </div>

      {/* Main Container - Responsive Bounds */}
      <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-6 lg:px-14 xl:px-20 space-y-6 sm:space-y-10">
        {/* =================================================================== */}
        {/* 1. HERO TITLE & TAGLINE                                             */}
        {/* =================================================================== */}
        <div className="text-center space-y-2 sm:space-y-4">
          {/* Interactive Title: Looks Good. (Letter-by-Letter Liquid Fill & Glass Drain) */}
          <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-[#0D0C0B] flex items-baseline justify-center space-x-2 xs:space-x-3 sm:space-x-6 leading-none">
            {/* Word 1: "Looks" */}
            <span className="inline-flex items-baseline cursor-pointer group" title="Hover over any letter in 'Looks' to fill with liquid color!">
              {LOOKS_LETTERS.map((char, idx) => {
                const state = looksFillState[idx] || { fillPercent: 0, color: INITIAL_COLORS_LOOKS[idx] };
                return (
                  <span
                    key={idx}
                    onMouseEnter={() => handleLooksHover(idx)}
                    onMouseMove={() => handleLooksHover(idx)}
                    onMouseLeave={() => handleLooksLeave(idx)}
                    onClick={() => handleLooksHover(idx)}
                    onTouchStart={() => handleLooksHover(idx)}
                    onTouchMove={() => handleLooksHover(idx)}
                    className="relative inline-block transition-transform duration-200 hover:-translate-y-1 sm:hover:-translate-y-1.5 select-none font-display font-black cursor-pointer"
                  >
                    {/* Base Empty Glass Outline Layer */}
                    <span
                      className="inline-block text-transparent pointer-events-none"
                      style={{
                        WebkitTextStroke: '2px #0D0C0B',
                        textShadow: '0 2px 10px rgba(0,0,0,0.04)',
                      }}
                    >
                      {char}
                    </span>

                    {/* Liquid Color Fill Layer */}
                    <span
                      className="absolute inset-0 inline-block pointer-events-none transition-all duration-700 ease-out"
                      style={{
                        color: state.color,
                        clipPath: `inset(${100 - state.fillPercent}% 0 0 0)`,
                        filter: state.fillPercent > 10 ? `drop-shadow(0 0 25px ${state.color}90)` : 'none',
                      }}
                    >
                      {char}
                    </span>
                  </span>
                );
              })}
            </span>

            {/* Word 2: "Good." */}
            <span className="inline-flex items-baseline cursor-pointer group" title="Hover over any letter in 'Good.' to fill with liquid color!">
              {GOOD_LETTERS.map((char, idx) => {
                const state = goodFillState[idx] || { fillPercent: 0, color: INITIAL_COLORS_GOOD[idx] };
                return (
                  <span
                    key={idx}
                    onMouseEnter={() => handleGoodHover(idx)}
                    onMouseMove={() => handleGoodHover(idx)}
                    onMouseLeave={() => handleGoodLeave(idx)}
                    onClick={() => handleGoodHover(idx)}
                    onTouchStart={() => handleGoodHover(idx)}
                    onTouchMove={() => handleGoodHover(idx)}
                    className="relative inline-block transition-transform duration-200 hover:-translate-y-1 sm:hover:-translate-y-1.5 select-none font-display font-black cursor-pointer"
                  >
                    {/* Base Empty Glass Outline Layer */}
                    <span
                      className="inline-block text-transparent pointer-events-none"
                      style={{
                        WebkitTextStroke: '2px #0D0C0B',
                        textShadow: '0 2px 10px rgba(0,0,0,0.04)',
                      }}
                    >
                      {char}
                    </span>

                    {/* Liquid Color Fill Layer */}
                    <span
                      className="absolute inset-0 inline-block pointer-events-none transition-all duration-700 ease-out"
                      style={{
                        color: state.color,
                        clipPath: `inset(${100 - state.fillPercent}% 0 0 0)`,
                        filter: state.fillPercent > 10 ? `drop-shadow(0 0 25px ${state.color}90)` : 'none',
                      }}
                    >
                      {char}
                    </span>
                  </span>
                );
              })}
            </span>
          </h1>

          <p className="text-xs xs:text-sm sm:text-lg md:text-xl text-stone-600 font-medium font-sans max-w-2xl mx-auto leading-relaxed px-2">
            Design smarter with beautiful colors and typography.
          </p>

          {/* Interactive Hint Subtitle */}
          <div className="flex items-center justify-center space-x-2 text-[10px] xs:text-[11px] sm:text-xs font-mono text-stone-400 h-4 sm:h-5">
            <span>Hover across any letter in &ldquo;Looks Good.&rdquo; to fill with vibrant liquid colors</span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. THREE-PILLAR FUNCTIONAL DEMONSTRATION ENGINE                     */}
        {/* All 3 Pillars (Wheel ➔ Capsules Plate ➔ Typography) Stay Horizontal  */}
        {/* Perfectly Scaled & Responsive Across Mobile, Tablet and Desktop     */}
        {/* =================================================================== */}
        <div className="relative pt-6 sm:pt-10 pb-4 sm:pb-8">
          {/* Background Progressive SVG Flow Ribbons */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
            <svg
              className="w-full h-36 sm:h-52 md:h-64 max-w-[1600px]"
              viewBox="0 0 1600 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* 3-Color Luxury Designer Line Gradient (Primary ➔ Secondary ➔ Accent) */}
                <linearGradient id="luxuryLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={activePalette[0]} />
                  <stop offset="50%" stopColor={activePalette[1]} />
                  <stop offset="100%" stopColor={activePalette[2]} />
                </linearGradient>

                {/* Subtle secondary harmonic gradient */}
                <linearGradient id="sleekHarmonicGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={activePalette[0]} stopOpacity="0.5" />
                  <stop offset="50%" stopColor={activePalette[1]} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={activePalette[2]} stopOpacity="0.5" />
                </linearGradient>
              </defs>

              {/* ------------------------------------------------------------- */}
              {/* STAGE 1: Line 1 (Wheel ➔ Plate) + 3 Luxury Colors Flow         */}
              {/* Activates when stepPhase >= 2                                 */}
              {/* ------------------------------------------------------------- */}
              {stepPhase >= 2 && (
                <g>
                  {/* Primary Sleek Line 1 (Wheel to Plate) */}
                  <path
                    d="M 240 110 C 440 20, 600 200, 800 110"
                    stroke="url(#luxuryLineGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="animate-draw-stage-1"
                  />

                  {/* Secondary Harmonic Wave Line 1 */}
                  <path
                    d="M 210 125 C 410 205, 590 15, 800 110"
                    stroke="url(#sleekHarmonicGradient)"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    opacity="0.4"
                    className="animate-draw-stage-1"
                  />

                  {/* 3 Luxury Colors streaming forward through Line 1 into the Plate */}
                  {stepPhase >= 2 && stepPhase <= 3 && (
                    <g key="line1-luxury-flow">
                      {activePalette.map((hex, idx) => (
                        <g key={idx}>
                          <animateMotion
                            path="M 240 110 C 440 20, 600 200, 800 110"
                            dur="0.95s"
                            begin={`${idx * 0.16}s`}
                            rotate="auto"
                            fill="freeze"
                            repeatCount="1"
                          />
                          <g>
                            <animate
                              attributeName="opacity"
                              values="0; 1; 1; 0.95; 0"
                              keyTimes="0; 0.15; 0.75; 0.9; 1"
                              dur="0.95s"
                              begin={`${idx * 0.16}s`}
                              fill="freeze"
                              repeatCount="1"
                            />
                            <circle cx="0" cy="0" r="7" fill={hex} stroke="#FFFFFF" strokeWidth="2.5" style={{ filter: `drop-shadow(0 0 10px ${hex})` }} />
                            <text x="0" y="-12" textAnchor="middle" fill="#FFFFFF" stroke="#0D0C0B" strokeWidth="2.5" fontSize="11" fontWeight="900" fontFamily="monospace">{hex}</text>
                            <text x="0" y="-12" textAnchor="middle" fill={hex} fontSize="11" fontWeight="900" fontFamily="monospace">{hex}</text>
                          </g>
                        </g>
                      ))}
                    </g>
                  )}
                </g>
              )}

              {/* ------------------------------------------------------------- */}
              {/* STAGE 2: Line 2 (Plate ➔ Aa) + 3 #HEX Code Texts Flow          */}
              {/* Activates when stepPhase >= 4                                 */}
              {/* ------------------------------------------------------------- */}
              {stepPhase >= 4 && (
                <g>
                  {/* Primary Sleek Line 2 (Plate to Aa) */}
                  <path
                    d="M 800 110 C 1000 20, 1160 200, 1360 110"
                    stroke="url(#luxuryLineGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="animate-draw-stage-2"
                  />

                  {/* Secondary Harmonic Wave Line 2 */}
                  <path
                    d="M 800 110 C 1010 205, 1200 15, 1380 95"
                    stroke="url(#sleekHarmonicGradient)"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    opacity="0.4"
                    className="animate-draw-stage-2"
                  />

                  {/* 3 Luxury #HEX Codes streaming forward through Line 2 and fading out upon arrival */}
                  {stepPhase >= 4 && stepPhase <= 5 && (
                    <g key="line2-luxury-flow">
                      {activePalette.map((hex, idx) => (
                        <g key={idx}>
                          <animateMotion
                            path="M 800 110 C 1000 20, 1160 200, 1360 110"
                            dur="1.1s"
                            begin={`${idx * 0.18}s`}
                            rotate="auto"
                            fill="remove"
                            repeatCount="1"
                          />
                          <g>
                            <animate
                              attributeName="opacity"
                              values="0; 1; 1; 0.8; 0"
                              keyTimes="0; 0.15; 0.7; 0.85; 1"
                              dur="1.1s"
                              begin={`${idx * 0.18}s`}
                              fill="remove"
                              repeatCount="1"
                            />
                            {/* Background halo for contrast */}
                            <text
                              x="0"
                              y="5"
                              textAnchor="middle"
                              fill="#FFFFFF"
                              stroke="#FFFFFF"
                              strokeWidth="4"
                              fontSize="14"
                              fontWeight="900"
                              fontFamily="monospace"
                            >
                              {hex}
                            </text>
                            {/* Glowing #HEX Text */}
                            <text
                              x="0"
                              y="5"
                              textAnchor="middle"
                              fill={hex}
                              fontSize="14"
                              fontWeight="900"
                              fontFamily="monospace"
                            >
                              {hex}
                            </text>
                          </g>
                        </g>
                      ))}
                    </g>
                  )}
                </g>
              )}

              {/* Connection Node Sockets */}
              <circle
                cx="240"
                cy="110"
                r="4.5"
                fill={activePalette[0]}
                stroke="#FFFFFF"
                strokeWidth="2"
                className="transition-all duration-300"
              />
              <circle
                cx="800"
                cy="110"
                r="4.5"
                fill={activePalette[1]}
                stroke="#FFFFFF"
                strokeWidth="2"
                className="transition-all duration-300"
              />
              <circle
                cx="1360"
                cy="110"
                r="4.5"
                fill={activePalette[2]}
                stroke="#FFFFFF"
                strokeWidth="2"
                className="transition-all duration-300"
              />
            </svg>
          </div>

          {/* Three Connected Pillars Horizontal Row (Preserved on all screens) */}
          <div className="relative z-10 grid grid-cols-3 gap-1 xs:gap-2 sm:gap-6 md:gap-8 lg:gap-14 xl:gap-20 items-center justify-between w-full">
            {/* ------------------------------------------------------------- */}
            {/* PILLAR 1: COLOR WHEEL (Left)                                  */}
            {/* ------------------------------------------------------------- */}
            <div className="flex flex-col items-center justify-center relative">
              {/* Handwritten Note Top: Colors Create Emotions */}
              <div className="absolute -top-7 xs:-top-9 sm:-top-14 -left-1 xs:left-0 sm:left-2 lg:left-6 flex items-center space-x-1 sm:space-x-2 pointer-events-none transform -rotate-6">
                <span className="font-handwriting text-[9px] xs:text-[11px] sm:text-2xl lg:text-3xl text-stone-700 font-bold tracking-tight whitespace-nowrap">
                  Colors Create Emotions
                </span>
                <svg
                  className="w-4 h-4 xs:w-5 xs:h-5 sm:w-9 sm:h-9 text-stone-600 transform rotate-12 -translate-y-0.5"
                  viewBox="0 0 40 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M 6 12 C 18 10, 26 20, 24 32 M 16 30 L 24 34 L 28 26" />
                </svg>
              </div>

              {/* Color Wheel Circular Visual */}
              <div
                ref={wheelRef}
                onMouseMove={handleWheelMouseMove}
                onTouchMove={handleWheelTouchMove}
                onTouchStart={handleWheelTouchMove}
                onMouseLeave={handleWheelMouseLeave}
                onClick={handleWheelClick}
                className={`relative w-20 h-20 xs:w-26 xs:h-26 sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-72 lg:h-72 xl:w-76 xl:h-76 rounded-full cursor-pointer transition-all duration-500 ease-out transform ${
                  isWheelClicked ? 'scale-105 ring-4 sm:ring-8 ring-purple-400/30' : ''
                }`}
                style={{
                  boxShadow: `0 0 40px ${activePalette[0]}30, 0 10px 30px -8px rgba(0,0,0,0.1)`,
                }}
                title="Rotate or tap to change harmonic colors"
              >
                {/* 360 Conic Gradient Color Wheel with Luxury Spectral Harmonies */}
                <div
                  className={`w-full h-full rounded-full border-2 sm:border-4 border-white shadow-md sm:shadow-xl transition-transform duration-1000 relative overflow-hidden ${
                    isHoveringWheel ? '' : 'animate-[spin_45s_linear_infinite]'
                  }`}
                  style={{
                    background:
                      'conic-gradient(from 0deg, #6366F1 0%, #8B5CF6 9%, #A855F7 18%, #EC4899 28%, #F43F5E 38%, #F97316 48%, #F59E0B 58%, #10B981 70%, #06B6D4 82%, #3B82F6 92%, #6366F1 100%)',
                  }}
                >
                  {/* Subtle 3D Glass Dial Lighting Overlay */}
                  <div className="absolute inset-0 rounded-full bg-radial from-white/35 via-transparent to-black/20 pointer-events-none" />
                </div>

                {/* Inner Ambient Center Hole (Frosted Glass Hub with Mini Swatch Dots) */}
                <div className="absolute inset-3.5 xs:inset-5 sm:inset-9 md:inset-10 lg:inset-12 rounded-full bg-white/90 backdrop-blur-md shadow-[inset_0_2px_6px_rgba(0,0,0,0.06),_0_4px_16px_rgba(0,0,0,0.06)] border border-white/90 flex flex-col items-center justify-center pointer-events-none">
                  <div className="flex items-center space-x-1 sm:space-x-1.5">
                    <div
                      className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-3.5 sm:h-3.5 rounded-full transition-colors duration-300 shadow-xs ring-1 sm:ring-2 ring-white"
                      style={{ backgroundColor: activePalette[0] }}
                    />
                    <div
                      className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-3.5 sm:h-3.5 rounded-full transition-colors duration-300 shadow-xs ring-1 sm:ring-2 ring-white"
                      style={{ backgroundColor: activePalette[1] }}
                    />
                    <div
                      className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-3.5 sm:h-3.5 rounded-full transition-colors duration-300 shadow-xs ring-1 sm:ring-2 ring-white"
                      style={{ backgroundColor: activePalette[2] }}
                    />
                  </div>
                  <span className="hidden sm:block mt-0.5 sm:mt-1 font-mono text-[7px] sm:text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                    3-Color Triad
                  </span>
                </div>

                {/* Animated 3-Color Triad Selector Points (viewBox 0 0 300 300) */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 300 300"
                >
                  {/* Triad Connecting Chord Lines across wheel */}
                  <polygon
                    points={`${dot1X},${dot1Y} ${dot2X},${dot2Y} ${dot3X},${dot3Y}`}
                    fill="rgba(255,255,255,0.15)"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="1.75"
                    strokeDasharray="4 4"
                    style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))' }}
                  />

                  {/* Dot 1: Primary Hue */}
                  <circle
                    cx={dot1X}
                    cy={dot1Y}
                    r="9.5"
                    fill="white"
                    stroke={activePalette[0]}
                    strokeWidth="3.5"
                    className="transition-all duration-150 drop-shadow-md"
                  />
                  <circle
                    cx={dot1X}
                    cy={dot1Y}
                    r="4"
                    fill={activePalette[0]}
                    className="transition-colors duration-150"
                  />

                  {/* Dot 2: Harmonic Accent 1 */}
                  <circle
                    cx={dot2X}
                    cy={dot2Y}
                    r="9.5"
                    fill="white"
                    stroke={activePalette[1]}
                    strokeWidth="3.5"
                    className="transition-all duration-150 drop-shadow-md"
                  />
                  <circle
                    cx={dot2X}
                    cy={dot2Y}
                    r="4"
                    fill={activePalette[1]}
                    className="transition-colors duration-150"
                  />

                  {/* Dot 3: Harmonic Accent 2 */}
                  <circle
                    cx={dot3X}
                    cy={dot3Y}
                    r="9.5"
                    fill="white"
                    stroke={activePalette[2]}
                    strokeWidth="3.5"
                    className="transition-all duration-150 drop-shadow-md"
                  />
                  <circle
                    cx={dot3X}
                    cy={dot3Y}
                    r="4"
                    fill={activePalette[2]}
                    className="transition-colors duration-150"
                  />
                </svg>

                {/* Floating Aesthetic Decorative Spheres */}
                <span
                  className="absolute -top-1 right-2 sm:-top-2 sm:right-6 w-2.5 h-2.5 sm:w-5 sm:h-5 rounded-full shadow-md animate-bounce ring-1 sm:ring-2 ring-white"
                  style={{ backgroundColor: activePalette[1] }}
                />
                <span
                  className="absolute bottom-1 -left-1 sm:bottom-2 sm:-left-2 w-2.5 h-2.5 sm:w-5 sm:h-5 rounded-full shadow-md animate-pulse ring-1 sm:ring-2 ring-white"
                  style={{ backgroundColor: activePalette[0] }}
                />
                <span
                  className="absolute top-1/2 -right-1.5 sm:-right-3 w-2 h-2 sm:w-4 sm:h-4 rounded-full shadow-md ring-1 sm:ring-2 ring-white"
                  style={{ backgroundColor: activePalette[2] }}
                />
              </div>

              {/* Handwritten Label Bottom: Colors */}
              <div className="mt-1.5 sm:mt-4 font-handwriting text-sm xs:text-base sm:text-3xl lg:text-4xl text-stone-800 font-bold">
                Colors
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* PILLAR 2: 2D CLEAN MINIMALIST COLOR CAPSULES (Center Plate)   */}
            {/* Simple, Flat, Crisp 2D Capsule Pod                           */}
            {/* ------------------------------------------------------------- */}
            <div className="flex flex-col items-center justify-center relative">
              {/* 3-Color 2D Clean Capsule Card */}
              <div
                className="bg-white border border-stone-200 rounded-2xl sm:rounded-[28px] px-2 py-2 sm:px-5 sm:py-5 shadow-lg sm:shadow-xl transition-all duration-300 max-w-[130px] sm:max-w-[240px] md:max-w-[290px] lg:max-w-[340px] w-full"
                style={{
                  boxShadow: `0 10px 25px -6px ${activePalette[0]}20, 0 4px 12px rgba(0,0,0,0.04)`,
                }}
              >
                {/* Capsule Plate Header */}
                <div className="flex items-center justify-between mb-1.5 sm:mb-4 px-0.5">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: activePalette[0] }} />
                    <span className="text-[6.5px] sm:text-[9px] md:text-[11px] font-mono font-black text-stone-700 uppercase tracking-wider truncate">
                      Color Capsules
                    </span>
                  </div>
                  <span className="text-[5.5px] sm:text-[8px] md:text-[9px] font-mono font-bold px-1 py-0.2 sm:px-2 sm:py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                    {capsuleFills[2] >= 100 ? 'Active' : 'Standby'}
                  </span>
                </div>

                {/* 3 Clean 2D Capsule Pills Row */}
                <div className="flex items-center justify-center space-x-1.5 sm:space-x-3 md:space-x-4 lg:space-x-5">
                  {activePalette.map((hex, idx) => {
                    const isCopied = copiedHex === hex;
                    const roleTag = idx === 0 ? 'Primary' : idx === 1 ? 'Secondary' : 'Accent';
                    const pillCode = idx === 0 ? 'P-01' : idx === 1 ? 'S-02' : 'A-03';
                    const fillLevel = capsuleFills[idx] !== undefined ? capsuleFills[idx] : 100;

                    return (
                      <div
                        key={idx}
                        onClick={() => fillLevel > 0 && handleCopySwatch(hex)}
                        className="flex flex-col items-center cursor-pointer group select-none flex-shrink-0"
                        title={fillLevel > 0 ? `Click to copy ${roleTag} (${hex})` : 'Capsule is filling...'}
                      >
                        {/* Pill Identity Header Badge */}
                        <span className="mb-0.5 sm:mb-1.5 font-mono text-[5.5px] sm:text-[8px] md:text-[9px] font-bold text-stone-400 group-hover:text-stone-800 transition-colors">
                          {pillCode}
                        </span>

                        {/* 2D Flat Capsule Pill Tube */}
                        <div
                          className="w-7 sm:w-10 md:w-12 lg:w-14 h-16 sm:h-22 md:h-28 lg:h-32 rounded-full border border-stone-300 sm:border-2 bg-stone-100 relative overflow-hidden group-hover:scale-105 group-hover:-translate-y-0.5 sm:group-hover:-translate-y-1 transition-all duration-200 flex flex-col justify-end p-0 flex-shrink-0"
                          style={{
                            minWidth: '26px',
                            minHeight: '60px',
                            boxShadow: fillLevel > 0 
                              ? `0 6px 16px -4px ${hex}45` 
                              : 'none',
                          }}
                        >
                          {/* Minimalist 2D Center Seam Line (50% height) */}
                          <div className="absolute top-1/2 inset-x-0 -translate-y-1/2 h-[1px] sm:h-[1.5px] bg-stone-400/50 z-20 pointer-events-none" />

                          {/* 2D Flat Liquid Color Fill */}
                          <div
                            className="w-full transition-all ease-out"
                            style={{
                              height: `${fillLevel}%`,
                              minHeight: fillLevel > 0 ? `${fillLevel}%` : '0%',
                              backgroundColor: hex,
                              transitionDuration: '600ms',
                              transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
                              borderTopLeftRadius: fillLevel >= 95 ? '9999px' : '0px',
                              borderTopRightRadius: fillLevel >= 95 ? '9999px' : '0px',
                              borderBottomLeftRadius: '9999px',
                              borderBottomRightRadius: '9999px',
                            }}
                          />

                          {/* Copied Feedback Overlay */}
                          {isCopied && (
                            <div className="absolute inset-0 z-30 flex items-center justify-center bg-stone-900/90 rounded-full animate-swatch-pop">
                              <span className="text-[8px] sm:text-[10px] font-mono font-black text-white">✓</span>
                            </div>
                          )}
                        </div>

                        {/* HEX code label */}
                        <span 
                          className="mt-1 sm:mt-2 font-mono text-[5.5px] sm:text-[9px] md:text-[11px] lg:text-xs font-black tracking-tight sm:tracking-wider transition-colors duration-200 text-stone-900"
                        >
                          {hex}
                        </span>

                        {/* Role tag */}
                        <span className="hidden sm:block text-[7px] md:text-[8px] lg:text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                          {roleTag}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Handwritten Label Bottom: Palette */}
              <div className="mt-1.5 sm:mt-4 font-handwriting text-sm xs:text-base sm:text-3xl lg:text-4xl text-stone-800 font-bold">
                Palette
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* PILLAR 3: TYPOGRAPHY 'Aa' (Right)                             */}
            {/* Clean High-Contrast Typography Display                        */}
            {/* ------------------------------------------------------------- */}
            <div className="flex flex-col items-center justify-center relative">
              {/* Handwritten Note Top: Fonts Give Words a Voice */}
              <div className="absolute -top-7 xs:-top-9 sm:-top-14 -right-1 xs:right-0 sm:right-2 lg:right-6 flex items-center space-x-1 sm:space-x-2 pointer-events-none transform rotate-6">
                <svg
                  className="w-4 h-4 xs:w-5 xs:h-5 sm:w-9 sm:h-9 text-stone-600 transform -rotate-12 -translate-y-0.5"
                  viewBox="0 0 40 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M 34 12 C 22 10, 14 20, 16 32 M 24 30 L 16 34 L 12 26" />
                </svg>
                <span className="font-handwriting text-[9px] xs:text-[11px] sm:text-2xl lg:text-3xl text-stone-700 font-bold tracking-tight whitespace-nowrap">
                  Fonts Give Voice
                </span>
              </div>

              {/* Large Creative Typography Display 'Aa' */}
              <div
                onMouseEnter={handleTypeHover}
                onMouseMove={handleTypeHover}
                onTouchStart={handleTypeHover}
                onClick={handleTypeClick}
                className={`flex flex-col items-center justify-center cursor-pointer group transition-all duration-300 ease-out transform ${
                  isTypeClicked ? 'scale-110' : 'hover:scale-105'
                }`}
                title="Tap or hover to cycle fonts"
              >
                <div
                  className="text-4xl xs:text-5xl sm:text-8xl md:text-[130px] lg:text-[170px] xl:text-[195px] font-black tracking-tighter transition-all duration-300 leading-none select-none inline-block"
                  style={{
                    fontFamily: activeFont.family,
                    ...(isAaFilled
                      ? {
                          backgroundImage: `linear-gradient(135deg, ${activePalette[0]} 0%, ${activePalette[1]} 50%, ${activePalette[2]} 100%)`,
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          color: 'transparent',
                          display: 'inline-block',
                        }
                      : {
                          color: '#0D0C0B',
                        }),
                  }}
                >
                  Aa
                </div>

                {/* Dynamic Font Name Badge */}
                <div className="mt-1 sm:mt-2 flex items-center space-x-1 sm:space-x-1.5 px-1.5 py-0.5 xs:px-2 xs:py-0.5 sm:px-3 sm:py-1 rounded-full bg-white border border-stone-200 shadow-xs transition-all duration-300">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: activePalette[0] }} />
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: activePalette[1] }} />
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: activePalette[2] }} />
                  <span className="font-mono text-[6px] xs:text-[7.5px] sm:text-[9px] md:text-[11px] font-bold text-stone-800 truncate max-w-[50px] xs:max-w-[70px] sm:max-w-none">
                    {activeFont.name}
                  </span>
                </div>
              </div>

              {/* Handwritten Label Bottom: Typography */}
              <div className="mt-1.5 sm:mt-4 font-handwriting text-sm xs:text-base sm:text-3xl lg:text-4xl text-stone-800 font-bold">
                Typography
              </div>
            </div>
          </div>

          {/* Interactive Font Selector Pills Bar + Replay Trigger */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 pt-6 sm:pt-10 transition-all duration-700">
            <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-mono font-bold text-stone-400 uppercase tracking-wider mr-1 sm:mr-2">
              Preview Fonts:
            </span>
            {FONTS_LIST.map((font, idx) => {
              const isCurrent = activeFont.id === font.id;
              return (
                <button
                  key={font.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (fontCycleIntervalRef.current) {
                      clearInterval(fontCycleIntervalRef.current);
                      fontCycleIntervalRef.current = null;
                    }
                    setActiveFont(font);
                    setActiveFontIndex(idx);
                  }}
                  onMouseEnter={() => {
                    if (fontCycleIntervalRef.current) {
                      clearInterval(fontCycleIntervalRef.current);
                      fontCycleIntervalRef.current = null;
                    }
                    setActiveFont(font);
                    setActiveFontIndex(idx);
                  }}
                  className={`px-2.5 py-1 sm:px-4 sm:py-2 rounded-xl text-[10px] xs:text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isCurrent
                      ? 'bg-stone-900 text-white shadow-md scale-105'
                      : 'bg-white/90 hover:bg-white text-stone-600 hover:text-stone-950 border border-stone-200/90 shadow-2xs'
                  }`}
                  style={{ fontFamily: font.family }}
                >
                  {font.name}
                </button>
              );
            })}

            {/* Replay Sequence Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                runSequence();
              }}
              className="ml-1 sm:ml-2 inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-xl text-[10px] xs:text-xs font-mono font-bold text-stone-600 hover:text-stone-950 bg-stone-100/90 hover:bg-stone-200/90 border border-stone-200 shadow-2xs transition-all hover:scale-105 cursor-pointer"
              title="Replay sequence animation"
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>Replay Animation</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


