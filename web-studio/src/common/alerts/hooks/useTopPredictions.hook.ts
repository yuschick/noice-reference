import { ApolloError, gql } from '@apollo/client';
import { useRestartingSubscription } from '@noice-com/apollo-client-utils';
import { GameCard } from '@noice-com/card-game';

import {
  AlertsTopPredictionsDocument,
  AlertsTopPredictionsUpdateFragment,
  AlertsTopPredictionsSubscription,
  AlertsTopPredictionsSubscriptionVariables,
} from '@gen';

gql`
  subscription AlertsTopPredictions($streamId: ID) {
    streamTopActiveCardsSubscribe(streamId: $streamId) {
      content {
        ...AlertsTopPredictionsUpdate
      }
    }
  }

  fragment AlertsTopPredictionsUpdate on MatchTopCardsUpdateCardCountUpdate {
    ... on MatchTopCardsUpdateCardCountUpdate {
      cards {
        cardId
        ...AlertsTopPredictionsCardCount
      }
    }
  }

  fragment AlertsTopPredictionsCardCount on MatchCardCount {
    cardId
    card {
      id
      ...AlertsTopPredictionsCard
    }
    count
  }

  fragment AlertsTopPredictionsCard on GameLogicCard {
    ...GameCard
    id
    name
    description
    targetValue
    timerDuration
    ...GameStateCardTargetValues
  }

  ${GameCard.fragments.card}
`;

interface Props {
  streamId: string;
  enabled: boolean;
  onEvent(event: AlertsTopPredictionsUpdateFragment): void;
  onError(error: ApolloError): void;
}

export function useTopPredictions({ streamId, enabled, onEvent, onError }: Props) {
  useRestartingSubscription<
    AlertsTopPredictionsSubscription,
    AlertsTopPredictionsSubscriptionVariables
  >(AlertsTopPredictionsDocument, {
    variables: {
      streamId,
    },
    skip: !streamId || !enabled,
    onData({ data }) {
      if (!data.data?.streamTopActiveCardsSubscribe?.content) {
        return;
      }

      if (
        data.data.streamTopActiveCardsSubscribe.content.__typename !==
        'MatchTopCardsUpdateCardCountUpdate'
      ) {
        return;
      }
      onEvent(data.data.streamTopActiveCardsSubscribe.content);
    },
    onError,
  });
}
