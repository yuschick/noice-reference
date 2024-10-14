import { gql } from '@apollo/client';
import { useId } from 'react';

import { ChatUserListGroup } from '../types';

import { ChatUserListItem } from './ChatUserListItem/ChatUserListItem';
import styles from './ChatUserListSection.module.css';

import { ChatUserListSectionSenderInfoFragment } from '@gen';

gql`
  fragment ChatUserListSectionSenderInfo on ChatSenderInfo {
    userId
    username
    ...ChatUserListItemSenderInfo
  }
`;

interface Props {
  senderInfos: ChatUserListSectionSenderInfoFragment[];
  group: ChatUserListGroup;
  filterKeyword: string;
}

export function ChatUserListSection({ senderInfos, group, filterKeyword }: Props) {
  const id = useId();

  const filteredSenderInfos = filterKeyword
    ? senderInfos.filter(({ username }) =>
        username.toLowerCase().includes(filterKeyword.toLowerCase()),
      )
    : senderInfos;

  return (
    <div>
      <div
        className={styles.title}
        id={id}
      >
        {group}
      </div>

      {filteredSenderInfos.length ? (
        <ul
          aria-labelledby={id}
          className={styles.list}
        >
          {filteredSenderInfos
            .sort((a, b) => a.username.localeCompare(b.username))
            .map((senderInfo) => (
              <ChatUserListItem
                key={senderInfo.userId}
                senderInfo={senderInfo}
              />
            ))}
        </ul>
      ) : (
        <span className={styles.emptyState}>No users in this category</span>
      )}
    </div>
  );
}
