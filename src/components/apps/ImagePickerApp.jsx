import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Image as ImageIcon, Copy, Palette, Crosshair, Code2 } from 'lucide-react';
import { useSharedDesign } from '../../context/SharedDesignContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useToast } from '../../context/ToastContext';
import { rgbToHex } from '../../utils/colorUtils';
import { CopyButton } from '../common/CopyButton';

const SAMPLE_IMAGES = [
  {
    name: 'Sunset Mountain',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Neon Cyberpunk',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Forest Mist',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Minimal Architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
  },
];

export function ImagePickerApp({ onUseInStudio }) {
  const { showToast } = useToast();
  const { sendPaletteToColorStudio } = useSharedDesign();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [activePinIndex, setActivePinIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0].url);

  const [samplerNodes, setSamplerNodes] = useState([
    { x: 18, y: 32, color: '#1C2321', role: 'PRIMARY' },
    { x: 38, y: 48, color: '#5E6572', role: 'SECONDARY' },
    { x: 52, y: 35, color: '#A9B4C2', role: 'ACCENT' },
    { x: 68, y: 62, color: '#D4B483', role: 'BACKGROUND' },
    { x: 82, y: 75, color: '#EEF1F6', role: 'TEXT' },
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
          showToast('Loaded custom photo for extraction!');
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

    setSamplerNodes((prev) => {
      const copy = [...prev];
      copy[activePinIndex] = {
        ...copy[activePinIndex],
        x: Math.round(xPct),
        y: Math.round(yPct),
      };
      return copy;
    });

    setActivePinIndex((prev) => (prev + 1) % 5);

    setTimeout(() => {
      sampleNodeColors();
    }, 50);
  };

  const handleUseInStudio = () => {
    sendPaletteToColorStudio(extractedColors, 'Image Extractor');
    if (onUseInStudio) {
      onUseInStudio();
    }
  };

  const handleCopyFull = () => {
    const text = extractedColors.join(', ');
    navigator.clipboard.writeText(text);
    showToast(`Copied image palette (${text})!`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="minimal-card rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[#E8E5DF]">
        <div>
          <h2 className="text-xl font-black text-[#0D0C0B] tracking-tight">Image Color Picker</h2>
          <p className="text-xs text-[#57534E] font-medium">
            Upload any image and click pins directly on the photo to sample natural harmonic colors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF9F6] border border-[#E8E5DF] text-[#0D0C0B] text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5 transition-all shadow-subtle hover:scale-105">
            <Upload className="w-3.5 h-3.5 text-brand-purple" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>

          <button
            onClick={handleUseInStudio}
            className="px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purpleDark text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-purple-sm hover:scale-105"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Use in Studio</span>
          </button>
        </div>
      </div>

      {/* Sample Photos Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-mono text-[#78716C] font-bold mr-1">Sample Photos:</span>
        {SAMPLE_IMAGES.map((sample) => (
          <button
            key={sample.name}
            onClick={() => setImageUrl(sample.url)}
            className={`px-3 py-1 text-xs font-mono font-bold rounded-xl border transition-all ${
              imageUrl === sample.url
                ? 'bg-[#0D0C0B] border-[#0D0C0B] text-white shadow-sm'
                : 'bg-white border-[#E8E5DF] text-[#78716C] hover:text-[#0D0C0B]'
            }`}
          >
            {sample.name}
          </button>
        ))}
      </div>

      {/* Interactive Photo Canvas */}
      <div className="minimal-card rounded-3xl p-5 space-y-5">
        <div
          ref={containerRef}
          onClick={handleCanvasClick}
          className="relative w-full max-h-[380px] rounded-2xl overflow-hidden border border-[#E8E5DF] flex items-center justify-center bg-[#FAF9F6] cursor-crosshair shadow-inner"
        >
          <img
            src={imageUrl}
            alt="Color extraction source"
            className="w-full h-full object-cover max-h-[380px] pointer-events-none select-none"
          />

          <canvas ref={canvasRef} className="hidden" />

          {/* Draggable/Interactive Sampler Pins */}
          {samplerNodes.map((node, i) => {
            const isSelectedPin = activePinIndex === i;
            return (
              <div
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelectedPin
                      ? 'border-brand-purple scale-125 shadow-purple-sm ring-4 ring-brand-purple/30'
                      : 'border-white shadow-md'
                  }`}
                  style={{ backgroundColor: node.color }}
                >
                  <span className="text-[10px] font-mono font-black text-white drop-shadow">
                    0{i + 1}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-3 left-3 text-[10px] font-mono font-bold bg-white/95 text-[#0D0C0B] px-3 py-1.5 rounded-xl border border-[#E8E5DF] pointer-events-none shadow-sm flex items-center gap-1.5">
            <Crosshair className="w-3 h-3 text-brand-purple" />
            <span>Clicking photo repositions Pin 0{activePinIndex + 1}</span>
          </div>
        </div>

        {/* Extracted 5 Swatches */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0D0C0B]">
              Extracted 5-Role Swatches
            </span>
            <button
              onClick={handleCopyFull}
              className="text-xs font-mono font-bold text-brand-purple hover:text-brand-purpleDark flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy All</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {samplerNodes.map((node, idx) => {
              const isSelectedPin = activePinIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActivePinIndex(idx)}
                  className={`p-3 rounded-2xl border space-y-2.5 cursor-pointer transition-all ${
                    isSelectedPin
                      ? 'bg-white border-brand-purple ring-2 ring-brand-purple/30 shadow-purple-sm scale-105'
                      : 'bg-white border-[#E8E5DF] shadow-subtle hover:border-[#0D0C0B]'
                  }`}
                >
                  <div
                    className="w-full h-16 rounded-xl shadow-inner border border-black/10 flex items-end justify-between p-2 relative"
                    style={{ backgroundColor: node.color }}
                  >
                    <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase bg-black/60 text-white rounded">
                      Pin 0{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-black text-[#0D0C0B] block">{node.color.toUpperCase()}</span>
                      <span className="text-[9px] font-mono font-bold text-[#78716C] uppercase">{node.role}</span>
                    </div>

                    <CopyButton
                      text={node.color.toUpperCase()}
                      toastMessage={`Copied ${node.color.toUpperCase()}`}
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

export default ImagePickerApp;
