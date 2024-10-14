import { gql } from '@apollo/client';

import {
  useProfilePrivacyFriendSettingsMutation,
  useProfilePrivacySettingsQuery,
} from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';

gql`
  mutation ProfilePrivacyFriendSettings($userId: ID, $disableFriendRequests: Boolean) {
    updateFriendsSettings(
      userId: $userId
      body: { disableFriendRequests: $disableFriendRequests }
    ) {
      disableFriendRequests
    }
  }
`;

export const useAllowFriendRequests = () => {
  const { userId } = useAuth();
  const { data } = useProfilePrivacySettingsQuery({
    variables: { userId },
  });

  const isFriendRequestsDisabled =
    !!data?.profile?.settings?.friends.disableFriendRequests;

  const [mutateDisableFriendRequest] = useProfilePrivacyFriendSettingsMutation({
    update(cache, { data: newData }) {
      cache.modify({
        id: cache.identify({ __typename: 'ProfileProfile', userId }),
        fields: {
          settings(existingSettings) {
            return {
              ...existingSettings,
              friends: {
                ...existingSettings.friends,
                disableFriendRequests:
                  newData?.updateFriendsSettings?.disableFriendRequests,
              },
            };
          },
        },
      });
    },
    optimisticResponse: {
      __typename: 'Mutation',
      updateFriendsSettings: {
        __typename: 'FriendsFriendsSettings',
        disableFriendRequests: !isFriendRequestsDisabled,
      },
    },
  });

  const toggleAllowFriendRequest = () => {
    mutateDisableFriendRequest({
      variables: {
        userId,
        disableFriendRequests: !isFriendRequestsDisabled,
      },
    });
  };

  return {
    toggleAllowFriendRequest,
    isFriendRequestsDisabled,
  };
};
