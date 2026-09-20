import React, { useState, useEffect } from 'react';
import { KeyRound, Check, AlertCircle, ExternalLink, Eye, EyeOff, X, Sparkles, ShieldCheck } from 'lucide-react';
import { getStoredApiKey, saveStoredApiKey, testGeminiApiKey } from '../services/geminiService';
import { useToast } from '../../../context/ToastContext';

export function AiApiKeyModal({ isOpen, onClose, onKeySaved }) {
  const { showToast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredApiKey();
      setApiKey(stored);
      setTestStatus(null);
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveStoredApiKey(apiKey);
    showToast(apiKey ? 'Google AI Studio API Key saved securely in your browser!' : 'API Key cleared. Using built-in generator.', 'success');
    if (onKeySaved) onKeySaved(apiKey);
    onClose();
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setErrorMessage('Please enter an API key to test.');
      setTestStatus('error');
      return;
    }

    setIsTesting(true);
    setTestStatus(null);
    setErrorMessage('');

    try {
      await testGeminiApiKey(apiKey);
      setTestStatus('success');
      showToast('API Key verified successfully with Google AI Studio!', 'success');
    } catch (err) {
      setTestStatus('error');
      setErrorMessage(err.message || 'Failed to authenticate with Google AI Studio.');
      showToast('Connection test failed. Check key & permissions.', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleClear = () => {
    setApiKey('');
    saveStoredApiKey('');
    setTestStatus(null);
    setErrorMessage('');
    showToast('API Key removed.', 'info');
    if (onKeySaved) onKeySaved('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 animate-window-open text-stone-900 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 flex-shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                Google AI Studio
              </span>
            </div>
            <h3 className="text-xl font-black font-display text-stone-900 mt-1">
              Gemini API Key Settings
            </h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Connect your free Google AI Studio key for custom prompt synthesis.
            </p>
          </div>
        </div>

        {/* Security Alert Badge */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start space-x-2.5 text-xs text-stone-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Your key stays strictly client-side in your local browser storage (<code className="font-mono text-[11px] text-purple-700">localStorage</code>) and is never transmitted to any third-party servers.
          </p>
        </div>

        {/* Input Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
            <span>Gemini API Key</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-purple-600 hover:text-purple-800 font-semibold flex items-center space-x-1 underline decoration-purple-300"
            >
              <span>Get Free Key at Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setTestStatus(null);
                setErrorMessage('');
              }}
              placeholder="AIzaSy..."
              className="w-full pl-3.5 pr-20 py-2.5 bg-stone-100/80 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              title={showPassword ? 'Hide Key' : 'Show Key'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Test Connection Status Banner */}
        {testStatus === 'success' && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Successfully connected! Google AI Studio is active & ready.</span>
          </div>
        )}

        {testStatus === 'error' && (
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs font-medium flex items-start space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Authentication Error:</span>
              <p className="text-[11px] text-rose-700 leading-tight">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Free-tier Note */}
        <div className="text-[11px] text-stone-500 bg-purple-50/60 p-2.5 rounded-xl border border-purple-100 flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
          <span>Don't have a key? Leave blank to use our built-in offline smart generator!</span>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-200">
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-2 text-xs font-bold text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
          >
            Clear Key
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={isTesting || !apiKey}
              onClick={handleTestConnection}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
            >
              {isTesting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <span>Test Key</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 hover:opacity-95 transition cursor-pointer"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
