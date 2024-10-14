import { FieldPolicy, Reference } from '@apollo/client';

import { SubscriptionListChannelSubscriptionsResponse } from '../../gen';

type ExistingSubscriptionPagination =
  | (Omit<SubscriptionListChannelSubscriptionsResponse, 'subscriptions'> & {
      subscriptions: Reference[];
    })
  | null;

type ResultSubscriptionPagination =
  | (Omit<SubscriptionListChannelSubscriptionsResponse, 'subscriptions'> & {
      subscriptions: Reference[];
    })
  | null;

type SubscriptionFieldPolicy = FieldPolicy<
  ExistingSubscriptionPagination,
  ResultSubscriptionPagination,
  ResultSubscriptionPagination
>;

export function channelSubscriptionsPagination(): SubscriptionFieldPolicy {
  return {
    keyArgs: ['channelId'],
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
        ...(incoming.subscriptions?.filter(
          (subscription) => !existingSubscriptionIds.has(readField('id', subscription)),
        ) ?? []),
      ];

      return {
        ...incoming,
        subscriptions,
      };
    },
  };
}
