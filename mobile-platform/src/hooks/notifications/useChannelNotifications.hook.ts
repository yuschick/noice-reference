import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { getErrorMessage, makeLoggers } from '@noice-com/utils';

import { useShouldAskForNotificationPermission } from './useShouldAskForNotificationPermissions.hook';

import {
  useChannelNotificationsQuery,
  useUpdateChannelNotificationSettingsMutation,
} from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { InstrumentationAnalytics } from '@lib/InstrumentationAnalytics';

const { logError } = makeLoggers('useChannelNotifications');

gql`
  mutation UpdateChannelNotificationSettings(
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

  query ChannelNotifications($channelId: ID!, $userId: ID!) {
    channelFollowerNotificationSettings(channelId: $channelId, userId: $userId) {
      userId
      channelId
      channelLiveNotificationEnabled
    }
  }
`;

export const useChannelNotifications = (channelId?: string) => {
  const { userId } = useAuth();
  const { shouldAsk, shouldPromptToSettings } = useShouldAskForNotificationPermission();
  const { data, loading: queryLoading } = useChannelNotificationsQuery({
    ...variablesOrSkip({ channelId, userId }),
  });

  const [toggle, { loading: mutationLoading }] =
    useUpdateChannelNotificationSettingsMutation({
      update: (cache, { data: newData }) => {
        const updatedSettings = newData?.updateFollowerNotificationSettings;
        if (updatedSettings) {
          cache.writeQuery({
            query: gql`
              query ChannelNotifications($channelId: ID!, $userId: ID!) {
                channelFollowerNotificationSettings(
                  channelId: $channelId
                  userId: $userId
                ) {
                  userId
                  channelId
                  channelLiveNotificationEnabled
                }
              }
            `,
            data: {
              channelFollowerNotificationSettings: updatedSettings,
            },
            variables: {
              channelId,
              userId,
            },
          });
        }
      },
    });

  const toggleChannelNotifications = async (enabled: boolean) => {
    if (!userId || !channelId) {
      return;
    }

    try {
      await toggle({
        variables: {
          channelId,
          userId,
          enabled,
        },
        optimisticResponse: {
          updateFollowerNotificationSettings: {
            __typename: 'ChannelFollowerNotificationSettings',
            userId,
            channelId,
            channelLiveNotificationEnabled: enabled,
          },
        },
      });
    } catch (err) {
      logError(err);
      InstrumentationAnalytics.captureException(new Error(getErrorMessage(err)));
    }
  };

  return {
    channelNotificationsEnabled:
      !!data?.channelFollowerNotificationSettings?.channelLiveNotificationEnabled &&
      !shouldAsk &&
      !shouldPromptToSettings,
    toggleChannelNotifications,
    isLoading: queryLoading || mutationLoading,
  };
};
