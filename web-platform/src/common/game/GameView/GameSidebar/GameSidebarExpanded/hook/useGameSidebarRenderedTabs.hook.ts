import { useEffect, useState } from 'react';

import { GameSidebarTab } from '../types';

export function useGameSidebarRenderedTabs(activeTab: GameSidebarTab): GameSidebarTab[] {
  const [renderedTabs, setRenderedTabs] = useState<GameSidebarTab[]>([]);

  useEffect(() => {
    setRenderedTabs((prev) => {
      if (prev.includes(activeTab)) {
        return prev;
      }

      return [...prev, activeTab];
    });
  }, [activeTab]);

  return renderedTabs;
}
