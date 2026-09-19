import React from 'react';
import { MOOD_PROFILES } from '../../data/moodProfiles';

export function MoodSelector({ selectedMood, onSelectMood }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-card space-y-4">
      <div>
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">What should your design feel like?</h3>
        <p className="text-xs text-zinc-500 mt-0.5">Atmosphere and personality influence saturation and contrast tuning</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {MOOD_PROFILES.map((mood) => {
          const isSelected = selectedMood === mood.id;

          return (
            <button
              key={mood.id}
              onClick={() => onSelectMood(mood.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-150 ${
                isSelected
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-white hover:border-zinc-300'
              }`}
            >
              {/* Color dots preview */}
              <div className="flex items-center -space-x-1">
                {mood.sampleColors.slice(0, 2).map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full border border-white shrink-0"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
