import { gql } from '@apollo/client';

import { EventListItem } from '../EventListItem/EventListItem';
import { StreamHighlightEventType } from '../types';
import { UserHighlight } from '../UserHighlight/UserHighlight';

import { BadgeBadgeType, NewSubscriberFragment, UserBadgeFragment } from '@gen';

type Props = NewSubscriberFragment & { timestamp: Date };

const getSubscriberBadge = (badges?: UserBadgeFragment[]) =>
  badges?.find((badge) => badge.type === BadgeBadgeType.TypeChannelSubscriber) ?? {
    type: BadgeBadgeType.TypeChannelSubscriber,
    level: 0,
  };

export function NewSubscriber({ subscriber }: Props) {
  const badge = getSubscriberBadge(subscriber?.badges);

  return (
    <UserHighlight
      event={{ type: StreamHighlightEventType.NewSubscriber, badge }}
      user={subscriber ?? null}
    />
  );
}

NewSubscriber.ListView = ({ timestamp, subscriber }: Props) => {
  const badge = getSubscriberBadge(subscriber?.badges);

  return (
    <EventListItem
      event={{ type: StreamHighlightEventType.NewSubscriber, badge }}
      timestamp={timestamp}
      user={subscriber}
    />
  );
};

NewSubscriber.fragments = {
  entry: gql`
    fragment NewSubscriber on StreamerChannelSubscribed {
      userId
      subscriber: user {
        userId
        badges(channel_id: $channelId) {
          ...UserBadge
        }
        ...UserHighlightProfile
        ...EventListItemProfile
      }
    }
  `,
};
