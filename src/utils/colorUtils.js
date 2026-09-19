// Color mathematics, conversion, harmonies, WCAG 2.1 contrast, and optimization

export function hexToRgb(hex) {
  if (!hex) return { r: 0, g: 0, b: 0 };
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6) return { r: 108, g: 99, b: 255 }; // fallback
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 108, g: 99, b: 255 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r, g, b) {
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  h /= 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

export function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

export function isValidHex(hex) {
  return /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex?.trim() || '');
}

export function normalizeHex(hex) {
  if (!hex) return '#6C63FF';
  let clean = hex.trim();
  if (!clean.startsWith('#')) clean = '#' + clean;
  if (clean.length === 4) {
    clean = '#' + clean[1] + clean[1] + clean[2] + clean[2] + clean[3] + clean[3];
  }
  return isValidHex(clean) ? clean.toUpperCase() : '#6C63FF';
}

// WCAG 2.1 Relative Luminance calculation
export function getRelativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const transform = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const R = transform(r);
  const G = transform(g);
  const B = transform(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// Contrast ratio (1.0 to 21.0)
export function getContrastRatio(hex1, hex2) {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return parseFloat(ratio.toFixed(2));
}

// Contrast compliance assessment
export function evaluateContrast(ratio) {
  return {
    ratio,
    bodyAA: ratio >= 4.5,
    bodyAAA: ratio >= 7.0,
    headingAA: ratio >= 3.0,
    headingAAA: ratio >= 4.5,
    uiComponents: ratio >= 3.0,
    scoreRating:
      ratio >= 7.0
        ? 'Excellent (AAA)'
        : ratio >= 4.5
        ? 'Good (AA)'
        : ratio >= 3.0
        ? 'Passes Large Text'
        : 'Poor Contrast',
    status: ratio >= 4.5 ? 'pass' : ratio >= 3.0 ? 'warning' : 'fail',
  };
}

// Auto-suggest accessible alternative colors
export function getSuggestedAlternatives(fgHex, bgHex, targetRatio = 4.5) {
  const bgHsl = hexToHsl(bgHex);
  const fgHsl = hexToHsl(fgHex);
  const isBgLight = bgHsl.l > 50;

  const suggestions = [];

  // 1. Darker/Lighter direct tint with same hue
  for (let step = 1; step <= 95; step += 3) {
    const testLightness = isBgLight ? Math.max(0, fgHsl.l - step) : Math.min(100, fgHsl.l + step);
    const candidate = hslToHex(fgHsl.h, fgHsl.s, testLightness);
    if (getContrastRatio(candidate, bgHex) >= targetRatio) {
      suggestions.push({
        hex: candidate,
        label: isBgLight ? 'Deep Tint' : 'Bright Tint',
        ratio: getContrastRatio(candidate, bgHex),
      });
      break;
    }
  }

  // 2. High-contrast neutral
  const neutralCandidate = isBgLight ? '#171725' : '#FFFFFF';
  suggestions.push({
    hex: neutralCandidate,
    label: isBgLight ? 'Solid Dark Slate' : 'Pure White',
    ratio: getContrastRatio(neutralCandidate, bgHex),
  });

  // 3. Complementary contrast booster
  const compHue = (fgHsl.h + 180) % 360;
  const compCandidate = hslToHex(compHue, Math.min(fgHsl.s, 60), isBgLight ? 15 : 90);
  if (getContrastRatio(compCandidate, bgHex) >= targetRatio) {
    suggestions.push({
      hex: compCandidate,
      label: 'Harmonic Contrast',
      ratio: getContrastRatio(compCandidate, bgHex),
    });
  }

  return suggestions;
}

// Calculate color relationships from primary
export function calculateHarmonies(primaryHex) {
  const { h, s, l } = hexToHsl(primaryHex);

  const wrap = (val) => ((val % 360) + 360) % 360;

  return {
    complementary: {
      name: 'Complementary',
      description: 'Colors opposite on the color wheel. Maximum visual energy and punchy contrast.',
      colors: [
        { role: 'Primary', hex: hslToHex(h, s, l), use: 'Brand hero, main CTA, key elements' },
        { role: 'Supporting', hex: hslToHex(h, Math.max(20, s - 25), Math.min(85, l + 15)), use: 'Hover states, secondary badges, cards' },
        { role: 'Accent', hex: hslToHex(wrap(h + 180), Math.min(100, s + 10), Math.max(45, Math.min(65, l))), use: 'Notice me badges, notifications, focal points' },
        { role: 'Background', hex: hslToHex(h, 25, 98), use: 'Page canvas, main container' },
        { role: 'Text', hex: hslToHex(h, 30, 12), use: 'Body paragraphs, readable headers' },
      ],
      why: 'Opposite hues create natural visual tension. The primary establishes brand identity while the complementary accent immediately commands the eye.',
    },
    analogous: {
      name: 'Analogous',
      description: 'Adjacent colors on the wheel. Smooth, harmonious, cohesive, and easy on the eyes.',
      colors: [
        { role: 'Primary', hex: hslToHex(h, s, l), use: 'Main actions, brand identity' },
        { role: 'Supporting', hex: hslToHex(wrap(h + 30), Math.max(20, s - 10), l), use: 'Sub-headers, related cards, gradients' },
        { role: 'Accent', hex: hslToHex(wrap(h - 30), Math.min(100, s + 15), Math.max(35, l - 5)), use: 'Highlights, tags, category pills' },
        { role: 'Background', hex: hslToHex(wrap(h + 15), 20, 97), use: 'Subtle atmospheric page background' },
        { role: 'Text', hex: hslToHex(wrap(h - 15), 35, 13), use: 'High contrast readable text' },
      ],
      why: 'Neighbors on the color wheel share dominant undertones, evoking a calm, unified, and intentional natural atmosphere.',
    },
    triadic: {
      name: 'Triadic',
      description: 'Three colors equally spaced (120° apart). Vibrant, playful, balanced, and diverse.',
      colors: [
        { role: 'Primary', hex: hslToHex(h, s, l), use: 'Core brand, buttons, active tabs' },
        { role: 'Supporting', hex: hslToHex(wrap(h + 120), Math.max(30, s - 15), Math.min(60, l)), use: 'Secondary UI, charts, sidebar accents' },
        { role: 'Accent', hex: hslToHex(wrap(h + 240), Math.min(95, s + 5), Math.max(48, l)), use: 'Important alerts, conversion triggers' },
        { role: 'Background', hex: hslToHex(h, 15, 98), use: 'Clean neutral canvas' },
        { role: 'Text', hex: hslToHex(wrap(h + 240), 25, 12), use: 'Deep, tinted body text' },
      ],
      why: 'Spanning equal thirds across the spectrum delivers balanced variety without any single hue overpowering the composition.',
    },
    splitComplementary: {
      name: 'Split Complementary',
      description: 'Primary plus the two colors flanking its opposite (150° & 210°). High contrast with gentler nuance.',
      colors: [
        { role: 'Primary', hex: hslToHex(h, s, l), use: 'Primary actions, navigation branding' },
        { role: 'Supporting', hex: hslToHex(wrap(h + 150), Math.max(30, s - 10), Math.min(55, l)), use: 'Secondary features, card borders' },
        { role: 'Accent', hex: hslToHex(wrap(h + 210), Math.min(95, s + 10), Math.max(50, l)), use: 'Direct response buttons, highlights' },
        { role: 'Background', hex: hslToHex(h, 18, 98), use: 'Soft page base' },
        { role: 'Text', hex: hslToHex(h, 25, 14), use: 'Rich dark text' },
      ],
      why: 'Offers the high contrast of complementary palettes while introducing subtle color nuance that prevents visual fatigue.',
    },
    monochromatic: {
      name: 'Monochromatic',
      description: 'Shades, tints, and tones of a single hue. Ultra clean, sophisticated, minimal, and foolproof.',
      colors: [
        { role: 'Primary', hex: hslToHex(h, s, l), use: 'Core brand identity and primary focus' },
        { role: 'Supporting', hex: hslToHex(h, Math.max(25, s - 20), Math.min(85, l + 22)), use: 'Soft cards, secondary buttons' },
        { role: 'Accent', hex: hslToHex(h, Math.min(100, s + 20), Math.max(25, l - 22)), use: 'High-contrast accents and badges' },
        { role: 'Background', hex: hslToHex(h, 20, 97), use: 'Tinted clean background' },
        { role: 'Text', hex: hslToHex(h, 45, 10), use: 'Deep tonal dark text' },
      ],
      why: 'Zero hue clash. By varying only lightness and saturation, you achieve an effortless, high-end, and cohesive aesthetic.',
    },
    tetradic: {
      name: 'Tetradic (Rectangle)',
      description: 'Four colors arranged in two complementary pairs. Rich, versatile, and dynamic.',
      colors: [
        { role: 'Primary', hex: hslToHex(h, s, l), use: 'Dominant brand focus' },
        { role: 'Supporting', hex: hslToHex(wrap(h + 90), Math.max(30, s - 15), l), use: 'Complementary card accents' },
        { role: 'Accent', hex: hslToHex(wrap(h + 180), Math.min(95, s + 5), Math.max(45, l)), use: 'Key conversion buttons' },
        { role: 'Background', hex: hslToHex(h, 15, 98), use: 'Spacious backdrop' },
        { role: 'Text', hex: hslToHex(wrap(h + 270), 30, 12), use: 'Deep text tone' },
      ],
      why: 'Provides the maximum palette breadth for complex user interfaces, charts, and multi-tier data displays.',
    },
  };
}

// Generate tailored palette tokens for specific use cases
export function generateUseCasePalette(primaryHex, useCaseId, moodId, harmonyType = 'complementary') {
  const harmonies = calculateHarmonies(primaryHex);
  const selectedHarmony = harmonies[harmonyType] || harmonies.complementary;
  const base = selectedHarmony.colors;

  const primary = base.find(c => c.role === 'Primary')?.hex || primaryHex;
  const supporting = base.find(c => c.role === 'Supporting')?.hex || hslToHex(hexToHsl(primaryHex).h + 20, 70, 60);
  const accent = base.find(c => c.role === 'Accent')?.hex || hslToHex(hexToHsl(primaryHex).h + 180, 80, 50);
  let background = base.find(c => c.role === 'Background')?.hex || '#FAFAFC';
  let text = base.find(c => c.role === 'Text')?.hex || '#171725';

  const pHsl = hexToHsl(primary);

  // Mood adjustments
  if (moodId === 'luxury') {
    background = '#0F0F14';
    text = '#F5F5F7';
  } else if (moodId === 'minimal') {
    background = '#FFFFFF';
    text = '#111115';
  } else if (moodId === 'tech') {
    background = '#0B0F19';
    text = '#F0F4F8';
  } else if (moodId === 'playful') {
    background = hslToHex(pHsl.h, 25, 97);
    text = '#1E1B4B';
  }

  // Ensure minimum contrast
  if (getContrastRatio(text, background) < 4.5) {
    text = hexToHsl(background).l > 50 ? '#121217' : '#FFFFFF';
  }

  const surface = hexToHsl(background).l > 50 ? '#FFFFFF' : '#1A1A24';
  const border = hexToHsl(background).l > 50 ? '#E4E4E7' : '#2A2A38';
  const mutedText = hexToHsl(background).l > 50 ? '#71717A' : '#A1A1AA';

  return {
    primary,
    supporting,
    accent,
    background,
    surface,
    text,
    mutedText,
    border,
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  };
}

// Color health score algorithm
export function calculateColorScore(palette) {
  const { primary, accent, background, text, surface } = palette;
  
  // 1. Contrast Score
  const textBgRatio = getContrastRatio(text, background);
  const textSurfaceRatio = getContrastRatio(text, surface);
  const contrastMetric = Math.min(100, Math.round(((Math.min(textBgRatio, 15) / 12) * 50) + ((Math.min(textSurfaceRatio, 15) / 12) * 50)));

  // 2. Accessibility Score
  const primaryOnBg = getContrastRatio(primary, background);
  const accentOnBg = getContrastRatio(accent, background);
  const accessibilityMetric = Math.min(100, Math.round(
    (textBgRatio >= 7.0 ? 50 : textBgRatio >= 4.5 ? 40 : 15) +
    (primaryOnBg >= 3.0 ? 30 : 15) +
    (accentOnBg >= 3.0 ? 20 : 10)
  ));

  // 3. Harmony Score
  const pHsl = hexToHsl(primary);
  const aHsl = hexToHsl(accent);
  const hueDiff = Math.abs(pHsl.h - aHsl.h);
  const normalizedHueDiff = hueDiff > 180 ? 360 - hueDiff : hueDiff;
  // Good harmony has intentional distance (e.g. monochromatic < 20 or complementary > 140 or analogous 25-45)
  const isHarmonic = normalizedHueDiff > 130 || (normalizedHueDiff >= 25 && normalizedHueDiff <= 55) || normalizedHueDiff < 15;
  const harmonyMetric = isHarmonic ? 94 : 78;

  // 4. Balance Score (Saturation & Lightness distribution)
  const sBalance = Math.abs(pHsl.s - 65) < 30 ? 45 : 35;
  const lBalance = pHsl.l >= 25 && pHsl.l <= 75 ? 45 : 30;
  const balanceMetric = Math.min(100, sBalance + lBalance + 10);

  const overall = Math.round((contrastMetric * 0.35) + (accessibilityMetric * 0.3) + (harmonyMetric * 0.2) + (balanceMetric * 0.15));

  const suggestions = [];
  if (textBgRatio < 4.5) {
    suggestions.push({
      type: 'contrast',
      text: 'Text contrast on background is low (' + textBgRatio + ':1). Choose a darker text color for effortless readability.',
      action: 'Darken text',
    });
  }
  if (primaryOnBg < 3.0) {
    suggestions.push({
      type: 'accessibility',
      text: 'Your primary color blends slightly into the background. Increase its contrast for clearer button boundaries.',
      action: 'Boost primary punch',
    });
  }
  if (normalizedHueDiff > 0 && normalizedHueDiff < 20 && Math.abs(pHsl.l - aHsl.l) < 15) {
    suggestions.push({
      type: 'accent',
      text: 'Your accent color is very close to your primary color. Try a stronger contrasting accent to highlight key actions.',
      action: 'Shift accent',
    });
  }
  if (pHsl.s > 92 && pHsl.l < 45) {
    suggestions.push({
      type: 'vibrancy',
      text: 'Ultra-saturated dark colors can strain eyes on bright displays. Softening saturation by 10% creates a more premium feel.',
      action: 'Soft tone',
    });
  }
  if (suggestions.length === 0) {
    suggestions.push({
      type: 'praise',
      text: 'Excellent balance! High contrast, harmonious undertones, and clear interactive hierarchy.',
      action: 'Perfect',
    });
  }

  return {
    overall,
    breakdown: {
      harmony: harmonyMetric,
      contrast: contrastMetric,
      accessibility: accessibilityMetric,
      balance: balanceMetric,
    },
    suggestions,
  };
}

export const generateHarmonies = calculateHarmonies;
