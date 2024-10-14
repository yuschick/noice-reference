import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';

import { ActiveBoosterFragment, useReplacementBoosterDataQuery } from '@game-gen';
import { usePlayerBoosterApply } from '@game-logic/boosters/hooks';

gql`
  query ReplacementBoosterData($id: Int!) {
    booster(id: $id) {
      id
      ...ActiveBooster
    }
  }
`;

export function useReplacementBoosterData(): Nullable<ActiveBoosterFragment> {
  const { applyModeActive, availableBooster } = usePlayerBoosterApply();

  const boosterId =
    availableBooster && availableBooster.boosterId > 0
      ? availableBooster.boosterId
      : null;

  const queryOptions = variablesOrSkip({ id: boosterId });
  const { data } = useReplacementBoosterDataQuery({
    ...queryOptions,
    skip: queryOptions.skip || !applyModeActive,
  });

  return data?.booster ?? null;
}
