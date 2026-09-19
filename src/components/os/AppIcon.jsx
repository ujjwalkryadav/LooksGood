import React from 'react';

export default function AppIcon({ appId, size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-12 h-12 rounded-2xl',
    lg: 'w-16 h-16 rounded-3xl',
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  switch (appId) {
    case 'colorStudio':
      return (
        <div className={`relative ${currentSize} p-0.5 overflow-hidden shadow-lg shadow-purple-600/25 group transition-transform ${className}`}>
          {/* Base 3D Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-600 to-pink-500 rounded-[inherit]" />
          {/* Glass Inner Reflection */}
          <div className="absolute inset-[1px] bg-gradient-to-b from-white/30 to-transparent rounded-[inherit] pointer-events-none" />
          
          {/* Custom Chroma Wheel Vector Glyphs */}
          <div className="relative w-full h-full rounded-[inherit] flex items-center justify-center">
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7 drop-shadow-md">
              <circle cx="24" cy="24" r="16" stroke="white" strokeWidth="4" strokeDasharray="25 6" strokeLinecap="round" className="opacity-95" />
              <circle cx="24" cy="24" r="7" fill="white" className="opacity-90" />
              <circle cx="24" cy="24" r="3" fill="#7C3AED" />
              <path d="M24 8V14M24 34V40M8 24H14M34 24H40" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
        </div>
      );

    case 'typography':
      return (
        <div className={`relative ${currentSize} p-0.5 overflow-hidden shadow-lg shadow-cyan-600/25 group transition-transform ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-600 to-indigo-700 rounded-[inherit]" />
          <div className="absolute inset-[1px] bg-gradient-to-b from-white/30 to-transparent rounded-[inherit] pointer-events-none" />
          
          {/* Custom Typography Aa Mark */}
          <div className="relative w-full h-full rounded-[inherit] flex items-center justify-center font-serif text-white">
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7 drop-shadow-md">
              <text x="10" y="32" fontSize="22" fontWeight="900" fontFamily="Playfair Display, serif" fill="white">T</text>
              <text x="24" y="33" fontSize="17" fontWeight="700" fontFamily="Inter, sans-serif" fill="#A5F3FC">a</text>
              <rect x="8" y="38" width="32" height="2" rx="1" fill="white" opacity="0.6" />
            </svg>
          </div>
        </div>
      );

    case 'trending':
      return (
        <div className={`relative ${currentSize} p-0.5 overflow-hidden shadow-lg shadow-pink-600/25 group transition-transform ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-600 to-orange-500 rounded-[inherit]" />
          <div className="absolute inset-[1px] bg-gradient-to-b from-white/30 to-transparent rounded-[inherit] pointer-events-none" />
          
          {/* Custom Flame / Trending Palette Mark */}
          <div className="relative w-full h-full rounded-[inherit] flex items-center justify-center">
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7 drop-shadow-md">
              <path
                d="M26 6C26 6 29 12 29 17C29 20 27 22 25 22C23 22 21 20 21 17C21 14 22 10 22 10C17 14 14 20 14 26C14 33.7 20.3 40 28 40C35.7 40 42 33.7 42 26C42 16 32 8 26 6Z"
                fill="white"
                className="opacity-95"
              />
              <path
                d="M27 23C27 23 29 26 29 29C29 31.8 26.8 34 24 34C21.2 34 19 31.8 19 29C19 26 22 24 24 24C25.5 24 26.5 23 27 23Z"
                fill="#F43F5E"
              />
              <circle cx="12" cy="14" r="2.5" fill="#FED7AA" />
              <circle cx="36" cy="12" r="2" fill="#FED7AA" />
            </svg>
          </div>
        </div>
      );

    case 'imagePicker':
      return (
        <div className={`relative ${currentSize} p-0.5 overflow-hidden shadow-lg shadow-emerald-600/25 group transition-transform ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-[inherit]" />
          <div className="absolute inset-[1px] bg-gradient-to-b from-white/30 to-transparent rounded-[inherit] pointer-events-none" />
          
          {/* Custom Image Sampler Reticle Mark */}
          <div className="relative w-full h-full rounded-[inherit] flex items-center justify-center">
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7 drop-shadow-md">
              <rect x="9" y="9" width="30" height="30" rx="8" stroke="white" strokeWidth="3" opacity="0.9" />
              <circle cx="24" cy="24" r="7" stroke="white" strokeWidth="2.5" />
              <circle cx="24" cy="24" r="3" fill="#6EE7B7" />
              <path d="M24 11V15M24 33V37M11 24H15M33 24H37" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      );

    case 'contrast':
    case 'contrastChecker':
      return (
        <div className={`relative ${currentSize} p-0.5 overflow-hidden shadow-lg shadow-amber-600/25 group transition-transform ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-600 to-stone-900 rounded-[inherit]" />
          <div className="absolute inset-[1px] bg-gradient-to-b from-white/30 to-transparent rounded-[inherit] pointer-events-none" />
          
          {/* Custom WCAG Aperture Eye Mark */}
          <div className="relative w-full h-full rounded-[inherit] flex items-center justify-center">
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7 drop-shadow-md">
              <path
                d="M8 24C8 24 14 12 24 12C34 12 40 24 40 24C40 24 34 36 24 36C14 36 8 24 8 24Z"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="24" cy="24" r="6" fill="white" />
              <circle cx="24" cy="24" r="3" fill="#D97706" />
            </svg>
          </div>
        </div>
      );

    case 'systemInfo':
      return (
        <div className={`relative ${currentSize} p-0.5 overflow-hidden shadow-lg shadow-stone-800/25 group transition-transform ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-purple-950 rounded-[inherit]" />
          <div className="absolute inset-[1px] bg-gradient-to-b from-white/30 to-transparent rounded-[inherit] pointer-events-none" />
          
          {/* Custom OS Core Mark */}
          <div className="relative w-full h-full rounded-[inherit] flex items-center justify-center">
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7 drop-shadow-md">
              <rect x="12" y="12" width="24" height="24" rx="6" stroke="white" strokeWidth="3" />
              <rect x="18" y="18" width="12" height="12" rx="3" fill="#C084FC" />
              <path d="M16 6V12M32 6V12M16 36V42M32 36V42M6 16H12M6 32H12M36 16H42M36 32H42" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      );

    case 'launcher':
      return (
        <div className={`relative ${currentSize} p-0.5 overflow-hidden shadow-lg shadow-purple-500/20 group transition-transform ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-purple-900 to-stone-900 rounded-[inherit]" />
          <div className="absolute inset-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-[inherit] pointer-events-none" />
          
          {/* 3D Bento Launcher Grid */}
          <div className="relative w-full h-full rounded-[inherit] flex items-center justify-center">
            <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6 drop-shadow-md">
              <rect x="10" y="10" width="10" height="10" rx="3" fill="#C084FC" />
              <rect x="28" y="10" width="10" height="10" rx="3" fill="#67E8F9" />
              <rect x="10" y="28" width="10" height="10" rx="3" fill="#F472B6" />
              <rect x="28" y="28" width="10" height="10" rx="3" fill="#34D399" />
            </svg>
          </div>
        </div>
      );

    case 'home':
    default:
      return (
        <div className={`relative ${currentSize} p-0.5 overflow-hidden shadow-lg shadow-stone-600/20 group transition-transform ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 rounded-[inherit]" />
          <div className="absolute inset-[1px] bg-gradient-to-b from-white/30 to-transparent rounded-[inherit] pointer-events-none" />
          
          <div className="relative w-full h-full rounded-[inherit] flex items-center justify-center">
            <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6 drop-shadow-md">
              <path d="M12 24L24 13L36 24V36H28V28H20V36H12V24Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      );
  }
}
