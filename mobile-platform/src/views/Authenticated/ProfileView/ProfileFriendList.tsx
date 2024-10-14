import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, TouchableOpacity } from 'react-native';

import { Avatar } from '@components/Avatar';
import { Gutter } from '@components/Gutter';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { ProfilePresenceStatus, ProfileViewFriendsFragment } from '@gen/graphql';

interface Props {
  friends: ProfileViewFriendsFragment[];
  onPress: (userId: string) => void;
}

const keyExtractor = (item: ProfileViewFriendsFragment) => item.userId;

export const ProfileFriendList = ({ friends, onPress }: Props) => {
  const sortedFriends = useMemo(() => {
    return [...friends].sort((a, b) => {
      const aStatus =
        a.onlineStatus === ProfilePresenceStatus.PresenceStatusOnline ? 1 : 0;
      const bStatus =
        b.onlineStatus === ProfilePresenceStatus.PresenceStatusOnline ? 1 : 0;

      return bStatus - aStatus;
    });
  }, [friends]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ProfileViewFriendsFragment>) => {
      return (
        <>
          <TouchableOpacity onPress={() => onPress(item.userId)}>
            <VStack
              alignItems="center"
              style={s.container}
            >
              <Avatar
                isOnline={
                  item.onlineStatus === ProfilePresenceStatus.PresenceStatusOnline
                }
                profile={item}
                size="xLarge"
              />
              <Gutter height={8} />
              <Typography
                color="textSecondary"
                fontWeight="semiBold"
                numberOfLines={1}
              >
                {item.userTag}
              </Typography>
            </VStack>
          </TouchableOpacity>
          <Gutter width={16} />
        </>
      );
    },
    [onPress],
  );

  return (
    <FlatList
      data={sortedFriends}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      style={s.flatList}
      horizontal
    />
  );
};

const s = StyleSheet.create({
  flatList: {
    overflow: 'visible',
  },
  container: {
    width: 64,
  },
});
