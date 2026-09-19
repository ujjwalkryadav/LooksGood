import React from 'react';
import { HomeHeroCanvas } from './HomeHeroCanvas';
import { TrustedBySection } from './TrustedBySection';
import { ToolsSplitSection } from './ToolsSplitSection';
import { FourFeaturesSection } from './FourFeaturesSection';
import { HomeFooter } from './HomeFooter';

export function HomeSoftwareHub({ onNavigate }) {
  const handleNavigateStudio = (studio, tab) => {
    if (onNavigate) {
      onNavigate(studio, tab);
    }
  };

  return (
    <div className="w-full subtle-architectural-grid animate-fade-in flex flex-col space-y-4">
      {/* 1. Hero Canvas (Color Wheel ➔ Palette ➔ Typography visual flow with ribbons & annotations) */}
      <HomeHeroCanvas onNavigateStudio={handleNavigateStudio} />

      {/* 2. Trusted By Creators / Brand Names Infinite Animated Marquee Ribbon (Positioned right below Hero Functional System) */}
      <TrustedBySection />

      {/* 3. Split 01 Color Studio / 02 Typography Studio Section with Live Simulators */}
      <ToolsSplitSection onNavigateStudio={handleNavigateStudio} />

      {/* 4. Four Key Feature Points */}
      <FourFeaturesSection />

      {/* 5. Clean Modern Creative Studio Footer */}
      <HomeFooter onNavigateStudio={handleNavigateStudio} />
    </div>
  );
}
