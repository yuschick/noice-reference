import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';

import { GameCardSoundDataFragment, useActiveCardSoundsQuery } from '@game-gen';

gql`
  query ActiveCardSounds($id: String!) {
    gameCards(cardIds: [$id]) {
      cards {
        ...GameCardSoundData
      }
    }
  }
  fragment GameCardSoundData on GameLogicCard {
    id
    pointsMax
    targetValue
    isAllOrNothing
    isMatchCard
  }
`;
export function useActiveCardSoundData(
  cardId: Nullable<string>,
): Nullable<GameCardSoundDataFragment> {
  const { data } = useActiveCardSoundsQuery({
    ...variablesOrSkip({ id: cardId }),
  });

  return data?.gameCards?.cards?.[0] ?? null;
}
