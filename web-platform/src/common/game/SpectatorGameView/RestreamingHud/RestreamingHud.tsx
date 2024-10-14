import { gql } from '@apollo/client';
import { LeaderboardItem, useLeaderboardGroups } from '@noice-com/card-game';
import { ChatMessage, useChat } from '@noice-com/chat-react-web';
import { NoiceLogo } from '@noice-com/common-ui';
import { MdGroup } from 'react-icons/md';

import styles from './RestreamingHud.module.css';

import { RestreamingHudChannelFragment, useRestreamingHudChannelQuery } from '@gen';

const MAX_MESSAGES = 7;
const MAX_LB_GROUPS = 3;

gql`
  query RestreamingHudChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      viewerCount
    }
  }
`;

interface Props {
  channel: RestreamingHudChannelFragment;
  isGameDisabled: boolean;
}

export function RestreamingHud({ channel, isGameDisabled }: Props) {
  const {
    messages: { messages },
  } = useChat('stream');
  const groups = useLeaderboardGroups();

  const { data } = useRestreamingHudChannelQuery({
    variables: {
      channelId: channel.id,
    },
  });

  const viewerCount = data?.channel?.viewerCount ?? 0;
  const cappedMessages = messages.slice(-MAX_MESSAGES);
  const cappedGroups = groups.slice(0, MAX_LB_GROUPS);

  const count = isGameDisabled
    ? viewerCount
    : groups.reduce((total, { playerData }) => total + playerData.length, 0);

  return (
    <div>
      <div className={styles.logoWrapper}>
        <NoiceLogo
          className={styles.logo}
          theme="light"
          variant="horizontal"
        />
      </div>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          {isGameDisabled ? 'Viewers' : 'Players'}
          <span>
            {count} <MdGroup />
          </span>
        </div>
        {!isGameDisabled && (
          <>
            <div className={styles.title}>Top Teams</div>
            <div className={styles.leaderboard}>
              {cappedGroups.map((group) => (
                <LeaderboardItem
                  group={group}
                  key={group.groupId}
                  variant="scoreboard"
                />
              ))}
            </div>
          </>
        )}

        <div className={styles.title}>Noice Chat </div>

        <div className={styles.chat}>
          {cappedMessages.map((message) => {
            if (message.chatItemType !== 'ChatMessage') {
              return null;
            }

            return (
              <ChatMessage
                avatarType="visible"
                channelId={channel.id}
                chatMessage={message}
                className={styles.chatMessage}
                fontSize="small"
                key={message.messageId}
                ownPlayerName=""
                timestampType="relative"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

RestreamingHud.fragments = {
  channel: gql`
    fragment RestreamingHudChannel on ChannelChannel {
      name
      id
    }
  `,
};
