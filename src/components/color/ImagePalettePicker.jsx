import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Image as ImageIcon, Copy, Crosshair, Check, Code2 } from 'lucide-react';
import { CopyButton } from '../common/CopyButton';
import { useToast } from '../../context/ToastContext';
import { rgbToHex } from '../../utils/colorUtils';

const SAMPLE_IMAGES = [
  {
    name: 'Sunset Mountain',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    fallbackColors: ['#1C2321', '#5E6572', '#A9B4C2', '#EEF1F6', '#D4B483'],
  },
  {
    name: 'Neon Cyberpunk',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    fallbackColors: ['#0A0908', '#22333B', '#EAE0D5', '#C6AC8F', '#5E503F'],
  },
  {
    name: 'Forest Mist',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    fallbackColors: ['#1B263B', '#415A77', '#778DA9', '#E0E1DD', '#2D6A4F'],
  },
  {
    name: 'Minimal Architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    fallbackColors: ['#2B2D42', '#8D99AE', '#EDF2F4', '#EF233C', '#D90429'],
  },
];

export function ImagePalettePicker() {
  const { showToast } = useToast();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [activePinIndex, setActivePinIndex] = useState(0); // which pin is selected (0 to 4)
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0].url);

  const [samplerNodes, setSamplerNodes] = useState([
    { x: 18, y: 32, color: '#1C2321' },
    { x: 38, y: 48, color: '#5E6572' },
    { x: 52, y: 35, color: '#A9B4C2' },
    { x: 68, y: 62, color: '#D4B483' },
    { x: 82, y: 75, color: '#EEF1F6' },
  ]);

  const extractedColors = samplerNodes.map((n) => n.color);

  const sampleNodeColors = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    const updated = samplerNodes.map((node) => {
      const px = Math.floor((node.x / 100) * w);
      const py = Math.floor((node.y / 100) * h);
      try {
        const pixel = ctx.getImageData(Math.max(0, Math.min(w - 1, px)), Math.max(0, Math.min(h - 1, py)), 1, 1).data;
        const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
        return { ...node, color: hex };
      } catch {
        return node;
      }
    });

    setSamplerNodes(updated);
  }, [samplerNodes]);

  // Load and sample image colors
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.naturalWidth || 600;
      canvas.height = img.naturalHeight || 400;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      sampleNodeColors();
    };
  }, [imageUrl, sampleNodeColors]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result);
          showToast('Loaded custom image for palette extraction!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasClick = (e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const xPct = Math.max(4, Math.min(96, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(4, Math.min(96, ((e.clientY - rect.top) / rect.height) * 100));

    // Update currently selected pin
    setSamplerNodes((prev) => {
      const copy = [...prev];
      copy[activePinIndex] = {
        x: Math.round(xPct),
        y: Math.round(yPct),
        color: copy[activePinIndex].color,
      };
      return copy;
    });

    // Automatically cycle to next pin for intuitive clicking
    setActivePinIndex((prev) => (prev + 1) % 5);

    setTimeout(() => {
      sampleNodeColors();
    }, 50);
  };

  const handleCopyFull = () => {
    const text = extractedColors.join(', ');
    navigator.clipboard.writeText(text);
    showToast(`Copied image palette (${text})!`);
  };

  const handleCopyCSS = () => {
    const css = `:root {\n${extractedColors
      .map((c, i) => `  --color-img-${i + 1}: ${c};`)
      .join('\n')}\n}`;
    navigator.clipboard.writeText(css);
    showToast('Copied CSS Variables!');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="minimal-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-paprika-light text-paprika border border-paprika-border shadow-subtle">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>IMAGE COLOR EXTRACTOR</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0D0C0B] tracking-tight">
            Extract Palette from Image
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] font-medium">
            Upload your photo or select a sample image. Click on any of the 5 pins below and click on the photo to sample colors directly from imagery.
          </p>
        </div>

        {/* Upload Button */}
        <label className="px-5 py-3 rounded-2xl bg-paprika hover:bg-paprika-hover text-white text-xs font-black uppercase tracking-wider shadow-paprika-sm cursor-pointer flex items-center justify-center gap-2 transition-all hover:scale-105 shrink-0">
          <Upload className="w-4 h-4" />
          <span>Upload Photo</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      </div>

      {/* Sample Photos Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-mono text-[#78716C] font-bold mr-2">Sample Photos:</span>
        {SAMPLE_IMAGES.map((sample, idx) => (
          <button
            key={sample.name}
            onClick={() => {
              setActiveSampleIndex(idx);
              setImageUrl(sample.url);
            }}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all ${
              imageUrl === sample.url
                ? 'bg-[#0D0C0B] border-[#0D0C0B] text-white shadow-sm'
                : 'bg-white border-[#E8E5DF] text-[#78716C] hover:text-[#0D0C0B] hover:bg-[#FAF9F6]'
            }`}
          >
            {sample.name}
          </button>
        ))}
      </div>

      {/* Interactive Image Canvas & Eyedropper Nodes */}
      <div className="minimal-card rounded-3xl p-6 space-y-6">
        <div
          ref={containerRef}
          onClick={handleCanvasClick}
          className="relative w-full max-h-[460px] rounded-2xl overflow-hidden border border-[#E8E5DF] flex items-center justify-center bg-[#FAF9F6] cursor-crosshair group shadow-inner"
        >
          <img
            src={imageUrl}
            alt="Source for color extraction"
            className="w-full h-full object-cover max-h-[460px] pointer-events-none select-none"
          />

          <canvas ref={canvasRef} className="hidden" />

          {/* Interactive Sampler Pin Reticles */}
          {samplerNodes.map((node, i) => {
            const isSelectedPin = activePinIndex === i;
            return (
              <div
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelectedPin
                        ? 'border-paprika scale-125 shadow-paprika-sm ring-4 ring-paprika/30'
                        : 'border-white shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
                    }`}
                    style={{ backgroundColor: node.color }}
                  >
                    <span className="text-[10px] font-mono font-black text-white drop-shadow">
                      0{i + 1}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-3 left-3 text-[11px] font-mono font-bold bg-white/95 text-[#0D0C0B] px-3.5 py-1.5 rounded-xl backdrop-blur-md border border-[#E8E5DF] pointer-events-none shadow-sm flex items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 text-paprika" />
            <span>Clicking photo moves active Pin 0{activePinIndex + 1}</span>
          </div>
        </div>

        {/* Extracted 5-Color Palette Strip with Pin Selectors */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0D0C0B]">
              Extracted Color Harmony (Select Pin to Position)
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyCSS}
                className="text-xs font-mono font-bold text-[#78716C] hover:text-[#0D0C0B] flex items-center gap-1.5 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Copy CSS</span>
              </button>
              <button
                onClick={handleCopyFull}
                className="text-xs font-mono font-bold text-paprika hover:text-paprika-hover flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Palette</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {extractedColors.map((hex, idx) => {
              const isSelectedPin = activePinIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActivePinIndex(idx)}
                  className={`p-3.5 rounded-2xl border space-y-3 cursor-pointer transition-all ${
                    isSelectedPin
                      ? 'bg-white border-paprika ring-2 ring-paprika shadow-paprika-sm scale-105'
                      : 'bg-white border-[#E8E5DF] shadow-subtle hover:border-[#0D0C0B]'
                  }`}
                >
                  <div
                    className="w-full h-20 rounded-xl shadow-inner border border-black/10 flex items-end justify-between p-2 relative overflow-hidden"
                    style={{ backgroundColor: hex }}
                  >
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-black/60 text-white rounded backdrop-blur-md">
                      Pin 0{idx + 1}
                    </span>
                    {isSelectedPin && (
                      <span className="w-2.5 h-2.5 rounded-full bg-paprika ring-2 ring-white" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-[#0D0C0B]">{hex.toUpperCase()}</span>
                    <CopyButton
                      text={hex.toUpperCase()}
                      toastMessage={`Copied ${hex.toUpperCase()}`}
                      iconOnly
                      className="p-1 text-[#78716C] hover:text-[#0D0C0B] bg-transparent border-0"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
