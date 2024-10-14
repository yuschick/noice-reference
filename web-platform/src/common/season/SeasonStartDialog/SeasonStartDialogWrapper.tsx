import { useSeasonStartDialogCards } from '../hooks/useSeasonStartDialogCards.hook';
import { SeasonCardRewardsDialog } from '../SeasonCardRewardsDialog';

import { SeasonStartDialog } from './SeasonStartDialog';

export function SeasonStartDialogWrapper() {
  const { cards, isStarterCards, onDialogClosed } = useSeasonStartDialogCards();

  if (!cards.length) {
    return null;
  }

  if (isStarterCards) {
    return (
      <SeasonStartDialog
        cards={cards}
        onClose={onDialogClosed}
      />
    );
  }

  return (
    <SeasonCardRewardsDialog
      cards={cards}
      onClose={onDialogClosed}
    />
  );
}
