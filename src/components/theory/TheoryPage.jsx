import React, { useState } from 'react';
import { BookOpen, Check, X, Lightbulb } from 'lucide-react';

export const CORE_THEORY_TOPICS = [
  {
    id: 'contrast',
    title: 'CONTRAST',
    tagline: 'If everything looks the same, nothing gets attention.',
    summary: 'Contrast creates visual entry points so the reader instantly knows where to look.',
    rule: 'Important things should look distinctively different from less important things.',
    bad: {
      label: 'BAD',
      desc: 'Heading, body text, and buttons share identical weight, size, and pale colors.',
    },
    good: {
      label: 'GOOD',
      desc: 'Large dark headline, subtle muted body text, and a vibrant commanding button.',
    },
  },
  {
    id: 'hierarchy',
    title: 'HIERARCHY',
    tagline: 'Guide the eyes in order of importance.',
    summary: 'Establish clear scale (3x difference) so readers can scan your page in seconds.',
    rule: 'The main message must be visually dominant before anything else.',
    bad: {
      label: 'BAD',
      desc: 'Title and paragraphs are almost the same size; readers do not know where to start.',
    },
    good: {
      label: 'GOOD',
      desc: 'Massive title on top, concise subtitle below, and structured paragraph text.',
    },
  },
  {
    id: 'white-space',
    title: 'WHITE SPACE',
    tagline: 'Let elements breathe to look expensive and clear.',
    summary: 'Negative space is not empty void; it is the frame that gives content prestige.',
    rule: 'When in doubt, double the padding and remove decorative borders.',
    bad: {
      label: 'BAD',
      desc: 'Cramped margins with text colliding with container borders and buttons.',
    },
    good: {
      label: 'GOOD',
      desc: 'Generous 32px padding, relaxed line heights, and comfortable breathing room.',
    },
  },
  {
    id: 'alignment',
    title: 'ALIGNMENT',
    tagline: 'Create invisible grid lines that calm the brain.',
    summary: 'Mismatched edges signal amateurism. Aligning items creates order and trust.',
    rule: 'Every element should align to at least one other vertical or horizontal axis.',
    bad: {
      label: 'BAD',
      desc: 'Icons, labels, and buttons staggered randomly without a shared margin.',
    },
    good: {
      label: 'GOOD',
      desc: 'Strict left-aligned text edge connecting titles, subtitles, and button edges.',
    },
  },
  {
    id: 'color',
    title: 'COLOR (60-30-10 RULE)',
    tagline: 'Use color to navigate, not just decorate.',
    summary: '60% neutral canvas background, 30% structural text/cards, 10% high-intent action color.',
    rule: 'Reserve your brightest accent color exclusively for things you want users to click.',
    bad: {
      label: 'BAD',
      desc: 'Five competing saturated colors all fighting for the user attention.',
    },
    good: {
      label: 'GOOD',
      desc: 'Neutral light background, deep charcoal text, and one crisp primary button.',
    },
  },
  {
    id: 'typography',
    title: 'TYPOGRAPHY & LINE-HEIGHT',
    tagline: 'Typography is 90% of the web.',
    summary: 'Tighter line height for large headings (1.1-1.2) and relaxed line height for body (1.5-1.6).',
    rule: 'Never use line-height below 1.5 for multi-line body paragraphs.',
    bad: {
      label: 'BAD',
      desc: 'Suffocated line height where letter descenders touch the lines above.',
    },
    good: {
      label: 'GOOD',
      desc: 'Generous line spacing (1.6) that allows effortless, fatigue-free reading.',
    },
  },
  {
    id: 'balance',
    title: 'BALANCE',
    tagline: 'Distribute visual weight so screens feel stable.',
    summary: 'Dark dense items carry heavy visual weight; balance them with spacious lighter areas.',
    rule: 'Balance large lightweight text blocks with smaller, denser action widgets.',
    bad: {
      label: 'BAD',
      desc: 'All heavy dark buttons piled into one corner while the rest is empty.',
    },
    good: {
      label: 'GOOD',
      desc: 'Clear headline on the left balanced by an engaging preview widget on the right.',
    },
  },
];

export function TheoryPage() {
  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-card space-y-2">
        <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
          QUICK PRACTICAL PRINCIPLES
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
          Design Theory
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-xl">
          Learn the basics when you need them. Practical visual rules without the textbook jargon.
        </p>
      </div>

      {/* 7 Core Topics Grid */}
      <div className="space-y-6">
        {CORE_THEORY_TOPICS.map((topic) => (
          <div
            key={topic.id}
            className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-card space-y-5"
          >
            {/* Title & Tagline */}
            <div className="space-y-1">
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">{topic.title}</h3>
              <p className="text-xs sm:text-sm font-semibold text-brand-600">{topic.tagline}</p>
              <p className="text-xs text-zinc-600 leading-relaxed pt-1">{topic.summary}</p>
            </div>

            {/* Bad vs Good Visual Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* BAD Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-rose-700 uppercase tracking-wider">
                  <X className="w-4 h-4 text-rose-600" />
                  <span>{topic.bad.label}</span>
                </div>
                <p className="text-xs text-rose-950 leading-relaxed font-medium">
                  {topic.bad.desc}
                </p>
              </div>

              {/* GOOD Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 uppercase tracking-wider">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{topic.good.label}</span>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                  {topic.good.desc}
                </p>
              </div>
            </div>

            {/* One Practical Rule */}
            <div className="p-4 bg-zinc-900 text-white rounded-2xl flex items-start gap-3 shadow-subtle">
              <Lightbulb className="w-4 h-4 text-brand-300 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-300 block">
                  ONE PRACTICAL RULE
                </span>
                <p className="text-xs font-bold text-zinc-100 mt-0.5 leading-snug">
                  "{topic.rule}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
