import React from 'react';
import { Bookmark, Trash2, ArrowRight, Sparkles, X, Palette, Type } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export function AiSavedGuidesDrawer({
  isOpen,
  onClose,
  savedGuides,
  onSelectGuide,
  onDeleteGuide,
}) {
  const { showToast } = useToast();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-md flex items-center justify-end animate-fade-in select-none">
      <div className="w-full max-w-md h-full bg-white border-l border-stone-200 shadow-2xl p-6 flex flex-col justify-between animate-window-open text-stone-900">
        <div className="space-y-4">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-purple-600" />
              <h3 className="text-base font-bold font-display text-stone-900">
                Saved AI Design Guides ({savedGuides.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of Saved Guides */}
          {savedGuides.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-xs text-stone-500 font-medium max-w-xs mx-auto">
                No saved guides yet. When Gemini generates a brand guide you love, click "Save Guide" to store it here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[75vh] pr-1">
              {savedGuides.map((guide, idx) => {
                const primaryHex = guide.colors?.primary?.hex || '#7C3AED';
                const accentHex = guide.colors?.accent?.hex || '#EC4899';
                const secondaryHex = guide.colors?.secondary?.hex || '#1E1B4B';
                const headingFont = guide.typography?.displayHeadingFont?.name || 'Inter';

                return (
                  <div
                    key={guide.id || idx}
                    className="p-4 rounded-2xl bg-stone-50 hover:bg-purple-50/60 border border-stone-200/90 hover:border-purple-200 transition space-y-3 group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 group-hover:text-purple-900">
                          {guide.brandName}
                        </h4>
                        <p className="text-[11px] text-stone-500 font-medium line-clamp-1">
                          {guide.tagline}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteGuide(guide.id || idx);
                          showToast(`Removed ${guide.brandName} from saved guides.`, 'info');
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete guide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Mini Swatches & Font info */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryHex }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: secondaryHex }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accentHex }} />
                      </div>

                      <span className="text-[10px] font-mono font-medium text-stone-500">
                        {headingFont}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onSelectGuide(guide);
                        onClose();
                      }}
                      className="w-full py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-bold text-purple-700 hover:bg-purple-600 hover:text-white transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>Load Full System</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
