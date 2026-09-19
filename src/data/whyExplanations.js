// Comprehensive design rationale database for the "Why This Works" system

export function getWhyColorExplanation({ primaryHex, secondaryHex, accentHex, harmonyType, useCase }) {
  const harmonies = {
    complementary: {
      title: 'High-Impact Complementary Dynamic',
      explanation:
        'Complementary colors sit directly opposite each other on the color wheel. The primary establishes the dominant brand personality, while the opposite accent triggers maximum contrast in the human retina. This makes the accent the perfect magnet for buttons, price tags, and critical conversion points.',
      takeaway: 'Use your primary for 80% of brand surfaces, and save the sharp complementary accent exclusively for actions you want users to take.',
    },
    analogous: {
      title: 'Natural Cohesion and Visual Calm',
      explanation:
        'Analogous colors sit side-by-side on the color wheel, sharing common chromatic undertones. Because they naturally occur together in nature (like sunsets or ocean waves), the brain processes them with zero visual friction, producing an effortlessly serene and unified interface.',
      takeaway: 'Ideal for serene dashboards, content readers, and portfolios where visual unity takes precedence over aggressive alerts.',
    },
    triadic: {
      title: 'Vibrant Equilibrium Across Three Dimensions',
      explanation:
        'Triadic schemes form an equilateral triangle across the color spectrum. This provides rich chromatic diversity while maintaining perfect geometric balance. One color dominates, the second supports structure, and the third provides energetic accents.',
      takeaway: 'Perfect for data dashboards, colorful branding, and SaaS apps that need distinct status badges without clashing.',
    },
    splitComplementary: {
      title: 'Sophisticated Contrast with Reduced Tension',
      explanation:
        'Instead of taking the direct opposite color, split complementary uses the two colors flanking the opposite. You get 90% of the punch of complementary contrast, but with added visual richness and softer, more nuanced aesthetic transitions.',
      takeaway: 'A designer favorite for modern digital products that require high contrast without feeling overly aggressive.',
    },
    monochromatic: {
      title: 'Timeless Elegance & Guaranteed Cohesion',
      explanation:
        'Monochromatic palettes utilize varying tints, tones, and shades of a single hue. Because the hue never changes, it is mathematically impossible for the colors to clash. Contrast is achieved purely through lightness and saturation variations.',
      takeaway: 'The safest, most foolproof palette for luxury brands, minimalist tech utilities, and clean documentation.',
    },
    tetradic: {
      title: 'Versatile Multi-Role Chromatic Matrix',
      explanation:
        'Tetradic palettes combine two complementary pairs (four distinct colors). This gives you the widest possible palette palette breadth to color-code categories, charts, navigational tabs, and user roles.',
      takeaway: 'Always assign one color as dominant (60%) and keep the remaining three in secondary/accent support roles.',
    },
  };

  return harmonies[harmonyType] || harmonies.complementary;
}

export function getWhyFontPairingExplanation({ headingName, bodyName, headingCategory, bodyCategory }) {
  if (headingCategory === 'Serif' && (bodyCategory === 'Sans Serif' || bodyCategory === 'Geometric Sans')) {
    return {
      title: 'The Classic Serif + Sans Hierarchy',
      explanation: `Pairing a ${headingCategory} headline (${headingName}) with a clean ${bodyCategory} body (${bodyName}) creates the gold standard of editorial contrast. The ornate serifs draw the eye into the headline, while the neutral sans-serif ensures fatigue-free reading across paragraphs.`,
      principle: 'Contrast of Form & Function',
    };
  }

  if (headingCategory === 'Display Sans' && (bodyCategory === 'Sans Serif' || bodyCategory === 'Neo-Grotesque')) {
    return {
      title: 'High-Impact Display + Workhorse Clarity',
      explanation: `Display headlines like ${headingName} bring huge personality, condensed volume, and punchy visual energy. Pairing it with a disciplined workhorse like ${bodyName} grounds the design and ensures small UI text remains crystal clear.`,
      principle: 'Energy vs Legibility Equilibrium',
    };
  }

  if (headingCategory === 'Geometric Sans' && bodyCategory === 'Sans Serif') {
    return {
      title: 'Modern Geometric Synergy',
      explanation: `${headingName} provides circular geometric optimism in titles, while ${bodyName} handles dense information with tall x-heights and open apertures. This creates a fresh, approachable, and tech-forward atmosphere.`,
      principle: 'Shared Modernist DNA',
    };
  }

  return {
    title: 'Harmonious Typographic Scale',
    explanation: `${headingName} and ${bodyName} establish clear structural hierarchy through distinct weight and character differentiation, guiding readers effortlessly down the page.`,
    principle: 'Visual Flow & Scanning Ease',
  };
}

export function getWhyContrastExplanation(ratio, isPass) {
  if (ratio >= 7.0) {
    return {
      title: 'WCAG AAA Enhanced Accessibility (7.0:1+)',
      explanation:
        'This contrast level exceeds the strictest international accessibility guidelines. It ensures effortless readability for users with low vision, color blindness, and anyone reading on mobile screens under direct sunlight.',
      verdict: 'Flawless Readability',
    };
  } else if (ratio >= 4.5) {
    return {
      title: 'WCAG AA Standard Compliance (4.5:1+)',
      explanation:
        'This ratio meets the global web standard for standard body copy. It provides comfortable reading contrast without straining eyes during prolonged sessions.',
      verdict: 'Production Ready',
    };
  } else if (ratio >= 3.0) {
    return {
      title: 'Large Text & UI Boundary Pass (3.0:1+)',
      explanation:
        'This ratio is acceptable for large headings (18pt+ / 24px+ bold) and non-text UI components like borders and buttons, but falls short for standard small body copy.',
      verdict: 'Suitable for Headings Only',
    };
  } else {
    return {
      title: 'Insufficient Visual Contrast (< 3.0:1)',
      explanation:
        'The foreground and background colors are too close in relative luminance. Text at this level is difficult or impossible for many users to read comfortably and fails web accessibility standards.',
      verdict: 'Action Required',
    };
  }
}
