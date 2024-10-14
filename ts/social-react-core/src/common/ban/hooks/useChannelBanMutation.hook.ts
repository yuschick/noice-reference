import { MutationHookOptions, gql } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';
import { DeepPartial } from '@noice-com/utils';

import {
  ChannelUserBanStatus,
  QueryChannelBanUserStatusArgs,
  QueryChannelBannedUsersArgs,
  SocialChannelBanMutation,
  SocialChannelBanMutationVariables,
  useSocialChannelBanMutation,
} from '../../../../gen';

gql`
  mutation SocialChannelBan(
    $userId: ID!
    $channelId: ID!
    $violation: ChannelViolation
    $description: String
    $keepRecentMessages: Boolean
  ) {
    banChannelUser(
      userId: $userId
      channelId: $channelId
      violation: $violation
      description: $description
      keepRecentMessages: $keepRecentMessages
    ) {
      emptyTypeWorkaround
    }
  }
`;

export function useChannelBanMutation(
  baseOptions?: Omit<
    MutationHookOptions<SocialChannelBanMutation, SocialChannelBanMutationVariables>,
    'update'
  >,
) {
  return useSocialChannelBanMutation({
    ...baseOptions,
    update(cache, _result, { variables }) {
      cache.modify({
        fields: {
          channelBanUserStatus(
            existing: DeepPartial<ChannelUserBanStatus>,
            { storeFieldName, fieldName },
          ) {
            const { userId, channelId } =
              getFieldsVariables<QueryChannelBanUserStatusArgs>(
                storeFieldName,
                fieldName,
              );

            if (userId === variables?.userId && channelId === variables?.channelId) {
              return {
                ...existing,
                banned: true,
              };
            }

            return existing;
          },
          channelBannedUsers(existing, { storeFieldName, fieldName, toReference }) {
            if (!variables) {
              return existing;
            }

            const { channelId } = getFieldsVariables<QueryChannelBannedUsersArgs>(
              storeFieldName,
              fieldName,
            );

            if (channelId !== variables.channelId) {
              return existing;
            }

            return {
              ...existing,
              users: [
                ...(existing?.users ?? []),
                toReference(
                  {
                    userId: variables.userId,
                    channelId: variables.channelId,
                    __typename: 'ChannelBannedUser',
                  },
                  true,
                ),
              ],
            };
          },
        },
      });
    },
  });
}
