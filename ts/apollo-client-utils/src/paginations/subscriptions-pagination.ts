import { FieldPolicy, Reference } from '@apollo/client';

import { SubscriptionListUserChannelSubscriptionsResponse } from '../../gen';

type ExistingSubscriptionsPagination =
  | (Omit<SubscriptionListUserChannelSubscriptionsResponse, 'subscriptions'> & {
      subscriptions: Reference[];
    })
  | null;

type ResultSubscriptionsPagination =
  | (Omit<SubscriptionListUserChannelSubscriptionsResponse, 'subscriptions'> & {
      subscriptions: Reference[];
    })
  | null;

type SubscriptionsFieldPolicy = FieldPolicy<
  ExistingSubscriptionsPagination,
  ResultSubscriptionsPagination,
  ResultSubscriptionsPagination
>;

export function subscriptionsPagination(): SubscriptionsFieldPolicy {
  return {
    keyArgs: ['filters'],
    read(existing) {
      if (existing) {
        return existing;
      }
    },

    merge(existing, incoming, { readField }) {
      if (!incoming) {
        return existing ?? null;
      }

      const existingSubscriptionIds = new Set(
        existing?.subscriptions.map((subscription) => readField('id', subscription)),
      );

      const subscriptions = [
        ...(existing?.subscriptions ?? []),
        ...incoming.subscriptions.filter(
          (subscription) => !existingSubscriptionIds.has(readField('id', subscription)),
        ),
      ];

      return {
        ...incoming,
        subscriptions,
      };
    },
  };
}
