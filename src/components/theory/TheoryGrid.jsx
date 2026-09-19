import React, { useState } from 'react';
import { THEORY_PRINCIPLES } from '../../data/theoryData';
import { TheoryCard } from './TheoryCard';
import { Search, BookOpen, Sparkles } from 'lucide-react';

export function TheoryGrid() {
  const [search, setSearch] = useState('');

  const filtered = THEORY_PRINCIPLES.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase()) ||
      p.rule.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Visual Design Fundamentals</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Design Theory Made Practical
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            No endless textbooks. Here are the 10 core visual principles broken down with interactive Bad vs Good examples and one practical rule for each.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search principles (e.g. Contrast, Rhythm)..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-subtle"
          />
        </div>
      </div>

      {/* Grid of 10 Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((principle) => (
          <TheoryCard key={principle.id} principle={principle} />
        ))}
      </div>
    </div>
  );
}
