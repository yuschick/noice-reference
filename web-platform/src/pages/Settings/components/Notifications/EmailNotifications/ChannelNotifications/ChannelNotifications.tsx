import { gql } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';
import { Switch, useAuthenticatedUser } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import { SettingsItem } from '../../../SettingsGroup';

import {
  ChannelNotificationChannelNotificationSettingsFragment,
  ChannelNotificationSettings,
  QueryChannelNotificationSettingsArgs,
  useUpdateChannelNotificationSettingsMutation,
} from '@gen';

gql`
  fragment ChannelNotificationChannelNotificationSettings on ChannelNotificationSettings {
    channelLiveNotification {
      emailEnabled
    }
  }

  mutation UpdateChannelNotificationSettings($userId: ID!, $emailEnabled: Boolean!) {
    updateChannelNotificationSettings(
      body: { userId: $userId, channelLiveNotification: { emailEnabled: $emailEnabled } }
    ) {
      userId
      ...ChannelNotificationChannelNotificationSettings
    }
  }
`;

interface Props {
  channelNotificationSettings: ChannelNotificationChannelNotificationSettingsFragment;
}

export function ChannelNotifications({ channelNotificationSettings }: Props) {
  const { userId } = useAuthenticatedUser();

  const isEmailNotificationsEnabled =
    channelNotificationSettings.channelLiveNotification?.emailEnabled ?? false;

  const [updateChannelNotificationSettings, { loading }] =
    useUpdateChannelNotificationSettingsMutation({
      variables: { userId, emailEnabled: !isEmailNotificationsEnabled },
      update: (cache, { data }) => {
        if (!data?.updateChannelNotificationSettings) {
          return;
        }

        const { userId, channelLiveNotification } =
          data.updateChannelNotificationSettings;

        cache.modify({
          fields: {
            channelNotificationSettings: (
              existing: DeepPartial<ChannelNotificationSettings>,
              { storeFieldName, fieldName },
            ) => {
              const { userId: userIdVariable } =
                getFieldsVariables<QueryChannelNotificationSettingsArgs>(
                  storeFieldName,
                  fieldName,
                );

              if (userIdVariable !== userId) {
                return existing;
              }

              return {
                ...existing,
                channelLiveNotification: {
                  ...existing.channelLiveNotification,
                  ...channelLiveNotification,
                },
              };
            },
          },
        });
      },
    });

  return (
    <SettingsItem
      description="Receive notifications when followed channels go live."
      state={isEmailNotificationsEnabled ? 'enabled' : 'disabled'}
    >
      <span>Channel notifications</span>

      <SettingsItem.Control>
        <Switch
          checked={isEmailNotificationsEnabled}
          isLoading={loading}
          label="Channel notifications"
          labelType="hidden"
          onChange={() => updateChannelNotificationSettings()}
        />
      </SettingsItem.Control>
    </SettingsItem>
  );
}
