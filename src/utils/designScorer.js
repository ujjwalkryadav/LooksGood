// Unified Design Decision Scorer evaluating Color, Typography, Contrast, and Hierarchy

import { calculateColorScore, getContrastRatio } from './colorUtils';
import { getPairingsForHeading } from '../data/fontsData';

export function calculateOverallDesignScore({ palette, headingFont, bodyFont, useCase, mood }) {
  // 1. Color Metrics
  const colorReport = calculateColorScore(palette);
  const harmonyScore = colorReport.breakdown.harmony;
  const contrastScore = colorReport.breakdown.contrast;
  const accessibilityScore = colorReport.breakdown.accessibility;

  // 2. Typography Metrics
  let typographyScore = 88;
  const pairings = getPairingsForHeading(headingFont.id);
  const matchingPair = pairings.find(p => p.fontId === bodyFont.id);
  if (matchingPair) {
    typographyScore = matchingPair.score;
  } else if (headingFont.id === bodyFont.id) {
    typographyScore = 78; // same font is acceptable but less dynamic hierarchy
  } else if (headingFont.category !== bodyFont.category) {
    typographyScore = 92; // good category differentiation
  }

  // 3. Hierarchy & Role Balance
  let hierarchyScore = 90;
  const headingBodyContrast = getContrastRatio(palette.text, palette.background);
  if (headingBodyContrast < 4.5) {
    hierarchyScore -= 20;
  }
  if (headingFont.id === bodyFont.id) {
    hierarchyScore -= 10;
  }

  // Overall Weighted Score (0 to 100)
  const overall = Math.round(
    harmonyScore * 0.22 +
    contrastScore * 0.25 +
    accessibilityScore * 0.23 +
    typographyScore * 0.18 +
    hierarchyScore * 0.12
  );

  // Generate actionable "One thing to improve" and targeted feedback
  const recommendations = [];

  if (contrastScore < 85) {
    recommendations.push({
      category: 'Contrast',
      title: 'Boost body text darkness',
      detail: `Your current text-to-background ratio is ${getContrastRatio(palette.text, palette.background)}:1. Aiming for 7:1+ (AAA) provides world-class clarity.`,
      actionLabel: 'Darken Text',
    });
  }

  if (headingFont.id === bodyFont.id) {
    recommendations.push({
      category: 'Typography',
      title: 'Differentiate heading and body fonts',
      detail: `Both heading and body are set to ${headingFont.name}. Pairing a punchy display or geometric font with a neutral sans serif creates stronger visual hierarchy.`,
      actionLabel: 'Try Recommended Pairing',
    });
  }

  if (colorReport.suggestions && colorReport.suggestions.length > 0 && colorReport.suggestions[0].type !== 'praise') {
    recommendations.push({
      category: 'Color Harmony',
      title: 'Refine accent role',
      detail: colorReport.suggestions[0].text,
      actionLabel: colorReport.suggestions[0].action,
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      category: 'Design Balance',
      title: 'Production-ready harmony!',
      detail: `Your combination of ${headingFont.name} + ${bodyFont.name} with your chosen palette delivers outstanding readability and contemporary polish.`,
      actionLabel: 'Looks Great!',
    });
  }

  return {
    overall,
    breakdown: {
      colorHarmony: harmonyScore,
      contrast: contrastScore,
      accessibility: accessibilityScore,
      typography: typographyScore,
      hierarchy: hierarchyScore,
    },
    recommendations,
  };
}
