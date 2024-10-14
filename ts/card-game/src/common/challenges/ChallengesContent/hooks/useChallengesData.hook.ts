import { gql } from '@apollo/client';
import { WalletCurrencyId } from '@noice-com/common-ui';
import { useMemo } from 'react';

import { useChallengeTargetValues } from './useChallengeTargetValues.hook';
import { usePickRateRewards } from './usePickRateRewards.hook';

import { parseChallengeDescription } from '@game-common/challenges';
import {
  ChallengesContentChallengeFragment,
  useChallengesContentChallengesQuery,
} from '@game-gen';
import { ChallengeStatus } from '@game-logic/challenges';
import {
  useChallenges,
  useChallengeStatuses,
  useIsChallengesEnabled,
  usePickRates,
} from '@game-logic/challenges/hooks';

gql`
  fragment ChallengesContentChallenge on GameLogicChallenge {
    id
    description
    targetValues {
      label
      value
    }
  }

  query ChallengesContentChallenges($challengeIds: [String!]!) {
    challengesBatch(challengeIds: $challengeIds) {
      challenges {
        ...ChallengesContentChallenge
      }
    }
  }
`;

export type ChallengeContentType = ChallengesContentChallengeFragment & {
  status: ChallengeStatus;
  pickRatePercentage: number;
  reward: {
    currencyId: WalletCurrencyId;
    amount: number;
  };
};

interface HookResult {
  challenges: ChallengeContentType[];
  isLoading: boolean;
  // @todo: Dont return getReward here, expose it from its own hook.
  getReward: (pickRatePercentage: number) => {
    currencyId: WalletCurrencyId;
    amount: number;
  };
}

export function useChallengesData(): HookResult {
  const { isEnabled } = useIsChallengesEnabled();
  const { statuses } = useChallengeStatuses();
  const { challengeIds } = useChallenges();
  const { targetValues } = useChallengeTargetValues();
  const { getReward, isLoading: loadingRewards } = usePickRateRewards();
  const { pickRatePercentages } = usePickRates();

  const { data, loading } = useChallengesContentChallengesQuery({
    variables: {
      challengeIds,
    },
    skip: challengeIds.length === 0 || !isEnabled,
  });

  const challengesData = data?.challengesBatch?.challenges;
  const initialTargetValues: Record<
    string,
    ChallengesContentChallengeFragment['targetValues']
  > = useMemo(
    () =>
      data?.challengesBatch?.challenges.reduce(
        (obj, challenge) => ({
          ...obj,
          [challenge.id]: challenge.targetValues,
        }),
        {},
      ) ?? {},
    [data?.challengesBatch],
  );

  const challenges = useMemo(() => {
    if (loadingRewards) {
      return [];
    }

    return (challengesData ?? []).map((challengeData) => {
      const status = statuses[challengeData.id] ?? 'unresolved';
      const pickRatePercentage = !isNaN(pickRatePercentages[challengeData.id])
        ? pickRatePercentages[challengeData.id]
        : 0;
      const description =
        status === 'unresolved' && targetValues[challengeData.id]
          ? // For unresolved, show latest target value
            parseChallengeDescription(
              challengeData.description,
              targetValues[challengeData.id],
            )
          : // For failed / succeeded, show initial
            parseChallengeDescription(
              challengeData.description,
              initialTargetValues[challengeData.id],
            );

      return {
        ...challengeData,
        targetValues:
          targetValues[challengeData.id] ?? initialTargetValues[challengeData.id] ?? [],
        status,
        pickRatePercentage,
        description,
        reward: getReward(pickRatePercentage),
      };
    });
  }, [
    loadingRewards,
    challengesData,
    statuses,
    pickRatePercentages,
    targetValues,
    initialTargetValues,
    getReward,
  ]);

  return {
    challenges,
    isLoading: loading || loadingRewards,
    getReward: loadingRewards
      ? () => ({ currencyId: WalletCurrencyId.SoftCurrency, amount: 0 })
      : getReward,
  };
}
