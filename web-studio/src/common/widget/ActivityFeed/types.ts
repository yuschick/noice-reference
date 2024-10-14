import { StreamActivityFeedSubscription, StreamActivityFeedHistoryQuery } from '@gen';

export const activityFeedEventTypes = [
  'StreamerStreamerCardPurchased',
  'new-viewer',
] as const;
export type ActivityFeedEventType = (typeof activityFeedEventTypes)[number];

export interface ActivityItemData {
  data:
    | StreamActivityFeedSubscription['channelActivityEventsSubscribe']
    | NonNullable<StreamActivityFeedHistoryQuery['channelActivityEvents']>['events'][0];
}
