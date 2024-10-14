import { gql } from '@apollo/client';
import { SentChatBoosterRequest } from '@noice-com/chat-react-core';

import styles from './SentBoosterRequestMessage.module.css';

import { useSentBoosterRequestMessageProfileQuery } from '@chat-gen';

gql`
  query SentBoosterRequestMessageProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
    }
  }
`;

interface Props {
  message: SentChatBoosterRequest;
}

export function SentBoosterRequestMessage({ message }: Props) {
  const { userId, id: messageId } = message;

  const { data } = useSentBoosterRequestMessageProfileQuery({
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
      <div>
        You requested{' '}
        <span className={styles.boosterRequestMessageName}>{userTag}&apos;s</span>{' '}
        booster!
      </div>
    </div>
  );
}
