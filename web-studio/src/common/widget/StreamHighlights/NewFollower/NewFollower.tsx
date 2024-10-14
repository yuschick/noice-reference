import { gql } from '@apollo/client';

import { EventListItem } from '../EventListItem/EventListItem';
import { StreamHighlightEventType } from '../types';
import { UserHighlight } from '../UserHighlight/UserHighlight';

import { NewFollowerFragment } from '@gen';

type Props = NewFollowerFragment & { timestamp: Date };

export function NewFollower({ user }: Props) {
  return (
    <UserHighlight
      event={{ type: StreamHighlightEventType.NewFollower }}
      user={user}
    />
  );
}

NewFollower.ListView = ({ timestamp, user }: Props) => {
  return (
    <EventListItem
      event={{ type: StreamHighlightEventType.NewFollower }}
      timestamp={timestamp}
      user={user}
    />
  );
};

NewFollower.fragments = {
  entry: gql`
    fragment NewFollower on StreamerChannelFollowed {
      userId
      user {
        userId
        ...UserHighlightProfile
        ...EventListItemProfile
      }
    }
  `,
};
