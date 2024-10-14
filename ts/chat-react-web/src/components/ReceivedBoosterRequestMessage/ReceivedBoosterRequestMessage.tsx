import { gql } from '@apollo/client';
import { ReceivedChatBoosterRequest } from '@noice-com/chat-react-core';
import { ProfileImage } from '@noice-com/common-ui';

import styles from './ReceivedBoosterRequestMessage.module.css';

import { ChatMessageAvatarType } from '@chat-common/settings';
import { useReceivedBoosterRequestMessageProfileQuery } from '@chat-gen';

gql`
  query ReceivedBoosterRequestMessageProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
      ...ProfileImageProfile
    }
  }
`;

interface Props {
  message: ReceivedChatBoosterRequest;
  avatarType: ChatMessageAvatarType;
}

export function ReceivedBoosterRequestMessage({ message, avatarType }: Props) {
  const { userId, id: messageId } = message;

  const { data } = useReceivedBoosterRequestMessageProfileQuery({
    variables: {
      userId,
    },
  });

  const profile = data?.profile;

  if (!profile) {
    return null;
  }

  const { userTag } = profile;

  return (
    <div
      className={styles.boosterRequestMessageWrapper}
      id={messageId}
    >
      {avatarType === 'visible' && (
        <ProfileImage
          profile={profile}
          size="xs"
        />
      )}

      <div className={styles.textContainer}>
        <span className={styles.boosterRequestMessageName}>{userTag}</span>{' '}
        <span>requested your booster!</span>
      </div>
    </div>
  );
}
