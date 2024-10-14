import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { HighScoringCardProps } from './HighScoringCard';
import { HighScoringCards } from './HighScoringCards';
import { useHighScoringCard } from './hooks';

export function HighScoringCardsWrapper() {
  const currentCard = useHighScoringCard();

  const [displayedCard, setDisplayedCard] =
    useState<Nullable<HighScoringCardProps>>(null);

  useEffect(() => {
    setDisplayedCard(currentCard);
  }, [currentCard]);

  const onCardsCompleted = () => {
    setDisplayedCard(null);
  };

  return (
    <HighScoringCards
      currentCard={displayedCard}
      onCompleted={onCardsCompleted}
    />
  );
}
