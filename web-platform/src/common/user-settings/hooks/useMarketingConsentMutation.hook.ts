import { MutationHookOptions, gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import {
  ProfileProfile,
  UpdateMarketingConsentMutation,
  UpdateMarketingConsentMutationVariables,
  useUpdateMarketingConsentMutation,
} from '@gen';

gql`
  mutation UpdateMarketingConsent($consent: AuthConsentStatus!) {
    updateMarketingConsent(marketingConsent: $consent) {
      emptyTypeWorkaround
    }
  }
`;

export function useMarketingConsentMutation(
  baseOptions?: Omit<
    MutationHookOptions<
      UpdateMarketingConsentMutation,
      UpdateMarketingConsentMutationVariables
    >,
    'update'
  >,
) {
  const { userId } = useAuthenticatedUser();

  return useUpdateMarketingConsentMutation({
    ...baseOptions,
    update(cache, _, { variables }) {
      if (!variables?.consent) {
        return;
      }

      cache.updateFragment<DeepPartial<ProfileProfile>>(
        {
          id: cache.identify({ __typename: 'ProfileProfile', userId }),
          fragment: gql`
            fragment MarketingConsentUpdateProfile on ProfileProfile {
              account {
                marketingConsent
              }
            }
          `,
        },
        (existing) => ({
          ...existing,
          account: {
            ...existing?.account,
            marketingConsent: variables.consent,
          },
        }),
      );
    },
  });
}
