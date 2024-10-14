import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { StreamStateRoundPhase } from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';

import { useSwitchOutCardDetailsQuery } from '@game-gen';
import { useCardPoints, usePlayerActiveCard } from '@game-logic/card/hooks';
import { useLocalPlayerId, useRoundPhase } from '@game-logic/game/hooks';
import { usePlayerCardSwitchout } from '@game-logic/player/hooks';
import { GameTimer } from '@game-logic/timer';

gql`
  query SwitchOutCardDetails($activeCardId: String!) {
    gameCards(cardIds: [$activeCardId]) {
      cards {
        id
        isAllOrNothing
      }
    }
  }
`;

interface HookResult {
  repeatPulse: boolean;

  timer: Nullable<GameTimer>;
  isReady: boolean;
  isLocked: boolean;
}

export function useSwitchOut(): HookResult {
  const userId = useLocalPlayerId();
  const activeCard = usePlayerActiveCard(userId);
  const { isReady, timer } = usePlayerCardSwitchout(userId);
  const { isMaxedOut } = useCardPoints(userId);
  const roundState = useRoundPhase();

  const cardId = activeCard?.cardId;
  const { data, loading } = useSwitchOutCardDetailsQuery({
    ...variablesOrSkip({ activeCardId: cardId }),
  });

  const isLocked =
    roundState !== StreamStateRoundPhase.ROUND_PHASE_UNSPECIFIED &&
    roundState !== StreamStateRoundPhase.ROUND_PHASE_PREPARATION;

  // repeat pulse when can switch, card is maxed out (nextPointsTimer is null) and it's not AON card
  const repeatPulse =
    !!cardId &&
    !loading &&
    isReady &&
    isMaxedOut &&
    !data?.gameCards?.cards[0].isAllOrNothing;

  return { repeatPulse, isReady: isReady && !isLocked, isLocked, timer };
}
