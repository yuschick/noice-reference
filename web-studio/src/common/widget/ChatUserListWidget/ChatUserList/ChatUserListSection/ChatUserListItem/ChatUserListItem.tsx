import { gql } from '@apollo/client';
import { MiniProfilePortal, UserBadge } from '@noice-com/social';
import { sortBadges } from '@noice-com/social-react-core';
import { useRef, useState } from 'react';

import { useChatUserListSettings } from '../../../context';

import styles from './ChatUserListItem.module.css';

import { useChannelContext } from '@common/channel';
import { showToastOnMiniProfileModerationAction } from '@common/profile';
import { ChatUserListItemSenderInfoFragment } from '@gen';

gql`
  fragment ChatUserListItemSenderInfo on ChatSenderInfo {
    userId
    username
    badges {
      ...UserBadge
    }
  }
`;

interface Props {
  senderInfo: ChatUserListItemSenderInfoFragment;
}

export function ChatUserListItem({ senderInfo }: Props) {
  const { channelId } = useChannelContext();
  const { showUserBadges } = useChatUserListSettings();

  const [showUserCard, setShowUserCard] = useState(false);
  const userRef = useRef<HTMLButtonElement>(null);

  const { userId, username, badges } = senderInfo;

  return (
    <li>
      <button
        className={styles.userItem}
        ref={userRef}
        type="button"
        onClick={() => setShowUserCard(true)}
      >
        {showUserBadges &&
          sortBadges(badges).map((badge, index) => (
            <UserBadge
              badge={badge}
              className={styles.badge}
              key={index}
            />
          ))}

        <span className={styles.displayName}>{username}</span>
      </button>

      <MiniProfilePortal
        anchor={userRef}
        channelId={channelId}
        showMiniProfile={showUserCard}
        userId={userId}
        onClose={() => setShowUserCard(false)}
        onModerationAction={showToastOnMiniProfileModerationAction}
      />
    </li>
  );
}
