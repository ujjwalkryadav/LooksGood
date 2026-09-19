import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useWindowManager, APP_REGISTRY } from '../../context/WindowManagerContext';
import { Minus, Square, X, Maximize2, Minimize2 } from 'lucide-react';

export function AppWindow({ appId, children }) {
  const {
    windows,
    activeAppId,
    focusApp,
    closeApp,
    minimizeApp,
    maximizeApp,
    updateWindowPosition,
  } = useWindowManager();

  const win = windows[appId];
  const appInfo = APP_REGISTRY[appId] || { title: 'App', icon: null };
  const Icon = appInfo.icon;

  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);

  const isActive = activeAppId === appId;
  const isMaximized = win?.isMaximized;

  // Window Drag Handler
  const handleMouseDown = useCallback((e) => {
    // Only drag from title bar and not on buttons
    if (e.target.closest('button')) return;
    if (isMaximized) return;

    setIsDragging(true);
    dragOffsetRef.current = {
      x: e.clientX - win.x,
      y: e.clientY - win.y,
    };
    focusApp(appId);
  }, [appId, focusApp, isMaximized, win?.x, win?.y]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const newX = e.clientX - dragOffsetRef.current.x;
      const newY = e.clientY - dragOffsetRef.current.y;
      updateWindowPosition(appId, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [appId, isDragging, updateWindowPosition]);

  if (!win || !win.isOpen || win.isMinimized) {
    return null;
  }

  // Double click title bar toggles maximize
  const handleTitleBarDoubleClick = () => {
    maximizeApp(appId);
  };

  // Window Style Calculation
  const windowStyle = isMaximized
    ? {
        position: 'fixed',
        top: '56px',
        left: '16px',
        right: '16px',
        bottom: '96px',
        width: 'calc(100vw - 32px)',
        height: 'calc(100vh - 152px)',
        zIndex: win.zIndex,
      }
    : {
        position: 'fixed',
        top: `${win.y}px`,
        left: `${win.x}px`,
        width: `${Math.min(window.innerWidth - 32, win.width || appInfo.defaultWidth || 880)}px`,
        height: `${Math.min(window.innerHeight - 180, win.height || appInfo.defaultHeight || 640)}px`,
        zIndex: win.zIndex,
      };

  return (
    <div
      ref={windowRef}
      onMouseDown={() => focusApp(appId)}
      style={windowStyle}
      className={`flex flex-col rounded-3xl bg-white/95 backdrop-blur-2xl border transition-shadow duration-300 animate-window-open select-none overflow-hidden ${
        isActive
          ? 'border-[#7C3AED]/40 shadow-window-active ring-1 ring-[#7C3AED]/20'
          : 'border-[#E8E5DF] shadow-window opacity-95 hover:opacity-100'
      }`}
    >
      {/* Title Bar (macOS Traffic Lights + Title + Controls) */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={handleTitleBarDoubleClick}
        className="h-12 px-4 flex items-center justify-between border-b border-[#E8E5DF] bg-white/90 backdrop-blur-md cursor-grab active:cursor-grabbing shrink-0 select-none"
      >
        {/* macOS Traffic Light Buttons */}
        <div className="flex items-center gap-2 group/lights">
          {/* Close Button (Red) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeApp(appId);
            }}
            title="Close (⌘W)"
            className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center text-[#5F0000] opacity-90 group-hover/lights:opacity-100 transition-opacity"
          >
            <X className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 transition-opacity" />
          </button>

          {/* Minimize Button (Yellow) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeApp(appId);
            }}
            title="Minimize (⌘M)"
            className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center text-[#5F3000] opacity-90 group-hover/lights:opacity-100 transition-opacity"
          >
            <Minus className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 transition-opacity" />
          </button>

          {/* Maximize Button (Green) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeApp(appId);
            }}
            title={isMaximized ? 'Restore' : 'Maximize'}
            className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center text-[#004500] opacity-90 group-hover/lights:opacity-100 transition-opacity"
          >
            {isMaximized ? (
              <Minimize2 className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 transition-opacity" />
            ) : (
              <Maximize2 className="w-2 h-2 opacity-0 group-hover/lights:opacity-100 transition-opacity" />
            )}
          </button>
        </div>

        {/* Window Title & Micro Icon */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#0D0C0B] tracking-tight">
          {Icon && <Icon className="w-3.5 h-3.5 text-brand-purple" />}
          <span>{appInfo.title}</span>
        </div>

        {/* Right Badges / Status */}
        <div className="flex items-center gap-2">
          {appInfo.badge && (
            <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-[#78716C] bg-[#FAF9F6] border border-[#E8E5DF] rounded-md">
              {appInfo.badge}
            </span>
          )}
        </div>
      </div>

      {/* Window Body Canvas */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 bg-[#FAF9F6]/50 select-text">
        {children}
      </div>
    </div>
  );
}

export default AppWindow;
