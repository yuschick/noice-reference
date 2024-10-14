import { gql } from '@apollo/client';
import { DeepPartial } from '@noice-com/utils';

import {
  ProfileProfile,
  useSettingsConnectionDeleteExternalAccountMutation,
} from '@gen/graphql';

gql`
  mutation SettingsConnectionDeleteExternalAccount(
    $userId: ID!
    $type: AuthIdentityType!
  ) {
    deleteExternalAccount(userId: $userId, idType: $type) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  onCompleted?: () => void;
}

export function useUserExternalAccountDisconnect({ onCompleted }: Props) {
  return useSettingsConnectionDeleteExternalAccountMutation({
    update(cache, _result, { variables }) {
      if (!variables) {
        return;
      }

      cache.updateFragment<DeepPartial<ProfileProfile>>(
        {
          id: cache.identify({ userId: variables.userId, __typename: 'ProfileProfile' }),
          fragment: gql`
            fragment SettingsConnectionsData on ProfileProfile {
              userId
              account {
                externalIds {
                  type
                }
              }
            }
          `,
        },
        (data) => ({
          ...data,
          account: {
            ...data?.account,
            externalIds: data?.account?.externalIds?.filter(
              (id) => id?.type !== variables.type,
            ),
          },
        }),
      );
    },
    onCompleted,
  });
}
