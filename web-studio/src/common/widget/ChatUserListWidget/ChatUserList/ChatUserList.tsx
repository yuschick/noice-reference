import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { InputField } from '@noice-com/common-ui';
import { useState } from 'react';

import styles from './ChatUserList.module.css';
import { ChatUserListSection } from './ChatUserListSection/ChatUserListSection';
import { ChatUserListGroup } from './types';

import { useChannelContext } from '@common/channel';
import { useChatUserListQuery } from '@gen';

gql`
  query ChatUserList($chatId: ID!) {
    streamers: chatUsers(
      chatId: $chatId
      userLabel: USER_LABEL_STREAMER
      sortBy: "lastActivity"
      limit: 100
    ) {
      users {
        ...ChatUserListUser
      }
    }
    moderators: chatUsers(
      chatId: $chatId
      userLabel: USER_LABEL_MODERATOR
      sortBy: "lastActivity"
      limit: 100
    ) {
      users {
        ...ChatUserListUser
      }
    }
    viewers: chatUsers(
      chatId: $chatId
      userLabel: USER_LABEL_VIEWER
      sortBy: "lastActivity"
      limit: 100
    ) {
      users {
        ...ChatUserListUser
      }
    }
  }

  fragment ChatUserListUser on ChatChatUser {
    userId
    senderInfo {
      userId
      ...ChatUserListSectionSenderInfo
    }
  }
`;

export function ChatUserList() {
  const { channelChatId } = useChannelContext();
  const [keyword, setKeyword] = useState('');

  const { data } = useChatUserListQuery({
    ...variablesOrSkip({ chatId: channelChatId }),
    pollInterval: 1000 * 60,
  });

  return (
    <div className={styles.wrapper}>
      <InputField
        label="Filter users"
        theme="gray"
        type="search"
        onChange={(e) => setKeyword(e.target.value)}
      />

      <div className={styles.sectionWrapper}>
        <ChatUserListSection
          filterKeyword={keyword}
          group={ChatUserListGroup.Creators}
          senderInfos={data?.streamers?.users.map((user) => user.senderInfo) ?? []}
        />

        <ChatUserListSection
          filterKeyword={keyword}
          group={ChatUserListGroup.Moderators}
          senderInfos={data?.moderators?.users.map((user) => user.senderInfo) ?? []}
        />

        <ChatUserListSection
          filterKeyword={keyword}
          group={ChatUserListGroup.Viewers}
          senderInfos={data?.viewers?.users.map((user) => user.senderInfo) ?? []}
        />
      </div>
    </div>
  );
}
