import React from 'react';

const BRANDS = [
  {
    name: 'Figma',
    category: 'Design & Systems',
    icon: (
      <svg className="w-5 h-5 fill-current text-[#F24E1E]" viewBox="0 0 24 24">
        <path d="M12 12a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm-3 0a3 3 0 1 1-3-3 3 3 0 0 1 3 3zm0 6a3 3 0 1 1-3-3 3 3 0 0 1 3 3zm6 0a3 3 0 1 1-3-3 3 3 0 0 1 3 3zm0-12a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm-3 0a3 3 0 1 1-3-3 3 3 0 0 1 3 3z" />
      </svg>
    ),
  },
  {
    name: 'Adobe',
    category: 'Creative Cloud',
    icon: (
      <svg className="w-5 h-5 fill-current text-[#FF0000]" viewBox="0 0 24 24">
        <path d="M13.96 0H24v24H13.96zM0 0h10.04L0 24zm12 10.96L7.54 24h4.42l1.37-3.71h4.42z" />
      </svg>
    ),
  },
  {
    name: 'Notion',
    category: 'Workspaces',
    icon: (
      <svg className="w-5 h-5 fill-current text-stone-900" viewBox="0 0 24 24">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.093-.373L17.784 1.88c-.56-.42-1.307-.7-2.053-.607L2.919 2.16c-.467.047-.56.327-.373.56zm.746 3.687v13.628c0 .84.42 1.167 1.353 1.12l14.195-.84c.933-.047 1.027-.56 1.027-1.26V6.962c0-.7-.28-.98-1.027-.933L5.578 6.962c-.746.047-.373.467-.373.933zm13.121 1.027c.094.42 0 .84-.42.887l-.933.14v9.847c-.513.28-1.073.467-1.587.467-.84 0-1.213-.28-1.913-1.12l-5.32-8.353v8.073l1.727.373c.047.373-.233.793-.7.793h-3.453c-.093-.373.14-.747.56-.793l1.12-.234V9.675l-1.447-.14c-.093-.42.14-.84.607-.887l3.78-.233 5.413 8.446V9.442l-1.307-.14c-.093-.42.187-.84.653-.887z" />
      </svg>
    ),
  },
  {
    name: 'Spotify',
    category: 'Streaming Brand',
    icon: (
      <svg className="w-5 h-5 fill-current text-[#1ED760]" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.307c-.216.353-.672.468-1.025.253-2.808-1.716-6.342-2.105-10.505-1.154-.403.093-.804-.16-.897-.562-.093-.404.16-.805.563-.898 4.563-1.042 8.472-.6 11.611 1.326.353.216.469.673.253 1.035zm1.466-3.26c-.272.443-.852.584-1.295.312-3.214-1.975-8.113-2.546-11.914-1.392-.498.152-1.029-.133-1.18-.632-.152-.499.133-1.03.632-1.181 4.344-1.319 9.753-.685 13.445 1.588.443.272.584.852.312 1.305zm.126-3.41c-3.854-2.288-10.217-2.5-13.886-1.386-.59.18-1.22-.16-1.4-.75-.18-.59.16-1.22.75-1.4 4.218-1.28 11.246-1.035 15.688 1.603.533.316.708 1.011.392 1.544-.316.533-1.011.708-1.544.389z" />
      </svg>
    ),
  },
  {
    name: 'Canva',
    category: 'Visual Content',
    icon: (
      <span className="font-extrabold text-base tracking-tighter text-[#00C4CC] font-display">
        Canva
      </span>
    ),
  },
  {
    name: 'Google',
    category: 'Design Systems',
    icon: (
      <svg className="w-5 h-5 fill-current text-[#4285F4]" viewBox="0 0 24 24">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.067 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    category: 'Content Creators',
    icon: (
      <svg className="w-5 h-5 fill-current text-[#FF0000]" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'Pinterest',
    category: 'Moodboards',
    icon: (
      <svg className="w-5 h-5 fill-current text-[#E60023]" viewBox="0 0 24 24">
        <path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.98-.13-2.49.03-3.56l1.07-4.54s-.27-.55-.27-1.37c0-1.28.74-2.24 1.67-2.24.79 0 1.17.59 1.17 1.3 0 .79-.51 1.98-.77 3.08-.22.92.46 1.67 1.36 1.67 1.64 0 2.89-1.73 2.89-4.22 0-2.21-1.59-3.75-3.86-3.75-2.63 0-4.17 1.97-4.17 4.01 0 .79.31 1.64.69 2.1.08.09.09.18.06.31l-.26 1.07c-.04.18-.15.22-.34.13-1.28-.59-2.08-2.46-2.08-3.96 0-3.22 2.34-6.18 6.75-6.18 3.54 0 6.3 2.53 6.3 5.9 0 3.52-2.22 6.36-5.3 6.36-1.04 0-2.01-.54-2.35-1.18l-.64 2.44c-.23.89-.86 2-1.28 2.69A12 12 0 1 0 12 0z" />
      </svg>
    ),
  },
  {
    name: 'Webflow',
    category: 'Visual Code',
    icon: (
      <span className="font-extrabold text-base tracking-tighter text-[#146EF5] font-display">
        Webflow
      </span>
    ),
  },
  {
    name: 'Framer',
    category: 'Interactive Web',
    icon: (
      <span className="font-extrabold text-base tracking-tighter text-[#0055FF] font-display">
        Framer
      </span>
    ),
  },
];

export function TrustedBySection() {
  return (
    <section className="w-full py-12 sm:py-16 border-y border-stone-200/70 bg-gradient-to-b from-white/40 via-white/70 to-white/40 backdrop-blur-md select-none overflow-hidden relative">
      {/* Background Soft Glow Orbs */}
      <div className="absolute left-1/4 -top-10 w-72 h-72 rounded-full bg-purple-200/30 blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 -bottom-10 w-72 h-72 rounded-full bg-pink-200/30 blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 space-y-6 text-center">
        {/* Section Header */}
        <div className="flex items-center justify-center space-x-3">
          <span className="h-px w-8 bg-stone-300" />
          <h3 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.28em] text-stone-500">
            EMPOWERING DESIGNERS & TEAMS WORLDWIDE
          </h3>
          <span className="h-px w-8 bg-stone-300" />
        </div>

        {/* Seamless Infinite Marquee Ribbon */}
        <div className="relative w-full overflow-hidden py-3">
          {/* Side Fade Gradients */}
          <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-[#FAF9F6] via-[#FAF9F6]/80 to-transparent z-10 pointer-events-none" />

          {/* Marquee Track (Repeated 2 times for seamless loop) */}
          <div className="animate-marquee flex items-center gap-6">
            {[...BRANDS, ...BRANDS].map((brand, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-3 px-5 py-3 rounded-2xl bg-white/90 border border-stone-200/80 shadow-2xs hover:shadow-md hover:border-purple-300 hover:bg-white hover:-translate-y-1 transition-all duration-300 cursor-default group flex-shrink-0"
              >
                <div className="w-8 h-8 rounded-xl bg-stone-50 group-hover:bg-purple-50 border border-stone-200/60 flex items-center justify-center transition-colors">
                  {brand.icon}
                </div>
                <div className="text-left">
                  <span className="text-xs font-black text-stone-900 group-hover:text-purple-700 block font-sans">
                    {brand.name}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 block font-medium">
                    {brand.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
