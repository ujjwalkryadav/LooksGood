import React from 'react';

export function SegmentedControl({ options, value, onChange, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'p-0.5 text-xs',
    md: 'p-1 text-xs sm:text-sm',
    lg: 'p-1.5 text-sm',
  };

  const btnPadding = {
    sm: 'px-2.5 py-1',
    md: 'px-3 py-1.5',
    lg: 'px-4 py-2',
  };

  return (
    <div
      className={`inline-flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200/80 ${sizeClasses[size]} ${className}`}
      role="tablist"
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(opt.value)}
            className={`relative flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-150 whitespace-nowrap focus-visible:outline-brand-500 ${btnPadding[size]} ${
              isSelected
                ? 'bg-white text-zinc-900 shadow-subtle border border-zinc-200/60 font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
            }`}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
