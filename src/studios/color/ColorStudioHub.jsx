import React, { useState, useEffect } from 'react';
import { CustomPaletteAdvisorTab } from './tabs/CustomPaletteAdvisorTab';
import { PaletteGeneratorTab } from './tabs/PaletteGeneratorTab';
import { ShadesTintsTab } from './tabs/ShadesTintsTab';
import { ContrastTab } from './tabs/ContrastTab';
import { ImageExtractorTab } from './tabs/ImageExtractorTab';
import { TrendingTab } from './tabs/TrendingTab';
import { ExportTab } from './tabs/ExportTab';
import { StudioBottomBar } from '../../components/layout/StudioBottomBar';

export function ColorStudioHub({ initialTab = 'custom', onOpenTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'custom');

  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onOpenTab) onOpenTab(tabId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto select-text pb-28 animate-fade-in">
      {/* Active Sub-Tool Content */}
      <div className="min-h-[550px]">
        {activeTab === 'custom' && <CustomPaletteAdvisorTab onNavigateTab={handleTabChange} />}
        {activeTab === 'palette' && <PaletteGeneratorTab onNavigateTab={handleTabChange} />}
        {activeTab === 'shades' && <ShadesTintsTab />}
        {activeTab === 'contrast' && <ContrastTab />}
        {activeTab === 'imagePicker' && <ImageExtractorTab onNavigateTab={handleTabChange} />}
        {activeTab === 'trending' && <TrendingTab onNavigateTab={handleTabChange} />}
        {activeTab === 'export' && <ExportTab />}
      </div>

      {/* Studio Docked Bottom Toolbar */}
      <StudioBottomBar
        studioId="colors"
        activeTab={activeTab}
        onSelectTab={handleTabChange}
      />
    </div>
  );
}
