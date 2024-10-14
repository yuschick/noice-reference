import { ButtonLarge } from '@components/ButtonLarge';
import { FormSheetModalLayout } from '@components/FormSheetModalLayout';
import { Gutter } from '@components/Gutter';
import {
  useRemoveReceivedFriendRequestMutation,
  useRemoveSentFriendRequestMutation,
} from '@hooks/social';
import { useFriendship } from '@hooks/social/useHandleFriendship.hook';
import { useAuth } from '@hooks/useAuth.hook';
import { AuthenticatedScreenProps } from '@navigators/routes';

export const ProfileActionsModalView = ({
  navigation,
  route: {
    params: { profile },
  },
}: AuthenticatedScreenProps<'profileActionsModal'>) => {
  const { userId } = useAuth();

  const {
    handleBlockingUser,
    handleUnblockingUser,
    handleRemovingFriendship,
    isBlocked,
    isFriends,
    isPendingReceivedRequest,
    isPendingRequest,
  } = useFriendship({
    friendshipStatus: profile?.friendshipStatus?.status,
  });

  const [mutateRemoveSentReq] = useRemoveSentFriendRequestMutation({});
  const [mutateRemoveReceivedReq] = useRemoveReceivedFriendRequestMutation({});

  const removeFriend = () => {
    handleRemovingFriendship(profile?.userId ?? '', profile?.userTag ?? '');
  };

  const blockUser = () => {
    handleBlockingUser(profile?.userTag ?? '', profile?.userId ?? '');
  };

  const unBlockUser = () => {
    handleUnblockingUser(profile?.userId ?? '');
  };

  const removeSentFriendRequest = () => {
    if (userId) {
      navigation.pop();
      mutateRemoveSentReq({
        variables: {
          userId,
          friendId: profile?.userId ?? '',
        },
      });
    }
  };

  const declineFriendRequest = () => {
    if (userId) {
      navigation.pop();
      mutateRemoveReceivedReq({
        variables: {
          userId,
          friendId: profile?.userId ?? '',
        },
      });
    }
  };

  return (
    <FormSheetModalLayout>
      {isPendingRequest && (
        <ButtonLarge
          analyticsActionName="CANCEL_FRIEND_REQUEST"
          backgroundColor={['green500', 'teal500']}
          textColor="darkMain"
          onPress={removeSentFriendRequest}
        >
          Cancel request
        </ButtonLarge>
      )}
      {isPendingReceivedRequest && (
        <ButtonLarge
          analyticsActionName="DECLINE_FRIEND_REQUEST"
          backgroundColor={['green500', 'teal500']}
          textColor="darkMain"
          onPress={declineFriendRequest}
        >
          Decline request
        </ButtonLarge>
      )}
      {isBlocked && (
        <ButtonLarge
          analyticsActionName="UNBLOCK_FRIEND"
          onPress={unBlockUser}
        >
          Unblock
        </ButtonLarge>
      )}
      {isFriends && (
        <ButtonLarge
          analyticsActionName="REMOVE_FRIEND"
          backgroundColor={['green500', 'teal500']}
          textColor="darkMain"
          onPress={removeFriend}
        >
          Remove Friend
        </ButtonLarge>
      )}
      {!isBlocked && (
        <>
          <Gutter height={16} />
          <ButtonLarge
            analyticsActionName="BLOCK_FRIEND"
            onPress={blockUser}
          >
            Block
          </ButtonLarge>
        </>
      )}
    </FormSheetModalLayout>
  );
};
