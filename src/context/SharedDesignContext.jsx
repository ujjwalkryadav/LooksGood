import React, { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';

const SharedDesignContext = createContext(null);

export const DEFAULT_PALETTE = {
  primary: '#7C3AED',
  secondary: '#1E1B4B',
  accent: '#EC4899',
  background: '#FAF9F6',
  text: '#0D0C0B',
};

function normalizePaletteInput(input) {
  if (!input) return DEFAULT_PALETTE;

  // If array of strings ['#...', '#...']
  if (Array.isArray(input)) {
    const hexes = input.map((item) => (typeof item === 'string' ? item : item?.hex || '#7C3AED'));
    return {
      primary: hexes[0] || '#7C3AED',
      secondary: hexes[1] || hexes[0] || '#1E1B4B',
      accent: hexes[2] || hexes[0] || '#EC4899',
      background: hexes[3] || '#FAF9F6',
      text: hexes[4] || '#0D0C0B',
    };
  }

  // If object { primary, secondary, ... }
  if (typeof input === 'object') {
    return {
      primary: input.primary || input.PRIMARY || input[0] || '#7C3AED',
      secondary: input.secondary || input.SECONDARY || input[1] || '#1E1B4B',
      accent: input.accent || input.ACCENT || input[2] || '#EC4899',
      background: input.background || input.BACKGROUND || input[3] || '#FAF9F6',
      text: input.text || input.TEXT || input[4] || '#0D0C0B',
    };
  }

  return DEFAULT_PALETTE;
}

export function SharedDesignProvider({ children }) {
  const { showToast } = useToast();

  const [activePalette, setActivePalette] = useState(() => {
    try {
      const saved = localStorage.getItem('looksgood_active_palette');
      if (saved) {
        const parsed = JSON.parse(saved);
        return normalizePaletteInput(parsed);
      }
      return DEFAULT_PALETTE;
    } catch {
      return DEFAULT_PALETTE;
    }
  });

  const [activePrimaryHex, setActivePrimaryHex] = useState(() => {
    return localStorage.getItem('looksgood_primary_color') || '#7C3AED';
  });

  const [activeFontId, setActiveFontId] = useState(() => {
    return localStorage.getItem('looksgood_active_font') || 'inter';
  });

  const updatePrimaryHex = (hex) => {
    if (!hex) return;
    setActivePrimaryHex(hex);
    localStorage.setItem('looksgood_primary_color', hex);
  };

  const updatePalette = (newPalette) => {
    const normalized = normalizePaletteInput(newPalette);
    setActivePalette(normalized);
    if (normalized.primary) {
      updatePrimaryHex(normalized.primary);
    }
    try {
      localStorage.setItem('looksgood_active_palette', JSON.stringify(normalized));
    } catch {
      // ignore
    }
  };

  const sendPaletteToColorStudio = (inputPalette, title = 'Custom Palette') => {
    const normalized = normalizePaletteInput(inputPalette);
    updatePalette(normalized);
    showToast(`Applied ${title} to Color Studio!`, 'success');
  };

  return (
    <SharedDesignContext.Provider
      value={{
        activePalette,
        activePrimaryHex,
        activeFontId,
        updatePrimaryHex,
        updatePalette,
        setActiveFontId,
        sendPaletteToColorStudio,
      }}
    >
      {children}
    </SharedDesignContext.Provider>
  );
}

export function useSharedDesign() {
  const ctx = useContext(SharedDesignContext);
  if (!ctx) throw new Error('useSharedDesign must be used within SharedDesignProvider');
  return ctx;
}
