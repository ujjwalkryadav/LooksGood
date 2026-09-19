import React from 'react';
import { Sparkles, Palette, Type, BookOpen, CheckCircle2 } from 'lucide-react';

export function MobileBottomNav({ activeTab, setActiveTab }) {
  const items = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'color', label: 'Color', icon: Palette },
    { id: 'typography', label: 'Type', icon: Type },
    { id: 'theory', label: 'Theory', icon: BookOpen },
    { id: 'score', label: 'Score', icon: CheckCircle2 },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/80 px-2 py-1.5 shadow-card">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-brand-600 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-brand-50' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
