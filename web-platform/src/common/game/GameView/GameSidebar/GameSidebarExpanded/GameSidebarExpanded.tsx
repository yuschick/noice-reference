import { gql } from '@apollo/client';
import { GroupEventMessage, Leaderboard } from '@noice-com/card-game';
import { BlockUserModal } from '@noice-com/social';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { ButtonHTMLAttributes, useState } from 'react';

import { ChannelSection } from './ChannelSection';
import { ChatTab } from './Chat';
import { ChatChannel } from './Chat/types';
import styles from './GameSidebarExpanded.module.css';
import { GroupEvents } from './GroupEvents';
import { useGameSidebarRenderedTabs } from './hook/useGameSidebarRenderedTabs.hook';
import { TabButtons } from './TabButtons';
import { GameSidebarTab } from './types';

import { useStreamGame } from '@common/stream';
import { GameSidebarExpandedChannelFragment } from '@gen';

gql`
  fragment GameSidebarExpandedChannel on ChannelChannel {
    id
    ...ChannelSectionChannel
  }
`;

interface GameSidebarExpandedProps {
  isNoicePredictionsEnabled: boolean;
  channel: Nullable<GameSidebarExpandedChannelFragment>;
  activeTab: GameSidebarTab;
  groupEvents: GroupEventMessage[];
  expandButtonAttributes: ButtonHTMLAttributes<HTMLButtonElement> & {
    'data-ftue-anchor'?: string;
  };
  onChannelPageButtonClick(): void;
  onTabButtonClick(tab: GameSidebarTab): void;
}

export function GameSidebarExpanded({
  isNoicePredictionsEnabled,
  channel,
  onChannelPageButtonClick,
  activeTab,
  onTabButtonClick,
  groupEvents,
  expandButtonAttributes,
}: GameSidebarExpandedProps) {
  const [confirmBlockedUserId, setConfirmBlockedUserId] =
    useState<Nullable<string>>(null);

  const { isSolo } = useStreamGame();
  const renderedTabs = useGameSidebarRenderedTabs(activeTab);

  const chatTabeIsActive = [GameSidebarTab.StreamChat, GameSidebarTab.TeamChat].includes(
    activeTab,
  );

  return (
    <div className={styles.wrapper}>
      <ChannelSection
        channel={channel}
        expandButtonAttributes={expandButtonAttributes}
        onChannelPageButtonClick={onChannelPageButtonClick}
      />

      {isNoicePredictionsEnabled && (
        <TabButtons
          activeTab={activeTab}
          disableGroupChatTab={isSolo}
          onTabButtonClick={onTabButtonClick}
        />
      )}

      <div className={styles.content}>
        <div
          className={classNames(styles.tab, styles.chatTab, {
            [styles.active]: chatTabeIsActive,
          })}
        >
          {(renderedTabs.includes(GameSidebarTab.StreamChat) ||
            renderedTabs.includes(GameSidebarTab.TeamChat)) && (
            <ChatTab
              activeChatChannel={
                activeTab === GameSidebarTab.StreamChat
                  ? ChatChannel.Stream
                  : ChatChannel.Group
              }
              channelId={channel?.id ?? null}
              chatTabIsActive={chatTabeIsActive}
            />
          )}
        </div>

        {isNoicePredictionsEnabled && (
          <>
            <div
              className={classNames(styles.tab, {
                [styles.active]: activeTab === GameSidebarTab.CardEvents,
              })}
            >
              {renderedTabs.includes(GameSidebarTab.CardEvents) && (
                <GroupEvents
                  groupEvents={groupEvents}
                  isHidden={activeTab !== GameSidebarTab.CardEvents}
                />
              )}
            </div>

            <div
              className={classNames(styles.tab, styles.leaderboardWrapper, {
                [styles.active]: activeTab === GameSidebarTab.LeaderBoard,
              })}
            >
              {renderedTabs.includes(GameSidebarTab.LeaderBoard) && (
                <Leaderboard showSoloWarning={isSolo} />
              )}
            </div>
          </>
        )}

        {!!confirmBlockedUserId && (
          <BlockUserModal
            blockedUserId={confirmBlockedUserId}
            onDismiss={() => setConfirmBlockedUserId(null)}
          />
        )}
      </div>
    </div>
  );
}
