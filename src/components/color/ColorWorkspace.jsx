import React, { useState } from 'react';
import { GuidedPaletteCreator } from './GuidedPaletteCreator';
import { TrendingPalettes } from './TrendingPalettes';
import { ImagePalettePicker } from './ImagePalettePicker';
import { ContrastChecker } from './ContrastChecker';
import { Sparkles, Flame, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export function ColorWorkspace({
  colorModule: controlledModule,
  setColorModule: setControlledModule,
  onChangeHex,
  onNavigateToColor,
}) {
  const [internalModule, setInternalModule] = useState('creator');
  const activeModule = controlledModule || internalModule;
  const setModule = setControlledModule || setInternalModule;

  const modules = [
    {
      id: 'creator',
      label: 'Create My Palette',
      icon: Sparkles,
      badge: 'Guided Flow',
    },
    {
      id: 'trending',
      label: 'Trending Palettes',
      icon: Flame,
      badge: 'Explore',
    },
    {
      id: 'image',
      label: 'Image Picker',
      icon: ImageIcon,
      badge: 'Extractor',
    },
    {
      id: 'contrast',
      label: 'Contrast Checker',
      icon: CheckCircle2,
      badge: 'WCAG 2.1',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Module Navigation Pill Bar */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#E8E5DF] rounded-2xl shadow-subtle max-w-full overflow-x-auto scrollbar-none">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setModule(m.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold rounded-xl transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-[#0D0C0B] text-white shadow-sm scale-[1.01]'
                    : 'text-[#78716C] hover:text-[#0D0C0B] hover:bg-[#F2EFE9]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-paprika' : 'text-[#78716C]'}`} />
                <span>{m.label}</span>
                {m.badge && (
                  <span
                    className={`hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-bold rounded uppercase ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#FAF9F6] text-[#78716C] border border-[#E8E5DF]'
                    }`}
                  >
                    {m.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Color Studio Module */}
      {activeModule === 'creator' && (
        <GuidedPaletteCreator
          onPaletteGenerated={(result) => {
            if (result?.palette?.[0]?.hex && onChangeHex) {
              onChangeHex(result.palette[0].hex);
            }
          }}
          onOpenContrast={() => setModule('contrast')}
        />
      )}

      {activeModule === 'trending' && (
        <TrendingPalettes
          onApplyPalette={(palette) => {
            if (palette?.colors?.[0] && onChangeHex) {
              onChangeHex(palette.colors[0]);
            }
          }}
          onOpenContrast={() => setModule('contrast')}
        />
      )}

      {activeModule === 'image' && <ImagePalettePicker />}

      {activeModule === 'contrast' && <ContrastChecker />}
    </div>
  );
}
