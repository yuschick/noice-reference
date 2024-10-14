import { ApolloError, gql } from '@apollo/client';
import { useRestartingSubscription } from '@noice-com/apollo-client-utils';
import { GameCard } from '@noice-com/card-game';

import {
  AlertsChannelActivityEventFragment,
  AlertsChannelActivityEventsDocument,
  AlertsChannelActivityEventsSubscription,
  AlertsChannelActivityEventsSubscriptionVariables,
  StreamerChannelActivityEventFilterEventType,
} from '@gen';

gql`
  subscription AlertsChannelActivityEvents(
    $channelId: ID
    $filter: StreamerChannelActivityEventFilterInput
    $after: String
  ) {
    channelActivityEventsSubscribe(
      channelId: $channelId
      filter: $filter
      after: $after
    ) {
      ...AlertsChannelActivityEvent
    }
  }

  fragment AlertsChannelActivityEvent on StreamerChannelActivityEvent {
    timestamp
    id
    content {
      ...AlertsChannelActivityEventHighScoringCardEvent
      ...AlertsChannelActivityEventChannelFollowed
      ...AlertsChannelActivityEventSubscriptionGifted
      ...AlertsChannelActivityEventChannelSubscribed
      ...AlertsChannelActivityEventChannelSubscriptionRenewed
      ...AlertsChannelActivityEventCreatorCardPurchased
      ...AlertsChannelActivityEventBundlePurchased
    }
  }

  fragment AlertsChannelActivityEventChannelFollowed on StreamerChannelFollowed {
    userId
    follower: user {
      ...AlertsChannelActivityEventProfile
    }
  }

  fragment AlertsChannelActivityEventSubscriptionGifted on StreamerSubscriptionGifted {
    userId
    tier
    user {
      ...AlertsChannelActivityEventProfile
    }
    recipientUserIds
  }

  fragment AlertsChannelActivityEventChannelSubscribed on StreamerChannelSubscribed {
    userId
    user {
      ...AlertsChannelActivityEventProfile
    }
  }

  fragment AlertsChannelActivityEventChannelSubscriptionRenewed on StreamerSubscriptionRenewed {
    userId
    user {
      ...AlertsChannelActivityEventProfile
    }
  }

  fragment AlertsChannelActivityEventCreatorCardPurchased on StreamerStreamerCardPurchased {
    userId
    user {
      ...AlertsChannelActivityEventProfile
    }
  }

  fragment AlertsChannelActivityEventBundlePurchased on StreamerBundlePurchased {
    userId
    user {
      ...AlertsChannelActivityEventProfile
    }
  }

  fragment AlertsChannelActivityEventHighScoringCardEvent on GameLogicHighScoringCardPromotedMsg {
    hscPlayer: user {
      ...AlertsChannelActivityEventProfile
    }
    card {
      cardId
      card {
        ...GameCard
      }
      points
      boosterPoints {
        userId
        boosterId
      }
    }
  }

  fragment AlertsChannelActivityEventProfile on ProfileProfile {
    userId
    userTag
    avatars {
      avatar2D
      avatarFullbody
    }
  }

  ${GameCard.fragments.card}
`;

interface Props {
  channelId: string;
  filters: StreamerChannelActivityEventFilterEventType[];
  onEvent(event: AlertsChannelActivityEventFragment): void;
  onError(error: ApolloError): void;
}

export function useChannelActivityEvents({
  channelId,
  filters,
  onEvent,
  onError,
}: Props) {
  useRestartingSubscription<
    AlertsChannelActivityEventsSubscription,
    AlertsChannelActivityEventsSubscriptionVariables
  >(AlertsChannelActivityEventsDocument, {
    variables: {
      channelId,
      filter: { eventTypes: filters },
    },
    skip: !channelId || !filters.length,
    onData(data) {
      if (!data.data.data?.channelActivityEventsSubscribe?.content) {
        return;
      }

      onEvent(data.data.data?.channelActivityEventsSubscribe);
    },
    onError,
  });
}
