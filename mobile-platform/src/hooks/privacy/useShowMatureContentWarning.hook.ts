import { gql } from '@apollo/client';

import {
  useProfilePrivacySettingsQuery,
  useProfilePrivacyShowContentWarningMutation,
} from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';

gql`
  mutation ProfilePrivacyShowContentWarning(
    $userId: ID
    $showMatureContentWarning: Boolean
  ) {
    updatePrivacySettings(
      userId: $userId
      body: { showMatureContentWarning: $showMatureContentWarning }
    ) {
      showMatureContentWarning
    }
  }
`;

export const useShowContentWarning = () => {
  const { userId } = useAuth();
  const { data, loading } = useProfilePrivacySettingsQuery({
    variables: {
      userId,
    },
  });

  const showMatureContentWarning =
    !!data?.profile?.settings?.privacy.showMatureContentWarning;

  const [mutateToggleShowContentWarning] = useProfilePrivacyShowContentWarningMutation({
    update(cache, { data: newData }) {
      cache.modify({
        id: cache.identify({ __typename: 'ProfileProfile', userId }),
        fields: {
          settings(existingSettings) {
            return {
              ...existingSettings,
              privacy: {
                ...existingSettings.privacy,
                showMatureContentWarning:
                  newData?.updatePrivacySettings?.showMatureContentWarning,
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
        showMatureContentWarning: !showMatureContentWarning,
      },
    },
  });

  const toggleShowContentWarning = () => {
    mutateToggleShowContentWarning({
      variables: {
        userId,
        showMatureContentWarning: !showMatureContentWarning,
      },
    });
  };

  return {
    toggleShowContentWarning,
    showMatureContentWarning,
    loading,
  };
};
