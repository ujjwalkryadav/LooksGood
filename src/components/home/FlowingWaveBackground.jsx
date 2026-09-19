import React from 'react';

export default function FlowingWaveBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Base Warm Clean Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7F7FA] via-[#F5F4F8] to-[#EBE9F5]" />

      {/* 2. Top-Right Soft Ambient Warmth */}
      <div 
        className="absolute -top-[15%] right-[5%] w-[650px] h-[550px] rounded-full blur-[100px] opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(244, 114, 182, 0.4) 0%, rgba(251, 146, 60, 0.25) 50%, transparent 70%)',
        }}
      />

      {/* 3. Top-Left Soft Azure Glow */}
      <div 
        className="absolute top-[10%] -left-[10%] w-[550px] h-[450px] rounded-full blur-[90px] opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(168, 85, 247, 0.2) 60%, transparent 80%)',
        }}
      />

      {/* 4. Layered 3D Multi-Color Smooth Flowing Waves (SVG) */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[65%] min-h-[420px] object-cover preserve-3d"
        viewBox="0 0 1440 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Deep Violet / Indigo Wave Gradient */}
          <linearGradient id="waveIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3730A3" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#6366F1" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.4" />
          </linearGradient>

          {/* Vibrant Purple / Magenta Gradient */}
          <linearGradient id="wavePurple" x1="0%" y1="20%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#9333EA" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#C026D3" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0.75" />
          </linearGradient>

          {/* Sunset Pink / Orange / Peach Gradient */}
          <linearGradient id="waveSunset" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#F43F5E" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#FB923C" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.65" />
          </linearGradient>

          {/* Soft Pastel Pink / Amber Top Highlights */}
          <linearGradient id="waveHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FDA4AF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FED7AA" stopOpacity="0.6" />
          </linearGradient>

          {/* Frosted Wave Blur Filter */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Back Layer: Deep Blue / Violet Flow */}
        <path
          d="M0 260C180 180 340 160 520 230C720 310 920 380 1140 320C1280 280 1380 230 1440 210V600H0V260Z"
          fill="url(#waveIndigo)"
          filter="url(#softGlow)"
          opacity="0.85"
        />

        {/* Middle Layer: Radiant Violet / Magenta Flow */}
        <path
          d="M0 340C220 220 420 240 640 340C860 440 1080 360 1280 260C1360 220 1410 200 1440 190V600H0V340Z"
          fill="url(#wavePurple)"
          opacity="0.9"
        />

        {/* Front-Right Layer: Sunset Pink / Peach / Golden Glow */}
        <path
          d="M360 440C560 320 780 280 1000 360C1180 430 1320 390 1440 340V600H360V440Z"
          fill="url(#waveSunset)"
          opacity="0.92"
        />

        {/* Delicate Top Ribbon Crest Highlight */}
        <path
          d="M0 310C240 190 460 210 680 320C900 420 1120 340 1340 230C1390 205 1420 190 1440 180"
          stroke="url(#waveHighlight)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>

      {/* 5. Frosted Glass Bottom Vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-white/60 via-white/20 to-transparent backdrop-blur-[2px]" />
    </div>
  );
}
