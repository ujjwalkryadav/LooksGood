import React, { useState, useEffect } from 'react';
import { FontExplorerTab } from './tabs/FontExplorerTab';
import { PairingEngineTab } from './tabs/PairingEngineTab';
import { TypeScaleTab } from './tabs/TypeScaleTab';
import { EditorialPlaygroundTab } from './tabs/EditorialPlaygroundTab';
import { ReversePairingTab } from './tabs/ReversePairingTab';
import { TypoExportTab } from './tabs/TypoExportTab';
import { StudioBottomBar } from '../../components/layout/StudioBottomBar';

export function TypographyStudioHub({ initialTab = 'explorer', onOpenTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'explorer');

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
      {/* Active Sub-Tool Content Rendered Directly */}
      <div className="min-h-[550px]">
        {activeTab === 'explorer' && <FontExplorerTab onNavigateTab={handleTabChange} />}
        {activeTab === 'pairings' && <PairingEngineTab onNavigateTab={handleTabChange} />}
        {activeTab === 'typeScale' && <TypeScaleTab />}
        {activeTab === 'playground' && <EditorialPlaygroundTab />}
        {activeTab === 'reverse' && <ReversePairingTab onNavigateTab={handleTabChange} />}
        {activeTab === 'export' && <TypoExportTab />}
      </div>

      {/* Studio Docked Bottom Toolbar */}
      <StudioBottomBar
        studioId="typography"
        activeTab={activeTab}
        onSelectTab={handleTabChange}
      />
    </div>
  );
}
