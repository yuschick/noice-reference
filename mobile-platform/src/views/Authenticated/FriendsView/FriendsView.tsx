import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

import { FriendsHeader } from './FriendsHeader';
import { FriendsList } from './FriendsList';
import { FriendRequestType } from './FriendsListItem';

import { Avatar } from '@components/Avatar';
import { BottomButton } from '@components/EmptyState';
import { useHeaderValues } from '@components/List/Header';
import { LargeHeader, LargeHeaderGutter } from '@components/PageHeaders/LargeHeader';
import { PageLayout } from '@components/PageLayout';
import {
  FriendsViewUserFragment,
  useFriendsViewFriendsQuery,
  useFriendsViewRequestsQuery,
} from '@gen/graphql';
import {
  useAcceptFriendRequestMutation,
  useRemoveReceivedFriendRequestMutation,
  useRemoveSentFriendRequestMutation,
} from '@hooks/social';
import { useFriendStatusNotifications } from '@hooks/social/useFriendStatusNotifications.hook';
import { useAuth } from '@hooks/useAuth.hook';
import { useRefetchOnAppStateChange } from '@hooks/useRefetchOnAppStateChange.hook';
import { AuthenticatedScreenProps } from '@navigators/routes';

gql`
  fragment FriendsViewUser on FriendsUser {
    userId
    profile {
      userId
      userTag
      onlineStatus
      lastSeen
      avatars {
        avatar2D
      }
      ...AvatarView
    }
    activity {
      channelId
      isOnline
      streamId
      channel {
        name
        liveStatus
        game {
          name
        }
      }
    }
  }

  fragment FriendsViewResponse on FriendsListFriendsResponse {
    users {
      ...FriendsViewUser
    }
    pageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
  }

  query FriendsViewFriends($userId: ID!, $cursor: String, $pageSize: Int!) {
    friends(
      userId: $userId
      cursor: { first: $pageSize, after: $cursor }
      priorityOrder: true
    ) {
      ...FriendsViewResponse
    }
  }

  query FriendsViewRequests($userId: ID!) {
    receivedFriendRequests(userId: $userId) {
      users {
        ...FriendsViewUser
      }
    }
    sentFriendRequests(userId: $userId) {
      users {
        ...FriendsViewUser
      }
    }
  }

  ${Avatar.fragments.profile}
`;

const FETCH_FRIENDS_COUNT = 25;

export const FriendsView = ({ navigation }: AuthenticatedScreenProps<'friends'>) => {
  const { isConnected } = useNetInfo();
  const { scrollY, scrollHandler } = useHeaderValues();
  const { userId } = useAuth();

  const {
    data: friendsData,
    loading: friendsIsLoading,
    fetchMore,
    refetch: refetchFriends,
  } = useFriendsViewFriendsQuery({
    ...variablesOrSkip({ userId, pageSize: FETCH_FRIENDS_COUNT }),
  });
  const { data: friendRequestsData, refetch: refetchRequests } =
    useFriendsViewRequestsQuery({
      ...variablesOrSkip({ userId }),
    });

  // manually set if is fetching more because loading is not being set on fetch more
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [mutateAcceptFriendReq] = useAcceptFriendRequestMutation({
    onCompleted: () => {
      refetchFriends();
    },
  });
  const [mutateDeclineFriendReq] = useRemoveReceivedFriendRequestMutation({});
  const [mutateCancelFriendReq] = useRemoveSentFriendRequestMutation({});

  useRefetchOnAppStateChange(refetchFriends, refetchRequests);

  useEffect(() => {
    if (isFetchingMore) {
      setIsFetchingMore(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendsData]);

  useFriendStatusNotifications(() => {
    refetchFriends();
    refetchRequests();
  });

  const onViewFriend = (user: FriendsViewUserFragment, type?: FriendRequestType) => {
    navigation.navigate('friendModal', {
      data: user,
      type,
    });
  };

  const onFetchMore = (cursor: string) => {
    setIsFetchingMore(true);
    fetchMore({
      variables: {
        userId: userId ?? '',
        pageSize: FETCH_FRIENDS_COUNT,
        cursor,
      },
    });
  };

  const onAddFriend = () => {
    navigation.navigate('addFriendModal');
  };

  const onAcceptFriendRequest = (friendId: string) => {
    if (userId) {
      mutateAcceptFriendReq({
        variables: {
          userId,
          friendId: friendId,
        },
      });
    }
  };

  const onDeclineFriendRequest = (friendId: string) => {
    if (userId) {
      mutateDeclineFriendReq({
        variables: {
          userId,
          friendId: friendId,
        },
      });
    }
  };

  const cancelFriendRequest = (friendId: string) => {
    if (userId) {
      mutateCancelFriendReq({
        variables: {
          userId,
          friendId: friendId,
        },
      });
    }
  };

  const showEmptyState =
    (!friendsData?.friends?.users.length &&
      !friendRequestsData?.receivedFriendRequests?.users.length &&
      !friendRequestsData?.sentFriendRequests?.users.length &&
      !friendsIsLoading) ||
    !isConnected;

  return (
    <PageLayout.Simple>
      <FriendsList
        ListHeaderComponent={
          <>
            <LargeHeaderGutter />
            <FriendsHeader
              showEmptyState={showEmptyState}
              onAddFriend={onAddFriend}
            />
          </>
        }
        friendsQueryData={friendsData}
        isLoading={friendsIsLoading || isFetchingMore}
        pageCount={FETCH_FRIENDS_COUNT}
        requestsQueryData={friendRequestsData}
        showEmptyState={showEmptyState}
        onAcceptFriendRequest={onAcceptFriendRequest}
        onCancelFriendRequest={cancelFriendRequest}
        onDeclineFriendRequest={onDeclineFriendRequest}
        onFetchMore={onFetchMore}
        onScroll={scrollHandler}
        onViewFriend={onViewFriend}
      />
      <LargeHeader
        scrollY={scrollY}
        title="Friends"
        userId={userId}
        showCurrencies
      />
      <BottomButton
        show={showEmptyState}
        text="Add friends"
        onPress={onAddFriend}
        onRefresh={refetchFriends}
      />
    </PageLayout.Simple>
  );
};
