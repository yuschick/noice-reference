import { gql } from '@apollo/client';
import { IconButton, ProfileImage, useAuthenticatedUser } from '@noice-com/common-ui';
import { useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import styles from './ChannelFriendsList.module.css';

import { generateProfileLink } from '@common/profile';
import {
  ApiCursorInput,
  ChannelFriendsListChannelFragment,
  useChannelActiveFriendsQuery,
} from '@gen';

export const PAGE_SIZE = 6;

gql`
  query ChannelActiveFriends($userId: ID!, $channelId: ID!, $cursor: APICursorInput) {
    friends(userId: $userId, filters: [{ channelId: $channelId }], cursor: $cursor) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      users {
        userId
        profile {
          userId
          userTag
          avatars {
            avatar2D
          }
          ...ProfileImageProfile
        }
      }
    }
  }
`;

interface Props {
  channel: ChannelFriendsListChannelFragment;
  className?: string;
}

export function ChannelFriendsList({ channel, className }: Props) {
  const [cursor, setCursor] = useState<ApiCursorInput>({ first: PAGE_SIZE });
  const { userId } = useAuthenticatedUser();

  const totalCount = channel.channelFriends.totalCount;

  const { data } = useChannelActiveFriendsQuery({
    variables: {
      userId,
      channelId: channel.id,
      cursor,
    },
    skip: !totalCount,
  });

  if (!totalCount) {
    return null;
  }

  const friendsProfiles = data?.friends?.users.map((friend) => friend.profile);

  const pageInfo = data?.friends?.pageInfo;

  const onPreviousPageClick = () => {
    if (!pageInfo) {
      return;
    }

    setCursor({ before: pageInfo.startCursor, last: PAGE_SIZE });
  };

  const onNextPageClick = () => {
    if (!pageInfo) {
      return;
    }

    setCursor({ after: pageInfo.startCursor, first: PAGE_SIZE });
  };

  return (
    <div className={className}>
      <div className={styles.titleWrapper}>
        <span className={styles.title}>
          <span className={styles.friendAmount}>{totalCount}</span> friend
          {totalCount > 1 ? 's ' : ' '}
        </span>
        <span className={styles.subtitle}>
          {totalCount > 1 ? 'are' : 'is'} on this channel
        </span>
      </div>

      <div className={styles.content}>
        <ul className={styles.list}>
          {friendsProfiles?.map((profile) => (
            <li key={userId}>
              <Link
                className={styles.friend}
                to={generateProfileLink(profile.userTag)}
              >
                <ProfileImage
                  profile={profile}
                  size="sm"
                />
                <span className={styles.displayName}>{profile.userTag}</span>
              </Link>
            </li>
          ))}
        </ul>

        {(!!pageInfo?.hasNextPage || !!pageInfo?.hasPreviousPage) && (
          <div className={styles.buttons}>
            <IconButton
              icon={FaAngleLeft}
              isDisabled={!pageInfo?.hasPreviousPage}
              label="Previous"
              variant="ghost"
              onClick={onPreviousPageClick}
            />

            <IconButton
              icon={FaAngleRight}
              isDisabled={!pageInfo?.hasNextPage}
              label="Next"
              variant="ghost"
              onClick={onNextPageClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}

ChannelFriendsList.fragments = {
  entry: gql`
    fragment ChannelFriendsListChannel on ChannelChannel {
      id
      channelFriends {
        totalCount
      }
    }
  `,
};
