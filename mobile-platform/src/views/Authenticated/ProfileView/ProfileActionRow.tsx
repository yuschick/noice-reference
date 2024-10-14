import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { ButtonIcon } from '@components/ButtonIcon';
import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { HStack } from '@components/Stack/HStack';
import { FriendsFriendshipStatusStatus, ProfileViewQuery } from '@gen/graphql';
import { IconAssets } from '@utils/icons';

interface Props {
  onMore: () => void;
  onAddFriend: () => void;
  profile?: ProfileViewQuery;
}

export const ProfileActionRow = ({ profile, onMore, onAddFriend }: Props) => {
  const actionLabel = useMemo(() => {
    const friendshipStatus = profile?.profile?.friendshipStatus.status;
    if (!friendshipStatus) {
      return;
    }

    if (friendshipStatus === FriendsFriendshipStatusStatus.StatusFriend) {
      return 'Friends';
    }

    if (
      friendshipStatus === FriendsFriendshipStatusStatus.StatusBlocked ||
      friendshipStatus === FriendsFriendshipStatusStatus.StatusBlockedBy
    ) {
      return 'Blocked';
    }

    if (friendshipStatus === FriendsFriendshipStatusStatus.StatusFriendRequestReceived) {
      return 'Accept request';
    }

    if (friendshipStatus === FriendsFriendshipStatusStatus.StatusFriendRequestSent) {
      return 'Sent request';
    }

    return 'Add friend';
  }, [profile]);

  const buttonEnabled =
    profile?.profile?.friendshipStatus.status ===
      FriendsFriendshipStatusStatus.StatusUnspecified ||
    profile?.profile?.friendshipStatus.status ===
      FriendsFriendshipStatusStatus.StatusFriendRequestReceived;

  const isFriend =
    profile?.profile?.friendshipStatus.status ===
    FriendsFriendshipStatusStatus.StatusFriend;

  return (
    <HStack>
      <ButtonLarge
        backgroundColor={['green500', 'teal500']}
        disabled={!buttonEnabled}
        disabledTextColor="whiteMain"
        iconElement={
          isFriend ? (
            <IconAssets.Friend
              color="white"
              height={22}
              width={22}
            />
          ) : (
            <></>
          )
        }
        style={s.flex}
        textColor="black"
        onPress={() => onAddFriend()}
      >
        {actionLabel}
      </ButtonLarge>
      <Gutter width={8} />
      <ButtonIcon onPress={onMore}>
        <IconAssets.Menu
          color="white"
          height={24}
          width={24}
        />
      </ButtonIcon>
    </HStack>
  );
};

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
