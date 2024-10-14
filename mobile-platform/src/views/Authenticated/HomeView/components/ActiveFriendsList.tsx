import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AvatarList } from '@components/AvatarList';
import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { ActiveFriendsPreviewItemFragment } from '@gen/graphql';
import { pluralize } from '@utils/strings';

const MAX_FRIENDS_SHOWN = 3;

interface Props {
  friends: ActiveFriendsPreviewItemFragment[];
  totalActiveCount: number;
  maxFriendsShown?: number;
  onPress(): void;
}

export function ActiveFriendsList({
  friends,
  totalActiveCount,
  maxFriendsShown = MAX_FRIENDS_SHOWN,
  onPress,
}: Props) {
  const profiles = useMemo(
    () => friends.slice(0, maxFriendsShown).map((friend) => friend.profile),
    [friends, maxFriendsShown],
  );

  return (
    <TouchableOpacity onPress={onPress}>
      <HStack
        alignItems="center"
        justifyContent="space-between"
        style={s.wrapper}
      >
        <View>
          <Typography
            color="textLight"
            fontSize="md"
            fontWeight="medium"
          >
            <Typography fontWeight="extraBold">{totalActiveCount}</Typography>
            {pluralize(totalActiveCount, ' friend is here', ' friends are here')}
          </Typography>
          <Typography
            color="textSecondary"
            fontSize="sm"
            fontWeight="regular"
          >
            Check out where they are
          </Typography>
        </View>
        <AvatarList
          avatars={profiles}
          maxShown={maxFriendsShown}
          size="small"
          totalCount={totalActiveCount}
        />
      </HStack>
    </TouchableOpacity>
  );
}

ActiveFriendsList.fragments = {
  friend: gql`
    fragment ActiveFriendsPreviewItem on FriendsUser {
      userId
      profile {
        ...AvatarView
      }
    }
    ${AvatarList.fragments.profile}
  `,
};

const s = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    backgroundColor: colors.gray950,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
