import React from 'react';
import { CopyButton } from '../common/CopyButton';
import { getContrastRatio, hexToHsl } from '../../utils/colorUtils';
import { Pipette, Sparkles } from 'lucide-react';

export function PaletteRoleCards({ palette, onOverrideColor, onOpenWhy }) {
  const roles = [
    {
      key: 'primary',
      label: 'Primary',
      hex: palette.primary,
      use: 'Core brand identity, primary buttons, hero actions',
      tag: 'Main Brand',
    },
    {
      key: 'supporting',
      label: 'Supporting',
      hex: palette.supporting || palette.primary,
      use: 'Secondary buttons, header tabs, card accents',
      tag: 'Structure',
    },
    {
      key: 'accent',
      label: 'Accent',
      hex: palette.accent,
      use: 'Important alerts, notification badges, focal points',
      tag: 'Focal Point',
    },
    {
      key: 'background',
      label: 'Background',
      hex: palette.background,
      use: 'Page backdrop, spacious canvas container',
      tag: 'Canvas',
    },
    {
      key: 'surface',
      label: 'Surface',
      hex: palette.surface,
      use: 'Elevated cards, dropdowns, input fields',
      tag: 'Card Layer',
    },
    {
      key: 'text',
      label: 'Text',
      hex: palette.text,
      use: 'High-contrast readable headings and paragraphs',
      tag: 'Typography',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Recommended Palette Roles</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Assigned roles tailored for real software and design projects</p>
        </div>
        <button
          onClick={onOpenWhy}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Why these roles work</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {roles.map((role) => {
          const hsl = hexToHsl(role.hex);
          const isLight = hsl.l > 55;

          return (
            <div
              key={role.key}
              className="group flex flex-col bg-zinc-50 rounded-xl border border-zinc-200 overflow-hidden shadow-subtle hover:shadow-hover hover:border-zinc-300 transition-all duration-200"
            >
              {/* Swatch Area */}
              <div
                className="relative h-24 sm:h-28 w-full p-2 flex flex-col justify-between border-b border-black/10 transition-transform"
                style={{ backgroundColor: role.hex }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded backdrop-blur-md"
                    style={{
                      backgroundColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                      color: isLight ? '#18181B' : '#FFFFFF',
                    }}
                  >
                    {role.tag}
                  </span>

                  {/* Quick Eye-dropper/Edit */}
                  <label
                    title="Customize this role color"
                    className="cursor-pointer p-1 rounded-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      backgroundColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                      color: isLight ? '#18181B' : '#FFFFFF',
                    }}
                  >
                    <Pipette className="w-3 h-3" />
                    <input
                      type="color"
                      value={role.hex}
                      onChange={(e) => onOverrideColor(role.key, e.target.value)}
                      className="opacity-0 absolute w-0 h-0"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-mono font-bold tracking-tight"
                    style={{ color: isLight ? '#18181B' : '#FFFFFF' }}
                  >
                    {role.hex.toUpperCase()}
                  </span>
                  <CopyButton
                    text={role.hex.toUpperCase()}
                    toastMessage={`Copied ${role.label} (${role.hex.toUpperCase()})`}
                    iconOnly
                    className="backdrop-blur-md bg-white/70 hover:bg-white text-zinc-900 border-0 p-1"
                  />
                </div>
              </div>

              {/* Details & Usage */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 mb-1">{role.label}</h4>
                  <p className="text-[11px] text-zinc-500 leading-snug">{role.use}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
