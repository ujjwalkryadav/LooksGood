// Generates high-resolution PNG palette swatch cards using HTML5 Canvas

export function downloadPaletteAsPng(palette, harmonyName, headingFontName, bodyFontName) {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 630;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  // Background
  ctx.fillStyle = '#121217';
  ctx.fillRect(0, 0, width, height);

  // Subtle Header Bar
  ctx.fillStyle = '#1A1A24';
  ctx.fillRect(40, 40, width - 80, 80);

  // Logo & Title
  ctx.fillStyle = '#6C63FF';
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('LooksGood', 70, 90);

  ctx.fillStyle = '#A1A1AA';
  ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`•   ${harmonyName || 'Complementary'} Palette   •   Fonts: ${headingFontName} + ${bodyFontName}`, 240, 90);

  // Color Swatches
  const swatches = [
    { label: 'Primary', hex: palette.primary, desc: 'Brand & CTA' },
    { label: 'Supporting', hex: palette.supporting || palette.primary, desc: 'Structure' },
    { label: 'Accent', hex: palette.accent, desc: 'Focal Point' },
    { label: 'Surface', hex: palette.surface, desc: 'Card Base' },
    { label: 'Background', hex: palette.background, desc: 'Canvas' },
    { label: 'Text', hex: palette.text, desc: 'Typography' },
  ];

  const cardWidth = (width - 80 - (swatches.length - 1) * 20) / swatches.length;
  const startY = 160;
  const cardHeight = 360;

  swatches.forEach((s, idx) => {
    const x = 40 + idx * (cardWidth + 20);

    // Card background
    ctx.fillStyle = '#1E1E2A';
    ctx.beginPath();
    ctx.roundRect(x, startY, cardWidth, cardHeight, 16);
    ctx.fill();

    // Swatch block
    ctx.fillStyle = s.hex;
    ctx.beginPath();
    ctx.roundRect(x, startY, cardWidth, 230, [16, 16, 0, 0]);
    ctx.fill();

    // Text labels
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(s.label, x + 16, startY + 265);

    ctx.fillStyle = '#6C63FF';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText(s.hex.toUpperCase(), x + 16, startY + 295);

    ctx.fillStyle = '#71717A';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(s.desc, x + 16, startY + 325);
  });

  // Footer Tagline
  ctx.fillStyle = '#71717A';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Generated with LooksGood — Know what looks good. Design without the guesswork.', 70, 580);

  // Trigger Download
  const link = document.createElement('a');
  link.download = `looksgood-palette-${(harmonyName || 'custom').toLowerCase()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
