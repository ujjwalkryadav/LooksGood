import React from 'react';
import { Palette, Type, BookOpen, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export function FeatureCards({ onNavigateToColor, onNavigateToType, onNavigateToTheory, palette }) {
  const cards = [
    {
      id: 'color',
      title: 'Color Lab',
      tagline: 'Find colors that work together.',
      description:
        'Pick any primary color. Instantly get calculated complementary, analogous, triadic, and monochromatic schemes with plain-English role mapping.',
      icon: Palette,
      cta: 'Explore Color Lab',
      onClick: onNavigateToColor,
      badge: 'Harmonies & WCAG',
    },
    {
      id: 'typography',
      title: 'Typography Lab',
      tagline: 'Find fonts that work together.',
      description:
        'Browse 25+ curated Google Fonts with real-time pairing ratings, use-case recommendations, and reverse Heading ↔ Body suggestions.',
      icon: Type,
      cta: 'Explore Font Pairings',
      onClick: onNavigateToType,
      badge: 'Pairing Engine',
    },
    {
      id: 'theory',
      title: 'Design Theory',
      tagline: 'Understand why they work.',
      description:
        'Master the 10 core principles—Contrast, Hierarchy, White Space, Alignment, and Rhythm—with interactive Bad vs Good comparisons.',
      icon: BookOpen,
      cta: 'Explore 10 Principles',
      onClick: onNavigateToTheory,
      badge: 'No Textbooks',
    },
  ];

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
            The Three Pillars of Great Design
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Everything you need to make confident aesthetic and functional decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={card.onClick}
                className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-7 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-6 cursor-pointer group"
              >
                <div className="space-y-4">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 group-hover:bg-brand-50 text-zinc-800 group-hover:text-brand-600 transition-colors flex items-center justify-center shadow-subtle">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 rounded-lg">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">{card.title}</h3>
                    <p className="text-xs font-bold text-brand-600 mt-0.5">{card.tagline}</p>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">{card.description}</p>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-900 group-hover:text-brand-600 transition-colors">
                  <span>{card.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
