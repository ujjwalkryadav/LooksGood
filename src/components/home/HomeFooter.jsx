import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Sparkles, ArrowRight, Check, Heart } from 'lucide-react';

export function HomeFooter({ onNavigateStudio }) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Subscribed to LooksGood Creative Drops!', 'success');
    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
    }, 4000);
  };

  const handleLinkClick = (e, studio, tab = null) => {
    e.preventDefault();
    if (onNavigateStudio && studio) {
      onNavigateStudio(studio, tab);
    }
  };

  return (
    <footer className="relative w-full pt-16 sm:pt-24 pb-16 border-t border-stone-200/80 select-none overflow-hidden bg-gradient-to-b from-white/60 via-white/90 to-white backdrop-blur-xl">
      {/* Background Soft Fluid Wave Ribbon */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none opacity-30 overflow-hidden flex justify-center">
        <svg
          className="w-full h-32 max-w-7xl"
          viewBox="0 0 1200 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0 60 C 300 0, 600 120, 900 30 C 1050 -10, 1150 80, 1200 60 L 1200 120 L 0 120 Z"
            fill="url(#footerGradient)"
          />
          <defs>
            <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#EC4899" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
        {/* Top Tier: Big Typographic Brand + Creative Drop Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-200/80 items-start">
          {/* Brand Identity */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-stone-950 flex items-center space-x-2">
                <span>LooksGood</span>
                <span className="text-[#EC4899]">.</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed max-w-md">
                The mathematical creative suite for harmonic color systems, accessible shade scales, and editorial typography hierarchies.
              </p>
            </div>

            {/* System Status Pill */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All 13 Creative Engines Synchronized • v2.4 Pro</span>
            </div>
          </div>

          {/* Newsletter / Creative Drop Box */}
          <div className="lg:col-span-6 space-y-3 bg-stone-50/80 border border-stone-200/80 p-6 rounded-3xl shadow-xs">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-purple-700 tracking-wider uppercase block">
                CREATIVE DIGEST
              </span>
              <h3 className="text-base font-bold text-stone-900 font-sans">
                Get monthly harmonic palettes & trending Google font pairings.
              </h3>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="email"
                placeholder="Enter designer email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs font-sans placeholder:text-stone-400 focus:outline-none focus:border-purple-600 shadow-2xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-stone-950 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                {isSubscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Join Digest</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Middle Tier: Structured Studio Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-8 pb-8 border-b border-stone-200/60">
          {/* AI Assistant Studio Links */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-mono font-bold text-stone-950 uppercase tracking-widest block flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 animate-pulse" />
              <span>AI Design Assistant</span>
            </span>
            <ul className="space-y-2 text-xs text-stone-600 font-medium">
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'ai', 'generator')}
                  className="hover:text-purple-600 hover:translate-x-0.5 transition cursor-pointer text-left font-bold text-purple-700"
                >
                  • Gemini Brand & System Architect
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'ai', 'templates')}
                  className="hover:text-purple-600 hover:translate-x-0.5 transition cursor-pointer text-left"
                >
                  • 1-Click Prompt Templates
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'ai', 'saved')}
                  className="hover:text-purple-600 hover:translate-x-0.5 transition cursor-pointer text-left"
                >
                  • Saved Design Systems Library
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'ai', 'generator')}
                  className="hover:text-purple-600 hover:translate-x-0.5 transition cursor-pointer text-left"
                >
                  • Google AI Studio Key Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Color Studio Links */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-mono font-bold text-stone-950 uppercase tracking-widest block flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              <span>Color Studio Engines</span>
            </span>
            <ul className="space-y-2 text-xs text-stone-600 font-medium">
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'colors', 'custom')}
                  className="hover:text-purple-600 hover:translate-x-0.5 transition cursor-pointer text-left"
                >
                  • Smart Palette Advisor (60-30-10)
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'colors', 'palette')}
                  className="hover:text-purple-600 hover:translate-x-0.5 transition cursor-pointer text-left"
                >
                  • Conic Harmonic Color Wheel
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'colors', 'shades')}
                  className="hover:text-purple-600 hover:translate-x-0.5 transition cursor-pointer text-left"
                >
                  • Tailwind Shade Scales (50-950)
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'colors', 'contrast')}
                  className="hover:text-purple-600 hover:translate-x-0.5 transition cursor-pointer text-left"
                >
                  • W3C WCAG 2.1 AAA Contrast Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'colors', 'trending')}
                  className="hover:text-purple-600 hover:translate-x-0.5 transition cursor-pointer text-left"
                >
                  • 100+ Trending Schemes
                </button>
              </li>
            </ul>
          </div>

          {/* Typography Studio Links */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-mono font-bold text-stone-950 uppercase tracking-widest block flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              <span>Typography Studio Engines</span>
            </span>
            <ul className="space-y-2 text-xs text-stone-600 font-medium">
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'typography', 'explorer')}
                  className="hover:text-pink-600 hover:translate-x-0.5 transition cursor-pointer text-left"
                >
                  • Google Fonts Explorer (30+ Fonts)
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'typography', 'pairings')}
                  className="hover:text-pink-600 hover:translate-x-0.5 transition cursor-pointer text-left"
                >
                  • Algorithmic Font Pairing Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'typography', 'playground')}
                  className="hover:text-pink-600 hover:translate-x-0.5 transition cursor-pointer text-left"
                >
                  • Live Editorial Hero Playground
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'typography', 'typeScale')}
                  className="hover:text-pink-600 hover:translate-x-0.5 transition cursor-pointer text-left"
                >
                  • Modular Scale Hierarchy Ladder
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick(e, 'typography', 'export')}
                  className="hover:text-pink-600 hover:translate-x-0.5 transition cursor-pointer text-left"
                >
                  • Webflow & CSS Token Exporter
                </button>
              </li>
            </ul>
          </div>

          {/* Shortcuts & Navigation */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-mono font-bold text-stone-950 uppercase tracking-widest block">
              Quick Shortcuts
            </span>
            <div className="space-y-2 text-xs font-mono text-stone-600">
              <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                <span>Global Search</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-300 text-stone-800 text-[10px] font-bold">⌘K</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                <span>Quick Harmony Shuffle</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-300 text-stone-800 text-[10px] font-bold">Space</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                <span>All Tools Directory</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-300 text-stone-800 text-[10px] font-bold">4</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Socials & Manifesto */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4 text-xs text-stone-500 font-medium">
            <span>© 2026 LooksGood Creative Suite.</span>
            <span>•</span>
            <span>Crafted for Designers worldwide</span>
          </div>

          {/* Social SVGs */}
          <div className="flex items-center space-x-2.5">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-xl border border-stone-200 hover:border-stone-400 bg-white flex items-center justify-center text-stone-700 hover:text-stone-950 hover:scale-105 transition shadow-2xs"
              title="X (Twitter)"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-xl border border-stone-200 hover:border-stone-400 bg-white flex items-center justify-center text-stone-700 hover:text-stone-950 hover:scale-105 transition shadow-2xs"
              title="Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-xl border border-stone-200 hover:border-stone-400 bg-white flex items-center justify-center text-stone-700 hover:text-stone-950 hover:scale-105 transition shadow-2xs"
              title="GitHub"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Manifesto Statement */}
        <div className="pt-6 border-t border-stone-200/50 text-center">
          <p className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.3em] text-stone-600 uppercase">
            COLORS &nbsp;•&nbsp; TYPE &nbsp;•&nbsp; IDEAS &nbsp;•&nbsp; A BRIGHTER CREATIVE TOMORROW
          </p>
        </div>
      </div>
    </footer>
  );
}
