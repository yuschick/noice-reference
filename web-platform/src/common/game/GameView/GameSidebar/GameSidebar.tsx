import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import { GroupEventMessage } from '@noice-com/card-game';
import { useMountEffect } from '@noice-com/common-react-core';
import { FTUEActionType, IconButton, useTriggerFTUEAction } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useCallback, useId, useRef } from 'react';

import styles from './GameSidebar.module.css';
import { GameSidebarExpanded } from './GameSidebarExpanded';
import { GameSidebarMinimized } from './GameSidebarMinimized';
import { useGameSidebarTabs } from './hooks/useGameSidebarTabs.hook';

import { useGameSidebarChannelQuery } from '@gen';

export interface GameSidebarProps {
  className?: string;
  channelId: Nullable<string>;
  groupEvents: GroupEventMessage[];
  isNoicePredictionsEnabled: boolean;
  isGameSidebarExpanded: boolean;
  toggleGameSidebarExpanded: () => void;
  onChannelPageButtonClick(): void;
}

gql`
  query GameSidebarChannel($channelId: ID!, $skipAuthFields: Boolean = false) {
    channel(id: $channelId) {
      id
      ...GameSidebarMinimizedChannel
      ...GameSidebarExpandedChannel
    }
  }
`;

export function GameSidebar({
  className,
  channelId,
  groupEvents,
  isNoicePredictionsEnabled,
  isGameSidebarExpanded,
  onChannelPageButtonClick,
  toggleGameSidebarExpanded,
}: GameSidebarProps) {
  const wrapperId = useId();
  const timeoutRef = useRef(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerFTUEAction = useTriggerFTUEAction();

  const { activeTab, changeActiveTab } = useGameSidebarTabs();

  const { data } = useGameSidebarChannelQuery({
    ...variablesOrSkip({ channelId }),
  });
  const channel = data?.channel ?? null;

  const resizeGame = useCallback(() => {
    timeoutRef.current = window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
  }, []);

  const onToggleClick = useCallback(async () => {
    if (isGameSidebarExpanded) {
      await triggerFTUEAction(FTUEActionType.GameSidebarMinimized);
    }

    toggleGameSidebarExpanded();
    resizeGame();
  }, [isGameSidebarExpanded, toggleGameSidebarExpanded, resizeGame, triggerFTUEAction]);

  useMountEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  });

  return (
    <div
      className={classNames(styles.wrapper, className, {
        [styles.minimized]: !isGameSidebarExpanded,
        [styles.expanded]: !!isGameSidebarExpanded,
      })}
      id={wrapperId}
      ref={wrapperRef}
    >
      <div className={classNames(styles.content, styles.minimizedContent)}>
        {channel ? (
          <GameSidebarMinimized channel={channel} />
        ) : (
          <GameSidebarMinimized.Loading />
        )}
      </div>

      <div className={classNames(styles.content, styles.expandedContent)}>
        <GameSidebarExpanded
          activeTab={activeTab}
          channel={channel}
          expandButtonAttributes={{
            'aria-expanded': !!isGameSidebarExpanded,
            onClick: onToggleClick,
            'aria-controls': wrapperId,
            'data-ftue-anchor': !isGameSidebarExpanded
              ? undefined
              : 'minimize-game-sidebar',
          }}
          groupEvents={groupEvents}
          isNoicePredictionsEnabled={isNoicePredictionsEnabled}
          onChannelPageButtonClick={onChannelPageButtonClick}
          onTabButtonClick={changeActiveTab}
        />
      </div>

      {isGameSidebarExpanded ? null : (
        <div className={styles.toggleButtonWrapper}>
          <IconButton
            aria-controls={wrapperId}
            aria-expanded={!!isGameSidebarExpanded}
            icon={CoreAssets.Icons.Expand}
            label="Toggle game sidebar"
            level="secondary"
            size="sm"
            onClick={onToggleClick}
          />
        </div>
      )}
    </div>
  );
}
