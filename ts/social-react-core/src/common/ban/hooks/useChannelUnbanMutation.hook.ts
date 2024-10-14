import { MutationHookOptions, Reference, gql } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';
import { DeepPartial } from '@noice-com/utils';

import {
  ChannelUserBanStatus,
  QueryChannelBanUserStatusArgs,
  QueryChannelBannedUsersArgs,
  SocialChannelUnbanMutation,
  SocialChannelUnbanMutationVariables,
  useSocialChannelUnbanMutation,
} from '../../../../gen';

gql`
  mutation SocialChannelUnban($userId: ID!, $channelId: ID!) {
    unbanChannelUser(userId: $userId, channelId: $channelId) {
      emptyTypeWorkaround
    }
  }
`;

export function useChannelUnbanMutation(
  baseOptions?: Omit<
    MutationHookOptions<SocialChannelUnbanMutation, SocialChannelUnbanMutationVariables>,
    'update'
  >,
) {
  return useSocialChannelUnbanMutation({
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
                banned: false,
              };
            }

            return existing;
          },
          channelBannedUsers(existing, { storeFieldName, fieldName, readField }) {
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
              users:
                existing.users?.filter(
                  (userBan: Reference) =>
                    readField('userId', userBan) !== variables.userId,
                ) ?? [],
            };
          },
        },
      });
    },
  });
}
