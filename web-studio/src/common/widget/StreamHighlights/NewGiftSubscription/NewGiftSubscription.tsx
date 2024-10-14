import { gql } from '@apollo/client';

import { EventListItem } from '../EventListItem/EventListItem';
import { StreamHighlightEventType } from '../types';
import { UserHighlight } from '../UserHighlight/UserHighlight';

import { BadgeBadgeType, NewGiftSubscriptionFragment, UserBadgeFragment } from '@gen';

gql`
  fragment NewGiftSubscription on StreamerSubscriptionGifted {
    userId
    gifter: user {
      userId
      badges(channel_id: $channelId) {
        ...UserBadge
      }
      ...UserHighlightProfile
      ...EventListItemProfile
    }
    recipients {
      userId
      badges(channel_id: $channelId) {
        ...UserBadge
      }
      ...UserHighlightProfile
      ...EventListItemProfile
    }
  }
`;

type Props = NewGiftSubscriptionFragment & { timestamp: Date };

const getUserBadge = (badges?: UserBadgeFragment[]) =>
  badges?.find((badge) => badge.type === BadgeBadgeType.TypeSubsGifter) ?? {
    type: BadgeBadgeType.TypeSubsGifter,
    level: 0,
  };

const getRecipient = (recipients: NewGiftSubscriptionFragment['recipients']) => {
  if (!recipients?.length) {
    return {
      user: null,
      badge: {
        type: BadgeBadgeType.TypeChannelSubscriber,
        level: 0,
      },
    };
  }

  return {
    user: recipients[0],
    badge: recipients[0].badges?.find(
      (badge) => badge.type === BadgeBadgeType.TypeChannelSubscriber,
    ) ?? {
      type: BadgeBadgeType.TypeChannelSubscriber,
      level: 0,
    },
  };
};

export function NewGiftSubscription({ gifter, recipients }: Props) {
  const badge = getUserBadge(gifter?.badges);
  const recipient = getRecipient(recipients);

  return (
    <UserHighlight
      event={{ type: StreamHighlightEventType.NewGiftSubscription, badge, recipient }}
      user={gifter ?? null}
    />
  );
}

NewGiftSubscription.ListView = ({ timestamp, gifter, recipients }: Props) => {
  const badge = getUserBadge(gifter?.badges);
  const recipient = getRecipient(recipients);

  return (
    <EventListItem
      event={{ type: StreamHighlightEventType.NewGiftSubscription, badge, recipient }}
      timestamp={timestamp}
      user={gifter}
    />
  );
};
