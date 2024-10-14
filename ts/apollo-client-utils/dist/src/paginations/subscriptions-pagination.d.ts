import { FieldPolicy, Reference } from '@apollo/client';
import { SubscriptionListUserChannelSubscriptionsResponse } from '../../gen';
type ExistingSubscriptionsPagination = (Omit<SubscriptionListUserChannelSubscriptionsResponse, 'subscriptions'> & {
    subscriptions: Reference[];
}) | null;
type ResultSubscriptionsPagination = (Omit<SubscriptionListUserChannelSubscriptionsResponse, 'subscriptions'> & {
    subscriptions: Reference[];
}) | null;
type SubscriptionsFieldPolicy = FieldPolicy<ExistingSubscriptionsPagination, ResultSubscriptionsPagination, ResultSubscriptionsPagination>;
export declare function subscriptionsPagination(): SubscriptionsFieldPolicy;
export {};
