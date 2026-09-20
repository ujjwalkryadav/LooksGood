import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  KeyRound,
  Bookmark,
  Palette,
  Type,
} from 'lucide-react';
import { AiPromptInputSection } from './components/AiPromptInputSection';
import { AiBrandGuideResult } from './components/AiBrandGuideResult';
import { AiApiKeyModal } from './components/AiApiKeyModal';
import { AiSavedGuidesDrawer } from './components/AiSavedGuidesDrawer';
import {
  generateDesignSystemWithGemini,
  getStoredApiKey,
  generateOfflineDesignSystem,
} from './services/geminiService';
import { useToast } from '../../context/ToastContext';

const SAVED_GUIDES_KEY = 'looksgood_ai_saved_guides';

export function AiStudioHub({ onNavigateStudio }) {
  const { showToast } = useToast();

  const [hasApiKey, setHasApiKey] = useState(() => Boolean(getStoredApiKey()));
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [currentBrandGuide, setCurrentBrandGuide] = useState(() =>
    generateOfflineDesignSystem({
      promptText: 'Vibrant Neo-Modernist Design Studio & Creative Hub',
      industry: 'Creative Agency & SaaS',
      mood: 'Vibrant & Modern',
    })
  );
  const [savedGuides, setSavedGuides] = useState(() => {
    try {
      const stored = localStorage.getItem(SAVED_GUIDES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [lastPromptParams, setLastPromptParams] = useState(null);

  useEffect(() => {
    const key = getStoredApiKey();
    setHasApiKey(Boolean(key));
  }, [isApiKeyModalOpen]);

  const handleGenerate = async (promptParams) => {
    setIsLoading(true);
    setLastPromptParams(promptParams);

    const steps = [
      'Deconstructing brand concept & vibe semantics...',
      'Synthesizing 60-30-10 harmonic color hierarchy...',
      'Calibrating Google Fonts pairings & modular scales...',
      'Architecting UI component tokens & live mockup...',
    ];

    let stepIndex = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setLoadingStep(steps[stepIndex]);
    }, 900);

    try {
      const result = await generateDesignSystemWithGemini({
        ...promptParams,
      });

      clearInterval(stepInterval);
      setCurrentBrandGuide(result);
      showToast(`Generated design guide for "${result.brandName}"!`, 'success');

      // Scroll smoothly down to the results section
      window.scrollTo({ top: 350, behavior: 'smooth' });
    } catch (err) {
      clearInterval(stepInterval);
      console.error('Generation error:', err);
      showToast('Generation failed. Using smart offline synthesizer.', 'error');
      const fallback = generateOfflineDesignSystem(promptParams);
      setCurrentBrandGuide(fallback);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleSaveToLibrary = () => {
    if (!currentBrandGuide) return;
    const guideToSave = {
      ...currentBrandGuide,
      id: currentBrandGuide.id || `guide-${Date.now()}`,
      savedAt: new Date().toISOString(),
    };

    const updated = [guideToSave, ...savedGuides.filter((g) => g.brandName !== guideToSave.brandName)];
    setSavedGuides(updated);
    try {
      localStorage.setItem(SAVED_GUIDES_KEY, JSON.stringify(updated));
      showToast(`Saved "${guideToSave.brandName}" to your design library!`, 'success');
    } catch {
      // ignore
    }
  };

  const handleDeleteSavedGuide = (guideId) => {
    const updated = savedGuides.filter((g, idx) => (g.id || idx) !== guideId);
    setSavedGuides(updated);
    try {
      localStorage.setItem(SAVED_GUIDES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const isCurrentSaved = Boolean(
    currentBrandGuide && savedGuides.some((g) => g.brandName === currentBrandGuide.brandName)
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 select-text pb-28 animate-fade-in">
      {/* 1. Main Prompt Input Section */}
      <AiPromptInputSection
        onGenerate={handleGenerate}
        isLoading={isLoading}
        loadingStep={loadingStep}
        hasApiKey={hasApiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* 2. Brand Guide Result View */}
      {currentBrandGuide && (
        <AiBrandGuideResult
          brandGuide={currentBrandGuide}
          onRegenerate={() => lastPromptParams && handleGenerate(lastPromptParams)}
          onNavigateStudio={onNavigateStudio}
          onSaveToLibrary={handleSaveToLibrary}
          isSaved={isCurrentSaved}
        />
      )}

      {/* 3. API Key Modal Dialog */}
      <AiApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={(key) => setHasApiKey(Boolean(key))}
      />

      {/* 4. Saved Guides Drawer */}
      <AiSavedGuidesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedGuides={savedGuides}
        onSelectGuide={(g) => setCurrentBrandGuide(g)}
        onDeleteGuide={handleDeleteSavedGuide}
      />

      {/* 5. Fixed Docked Studio Toolbar */}
      <div className="fixed bottom-5 inset-x-0 mx-auto w-fit z-40 px-4 pointer-events-auto animate-fade-in select-none">
        <div className="p-1.5 bg-[#0D0C0B]/95 backdrop-blur-2xl border border-stone-800/90 rounded-2xl shadow-2xl shadow-black/60 flex items-center space-x-1 sm:space-x-2 overflow-x-auto max-w-[95vw]">
          {/* Studio Tag */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-stone-900/80 rounded-xl border border-stone-800 text-[11px] font-mono font-bold text-stone-400 mr-1 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
            <span className="text-white">AI Assistant</span>
          </div>

          {/* Quick Actions */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span>New Prompt</span>
          </button>

          <button
            onClick={() => setIsSavedDrawerOpen(true)}
            className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-stone-300 hover:text-white hover:bg-stone-800/80 transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
            title="View saved design systems"
          >
            <Bookmark className="w-3.5 h-3.5 text-purple-400" />
            <span>Saved ({savedGuides.length})</span>
          </button>

          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-stone-300 hover:text-white hover:bg-stone-800/80 transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
            title="Google AI Studio Gemini API Key Settings"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gemini Key</span>
          </button>

          {onNavigateStudio && (
            <>
              <div className="w-[1px] h-5 bg-stone-800 hidden sm:block" />
              <button
                onClick={() => onNavigateStudio('colors', 'palette')}
                className="hidden sm:flex px-3 py-2 rounded-xl text-xs font-bold text-stone-400 hover:text-white hover:bg-stone-800/80 transition items-center space-x-1.5 cursor-pointer"
                title="Go to Color Studio"
              >
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                <span>Colors</span>
              </button>
              <button
                onClick={() => onNavigateStudio('typography', 'explorer')}
                className="hidden sm:flex px-3 py-2 rounded-xl text-xs font-bold text-stone-400 hover:text-white hover:bg-stone-800/80 transition items-center space-x-1.5 cursor-pointer"
                title="Go to Typography Studio"
              >
                <Type className="w-3.5 h-3.5 text-pink-400" />
                <span>Typography</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
