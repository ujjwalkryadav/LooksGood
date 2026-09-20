import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  ArrowRight,
  KeyRound,
  RefreshCw,
  Lightbulb,
  Flame,
} from 'lucide-react';
import { AI_CONCEPT_TEMPLATES, INDUSTRY_OPTIONS, MOOD_TAGS, AESTHETIC_STYLES } from '../data/aiPresets';

export function AiPromptInputSection({
  onGenerate,
  isLoading,
  loadingStep,
  hasApiKey,
  onOpenApiKeyModal,
}) {
  const [promptText, setPromptText] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const toggleMood = (mood) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter((m) => m !== mood));
    } else {
      if (selectedMoods.length < 3) {
        setSelectedMoods([...selectedMoods, mood]);
      } else {
        setSelectedMoods([...selectedMoods.slice(1), mood]);
      }
    }
  };

  const handleApplyTemplate = (tpl) => {
    setPromptText(tpl.promptText);
    setSelectedIndustry(tpl.industry);
    setSelectedStyle(tpl.style);
    setTargetAudience(tpl.targetAudience);
    setSelectedMoods(tpl.mood.split(',').map((s) => s.trim()).slice(0, 3));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (isLoading) return;
    onGenerate({
      promptText: promptText.trim() || 'Modern innovative design system',
      industry: selectedIndustry,
      mood: selectedMoods.join(', '),
      style: selectedStyle,
      targetAudience,
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Main Interactive Prompt Canvas Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm relative overflow-hidden space-y-6">
        {/* Glow ambient background aura */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-purple-400/15 via-pink-400/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-indigo-400/15 via-sky-400/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar with API Key Status Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/80">
                Google AI Studio • Gemini Powered
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-stone-900 tracking-tight">
              AI Brand & Design System Architect
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              Describe your brand idea, product vibe, or creative concept. Gemini AI will synthesize complete color palettes, Google Font pairings, UI tokens, and interactive mockups.
            </p>
          </div>

          {/* API Key Status Pill Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition border cursor-pointer self-start sm:self-center flex-shrink-0 ${
              hasApiKey
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100/80 shadow-2xs'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 shadow-2xs'
            }`}
            title="Configure Google AI Studio API Key"
          >
            <KeyRound className={`w-3.5 h-3.5 ${hasApiKey ? 'text-emerald-600' : 'text-purple-600'}`} />
            <span>{hasApiKey ? 'Google AI Key Connected' : 'Set Gemini Key'}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                hasApiKey ? 'bg-emerald-500' : 'bg-amber-400 animate-ping'
              }`}
            />
          </button>
        </div>

        {/* 2. Free-Form Prompt Textarea */}
        <div className="relative z-10 space-y-2">
          <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Describe Your Design Concept or Brand Vision</span>
            </span>
            <span className="text-[11px] text-stone-400 font-normal">
              English, Hindi, or mixed concepts accepted
            </span>
          </label>

          <div className="relative">
            <textarea
              rows={4}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g., A luxury artisanal perfumery in Kyoto with minimalist obsidian bottles, warm sandalwood gold accents, quiet elegance, and Japanese typography aesthetic..."
              className="w-full p-4 rounded-2xl bg-stone-50/80 border border-stone-300/90 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition resize-none leading-relaxed shadow-inner"
            />
            {promptText && (
              <button
                onClick={() => setPromptText('')}
                className="absolute right-3 top-3 text-xs text-stone-400 hover:text-stone-600 px-2 py-1 rounded-lg bg-stone-200/60"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* 3. Quick Inspiration Templates Chips */}
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 flex items-center space-x-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Prompt Templates:</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {AI_CONCEPT_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleApplyTemplate(tpl)}
                className="p-3 rounded-2xl bg-stone-50/90 hover:bg-purple-50/70 border border-stone-200/80 hover:border-purple-300 text-left transition group cursor-pointer flex flex-col justify-between space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 group-hover:text-purple-700 flex items-center space-x-1.5">
                    <span>{tpl.emoji}</span>
                    <span>{tpl.title}</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-stone-500 border border-stone-200 group-hover:border-purple-200">
                    {tpl.badge}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 line-clamp-2 leading-tight">
                  {tpl.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Optional Concept Fine-Tuning (Accordion) */}
        <div className="relative z-10 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center space-x-2 cursor-pointer py-1"
          >
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>{isAdvancedOpen ? '▲ Hide Concept Attributes' : '▼ Fine-Tune Vibe, Industry & Style (Optional)'}</span>
          </button>

          {isAdvancedOpen && (
            <div className="mt-4 space-y-4 p-4 rounded-2xl bg-stone-50/60 border border-stone-200/80 animate-fade-in">
              {/* Mood Tags */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-stone-700">Mood & Emotion Tags (Select up to 3):</label>
                <div className="flex flex-wrap gap-1.5">
                  {MOOD_TAGS.map((mood) => {
                    const isSelected = selectedMoods.includes(mood);
                    return (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => toggleMood(mood)}
                        className={`px-3 py-1 rounded-xl text-xs font-medium transition cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 text-white font-bold shadow-xs'
                            : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {mood}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Industry & Aesthetic row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700">Industry / Domain:</label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-stone-300 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select industry (or enter in prompt)</option>
                    {INDUSTRY_OPTIONS.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700">Aesthetic Direction:</label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-stone-300 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select visual aesthetic</option>
                    {AESTHETIC_STYLES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Primary Generate Action Button */}
        <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-500 font-medium flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>AI generates colors, fonts, contrast checks, and UI components all in one go.</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white shadow-xl flex items-center justify-center space-x-2.5 transition-all cursor-pointer ${
              isLoading
                ? 'bg-purple-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 hover:scale-[1.02] shadow-purple-600/30'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>{loadingStep || 'AI Synthesizing Design System...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-pink-300 animate-pulse" />
                <span>Generate Design System Guide</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
