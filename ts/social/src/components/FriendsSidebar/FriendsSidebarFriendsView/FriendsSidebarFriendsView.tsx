import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import {
  useAuthenticatedUser,
  IconButton,
  Button,
  Icon,
  usePopoverMenu,
  PopoverMenu,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { useEffect } from 'react';

import { FriendsSidebarFriendList } from '../FriendsSidebarFriendList/FriendsSidebarFriendList';
import { FriendsSidebarParty } from '../FriendsSidebarParty';
import { useFriendsAnalytics } from '../hooks/useFriendsAnalytics.hook';

import styles from './FriendsSidebarFriendsView.module.css';

import { useParty } from '@social-context';
import {
  FriendsSidebarFriendListFriendFragment,
  useFriendSidebarFriendsQuery,
  useFriendsSidebarFriendsViewDataQuery,
  useFriendsSidebarPartyQuery,
} from '@social-gen';

const LOAD_MORE_SIZE = 5;

gql`
  query FriendSidebarFriends($userId: ID!, $cursor: String, $pageSize: Int! = 25) {
    friends(
      userId: $userId
      cursor: { first: $pageSize, after: $cursor }
      priorityOrder: true
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      users {
        userId
        ...FriendsSidebarFriendListFriend
        ...FriendsSidebarPartyFriend
      }
    }
  }

  query FriendsSidebarFriendsViewData($userId: ID!) {
    receivedFriendRequests(userId: $userId) {
      users {
        userId
        profile {
          userId
        }
      }
    }
  }

  query FriendsSidebarParty($partyId: ID!) {
    party(partyId: $partyId) {
      id
      leaderId
      members {
        userId
        profile {
          ...FriendsSidebarFriendListProfile
          ...FriendsSidebarPartyProfile
        }
      }
      channel {
        id
        currentStreamId
        name
        game {
          id
          name
        }
      }
    }
  }
`;

interface Props {
  minimized?: boolean;
  isInStream: boolean;
  className?: string;
  onAddFriendClick(): void;
  onPendingFriendsClick(): void;
}

export function FriendsSidebarFriendsView({
  className,
  isInStream,
  minimized,
  onAddFriendClick,
  onPendingFriendsClick,
}: Props) {
  const { sendViewFriendsEventCallback } = useFriendsAnalytics();
  const { userId } = useAuthenticatedUser();
  const {
    data: friendsData,
    fetchMore,
    loading,
  } = useFriendSidebarFriendsQuery({
    variables: { userId },
  });
  const { data } = useFriendsSidebarFriendsViewDataQuery({
    variables: { userId },
    fetchPolicy: 'cache-first',
  });
  const { partyId } = useParty();

  const { data: partyData } = useFriendsSidebarPartyQuery({
    ...variablesOrSkip({ partyId }),
  });

  const popoverMenu = usePopoverMenu({ placement: 'left-end' });

  const partyMembers =
    partyData?.party?.members.reduce<FriendsSidebarFriendListFriendFragment[]>(
      (acc, member) => {
        const friend = friendsData?.friends?.users.find(
          (friend) => friend.userId === member.userId,
        );

        return [
          ...acc,
          {
            userId: member.userId,
            lastStatusChange: '',
            profile: member.profile,
            activity: partyData.party?.channel
              ? {
                  isOnline: true,
                  channel: partyData.party.channel,
                }
              : null,
            ...friend,
          },
        ];
      },
      [],
    ) ?? [];

  const friends = friendsData?.friends?.users ?? [];

  const pendingFriendsAmount = data?.receivedFriendRequests?.users.length ?? 0;

  const handleAddFriendClick = () => {
    onAddFriendClick();
  };

  const onLoadMoreFriendsClick = () => {
    const cursor = friendsData?.friends?.pageInfo.endCursor;

    fetchMore({
      variables: {
        userId,
        cursor,
        pageSize: LOAD_MORE_SIZE,
      },
    });
  };
  useEffect(() => {
    if (minimized || !friendsData?.friends?.users) {
      return;
    }

    sendViewFriendsEventCallback(friendsData.friends.users.length);
  }, [friendsData?.friends?.users, minimized, sendViewFriendsEventCallback]);

  return (
    <div
      aria-busy={loading ? 'true' : 'false'}
      className={classNames(styles.wrapper, className, {
        [styles.minimized]: minimized,
      })}
    >
      <div className={styles.content}>
        {loading && !friendsData && <FriendsSidebarFriendList.Loading />}

        {!!pendingFriendsAmount && (
          <>
            <hr className={styles.divider} />

            {minimized ? (
              <IconButton
                icon={CoreAssets.Icons.Exclamation}
                label={`${pendingFriendsAmount} pending request${
                  pendingFriendsAmount > 1 ? 's' : ''
                }`}
                size="sm"
                variant="cta"
                onClick={onPendingFriendsClick}
              />
            ) : (
              <Button
                size="sm"
                variant="cta"
                onClick={onPendingFriendsClick}
              >{`${pendingFriendsAmount} pending request${
                pendingFriendsAmount > 1 ? 's' : ''
              }`}</Button>
            )}
          </>
        )}

        {!!partyMembers.length && (
          <>
            <hr className={styles.divider} />

            <FriendsSidebarParty
              isInStream={isInStream}
              minimized={minimized}
              partyLeaderId={partyData?.party?.leaderId}
              partyMembers={partyMembers}
            />
          </>
        )}

        {!!friends.length && (
          <>
            {!partyMembers.length && <hr className={styles.divider} />}

            <FriendsSidebarFriendList
              friends={friends}
              minimized={minimized}
              onLoadMoreClick={
                friendsData?.friends?.pageInfo.hasNextPage
                  ? onLoadMoreFriendsClick
                  : undefined
              }
            />
          </>
        )}

        {!loading && !friends.length && (
          <>
            <hr className={styles.divider} />

            <div className={styles.emptyView}>
              <div className={styles.emptyTitleWrapper}>
                <Icon
                  color="teal-main"
                  icon={CoreAssets.Icons.Friends}
                  size={20}
                />
                <h3 className={styles.emptyTitle}>Get started with Friends</h3>
              </div>

              <p className={styles.emptyParagraph}>
                Connect with other players and get more out of the Noice experience.
              </p>

              <p className={styles.emptyParagraph}>
                You can add a friends with their Noice tag or from their profile.
              </p>
            </div>
          </>
        )}
      </div>

      <div className={styles.footer}>
        {minimized ? (
          <>
            <IconButton
              icon={CoreAssets.Icons.AddFriend}
              label="Add a friend"
              level="secondary"
              ref={popoverMenu.state.popoverMenuTriggerRef}
              size="sm"
              onClick={popoverMenu.actions.toggle}
            />
            <PopoverMenu store={popoverMenu}>
              <PopoverMenu.Section>
                <PopoverMenu.Button onClick={handleAddFriendClick}>
                  Add Friend
                </PopoverMenu.Button>
              </PopoverMenu.Section>
            </PopoverMenu>
          </>
        ) : (
          <div className={styles.buttonsWrapper}>
            <Button
              iconStart={CoreAssets.Icons.AddFriend}
              size="sm"
              onClick={onAddFriendClick}
            >
              Add friend
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
