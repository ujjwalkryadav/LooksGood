import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { generateUseCasePalette, calculateHarmonies, normalizeHex } from '../utils/colorUtils';
import { FONTS_DATABASE, getFontById } from '../data/fontsData';
import { loadGoogleFont } from '../utils/fontLoader';

const DesignContext = createContext(null);

const STORAGE_KEYS = {
  PRIMARY_COLOR: 'looksgood_primary_color',
  HARMONY: 'looksgood_harmony',
  USE_CASE: 'looksgood_use_case',
  MOOD: 'looksgood_mood',
  HEADING_FONT: 'looksgood_heading_font',
  BODY_FONT: 'looksgood_body_font',
  SAVED_PALETTES: 'looksgood_saved_palettes',
  RECENT_COLORS: 'looksgood_recent_colors',
};

export function DesignProvider({ children }) {
  // 1. Color State
  const [primaryColor, setPrimaryColorState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.PRIMARY_COLOR) || '#6C63FF';
  });

  const [harmonyType, setHarmonyTypeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.HARMONY) || 'complementary';
  });

  const [useCase, setUseCaseState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.USE_CASE) || 'website';
  });

  const [mood, setMoodState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.MOOD) || 'modern';
  });

  const [colorOverrides, setColorOverrides] = useState({});

  // 2. Typography State
  const [headingFontId, setHeadingFontIdState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.HEADING_FONT) || 'plus-jakarta-sans';
  });

  const [bodyFontId, setBodyFontIdState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.BODY_FONT) || 'inter';
  });

  const [typographySettings, setTypographySettings] = useState({
    headingSize: 40, // px
    bodySize: 16, // px
    lineHeight: 1.6, // multiplier
    letterSpacing: -0.01, // em
    headingWeight: 700,
    bodyWeight: 400,
  });

  // 3. Saved & History State
  const [savedPalettes, setSavedPalettes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_PALETTES) || '[]');
    } catch {
      return [];
    }
  });

  const [recentColors, setRecentColors] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_COLORS) || '["#6C63FF", "#3B82F6", "#10B981", "#F59E0B", "#EC4899"]');
    } catch {
      return ['#6C63FF', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'];
    }
  });

  // Automatically load selected Google Fonts
  const headingFont = useMemo(() => getFontById(headingFontId), [headingFontId]);
  const bodyFont = useMemo(() => getFontById(bodyFontId), [bodyFontId]);

  useEffect(() => {
    if (headingFont?.googleFontQuery) {
      loadGoogleFont(headingFont.googleFontQuery);
    }
  }, [headingFont]);

  useEffect(() => {
    if (bodyFont?.googleFontQuery) {
      loadGoogleFont(bodyFont.googleFontQuery);
    }
  }, [bodyFont]);

  // Generate Base Palette with overrides
  const activePalette = useMemo(() => {
    const base = generateUseCasePalette(primaryColor, useCase, mood, harmonyType);
    return {
      ...base,
      ...colorOverrides,
    };
  }, [primaryColor, useCase, mood, harmonyType, colorOverrides]);

  const allHarmonies = useMemo(() => {
    return calculateHarmonies(primaryColor);
  }, [primaryColor]);

  // Setters with LocalStorage sync
  const setPrimaryColor = (hex) => {
    const normalized = normalizeHex(hex);
    setPrimaryColorState(normalized);
    setColorOverrides({});
    localStorage.setItem(STORAGE_KEYS.PRIMARY_COLOR, normalized);

    // Update recents
    setRecentColors((prev) => {
      const updated = [normalized, ...prev.filter((c) => c.toUpperCase() !== normalized.toUpperCase())].slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.RECENT_COLORS, JSON.stringify(updated));
      return updated;
    });
  };

  const setHarmonyType = (type) => {
    setHarmonyTypeState(type);
    setColorOverrides({});
    localStorage.setItem(STORAGE_KEYS.HARMONY, type);
  };

  const setUseCase = (uc) => {
    setUseCaseState(uc);
    localStorage.setItem(STORAGE_KEYS.USE_CASE, uc);
  };

  const setMood = (m) => {
    setMoodState(m);
    localStorage.setItem(STORAGE_KEYS.MOOD, m);
  };

  const setHeadingFontId = (id) => {
    setHeadingFontIdState(id);
    localStorage.setItem(STORAGE_KEYS.HEADING_FONT, id);
  };

  const setBodyFontId = (id) => {
    setBodyFontIdState(id);
    localStorage.setItem(STORAGE_KEYS.BODY_FONT, id);
  };

  const overridePaletteColor = (roleKey, hex) => {
    setColorOverrides((prev) => ({
      ...prev,
      [roleKey]: normalizeHex(hex),
    }));
  };

  const resetPaletteOverrides = () => {
    setColorOverrides({});
  };

  const updateTypographySetting = (key, value) => {
    setTypographySettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveCurrentPalette = (name) => {
    const newSaved = {
      id: Date.now().toString(),
      name: name || `${harmonyType.toUpperCase()} Palette`,
      palette: activePalette,
      harmonyType,
      useCase,
      mood,
      headingFont: headingFont.name,
      bodyFont: bodyFont.name,
      createdAt: new Date().toLocaleDateString(),
    };
    const updated = [newSaved, ...savedPalettes];
    setSavedPalettes(updated);
    localStorage.setItem(STORAGE_KEYS.SAVED_PALETTES, JSON.stringify(updated));
    return newSaved;
  };

  const removeSavedPalette = (id) => {
    const updated = savedPalettes.filter((p) => p.id !== id);
    setSavedPalettes(updated);
    localStorage.setItem(STORAGE_KEYS.SAVED_PALETTES, JSON.stringify(updated));
  };

  const applySavedPalette = (saved) => {
    if (saved.palette?.primary) {
      setPrimaryColor(saved.palette.primary);
    }
    if (saved.harmonyType) setHarmonyType(saved.harmonyType);
    if (saved.useCase) setUseCase(saved.useCase);
    if (saved.mood) setMood(saved.mood);
  };

  return (
    <DesignContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        harmonyType,
        setHarmonyType,
        useCase,
        setUseCase,
        mood,
        setMood,
        activePalette,
        allHarmonies,
        colorOverrides,
        overridePaletteColor,
        resetPaletteOverrides,
        headingFont,
        bodyFont,
        headingFontId,
        setHeadingFontId,
        bodyFontId,
        setBodyFontId,
        typographySettings,
        updateTypographySetting,
        savedPalettes,
        saveCurrentPalette,
        removeSavedPalette,
        applySavedPalette,
        recentColors,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}
