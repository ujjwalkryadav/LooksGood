import React from 'react';
import { Modal } from './Modal';
import { Sparkles, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';

export function WhyModal({ isOpen, onClose, data }) {
  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={data.title || 'Why this works'}>
      <div className="space-y-5">
        {/* Header Icon & Tagline */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-50 border border-brand-100 text-brand-900">
          <Sparkles className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-brand-950">Design Psychology & Mechanics</h4>
            <p className="text-xs text-brand-700 mt-0.5">
              {data.subtitle || 'How this decision influences visual hierarchy, cognitive load, and aesthetic harmony.'}
            </p>
          </div>
        </div>

        {/* Main Explanation */}
        <div className="space-y-2">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Core Principle</h5>
          <p className="text-sm text-zinc-700 leading-relaxed font-normal">
            {data.explanation}
          </p>
        </div>

        {/* Visual Swatch / Preview context if available */}
        {data.swatches && data.swatches.length > 0 && (
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
            <div className="text-xs font-medium text-zinc-500 mb-2">Applied Chromatic Relationship:</div>
            <div className="flex items-center gap-2">
              {data.swatches.map((swatch, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full h-10 rounded-lg shadow-sm border border-black/10"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="text-[11px] font-mono text-zinc-600 font-medium">{swatch.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practical Takeaway / Rule */}
        {data.takeaway && (
          <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-emerald-950 block">Practical Rule of Thumb:</span>
              <span className="text-xs text-emerald-800 leading-normal">{data.takeaway}</span>
            </div>
          </div>
        )}

        {/* Footer Action */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors shadow-sm"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </Modal>
  );
}
