import { gql } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';

import {
  SettingsConnectionDeleteOAuth2ConsentMutationVariables,
  useSettingsConnectionDeleteOAuth2ConsentMutation,
} from '@gen';

gql`
  mutation SettingsConnectionDeleteOAuth2Consent($userId: ID!, $clientId: ID!) {
    deleteOAuth2Consent(userId: $userId, clientId: $clientId) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  onCompleted?: () => void;
}

export function useDeleteOAuth2ConsentMutation({ onCompleted }: Props) {
  return useSettingsConnectionDeleteOAuth2ConsentMutation({
    onCompleted,
    update(cache, _result, { variables }) {
      if (!variables?.clientId || !variables.userId) {
        return;
      }

      cache.modify({
        fields: {
          oauth2Consent(existing, { storeFieldName, fieldName }) {
            const { userId, clientId } =
              getFieldsVariables<SettingsConnectionDeleteOAuth2ConsentMutationVariables>(
                storeFieldName,
                fieldName,
              );

            if (userId !== variables.userId || clientId !== variables.clientId) {
              return existing;
            }

            return {
              ...existing,
              scopes: [],
            };
          },
        },
      });
    },
  });
}
