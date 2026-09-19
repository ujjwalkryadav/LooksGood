import React, { useState, useEffect, useRef } from 'react';

const VIBRANT_HUES = [
  '#7C3AED', // Electric Violet
  '#EC4899', // Hyper Pink
  '#2563EB', // Cobalt Blue
  '#06B6D4', // Cyan Neon
  '#10B981', // Emerald Mint
  '#F59E0B', // Amber Gold
  '#EF4444', // Crimson Red
  '#8B5CF6', // Purple Glow
  '#F97316', // Bright Orange
  '#14B8A6', // Teal
];

const FONTS_CYCLE = [
  { name: 'Syne', family: '"Syne", sans-serif' },
  { name: 'Playfair Display', family: '"Playfair Display", serif' },
  { name: 'Space Grotesk', family: '"Space Grotesk", sans-serif' },
  { name: 'Outfit', family: '"Outfit", sans-serif' },
  { name: 'Righteous', family: '"Righteous", sans-serif' },
  { name: 'Cinzel', family: '"Cinzel", serif' },
  { name: 'Caveat', family: '"Caveat", cursive' },
  { name: 'Plus Jakarta Sans', family: '"Plus Jakarta Sans", sans-serif' },
  { name: 'DM Serif Display', family: '"DM Serif Display", serif' },
];

export function InteractiveHeroTitle() {
  // Letters in "Looks"
  const letters = ['L', 'o', 'o', 'k', 's'];
  const [letterColors, setLetterColors] = useState({});
  const timeoutRefs = useRef({});

  // Font cycling on "Good"
  const [fontIndex, setFontIndex] = useState(0);
  const [isHoveringGood, setIsHoveringGood] = useState(false);
  const fontIntervalRef = useRef(null);

  // Handle hover on individual letter of "Looks"
  const handleLetterHover = (index) => {
    // Clear any pending fade timeout for this letter
    if (timeoutRefs.current[index]) {
      clearTimeout(timeoutRefs.current[index]);
    }

    // Pick random vibrant color different from previous
    const randomColor = VIBRANT_HUES[Math.floor(Math.random() * VIBRANT_HUES.length)];
    setLetterColors((prev) => ({
      ...prev,
      [index]: randomColor,
    }));
  };

  const handleLetterLeave = (index) => {
    // Smoothly fade back after delay
    timeoutRefs.current[index] = setTimeout(() => {
      setLetterColors((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }, 1200);
  };

  // Handle hover on "Good"
  const handleGoodMouseEnter = () => {
    setIsHoveringGood(true);
    if (fontIntervalRef.current) clearInterval(fontIntervalRef.current);
    fontIntervalRef.current = setInterval(() => {
      setFontIndex((prev) => (prev + 1) % FONTS_CYCLE.length);
    }, 110);
  };

  const handleGoodMouseLeave = () => {
    setIsHoveringGood(false);
    if (fontIntervalRef.current) clearInterval(fontIntervalRef.current);
    setFontIndex(0);
  };

  useEffect(() => {
    return () => {
      if (fontIntervalRef.current) clearInterval(fontIntervalRef.current);
      Object.values(timeoutRefs.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div className="space-y-3 select-none">
      {/* Interactive Main Title */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white flex flex-wrap items-baseline gap-x-3.5 sm:gap-x-5 leading-none">
        <span className="text-white/80 font-normal font-sans text-3xl sm:text-5xl md:text-6xl mr-1">
          Know what
        </span>

        {/* Word 1: "Looks" (Interactive Letter-by-Letter Color Filling) */}
        <span
          className="inline-flex cursor-pointer transition-transform duration-200 hover:scale-105"
          title="Hover across each letter to paint with vibrant colors"
        >
          {letters.map((char, idx) => {
            const activeColor = letterColors[idx];
            return (
              <span
                key={idx}
                onMouseEnter={() => handleLetterHover(idx)}
                onMouseLeave={() => handleLetterLeave(idx)}
                className="inline-block transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  color: activeColor || '#FFFFFF',
                  textShadow: activeColor
                    ? `0 0 25px ${activeColor}99, 0 0 50px ${activeColor}44`
                    : 'none',
                }}
              >
                {char}
              </span>
            );
          })}
        </span>

        {/* Word 2: "Good" (Rapid Interactive Font-Morphing on Hover) */}
        <span
          onMouseEnter={handleGoodMouseEnter}
          onMouseLeave={handleGoodMouseLeave}
          className={`inline-flex items-baseline cursor-pointer transition-all duration-200 ${
            isHoveringGood ? 'text-pink-400 scale-105' : 'text-white'
          }`}
          style={{
            fontFamily: isHoveringGood ? FONTS_CYCLE[fontIndex].family : 'inherit',
            textShadow: isHoveringGood
              ? '0 0 30px rgba(236,72,153,0.8), 0 0 60px rgba(124,58,237,0.4)'
              : 'none',
          }}
          title="Hover to cycle through Google font pairings in real-time"
        >
          <span>Good</span>
          <span className="text-[#EC4899] animate-pulse">.</span>
        </span>
      </h1>

      {/* Subtitle with active font indicator if hovering */}
      <div className="flex items-center space-x-3 text-xs font-mono text-stone-400 h-6">
        {isHoveringGood ? (
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
            <span>Active Font: {FONTS_CYCLE[fontIndex].name}</span>
          </div>
        ) : (
          <span className="text-stone-400 text-xs sm:text-sm font-medium">
            Hover &ldquo;Looks&rdquo; to paint colors • Hover &ldquo;Good&rdquo; to morph typography fonts
          </span>
        )}
      </div>
    </div>
  );
}
