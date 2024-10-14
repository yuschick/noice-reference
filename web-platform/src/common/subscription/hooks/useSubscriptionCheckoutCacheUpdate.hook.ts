import { gql, useApolloClient } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import {
  BadgeBadgeType,
  ChannelChannel,
  ProfileProfile,
  SubscriptionChannelSubscription,
  SubscriptionChannelSubscriptionState,
  useSubscriptionCheckoutCacheUpdateProfileLazyQuery,
} from '@gen';

gql`
  query SubscriptionCheckoutCacheUpdateProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      settings {
        privacy {
          anonymisePurchaseHighlights
        }
      }
    }
  }
`;

export function useSubscriptionCheckoutCacheUpdate(): (
  channelId: string,
  subscriptionId: string,
) => Promise<void> {
  const { cache } = useApolloClient();
  const { userId } = useAuthenticatedUser();

  const [fetchProfile] = useSubscriptionCheckoutCacheUpdateProfileLazyQuery();

  const updateCache = async (channelId: string, subscriptionId: string) => {
    // Update channel's subscription state
    cache.updateFragment<DeepPartial<ChannelChannel>>(
      {
        id: cache.identify({
          id: channelId,
          __typename: 'ChannelChannel',
        }),
        fragment: gql`
          fragment SubscriptionCheckoutModalOnClickUpdateChannel on ChannelChannel {
            id
            subscription {
              id
              state
            }
          }
        `,
      },
      (existing) => {
        if (!existing) {
          return existing;
        }

        return {
          ...existing,
          subscription: {
            id: subscriptionId,
            ...existing?.subscription,
            state: SubscriptionChannelSubscriptionState.StateActive,
          },
        };
      },
    );

    // Update the subscription state
    cache.updateFragment<DeepPartial<SubscriptionChannelSubscription>>(
      {
        id: cache.identify({
          id: subscriptionId,
          __typename: 'SubscriptionChannelSubscription',
        }),
        fragment: gql`
          fragment ActiveMenuCancelUpdateSubscription on SubscriptionChannelSubscription {
            id
            state
          }
        `,
      },
      (existing) => {
        if (!existing) {
          return existing;
        }

        return {
          ...existing,
          state: SubscriptionChannelSubscriptionState.StateActive,
        };
      },
    );

    const { data } = await fetchProfile({ variables: { userId } });

    // Update the profile badge, if user has privacy setting disabled for anonymising purchase highlights
    if (!data?.profile?.settings?.privacy.anonymisePurchaseHighlights) {
      cache.updateFragment<DeepPartial<ProfileProfile>>(
        {
          id: cache.identify({ userId, __typename: 'ProfileProfile' }),
          fragment: gql`
            fragment SubscriptionBadgeProfile on ProfileProfile {
              badges(channel_id: $channelId) {
                __typename
                type
                level
              }
            }
          `,
          variables: {
            channelId,
          },
        },
        (existing) => ({
          ...existing,
          badges: [
            ...(existing?.badges ?? []),
            {
              type: BadgeBadgeType.TypeChannelSubscriber,
              level: 0,
              __typename: 'BadgeBadge',
            },
          ],
        }),
      );
    }
  };

  return updateCache;
}
