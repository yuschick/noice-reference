import { gql } from '@apollo/client';
import { useRestartingSubscription } from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';
import { useState } from 'react';

import { useStreamContext } from '@common/stream';
import {
  GameLogicChallengeState,
  GameLogicTargetValue,
  TopPredictionsChallengePickRatesDocument,
  TopPredictionsChallengePickRatesSubscription,
  TopPredictionsChallengePickRatesSubscriptionVariables,
} from '@gen';

gql`
  subscription TopPredictionsChallengePickRates($streamId: ID!) {
    streamChallengeUpdatesSubscribe(streamId: $streamId) {
      content {
        ... on MatchChallengeUpdateStatusUpdate {
          challenges {
            challengeId
            challengeState
            pickRate
            targetValues {
              label
              value
            }
            challenge {
              id
              description
              targetValues {
                label
                value
              }
            }
          }
        }
      }
    }
  }
`;

interface CardGameChallenge {
  id: string;
  description: string;
  pickRatePercentage: number;
  pickRate: number;
  targetValues?: GameLogicTargetValue[];
  challengeState: GameLogicChallengeState;
}

interface Props {
  streamId: Nullable<string>;
}

interface HookResult {
  challenges: CardGameChallenge[];
  isLoading: boolean;
}

export const useChallenges = ({ streamId }: Props): HookResult => {
  const { isChallengesEnabled } = useStreamContext();
  const [challenges, setChallenges] = useState<CardGameChallenge[]>([]);

  const skip = !streamId || !isChallengesEnabled;

  // challenge ids and pick rates for initial render and pick rate updates
  const { loading } = useRestartingSubscription<
    TopPredictionsChallengePickRatesSubscription,
    TopPredictionsChallengePickRatesSubscriptionVariables
  >(TopPredictionsChallengePickRatesDocument, {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { streamId: streamId! },
    skip,
    onData: async ({ data }) => {
      const dataContent = data.data?.streamChallengeUpdatesSubscribe?.content;

      if (!dataContent || dataContent.__typename !== 'MatchChallengeUpdateStatusUpdate') {
        return;
      }

      setChallenges(
        dataContent.challenges.map((data) => ({
          id: data.challengeId,
          description: data.challenge.description,
          challengeState: data.challengeState,
          pickRate: data.pickRate ?? 0,
          pickRatePercentage: Math.round((data.pickRate ?? 0) * 100),
          targetValues:
            data.challengeState === GameLogicChallengeState.ChallengeStateUnresolved
              ? data.targetValues
              : data.challenge.targetValues,
        })),
      );
    },
  });

  return {
    challenges,
    isLoading: loading,
  };
};
