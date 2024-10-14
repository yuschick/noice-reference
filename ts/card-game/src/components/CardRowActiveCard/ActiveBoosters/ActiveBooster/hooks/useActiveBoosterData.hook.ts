import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import type { Nullable } from '@noice-com/utils';

import {
  ActiveBoosterFragment,
  ActiveBoosterFragmentDoc,
  ActiveBoosterProfileFragment,
  ActiveBoosterProfileFragmentDoc,
  useActiveBoostersDataQuery,
  useActiveBoostersProfileDataQuery,
} from '@game-gen';
import { useActiveBooster } from '@game-logic/card/hooks';
import { GameTimer } from '@game-logic/timer';

gql`
  query ActiveBoostersData($boosterId: Int!) {
    booster(id: $boosterId) {
      id
      ...ActiveBooster
    }
  }
  ${ActiveBoosterFragmentDoc}
`;

gql`
  query ActiveBoostersProfileData($userId: ID!) {
    profile(userId: $userId) {
      ...ActiveBoosterProfile
    }
  }
  ${ActiveBoosterProfileFragmentDoc}
`;

interface HookResult {
  loading: boolean;
  cardOwner: Nullable<ActiveBoosterProfileFragment>;
  boosterOwner: Nullable<ActiveBoosterProfileFragment>;
  boosterData: Nullable<ActiveBoosterFragment>;
  boosterTimer: Nullable<GameTimer>;
}

export function useActiveBoosterData(
  cardOwnerId: string,
  boosterOwnerId: string,
): HookResult {
  const booster = useActiveBooster(cardOwnerId, boosterOwnerId);
  const boosterId = booster && booster.boosterId > 0 ? booster.boosterId : null;

  const { data, loading } = useActiveBoostersDataQuery({
    ...variablesOrSkip({ boosterId }),
  });

  const { data: cardOwnerData, loading: profile1Loading } =
    useActiveBoostersProfileDataQuery({
      variables: {
        userId: cardOwnerId,
      },
    });

  const { data: boosterOwnerData, loading: profile2Loading } =
    useActiveBoostersProfileDataQuery({
      variables: {
        userId: boosterOwnerId,
      },
    });

  return {
    loading: loading || profile1Loading || profile2Loading,
    cardOwner: cardOwnerData?.profile ?? null,
    boosterOwner: boosterOwnerData?.profile ?? null,
    boosterData: data?.booster ?? null,
    boosterTimer: booster?.activeTimer ?? null,
  };
}
