import { FriendsListItem } from './FriendsListItem';

import { ButtonLarge } from '@components/ButtonLarge';
import { FormSheetModalLayout } from '@components/FormSheetModalLayout';
import { Gutter } from '@components/Gutter';
import {
  useAcceptFriendRequestMutation,
  useRemoveReceivedFriendRequestMutation,
  useRemoveSentFriendRequestMutation,
} from '@hooks/social';
import { useFriendship } from '@hooks/social/useHandleFriendship.hook';
import { useAuth } from '@hooks/useAuth.hook';
import { AuthenticatedScreenProps } from '@navigators/routes';

export const FriendModalView = ({
  route: {
    params: { data, type },
  },
  navigation,
}: AuthenticatedScreenProps<'friendModal'>) => {
  const { userId } = useAuth();
  const { handleBlockingUser, handleRemovingFriendship } = useFriendship({});
  const [mutateAcceptFriendReq] = useAcceptFriendRequestMutation({});
  const [mutateDeclineFriendReq] = useRemoveReceivedFriendRequestMutation({});
  const [mutateRemoveSentReq] = useRemoveSentFriendRequestMutation({});

  const openChannel = () => {
    if (!data.activity?.channelId) {
      return;
    }

    navigation.replace('stream', {
      channelId: data.activity.channelId,
      streamId: data.activity?.streamId ?? '',
      liveStatus: data.activity.channel?.liveStatus,
    });
  };

  const openProfile = () => {
    navigation.pop();
    // Hack: small timeout to prevent weird stack nav animation
    setTimeout(() => {
      navigation.navigate('profile', {
        userId: data.userId,
      });
    }, 100);
  };

  const removeFriend = () => {
    handleRemovingFriendship(data.userId, data.profile?.userTag ?? '');
  };

  const blockUser = () => {
    handleBlockingUser(data.profile?.userTag ?? '', data.userId);
  };

  const acceptFriendReq = () => {
    if (userId) {
      navigation.pop();
      mutateAcceptFriendReq({
        variables: {
          userId: userId,
          friendId: data.userId,
        },
      });
    }
  };

  const declineFriendReq = () => {
    if (userId) {
      navigation.pop();
      mutateDeclineFriendReq({
        variables: {
          userId: userId,
          friendId: data.userId,
        },
      });
    }
  };

  const removeSentFriendRequest = () => {
    if (userId) {
      navigation.pop();
      mutateRemoveSentReq({
        variables: {
          userId,
          friendId: data.userId,
        },
      });
    }
  };

  const isFriend = !type;

  return (
    <FormSheetModalLayout>
      <FriendsListItem
        animate={false}
        size="large"
        userData={data}
      />
      <Gutter height={24} />
      <ButtonLarge.List>
        {data.activity?.channelId ? (
          <ButtonLarge
            analyticsActionName="VIEW_SAME_CHANNEL_AS_FRIEND"
            onPress={openChannel}
          >
            View same channel
          </ButtonLarge>
        ) : (
          <></>
        )}
        <ButtonLarge
          analyticsActionName="VIEW_FRIENDS_PROFILE"
          onPress={openProfile}
        >
          View profile
        </ButtonLarge>
      </ButtonLarge.List>
      <Gutter height={16} />

      {isFriend ? (
        <ButtonLarge.List>
          <ButtonLarge
            analyticsActionName="REMOVE_FRIEND"
            onPress={removeFriend}
          >
            Remove friend
          </ButtonLarge>
          <ButtonLarge
            analyticsActionName="BLOCK_FRIEND"
            onPress={blockUser}
          >
            Block
          </ButtonLarge>
        </ButtonLarge.List>
      ) : type === 'received' ? (
        <ButtonLarge.List>
          <ButtonLarge
            analyticsActionName="DECLINE_FRIEND_REQUEST"
            onPress={declineFriendReq}
          >
            Decline friend request
          </ButtonLarge>
          <ButtonLarge
            analyticsActionName="ACCEPT_FRIEND_REQUEST"
            onPress={acceptFriendReq}
          >
            Accept friend request
          </ButtonLarge>
        </ButtonLarge.List>
      ) : (
        <ButtonLarge.List>
          <ButtonLarge
            analyticsActionName="CANCEL_FRIEND_REQUEST"
            onPress={removeSentFriendRequest}
          >
            Cancel friend request
          </ButtonLarge>
          <></>
        </ButtonLarge.List>
      )}
    </FormSheetModalLayout>
  );
};
