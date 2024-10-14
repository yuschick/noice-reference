import { UserBadgeFragment } from '@noice-com/chat-react-web/gen';
import { Nullable } from '@noice-com/utils';

import { StreamHighlightEventType } from '../types';

import { EventListItemProfileFragment } from '@gen';

interface StreamHighlightEvent<T extends StreamHighlightEventType> {
  type: T;
  details?: string;
}

interface StreamHighlightNewSubscriberEvent
  extends StreamHighlightEvent<StreamHighlightEventType.NewSubscriber> {
  badge: UserBadgeFragment;
}

interface StreamHighlightNewGiftSubscriptionEvent
  extends StreamHighlightEvent<StreamHighlightEventType.NewGiftSubscription> {
  badge: UserBadgeFragment;
  recipient: {
    user: Nullable<EventListItemProfileFragment>;
    badge: UserBadgeFragment;
  };
}

export interface EventListItemModel {
  timestamp: Date;
  event:
    | StreamHighlightEvent<
        Exclude<
          StreamHighlightEventType,
          | StreamHighlightEventType.NewSubscriber
          | StreamHighlightEventType.NewGiftSubscription
        >
      >
    | StreamHighlightNewSubscriberEvent
    | StreamHighlightNewGiftSubscriptionEvent;
  user?: Nullable<EventListItemProfileFragment>;
}
