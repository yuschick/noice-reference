import { MutationHookOptions, gql } from '@apollo/client';
import { DeepPartial } from '@noice-com/utils';

import {
  ProfileProfile,
  UpdateConsentWarningSettingMutation,
  UpdateConsentWarningSettingMutationVariables,
  useUpdateConsentWarningSettingMutation,
} from '@gen';

gql`
  mutation UpdateConsentWarningSetting(
    $userId: ID!
    $showMatureContentWarning: Boolean!
  ) {
    updatePrivacySettings(
      userId: $userId
      body: { showMatureContentWarning: $showMatureContentWarning }
    ) {
      showMatureContentWarning
    }
  }
`;

export function useConsentWarningSettingMutation(
  baseOptions?: Omit<
    MutationHookOptions<
      UpdateConsentWarningSettingMutation,
      UpdateConsentWarningSettingMutationVariables
    >,
    'update'
  >,
) {
  return useUpdateConsentWarningSettingMutation({
    ...baseOptions,
    update(cache, { data }, { variables }) {
      const userId = variables?.userId;
      // Default to true if something weird happens.
      const showMatureContentWarning =
        data?.updatePrivacySettings?.showMatureContentWarning ?? true;

      if (!userId) {
        return;
      }

      cache.updateFragment<DeepPartial<ProfileProfile>>(
        {
          id: cache.identify({ __typename: 'ProfileProfile', userId }),
          fragment: gql`
            fragment ConsentWarningSettingUpdateProfile on ProfileProfile {
              settings {
                privacy {
                  showMatureContentWarning
                }
              }
            }
          `,
        },
        (existing) => ({
          ...existing,
          settings: {
            ...existing?.settings,
            privacy: {
              ...existing?.settings?.privacy,
              showMatureContentWarning,
            },
          },
        }),
      );
    },
  });
}
