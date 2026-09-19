import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Sparkles } from 'lucide-react';
import { CopyButton } from '../../../components/common/CopyButton';
import { useToast } from '../../../context/ToastContext';
import { useSharedDesign } from '../../../context/SharedDesignContext';
import { rgbToHex } from '../../../utils/colorUtils';

const SAMPLE_IMAGES = [
  {
    name: 'Sunset Horizon',
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
    name: 'Architectural Minimal',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    fallbackColors: ['#2B2D42', '#8D99AE', '#EDF2F4', '#EF233C', '#D90429'],
  },
];

export function ImageExtractorTab({ onNavigateTab }) {
  const { showToast } = useToast();
  const { sendPaletteToColorStudio } = useSharedDesign();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [activePinIndex, setActivePinIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0].url);

  const [samplerNodes, setSamplerNodes] = useState([
    { x: 18, y: 32, color: '#1C2321' },
    { x: 38, y: 48, color: '#5E6572' },
    { x: 52, y: 35, color: '#A9B4C2' },
    { x: 68, y: 62, color: '#D4B483' },
    { x: 82, y: 75, color: '#EEF1F6' },
  ]);

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
        const pixel = ctx.getImageData(px, py, 1, 1).data;
        const hex = rgbToHex(pixel[0], pixel[1], pixel[2]).toUpperCase();
        return { ...node, color: hex };
      } catch (err) {
        return node;
      }
    });

    setSamplerNodes(updated);
  }, [samplerNodes]);

  const loadImageToCanvas = useCallback(
    (src) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          sampleNodeColors();
        }
      };
      img.onerror = () => {
        // Fallback colors if CORS blocks cross-origin image on canvas
        const currentSample = SAMPLE_IMAGES[activeSampleIndex];
        if (currentSample?.fallbackColors) {
          setSamplerNodes((prev) =>
            prev.map((node, i) => ({
              ...node,
              color: currentSample.fallbackColors[i] || node.color,
            }))
          );
        }
      };
    },
    [activeSampleIndex, sampleNodeColors]
  );

  useEffect(() => {
    loadImageToCanvas(imageUrl);
  }, [imageUrl, loadImageToCanvas]);

  const handleImageClick = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    const updated = [...samplerNodes];
    updated[activePinIndex] = { ...updated[activePinIndex], x, y };
    setSamplerNodes(updated);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const px = Math.floor((x / 100) * canvas.width);
        const py = Math.floor((y / 100) * canvas.height);
        try {
          const pixel = ctx.getImageData(px, py, 1, 1).data;
          const hex = rgbToHex(pixel[0], pixel[1], pixel[2]).toUpperCase();
          updated[activePinIndex].color = hex;
          setSamplerNodes([...updated]);
          showToast(`Extracted ${hex} at Pin #${activePinIndex + 1}!`);
        } catch {
          // Keep previous
        }
      }
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    showToast('Uploaded custom photo for color sampling!', 'success');
  };

  const handleSendToStudio = () => {
    const colors = samplerNodes.map((n) => n.color);
    sendPaletteToColorStudio({
      primary: colors[0],
      secondary: colors[1],
      accent: colors[2],
      background: colors[4] || '#FAF9F6',
      text: colors[3] || '#0D0C0B',
    });
    showToast('Sent extracted 5-role palette to Colors Studio!', 'success');
    if (onNavigateTab) onNavigateTab('palette');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-stone-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
            <h2 className="text-xl font-black tracking-tight text-stone-900 font-display">
              5-Point Image Color Extractor
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Drag sampling pins or click anywhere on the photo to extract a custom 5-role palette.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <label className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center space-x-2 border border-purple-200 cursor-pointer transition active:scale-95">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>

          <button
            onClick={handleSendToStudio}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-300" />
            <span>Apply to Studio Palette</span>
          </button>
        </div>
      </div>

      {/* Preset Image Selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 mr-2 flex-shrink-0">
          Sample Gallery:
        </span>
        {SAMPLE_IMAGES.map((img, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveSampleIndex(i);
              setImageUrl(img.url);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeSampleIndex === i
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {img.name}
          </button>
        ))}
      </div>

      {/* Main Interactive Canvas & Pins */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Image Canvas */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs space-y-3">
          <div
            ref={containerRef}
            onClick={handleImageClick}
            className="relative w-full h-[400px] rounded-2xl overflow-hidden cursor-crosshair bg-stone-100 select-none group"
          >
            <img
              src={imageUrl}
              alt="Color Sampler"
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* Hidden canvas used for pixel sampling */}
            <canvas ref={canvasRef} className="hidden" />

            {/* 5 Draggable/Interactive Sampling Pins */}
            {samplerNodes.map((node, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePinIndex(i);
                  showToast(`Selected Pin #${i + 1}`);
                }}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform ${
                  activePinIndex === i ? 'scale-125 z-20 ring-4 ring-white shadow-2xl' : 'scale-100 z-10 hover:scale-110 shadow-lg'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white font-mono font-black text-[10px] shadow-md"
                  style={{ backgroundColor: node.color }}
                >
                  {i + 1}
                </div>
              </div>
            ))}

            {/* Overlay hint */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-medium pointer-events-none">
              Click photo to reposition active Pin #{activePinIndex + 1}
            </div>
          </div>
        </div>

        {/* Right: Extracted Swatches List */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500">
              Extracted Swatches
            </h3>
            <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-bold">
              Pin #{activePinIndex + 1} Active
            </span>
          </div>

          <div className="space-y-2.5">
            {samplerNodes.map((node, i) => {
              const isSelected = activePinIndex === i;
              return (
                <div
                  key={i}
                  onClick={() => setActivePinIndex(i)}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-2 ring-purple-500/20'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-xl border border-stone-300 shadow-inner flex items-center justify-center font-mono font-bold text-xs text-white"
                      style={{ backgroundColor: node.color }}
                    >
                      #{i + 1}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-stone-900 block">
                        {node.color}
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium">
                        Role: {['Primary', 'Secondary', 'Accent', 'Canvas', 'Ink'][i]}
                      </span>
                    </div>
                  </div>

                  <CopyButton text={node.color} label="" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
