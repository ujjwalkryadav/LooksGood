import React from 'react';
import { Sparkles } from 'lucide-react';

export function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your search terms or filters to explore more options.',
  icon: Icon = Sparkles,
  actionText,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-zinc-300">
      <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-zinc-900 mb-1">{title}</h4>
      <p className="text-xs text-zinc-700 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
