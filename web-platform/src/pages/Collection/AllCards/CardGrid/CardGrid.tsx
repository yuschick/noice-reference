import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { useEffect, useRef } from 'react';

import styles from './CardGrid.module.css';
import { GridItem } from './GridItem/GridItem';
import { LockedCard } from './LockedCard/LockedCard';
import { UncollectedCard } from './UncollectedCard/UncollectedCard';
import { UnlockedCard } from './UnlockedCard/UnlockedCard';

import { CardGridGameCardFragment } from '@gen';

gql`
  fragment CardGridGameCard on GameLogicCard {
    id
    seasonId
    ...UnlockedCardGameCard
    ...UncollectedCardGameCard
    ...LockedCardGameCard
  }
`;

interface Props {
  unlockedCards: CardGridGameCardFragment[];
  uncollectedCards: CardGridGameCardFragment[];
  lockedCards: { card: CardGridGameCardFragment; requiredLevel: number }[];
  onSelectCard(cardId: string, channelId: Nullable<string>): void;
}

export function CardGrid({
  unlockedCards,
  uncollectedCards,
  lockedCards,
  onSelectCard,
}: Props) {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gridRef.current) {
      return;
    }

    // Handles adding the first-of-row and last-of-row classes to the grid items,
    // which is used in styling in CardStack.module.css
    const resizeHandler = () => {
      if (!gridRef.current) {
        return;
      }
      const items = gridRef.current.querySelectorAll<HTMLElement>(':scope > *');
      items.forEach((item, itemIndex) => {
        const previousItem = items[itemIndex - 1];
        const nextItem = items[itemIndex + 1];
        item.classList.toggle(
          'card-grid-first-of-row',
          !previousItem || item.offsetTop !== previousItem.offsetTop,
        );
        item.classList.toggle(
          'card-grid-last-of-row',
          !nextItem || item.offsetTop !== nextItem.offsetTop,
        );
      });
    };

    const observer = new ResizeObserver(resizeHandler);
    observer.observe(gridRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSelectCard = (cardId: string, channelId: Nullable<string>) => {
    onSelectCard(cardId.split('|')[0], channelId);
  };

  return (
    <div
      className={styles.grid}
      ref={gridRef}
    >
      {unlockedCards?.map((card) => {
        return (
          <GridItem
            hasActiveStreamerCards={!!card.activeStreamerCards.length}
            key={`card_${card.id}`}
          >
            <UnlockedCard
              card={card}
              onClick={handleSelectCard}
            />
          </GridItem>
        );
      })}
      {uncollectedCards?.map((card) => {
        return (
          <GridItem
            hasActiveStreamerCards={!!card.activeStreamerCards.length}
            key={`card_${card.id}`}
          >
            <UncollectedCard
              card={card}
              onClick={handleSelectCard}
            />
          </GridItem>
        );
      })}
      {lockedCards?.map((lockedCard) => {
        return (
          <GridItem
            hasActiveStreamerCards={!!lockedCard.card.activeStreamerCards.length}
            key={`card_${lockedCard.card.id}`}
          >
            <LockedCard
              card={lockedCard.card}
              requiredLevel={lockedCard.requiredLevel}
              onClick={handleSelectCard}
            />
          </GridItem>
        );
      })}
    </div>
  );
}
