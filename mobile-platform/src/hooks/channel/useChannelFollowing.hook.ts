import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { getErrorMessage, makeLoggers } from '@noice-com/utils';
import { Alert } from 'react-native';

import { useFollowChannelMutation } from './useFollowChannelMutation.hook';
import { useUnfollowChannelMutation } from './useUnfollowChannelMutation.hook';

import { useChannelFollowingQuery } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { InstrumentationAnalytics } from '@lib/InstrumentationAnalytics';
import { MarketingTracking } from '@lib/MarketingTracking';

const { logError } = makeLoggers('useChannelFollowing');

gql`
  query ChannelFollowing($channelId: ID!) {
    channel(id: $channelId) {
      id
      following
    }
  }
`;

export const useChannelFollowing = (channelId?: string) => {
  const { userId } = useAuth();
  const [mutateFollowChannel, { error: followError, loading: followLoading }] =
    useFollowChannelMutation(channelId, userId);
  const [mutateUnfollowChannel, { error: unfollowError, loading: unfollowLoading }] =
    useUnfollowChannelMutation(channelId, userId);

  const { data } = useChannelFollowingQuery({
    ...variablesOrSkip({ channelId }),
  });

  const follow = async () => {
    if (!userId || !channelId) {
      return;
    }

    MarketingTracking.trackEvent('channel_follow');
    try {
      await mutateFollowChannel({
        variables: {
          channelId,
          userId,
        },
      });
    } catch (err) {
      InstrumentationAnalytics.captureException(new Error(getErrorMessage(err)));
      logError(err);
    }
  };

  const unfollow = (callback?: () => void) => {
    Alert.alert('Unfollow', 'Are you sure you want to unfollow this channel?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Unfollow',
        onPress: async () => {
          if (!userId || !channelId) {
            return;
          }

          try {
            await mutateUnfollowChannel({
              variables: {
                channelId,
                userId,
              },
            });
            callback?.();
          } catch (err) {
            logError(err);
            InstrumentationAnalytics.captureException(new Error(getErrorMessage(err)));
          }
        },
      },
    ]);
  };

  return {
    isFollowing: !!data?.channel?.following,
    follow,
    unfollow,
    followError,
    followLoading,
    unfollowError,
    unfollowLoading,
  };
};
