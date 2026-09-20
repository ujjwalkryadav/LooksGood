// Google AI Studio (Gemini API) Service for LooksGood Design Assistant

const DEFAULT_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-1.5-flash';

export const GEMINI_API_KEY_STORAGE_KEY = 'looksgood_gemini_api_key';

export function getStoredApiKey() {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
  if (stored && stored.trim()) return stored.trim();
  // Check env variable
  try {
    const envKey = import.meta.env?.VITE_GEMINI_API_KEY;
    if (envKey && envKey.trim()) return envKey.trim();
  } catch {
    // ignore
  }
  return '';
}

export function saveStoredApiKey(key) {
  if (typeof window === 'undefined') return;
  if (key && key.trim()) {
    localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
  }
}

export async function testGeminiApiKey(apiKey) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('API key is empty. Please provide a valid Google AI Studio key.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey.trim()}`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Respond with the single word: READY' }] }],
      generationConfig: { maxOutputTokens: 10 },
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message = errData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  return true;
}

const DESIGN_SYSTEM_JSON_STRUCTURE = `{
  "brandName": "Concept / Brand Name",
  "tagline": "A punchy, memorable brand tagline",
  "conceptSummary": "2-3 sentences explaining the design rationale and aesthetic direction",
  "personalityTags": ["Modern", "Trustworthy", "Vibrant", "Minimalist"],
  "colors": {
    "primary": { "hex": "#7C3AED", "name": "Electric Iris", "usage": "Main action buttons, primary brand markers, hero highlights (60% weight dominance in brand presence)", "psychology": "Conveys innovation, creativity, and futuristic confidence" },
    "secondary": { "hex": "#1E1B4B", "name": "Deep Midnight Navy", "usage": "Dark surfaces, card borders, high-contrast badges (30% weight)", "psychology": "Anchors the interface with structural stability and luxury depth" },
    "accent": { "hex": "#EC4899", "name": "Vivid Pink / Neon Rose", "usage": "Notifications, special badges, active interactive states, CTAs (10% pop)", "psychology": "Creates energetic focal points that guide user eyes to conversions" },
    "background": { "hex": "#FAF9F6", "name": "Warm Alabaster Canvas", "usage": "Main page canvas, subtle frosted cards", "psychology": "Clean, editorial, reduces eye fatigue" },
    "text": { "hex": "#0D0C0B", "name": "Deep Onyx", "usage": "Headlines, body copy, key data metrics for AAA readability", "psychology": "Max legibility and crisp contrast" },
    "additionalShades": [
      { "role": "Surface / Card", "hex": "#FFFFFF" },
      { "role": "Muted Border", "hex": "#E5E7EB" },
      { "role": "Subtle Text", "hex": "#6B7280" }
    ]
  },
  "typography": {
    "displayHeadingFont": {
      "name": "Playfair Display",
      "category": "Serif",
      "googleFontQuery": "family=Playfair+Display:wght@600;700;800",
      "weights": "600, 700, 800",
      "whyItWorks": "Dramatic high-contrast serifs convey prestige, authority, and editorial finesse."
    },
    "subheadingFont": {
      "name": "Plus Jakarta Sans",
      "category": "Sans Serif",
      "googleFontQuery": "family=Plus+Jakarta+Sans:wght@500;600;700",
      "weights": "500, 600, 700",
      "whyItWorks": "Modern geometric curves balance friendliness with sharp geometric precision."
    },
    "bodyFont": {
      "name": "Inter",
      "category": "Sans Serif",
      "googleFontQuery": "family=Inter:wght@400;500;600",
      "weights": "400, 500, 600",
      "whyItWorks": "Tall x-height optimized specifically for screens to ensure effortless readability at 14px-16px."
    },
    "scaleLadder": [
      { "level": "Hero / Display", "size": "48px - 64px", "lineHeight": "1.1", "letterSpacing": "-0.02em" },
      { "level": "H1 Heading", "size": "36px - 40px", "lineHeight": "1.2", "letterSpacing": "-0.015em" },
      { "level": "H2 Subheading", "size": "24px - 28px", "lineHeight": "1.3", "letterSpacing": "-0.01em" },
      { "level": "Body Regular", "size": "16px", "lineHeight": "1.6", "letterSpacing": "0em" },
      { "level": "Caption / Small UI", "size": "12px - 14px", "lineHeight": "1.4", "letterSpacing": "+0.01em" }
    ],
    "googleFontsCdnLink": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap"
  },
  "uiComponentStyles": {
    "borderRadius": "16px (rounded-2xl) for friendly modern elegance",
    "shadowStyle": "Multi-layered ambient soft shadow with 4% opacity black and subtle color tint",
    "borderTreatment": "1px translucent border (rgba(0,0,0,0.08) or rgba(255,255,255,0.12))",
    "vibeAesthetic": "Modern High-End Minimalist Glassmorphism",
    "dos": [
      "Use the primary color for primary CTAs and key brand anchors only",
      "Keep generous 24px-32px whitespace between section blocks",
      "Pair high-contrast display headlines with clean sans-serif body copy"
    ],
    "donts": [
      "Don't use pure black (#000000) for large backgrounds — use deep tinted darks like #0B0F19",
      "Avoid combining more than two distinct display font styles",
      "Don't place low-contrast accent text on bright primary backgrounds"
    ]
  },
  "mockPreviewData": {
    "heroTitle": "Experience the Next Era of Digital Craftsmanship",
    "heroSubtitle": "Engineered for creators who obsess over typography, color precision, and spatial harmony.",
    "ctaButtonText": "Get Started Free",
    "secondaryButtonText": "Explore Design System",
    "featureCards": [
      { "title": "Harmonic Colors", "desc": "Scientifically calibrated 60-30-10 color schemes." },
      { "title": "Precision Typography", "desc": "Google Fonts pairings tailored for legibility & mood." },
      { "title": "Ready for Code", "desc": "Instant export to Tailwind CSS, CSS variables, and JSON." }
    ]
  }
}`;

export async function generateDesignSystemWithGemini({
  promptText,
  industry,
  mood,
  style,
  targetAudience,
  apiKey,
}) {
  const effectiveKey = apiKey || getStoredApiKey();

  // If no API key is provided, generate via the intelligent built-in generator
  if (!effectiveKey) {
    return generateOfflineDesignSystem({ promptText, industry, mood, style, targetAudience });
  }

  const systemInstruction = `You are a world-class Design Director, Chief Brand Strategist, and UI/UX Design System Architect.
Given a user's concept, brand idea, industry, mood, or audience, you generate a complete, production-ready, beautiful Brand & Design System Guide.
You MUST output ONLY raw, valid JSON matching the exact schema specified below. Do not wrap in markdown code blocks if possible, or use standard \`\`\`json.

The colors must strictly include:
- primary (HEX)
- secondary (HEX)
- accent (HEX)
- background (HEX)
- text (HEX)
All HEX codes must be valid 6-character strings like '#7C3AED'.

The typography must pick real, famous, high-quality Google Fonts (e.g. Inter, Poppins, Playfair Display, Space Grotesk, Plus Jakarta Sans, DM Sans, Outfit, Cinzel, Montserrat, Syne, Sora, Newsreader, Cabin, Fraunces, Lora, Work Sans, Epilogue). Include the real Google Fonts CDN link.

JSON Schema format to follow:
${DESIGN_SYSTEM_JSON_STRUCTURE}
`;

  const userQuery = `Generate a complete design system & brand guide for:
Concept / Description: "${promptText || 'Modern innovative platform'}"
Industry: ${industry || 'Tech & Digital Products'}
Mood / Vibe: ${mood || 'Modern, Sleek, Professional'}
Aesthetic Style: ${style || 'Clean Minimalist with Rich Gradients'}
Target Audience: ${targetAudience || 'Modern designers, creators, and discerning customers'}
`;

  const modelsToTry = [DEFAULT_MODEL, FALLBACK_MODEL];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveKey}`;
      
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\n${userQuery}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 2500,
          responseMimeType: 'application/json',
        },
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (!rawText) {
        throw new Error('Received empty response from Gemini API.');
      }

      // Parse JSON from returned text
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      return sanitizeDesignSystem(parsed, promptText);
    } catch (err) {
      lastError = err;
      console.warn(`Attempt with ${model} failed:`, err);
      // Continue to next model if available
    }
  }

  // If both models failed due to API quota, network, etc., return fallback with warning
  console.error('All Gemini API attempts failed. Falling back to built-in synthesizer:', lastError);
  const fallback = generateOfflineDesignSystem({ promptText, industry, mood, style, targetAudience });
  fallback._warning = `Gemini API notice: ${lastError?.message || 'Connection error'}. Showing smart algorithmic synthesized guide.`;
  return fallback;
}

function sanitizeDesignSystem(data, originalPrompt) {
  if (!data || typeof data !== 'object') {
    return generateOfflineDesignSystem({ promptText: originalPrompt });
  }

  const safeHex = (hex, fallback) => {
    if (typeof hex === 'string' && /^#[0-9A-F]{6}$/i.test(hex)) return hex.toUpperCase();
    return fallback;
  };

  return {
    brandName: data.brandName || 'Generative Design Concept',
    tagline: data.tagline || 'Crafted with harmonic precision and typography science',
    conceptSummary: data.conceptSummary || 'A bespoke visual identity balancing modern aesthetics with high-contrast accessibility.',
    personalityTags: Array.isArray(data.personalityTags) && data.personalityTags.length ? data.personalityTags : ['Modern', 'Creative', 'Harmonic', 'Balanced'],
    colors: {
      primary: {
        hex: safeHex(data.colors?.primary?.hex, '#7C3AED'),
        name: data.colors?.primary?.name || 'Primary Key',
        usage: data.colors?.primary?.usage || 'Core brand elements and hero actions (60% weight dominance)',
        psychology: data.colors?.primary?.psychology || 'Inspires confidence, innovation and visual focus',
      },
      secondary: {
        hex: safeHex(data.colors?.secondary?.hex, '#1E1B4B'),
        name: data.colors?.secondary?.name || 'Secondary Base',
        usage: data.colors?.secondary?.usage || 'Supporting structural layers, dark accents, badges (30% weight)',
        psychology: data.colors?.secondary?.psychology || 'Provides structural grounding and stability',
      },
      accent: {
        hex: safeHex(data.colors?.accent?.hex, '#EC4899'),
        name: data.colors?.accent?.name || 'Vibrant Accent',
        usage: data.colors?.accent?.usage || 'High-conversion interactive highlights, tags, notifications (10% pop)',
        psychology: data.colors?.accent?.psychology || 'Draws immediate attention and triggers action',
      },
      background: {
        hex: safeHex(data.colors?.background?.hex, '#FAF9F6'),
        name: data.colors?.background?.name || 'Canvas Neutral',
        usage: data.colors?.background?.usage || 'Page background, cards, and spacious breathing room',
        psychology: data.colors?.background?.psychology || 'Editorial clarity with minimal visual strain',
      },
      text: {
        hex: safeHex(data.colors?.text?.hex, '#0D0C0B'),
        name: data.colors?.text?.name || 'Text & Ink',
        usage: data.colors?.text?.usage || 'Headlines, body text, and crisp data visualization',
        psychology: data.colors?.text?.psychology || 'Uncompromised WCAG AAA legibility',
      },
      additionalShades: Array.isArray(data.colors?.additionalShades) ? data.colors.additionalShades : [
        { role: 'Surface / Card', hex: '#FFFFFF' },
        { role: 'Muted Border', hex: '#E5E7EB' },
        { role: 'Subtle Text', hex: '#6B7280' },
      ],
    },
    typography: {
      displayHeadingFont: {
        name: data.typography?.displayHeadingFont?.name || 'Plus Jakarta Sans',
        category: data.typography?.displayHeadingFont?.category || 'Sans Serif',
        googleFontQuery: data.typography?.displayHeadingFont?.googleFontQuery || 'family=Plus+Jakarta+Sans:wght@600;700;800',
        weights: data.typography?.displayHeadingFont?.weights || '600, 700, 800',
        whyItWorks: data.typography?.displayHeadingFont?.whyItWorks || 'Creates immediate visual impact with contemporary neo-grotesque authority.',
      },
      subheadingFont: {
        name: data.typography?.subheadingFont?.name || 'Space Grotesk',
        category: data.typography?.subheadingFont?.category || 'Geometric Sans',
        googleFontQuery: data.typography?.subheadingFont?.googleFontQuery || 'family=Space+Grotesk:wght@500;600;700',
        weights: data.typography?.subheadingFont?.weights || '500, 600, 700',
        whyItWorks: data.typography?.subheadingFont?.whyItWorks || 'Adds a distinct tech-forward geometric rhythm to mid-level hierarchy.',
      },
      bodyFont: {
        name: data.typography?.bodyFont?.name || 'Inter',
        category: data.typography?.bodyFont?.category || 'Sans Serif',
        googleFontQuery: data.typography?.bodyFont?.googleFontQuery || 'family=Inter:wght@400;500;600',
        weights: data.typography?.bodyFont?.weights || '400, 500, 600',
        whyItWorks: data.typography?.bodyFont?.whyItWorks || 'Screen-calibrated micro-contrast delivers peak legibility across mobile & desktop.',
      },
      scaleLadder: Array.isArray(data.typography?.scaleLadder) ? data.typography.scaleLadder : [
        { level: 'Hero / Display', size: '56px', lineHeight: '1.1', letterSpacing: '-0.025em' },
        { level: 'H1 Heading', size: '36px', lineHeight: '1.2', letterSpacing: '-0.02em' },
        { level: 'H2 Subheading', size: '24px', lineHeight: '1.3', letterSpacing: '-0.01em' },
        { level: 'Body Regular', size: '16px', lineHeight: '1.6', letterSpacing: '0em' },
        { level: 'Small UI', size: '13px', lineHeight: '1.4', letterSpacing: '+0.01em' },
      ],
      googleFontsCdnLink: data.typography?.googleFontsCdnLink || 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap',
    },
    uiComponentStyles: {
      borderRadius: data.uiComponentStyles?.borderRadius || '16px (rounded-2xl)',
      shadowStyle: data.uiComponentStyles?.shadowStyle || 'Soft ambient elevation with 5% shadow opacity',
      borderTreatment: data.uiComponentStyles?.borderTreatment || '1px solid rgba(0,0,0,0.08)',
      vibeAesthetic: data.uiComponentStyles?.vibeAesthetic || 'Modern Glassmorphic Minimalist',
      dos: Array.isArray(data.uiComponentStyles?.dos) ? data.uiComponentStyles.dos : [
        'Maintain 60-30-10 color hierarchy across all page sections',
        'Use high-contrast text color against the primary background',
        'Give headings breathing room with generous line-height and margin',
      ],
      donts: Array.isArray(data.uiComponentStyles?.donts) ? data.uiComponentStyles.donts : [
        'Do not mix more than 3 distinct font families on one page',
        'Avoid low contrast accent colors for essential paragraph body text',
        'Do not overload interfaces with heavy solid drop shadows',
      ],
    },
    mockPreviewData: {
      heroTitle: data.mockPreviewData?.heroTitle || 'Architecting Next-Generation Interfaces',
      heroSubtitle: data.mockPreviewData?.heroSubtitle || 'Harmonic palettes, precision type scales, and production-ready code tokens.',
      ctaButtonText: data.mockPreviewData?.ctaButtonText || 'Explore System',
      secondaryButtonText: data.mockPreviewData?.secondaryButtonText || 'Documentation',
      featureCards: Array.isArray(data.mockPreviewData?.featureCards) ? data.mockPreviewData.featureCards : [
        { title: 'Harmonic Precision', desc: 'Curated 60-30-10 color weights.' },
        { title: 'Type System', desc: 'Google Fonts hierarchy engineered for screens.' },
        { title: 'Code Tokens', desc: 'Copy-paste Tailwind & CSS variables in 1-click.' },
      ],
    },
    generatedAt: new Date().toISOString(),
  };
}

// Built-in intelligent fallback synthesizer for offline or zero-key usage
export function generateOfflineDesignSystem({
  promptText = '',
  industry = '',
  mood = '',
  style = '',
  targetAudience = '',
}) {
  const query = `${promptText} ${industry} ${mood} ${style} ${targetAudience}`.toLowerCase();

  // Archetype 1: Fintech / Dark Cyber SaaS / Developer
  if (query.includes('fintech') || query.includes('crypto') || query.includes('cyber') || query.includes('developer') || query.includes('saas') || query.includes('dark')) {
    return sanitizeDesignSystem({
      brandName: promptText ? promptText.slice(0, 24) : 'Aether Cyber Labs',
      tagline: 'Precision Infrastructure for High-Velocity Software Teams',
      conceptSummary: 'A high-contrast dark cyberpunk palette with electric cyan and neon violet accents, paired with developer-focused geometric typography.',
      personalityTags: ['Futuristic', 'High-Performance', 'Cryptographic', 'Technical', 'Precise'],
      colors: {
        primary: { hex: '#6366F1', name: 'Electric Indigo', usage: 'Primary brand badges, active interactive borders, glowing buttons', psychology: 'Signifies high intellect, precision, and reliable technology' },
        secondary: { hex: '#0F172A', name: 'Obsidian Slate', usage: 'Deep dark background canvas and card panels', psychology: 'Provides an immersive developer-centric dark cockpit environment' },
        accent: { hex: '#06B6D4', name: 'Neon Cyber Cyan', usage: 'Data highlights, success states, pulse indicators', psychology: 'Electric, sharp, draws immediate focus to real-time metrics' },
        background: { hex: '#090D16', name: 'Deep Space Abyss', usage: 'Global layout canvas background', psychology: 'Ultra-dark luxury reduction of eye strain in prolonged sessions' },
        text: { hex: '#F8FAFC', name: 'Pure Starlight White', usage: 'Headings, crisp code snippets, and primary labels', psychology: 'Maximum AAA contrast against dark canvas' },
      },
      typography: {
        displayHeadingFont: { name: 'Space Grotesk', category: 'Geometric Sans', googleFontQuery: 'family=Space+Grotesk:wght@600;700', weights: '600, 700', whyItWorks: 'Tech-inspired angular quirks bring engineering authority to large headlines.' },
        subheadingFont: { name: 'Plus Jakarta Sans', category: 'Sans Serif', googleFontQuery: 'family=Plus+Jakarta+Sans:wght@500;600;700', weights: '500, 600, 700', whyItWorks: 'Balanced neo-grotesque proportion keeps subtitles readable.' },
        bodyFont: { name: 'Inter', category: 'Sans Serif', googleFontQuery: 'family=Inter:wght@400;500;600', weights: '400, 500, 600', whyItWorks: 'Industry gold standard for digital UI and dashboard data readability.' },
        googleFontsCdnLink: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700&family=Space+Grotesk:wght@600;700&display=swap',
      },
      uiComponentStyles: {
        borderRadius: '12px (rounded-xl) with sharp technical edges',
        shadowStyle: 'Glowing neon ambient bloom with 0 0 20px rgba(99, 102, 241, 0.25)',
        borderTreatment: '1px solid rgba(255, 255, 255, 0.1)',
        vibeAesthetic: 'Dark Mode Glassmorphic Cyberpunk',
      },
      mockPreviewData: {
        heroTitle: 'Engineered for Mission-Critical Engineering',
        heroSubtitle: 'Deploy cloud scale models with sub-millisecond latency and zero operational friction.',
        ctaButtonText: 'Start Building Now',
        secondaryButtonText: 'Read Architecture Docs',
      },
    }, promptText);
  }

  // Archetype 2: Warm Organic Coffee / Bakery / Artisanal Food / Eco
  if (query.includes('coffee') || query.includes('bakery') || query.includes('food') || query.includes('organic') || query.includes('eco') || query.includes('nature') || query.includes('wellness') || query.includes('warm')) {
    return sanitizeDesignSystem({
      brandName: promptText ? promptText.slice(0, 24) : 'Komorebi Roasters',
      tagline: 'Artisanal Single-Origin Roasts & Wholesome Craft',
      conceptSummary: 'An earthy, tactile palette combining roasted caramel amber, espresso deep brown, and matcha green, accompanied by warm literary serif typography.',
      personalityTags: ['Warm', 'Artisanal', 'Organic', 'Nostalgic', 'Comforting'],
      colors: {
        primary: { hex: '#B45309', name: 'Roasted Amber Honey', usage: 'Packaging badges, primary buttons, price tags', psychology: 'Evokes warmth, baked caramel, and inviting craft aroma' },
        secondary: { hex: '#451A03', name: 'Dark Roast Espresso', usage: 'Deep footer blocks, text headings, premium card borders', psychology: 'Conveys rich heritage, authenticity, and grounding quality' },
        accent: { hex: '#059669', name: 'Matcha Leaf Jade', usage: 'Organic badges, eco seals, subscription tags', psychology: 'Signifies fresh natural ingredients and sustainable harvesting' },
        background: { hex: '#FFFBEB', name: 'Warm Cream Parchment', usage: 'Main layout background, warm menu cards', psychology: 'Tactile, cozy, reminiscent of unbleached craft paper' },
        text: { hex: '#291405', name: 'Cacao Ink', usage: 'Editorial articles, typography headlines, nutrition facts', psychology: 'Gentler on the eyes than black while preserving crisp contrast' },
      },
      typography: {
        displayHeadingFont: { name: 'Playfair Display', category: 'Serif', googleFontQuery: 'family=Playfair+Display:wght@600;700;800', weights: '600, 700, 800', whyItWorks: 'Editorial serif curves invoke old-world European cafes and gourmet publications.' },
        subheadingFont: { name: 'DM Sans', category: 'Sans Serif', googleFontQuery: 'family=DM+Sans:wght@500;700', weights: '500, 700', whyItWorks: 'Clean geometric proportions ensure clean menu readability.' },
        bodyFont: { name: 'Lora', category: 'Serif', googleFontQuery: 'family=Lora:wght@400;500;600', weights: '400, 500, 600', whyItWorks: 'Calligraphic serif flow gives storytelling paragraphs literary charm.' },
        googleFontsCdnLink: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;700&family=Lora:wght@400;500;600&family=Playfair+Display:wght@600;700;800&display=swap',
      },
      uiComponentStyles: {
        borderRadius: '20px (rounded-3xl) organic soft curves',
        shadowStyle: 'Warm sunset drop shadow with 6% opacity amber tint',
        borderTreatment: '1px solid rgba(69, 26, 3, 0.1)',
        vibeAesthetic: 'Tactile Organic Artisanal Editorial',
      },
      mockPreviewData: {
        heroTitle: 'Crafted with Patience. Brewed for Ritual.',
        heroSubtitle: 'Directly sourced from smallholder family farms in the misty highlands of Huehuetenango.',
        ctaButtonText: 'Order Single Origin',
        secondaryButtonText: 'Explore Coffee Origin',
      },
    }, promptText);
  }

  // Archetype 3: High-End Luxury Fashion / Real Estate / Editorial
  if (query.includes('luxury') || query.includes('fashion') || query.includes('editorial') || query.includes('magazine') || query.includes('estate') || query.includes('jewelry') || query.includes('prestige')) {
    return sanitizeDesignSystem({
      brandName: promptText ? promptText.slice(0, 24) : 'Maison Lumière',
      tagline: 'Timeless Haute Couture & Architectural Living',
      conceptSummary: 'Monochromatic obsidian luxury accented by champagne gold and oyster silk, set against dramatic high-fashion serif typography.',
      personalityTags: ['Prestigious', 'Timeless', 'Minimalist', 'Sophisticated', 'Haute'],
      colors: {
        primary: { hex: '#D97706', name: 'Champagne Royal Gold', usage: 'Monograms, exclusive badges, gold foil hover accents', psychology: 'Symbolizes opulence, rarity, and bespoke curation' },
        secondary: { hex: '#1C1917', name: 'Obsidian Velvet', usage: 'Deep hero cards, packaging ribbons, contrast frames', psychology: 'Classic luxury anchor conveying timeless permanence' },
        accent: { hex: '#BE185D', name: 'Burgundy Silk Rose', usage: 'Seasonal runway tags, VIP member markers', psychology: 'Sensual, sophisticated, high fashion passion' },
        background: { hex: '#FAF9F6', name: 'Oyster Alabaster', usage: 'Clean museum canvas background', psychology: 'Spacious breathing room that lets artwork and photography shine' },
        text: { hex: '#0C0A09', name: 'Obsidian Ink', usage: 'Editorial titles, collection names, prices', psychology: 'Extreme clarity and sharp typography definition' },
      },
      typography: {
        displayHeadingFont: { name: 'Cinzel', category: 'Display Serif', googleFontQuery: 'family=Cinzel:wght@600;700;900', weights: '600, 700, 900', whyItWorks: 'Inspired by classical Roman inscriptions, exudes timeless luxury and prestige.' },
        subheadingFont: { name: 'Playfair Display', category: 'Serif', googleFontQuery: 'family=Playfair+Display:wght@500;600;700', weights: '500, 600, 700', whyItWorks: 'High-contrast transitional serif adds fashion editorial flair.' },
        bodyFont: { name: 'Montserrat', category: 'Sans Serif', googleFontQuery: 'family=Montserrat:wght@300;400;500', weights: '300, 400, 500', whyItWorks: 'Geometric purity with wide letter tracking gives high-end modern elegance.' },
        googleFontsCdnLink: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Montserrat:wght@300;400;500&family=Playfair+Display:wght@500;600;700&display=swap',
      },
      uiComponentStyles: {
        borderRadius: '4px (rounded-xs) minimal crisp corners',
        shadowStyle: 'Ultra subtle diffuse ambient shadow with 3% black opacity',
        borderTreatment: '1px solid #E7E5E4',
        vibeAesthetic: 'Swiss Minimalist Haute Luxury',
      },
      mockPreviewData: {
        heroTitle: 'The Architecture of Pure Elegance',
        heroSubtitle: 'Limited bespoke residences overlooking the Mediterranean shoreline.',
        ctaButtonText: 'Request Private Viewing',
        secondaryButtonText: 'View Lookbook',
      },
    }, promptText);
  }

  // Archetype 4: Default Modern Creative Studio / Generative App
  return sanitizeDesignSystem({
    brandName: promptText ? promptText.slice(0, 24) : 'Prism Studio',
    tagline: 'Vibrant Generative Design Systems for Forward-Thinking Brands',
    conceptSummary: 'An energetic, vibrant palette featuring electric violet, magenta rose, and sunny gold, engineered with neo-grotesque and screen-optimized typography.',
    personalityTags: ['Creative', 'Dynamic', 'Modern', 'Harmonic', 'Approachable'],
    colors: {
      primary: { hex: '#7C3AED', name: 'Electric Violet', usage: 'Main brand highlights, gradient buttons, primary icons', psychology: 'Unleashes creative imagination and modern digital confidence' },
      secondary: { hex: '#1E1B4B', name: 'Midnight Cosmic Navy', usage: 'Dark sections, deep card backdrops, navigation bar', psychology: 'Provides grounding architectural contrast' },
      accent: { hex: '#F43F5E', name: 'Neon Rose Coral', usage: 'Pill tags, alert chips, active state underlines', psychology: 'High energy pop that captures immediate user gaze' },
      background: { hex: '#F8FAFC', name: 'Ice White Canvas', usage: 'Spacious page canvas and light card layers', psychology: 'Clean, airy modern web canvas' },
      text: { hex: '#0F172A', name: 'Midnight Slate', usage: 'Headlines, body copy, and UI controls', psychology: 'High-contrast readability with modern neutral tone' },
    },
    typography: {
      displayHeadingFont: { name: 'Plus Jakarta Sans', category: 'Sans Serif', googleFontQuery: 'family=Plus+Jakarta+Sans:wght@700;800', weights: '700, 800', whyItWorks: 'Contemporary geometric neo-grotesque that feels friendly yet authoritative.' },
      subheadingFont: { name: 'Poppins', category: 'Geometric Sans', googleFontQuery: 'family=Poppins:wght@500;600;700', weights: '500, 600, 700', whyItWorks: 'Pure circular geometry creates optimistic energy.' },
      bodyFont: { name: 'Inter', category: 'Sans Serif', googleFontQuery: 'family=Inter:wght@400;500;600', weights: '400, 500, 600', whyItWorks: 'Engineered for crisp computer screen reading and UI legibility.' },
      googleFontsCdnLink: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@700;800&family=Poppins:wght@500;600;700&display=swap',
    },
    uiComponentStyles: {
      borderRadius: '16px (rounded-2xl) smooth modern curves',
      shadowStyle: 'Layered soft shadow with 5% opacity and subtle purple ambient glow',
      borderTreatment: '1px solid rgba(124, 58, 237, 0.12)',
      vibeAesthetic: 'Vibrant Neo-Modernist Glassmorphism',
    },
    mockPreviewData: {
      heroTitle: 'Design Beautiful Digital Experiences Faster',
      heroSubtitle: 'Harmonize your color tokens, perfect your typography pairings, and export ready-to-ship CSS in seconds.',
      ctaButtonText: 'Start Generating',
      secondaryButtonText: 'View Examples',
    },
  }, promptText);
}
