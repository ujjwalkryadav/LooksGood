// Utilities for generating CSS Variables, Tailwind Config, and Design Tokens

export function generateCssVariables(palette, headingFont, bodyFont) {
  return `:root {
  /* LooksGood Color Tokens */
  --color-primary: ${palette.primary};
  --color-supporting: ${palette.supporting || palette.primary};
  --color-accent: ${palette.accent};
  --color-background: ${palette.background};
  --color-surface: ${palette.surface};
  --color-text: ${palette.text};
  --color-text-muted: ${palette.mutedText};
  --color-border: ${palette.border};
  --color-success: ${palette.success || '#10B981'};
  --color-warning: ${palette.warning || '#F59E0B'};
  --color-error: ${palette.error || '#EF4444'};

  /* LooksGood Typography Tokens */
  --font-heading: ${headingFont?.family || '"Plus Jakarta Sans", sans-serif'};
  --font-body: ${bodyFont?.family || '"Inter", sans-serif'};
}`;
}

export function generateTailwindConfigSnippet(palette, headingFont, bodyFont) {
  return `// Add to your tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        looksgood: {
          primary: '${palette.primary}',
          supporting: '${palette.supporting || palette.primary}',
          accent: '${palette.accent}',
          bg: '${palette.background}',
          surface: '${palette.surface}',
          text: '${palette.text}',
          muted: '${palette.mutedText}',
          border: '${palette.border}',
        },
      },
      fontFamily: {
        heading: [${headingFont?.family ? headingFont.family.split(',')[0] : '"Plus Jakarta Sans"'}, 'sans-serif'],
        body: [${bodyFont?.family ? bodyFont.family.split(',')[0] : '"Inter"'}, 'sans-serif'],
      },
    },
  },
};`;
}

export function generateDesignTokensJson(palette, headingFont, bodyFont, useCase, mood) {
  return JSON.stringify(
    {
      meta: {
        generator: 'LooksGood — Know what looks good',
        version: '1.0.0',
        useCase: useCase || 'website',
        mood: mood || 'modern',
        exportedAt: new Date().toISOString(),
      },
      colors: {
        primary: { value: palette.primary, type: 'color', role: 'Brand Core & Action' },
        supporting: { value: palette.supporting, type: 'color', role: 'Secondary UI & Structure' },
        accent: { value: palette.accent, type: 'color', role: 'Highlights & Badges' },
        background: { value: palette.background, type: 'color', role: 'Page Canvas' },
        surface: { value: palette.surface, type: 'color', role: 'Card & Container' },
        text: { value: palette.text, type: 'color', role: 'Body Typography' },
        textMuted: { value: palette.mutedText, type: 'color', role: 'Subtitles & Captions' },
        border: { value: palette.border, type: 'color', role: 'Dividers & Outlines' },
      },
      typography: {
        heading: {
          fontFamily: headingFont?.family || 'Inter, sans-serif',
          name: headingFont?.name || 'Inter',
          weights: headingFont?.weights || [700],
        },
        body: {
          fontFamily: bodyFont?.family || 'Inter, sans-serif',
          name: bodyFont?.name || 'Inter',
          weights: bodyFont?.weights || [400, 500],
        },
      },
    },
    null,
    2
  );
}
