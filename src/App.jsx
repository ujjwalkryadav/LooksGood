import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { SharedDesignProvider, useSharedDesign } from './context/SharedDesignContext';
import { AppMenuBar } from './components/layout/AppMenuBar';
import { HomeSoftwareHub } from './components/home/HomeSoftwareHub';
import { ColorStudioHub } from './studios/color/ColorStudioHub';
import { TypographyStudioHub } from './studios/typography/TypographyStudioHub';
import { AllToolsDirectory } from './studios/allTools/AllToolsDirectory';
import FlowingWaveBackground from './components/home/FlowingWaveBackground';
import { Search } from 'lucide-react';

function getPathFromState(studioId, tabId) {
  if (studioId === 'home') return '/';
  if (studioId === 'colors') return tabId ? `/color-studio/${tabId}` : '/color-studio';
  if (studioId === 'typography') return tabId ? `/typography-studio/${tabId}` : '/typography-studio';
  if (studioId === 'allTools') return '/all-tools';
  return '/';
}

function parseStateFromPath(pathname) {
  const clean = pathname.toLowerCase().replace(/\/$/, '') || '/';
  if (clean === '/' || clean === '/home') {
    return { studioId: 'home', tabId: null };
  }
  if (clean.startsWith('/color-studio')) {
    const parts = clean.split('/').filter(Boolean);
    const tabId = parts[1] || 'custom';
    return { studioId: 'colors', tabId };
  }
  if (clean.startsWith('/typography-studio')) {
    const parts = clean.split('/').filter(Boolean);
    const tabId = parts[1] || 'explorer';
    return { studioId: 'typography', tabId };
  }
  if (clean.startsWith('/all-tools')) {
    return { studioId: 'allTools', tabId: null };
  }
  return { studioId: 'home', tabId: null };
}

function SoftwareAppMain() {
  const { showToast } = useToast();
  const { sendPaletteToColorStudio } = useSharedDesign();

  // Initialize state from current URL
  const initialNavState = parseStateFromPath(window.location.pathname);
  const [activeStudio, setActiveStudio] = useState(initialNavState.studioId);
  const [activeTab, setActiveTab] = useState(initialNavState.tabId);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (studioId, tabId = null, pushHistory = true) => {
    setActiveStudio(studioId);
    setActiveTab(tabId);
    const targetPath = getPathFromState(studioId, tabId);
    if (pushHistory && window.location.pathname !== targetPath) {
      window.history.pushState({ studioId, tabId }, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Synchronize on Browser Back/Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const state = parseStateFromPath(window.location.pathname);
      setActiveStudio(state.studioId);
      setActiveTab(state.tabId);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
      } else if (e.key === '1') {
        handleNavigate('home');
      } else if (e.key === '2') {
        handleNavigate('colors', 'palette');
      } else if (e.key === '3') {
        handleNavigate('typography', 'explorer');
      } else if (e.key === '4') {
        handleNavigate('allTools');
      } else if (e.code === 'Space') {
        e.preventDefault();
        const presets = [
          ['#7C3AED', '#A78BFA', '#F43F5E', '#FAF9F6', '#1E1B4B'],
          ['#2563EB', '#60A5FA', '#F59E0B', '#F8FAFC', '#0F172A'],
          ['#059669', '#34D399', '#EC4899', '#F0FDF4', '#064E3B'],
          ['#DC2626', '#F87171', '#38BDF8', '#FEF2F2', '#450A0A'],
          ['#D97706', '#FBBF24', '#8B5CF6', '#FFFBEB', '#451A03'],
        ];
        const picked = presets[Math.floor(Math.random() * presets.length)];
        sendPaletteToColorStudio({
          primary: picked[0],
          secondary: picked[1],
          accent: picked[2],
          background: picked[3],
          text: picked[4],
        });
        showToast('Shuffled creative harmonic palette!', 'success');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  return (
    <div className="min-h-screen bg-[#F7F7FA] text-stone-900 font-sans select-none flex flex-col relative overflow-x-hidden">
      {/* 1. Ambient Background Waves */}
      <FlowingWaveBackground />

      {/* 2. Top Application Menu Bar (with Previous Light Frosted Style + Hover Submenus) */}
      <AppMenuBar
        activeStudio={activeStudio}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 3. Main Studio Page View Canvas */}
      <main className={`relative z-10 flex-1 w-full ${activeStudio === 'home' ? 'px-0 pt-0 pb-0' : 'px-4 sm:px-6 pt-6 pb-20'}`}>
        {activeStudio === 'home' && (
          <HomeSoftwareHub onNavigate={handleNavigate} />
        )}

        {activeStudio === 'colors' && (
          <ColorStudioHub
            initialTab={activeTab || 'custom'}
            onOpenTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {activeStudio === 'typography' && (
          <TypographyStudioHub
            initialTab={activeTab || 'explorer'}
            onOpenTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {activeStudio === 'allTools' && (
          <AllToolsDirectory
            onSelectStudioTab={(studioId, tabId) => handleNavigate(studioId, tabId)}
          />
        )}
      </main>

      {/* 4. Global Search Modal (⌘K) - Previous Clean Light Frosted Glass Style */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xl flex items-start justify-center pt-24 p-4 animate-fade-in select-none">
          <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl p-4 space-y-3 animate-window-open text-stone-900">
            <div className="flex items-center space-x-3 px-3 py-2 border-b border-stone-200">
              <Search className="w-5 h-5 text-purple-600" />
              <input
                type="text"
                autoFocus
                placeholder="Search tools across all studios (Colors, Typography, Scales)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium focus:outline-none text-stone-900 placeholder-stone-400"
              />
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-stone-100 border border-stone-300 rounded text-stone-500">
                ESC
              </kbd>
            </div>

            <div className="space-y-1 max-h-72 overflow-y-auto">
              {[
                { studio: 'colors', tab: 'custom', title: 'Color Studio: Smart Palette Synthesizer', desc: 'Choose 2, 3, 4, 5 colors & questions for 4 custom palettes', key: '1' },
                { studio: 'colors', tab: 'palette', title: 'Color Studio: Palette & Harmonies', desc: 'Harmonic color wheel & 5-role system', key: '2' },
                { studio: 'colors', tab: 'shades', title: 'Color Studio: Shades & Tints (50-950)', desc: '11-step mathematical Tailwind shade scale', key: 'S' },
                { studio: 'colors', tab: 'contrast', title: 'Color Studio: WCAG 2.1 Contrast Checker', desc: 'Realtime ratio scoring & 1-click Auto-Fix', key: 'C' },
                { studio: 'colors', tab: 'imagePicker', title: 'Color Studio: Image Color Extractor', desc: '5-pin real-time photo extractor', key: 'I' },
                { studio: 'colors', tab: 'trending', title: 'Color Studio: Trending Palettes', desc: '100+ curated design inspirations', key: 'T' },
                { studio: 'colors', tab: 'export', title: 'Color Studio: Code & Token Export', desc: 'Export CSS, Tailwind, SCSS, JSON & SVG', key: 'E' },
                { studio: 'typography', tab: 'explorer', title: 'Typography: Font Explorer & Search', desc: '30+ Google fonts directory & filter', key: '3' },
                { studio: 'typography', tab: 'pairings', title: 'Typography: Font Pairing Engine', desc: 'Curated heading + body pairings with scores', key: 'P' },
                { studio: 'typography', tab: 'typeScale', title: 'Typography: Modular Scale Calculator', desc: 'Golden ratio & type hierarchy ladder', key: 'M' },
                { studio: 'typography', tab: 'playground', title: 'Typography: Editorial & UI Playground', desc: 'Live landing hero & article tester', key: 'L' },
                { studio: 'typography', tab: 'reverse', title: 'Typography: Reverse Pairing Finder', desc: 'Find heading pairs for any body font', key: 'R' },
                { studio: 'typography', tab: 'export', title: 'Typography: CSS & CDN Exporter', desc: 'Google Fonts CDN <link> & Tailwind typography', key: 'X' },
                { studio: 'allTools', tab: null, title: 'All Studios Directory', desc: 'Browse full suite & roadmap engines', key: '4' },
              ]
                .filter((item) =>
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.desc.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleNavigate(item.studio, item.tab);
                      setIsSearchOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-purple-50 hover:text-purple-900 flex items-center justify-between text-left transition group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 group-hover:text-purple-700">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium">{item.desc}</p>
                    </div>
                    <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-white border border-stone-200 rounded text-stone-500">
                      {item.key}
                    </kbd>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <SharedDesignProvider>
        <SoftwareAppMain />
      </SharedDesignProvider>
    </ToastProvider>
  );
}
