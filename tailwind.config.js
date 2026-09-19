/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        // LooksGood Creative OS Palette
        brand: {
          purple: '#7C3AED',
          purpleLight: '#F5F3FF',
          purpleBorder: '#DDD6FE',
          purpleDark: '#5B21B6',
          pink: '#EC4899',
          cyan: '#06B6D4',
        },
        floral: {
          white: '#FAF9F6',
          surface: '#FFFFFF',
          border: '#E8E5DF',
          muted: '#F2EFE9',
        },
        dust: {
          grey: '#78716C',
          light: '#A8A29E',
          border: '#E7E5E4',
          dark: '#57534E',
        },
        charcoal: {
          brown: '#2D2422',
          surface: '#3D3230',
          border: '#4A3E3C',
        },
        carbon: {
          black: '#0D0C0B',
          soft: '#1C1917',
          surface: '#292524',
        },
        paprika: {
          DEFAULT: '#E24A2B',
          hover: '#CD3C1F',
          light: '#FDF2F0',
          border: '#F9CECA',
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(45, 36, 34, 0.04), 0 1px 2px -1px rgba(45, 36, 34, 0.02)',
        'card': '0 4px 20px -2px rgba(45, 36, 34, 0.05), 0 2px 6px -1px rgba(45, 36, 34, 0.02)',
        'window': '0 16px 40px -8px rgba(13, 12, 11, 0.12), 0 8px 16px -4px rgba(13, 12, 11, 0.06)',
        'window-active': '0 24px 60px -12px rgba(124, 58, 237, 0.15), 0 12px 24px -6px rgba(13, 12, 11, 0.08)',
        'dock': '0 20px 40px -10px rgba(13, 12, 11, 0.14), 0 8px 16px -4px rgba(13, 12, 11, 0.06)',
        'purple-sm': '0 4px 14px 0 rgba(124, 58, 237, 0.25)',
        'purple-lg': '0 10px 25px -3px rgba(124, 58, 237, 0.3)',
      },
      transitionTimingFunction: {
        'os-spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'dock-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        windowOpen: {
          '0%': { opacity: '0', transform: 'scale(0.94) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        windowMinimize: {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.85) translateY(40px)' },
        },
        dockBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'window-open': 'windowOpen 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'window-minimize': 'windowMinimize 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'dock-bounce': 'dockBounce 500ms ease-in-out',
      }
    },
  },
  plugins: [],
}
