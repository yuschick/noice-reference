import { MutationHookOptions, gql } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';
import { DeepPartial } from '@noice-com/utils';

import { useWebPushNotifications } from '@common/web-push-notifications';
import {
  ChannelFollowerNotificationSettings,
  QueryChannelFollowerNotificationSettingsArgs,
  UpdateChannelFollowerNotificationSettingsMutation,
  UpdateChannelFollowerNotificationSettingsMutationVariables,
  useUpdateChannelFollowerNotificationSettingsMutation,
} from '@gen';

gql`
  mutation UpdateChannelFollowerNotificationSettings(
    $channelId: ID!
    $userId: ID!
    $enabled: Boolean!
  ) {
    updateFollowerNotificationSettings(
      body: {
        channelId: $channelId
        userId: $userId
        channelLiveNotificationEnabled: $enabled
      }
    ) {
      userId
      channelId
      channelLiveNotificationEnabled
    }
  }
`;

export function useUpdateChannelNotificationSettingsMutation(
  baseOptions?: Omit<
    MutationHookOptions<
      UpdateChannelFollowerNotificationSettingsMutation,
      UpdateChannelFollowerNotificationSettingsMutationVariables
    >,
    'update'
  >,
) {
  const { askPermissionForWebPushNotifications } =
    useWebPushNotifications('channel-live');

  return useUpdateChannelFollowerNotificationSettingsMutation({
    ...baseOptions,
    onCompleted: (data) => {
      if (data.updateFollowerNotificationSettings?.channelLiveNotificationEnabled) {
        askPermissionForWebPushNotifications();
      }
    },
    update(cache, { data }) {
      if (!data?.updateFollowerNotificationSettings) {
        return;
      }

      const { userId, channelId, channelLiveNotificationEnabled } =
        data.updateFollowerNotificationSettings;

      cache.modify({
        fields: {
          channelFollowerNotificationSettings: (
            existing: DeepPartial<ChannelFollowerNotificationSettings>,
            { storeFieldName, fieldName },
          ) => {
            const { channelId: channelIdVariable, userId: userIdVariable } =
              getFieldsVariables<QueryChannelFollowerNotificationSettingsArgs>(
                storeFieldName,
                fieldName,
              );

            if (channelIdVariable !== channelId || userIdVariable !== userId) {
              return existing;
            }

            return {
              ...existing,
              channelLiveNotificationEnabled,
            };
          },
        },
      });
    },
  });
}
