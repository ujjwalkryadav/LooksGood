import React from 'react';

export function ScoreMeter({ score, label, size = 'md', showBar = true }) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score || 0)));

  const getTheme = (val) => {
    if (val >= 90) return { color: 'text-emerald-600', bg: 'bg-emerald-500', track: 'bg-emerald-100', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', tag: 'Exceptional' };
    if (val >= 80) return { color: 'text-brand-600', bg: 'bg-brand-500', track: 'bg-brand-100', badge: 'bg-brand-50 text-brand-700 border-brand-200', tag: 'Great' };
    if (val >= 65) return { color: 'text-amber-600', bg: 'bg-amber-500', track: 'bg-amber-100', badge: 'bg-amber-50 text-amber-700 border-amber-200', tag: 'Acceptable' };
    return { color: 'text-rose-600', bg: 'bg-rose-500', track: 'bg-rose-100', badge: 'bg-rose-50 text-rose-700 border-rose-200', tag: 'Needs Polish' };
  };

  const theme = getTheme(normalizedScore);

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-12 bg-zinc-200 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full ${theme.bg} rounded-full transition-all duration-500`}
            style={{ width: `${normalizedScore}%` }}
          />
        </div>
        <span className={`text-xs font-mono font-bold ${theme.color}`}>{normalizedScore}%</span>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-zinc-200 shadow-card text-center">
        <div className="relative flex items-center justify-center w-28 h-28 mb-3">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-zinc-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={theme.color}
              strokeDasharray={`${normalizedScore}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-zinc-900 tracking-tight">{normalizedScore}</span>
            <span className="text-[10px] font-semibold uppercase text-zinc-600 tracking-wider">Score</span>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border mb-1 ${theme.badge}`}>
          {theme.tag}
        </span>
        {label && <span className="text-xs text-zinc-700 font-medium">{label}</span>}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-700">{label}</span>
        <span className={`font-mono font-bold ${theme.color}`}>{normalizedScore}%</span>
      </div>
      {showBar && (
        <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200/50">
          <div
            className={`h-full ${theme.bg} rounded-full transition-all duration-500`}
            style={{ width: `${normalizedScore}%` }}
          />
        </div>
      )}
    </div>
  );
}
