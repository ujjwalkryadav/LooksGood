import React, { useRef, useEffect, useState, useCallback } from 'react';
import { hexToHsl, hslToHex } from '../../utils/colorUtils';

/**
 * Professional Color Wheel component inspired by color-grading grading wheels.
 * Uses polar coordinate math (Angle = Hue 0-360°, Radius = Saturation 0-100%).
 * Renders Primary reticle and connected opposite Contrast reticle with connecting vector line.
 */
export function ColorWheel({
  primaryHex,
  onChangeHex,
  lightness = 55,
  onChangeLightness,
  harmonyType = 'complementary',
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const { h: currentHue, s: currentSat, l: currentLight } = hexToHsl(primaryHex);
  const actualLight = lightness !== undefined ? lightness : currentLight;

  const size = 280; // wheel diameter in px
  const center = size / 2;
  const radius = center - 16; // wheel outer radius

  // Draw the HSL color wheel canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - center;
        const dy = y - center;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= radius) {
          // Angle in degrees (0 to 360)
          let angle = Math.atan2(dy, dx) * (180 / Math.PI);
          if (angle < 0) angle += 360;

          const sat = Math.min(100, (dist / radius) * 100);
          const hex = hslToHex(angle, sat, actualLight);

          // Parse rgb
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);

          const idx = (y * size + x) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255; // full opacity
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Draw subtle dark outer ring & angle notches
    ctx.strokeStyle = '#272732';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Subtle crosshairs
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(center, 12);
    ctx.lineTo(center, size - 12);
    ctx.moveTo(12, center);
    ctx.lineTo(size - 12, center);
    ctx.stroke();
  }, [size, center, radius, actualLight]);

  // Handle position computation from pointer
  const handlePointerMove = useCallback(
    (clientX, clientY) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left - center;
      const y = clientY - rect.top - center;

      const dist = Math.sqrt(x * x + y * y);
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      if (angle < 0) angle += 360;

      const sat = Math.max(5, Math.min(100, (dist / radius) * 100));
      const newHex = hslToHex(angle, sat, actualLight);
      onChangeHex(newHex);
    },
    [center, radius, actualLight, onChangeHex]
  );

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handlePointerMove(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const handleWindowMouseMove = (e) => {
      if (isDragging) {
        handlePointerMove(e.clientX, e.clientY);
      }
    };

    const handleWindowTouchMove = (e) => {
      if (isDragging && e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleWindowMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
      window.addEventListener('touchmove', handleWindowTouchMove, { passive: false });
      window.addEventListener('touchend', handleWindowMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleWindowMouseUp);
    };
  }, [isDragging, handlePointerMove]);

  // Primary Marker Position
  const rad = (currentHue * Math.PI) / 180;
  const satDist = (currentSat / 100) * radius;
  const primaryX = center + satDist * Math.cos(rad);
  const primaryY = center + satDist * Math.sin(rad);

  // Calculate satellite harmony points based on harmonyType
  const getHarmonyPoints = () => {
    const wrap = (val) => ((val % 360) + 360) % 360;
    const points = [];

    if (harmonyType === 'complementary' || harmonyType === 'contrast') {
      const oppAngle = wrap(currentHue + 180);
      const r = (oppAngle * Math.PI) / 180;
      points.push({
        angle: oppAngle,
        x: center + satDist * Math.cos(r),
        y: center + satDist * Math.sin(r),
        hex: hslToHex(oppAngle, currentSat, actualLight),
      });
    } else if (harmonyType === 'analogous' || harmonyType === 'harmonious') {
      [wrap(currentHue + 30), wrap(currentHue - 30)].forEach((angle) => {
        const r = (angle * Math.PI) / 180;
        points.push({
          angle,
          x: center + satDist * Math.cos(r),
          y: center + satDist * Math.sin(r),
          hex: hslToHex(angle, currentSat, actualLight),
        });
      });
    } else if (harmonyType === 'triadic') {
      [wrap(currentHue + 120), wrap(currentHue + 240)].forEach((angle) => {
        const r = (angle * Math.PI) / 180;
        points.push({
          angle,
          x: center + satDist * Math.cos(r),
          y: center + satDist * Math.sin(r),
          hex: hslToHex(angle, currentSat, actualLight),
        });
      });
    } else if (harmonyType === 'split' || harmonyType === 'splitComplementary') {
      [wrap(currentHue + 150), wrap(currentHue + 210)].forEach((angle) => {
        const r = (angle * Math.PI) / 180;
        points.push({
          angle,
          x: center + satDist * Math.cos(r),
          y: center + satDist * Math.sin(r),
          hex: hslToHex(angle, currentSat, actualLight),
        });
      });
    } else if (harmonyType === 'tetradic') {
      [wrap(currentHue + 90), wrap(currentHue + 180), wrap(currentHue + 270)].forEach((angle) => {
        const r = (angle * Math.PI) / 180;
        points.push({
          angle,
          x: center + satDist * Math.cos(r),
          y: center + satDist * Math.sin(r),
          hex: hslToHex(angle, currentSat, actualLight),
        });
      });
    } else if (harmonyType === 'monochromatic' || harmonyType === 'monochrome') {
      [0.6, 0.3].forEach((factor) => {
        const d = satDist * factor;
        points.push({
          angle: currentHue,
          x: center + d * Math.cos(rad),
          y: center + d * Math.sin(rad),
          hex: hslToHex(currentHue, Math.round(currentSat * factor), actualLight),
        });
      });
    }

    return points;
  };

  const harmonyPoints = getHarmonyPoints();

  return (
    <div className="flex flex-col items-center select-none">
      {/* Precision Wheel Bezel */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative cursor-crosshair touch-none p-2 rounded-full bg-[#16161F] border border-[#272738] shadow-[0_0_30px_rgba(0,0,0,0.6)] flex items-center justify-center group"
        style={{ width: size + 16, height: size + 16 }}
      >
        {/* Canvas Wheel */}
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="rounded-full shadow-inner pointer-events-none"
        />

        {/* SVG Pointer & Harmony Vector Overlay */}
        <svg
          className="absolute inset-2 w-[280px] h-[280px] pointer-events-none"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Center Pivot Anchor */}
          <circle cx={center} cy={center} r="2.5" fill="rgba(255, 255, 255, 0.4)" />

          {/* Harmony lines connecting primary to all harmony points */}
          {harmonyPoints.map((pt, idx) => (
            <line
              key={idx}
              x1={primaryX}
              y1={primaryY}
              x2={pt.x}
              y2={pt.y}
              stroke="rgba(255, 255, 255, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          ))}

          {/* If Triadic / Tetradic, also connect secondary points to complete polygon */}
          {harmonyPoints.length === 2 && harmonyType === 'triadic' && (
            <line
              x1={harmonyPoints[0].x}
              y1={harmonyPoints[0].y}
              x2={harmonyPoints[1].x}
              y2={harmonyPoints[1].y}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}

          {/* Harmony Satellite Reticles */}
          {harmonyPoints.map((pt, idx) => (
            <g key={idx} transform={`translate(${pt.x}, ${pt.y})`}>
              <circle
                r="7"
                fill={pt.hex}
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="drop-shadow-[0_0_6px_rgba(0,0,0,0.8)]"
              />
              <circle r="11" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
            </g>
          ))}

          {/* Primary Main Reticle (Interactive) */}
          <g transform={`translate(${primaryX}, ${primaryY})`}>
            <circle
              r="14"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              className="drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
            />
            <circle
              r="8"
              fill={primaryHex}
              stroke="#000000"
              strokeWidth="1.5"
            />
          </g>
        </svg>

        {/* Outer Degree Labels */}
        <span className="absolute top-1 text-[9px] font-mono font-bold text-zinc-500 tracking-wider">0° RED</span>
        <span className="absolute right-1 text-[9px] font-mono font-bold text-zinc-500 tracking-wider">90°</span>
        <span className="absolute bottom-1 text-[9px] font-mono font-bold text-zinc-500 tracking-wider">180° CYAN</span>
        <span className="absolute left-1 text-[9px] font-mono font-bold text-zinc-500 tracking-wider">270°</span>
      </div>

      {/* Exposure / Lightness Slider */}
      {onChangeLightness && (
        <div className="w-full max-w-[260px] mt-4 space-y-1 text-center">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>BRIGHTNESS / EXPOSURE</span>
            <span className="text-zinc-200 font-bold">{actualLight}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="80"
            value={actualLight}
            onChange={(e) => onChangeLightness(Number(e.target.value))}
            className="w-full h-1.5 bg-[#252533] rounded-lg appearance-none cursor-pointer accent-brand-400"
          />
        </div>
      )}
    </div>
  );
}
