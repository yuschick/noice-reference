import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { HighScoringCardProps } from '../HighScoringCard';

import { useHighScoringCardsSystem } from '@game-logic/systems/hooks';

export function useHighScoringCard(): Nullable<HighScoringCardProps> {
  const hscSystem = useHighScoringCardsSystem();
  const [currentCard, setCurrentCard] = useState<Nullable<HighScoringCardProps>>(null);

  useEffect(() => {
    hscSystem?.addListener('onHighScoringCard', setCurrentCard);
    return () => {
      hscSystem?.removeListener('onHighScoringCard', setCurrentCard);
    };
  }, [hscSystem]);

  return currentCard;
}
