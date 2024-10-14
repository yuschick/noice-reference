import { gql } from '@apollo/client';

import {
  useProfilePrivacyHideOnlineStatusMutation,
  useProfilePrivacySettingsQuery,
} from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';

gql`
  mutation ProfilePrivacyHideOnlineStatus($userId: ID, $hideOnlineStatus: Boolean) {
    updatePrivacySettings(
      userId: $userId
      body: { hideOnlineStatus: $hideOnlineStatus }
    ) {
      hideOnlineStatus
    }
  }
`;

export const useOnlineStatus = () => {
  const { userId } = useAuth();
  const { data } = useProfilePrivacySettingsQuery({
    variables: { userId },
  });

  const hideOnlineStatus = !!data?.profile?.settings?.privacy?.hideOnlineStatus;

  const [mutateToggleOnlineStatus] = useProfilePrivacyHideOnlineStatusMutation({
    update(cache, { data: newData }) {
      cache.modify({
        id: cache.identify({ __typename: 'ProfileProfile', userId }),
        fields: {
          settings(existingSettings) {
            return {
              ...existingSettings,
              privacy: {
                ...existingSettings.privacy,
                hideOnlineStatus: newData?.updatePrivacySettings?.hideOnlineStatus,
              },
            };
          },
        },
      });
    },
    optimisticResponse: {
      __typename: 'Mutation',
      updatePrivacySettings: {
        __typename: 'ProfilePrivacySettings',
        hideOnlineStatus: !hideOnlineStatus,
      },
    },
  });

  const toggleHideOnlineStatus = () => {
    mutateToggleOnlineStatus({
      variables: {
        userId,
        hideOnlineStatus: !hideOnlineStatus,
      },
    });
  };

  return {
    toggleHideOnlineStatus,
    hideOnlineStatus,
  };
};
