import { CoreAssets } from '@noice-com/assets-core';
import {
  FTUEActionType,
  Icon,
  Tooltip,
  useTriggerFTUEAction,
  VisuallyHidden,
  WithChildren,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { useCallback, useEffect, useRef } from 'react';
import { MdEmojiEvents, MdLeaderboard } from 'react-icons/md';

import { GameSidebarTab } from '../types';

import styles from './TabButtons.module.css';

import { usePlaySound, AppSoundKeys } from '@common/sound';
import { useStreamGame } from '@common/stream';
import { useUnreadFlags } from '@context';

interface Props {
  activeTab: GameSidebarTab;
  disableGroupChatTab?: boolean;
  onTabButtonClick(tab: GameSidebarTab): void;
}

export function TabButtons({ activeTab, disableGroupChatTab, onTabButtonClick }: Props) {
  const { isSolo } = useStreamGame();
  const unreadFlags = useUnreadFlags();
  const [playHover] = usePlaySound(AppSoundKeys.GenericHover);
  const triggerFTUEAction = useTriggerFTUEAction();

  const teamChatRef = useRef<HTMLButtonElement>(null);

  const onCardActivationClick = useCallback(() => {
    triggerFTUEAction(FTUEActionType.CardActivationTabOpen);
    onTabButtonClick(GameSidebarTab.CardEvents);
  }, [onTabButtonClick, triggerFTUEAction]);

  const onLeaderboardClick = useCallback(() => {
    triggerFTUEAction(FTUEActionType.LeaderboardOpen);
    onTabButtonClick(GameSidebarTab.LeaderBoard);
  }, [onTabButtonClick, triggerFTUEAction]);

  const onTeamChatClick = useCallback(() => {
    triggerFTUEAction(FTUEActionType.TeamChatMessagesOpen);
    onTabButtonClick(GameSidebarTab.TeamChat);
  }, [onTabButtonClick, triggerFTUEAction]);

  useEffect(() => {
    if (isSolo && activeTab === GameSidebarTab.TeamChat) {
      onTabButtonClick(GameSidebarTab.StreamChat);
    }
  }, [activeTab, isSolo, onTabButtonClick]);

  const GroupChatButtonWrapper = ({ children }: WithChildren) =>
    disableGroupChatTab ? (
      <Tooltip
        content="Team chat is disabled in solo play mode"
        placement="bottom"
      >
        {children}
      </Tooltip>
    ) : (
      <>{children}</>
    );

  return (
    <div className={styles.wrapper}>
      <button
        className={classNames(styles.button, {
          [styles.active]: activeTab === GameSidebarTab.StreamChat,
        })}
        onClick={() => onTabButtonClick(GameSidebarTab.StreamChat)}
        onMouseEnter={() => playHover()}
      >
        <Icon
          className={styles.icon}
          icon={CoreAssets.Icons.Chat}
        />

        <VisuallyHidden>Stream Chat</VisuallyHidden>

        {unreadFlags.streamMessages && !isSolo && (
          <span
            aria-label="Unread chat messages"
            aria-live="polite"
            className={styles.notificationDot}
            role="status"
          />
        )}
      </button>

      <GroupChatButtonWrapper>
        <button
          aria-disabled={disableGroupChatTab ? 'true' : undefined}
          className={classNames(styles.button, {
            [styles.active]: activeTab === GameSidebarTab.TeamChat,
          })}
          data-ftue-anchor="teamChat"
          ref={teamChatRef}
          onClick={disableGroupChatTab ? undefined : onTeamChatClick}
          onMouseEnter={disableGroupChatTab ? undefined : () => playHover()}
        >
          <Icon
            className={styles.icon}
            icon={CoreAssets.Icons.TeamChat}
          />

          <VisuallyHidden>Team Chat</VisuallyHidden>

          {unreadFlags.groupMessages && !isSolo && (
            <span
              aria-label="Unread chat messages"
              aria-live="polite"
              className={styles.notificationDot}
              role="status"
            />
          )}
        </button>
      </GroupChatButtonWrapper>

      <button
        className={classNames(styles.button, {
          [styles.active]: activeTab === GameSidebarTab.CardEvents,
        })}
        data-ftue-anchor="cardActivationTab"
        onClick={onCardActivationClick}
        onMouseEnter={() => playHover()}
      >
        <MdEmojiEvents className={styles.icon} />

        <VisuallyHidden>
          <span className={styles.label}>Card activity</span>
        </VisuallyHidden>
      </button>

      <button
        className={classNames(styles.button, {
          [styles.active]: activeTab === GameSidebarTab.LeaderBoard,
        })}
        data-ftue-anchor="leaderboardTab"
        onClick={onLeaderboardClick}
        onMouseEnter={() => playHover()}
      >
        <MdLeaderboard className={styles.icon} />

        <VisuallyHidden>
          <span className={styles.label}>Leaderboard</span>
        </VisuallyHidden>
      </button>
    </div>
  );
}
