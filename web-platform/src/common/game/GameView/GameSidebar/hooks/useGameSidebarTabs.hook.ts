import { FTUEActionType, useTriggerFTUEAction } from '@noice-com/common-ui';
import { useCallback, useState } from 'react';

import { GameSidebarTab } from '../GameSidebarExpanded';

interface HookResult {
  activeTab: GameSidebarTab;
  changeActiveTab(tab: GameSidebarTab): void;
}

export function useGameSidebarTabs(): HookResult {
  const [activeTab, setActiveTab] = useState(GameSidebarTab.StreamChat);
  const triggerFTUEAction = useTriggerFTUEAction();

  const changeActiveTab = useCallback(
    (tab: GameSidebarTab) => {
      if (tab === GameSidebarTab.Friends) {
        triggerFTUEAction(FTUEActionType.SidebarFriends);
      }

      setActiveTab(tab);
    },
    [triggerFTUEAction],
  );

  return { activeTab, changeActiveTab };
}
