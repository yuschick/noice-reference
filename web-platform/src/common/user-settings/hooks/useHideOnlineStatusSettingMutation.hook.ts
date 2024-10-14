import { MutationHookOptions, gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import {
  ProfileProfile,
  UpdateHideOnlineStatusMutation,
  UpdateHideOnlineStatusMutationVariables,
  useUpdateHideOnlineStatusMutation,
} from '@gen';

gql`
  mutation UpdateHideOnlineStatus($hideOnlineStatus: Boolean!) {
    updatePrivacySettings(body: { hideOnlineStatus: $hideOnlineStatus }) {
      hideOnlineStatus
    }
  }
`;

export function useHideOnlineStatusSettingMutation(
  baseOptions?: Omit<
    MutationHookOptions<
      UpdateHideOnlineStatusMutation,
      UpdateHideOnlineStatusMutationVariables
    >,
    'update'
  >,
) {
  const { userId } = useAuthenticatedUser();

  return useUpdateHideOnlineStatusMutation({
    ...baseOptions,
    update(cache, _result, { variables }) {
      cache.updateFragment<DeepPartial<ProfileProfile>>(
        {
          id: cache.identify({ userId, __typename: 'ProfileProfile' }),
          fragment: gql`
            fragment OnlineVisibilityUpdateProfile on ProfileProfile {
              userId
              settings {
                privacy {
                  hideOnlineStatus
                }
              }
            }
          `,
        },
        (existingProfile) => ({
          ...existingProfile,
          settings: {
            ...existingProfile?.settings,
            privacy: {
              ...existingProfile?.settings?.privacy,
              hideOnlineStatus: variables?.hideOnlineStatus ?? undefined,
            },
          },
        }),
      );
    },
  });
}
