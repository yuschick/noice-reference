import { UserBadgeFragment } from '@noice-com/chat-react-web/gen';
import { Nullable } from '@noice-com/utils';

import { StreamHighlightEventType, UserStreamHighlightEventType } from '../types';

import { UserHighlightProfileFragment } from '@gen';

interface UserStreamHighlightEvent<T extends UserStreamHighlightEventType> {
  type: T;
}

interface UserStreamHighlightNewSubscriberEvent
  extends UserStreamHighlightEvent<StreamHighlightEventType.NewSubscriber> {
  badge: UserBadgeFragment;
}

interface UserStreamHighlightNewGiftSubscriptionEvent
  extends UserStreamHighlightEvent<StreamHighlightEventType.NewGiftSubscription> {
  badge: UserBadgeFragment;
  recipient: {
    user: Nullable<UserHighlightProfileFragment>;
    badge: UserBadgeFragment;
  };
}

export interface UserStreamHighlightModel {
  event:
    | UserStreamHighlightEvent<StreamHighlightEventType.NewFollower>
    | UserStreamHighlightNewSubscriberEvent
    | UserStreamHighlightNewGiftSubscriptionEvent;
  user: Nullable<UserHighlightProfileFragment>;
}
