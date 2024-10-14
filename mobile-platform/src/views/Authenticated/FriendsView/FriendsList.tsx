import { useScrollToTop } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';

import { FriendRequestType, FriendsListItem } from './FriendsListItem';

import { Gutter } from '@components/Gutter';
import { Typography } from '@components/Typography';
import {
  FriendsViewFriendsQuery,
  FriendsViewRequestsQuery,
  FriendsViewUserFragment,
} from '@gen/graphql';

type ListItem =
  | {
      type: 'friend' | FriendRequestType;
      data: FriendsViewUserFragment;
    }
  | {
      type: 'list-label';
      data: string;
    }
  | {
      type: 'gutter';
      data: number;
    };

interface Props {
  pageCount: number;
  onFetchMore: (endCursor: string) => void;
  onViewFriend: (user: FriendsViewUserFragment, type?: FriendRequestType) => void;
  onAcceptFriendRequest: (friendId: string) => void;
  onDeclineFriendRequest: (friendId: string) => void;
  onCancelFriendRequest: (friendId: string) => void;
  friendsQueryData?: FriendsViewFriendsQuery;
  requestsQueryData?: FriendsViewRequestsQuery;
  isLoading?: boolean;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  ListHeaderComponent: React.ReactElement;
  showEmptyState: boolean;
}

const keyExtractor = (item: ListItem, index: number) => {
  if (item.type === 'friend' || item.type === 'sent' || item.type === 'received') {
    return `list-item-${item.type}-${item.data.userId}`;
  }

  return `list-item-` + index;
};

const ListItemSeparator = () => <Gutter height={12} />;

const Title = (item: { data: string }) => (
  <Animated.View exiting={FadeOut}>
    <Typography
      color="white"
      fontSize="md"
      fontWeight="medium"
    >
      {item.data}
    </Typography>
    <Gutter height={12} />
  </Animated.View>
);

export const FriendsList = ({
  friendsQueryData,
  requestsQueryData,
  isLoading,
  onFetchMore,
  onViewFriend,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  onCancelFriendRequest,
  pageCount,
  onScroll,
  ListHeaderComponent,
  showEmptyState,
}: Props) => {
  const ref = useRef<Animated.FlatList<ListItem>>(null);
  useScrollToTop(ref);

  const loadingCardsArray = useMemo(
    () => [...Array.from({ length: pageCount })],
    [pageCount],
  );

  const listData: ListItem[] = useMemo(() => {
    if (isLoading) {
      return [];
    }

    const received = requestsQueryData?.receivedFriendRequests?.users ?? [];
    const sent = requestsQueryData?.sentFriendRequests?.users ?? [];
    const friends = friendsQueryData?.friends?.users ?? [];
    const receivedRequests = received.map(
      (user) => ({ type: 'received', data: user } as ListItem),
    );
    const sentRequests = sent.map((user) => ({ type: 'sent', data: user } as ListItem));

    const friendsData = friends.map(
      (user) =>
        ({
          type: 'friend',
          data: user,
        } as ListItem),
    );

    const hasRequests = receivedRequests.length || sentRequests.length;
    const hasFriends = friends.length;

    const listItems: ListItem[] = [];

    if (hasRequests) {
      listItems.push(
        { type: 'list-label', data: 'Friend Requests' },
        ...sentRequests,
        ...receivedRequests,
        {
          type: 'gutter',
          data: 12,
        },
      );
    }

    if (hasFriends) {
      hasRequests && listItems.push({ type: 'list-label', data: 'Friends' });
      listItems.push(...friendsData);
    }

    return listItems;
  }, [friendsQueryData, isLoading, requestsQueryData]);

  const renderItem = useCallback(
    ({ item, index }: { item: ListItem; index: number }) => {
      switch (item.type) {
        case 'list-label':
          return <Title data={item.data} />;
        case 'gutter':
          return <Gutter height={item.data} />;
        case 'sent':
          return (
            <FriendsListItem
              index={index}
              type={item.type}
              userData={item.data}
              onCancelFriendRequest={onCancelFriendRequest}
              onViewFriend={onViewFriend}
            />
          );
        case 'received':
          return (
            <FriendsListItem
              index={0}
              type={item.type}
              userData={item.data}
              onAcceptFriendRequest={onAcceptFriendRequest}
              onDeclineFriendRequest={onDeclineFriendRequest}
              onViewFriend={onViewFriend}
            />
          );
        case 'friend': {
          const animationIndex = (index % listData.length) + 1;

          return (
            <FriendsListItem
              index={animationIndex}
              userData={item.data}
              onViewFriend={onViewFriend}
            />
          );
        }
        default:
          return null;
      }
    },
    [
      listData.length,
      onAcceptFriendRequest,
      onCancelFriendRequest,
      onDeclineFriendRequest,
      onViewFriend,
    ],
  );

  const fetchMoreFriends = () => {
    if (friendsQueryData?.friends?.pageInfo.hasNextPage) {
      onFetchMore?.(friendsQueryData.friends.pageInfo.endCursor);
    }
  };

  return (
    <Animated.FlatList
      ItemSeparatorComponent={ListItemSeparator}
      ListFooterComponent={
        isLoading ? (
          <>
            {loadingCardsArray.map((_, i) => (
              <React.Fragment key={'loading-card-' + i}>
                <FriendsListItem.Loading />
                <Gutter height={12} />
              </React.Fragment>
            ))}
          </>
        ) : (
          <Gutter height={80} />
        )
      }
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={s.flatListContainer}
      data={showEmptyState ? [] : listData}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onEndReached={fetchMoreFriends}
      onEndReachedThreshold={0.5}
      onScroll={onScroll}
    />
  );
};

const s = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: 16,
  },
});
