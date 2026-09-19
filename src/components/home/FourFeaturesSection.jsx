import React from 'react';
import { Zap, UserCheck, Sparkles, Globe, ArrowUpRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    badgeClass: 'bg-purple-50 text-purple-600 border-purple-200/80',
    glowClass: 'group-hover:border-purple-300 group-hover:shadow-purple-500/10',
    title: 'Beautifully Simple',
    tag: 'Minimal UI',
    desc: 'Powerful mathematical tools wrapped in a clean, uncluttered interface designed for rapid workflow.',
  },
  {
    icon: UserCheck,
    badgeClass: 'bg-blue-50 text-blue-600 border-blue-200/80',
    glowClass: 'group-hover:border-blue-300 group-hover:shadow-blue-500/10',
    title: 'Made for Creators',
    tag: 'Designers & Devs',
    desc: 'Engineered specifically for brand designers, frontend architects, UI/UX leads, and creative agencies.',
  },
  {
    icon: Sparkles,
    badgeClass: 'bg-pink-50 text-pink-600 border-pink-200/80',
    glowClass: 'group-hover:border-pink-300 group-hover:shadow-pink-500/10',
    title: 'Instant Inspiration',
    tag: 'Curated Scales',
    desc: 'Explore categorized palettes, Google font pairings with harmony scores, and real-time editorial canvas.',
  },
  {
    icon: Globe,
    badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    glowClass: 'group-hover:border-emerald-300 group-hover:shadow-emerald-500/10',
    title: 'Works Everywhere',
    tag: 'Production Ready',
    desc: 'One-click export ready for Figma design tokens, Tailwind CSS configs, SCSS variables, and Webflow.',
  },
];

export function FourFeaturesSection() {
  return (
    <section className="w-full py-12 sm:py-16 select-none relative">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className={`bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4 group cursor-default ${feat.glowClass}`}
              >
                <div className="space-y-3.5">
                  {/* Top Icon & Tag */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-110 transition-transform ${feat.badgeClass}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200/80">
                      {feat.tag}
                    </span>
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1.5">
                    <h4 className="text-base font-black text-stone-950 font-sans tracking-tight">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono font-bold text-stone-400 group-hover:text-stone-700 transition-colors">
                  <span>0{idx + 1} System Feature</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
